"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var optimizerProgress;
var optimizerController = {}

function doOptimizer(){
	var changedConfigStore = new Ext.data.JsonStore({
		fields: [{
			name: 'pid',
			type: 'string'
		}, {
			name: 'pname',
			type: 'string'
		}],
		data: []
	});
	var targetConfigStore = new Ext.data.JsonStore({
		fields: [{
			name: 'pid',
			type: 'string'
		}, {
			name: 'pname',
			type: 'string'
		}],
		data: []
	});
	
	
	var targetStoreData = [];
	var changedStoreData = [];
	var prims = excludeType(primitives(), "Ghost");
	for (var i = 0; i < prims.length; i++) {
		if(isValued(prims[i]) && (! inAgent(prims[i]))){
			var obj = {
				pid: prims[i].id,
				pname: prims[i].getAttribute("name")
			};
			
			targetStoreData.push(obj);
			if(prims[i].value.nodeName=="Stock" || prims[i].value.nodeName=="Variable"){
				changedStoreData.push(obj);
			}
		}
	}
	targetConfigStore.loadData(targetStoreData);
	changedConfigStore.loadData(changedStoreData);
	
	
	var mySetting = getSetting();
	
	var dat = mySetting.getAttribute("OptimizerGridStore")?JSON.parse(mySetting.getAttribute("OptimizerGridStore")):[];
	for(var i=dat.length-1; i>=0; i--){
		if(! findID(dat[i].id)){
			dat.splice(i,1);
		}
	}
	
	var gridStore = Ext.create('Ext.data.Store', {	
	    fields: ['id', 'minBound', 'maxBound', 'desiredAccuracy'],
	    data: dat
	});

	var grid = Ext.create('Ext.grid.Panel', {
	    store: gridStore,
	    columns: [
	        {header: getText('Primitive Name'),  sortable: false, menuDisabled: true, dataIndex: 'id',flex:1,
				renderer: function(value) {
	            	return getName(findID(value));
	        	}
			},
	        {header: getText('Minimum Bound'), sortable: false, menuDisabled: true, dataIndex: 'minBound',width:130,
	            editor: {
	                xtype: 'numberfield',
	                allowBlank: false,
					allowDecimals: true,
					decimalPrecision: 9
	            }
	        },
	        {header: getText('Maximum Bound'), sortable: false, menuDisabled: true, dataIndex: 'maxBound',width:130,
	            editor: {
	                xtype: 'numberfield',
	                allowBlank: false,
					allowDecimals: true,
					decimalPrecision: 9
	            }
	        },
	        {header: getText('Accuracy'), sortable: false, menuDisabled: true, dataIndex: 'desiredAccuracy',width:130,
	            editor: {
	                xtype: 'numberfield',
	                allowBlank: false,
					step: 0.1,
					minValue: 0,
					allowDecimals: true,
					decimalPrecision: 9
	            }
	        }
	    ],
	    selType: 'cellmodel',
	    plugins: [
	        Ext.create('Ext.grid.plugin.CellEditing', {
	            clicksToEdit: 1
	        })
	    ],
		flex: 1,
		frame: true,
		border: true
	});
	
	var generalForm = new Ext.FormPanel({
		fieldDefaults: {
		    labelWidth: 175,
		    width: "100%"
		},
		autoScroll:true,
		frame: false,
		margin: '11 11 11 11',
			items: [
			Ext.create('Ext.form.field.ComboBox', {
				fieldLabel: getText('Goal Primitive'),
				name: 'optGoalPrimitive',
				id: 'optGoalPrimitive',
				displayField: 'pname',
				valueField: 'pid',
				queryMode: 'local',
				store: targetConfigStore,
				forceSelection:true,
				allowBlank:false,
				emptyText: getText('Select primitive to target'),
				value: mySetting.getAttribute("OptimizerGoalPrimitive")?mySetting.getAttribute("OptimizerGoalPrimitive"):undefined
			}),
			Ext.create('Ext.form.field.ComboBox', {
				fieldLabel: getText('Goal'),
				name: 'optGoal',
				id: 'optGoal',
				queryMode: 'local',
				store: [["Minimize", getText("Minimize")], ["Maximize", getText("Maximize")]],
				forceSelection:true,
				allowBlank:false,
				value: mySetting.getAttribute("OptimizerGoal")?mySetting.getAttribute("OptimizerGoal"):"Minimize"
			}),
			Ext.create('Ext.form.field.ComboBox', {
				fieldLabel: getText('Goal Type'),
				name: 'optGoalType',
				id: 'optGoalType',
				queryMode: 'local',
				store: [["Integral of Value", getText("Integral of Value")], ["Final Value", getText("Final Value")]],
				forceSelection:true,
				allowBlank:false,
				value: mySetting.getAttribute("OptimizerGoalType")?mySetting.getAttribute("OptimizerGoalType"):"Integral of Value"
			}),
			Ext.create('Ext.form.field.Tag', {
				fieldLabel: getText('Primitives to Adjust'),
				name: 'optChangePrimitives',
				id: 'optChangePrimitives',
				displayField: 'pname',
				filterPickList: true,
				valueField: 'pid',
				queryMode: 'local',
				store: changedConfigStore,
				emptyText: getText('Select primitives to adjust'),
				listeners: {
					change: function(list, newData, oldData){
						var newItems = newData?newData:[];
						var oldItems = oldData?oldData:[];
						
						for(var i=0; i<newItems.length; i++){
							if(newItems[i].trim()!="" && gridStore.find("id",newItems[i])==-1){
								gridStore.add({id: newItems[i], minBound:0, maxBound:1, desiredAccuracy:0.1})
							}
						}
						for(var i=0; i<oldItems.length; i++){
							if(oldItems[i].trim()!="" && newItems.indexOf(oldItems[i])==-1){
								gridStore.removeAt(gridStore.find('id', oldItems[i]))
							}
						}
						
					}
				},
				value: mySetting.getAttribute("OptimizerPrimitives")?mySetting.getAttribute("OptimizerPrimitives").split(","):[]
			})
		]
	});
	
	var advancedForm = new Ext.FormPanel({
		fieldDefaults: {
		    labelWidth: 175,
		    width: "100%"
		},
		autoScroll: true,
		frame: false,
		margin: '11 11 11 11',
			items: [
			
			new Ext.form.NumberField({
		        fieldLabel: getText('Random Starts'),
		        name: 'nRandomStarts',
		        id: 'nRandomStarts',
		        allowBlank: false,
		        minValue: 0,
		        allowDecimals: false,
				value: mySetting.getAttribute("OptimizerRandomStarts")?mySetting.getAttribute("OptimizerRandomStarts"):0
		    }),
			new Ext.form.NumberField({
		        fieldLabel: getText('Maximum Number of Iterations'),
		        name: 'nIterations',
		        id: 'nIterations',
		        allowBlank: false,
		        minValue: 1,
		        allowDecimals: false,
				value: mySetting.getAttribute("OptimizerMaxIterations")?mySetting.getAttribute("OptimizerMaxIterations"):100
		    }),
			new Ext.form.NumberField({
		        fieldLabel: getText('Step Reduction Factor'),
		        name: 'nStepReduction',
		        id: 'nStepReduction',
		        allowBlank: false,
		        minValue: 0,
				maxValue: 1,
				step: 0.1,
		        allowDecimals: true,
				value: mySetting.getAttribute("OptimizerStepReduction")?mySetting.getAttribute("OptimizerStepReduction"):0.5
		    })
		]
	});
								
    var win = new Ext.Window({
        title: getText('Optimization'),
        layout: 'fit',
        closeAction: 'destroy',
        border: false,
        modal: true,
		tools:[
			{
			    type: 'help',
			    tooltip: getText('Get Help'),
			    callback: function(panel, tool, event) {
			        showURL("/optimization");
			    }
			}
		],
        resizable: true,
		maximizable: true,
        shadow: true,
        buttonAlign: 'right',
        width:  Math.min(Ext.getBody().getViewSize().width, 560),
        height:  Math.min(Ext.getBody().getViewSize().height, 525),
        items: [Ext.create("Ext.tab.Panel", {
			xtype: "tabpanel",
			layout: "vbox",
			activeTab: 0,
			plain: true,
			flex: 1,
			items: [
			{title: getText("General"), layout: {type:"vbox", align: "stretch"},items: [generalForm, grid],
			autoScroll: true},
			{title: getText("Advanced"), items: advancedForm,
			autoScroll: true}
			]})
		],
        buttons: [
        {
            scale: "large",
            glyph: 0xf05c,
            text: getText('Cancel'),
            handler: function()
            {
                win.close();
            }
        },
        {
            scale: "large",
            glyph: 0xf00c,
            text: getText('Run Optimization'),
            handler: function()
            {
				var randomStarts = Ext.getCmp("nRandomStarts").getValue();
				var optIterations = Ext.getCmp("nIterations").getValue();
				var stepReduction = Ext.getCmp("nStepReduction").getValue();
				
				var goal = Ext.getCmp("optGoal").getValue();
				var goalType = Ext.getCmp("optGoalType").getValue();
				
				var goalPrimitive = Ext.getCmp("optGoalPrimitive").getValue();
				var changePrimitives = Ext.getCmp("optChangePrimitives").getValue();
				
				if(changePrimitives.length<1){
					showNotifaction(getText("You must select one or more primitives to adjust."), "error", true);
					return;
				}
				if(! goalPrimitive){
					showNotifaction(getText("You must select a goal primitive to optimize."), "error", true);
					return;
				}
				var mySetting = getSetting();
				
                graph.getModel().beginUpdate();

                var edit = new mxCellAttributeChange(mySetting, "OptimizerPrimitives", changePrimitives.join(","));
                graph.getModel().execute(edit);
				
                edit = new mxCellAttributeChange(mySetting, "OptimizerGoalPrimitive", goalPrimitive);
                graph.getModel().execute(edit);
				
                edit = new mxCellAttributeChange(mySetting, "OptimizerGoal", goal);
                graph.getModel().execute(edit);
				
                edit = new mxCellAttributeChange(mySetting, "OptimizerGoalType", goalType);
                graph.getModel().execute(edit);
				
                edit = new mxCellAttributeChange(mySetting, "OptimizerStepReduction", stepReduction);
                graph.getModel().execute(edit);
				
				edit = new mxCellAttributeChange( mySetting, "OptimizerMaxIterations", optIterations);
                graph.getModel().execute(edit);
				
				edit = new mxCellAttributeChange(mySetting, "OptimizerRandomStarts", randomStarts);
                graph.getModel().execute(edit);
				
				var gridData = [];
				gridStore.each(function(item){
					gridData.push(item.getData());
				})
				//console.log(gridData);
				edit = new mxCellAttributeChange(mySetting, "OptimizerGridStore", JSON.stringify(gridData));
                graph.getModel().execute(edit);
				
				graph.getModel().endUpdate();
				
			    optimizerProgress = Ext.MessageBox.show({msg: getText("Optimizing Model..."),icon:'run-icon',width:300, closable:false, modal:true, progress:true, progressText:' '});
				
				optimizerController = {runs: -1, randomStarts:randomStarts, optIterations: optIterations, stepReduction: stepReduction, optGoal: goal, goalType: goalType, goalPrimitive: goalPrimitive, changePrimitives: changePrimitives, gridData: gridData};
				
				win.close();
				
				setTimeout("runOptimizer()", 30);
				
				
            }
        }]

    });
	
	win.show();
	
}

