"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var analysisCount = 0;


function getGraphXml(graph) {
	var enc = new mxCodec(mxUtils.createXmlDocument());
	var node = enc.encode(graph.getModel());
	return mxUtils.getPrettyXml(node);
}

var isSendingtoServer = false;
var waitingToSendToServer = false;
var waitingToSendTimeout = -1;
function sendGraphtoServer(graph) {
	if(isSendingtoServer){
		waitingToSendToServer = true;
	}else{
		if(!unfoldingManager.unfolding){
			clearTimeout(waitingToSendTimeout);
			waitingToSendToServer = false;
			isSendingtoServer = true;

			Ext.Ajax.request({
				url: builder_path + '/save.php',
				method: 'POST',
				params: {
					data: getGraphXml(graph),
					nid: drupal_node_ID,
					title: graph_title,
					description: graph_description,
					tags: graph_tags,
					has_article: has_article,
					published: published,
					groups: JSON.stringify(node_groups)
				},

				success: function(result, request) {
					if (parseInt(result.responseText) != result.responseText) {
						console.log("Insight Save Issue:\n\n" + result.responseText);
					} else {
						drupal_node_ID = result.responseText;
						setSaveEnabled(waitingToSendToServer);
						updateWindowTitle();
						setTopLinks();

					}
				},
				failure: function(result, request) {
					console.log("Insight Not Saved:\n\n" + result.responseText);
					/*Ext.MessageBox.hide();
		            Ext.MessageBox.show({
		                title: 'Error',
		                msg: 'The Insight could not be saved. Please try again later.',
		                buttons: Ext.MessageBox.OK,
		                animEl: 'mb9',
		                icon: Ext.MessageBox.ERROR
		            });*/
				},
				callback: function(){
					isSendingtoServer = false;

					if(waitingToSendToServer){
						waitingToSendTimeout = setTimeout(function(){
							sendGraphtoServer(graph);
						}, 5*1000); // Wait 5 seconds
					}
				}
			});
		}
	}

}

