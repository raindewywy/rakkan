(function () {
  var form = document.getElementById('predict-form');
  var calendar = document.getElementById('calendar');
  if (!form) {
    return;
  }
  var day = form.elements.day;
  var month = form.elements.month;
  var year = form.elements.year;

  // Picking a date in the calendar fills the three text fields.
  if (calendar) {
    calendar.addEventListener('change', function () {
      var parts = calendar.value.split('-');
      if (parts.length === 3) {
        year.value = parts[0];
        month.value = String(Number(parts[1]));
        day.value = String(Number(parts[2]));
      }
    });
  }

  // Show the "stars are aligning" overlay for a moment before the form is sent.
  form.addEventListener('submit', function (event) {
    var delay = Number(form.dataset.processingMs || 0);
    var overlay = document.getElementById('processing');
    if (delay > 0 && overlay && !form.dataset.sent) {
      event.preventDefault();
      overlay.hidden = false;
      form.dataset.sent = '1';
      setTimeout(function () {
        form.submit();
      }, delay);
    }
  });
})();