function runOptimizer(){

	//A direct search optimization method using a 
	//modified Powell's method.

	if(optimizerController.runs == -1){
		setupOptimizer();
	}
	if(optimizerController.runs <= optimizerController.randomStarts){
		if(! optimizerController.midRun){
			optMsg("Run: "+optimizerController.runs)
			optimizerController.iterations=0;
			optimizerController.stepScale=1;
			optimizerController.metAccuracyConditions=false;
			optimizerController.opts.push(new DataStore());
	
			setInitialPosition(optimizerController.runs != 0);
		}
		var runStartTime = Date.now();
		optimizerController.midRun = true;
		while (! metFinishedConditions()){
			optimizerController.currentPointMarker = evaluateCurrentPoint();
		
			if(optimizerController.startPoints.length-1<optimizerController.runs){
				optimizerController.startPoints.push(optimizerController.currentPointMarker);
				optimizerController.opts[optimizerController.opts.length-1].data.push(optimizerController.solutionSpace[0][optimizerController.currentPointMarker]);
			}
		
			var dir = explore();
		
			if(dir.stationary()){
				optMsg("Reducing Step Size");
				reduceStepSizes();
				for(var i=0; i<optimizerController.coreDimensions.length; i++){
					optimizerController.optDimensions[i] = optimizerController.coreDimensions[i];
				}
				optimizerController.dimensionsDiscarded=0;
			}else{ 
				optMsg("Moving");
				if(isLocal()){
					console.log(dir);
				}
				patternMove(dir)
				
				//dir.makeUnit
				if(! dimensionExists(dir) ){
					optMsg("Inserting Dimension: "+dir.toString())
					optimizerController.optDimensions.splice(optimizerController.optDimensions.length-1)
					optimizerController.optDimensions= [dir].concat(optimizerController.optDimensions);
					optimizerController.dimensionsDiscarded = optimizerController.dimensionsDiscarded + 1;
					if(optimizerController.dimensionsDiscarded>optimizerController.coreDimensions.length ){
						for(var i = 0; i < optimizerController.coreDimensions.length; i++){
							optimizerController.optDimensions[i] = optimizerController.coreDimensions[i];
						}
						optimizerController.dimensionsDiscarded = 0;
					}
				else
					optMsg("Dimension Already Exists:"+dir.toString())
				}
			}
			optimizerController.iterations = optimizerController.iterations + 1;
			optimizerController.opts[optimizerController.opts.length-1].data.push(optimizerController.solutionSpace[0][optimizerController.currentPointMarker]);
		
			//Reporting current status for progress updates
			var lowestAcc = Math.log((optimizerController.stepScale*optimizerController.stepSizes[0])/optimizerController.accuracies[0])
			for(var i=1; i< optimizerController.stepSizes.length; i++){ 
				var test = Math.log((optimizerController.stepScale*optimizerController.stepSizes[i])/optimizerController.accuracies[i]);
				if( test>lowestAcc ){
					lowestAcc = test;
				}
			}
			if(optimizerController.maxAcc == -1 ){
				optimizerController.maxAcc = lowestAcc;
			}
			var runFrac = 1/(optimizerController.randomStarts+1);
			optimizerProgress.updateProgress((optimizerController.runs+1)*runFrac+runFrac*Math.min(0.95,Math.max(optimizerController.iterations/optimizerController.optIterations, (optimizerController.maxAcc-lowestAcc)/optimizerController.maxAcc)), " ");
			if((Date.now()-runStartTime)/1000 > 2){
				setTimeout("runOptimizer()", 30);
				return;
			}
		}
		optimizerController.bestPoints.push(optimizerController.currentPointMarker)
		
		optimizerController.midRun = false;
		optimizerController.runs++;
		
		setTimeout("runOptimizer()", 30);
	}else{
		finishOptimizer();
	}
}

