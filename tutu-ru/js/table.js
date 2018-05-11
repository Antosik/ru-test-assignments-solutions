var DataTable = /** @class */ (function () {
    function DataTable(container, dataSource) {
        var _this = this;
        this.container = container;
        this.page = 0;
        this.renderLoading();
        fetch(dataSource)
            .then(function (response) { return response.json(); })
            .then(function (response) {
            _this.data = response;
            _this.renderTable();
        });
    }
    DataTable.prototype.renderLoading = function () {
        this.container.innerHTML = "";
        var div = document.createElement("div");
        div.setAttribute("class", "loader");
        div.innerText = "Loading...";
        this.container.appendChild(div);
    };
    DataTable.prototype.renderTable = function () {
        this.container.innerHTML = "";
        var table = document.createElement("table");
        table.setAttribute("class", "datatable");
        var heading = DataTable.getHeading();
        table.appendChild(heading);
        var tbody = document.createElement("tbody");
        tbody.setAttribute("class", "datatable__body");
        var data = this.data.slice(this.page * DataTable.MAX_ROWS_ON_PAGE, (this.page + 1) * DataTable.MAX_ROWS_ON_PAGE);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var dataItem = data_1[_i];
            var tr = document.createElement("tr");
            for (var _a = 0, _b = DataTable.headings; _a < _b.length; _a++) {
                var heading_1 = _b[_a];
                var td = document.createElement("td");
                td.innerText = dataItem[heading_1];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        this.container.appendChild(table);
    };
    DataTable.getHeading = function () {
        var thead = document.createElement("thead");
        thead.setAttribute("class", "datatable__head");
        for (var _i = 0, _a = DataTable.headings; _i < _a.length; _i++) {
            var heading = _a[_i];
            var td = document.createElement("td");
            td.innerText = heading;
            thead.appendChild(td);
        }
        return thead;
    };
    DataTable.MAX_ROWS_ON_PAGE = 50;
    DataTable.headings = ["id", "firstName", "lastName", "email", "phone"];
    return DataTable;
}());