function validPrimitiveName(name, primitive) {
	if (primitive.value.nodeName == "Stock" || primitive.value.nodeName == "Variable" || primitive.value.nodeName == "Converter" || primitive.value.nodeName == "Flow" || primitive.value.nodeName == "Display" || primitive.value.nodeName == "Agents" || primitive.value.nodeName == "Transition" || primitive.value.nodeName == "State") {
		if (name.length > 0 && (!(/[\[\]\(\)\{\}\<\>\'\"]/.test(name)))) {
			return true;
		} else {
			mxUtils.alert(getText("Primitive names cannot contain brackets, parenthesis, or quotes."));
			return false;
		}
	} else {
		return true;
	}
}

function isPrimitive(cell) {
	return !(cell.value.nodeName == 'Button' || cell.value.nodeName == 'Picture' || cell.value.nodeName == 'Text');
}

function cellsContainNodename(myCells, name) {
	for (var i = 0; i < myCells.length; i++) {
		if (myCells[i].value.nodeName == name) {
			return true;
		}
	}
}


function connectionType() {
	if (ribbonPanelItems().down('#connect').pressed) {
		return "Flow";
	} else {
		return "Link";
	}
	return "None";
}

function setAllConnectable() {
	graph.setConnectable(true);
	var items = primitives();
	for (var i = 0; i < items.length; i++) {
		items[i].setConnectable(true);
	}
}

var primitiveCache = {};
//cache clearing is set in InsightEditor.js


function primitives(type) {
	if (primitiveCache[" " + type]) {
		return primitiveCache[" " + type];
	}
	var myCells = childrenCells(((graph instanceof SimpleNode)?graph.children[0]:graph.getModel().getRoot()).children[0]);
	if (type == null) {
		primitiveCache[" " + type] = myCells;
	} else {
		var targetCells = [];
		for (var i = 0; i < myCells.length; i++) {
			if (myCells[i].value.nodeName == type) {
				targetCells.push(myCells[i]);
			}
		}
		primitiveCache[" " + type] = targetCells;
	}
	return primitiveCache[" " + type];
}

function childrenCells(root) {
	var myCells = root?root.children:null;
	if (myCells != null) {
		var additions = [];
		for (var i = 0; i < myCells.length; i++) {
			//alert(myCells[i].value.nodeName);
			if (myCells[i].value.nodeName == "Folder") {
				additions = additions.concat(childrenCells(myCells[i]));
			}
		}
		myCells = myCells.concat(additions);
		for (var i = myCells.length - 1; i >= 0; i--) {
			if (myCells[i] == null || myCells[i].value == null) {
				myCells.splice(i, 1);
			}
		}
		return myCells;
	}
	return null;
}


var neighborhoodCache = {};
//cache clearing is set in InsightEditor.js

function clearPrimitiveCache() {
	primitiveCache = {};
	neighborhoodCache = {};
}

function neighborhood(target) {
	var targetInAgent = inAgent(target);
	if (neighborhoodCache[target.id]) {
		return neighborhoodCache[target.id];
	}
	var hood = [];
	var myCells = primitives();
	if (myCells != null) {
		if (target != null) {
			var flows = [];
			var links = [];
			if (["Flow","Link","Transition"].indexOf(target.value.nodeName) > -1) {
				if (orig(target.source) !== null) {
					hood.push({
						item: orig(target.source),
						type: "direct"
					});
				}
				if (orig(target.target) !== null) {
					hood.push({
						item: orig(target.target),
						type: "direct"
					});
				}
			}
			if (target.value.nodeName == "Agents") {
				if (target.getAttribute("Agent")) {
					hood = hood.concat(getAgentItems(target));
				}
			}
			for (var i = 0; i < myCells.length; i++) {
				if (myCells[i].value.nodeName == "Flow") {
					flows.push(orig(myCells[i]));
				} else if (myCells[i].value.nodeName == "Link") {
					links.push(orig(myCells[i]));
				}
			}
			for (var i = 0; i < flows.length; i++) {
				if (flows[i].source == target) {
					hood.push({
						item: flows[i],
						type: "direct",
						linkHidden: true
					});
				}
				if (flows[i].target == target) {
					hood.push({
						item: flows[i],
						type: "direct",
						linkHidden: true
					});
				}
			}
			for (var i = 0; i < links.length; i++) {
				if (orig(links[i].source) == target && (isDefined(links[i].target) && links[i].target !== null)) {
					var linkHidden = !isTrue(links[i].getAttribute("BiDirectional"));

					hood.push({
						item: orig(links[i].target),
						type: "direct",
						linkHidden: linkHidden
					});
					hood = hood.concat(getAgentItems(links[i].target, linkHidden));
				}
				if (orig(links[i].target) == target && (isDefined(links[i].source) && links[i].source !== null) && !(inAgent(orig(links[i].source)) && !targetInAgent)) {
					hood.push({
						item: orig(links[i].source),
						type: "direct"
					});
					hood = hood.concat(getAgentItems(links[i].source));
				}
			}
		} else {
			for (var i = 0; i < myCells.length; i++) {
				if (isValued(myCells[i])) {
					hood.push({
						item: orig(myCells[i]),
						type: "direct"
					});
				}
			}
		}
	}
	hood = hood.filter(function(x){
		return x;
	});
	var res = [];

	//Remove duplicated elements
	for (var i = 0; i < hood.length; i++) {
		if(hood[i].linkHidden && strictLinks){
			continue;
		}
		var found = false;
		for (var j = 0; j < res.length; j++) {
			if (res[j].type == hood[i].type && res[j].item.id == hood[i].item.id) {
				found = true;
        if (res[j].linkHidden && !hood[i].linkHidden){
          res[j].linkHidden = false;
        }
				break;
			}
		}
		if (!found) {
			if (isValued(hood[i].item) || (hood[i].item.value.nodeName == "Agents")) {
				res.push(hood[i]);
			}
		}
	}
	neighborhoodCache[target.id] = res;
	return res;

	function getAgentItems(agent, linkHidden) {
		var res = [];
		if (orig(agent).value.nodeName == "Agents" && orig(agent).getAttribute("Agent")) {
			var id = orig(agent).getAttribute("Agent");
			if (id) {
				var items = getChildren(findID(id));
				items.forEach(function(x) {
					if (isValued(x) && x.value.nodeName != "Ghost") {
						res.push({
							item: x,
							type: "agent",
							linkHidden: linkHidden,
							name: x.getAttribute("name")
						});
					}
				})
			}
		}

		return res.sort(function(a, b) {
			if (a.name == b.name) {
				return 0;
			} else if (a.name > b.name) {
				return 1
			} else {
				return -1;
			}
		});
	}
}

function doubleArray(arr) {
	var narr = [];
	for (var i = 0; i < arr.length; i++) {
		narr.push([arr[i], arr[i]])
	}
	return narr;
}

function isValued(cell) {
	if (isUndefined(cell) || cell == null || isUndefined(orig(cell))) {
		return false;
	}
	return (orig(cell).value.nodeName == "Converter" || orig(cell).value.nodeName == "Flow" || orig(cell).value.nodeName == "Stock" || orig(cell).value.nodeName == "Variable" || orig(cell).value.nodeName == "Transition" || orig(cell).value.nodeName == "State");
}

function setSaveEnabled(e) {
	if (is_editor && (!is_embed)) {
		var b = ribbonPanelItems().getComponent('savebut');
		if (e && unfoldingManager.unfolding == false) {
			b.setDisabled(false);
			b.setText('Save');
		} else {
			b.setDisabled(true);
			b.setText('Saved');
		}
	}
}

function updateWindowTitle() {
	if (!is_embed) {
		if (graph_title == "") {
			document.title = "Untitled Insight | Insight Maker";
		} else {
			document.title = graph_title + " | Insight Maker";
			if(window.history && window.history.replaceState){

				window.history.replaceState('Object', document.title, '/insight/' + drupal_node_ID + "/" + getURLTitle());
			}
		}
	}
}

function getURLTitle(){
	var t = graph_title.replace(/&#\d+;/g, "");
	t = t.replace(/'/g, '');
	t = t.replace(/[^A-Za-z0-9]/g, "-");
	t = t.replace(/\-+/g, "-");
	t = t.replace(/(^\-)|(\-$)/g, "");
	if(t.toLowerCase().indexOf("embed") == 0){
		t = "_" + t;
	}
	return t;
}

function hasDisplay() {
	var myCells = primitives();
	return cellsContainNodename(myCells, "Display");
}

function urlImage(cell) {
	return cell.getAttribute("Image") && cell.getAttribute("Image").substring(0, 4).toLowerCase() == "http";
}

function setPicture(cell) {

	var styleString = cell.getStyle();
	if (cell.getAttribute("Image") == "None" || cell.getAttribute("Image") == "" || cell.getAttribute("Image") == " " || cell.getAttribute("Image") == "null" || (cell.value.nodeName == "Folder" && !cell.isCollapsed())) {
		styleString = mxUtils.setStyle(styleString, "image", "None");
		if (cell.value.nodeName == "Display" || cell.value.nodeName == "Stock" || cell.value.nodeName == "Folder") {
			styleString = mxUtils.setStyle(styleString, "shape", "rectangle");
		} else if (cell.value.nodeName == "Button") {
			styleString = mxUtils.setStyle(styleString, "shape", "rectangle");
		} else {
			styleString = mxUtils.setStyle(styleString, "shape", "ellipse");
		}
	} else {
		//alert(cell.getAttribute("Image"));
		if (urlImage(cell)) {
			styleString = mxUtils.setStyle(styleString, "image", cell.getAttribute("Image"));
		} else {
			styleString = mxUtils.setStyle(styleString, "image", builder_path + "/images/SD/" + cell.getAttribute("Image") + ".png");
		}
		if (isTrue(cell.getAttribute("FlipVertical"))) {
			styleString = mxUtils.setStyle(styleString, "imageFlipV", 1);
		} else {
			styleString = mxUtils.setStyle(styleString, "imageFlipV", 0);
		}
		if (isTrue(cell.getAttribute("FlipHorizontal"))) {
			styleString = mxUtils.setStyle(styleString, "imageFlipH", 1);
		} else {
			styleString = mxUtils.setStyle(styleString, "imageFlipH", 0);
		}
		styleString = mxUtils.setStyle(styleString, "shape", "image");
	}
	var edit = new mxStyleChange(graph.getModel(), cell, styleString);

	graph.getModel().execute(edit);

	//cell.setStyle(styleString);
	propogateGhosts(cell);
}

function setLabelPosition(cell) {


	var labelPos = cell.getAttribute("LabelPosition");

	var styleString = cell.getStyle();

	if (cell.value.nodeName == "Folder" && (!cell.isCollapsed())) {
		styleString = mxUtils.setStyle(styleString, "labelPosition", null);
		styleString = mxUtils.setStyle(styleString, "align", null);

		styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", null);
		styleString = mxUtils.setStyle(styleString, "verticalAlign", null);

	} else {

		if (labelPos == "Top") {
			styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "align", "center");

			styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "top");
			styleString = mxUtils.setStyle(styleString, "verticalAlign", "bottom");
		} else if (labelPos == "Bottom") {
			styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "align", "center");

			styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "bottom");
			styleString = mxUtils.setStyle(styleString, "verticalAlign", "top");
		} else if (labelPos == "Middle") {
			styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "align", "center");

			styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "verticalAlign", "middle");
		} else if (labelPos == "Left") {
			styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "verticalAlign", "middle");

			styleString = mxUtils.setStyle(styleString, "labelPosition", "left");
			styleString = mxUtils.setStyle(styleString, "align", "right");
		} else if (labelPos == "Right") {
			styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "middle");
			styleString = mxUtils.setStyle(styleString, "verticalAlign", "middle");

			styleString = mxUtils.setStyle(styleString, "labelPosition", "right");
			styleString = mxUtils.setStyle(styleString, "align", "left");
		}
	}

	var edit = new mxStyleChange(graph.getModel(), cell, styleString);

	graph.getModel().execute(edit);

	//cell.setStyle(styleString);
	propogateGhosts(cell);
}

