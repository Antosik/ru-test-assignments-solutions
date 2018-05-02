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
document
  .querySelector(".refresh__button")
  .addEventListener("click", () => alert("Зачем тут эта кнопка? 🤔"));

function updateMonthTitle(month, year) {
  const date = new Date(year, month, 1);
  const formatter = new Intl.DateTimeFormat("ru", {
    month: "long",
    year: "numeric"
  });
  const dateString = formatter.format(date);

  document.querySelector(".monthpicker__month").innerText =
    dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

document.querySelector(".addevent__button").addEventListener("click", e => {
  let pressed = e.target.getAttribute("aria-pressed") === "true";
  e.target.setAttribute("aria-pressed", String(!pressed));

  const dialog = document.querySelector(".addeventfast");
  dialog.classList.toggle("addeventfast--show");
  dialog.setAttribute("aria-hidden", String(pressed));
});

document.querySelector(".close-modal-button").addEventListener("click", e => {
  e.target.parentNode.setAttribute("aria-hidden", "true");
  e.target.parentNode.classList.toggle("addeventfast--show");
});

document.querySelector(".addeventfast__close").addEventListener("click", () => {
  document
    .querySelector(".addevent__button")
    .setAttribute("aria-pressed", "false");
});

document
  .querySelector(".addeventfast__button")
  .addEventListener("click", () => {
    schedule.addEventFromString(
      document.querySelector(".addeventfast__input").value
    );
  });
