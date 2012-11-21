"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

var sensitivityProgress;
var sensitivityController = {}

function doSensitivity(){
	var displayConfigStore = new Ext.data.JsonStore({
		fields: [{
			name: 'pid',
			type: 'string'
		}, {
			name: 'pname',
			type: 'string'
		}],
		data: []
	});
	
	
	var storeData = [];
	var prims = primitives();
	for (var i = 0; i < prims.length; i++) {
		if(isValued(prims[i]) && (! inAgent(prims[i]))){
			storeData.push({
				pid: prims[i].id,
				pname: prims[i].getAttribute("name")
			});
		}
	}
	displayConfigStore.loadData(storeData);
	
	
	var mySetting = getSetting();
	
	var p = new Ext.FormPanel({
		fieldDefaults: {
		    labelWidth: 145,
			width: 355
		},
		autoScroll:true,
		frame: true,
		defaultType: 'textfield',
			items: [
			
			Ext.create('Ext.ux.form.field.BoxSelect', {
				fieldLabel: 'Monitored Primitives',
				name: 'monPrimitives',
				id: 'monPrimitives',
				displayField: 'pname',
				valueField: 'pid',
				queryMode: 'local',
				store: displayConfigStore,
				emptyText: 'Select primitives to monitor',
				value: mySetting.getAttribute("SensitivityPrimitives")?mySetting.getAttribute("SensitivityPrimitives").split(","):[]
			}),
			new Ext.form.NumberField({
                fieldLabel: 'Number of Runs',
                name: 'nRuns',
                id: 'nRuns',
                allowBlank: false,
                minValue: 10,
                allowDecimals: false,
				value: mySetting.getAttribute("SensitivityRuns")
            }),
			{
                fieldLabel: 'Confidence Regions (%)',
                name: 'confRegion',
                id: 'confRegion',
                allowBlank: false,
				value: mySetting.getAttribute("SensitivityBounds")
            },
            {
				xtype: "checkboxfield",
                fieldLabel: 'Plot Each Run (slower)',
                inputValue: 'true',
                name: 'plotEach',
                id: 'plotEach',
				checked: isTrue(mySetting.getAttribute("SensitivityShowRuns"))
            },
			{
	        	xtype: 'displayfield',
	        	fieldLabel: '',
	        	value: "<div style='padding-top:1.2em; padding-left: 0.8em;padding-right: 0.8em'><img style='float:left; margin-right: 7px' src='"+builder_path+"/images/gui/help.png' width=32px height=32px />Sensitivity analysis runs your simulation multiple times with random inputs to see how the results vary (in a sense, how 'sensitive' the results are to the inputs).<br/><br/> In order to use sensitivity analysis you need to have sources of randomness in your model. For instance, you can use the <i>Rand()</i> function or other Insight Maker random generation functions to choose random variables or random starting values. Please note, that if you want to have a random variable value, you can use <i>Fix(Rand())</i> to set the variable to a random value at the start of the simualtion and keep it at the same value for the rest of that simulation.</div>"
			}
		]
	});
								
    var win = new Ext.Window({
        title: 'Sensitivity Analysis',
        layout: 'fit',
        closeAction: 'destroy',
        border: false,
        modal: true,
        resizable: false,
        shadow: true,
        buttonAlign: 'right',
        layoutConfig: {
            columns: 1
        },
        width: 380,
        height: 425,
        items: [p],
        buttons: [
        {
            scale: "large",
            iconCls: "cancel-icon",
            text: 'Cancel',
            handler: function()
            {
                win.close();
            }
        },
        {
            scale: "large",
            iconCls: "apply-icon",
            text: 'Run Analysis',
            handler: function()
            {	
				
				var nRuns = Ext.getCmp("nRuns").getValue();
				var items = Ext.getCmp("monPrimitives").getValue();
				var bounds = Ext.Array.map(Ext.getCmp("confRegion").getValue().split(","), parseFloat);
				var showRuns = isTrue(Ext.getCmp("plotEach").getValue());
				
				if(items.length<1){
					mxUtils.alert("You must select one or more primitives to monitor.")
					return
				}
				if(bounds.length<1){
					mxUtils.alert("You must specify one or more bounds as precentages.")
					return
				}
				for(var b=0; b< bounds.length; b++){
					if(bounds[b]<=0 || bounds[b]>100){
						mxUtils.alert("Bounds are precentages that must be between 0 and 100.")
						return
					}
				}
				var mySetting = getSetting();
				
                graph.getModel().beginUpdate();

                var edit = new mxCellAttributeChange(
                mySetting, "SensitivityPrimitives",
                items.join(","));
                graph.getModel().execute(edit);
				
                edit = new mxCellAttributeChange(
                mySetting, "SensitivityRuns",
                nRuns);
                graph.getModel().execute(edit);
				
				edit = new mxCellAttributeChange(
                mySetting, "SensitivityBounds",
                bounds.join(", "));
                graph.getModel().execute(edit);
				
				edit = new mxCellAttributeChange(
                mySetting, "SensitivityShowRuns",
                showRuns);
                graph.getModel().execute(edit);
				
				graph.getModel().endUpdate();
				
			    sensitivityProgress = Ext.MessageBox.show({msg:"Running Sensitivity Analysis...",icon:'run-icon',width:300, closable:false, modal:true, progress:true, progressText:' '});
				
				sensitivityController = {nRuns:nRuns, items: items, bounds: bounds, showRuns: showRuns, results: []};
				
				setTimeout("runSensitivity()", 15);
				
				win.close();
            }
        }]

    });
	
	win.show();
	
}

