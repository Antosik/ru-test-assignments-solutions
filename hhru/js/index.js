const titleElement = document.querySelector(".monthpicker__month");

const eventsStorage = new DateEventsStorage();
if (window.localStorage.getItem("events")) eventsStorage.loadFromLS();

const scheduleContainer = document.querySelector(".schedule");
const schedule = new Schedule(scheduleContainer);
schedule.update(eventsStorage, { plusClickCallback });
titleElement.innerText = schedule.getMonthYearTitle();

const searchContainer = document.querySelector(".search__items");
const searchInput = document.querySelector(".search__input");
const search = new SearchList(searchContainer, event => {
  schedule.setDate(eventsStorage, { date: event.date });
  titleElement.innerText = schedule.getMonthYearTitle();
  searchInput.value = "";
});
search.update(searchInput.value, eventsStorage);

eventsStorage.onChange(events => {
  schedule.update(events, { plusClickCallback });
  search.update(searchInput.value, events);
});

/* NEXT, PREV & CURRENT month buttons */
document.querySelector(".today__button").addEventListener("click", () => {
  schedule.setDate(eventsStorage.getEventsMap(), { today: true });
  titleElement.innerText = schedule.getMonthYearTitle();
});
document.querySelector(".monthpicker__prev").addEventListener("click", () => {
  schedule.setDate(eventsStorage.getEventsMap(), { prev: true });
  titleElement.innerText = schedule.getMonthYearTitle();
});
document.querySelector(".monthpicker__next").addEventListener("click", () => {
  schedule.setDate(eventsStorage.getEventsMap(), { next: true });
  titleElement.innerText = schedule.getMonthYearTitle();
});
/* NEXT, PREV & CURRENT month buttons */

/* HELPERS */
// Save events, when window closed
window.addEventListener("beforeunload", () => {
  eventsStorage.saveToLS();
});
// Save events on button click
document
  .querySelector(".refresh__button")
  .addEventListener("click", () => eventsStorage.saveToLS());
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
    eventsStorage.addEvent(DateEvent.fromString(input.value));

    input.value = "";
  });

// Hides modal
document.querySelectorAll(".close-modal-button").forEach(button =>
  button.addEventListener("click", e => {
    e.target.parentNode.setAttribute("aria-hidden", "true");
    e.target.parentNode.classList.remove("modal--show");
  })
);

const addNewModal = document.querySelector(".addnew");
function plusClickCallback(date, e) {
  const bounds = scheduleContainer.getBoundingClientRect();
  const left = e.clientX - bounds.left;
  const top = e.clientY - bounds.top;
  if (300 + e.screenX > scheduleContainer.offsetWidth) {
    addNewModal.classList.remove("modal--left");
    addNewModal.classList.add("modal--right");
    addNewModal.style.left = `${left - 320}px`;
    addNewModal.style.top = `${top - 5}px`;
  } else {
    addNewModal.classList.remove("modal--right");
    addNewModal.classList.add("modal--left");
    addNewModal.style.left = `${left + 20}px`;
    addNewModal.style.top = `${top - 5}px`;
  }
  addNewModal.classList.add("modal--show");
}
/* MODALS */

/* SEARCH */
searchInput.addEventListener("input", e => {
  search.update(e.target.value, eventsStorage);
});
const showSearchList = () => {
  const modal = document.querySelector(".search__modal");
  modal.classList.add("modal--show");
  modal.setAttribute("aria-hidden", "false");
};
const hideSearchList = () => {
  const modal = document.querySelector(".search__modal");
  modal.classList.remove("modal--show");
  modal.setAttribute("aria-hidden", "true");
};
searchInput.addEventListener("focus", showSearchList);
searchInput.addEventListener("blur", hideSearchList);
/* SEARCH */
