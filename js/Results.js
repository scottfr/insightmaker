"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var linkedResults = undefined;

var defaultColors = ["#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"];

function dataRenderer(item) {
	if (item instanceof Vector) {
		return item.toString();
	} else if (item instanceof Agent) {
		return "Agent " + (item.index + 1);
	} else {
		return commaStr(item);
	}
}

function commaStr(nStr) {
	//if(nStr instanceof String){
	//	return nStr;
	//}
	if (isUndefined(nStr) || nStr === null) {
		return "";
	}
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

function numericBound(v) {
	if (v === undefined || v === "") {
		return undefined;
	} else {
		return +v;
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


var displayConfigWin;
var displayConfigStore;
var displayConfigStore2;

function openDisplayConfigure(win) {

	if (true /*!displayConfigWin*/) {
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
			title: getText("Chart/Table Configuration"),
			width: Math.min(Ext.getBody().getViewSize().width, 470),
			height: Math.min(Ext.getBody().getViewSize().height, 580),
			resizable: false,
			closeAction: 'destroy',
			plain: true,
			items: [new Ext.FormPanel({
				fieldDefaults: {
					labelWidth: 80
				},
				frame: true,
				autoScroll: true,
				id: 'displayConfigure',
				bodyStyle: 'padding:5px 5px 0px 12px',
				defaults: {
					width: 425
				},
				items: [{
						xtype: 'fieldset',
						title: getText('General Settings'),
						defaultType: 'textfield',
						defaults: {
							anchor: '100%'
						},
					
						layout: 'anchor',
						items: [
							{
								name: 'chartType',
								id: 'chartType',
								fieldLabel: getText('Type'),
								xtype: "segmentedbutton",
								style: {
									"margin-bottom": "10px"
								},
								items: [
								{
									text: getText("Time Series"),
									itemId: "Time Series",
									pressed: true,
									tooltip: "A time series chart shows how the valus of one or primitives change over time.."
								},
								{
									//glyph: 0xf095,
									//iconCls: 'green-icon',
									text: getText("Scatter Plot"),
									itemId: "Scatterplot",
									tooltip: "A scatter plot allows you to see how two primitives change together. It is also known as a Phase-Plane plot."
								},
								{
									//glyph: 0xf095,
									//iconCls: 'green-icon',
									text: getText("Table"),
									itemId: "Tabular",
									tooltip: "A table gives you the precise values of your primitives over the course of the simulation."
								},
								{
									//glyph: 0xf095,
									//iconCls: 'green-icon',
									text: getText("Agent Map"),
									itemId: "Map",
									tooltip: "An agent map plots the geographic locations of agents within an Agent Population primitive. Connections between agents and agent states are also plotted."
								}
								],
								listeners: {
									toggle: function(t, button, isPressed){
										if(isPressed){
											var newV = button.getItemId();
											
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
											/*
											Ext.getCmp("chartSettings")
												.setDisabled(newV == "Tabular");
											*/
											if(newV == "Tabular"){
												Ext.getCmp("chartSettings").setStyle("opacity", 0.4);
											}else{
												Ext.getCmp("chartSettings").setStyle("opacity", 1);
											}
										}
										
									}
								}
							},
							
							{
															fieldLabel: getText('Title'),
															id: 'chartTitle',
															name: 'chartTitle',
															allowBlank: false
														}
							
							, Ext.create('Ext.form.field.Tag', {
								fieldLabel: getText('Data'),
								name: 'chartPrimitives',
								id: 'chartPrimitives',
								displayField: 'pname',
								valueField: 'pid',
								filterPickList: true,
								queryMode: 'local',
								store: displayConfigStore,
								emptyText: getText('Select which data to display')
							}), {
								xtype: 'checkboxfield',
								fieldLabel: '',
								name: 'autoAdd',
								id: 'autoAdd',
								boxLabel: getText("Add newly created primitives to the data")
							}

						]
					},

					 {
						xtype: 'fieldset',
						title: getText('Chart Settings'),
						defaultType: 'textfield',
						id: "chartSettings",
						defaults: {
							anchor: '100%'
						},
						layout: 'anchor',
						items: [{
							xtype: 'container',
							layout: 'column',
							anchor: '100%',
							margin: 7,
							items: [{
								columnWidth: .33,
								xtype: 'checkboxfield',
								boxLabel: getText('Show Markers'),
								name: 'showMarkers',
								inputValue: '1',
								id: 'showMarkers'
							}, {
								columnWidth: .33,
								xtype: 'checkboxfield',
								boxLabel: getText('Show Lines'),
								name: 'showLines',
								inputValue: '1',
								id: 'showLines'
							}, {
								columnWidth: .33,
								xtype: 'checkboxfield',
								boxLabel: getText('Use Areas'),
								name: 'showArea',
								inputValue: '1',
								id: 'showArea'
							}]
						},{
							xtype: "combo",
							id: "legendPosition",
							fieldLabel: getText('Legend Position'),
							allowBlank: false,
							labelWidth: 140,
							store: [
								["Automatic", getText("Automatic")],
								["Top", getText("Top")],
								["Right", getText("Right")],
								["Bottom", getText("Bottom")],
								["Left", getText("Left")],
								["None", getText("None")]
							],
							queryMode: 'local',
							forceSelection: true
						},{
							xtype: 'fieldset',
							title: getText('X-Axis'),
							defaultType: 'textfield',
							defaults: {
								anchor: '100%'
							},
							layout: 'anchor',
							items: [{
							xtype: 'fieldcontainer',
							fieldLabel: '',
							layout: 'hbox',
							defaultType: 'textfield',

							fieldDefaults: {
								labelAlign: 'top'
							},

							items: [{
								flex: 1,
								fieldLabel: getText('Label'),
								id: 'xAxisLabel',
								name: 'xAxisLabel'
							}, {
								hidden: false,
								xtype: "numberfield",
								fieldLabel: getText('Min'),
								width: 110,
								id: 'xAxisMin',
								name: 'xAxisMin',
								margin: '0 0 0 5'
							}, {
								hidden: false,
								xtype: "numberfield",
								fieldLabel: getText('Max'),
								width: 110,
								id: 'xAxisMax',
								name: 'xAxisMax',
								margin: '0 0 0 5'
							}]
						}]}, {
							xtype: 'fieldset',
							title: getText('Y-Axis'),
							defaultType: 'textfield',
							defaults: {
								anchor: '100%'
							},
							layout: 'anchor',
							items: [{
							xtype: 'fieldcontainer',
							fieldLabel: '',
							layout: 'hbox',
							defaultType: 'textfield',

							fieldDefaults: {
								labelAlign: 'top'
							},

							items: [{
								flex: 1,
								fieldLabel: getText('Label'),
								id: 'yAxisLabel',
								name: 'yAxisLabel'
							}, {
								hidden: false,
								xtype: "numberfield",
								fieldLabel: getText('Min'),
								width: 110,
								id: 'yAxisMin',
								name: 'yAxisMin',
								margin: '0 0 0 5'
							}, {
								hidden: false,
								xtype: "numberfield",
								fieldLabel: getText('Max'),
								width: 110,
								id: 'yAxisMax',
								name: 'yAxisMax',
								margin: '0 0 0 5'
							}]
						}]},  {
							xtype: 'fieldset',
							title: getText('Secondary Y-Axis'),
							defaultType: 'textfield',
							defaults: {
								anchor: '100%'
							},
							layout: 'anchor',
							items: [Ext.create('Ext.form.field.Tag', {
									fieldLabel: getText('Data'),
									name: 'chartPrimitives2',
									id: 'chartPrimitives2',
									displayField: 'pname',
									filterPickList: true,
									valueField: 'pid',
									queryMode: 'local',
									store: displayConfigStore2,
									emptyText: getText('Select which data to display')
								}),{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									defaultType: 'textfield',

									fieldDefaults: {
										labelAlign: 'top'
									},

									items: [{
										flex: 1,
										fieldLabel: getText('Label'),
										id: 'yAxisLabel2',
										name: 'yAxisLabel2'
									}, {
										hidden: false,
										xtype: "numberfield",
										fieldLabel: getText('Min'),
										width: 110,
										id: 'yAxisMin2',
										name: 'yAxisMin2',
										margin: '0 0 0 5'
									}, {
										hidden: false,
										xtype: "numberfield",
										fieldLabel: getText('Max'),
										width: 110,
										id: 'yAxisMax2',
										name: 'yAxisMax2',
										margin: '0 0 0 5'
									}]
								}
							]
						}]
					}
				]
			})],

			buttons: [{
					scale: "large",
					glyph: 0xf05c,
					text: getText('Cancel'),
					handler: function() {
						displayConfigWin.close();
					}
				}, {
					glyph: 0xf00c,
					scale: "large",
					text: getText('Apply'),
					handler: function() {
						var d = displayConfigWin.myDisplay;
						var w = displayConfigWin.myWin;
						if (Ext.getCmp("chartTitle")
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
								
							var type;	
							Ext.getCmp("chartType").items.each(function(x){
								if(x.pressed){
									type = x.getItemId();
								}
							});
							
							graph.getModel()
								.execute(new mxCellAttributeChange(d, "Type", type));
							graph.getModel()
								.execute(new mxCellAttributeChange(d, "AutoAddPrimitives", Ext.getCmp("autoAdd")
									.getValue().toString()));

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
									mxUtils.alert(getText("The primitive list for the scatterplot has been truncated to two items. One for the x-Axis and one for the y-Axis."));
								} else if (items.length == 1) {
									mxUtils.alert(getText("You need two primitives to create a scatterplot. One for the x-Axis and one for the y-Axis."));
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
									mxUtils.alert(getText("Map charts can only show agent population primitives."));
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
									.getValue().toString()));
							graph.getModel()
								.execute(new mxCellAttributeChange(d, "showLines", Ext.getCmp("showLines")
									.getValue().toString()));
							graph.getModel()
								.execute(new mxCellAttributeChange(d, "showArea", Ext.getCmp("showArea")
									.getValue().toString()));

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
							displayConfigWin.close();

							graph.getModel()
								.endUpdate();
						
								win.enableTabs();
						} else {
							mxUtils.alert(getText("Correct the display configuration before applying."));
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

	storeData.sort(function(a, b) {
		return a.pname.localeCompare(b.pname);
	});

	displayConfigStore.loadData(storeData);
	displayConfigStore2.loadData(storeData);
	var d = win.tabs.getActiveTab()
		.display;
	Ext.getCmp("chartTitle")
		.setValue(d.getAttribute("name"));
	Ext.getCmp("chartType").items.each(function(x){
		x.setPressed(x.getItemId() == d.getAttribute("Type"));
	});
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
	Ext.getCmp("displayConfigure").scrollTo(0, 0, false);
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
			html: "<br/><br/><br/><b><big><center><span style='color:darkgray'>" + getText("No data to display") + "<br/><br/>" + getText("Press 'Configure' to select data") + "</span></center></big></b>"
		};
	}

	var chart;
	var histograms = [];
	if (type == "Tabular") {
		var cols = [{
			header: getText("Time"),
			sortable: true,
			flex: 1,
			dataIndex: "Time",
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
						dataIndex: displayInformation.elementIds[i],
						renderer: dataRenderer
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
				items: ["->", downloadButton(display.getAttribute("name"))]
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

								fields.push(displayInformation.elementIds[i]);
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
				smooth: false,
				colors: colors
			});




		} else {

			for (var j = 0; j < primitives.length; j++) {

				for (var i = 0; i < displayInformation.ids.length; i++) {
					if (primitives[j] == displayInformation.ids[i]) {
						//console.log(displayInformation.ids[i])
						//console.log(displayInformation.renderers[i])
						if (displayInformation.renderers[i]) {

							var left = primitives2.indexOf(primitives[j]) == -1
							var x = displayInformation.elementIds[i];

							var c = null;
							if (!isGray(displayInformation.colors[i])) {
								c = displayInformation.colors[i];
							} else {
								c = defaultColors[defaultColorIndex];
								defaultColorIndex++;
								defaultColorIndex = defaultColorIndex % defaultColors.length;
							}
							colors.push(c);

							var strokeStyle = {
								'stroke-width': 4
								/*,
								stroke: c*/
							};
							if (!isTrue(display.getAttribute("showLines"))) {
								//strokeStyle.opacity = 0
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
								marker: {
									radius: 4
								},
								colors: [c],
								smooth: false,
								style: strokeStyle,
								highlight: true,
								highlightCfg: {
									radius: 5
								},
								tooltip: {
									trackMouse: true,
									width: 160,
									style: 'background-color: #fff',
									renderer: function(storeItem, item) {
										this.setHtml("Time: " + storeItem.get("Time") + "<br/>" + clean(item.series.getTitle()) + ": " + commaStr(storeItem.get(item.field)));
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
			type: 'numeric',
			position: 'bottom',
			fields: "Time",
			minimum: isUndefined(display.getAttribute("xAxisMin")) ? displayInformation.store.min("Time") : parseFloat(display.getAttribute("xAxisMin")),
			maximum: isUndefined(display.getAttribute("xAxisMax")) ? displayInformation.times[displayInformation.times.length - 1] : parseFloat(display.getAttribute("xAxisMax")),
			title: {
				text: quickLabel(display.getAttribute("xAxis"), display.getAttribute("name"), stringArray(displayNames1, ", ", " and ")),
				fontSize: 14
			},
			grid: true,
			titleMargin: 16,
			renderer: function(x) {
				return round(x, 9);
			}
		}];

		if (primitives.length > primitives2.length) {
			axes.push({
				type: 'numeric',
				position: 'left',

				minimum: numericBound(display.getAttribute("yAxisMin")),
				maximum: numericBound(display.getAttribute("yAxisMax")),
				fields: displayIds1,
				grid: true,
				title: {
					text: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), stringArray(displayNames1, ", ", " and ")),
					fontSize: 14
				},
				titleMargin: 20,
				renderer: commaStr
				/*getRange: unfilteredRange*/
			});
		}

		if (primitives2.length > 0) {
			axes.push({
				minimum: numericBound(display.getAttribute("yAxisMin2")),
				maximum: numericBound(display.getAttribute("yAxisMax2")),
				type: 'numeric',
				position: 'right',
				fields: displayIds2,
				grid: primitives.length == primitives2.length,
				title: {
					text: quickLabel(display.getAttribute("yAxis2"), display.getAttribute("name"), stringArray(displayNames2, ", ", " and ")),
					fontSize: 14
				},
				titleMargin: 20,
				renderer: commaStr
			});
		}


		chart = {
			flex: 1,
			interactions: ['crosszoom',  'itemhighlight'],

			
			animation: false,
			shadow: false,
			store: displayInformation.store,
			axes: axes,
			series: displaySeries
		};

		if (display.getAttribute('legendPosition') != "None") {

			chart.legend = {
				docked: display.getAttribute('legendPosition') == "Automatic" ? (primitives.length > 4 ? 'right' : 'top') : display.getAttribute('legendPosition').toLowerCase()
			};
		}


		chart = Ext.create("Ext.chart.CartesianChart", chart);





	} else if (type == "Scatterplot") {
		var displayIds = [];
		var displayNames = [];
		for (var j = 0; j < primitives.length; j++) {

			for (var i = 0; i < displayInformation.ids.length; i++) {
				if (primitives[j] == displayInformation.ids[i]) {
					if (displayInformation.renderers[i]) {
						displayIds.push(displayInformation.elementIds[i]);
						displayNames.push(displayInformation.headers[i]);
					} else {
						histograms.push(createHistogramChart(displayInformation, i));
					}
				}
			}
		}

		var strokeStyle = {
			'stroke-width': 4
		};
		if (!isTrue(display.getAttribute("showLines"))) {
			//strokeStyle.opacity = 0
			strokeStyle.stroke = "none";
		}
		
		var createTooltip = function(xfield, xname, yfield, yname){
			return function(storeItem, item) {
				this.setHtml(clean(xname)+": " + commaStr(storeItem.get(xfield)) + "<br/>" + clean(yname) + ": " + commaStr(storeItem.get(yfield)));
			}
		}

		chart = Ext.create("Ext.chart.CartesianChart", {
			flex: 1,
			interactions: ['crosszoom',  'itemhighlight'],
			xtype: 'chart',
			animation: false,
			
			shadow: false,
			store: displayInformation.store,
			axes: [{
				minimum: numericBound(display.getAttribute("xAxisMin")),
				maximum: numericBound(display.getAttribute("xAxisMax")),
				type: 'numeric',
				position: 'bottom',
				fields: displayIds[0],
				titleMargin: 16,
				grid: true,
				title: {
					text: quickLabel(display.getAttribute("xAxis"), display.getAttribute("name"), displayNames[0]),
					fontSize: 14
				},
				renderer: commaStr
			}, {

				minimum: numericBound(display.getAttribute("yAxisMin")),
				maximum: numericBound(display.getAttribute("yAxisMax")),
				type: 'numeric',
				position: 'left',
				fields: displayIds[1],
				grid: true,
				title: {
					text: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), displayNames[1]),
					fontSize: 14
				},
				titleMargin: 20,
				renderer: commaStr
			}],
			series: [{
				type: 'scatter', // 'line' type can result in some strange rendering issues
				axis: "left",
				xField: displayIds[0],
				yField: displayIds[1],
				showMarkers: isTrue(display.getAttribute("showMarkers")),
				marker: {
					radius: 4
				},
				style: strokeStyle,
				smooth: false,
				highlight: true,
				highlightCfg: {
					radius: 5
				},
				tooltip: {
					trackMouse: true,
					width: 160,
					style: 'background-color: #fff',
					renderer: createTooltip(displayIds[0], displayNames[0], displayIds[1], displayNames[1])
				}

			}]
		});

	} else if (type == "Map") {
		
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
				var label = item.field;
				label = label.substr(0, label.length-1);
				this.setTitle(agentName+  " " + storeItem.get("agentIndex"));
				this.setHtml((storeItem.get("states")?("<p>" + storeItem.get("states") + "</p>"):"")+"<p>(" + commaStr(storeItem.get(label+"x")) + "; " + commaStr(storeItem.get(label+"y")) + ")</p>");
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
			addSeries("series_" + id + "__", agentName);
			for (var s = 0; s < a.data.states.length; s++) {
				var base = "series_" + id + "_" + a.data.states[s] + "_";
				var name = getName(findID(a.data.states[s]));
				addSeries(base, name);
			}

		}

		var store = new Ext.data.Store({
			fields: storeFields
		});


		chart = Ext.create("Ext.chart.CartesianChart", {

			flex: 1,
			interactions: ['crosszoom',  'itemhighlight'],
			legend: display.getAttribute('legendPosition') == "None" ? false : {
				docked: display.getAttribute('legendPosition') == "Automatic" ? (seriesBase.length > 4 ? 'right' : 'top') : display.getAttribute('legendPosition').toLowerCase()
			},
			animation: false,
			animate: false,
			
			shadow: false,
			store: store,
			axes: [{
				type: 'numeric',
				position: 'left',
				fields: yfields,
				grid: false,
				title: {
					text: quickLabel(display.getAttribute("yAxis"), display.getAttribute("name"), "Position (" + a.item.getAttribute("GeoDimUnits") + ")"),
					fontSize: 14
				},
				titleMargin: 20,
				renderer: commaStr,
				minimum: 0,
				maximum: parseFloat(simpleNum(a.data.height, a.data.units))
			},{
				type: 'numeric',
				position: 'bottom',
				fields: xfields,
				grid: false,
				titleMargin: 16,
				title: {
					text: quickLabel(display.getAttribute("xAxis"), display.getAttribute("name"), "Position (" + a.item.getAttribute("GeoDimUnits") + ")"),
					fontSize: 14
				},
				renderer: commaStr,
				minimum: 0,
				maximum: parseFloat(simpleNum(a.data.width, a.data.units))
			}],
			series: displaySeries,
			listeners: {
				'redraw': function(chart){
					
					if(this.oldLinks){
						for(var i=0; i<this.oldLinks.length; i++){
							this.oldLinks[i].destroy();
						}
						this.oldLinks = []; 
					}
					if(this.links){
						//window.chart=chart;
						var scaleX = function(v){
							var box = chart.getInnerRect();
							var outX = chart.getAxes()[1].getRange();
							
							return (v-outX[0])/(outX[1]-outX[0]) * box[2];
						}
						var scaleY = function(v){
							var box = chart.getInnerRect();
							var outY = chart.getAxes()[0].getRange();
							
							return box[3] - (v-outY[0])/(outY[1]-outY[0]) * box[3];
						}
						
						this.oldLinks = [];

						var color = "#aaa"; 
						var opacity = 0.5;
						var strokeWidth = 1;
						
						var defs = [];

						for(var link in this.links){

							var start = this.links[link][0];
							var end = this.links[link][1];
							//console.log(start)
							//console.log(end)
							var points = [[scaleX(start.items[0]), scaleY(start.items[1])], [scaleX(end.items[0]), scaleY(end.items[1])]];
						//	console.log(points)
						
						    var path = "M"+points[0][0]+" "+points[0][1]+" "; // start svg path parameters with given array
						    for (i = 1; i < points.length; i++) {
						        path = path+"L"+points[i][0]+" "+points[i][1]+" ";
						    }
						    path = path + "Z"; // end svg path params
							//console.log(path)
							
						    defs.push({
						        type: 'path',
						        opacity: opacity,
						        fill: color,
						        path: path,
						        stroke: color,
						        'stroke-width': strokeWidth
						    });
	
						}
						
					    this.oldLinks = chart.getSurface("main").add.apply(chart.getSurface("main"), defs);
					}
					
				}
			}
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

			html: "<div id='scratchpad" + analysisCount + "_" +display.id + "' style='z-index:1000;position:absolute; left:0px;bottom:0px;top:0px;right:0px;display:none;'></div>"
			/*,
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
			}]*/
		};
		return p;
	}

	function addSeries(base, name) {
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
		//console.log(displayInformation.colors)
		if (!isGray(displayInformation.colors[i])) {
			color = displayInformation.colors[i];
		} else {
			color = defaultColors[defaultColorIndex];
			defaultColorIndex++;
			defaultColorIndex = defaultColorIndex % defaultColors.length;
		}
		//console.log(color);

		var markers = [{
				type: "circle",
				radius: 5
			}, {
				type: "rect",
				width: 9,
				height: 9
			}, {
				type: 'path',
				path: [
					['M', 0, 1],
					['L', 1, 0],
					['L', 0, -1],
					['L', -1, 0],
					['Z']
				],
				scale: 6
			},

			{
				type: 'path',
				path: [
					['M', 0, -145],
					['L', 48, -50],
					['L', 153, -36],
					['L', 76, 39],
					['L', 93, 143],
					['L', 0, 95],
					['L', -93, 143],
					['L', -76, 39],
					['L', -153, -36],
					['L', -48, -50],
					['Z']
				],
				scalingX: 0.05,
				scalingY: -0.05
			}

		];

		displaySeries.push({
			title: name,
			animation: false,
			type: 'scatter',
			axis: "left",
			colors: [color],
			xField: base + "x",
			yField: base + "y",
			marker: markers[j % 5],
			highlight: true,
			highlightCfg: {
				radius: 5
			},
			tooltip: {
				trackMouse: true,
				width: 160,
				style: 'background-color: #fff',
				renderer: createAgentTips(agentName)
			}
		});
	}
}




function createResultsWindow(displayInformation, config) {
	displayInformation.maps = [];
	displayInformation.histograms = [];


	analysisCount++;

	var displays = primitives("Display");

	var tabs = [];
	var scripter = {
		time: 0
	};

	displayInformation.scripter = scripter;

	var selectedTab = 0;
	for (var i = 0; i < displays.length; i++) {
		tabs.push({
			xtype: "panel",
			autoScroll: false,
			title: displays[i].getAttribute("name"),
			items: [renderDisplay(displays[i], displayInformation)],
			layout: "fit",
			display: displays[i]
		});
		if(config && displays[i] == config.selectedDisplay){
			selectedTab = i;
		}
	}


	var rendered = new Ext.TabPanel({
		activeTab: selectedTab,
		flex: 1,
		deferredRender: false,
		frame: false,
		border: false,
		enableTabScroll: true,
		defaults: {
			autoScroll: true
		},
		items: tabs,
		listeners: {
			tabchange: enableTabs
		}
	});






	scripter.updatingSlider = false;
	scripter.timeIndex = 0;
	scripter.maxTime = function() {
		//console.log("Max: "+this.simulator.displayInformation.store.maxLoaded)
		return this.simulator.displayInformation.store.maxLoaded;
	};
	scripter.minTime = 0;
	scripter.timeStep = 2;
	scripter.times = displayInformation.times;
	scripter.simulator = simulate;

	scripter.showSliders = function() {
		if (!scripter.slidersShown) {
			if (sliderPrimitives(["Variable", "Flow"]).length > 0) {
				scripter.dockedPanel = Ext.create("Ext.Panel", {
					xtype: "panel",
					layout: "fit",
					items: [createSliders(["Variable", "Flow"], function(cell, value) {
						if (!scripter.isFinished) {
							var val = new Material(value);
							for (var i = 0; i < simulate.sliders[cell.id].length; i++) {
								simulate.sliders[cell.id][i].equation = val;
							}
							simulate.sliders[cell.id][0].dna.equation = val;
							simulate.valueChange = true;
						} else {
							mxUtils.alert("The simulation has finished and slider values cannot be changed.")
						}
					}, function(slider, setValue, textField, newValue) {
						setValue(slider.sliderCell, newValue)
					})],
					dock: "right",
					width: 200,
					autoScroll: true,
					title: "Sliders",
					collapsible: true,
					split: true,
					border: true,
					bodyStyle: "background: none",
					collapseDirection: "right",
					animCollapse: false
				});
				win.addDocked(scripter.dockedPanel);
			}
			scripter.slidersShown = true
		}
	}

	scripter.slider = Ext.create("Ext.form.SliderField", {
		minValue: 0,
		animate: false,
		hideLabel: true,
		disabled: true,
		maxValue: displayInformation.times.length - 1,
		flex: 1,
		step: scripter.timeStep,
		margin: '0 10 0 10',
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
			[0.2, getText("%s x Normal", "0.2")],
			[0.5, getText("%s x Normal", "0.5")],
			[1, getText("Normal Speed")],
			[1.5, getText("%s x Normal", "1.5")],
			[2, getText("%s x Normal", "2")],
			[5, getText("%s x Normal", "5")],
			[10, getText("%s x Normal", "10")],
			[-1, getText("Full Speed")]
		],
		queryMode: 'local',
		value: window.storyConverter?-1:((config && config.rate!==undefined)?config.rate:parseFloat(getSetting()
			.getAttribute("Throttle"))),
		width: 140,
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
		if (!this.s.updatingSlider) {
			if (newValue > this.s.maxTime()) {
				this.setValue(this.s.maxTime());
			} else {
				this.s.loadTime(newValue);
			}
		}
	});

	scripter.playBut = Ext.create("Ext.button.Button", {
		scale: 'medium',
		allowDepress: true,
		enableToggle: true,
		pressed: true,
		glyph: 0xf04c
	});

	//scripter.spinner = Ext.create("Ext.Component", {html:"<img width=16 height=16 src='/builder/images/spinner_small.gif'/>"})
	scripter.stopBut = Ext.create("Ext.button.Button", {
		scale: 'medium',
		margin: '0 10 0 10',
		glyph: 0xf04d,
		handler: function(btn) {
			endRunningSimulation();
		}
	});

	scripter.finished = function() {
		this.isFinished = true;
		this.stopBut.hide();
		//this.spinner.hide();
		this.slider.setDisabled(false);
		if (this.dockedPanel) {
			this.dockedPanel.collapse();
		}
	}

	scripter.playBut.s = scripter;

	scripter.animInter = -1;
	scripter.playBut.on("toggle", function(b, pressed) {
		if (pressed) {
			
			scripter.endMode = "wait";

			if (scripter.slider.getValue() == displayInformation.times.length - 1) {
				scripter.slider.setValue(scripter.minTime);
			}
			scripter.playBut.setGlyph(0xf04c);
			scripter.advanceTimer();
			
			clearInterval(scripter.animInter);
			scripter.animInter = setInterval(function() {
				scripter.advanceTimer()
			}, 100 / Math.min(0.5, scripter.combo.getValue()));

			if (scripter.simulator && !scripter.simulator.completed()) {
				scripter.simulator.shouldSleep = false;
				scripter.simulator.resume();
			}
			
		} else {
			scripter.pause(true);
		}
	});

	scripter.pause = function(shouldSleep) {
		//console.log("scripter pause")

		if (this.slider.isDisabled()) {
			this.showSliders();
		}

		if (shouldSleep && !this.isFinished) {
			this.slider.setValue(this.maxTime());
		}

		if (this.playBut.pressed) {
			this.playBut.toggle(false, true);
		}
		this.playBut.setGlyph(0xf04b);
		clearInterval(this.animInter);

		if (shouldSleep && !this.simulator.completed()) {
			//console.log("scripter sleep")
			this.simulator.sleep();
		}
	}


	scripter.endMode = "wait"; // "wait" or "pause"

	scripter.advanceTimer = function() {
		//console.log("advance")
		if ((this.slider.getValue() < this.maxTime()) || (this.maxTime() == displayInformation.times.length - 1)) {
			if (this.slider.getValue() < displayInformation.times.length - 1) {
				if (this.combo.getValue() == -1) {
					this.loadTime(this.maxTime());
				} else {
					this.loadTime(Math.min(this.maxTime(), this.slider.getValue() + this.timeStep * Math.max(0.5, this.combo.getValue())));
				}
			} else {
				//console.log("foo!")
				this.playBut.toggle();
			}
		} else {
			if (this.endMode == "pause" || scripter.isFinished) {
				this.pause();
			}
		}
	}

	scripter.loadTime = function(time) {
		displayInformation.store.clearFilter(true);
		this.time = time;
		//console.log(time);
		displayInformation.store.filter([{
			filterFn: function(item) {
				return item.get("id") <= time;
			}
		}]);

		displayInformation.maps.forEach(function(x) {
			buildMapStore(x, time);
		});
		displayInformation.histograms.forEach(function(x) {
			buildHistogramStore(x, time);
		});

		this.updatingSlider = true;
		this.slider.setValue(time);
		this.updatingSlider = false;
	}

	function enableTabs() {
		var tabs = win.tabs;
		var index = tabs.items.indexOf(tabs.getActiveTab())
		win.down("#delete").setDisabled(win.displays.length == 0);
		win.down("#left").setDisabled(win.displays.length < 2 || index == 0);
		win.down("#right").setDisabled(win.displays.length < 2 || index == win.displays.length-1);
		win.down("#scratchpad").setDisabled(win.displays.length == 0 || win.displays[index].getAttribute("Type") == "Tabular");
		win.down("#configure").setDisabled(win.displays.length == 0);
	}

	var winConfig = {
		title: getText('Simulation Results %s', analysisCount),
		analysisCount: analysisCount,
		scratchPadStatus: {},
		closable: true,
		displays: displays,
		tabs: rendered,
		renderTo: 'ribbonPanel',
		constrain: true,
		maximized: viewConfig.fullScreenResults,
		expandedState: true,
		displayInformation: displayInformation,
		minWidth: 350,
		minHeight: 300,
		width: Math.min(Ext.getBody().getViewSize().width, 640),
		height: Math.min(Ext.getBody().getViewSize().height, (!viewConfig.showResultsEdit) ? 540 : 550),
		resizable: true,
		maximizable: true,
		minimizable: true,
		simulate: simulate,
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
			margin: '5 10 10 10',
			items: [scripter.playBut, scripter.slider, scripter.combo, scripter.stopBut]
		}],

		dockedItems: [{
			xtype: 'toolbar',
			enableOverflow: true,
			dock: 'top',
			hidden: (!viewConfig.showResultsEdit),
			items: [{
					glyph: 0xf055,
					scale: "large",
					text: getText('Add Display'),
					iconCls: 'green-icon',
					handler: function() {
						var parent = graph.getDefaultParent();
						var win = this.findParentByType("window");
						var vertex;
						graph.getModel()
							.beginUpdate();
						vertex = graph.insertVertex(parent, null, primitiveBank.display.cloneNode(true), 10, 10, 64, 64, "display");
						vertex.visible = false;

						setName(vertex, "New Display");
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


						enableTabs();
					}
				}, {
					scale: "large",
					glyph: 0xf014,
					iconCls: 'red-icon',
					tooltip: getText('Delete Display'),
					itemId: "delete",
					handler: function() {

						var win = this.findParentByType("window");
						if (win.displays.length > 0) {

							Ext.MessageBox.confirm('Delete Display', 'Are you sure you want to delete the display? This cannot be undone.', function(btn) {
								if (btn === 'yes') {

									var tabs = win.tabs;
									var tabIndex = tabs.items.indexOf(tabs.getActiveTab());

									graph.getModel()
										.beginUpdate();
									graph.removeCells([win.displays[tabIndex]], false);
									graph.getModel()
										.endUpdate();
									win.displays.splice(tabIndex, 1);
									tabs.remove(tabs.getActiveTab());

									enableTabs();
								}
							});


						} else {

							mxUtils.alert(getText("No chart or table to delete."), "error", true);
						}
					}
				}, '-', {
					scale: "large",
					glyph: 0xf137,
					text: '',
					tooltip: getText("Move display to the left."),
					itemId: "left",
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
							mxUtils.alert(getText("No chart or table to reorder."), "error", true);
						}
					}
				}, {
					scale: "large",
					glyph: 0xf138,
					text: '',
					tooltip: getText("Move display to the right."),
					itemId: "right",
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
							mxUtils.alert(getText("No chart or table to reorder."), "error", true);
						}
					}
				}, '->', {
					scale: "large",
					glyph: 0xf040,
					text: getText(''),
					tooltip: getText('Scratchpad'),
					itemId: "scratchpad",
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
									if (Ext.get(id)) {
										Ext.get(id)
											.setDisplayed("block");
										Scratchpad($('#' + id));
										win.scratchPadStatus[id] = "shown";
									} else {
										mxUtils.alert(getText("Scratchpads can only be shown for charts with data."), "error", true);
									}
								}
								return;
							}
						}
						mxUtils.alert(getText("Scratchpads can only be shown for charts."), "error", true);

					}
				}, {
					scale: "large",
					glyph: 0xf085,
					text: getText('Configure'),
					itemId: "configure",
					handler: function() {
						var win = this.findParentByType("window");
						if (win.displays.length > 0) {
							openDisplayConfigure(win);
						} else {
							mxUtils.alert(getText("Add a chart or table to configure it."), "notice", true);
						}
					}
				}

			]
		}]
	};

	if (is_ebook) {
		winConfig.maximizable = false;
		winConfig.closable = false;
		winConfig.resizable = false;
		winConfig.minimizable = false;
	}

	winConfig.stateful = is_editor && (!is_embed);
	winConfig.stateId = "results_window";
	
	winConfig.tools = [
		{
		    type: 'pin',
		    tooltip: getText('Link Results to Model'),
			pinned: false,
			itemId: "pinTool",
		    callback: function(panel, tool, event) {
				if(tool.pinned){
					tool.pinned = false;
					tool.setStyle('opacity', 0.4);
					linkedResults = undefined;
					
				}else{
					tool.pinned = true;
					tool.setStyle('opacity', 1);
					linkedResults = win;
					
					Ext.WindowMgr.each(
					      function(other){
	  						if (win != other) {
	  							var t = other.down("#pinTool");
	  							if(t && t.pinned){
	  								t.pinned = false;
	  								t.setStyle('opacity', 0.4);
	  							}
	  						}
					      }
					  );
					  
					  for(var id in win.sliders){
						  var cell = win.sliders[id][0];
						  var v = evaluateTree(trimTree(cell.dna.value), varBank).value
						  setValue(findID(id), v);
					  }
					  
					  selectionChanged(true);
				
				}
		    },
			style: {
				opacity: 0.4
			}
		},
		{
			type: 'gear',
			tooltip: 'Edit Tite',
			handler: function(){
				Ext.Msg.prompt('Edit Results Title', 'Enter the title for these simulation results:', function(btn, text){
					if (btn == 'ok'){
						win.setTitle(text);
					 }
				}, this, false, win.getTitle());
			}
		}
	]

	var win = new Ext.Window(winConfig);
	win.on('minimize', function(w) {
		if (w.expandedState) {
			w.expandedState = false;
			w.collapse();
		} else {
			w.expandedState = true;
			win.expand();
		}
	});
	


	enableTabs();

	win.enableTabs = enableTabs;


	win.on('close', function(w) {
		if(linkedResults == win){
			linkedResults = undefined;
		}
		if (!scripter.simulator.completed()) {
			scripter.simulator.terminate();
		}
		clearInterval(scripter.animInter);
	})

	win.scripter = scripter;
	win.show();

	return win;
}

