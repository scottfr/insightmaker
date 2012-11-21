"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


var simulatorProgress;
var strictUnits = null;
var submodels = null;


function runSimulation(silent) {
	try {
		return innerRunSimulation(silent);//have an inner funciton call to escape try-catch performance pathologies
	} catch (err) {
		if (isLocal()) {
			console.log(err);
		}

		if (isDefined(simulatorProgress) && simulatorProgress != null) {
			simulatorProgress.close()
		};

		if (!silent) {
			if (err.msg) {
				handleErrorObject(err)
			} else {
				handleErrorObject({
					msg: "Unknown model generation error."
				});
			}
		}

		if (err.msg) {
			return {
				error: err.msg,
				errorPrimitive: err.primitive
			};
		} else {
			return {
				error: "Unknown model error.",
				errorPrimitive: null
			};
		}
	}
}

var timeUnits = null;
function innerRunSimulation(silent) {
	silent = isUndefined(silent) ? false : silent;
	
	var model = {};
	submodels = {"base": {id: "base", "DNA":[], agents: [{children: []}], size: 1}};
	var setting = getSetting();

	strictUnits = isTrue(setting.getAttribute("StrictUnits"));
	//strictUnits = false; //Historical mode, can do "{1 cow}+5"
		
	//Set Up simulation time settings
		
	timeUnits = setting.getAttribute("TimeUnits");
	var u = new UnitStore([{
		id: timeUnits,
		exponent: 1
	}]);
	model["timeStep"] = new Material(sn("#i" + setting.getAttribute("TimeStep")), u.clone());
	model["timeLength"] = new Material(sn("#i" + setting.getAttribute("TimeLength")), u.clone());
	model["timeStart"] = new Material(sn("#i" + setting.getAttribute("TimeStart")), u.clone());
	if (setting.getAttribute("SolutionAlgorithm") == "RK4") {
		model["RKOrder"] = 4;
	} else {
		model["RKOrder"] = 1;
	}
		
	//End Simulation time settings setup
		
	//Begin custom units setup

	var customUnits = setting.getAttribute("Units");
	if (isDefined(customUnits)) {
		var units = setting.getAttribute("Units").split("\n");
		var newSources = [],
			newScalings = [],
			newTargets = [];
		for (var i = 0; i < units.length; i++) {
			var u = units[i].split("<>");
			if (Ext.String.trim(u[2]) != "") { //It has a synonym, otherwise we don't need to add it
				newSources.push(u[0]);
				newScalings.push(u[1]);
				newTargets.push(createUnitStore(u[2]).toStringShort());
			}
		}
		loadUnits(newSources, newTargets, newScalings);

	}
		
	//End custom units setup

	var modelItems = primitives();
	
	for(var i = 0; i < modelItems.length; i++){
		
		if (modelItems[i].value.nodeName == "Agents") {
			var item = modelItems[i];
			
			var id = item.getAttribute("Agent");
			if(isUndefined(id)){
				throw {msg: "You must select a base agent for <i>"+clean(item.getAttribute("name"))+"</i>.", primitive: item, showEditor: false};
			}
				
			var x = new Agents();
			x.id = item.id;
			x.agentId = id;
			x.createIds();
			x.name = item.getAttribute("name");
			
			x.geoDimUnits = item.getAttribute("GeoDimUnits");
			x.geoDimUnitsObject = createUnitStore(item.getAttribute("GeoDimUnits"));
			x.geoWidth = simpleUnitsTest(simpleEquation(item.getAttribute("GeoWidth")), x.geoDimUnitsObject);
			x.geoHeight = simpleUnitsTest(simpleEquation(item.getAttribute("GeoHeight")), x.geoDimUnitsObject);
			x.halfWidth = div(x.geoWidth, new Material(2));
			x.halfHeight = div(x.geoHeight, new Material(2));
			x.geoWrap = isTrue(item.getAttribute("GeoWrap"));
			x.placement = item.getAttribute("Placement");
			x.placementFunction = item.getAttribute("PlacementFunction");
			x.network = item.getAttribute("Network");
			x.networkFunction = item.getAttribute("NetworkFunction");
			
			var agentCells = getChildren(findID(id));
			
			x.DNA = [];
			for(var j=0; j<agentCells.length; j++){
				if(modelType(agentCells[j].value.nodeName)){
					x.DNA.push(getDNA(agentCells[j]));
				}
				if(agentCells[j].value.nodeName=="State"){
					x.stateIds.push(agentCells[j].id);
				}
			}
			
			x.size = item.getAttribute("Size");
			
			x.agents = [];
			
			x.cell = item;
			x.dna = {type: "Agents", id: x.id, name: x.name, cell: item, agents: x};
			
			submodels[item.id] = x;
			submodels.base.DNA.push(x.dna);
		}else if(! inAgent(modelItems[i])){
			if(modelType(modelItems[i].value.nodeName)){
				submodels.base.DNA.push(getDNA(modelItems[i]));
			}
		}
	};
	
	
	for(var submodel in submodels){
		submodel = submodels[submodel];
		for(var j = 0; j < submodel.size; j++){
			var agent = new Agent();
			if(submodel.id == "base"){
				agent = submodel.agents[0];
			}else{
				agent.parent = submodel;
				agent.index = j;
				agent.children = [];
				agent.agentId = item.id;
				agent.createIds();
				submodel.agents.push(agent);
			}
			for(var i = 0; i < submodel.DNA.length; i++){
				decodeDNA(submodel.DNA[i], agent);
			}
		}
	}
	
	// Initialize Actual Simulation
	
	oldAggregateSeries = [];
	
	timeStart = model.timeStart;
	timeLength = model.timeLength;
	timeEnd = plus(timeStart, timeLength);
	userTimeStep = model.timeStep;
	timeStep = userTimeStep;
	time = timeStart;
	timeIndex = 0;
	RKOrder = model.RKOrder;
	RKPosition = 1;
 	timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);
	if (RKOrder == 4) {
		timeStep = div(timeStep, new Material(2));
	}
	
	
	
	for(var submodel in submodels){
		//console.log("[[["+submodel+"]]]]");
		submodel = submodels[submodel];
		for(var j = 0; j < submodel.size; j++){
			for(var i = 0; i < submodel.DNA.length; i++){
				//console.log(i);
				linkPrimitive(submodel.agents[j].children[i], submodel.DNA[i]);
			}
		}
	} 		
			
			
	if(isDefined(setting.getAttribute("Macros"))){
		try{
			evaluateMacros(setting.getAttribute("Macros"));
		}catch(err){
			showMacros();
			var msg = "An error with the macros prevented the simulation from running.";
			if(err.msg){
				msg = msg + "<br/><br/>" + err.msg;
			}else if(err.toString().substr(0,4)=="MSG:"){
				msg = msg + "<br/><br/>" + err.toString().substr(4);
			}
						
			throw {
				msg: msg
			};
				
		}
	}
	
	
	for(var submodel in submodels){
		submodel = submodels[submodel];
		for(var j = 0; j < submodel.size; j++){
			setAgentInitialValues(submodel.agents[j]);
		}
	} 	
		
	for(var submodel in submodels){
		if(submodel != "base"){
			try{
				buildNetwork(submodels[submodel]);	
			}catch(err){
				if (isLocal()) {
					console.log(err);
				}
				var msg = "An error with the custom network function prevented the simulation from running.";
				if(err.msg){
					msg = msg + "<br/><br/>" + err.msg;
				}else if(err.toString().substr(0,4)=="MSG:"){
					msg = msg + "<br/><br/>" + err.toString().substr(4);
				}
						
				throw {
					msg: msg,
					primitive: submodels[submodel].cell,
					showEditor: false
				};
			}
					
					
			try{
				
				buildPlacements(submodels[submodel]);
					
			}catch(err){
				if (isLocal()) {
					console.log(err);
				}
				var msg = "An error with the agent placement function prevented the simulation from running.";
				if(err.msg){
					msg = msg + "<br/><br/>" + err.msg;
				}else if(err.toString().substr(0,4)=="MSG:"){
					msg = msg + "<br/><br/>" + err.toString().substr(4);
				}
						
				throw {
					msg: msg,
					primitive: submodels[submodel].cell,
					showEditor: false
				};
			}
					
		}
	}

	model["submodels"] = submodels;


	if (silent) {
		var res = simulate(model, true);

		res.error = "none";
		res.errorPrimitive = null;
		res.names = {};
		var items = submodels["base"].agents[0].children;
		for (var i = 0; i < items.length; i++) {
			res.names[items[i].name] = items[i].id;
		}
		res.value = function(item) {
			return this[item.id].results;
		};
		res.lastValue = function(item) {
			return this[item.id].results[this[item.id].results.length - 1];
		};
		res.periods = res["Time"].length;


		return res;
	} else {
		simulatorProgress = Ext.MessageBox.show({
			msg: "Processing Model...",
			icon: 'run-icon',
			width: 300,
			closable: false,
			modal: true,
			progress: true
		});
				
		simulate(model, false, finishSim);
	}

	
}

