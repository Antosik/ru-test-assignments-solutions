
const titleElement = document.querySelector(".monthpicker__month");

const eventsStorage = new DateEventsStorage();
if (window.localStorage.getItem("events")) eventsStorage.loadFromLS();

const scheduleContainer = document.querySelector(".schedule");
Schedule.plusClickCallback = plusClickCallback;
Schedule.eventClickCallback = showEventInfo;
const schedule = new Schedule(scheduleContainer, eventsStorage);
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
  schedule.update(events);
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
    e.target.closest(".modal").setAttribute("aria-hidden", "true");
    e.target.closest(".modal").classList.remove("modal--show");
  })
);

const addNewModal = document.querySelector(".addnew");
// Handler for "+" button
function plusClickCallback(date, plusButton) {
  const bounds = scheduleContainer.getBoundingClientRect();
  const bounds2 = plusButton.getBoundingClientRect();
  const left = bounds2.left - bounds.left;
  const top = bounds2.top - bounds.top;

  if (300 + bounds2.left > scheduleContainer.offsetWidth) {
    addNewModal.classList.remove("modal--left");
    addNewModal.classList.add("modal--right");
    addNewModal.style.left = `${left - 320}px`;
  } else {
    addNewModal.classList.remove("modal--right");
    addNewModal.classList.add("modal--left");
    addNewModal.style.left = `${left + bounds2.width + 20}px`;
  }
  addNewModal.style.top = `${top + bounds2.height / 2 - 5}px`;
  addNewModal.classList.add("modal--show");

  const pad = number => (number < 10 ? `0${number}` : number);
  document.getElementById("addnew__date").value = `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
}

// Adds event from "add" modal
document.querySelector(".addnew__form").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("addnew__title");
  const date = document.getElementById("addnew__date");
  const participants = document.getElementById("addnew__participants");
  const description = document.getElementById("addnew__description");
  eventsStorage.addEvent(
    new DateEvent(title.value, new Date(date.value), {
      participants: participants.value.split(","),
      description: description.value
    })
  );

  title.value = "";
  date.value = "";
  participants.value = "";
  description.value = "";

  e.target.closest(".modal").setAttribute("aria-hidden", "true");
  e.target.closest(".modal").classList.remove("modal--show");

  return false;
});

const eventInfoModal = document.querySelector(".eventinfo");
// Handler for click on event
function showEventInfo(event, eventItem) {
  const bounds = scheduleContainer.getBoundingClientRect();
  const bounds2 = eventItem.getBoundingClientRect();
  const left = bounds2.left - bounds.left;
  const top = bounds2.top - bounds.top;

  if (300 + bounds2.left > scheduleContainer.offsetWidth) {
    eventInfoModal.classList.remove("modal--left");
    eventInfoModal.classList.add("modal--right");
    eventInfoModal.style.left = `${left - 320}px`;
  } else {
    eventInfoModal.classList.remove("modal--right");
    eventInfoModal.classList.add("modal--left");
    eventInfoModal.style.left = `${left + bounds2.width}px`;
  }

  eventInfoModal.style.top = `${top + bounds2.height / 2 - 5}px`;
  eventInfoModal.classList.add("modal--show");

  const formatter = new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long"
  });
  eventInfoModal.querySelector(".eventinfo__title").innerText = event.title;
  eventInfoModal.querySelector(".eventinfo__date").innerText = formatter.format(event.date);
  eventInfoModal.querySelector(".eventinfo__participants").innerText = event.participantsToString() || "Нет";
  eventInfoModal.querySelector(".eventinfo__textbox").value = event.description;
  eventInfoModal.querySelector(".eventinfo__save").onclick = () => {
    event.edit({ description: eventInfoModal.querySelector(".eventinfo__textbox").value });
  };
  eventInfoModal.querySelector(".eventinfo__delete").onclick = () => {
    eventsStorage.deleteEvent(event);

    eventInfoModal.setAttribute("aria-hidden", "true");
    eventInfoModal.classList.remove("modal--show");
  };
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