function setupOptimizer(){
	optimizerController.startTime = Date.now();

	optimizerController.midRun = false;

	 optimizerController.goal = findID(optimizerController.goalPrimitive);
	 optimizerController.targets = findID(optimizerController.changePrimitives);


	 optimizerController.maximums = [];
	 optimizerController.minimums  = [];
	 optimizerController.accuracies  = [];
	 
	 for(var i=0; i<optimizerController.targets.length; i++){
		 for(var j=0; j<optimizerController.gridData.length; j++){
			 var item = optimizerController.gridData[j];
			 if(item.id==optimizerController.targets[i].id){
				 optimizerController.maximums.push(item.maxBound);
				 optimizerController.minimums.push(item.minBound);
				 optimizerController.accuracies.push(item.desiredAccuracy);
				 break;
			 }
		 }
	 }
	 optimizerController.reductionRate = optimizerController.stepReduction;
	
	optimizerController.minimize  = optimizerController.optGoal=="Minimize"?1:-1;

	optimizerController.stepScale = 1; //Initial step Scale
	optimizerController.stepSizes = [];
	for(var i=0; i< optimizerController.maximums.length; i++){
		optimizerController.stepSizes.push((optimizerController.maximums[i]-optimizerController.minimums[i])/4)
	}
	optimizerController.evaluations = 0;
	optimizerController.currentPointMarker = 0;
	optimizerController.iterations = 0; // the number of the current iteration within a run
	optimizerController.solutionSpace = []; //the comprehensive results (an darry of arrays)
	optimizerController.runs = 0; // the number of the current run
	optimizerController.bestPoints = []; //the optimal indexes of each run
	optimizerController.startPoints = [] //the start indexes of each run
	optimizerController.terminationReasons = [] // Reason for run completion "optimizerController.iterations", "StepSize"
	optimizerController.opts = []; //Optimal values for each run and each iteration
	optimizerController.metAccuracyConditions = false
	optimizerController.maxAcc = -1; //the largest error at the beginning

	optimizerController.coreDimensions = []
	for(var i=0; i<optimizerController.targets.length;i++){
		optimizerController.coreDimensions.push(new OptDimension(i))
	}
	optimizerController.optDimensions = []
	for(var i=0; i<optimizerController.targets.length;i++){
		optimizerController.optDimensions.push(optimizerController.coreDimensions[i])
	}
	optimizerController.dimensionsDiscarded = 0;
}