function createUnitStore(u) {
	if (u.toLowerCase() == "unitless") {
		return new UnitStore([{
			id: "",
			exponent: 1
		}]);
	}

	var x = simpleEquation("{1 " + u + "}");
	return x.units;
}

function simpleEquation(eq, scope, primitiveBank, tree){
	if(! scope){
		scope = {};
	}
	if(! primitiveBank){
		primitiveBank = {};
	}
	if(! tree){
		tree = trimTree(createTree(eq), primitiveBank);
	}
	
	var res = evaluateTree(tree, scope);
	
	return res;
}

function simpleNum(mat, units){
	if(mat instanceof Vector){
		return new Vector(mat.items.map(function(x){
			return simpleNum(x, units);
		}));
	}
	
	
	if(unitless(units) && (! unitless(mat.units))){
		throw("The result of the calculation has units "+mat.units.toString()+", but the no units are specified for the calculation. Please set the units for the calculation so we can determine the proper output.");
	}

	
	if( unitless(mat.units) ){
		return 0+mat.value;
	}else{
		var q = new Quantities(mat.units);
		var u = new Quantities(units);
		return 0+fn["*"](mat.value, fn["/"](sn("#e"+q.toBase), u.toBase));
	}
	
}

function simpleUnitsTest(mat, units){
	if(mat instanceof Vector){
		return new Vector(mat.items.map(function(x){
			return simpleUnitsTest(x, units);
		}));
	}
	
	
	if(mat.units.unitless() && units.unitless()){
		return mat;
	}else if(mat.units.unitless()){
		mat.units = units;
		return mat;
	}else if(unitsEqual(mat.units, units)){
		return mat;
	}else{
		var scale = convertUnits(mat.units, units, true);
		if (scale == 0) {
			if(isLocal()){
				console.log(mat.units);
				console.log(units);
			}
			throw("MSG: Wrong units generated. Expected <i>"+clean(this.units.toString())+"</i>, and got <i>"+clean(m.units.toString())+"</i>.");
		} else {
			//console.log("----+")
			mat.value = mat.value * scale;
			mat.units = units;
			return mat;
		}
	}
}