function removeAgent(cell) {
	var items = primitives("Agents");
	for (var i = 0; i < items.length; i++) {
		if (items[i].getAttribute("Agent") == cell.id) {
			items[i].setAttribute("Agent", "");
		}
	}
}

function deletePrimitive(cell) {
	var myCells = primitives();

	var setting = getSetting();
	if (setting.getAttribute("SensitivityPrimitives")) {
		var items = setting.getAttribute("SensitivityPrimitives").split(",");
		var j = items.indexOf(cell.id);
		if (j > -1) {
			items.splice(j, 1);
			setting.setAttribute("SensitivityPrimitives", items.join(","));
		}
	}


	if (cell.value.nodeName == "Folder" && cell.getAttribute("Type") == "Agent") {
		removeAgent(cell);
	}

	for (var i = 0; i < myCells.length; i++) {
		if (myCells[i].value.nodeName == "Display") {
			if (myCells[i].getAttribute("Primitives")) {
				var items = myCells[i].getAttribute("Primitives").split(",");
				var j = items.indexOf(cell.id);
				if (j > -1) {
					items.splice(j, 1);
					myCells[i].setAttribute("Primitives", items.join(","));
				}
			}
		} else if (myCells[i].value.nodeName == "Converter") {
			if (myCells[i].getAttribute("Source") == cell.id) {
				myCells[i].setAttribute("Source", "Time");
			} else if (cell.value.nodeName == "Link") {
				testConverterSource(myCells[i]);
			}
		} else if (myCells[i].value.nodeName == "Ghost") {
			if (myCells[i].value.getAttribute("Source") == cell.id) {
				var k = myCells[i];

				deletePrimitive(k);
				graph.removeCells([k], false);

			}
		}
	}
}