function finishOptimizer(){
	var supremeBestPoint = optimizerController.bestPoints[0]
	for(var i = 1; i < optimizerController.bestPoints.length; i++){
		if(optimizerController.solutionSpace[0][optimizerController.bestPoints[i]]*optimizerController.minimize < optimizerController.solutionSpace[0][supremeBestPoint]*optimizerController.minimize ){
			supremeBestPoint = optimizerController.bestPoints[i]
		}
	}
	
	for(var i = 1; i < optimizerController.targets.length; i++){
		setValue(optimizerController.targets[i], optimizerController.solutionSpace[i+1][supremeBestPoint])
	}
	
	var text = "<div style='padding: 1em; text-align: center;'><p>"+getText("Your model has been set to the optimal solution.")+"</p>" + optString(supremeBestPoint);
	
	text = text+"<br/><p>"+getText("Please note that the optimization algorithm is unable to fully account for local minimums or maximums. If your solution space contains such features, the algorithm may have returned erroneous results.")+"</p>"
	if(optimizerController.randomStarts>0 ){
		text = text+"<hr><p>"+getText("You specified a total of %s random iterations. The optimums of the initial iteration and each random one are as follows",optimizerController.randomStarts)+":<br/>"
		for(var i=0; i<optimizerController.bestPoints.length; i++){
			text=text+"\n\n"+optString(optimizerController.bestPoints[i])
		}
	}
	
	text=text+"<hr/><p>"+getText("Optimization Duration: %s seconds", (Date.now()-optimizerController.startTime)/1000)+"</p></div>"
	
	var tabs = [{name: "Summary", type: "html", data: text}];
	
	if(optimizerController.targets.length == 1 ){
		var xs = [], ys = [];
		var dat = [];
		for(var i=0; i<optimizerController.evaluations; i++){
			dat.push({x: optimizerController.solutionSpace[1][i], y:optimizerController.solutionSpace[0][i]})
		}
		dat.sort(function(a, b) {
		  return a.x - b.x;
		});
		for(var i=0; i<dat.length; i++){
			xs.push(dat[i].x)
			ys.push(dat[i].y)
		}
		
		tabs.push({
			name: getText("Explored Solution Space"),
			  type: "chart",
			  xLabel: getName(optimizerController.targets[0]),
			  yLabel: getName(optimizerController.goal)+" "+optimizerController.goalType,
			  legend: "none",
			  horizontalGrid: true,
			  verticalGrid: true,
			  xType: "Numeric",
			  xData: xs,
			  data: [{
			      data: ys,
			      type: "line",
			      name: "Results"
			  }]
		});
	}
	
	
	var its = [];
	var dataSeries = [];
	for(var i=0; i < optimizerController.opts.length; i++){
		its = its.concat(optimizerController.opts[i].iterations());
		dataSeries.push({
		      data: optimizerController.opts[i].data,
		      type: "line",
		      name: "Run "+(i+1)
		  })
	}
	its= Ext.Array.unique(its);
	
	tabs.push({
		name: getText("Iterations"),
		  type: "chart",
		  xLabel: getText("Iteration"),
		  yLabel: getName(optimizerController.goal)+" "+optimizerController.goalType+" Optimum",
		  legend: "none",
		  horizontalGrid: true,
		  verticalGrid: true,
		  xType: "Numeric",
		  xData: its,
		  data: dataSeries
	});
	
	
	var data= [[],[]];
	var headers = [getName(optimizerController.goal)+" "+optimizerController.goalType];
	for(var j=0; j<optimizerController.targets.length; j++){
		headers.push(getName(optimizerController.targets[j]));
		data.push([]);
	}
	headers.push("Note");
	for(var i=0; i<optimizerController.evaluations; i++){
		for(var j=0; j<=optimizerController.targets.length; j++){
			data[j].push(optimizerController.solutionSpace[j][i])
		}
		if(optimizerController.startPoints.indexOf(i) != -1 ){
			data[data.length-1].push(getText("Iteration Start"));
		}else if(optimizerController.bestPoints.indexOf(i) != -1 ){
			data[data.length-1].push(getText("Iteration Optimum"));
		}else{
			data[data.length-1].push("");
		}
	}
	
	tabs.push({
		name: getText("Results Table"),
		  type: "table",
		  data: data,
		   header: headers
	});
	
	
	showData(getText("Optimization Results"), tabs);
	
	optimizerProgress.close();
}

