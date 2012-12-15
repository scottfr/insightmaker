"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


function commaStr(nStr) {
	//if(nStr instanceof String){
	//	return nStr;
	//}
	if (nStr >= 1e9 || nStr <= 1e-9 && nStr != 0) {
		return nStr.toPrecision(3);
	} else {
		var nStr = round(nStr, 9) + '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
}

function round(value, precision, mode) {
	// Returns the number rounded to specified precision  
	// 
	// version: 1109.2015
	// discuss at: http://phpjs.org/functions/round
	// +   original by: Philip Peterson
	// +    revised by: Onno Marsman
	// +      input by: Greenseed
	// +    revised by: T.Wild
	// +      input by: meo
	// +      input by: William
	// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
	// +      input by: Josep Sanz (http://www.ws3.es/)
	// +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
	// %        note 1: Great work. Ideas for improvement:
	// %        note 1:  - code more compliant with developer guidelines
	// %        note 1:  - for implementing PHP constant arguments look at
	// %        note 1:  the pathinfo() function, it offers the greatest
	// %        note 1:  flexibility & compatibility possible
	// *     example 1: round(1241757, -3);
	// *     returns 1: 1242000
	// *     example 2: round(3.6);
	// *     returns 2: 4
	// *     example 3: round(2.835, 2);
	// *     returns 3: 2.84
	// *     example 4: round(1.1749999999999, 2);
	// *     returns 4: 1.17
	// *     example 5: round(58551.799999999996, 2);
	// *     returns 5: 58551.8
	var m, f, isHalf, sgn; // helper variables
	precision |= 0; // making sure precision is integer
	m = Math.pow(10, precision);
	value *= m;
	sgn = (value > 0) | -(value < 0); // sign of the number
	isHalf = value % 1 === 0.5 * sgn;
	f = Math.floor(value);

	if (isHalf) {
		switch (mode) {
		case 'PHP_ROUND_HALF_DOWN':
			value = f + (sgn < 0); // rounds .5 toward zero
			break;
		case 'PHP_ROUND_HALF_EVEN':
			value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
			break;
		case 'PHP_ROUND_HALF_ODD':
			value = f + !(f % 2); // rounds .5 towards the next odd integer
			break;
		default:
			value = f + (sgn > 0); // rounds .5 away from zero
		}
	}

	return (isHalf ? value : Math.round(value)) / m;
}

var unfilteredRange = function() {
	var me = this,
		chart = me.chart,
		store = chart.getChartStore(),
		data = store.queryBy(function(x) {
			return true;
		})
			.items,
		//XXX SFR FIXME Change to make it load from all data, not just filtered
		series = chart.series.items,
		position = me.position,
		boundedAxes, seriesClasses = Ext.chart.series,
		aggregations = [],
		min = Infinity,
		max = -Infinity,
		vertical = me.position === 'left' || me.position === 'right',
		i, ln, ln2, j, k, dataLength = data.length,
		aggregates, countedFields = {},
		allFields = {},
		excludable = true,
		fields, fieldMap, record, field, value;

	fields = me.fields;
	for (j = 0, ln = fields.length; j < ln; j++) {
		allFields[fields[j]] = true;
	}

	for (i = 0, ln = series.length; i < ln; i++) {
		if (series[i].seriesIsHidden) {
			continue;
		}
		if (!series[i].getAxesForXAndYFields) {
			continue;
		}

		boundedAxes = series[i].getAxesForXAndYFields();
		if (boundedAxes.xAxis && boundedAxes.xAxis !== position && boundedAxes.yAxis && boundedAxes.yAxis !== position) {
			// If the series explicitly exclude current Axis, then exit.
			continue;
		}

		if (seriesClasses.Bar && series[i] instanceof seriesClasses.Bar && !series[i].column) {
			// If this is a horizontal bar series, then flip xField and yField.
			fields = vertical ? Ext.Array.from(series[i].xField) : Ext.Array.from(series[i].yField);
		} else {
			fields = vertical ? Ext.Array.from(series[i].yField) : Ext.Array.from(series[i].xField);
		}

		if (me.fields.length) {
			for (j = 0, ln2 = fields.length; j < ln2; j++) {
				if (allFields[fields[j]]) {
					break;
				}
			}
			if (j == ln2) {
				// Not matching fields, skipping this series.
				continue;
			}
		}

		if (aggregates = series[i].stacked) {
			// If this is a bar/column series, then it will be aggregated if it is of the same direction of the axis.
			if (seriesClasses.Bar && series[i] instanceof seriesClasses.Bar) {
				if (series[i].column != vertical) {
					aggregates = false;
					excludable = false;
				}
			}
			// Otherwise it is stacked vertically
			else if (!vertical) {
				aggregates = false;
				excludable = false;
			}
		}


		if (aggregates) {
			fieldMap = {};
			for (j = 0; j < fields.length; j++) {
				if (excludable && series[i].__excludes && series[i].__excludes[j]) {
					continue;
				}
				if (!allFields[fields[j]]) {
					Ext.Logger.warn('Field `' + fields[j] + '` is not included in the ' + position + ' axis config.');
				}
				allFields[fields[j]] = fieldMap[fields[j]] = true;
			}
			aggregations.push({
				fields: fieldMap,
				value: 0
			});
		} else {

			if (!fields || fields.length == 0) {
				fields = me.fields;
			}
			for (j = 0; j < fields.length; j++) {
				if (excludable && series[i].__excludes && series[i].__excludes[j]) {
					continue;
				}
				allFields[fields[j]] = countedFields[fields[j]] = true;
			}
		}
	}

	for (i = 0; i < dataLength; i++) {
		record = data[i];
		for (k = 0; k < aggregations.length; k++) {
			aggregations[k].value = 0;
		}
		for (field in allFields) {
			value = record.get(field);
			if (isNaN(value)) {
				continue;
			}
			if (value === undefined) {
				value = 0;
			}
			if (countedFields[field]) {
				if (min > value) {
					min = value;
				}
				if (max < value) {
					max = value;
				}
			}
			for (k = 0; k < aggregations.length; k++) {
				if (aggregations[k].fields[field]) {
					aggregations[k].value += value;
					// If any aggregation is actually hit, then the min value should be at most 0.
					if (min > 0) {
						min = 0;
					}
					if (max < aggregations[k].value) {
						max = aggregations[k].value;
					}
				}
			}
		}
	}

	if (!isFinite(max)) {
		max = me.prevMax || 0;
	}
	if (!isFinite(min)) {
		min = me.prevMin || 0;
	}

	//normalize min max for snapEnds.
	if (min != max && (max != Math.floor(max))) {
		max = Math.floor(max) + 1;
	}

	if (!isNaN(me.minimum)) {
		min = me.minimum;
	}

	if (!isNaN(me.maximum)) {
		max = me.maximum;
	}

	if (min >= max) {
		// snapEnds will return NaN if max >= min;
		max = min + 1;
	}

	return {
		min: min,
		max: max
	};
};

var displayConfigWin;
var displayConfigStore;
var displayConfigStore2;

function openDisplayConfigure(win) {

	if (!displayConfigWin) {
		displayConfigStore = new Ext.data.JsonStore({
			fields: [{
				name: 'pid',
				type: 'string'
			}, {
				name: 'pname',
				type: 'string'
			}],
			data: []
		});
		displayConfigStore2 = new Ext.data.JsonStore({
			fields: [{
				name: 'pid',
				type: 'string'
			}, {
				name: 'pname',
				type: 'string'
			}],
			data: []
		});
		displayConfigWin = new Ext.Window({
			layout: 'fit',
			modal: true,
			autoScroll: true,
			width: 410,
			title: "Chart/Table Configuration",
			height: 580,
			resizable: false,
			closeAction: 'hide',
			plain: true,
			items: [new Ext.FormPanel({
				fieldDefaults: {
					labelWidth: 80
				},
				frame: true,
				autoScroll: true,
				id: 'displayConfigure',
				bodyStyle: 'padding:5px 5px 0',
				defaults: {
					width: 365
				},
				items: [{
					xtype: 'fieldset',
					title: 'General Settings',
					defaultType: 'textfield',
					defaults: {
						anchor: '100%'
					},
					layout: 'anchor',
					items: [{
						fieldLabel: 'Title',
						id: 'chartTitle',
						name: 'chartTitle',
						allowBlank: false,
						regex: /^[a-zA-Z][a-zA-Z0-9\-_ \$\&\?\.\,\#\%]*$/,
						regexText: "Only letters, numbers, dashes and spaces allowed in titles."
					},
					Ext.create('Ext.form.ComboBox', {
						fieldLabel: 'Type',
						name: 'chartType',
						id: 'chartType',
						allowBlank: false,
						store: ["Time Series", "Scatterplot", "Tabular", "Map"],
						queryMode: 'local',
						forceSelection: true,
						listeners: {
							change: function(t, newV, oldV) {
								if (t.validate()) {
									if (newV == "Scatterplot") {
										Ext.getCmp("xAxisLabel")
											.setValue("%o");
										Ext.getCmp("yAxisLabel")
											.setValue("%o");
										Ext.getCmp("showMarkers")
											.setValue(true);
										Ext.getCmp("showLines")
											.setValue(false);
									} else if (newV == "Time Series") {
										Ext.getCmp("xAxisLabel")
											.setValue("Time (%u)");
										Ext.getCmp("yAxisLabel")
											.setValue("");
										Ext.getCmp("showMarkers")
											.setValue(false);
										Ext.getCmp("showLines")
											.setValue(true);
									} else if (newV == "Map") {
										Ext.getCmp("xAxisLabel")
											.setValue("%o");
										Ext.getCmp("yAxisLabel")
											.setValue("%o");
										Ext.getCmp("showMarkers")
											.setValue(true);
										Ext.getCmp("showLines")
											.setValue(false);
									}
									Ext.getCmp("chartSettings")
										.setDisabled(newV == "Tabular");
									Ext.getCmp("chartSettings2")
										.setDisabled(newV != "Time Series");
								}
							}
						}
					}), Ext.create('Ext.ux.form.field.BoxSelect', {
						fieldLabel: 'Data',
						name: 'chartPrimitives',
						id: 'chartPrimitives',
						displayField: 'pname',
						valueField: 'pid',
						queryMode: 'local',
						store: displayConfigStore,
						emptyText: 'Select which data to display'
					}), {
						xtype: 'checkboxfield',
						fieldLabel: 'Add New',
						name: 'autoAdd',
						id: 'autoAdd',
						boxLabel: "Add newly created primitives to the data"
					}

					]
				},

				{
					xtype: 'fieldset',
					title: 'Chart Settings',
					defaultType: 'textfield',
					id: "chartSettings",
					defaults: {
						anchor: '100%'
					},
					layout: 'anchor',
					items: [{
						xtype: 'fieldcontainer',
						fieldLabel: 'X-Axis',
						layout: 'hbox',
						defaultType: 'textfield',

						fieldDefaults: {
							labelAlign: 'top'
						},

						items: [{
							flex: 1,
							fieldLabel: 'Label',
							id: 'xAxisLabel',
							name: 'xAxisLabel'
						}, {
							hidden: true,
							xtype: "numberfield",
							fieldLabel: 'Min',
							width: 50,
							id: 'xAxisMin',
							name: 'xAxisMin',
							margins: '0 0 0 5'
						}, {
							hidden: true,
							xtype: "numberfield",
							fieldLabel: 'Max',
							width: 50,
							id: 'xAxisMax',
							name: 'xAxisMax',
							margins: '0 0 0 5'
						}]
					}, {
						xtype: 'fieldcontainer',
						fieldLabel: 'Y-Axis',
						layout: 'hbox',
						defaultType: 'textfield',

						fieldDefaults: {
							labelAlign: 'top'
						},

						items: [{
							flex: 1,
							fieldLabel: 'Label',
							id: 'yAxisLabel',
							name: 'yAxisLabel'
						}, {
							hidden: true,
							xtype: "numberfield",
							fieldLabel: 'Min',
							width: 50,
							id: 'yAxisMin',
							name: 'yAxisMin',
							margins: '0 0 0 5'
						}, {
							hidden: true,
							xtype: "numberfield",
							fieldLabel: 'Max',
							width: 50,
							id: 'yAxisMax',
							name: 'yAxisMax',
							margins: '0 0 0 5'
						}]
					},{xtype:"combo",
					id: "legendPosition",
					fieldLabel: 'Legend Position',
					allowBlank: false,
					store: [
						"Automatic",
						"Top",
						"Right",
						"Bottom",
						"Left",
						"None"
					],
					queryMode: 'local',
					forceSelection: true
					}, {
						xtype: 'container',
						layout: 'column',
						anchor: '100%',
						margin: 7,
						items: [{
							columnWidth: .33,
							xtype: 'checkboxfield',
							boxLabel: 'Show Markers',
							name: 'showMarkers',
							inputValue: '1',
							id: 'showMarkers'
						}, {
							columnWidth: .33,
							xtype: 'checkboxfield',
							boxLabel: 'Show Lines',
							name: 'showLines',
							inputValue: '1',
							id: 'showLines'
						}, {
							columnWidth: .33,
							xtype: 'checkboxfield',
							boxLabel: 'Use Areas',
							name: 'showArea',
							inputValue: '1',
							id: 'showArea'
						}]
					}, {
						xtype: 'fieldset',
						title: 'Secondary Y-Axis',
						defaultType: 'textfield',
						id: "chartSettings2",
						defaults: {
							anchor: '100%'
						},
						layout: 'anchor',
						items: [{
							xtype: 'fieldcontainer',
							fieldLabel: 'Axis',
							layout: 'hbox',
							defaultType: 'textfield',

							fieldDefaults: {
								labelAlign: 'top'
							},

							items: [{
								flex: 1,
								fieldLabel: 'Label',
								id: 'yAxisLabel2',
								name: 'yAxisLabel2'
							}, {
								hidden: true,
								xtype: "numberfield",
								fieldLabel: 'Min',
								width: 50,
								id: 'yAxisMin2',
								name: 'yAxisMin2',
								margins: '0 0 0 5'
							}, {
								hidden: true,
								xtype: "numberfield",
								fieldLabel: 'Max',
								width: 50,
								id: 'yAxisMax2',
								name: 'yAxisMax2',
								margins: '0 0 0 5'
							}]
						},
						Ext.create('Ext.ux.form.field.BoxSelect', {
							fieldLabel: 'Data',
							name: 'chartPrimitives2',
							id: 'chartPrimitives2',
							displayField: 'pname',
							valueField: 'pid',
							queryMode: 'local',
							store: displayConfigStore2,
							emptyText: 'Select which data to display'
						})]
					}]
				}]
			})],

			buttons: [{
				scale: "large",
				iconCls: "cancel-icon",
				text: 'Cancel',
				handler: function() {
					displayConfigWin.hide();
				}
			}, {
				iconCls: "apply-icon",
				scale: "large",
				text: 'Apply',
				handler: function() {
					var d = displayConfigWin.myDisplay;
					var w = displayConfigWin.myWin;
					if (Ext.getCmp("chartTitle")
						.validate() && Ext.getCmp("chartType")
						.validate() && Ext.getCmp("chartPrimitives")
						.validate()) {

						graph.getModel()
							.beginUpdate();
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "name", Ext.getCmp("chartTitle")
							.getValue()));
						w.tabs.getActiveTab()
							.setTitle(Ext.getCmp("chartTitle")
							.getValue());
						var type = Ext.getCmp("chartType")
							.getValue();
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "Type", type));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "AutoAddPrimitives", Ext.getCmp("autoAdd")
							.getValue()));

							graph.getModel()
								.execute(new mxCellAttributeChange(d, "legendPosition", Ext.getCmp("legendPosition")
								.getValue()));
								
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "xAxis", Ext.getCmp("xAxisLabel")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxis", Ext.getCmp("yAxisLabel")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxis2", Ext.getCmp("yAxisLabel2")
							.getValue()));

						graph.getModel()
							.execute(new mxCellAttributeChange(d, "xAxisMin", Ext.getCmp("xAxisMin")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxisMin", Ext.getCmp("yAxisMin")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxisMin2", Ext.getCmp("yAxisMin2")
							.getValue()));

						graph.getModel()
							.execute(new mxCellAttributeChange(d, "xAxisMax", Ext.getCmp("xAxisMax")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxisMax", Ext.getCmp("yAxisMax")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "yAxisMax2", Ext.getCmp("yAxisMax2")
							.getValue()));

						var items = Ext.getCmp("chartPrimitives")
							.getValue();
						if (type == "Scatterplot") {
							if (items.length > 2) {
								items.length = 2;
								mxUtils.alert("The primitive list for the scatterplot has been truncated to two items. One for the x-Axis and one for the y-Axis.");
							} else if (items.length == 1) {
								mxUtils.alert("You need two items to create a scatterplot. One for the x-Axis and one for the y-Axis.");
							}
						} else if (type == "Map") {
							//console.log(items);
							var removed = false;
							for (var i = items.length - 1; i >= 0; i--) {
								//console.log("--")
								//console.log(items[i]);
								//console.log(findID(items[i]));
								if (items[i] && findID(items[i])
									.value.nodeName != "Agents") {
									items.splice(i, 1);
									removed = true;
								} else if (!items[i]) {
									items.splice(i, 1);
								}

							}
							if (removed) {
								mxUtils.alert("Map displays can only show agent population primitives.");
							}
						}
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "Primitives", items.join(",")));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "Primitives2", Ext.getCmp("chartPrimitives2")
							.getValue()
							.join(",")));

						graph.getModel()
							.execute(new mxCellAttributeChange(d, "showMarkers", Ext.getCmp("showMarkers")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "showLines", Ext.getCmp("showLines")
							.getValue()));
						graph.getModel()
							.execute(new mxCellAttributeChange(d, "showArea", Ext.getCmp("showArea")
							.getValue()));

						w.tabs.getActiveTab()
							.removeAll();
						for (var i = w.displayInformation.maps.length - 1; i >= 0; i--) {
							if (w.displayInformation.maps[i].id == d.id) {
								w.displayInformation.maps.splice(i, 1);
							}
						}
						for (var i = w.displayInformation.histograms.length - 1; i >= 0; i--) {
							if (w.displayInformation.histograms[i].id == d.id) {
								w.displayInformation.histograms.splice(i, 1);
							}
						}
						w.tabs.getActiveTab()
							.add(renderDisplay(d, w.displayInformation));
						displayConfigWin.hide();

						graph.getModel()
							.endUpdate();
					} else {
						mxUtils.alert("Correct display configuration before applying.");
					}
				}
			}

			]
		});

	}

	var storeData = [];
	for (var i = 0; i < win.displayInformation.displayedIds.length; i++) {
		storeData.push({
			pid: win.displayInformation.displayedIds[i],
			pname: win.displayInformation.displayedHeaders[i]
		});
	}
	displayConfigStore.loadData(storeData);
	displayConfigStore2.loadData(storeData);
	var d = win.tabs.getActiveTab()
		.display;
	Ext.getCmp("chartTitle")
		.setValue(d.getAttribute("name"));
	Ext.getCmp("chartType")
		.setValue(d.getAttribute("Type"));
	Ext.getCmp("xAxisLabel")
		.setValue(d.getAttribute("xAxis"));
	Ext.getCmp("yAxisLabel")
		.setValue(d.getAttribute("yAxis"));
	Ext.getCmp("yAxisLabel2")
		.setValue(d.getAttribute("yAxis2"));

	Ext.getCmp("xAxisMin")
		.setValue(d.getAttribute("xAxisMin"));
	Ext.getCmp("yAxisMin")
		.setValue(d.getAttribute("yAxisMin"));
	Ext.getCmp("yAxisMin2")
		.setValue(d.getAttribute("yAxisMin2"));
	Ext.getCmp("xAxisMax")
		.setValue(d.getAttribute("xAxisMax"));
	Ext.getCmp("yAxisMax")
		.setValue(d.getAttribute("yAxisMax"));
	Ext.getCmp("yAxisMax2")
		.setValue(d.getAttribute("yAxisMax2"));

		Ext.getCmp("legendPosition")
			.setValue(d.getAttribute("legendPosition"));
			
	Ext.getCmp("showMarkers")
		.setValue(d.getAttribute("showMarkers"));
	Ext.getCmp("showLines")
		.setValue(d.getAttribute("showLines"));
	Ext.getCmp("showArea")
		.setValue(d.getAttribute("showArea"));


	Ext.getCmp("autoAdd")
		.setValue(d.getAttribute("AutoAddPrimitives"));

	Ext.getCmp("chartPrimitives")
		.setValue([]);
	if (!isUndefined(d.getAttribute("Primitives"))) {
		Ext.getCmp("chartPrimitives")
			.setValue(d.getAttribute("Primitives")
			.split(","));
	}
	Ext.getCmp("chartPrimitives2")
		.setValue([]);
	if (!isUndefined(d.getAttribute("Primitives2"))) {
		Ext.getCmp("chartPrimitives2")
			.setValue(d.getAttribute("Primitives2")
			.split(","));
	}

	displayConfigWin.myDisplay = d;
	displayConfigWin.myWin = win;
	displayConfigWin.show();
}