function linkBroken(edge) {
	var myCells = primitives();
	for (var i = 0; i < myCells.length; i++) {
		if (myCells[i].value.nodeName == "Converter") {
			testConverterSource(myCells[i]);
		}
		/*else if(myCells[i].value.nodeName == "Agents") {
            var source = myCells[i].getAttribute("Agent");
			if(source){
				if(! connected(myCells[i], findID(source))){
					myCells[i].setAttribute("Agent", "");
				}
			}
        }*/
	}
	if ((edge.getTerminal(false) !== null) && edge.getTerminal(false).value.nodeName == "Converter") {
		if (typeof(edge.getTerminal(true)) != "undefined") {
			if (isValued(edge.getTerminal(true))) {
				edge.getTerminal(false).setAttribute("Source", orig(edge.getTerminal(true)).id);
			}
		}
	}

}

function testConverterSource(target) {
	var neigh = neighborhood(target);
	var found = false;
	for (var j = 0; j < neigh.length; j++) {
		if (!neigh[j].linkHidden) {
			if (target.getAttribute("Source") == neigh[j].item.id) {
				found = true;
			}
		}
	}
	if (!found) {
		target.setAttribute("Source", "Time");
	}
}

function downloadModel() {
	var data = getGraphXml(graph);
	surpressCloseWarning = true;
	document.getElementById('downloader').title.value = encodeURIComponent(graph_title);
	document.getElementById('downloader').code.value = encodeURIComponent(data);
	document.getElementById('downloader').submit()
	//alert(encodeURIComponent(data));
	//location.href = "/builder/downloader.php?code=" + encodeURIComponent(data) + "&title=" + encodeURIComponent(graph_title);
}

function getSetting() {
	var myCells = primitives();

	for (var i = 0; i < myCells.length; i++) {
		if (myCells[i].value.nodeName == "Setting") {
			return myCells[i];
		}
	}
	alert("Settings primitive could not be found.")
	return null;
}

function handelCursors() {
	graph.container.style.cursor = 'auto';
}

var propertiesWin;

