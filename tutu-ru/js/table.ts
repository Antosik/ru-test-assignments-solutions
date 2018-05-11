interface IDataItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  description: string;
}

const enum orderDirection {
  asc = "asc",
  desc = "desc",
  none = "none"
}

class DataTable {
  static MAX_ROWS_ON_PAGE = 50;
  private static headings = ["id", "firstName", "lastName", "email", "phone"];

  private data: IDataItem[];
  private filteredData: IDataItem[];
  private page: number;
  private container: Element;
  private sortedBy: Map<string, orderDirection>;
  private filteredBy: Map<string, string>;

  constructor(container: Element, dataSource: string) {
    this.container = container;
    this.page = 0;
    this.sortedBy = new Map(<[string, orderDirection][]>DataTable.headings.map(
      item => [item, orderDirection.none]
    ));
    this.filteredBy = new Map(<[string, string][]>DataTable.headings.map(
      item => [item, ""]
    ));
    this.filteredData = [];

    this.initTable();
    this.renderLoading();

    fetch(dataSource)
      .then(response => response.json())
      .then(response => {
        this.data = response;
        this.unblockAfterLoading();
        this.renderTable();
      });
  }

  private initTable() {
    this.container.innerHTML = "";

    const heading = this.getHeader();
    const tbody = DataTable.createElement("tbody", {
      class: "datatable__body"
    });
    const table = DataTable.createElement("table", { class: "datatable" }, [
      heading,
      tbody
    ]);

    this.container.appendChild(table);
  }

  private unblockAfterLoading() {
    this.container
      .querySelectorAll("input, button")
      .forEach(element => element.removeAttribute("disabled"));
  }

  // Sort data
  private sortData(parameter: string, order: orderDirection) {
    if (DataTable.headings.indexOf(parameter) === -1) return;

    this.renderLoading();

    if (order === orderDirection.asc) {
      this.data = this.data.sort((a, b) => {
        if (a[parameter] < b[parameter]) return 1;
        if (a[parameter] > b[parameter]) return -1;
        return 0;
      });
    } else if (order === orderDirection.desc) {
      this.data = this.data.sort((a, b) => {
        if (a[parameter] < b[parameter]) return -1;
        if (a[parameter] > b[parameter]) return 1;
        return 0;
      });
    }

    this.page = 0;
    this.sortedBy.set(parameter, order);

    this.renderTable();
  }

  // Filter data
  private filterData() {
    let filteredData = this.data.slice(0);

    for (let [parameter, value] of this.filteredBy.entries()) {
      if (!value) continue;
      filteredData = filteredData.filter(
        dataItem =>
          dataItem[parameter]
            .toString()
            .toLowerCase()
            .indexOf(value) >= 0
      );
    }

    this.page = 0;
    this.filteredData = filteredData || [];

    this.renderTable();
  }

  private renderLoading() {
    const body = this.container.querySelector(".datatable__body");

    body.innerHTML = "";

    const loadingDiv = DataTable.createElement("div", { class: "loader" });
    loadingDiv.innerText = "Loading...";

    body.appendChild(loadingDiv);
  }