var OptDimension = function(thisDimension){
	this.coords = [];
	
	
	if(thisDimension != null){
		for(var i=0; i< optimizerController.targets.length; i++){
			if(i==thisDimension ){
				this.coords.push(1);
			}else{
				this.coords.push(0);
			}
		}
		
	}else{
		for(var i=0; i<optimizerController.targets.length;i++){
			this.coords.push(0)
		}
	}
	
}

OptDimension.prototype.toString = function(){
	var scoords = [];
	for(var i=0; i<this.coords.length; i++){
		scoords.push(this.coords[i])
	}
	return "<<"+scoords.join(", ")+">>";
}

OptDimension.prototype.append = function(d, multiplier){
	multiplier = multiplier?multiplier:1;

	for(var i=0; i < d.coords.length; i++){
		this.coords[i] = this.coords[i]+d.coords[i]*multiplier
	}
}

OptDimension.prototype.apply = function(times){
	for(var i=0; i<optimizerController.targets.length; i++){
		var newValue = parseFloat(getValue(optimizerController.targets[i]))+this.coords[i]*times*optimizerController.stepSizes[i]*optimizerController.stepScale;
		optMsg("Value "+i+": "+newValue);
		setValue(optimizerController.targets[i], newValue);
	}
}
	
OptDimension.prototype.stationary = function(){
	for(var i = 0; i < this.coords.length; i++){
		if(this.coords[i] != 0){
			return false;
		}
	}
	return true;
}
	
