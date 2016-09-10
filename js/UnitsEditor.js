"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var UnitsEditor = Ext.extend(Ext.form.TextField, {
	enableKeyEvents: false,
	selectOnFocus: true,
	stripCharsRe: /[^A-Za-z 0-9\.\/\(\)\*\^]/g,
	triggers: {
		edit: {
			hideOnReadOnly: false,
			handler: function() {
				this.editorWindow = new UnitsWindow({
					parent: this,
					units: this.getValue()
				});
				this.editorWindow.show();
			}
		}
	},
	listeners: {
		'keydown': function(field) {
			field.setEditable(false);
		},
		'beforerender': function() {
			if (this.regex != undefined) {
				this.validator = function(value) {
					return this.regex.test(value);
				};
			}

		}
	}
});


function UnitsWindow(config) {
	var me = this;

	function setUnitsText(u) {
		unitsLabel.setValue(clean(u));
	}

	var unitsLabel = new Ext.form.field.Text({
		xtype: "textfield",
		height: 40,
		fieldStyle: "font-size: x-large; text-align:center;",
		stripCharsRe: /[^A-Za-z 0-9\.\/\(\)\*\^]/g
	})

	var store = Ext.create('Ext.data.TreeStore', {
		root: {
			text: getText('Units'),
			draggable: false,
			expanded: true,
			children: [

			]
		}
	});

	var tree = new Ext.tree.Panel({
		animate: false,
		frame: true,
		store: store,
		autoScroll: true,
		useArrows: true,
		flex: 1,
		margin: '5,5,5,5',
		rootVisible: false,
		folderSort: false,
		listeners: {
			selectionchange: function(v, selections, opts) {

				if (selections[0].data.leaf) {
					setUnitsText(selections[0].data.text);
				}
			}
		}
	});


	var setupUnits = function(tree) {

		var root = tree.getRootNode();


		var unitsTxt = "Distance, Area and Volume\r Metric\r  Millimeters\r  Centimeters\r  Meters\r  Kilometers\r  -\r  Square Millimeters\r  Square Centimeters\r  Square Meters\r  Hectares\r  Square Kilometers\r  -\r  Cubic Millimeters\r  Cubic Centimeters\r  Liters\r  Cubic Meters\r English\r  Inches\r  Feet\r  Yards\r  Miles\r  -\r  Square Inches\r  Square Feet\r  Square Yards\r  Acres\r  Square Miles\r  -\r  Fluid Ounces\r  Quarts\r  Gallons\r  Acre Feet\rVelocity, Acceleration and Flow\r Metric\r  Meters per Second\r  Meters per Second Squared\r  Kilometers per Hour\r  Kilometers per Hour Squared\r  -\r  Liters per Second\r  Cubic Meters per Second\r  -\r  Kilograms per Second\r English\r  Feet per Second\r  Feet per Second Squared\r  Miles per Hour\r  Miles per Hour Squared\r  -\r  Gallons per Second\r  Gallons per Minute\r  -\r  Pounds per Second\rMass, Force and Pressure\r Metric\r  Milligrams\r  Grams\r  Kilograms\r  Tonnes\r  -\r  Newtons\r  -\r  Pascals\r  Kilopascals\r  Bars\r  Atmospheres\r English\r  Ounces\r  Pounds\r  Tons\r  -\r  Pounds Force\r  -\r  Pounds per Square Inch\rTemperature and Energy\r Metric\r  Degrees Celsius\r  Degrees Kelvin\r  -\r  Joules\r  Kilojoules\r  -\r  Watts\r  Kilowatts\r  Megawatts\r  Gigawatts\r  -\r  Amperes\r  -\r  Millivolts\r  Volts\r  Kilovolts\r  -\r  Coulombs\r  -\r  Farads\r English\r  Degrees Fahrenheit\r  -\r  Calories\r  Kilocalories\r  British Thermal Units\rTime\r Milliseconds\r Seconds\r Minutes\r Hours\r Days\r Weeks\r Months\r Quarters\r Years\rMoney\r Dollars\r Flow of Dollars\r  Dollars per Second\r  Dollars per Hour\r  Dollars per Day\r  Dollars per Week\r  Dollars per Month\r  Dollars per Quarter\r  Dollars per Year\r -\r Euros\r Flow of Euros\r  Euros per Second\r  Euros per Hour\r  Euros per Day\r  Euros per Week\r  Euros per Month\r  Euros per Quarter\r  Euros per Year\rBusiness and Commerce\r People\r Customers\r Employees\r Workers\r -\r Factories\r Buildings\r -\r Units\r Widgets\r Parts\rEcology and Nature\r Individuals\r Animals\r Plants\r Trees\r Biomass\rChemistry\r Atoms\r Molecules\r -\r Moles";



		var roots = [root];
		var lastNode = root.appendChild({
			text: "Unitless",
			draggable: false,
			leaf: true,
			expanded: true
		});



		var modelUnits = unitsUsedInModel();
		if (modelUnits.length > 0) {
			lastNode = root.appendChild({
				text: getText("Units Used in Model"),
				draggable: false,
				leaf: false,
				expanded: true
			});
			for (var i = 0; i < modelUnits.length; i++) {
				lastNode.appendChild({
					text: modelUnits[i],
					draggable: false,
					leaf: true,
					expanded: true
				});
			}
		}


		var cU = customUnits();
		if (cU.length > 0) {
			lastNode = root.appendChild({
				text: getText("Custom Units"),
				draggable: false,
				leaf: false,
				expanded: true
			});
			for (var i = 0; i < cU.length; i++) {
				lastNode.appendChild({
					text: clean(cU[i][0]),
					draggable: false,
					leaf: true,
					expanded: false
				});
			}
		}

		var indentation = 0;
		var unitLines = unitsTxt.split(/[\n\r]/);
		for (var i = 0; i < unitLines.length; i++) {
			var res = unitLines[i].match(/^ *(.*?)$/);
			if (res[1] != "-") {
				var currIndentation = unitLines[i].length - res[1].length;
				if (currIndentation > indentation) {

					lastNode.leaf = false;
					lastNode.iconCls = 'icon-folder';
					lastNode = roots[roots.length - 1].appendChild(lastNode);
					roots.push(lastNode);
				} else if (currIndentation < indentation) {
					lastNode = roots[roots.length - 1].appendChild(lastNode);
					for (var j = 0; j < indentation - currIndentation; j++) {
						roots.pop();
					}
				} else {

					lastNode = roots[roots.length - 1].appendChild(lastNode);
				}

				indentation = currIndentation;

				lastNode = {
					text: res[1],
					draggable: false,
					leaf: true,
					expanded: false
				};
			}
		}

	}

	setupUnits(tree);

	var win = new Ext.Window({
		title: getText('Primitive Units'),
		layout: {
			type: "vbox",
			align: "stretch"
		},
		tools: [{
			type: 'help',
			tooltip: getText('Get Help'),
			callback: function(panel, tool, event) {
				showURL("/units");
			}
		}],
		closeAction: 'destroy',
		border: false,
		modal: true,
		resizable: true,
		maximizable: true,
		stateful: is_editor && (!is_embed),
		stateId: "units_window",
		shadow: true,
		buttonAlign: 'left',
		layoutConfig: {
			columns: 1
		},
		width: Math.min(Ext.getBody().getViewSize().width, 560),
		height: Math.min(Ext.getBody().getViewSize().height, 400),
		items: [unitsLabel, tree],
		buttons: [{
			id: 'units_but',
			scale: "large",
			text: getText('Unit Conversions'),
			glyph: 0xf1de,
			handler: function() {
				var setting = getSetting();


				var genData = function() {
					var data = [];
					var items = customUnits();
					for (var i = 0; i < items.length; i++) {
						var ent = items[i];
						data.push({
							name: ent[0],
							scale: ent[1],
							synonym: ent[2]
						});

					}
					return data;
				}

				var store = Ext.create('Ext.data.Store', {
					fields: [{
						name: 'name',
						type: 'string'
					}, {
						name: 'synonym',
						type: 'string'
					}, {
						name: 'scale',
						type: 'float'
					}],
					data: genData(),
					sorters: ['name']
				});

				var editor = new Ext.grid.plugin.RowEditing({
					saveText: 'Apply'
				});


				var columnsList = [{
					header: getText('Name'),
					dataIndex: 'name',
					flex: 2,
					sortable: true,
					editor: {
						xtype: 'textfield',
						allowBlank: false,
						regex: /^[a-zA-Z][a-z A-Z]*$/,
						regexText: getText("The unit name may only contain letters and spaces.")
					}
				}, {
					xtype: 'numbercolumn',
					header: getText('Scale'),
					dataIndex: 'scale',
					width: 150,
					sortable: false,
					editor: {
						xtype: 'numberfield',
						allowBlank: false,
						decimalPrecision: 10
					}
				}, {
					header: getText('Synonym'),
					dataIndex: 'synonym',
					flex: 3,
					sortable: false,
					editor: {
						xtype: 'textfield',
						allowBlank: true,
						emptyText: "Meters/Seconds^2",
						regex: /^([a-zA-Z][a-z A-Z]*(\^-?[\d\.]+)?[\*\/]?)*$/,
						regexText: getText("The unit synonym should be of the form: Meters*Seconds^2/Kilograms.")
					}
				}];

				var grid = new Ext.grid.GridPanel({
					store: store,
					plugins: [editor],
					features: [],
					tbar: [{
						glyph: 0xf056,
						iconCls: 'red-icon',
						itemId: "removeBut",
						text: getText('Remove Conversion'),
						disabled: true,
						handler: function() {
							editor.completeEdit();
							var s = grid.getSelectionModel().getSelection();
							for (var i = 0, r; r = s[i]; i++) {
								store.remove(r);
							}
						}
					}, "->", {
						glyph: 0xf055,
						text: getText('Add Conversion'),
						iconCls: 'green-icon',
						handler: function() {
							var e = {
								name: getText('New Unit Name'),
								synonym: '',
								scale: 1
							};
							editor.completeEdit();
							store.insert(0, e);
							//store.getAt(0).setDirty();
							grid.getView().refresh();
							grid.getSelectionModel().selectRange(0, 0);
							editor.startEdit(0, 0);
						}
					}],

					columns: columnsList
				});

				var saveUnits = function() {
					grid.plugins[0].completeEdit();
					var c = store.getCount();
					for (var i = 0; i < c; i++) {
						var record = store.getAt(i);
						record.commit();
					}

					var newUnits = "";

					if (store.getCount() > 0) {
						newUnits = store.getAt(0).get("name") + "<>" + store.getAt(0).get("scale") + "<>" + store.getAt(0).get("synonym");
					}
					for (var i = 1; i < store.getCount(); i++) {
						newUnits = newUnits + "\n" + store.getAt(i).get("name") + "<>" + store.getAt(i).get("scale") + "<>" + store.getAt(i).get("synonym");
					}

					graph.getModel().beginUpdate();

					var edit = new mxCellAttributeChange(
						setting, "Units", newUnits);
					graph.getModel().execute(edit);
					graph.getModel().endUpdate();
					setupUnits(tree);

					unitsWin.close();
				}


				grid.getSelectionModel().on('selectionchange', function(sm) {
					grid.getDockedItems()[0].getComponent("removeBut").setDisabled(sm.getCount() < 1);
				});

				var unitsWin = new Ext.Window({
					layout: 'fit',
					modal: true,
					title: getText("Configure Custom Unit Conversions"),
					width: Math.min(Ext.getBody().getViewSize().width, 530),
					height: Math.min(Ext.getBody().getViewSize().height, 430),
					resizable: true,
					closeAction: 'close',
					closable: false,
					items: [grid],
					buttons: [{
						scale: "large",
						glyph: 0xf05c,
						text: getText('Cancel'),
						handler: function() {
							unitsWin.close()
						}
					}, {
						scale: "large",
						glyph: 0xf00c,
						text: getText('Apply'),
						handler: saveUnits
					}]

				});

				unitsWin.show();
			},
			scope: this
		}, "->", {
			scale: "large",
			glyph: 0xf05c,
			text: getText('Cancel'),
			handler: function() {
				win.close();
				if (config.parent != "") {
					config.parent.resumeEvents();
				}
			}
		}, {
			hidden: !viewConfig.allowEdits,
			scale: "large",
			glyph: 0xf00c,
			text: getText('Apply'),
			handler: function() {;
				if (config.parent != "") {
					win.close();
					editingRecord.set("value", unitsLabel.getValue());
					saveConfigRecord(editingRecord);
				} else {
					graph.getModel().beginUpdate();
					config.cell.setAttribute("Units", unitsLabel.getValue());
					graph.getModel().endUpdate();
					win.close();
				}
				if (Ext.getCmp("equationUnitsBut")) {
					Ext.getCmp("equationUnitsBut").setText(formatUnitsBut(unitsLabel.getValue()));
				}
			}
		}]

	});

	me.show = function() {
		win.show();
		setUnitsText(config.units);
	}
}
