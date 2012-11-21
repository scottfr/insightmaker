"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/



var analysisCount = 0;


function getGraphXml(graph) {
    var enc = new mxCodec(mxUtils.createXmlDocument());
    var node = enc.encode(graph.getModel());
    return mxUtils.getPrettyXml(node);
}

function sendGraphtoServer(graph) {
	
    Ext.Ajax.request({
        url: builder_path+'/save.php',
        method: 'POST',
        params: {
            data: getGraphXml(graph),
            nid: drupal_node_ID,
            title: graph_title,
            description: graph_description,
            tags: graph_tags
        },

        success: function(result, request) {
			if(parseInt(result.responseText) != result.responseText){
				console.log("Insight Save Issue:\n\n"+result.responseText);
			}else{
	            drupal_node_ID = result.responseText;
	            setSaveEnabled(false);
	            updateWindowTitle();
	            setTopLinks();
			}
        },
        failure: function(result, request) {
			console.log("Insight Not Saved:\n\n"+result.responseText);
            /*Ext.MessageBox.hide();
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'The Insight could not be saved. Please try again later.',
                buttons: Ext.MessageBox.OK,
                animEl: 'mb9',
                icon: Ext.MessageBox.ERROR
            });*/
        }
    });
}

function validPrimitiveName(name, primitive) {
	if(primitive.value.nodeName == "Stock" || primitive.value.nodeName == "Variable" || primitive.value.nodeName == "Converter" || primitive.value.nodeName == "Flow" || primitive.value.nodeName == "Display" || primitive.value.nodeName == "Agents" || primitive.value.nodeName == "Transition" || primitive.value.nodeName == "State"){
    	if(name.length > 0 && (!(/[^A-Za-z0-9\-_ \$\&\?\.\,\#\%]/.test(name))) ){
    		return true;
    	}else{
			mxUtils.alert("Primitive names must only contain numbers, letters, spaces and the following special characters: '&', '$', '#', '.', ',', '%', and '?'.");
    		return false;
    	}
	}else{
		return true;
	}
}

function isPrimitive(cell) {
    return ! (cell.value.nodeName == 'Button' || cell.value.nodeName == 'Picture' || cell.value.nodeName == 'Text');
}

function cellsContainNodename(myCells, name) {
    for (var i = 0; i < myCells.length; i++)
    {
        if (myCells[i].value.nodeName == name) {
            return true;
        }
    }
}

function nodeInsertSelected() {
    var panel = ribbonPanelItems().getComponent('valued');
    return (panel.getComponent('stock').pressed || panel.getComponent('variable').pressed || panel.getComponent('text').pressed || panel.getComponent('converter').pressed || panel.getComponent('picture').pressed || panel.getComponent('buttonBut').pressed)
}

function connectionType() {
    if (ribbonPanelItems().getComponent('connect').getComponent('link').pressed) {
        return "Link";
    } else if (ribbonPanelItems().getComponent('connect').getComponent('flow').pressed) {
        return "Flow";
    }
    return "None";
}

function setAllConnectable(){
	graph.setConnectable(true);
	var items = primitives();
	for (var i = 0; i < items.length; i++) {
		items[i].setConnectable(true);
	}
}

var primitiveCache = {};
//cache clearing is set in InsightEditor.js
function primitives(type) {
	if(primitiveCache[" "+type]){
		return primitiveCache[" "+type];
	}
    var myCells = childrenCells(graph.getModel().getChildren(graph.getModel().getRoot())[0]);
    if (type == null) {
        primitiveCache[" "+type] = myCells;
    } else {
        var targetCells = [];
        for (var i = 0; i < myCells.length; i++)
        {
            if (myCells[i].value.nodeName == type) {
                targetCells.push(myCells[i]);
            }
        }
        primitiveCache[" "+type] = targetCells;
    }
	return primitiveCache[" "+type];
}

function childrenCells(root) {
    var myCells = graph.getModel().getChildren(root);
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
function clearPrimitiveCache(){
	primitiveCache = {};
	neighborhoodCache = {};
}

function neighborhood(target) {
	if(neighborhoodCache[target.id]){
		return neighborhoodCache[target.id];
	}
    var hood = [];
    var myCells = primitives();
    if (myCells != null) {
        if (target != null) {
            var flows = [];
            var links = [];
            if (target.isEdge()) {
				if(orig(target.source)!==null){
                	hood.push({item: orig(target.source), type: "direct"});
				}
				if(orig(target.target)!== null){
                	hood.push({item: orig(target.target), type: "direct"});
				}
            }
			if(target.value.nodeName == "Agents"){
				if(target.getAttribute("Agent")){
					hood = hood.concat(getAgentItems(target));
				}
			}
            for (var i = 0; i < myCells.length; i++)
            {
                if (myCells[i].value.nodeName == "Flow") {
                    flows.push(orig(myCells[i]));
                } else if (myCells[i].value.nodeName == "Link") {
                    links.push(orig(myCells[i]));
                }
            }
            for (var i = 0; i < flows.length; i++)
            {
                if (flows[i].source == target) {
                    hood.push({item: flows[i], type: "direct"});
                }
                if (flows[i].target == target) {
                    hood.push({item: flows[i], type: "direct"});
                }
            }
            for (var i = 0; i < links.length; i++)
            {
                if (links[i].source == target && (isDefined(links[i].target) && links[i].target !== null) ) {
					var linkHidden = ! isTrue(links[i].getAttribute("BiDirectional"));
                    hood.push({item: orig(links[i].target), type: "direct", linkHidden: linkHidden});
					hood = hood.concat(getAgentItems(links[i].target, linkHidden))
                }
                if (links[i].target == target && (isDefined(links[i].source) && links[i].source !== null) ) {
                    hood.push({item: orig(links[i].source), type: "direct"});
					hood = hood.concat(getAgentItems(links[i].source))
                }
            }
        } else {
            for (var i = 0; i < myCells.length; i++)
            {
                if (isValued(myCells[i])) {
                    hood.push({item: orig(myCells[i]), type: "direct"});
                }
            }
        }
    }
	hood = Ext.Array.clean(hood);
	var res = [];
	//Remove duplicated elements
	for(var i=0; i<hood.length; i++){
		var found = false;
		for(var j=0; j<res.length; j++){
			if(res[j].type == hood[i].type && res[j].item.id == hood[i].item.id){
				found = true;
				break;
			}
		}
		if(! found){
			if(isValued(hood[i].item) || (hood[i].item.value.nodeName == "Agents")){
				res.push(hood[i]);
			}
		}
	}
	neighborhoodCache[target.id] = res;
    return res;
	
	function getAgentItems(agent, linkHidden){
		var res  = [];
		if(agent.value.nodeName == "Agents" && agent.getAttribute("Agent")){
			var id = agent.getAttribute("Agent");
			if(id){
				var items = getChildren(findID(id));
				items.forEach(function(x){
					if(isValued(x) && x.value.nodeName != "Ghost"){
						res.push({item: x, type: "agent", linkHidden: linkHidden, name: x.getAttribute("name")});
					}
				})
			}		
		}
		
		return res.sort(function(a,b){
			if(a.name==b.name){
				return 0;
			}else if(a.name>b.name){
				return 1
			}else{
				return -1;
			}
		});
	}
}

function doubleArray(arr) {
    var narr = [];
    for (var i = 0; i < arr.length; i++)
    {
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
    if (is_editor && (! is_embed)) {
        var b = ribbonPanelItems().getComponent('savegroup').getComponent('savebut');
        if (e) {
            b.setDisabled(false);
            b.setText('Save Insight');
        } else {
            b.setDisabled(true);
            b.setText('Insight Saved');
        }
    }
}

function updateWindowTitle() {
    if (!is_embed) {
        if (graph_title == "") {
            document.title = "Untitled Insight | Insight Maker";
        } else {
            document.title = graph_title + " | Insight Maker";
        }
    }
}

function hasDisplay() {
    var myCells = primitives();
    return cellsContainNodename(myCells, "Display");
}

function setPicture(cell) {
	
    var styleString = cell.getStyle();
    if (cell.getAttribute("Image") == "None" || cell.getAttribute("Image") == "" || cell.getAttribute("Image") == " " || cell.getAttribute("Image") == "null" || (cell.value.nodeName == "Folder" && ! cell.isCollapsed())) {
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
        if (cell.getAttribute("Image").substring(0, 4).toLowerCase() == "http") {
            styleString = mxUtils.setStyle(styleString, "image", cell.getAttribute("Image"));
        } else {
            styleString = mxUtils.setStyle(styleString, "image", builder_path+"/images/SD/" + cell.getAttribute("Image") + ".png");
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

function setLabelPosition(cell){
	 
	 
	var labelPos = cell.getAttribute("LabelPosition");
	
	var styleString = cell.getStyle();
	
 if (cell.value.nodeName == "Folder" && (! cell.isCollapsed())){
	styleString = mxUtils.setStyle(styleString, "labelPosition", null);
	styleString = mxUtils.setStyle(styleString, "align", null);
		
	styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", null);
	styleString = mxUtils.setStyle(styleString, "verticalAlign", null);
	
 }else{
	
	if(labelPos == "Top"){
		styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
		styleString = mxUtils.setStyle(styleString, "align", "center");
		
		styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "top");
		styleString = mxUtils.setStyle(styleString, "verticalAlign", "bottom");
	}else if(labelPos == "Bottom"){
		styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
		styleString = mxUtils.setStyle(styleString, "align", "center");
		
		styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "bottom");
		styleString = mxUtils.setStyle(styleString, "verticalAlign", "top");
	}else if(labelPos == "Middle"){
		styleString = mxUtils.setStyle(styleString, "labelPosition", "middle");
		styleString = mxUtils.setStyle(styleString, "align", "center");
		
		styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "middle");
		styleString = mxUtils.setStyle(styleString, "verticalAlign", "middle");
	}else if(labelPos == "Left"){
		styleString = mxUtils.setStyle(styleString, "verticalLabelPosition", "middle");
		styleString = mxUtils.setStyle(styleString, "verticalAlign", "middle");

		styleString = mxUtils.setStyle(styleString, "labelPosition", "left");
		styleString = mxUtils.setStyle(styleString, "align", "right");
	}else if(labelPos == "Right"){
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

function removeAgent(cell){
	var items = primitives("Agents");
	for(var i=0; i<items.length; i++){
		if(items[i].getAttribute("Agent")==cell.id){
			items[i].setAttribute("Agent", "");
		}
	}
}

function deletePrimitive(cell) {
    var myCells = primitives();
	
	var setting = getSetting();
	if(setting.getAttribute("SensitivityPrimitives")){
	    var items = setting.getAttribute("SensitivityPrimitives").split(",");
	    var j = Ext.Array.indexOf(items, cell.id);
	    if (j > -1) {
	        items.splice(j, 1);
	        setting.setAttribute("SensitivityPrimitives", items.join(","));
	    }
	}
	

	if(cell.value.nodeName=="Folder" && cell.getAttribute("Type")=="Agent"){
		removeAgent(cell);
	}
	
    for (var i = 0; i < myCells.length; i++)
    {
        if (myCells[i].value.nodeName == "Display") {
            if (myCells[i].getAttribute("Primitives")) {
                var items = myCells[i].getAttribute("Primitives").split(",");
                var j = Ext.Array.indexOf(items, cell.id);
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
    for (var i = 0; i < myCells.length; i++)
    {
        if (myCells[i].value.nodeName == "Converter") {
            testConverterSource(myCells[i]);
        }else if(myCells[i].value.nodeName == "Agents") {
            var source = myCells[i].getAttribute("Agent");
			if(source){
				if(! connected(myCells[i], findID(source))){
					myCells[i].setAttribute("Agent", "");
				}
			}
        }
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
		if(! neigh[j].linkHidden){
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

    for (var i = 0; i < myCells.length; i++)
    {
        if (myCells[i].value.nodeName == "Setting") {
            return myCells[i];
        }
    }
    alert("Settings primitive could not be found.")
    return null;
}

function getText(obj) {
    if (document.all) {
        // IE;
        return obj.innerText;
    } else {
        return obj.textContent;
    }
}

function handelCursors() {
    if (nodeInsertSelected() == false) {
        graph.container.style.cursor = 'auto';
        //graph.graphHandler.setSelectEnabled(true);
    } else {
        graph.container.style.cursor = 'crosshair';
        //graph.graphHandler.setSelectEnabled(false);
    }
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
            width: 500,
            title: "Save Insight",
            height: 350,
            closable: false,
            resizable: true,
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
                margin: 2
            }), new Ext.form.TextField({
                fieldLabel: 'Tags',
                name: 'sinsightTags',
                id: 'sinsightTags',
                allowBlank: true,
                emptyText: "Environment, Unintended Consequences",
                value: graph_tags,
                margin: 2
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
                margin: 2, flex:1
            })],

            buttons: [{
                text: 'Cancel',
                    scale: "large",
                    iconCls: "cancel-icon",
                handler: function() {
                    propertiesWin.hide();
                }},{	
                        iconCls: "apply-icon",
                        scale: "large",
                text: 'Save',
                handler: function() {
					if(Ext.getCmp("sinsightTitle").validate()){
                    	propertiesWin.hide();
                    	graph_title = Ext.String.trim(Ext.getCmp('sinsightTitle').getValue());
                    	graph_description = Ext.String.trim(Ext.getCmp('sinsightDescription').getValue());
						graph_description = graph_description.replace(/^(\u200b|&nbsp;)/g,"");
						graph_description = graph_description.replace(/(\u200b|&nbsp;)$/g,"");
						if(graph_description == "<br>" || graph_description=="<br/>" || graph_description=="\u200b" || graph_description=="&nbsp;"){
							graph_description = "";
						}
                    	graph_tags = Ext.getCmp('sinsightTags').getValue();
                    	setSaveEnabled(true);
                    	sendGraphtoServer(graph);
						selectionChanged(false);
					}else{
						mxUtils.alert("You must specify a name for the Insight.");
					}
                }
            }
            ]


        });
    } else {
        if (graph_title != "") {
            Ext.getCmp('sinsightTitle').setValue(graph_title);
            Ext.getCmp('sinsightTags').setValue(graph_tags);
            Ext.getCmp('sinsightDescription').setValue(graph_description);
        }
    }
    propertiesWin.show();
	Ext.getCmp("sinsightTitle").focus(true,300);
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

function sliderPrimitives() {
    var myCells = primitives();
    var slids = [];
    for (var i = 0; i < myCells.length; i++) {
        if (isTrue(myCells[i].getAttribute("ShowSlider"))) {
            slids.push(myCells[i]);
        }
    }
    return slids;
}


function orig(cell) {
    if (isUndefined(cell) || cell == null) {
        return null;
    }
    if (cell.value.nodeName == "Ghost") {
        return graph.getModel().getCell(cell.value.getAttribute("Source"));
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

        if (selected) {
            ribbonPanelItems().getComponent('style').getComponent('bold').toggle(currentStyleIs(mxConstants.FONT_BOLD));
            ribbonPanelItems().getComponent('style').getComponent('italic').toggle(currentStyleIs(mxConstants.FONT_ITALIC));
            ribbonPanelItems().getComponent('style').getComponent('underline').toggle(currentStyleIs(mxConstants.FONT_UNDERLINE));
            var style = graph.getCellStyle(graph.getSelectionCell());
            sizeCombo.setValue(style[mxConstants.STYLE_FONTSIZE]);
            fontCombo.setValue(style[mxConstants.STYLE_FONTFAMILY]);
        } else {
            ribbonPanelItems().getComponent('style').getComponent('bold').toggle(false);
            ribbonPanelItems().getComponent('style').getComponent('italic').toggle(false);
            ribbonPanelItems().getComponent('style').getComponent('underline').toggle(false);
            sizeCombo.setValue("");
            fontCombo.setValue("");
        }
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
	
	if(isUndefined(txt)){
		return "";
	}
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

function loadBackgroundColor() {
    mxPanel.body.dom.style["background-color"] = getSetting().getAttribute("BackgroundColor");

    mxPanel.body.dom.style.backgroundColor = getSetting().getAttribute("BackgroundColor");
}

function isUndefined(item){
	return typeof(item)=="undefined";
}

function isDefined(item){
	return (! isUndefined(item));
}


function isTouch() {
	return mxClient.IS_TOUCH;
}

function propogateGhosts(cell){
	var ghosts = primitives("Ghost");
	for( var i = 0; i < ghosts.length; i++ ){
		if( ghosts[i].getAttribute("Source") == cell.id ){
			var style = cell.getStyle();
			style = mxUtils.setStyle(style, "opacity", 30);
			ghosts[i].setStyle( style );
			//console.log(cell.getAttribute("name"));
            var edit = new mxCellAttributeChange(ghosts[i],  "name", cell.getAttribute("name"));
            graph.getModel().execute(edit);
			
		}
	}
}

function map(val, fn){
	if (val instanceof Array) {
		return Ext.Array.map(val, fn);
	}else{
		return fn(val);
	}
}

function unitsUsedInModel(){
	var items = primitives();
	var us = [];
	for(var i = 0; i < items.length; i++){
		var u = items[i].getAttribute("Units");
		if( items[i].value.nodeName != "Setting" && isDefined(u) && u !== null && u != "Unitless"){
			us.push(u);
		}
	}
	return Ext.Array.unique(us);
}

function changeNodeName(node, newName){
	var doc = mxUtils.createXmlDocument();
	var newNode = doc.createElement(newName);
	var attrs = node.attributes;
	for(var i = 0; i < attrs.length; i++){
		newNode.setAttribute(attrs[i].name, attrs[i].value)
	}
	return newNode;
}

function cmd(key){
	if(mxClient.IS_MAC){
		return "<span style='color:grey'>(&#8984;"+key+")</span>";
	}else{
		return "<span style='color:grey'>(Ctrl-"+key+")</span>";
	}
}

function inAgent(cell){
	if((! cell) || cell==null){
		return false;
	}
	
	var p = getParent(cell);
	if(p){
		if(p.getAttribute("Type") == "Agent"){
			return true;
		}
	}
	return inAgent(p);
}


function isGray(color){
	if(isUndefined(color)){
		return true;
	}
	var c;
	if(color[0] == "#"){
		c = color;
	}else{
		c = colourNameToHex(color);
	}
	if(c=="#6482B9"){
		return true; //treat flows as grey alwayse
	}
	var start = c[1];
	if(c.length==4){
		for(var i=2; i<c.length; i++){
			if(c[i] != start){
				return false;
			}
		}
	}else if(c.length==7){
		for(var i=1; i<c.length; i=i+2){
			if(c[i] != start){
				return false;
			}
		}
		var start = c[2];
		for(var i=2; i<c.length; i=i+2){
			if(c[i] != start){
				return false;
			}
		}
	}
	return true;
}

function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
}