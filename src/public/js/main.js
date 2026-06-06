document.addEventListener('DOMContentLoaded', function () {
  var deleteForms = document.querySelectorAll('form[data-confirm]');
  deleteForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!confirm(form.dataset.confirm)) {
        e.preventDefault();
      }
    });
  });

  var startTimeInput = document.getElementById('start_time');
  var endTimeInput = document.getElementById('end_time');
  if (startTimeInput && endTimeInput) {
    startTimeInput.addEventListener('change', function () {
      if (startTimeInput.value && !endTimeInput.value) {
        var start = new Date(startTimeInput.value);
        start.setHours(start.getHours() + 2);
        var iso = start.toISOString().slice(0, 16);
        endTimeInput.value = iso;
      }
    });
  }
});
