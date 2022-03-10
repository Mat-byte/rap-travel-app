sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();

        function onInit() {

            paramModel.loadData("./localService/mockdata/params.json", "false");
            this.getView().setModel(paramModel, "paramModel");

            chartsModel.loadData("./localService/mockdata/chartOfAccount.json", "false");
            this.getView().setModel(chartsModel, "chartsModel");

            groupsModel.loadData("./localService/mockdata/accountGroups.json", "false");
            this.getView().setModel(groupsModel, "groupsModel");

            currModel.loadData("./localService/mockdata/currency.json", "false");
            this.getView().setModel(currModel, "currModel");
        }

        function onBeforeRendering() {

            this._wizard = this.getView().byId("wizard");
            this._FirstStep = this._wizard.getSteps()[0];
            this._SecondStep = this._wizard.getSteps()[1];
            this._ThirdsStep = this._wizard.getSteps()[2];

            //Reset Wizard
            this._wizard.discardProgess(this._FirstStep);
            this._wizard.goToStep(this._FirstStep);
            this._FirstStep.setValidated(false);


        }

        function onValidateStep1(oEvent) {

            const name = this.getView().byId("inp1").getValue();

            const description = this.getView().byId("txa1").getValue();

            if (name != '' && name != undefined && description != '' && description != undefined) {

                paramModel.setProperty("/employeeName", name);
                paramModel.setProperty("/description", description);

                this._FirstStep.setValidated(true);
                this._wizard.goToStep(this._SecondStep);

            }

            else {

                this._FirstStep.setValidated(false);

            }
        }

        function onValidateChart() {
            // traer el valor y actualizar modelo de parametros
            const chart = chartsModel.getProperty("/selectedChart");
            paramModel.setProperty("/chart", chart);


            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);

        }

        function handleSelectionChange() {

        }

        function handleSelectionGroups(oEvent) {
            // traer el valor y actualizar modelo de parametros
            let groups = [];
            groupsModel.setProperty("/selectedGroups", [])
            var selectecItems = oEvent.getParameter("selectedItems");
            for (var i in selectecItems) {
                groups.push(selectecItems[i].getKey);

            }
            groupsModel.setProperty("/selectedGroups", groups);
            paramModel.setProperty("/groups", groups);

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);

        }

        function onValidateCurr() {
            // traer el valor y actualizar modelo de parametros
            const currency = currModel.getProperty("/monedaSeleccionada");
            paramModel.setProperty("/currency", currency);


            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);

        }

        function handleChangeDate(oEvent) {
            // traer el valor y actualizar modelo de parametros
            const sValue = oEvent.getParameter("value");
            const bValid = oEvent.getParameter("valid");
            if (bValid) {
                paramModel.setProperty("/date", sValue)

            }
            else {
                paramModel.setProperty("/date", "")
            }

            // validar si todos los datos están llenos para ir al paso 3
            _validateStep2(this);

        }

        function _validateStep2(that) {

            const params = paramModel.getData();

            if (params.chart !== "" && params.chart !== undefined
                && params.groups !== "" && params.groups.length > 0
                && params.currency !== "" && params.currency !== undefined
                && params.date !== "" && params.date !== undefined) {

                that._SecondStep.setValidated(true);
                that._wizard.goToStep(this._ThirdsStep);

            }
            else {

                that._SecondStep.setValidated(false);

            }

        }

        const Main = Controller.extend("mcc.cuentasui5.controller.Main", {});
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onInit = onInit;
        Main.prototype.onValidateStep1 = onValidateStep1;
        Main.prototype.onValidateChart = onValidateChart;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionFinish = handleSelectionGroups;
        Main.prototype.onValidateCurr = onValidateCurr;
        Main.prototype.handleChangeDate = handleChangeDate;

        return Main

		/*return Controller.extend("mcc.cuentasui5.controller.Main", {
			onInit: function () {

			}
		});*/
    });