function updateProperties() {
	var model_title;
	if (graph_title == "") {
		model_title = "Untitled Insight";
	} else {
		model_title = graph_title;
	}

	if (!propertiesWin) {
		propertiesWin = new Ext.Window({
			applyTo: 'property-win',
			layout: {
				type: 'vbox',
				align: "stretch"
			},
			modal: true,
			width: 550,
			title: "Save Insight",
			autoHeight: true,
			minHeight: 300,
			minWidth: 450,
			closable: true,
			resizable: true,
			autoScroll: true,
			closeAction: 'hide',
			defaults: {
				width: 230,
				labelWidth: 150
			},
			items: [new Ext.form.TextField({
				fieldLabel: 'Insight Title',
				name: 'sinsightTitle',
				id: 'sinsightTitle',
				allowBlank: false,
				selectOnFocus: true,
				value: model_title,
				margin: 9
			}), new Ext.form.TextField({
				fieldLabel: 'Tags',
				name: 'sinsightTags',
				id: 'sinsightTags',
				allowBlank: true,
				emptyText: "Environment, Health Care, Finance",
				value: graph_tags,
				margin: 9
			}), new Ext.form.field.HtmlEditor({
				enableColors: false,
				enableSourceEdit: false,
				enableFont: false,
				enableLists: true,
				enableFontSize: false,
				fieldLabel: 'Description',
				name: 'sinsightDescription',
				id: 'sinsightDescription',
				allowBlank: true,
				emptyText: "Enter a brief description of the Insight.",
				value: graph_description,
				margin: 9,
				minHeight: 100,
				flex: 1
			}),
			{
			        xtype: 'fieldcontainer',
			        fieldLabel: 'Insight Access',
			        layout: 'hbox',
			        defaults: {
			            flex: 1,
			            hideLabel: true
			        },
					margin: 9,
			        items: [
			{
				xtype: "segmentedbutton",
				items: [
				{
					glyph: 0xf0ac,
					text: 'Public Insight',
					pressed: published,
					id: 'insightPublic',
					tooltip: "This Insight is public. Anyone can view it, but only you can edit it."
				},
				{
					glyph: 0xf084,
					//iconCls: 'green-icon',
					text: 'Private Insight',
					pressed: ! published,
					tooltip: "This Insight is private. Only people you have given access to can view it."
				}
				]
			}
		]}, Ext.create('Ext.form.field.Tag', {
			hidden: user_groups.length == 0,
				fieldLabel: 'Share with Groups',
				name: 'sinsightGroups',
				id: 'sinsightGroups',
				value: node_groups,
				allowBlank: true,
				filterPickList: true,
				store: group_titles,
				margin: 9
			})
		],

			buttons: [{
				text: 'Cancel',
				scale: "large",
				glyph: 0xf05c,
				handler: function() {
					propertiesWin.hide();
				}
			}, {
				glyph: 0xf00c,
				scale: "large",
				text: 'Save',
				handler: function() {
					if (Ext.getCmp("sinsightTitle").validate()) {
						propertiesWin.hide();
						graph_title = Ext.String.trim(Ext.getCmp('sinsightTitle').getValue());
						graph_description = Ext.String.trim(Ext.getCmp('sinsightDescription').getValue());
						graph_description = graph_description.replace(/^(\u200b|&nbsp;)/g, "");
						graph_description = graph_description.replace(/(\u200b|&nbsp;)$/g, "");
						if (graph_description == "<br>" || graph_description == "<br/>" || graph_description == "\u200b" || graph_description == "&nbsp;") {
							graph_description = "";
						}
						graph_tags = Ext.getCmp('sinsightTags').getValue();
						node_groups = Ext.getCmp('sinsightGroups').getValue();
						published = Ext.getCmp('insightPublic').pressed;
						setSaveEnabled(true);
						sendGraphtoServer(graph);
						selectionChanged(false);
					} else {
						showNotification(getText("You must specify a name for the Insight."), "error", true);
					}
				}
			}]


		});
	} else {
		if (graph_title != "") {
			Ext.getCmp('sinsightTitle').setValue(graph_title);
			Ext.getCmp('sinsightTags').setValue(graph_tags);
			Ext.getCmp('sinsightDescription').setValue(graph_description);
		}
	}
	propertiesWin.show();
	Ext.getCmp("sinsightTitle").focus(true, 300);
}

function isTrue(item) {
	return (item != "false" && item != "No" && item != 0) && (item == 1 || item == -1 || item == "True" || item == "true" || item == true || item == "Yes");
}

function customUnits() {
	if (typeof(getSetting().getAttribute("Units")) != "undefined") {
		var rows = getSetting().getAttribute("Units").split("\n");
		for (var i = 0; i < rows.length; i++) {
			rows[i] = rows[i].split("<>");
		}
		return rows;
	} else {
		return [];
	}
}


function orig(cell) {
	if (isUndefined(cell) || cell === null) {
		return null;
	}
	if (cell.value.nodeName === "Ghost") {
		return findID(cell.value.getAttribute("Source"));
	} else {
		return cell;
	}
}

function currentStyleIs(val) {
	var tmp = graph.getCellStyle(graph.getSelectionCell())[mxConstants.STYLE_FONTSTYLE];
	for (var i = 3; i >= 1; i--) {

		tmp = tmp - val * (Math.pow(2, i));
		if (tmp < 0) {
			tmp = tmp + val * Math.pow(2, i);
		}
	}
	return (tmp >= val);
}

function setStyles() {
	if ((!is_embed) && is_editor) {
		var selected = !graph.isSelectionEmpty();

		var r = ribbonPanelItems();

		if (selected) {
			r.down('#bold').setChecked(currentStyleIs(mxConstants.FONT_BOLD));
			r.down('#italic').setChecked(currentStyleIs(mxConstants.FONT_ITALIC));
			r.down('#underline').setChecked(currentStyleIs(mxConstants.FONT_UNDERLINE));
			var style = graph.getCellStyle(graph.getSelectionCell());
			r.down("#sizeCombo").setValue(style[mxConstants.STYLE_FONTSIZE]);
			r.down("#fontCombo").setValue(style[mxConstants.STYLE_FONTFAMILY]);
		} else {
			r.down('#bold').setChecked(false);
			r.down('#italic').setChecked(false);
			r.down('#underline').setChecked(false);
			r.down("#fontCombo").setValue("");
			r.down("#sizeCombo").setValue("");
		}
	}
}

function stringArray(items, comma, and) {
	if (items.length == 0) {
		return "";
	} else if (items.length == 1) {
		return items[0];
	} else {
		var i = items.slice();
		var last = i.pop();
		var first = i.join(comma);
		return first + and + last;
	}
}

function quickLabel(label, title, objects) {
	var setting = getSetting();

	return processLabel(label, title, objects, setting.getAttribute("TimeUnits"), setting.getAttribute("TimeStep"), setting.getAttribute("SolutionAlgorithm"));
}

