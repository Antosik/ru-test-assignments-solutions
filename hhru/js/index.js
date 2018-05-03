const scheduleContainer = document.querySelector(".schedule");
const schedule = new Schedule(scheduleContainer);
updateMonthTitle(schedule.month, schedule.year);

/* NEXT, PREV & CURRENT month buttons */
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
/* NEXT, PREV & CURRENT month buttons */

/* HELPERS */

// Updates title with month & year
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

// Save events, when window closed
window.addEventListener("beforeunload", () => {
  schedule.saveToLS();
});

// Save events on button click
document
  .querySelector(".refresh__button")
  .addEventListener("click", () => schedule.saveToLS());
/* HELPERS */

/* MODALS */
// Toggle "fast add" modal
document.querySelector(".addevent__button").addEventListener("click", e => {
  let pressed = e.target.getAttribute("aria-pressed") === "true";
  e.target.setAttribute("aria-pressed", String(!pressed));

  const dialog = document.querySelector(".addeventfast");
  dialog.classList.toggle("modal--show");
  dialog.setAttribute("aria-hidden", String(pressed));
});

// Hides "fast add" modal
document.querySelector(".addeventfast__close").addEventListener("click", () => {
  document
    .querySelector(".addevent__button")
    .setAttribute("aria-pressed", "false");
});

// Adds event from "fast add" modal
document
  .querySelector(".addeventfast__button")
  .addEventListener("click", () => {
    const input = document.querySelector(".addeventfast__input");
    const event = schedule.addEventFromString(input.value);

    input.value = "";
    search.events.push(event);
  });

// Hides modal
document.querySelector(".close-modal-button").addEventListener("click", e => {
  e.target.parentNode.setAttribute("aria-hidden", "true");
  e.target.parentNode.classList.remove("modal--show");
});
/* MODALS */

/* SEARCH */
const search_input = document.querySelector(".search__input");
const search_container = document.querySelector(".search__items");
const search = new SearchList(search_container, schedule.getEventsArray());
search_input.addEventListener("input", e => {
  search.updateList(e.target.value);
});
const showSearchList = () => {
  document.querySelector(".search__modal").classList.add("modal--show");
  document.querySelector(".search__modal").setAttribute("aria-hidden", "false");
};
const hideSearchList = () => {
  document.querySelector(".search__modal").classList.remove("modal--show");
  document.querySelector(".search__modal").setAttribute("aria-hidden", "true");
};
search_input.addEventListener("focus", showSearchList);
search_input.addEventListener("blur", hideSearchList);
/* SEARCH */