function renderDisplay(display, displayInformation) {
	var type = display.getAttribute("Type");
	var primitives = isDefined(display.getAttribute("Primitives")) ? display.getAttribute("Primitives")
		.split(",") : [];
	for (var i = primitives.length - 1; i >= 0; i--) {
		if (inAgent(findID(primitives[i]))) {
			primitives.splice(i, 1);
		}
	}
	var primitives2 = isDefined(display.getAttribute("Primitives2")) ? display.getAttribute("Primitives2")
		.split(",") : [];
	for (var i = primitives2.length - 1; i >= 0; i--) {
		if (inAgent(findID(primitives2[i]))) {
			primitives2.splice(i, 1);
		}
	}

	if (primitives.length == 0 || (type == "Scatterplot" && primitives.length < 2)) {
		return {
			xtype: "box",
			html: "<br/><br/><br/><b><big><center><span style='color:darkgray'>No data to display<br/><br/>Press 'Configure' to select data</span></center></big></b>"
		};
	}

	var chart;
	var histograms = [];
	if (type == "Tabular") {
		var cols = [{
			header: "Time",
			sortable: true,
			flex: 1,
			dataIndex: "TimeValue",
			renderer: function(x) {
				return round(x, 9);
			}
		}];
		for (var j = 0; j < primitives.length; j++) {
			for (var i = 0; i < displayInformation.ids.length; i++) {
				if (primitives[j] == displayInformation.ids[i]) {
					cols.push({
						header: displayInformation.headers[i],
						sortable: true,
						flex: 1,
						dataIndex: "series" + i,
						renderer: displayInformation.renderers[i]
					});
				}
			}
		}

		var grid = new Ext.grid.GridPanel({
			store: displayInformation.store,
			columns: cols,
			stripeRows: true,
			border: false,
			frame: false,
			header: false,
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: ["->", {
					xtype: 'exporterbutton',
					downloadName: display.getAttribute("name")
				}]
			}]
		});

		return grid;
	} else if (type == "Time Series") {
		primitives = primitives.concat(primitives2);
		var displayIds1 = [];
		var displayIds2 = [];
		var displayNames1 = [];
		var displayNames2 = [];
		var displaySeries = [];

		var defaultColors = ["#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"];
		var defaultColorIndex = 0;
		var colors = [];

		if (isTrue(display.getAttribute('showArea'))) {
			var fields = [];
			var titles = [];
			for (var j = 0; j < primitives.length; j++) {
				for (var i = 0; i < displayInformation.ids.length; i++) {
					if (primitives[j] == displayInformation.ids[i]) {
						if (displayInformation.renderers[i]) {
							var left = primitives2.indexOf(primitives[j]) == -1
							if (left) {
								if (!isGray(displayInformation.colors[i])) {
									colors.push(displayInformation.colors[i]);
								} else {
									colors.push(defaultColors[defaultColorIndex]);
									defaultColorIndex++;
									defaultColorIndex = defaultColorIndex % defaultColors.length;
								}

								fields.push("series" + i);
								titles.push(displayInformation.headers[i]);
							}
						} else {
							histograms.push(createHistogramChart(displayInformation, i));
						}
					}
				}
			}

			displaySeries.push({
				highlight: false,
				type: 'area',
				axis: "left",
				xField: "Time",
				yField: fields,
				title: titles,
				smooth: false
			});


			var themeId = "theme" + Math.random();

			Ext.chart.theme[themeId] = Ext.extend(Ext.chart.theme.Base, {
				constructor: function(config) {
					Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
						colors: colors
					}, config));
				}
			});

		} else {
			for (var j = 0; j < primitives.length; j++) {

				for (var i = 0; i < displayInformation.ids.length; i++) {
					if (primitives[j] == displayInformation.ids[i]) {
						//console.log(displayInformation.ids[i])
						//console.log(displayInformation.renderers[i])
						if (displayInformation.renderers[i]) {

							var left = primitives2.indexOf(primitives[j]) == -1
							var x = "series" + i;

							var c = null;
							if (!isGray(displayInformation.colors[i])) {
								c = displayInformation.colors[i];
							} else {
								c = defaultColors[defaultColorIndex];
								defaultColorIndex++;
								defaultColorIndex = defaultColorIndex % defaultColors.length;
							}

							var strokeStyle = {
								stoke: c,
								fill: c,
								'stroke-width': 3
							};
							if (!isTrue(display.getAttribute("showLines"))) {
								strokeStyle.opacity = 0
								strokeStyle.stroke = "none";
							}

							if (left) {
								displayNames1.push(displayInformation.headers[i])
								displayIds1.push(x);
							} else {
								displayNames2.push(displayInformation.headers[i])
								displayIds2.push(x);
							};
							displaySeries.push({
								type: 'line',
								axis: left ? "left" : "right",
								xField: "Time",
								yField: left ? displayIds1[displayIds1.length - 1] : displayIds2[displayIds2.length - 1],
								title: left ? displayNames1[displayNames1.length - 1] : displayNames2[displayNames2.length - 1],
								showMarkers: isTrue(display.getAttribute("showMarkers")),
								smooth: false,
								style: strokeStyle,
								tips: {
									trackMouse: true,
									width: 160,
									renderer: function(storeItem, item) {
										this.setTitle(clean(item.series.title) + ":<br/>" + displayInformation.times[item.value[0]] + ", " + commaStr(item.value[1]));
									}
								}

							})
						} else {
							histograms.push(createHistogramChart(displayInformation, i));
						}
					}
				}
			}
		}

		var axes = [{
			type: 'Numeric',
			position: 'bottom',
			fields: "Time",
			minimum: isUndefined(display.getAttribute("xAxisMin")) ? undefined : display.getAttribute("xAxisMin") / (displayInformation.times[1] - displayInformation.times[0]) - displayInformation.times[0],
			maximum: isUndefined(display.getAttribute("xAxisMax")) ? undefined : display.getAttribute("xAxisMax") / (displayInformation.times[1] - displayInformation.times[0]) - displayInformation.times[0],
			title: quickLabel(display.getAttribute("xAxis"), display.getAttribute("name"), displayNames1.join(", ")),
			grid: true,
			labelTitle: {
				font: '12px Verdana'
			},
			label: {
				renderer: function(x) {
					//console.log(x);
					if (displayInformation.times.length > 1) {
						return round(displayInformation.times[0] + (displayInformation.times[1] - displayInformation.times[0]) * x, 9);
					}
					return round(x, 9);
				}
			},
			getRange: unfilteredRange
		}];

		if (primitives.length > primitives2.length) {
			axes.push({
				type: 'Numeric',
				position: 'left',

				minimum: display.getAttribute("yAxisMin"),
				maximum: display.getAttribute("yAxisMax"),
				fields: displayIds1,
				grid: true,
				title: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), displayNames1.join(", ")),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: unfilteredRange
			});
		}

		if (primitives2.length > 0) {
			axes.push({
				minimum: display.getAttribute("yAxis2Min"),
				maximum: display.getAttribute("yAxis2Max"),
				type: 'Numeric',
				position: 'right',
				fields: displayIds2,
				grid: primitives.length == primitives2.length,
				title: quickLabel(display.getAttribute("yAxis2"), display.getAttribute("name"), displayNames2.join(", ")),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: unfilteredRange
			});
		}


		chart = Ext.create("Ext.chart.Chart", {
			flex: 1,
			theme: isTrue(display.getAttribute('showArea')) ? themeId : undefined,
			background: {
				//color string
				fill: '#fff'
			},
			html: "<div id='scratchpad" + analysisCount + "_" + display.id + "' style='z-index:1000;position:absolute; width:100%;height:100%;display:none;'></div>",
			xtype: 'chart',
			animate: false,
			shadow: false,
			store: displayInformation.store,
			axes: axes,
			series: displaySeries
		});
		if(display.getAttribute('legendPosition')!="None"){
			chart.legend = Ext.create('Ext.chart.Legend', {
				position: display.getAttribute('legendPosition')=="Automatic"?(primitives.length > 4 ? 'right' : 'top'):display.getAttribute('legendPosition').toLowerCase(),
				chart: chart,
				boxStrokeWidth: 0,
				boxStroke: '#fff',
				itemSpacing: 4,
				padding: 0,
				isVertical: false
			});
		}

	} else if (type == "Scatterplot") {
		var displayIds = [];
		var displayNames = [];
		for (var j = 0; j < primitives.length; j++) {

			for (var i = 0; i < displayInformation.ids.length; i++) {
				if (primitives[j] == displayInformation.ids[i]) {
					if (displayInformation.renderers[i]) {

						displayIds.push("series" + i);
						displayNames.push(displayInformation.headers[i]);
					} else {
						histograms.push(createHistogramChart(displayInformation, i));
					}
				}
			}
		}

		var strokeStyle = {
			'stroke-width': 3
		};
		if (!isTrue(display.getAttribute("showLines"))) {
			strokeStyle.opacity = 0
			strokeStyle.stroke = "none";
		}

		chart = Ext.create("Ext.chart.Chart", {
			flex: 1,
			background: {
				fill: '#fff'
			},
			xtype: 'chart',
			animate: false,
			html: "<div id='scratchpad" + analysisCount + "_" + display.id + "'  style='z-index:1000;position:absolute; width:100%;height:100%;display:none;'></div>",
			shadow: false,
			store: displayInformation.store,
			axes: [{
				minimum: display.getAttribute("xAxisMin"),
				maximum: display.getAttribute("xAxisMax"),
				type: 'Numeric',
				position: 'bottom',
				fields: displayIds[0],
				grid: true,
				title: quickLabel(display.getAttribute("xAxis"), display.getAttribute("name"), displayNames[0]),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: unfilteredRange
			}, {

				minimum: display.getAttribute("yAxisMin"),
				maximum: display.getAttribute("yAxisMax"),
				type: 'Numeric',
				position: 'left',
				fields: displayIds[1],
				grid: true,
				title: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), displayNames[1]),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: unfilteredRange
			}],
			series: [{
				type: 'line',
				axis: "left",
				xField: displayIds[0],
				yField: displayIds[1],
				showMarkers: isTrue(display.getAttribute("showMarkers")),
				style: strokeStyle,
				smooth: false,
				tips: {
					trackMouse: true,
					width: 160,
					renderer: function(storeItem, item) {
						this.setTitle(commaStr(item.value[0]) + ", " + commaStr(item.value[1]));
					}
				}

			}]
		});

	} else if (type == "Map") {
		var defaultColors = ["#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"];
		var defaultColorIndex = 0;
		var colors = [];

		var storeFields = [{
			type: "float",
			name: "agentIndex"
		}, {
			type: "string",
			name: "states"
		}];
		var storeData = [];
		var displaySeries = []
		var seriesBase = [];
		var xfields = [];
		var yfields = [];
		var agents = [];

		var createAgentTips = function(agentName) {
			return function(storeItem, item) {
				this.setTitle("<p><center>" + agentName + " " + storeItem.get("agentIndex") + "</center></p></p>" + storeItem.get("states") + "</p><p>" + commaStr(item.value[0]) + ", " + commaStr(item.value[1]) + "</p>");
			}
		}

		for (var j = 0; j < primitives.length; j++) {
			var id = primitives[j];
			var a = displayInformation.agents[id];
			if (isUndefined(a)) {
				alert("Primitive is not an agent population!");
				return;
			}
			agents.push(a);
			var agentName = getName(findID(a.item.getAttribute("Agent")));
			for (var s = 0; s < a.data.states.length; s++) {
				var base = "series_" + id + "_" + a.data.states[s] + "_";
				var name = getName(findID(a.data.states[s]));
				seriesBase.push(base);

				xfields.push(base + "x");
				yfields.push(base + "y");

				storeFields.push({
					type: "float",
					name: base + "x"
				});
				storeFields.push({
					type: "float",
					name: base + "y"
				});

				var i = 0;
				for (i = 0; i < displayInformation.colors.length; i++) {
					if (displayInformation.ids[i] == id && displayInformation.headers[i] == name) {
						break;
					}
				}
				//console.log(i);
				var color = null;
				if (!isGray(displayInformation.colors[i])) {
					color = displayInformation.colors[i];
				} else {
					color = defaultColors[defaultColorIndex];
					defaultColorIndex++;
					defaultColorIndex = defaultColorIndex % defaultColors.length;
				}
				//console.log(color);


				displaySeries.push({
					title: name,
					animate: false,
					type: 'line',
					axis: "left",
					xField: base + "x",
					yField: base + "y",
					showMarkers: true,
					style: {
						'stroke-width': 0,
						opacity: 0,
						stroke: 'none'
					},
					markerConfig: {
						type: ["circle", "triangle", "diamond", "cross", "plus"][j % 6],
						fill: color,
						radius: 5
					},
					smooth: false,
					tips: {
						trackMouse: true,
						width: 160,
						renderer: createAgentTips(agentName)
					}
				});
			}

		}

		var store = new Ext.data.Store({
			fields: storeFields
		});


		chart = Ext.create("Ext.chart.Chart", {
			background: {
				fill: '#fff'
			},
			flex: 1,
			legend: display.getAttribute('legendPosition')=="None"?false:{
				position: display.getAttribute('legendPosition')=="Automatic"?(seriesBase.length > 4 ? 'right' : 'top'):display.getAttribute('legendPosition').toLowerCase()
			},
			xtype: 'chart',
			animate: false,
			html: "<div id='scratchpad" + analysisCount + "_" + display.id + "'  style='z-index:1000;position:absolute; width:100%;height:100%;display:none;'></div>",
			shadow: false,
			store: store,
			axes: [{
				type: 'Numeric',
				position: 'bottom',
				fields: xfields,
				grid: false,
				title: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), "Position (" + a.item.getAttribute("GeoDimUnits") + ")"),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: function() {
					return {
						min: 0,
						max: parseFloat(simpleNum(a.data.width, a.data.units))
					};
				}
			}, {
				type: 'Numeric',
				position: 'left',
				fields: yfields,
				grid: false,
				title: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), "Position (" + a.item.getAttribute("GeoDimUnits") + ")"),
				labelTitle: {
					font: '12px Verdana'
				},
				label: {
					renderer: commaStr
				},
				getRange: function() {
					return {
						min: 0,
						max: parseFloat(simpleNum(a.data.height, a.data.units))
					};
				}
			}],
			series: displaySeries
		});

		displayInformation.maps.push({
			id: display.id,
			store: store,
			agents: agents,
			bases: seriesBase,
			chart: chart
		});
		buildMapStore(displayInformation.maps[displayInformation.maps.length - 1], displayInformation.scripter.time);

	}

	if (type != "Tabular") {
		var items = [];
		if (chart.series.length > 0) {
			items.push(chart);
		}
		items = items.concat(histograms);
		var p = {
			xtype: "panel",
			items: items,
			layout: items.length == 1 ? "fit" : {
				type: 'vbox',
				align: 'stretch'
			},
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: ["->", {
					xtype: 'button',
					text: "Download",
					handler: function() {
						surpressCloseWarning = true;
						this.up("panel")
							.down("chart")
							.save({
							type: "image/png"
						});
					}
				}]
			}]
		};
		return p;
	}
}