OptDimension.prototype.makeUnit = function(){
	var l  = this.length();
	for(var i=0; i<this.coords.length; i++){
		this.coords[i] = this.coords[i]/l;
	}
}
	
OptDimension.prototype.length  = function(){
	var l  = 0;
	for(var i=0; i<this.coords.length; i++){
		l = l+Math.pow(this.coords[i], 2);
	}
	return Math.sqrt(l);
}
	
OptDimension.prototype.equalTo = function(d){
	var sum = 0;
	for(var i=0; i<this.coords.length; i++){
		sum = sum+Math.abs(d.coords[i]*this.coords[i]);
	}
	sum = sum/(this.length()*d.length());
	return (sum>0.99);
}

function dimensionExists(d){
	for(var i=0; i<optimizerController.optDimensions.length; i++){
		if(optimizerController.optDimensions[i].equalTo(d) ){
			return true;
		}
	}
	return false;
}


function metFinishedConditions(){
	if(optimizerController.iterations>optimizerController.optIterations ){
		optimizerController.terminationReasons.push("Iterations");
		return true;
	}
	if(optimizerController.metAccuracyConditions ){
		optimizerController.terminationReasons.push("StepSize");
	}
	return optimizerController.metAccuracyConditions;
}

function reduceStepSizes(){
	optimizerController.metAccuracyConditions = true;
	for(var i = 0; i < optimizerController.stepSizes.length; i++){
		if( optimizerController.stepSizes[i]*optimizerController.stepScale >= optimizerController.accuracies[i] ){
			optimizerController.metAccuracyConditions = false;
			break;
		}
	}
	optimizerController.stepScale = optimizerController.stepScale*optimizerController.reductionRate;
	optMsg("Step scale: "+optimizerController.stepScale);
}

