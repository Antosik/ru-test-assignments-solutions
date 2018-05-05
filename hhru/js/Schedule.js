function Schedule(containerElement) {
  let container = containerElement;

  const today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();

  // Returns array of dates, which will be shown in schedule
  function getDatesToShow() {
    const monthStart = new Date(year, month, 0);
    const firstMonthDay = monthStart.getDay();

    const days = [];
    for (let i = firstMonthDay - 1; i >= 0; i--) {
      const pastDay = new Date(monthStart.getTime());
      pastDay.setDate(pastDay.getDate() - i);
      days.push(pastDay);
    }

    for (let i = 1, len = 43 - firstMonthDay; i < len; i++) {
      const monthDay = new Date(monthStart.getTime());
      monthDay.setDate(monthDay.getDate() + i);
      days.push(monthDay);
    }

    return days;
  }

  // Return cell element
  function createCell(date, { head = false, todayCheck = false, events = [] }) {
    const formatterSettings = head
      ? { day: "numeric", weekday: "long" }
      : { day: "numeric" };
    const formatter = new Intl.DateTimeFormat("ru", formatterSettings);

    const td = document.createElement("td");
    td.dataset.date = date.toISOString();
    td.classList.add("schedule__cell");

    const daySpan = document.createElement("span");
    daySpan.setAttribute("class", "schedule__cell__day");
    daySpan.innerText = formatter.format(date);
    td.appendChild(daySpan);

    const addNew = document.createElement("button");
    addNew.setAttribute("class", "schedule__cell__add");
    addNew.setAttribute("type", "button");
    addNew.innerText = "+";
    if (Schedule.plusClickCallback)
      addNew.addEventListener("click", plusClickCallback.bind(null, date));
    td.appendChild(addNew);

    if (head) {
      td.classList.add("schedule__cell--head");
    }

    if (todayCheck) {
      const today = new Date();
      if (today.toDateString() === date.toDateString())
        td.classList.add("schedule__cell--today");
    }

    if (events.length) {
      td.classList.add("schedule__cell--with-events");
      const list = createCellEventsList(events);
      td.appendChild(list);
    }

    return td;
  }

  function createCellEventsList(events) {
    const list = document.createElement("ul");
    list.setAttribute("class", "cell__events");

    events.forEach(event => {
      const item = document.createElement("li");
      item.setAttribute("class", "cell__event");
      if (Schedule.eventClickCallback)
        item.addEventListener("click", function () {
          const ctx = this;
          Schedule.eventClickCallback(event, ctx);
        });

      const itemTitle = document.createElement("div");
      itemTitle.setAttribute("class", "cell__event__title");
      itemTitle.innerText = event.title;

      const itemParticipants = document.createElement("div");
      itemParticipants.setAttribute("class", "cell__event__participants");
      itemParticipants.innerText = event.participantsToString();

      item.appendChild(itemTitle);
      item.appendChild(itemParticipants);

      list.appendChild(item);
    });
    return list;
  }

  // Getter for month
  this.getMonth = () => month;
  // Getter for year
  this.getYear = () => year;
  // Updates schedule container
  this.update = (events = new Map()) => {
    if (events instanceof DateEventsStorage) events = events.getEventsMap();

    container.innerHTML = "";
    const dates = getDatesToShow();
    const today = new Date();
    const todayCheck =
      today.getFullYear() === year && today.getMonth() === month;

    const tr = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const year = dates[j].getFullYear();
      const month = dates[j].getMonth();
      const day = dates[j].getDate();
      let eventsOnDay =
        (events.has(year) &&
          events.get(year).has(month) &&
          events
            .get(year)
            .get(month)
            .has(day) &&
          events
            .get(year)
            .get(month)
            .get(day)) ||
        [];

      const cell = createCell(dates[j], {
        head: true,
        todayCheck,
        events: eventsOnDay
      });
      tr.appendChild(cell);
    }
    container.appendChild(tr);

    for (let i = 1; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const year = dates[i * 7 + j].getFullYear();
        const month = dates[i * 7 + j].getMonth();
        const day = dates[i * 7 + j].getDate();
        let eventsOnDay =
          (events.has(year) &&
            events.get(year).has(month) &&
            events
              .get(year)
              .get(month)
              .has(day) &&
            events
              .get(year)
              .get(month)
              .get(day)) ||
          [];

        const cell = createCell(dates[i * 7 + j], {
          todayCheck,
          events: eventsOnDay
        });
        tr.appendChild(cell);
      }

      container.appendChild(tr);
    }
  };
  // Switch date
  this.setDate = (events, { today, next, prev, date }) => {
    if (next) {
      if (month === 11) {
        month = 0;
        year = year + 1;
      } else {
        month = month + 1;
      }
    } else if (prev) {
      if (month === 0) {
        month = 11;
        year = year - 1;
      } else {
        month = month - 1;
      }
    } else if (date && !isNaN(date.getTime())) {
      month = date.getMonth();
      year = date.getFullYear();
    } else {
      const date = new Date();
      month = date.getMonth();
      year = date.getFullYear();
    }

    this.update(events);
  };
  // Updates title with month & year
  this.getMonthYearTitle = () => {
    const date = new Date(year, month, 1);
    const formatter = new Intl.DateTimeFormat("ru", {
      month: "long",
      year: "numeric"
    });
    const dateString = formatter.format(date);

    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };
}
Schedule.plusClickCallback = null;
Schedule.eventClickCallback = null;
