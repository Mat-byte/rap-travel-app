sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Fragment} Fragment
     */
    function (Controller, JSONModel, Fragment) {
        "use strict";

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();
        const fieldModel = new JSONModel();

        function onInit() {

            paramModel.loadData("./localService/mockdata/params.json", "false");
            this.getView().setModel(paramModel, "paramModel");

            chartsModel.loadData("./localService/mockdata/chartOfAccount.json", "false");
            this.getView().setModel(chartsModel, "chartsModel");

            groupsModel.loadData("./localService/mockdata/accountGroups.json", "false");
            this.getView().setModel(groupsModel, "groupsModel");

            currModel.loadData("./localService/mockdata/currency.json", "false");
            this.getView().setModel(currModel, "currModel");

            fieldModel.loadData("./localService/mockdata/fields.json", "false");
            this.getView().setModel(fieldModel, "fieldModel");
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
            groupsModel.setProperty("/selectedGroups", []);
            var selectedItems = oEvent.getParameter("selectedItems");
            for (var i in selectedItems) {
                groups.push(selectedItems[i].getKey());

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

        function onValidateStep3(oEvent) {

            const fields = fieldModel.getProperty("/fields");
            let selectedFields = [];
            const indexs = this.getView().byId("tb1").getSelectedIndices();
            fieldModel.setProperty("/selectedFields", []);

            if (indexs) {
                for (let i in indexs) {
                    selectedFields.push(fields[i].id);
                }
                fieldModel.setProperty("/selectedFields", selectedFields);

            }

        }

        function onShowDescription(oEvent) {

            const oView = this.getView();
            //Verificar si el Dialog ya está instanciado
            if (!this.byId("descriptionDialog")) {

                Fragment.load({
                    id: oView.getId(),
                    name: "mcc.cuentasui5.fragment.descriptionReport",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependt(oDialog);
                    oDialog.open();
                });
            }
            else{
                this.byId("descriptionDialog").open();
            }
        }

        function onCloseDescription(oEvent) {
            this.byId("descriptionDialog").close();            
        }

        const Main = Controller.extend("mcc.cuentasui5.controller.Main", {});
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onInit = onInit;
        Main.prototype.onValidateStep1 = onValidateStep1;
        Main.prototype.onValidateChart = onValidateChart;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionGroups = handleSelectionGroups;
        Main.prototype.onValidateCurr = onValidateCurr;
        Main.prototype.handleChangeDate = handleChangeDate;
        Main.prototype.onValidateStep3 = onValidateStep3;
        Main.prototype.onShowDescription = onShowDescription;
        Main.prototype.onCloseDescription = onCloseDescription;

        return Main

		/*return Controller.extend("mcc.cuentasui5.controller.Main", {
			onInit: function () {

			}
		});*/
    });
