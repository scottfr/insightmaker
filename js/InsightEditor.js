"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


Ext.onReady(function() {
	main();
});

//make html edit links target blank
Ext.override(Ext.form.HtmlEditor, {
	createLink: function() {
		var url = prompt(this.createLinkText, this.defaultLinkValue);

		if (url && url != 'http:/' + '/') {
			var txt = this.win.getSelection();
			if (txt == "") {
				txt = url;
			}
			txt = '<a href="' + url + '" target="_blank">' + txt + '</a>';

			if (Ext.isIE) {
				range = this.getDoc().selection.createRange();
				if (range) {
					range.pasteHTML(txt);
					this.syncValue();
					this.deferFocus();
				}
			} else {
				this.execCmd('InsertHTML', txt);
				this.deferFocus();
			}
		}
	}
});

window.addEventListener('message', callAPI, false);

function callAPI(e) {
	try {
		e.source.postMessage(eval(e.data));
	} catch (err) {

	}
}

function isLocal() {
	return (document.location.hostname == "localhost");
}

mxGraph.prototype.stopEditing=function(a){if(this.cellEditor!==null){this.cellEditor.stopEditing(a)}}


var equationRenderer = function(eq) {
	var res = eq;
	if (/\\n/.test(res)) {
		var vals = res.match(/(.*?)\\n/);
		res = vals[1] + "...";
	}

	res = res.replace(/</g, "&lt;");
	res = res.replace(/>/g, "&gt;");
	res = res.replace(/\[(.*?)\]/g, "<font color='Green'>[$1]</font>");
	res = res.replace(/(&lt;&lt;.*?&gt;&gt;)/g, "<font color='Orange'>$1</font>");
	res = res.replace(/(«.*?»)/g, "<font color='Orange'>$1</font>");
	res = res.replace(/\b([\d\.e]+)\b/g, "<font color='DeepSkyBlue'>$1</font>");
	res = res.replace(/(\{.*?\})/g, "<font color='Orange'>$1</font>");

	return clean(res);
};


if (!isLocal()) {
	window.onerror = function(err, file, line) {
		if(! /removeChild/.test(err)){
			var msg = [err, file, line].join(' : ');
			_gaq.push(['_trackEvent', 'Errors', 'App', msg, null, true]);
			//alert("Javascript Error\n\n" + err + "\n\n(" + file + " " + line + ")\n\nIf this error persists, please contact us for support.");
			console.log(msg);
			return true;
		}
	}
}

try {
	mxUtils.alert = function(message) {
		Ext.example.msg("<table><tr><td valign='top'><img src='"+builder_path+"/images/stop.png' style='padding-right:.3em;' width=48px height=48px  /></td><td>" + message + "</td></tr></table>", '');
	};
} catch (err) {
	alert("Insight Maker failed to load all its resources. Check your network connection and try to reload Insight Maker.");
}


var GraphEditor = {};
var mainPanel;
var mxPanel;
var ribbonPanel;
var configPanel;
var sizeChanging;
var graph;
var sliders = [];
var settingCell;
var selectionChanged;
var primitiveBank = {};
var clipboardListener;