function processLabel(label, title, objects, units, timeStep, algorithm) {
	var ph = "<PERCENTSIGNPLACEHOLDER>";
	label = replaceAll(label, "%%", ph);

	label = replaceAll(label, "%u", units);
	label = replaceAll(label, "%t", title);
	label = replaceAll(label, "%o", objects);
	label = replaceAll(label, "%ts", timeStep);
	label = replaceAll(label, "%a", algorithm);

	label = replaceAll(label, ph, "%");

	return clean(label);
}

function replaceAll(txt, replace, with_this) {

	if (isUndefined(txt)) {
		return "";
	}
	return txt.replace(new RegExp(replace, 'g'), with_this);
}

function loadBackgroundColor() {
	mxPanel.el.dom.style["background-color"] = getSetting().getAttribute("BackgroundColor");

	mxPanel.el.dom.style.backgroundColor = getSetting().getAttribute("BackgroundColor");
}

function isUndefined(item) {
	return typeof(item) == "undefined";
}

function isDefined(item) {
	return (!isUndefined(item));
}


function isTouch() {
	return mxClient.IS_TOUCH;
}

function propogateGhosts(cell) {
	var ghosts = primitives("Ghost");
	for (var i = 0; i < ghosts.length; i++) {
		if (ghosts[i].getAttribute("Source") == cell.id) {
			var style = cell.getStyle();
			style = mxUtils.setStyle(style, "opacity", 30);
			ghosts[i].setStyle(style);
			//console.log(cell.getAttribute("name"));
			var edit = setAttributeUndoable(ghosts[i], "name", cell.getAttribute("name"));

		}
	}
}

function propogateName(cell, oldName) {
	if (isValued(cell)) {
		//console.log(oldName)
		var newValue = getName(cell);
		var patt = new RegExp("\\[" + oldName + "\\]", "gi");

		var connected = graph.getConnections(cell);
		for (var i = 0; i < connected.length; i++) {
			if((!connected[i].target) || (!connected[i].source)){
				continue;
			}
			var neighbor;
			if (connected[i].value.nodeName == "Flow" || connected[i].value.nodeName == "Transition") {
				neighbor = connected[i];
			} else if (connected[i].target.id == cell.id) {
				neighbor = connected[i].source;
			} else {
				neighbor = connected[i].target;
			}
			//console.log(neighbor.getAttribute("name"))
			if (isValued(neighbor) || (neighbor && neighbor.value.nodeName == "Action")) {
				//console.log(getValue(neighbor))
				setValue(neighbor, getValue(neighbor).replace(patt, "[" + newValue + "]"))
			}
		}


	}
}

function map(val, fn) {
	if (val instanceof Array) {
		return val.map(fn);
	} else {
		return fn(val);
	}
}

function unitsUsedInModel() {
	var items = primitives();
	var us = [];
	for (var i = 0; i < items.length; i++) {
		var u = items[i].getAttribute("Units");
		if (items[i].value.nodeName != "Setting" && isDefined(u) && u !== null && u != "Unitless") {
			us.push(u);
		}
	}
	return Ext.Array.unique(us);
}

function changeNodeName(node, newName) {
	var doc = mxUtils.createXmlDocument();
	var newNode = doc.createElement(newName);
	var attrs = node.attributes;
	for (var i = 0; i < attrs.length; i++) {
		newNode.setAttribute(attrs[i].name, attrs[i].value)
	}
	return newNode;
}

function cmd(key) {
	if (mxClient.IS_MAC) {
		return "<span style='color:grey'>(&#8984;" + key + ")</span>";
	} else {
		return "<span style='color:grey'>(Ctrl-" + key + ")</span>";
	}
}

function inAgent(cell) {
	if ((!cell) || cell == null) {
		return false;
	}

	var p = getParent(cell);
	if (p) {
		//console.log(p);
		if (p.getAttribute("Type") == "Agent") {
			return true;
		}
	}
	return inAgent(p);
}

function parentAgent(cell) {
	if ((!cell) || cell == null) {
		return undefined;
	}

	var p = getParent(cell);
	if (p) {
		//console.log(p);
		if (p.getAttribute("Type") == "Agent") {
			return p;
		}
	}
	return parentAgent(p);
}

function isGray(color) {
	if (isUndefined(color)) {
		return true;
	}
	var c;
	if (color[0] == "#") {
		c = color;
	} else {
		c = colourNameToHex(color);
	}
	if (c == "#6482B9") {
		return true; //treat flows as grey alwayse
	}
	var start = c[1];
	if (c.length == 4) {
		for (var i = 2; i < c.length; i++) {
			if (c[i] != start) {
				return false;
			}
		}
	} else if (c.length == 7) {
		for (var i = 1; i < c.length; i = i + 2) {
			if (c[i] != start) {
				return false;
			}
		}
		var start = c[2];
		for (var i = 2; i < c.length; i = i + 2) {
			if (c[i] != start) {
				return false;
			}
		}
	}
	return true;
}

