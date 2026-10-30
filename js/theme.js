// Light is the default. The saved choice is applied right away to avoid a flash.
(function () {
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    function show() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      button.textContent = dark ? 'Switch to light theme' : 'Switch to dark theme';
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      show();
    });

    show();
  });
})();