function restoreCurrentPoint(){
	restorePoint(optimizerController.currentPointMarker);
}

function restorePoint(k){
	for(var i=0; i<optimizerController.targets.length; i++){
		setValue(optimizerController.targets[i], optimizerController.solutionSpace[i+1][k]);
	}
}

function evaluateCurrentPoint(){
	testPointBounds();
	var targetValues = [];
	for(var i=0; i<optimizerController.targets.length; i++){
		targetValues.push(parseFloat(getValue(optimizerController.targets[i])));
	}
	for(var k = 0; k < optimizerController.evaluations; k++){
		var match = true;
		for(var i = 0; i < optimizerController.targets.length; i++){
			if (optimizerController.solutionSpace[i+1][k] != targetValues[i]){
				match = false;
				break;
			}
		}
		if (match){
			return k;
		}
	}
	var res = runModel({silent: true});
	if(res.error != "none"){
		mxUtils.alert(res.error);
		if(res.errorPrimitive){
			highlight(res.errorPrimitive);
		}
		if(optimizerProgress){
			optimizerProgress.close();
		}
		throw("Opt Error");
	}
	
	optimizerController.evaluations = optimizerController.evaluations + 1;
	optimizerController.solutionSpace.length = optimizerController.targets.length+1;
	for(var i = 0; i < optimizerController.solutionSpace.length; i++){
		if(! optimizerController.solutionSpace[i]){
			optimizerController.solutionSpace[i] = [];
		}
		optimizerController.solutionSpace[i].length = optimizerController.evaluations;
	}
	if( optimizerController.goalType == "Final Value"){
		optimizerController.solutionSpace[0][optimizerController.evaluations-1] = res.lastValue(optimizerController.goal);
	}else if(optimizerController.goalType == "Integral of Value"){
		//sums up the values of the item over the time series. If there are some missing data points (NAN)
		//they will be ignored. If there are no data points, the sum will be set to NAN
		var v = res.value(optimizerController.goal);
		var sum = 0;
		for(var i = 0; i < v.length; i++){
			sum	= sum + v[i];
		}
		optimizerController.solutionSpace[0][optimizerController.evaluations-1] = sum;
	}else{
		alert("Unknonw optimizer goal type: " + optimizerController.goalType );
	}
	
	for(var i=0; i<optimizerController.targets.length; i++){
		optimizerController.solutionSpace[i+1][optimizerController.evaluations-1] = parseFloat(getValue(optimizerController.targets[i]));
	}
	
	return optimizerController.evaluations-1;
}

function explore(){
	var newDirection = new OptDimension();
	var bestK  = optimizerController.currentPointMarker;
	var k;
	optMsg("Exploring")
	for(var i=0; i<optimizerController.optDimensions.length; i++){
		optMsg("Dimensions "+optimizerController.optDimensions[i].toString())
		
		optimizerController.optDimensions[i].apply(1)
		k = evaluateCurrentPoint();
		
		if(firstBetter(k, bestK) ){
			optMsg("Plus 1 Success");
			newDirection.append(optimizerController.optDimensions[i], 1);
			bestK = k;
		}else{
			restorePoint(bestK);
			optimizerController.optDimensions[i].apply(-1);
			k = evaluateCurrentPoint();
			if(firstBetter(k, bestK) ){
				optMsg("Minus 1 Success");
				newDirection.append(optimizerController.optDimensions[i], -1);
				bestK=k;
			}else{
				optMsg("Static");
				restorePoint(bestK);
			}
		}
	}
	return newDirection;
}

