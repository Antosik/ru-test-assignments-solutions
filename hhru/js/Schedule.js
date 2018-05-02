class Schedule {
  constructor(container) {
    this.container = container;

    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();

    if (!window.localStorage.getItem("events")) this.events = new Map();
    else this.events = this.loadFromLS();

    this.updateTable();
  }

  // Next, Today & Prev month switcher
  updateTarget({ today = false, next = false, prev = false }) {
    if (today) {
      const date = new Date();
      this.month = date.getMonth();
      this.year = date.getFullYear();
    } else if (next) {
      if (this.month === 11) {
        this.month = 0;
        this.year = this.year + 1;
      } else {
        this.month = this.month + 1;
      }
    } else if (prev) {
      if (this.month === 0) {
        this.month = 11;
        this.year = this.year - 1;
      } else {
        this.month = this.month - 1;
      }
    }

    this.updateTable();
  }

  /* RENDER BLOCK */
  // Calculates, which dates we need to display
  getDatesToRender() {
    const monthStart = new Date(this.year, this.month, 0);
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

  // Render table
  updateTable() {
    this.container.innerHTML = "";
    const dates = this.getDatesToRender();
    const eventsOnSchedule = this.getEventsOnSchedule();

    const today = new Date();
    const todayCheck =
      today.getFullYear() === this.year && today.getMonth() === this.month;

    const tr = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const events = eventsOnSchedule.filter(
        event => dates[j].toDateString() === event.date.toDateString()
      );
      const cell = this.createCell(dates[j], {
        head: true,
        todayCheck,
        events
      });
      tr.appendChild(cell);
    }
    this.container.appendChild(tr);

    for (let i = 1; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const events = eventsOnSchedule.filter(
          event => dates[i * 7 + j].toDateString() === event.date.toDateString()
        );
        const cell = this.createCell(dates[i * 7 + j], { todayCheck, events });
        tr.appendChild(cell);
      }

      this.container.appendChild(tr);
    }
  }

  // Generates cell of table
  createCell(date, { head = false, todayCheck = false, events = [] }) {
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

      const list = document.createElement("ul");
      list.setAttribute("class", "cell__events");

      events.forEach(event => {
        const item = document.createElement("li");
        item.setAttribute("class", "cell__event");

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

      td.appendChild(list);
    }

    return td;
  }
  /* RENDER BLOCK */

  /* EVENTS BLOCK */
  // Parse event string
  addEventFromString(string) {
    const [dateStr, title, ...participants] = string.split(", ");
    const date = this.parseDate(dateStr);

    if (isNaN(date.getTime()) || !title) {
      alert(
        'Неверный ввод! Введите данные в формате "День.Месяц.Год, Название, Участники..."'
      );
      return;
    }

    this.addEvent(title, date, { participants });
  }

  // Parse date
  parseDate(dateStr) {
    const [dayStr, monthStr, yearStr] = dateStr.split(".");

    // TODO: better date parser
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr) || new Date().getFullYear().toString();

    return new Date(year, month - 1, day);
  }

  // Adds event to events list
  addEvent(title, date, { participants = [], description = "" }) {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!this.events.get(year)) this.events.set(year, new Map());
    if (!this.events.get(year).get(month)) this.events.get(year).set(month, []);

    this.events
      .get(year)
      .get(month)
      .push(new DateEvent(title, date, { participants, description }));

    if (year === this.year && month === this.month) this.updateTable();
  }

  // Returns Events on month
  getEventsOnMonth(year, month) {
    return (this.events.get(year) && this.events.get(year).get(month)) || [];
  }

  // Returns events on current, prev & next months (cause we need to display them)
  getEventsOnSchedule() {
    const thisMonth = this.getEventsOnMonth(this.year, this.month);

    if (this.month === 11) {
      const prevMonth = this.getEventsOnMonth(this.year, 10);
      const nextMonth = this.getEventsOnMonth(this.year + 1, 0);

      return [...prevMonth, ...thisMonth, ...nextMonth];
    } else if (this.month === 0) {
      const prevMonth = this.getEventsOnMonth(this.year - 1, 11);
      const nextMonth = this.getEventsOnMonth(this.year, 1);

      return [...prevMonth, ...thisMonth, ...nextMonth];
    } else {
      const prevMonth = this.getEventsOnMonth(this.year, this.month - 1);
      const nextMonth = this.getEventsOnMonth(this.year, this.month + 1);

      return [...prevMonth, ...thisMonth, ...nextMonth];
    }
  }

  // Loads events list from localStorage
  loadFromLS() {
    const eventsCollection = JSON.parse(window.localStorage.getItem("events"));
    const events = new Map();

    for (const event of eventsCollection) {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!events.get(year)) events.set(year, new Map());
      if (!events.get(year).get(month)) events.get(year).set(month, []);

      events
        .get(year)
        .get(month)
        .push(
          new DateEvent(event.title, date, {
            participants: event.participants,
            description: event.description
          })
        );
    }

    return events;
  }

  // Saves events list to localStorage
  saveToLS() {
    let eventsCollection = [];

    for (const months of this.events.values()) {
      for (const events of months.values()) {
        eventsCollection = eventsCollection.concat(events);
      }
    }

    window.localStorage.setItem("events", `[${eventsCollection}]`);
  }
  /* EVENTS BLOCK */
}