function createResultsWindow(displayInformation) {
	displayInformation.maps = [];
	displayInformation.histograms = [];


	analysisCount++;

	//console.log(store);
	//console.log(ids);
	//console.log(header);
	var displays = primitives("Display");

	var tabs = [];
	var scripter = {
		time: 0
	};
	displayInformation.scripter = scripter;

	for (var i = 0; i < displays.length; i++) {
		tabs.push({
			xtype: "panel",
			title: displays[i].getAttribute("name"),
			items: [renderDisplay(displays[i], displayInformation)],
			layout: "fit",
			display: displays[i]
		});
	}


	var rendered = new Ext.TabPanel({
		activeTab: 0,
		flex: 1,
		deferredRender: false,
		frame: false,
		border: false,
		enableTabScroll: true,
		defaults: {
			autoScroll: true
		},
		items: tabs
	});




	scripter.store = displayInformation.store;
	scripter.maps = displayInformation.maps;
	scripter.histograms = displayInformation.histograms;
	scripter.updatingSlider = false;
	scripter.timeIndex = 0;
	scripter.maxTime = displayInformation.times.length - 1;
	scripter.minTime = 0;
	scripter.timeStep = 2;
	scripter.times = displayInformation.times;

	scripter.slider = Ext.create("Ext.form.SliderField", {
		minValue: 0,
		animate: false,
		hideLabel: true,
		maxValue: scripter.maxTime,
		flex: 1,
		step: scripter.timeStep,
		margins: '0 10 0 10',
		useTips: true,
		tipText: function(thumb) {
			return "" + thumb.slider.s.times[thumb.slider.getValue()];
		}
	});

	scripter.combo = Ext.create("Ext.form.field.ComboBox", {
		fieldLabel: '',
		labelWidth: 0,
		allowBlank: false,
		store: [
			[.2, "0.2 x Normal"],
			[.5, "0.5 x Normal"],
			[1, "Normal Speed"],
			[1.5, "1.5 x Normal"],
			[2, "2 x Normal"],
			[5, "5 x Normal"],
			[10, "10 x Normal"],
			[-1, "Full Speed"]
		],
		queryMode: 'local',
		value: parseFloat(getSetting()
			.getAttribute("Throttle")),
		width: 102,
		forceSelection: true,
		listeners: {
			select: function(me) {
				graph.getModel()
					.beginUpdate();
				var edit = new mxCellAttributeChange(getSetting(), "Throttle", me.getValue());
				graph.getModel()
					.execute(edit);
				graph.getModel()
					.endUpdate();
			}
		}
	});


	scripter.slider.s = scripter;

	scripter.slider.on('change', function(slider, newValue) {
		//console.log("A")
		if (!this.s.updatingSlider) {
			//console.log("b")
			//console.log(newValue);
			this.s.loadTime(newValue);
		}
	});

	scripter.playBut = Ext.create("Ext.button.Button", {
		scale: 'medium',
		allowDepress: true,
		enableToggle: true,
		pressed: true,
		icon: builder_path + '/images/pause.png'
	});

	scripter.playBut.s = scripter;

	scripter.animInter = -1;
	scripter.playBut.on("toggle", function(b, pressed) {
		if (pressed) {
			if (this.s.slider.getValue() == this.s.maxTime) {
				this.s.slider.setValue(this.s.minTime);
			}
			this.s.playBut.setIcon(builder_path + "/images/pause.png");
			this.s.advanceTimer();
			var instant = this;
			this.s.animInter = setInterval(function() {
				instant.s.advanceTimer()
			}, this.s.combo.getValue() == -1 ? 200 : 100 / Math.min(.5, this.s.combo.getValue()));
		} else {
			this.s.playBut.setIcon(builder_path + "/images/play.png");
			clearInterval(this.s.animInter);
		}
	});

	scripter.advanceTimer = function() {
		if (this.slider.getValue() < this.maxTime) {
			this.loadTime(Math.min(this.maxTime, this.slider.getValue() + this.timeStep * Math.max(.5, this.combo.getValue())));
		} else {
			this.playBut.toggle();
		}
	}

	scripter.loadTime = function(time) {
		this.store.clearFilter(true);
		this.time = time;
		//console.log("A");
		this.store.filter([{
			filterFn: function(item) {
				return item.get("Time") <= time;
			}
		}]);
		//console.log("b");
		this.maps.forEach(function(x) {
			buildMapStore(x, time);
		});
		this.histograms.forEach(function(x) {
			buildHistogramStore(x, time);
		});
		//console.log("c");
		this.updatingSlider = true;
		this.slider.setValue(time);
		this.updatingSlider = false;
	}
	if (scripter.combo.getValue() != -1) {
		scripter.loadTime(1);
		scripter.animInter = setInterval(function() {
			scripter.advanceTimer()
		}, scripter.combo.getValue() == -1 ? 200 : 100 / Math.min(.5, scripter.combo.getValue()));

	} else {
		scripter.loadTime(scripter.maxTime);
		scripter.playBut.toggle();
	}




	var win = new Ext.Window({
		title: 'Simulation Results ' + analysisCount,
		analysisCount: analysisCount,
		scratchPadStatus: {},
		closable: true,
		displays: displays,
		tabs: rendered,
		maximized: is_embed,
		expandedState: true,
		displayInformation: displayInformation,
		minWidth: 450,
		minHeight: 400,
		width: 580,
		height: is_embed ? 400 : (is_editor ? 500 : 490),
		resizable: true,
		maximizable: true,
		minimizable: true,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [rendered, {
			xtype: 'container',
			layout: {
				type: "hbox",
				align: 'middle'
			},
			margins: '5 3 10 10',
			items: [scripter.playBut, scripter.slider, scripter.combo]
		}],

		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			hidden: (!is_editor),
			items: [{
				iconCls: "add-icon",
				scale: "large",
				text: 'Add Display',
				handler: function() {
					var parent = graph.getDefaultParent();
					var win = this.findParentByType("window");
					var vertex;
					graph.getModel()
						.beginUpdate();
					vertex = graph.insertVertex(parent, null, primitiveBank.display.cloneNode(true), 10, 10, 64, 64, "display");
					vertex.visible = false;
					graph.getModel()
						.endUpdate();
					win.displays.push(vertex);
					win.tabs.add({
						title: vertex.getAttribute("name"),
						items: [renderDisplay(vertex, win.displayInformation)],
						layout: "fit",
						display: vertex
					});
					win.tabs.setActiveTab(primitives("Display")
						.length - 1);
					openDisplayConfigure(win);
				}
			}, {
				scale: "large",
				iconCls: "big-delete-icon",
				text: 'Delete Display',
				handler: function() {

					var win = this.findParentByType("window");
					if (win.displays.length > 0) {
						var tabs = win.tabs;
						var tabIndex = tabs.items.indexOf(tabs.getActiveTab());

						graph.getModel()
							.beginUpdate();
						graph.removeCells([win.displays[tabIndex]], false);
						graph.getModel()
							.endUpdate();
						win.displays.splice(tabIndex, 1);
						tabs.remove(tabs.getActiveTab());

					} else {

						mxUtils.alert("No chart or table to delete");
					}
				}
			}, {
				scale: "large",
				iconCls: "leftarrow-icon",
				text: '',
				tooltip: "Move display to the left.",
				handler: function() {

					var win = this.findParentByType("window");
					if (win.displays.length > 0) {
						var tabs = win.tabs;
						var tabIndex = tabs.items.indexOf(tabs.getActiveTab());

						var display = win.displays[tabIndex];
						graph.orderCells(true, [display]);

						var child = tabs.getActiveTab();
						win.displays.splice(tabIndex, 1);
						win.displays = [display].concat(win.displays);

						tabs.remove(child, false);
						tabs.insert(0, child);
						tabs.setActiveTab(child);

					} else {
						mxUtils.alert("No chart or table to reorder.");
					}
				}
			}, {
				scale: "large",
				iconCls: "rightarrow-icon",
				text: '',
				tooltip: "Move display to the right.",
				handler: function() {

					var win = this.findParentByType("window");
					if (win.displays.length > 0) {
						var tabs = win.tabs;
						var tabIndex = tabs.items.indexOf(tabs.getActiveTab());

						var display = win.displays[tabIndex];
						graph.orderCells(false, [display]);

						win.displays.splice(tabIndex, 1);
						win.displays.push(display);

						var child = tabs.getActiveTab();
						tabs.remove(child, false);
						tabs.add(child);
						tabs.setActiveTab(child);
					} else {
						mxUtils.alert("No chart or table to reorder.");
					}
				}
			}, '->', {
				scale: "large",
				iconCls: "scratchpad-large-icon",
				text: 'Scratchpad',
				handler: function() {

					var win = this.findParentByType("window");
					if (win.displays.length > 0) {
						var tabs = win.tabs;
						var tabIndex = tabs.items.indexOf(tabs.getActiveTab());

						var display = win.displays[tabIndex];
						if (display.getAttribute("Type") != "Tabular") {

							var id = "scratchpad" + win.analysisCount + "_" + display.id;
							if (win.scratchPadStatus[id] == "shown") {
								Ext.get(id)
									.setDisplayed("none");
								win.scratchPadStatus[id] = "hidden";
							} else if (win.scratchPadStatus[id] == "hidden") {
								Ext.get(id)
									.setDisplayed("block");
								win.scratchPadStatus[id] = "shown";
							} else {
								Ext.get(id)
									.setDisplayed("block");
								Scratchpad($('#' + id));
								win.scratchPadStatus[id] = "shown";
							}
							return;
						}
					}
					mxUtils.alert("Scratchpads can only be shown for charts.");

				}
			}, {
				scale: "large",
				iconCls: "configure-icon",
				text: 'Configure',
				handler: function() {
					var win = this.findParentByType("window");
					if (win.displays.length > 0) {
						openDisplayConfigure(win);
					} else {
						mxUtils.alert("Add a chart or table to configure it");
					}
				}
			}

			]
		}]
	});
	win.on('minimize', function(w) {
		if (w.expandedState) {
			w.expandedState = false;
			w.collapse();
			//collapse the window
		} else {

			w.expandedState = true;
			win.expand();
		}
	});
	win.show();
}

