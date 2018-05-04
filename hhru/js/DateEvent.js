function DateEvent(title, date, { participants = [], description = "" }) {
  this.title = title;
  this.date = date;
  this.participants = participants;
  this.description = description;

  this.edit = ({ description = this.description }) => {
    this.description = description;
  };

  this.toString = () => {
    return JSON.stringify({
      title: this.title,
      date: this.date.toISOString(),
      participants: this.participants,
      description: this.description
    });
  };

  this.participantsToString = () => {
    if (!this.participants.length) return "";
    else if (this.participants.length === 1) return this.participants[0];
    else {
      return `${this.participants.slice(0, -1).join(", ")} и ${
        this.participants[this.participants.length - 1]
      }`;
    }
  };
}

// Parse event string
DateEvent.fromString = string => {
  const [dateStr, title, ...participants] = string.split(", ");
  const date = DateEvent.parseDate(dateStr);

  if (isNaN(date.getTime()) || !title) {
    alert(
      'Неверный ввод! Введите данные в формате "День.Месяц.Год, Название, Участники..."'
    );
    return;
  }

  return new DateEvent(title, date, { participants });
};

// Parse date
DateEvent.parseDate = dateStr => {
  const [dayStr, monthStr, yearStr] = dateStr.split(".");

  // TODO: better date parser
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr) || new Date().getFullYear().toString();

  return new Date(year, month - 1, day);
};

function DateEventsStorage(eventsMap = new Map()) {
  let events = eventsMap;
  let changeHandlers = [];
  let onChange = (event, action) =>
    changeHandlers.forEach(callback => callback(this, event, action));

  // Returns all events as Map
  this.getEventsMap = () => events;
  // Returns all events in array
  this.getEventsArray = () => {
    let eventsCollection = [];

    for (const months of events.values()) {
      for (const days of months.values()) {
        for (const events of days.values()) {
          eventsCollection = eventsCollection.concat(events);
        }
      }
    }

    return eventsCollection;
  };

  // Adds event to list
  this.addEvent = event => {
    const year = event.date.getFullYear();
    const month = event.date.getMonth();
    const day = event.date.getDate();

    if (!events.has(year)) events.set(year, new Map());
    if (!events.get(year).has(month)) events.get(year).set(month, new Map());
    if (
      !events
        .get(year)
        .get(month)
        .has(day)
    )
      events
        .get(year)
        .get(month)
        .set(day, []);

    events
      .get(year)
      .get(month)
      .get(day)
      .push(event);

    onChange(event, "add");

    return event;
  };

  // Adds handlers for "change" event
  this.onChange = callback => {
    changeHandlers.push(callback);
    return this;
  };

  // Loads events list from localStorage
  this.loadFromLS = () => {
    const eventsCollection = JSON.parse(window.localStorage.getItem("events"));
    events = new Map();

    for (const event of eventsCollection) {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      if (!events.has(year)) events.set(year, new Map());
      if (!events.get(year).has(month)) events.get(year).set(month, new Map());
      if (
        !events
          .get(year)
          .get(month)
          .has(day)
      )
        events
          .get(year)
          .get(month)
          .set(day, []);

      events
        .get(year)
        .get(month)
        .get(day)
        .push(
          new DateEvent(event.title, date, {
            participants: event.participants,
            description: event.description
          })
        );
    }
  };
  // Saves events list to localStorage
  this.saveToLS = () => {
    let eventsCollection = this.getEventsArray();

    window.localStorage.setItem("events", `[${eventsCollection}]`);
  };
}
