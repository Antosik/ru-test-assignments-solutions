function SearchList(containerElement, itemClickCallback = null) {
  let container = containerElement;

  this.update = (input = "", events = []) => {
    container.innerHTML = "";
    if (events instanceof DateEventsStorage) events = events.getEventsArray();

    const formatter = new Intl.DateTimeFormat("ru", {
      day: "numeric",
      weekday: "long",
      year: "numeric",
      month: "long"
    });

    const inputStr = input.trim().toLowerCase();
    const eventsFound =
      inputStr === ""
        ? events
        : events.filter(
            event =>
              event.title.toLowerCase().indexOf(inputStr) !== -1 ||
              event.description.toLowerCase().indexOf(inputStr) !== -1 ||
              event.participants.filter(man => man.toLowerCase().indexOf(inputStr) !== -1)
                .length > 0 ||
              formatter.format(event.date).toLowerCase().indexOf(inputStr) !== -1
          );

    eventsFound.forEach(event => {
      const listItem = document.createElement("li");
      listItem.setAttribute("class", "search__item");
      listItem.innerText = event.title;
      if (itemClickCallback)
        listItem.onmousedown = itemClickCallback.bind(null, event);

      container.appendChild(listItem);
    });
  };
}