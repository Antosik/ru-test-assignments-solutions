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

        const heading = DataTable.getHeading();
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
        this.container.appendChild(table);
    }

    private static headings = ["id", "firstName", "lastName", "email", "phone"];
    private static getHeading(): Element {
        const thead = document.createElement("thead");
        thead.setAttribute("class", "datatable__head");


        for (let heading of DataTable.headings) {
            const td = document.createElement("td");
            td.innerText = heading;
            thead.appendChild(td);
        }

        return thead;
    }
}