function tally(arr) {
    var res= {"null":0};
	var prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
		if(arr[i]==null){
			res["null"] = res["null"]+1;
		}
        else if ( arr[i] !== prev ) {
			res[arr[i].toString()] = 1;
        } else {
            res[prev.toString()] = res[prev.toString()]+1;
        }
        prev = arr[i];
    }
	
    return res;
}

function aggregateAgentSeries(res){
	var data = res.results.map(function(x){
		var states = [];
		x.current.forEach(function(x){states = states.concat(x.state)})
		
		var items = tally(states);
		res.data.states.forEach(function(key){
			if(isUndefined(items[key.toString()])){
				items[key.toString()] = 0;
			}
		});
		return items;
	});
	
	
	var ret = {};
	res.data.states.forEach(function(key){
		ret[key.toString()] = [];
		data.forEach(function(x){
			ret[key.toString()].push(x[key.toString()]);
		});
	});
	
	return ret;
}

function finishSim(res, displayInformation) {
	var ids = [];
	var headers = [];
	var agents = {};
	var agentKeys = [];
	var displayedIds = [];
	var displayedHeaders = []
	var colors = [];
	
	
	for(var i = 0; i < displayInformation.ids.length; i++){
		var id = displayInformation.ids[i];
		var item = findID(id);
		
		displayedIds.push(id);
		displayedHeaders.push(getName(item));
		
		if(item.value.nodeName == "Agents"){
			var x = aggregateAgentSeries(res[id]);
			agents[id.toString()] = {id: id, item: item, data: res[id].data, results: res[id].results, aggregate: x};
			
			for(var key in x){
				var innerItem = findID(key);
				ids.push(id);
				headers.push(getName(innerItem));
				colors.push(getLineColor(innerItem))
				agentKeys.push(key);
			}
		}else{
			ids.push(id)
			headers.push(getName(item));
			colors.push(getLineColor(item));
			agentKeys.push(false);
		}
	}
	
	displayInformation.colors = colors;
	displayInformation.ids = ids;
	displayInformation.headers = headers;
	displayInformation.agents = agents;
	displayInformation.displayedHeaders = displayedHeaders;
	displayInformation.displayedIds = displayedIds;
	
	displayInformation.times = res["Time"];
	var storeData = [];

	for (var k = 0; k < res.Time.length; k++) {
		storeData.push({});
		storeData[k]["Time"] = k;
		storeData[k]["TimeValue"] = res["Time"][k];
		for (var i = 0; i < ids.length; i++) {
			if(agentKeys[i]){
				storeData[k]["series" + i] = agents[ids[i].toString()].aggregate[agentKeys[i].toString()][k];
			}else{
				storeData[k]["series" + i] = res[ids[i]].results[k];
			}
		}
	}

	var storeFields = [{
		type: "float",
		name: "Time"
	},{
		type: "float",
		name: "TimeValue"
	}];
	
	for (var i = 0; i < headers.length; i++) {
		var n = "series" + i;
		storeFields.push({
			type: "float",
			name: n
		});
	}

	
	var store = new Ext.data.Store({
		fields: storeFields,
		data: storeData
	});

	displayInformation.store = store;

	//console.log(storeData);
	createResultsWindow(displayInformation);

}

