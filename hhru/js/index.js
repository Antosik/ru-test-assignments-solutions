const monthpicker = document.querySelector(".main__controls__monthpicker");

const scheduleContainer = document.querySelector(".schedule");
const schedule = new Schedule(scheduleContainer);

const current = new Date().getMonth();
monthpicker.dataset.current = current;