function main() {


	Ext.QuickTips.init();

	try {
		mxEvent.disableContextMenu(document.body);
	} catch (err) {
		return; // resources not loaded. error message should already have been shown.
	}
	mxConstants.DEFAULT_HOTSPOT = 0.3;

	//Change the settings for touch devices
	if (isTouch()) {
		mxConstants.HANDLE_SIZE = 14;
		mxConstants.DEFAULT_HOTSPOT = 0.5;
	}

	graph = new mxGraph();

	var history = new mxUndoManager();
	
	var node = mxUtils.parseXml('<mxStylesheet> 	<add as="defaultVertex" extend="defaultVertex"> 		<add as="strokeColor" value="#666666"/> 		<add as="fontColor" value="#333333"/> 		<add as="fontSize" value="14"/> 		<add as="fontFamily" value="Comic Sans MS"/> 		<add as="strokeWidth" value="2"/> 	</add> 	<add as="defaultEdge" extend="defaultEdge"> 		<add as="labelBackgroundColor" value="white"/> 		<add as="rounded" value="1"/> 		<add as="fontSize" value="14"/> 		<add as="edgeStyle" value="elbowEdgeStyle"/> 		<add as="fontFamily" value="Comic Sans MS"/> 		<add as="strokeWidth" value="4"/> 	</add> 	<add as="stock" extend="defaultVertex"> 		<add as="fillColor" value="#A6D3F8"/> 	</add> 	<add as="state" extend="defaultVertex"> 		<add as="fillColor" value="#ffffff"/> 	</add> 	<add as="transition" extend="defaultEdge"> 		<add as="strokeColor" value="#000000"/> 		<add as="fontColor" value="#000000"/> 	</add> 	<add as="agents" extend="defaultVertex"> 		<add as="fillColor" value="#F0E68C"/> 		<add as="shape" value="cloud"/> 	</add> 	<add as="textArea" extend="defaultVertex"> 		<add as="strokeColor" value="none"/> 		<add as="fillColor" value="none"/> 		<add as="fontColor" value="black"/> 		<add as="fontSize" value="30"/> 		<add as="fontStyle" value="4"/> 	</add> 	<add as="text" extend="defaultVertex"> 		<add as="strokeColor" value="none"/> 		<add as="fillColor" value="none"/> 		<add as="fontColor" value="black"/> 		<add as="fontSize" value="30"/> 		<add as="fontStyle" value="4"/> 	</add> 	 	<add as="parameter" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FDCDAC"/> 	</add> 	<add as="variable" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FDCDAC"/> 	</add> 	<add as="action" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FFFFFF"/> 	</add> 	<add as="converter" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#B3E2CD"/> 	</add> 	<add as="button" extend="defaultVertex"> 		<add as="rounded" value="1"/> 		<add as="glass" value="1"/> 		<add as="fillColor" value="#C0C0C0"/> 		<add as="fontColor" value="black"/> 		<add as="strokeWidth" value="3"/> 		<add as="fontFamily" value="Helvetica"/> 	</add> 	<add as="display" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="fillColor" value="#FFFFFF"/> 		<add as="strokeColor" value="#FFFFFF"/> 		<add as="fontColor" value="#FFFFFF"/> 		<add as="opacity" value="0"/> 	</add> 	<add as="picture" extend="defaultVertex"> 		<add as="shape" value="image"/> 		<add as="verticalLabelPosition" value="bottom"/> 		<add as="verticalAlign" value="top"/> 	</add> 	 	<add as="entity" extend="defaultEdge"> 		<add as="strokeColor" value="#808080"/> 		<add as="fontColor" value="#808080"/> 		<add as="opacity" value="70"/> 		<add as="edgeStyle" value="straight"/> 		<add as="strokeWidth" value="2"/> 		<add as="dashed" value="1"/> 		<add as="noLabel" value="0"/> 	</add> 	<add as="flow" extend="defaultEdge"> 	</add> 	<add as="link" extend="defaultEdge"> 		<add as="strokeColor" value="#808080"/> 		<add as="fontColor" value="#808080"/> 		<add as="opacity" value="70"/> 		<add as="edgeStyle" value="straight"/> 		<add as="strokeWidth" value="2"/> 		<add as="dashed" value="1"/> 		<add as="noLabel" value="0"/> 	</add> 	 	<add as="line" extend="defaultVertex"> 		<add as="shape" value="line"/> 		<add as="strokeWidth" value="4"/> 		<add as="labelBackgroundColor" value="white"/> 		<add as="verticalAlign" value="top"/> 		<add as="spacingTop" value="8"/> 	</add> 	<add as="image" extend="defaultVertex"> 		<add as="shape" value="image"/> 		<add as="verticalLabelPosition" value="bottom"/> 		<add as="verticalAlign" value="top"/> 	</add> 	 	<add as="folder" extend="defaultVertex"> 		<add as="verticalAlign" value="top"/> 		<add as="dashed" value="1"/> 		<add as="fillColor" value="none"/> 		<add as="rounded" value="1"/> 	</add> </mxStylesheet> ');
	var dec = new mxCodec(node);
	dec.decode(node.documentElement, graph.getStylesheet());

	graph.alternateEdgeStyle = 'vertical';
	graph.connectableEdges = true;
	graph.disconnectOnMove = false;
	graph.edgeLabelsMovable = true;
	graph.enterStopsCellEditing = true;
	graph.allowLoops = false;


	mxEdgeHandler.prototype.addEnabled = true;
	mxEdgeHandler.prototype.removeEnabled = true;

	graph.isHtmlLabel = function(cell) {
		var isHTML = cell != null && cell.value != null && (cell.value.nodeName != "Flow" && cell.value.nodeName != "Display");

		return isHTML;
	};
	graph.isWrapping = graph.isHtmlLabel;

	graph.isCellLocked = function(cell) {
		return (!is_editor);
	}
	graph.isCellSelectable = function(cell) {
		return (cell.value.nodeName != "Setting" && cell.value.nodeName != "Display");
		//(is_editor && (cell.value.nodeName!="Setting"));
	}
	graph.isCellEditable = function(cell) {
		if (!is_editor) {
			return false;
		}
		return (cell.value.nodeName != "Display" && cell.value.nodeName != "Setting" && cell.value.nodeName != "Ghost");
	}

	graph.getCursorForCell = function(cell) {
		if (cell.value.nodeName == "Button") {
			return "pointer";
		}
	}
	graph.convertValueToString = function(cell) {
		if (mxUtils.isNode(cell.value)) {
			if (cell.value.nodeName == "Link" && orig(cell).getAttribute("name") == "Link") {
				return "";
				//} else if(cell.value.nodeName == "Button"){
				//return "<span style='cursor:hand;'>"+cell.getAttribute("name")+"</span>";
			} else {
				return clean(orig(cell).getAttribute("name"));
			}
		}
		return '';
	};

	var cellLabelChanged = graph.cellLabelChanged;
	graph.labelChanged = function(cell, newValue, evt) {
		if (validPrimitiveName(newValue, cell)) {
			graph.model.beginUpdate();
			var edit = new mxCellAttributeChange(cell, "name", newValue);
			graph.getModel().execute(edit);
			selectionChanged(false);
			propogateGhosts(cell);
			graph.model.endUpdate();
			return cell;
		}
	};

	var getEditingValue = graph.getEditingValue;
	graph.getEditingValue = function(cell) {
		if (mxUtils.isNode(cell.value)) {
			return cell.getAttribute('name');
		}
	};

	setupHoverIcons();

	var doc = mxUtils.createXmlDocument();

	primitiveBank.text = doc.createElement('Text');
	primitiveBank.text.setAttribute('name', 'Text Area');
	primitiveBank.text.setAttribute('LabelPosition', "Middle");

	primitiveBank.folder = doc.createElement('Folder');
	primitiveBank.folder.setAttribute('name', 'New Folder');
	primitiveBank.folder.setAttribute('Note', '');
	primitiveBank.folder.setAttribute('Type', 'None');
	primitiveBank.folder.setAttribute('Image', 'None');
	primitiveBank.folder.setAttribute('FlipHorizontal', false);
	primitiveBank.folder.setAttribute('FlipVertical', false);
	primitiveBank.folder.setAttribute('LabelPosition', "Middle");

	primitiveBank.ghost = doc.createElement('Ghost');
	primitiveBank.ghost.setAttribute('Source', '');

	primitiveBank.picture = doc.createElement('Picture');
	primitiveBank.picture.setAttribute('name', '');
	primitiveBank.picture.setAttribute('Note', '');
	primitiveBank.picture.setAttribute('Image', 'Growth');
	primitiveBank.picture.setAttribute('FlipHorizontal', false);
	primitiveBank.picture.setAttribute('FlipVertical', false);
	primitiveBank.picture.setAttribute('LabelPosition', "Bottom");

	primitiveBank.display = doc.createElement('Display');
	primitiveBank.display.setAttribute('name', 'New Display');
	primitiveBank.display.setAttribute('Note', '');
	primitiveBank.display.setAttribute('Type', 'Time Series');
	primitiveBank.display.setAttribute('xAxis', 'Time (%u)');
	primitiveBank.display.setAttribute('yAxis', '');
	primitiveBank.display.setAttribute('yAxis2', '');
	primitiveBank.display.setAttribute('showMarkers', false);
	primitiveBank.display.setAttribute('showLines', true);
	primitiveBank.display.setAttribute('showArea', false);
	primitiveBank.display.setAttribute('ThreeDimensional', false);
	primitiveBank.display.setAttribute('Primitives', '');
	primitiveBank.display.setAttribute('Primitives2', '');
	primitiveBank.display.setAttribute('AutoAddPrimitives', false);
	primitiveBank.display.setAttribute('ScatterplotOrder', 'X Primitive, Y Primitive');
	primitiveBank.display.setAttribute('Image', 'Display');
	primitiveBank.display.setAttribute('FlipHorizontal', false);
	primitiveBank.display.setAttribute('FlipVertical', false);
	primitiveBank.display.setAttribute('LabelPosition', "Bottom");

	function setValuedProperties(cell) {
		cell.setAttribute('Units', "Unitless")
		cell.setAttribute('MaxConstraintUsed', false)
		cell.setAttribute('MinConstraintUsed', false)
		cell.setAttribute('MaxConstraint', '100');
		cell.setAttribute('MinConstraint', '0');
		cell.setAttribute('ShowSlider', false);
		cell.setAttribute('SliderMax', 100);
		cell.setAttribute('SliderMin', 0);
	}

	primitiveBank.stock = doc.createElement('Stock');
	primitiveBank.stock.setAttribute('name', 'New Stock');
	primitiveBank.stock.setAttribute('Note', '');
	primitiveBank.stock.setAttribute('InitialValue', '0');
	primitiveBank.stock.setAttribute('StockMode', 'Store');
	primitiveBank.stock.setAttribute('Delay', '10');
	primitiveBank.stock.setAttribute('Volume', '100');
	primitiveBank.stock.setAttribute('NonNegative', false);
	setValuedProperties(primitiveBank.stock);
	primitiveBank.stock.setAttribute('Image', 'None');
	primitiveBank.stock.setAttribute('FlipHorizontal', false);
	primitiveBank.stock.setAttribute('FlipVertical', false);
	primitiveBank.stock.setAttribute('LabelPosition', "Middle");

	primitiveBank.state = doc.createElement('State');
	primitiveBank.state.setAttribute('name', 'New State');
	primitiveBank.state.setAttribute('Note', '');
	primitiveBank.state.setAttribute('Active', 'false');
	primitiveBank.state.setAttribute('Image', 'None');
	primitiveBank.state.setAttribute('FlipHorizontal', false);
	primitiveBank.state.setAttribute('FlipVertical', false);
	primitiveBank.state.setAttribute('LabelPosition', "Middle");

	primitiveBank.transition = doc.createElement('Transition');
	primitiveBank.transition.setAttribute('name', 'Transition');
	primitiveBank.transition.setAttribute('Note', '');
	primitiveBank.transition.setAttribute('Trigger', 'Timeout');
	primitiveBank.transition.setAttribute('Value', '0');
	setValuedProperties(primitiveBank.transition);
	
	primitiveBank.action = doc.createElement('Action');
	primitiveBank.action.setAttribute('name', 'New Action');
	primitiveBank.action.setAttribute('Note', '');
	primitiveBank.action.setAttribute('Trigger', 'Condition');
	primitiveBank.action.setAttribute('Value', 'true');
	primitiveBank.action.setAttribute('Action', 'Move([Self], <<rand, rand>>)');

	primitiveBank.agents = doc.createElement('Agents');
	primitiveBank.agents.setAttribute('name', 'New Agent Population');
	primitiveBank.agents.setAttribute('Note', '');
	primitiveBank.agents.setAttribute('Size', 100);
	primitiveBank.agents.setAttribute('GeoWrap', false);
	primitiveBank.agents.setAttribute('GeoDimUnits', 'Unitless');
	primitiveBank.agents.setAttribute('GeoWidth', 200);
	primitiveBank.agents.setAttribute('GeoHeight', 100);
	primitiveBank.agents.setAttribute('Placement', "Random");
	primitiveBank.agents.setAttribute('PlacementFunction', "<<rand*width([Self]), rand*height([Self])>>");
	primitiveBank.agents.setAttribute('Network', "None");
	primitiveBank.agents.setAttribute('NetworkFunction', "randBoolean(0.02)");
	primitiveBank.agents.setAttribute('Agent', '');
	primitiveBank.agents.setAttribute('Image', 'None');
	primitiveBank.agents.setAttribute('FlipHorizontal', false);
	primitiveBank.agents.setAttribute('FlipVertical', false);
	primitiveBank.agents.setAttribute('LabelPosition', "Middle");

	primitiveBank.variable = doc.createElement('Variable');
	primitiveBank.variable.setAttribute('name', 'New Variable');
	primitiveBank.variable.setAttribute('Note', '');
	primitiveBank.variable.setAttribute('Equation', '0');
	setValuedProperties(primitiveBank.variable);
	primitiveBank.variable.setAttribute('Image', 'None');
	primitiveBank.variable.setAttribute('FlipHorizontal', false);
	primitiveBank.variable.setAttribute('FlipVertical', false);
	primitiveBank.variable.setAttribute('LabelPosition', "Middle");

	primitiveBank.button = doc.createElement('Button');
	primitiveBank.button.setAttribute('name', 'New Button');
	primitiveBank.button.setAttribute('Note', '');
	primitiveBank.button.setAttribute('Function', 'showMessage("Button action triggered!\\n\\nIf you want to edit this Action, click on the button while holding down the Shift key on your keyboard.")');
	primitiveBank.button.setAttribute('Image', 'None');
	primitiveBank.button.setAttribute('FlipHorizontal', false);
	primitiveBank.button.setAttribute('FlipVertical', false);
	primitiveBank.button.setAttribute('LabelPosition', "Middle");

	primitiveBank.converter = doc.createElement('Converter');
	primitiveBank.converter.setAttribute('name', 'New Converter');
	primitiveBank.converter.setAttribute('Note', '');
	primitiveBank.converter.setAttribute('Source', 'Time');
	primitiveBank.converter.setAttribute('Data', '0,0; 1,1; 2,4; 3,9');
	primitiveBank.converter.setAttribute('Interpolation', 'Linear');
	setValuedProperties(primitiveBank.converter);
	primitiveBank.converter.setAttribute('Image', 'None');
	primitiveBank.converter.setAttribute('FlipHorizontal', false);
	primitiveBank.converter.setAttribute('FlipVertical', false);
	primitiveBank.converter.setAttribute('LabelPosition', "Middle");

	primitiveBank.flow = doc.createElement('Flow');
	primitiveBank.flow.setAttribute('name', 'Flow');
	primitiveBank.flow.setAttribute('Note', '');
	primitiveBank.flow.setAttribute('FlowRate', '0');
	primitiveBank.flow.setAttribute('OnlyPositive', true);
	primitiveBank.flow.setAttribute('TimeIndependent', false);
	setValuedProperties(primitiveBank.flow);

	primitiveBank.link = doc.createElement('Link');
	primitiveBank.link.setAttribute('name', 'Link');
	primitiveBank.link.setAttribute('Note', '');
	primitiveBank.link.setAttribute('BiDirectional', false);

	primitiveBank.setting = doc.createElement('Setting');
	primitiveBank.setting.setAttribute('Note', '');
	primitiveBank.setting.setAttribute('Version', '25');
	primitiveBank.setting.setAttribute('Throttle', '1');
	primitiveBank.setting.setAttribute('TimeLength', '100');
	primitiveBank.setting.setAttribute('TimeStart', '0');
	primitiveBank.setting.setAttribute('TimeStep', '1');
	primitiveBank.setting.setAttribute('TimeUnits', 'Years');
	primitiveBank.setting.setAttribute('Units', "");
	primitiveBank.setting.setAttribute("HiddenUIGroups", ["Validation", "User Interface"]);
	primitiveBank.setting.setAttribute("SolutionAlgorithm", "RK1");
	primitiveBank.setting.setAttribute("BackgroundColor", "white");
	primitiveBank.setting.setAttribute("Macros", "");
	primitiveBank.setting.setAttribute("SensitivityPrimitives", "");
	primitiveBank.setting.setAttribute("SensitivityRuns", 50);
	primitiveBank.setting.setAttribute("SensitivityBounds", "50, 80, 95, 100");
	primitiveBank.setting.setAttribute("SensitivityShowRuns", "false");
	primitiveBank.setting.setAttribute("StrictUnits", "true");

	
	mxPanel = Ext.create('Ext.Panel', {
		border: false
	});
	
	mainPanel = Ext.create('Ext.Panel', {
		region: 'center',
		border: false,layout:"fit",
		items: [mxPanel]
	});
	
	mainPanel.on('resize', function() {
		graph.sizeDidChange();
	});

	configPanel = Ext.create('Ext.Panel', ConfigPanel(graph, history));
	ribbonPanel = Ext.create('Ext.Panel', RibbonPanel(graph, history, mainPanel, configPanel));

	var viewport = new Ext.Viewport({
		layout: 'border',
		padding: '19 5 5 5',
		items: [ribbonPanel]
	});

	var connectionChangeHandler = function(sender, evt) {
			var item = evt.getProperty("edge");
			if (item.value.nodeName == "Link") {
				linkBroken(item);
			}
		};
	graph.addListener(mxEvent.CELL_CONNECTED, connectionChangeHandler);
	
	graph.addListener(mxEvent.CELLS_FOLDED, function(graph, e){
		if(! e.properties.collapse){
			graph.orderCells(false, e.properties.cells);
		}
	});

	mainPanel.body.insertHtml("beforeBegin",  "<div id='mainGraph'  style='z-index:1000;position:absolute; width:100%;height:100%;display:none;'></div>");

	mxPanel.body.dom.style.overflow = 'auto';
	if (mxClient.IS_MAC && mxClient.IS_SF) {
		graph.addListener(mxEvent.SIZE, function(graph) {
			graph.container.style.overflow = 'auto';
		});
	}

	graph.model.styleForCellChanged = function(cell, style) {
		var x = mxGraphModel.prototype.styleForCellChanged(cell, style);
		propogateGhosts(cell);
		return x;
	}

	graph.model.addListener(mxEvent.CHANGED, function(graph) {
		setSaveEnabled(true);
	});

	graph.model.addListener(mxEvent.CHANGE, function(sender, evt) {
		var changes = evt.getProperty('changes');

		if ((changes.length < 10) && changes.animate) {
			mxEffects.animateChanges(graph, changes);
		}
	});

	graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt) {
		var cells = evt.getProperty('cells');
		for (var i = 0; i < cells.length; i++) {
			deletePrimitive(cells[i]);
			if (cells[i].value.nodeName == "Folder") {
				var children = childrenCells(cells[i]);
				if (children != null) {
					for (var j = 0; j < children.length; j++) {
						deletePrimitive(children[j]);
					}
				}
			}
		}
		selectionChanged(true);
	});

	graph.addListener(mxEvent.CLICK, function(sender, evt) {

		var cell = evt.getProperty('cell');
		var realEvt = evt.getProperty('event');
		if (!evt.isConsumed()) {
			var panel = ribbonPanelItems().getComponent('valued');

			if ((cell == null || cell.value.nodeName == "Folder") && nodeInsertSelected()) {
				var pt = graph.getPointForEvent(realEvt);
				var parent;
				var x0, y0;
				if (cell != null && cell.value.nodeName == "Folder") {
					parent = cell;
					x0 = cell.geometry.getPoint().x;

					y0 = cell.geometry.getPoint().y;
				} else {
					parent = graph.getDefaultParent();
					x0 = 0;
					y0 = 0;
				}

				var vertex;
				graph.getModel().beginUpdate();
				try {
					if (panel.getComponent('stock').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.stock.cloneNode(true), pt.x - 50 - x0, pt.y - 20 - y0, 100, 40, 'stock');
					} else if (panel.getComponent('variable').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.variable.cloneNode(true), pt.x - 50 - x0, pt.y - 25 - y0, 120, 50, "variable");
					} else if (panel.getComponent('text').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.text.cloneNode(true), pt.x - 100 - x0, pt.y - 25 - y0, 200, 50, "text");
					} else if (panel.getComponent('converter').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.converter.cloneNode(true), pt.x - 50 - x0, pt.y - 25 - y0, 120, 50, "converter");
					} else if (panel.getComponent('buttonBut').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.button.cloneNode(true), pt.x - 50 - x0, pt.y - 25 - y0, 120, 40, "button");
					} else if (panel.getComponent('picture').pressed) {
						vertex = graph.insertVertex(parent, null, primitiveBank.picture.cloneNode(true), pt.x - 24 - x0, pt.y - 24 - y0, 64, 64, "picture");
						setPicture(vertex);
					}

					panel.getComponent('stock').toggle(false);
					panel.getComponent('variable').toggle(false);
					panel.getComponent('text').toggle(false);
					panel.getComponent('converter').toggle(false);
					panel.getComponent('picture').toggle(false);
					panel.getComponent('buttonBut').toggle(false);



					if (isValued(vertex) || (vertex.value.nodeName == "Agents")) {
						var displays = primitives("Display");
						for (var i = 0; i < displays.length; i++) {
							var d = displays[i];
							if (isTrue(d.getAttribute("AutoAddPrimitives")) && d.getAttribute("Type") != "Scatterplot" && (d.getAttribute("Type") != "Map" || vertex.value.nodeName == "Agents")) {
								var s = d.getAttribute("Primitives");
								if (typeof(s) == "undefined") {
									d.setAttribute("Primitives", vertex.id);
								} else {
									var items = s.split(",");
									items.push(vertex.id);
									d.setAttribute("Primitives", items.join(","));
								}
							}
						}
					}
				} finally {
					graph.setSelectionCell(vertex);
					graph.getModel().endUpdate();
					evt.consume();
					graph.cellEditor.startEditing(vertex);
				}
			} else if (cell == null) {
				graph.clearSelection();
			}
		}
	});


	// Initializes the graph as the DOM for the panel has now been created	
	graph.init(mxPanel.body.dom);
	graph.setConnectable(is_editor);
	graph.setDropEnabled(true);
	graph.setSplitEnabled(false);
	graph.connectionHandler.connectImage = new mxImage(builder_path+'/images/connector.gif', 16, 16);
	graph.connectionHandler.isConnectableCell = function(cell){
		//console.log(cell);
		if(! cell){
			return false;
		}
		var type = connectionType();
		if(cell.value.nodeName == "Link" || type == "None"){
			return false;
		}
		if(type == "Link"){
			return true;
		}else{
			var o = orig(cell);
            return o.value.nodeName == "Stock" || o.value.nodeName == "State";  
		}
	}
	graph.setPanning(true);
	graph.setTooltips(false);
	graph.connectionHandler.setCreateTarget(false);



	var rubberband = new mxRubberband(graph);

	var parent = graph.getDefaultParent();


	graph.panningHandler.popup = mxUtils.bind(mxPanel, function(x, y, cell, evt) {
		if (!evt.shiftKey) {
			showContextMenu(null, evt);
		}
	});
	
	
	graph.model.addListener(mxEvent.CHANGED, clearPrimitiveCache);



	settingCell = graph.insertVertex(parent, null, primitiveBank.setting, 20, 20, 80, 40);
	settingCell.visible = false;
	var firstdisp = graph.insertVertex(parent, null, primitiveBank.display.cloneNode(true), 50, 20, 64, 64, "roundImage;image="+builder_path+"/images/DisplayFull.png;");
	firstdisp.visible = false;
	firstdisp.setAttribute("AutoAddPrimitives", true);
	firstdisp.setAttribute("name", "Default Display");



	graph.getEdgeValidationError = function(edge, source, target) {
		if ((edge != null && (edge.value.nodeName == "Flow" || edge.value.nodeName == "Transition")) || (this.model.getValue(edge) == null && ribbonPanelItems().getComponent('connect').getComponent('flow').pressed)) {
			if (isDefined(source) && source !== null && source.isConnectable()) {
				if (!(source.value.nodeName == "Stock" || (source.value.nodeName == "Ghost" && orig(source).value.nodeName == "Stock") || source.value.nodeName == "State" || (source.value.nodeName == "Ghost" && orig(source).value.nodeName == "State"))) {
					return 'You cannnot make that connection.';
				}
			}
			if (isDefined(target) && target !== null && target.isConnectable()) {
				if (!(target.value.nodeName == "Stock" || (target.value.nodeName == "Ghost" && orig(target).value.nodeName == "Stock") || target.value.nodeName == "State" || (target.value.nodeName == "Ghost" && orig(target).value.nodeName == "State"))) {
					return 'You cannnot make that connection.';
				}
				if (isDefined(source) && source !== null && source.isConnectable()) {
					if (orig(source).value.nodeName != orig(target).value.nodeName) {
						return "You cannot connect stocks to transitions.";
					}
				}
			}
		}


		if ((edge != null && edge.value.nodeName == "Link") || (this.model.getValue(edge) == null && ribbonPanelItems().getComponent('connect').getComponent('link').pressed)) {
			if (isDefined(source) && source !== null) {
				if (source.value.nodeName == "Link") {
					return 'Links cannot be connected to links.';
				}
			}
			if (isDefined(target) && target !== null) {
				if (target.value.nodeName == "Link") {
					return 'Links cannot be connected to links.';
				}
			}
		}
		var x = mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
		return x;
	};