function patternMove(dir){
	optMsg("Pattern Move: "+dir.toString())
	var m1 = evaluateCurrentPoint();
	dir.apply(1);
	var m2 = evaluateCurrentPoint();
	optMsg("Step One: "+optimizerController.solutionSpace[0][m1]);
	optMsg("Step Two: "+optimizerController.solutionSpace[0][m2]);
	
	if(firstBetter(m1,m2) ){
		optMsg("Chose 1");
		optimizerController.currentPointMarker=m1;
	}else{
		optMsg("Chose 2");
		optimizerController.currentPointMarker=m2;
	}
	restoreCurrentPoint();
}


function firstBetter(marker1, marker2){
	/*if isNAN(optimizerController.solutionSpace(0, marker1)) ){
		return false
	elseif isNAN(optimizerController.solutionSpace(0, marker2)) ){
		return true
	}*/
	//optMsg(optimizerController.solutionSpace);
	return optimizerController.solutionSpace[0][marker1]*optimizerController.minimize < optimizerController.solutionSpace[0][marker2]*optimizerController.minimize;
}

function testPointBounds(){
	for(var i=0; i<optimizerController.targets.length; i++){
		if(parseFloat(getValue(optimizerController.targets[i])) > optimizerController.maximums[i] ){
			setValue(optimizerController.targets[i], optimizerController.maximums[i]);
		}
		if(parseFloat(getValue(optimizerController.targets[i])) < optimizerController.minimums[i]){
			setValue(optimizerController.targets[i], optimizerController.minimums[i]);
		}
	}
}

function setInitialPosition(randomize){
	for(var i=0; i<optimizerController.targets.length; i++){
		var ratio;
		if(randomize){
			ratio = Math.random();
		}else{
			ratio = 0.5;
		}
		setValue(optimizerController.targets[i], (optimizerController.maximums[i]-optimizerController.minimums[i])*ratio+optimizerController.minimums[i]);
	}
}

function optString(marker){
	var terminationReason = optimizerController.terminationReasons[optimizerController.bestPoints.indexOf(marker)];
	var s ="<br/><center><table border='1' cellpadding='4' align = 'center' style='text-align:center;background-color: white; border: solid 1px black; border-spacing: 0; border-collapse: collapse;'><tr><td style='padding:.5em'><b>Primitive</b></td><td style='padding:.5em'><b>Optimum</b></td><td style='padding:.5em'><b>Range</b></td></tr><tr><td colspan=3 style='padding:.5em'><b>Goal Primitive</b></td></tr>";
	s=s+"<tr><td style='padding:.5em'><b>["+getName(optimizerController.goal)+"]</b></td><td style='padding:.5em'>"+optimizerController.solutionSpace[0][marker]+"</td><td style='padding:.5em'>";
	if(terminationReason=="Iterations" ){
		s = s + " optimization terminated due to exceeding maximum number of allowed iterations";
	}else{
		s = s + "--";
	}
	s = s + "</td></tr>";
	
	s = s + "<tr><td colspan=3 style='padding:.5em'><b>Changed Primitives</b></td></tr>"
	for(var i=0; i<optimizerController.targets.length; i++){
		var tVal = optimizerController.solutionSpace[i+1][marker];
		s = s + "<tr><td style='padding:.5em'><b>["+getName(optimizerController.targets[i])+"]</></td><td style='padding:.5em'>"+tVal+"</td><td style='padding:.5em'>";
		if(terminationReason=="StepSize" ){
			if(tVal == optimizerController.minimums[i] ){
				s=s+"-Infinity";
			}else{
				s=s+(tVal-optimizerController.accuracies[i]);
			}
			s=s+" - ";
			if(tVal == optimizerController.maximums[i] ){
				s=s+"Infinity";
			}else{
				s=s+(tVal+optimizerController.accuracies[i]);
			}
		}else{
			s = s + "--";
		}
		s = s + "</td></tr>";
	}
	s=s+"</table></center>"
	return s;
}

var DataStore = function(){
	this.data = [];
}

DataStore.prototype.iterations = function(){
	var res = [];
	for(var i=0; i< this.data.length; i++){
		res.push(i);
	}
	return res;
}

function optMsg(txt){
	if(isLocal()){
		console.log(txt);
	}
}