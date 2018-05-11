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
    },
    description: string;
}

class DataTable {
    static MAX_ROWS_ON_PAGE = 50;
    private static headings = ["id", "firstName", "lastName", "email", "phone"];

    private data: IDataItem[];
    private page: number;
    private container: Element;

    constructor(container: Element, dataSource: string) {
        this.container = container;
        this.page = 0;

        this.renderLoading();
        fetch(dataSource)
            .then(response => response.json())
            .then(response => {
                this.data = response;
                this.renderTable();
            });
    }

    private renderLoading() {
        this.container.innerHTML = "";

        const div = document.createElement("div");
        div.setAttribute("class", "loader");
        div.innerText = "Loading...";

        this.container.appendChild(div);
    }

    public renderTable() {
        this.container.innerHTML = "";

        const table = document.createElement("table");
        table.setAttribute("class", "datatable");

        const heading = this.getHeading();
        table.appendChild(heading);

        const tbody = document.createElement("tbody");
        tbody.setAttribute("class", "datatable__body");

        const data = this.data.slice(this.page * DataTable.MAX_ROWS_ON_PAGE, (this.page + 1) * DataTable.MAX_ROWS_ON_PAGE);

        for (let dataItem of data) {
            const tr = document.createElement("tr");

            for (let heading of DataTable.headings) {
                const td = document.createElement("td");
                td.innerText = dataItem[heading];
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        const footer = this.getFooter();
        table.appendChild(footer);

        this.container.appendChild(table);
    }

    private getHeading(): Element {
        const thead = document.createElement("thead");
        thead.setAttribute("class", "datatable__head");


        for (let heading of DataTable.headings) {
            const th = document.createElement("th");
            th.innerText = heading;
            thead.appendChild(th);
        }

        return thead;
    }
    private getFooter(): Element {
        const tfoot = document.createElement("tfoot");
        tfoot.setAttribute("class", "datatable__tfoot");

        const row = document.createElement("tr");

        const cell = document.createElement("td");
        cell.setAttribute("colspan", DataTable.headings.length.toString());

        const pagination = this.getPagination();

        cell.appendChild(pagination);

        row.appendChild(cell);

        tfoot.appendChild(row);

        return tfoot;
    }

    private getPagination(): Element {
        const count = Math.ceil(this.data.length / DataTable.MAX_ROWS_ON_PAGE);
        const nav = document.createElement("nav");
        nav.setAttribute("class", "datatable__pagination");

        const ul = document.createElement("ul");

        for (let i = 0; i < count; i++) {
            const isCurrentPage = i === this.page;

            const li = document.createElement("li");
            li.setAttribute("class", "datatable__pagination__item");

            const button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("aria-label", isCurrentPage ? `Page ${i + 1}, current page` : `Go to page ${i + 1}`);
            button.setAttribute("aria-current", String(isCurrentPage));
            button.addEventListener("click", () => {
                this.page = i;
                this.renderTable();
            });
            button.innerText = (i + 1).toString();

            li.appendChild(button);

            ul.appendChild(li);
        }

        nav.appendChild(ul);

        return nav;
    }
}