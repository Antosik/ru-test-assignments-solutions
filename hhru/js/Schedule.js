class Schedule {
  constructor(container) {
    this.container = container;

    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();

    this.updateTable();
  }

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

  updateTable() {
    this.container.innerHTML = "";
    const dates = this.getDatesToRender();

    const today = new Date();
    const todayCheck =
      today.getFullYear() === this.year && today.getMonth() === this.month;

    const tr = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = this.createCell(dates[j], { head: true, todayCheck });
      tr.appendChild(cell);
    }
    this.container.appendChild(tr);

    for (let i = 1; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = this.createCell(dates[i * 7 + j], { todayCheck });
        tr.appendChild(cell);
      }

      this.container.appendChild(tr);
    }
  }

  createCell(date, { head = false, todayCheck = false }) {
    const formatterSettings = head
      ? { day: "numeric", weekday: "long" }
      : { day: "numeric" };
    const formatter = new Intl.DateTimeFormat("ru", formatterSettings);

    const td = document.createElement("td");
    td.dataset.date = date.toISOString();
    td.classList.add("schedule__cell");
    td.innerText = formatter.format(date);

    if (head) {
      td.classList.add("schedule__cell--head");
    }
    if (todayCheck) {
      const today = new Date();
      if (today.toDateString() === date.toDateString())
        td.classList.add("schedule__cell--today");
    }

    return td;
  }
}
