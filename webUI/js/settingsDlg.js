'use strict';
(function () {
    let messageHtml = "<button type='button' class='btn btn-primary p-1 m-3' id='settings-add-position'>Добавить позицию</button>";
    messageHtml += "<div id='settings-grid' class='ag-theme-balham' style='height:400px;'></div>";

    var columnDefs = [
        { headerName: "Сайт", field: "target_url", cellEditor: 'agLargeTextCellEditor', editable: true },
        { headerName: "Кол-во страниц для поиска", field: "pages_to_search_cnt" },
        {
            headerName: "Поисковые запросы...", field: "search_queries_cnt", cellClass: "cell-as-link", onCellClicked: function (context) {
                app.showQueriesDlg(context.data.target_url, function (cnt) {
                    context.node.setDataValue("search_queries_cnt", cnt);
                })
            }
        },
        { headerName: "Спец. ссылки", field: "special_url_cnt", cellClass: "cell-as-link" },
        { headerName: "Платные ссылки", field: "paid_links" },
        { headerName: "Мин. время сессии (мин)", field: "session_min_time" },
        { headerName: "Макс. время сессии (мин)", field: "session_max_time" }
    ];

    var gridOptions = {
        columnDefs: columnDefs
    };

    function loadData() {
        $.post("http://192.168.56.1:8080/Data/SessionSettings", function (dataStr) {
            if (!dataStr) {
                return;
            }
            let data = JSON.parse(dataStr);
            gridOptions.api.setRowData(data);
        })
    }

    function initGrid(container) {
        container.find("#settings-grid");
        //var gridDiv = container.find("#settings-grid");
        var gridDiv = document.querySelector('#settings-grid');
        var _grid = new agGrid.Grid(gridDiv, gridOptions);
    }

    function AddPosition() {

    }

    app.showSettingsDlg = function () {
        BootstrapDialog.show({
            title: "Настройки",
            message: messageHtml,
            size: BootstrapDialog.SIZE_WIDE,
            onshown: function (dialogRef) {
                let dlg = dialogRef.getModalDialog();
                initGrid(dlg);
                loadData();
                gridOptions.api.sizeColumnsToFit();
            }
        });
    };
}());