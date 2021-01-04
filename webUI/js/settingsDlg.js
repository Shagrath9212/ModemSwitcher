'use strict';
(function () {
    let messageHtml = "<button type='button' class='btn btn-primary p-1 m-3' id='settings-add-position'>Добавить позицию</button>";
    messageHtml += "<div id='settings-grid' class='ag-theme-balham' style='height:400px;'></div>";

    var gridOptions = {
        defaultColDef: {
            onCellValueChanged: function (e) {
                UpdateData(e.data);
            },
        },
        components: {
            booleanCellRenderer: BooleanCellRenderer,
            booleanEditor: BooleanEditor
        },

        columnDefs: [
            { headerName: "Сайт", field: "target_url", cellEditor: 'agLargeTextCellEditor', editable: true },
            { headerName: "Кол-во страниц для поиска", field: "pages_to_search_cnt", editable: true },
            {
                headerName: "Поисковые запросы...", field: "search_queries_cnt", cellClass: "cell-as-link", onCellClicked: function (context) {
                    app.showQueriesDlg(context.data.session_id, function (cnt) {
                        context.node.setDataValue("search_queries_cnt", cnt);
                    })
                }
            },
            { headerName: "Спец. ссылки", field: "special_url_cnt", cellClass: "cell-as-link" },
            { headerName: "Платные ссылки", field: "paid_links", editable: true, cellRenderer: 'booleanCellRenderer', cellEditor: 'booleanEditor' },
            { headerName: "Мин. время сессии (мин)", field: "session_min_time", editable: true },
            { headerName: "Макс. время сессии (мин)", field: "session_max_time", editable: true },
            {
                headerName: "", field: "del", width: 30, pinned: "right", cellStyle: function () {
                    return {
                        cursor: "pointer"
                    }
                }, cellRenderer: function () {
                    return '<i class="fas fa-eraser"></i>';
                },
                onCellClicked: function (context) {
                    let data = {
                        session_id: context.data.session_id
                    };

                    app.doRequest("http://192.168.56.1:8080/Data/DeleteSetting", data, function () {
                        gridOptions.api.applyTransaction({ remove: [context.data] });
                    });
                }
            }
        ]
    };

    function BooleanCellRenderer() {

    }

    BooleanCellRenderer.prototype.init = function (params) {
        this.eGui = document.createElement('span');
        if (params.value !== "" || params.value !== undefined || params.value !== null) {
            var input = document.createElement('input');
            input.type = "checkbox";
            input.checked = params.value;
            this.eGui.innerHTML = '';
            this.eGui.appendChild(input);
            $(input).on("change", function () {
                params.node.setDataValue("paid_links", $(this).prop("checked"));
                UpdateData(params.data);
            });
        }
    };

    BooleanCellRenderer.prototype.getGui = function () {
        return this.eGui;
    };

    function BooleanEditor() {
    }

    BooleanEditor.prototype.init = function (params) {
        this.container = document.createElement('div');
        this.value = params.value;
        params.stopEditing();
    };
    BooleanEditor.prototype.getGui = function () {
        return this.container;
    };

    BooleanEditor.prototype.afterGuiAttached = function () {
    };

    BooleanEditor.prototype.getValue = function () {
        return this.value;
    };

    BooleanEditor.prototype.destroy = function () {
    };

    BooleanEditor.prototype.isPopup = function () {
        return true;
    };

    function UpdateData(data) {
        app.doRequest("http://192.168.56.1:8080/Data/EditSettings", data);
    }

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
        var gridDiv = document.querySelector('#settings-grid');
        var _grid = new agGrid.Grid(gridDiv, gridOptions);
    }

    function AddPosition() {
        app.doRequest("http://localhost:8080/Data/AddSetting", {}, function (rows) {
            gridOptions.api.applyTransaction({
                add: rows
            });

        });
    }

    app.showSettingsDlg = function () {
        BootstrapDialog.show({
            title: "Настройки",
            message: messageHtml,
            size: BootstrapDialog.SIZE_WIDE,
            onshown: function (dialogRef) {
                let dlg = dialogRef.getModalDialog();
                dlg.find("#settings-add-position").click(AddPosition);
                initGrid(dlg);
                loadData();
                gridOptions.api.sizeColumnsToFit();
            }
        });
    };
}());