function colourNameToHex(colour) {
	var colours = {
		"aliceblue": "#f0f8ff",
		"antiquewhite": "#faebd7",
		"aqua": "#00ffff",
		"aquamarine": "#7fffd4",
		"azure": "#f0ffff",
		"beige": "#f5f5dc",
		"bisque": "#ffe4c4",
		"black": "#000000",
		"blanchedalmond": "#ffebcd",
		"blue": "#0000ff",
		"blueviolet": "#8a2be2",
		"brown": "#a52a2a",
		"burlywood": "#deb887",
		"cadetblue": "#5f9ea0",
		"chartreuse": "#7fff00",
		"chocolate": "#d2691e",
		"coral": "#ff7f50",
		"cornflowerblue": "#6495ed",
		"cornsilk": "#fff8dc",
		"crimson": "#dc143c",
		"cyan": "#00ffff",
		"darkblue": "#00008b",
		"darkcyan": "#008b8b",
		"darkgoldenrod": "#b8860b",
		"darkgray": "#a9a9a9",
		"darkgreen": "#006400",
		"darkkhaki": "#bdb76b",
		"darkmagenta": "#8b008b",
		"darkolivegreen": "#556b2f",
		"darkorange": "#ff8c00",
		"darkorchid": "#9932cc",
		"darkred": "#8b0000",
		"darksalmon": "#e9967a",
		"darkseagreen": "#8fbc8f",
		"darkslateblue": "#483d8b",
		"darkslategray": "#2f4f4f",
		"darkturquoise": "#00ced1",
		"darkviolet": "#9400d3",
		"deeppink": "#ff1493",
		"deepskyblue": "#00bfff",
		"dimgray": "#696969",
		"dodgerblue": "#1e90ff",
		"firebrick": "#b22222",
		"floralwhite": "#fffaf0",
		"forestgreen": "#228b22",
		"fuchsia": "#ff00ff",
		"gainsboro": "#dcdcdc",
		"ghostwhite": "#f8f8ff",
		"gold": "#ffd700",
		"goldenrod": "#daa520",
		"gray": "#808080",
		"green": "#008000",
		"greenyellow": "#adff2f",
		"honeydew": "#f0fff0",
		"hotpink": "#ff69b4",
		"indianred ": "#cd5c5c",
		"indigo ": "#4b0082",
		"ivory": "#fffff0",
		"khaki": "#f0e68c",
		"lavender": "#e6e6fa",
		"lavenderblush": "#fff0f5",
		"lawngreen": "#7cfc00",
		"lemonchiffon": "#fffacd",
		"lightblue": "#add8e6",
		"lightcoral": "#f08080",
		"lightcyan": "#e0ffff",
		"lightgoldenrodyellow": "#fafad2",
		"lightgrey": "#d3d3d3",
		"lightgreen": "#90ee90",
		"lightpink": "#ffb6c1",
		"lightsalmon": "#ffa07a",
		"lightseagreen": "#20b2aa",
		"lightskyblue": "#87cefa",
		"lightslategray": "#778899",
		"lightsteelblue": "#b0c4de",
		"lightyellow": "#ffffe0",
		"lime": "#00ff00",
		"limegreen": "#32cd32",
		"linen": "#faf0e6",
		"magenta": "#ff00ff",
		"maroon": "#800000",
		"mediumaquamarine": "#66cdaa",
		"mediumblue": "#0000cd",
		"mediumorchid": "#ba55d3",
		"mediumpurple": "#9370d8",
		"mediumseagreen": "#3cb371",
		"mediumslateblue": "#7b68ee",
		"mediumspringgreen": "#00fa9a",
		"mediumturquoise": "#48d1cc",
		"mediumvioletred": "#c71585",
		"midnightblue": "#191970",
		"mintcream": "#f5fffa",
		"mistyrose": "#ffe4e1",
		"moccasin": "#ffe4b5",
		"navajowhite": "#ffdead",
		"navy": "#000080",
		"oldlace": "#fdf5e6",
		"olive": "#808000",
		"olivedrab": "#6b8e23",
		"orange": "#ffa500",
		"orangered": "#ff4500",
		"orchid": "#da70d6",
		"palegoldenrod": "#eee8aa",
		"palegreen": "#98fb98",
		"paleturquoise": "#afeeee",
		"palevioletred": "#d87093",
		"papayawhip": "#ffefd5",
		"peachpuff": "#ffdab9",
		"peru": "#cd853f",
		"pink": "#ffc0cb",
		"plum": "#dda0dd",
		"powderblue": "#b0e0e6",
		"purple": "#800080",
		"red": "#ff0000",
		"rosybrown": "#bc8f8f",
		"royalblue": "#4169e1",
		"saddlebrown": "#8b4513",
		"salmon": "#fa8072",
		"sandybrown": "#f4a460",
		"seagreen": "#2e8b57",
		"seashell": "#fff5ee",
		"sienna": "#a0522d",
		"silver": "#c0c0c0",
		"skyblue": "#87ceeb",
		"slateblue": "#6a5acd",
		"slategray": "#708090",
		"snow": "#fffafa",
		"springgreen": "#00ff7f",
		"steelblue": "#4682b4",
		"tan": "#d2b48c",
		"teal": "#008080",
		"thistle": "#d8bfd8",
		"tomato": "#ff6347",
		"turquoise": "#40e0d0",
		"violet": "#ee82ee",
		"wheat": "#f5deb3",
		"white": "#ffffff",
		"whitesmoke": "#f5f5f5",
		"yellow": "#ffff00",
		"yellowgreen": "#9acd32"
	};

	if (typeof colours[colour.toLowerCase()] != 'undefined')
		return colours[colour.toLowerCase()];

	return false;
}