/*	if (true && is_editor && drupal_node_ID != -1) {
 var sharer = new mxSession(graph.getModel(), "/builder/hub.php?init&id=" + drupal_node_ID, "/builder/hub.php?id=" + drupal_node_ID, "/builder/hub.php?id=" + drupal_node_ID);
        sharer.start();
        sharer.createUndoableEdit = function(changes)
        {
            var edit = mxSession.prototype.createUndoableEdit(changes);
            edit.changes.animate = true;
            return edit;
        }
	}*/

	if ((graph_source_data != null && graph_source_data.length > 0) || drupal_node_ID == -1) {
		var code;
		if (drupal_node_ID == -1) {
			code = blankGraphTemplate;
		} else {
			code = graph_source_data;
		}

		var doc = mxUtils.parseXml(code);
		var dec = new mxCodec(doc);
		dec.decode(doc.documentElement, graph.getModel());


		var mySetting = getSetting();

		if (mySetting.getAttribute("Version") < 3) {
			var converters = primitives("Converter");
			for (var i = 0; i < converters.length; i++) {
				var inps = converters[i].getAttribute("Inputs").split(",");
				var outs = converters[i].getAttribute("Outputs").split(",");
				var s = "";
				for (var j = 0; j < inps.length; j++) {
					if (j > 0) {
						s = s + ";";
					}
					s = s + inps[j] + "," + outs[j];
				}
				converters[i].setAttribute("Data", s);
			}
			mySetting.setAttribute("Version", 3);
		}
		if (mySetting.getAttribute("Version") < 4) {
			mySetting.setAttribute("SolutionAlgorithm", "RK1");
			mySetting.setAttribute("Version", 4)
		}

		if (mySetting.getAttribute("Version") < 5) {
			var stocks = primitives("Stock");
			for (var i = 0; i < stocks.length; i++) {
				stocks[i].setAttribute("NonNegative", false);
			}
			mySetting.setAttribute("Version", 5);
		}

		if (mySetting.getAttribute("Version") < 6) {
			var pictures = primitives("Picture");
			for (var i = 0; i < pictures.length; i++) {
				pictures[i].setAttribute("FlipHorizontal", false);
				pictures[i].setAttribute("FlipVertical", false);
			}
			mySetting.setAttribute("Version", 6);
		}

		if (mySetting.getAttribute("Version") < 7) {
			var links = primitives("Link");
			for (var i = 0; i < links.length; i++) {
				links[i].setAttribute("BiDirectional", false);
			}
			mySetting.setAttribute("Version", 7);
		}

		if (mySetting.getAttribute("Version") < 8) {
			var items = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"));
			for (var i = 0; i < items.length; i++) {
				items[i].setAttribute("Image", "None");
			}
			items = primitives("Display");
			for (var i = 0; i < items.length; i++) {
				items[i].setAttribute("Image", "Display");
			}
			mySetting.setAttribute("Version", 8);
		}

		if (mySetting.getAttribute("Version") < 9) {
			mySetting.setAttribute("BackgroundColor", "white");
			mySetting.setAttribute("Version", 9);
		}

		if (mySetting.getAttribute("Version") < 10) {
			var displays = primitives("Display");

			for (var i = 0; i < displays.length; i++) {
				displays[i].setVisible(false);
			}
			mySetting.setAttribute("Version", 10);
			graph.refresh()
		}

		if (mySetting.getAttribute("Version") < 11) {
			var cells = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"), primitives("Text"));

			graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, mxConstants.NONE, cells);

			mySetting.setAttribute("Version", 11);
		}

		if (mySetting.getAttribute("Version") < 12) {
			var cells = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"));
			var pics = primitives("Picture");

			for (var i = 0; i < pics.length; i++) {
				pics[i].setAttribute("LabelPosition", "Bottom");
			}

			for (var i = 0; i < cells.length; i++) {
				cells[i].setAttribute("LabelPosition", "Middle");
			}

			mySetting.setAttribute("Version", 12);
		}

		if (mySetting.getAttribute("Version") < 13) {
			var items = primitives("Folder");
			for (var i = 0; i < items.length; i++) {
				items[i].setAttribute("Image", "None");
				items[i].setAttribute("LabelPosition", "Middle");
			}
			mySetting.setAttribute("Version", 13);
		}

		if (mySetting.getAttribute("Version") < 14) {
			var pictures = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"), primitives("Folder"));
			for (var i = 0; i < pictures.length; i++) {
				pictures[i].setAttribute("FlipHorizontal", false);
				pictures[i].setAttribute("FlipVertical", false);
			}
			mySetting.setAttribute("Version", 14);
		}

		if (mySetting.getAttribute("Version") < 15) {
			var buttons = primitives("Button");
			for (var i = 0; i < buttons.length; i++) {
				var action = buttons[i].getAttribute("Function");
				action = action.replace(/getName/g, "findName");
				action = action.replace(/getType/g, "findType");
				action = action.replace(/getAll/g, "findAll");
				buttons[i].setAttribute("Function", action);
			}
			mySetting.setAttribute("Version", 15);
		}

		if (mySetting.getAttribute("Version") < 16) {
			var vars = primitives("Parameter");
			for (var i = 0; i < vars.length; i++) {
				vars[i].value = changeNodeName(vars[i].value, "Variable");
			}
			mySetting.setAttribute("Version", 16);
		}

		if (mySetting.getAttribute("Version") < 17) {
			mySetting.setAttribute("Throttle", -1);
			mySetting.setAttribute("Version", 17);
		}

		if (mySetting.getAttribute("Version") < 18) {
			var displays = primitives("Display");

			for (var i = 0; i < displays.length; i++) {
				displays[i].setAttribute("yAxis2", "");
				displays[i].setAttribute("Primitives2", "");
			}

			mySetting.setAttribute("Version", 18);

		}

		if (mySetting.getAttribute("Version") < 19) {
			mySetting.setAttribute("Macros", "");
			mySetting.setAttribute("Version", 19);
		}

		if (mySetting.getAttribute("Version") < 20) {
			var u = mySetting.getAttribute("Units");
			if (isDefined(u)) {
				mySetting.setAttribute("Units", u.replace(/,/g, "*"));
			}
			mySetting.setAttribute("Version", 20);
		}

		if (mySetting.getAttribute("Version") < 21) {
			var displays = primitives("Display");
			for (var i = 0; i < displays.length; i++) {
				if (displays[i].getAttribute('Type') == "Scatterplot") {
					displays[i].setAttribute("showMarkers", true);
					displays[i].setAttribute("showLines", false);
				} else {
					displays[i].setAttribute("showMarkers", false);
					displays[i].setAttribute("showLines", true);
				}
			}

			mySetting.setAttribute("Version", 21);
		}


		if (mySetting.getAttribute("Version") < 22) {

			mySetting.setAttribute("SensitivityPrimitives", "");
			mySetting.setAttribute("SensitivityRuns", 50);
			mySetting.setAttribute("SensitivityBounds", "50, 80, 95, 100");
			mySetting.setAttribute("SensitivityShowRuns", "false");

			mySetting.setAttribute("Version", 22);
		}

		if (mySetting.getAttribute("Version") < 23) {

			var obsolete = findValue([/\bmin\(\s*</i, /\bmax\(\s*</i, /\bmean\(\s*</i, /\bmedian\(\s*</i, /\bstddev\(\s*</i]);

			if (obsolete.length > 0) {

				var msg = '<p>Insight Maker has received an update that removes the need for the <i>&lt;Primitive&gt;</i> notation. You may now use the <i>[Primitive]</i> in place of it.</p> ';
				msg += '<br/><p>A side effect of this update is that the usage of the Min(), Max(), Mean(), Median() and StdDev() statistical functions for aggregating over a primitive\'s history have been renamed to PastMin(), PastMax(), etc... (the usage of these function for values is unchanged; e.g. Max(1, 4, 2) is still correct).</p>';
				msg += '<br/><p>To correct this you need to change equations like:</p>';
				msg += '<br/><b>Max(&lt;x&gt;)</b></p>';
				msg += '<br/>to</p>';
				msg += '<br/><b>PastMax([x])</b></p>';
				msg += '<br/><p>The following of your primitives appear to use these function and need to be updated to work correctly with this change. You can adjust their equations manually:</p>';
				msg += '<br/><p><b>' + Ext.Array.map(obsolete, function(x) {
					return x.getAttribute("name")
				}).join(", ") + '</b></p>';

				Ext.Msg.show({
					icon: Ext.MessageBox.WARNING,
					title: 'Model Update Required',
					msg: msg,
					buttons: Ext.MessageBox.OK
				});

			}


			mySetting.setAttribute("Version", 23);
		}

		if (mySetting.getAttribute("Version") < 24) {
			
			var folders = primitives("Folder");
			for (var i = 0; i < folders.length; i++) {
				folders[i].setAttribute("Type", "None");
			}
			
			var displays = primitives("Display");
			for (var i = 0; i < displays.length; i++) {
				displays[i].setAttribute("showArea", false);
			}
			
			var texts = primitives("Text");
			for (var i = 0; i < texts.length; i++) {
				texts[i].setAttribute('LabelPosition', "Middle");
			}

			mySetting.setAttribute("Version", 24);
		}


		if (mySetting.getAttribute("Version") < 25) {
			
			setAllConnectable();

			mySetting.setAttribute("Version", 25);
		}

	}
	loadBackgroundColor();

	if (is_editor) {
		var mgr = new mxAutoSaveManager(graph);
		mgr.autoSaveThreshold = 0;
		mgr.save = function() {
			if (graph_title != "") {
				saveModel();
			}
		};
	}

	var listener = function(sender, evt) {
			history.undoableEditHappened(evt.getProperty('edit'));
		};

	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);

	//Update folder displays between collapsed and full versions
	graph.addListener(mxEvent.CELLS_FOLDED, function(sender, evt) {
		var cells = evt.properties.cells;
		var collapse = evt.properties.collapse;
		for (var i = 0; i < cells.length; i++) {
			setPicture(cells[i]);
			setLabelPosition(cells[i]);
		}
	});

	var toolbarItems = ribbonPanelItems();
	var selectionListener = function() {
			var selected = !graph.isSelectionEmpty();
			var selectedNonGhost = selected && (graph.getSelectionCount() == 1 ? graph.getSelectionCell().value.nodeName != "Ghost" : true);

			toolbarItems.getComponent('valued').getComponent('folder').setDisabled(graph.getSelectionCount() <= 0);
			toolbarItems.getComponent('valued').getComponent('ghostBut').setDisabled(graph.getSelectionCount() != 1 || ((!isValued(graph.getSelectionCell()) && graph.getSelectionCell().value.nodeName != "Picture" && graph.getSelectionCell().value.nodeName != "Agents")) || graph.getSelectionCell().value.nodeName == "Flow" || graph.getSelectionCell().value.nodeName == "Transition" || graph.getSelectionCell().value.nodeName == "Ghost");

			toolbarItems.getComponent('actions').getComponent('cut').setDisabled(!selected);
			toolbarItems.getComponent('actions').getComponent('copy').setDisabled(!selected);
			toolbarItems.getComponent('actions').getComponent('delete').setDisabled(!selected);
			toolbarItems.getComponent('style').getComponent('fillcolor').setDisabled(!((!selected) || selectedNonGhost));
			toolbarItems.getComponent('style').getComponent('fontcolor').setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('linecolor').setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('bold').setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('italic').setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('underline').setDisabled(!selectedNonGhost);
			fontCombo.setDisabled(!selectedNonGhost);
			sizeCombo.setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('align').setDisabled(!selectedNonGhost);
			toolbarItems.getComponent('style').getComponent('movemenu').setDisabled(!selected);
			toolbarItems.getComponent('style').getComponent('picturemenu').setDisabled(!selected);
			toolbarItems.getComponent('connect').getComponent('reverse').setDisabled(!(selected && (cellsContainNodename(graph.getSelectionCells(), "Link") || cellsContainNodename(graph.getSelectionCells(), "Flow"))));

			setStyles();
		};

	graph.getSelectionModel().addListener(mxEvent.CHANGED, selectionListener);



	clipboardListener = function() {
		toolbarItems.getComponent('actions').getComponent('paste').setDisabled(mxClipboard.isEmpty());
	};
	clipboardListener();


	// Updates the states of the undo/redo buttons in the toolbar
	var historyListener = function() {
			toolbarItems.getComponent('actions').getComponent('undo').setDisabled(!history.canUndo());
			toolbarItems.getComponent('actions').getComponent('redo').setDisabled(!history.canRedo());
		};

	history.addListener(mxEvent.ADD, historyListener);
	history.addListener(mxEvent.UNDO, historyListener);
	history.addListener(mxEvent.REDO, historyListener);

	// Updates the button states once
	selectionListener();
	historyListener();


	var previousCreateGroupCell = graph.createGroupCell;

	graph.createGroupCell = function() {
		var group = previousCreateGroupCell.apply(this, arguments);
		group.setStyle('folder');
		group.setValue(primitiveBank.folder.cloneNode(true));

		return group;
	};

	graph.connectionHandler.factoryMethod = function(source, target) {
		var style;
		var parent;
		var value;
		var conn;
		if (ribbonPanelItems().getComponent('connect').getComponent('link').pressed) {
			style = 'link';
			parent = primitiveBank.link.cloneNode(true);
		} else {
			if ((source != null && source.value.nodeName == "Stock") || (target != null && target.value.nodeName == "Stock")) {
				style = 'flow';
				parent = primitiveBank.flow.cloneNode(true);
			} else {
				style = 'transition';
				parent = primitiveBank.transition.cloneNode(true);
			}
		}
		var cell = new mxCell(parent, new mxGeometry(0, 0, 100, 100), style);
		cell.geometry.setTerminalPoint(new mxPoint(0, 100), true);
		cell.geometry.setTerminalPoint(new mxPoint(100, 0), false);
		cell.edge = true;
		cell.connectable = true;

		return cell;
	};

	graph.getTooltipForCell = function(cell) {
		if (cell != null && cell.value.getAttribute("Note") != null && cell.value.getAttribute("Note").length > 0) {
			return cell.value.getAttribute("Note");
		} else {
			return "";
		}
	}

	// Redirects tooltips to ExtJs tooltips. First a tooltip object
	// is created that will act as the tooltip for all cells.
	var tooltip = new Ext.ToolTip({
		html: '',
		hideDelay: 0,
		dismissDelay: 0,
		showDelay: 0
	});

	// Installs the tooltip by overriding the hooks in mxGraph to
	// show and hide the tooltip.
	graph.tooltipHandler.show = function(tip, x, y) {
		if (tip != null && tip.length > 0) {
			tooltip.update(tip);
			tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
		} else {
			tooltip.hide();
		}
	};

	graph.tooltipHandler.hide = function() {
		tooltip.hide();
	};

	graph.tooltipHandler.hideTooltip = function() {
		tooltip.hide();
	};

	// Enables guides
	mxGraphHandler.prototype.guidesEnabled = true;

	mxGraphHandler.prototype.mouseDown = function(sender, me) {
		//console.log(sender);
		var cell = this.getInitialCellForEvent(me);
		if (cell !== null && cell.value.nodeName == "Button" && (!graph.getSelectionModel().isSelected(cell))) {
			if (me.evt.shiftKey == false) {
				pressButton(cell);
				me.consume();
				return false;
			}
		}
		if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(me.getEvent()) && me.getState() != null) {
			var cell = this.getInitialCellForEvent(me);
			this.cell = null;
			this.delayedSelection = this.isDelayedSelection(cell);
			if (this.isSelectEnabled() && !this.delayedSelection) {
				this.graph.selectCellForEvent(cell, me.getEvent());
			}
			if (this.isMoveEnabled()) {
				var model = this.graph.model;
				var geo = model.getGeometry(cell);
				if (this.graph.isCellMovable(cell) && ((!model.isEdge(cell) || this.graph.getSelectionCount() > 1 || (geo.points != null && geo.points.length > 0) || model.getTerminal(cell, true) == null || model.getTerminal(cell, false) == null) || this.graph.allowDanglingEdges || (this.graph.isCloneEvent(me.getEvent()) && this.graph.isCellsCloneable()))) {
					this.start(cell, me.getX(), me.getY());
				}
				this.cellWasClicked = true;
				if ((!false && !true) || me.getSource().nodeName != 'SELECT') {
					me.consume();
				} else if (false && me.getSource().nodeName == 'SELECT') {
					this.cellWasClicked = false;
					this.first = null;
				}
			}
		}
	}

	graph.addListener(mxEvent.CLICK, function(me, evt) {
		evt.consume();
	});


	// Alt disables guides
	mxGuide.prototype.isEnabledForEvent = function(evt) {
		return !mxEvent.isAltDown(evt);
	};

	var undoHandler = function(sender, evt) {
			var changes = evt.getProperty('edit').changes;
			graph.setSelectionCells(graph.getSelectionCellsForChanges(changes));
		};

	history.addListener(mxEvent.UNDO, undoHandler);
	history.addListener(mxEvent.REDO, undoHandler);

	if(! is_embed){
		//stealing focus in embedded frames scrolls the page to the frame
		graph.container.focus();
	}

	setTopLinks();
	if (!is_topBar) {
		toggleTopBar();
	}
	if (!is_sideBar) {
		configPanel.collapse(Ext.Component.DIRECTION_RIGHT, false);
	}

	Ext.FocusManager.enable();
	Ext.FocusManager.keyNav.disable();
	Ext.FocusManager.shouldShowFocusFrame = function() {
		return false;
	};

	mxKeyHandler.prototype.isGraphEvent = function(e) {
		
		if (e.altKey || e.shiftKey) {
			return false;
		}
		var w = Ext.WindowManager.getActive();
		if (isDefined(w) && w !== null && w.modal) {
			return false;
		}
		//console.log(Ext.FocusManager.focusedCmp);
		var x = isUndefined(Ext.FocusManager.focusedCmp) || Ext.FocusManager.focusedCmp.componentCls == 'x-container' || Ext.FocusManager.focusedCmp.componentCls == 'x-window' || Ext.FocusManager.focusedCmp.componentCls == 'x-panel' || Ext.FocusManager.focusedCmp.componentCls == 'x-panel-header' || Ext.FocusManager.focusedCmp.componentCls == 'x-window-header' || Ext.FocusManager.focusedCmp.componentCls == 'x-btn-group';
		//console.log(x);
		return x;
	}

	var keyHandler = new mxKeyHandler(graph);

	keyHandler.getFunction = function(evt) {
		if (evt != null) {
			return (mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey)) ? this.controlKeys[evt.keyCode] : this.normalKeys[evt.keyCode];
		}

		return null;
	};

	keyHandler.bindKey(13, function() {
		graph.foldCells(false);
	});

	keyHandler.bindKey(8, function() {
		if (is_editor) {
			graph.removeCells(graph.getSelectionCells(), false);
		}
	});

	keyHandler.bindKey(46, function() {
		if (is_editor) {
			graph.removeCells(graph.getSelectionCells(), false);
		}
	});

	keyHandler.bindControlKey(65, function() {
		graph.selectAll();
	});

	//bold
	keyHandler.bindControlKey(66, function() {
		if (is_editor) {
			graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, excludeType(graph.getSelectionCells(), "Ghost"));
			setStyles();
		}
	});

	//italics
	keyHandler.bindControlKey(73, function() {
		if (is_editor) {
			graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC, excludeType(graph.getSelectionCells(), "Ghost"));
			setStyles();
		}
	});

	//underline
	keyHandler.bindControlKey(85, function() {
		if (is_editor) {
			graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE, excludeType(graph.getSelectionCells(), "Ghost"));
			setStyles();
		}
	});

	keyHandler.bindControlKey(89, function() {
		history.redo();
	});

	keyHandler.bindControlKey(90, function() {
		history.undo();
	});

	keyHandler.bindControlKey(88, function() {
		if (is_editor) {
			mxClipboard.cut(graph);
			clipboardListener();
		}
	});

	keyHandler.bindControlKey(67, function() {
		mxClipboard.copy(graph);
		clipboardListener();
	});

	keyHandler.bindControlKey(13, function() { // Return
		runModel();
	});

	keyHandler.bindControlKey(75, function() { // K
		scratchpadFn();
	});

	keyHandler.bindControlKey(69, function() { // E
		doSensitivity();
	});
	
	keyHandler.bindControlKey(70, function() { // F
		showFindAndReplace();
	});
	
	keyHandler.bindControlKey(71, function() { // G
		var but = Ext.getCmp('findNextBut');
		if(but && (! but.disabled)){
			findNext();
		}
	});


	keyHandler.bindControlKey(76, function() { // L
		timeSettingsFn();
	});
	
	
	keyHandler.bindControlKey(80, function() { // P
		var pageCount = mxUtils.prompt('Enter page count for printing:', '1');

		if (pageCount != null)
		{
		  var scale = mxUtils.getScaleForPageCount(pageCount, graph);
		  var preview = new mxPrintPreview(graph, scale);
		  preview.open();
		}
	});

	keyHandler.bindControlKey(192, function() { // `
		var primitive = graph.getSelectionCell();
		if (isDefined(primitive) && primitive != null) {
			var editorWindow = new Ext.RichTextWindow({
				parent: "",
				cell: primitive,
				html: getNote(primitive)
			});
			editorWindow.show();
		}
	});

	keyHandler.bindControlKey(83, function() {
		if (is_editor) {
			saveModel();
		}
	});

	keyHandler.bindControlKey(86, function() {
		if (is_editor) {
			mxClipboard.paste(graph);
			clipboardListener()
		}
	});

	/*keyHandler.bindControlKey(71, function() {
		if (is_editor) {
			graph.setSelectionCell(graph.groupCells(null, 20));
		}
	});*/

	graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt) {
		selectionChanged(false);
	});


	var primitiveRenderer = function(prims) {
			var items = prims.split(",");

			var myCells = primitives();
			if (myCells != null) {
				for (var i = 0; i < myCells.length; i++) {
					if (Ext.Array.indexOf(items, myCells[i].id) > -1) {
						items[Ext.Array.indexOf(items, myCells[i].id)] = myCells[i].getAttribute("name");
					}
				}
			}
			return items.join(", ");
		};

	var labelRenderer = function(eq) {
			var res = eq;

			res = res.replace(/(%.)/g, "<font color='DeepSkyBlue'>$1</font>");

			return clean(res);
		};

	function pictureEditor() {
		var picNames = ["None", "Growth", "Balance", 'Positive Feedback Clockwise', 'Positive Feedback Counterclockwise', 'Negative Feedback Clockwise', 'Negative Feedback Counterclockwise', 'Unknown Feedback Clockwise', 'Unknown Feedback Counterclockwise', 'Plus', 'Minus', 'Forwards', 'Backwards', 'Up', 'Down', 'Diagonal', "Play", "Pause", "Stop", "Info", 'Question', 'Warning', 'Checkmark', 'Prohibited', 'Idea', "Home", 'Book', 'Clock', 'Computer', 'Dice', 'Gear', 'Hammer', 'Smiley', 'Heart', 'Key', 'Lock', 'Loudspeaker', 'Footprints', 'Mail', 'Network', 'Notes', 'Pushpin', 'Paperclip', 'People', 'Person', 'Wallet', 'Money', 'Flag', 'Trash'];

		return new Ext.form.ComboBox({
			triggerAction: "all",
			store: new Ext.data.Store({
				fields: [{
					name: 'text',
					type: 'string'
				}],
				data: Ext.Array.map(picNames, function(x) {
					return {
						text: x
					}
				})
			}),
			queryMode: 'local',
			forceSelection: false,
			selectOnFocus: true,
			listConfig: {
				emptyText: "No primitives exist in your model",
				getInnerTpl: function() {
					return '<center><div class="x-combo-list-item" style=\"white-space:normal\";><img src="'+builder_path+'/images/SD/{text}.png" width=48 height=48/></div></center>';
				}
			}
		});
	}


	selectionChanged = function(forceClear) {

		if (isDefined(grid)) {
			grid.plugins[0].completeEdit();
			configPanel.removeAll()
		}


		var cell = graph.getSelectionCell();
		if (forceClear) {
			cell = null;
		}

		var bottomItems = [];
		var topItems = [];
		var properties = [];
		var cellType;
		if (cell != null) {
			cellType = cell.value.nodeName;
		}

		if (cell != null && graph.getSelectionCells().length == 1 && (cellType != "Ghost")) {
			configPanel.setTitle(cellType);


			properties = [{
				'name': 'Note',
				'text': 'Note',
				'value': cell.getAttribute("Note"),
				'group': '  General',
				'editor': new Ext.form.customFields['richText']({})
			}, {
				'name': 'name',
				'text': '(name)',
				'value': cell.getAttribute("name"),
				'group': '  General'
			}];


			if (is_editor && cell.getAttribute("Image", -99) != -99) {
				properties.push({
					'name': 'Image',
					'text': 'Image',
					'value': cell.getAttribute("Image"),
					'group': 'User Interface',
					'editor': pictureEditor()
				});

			}

			if (isValued(cell) && cell.value.nodeName != "State" && cell.value.nodeName != "Action") {
				if (is_editor && cell.value.nodeName != "Converter") {
					properties.push({
						'name': 'ShowSlider',
						'text': 'Show Value Slider',
						'value': isTrue(cell.getAttribute("ShowSlider")),
						'group': 'User Interface'
					});

					properties.push({
						'name': 'SliderMax',
						'text': 'Slider Max',
						'value': parseFloat(cell.getAttribute("SliderMax")),
						'group': 'User Interface'
					});

					properties.push({
						'name': 'SliderMin',
						'text': 'Slider Min',
						'value': parseFloat(cell.getAttribute("SliderMin")),
						'group': 'User Interface'
					});
				}

				if (cell.value.nodeName != "Transition") {
					properties.push({
						'name': 'Units',
						'text': 'Units',
						'value': cell.getAttribute("Units"),
						'group': 'Validation',
						'editor': new Ext.form.customFields['units']({})
					});
				}

				if (is_editor) {
					properties.push({
						'name': 'MaxConstraintUsed',
						'text': 'Max Constraint',
						'value': isTrue(cell.getAttribute("MaxConstraintUsed")),
						'group': 'Validation'
					});

					properties.push({
						'name': 'MaxConstraint',
						'text': 'Max Constraint',
						'value': parseFloat(cell.getAttribute("MaxConstraint")),
						'group': 'Validation'
					});


					properties.push({
						'name': 'MinConstraintUsed',
						'text': 'Min Constraint',
						'value': isTrue(cell.getAttribute("MinConstraintUsed")),
						'group': 'Validation'
					});

					properties.push({
						'name': 'MinConstraint',
						'text': 'Min Constraint',
						'value': parseFloat(cell.getAttribute("MinConstraint")),
						'group': 'Validation'
					});
				}
			}

		} else {
			configPanel.setTitle("");
		}

		var descBase = "<br/><img style='float:left; margin-right: 7px' src='"+builder_path+"/images/gui/help.png' width=32px height=32px />";

		var topDesc = "",
			bottomDesc = "";
		if (cell == null || graph.getSelectionCells().length > 1) {
			var slids = sliderPrimitives();

			//no primitive has been selected. Stick in empty text and sliders.
			if (drupal_node_ID == -1 && slids.length == 0) {
				topDesc = "<center><a href='"+builder_path+"/resources/QuickStart.pdf' target='_blank'><img src='"+builder_path+"/images/Help.jpg' width=217 height=164 /></a><br/><br/><br/>Or take a look at the <a href='http://InsightMaker.com/help' target='_blank'>Detailed Insight Maker Manual</a><br/><br/>There is also a <a href='http://www.systemswiki.org/index.php?title=Modeling_%26_Simulation_with_Insight_Maker' target='_blank'>free, on-line education course</a> which teaches you how to think in a systems manner using Insight Maker.</center>";
			} else {

				var topDesc = clean(graph_description);
				var topTags = "";
				if (topDesc == "") {
					if (is_editor) {
						topDesc = "<span style='color: gray'>You haven't entered a description for this Insight yet. Please enter one to help others understand it.</span>";
					}
				}
				
				if(graph_tags.trim() != ""){
					graph_tags.split(",").forEach(function(tag){
						var t = tag.trim();
						topTags = topTags+"<a target='_blank' href='http://insightmaker.com/tag/"+clean(t.replace(/ /g, "-"))+"'>"+clean(t)+"</a> ";	
					});
				}

				topDesc = "<big class='description'>" + topDesc + "</big><br/><br/>";
				
				if(topTags != ""){
					topDesc = topDesc + "Tags: "+topTags+"<br/><br/>";
				}
				if((! is_editor) && graph_author_name != ""){
					topDesc = topDesc + "Author: <a target='_blank' href='http://insightmaker.com/user/"+clean(graph_author_id)+"'>"+clean(graph_author_name)+"</a><br/><br/>";
				}
				
				if (slids.length > 0) {
					var sliderHolder = Ext.create("Ext.container.Container", {
						layout: {
							type: "vbox",
							align: "stretch"
						}
					});
					bottomItems.push(sliderHolder);
					var slids = sliderPrimitives();
					sliders = [];




					for (var i = 0; i < slids.length; i++) {
						if (isNaN(getValue(slids[i]))) {
							setValue(slids[i], (parseFloat(slids[i].getAttribute("SliderMin")) + parseFloat(slids[i].getAttribute("SliderMax"))) / 2);
						}
						var perc = Math.floor(-(Math.log(Math.max(.1, slids[i].getAttribute("SliderMax") - slids[i].getAttribute("SliderMin"))) / Math.log(10) - 4));

						var slid = Ext.create("Ext.slider.Single", {
							flex: 1,
							minValue: parseFloat(slids[i].getAttribute("SliderMin")),
							sliderCell: slids[i],
							value: parseFloat(getValue(slids[i])),
							maxValue: parseFloat(slids[i].getAttribute("SliderMax")),
							decimalPrecision: perc
						});
						sliders.push(slid);

						var t = Ext.create("Ext.form.field.Number", {
							slider: slid,
							width: 60,
							decimalPrecision: perc,
							ignoreChange: false,
							id: "sliderVal" + slids[i].id,
							hideTrigger: true,
							keyNavEnabled: false,
							selectOnFocus: true,
							mouseWheelEnabled: false,
							minValue: parseFloat(slids[i].getAttribute("SliderMin")),
							maxValue: parseFloat(slids[i].getAttribute("SliderMax")),
							listeners: {
								change: function(item, e, ops) {
									if (!item.ignoreChange) {
										item.ignoreChange = true;
										var v = parseFloat(item.getValue(), 10);
										if (!isNaN(v)) {
											item.slider.setValue(v);
										}
										item.ignoreChange = false;
									}
								}
							}
						});
						slid.addListener("change", function(slider, newValue) {
							var textField = Ext.getCmp("sliderVal" + slider.sliderCell.id);
							if ((!textField.ignoreChange) || (parseFloat(textField.getValue()) != parseFloat(newValue))) {
								textField.setRawValue(parseFloat(newValue));
							}
							setValue(slider.sliderCell, parseFloat(newValue));
						});

						var n = slids[i].getAttribute("Note");
						if (isUndefined(n)) {
							n = "";
						}

						sliderHolder.add(Ext.create("Ext.Component", {
							html: "<big> &bull; " + slids[i].getAttribute("name") + "</big>" + (n == "" ? "" : "<div style='font-size:small;color:grey'>" + n + "</div>"),
							padding: 3
						}));

						sliderHolder.add(Ext.create("Ext.container.Container", {
							layout: {
								type: "hbox",
								align: "stretch"
							},
							margin: 3,
							items: [slid, t]
						}));

						t.setValue(parseFloat(getValue(slids[i])));
					}

				}

			}

		} else if (cellType == "Stock") {



			bottomDesc = descBase + '<p>A stock stores a material or a resource. Lakes and Bank Accounts are both examples of stocks. One stores water while the other stores money. The Initial Value defines how much material is initially in the Stock.</p>' + (is_editor ? ' <br/><h1>Examples of valid Initial Values:</h1><center><table class="undefined"><tr><td align=center>Static Value</td></tr><tr><td align=center><i>10</i></td></tr><tr><td>Mathematical Equation</td></tr><tr><td align=center><i>cos(2.78)+7*2</i></td></tr><tr><td align=center>Referencing Other Primitives</td></tr><tr><td align=center><i>5+[My Variable]</i></td></tr></table></center>' : '');
			properties.push({
				'name': 'InitialValue',
				'text': 'Initial Value =',
				'value': cell.getAttribute("InitialValue"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});

			properties.push({
				'name': 'AllowNegatives',
				'text': 'Allow Negatives',
				'value': !isTrue(cell.getAttribute("NonNegative")),
				'group': ' Configuration'
			});

			properties.push({
				'name': 'StockMode',
				'text': 'Stock Type',
				'value': cell.getAttribute("StockMode"),
				'group': 'Behavior',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					store: ['Store', 'Conveyor'],
					selectOnFocus: true
				})
			});
			properties.push({
				'name': 'Delay',
				'text': 'Delay',
				'value': cell.getAttribute("Delay").toString(),
				'group': 'Behavior'
			});

		} else if (cellType == "Variable") {
			bottomDesc = descBase + "<p>A variable is a dynamically updated object in your model that synthesizes available data or provides a constant value for uses in your equations. The birth rate of a population or the maximum volume of water in a lake are both possible uses of variables.</p>" + (is_editor ? "<br/><h1>Examples of valid Values:</h1><center><table class='undefined'><tr><td align=center>Static Value</td></tr><tr><td align=center><i>7.2</i></td></tr><tr><td>Using Current Simulation Time</td></tr><tr><td align=center><i>seconds^2+6</i></td></tr><tr><td align=center>Referencing Other Primitives</td></tr><tr><td align=center><i>[Lake Volume]*2</i></td></tr></table></center>" : "");
			properties.push({
				'name': 'Equation',
				'text': 'Value/Equation =',
				'value': cell.getAttribute("Equation"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});
		} else if (cell.value.nodeName == "Link") {
			bottomDesc = descBase + "Links connect the different parts of your model. If one primitive in your model refers to another in its equation, the two primitives must either be directly connected or connected through a link. Once connected with links, square-brackets may be used to reference values of other primitives. So if you have a stock called <i>Bank Balance</i>, you could refer to it in another primitive's equation with <i>[Bank Balance]</i>.";
			properties.push({
				'name': 'BiDirectional',
				'text': 'Bi-Directional',
				'value': isTrue(cell.getAttribute("BiDirectional")),
				'group': ' Configuration'
			});

		} else if (cell.value.nodeName == "Folder") {
			bottomDesc = descBase + "Folders group together similar items in a logical way. You can collapse and expand folders to hide or reveal model complexity.";
			properties.push({
				'name': 'Type',
				'text': 'Extension',
				'value': cell.getAttribute("Type"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					store: ['None', 'Agent'],
					editable: false,
					selectOnFocus: true
				})
			});
		} else if (cell.value.nodeName == "Button") {
			bottomDesc = descBase + "Buttons are used for interactivity. To select a button without triggering its action, hold down the Shift key when you click the button. Buttons are currently in Beta and their implementation may change in later versions of Insight Maker. More button documentation is <a href='http://insightmaker.com/sites/default/files/API/' target='_blank'>available here</a>.";
			properties.push({
				'name': 'Function',
				'text': 'Action',
				'value': cell.getAttribute("Function"),
				'group': ' Configuration',
				'editor': new Ext.form.TextArea({
					grow: true
				})
			})

		} else if (cell.value.nodeName == "Flow") {
			bottomDesc = descBase + "<p>Flows represent the transfer of material from one stock to another. For example given the case of a lake, the flows for the lake might be: River Inflow, River Outflow, Precipitation, and Evaporation. Flows are given a flow rate and they operator over one unit of time; in effect: flow per one second or per one minute.</p>" + (is_editor ? "<br/><h1>Examples of valid Flow Rates:</h1><center><table class='undefined'><tr><td align=center>Constant Rate</td></tr><tr><td align=center><i>10</i></td></tr><tr><td align=center>Using the Current Simulation Time</td></tr><tr><td align=center><i>minutes/3</i></td></tr><tr><td align=center>Referencing Other Primitives</td></tr><tr><td align=center><i>[Lake Volume]*0.05+[Rain]/4</i></td></tr></table></center>" : "");
			properties.push({
				'name': 'FlowRate',
				'text': 'Flow Rate =',
				'value': cell.getAttribute("FlowRate"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});
			properties.push({
				'name': 'OnlyPositive',
				'text': 'Only Positive Rates',
				'value': isTrue(cell.getAttribute("OnlyPositive")),
				'group': ' Configuration'
			});

		} else if (cell.value.nodeName == "Transition") {
			bottomDesc = descBase + "<p>Transitions move agents between states. The probability is probability per time.</p>";
			properties.push({
				'name': 'Trigger',
				'text': 'Triggered by',
				'value': cell.getAttribute("Trigger"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					store: ['Timeout', 'Probability', 'Condition'],
					editable: false,
					selectOnFocus: true
				})
			});
			properties.push({
				'name': 'Value',
				'text': 'Value =',
				'value': cell.getAttribute("Value"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});
		} else if (cell.value.nodeName == "Action") {
			bottomDesc = descBase + "<p>Actions can be used to move agents or dynamically create connections between them.</p>";
			properties.push({
				'name': 'Trigger',
				'text': 'Triggered by',
				'value': cell.getAttribute("Trigger"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					store: ['Timeout', 'Probability', 'Condition'],
					editable: false,
					selectOnFocus: true
				})
			});
			properties.push({
				'name': 'Value',
				'text': 'Trigger Value =',
				'value': cell.getAttribute("Value"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});
			properties.push({
				'name': 'Action',
				'text': 'Action =',
				'value': cell.getAttribute("Action"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});
		} else if (cell.value.nodeName == "State") {
			bottomDesc = descBase + "<p>The current state of an agent.</p>";

			properties.push({
				'name': 'Active',
				'text': 'Start Active = ',
				'value': cell.getAttribute("Active"),
				'group': ' Configuration',
				'editor': new Ext.form.customFields['code']({}),
				'renderer': equationRenderer
			});

		} else if (cell.value.nodeName == "Agents") {
			bottomDesc = descBase + "<p>A collection of agents.</p>";


			var dat = [];
			var folders = primitives("Folder");
			for (var i = 0; i < folders.length; i++) {
				if (folders[i].getAttribute("Type") == "Agent" && connected(folders[i],cell)) {
					dat.push([folders[i].id, clean(folders[i].getAttribute("name"))])
				}
			}

			var agentStore = new Ext.data.ArrayStore({
				id: 0,
				fields: ['myId', 'displayText'],
				data: dat
			});


			properties.push({
				'name': 'Agent',
				'text': 'Agent Base',
				'value': cell.getAttribute("Agent"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					queryMode: 'local',
					store: agentStore,
					selectOnFocus: true,
					valueField: 'myId',
					editable: false,
					displayField: 'displayText'
				}),
				'renderer': primitiveRenderer
			});

			properties.push({
				'name': 'Size',
				'text': 'Population Size',
				'value': cell.getAttribute("Size"),
				'group': ' Configuration',
				'editor': {
			        xtype: 'numberfield',
			        minValue: 0,
					allowDecimals: false
			    }
			});
			
			properties.push({
				'name': 'GeoWidth',
				'text': 'Width',
				'value': cell.getAttribute("GeoWidth"),
				'group': ' Geometry',
				'editor': new Ext.form.customFields['code']({}),
				renderer: equationRenderer
			});
			
			properties.push({
				'name': 'GeoHeight',
				'text': 'Height',
				'value': cell.getAttribute("GeoHeight"),
				'group': ' Geometry',
				'editor': new Ext.form.customFields['code']({}),
				renderer: equationRenderer
			});
			
			properties.push({
				'name': 'GeoDimUnits',
				'text': 'Dimension Units',
				'value': cell.getAttribute("GeoDimUnits"),
				'group': ' Geometry',
				'editor': new Ext.form.customFields['units']({})
			});
			
			properties.push({
				'name': 'GeoWrap',
				'text': 'Wrap Around',
				'value': isTrue(cell.getAttribute("GeoWrap")),
				'group': ' Geometry'
			});
			
			properties.push({
				'name': 'Placement',
				'text': 'Placement Method',
				'value': cell.getAttribute("Placement"),
				'group': ' Geometry',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					queryMode: 'local',
					selectOnFocus: true,
					editable: false,
					store: ["Random", "Grid", "Ellipse", "Network", "Custom Function"]
				}),
				'renderer': primitiveRenderer
			});
			
			properties.push({
				'name': 'PlacementFunction',
				'text': 'Custom Function',
				'value': cell.getAttribute("PlacementFunction"),
				'group': ' Geometry',
				'editor': new Ext.form.customFields['code']({}),
				renderer: equationRenderer
			});
			
			properties.push({
				'name': 'Network',
				'text': 'Network Method',
				'value': cell.getAttribute("Network"),
				'group': ' Network',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					queryMode: 'local',
					selectOnFocus: true,
					editable: false,
					store: ["None", "Custom Function"]
				})
			});
			
			properties.push({
				'name': 'NetworkFunction',
				'text': 'Custom Function',
				'value': cell.getAttribute("NetworkFunction"),
				'group': ' Network',
				'editor': new Ext.form.customFields['code']({}),
				renderer: equationRenderer
			});
			


		} else if (cellType == "Ghost") {
			bottomDesc = descBase + "This item is a 'Ghost' of another primitive. It mirrors the values and properties of its source primitive. You cannot edit the properties of the Ghost. You need to instead edit the properties of its source.";
			bottomDesc = bottomDesc + "<p><center><a href='#' onclick='var x = findID(getSelected()[0].getAttribute(\"Source\"));highlight(x);'>Show Source</a></center></p>";
		} else if (cellType == "Converter") {
			bottomDesc = descBase + "Converters store a table of input and output data. When the input source takes on one of the input values, the converter takes on the corresponding output value. If no specific input value exists for the current input source value, then the nearest input neighbors are averaged.";
			var n = neighborhood(cell);
			var dat = [
				["Time", "Time"]
			];
			for (var i = 0; i < n.length; i++) {
				if(! n[i].linkHidden){
					dat.push([n[i].item.id, clean(n[i].item.getAttribute("name"))]);
				}
			}
			var converterStore = new Ext.data.ArrayStore({
				id: 0,
				fields: ['myId', 'displayText'],
				data: dat
			});



			properties.push({
				'name': 'Source',
				'text': 'Input Source',
				'value': cell.getAttribute("Source"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					queryMode: 'local',
					store: converterStore,
					selectOnFocus: true,
					valueField: 'myId',
					editable: false,
					displayField: 'displayText'
				}),
				'renderer': primitiveRenderer
			});
			properties.push({
				'name': 'Data',
				'text': 'Data',
				'value': cell.getAttribute("Data"),
				'group': 'Input/Output Table',
				'editor': new Ext.form.customFields['converter']({})
			});
			properties.push({
				'name': 'Interpolation',
				'text': 'Interpolation',
				'value': cell.getAttribute("Interpolation"),
				'group': ' Configuration',
				'editor': new Ext.form.ComboBox({
					triggerAction: "all",
					store: ['None', 'Linear'],
					editable: false,
					selectOnFocus: true
				})
			});
		} else if (cellType == "Picture") {
			bottomDesc = descBase + "Pictures can make your model diagram come alive.";
		}
		configPanel.removeAll();

		if (drupal_node_ID != -1 && cell == null) {
			bottomDesc = bottomDesc + '<br/> ' + (is_editor ? '<a href="#" style="text-decoration:none" onclick="updateProperties()">Edit description</a>' : '') + ' <div style="float:right; vertical-align:middle"> Share <span  id="st_facebook_button" displayText="Facebook"></span><span  id="st_twitter_button" displayText="Tweet"></span><span  id="st_linkedin_button" displayText="LinkedIn"></span><span  id="st_mail_button" displayText="EMail"></span><br/><br/></div>';
		}

		if (topDesc != "") {
			topItems.push(Ext.create('Ext.Component', {
				xtype: "component",
				html: topDesc,
				margin: '5 5 5 5'
			}));
		}
		if (bottomDesc != "") {
			bottomItems.push(Ext.create('Ext.Component', {
				xtype: "component",
				html: bottomDesc,
				margin: '5 5 5 5'
			}))
		}


		createGrid(properties, topItems, bottomItems, cell);


		if (drupal_node_ID != -1) {
			try {
				stWidget.addEntry({
					"service": "twitter",
					"element": document.getElementById('st_twitter_button'),
					"url": "http://InsightMaker.com/insight/" + drupal_node_ID,
					"title": graph_title,
					"type": "chicklet",
					"image": "http://insightmaker.com/sites/default/files/logo.png",
					"summary": graph_description
				});
				stWidget.addEntry({
					"service": "facebook",
					"element": document.getElementById('st_facebook_button'),
					"url": "http://InsightMaker.com/insight/" + drupal_node_ID,
					"title": graph_title,
					"type": "chicklet",
					"image": "http://insightmaker.com/sites/default/files/logo.png",
					"summary": graph_description
				});
				stWidget.addEntry({
					"service": "linkedin",
					"element": document.getElementById('st_linkedin_button'),
					"url": "http://InsightMaker.com/insight/" + drupal_node_ID,
					"title": graph_title,
					"type": "chicklet",
					"image": "http://insightmaker.com/sites/default/files/logo.png",
					"summary": graph_description
				});
				stWidget.addEntry({
					"service": "email",
					"element": document.getElementById('st_mail_button'),
					"url": "http://InsightMaker.com/insight/" + drupal_node_ID,
					"title": graph_title,
					"type": "chicklet",
					"image": "http://insightmaker.com/sites/default/files/logo.png",
					"summary": graph_description
				});
			} catch (err) {

			}
		}
	}


	selectionChanged(false);

	if (drupal_node_ID == -1) {
		setSaveEnabled(true);
	} else {
		setSaveEnabled(false);
	}

	updateWindowTitle();

	if (!saved_enabled) {
		ribbonPanelItems().getComponent('savegroup').setVisible(false);
	}

	handelCursors();

	if ((!is_editor) && (is_embed) && (is_zoom == 1)) {
		graph.getView().setScale(0.25);
		graph.fit();
		graph.fit();
	}


};


