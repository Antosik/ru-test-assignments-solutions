class SearchList {
  constructor(container, events = []) {
    this.container = container;
    this.events = events;

    this.updateList();
  }

  updateList(input = "") {
    this.container.innerHTML = "";

    const formatter = new Intl.DateTimeFormat("ru", {
      day: "numeric",
      weekday: "long",
      year: "numeric",
      month: "long"
    });

    const inputStr = input.trim();
    const eventsFound =
      inputStr === ""
        ? this.events
        : this.events.filter(
            event =>
              event.title.indexOf(inputStr) !== -1 ||
              event.description.indexOf(inputStr) !== -1 ||
              event.participants.filter(man => man.indexOf(inputStr) !== -1)
                .length > 0 ||
              formatter.format(event.date).indexOf(inputStr) !== -1
          );

    for (let event of eventsFound) {
      const listItem = document.createElement("li");
      listItem.setAttribute("class", "search__item");
      listItem.innerText = event.title;
      this.container.appendChild(listItem);
    }
  }
}
