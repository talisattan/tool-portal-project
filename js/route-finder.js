(function () {
  var MIN_STOPS = 2;
  var MAX_STOPS = 8;
  var SHOWN_ROUTES = 5;

  var names = ['Warehouse', 'Store A', 'Store B', 'Store C'];
  var distances = {}; // keyed by "i-j" with i < j; values are the raw input text

  var stopsEl = document.getElementById('stops');
  var startEl = document.getElementById('start');
  var matrixEl = document.getElementById('matrix');
  var errorEl = document.getElementById('error');
  var outputEl = document.getElementById('output');
  var addBtn = document.getElementById('add-stop');

  function key(i, j) { return Math.min(i, j) + '-' + Math.max(i, j); }

  function renderStops() {
    stopsEl.innerHTML = '';
    names.forEach(function (name, i) {
      var row = document.createElement('div');
      row.className = 'stop-row';

      var input = document.createElement('input');
      input.type = 'text';
      input.value = name;
      input.setAttribute('aria-label', 'Stop ' + (i + 1) + ' name');
      input.addEventListener('input', function () {
        names[i] = input.value;
        renderStartOptions();
        renderMatrix();
      });

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'secondary';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove stop ' + (i + 1));
      remove.disabled = names.length <= MIN_STOPS;
      remove.addEventListener('click', function () { removeStop(i); });

      row.appendChild(input);
      row.appendChild(remove);
      stopsEl.appendChild(row);
    });
    addBtn.disabled = names.length >= MAX_STOPS;
  }

  function renderStartOptions() {
    var chosen = startEl.value;
    startEl.innerHTML = '';
    names.forEach(function (name, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = name.trim() || 'Stop ' + (i + 1);
      startEl.appendChild(opt);
    });
    if (chosen !== '' && Number(chosen) < names.length) startEl.value = chosen;
  }

  function label(i) { return names[i].trim() || 'Stop ' + (i + 1); }

  function renderMatrix() {
    var table = document.createElement('table');
    var head = document.createElement('tr');
    head.appendChild(document.createElement('th'));
    names.forEach(function (n, i) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label(i);
      head.appendChild(th);
    });
    table.appendChild(head);

    names.forEach(function (n, i) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = label(i);
      tr.appendChild(th);

      names.forEach(function (m, j) {
        var td = document.createElement('td');
        if (j <= i) {
          td.className = 'na';
          td.textContent = i === j ? '0' : '';
        } else {
          var input = document.createElement('input');
          input.type = 'number';
          input.min = '0';
          input.step = 'any';
          input.inputMode = 'decimal';
          input.value = distances[key(i, j)] || '';
          input.setAttribute('aria-label', 'Distance from ' + label(i) + ' to ' + label(j));
          input.addEventListener('input', function () { distances[key(i, j)] = input.value; });
          td.appendChild(input);
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    matrixEl.innerHTML = '';
    matrixEl.appendChild(table);
  }

  function shiftDistancesAfterRemoving(index) {
    var next = {};
    Object.keys(distances).forEach(function (k) {
      var parts = k.split('-').map(Number);
      if (parts[0] === index || parts[1] === index) return;
      var a = parts[0] > index ? parts[0] - 1 : parts[0];
      var b = parts[1] > index ? parts[1] - 1 : parts[1];
      next[a + '-' + b] = distances[k];
    });
    distances = next;
  }

  function removeStop(i) {
    if (names.length <= MIN_STOPS) return;
    names.splice(i, 1);
    shiftDistancesAfterRemoving(i);
    startEl.value = '0';
    renderAll();
  }

  function renderAll() {
    renderStops();
    renderStartOptions();
    renderMatrix();
    outputEl.innerHTML = '';
    errorEl.textContent = '';
  }

  // Returns every ordering of the items in the list.
  function permutations(items) {
    if (items.length <= 1) return [items.slice()];
    var result = [];
    items.forEach(function (item, i) {
      var rest = items.slice(0, i).concat(items.slice(i + 1));
      permutations(rest).forEach(function (p) { result.push([item].concat(p)); });
    });
    return result;
  }

  function validate() {
    var seen = {};
    for (var i = 0; i < names.length; i++) {
      var n = names[i].trim().toLowerCase();
      if (!n) return 'Every stop needs a name. Stop ' + (i + 1) + ' is empty.';
      if (seen[n]) return 'Each stop needs a different name. "' + names[i].trim() + '" is used twice.';
      seen[n] = true;
    }
    for (var a = 0; a < names.length; a++) {
      for (var b = a + 1; b < names.length; b++) {
        var raw = distances[key(a, b)];
        var value = Number(raw);
        if (raw === undefined || raw === '' || !isFinite(value)) {
          return 'Enter a distance from ' + label(a) + ' to ' + label(b) + '.';
        }
        if (value <= 0) {
          return 'The distance from ' + label(a) + ' to ' + label(b) + ' must be more than 0.';
        }
      }
    }
    return '';
  }

  function tripLength(order) {
    var total = 0;
    for (var i = 0; i < order.length - 1; i++) total += Number(distances[key(order[i], order[i + 1])]);
    return total;
  }

  function format(n) { return String(Math.round(n * 100) / 100); }

  function calculate() {
    var problem = validate();
    errorEl.textContent = problem;
    outputEl.innerHTML = '';
    if (problem) return;

    var start = Number(startEl.value) || 0;
    var others = [];
    names.forEach(function (n, i) { if (i !== start) others.push(i); });

    var trips = [];
    var seenTrips = {};
    permutations(others).forEach(function (p) {
      // A trip and its reverse are the same loop, so only keep one of them.
      var forward = p.join(',');
      var backward = p.slice().reverse().join(',');
      if (seenTrips[backward]) return;
      seenTrips[forward] = true;
      var order = [start].concat(p, [start]);
      trips.push({ order: order, length: tripLength(order) });
    });
    trips.sort(function (x, y) { return x.length - y.length; });

    var best = trips[0];
    var html = '<div class="result"><h2>Shortest round trip</h2>' +
      '<p class="route">' + best.order.map(function (i) { return escapeHtml(label(i)); }).join(' &rarr; ') + '</p>' +
      '<p>Total distance: <strong>' + format(best.length) + '</strong></p>' +
      '<p class="muted">The tool compared ' + trips.length + ' different route' + (trips.length === 1 ? '' : 's') + '.</p></div>';

    if (trips.length > 1) {
      html += '<section class="panel"><h2>Other routes tried</h2><div class="table-scroll"><table>' +
        '<tr><th scope="col">Route</th><th scope="col">Total distance</th></tr>';
      trips.slice(0, SHOWN_ROUTES).forEach(function (t, idx) {
        html += '<tr><td>' + t.order.map(function (i) { return escapeHtml(label(i)); }).join(' &rarr; ') +
          (idx === 0 ? ' (shortest)' : '') + '</td><td>' + format(t.length) + '</td></tr>';
      });
      html += '</table></div></section>';
    }
    outputEl.innerHTML = html;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  addBtn.addEventListener('click', function () {
    if (names.length >= MAX_STOPS) return;
    names.push('Stop ' + (names.length + 1));
    renderAll();
  });
  document.getElementById('calculate').addEventListener('click', calculate);

  renderAll();
})();
