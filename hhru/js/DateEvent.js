class DateEvent {
  constructor(title, date, { participants = [], description = "" }) {
    this.title = title;
    this.date = date;
    this.participants = participants;
    this.description = description;
  }

  edit({ description = "" }) {
    this.description = description;
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      date: this.date.toISOString(),
      participants: this.participants,
      description: this.description
    });
  }

  dateToString() {
    const formatter = new Intl.DateTimeFormat("ru", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return formatter.format(this.date);
  }

  participantsToString() {
    if (!this.participants.length) return "";
    else if (this.participants.length === 1) return this.participants[0];
    else {
      return `${this.participants.slice(0, -1).join(", ")} и ${
        this.participants[this.participants.length - 1]
      }`;
    }
  }
}