function buildMapStore(item, time) {
	var res = [];

	var connections = {};
	var locations = {};
	//console.log("---");
	//console.log(item);
	//console.log(time);
	for (var i = 0; i < item.agents.length; i++) {
		var agent = item.agents[i];
		var xNull = -parseFloat(simpleNum(agent.data.width, agent.data.units));
		var yNull = -parseFloat(simpleNum(agent.data.height, agent.data.units));

		var data = item.agents[i].results[time].current;
		for (var j = 0; j < data.length; j++) {
			locations[data[j].instanceId] = data[j].location;
			connections[data[j].instanceId] = data[j].connected;
			//console.log(data[j]);
			//console.log(data[j].state)
			if (data[j].state !== null) {
				//console.log(data[j].state)
				var states = data[j].state.map(function(x) {
					return x.name
				})
					.join(", ");
				//console.log(data[j].connected);
				for (var k = 0; k < data[j].state.length; k++) {
					var x = createDummyBase();
					var base = "series_" + agent.id + "_" + data[j].state[k].id + "_";
					x[base + "x"] = data[j].location.items[0];
					x[base + "y"] = data[j].location.items[1];
					res.push(x);
				}
			}
		}
	}

	function createDummyBase() {
		var x = {
			"agentIndex": j + 1,
			states: states
		};
		for (var i = 0; i < item.bases.length; i++) {
			x[item.bases[i] + "x"] = xNull;
			x[item.bases[i] + "y"] = yNull;
		}
		return x;
	}

	var links = {};
	for (var id in connections) {
		for (var i = 0; i < connections[id].length; i++) {
			var key = [id, connections[id][i]].sort()
				.join("__");
			if (!links[key]) {
				links[key] = [locations[id], locations[connections[id][i]]];
			}
		}
	}
	item.chart.links = links;

	//console.log(res);
	item.store.loadData(res);
}