function runSensitivity(){
	sensitivityController.results.push( runSimulation(true) );
	sensitivityProgress.updateProgress(sensitivityController.results.length/sensitivityController.nRuns, " ");
	if(sensitivityController.results.length < sensitivityController.nRuns){
		setTimeout("runSensitivity()", 15);
		return;
	}
	
	var nRuns = sensitivityController.nRuns;
	var results = sensitivityController.results;
	var bounds = sensitivityController.bounds;
	var items = sensitivityController.items;
	
	
	var data = [];
	for(var p = 0; p < items.length; p++){
		var cell = findID(items[p]);
		var ress = [];
		for(var r = 0; r < nRuns; r++){
			ress.push(results[r].value(cell))
		}
		
		var aggregates = {median: []};
		for(var b = 0; b < bounds.length; b++){
			aggregates[bounds[b]+"_lower"] = [];
			aggregates[bounds[b]+"_upper"] = [];
		}
		
		for(var i = 0; i < ress[0].length; i++){
			var temp = [];
			for(var r = 0; r < ress.length; r++){
				temp.push(ress[r][i]);
			}
			
			temp = temp.sort(function(a,b){return a-b});
			
			aggregates.median.push(getQuantile(temp, 0.5))
			for(var b=0; b < bounds.length; b++){
				aggregates[bounds[b]+"_lower"].push(getQuantile(temp, 0.50-(bounds[b]/100)/2))
				aggregates[bounds[b]+"_upper"].push(getQuantile(temp, 0.50+(bounds[b]/100)/2))
			}
		
		}

		
		var dat = {name: cell.getAttribute("name")+" Quantiles Table", type: "table"};
		var headers = [];
		var series = [];
		headers.push("Median");
		series.push(aggregates.median);
		var chartSeries = [{name:"Median", data: aggregates.median, type: "line", color: "black"}];
		
		var sensitivityColors = ["#ECC928", "#425FCA", "#8E630F", "#007012", "#CC2C33", "#773A86"];
		var topbs = [],botbs=[];
		for(var b = bounds.length-1; b >=0; b--){
			headers.push(bounds[b]+"% Lower");
			series.push(aggregates[bounds[b]+"_lower"]);
			headers.push(bounds[b]+"% Upper");
			series.push(aggregates[bounds[b]+"_upper"]);
			
			if(b>0){
				botbs.push({name: "Lower "+bounds[b]+"%", data: aggregates[bounds[b-1]+"_lower"], type: "line", color: sensitivityColors[b % sensitivityColors.length], fill:true, hideMarkers:true, hideLegend: true});
			}
			
			topbs.push({name: bounds[b]+"% Region"/*"Upper "+bounds[b]+"%"*/, data: aggregates[bounds[b]+"_upper"], type: "line", color: sensitivityColors[b % sensitivityColors.length], fill:true, hideMarkers:true});
		}

		
		

		
		for(var b=0; b<topbs.length; b++){
			chartSeries.push(topbs[b]);
		}
		
		for(var b=botbs.length-1; b>=0; b--){
			chartSeries.push(botbs[b]);
		}
		
		chartSeries.push({name: "White Cover", data: aggregates[bounds[bounds.length-1]+"_lower"], type: "line", color: "white", fill:true, hideMarkers:true, hideLegend: true});
		
		
		dat.header = headers;
		dat.data = series;
		
		data.push({legend: "right", data:chartSeries, name: cell.getAttribute("name")+" Quantiles Chart", type: "chart", horizontalGrid: false, verticalGrid: false, xType:"Numeric", xData: results[0].Time, xLabel:"Time", yLabel: cell.getAttribute("name")});
		data.push(dat);	
		
		
		if(sensitivityController.showRuns){
			dat = {name: cell.getAttribute("name")+" Runs Table", type: "table"};
			var headers = [];
			var series = [];
			var chartSeries = [];
			for(var i=0; i<nRuns; i++){
				headers.push("Run "+(i+1));
				series.push(ress[i]);
				chartSeries.push({title: "", data: ress[i], type: "line", hideMarkers: true});
			}
			dat.header = headers;
			dat.data = series;
			
			data.push({legend: "none", data: chartSeries, name: cell.getAttribute("name")+" Runs Chart", type: "chart", horizontalGrid: true, verticalGrid: true, xType:"Numeric", xData: results[0].Time, xLabel:"Time", yLabel: cell.getAttribute("name")});
		
			data.push(dat);
		}
	}
	
	sensitivityProgress.close();
	
	showData("Sensitivity Analysis Results", data);
}

function getQuantile(arr, quantile){
	var index = (arr.length)*quantile;
	if(Math.ceil(index) == arr.length){
		return arr[arr.length-1];
	}
	if(index == Math.ceil(index)){
		return arr[index];
	}else{
		return (arr[Math.floor(index)]+arr[Math.ceil(index)])/2
	}
}