var surpressCloseWarning = false;

function confirmClose() {
	if (!surpressCloseWarning) {
		if ((!saved_enabled) || ribbonPanelItems().getComponent('savegroup').getComponent('savebut').disabled) {

		} else {
			return "You have made unsaved changes to this Insight. If you close now, they will be lost.";
		}
	} else {
		surpressCloseWarning = false;
	}
}


Ext.example = function() {
	var msgCt;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}
	return {
		msg: function(title, format) {
			if (!msgCt) {
				msgCt = Ext.core.DomHelper.insertFirst(document.body, {
					id: 'msg-div'
				}, true);
			}
			var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.core.DomHelper.append(msgCt, createBox(title, s), true);
			m.hide();
			m.slideIn('t').ghost("t", {
				delay: 4500,
				remove: true
			});
		}
	};
}();


Ext.round = function(n, d) {
	var result = Number(n);
	if (typeof d == 'number') {
		d = Math.pow(10, d);
		result = Math.round(n * d) / d;
	}
	return result;
};

var makeGhost = function() {
		var item = graph.getSelectionCell();
		var parent = graph.getDefaultParent();
		
		var location = getPosition(item);

		var vertex;
		var style = item.getStyle();
		style = mxUtils.setStyle(style, "opacity", 30);
		graph.getModel().beginUpdate();

		vertex = graph.insertVertex(parent, null, primitiveBank.ghost.cloneNode(true), location[0] + 10, location[1] + 10, item.getGeometry().width, item.getGeometry().height, style);
		vertex.value.setAttribute("Source", item.id);
		graph.setSelectionCell(vertex);
		graph.getModel().endUpdate();

	};
	