function buildHistogramStore(item, time) {

	//console.log(res);
	item.store.loadData(createHistogramData(item.data[time], item.min, item.max));

}

function createHistogramChart(displayInformation, i) {
	var store = new Ext.data.JsonStore({
		fields: [{
			name: 'Label',
			type: 'string'
		}, {
			name: 'Count',
			type: 'float'
		}],
		data: []
	});

	var histogram = {
		store: store,
		data: displayInformation.res[displayInformation.ids[i]].results
	};

	var vecs = histogram.data;

	try {
		//console.log(functionBank["min"](vecs));
		//console.log(functionBank["max"](vecs));
		histogram.min = Math.floor(0 + functionBank["min"](vecs)
			.value);
		histogram.max = Math.ceil(0 + functionBank["max"](vecs)
			.value);
	} catch (err) {
		//console.log("err");
		histogram.min = -1;
		histogram.max = 1;
	}
	if (isNaN(histogram.min)) {
		histogram.min = -1;
		histogram.max = 1;
	}

	if (histogram.min == histogram.max) {
		histogram.min = histogram.min - 1;
		histogram.max = histogram.max + 1;
	}
	//console.log(histogram);

	var chart = Ext.create("Ext.chart.Chart", {
		xtype: 'chart',
		flex: 1,
		animate: false,
		shadow: false,
		store: store,
		axes: [{
			type: 'Category',
			position: 'bottom',
			fields: ['Label'],
			labelTitle: {
				font: '12px Verdana'
			},
			title: displayInformation.headers[i]
		}, {
			type: 'Numeric',
			position: 'left',
			fields: 'Count',
			decimals: 0,
			minimum: 0
		}],
		series: [{
			type: 'column',
			xField: 'Label',
			yField: "Count",
			gutter: 5,
			tips: {
				trackMouse: true,
				width: 80,
				renderer: function(storeItem, item) {
					this.setTitle("<center>" + commaStr(item.value[1]) + "</center>");
				}
			}
		}]
	});


	buildHistogramStore(histogram, displayInformation.scripter.time)
	displayInformation.histograms.push(histogram)

	return chart;
}

function createHistogramData(data, min, max) {
	var divisions = 20;
	var counts = [];
	var width = (max - min) / divisions;
	for (var i = 0; i < divisions; i++) {
		counts.push({
			Label: round(min + width / 2 + width * i, 9),
			Count: 0
		});
	}
	//console.log(data);
	for (var i = 0; i < data.items.length; i++) {
		//console.log("--")
		//console.log(min);
		//console.log(max);
		var index = 0 + data.items[i].value;
		if (!isNaN(index)) {
			//console.log(index)
			index = Math.max(0, Math.min(divisions - 1, Math.round((index - min) / width - 0.5)));
			//console.log(index);
			counts[index].Count = counts[index].Count + 1;
		}
	}
	//console.log(counts);
	return counts;
}