function handleErrorObject(err) {
	if (isLocal()) {
		console.log(err);
	}
	if (err.msg) {
		if (isDefined(err.primitive)) {
			var cell = findID(err.primitive.id)
			highlight(cell);
			if (err.showEditor) {
				showEditor(cell);
			}
		}
		mxUtils.alert(err.msg);
	} else {
		mxUtils.alert(err);
	}
}

function evaluateMacros(macros){
	evaluateTree(trimTree(createTree(macros), {}), varBank);
}

function getDNA(cell){
	var type = cell.value.nodeName;
	var dna = {type: type, cell: cell};

	dna.id = cell.id;
	dna.name = cell.getAttribute("name");
	
	if(type=="Flow" || type=="Transition"){
		if (cell.target !== null) {
			dna.targetId = orig(cell.target).id;
		}
		if (cell.source !== null) {
			dna.sourceId = orig(cell.source).id;
		}
	}
	
	if(type == "Converter"){
		dna.value = getValue(cell);
	}else{
		try{
			dna.value = createTree(getValue(cell));
		}catch(err){
			if(isLocal()){
				console.log(this);
				console.log(eq);
				console.log(neighborhood);
				console.log(err);	
			}
			error("The primitive <i>"+clean(dna.name)+"</i> has an equation error that must be corrected before the model can be run.", cell, true);
		}
	}
	
	
	if(type == "Action"){
		dna.trigger = cell.getAttribute("Trigger");
		try{
			dna.triggerValue = createTree(cell.getAttribute("Value"));
		}catch(err){
			error("The trigger for <i>"+clean(dna.name)+"</i> has an equation error that must be corrected before the model can be run.", dna.cell, false);
		}
	}else if(type == "Transition"){
		dna.trigger = cell.getAttribute("Trigger");
	}else if (type == "Stock") {
		dna.nonNegative = isTrue(cell.getAttribute("NonNegative"));
		if (cell.getAttribute("StockMode") == "Conveyor") {
			dna.stockType="Conveyor";
			try {
				dna.delay = evaluateTree(trimTree(createTree(cell.getAttribute("Delay")), {}));
				if (dna.delay.units.unitless()) {
					dna.delay.units = new UnitStore([{
						id: timeUnits,
						exponent: 1
					}]);
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}

				throw ({
					msg: "Invalid conveyor delay.",
					primitive: cell,
					showEditor: false
				});
			}
		}
	} else if (type == "Flow") {
		dna.onlyPositive = isTrue(cell.getAttribute("OnlyPositive"));
	} else if (type == "Converter") {
		dna.source = cell.getAttribute("Source");
		dna.interpolation = cell.getAttribute("Interpolation") == "Linear" ? "linear" : "discrete";
		var data = cell.getAttribute("Data").split(";");
		var inp = [];
		var out = [];
		var myU;
		if (dna.source == "Time") {
			myU = new UnitStore([{
				id: timeUnits,
				exponent: 1
			}]);
		} else {
			myU = createUnitStore(orig(findID(dna.source)).getAttribute("Units"));
		}
		for (var i = 0; i < data.length; i++) {
			var b = data[i].split(",");
			inp.push(new Material(sn(Ext.String.trim(b[0])), myU.clone()));
			out.push(new Material(sn(Ext.String.trim(b[1]))));
		}
		dna.input = inp;
		dna.output = out;
	}
	
	if (type != "State") {
		if (type != "Transition" && type != "Action") {
			var u = cell.getAttribute("Units");
			try {
				if (type != "Flow" || u.toLowerCase() != "unitless") {
					dna.units = createUnitStore(u);
				} else {
					dna.units = new UnitStore([{
						id: timeUnits,
						exponent: -1
					}]);
					dna.flowUnitless = true;
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				throw {
					msg: "Invalid units specified for primitive: \"" + clean(u) + "\".",
					primitive: cell,
					showEditor: true
				};

			}
		} else {
			if (dna.trigger == "Timeout") {
				dna.units = new UnitStore([{
					id: timeUnits,
					exponent: 1
				}]);
			} 
		}
		dna.maxConstraint = cell.getAttribute("MaxConstraint");
		dna.maxConstraintUsed = isTrue(cell.getAttribute("MaxConstraintUsed")) ? 1 : null;
		dna.minConstraint = cell.getAttribute("MinConstraint");
		dna.minConstraintUsed = isTrue(cell.getAttribute("MinConstraintUsed")) ? 1 : null;
	}
	
	return dna;
}

function decodeDNA(dna, agent){
	var type = dna.type;
	var x;
	if (type== "Variable") {
		x = new Variable();
	} else if (type == "State") {
		x = new State();
	} else if (type == "Transition") {
		x = new Transition();
		x.trigger = dna.trigger;
	} else if (type == "Action") {
		x = new Action();
		x.trigger = dna.trigger;
	} else if (type == "Stock") {
		x = new Stock();
		x.nonNegative = dna.nonNegative;
		if (dna.stockType == "Conveyor") {
			x.delay = dna.delay.clone();
		}
	} else if (type == "Flow") {
		x = new Flow();
		x.onlyPositive = dna.onlyPositive;
	} else if (type == "Converter") {
		x = new Converter();
		x.interpolation = dna.interpolation;
		x.setData(dna.input, dna.output);
	}

	if(x){
		x.id = dna.id;
		x.index = agent.index;
		x.agentId = agent.agentId;
		x.parent = agent;
		x.name = dna.name;
		x.createIds();
		if(isDefined(dna.maxConstraint)){
			x.setConstraints(dna.maxConstraint, dna.maxConstraintUsed, dna.minConstraint, dna.minConstraintUsed);
		}
		if(isDefined(dna.units)){
			if(dna.flowUnitless){
				x.setup(dna.units.clone(), {flowUnitless: dna.flowUnitless});
			}else{
				x.setup(dna.units.clone());
			}
		}
		
		agent.children.push(x);
	}else if(type == "Agents"){
		agent.children.push(dna.agents);
	}
}

function linkPrimitive(primitive, dna){
	var type = dna.type;
	//console.log("--"+dna.name);
	if(type != "Agents"){
		var myNeighborhood = getPrimitiveNeighborhood(primitive, dna);
			
		if(type == "Flow" || type == "Transition"){
			var alpha = null,
				omega = null;

			for (var neighbor in myNeighborhood) {
				if (dna.targetId == myNeighborhood[neighbor].id) {
					omega = myNeighborhood[neighbor];
				}
				if (dna.sourceId == myNeighborhood[neighbor].id) {
					alpha = myNeighborhood[neighbor];
				}
				if(((! dna.targetId) || alpha) && ((! dna.sourceId) || omega)){
					break;
				}
			}
			primitive.setEnds(alpha, omega);
		}
	
		if(type == "Action"){
			//console.log(myNeighborhood);
			try{
				primitive.equation = trimTree(dna.triggerValue,  myNeighborhood);
			}catch(err){
				error("The trigger for <i>"+clean(dna.name)+"</i> has an equation error that must be corrected before the model can be run.", dna.cell, false);
			}
			try{
				primitive.action = trimTree(dna.value,  myNeighborhood);
			}catch(err){
				error("The primitive <i>"+clean(dna.name)+"</i> has an equation error that must be corrected before the model can be run.", dna.cell, true);
			}
			primitive.resetTimer();
		}else if (type == "Converter") {
			if (dna.source == "Time") {
				primitive.setSource("*time");
			} else {
				var source = orig(findID(dna.source)).id;
			
				for (var neighbor in myNeighborhood) {
					if (source == myNeighborhood[neighbor].id) {
						primitive.setSource(myNeighborhood[neighbor]);
						break;
					}	
				}
			}
		} else {
			//console.log("setting: "+primitive.name);
			primitive.setEquation(dna.value,  myNeighborhood);
		}
	}
}

function setAgentInitialValues(agent){
	for(var i = 0; i < agent.children.length; i++){
		if(timeIndex > 0){
			var maxI = timeIndex + 1;
			if((agent.children[i] instanceof Stock) || (agent.children[i] instanceof State)){
				maxI = maxI-2;
			}
			for(var j = 0; j < maxI; j++){
				agent.children[i].pastValues.push(zero.clone());
			}
			if((agent.children[i] instanceof Stock) || (agent.children[i] instanceof State)){
				agent.children[i].value();
				agent.children[i].pastValues.push(agent.children[i].pastValues[agent.children[i].pastValues.length-1]);
			}
		}
		if(agent.children[i] instanceof Stock){
			agent.children[i].setDelay();
			try{
				agent.children[i].setInitialValue();
			}catch(err){
				if(isLocal()){
					console.log(err);
				}
				if(err instanceof String){
					error(err.substr(4,err.length), agent.children[i], true);
				}else{
					throw err;
				}
			}
		}else if(agent.children[i] instanceof State){
			try{
				if(agent.children[i].active === null){
					agent.children[i].setInitialActive();
				}
			}catch(err){
				if(isLocal()){
					console.log(err);
				}
				if(err instanceof String){
					error(err.substr(4,err.length), agent.children[i], true);
				}else{
					throw err;
				}
			}
		}
	}
}

function buildNetwork(submodel){
	if(submodel.network == "Custom Function"){
		var hood  =  getPrimitiveNeighborhood(submodel, submodel.dna);
		var tree = trimTree(createTree(submodel.networkFunction), hood);
		for(var i = 0; i < submodel.agents.length-1; i++){
			for(var j = i+1; j < submodel.agents.length; j++){
				if(trueValue(simpleEquation(submodel.networkFunction, {"-parent": varBank, "a": submodel.agents[i], "b": submodel.agents[j]}, hood, tree))){
					submodel.agents[i].connect(submodel.agents[j]);
				}
			}
		}
	}else if(submodel.network=="None"){
		//nothing to do
	}else{
		throw {
			msg: "Unknown network type: "+submodel.network+".",
			primitive: submodel.cell,
			showEditor: false
		};
	}
}

function buildPlacements(submodel, items){
	var tree;
	var wCount, hCount;
	
	if(submodel.placement == "Random"){
		submodel.agents.forEach(function(s){
			s.location = new Vector([mult(submodel.geoWidth, new Material(Rand())),mult(submodel.geoHeight, new Material(Rand()))]);
		});
	}else if(submodel.placement == "Custom Function"){
		 submodel.agents.forEach(function(s){
			 var n = getPrimitiveNeighborhood(submodel, submodel.dna);
			 n.self = s;
		 	s.location = simpleUnitsTest(simpleEquation(submodel.placementFunction, varBank, n), submodel.geoDimUnitsObject);
		 });
	}else if(submodel.placement == "Grid"){
		tree = trimTree(createTree("<<x*width(agent), y*height(agent)>>"), {});
		var size = submodel.agents.length;
		var ratio = simpleNum(simpleEquation("width(agent)/height(agent)", {"agent": submodel}, {}), submodel.geoDimUnitsObject);
		//console.log(ratio)
		hCount = Math.sqrt( size / ratio );
		wCount = Math.floor(hCount * ratio);
					
		hCount  = Math.ceil(hCount);
		if(! hCount*wCount >= size){
			wCount = wCount+1
		}
							
		var j=0;
		submodel.agents.forEach(function(s){
			var xPos = ((j % wCount) + 0.5)/wCount;
			var yPos = (Math.floor(j/wCount)+ 0.5)/hCount;
			s.location = simpleUnitsTest(simpleEquation("<<x*width(agent), y*height(agent)>>", {"agent": s, "x": new Material(xPos), "y":new Material(yPos)}, {}, tree), submodel.geoDimUnitsObject);
			j++;
		});
	}else if(submodel.placement == "Ellipse"){
		tree = trimTree(createTree("<<width(agent), height(agent)>>/2+<<sin(index(agent)/size*2*3.14159), cos(index(agent)/size*2*3.14159)>>*<<width(agent), height(agent)>>/2"), {});
		var size = new Material(submodel.agents.length);
		submodel.agents.forEach(function(s){
			s.location = simpleUnitsTest(simpleEquation("<<width(agent), height(agent)>>/2+<<sin(index(agent)/size*2*3.14159), cos(index(agent)/size*2*3.14159)>>*<<width(agent), heigh(agent)>>/2", {"agent": s, "size": size }, {}, tree), submodel.geoDimUnitsObject);
		});
	}else if(submodel.placement == "Network"){
		tree = trimTree(createTree("<<x*width(agent), y*height(agent)>>"), {});
							 
		var graph = new Graph();
							
		var nodes = submodel.agents.map(function(s){
			return graph.newNode({data:s});
		});
		var getNode = function(item){
			for(var i = 0; i < nodes.length; i++){
									
				if(nodes[i].data.data.fullId==item.fullId){
					return nodes[i];
				}
			}
			return null;
		}
		submodel.agents.forEach(function(a){
			a.connected.forEach(function(target){
				graph.newEdge(getNode(a), getNode(target));
			});
		});
		//console.log("ZZ");
		var layout = new Layout.ForceDirected(graph, 400.0, 600.0, 0.5);
							
		for(var i=0; i<30; i++){
			layout.applyCoulombsLaw();
			layout.applyHookesLaw();
			layout.attractToCentre();
			layout.updateVelocity(0.03);
			layout.updatePosition(0.03);
		}

		/*while(layout.totalEnergy() > 0.01) {
			layout.applyCoulombsLaw();
			layout.applyHookesLaw();
			layout.attractToCentre();
			layout.updateVelocity(0.03);
			layout.updatePosition(0.03);
		}*/
							
		var bb = layout.getBoundingBox();
		//console.log(bb);
		bb.width = bb.topright.x-bb.bottomleft.x;
		bb.height = bb.topright.y-bb.bottomleft.y;
		//console.log(bb);
		var scalePoint = function(p){
			return {x: (p.x-bb.bottomleft.x)/bb.width, y: (p.y-bb.bottomleft.y)/bb.height};
		}
							
		layout.eachNode(function(node, point) {
			var p = scalePoint(point.p);
			//console.log(scalePoint(p));
			node.data.data.location = simpleUnitsTest(simpleEquation("<<x*width(agent), y*height(agent)>>", {"agent": submodel, "x":new Material(p.x), "y":new Material(p.y)}, {}, tree), submodel.geoDimUnitsObject);
		});
		//console.log("done");
						
	}else{
		throw {
			msg: "Unknown placement type: "+submodel.placement+".",
			primitive: submodel.cell,
			showEditor: false
		};
	}
					
}


function getPrimitiveNeighborhood(primitive, dna){
	var neighbors = neighborhood(dna.cell);
	var hood = {
		self: primitive
	};
	
	//console.log("----");
	//console.log(dna.name);
	
	if(dna.type=="Agents"){
		for(var i=0; i<primitive.DNA.length; i++){
			var p = new Primitive();
			p.name = primitive.DNA[i].name;
			p.id = primitive.DNA[i].id;
			p.calculateValue = function(){
				error("["+this.name+"] is a placeholder and cannot be used as a direct value in equations.", primitive, true);
			}
			hood[primitive.DNA[i].name.toLowerCase()] = p;
		}
	}
	neighbors.forEach(function(neighbor) {
		var item = neighbor.item;
		if(item.value.nodeName == "Agents"){
			hood[submodels[item.id].name.toLowerCase()] = submodels[item.id];
			for(var i=0; i<submodels[item.id].DNA.length; i++){
				var p = new Primitive();
				p.name = submodels[item.id].DNA[i].name;
				p.id = submodels[item.id].DNA[i].id;
				p.calculateValue = function(){
					error("["+this.name+"] is a placeholder and cannot be used as a direct value in equations.", primitive, true);
				}
				hood[submodels[item.id].DNA[i].name.toLowerCase()] = p;
			}
		}else{

			//console.log(getName(item));
			var found = false;
			if(primitive.parent){
				for (var j = 0; j < primitive.parent.children.length; j++) {
					if (primitive.parent.children[j].id == item.id) {
						hood[primitive.parent.children[j].name.toLowerCase()] = primitive.parent.children[j];
						found = true;
						break;
					}
				}
			}
			if(! found){
				for (var j = 0; j < submodels["base"]["agents"][0].children.length; j++) {
					if (submodels["base"]["agents"][0].children[j].id == item.id) {
						hood[submodels["base"]["agents"][0].children[j].name.toLowerCase()] = submodels["base"]["agents"][0].children[j];
						found = true;
						break;
					}
				}
			}
		}
	});
	
	//console.log(hood);
	
	return hood;
}

function modelType(type){
	return ! (type == "Link" || type=="Picture" || type=="Text" || type=="Button" || type=="Folder" || type=="Setting" || type=="Display" || type=="Ghost");
}