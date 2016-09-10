"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

function textEquations(){
	
	var html = "<table style='width:100%'>";
	
	var odd = true;
	
	function boolYesNo(bool){
		return isTrue(bool)?getText("Yes"):getText("No")
	}
	
	function list(items){
		var inner = "";
		for(var i = 0; i < items.length; i++){
			inner = inner+"<li><b>"+items[i][0]+":</b> "+(((/<br>/).test(items[i][1]))?"<br/>":"")+items[i][1]+"</li>";
		}
		return "<ul style='list-style-type: none;'>"+inner+"</ul>"
	}
	
	function add(title, contents){
		html = html +"<tr class='textRow"+(odd?"Odd":"Even")+"'><td class='textName'>"+title+"</td><td>"+contents+"</td></tr>";
		odd = ! odd;
	}
	function divide(title){
		html = html + "<tr class='textDivider'><td colspan=2>"+title+"</td></tr>";
		odd = true;
	}
	function name(item){
		if(item && item!=null){
			return clean(item.getAttribute("name"));
		}
		return "<i>"+getText("None")+"</i>";
	}
	function addNote(items, item){
		if(item.getAttribute("Note")){
			items.push([getText("Note"), clean(item.getAttribute("Note"))])
		}
		return items;
	}
	function findAndSort(label){
		var items = primitives(label);
		items.sort(function(a,b){
			if(name(a).toUpperCase()>name(b).toUpperCase()){
				return 1;
			}else{
				return -1;
			}
		});
		return items;
	}
	var mySetting = getSetting();
	add("Simulation Settings", list([[getText("Time Start"), clean(mySetting.getAttribute("TimeStart"))], [getText("Time Length"), clean(mySetting.getAttribute("TimeLength"))], [getText("Time Step"), clean(mySetting.getAttribute("TimeStep"))], [getText("Time Units"), clean(mySetting.getAttribute("TimeUnits"))], [getText("Algorithm"), clean(mySetting.getAttribute("SolutionAlgorithm"))]]))
	
	items = findAndSort("Variable");
	if(items.length>0){
		divide(getText("Model Variables"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Value"), equationRenderer(getValue(items[i]), true)], [getText("Units"), clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	var items = findAndSort("Stock");
	if(items.length>0){
		divide(getText("Model Stocks"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Initial Value"), equationRenderer(getValue(items[i]), true)], [getText("Non-Negative"), boolYesNo(items[i].getAttribute("NonNegative"))], [getText("Units"), clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	items = findAndSort("Flow");
	if(items.length>0){
		divide(getText("Model Flows"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Rate"), equationRenderer(getValue(items[i]), true)], [getText("Alpha"), clean(name(items[i].source))], [getText("Omega"), clean(name(items[i].target))], [getText("Positive Only"), boolYesNo(items[i].getAttribute("OnlyPositive"))], [getText("Units"), clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	items = findAndSort("Converter");
	if(items.length>0){
		divide(getText("Model Converters"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Data"), clean(getValue(items[i]).replace(/\;/g,"; ")) ] , [getText("Source"), clean(items[i].getAttribute("Source")=="Time"?"Time":name(findID(items[i].getAttribute("Source")))) ], [getText("Interpolation"), getText(clean(items[i].getAttribute("Interpolation")))], [getText("Units"), clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	
	items = findAndSort("State");
	if(items.length>0){
		divide(getText("Model States"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Initial Active"), equationRenderer(getValue(items[i]), true)] ], items[i]) ))
		}
	}
	
	items = findAndSort("Transition");
	if(items.length>0){
		divide(getText("Model Transitions"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Trigger"), clean(items[i].getAttribute("Trigger"))], [getText("Value"), equationRenderer(getValue(items[i]), true)] ], items[i]) ))
		}
	}
	
	items = findAndSort("Action");
	if(items.length>0){
		divide(getText("Model Actions"));
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ [getText("Trigger"), clean(items[i].getAttribute("Trigger"))], [getText("Trigger Value"), equationRenderer(items[i].getAttribute("Value"), true)], [getText("Action"), equationRenderer(getValue(items[i]), true)] ], items[i]) ))
		}
	}
	
	
	html += "</table>";
	
	var tab = Ext.create("Ext.tab.Panel", {
			xtype: "tabpanel",
			layout: "fit",
			activeTab: 0,
			plain: true,
			flex: 1,
			items: [
			{title: getText("Insight Equations"), xtype: "box", html: html, style: "background-color: white", autoScroll: true},
			{
				padding: 4,
				title: getText("Full Insight Specification"),
				xtype: "container",
				layout: {
					type: 'vbox',
					align: 'middle'
				},
				items: [{
					xtype: 'box',
					margin: 6,
					html: getText('Complete Insight specification including equations and styling. You may download this as a file and later import it back into Insight Maker.'),
					width: "100%"
				}, {
					flex:1,
					margin: 6,
					readOnly:true,
					xtype: 'textareafield',
					hideLabel: true,
					value: getGraphXml(graph).replace(/mxGraphModel/g,"InsightMakerModel"),
					width:"100%"
				},
				{
					text: getText("Download"),
					xtype: "button",
					margin: 3,
					handler: function(){
						new mxXmlRequest(builder_path + "/download.php", $.param({name: "Model", format: "InsightMaker", "data": getGraphXml(graph).replace(/mxGraphModel/g,"InsightMakerModel")})).simulate(document, "_blank");
					}
				}
				]
			}]
		});
								
    var win = new Ext.Window({
        title: getText('Complete Model Equation List'),
        layout: 'fit',
        closeAction: 'destroy',
        border: false,
        modal: true,
		maximizable: true,
        resizable: true,
        shadow: true,
        buttonAlign: 'right',
        layoutConfig: {
            columns: 1
        },
        width:  Math.min(Ext.getBody().getViewSize().width, 600),
        height:  Math.min(Ext.getBody().getViewSize().height, 500),
        items: [{title: getText("Insight Equations"), xtype: "box", html: html, style: "background-color: white", autoScroll: true}],
        buttons: [
        "->",
        {
            scale: "large",
            glyph: 0xf00c,
            text: getText('Done'),
            handler: function()
            {	
				win.close();
            }
        }]

    });
	
	win.show();
	
}