function printGraph() { // P
	var pageCount = mxUtils.prompt(getText('Enter page count for printing') + ":", '1');

	if (pageCount != null) {
		var scale = mxUtils.getScaleForPageCount(pageCount, graph);
		var preview = new mxPrintPreview(graph, scale);
		preview.open();
	}
}

function flatten(arr) {
	var r = [];

	function recFlatten(a) {
		var i, ln, v;

		for (i = 0, ln = a.length; i < ln; i++) {
			v = a[i];

			if (Array.isArray(v)) {
				recFlatten(v);
			} else {
				r.push(v);
			}
		}

		return r;
	}

	return recFlatten(arr);
}

var downloadButton = function(name){
	return {
					xtype: 'button',
					text: 'Download',
					glyph: 0xf0ed,
					handler: function(){
						var grid = this.up("gridpanel");
						var store = grid.getStore();
						var columns = grid.columns;//store.fields ? store.fields.items : store.model.prototype.fields.items;

						var res = "";

						res += columns.filter(function(x){
							return !x.hidden;
						}).map(function(x){
								return '"' + (x.text || x.name).replace(/"/g, '""') + '"';
							}).join(",");

				        store.each(function(record, index) {
					        var cells = [];
					        columns.forEach(function(col) {
					            var name = col.name || col.dataIndex;
					            if(name) {
					                //if (Ext.isFunction(col.renderer)) {
					                 // var value = col.renderer(record.get(name), null, record);
					                //} else {
					                  var value = ""+record.get(name);
					                //}
					                cells.push('"'+value.replace(/"/g, '""')+'"');
					            }
					        });


				          res += "\r\n" + cells.join(",");
				        });

						downloadFile(name+".csv", res);
					}
				};
			}


			function deepClone(target, obj, depth, fn){
				var options, name, src, copy, copyIsArray, clone;

						// Only deal with non-null/undefined values
						if ( (options = arguments[ 1 ]) != null ) {
							// Extend the base object
							for ( name in options ) {
								src = target[ name ];
								copy = options[ name ];

								// Prevent never-ending loop
								if ( target === copy ) {
									continue;
								}
								if(fn){
									var x = fn(copy);
									if(x){
										target[name] = x;
										continue;
									}
								}
								// Recurse if we're merging plain objects or arrays
								if ( depth > 0 && copy && ( (copyIsArray = Array.isArray(copy)) || typeof(copy)=="object" ) ) {
									if ( copyIsArray ) {
										copyIsArray = false;
										clone = src && Array.isArray(src) ? src : [];

									} else {
										clone = src && typeof(srv)=="object" ? src : {};
									}

									// Never move original objects, clone them
									target[ name ] = deepClone( clone, copy, depth-1, fn );

								// Don't bring in undefined values
								} else if ( copy !== undefined ) {
									target[ name ] = copy;
								}
							}
						}

					// Return the modified object
					return target;

			}

			function exportSvg() {
				var scale = graph.view.scale;
				var bounds = graph.getGraphBounds();

				// Prepares SVG document that holds the output
				var svgDoc = mxUtils.createXmlDocument();
				var root = (svgDoc.createElementNS != null) ?
					svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');

				if (root.style != null) {
					root.style.backgroundColor = '#FFFFFF';
				} else {
					root.setAttribute('style', 'background-color:#FFFFFF');
				}

				if (svgDoc.createElementNS == null) {
					root.setAttribute('xmlns', mxConstants.NS_SVG);
				}

				root.setAttribute('width', Math.ceil(bounds.width * scale + 2) + 'px');
				root.setAttribute('height', Math.ceil(bounds.height * scale + 2) + 'px');
				root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
				root.setAttribute('version', '1.1');

				// Adds group for anti-aliasing via transform
				var group = (svgDoc.createElementNS != null) ?
					svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
				group.setAttribute('transform', 'translate(0.5,0.5)');
				root.appendChild(group);
				svgDoc.appendChild(root);

				// Renders graph. Offset will be multiplied with state's scale when painting state.
				var svgCanvas = new mxSvgCanvas2D(group);
				svgCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
				svgCanvas.scale(scale);

				var imgExport = new mxImageExport();
				imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);


				var xml = (mxUtils.getXml(root));

				downloadFile("Insight Maker Diagram.svg", xml);
			};
