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
        var heading = this.getHeading();
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
        var footer = this.getFooter();
        table.appendChild(footer);
        this.container.appendChild(table);
    };
    DataTable.prototype.getHeading = function () {
        var thead = document.createElement("thead");
        thead.setAttribute("class", "datatable__head");
        for (var _i = 0, _a = DataTable.headings; _i < _a.length; _i++) {
            var heading = _a[_i];
            var th = document.createElement("th");
            th.innerText = heading;
            thead.appendChild(th);
        }
        return thead;
    };
    DataTable.prototype.getFooter = function () {
        var tfoot = document.createElement("tfoot");
        tfoot.setAttribute("class", "datatable__tfoot");
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.setAttribute("colspan", DataTable.headings.length.toString());
        var pagination = this.getPagination();
        cell.appendChild(pagination);
        row.appendChild(cell);
        tfoot.appendChild(row);
        return tfoot;
    };
    DataTable.prototype.getPagination = function () {
        var _this = this;
        var count = Math.ceil(this.data.length / DataTable.MAX_ROWS_ON_PAGE);
        var nav = document.createElement("nav");
        nav.setAttribute("class", "datatable__pagination");
        var ul = document.createElement("ul");
        var _loop_1 = function (i) {
            var isCurrentPage = i === this_1.page;
            var li = document.createElement("li");
            li.setAttribute("class", "datatable__pagination__item");
            var button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("aria-label", isCurrentPage ? "Page " + (i + 1) + ", current page" : "Go to page " + (i + 1));
            button.setAttribute("aria-current", String(isCurrentPage));
            button.addEventListener("click", function () {
                _this.page = i;
                _this.renderTable();
            });
            button.innerText = (i + 1).toString();
            li.appendChild(button);
            ul.appendChild(li);
        };
        var this_1 = this;
        for (var i = 0; i < count; i++) {
            _loop_1(i);
        }
        nav.appendChild(ul);
        return nav;
    };
    DataTable.MAX_ROWS_ON_PAGE = 50;
    DataTable.headings = ["id", "firstName", "lastName", "email", "phone"];
    return DataTable;
}());