var makeFolder = function() {
	var group = graph.groupCells(null, 20);
	group.setConnectable(true);
	graph.setSelectionCell(group);
	graph.orderCells(true);
};



function showContextMenu(node, e) {
	var selectedItems = getSelected();
	var folder = false;
	if(selectedItems.length > 0){
		folder = selectedItems[0].value.nodeName == "Folder" && (! getCollapsed(selectedItems[0]));
	}
	var selected = selectedItems.length > 0 && (! folder);
	
	var folderObject = {
		text: "Create Folder",
		iconCls: 'folder-icon',
		disabled: !selected,
		handler: makeFolder
	};
	
	/*if(folder){
		folderObject = {
			text: "Remove Folder",
			iconCls: 'folder-icon',
			disabled: false,
			handler: function(){
				graph.model.beginUpdate();
				setParent(getChildren(selectedItems[0], false), getParent(selectedItems[0]));
				removePrimitive(selectedItems[0]);
				graph.model.endUpdate();
			}
		};
	}*/

	var menu = new Ext.menu.Menu({
		items: [{
			text: "Create Stock",
			iconCls: 'stock-icon-small',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Stock", "Stock", [pt.x, pt.y], [100, 40]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);

			}
		}, {
			text: "Create Variable",
			iconCls: 'parameter-icon-small',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Variable", "Variable", [pt.x, pt.y], [120, 50]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);

				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
				
			}

		}, {
			text: "Create Converter",
			iconCls: 'converter-icon',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Converter", "Converter", [pt.x, pt.y], [120, 50]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				

				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				

			}
		}, '-',
		{
			text: "Create State",
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New State", "State", [pt.x, pt.y], [120, 40]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
			}

		},
		{
			text: "Create Action",
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Action", "Action", [pt.x, pt.y], [120, 50]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
			}

		},
		{
			text: "Create Agent Population",
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("Agent Population", "Agents", [pt.x, pt.y], [170, 80]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
			}

		}, '-',
		{
			text: "Create Text",
			iconCls: 'font-icon',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Text", "Text", [pt.x, pt.y], [200, 50]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				

				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				

			}
		}, {
			text: "Create Picture",
			iconCls: 'picture-icon',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("", "Picture", [pt.x, pt.y], [64, 64]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setPicture(cell);
				setSelected(cell);
				
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
			}

		}, {
			text: "Create Button",
			iconCls: 'button-icon',
			disabled: selected,
			handler: function() {
				graph.model.beginUpdate();
				var pt = graph.getPointForEvent(e);
				var cell = createPrimitive("New Button", "Button", [pt.x, pt.y], [120, 40]);
				graph.model.endUpdate();
				if(folder){
					setParent(cell, selectedItems[0]);
				}
				setSelected(cell);
				
				
				setTimeout(function(){graph.cellEditor.startEditing(cell)},20);
				
			}

		}, '-',
		{
			text: "Ghost Primitive",
			iconCls: 'ghost-icon',
			disabled: graph.getSelectionCount() != 1 || ((!isValued(graph.getSelectionCell()) && graph.getSelectionCell().value.nodeName != "Picture")) || graph.getSelectionCell().value.nodeName == "Flow" || graph.getSelectionCell().value.nodeName == "Ghost",
			handler: makeGhost
		},
		folderObject,

		, '-',
		{
			text: 'Delete',
			iconCls: 'delete-icon',
			disabled: !selected,
			handler: function() {
				graph.removeCells(graph.getSelectionCells(), false);
			}
		}]
	});



	// Adds a small offset to make sure the mouse released event
	// is routed via the shape which was initially clicked. This
	// is required to avoid a reset of the selection in Safari.
	menu.showAt([e.clientX + 1, e.clientY + 1]);
}


