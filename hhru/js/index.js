const monthpicker = document.querySelector(".main__controls__monthpicker");

const scheduleContainer = document.querySelector(".schedule");
const schedule = new Schedule(scheduleContainer);
updateMonthTitle(schedule.month, schedule.year);

const current = new Date().getMonth();
monthpicker.dataset.current = current;

document.querySelector(".today__button").addEventListener("click", () => {
  schedule.updateTarget({ today: true });
  updateMonthTitle(schedule.month, schedule.year);
});
document.querySelector(".monthpicker__prev").addEventListener("click", () => {
  schedule.updateTarget({ prev: true });
  updateMonthTitle(schedule.month, schedule.year);
});
document.querySelector(".monthpicker__next").addEventListener("click", () => {
  schedule.updateTarget({ next: true });
  updateMonthTitle(schedule.month, schedule.year);
});

function updateMonthTitle(month, year) {
  const date = new Date(year, month, 1);
  const formatter = new Intl.DateTimeFormat("ru", { month: "long", year: "numeric" });
  const dateString = formatter.format(date);

  document.querySelector(".monthpicker__month").innerText = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}