function buildMapStore(item, time) {
	var res = [];

	var connections = {};
	var locations = {};

	for (var i = 0; i < item.agents.length; i++) {
		var agent = item.agents[i];
		var xNull = -parseFloat(simpleNum(agent.data.width, agent.data.units));
		var yNull = -parseFloat(simpleNum(agent.data.height, agent.data.units));

		//console.log("--")
		//console.log(time);
		//console.log(item);
		//console.log(item.agents[i])
		var data = item.agents[i].results[time].current;
		for (var j = 0; j < data.length; j++) {
			locations[data[j].instanceId] = data[j].location;
			connections[data[j].instanceId] = data[j].connected;

			if (data[j].state !== null) {
				var states = data[j].state.map(function(x) {
					return x.dna.name
				}).join(", ");
			} else {
				var states = "";
			}

			var x = createDummyBase();
			var base = "series_" + agent.id + "__";
			x[base + "x"] = data[j].location.items[0];
			x[base + "y"] = data[j].location.items[1];
			res.push(x);

			if (data[j].state !== null) {
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
	//XXX
	//console.log(connections);

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
	var connectKeys = Object.keys(connections);
	for (var j = 0; j < connectKeys.length; j++) {
		var id = connectKeys[j];
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
	//console.log(displayInformation);
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

	var chart = Ext.create("Ext.chart.CartesianChart", {
		xtype: 'chart',
		flex: 1,
		animation: false,
		interactions: ['crosszoom' ],
		shadow: false,
		store: store,
		axes: [{
			type: 'category',
			position: 'bottom',
			fields: ['Label'],
			title: displayInformation.headers[i]
		}, {
			type: 'numeric',
			position: 'left',
			fields: 'Count',
			titleMargin: 20,
			decimals: 0,
			minimum: 0
		}],
		series: [{
			type: 'bar',
			xField: 'Label',
			yField: "Count",
			titleMargin: 16,
			gutter: 5,
			tooltip: {
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
