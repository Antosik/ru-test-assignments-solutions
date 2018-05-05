const titleElement = document.querySelector(".monthpicker__month");

// Init Events storage
const eventsStorage = new DateEventsStorage();
if (window.localStorage.getItem("events")) eventsStorage.loadFromLS();

// Init Schedule
const scheduleContainer = document.querySelector(".schedule");
Schedule.plusClickCallback = plusClickCallback;
Schedule.eventClickCallback = showEventInfo;
const schedule = new Schedule(scheduleContainer, eventsStorage);
titleElement.innerText = schedule.getMonthYearTitle();

// Init Search
const searchContainer = document.querySelector(".search__items");
SearchList.itemClickCallback = searchItemClickCallback;
const search = new SearchList(searchContainer, eventsStorage);

/* NEXT, PREV & CURRENT month buttons */
document.querySelector(".today__button").addEventListener("click", () => {
  schedule.setDate({ today: true });
  titleElement.innerText = schedule.getMonthYearTitle();
});
document.querySelector(".monthpicker__prev").addEventListener("click", () => {
  schedule.setDate({ prev: true });
  titleElement.innerText = schedule.getMonthYearTitle();
});
document.querySelector(".monthpicker__next").addEventListener("click", () => {
  schedule.setDate({ next: true });
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

// Close modal onclick outside
document.addEventListener("click", e => {
  const closestModal = e.target.closest(".modal");
  if (!closestModal) {
    hideModal(document.querySelector(".modal--show"));
  }
});
/* HELPERS */

/* MODALS */
function showModal(modalElement) {
  if (document.querySelector(".modal--show"))
    hideModal(document.querySelector(".modal--show"));

  modalElement.classList.add("modal--show");
  modalElement.setAttribute("aria-hidden", "false");
}
function hideModal(modalElement) {
  modalElement.classList.remove("modal--show");
  modalElement.setAttribute("aria-hidden", "true");
}

// Show "fast add" modal
document.querySelector(".addevent__button").addEventListener("click", e => {
  const dialog = document.querySelector(".addeventfast");
  showModal(dialog);
  e.stopPropagation();
});

// Adds event from "fast add" modal
document
  .querySelector(".addeventfast__button")
  .addEventListener("click", () => {
    const input = document.querySelector(".addeventfast__input");
    eventsStorage.addEvent(DateEvent.fromString(input.value));

    input.value = "";
  });

// Close button in modal
document.querySelectorAll(".close-modal-button").forEach(button =>
  button.addEventListener("click", e => {
    hideModal(e.target.closest(".modal"));
  })
);

// Handler for "+" button
const addNewModal = document.querySelector(".addnew");
function plusClickCallback(e, date, plusButton) {
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

  const pad = number => (number < 10 ? `0${number}` : number);
  document.getElementById("addnew__date").value = `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;

  showModal(addNewModal);
  e.stopPropagation();
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

  hideModal(addNewModal);

  return false;
});

const eventInfoModal = document.querySelector(".eventinfo");
// Handler for click on event
function showEventInfo(e, event, eventItem) {
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

  const formatter = new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long"
  });
  eventInfoModal.querySelector(".eventinfo__title").innerText = event.title;
  eventInfoModal.querySelector(".eventinfo__date").innerText = formatter.format(
    event.date
  );
  eventInfoModal.querySelector(".eventinfo__participants").innerText =
    event.participantsToString() || "Нет";
  eventInfoModal.querySelector(".eventinfo__textbox").value = event.description;
  eventInfoModal.querySelector(".eventinfo__save").onclick = () => {
    event.edit({
      description: eventInfoModal.querySelector(".eventinfo__textbox").value
    });
  };
  eventInfoModal.querySelector(".eventinfo__delete").onclick = () => {
    eventsStorage.deleteEvent(event);

    hideModal(eventInfoModal);
  };

  showModal(eventInfoModal);
  e.stopPropagation();
}

/* MODALS */

/* SEARCH */
const searchInput = document.querySelector(".search__input");
function searchItemClickCallback(e, event) {
  schedule.setDate({ date: event.date });
  titleElement.innerText = schedule.getMonthYearTitle();
  searchInput.value = "";
}
searchInput.addEventListener("input", e => {
  search.setInput(e.target.value);
});
searchInput.addEventListener("click", e => {
  const searchModal = document.querySelector(".search__modal");
  showModal(searchModal);
  e.stopPropagation();
});
/* SEARCH */
