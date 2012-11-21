"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

function textEquations(){
	
	var html = "<table style='width:100%'>";
	
	var odd = true;
	
	function list(items){
		var inner = "";
		for(var i = 0; i < items.length; i++){
			inner = inner+"<li><b>"+items[i][0]+":</b> "+items[i][1]+"</li>";
		}
		return "<ul>"+inner+"</ul>"
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
		return "<i>None</i>";
	}
	function addNote(items, item){
		if(item.getAttribute("Note")){
			items.push(["Note", clean(item.getAttribute("Note"))])
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
	add("Simulation Settings", list([["Time Start", clean(mySetting.getAttribute("TimeStart"))], ["Time Length", clean(mySetting.getAttribute("TimeLength"))], ["Time Step", clean(mySetting.getAttribute("TimeStep"))], ["Time Units", clean(mySetting.getAttribute("TimeUnits"))], ["Algorithm", clean(mySetting.getAttribute("SolutionAlgorithm"))]]))
	
	items = findAndSort("Variable");
	if(items.length>0){
		divide("Model Variables");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Value", equationRenderer(getValue(items[i]))], ["Units", clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	var items = findAndSort("Stock");
	if(items.length>0){
		divide("Model Stocks");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Initial Value", equationRenderer(getValue(items[i]))], ["Non-Negative", clean(items[i].getAttribute("NonNegative"))], ["Units", clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	items = findAndSort("Flow");
	if(items.length>0){
		divide("Model Flows");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Rate", equationRenderer(getValue(items[i]))], ["Alpha", clean(name(items[i].source))], ["Omega", clean(name(items[i].target))], ["Positive Only", clean(items[i].getAttribute("OnlyPositive"))], ["Units", clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	items = findAndSort("Converter");
	if(items.length>0){
		divide("Model Converters");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Data", clean(getValue(items[i]).replace(/\;/g,"; ")) ] , ["Source", clean(items[i].getAttribute("Source")=="Time"?"Time":name(findID(items[i].getAttribute("Source")))) ], ["Interpolation", clean(items[i].getAttribute("Interpolation"))], ["Units", clean(items[i].getAttribute("Units"))] ], items[i]) ))
		}
	}
	
	items = findAndSort("State");
	if(items.length>0){
		divide("Model States");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Initial Active", equationRenderer(getValue(items[i]))] ], items[i]) ))
		}
	}
	
	items = findAndSort("Transition");
	if(items.length>0){
		divide("Model Transitions");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Trigger", clean(items[i].getAttribute("Trigger"))], ["Value", equationRenderer(getValue(items[i]))] ], items[i]) ))
		}
	}
	
	items = findAndSort("Action");
	if(items.length>0){
		divide("Model Actions");
		for(var i=0; i<items.length; i++){
			add(name(items[i]), list( addNote([ ["Trigger", clean(items[i].getAttribute("Trigger"))], ["Trigger Value", equationRenderer(items[i].getAttribute("Value"))], ["Action", equationRenderer(getValue(items[i]))] ], items[i]) ))
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
			{title: "Insight Equations", xtype: "box", html: html, style: "background-color: white", autoScroll: true},
			{
				padding: 4,
				title: "Full Insight Specification",
				xtype: "container",
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'displayfield',height:40,
					fieldLabel: '',
					value: 'Complete Insight specification including equations and styling. You may use this to fully backup the Insight to your computer.'
				}, {
					flex:1,
					readOnly:true,
					xtype: 'textareafield',
					hideLabel: true,
					value: getGraphXml(graph).replace(/mxGraphModel/g,"InsightMakerModel")
				}]
			}]
		});
								
    var win = new Ext.Window({
        title: 'Complete Model Equation List',
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
        width: 500,
        height: 400,
        items: tab,
        buttons: [
        {
            scale: "large",
            iconCls: "import-icon",
            text: 'Import Equations',
            handler: function()
            {	
				importModel();
				win.close();
            }
        },"->",
        {
            scale: "large",
            iconCls: "apply-icon",
            text: 'Done',
            handler: function()
            {	
				win.close();
            }
        }]

    });
	
	win.show();
	
}