var blankGraphTemplate = "<mxGraphModel>\n  <root>\n    <mxCell id=\"0\"\/>\n    <mxCell id=\"1\" parent=\"0\"\/>\n    <Picture name=\"\" Note=\"\" Image=\"http:\/\/insightmaker.com\/builder\/images\/rabbit.jpg\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Bottom\" id=\"17\">\n      <mxCell style=\"picture;image=http:\/\/insightmaker.com\/builder\/images\/rabbit.jpg;imageFlipV=0;imageFlipH=0;shape=image\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"10\" y=\"192.75\" width=\"210\" height=\"224.25\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Setting Note=\"\" Version=\"25\" TimeLength=\"20\" TimeStart=\"0\" TimeStep=\"1\" TimeUnits=\"Years\" StrictUnits=\"true\" Units=\"\" HiddenUIGroups=\"Validation,User Interface\" SolutionAlgorithm=\"RK1\" BackgroundColor=\"white\" Throttle=\"1\" Macros=\"\" SensitivityPrimitives=\"\" SensitivityRuns=\"50\" SensitivityBounds=\"50, 80, 95, 100\" SensitivityShowRuns=\"false\" id=\"2\">\n      <mxCell parent=\"1\" vertex=\"1\" visible=\"0\">\n        <mxGeometry x=\"20\" y=\"20\" width=\"80\" height=\"40\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Setting>\n    <Display name=\"Default Display\" Note=\"\" Type=\"Time Series\" xAxis=\"Time (%u)\" yAxis=\"\" ThreeDimensional=\"false\" Primitives=\"4\" AutoAddPrimitives=\"true\" ScatterplotOrder=\"X Primitive, Y Primitive\" Image=\"Display\" yAxis2=\"\" Primitives2=\"\" showMarkers=\"false\" showLines=\"true\" showArea=\"false\" id=\"3\">\n      <mxCell style=\"roundImage;image=\/builder\/images\/DisplayFull.png;\" parent=\"1\" vertex=\"1\" visible=\"0\">\n        <mxGeometry x=\"50\" y=\"20\" width=\"64\" height=\"64\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Display>\n    <Stock name=\"Rabbits\" Note=\"The number of rabbits currently alive.\" InitialValue=\"200\" StockMode=\"Store\" Delay=\"10\" Volume=\"100\" NonNegative=\"false\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"1000\" SliderMin=\"0\" Image=\"None\" AllowNegatives=\"true\" LabelPosition=\"Middle\" FlipHorizontal=\"false\" FlipVertical=\"false\" id=\"4\">\n      <mxCell style=\"stock;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"407.5\" y=\"422\" width=\"100\" height=\"40\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Stock>\n    <Flow name=\"Births\" Note=\"The number of rabbits born each year.\" FlowRate=\"[Rabbits]*[Rabbit Birth Rate]\" OnlyPositive=\"true\" TimeIndependent=\"false\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"100\" SliderMin=\"0\" id=\"5\">\n      <mxCell style=\"\" parent=\"1\" target=\"4\" edge=\"1\">\n        <mxGeometry x=\"47.5\" y=\"32\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"457.5\" y=\"184.5\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"57.5\" y=\"282\" as=\"targetPoint\"\/>\n          <mxPoint x=\"-0.5\" y=\"5\" as=\"offset\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Flow>\n    <Variable name=\"Rabbit Birth Rate\" Note=\"The proportional increase in the number of rabbits per year.\" Equation=\"0.1\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"1\" SliderMin=\"0\" Image=\"None\" LabelPosition=\"Middle\" FlipHorizontal=\"false\" FlipVertical=\"false\" id=\"6\">\n      <mxCell style=\"parameter;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"551.25\" y=\"157\" width=\"140\" height=\"50\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Variable>\n    <Text name=\"&amp;larr; This is a Stock\" LabelPosition=\"Middle\" id=\"8\">\n      <mxCell style=\"textArea;fontStyle=1;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"536.25\" y=\"392\" width=\"160\" height=\"50\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"Stocks store things like money or water or, in this case, rabbits.\" LabelPosition=\"Middle\" id=\"9\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"516.25\" y=\"428.5\" width=\"210\" height=\"50\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"This is a Flow &amp;rarr;\" LabelPosition=\"Middle\" id=\"10\">\n      <mxCell style=\"textArea;fontStyle=1;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"267.5\" y=\"182\" width=\"150\" height=\"50\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"Flows move material between Stocks. In this case it represents the birth of new rabbits.\" LabelPosition=\"Middle\" id=\"11\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"227.5\" y=\"224.5\" width=\"210\" height=\"70\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"This is a Variable&#xa;\" LabelPosition=\"Middle\" id=\"12\">\n      <mxCell style=\"textArea;fontStyle=1;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"496.25\" y=\"62\" width=\"245\" height=\"35\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Link name=\"Link\" Note=\"\" BiDirectional=\"false\" id=\"7\">\n      <mxCell style=\"entity\" parent=\"1\" source=\"6\" target=\"5\" edge=\"1\">\n        <mxGeometry x=\"47.5\" y=\"32\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"47.5\" y=\"132\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"147.5\" y=\"32\" as=\"targetPoint\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Link>\n    <Text name=\"&amp;larr; This is a Link\" LabelPosition=\"Middle\" id=\"13\">\n      <mxCell style=\"textArea;fontStyle=1;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"511.25\" y=\"247\" width=\"210\" height=\"30\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"It allows the equation for &lt;i&gt;Births&lt;\/i&gt; to reference the &lt;i&gt;Rabbit Birth Rate&lt;\/i&gt;.\" LabelPosition=\"Middle\" id=\"14\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;align=center;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"516.25\" y=\"271.5\" width=\"210\" height=\"70\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"Here is a simple model to get you started. It simulates a rabbit population over the course of 20 years. Luckily for these rabbits, there is no rabbit mortality! &#xa;&#xa;Click the &lt;i&gt;Run Simulation&lt;\/i&gt; button on the right of the toolbar to see how the rabbit population will grow over time.\" LabelPosition=\"Middle\" id=\"15\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Times New Roman;fontSize=18;strokeColor=none;fontColor=#333300;align=left;fillColor=none;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"15\" y=\"12.75\" width=\"405\" height=\"150\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\" Move your mouse over it and click the &quot;=&quot; to inspect its value.&#xa;&amp;darr;\" LabelPosition=\"Middle\" id=\"18\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#000000;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"492.5\" y=\"92\" width=\"257.5\" height=\"60\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"&lt;b&gt;Adding Primitives:&lt;\/b&gt; Select type in toolbar and then click in the canvas.&#xa;&lt;b&gt;Adding Connections:&lt;\/b&gt; Select type in toolbar, hover mouse over connectable primitive and drag arrow.\" LabelPosition=\"Middle\" id=\"21\">\n      <mxCell style=\"textArea;fontStyle=0;fontFamily=Verdana;fontSize=14;strokeColor=none;fontColor=#808080;align=center;labelBackgroundColor=none\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"5\" y=\"480\" width=\"745\" height=\"70\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Link name=\"Link\" Note=\"\" BiDirectional=\"false\" id=\"22\">\n      <mxCell style=\"entity\" parent=\"1\" source=\"4\" target=\"5\" edge=\"1\">\n        <mxGeometry width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint y=\"100\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"100\" as=\"targetPoint\"\/>\n          <Array as=\"points\">\n            <mxPoint x=\"380\" y=\"420\"\/>\n            <mxPoint x=\"360\" y=\"380\"\/>\n            <mxPoint x=\"360\" y=\"340\"\/>\n            <mxPoint x=\"380\" y=\"310\"\/>\n            <mxPoint x=\"407\" y=\"292\"\/>\n            <mxPoint x=\"440\" y=\"290\"\/>\n          <\/Array>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Link>\n    <Button name=\"Clear Sample Model\" Note=\"\" Function=\"clearModel()\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" id=\"23\">\n      <mxCell style=\"button;fontSize=20;fillColor=#FFFF99;strokeColor=#FF9900;fontColor=#0000FF;fontStyle=5\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"80\" y=\"418.5\" width=\"240\" height=\"60\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Button>\n  <\/root>\n<\/mxGraphModel>\n";
