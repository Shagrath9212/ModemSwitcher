'use strict';
(function () {
    let queriesDlg = "<button type='button' class='btn btn-primary p-1 m-3' id='queries-add-position'>Добавить позицию</button>";
    queriesDlg += "<div id='queries-grid' class='ag-theme-balham' style='height:400px;'></div>";

    var queriesGridOptions = {
        components: {
            booleanCellRenderer: BooleanCellRenderer,
            booleanEditor: BooleanEditor
        },
        columnDefs: [
            {
                headerName: "Запрос", field: "query", cellEditor: 'agLargeTextCellEditor', editable: true, onCellValueChanged: function (context) {
                    let data = {
                        context: "query",
                        field: "query",
                        id: context.data.query_id,
                        value: context.newValue
                    };

                    app.doRequest("http://192.168.56.1:8080/Data/Update", data);
                }
            },
            { headerName: "Позиция в поиске", field: "position" },
            { headerName: "Последняя сессия", field: "last_session" },
            { headerName: "Платный", field: "paid", cellRenderer: 'booleanCellRenderer', cellEditor: 'booleanEditor' },
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
                        context: "query_remove",
                        field: "query",
                        id: context.data.query_id
                    };

                    app.doRequest("http://192.168.56.1:8080/Data/Update", data, function () {
                        queriesGridOptions.api.applyTransaction({ remove: [context.data] });
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
            $(input).on("change", function () {
                let data = {
                    context: "query_set_paid_stat",
                    field: "query",
                    id: params.data.query_id,
                    value: $(this).prop("checked")
                };
                app.doRequest("http://192.168.56.1:8080/Data/Update", data);
            });
            this.eGui.innerHTML = '';
            this.eGui.appendChild(input);
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

    app.showQueriesDlg = function (session_id, callback) {
        BootstrapDialog.show({
            title: "Редактирование поисковых запросов",
            message: queriesDlg,
            cssClass: "editor",
            size: BootstrapDialog.SIZE_WIDE,
            callback: function (result) {
                if (!result) {
                    return;
                }
            },
            onshown: function (dialogRef) {
                dialogRef.getModalDialog().find("#queries-add-position").click(function () {
                    app.doRequest("http://192.168.56.1:8080/Data/AddQuery", { sessionId: session_id }, function (data) {
                        let row = {
                            query_id: data
                        }
                        queriesGridOptions.api.applyTransaction({
                            add: [row]
                        });
                    });
                });

                let gridContainer = dialogRef.getModalDialog().find("#queries-grid");
                new agGrid.Grid(gridContainer[0], queriesGridOptions);
                app.doRequest("http://192.168.56.1:8080/Data/GetQueries", { sessionId: session_id }, function (data) {
                    queriesGridOptions.api.setRowData(data);
                    queriesGridOptions.api.sizeColumnsToFit();
                });
            },
            onhide: function () {
                callback(queriesGridOptions.api.getDisplayedRowCount());
            }
        })
    }
}());