  public renderTable() {
    const table = this.container.querySelector(".datatable");

    const tbody = this.container.querySelector(".datatable__body");
    tbody.innerHTML = "";

    const data =
      Array.from(this.filteredBy.values()).filter(el => Boolean(el)).length > 0
        ? this.filteredData.slice(
            this.page * DataTable.MAX_ROWS_ON_PAGE,
            (this.page + 1) * DataTable.MAX_ROWS_ON_PAGE
          )
        : this.data.slice(
            this.page * DataTable.MAX_ROWS_ON_PAGE,
            (this.page + 1) * DataTable.MAX_ROWS_ON_PAGE
          );

    for (let dataItem of data) {
      const tr = document.createElement("tr");

      for (let heading of DataTable.headings) {
        const td = document.createElement("td");
        td.innerText = dataItem[heading];
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    if (document.querySelector(".datatable__tfoot"))
      table.removeChild(document.querySelector(".datatable__tfoot"));
    const footer = this.getFooter();
    table.appendChild(footer);

    this.container.appendChild(table);
  }

  private getHeader(): Element {
    const headingRow = this.getHeading();
    const filteringRow = this.getFilters();

    return DataTable.createElement("thead", { class: "datatable__head" }, [
      headingRow,
      filteringRow
    ]);
  }

  private getHeading(): Element {
    const headingsTh: Element[] = DataTable.headings.map(heading => {
      const th = DataTable.createElement("th", { "aria-sort": "none" });
      th.innerText = heading;

      const sortButton = DataTable.createElement("button", {
        class: "datatable__sort-button",
        disabled: "disabled",
        "aria-label": `sort by ${heading} in ascending} order`
      });
      sortButton.innerText = "↕";

      sortButton.addEventListener("click", () => {
        const sortState = this.sortedBy.get(heading) || orderDirection.none;

        this.sortData(
          heading,
          sortState === orderDirection.asc
            ? orderDirection.desc
            : orderDirection.asc
        );

        if (sortState !== orderDirection.asc) {
          sortButton.innerText = "↑";
          sortButton.setAttribute(
            "aria-label",
            `sort by ${heading} in ascending} order`
          );
          th.setAttribute("aria-sort", `ascending`);
        } else {
          sortButton.innerText = "↓";
          sortButton.setAttribute(
            "aria-label",
            `sort by ${heading} in descending} order`
          );
          th.setAttribute("aria-sort", `descending`);
        }
      });

      th.appendChild(sortButton);

      return th;
    });

    return DataTable.createElement("tr", {}, headingsTh);
  }

  private getFilters(): Element {
    const headingInputs: Element[] = DataTable.headings.map(heading => {
      const input = DataTable.createElement("input", {
        class: "datatable__filter-input",
        type: "text",
        disabled: "disabled",
        placeholder: `Filter by ${heading}`,
        value: this.filteredBy.get(heading)
      }) as HTMLInputElement;
      input.addEventListener("input", () => {
        this.filteredBy.set(heading, input.value);
        this.filterData();
        input.focus();
      });

      return DataTable.createElement("td", {}, [input]);
    });

    return DataTable.createElement("tr", {}, headingInputs);
  }

  private getFooter(): Element {
    const pagination = this.getPagination();

    const cell = DataTable.createElement(
      "td",
      { colspan: DataTable.headings.length.toString() },
      [pagination]
    );
    const row = DataTable.createElement("tr", {}, [cell]);

    return DataTable.createElement("tfoot", { class: "datatable__tfoot" }, [
      row
    ]);
  }

  private getPagination(): Element {
    const count =
      Array.from(this.filteredBy.values()).filter(el => Boolean(el)).length > 0
        ? Math.ceil(this.filteredData.length / DataTable.MAX_ROWS_ON_PAGE)
        : Math.ceil(this.data.length / DataTable.MAX_ROWS_ON_PAGE);

    const ul = document.createElement("ul");

    for (let i = 0; i < count; i++) {
      const isCurrentPage = i === this.page;

      const button = DataTable.createElement("button", {
        type: "button",
        "aria-label": isCurrentPage
          ? `Page ${i + 1}, current page`
          : `Go to page ${i + 1}`,
        "aria-current": String(isCurrentPage)
      });
      button.addEventListener("click", () => {
        this.page = i;
        this.renderTable();
      });
      button.innerText = (i + 1).toString();

      const li = DataTable.createElement(
        "li",
        {
          class: "datatable__pagination__item"
        },
        [button]
      );

      ul.appendChild(li);
    }

    return DataTable.createElement(
      "nav",
      {
        class: "datatable__pagination"
      },
      [ul]
    );
  }

  private static createElement(
    tag: string,
    attributes: any = {},
    childrens: Element[] = []
  ) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key =>
      element.setAttribute(key, attributes[key])
    );
    childrens.forEach(child => element.appendChild(child));
    return element;
  }
}
