function SearchList(containerElement, eventsSource) {
  let container = containerElement;
  let input = "";


  this.setInput = (value) => {
    input = value;
    this.update(input);
  };
  this.update = () => {
    container.innerHTML = "";
    const events = eventsSource.getEventsArray();

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
              event.participants.filter(
                man => man.toLowerCase().indexOf(inputStr) !== -1
              ).length > 0 ||
              formatter
                .format(event.date)
                .toLowerCase()
                .indexOf(inputStr) !== -1
          );

    const formatterItemDate = new Intl.DateTimeFormat("ru", {
      day: "numeric",
      month: "long"
    });
    const formatterItemDateTimestamp = new Intl.DateTimeFormat("ru");
    eventsFound
      .sort((first, second) => second.date.getTime() - first.date.getTime())
      .forEach(event => {
        const listItem = document.createElement("li");
        listItem.setAttribute("class", "search__item");

        const itemTitle = document.createElement("div");
        itemTitle.setAttribute("class", "search__item__title");
        itemTitle.innerText = event.title;

        const itemDate = document.createElement("time");
        itemDate.setAttribute("class", "search__item__date");
        itemDate.setAttribute(
          "datetime",
          formatterItemDateTimestamp.format(event.date)
        );
        itemDate.innerText = formatterItemDate.format(event.date);

        listItem.appendChild(itemTitle);
        listItem.appendChild(itemDate);
        if (SearchList.itemClickCallback)
          listItem.addEventListener("mousedown", function (e) {
            const element = this;
            SearchList.itemClickCallback(e, event, element);
          });

        container.appendChild(listItem);
      });
  };

  this.setInput(input);
}
SearchList.itemClickCallback = null;
