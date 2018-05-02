class Schedule {
  constructor(container) {
    this.container = container;

    this.month = new Date().getMonth();
    this.year = new Date().getFullYear();

    this.createTable();
  }

  getDatesToRender() {
    const monthStart = new Date(this.year, this.month, 0);
    const daysInMonthCount = monthStart.getDate();
    const firstMonthDay = monthStart.getDay();

    const days = [];
    for (let i = 0; i < firstMonthDay; i++) {
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

  createTable() {
    this.container.innerHTML = "";
    const dates = this.getDatesToRender();

    const tr = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = this.createHeadCell(dates[j]);
      tr.appendChild(cell);
    }
    this.container.appendChild(tr);

    for (let i = 1; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = this.createCell(dates[i * 7 + j]);
        tr.appendChild(cell);
      }

      this.container.appendChild(tr);
    }
  }

  createCell(date) {
    const formatter = new Intl.DateTimeFormat("ru", { day: "numeric" });

    const td = document.createElement("td");
    td.dataset.date = date.toISOString();
    td.classList.add("schedule__cell");
    td.innerText = formatter.format(date);

    return td;
  }

  createHeadCell(date) {
    const formatter = new Intl.DateTimeFormat("ru", { weekday: "long", day: "numeric" });

    const td = document.createElement("td");
    td.dataset.date = date.toISOString();
    td.classList.add("schedule__cell");
    td.classList.add("schedule__cell--head");
    td.innerText = formatter.format(date);

    return td;
  }
}