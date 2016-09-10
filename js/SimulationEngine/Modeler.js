"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


var simulate;
var model;

var strictUnits = null;
var strictAgentResolution = false;
var strictLinks = false;


function runSimulation(config) {

	try {
		return innerRunSimulation(config); //have an inner function call to escape try-catch performance pathologies
	} catch (err) {
		return checkErr(err, config);
	}
}

function checkErr(err, config, results) {
	if (simulate) {
		simulate.terminate();
	}
	if (isLocal()) {
		console.log(err);
	}

	var errOut;
	if (err.msg) {
		errOut = {
			error: err.msg,
			errorPrimitive: isDefined(err.primitive) ? findID(err.primitive.id) : null
		};
	} else {
		errOut = {
			error: getText("An unknown simulation error occurred. Please report this issue to the Insight Maker team."),
			errorPrimitive: null
		};
		if (typeof err == "string") {
			if (err.substr(0, 4) === "MSG:") {
				errOut.error = err.substr(4);
			}
			err = {
				msg: errOut.error
			};
		} else {
			err.msg = errOut.msg;
		}
	}

	if (!simulate.results) {
		simulate.results = {};
	}
	simulate.results.error = err.msg;


	if (config.onError) {
		config.onError(errOut);
	}

	if (!config.silent) {
		handleErrorObject(err)
	} else {
		return errOut;
	}
}

var timeUnits = null;

function innerRunSimulation(config) {

	evaluatingLine = null;

	simulate = new Simulator();

	if(config.resultsWindow){
		//console.log("ABC")
		simulate.resultsWindow = config.resultsWindow;
	}

	bootCalc();


	allPlaceholders = [];
	model = {};
	model.submodels = {
		"base": {
			id: "base",
			"DNAs": [],
			agents: [{
				children: [],
				childrenId: {}
			}],
			size: 1
		}
	};
	var setting = getSetting();

	strictUnits = isTrue(setting.getAttribute("StrictUnits"));
	//strictUnits = false; //Historical mode, can do "{1 cow}+5"
	strictAgentResolution = isTrue(setting.getAttribute("StrictAgentResolution"));
	//strictAgentResolution = false // Historical mode, [stoctk].move() will resolve the stock to the agent
	strictLinks = isTrue(getSetting().getAttribute("StrictLinks"));
	//strictLinks = false // All links are implicitly bidirectional


	//Begin custom units setup

	var customUnits = setting.getAttribute("Units");
	if (isDefined(customUnits)) {
		var units = setting.getAttribute("Units").split("\n");
		var newSources = [],
			newScalings = [],
			newTargets = [];
		for (var i = 0; i < units.length; i++) {
			var us = units[i].split("<>");
			if (us[2] && us[2].trim() != "") { //It has a synonym, otherwise we don't need to add it
				newSources.push(us[0]);
				newScalings.push(us[1]);
				var newU = createUnitStore(us[2]);
				if (isUndefined(newU)) {
					throw {
						msg: 'You cannot define a units synonym for "unitless".'
					};
				} else {
					newTargets.push(newU.toStringShort());
				}
			}
		}
		loadUnits(newSources, newTargets, newScalings);

	}

	//End custom units setup

	//Set Up simulation time settings

	timeUnits = setting.getAttribute("TimeUnits").toLowerCase();
	var u = getUnitStore([timeUnits], [1]);
	model["timeLength"] = new Material(sn("#i" + setting.getAttribute("TimeLength")), u);
	model["timeStart"] = new Material(sn("#i" + setting.getAttribute("TimeStart")), u);
	model["timeStep"] = new Material(sn("#i" + setting.getAttribute("TimeStep")), u);
	if (setting.getAttribute("TimePause") > 0) {
		model["timePause"] = new Material(sn("#i" + setting.getAttribute("TimePause")), u);
	}
	simulate.timeUnits = u;


	//End Simulation time settings setup

	var solvers = {}; // Simulation solvers
	solvers.base = {
		timeStep: new Material(sn("#i" + setting.getAttribute("TimeStep")), u),
		algorithm: setting.getAttribute("SolutionAlgorithm"),
		id: "base",
		maxLoaded: -1
	};

	model.solvers = solvers;
	var folders = findType("Folder");
	for (var i = 0; i < folders.length; i++) {
		var json = folders[i].getAttribute("Solver");
		if (json) {
			var solver = JSON.parse(json);
			if (solver.enabled) {
				solvers[folders[i].id] = solver;
				solvers[folders[i].id].timeStep = new Material(sn("#i" + solvers[folders[i].id].timeStep), u);
				solvers[folders[i].id].id = folders[i].id;
				solvers[folders[i].id].maxLoaded = -1;
			}
		}
	}

	var solverKeys = Object.keys(solvers);
	for (var i = 0; i < solverKeys.length; i++) {
		var solver = solvers[solverKeys[i]];

		solver.userTimeStep = solver.timeStep;
		if (solver.algorithm == "RK4") {
			solver.RKOrder = 4;
		} else {
			solver.RKOrder = 1;
		}
		if (solver.RKOrder == 4) {
			solver.timeStep = div(solver.userTimeStep, new Material(2));
		} else {
			solver.timeStep = solver.userTimeStep;
		}

		solver.stocks = [];
		solver.flows = [];
		solver.transitions = [];
		solver.actions = [];
		solver.states = [];
		solver.valued = [];
		solver.displayed = [];
	}

	if (isDefined(setting.getAttribute("Macros"))) {
		try {
			evaluateMacros(setting.getAttribute("Macros"));
		} catch (err) {
			var annotations = [];

			var msg = getText("An error with the macros prevented the simulation from running.");

			if (err.msg) {
				msg = msg + "<br/><br/>" + err.msg;
			} else if (err.toString && err.toString().substr(0, 4) == "MSG:") {
				msg = msg + "<br/><br/>" + err.toString().substr(4);
			} else if (err.toString) {
				if (err.match && err.match(/line (\d+)/i)) {
					var l = err.match(/line (\d+)/i)[1];

					annotations.push({
						type: "error",
						row: (l !== undefined) ? (l - 1) : (evaluatingLine - 1),
						text: err
					})
				}
			}

			showMacros(annotations);

			throw {
				msg: msg
			};

		}
	}

	var modelItems = primitives();

	for (var i = 0; i < modelItems.length; i++) {

		if (modelItems[i].value.nodeName == "Agents") {
			var item = modelItems[i];

			var id = item.getAttribute("Agent");
			var z = parseInt(id, 10);
			if (z == id) {
				id = z;
			}
			if (isUndefined(id)) {
				throw {
					msg: getText("You must select a base agent for the primitive %s. You can create agent definitions using Folder primitives.", "<i>" + clean(item.getAttribute("name")) + "</i>"),
					primitive: item,
					showEditor: false
				};
			}

			var x = new Agents();

			x.dna = new DNA(item, id);
			x.id = item.id;

			x.agentId = id;
			x.createIds();

			x.dna.solver = folderSolvers(item, solvers);
			x.dna.solver.displayed.push(x);

			x.geoDimUnits = item.getAttribute("GeoDimUnits");
			x.geoDimUnitsObject = createUnitStore(item.getAttribute("GeoDimUnits"));
			x.geoWidth = simpleUnitsTest(simpleEquation(item.getAttribute("GeoWidth")), x.geoDimUnitsObject, item);
			x.geoHeight = simpleUnitsTest(simpleEquation(item.getAttribute("GeoHeight")), x.geoDimUnitsObject, item);
			x.halfWidth = div(x.geoWidth, new Material(2));
			x.halfHeight = div(x.geoHeight, new Material(2));
			x.geoWrap = isTrue(item.getAttribute("GeoWrap"));
			x.placement = item.getAttribute("Placement");
			x.placementFunction = item.getAttribute("PlacementFunction");
			x.network = item.getAttribute("Network");
			x.networkFunction = item.getAttribute("NetworkFunction");
			x.agentBase = findID(id).getAttribute("AgentBase") || "";
			if (x.agentBase.trim() != "") {
				x.agentBase = simpleEquation(x.agentBase, varBank);
			}

			var agentCells = getChildren(findID(id));

			x.DNAs = [];
			for (var j = 0; j < agentCells.length; j++) {
				if (modelType(agentCells[j].value.nodeName)) {
					x.DNAs.push(getDNA(agentCells[j], solvers));
				}
				if (agentCells[j].value.nodeName == "State") {
					x.stateIds.push(agentCells[j].id);
				}
			}

			x.size = item.getAttribute("Size");

			x.agents = [];

			x.dna.agents = x;

			model.submodels[item.id] = x;
			model.submodels.base.DNAs.push(x.dna);
		} else if (!inAgent(modelItems[i])) {
			if (modelType(modelItems[i].value.nodeName)) {
				model.submodels.base.DNAs.push(getDNA(modelItems[i], solvers));
			}
		}
	};


	for (var submodel in model.submodels) {
		submodel = model.submodels[submodel];
		for (var j = 0; j < submodel.size; j++) {
			var agent;
			if (submodel.id == "base") {
				agent = submodel.agents[0];
			} else {
				agent = new Agent();
				agent.container = submodel;
				agent.index = j;
				agent.children = [];
				agent.childrenId = {};
				agent.agentId = submodel.id;
				agent.createIds();
				if (submodel.agentBase) {
					agent.vector.parent = submodel.agentBase;
				}

				submodel.agents.push(agent);
			}
			for (var i = 0; i < submodel.DNAs.length; i++) {
				decodeDNA(submodel.DNAs[i], agent);
			}
		}
	}


	// Initialize Actual Simulation
	simulate.setup({
		model: model
	});

	for (var submodel in model.submodels) {
		submodel = model.submodels[submodel];
		for (var j = 0; j < submodel.size; j++) {
			for (var i = 0; i < submodel.DNAs.length; i++) {
				linkPrimitive(submodel.agents[j].children[i], submodel.DNAs[i]);
			}
		}
	}

	for (var submodel in model.submodels) {
		submodel = model.submodels[submodel];
		for (var j = 0; j < submodel.size; j++) {
			setAgentInitialValues(submodel.agents[j]);
		}
	}

	for (var submodel in model.submodels) {
		if (submodel != "base") {
			try {
				buildNetwork(model.submodels[submodel]);
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				var msg = getText("An error with the custom network function prevented the simulation from running.");
				if (err.msg) {
					msg = msg + "<br/><br/>" + err.msg;
				} else if (err.toString().substr(0, 4) == "MSG:") {
					msg = msg + "<br/><br/>" + err.toString().substr(4);
				}

				throw {
					msg: msg,
					primitive: model.submodels[submodel].cell,
					showEditor: false
				};
			}


			try {

				buildPlacements(model.submodels[submodel]);

			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				var msg = getText("An error with the agent placement function prevented the simulation from running.");
				if (err.msg) {
					msg = msg + "<br/><br/>" + err.msg;
				} else if (err.toString().substr(0, 4) == "MSG:") {
					msg = msg + "<br/><br/>" + err.toString().substr(4);
				}

				throw {
					msg: msg,
					primitive: model.submodels[submodel].cell,
					showEditor: false
				};
			}

		}
	}



	simulate.results = {
		Time: [],
		data: []
	};
	simulate.displayInformation = {
		ids: [],
		times: [],
		objects: []
	};
	model.submodels["base"].agents[0].children.forEach(function(x) {
		if (!((x instanceof Action) || (x instanceof Transition))) {
			simulate.displayInformation.objects.push(x);
			simulate.displayInformation.ids.push(x.id);
			var data = {};
			if (x instanceof Agents) {
				data.width = x.geoWidth;
				data.height = x.geoHeight
				data.units = x.geoDimUnitsObject;
				data.states = x.states();
			} else {
				x.dna.solver.displayed.push(x);
			}
			simulate.results[x.id] = {
				data: data,
				results: [],
				dataMode: "float"
			};
		}
	});



	if (config.silent) {
		if(config.onPause){
			simulate.run(config);
		}else{
			return formatSimResults(simulate.run(config));
		}

	} else {


		var count = div(model.timeLength, model.timeStep);
		for (var i = 0; i <= count; i++) {
			simulate.displayInformation.times.push(plus(model.timeStart, mult(model.timeStep, new Material(i))).value);
		}


		var oldSuccess = config.onSuccess;
		config.onSuccess = function(res) {
			updateDisplayed(null);

			simulate.resultsWindow.results = formatSimResults(simulate.results);

			//simulate.tasks.print()

			oldSuccess ? oldSuccess(res) : null;
		}

		config.onCompletedFirstPass = function() {
			if(config.resultsWindow){
				//console.log("foo")

				config.resultsWindow.displayInformation.store.suspendEvents();
				config.resultsWindow.displayInformation.store.maxLoaded = -1

				config.resultsWindow.displayInformation.store.clearFilter();

				config.resultsWindow.displayInformation.store.removeAll();

				simulate.displayInformation = config.resultsWindow.displayInformation;

				var scripter = config.resultsWindow.displayInformation.scripter;

				scripter.simulator = simulate;

				scripter.playBut.setGlyph(0xf04c);
				scripter.combo.setValue(-1);
				scripter.time = 0;
				scripter.timeIndex = 0;
				scripter.isFinished = false;
				scripter.updatingSlider = true;
				scripter.slider.setValue(scripter.minTime);
				scripter.updatingSlider = false;

				//console.log("Changed")
				scripter.advanceTimer();
				//console.log("Changed 2")

				config.resultsWindow.displayInformation.store.resumeEvents();
				//window.x = config.resultsWindow.displayInformation.store;

				clearInterval(scripter.animInter);
				scripter.animInter = setInterval(function() {
					scripter.advanceTimer()
				}, 200);


				for (var i = 0; i < simulate.displayInformation.origIds.length; i++) {

					var id = simulate.displayInformation.origIds[i];
					var object = simulate.displayInformation.objects[i];
					var dna = object.dna;

					if (dna.type == "Agents") {
						simulate.results[id].states = object.stateIds;

						simulate.displayInformation.agents[id.toString()].data = simulate.results[id].data;
						simulate.displayInformation.agents[id.toString()].results = simulate.results[id].results;


					} else if ((simulate.results.data[0][id] instanceof Vector) && simulate.results.data[0][id].names) {

						var names = simulate.results.data[0][id].fullNames();

						simulate.results[id].indexedFullNames = names.slice();
						for (var j = 0; j < names.length; j++) {
							names[j] = names[j].join(", ");
						}
						simulate.results[id].indexedNames = names;

					}
				}

			}else{
				simulate.displayInformation.colors = [];
				simulate.displayInformation.headers = [];
				simulate.displayInformation.agents = [];
				simulate.displayInformation.displayedHeaders = [];
				simulate.displayInformation.displayedIds = [];
				simulate.displayInformation.renderers = [];
				simulate.displayInformation.elementIds = [];
				simulate.displayInformation.res = simulate.results;

				var ids = [];

				simulate.displayInformation.origIds = simulate.displayInformation.ids.slice();
				for (var i = 0; i < simulate.displayInformation.origIds.length; i++) {
					var id = simulate.displayInformation.origIds[i];
					var object = simulate.displayInformation.objects[i];
					var dna = object.dna;

					simulate.displayInformation.displayedIds.push(id);
					simulate.displayInformation.displayedHeaders.push(dna.name);

					//console.log(simulate.results);

					if (dna.type == "Agents") {
						var states = object.stateIds;

						simulate.results[id].states = states;

						for (var j = 0; j < states.length; j++) {
							var innerItem = findID(states[j]);
							ids.push(id);
							simulate.displayInformation.elementIds.push("e" + id + "-" + states[j]);
							simulate.displayInformation.headers.push(getName(innerItem));
							simulate.displayInformation.colors.push(getLineColor(innerItem));
							if (simulate.results[id].dataMode == "float") {
								simulate.displayInformation.renderers.push(commaStr);
							} else if (simulate.results[id].dataMode == "agents") {
								simulate.displayInformation.renderers.push(function(x) {
									return x;
								});
							} else {
								simulate.displayInformation.renderers.push(undefined);
							}
						}

						//console.log("--")
						//console.log(simulate.results[id].results);

						simulate.displayInformation.agents[id.toString()] = {
							id: id,
							item: dna.cell,
							data: simulate.results[id].data,
							results: simulate.results[id].results
						};


					} else if ((simulate.results.data[0][id] instanceof Vector) && simulate.results.data[0][id].names) {

						var col = getLineColor(dna.cell);

						var names = simulate.results.data[0][id].fullNames();

						simulate.results[id].indexedFullNames = names.slice();
						for (var j = 0; j < names.length; j++) {
							names[j] = names[j].join(", ");
						}
						simulate.results[id].indexedNames = names;

						for (var j = 0; j < names.length; j++) {
							ids.push(id);
							simulate.displayInformation.elementIds.push("e" + id + "-" + j);
							simulate.displayInformation.headers.push(dna.name + " (" + names[j] + ")");
							simulate.displayInformation.colors.push(col);
							simulate.displayInformation.renderers.push(commaStr);
						}

					} else {
						ids.push(id)
						simulate.displayInformation.elementIds.push("e" + id);
						simulate.displayInformation.headers.push(dna.name);
						simulate.displayInformation.colors.push(getLineColor(dna.cell));
						if (simulate.results[id].dataMode == "float") {
							simulate.displayInformation.renderers.push(commaStr);
						} else {
							simulate.displayInformation.renderers.push(undefined);
						}
					}

				}

				var storeFields = [{
					type: "float",
					name: "Time"
				}, {
					type: "int",
					name: "id"
				}];

				for (var i = 0; i < simulate.displayInformation.elementIds.length; i++) {
					storeFields.push({
						type: 'auto',
						name: simulate.displayInformation.elementIds[i],
						defaultValue: undefined
					});
				}


				simulate.displayInformation.store = new Ext.data.Store({
					fields: storeFields,
					data: undefined
				});
				simulate.displayInformation.store.maxLoaded = -1;
				simulate.displayInformation.ids = ids;
			}



		}



		var oldStep = config.onStep;
		config.onStep = function(solver) {

			// See if we should sleep to let the main UI update

			var updated = false;
			var progress = simulate.progress();


			if (!simulate.shouldSleep) {
				var timeTaken = new Date().getTime() - simulate.wakeUpTime;

				if (((!simulate.resultsWindow) && timeTaken > 100) || timeTaken > 600) {

					updateDisplayed(solver);
					updated = true;


					simulate.timer = setTimeout(function() {
						simulate.resume();
					}, 20);

					simulate.sleep();
				}
			}

			if (progress == 1 && !updated) {
				updateDisplayed(solver);
			}

			// Call any user defined step function

			oldStep ? oldStep(solver) : null;
		}

		var oldError = config.onError;
		config.onError = function(res) {

			try {
				for (var solver in simulate.model.solvers) {
					updateDisplayed(simulate.model.solvers[solver]);
				}
			} catch (err) {

			}

			if (simulate.resultsWindow) {
				simulate.resultsWindow.scripter.pause(false);
				simulate.resultsWindow.scripter.finished();
			}

			oldError ? oldError(res) : null;
		}

		simulate.run(config);
	}


}

function formatSimResults(res) {
	var makeMap = function(returnNonVecs){
		return function(x){
			if(x instanceof Vector){
				if(x.names){
					var r = {};
					for(var i = 0; i < x.names.length; i++){
						r[x.names[i]] = vecMap(x.items[i]);
					}
					return r;
				}else{
					return x.items.slice().map(vecMap);
				}
			}else{
				if(returnNonVecs){
					return x;
				}else{
					return undefined;
				}
			}
		}
	}

	var vecMap = makeMap(true);

	res = deepClone({}, res, 3, makeMap(false));

	if (isUndefined(res.error)) {
		res.error = "none";
		res.errorPrimitive = null;
	}
	res.names = {};
	var items = model.submodels["base"].agents[0].children;
	for (var i = 0; i < items.length; i++) {
		res.names[items[i].name] = items[i].id;
	}
	res.value = function(item) {
		return this[item.id].results;
	};
	res.lastValue = function(item) {
		return this[item.id].results[this[item.id].results.length - 1];
	};
	if (res.Time) {
		res.periods = res.Time.length;
		res.times = res.Time;
	}

	return res;
}

function createUnitStore(u) {
	if ((!u) || u.trim() == "" || u.trim().toLowerCase() == "unitless") {
		return undefined;
	}
	return simpleEquation("{1 " + u + "}").units;
}

function simpleEquation(eq, scope, primitiveBank, tree) {
	if (!scope) {
		scope = {};
	}
	if (!primitiveBank) {
		primitiveBank = {};
	}
	if (!tree) {
		tree = trimTree(createTree(eq), primitiveBank);
	}

	var res = evaluateTree(tree, scope);

	return res;
}

function simpleNum(mat, units) {
	if (mat instanceof Vector) {
		return new Vector(mat.items.map(function(x) {
			return simpleNum(x, units);
		}));
	}

	if ((!units) && (mat.units)) {
		throw (getText("The result of the calculation has units %s, but no units are specified for the calculation. Please set the units for the calculation so we can determine the proper output.", mat.units.toString()));
	}

	if (!mat.units) {
		return 0 + mat.value;
	} else {

		mat.units.addBase();
		units.addBase();

		return 0 + fn["*"](mat.value, fn["/"](sn("#e" + mat.units.toBase), units.toBase));
	}

}

function simpleUnitsTest(mat, units, primitive, showEditor) {
	if (mat instanceof Vector) {
		return new Vector(mat.items.map(function(x) {
			return simpleUnitsTest(x, units, primitive, showEditor);
		}));
	}


	if ((!mat.units) && (!units)) {
		return mat;
	} else if ((!mat.units)) {
		mat.units = units;
		return mat;
	} else if (mat.units === units) {
		return mat;
	} else {
		var scale = convertUnits(mat.units, units, false); //XXX fixme true
		if (scale == 0) {
			if (isLocal()) {
				console.log(mat.units);
				console.log(units);
			}
			throw {
				msg: getText("Wrong units generated. Expected %s, and got %s.", "<i>" + clean(units ? units.toString() : "unitless") + "</i>", "<i>" + clean(mat.units ? mat.units.toString() : "unitless") + "</i>"),
				primitive: primitive,
				showEditor: showEditor
			};
		} else {
			//console.log("----+")
			mat.value = mat.value * scale;
			mat.units = units;
			return mat;
		}
	}
}


function handleErrorObject(err) {

	if (isLocal()) {
		console.log(err);
		if (console.trace) {
			console.trace();
		}
	}
	if (err.msg) {
		if (isDefined(err.primitive)) {
			var cell = findID(err.primitive.id)
			highlight(cell);
			if (err.showEditor) {
				//console.log( err);
				showEditor(cell, [{
					type: "error",
					row: (err.line !== undefined) ? (err.line - 1) : (evaluatingLine - 1),
					text: err.details ? err.details : "Error"
				}]);
			}
		}
		mxUtils.alert(err.msg);
	} else if (err.error) {
		mxUtils.alert(err);
	} else {
		mxUtils.alert(getText("An unknown model simulation error occurred. Please report this issue to the Insight Maker team."));
	}
}

function evaluateMacros(macros) {
	evaluateTree(trimTree(createTree(macros), {}), varBank);
}

function DNA(cell, id) {
	this.type = cell.value.nodeName;
	this.cell = cell;
	id = id || cell.id;
	var x = parseInt(cell.id, 10);
	if (x == cell.id) {
		this.id = x;
	} else {
		this.id = id;
	}
	this.name = cell.getAttribute("name");
	this.units = null;

}

function getDNA(cell, solvers) {
	var dna = new DNA(cell);
	dna.solver = folderSolvers(cell, solvers);
	if(cell){
		var p = getParent(cell);
		if(p){
			dna.frozen = isTrue(getFrozen(p));
		}
	}

	if (dna.type === "Variable" || dna.type == "Flow") {
		if (isTrue(cell.getAttribute("ShowSlider"))) {
			dna.slider = true;
		}
	}

	if (dna.type == "Flow" || dna.type == "Transition") {
		if (cell.target !== null) {
			dna.targetId = orig(cell.target).id;
		}
		if (cell.source !== null) {
			dna.sourceId = orig(cell.source).id;
		}
	}

	if (dna.type == "Converter") {
		dna.value = getValue(cell);
	} else {
		try {
			dna.value = createTree(getValue(cell));
		} catch (err) {
			if (isLocal()) {
				//console.log(this);
				//console.log(eq);
				//console.log(neighborhood);
				console.log(err);
			}
			var msg = getText("The primitive %s has an equation error that must be corrected before the model can be run.", "<i>[" + clean(dna.name) + "]</i>");
			if (err.substr && err.substr(0, 4) == "MSG:") {
				msg += "<br/><br/>" + err.toString().substr(4);
			}

			var l = undefined;
			if (err.match && err.match(/line (\d+)/i)) {
				l = err.match(/line (\d+)/i)[1];
			}

			error(msg, cell, true, l, err.match ? err : undefined);

		}
	}


	if (dna.type == "Action") {
		dna.trigger = cell.getAttribute("Trigger");
		dna.repeat = isTrue(cell.getAttribute("Repeat"));
		dna.recalculate = isTrue(cell.getAttribute("Recalculate")) || dna.trigger == "Condition";
		try {
			dna.triggerValue = createTree(""+cell.getAttribute("Value"));
		} catch (err) {
			var msg = getText("The trigger for %s has an equation error that must be corrected before the model can be run.", "<i>[" + clean(dna.name) + "]</i>");
			if (err.substr && err.substr(0, 4) == "MSG:") {
				msg += "<br/><br/>" + err.toString().substr(4);
			}
			error(msg, dna.cell, false, l);
		}
	} else if (dna.type == "Transition") {
		dna.trigger = cell.getAttribute("Trigger");
		dna.repeat = isTrue(cell.getAttribute("Repeat"));
		dna.recalculate = isTrue(cell.getAttribute("Recalculate")) || dna.trigger == "Condition";
	} else if (dna.type == "State") {
		if (isUndefined(cell.getAttribute("Residency")) || cell.getAttribute("Residency").trim() == "") {
			dna.residency = null;
		} else {
			try {
				dna.residency = evaluateTree(trimTree(createTree(cell.getAttribute("Residency")), {}));
				if (!dna.residency.units) {
					dna.residency.units = simulate.timeUnits;
				}
				if (eq(dna.residency, new Material(0, simulate.timeUnits))) {
					dna.residency = null;
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}

				throw ({
					msg: getText("Invalid state residency."),
					primitive: cell,
					showEditor: false
				});
			}
		}
	} else if (dna.type == "Stock") {
		dna.nonNegative = isTrue(cell.getAttribute("NonNegative"));
		if (cell.getAttribute("StockMode") == "Conveyor") {
			dna.stockType = "Conveyor";
			try {
				dna.delay = evaluateTree(trimTree(createTree(cell.getAttribute("Delay")), {}));
				if (!dna.delay.units) {
					dna.delay.units = simulate.timeUnits;
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}

				throw ({
					msg: getText("Invalid stock delay."),
					primitive: cell,
					showEditor: false
				});
			}
		}
	} else if (dna.type == "Flow") {
		dna.onlyPositive = isTrue(cell.getAttribute("OnlyPositive"));
	} else if (dna.type == "Converter") {
		dna.source = cell.getAttribute("Source");
		dna.interpolation = cell.getAttribute("Interpolation") == "Linear" ? "linear" : "discrete";


		if (isUndefined(cell.getAttribute("Data")) || cell.getAttribute("Data").trim() == "") {

			throw ({
				msg: getText("The converter %s does not have any data.", "<i>" + clean(dna.name) + "</i>"),
				primitive: cell,
				showEditor: true
			});
		}

		var data = cell.getAttribute("Data").split(";");


		var inp = [];
		var out = [];
		var myU;
		if (dna.source == "Time") {
			myU = simulate.timeUnits;
		} else {
			myU = createUnitStore(orig(findID(dna.source)).getAttribute("Units"));
		}
		for (var i = 0; i < data.length; i++) {
			var b = data[i].split(",");
			inp.push(new Material(sn(b[0].trim()), myU));
			out.push(new Material(sn(b[1].trim())));
		}
		dna.inputs = inp;
		dna.outputs = out;
	}

	if (dna.type != "State") {
		if (dna.type != "Transition" && dna.type != "Action") {
			var u = cell.getAttribute("Units");
			try {
				if (dna.type != "Flow" || (u && u.trim() != "" && u.trim().toLowerCase() != "unitless")) {
					dna.units = createUnitStore(u);
				} else {
					dna.units = getUnitStore([timeUnits], [-1]);
					dna.flowUnitless = true;
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				throw {
					msg: getText("Invalid units specified for primitive: \"%s\".", clean(u)),
					primitive: cell,
					showEditor: true
				};

			}
		} else {
			if (dna.trigger == "Timeout") {
				dna.units = simulate.timeUnits;
			}
		}
		dna.maxConstraint = cell.getAttribute("MaxConstraint");
		dna.maxConstraintType = isTrue(cell.getAttribute("MaxConstraintUsed")) ? 1 : null;
		dna.minConstraint = cell.getAttribute("MinConstraint");
		dna.minConstraintType = isTrue(cell.getAttribute("MinConstraintUsed")) ? 1 : null;

	}

	if (dna.units) {
		dna.units.addBase();
		dna.toBase = dna.units.toBase;
	} else {
		dna.toBase = 1;
	}

	dna.unitless = !dna.units;

	return dna;
}

function folderSolvers(cell, solvers) {
	if ((!cell) || cell == null) {
		return solvers.base;
	}
	if (cell.value.nodeName == "Agents") {
		//console.log("AGENTS")
		var x = cell.getAttribute("Agent");
		//console.log(x)
		if (solvers[x]) {
			//console.log("SET!")
			//console.log(solvers[x])
			return solvers[x];
		}
	}

	var p = getParent(cell);
	if (p && solvers[p.id]) {
		return solvers[p.id];
	}

	return folderSolvers(p, solvers);
}


function decodeDNA(dna, agent) {
	var type = dna.type;
	var x;
	if (type == "Variable") {
		x = new Variable();
	} else if (type == "State") {
		x = new State();
	} else if (type == "Transition") {
		x = new Transition();
	} else if (type == "Action") {
		x = new Action();
	} else if (type == "Stock") {
		x = new Stock();
	} else if (type == "Flow") {
		x = new Flow();
	} else if (type == "Converter") {
		x = new Converter();
	}

	if (x) {
		x.dna = dna;
		x.id = dna.id;
		x.index = agent.index;
		x.agentId = agent.agentId;
		x.container = agent;
		x.createIds();

		x.frozen = dna.frozen;

		agent.children.push(x);
		agent.childrenId[x.id] = x;

		if (dna.slider) {
			if (simulate.sliders[dna.id]) {
				simulate.sliders[dna.id].push(x);
			} else {
				simulate.sliders[dna.id] = [x];
			}
		}


		if (x instanceof Action) {
			dna.solver.actions.push(x);
		} else if (x instanceof Transition) {
			dna.solver.transitions.push(x);
		} else if (!(x instanceof Agents)) {
			dna.solver.valued.push(x)
			if (x instanceof Flow) {
				dna.solver.flows.push(x);
			} else if (x instanceof Stock) {
				dna.solver.stocks.push(x);
			} else if (x instanceof State) {
				dna.solver.states.push(x);
			}
		}
	} else if (type == "Agents") {
		agent.children.push(dna.agents);
		agent.childrenId[dna.id] = dna;
	}

}

function linkPrimitive(primitive, dna) {
	var type = dna.type;
	//console.log("--"+dna.name);
	if (type != "Agents") {
		var myNeighborhood = getPrimitiveNeighborhood(primitive, dna);

		if (type == "Flow" || type == "Transition") {
			var alpha = null,
				omega = null;

			if (myNeighborhood["alpha"]) {
				alpha = myNeighborhood["alpha"];
			}

			if (myNeighborhood["omega"]) {
				omega = myNeighborhood["omega"];
			}

			primitive.setEnds(alpha, omega);
		}

		if (type == "Action") {
			//console.log(myNeighborhood);
			try {
				primitive.equation = trimTree(dna.triggerValue, myNeighborhood);
			} catch (err) {
				var msg = getText("The primitive %s has an equation error that must be corrected before the model can be run.", "<i>[" + clean(dna.name) + "]</i>");
				if (err.substr && err.substr(0, 4) == "MSG:") {
					msg += "<br/><br/>" + err.toString().substr(4);
				}
				error(msg, dna.cell, false, l);
			}
			try {
				primitive.action = trimTree(dna.value, myNeighborhood);
			} catch (err) {
				var msg = getText("The primitive %s has an equation error that must be corrected before the model can be run.", "<i>[" + clean(dna.name) + "]</i>");
				if (err.substr && err.substr(0, 4) == "MSG:") {
					msg += "<br/><br/>" + err.toString().substr(4);
				}
				var l = undefined;
				if (err.match && err.match(/line (\d+)/i)) {
					l = err.match(/line (\d+)/i)[1]
				}
				error(msg, dna.cell, true, l, err.match ? err : undefined);
			}
			//primitive.resetTimer();
		} else if (type == "Converter") {
			if (dna.source == "Time") {
				primitive.setSource("*time");
			} else {
				var source = orig(findID(dna.source)).id;
				var sourceSet = false;
				for (var neighbor in myNeighborhood) {
					if (source == myNeighborhood[neighbor].id) {
						primitive.setSource(myNeighborhood[neighbor]);
						sourceSet = true;
						break;
					}
				}

				if(! sourceSet){
					error("Converter source could not be found. Please redefine it.", dna.cell, false);
				}


			}
		} else {
			//console.log("setting: "+dna.name);
			//console.log(dna.value);
			primitive.setEquation(dna.value, myNeighborhood);
		}
	}
}

function setAgentInitialValues(agent) {

	for (var i = 0; i < agent.children.length; i++) {
		if (agent.children[i] instanceof Stock) {
			agent.children[i].setDelay();
			try {
				agent.children[i].setInitialValue();
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				if (err instanceof String) {
					error(err.substr(4, err.length), agent.children[i], true);
				} else {
					throw err;
				}
			}
		} else if (agent.children[i] instanceof State) {
			try {
				if (agent.children[i].active === null) {
					agent.children[i].setInitialActive(true);
				}
			} catch (err) {
				if (isLocal()) {
					console.log(err);
				}
				if (err instanceof String) {
					error(err.substr(4, err.length), agent.children[i], true);
				} else {
					throw err;
				}
			}
		}
	}

}

function buildNetwork(submodel) {
	if (submodel.network == "Custom Function") {
		var hood = getPrimitiveNeighborhood(submodel, submodel.dna);
		var tree = trimTree(createTree(submodel.networkFunction), hood);
		for (var i = 0; i < submodel.agents.length - 1; i++) {
			for (var j = i + 1; j < submodel.agents.length; j++) {
				if (trueValue(simpleEquation(submodel.networkFunction, {
					"-parent": varBank,
					"a": submodel.agents[i],
					"b": submodel.agents[j]
				}, hood, tree))) {
					submodel.agents[i].connect(submodel.agents[j]);
				}
			}
		}
	} else if (submodel.network == "None") {
		//nothing to do
	} else {
		throw {
			msg: "Unknown network type: " + submodel.network + ".",
			primitive: submodel.cell,
			showEditor: false
		};
	}
}

function buildPlacements(submodel, items) {
	var tree;
	var wCount, hCount;


	if (submodel.placement == "Random") {
		submodel.agents.forEach(function(s) {
			s.location = new Vector([mult(submodel.geoWidth, new Material(Rand())), mult(submodel.geoHeight, new Material(Rand()))], ['x', 'y']);
		});
	} else if (submodel.placement == "Custom Function") {
		submodel.agents.forEach(function(s) {
			var n = getPrimitiveNeighborhood(submodel, submodel.dna);
			n.self = s;
			s.location = simpleUnitsTest(simpleEquation(submodel.placementFunction, {
				"-parent": varBank,
				"self": s
			}, n), submodel.geoDimUnitsObject);
			if (!s.location.names) {
				s.location.names = ['x', 'y'];
				s.location.namesLC = ['x', 'y'];
			}
		});
	} else if (submodel.placement == "Grid") {
		tree = trimTree(createTree("{x: x*width(self), y: y*height(self)}"), {});
		var size = submodel.agents.length;
		var ratio = simpleNum(simpleEquation("width(self)/height(self)", {
			"-parent": varBank,
			"self": submodel
		}, {}), submodel.geoDimUnitsObject);
		//console.log(ratio)
		hCount = Math.sqrt(size / ratio);
		wCount = Math.floor(hCount * ratio);

		hCount = Math.ceil(hCount);
		if (!hCount * wCount >= size) {
			wCount = wCount + 1
		}

		var j = 0;
		submodel.agents.forEach(function(s) {
			var xPos = ((j % wCount) + 0.5) / wCount;
			var yPos = (Math.floor(j / wCount) + 0.5) / hCount;
			s.location = simpleUnitsTest(simpleEquation("{x: x*width(self), y: y*height(self)}", {
				"self": s,
				"x": new Material(xPos),
				"y": new Material(yPos),
				"-parent": varBank
			}, {}, tree), submodel.geoDimUnitsObject);
			j++;
		});
	} else if (submodel.placement == "Ellipse") {
		tree = trimTree(createTree("{width(self), height(self)}/2+{sin(index(self)/size*2*3.14159), cos(index(self)/size*2*3.14159)}*{width(self), height(self)}/2"), {});
		var size = new Material(submodel.agents.length);
		submodel.agents.forEach(function(s) {
			s.location = simpleUnitsTest(simpleEquation("{width(self), height(self)}/2+{sin(index(self)/size*2*3.14159), cos(index(self)/size*2*3.14159)}*{width(self), heigh(self)}/2", {
				"self": s,
				"size": size,
				"-parent": varBank
			}, {}, tree), submodel.geoDimUnitsObject);
		});
	} else if (submodel.placement == "Network") {
		tree = trimTree(createTree("{x: x*width(self), y: y*height(self)}"), {});

		var graph = new Graph();

		var nodes = submodel.agents.map(function(s) {
			return graph.newNode({
				data: s
			});
		});
		var getNode = function(item) {
			for (var i = 0; i < nodes.length; i++) {

				if (nodes[i].data.data === item) {
					return nodes[i];
				}
			}
			return null;
		}
		submodel.agents.forEach(function(a) {
			a.connected.forEach(function(target) {
				graph.newEdge(getNode(a), getNode(target));
			});
		});
		//console.log("ZZ");
		var layout = new Layout.ForceDirected(graph, 400.0, 600.0, 0.5);

		for (var i = 0; i < 60; i++) {
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
		bb.width = bb.topright.x - bb.bottomleft.x;
		bb.height = bb.topright.y - bb.bottomleft.y;
		//console.log(bb);
		var scalePoint = function(p) {
			return {
				x: (p.x - bb.bottomleft.x) / bb.width,
				y: (p.y - bb.bottomleft.y) / bb.height
			};
		}

		layout.eachNode(function(node, point) {
			var p = scalePoint(point.p);
			//console.log(scalePoint(p));
			node.data.data.location = simpleUnitsTest(simpleEquation("{x: x*width(self), y: y*height(self)}", {
				"self": submodel,
				"x": new Material(p.x),
				"y": new Material(p.y),
				"-parent": varBank
			}, {}, tree), submodel.geoDimUnitsObject);
		});
		//console.log("done");

	} else {
		throw {
			msg: "Unknown placement type: " + submodel.placement + ".",
			primitive: submodel.cell,
			showEditor: false
		};
	}

}


var allPlaceholders = {};

function getPrimitiveNeighborhood(primitive, dna) {

	var neighbors = neighborhood(dna.cell);
	var placeholders = allPlaceholders[dna.id] ? allPlaceholders[dna.id] : {};

	var hood = {
		self: primitive
	};

	/*console.log("----");
	console.log(dna.name);
	console.log(neighbors)*/

	if (!neighbors.placeholders) {
		if (dna.type == "Agents") {
			for (var i = 0; i < primitive.DNAs.length; i++) {
				placeholders[primitive.DNAs[i].name.toLowerCase()] = new Placeholder(primitive.DNAs[i], primitive);
			}
		}
	}

	for (var k = 0; k < neighbors.length; k++) {
		var item = neighbors[k].item;
		if (item.value.nodeName == "Agents") {
			hood[model.submodels[item.id].dna.name.toLowerCase()] = model.submodels[item.id];
			if (!neighbors.placeholders) {
				for (var i = 0; i < model.submodels[item.id].DNAs.length; i++) {
					hood[model.submodels[item.id].DNAs[i].name.toLowerCase()] = new Placeholder(model.submodels[item.id].DNAs[i], primitive);
				}
			}
		} else if(neighbors[k].type != "agent"){



			var found = false;
			if (primitive.container) {
				if (primitive.container.childrenId[item.id]) {
					var hoodName = primitive.container.childrenId[item.id].dna.name.toLowerCase();
					//while(hood[hoodName]){
					//hoodName += ".extra";
					//}
					hood[hoodName] = primitive.container.childrenId[item.id];
					found = true;
				}
			}
			if (!found) {
				if (model.submodels["base"]["agents"][0].childrenId[item.id]) {
					var hoodName = model.submodels["base"]["agents"][0].childrenId[item.id].dna.name.toLowerCase();
					//while(hood[hoodName]){
					//	hoodName += ".extra";
					//}
					hood[hoodName] = model.submodels["base"]["agents"][0].childrenId[item.id];
					found = true;
				}
			}


			if ((!found) && (dna.type == "Flow" || dna.type == "Transition") && item == findID(item.id)) {

				error(dna.type + " primitives may not cross agent boundaries.", dna.cell, false);
			}

			if (dna.type == "Flow" || dna.type == "Transition") {

				if (hood[hoodName]) {
					if (dna.targetId == hood[hoodName].id) {
						hood["omega"] = hood[hoodName];
					} else if (dna.sourceId == hood[hoodName].id) {
						hood["alpha"] = hood[hoodName];
					}
				}
			}
		}
	}


	var keys = Object.keys(placeholders);
	for (var i = 0; i < keys.length; i++) {
		hood[keys[i]] = placeholders[keys[i]];
	}
	allPlaceholders[dna.id] = placeholders;

	//console.log(hood);

	return hood;
}

function modelType(type) {
	return !(type == "Link" || type == "Picture" || type == "Text" || type == "Button" || type == "Folder" || type == "Setting" || type == "Display" || type == "Ghost");
}

function updateDisplayed(solver) {
	var displayed = solver ? solver.displayed : [];

	if (simulate.displayInformation.store) {
		if (displayed.length > 0) {
			var storeData = [];
			var maxTime = solver.maxLoaded;
			maxTime = isDefined(maxTime) ? (maxTime + 1) : 0;
			var maxInData = solver.maxLoaded;
			for (var k = maxTime; k < simulate.results.Time.length; k++) {
				var inStore = simulate.displayInformation.store.getById(k);
				var d = {};
				if (!inStore) {
					d["id"] = k;
					d["Time"] = simulate.results["Time"][k];
				}
				//console.log("--");
				//console.log(solver);
				//console.log(displayed.length);
				//console.log(d.Time+" -"+k)

				if (isUndefined(simulate.results.data[k][displayed[0].id])) {
					//continue;
				} else {
					maxInData = k;
					for (var j = 0; j < displayed.length; j++) {

						//console.log(displayed[j].id)
						var i = simulate.displayInformation.ids.indexOf(displayed[j].id);

						if (i > -1) {
							if (simulate.results[simulate.displayInformation.ids[i]].states) {
								var states = simulate.results[simulate.displayInformation.ids[i]].states;

								//console.log("--")
								//console.log(k);
								//console.log(displayed[j].id)
								//console.log(simulate.results.data);
								if (simulate.results.data[k][displayed[j].id]) {
									var current = simulate.results.data[k][displayed[j].id].current;

									var tally = {};
									for (var q = 0; q < current.length; q++) {
										if (current[q].state) {
											for (var s = 0; s < current[q].state.length; s++) {
												tally[current[q].state[s].id.toString()] = (tally[current[q].state[s].id.toString()] + 1) || 1;
											}
										}
									}

									for (var q = 0; q < states.length; q++) {
										d[simulate.displayInformation.elementIds[i + q]] = tally[states[q]] || 0;
									}
								}
							} else if (simulate.results[simulate.displayInformation.ids[i]].indexedNames) {
								var z = 0;
								while (i < simulate.displayInformation.ids.length && simulate.displayInformation.ids[i] == displayed[j].id) {
									try {
										d[simulate.displayInformation.elementIds[i]] = selectFromMatrix(simulate.results.data[k][displayed[j].id].fullClone(), simulate.results[simulate.displayInformation.ids[i]].indexedFullNames[z].slice());
									} catch (err) {
										throw ({
											msg: getText("Cannot change vector keys during a simulation."),
											primitive: displayed[j].dna.cell,
											showEditor: true
										});

									}

									z++;
									i++;
								}

							} else {
								/*console.log("--")
								console.log(d);
								console.log(simulate.displayInformation.elementIds);
								console.log(i);
								console.log(simulate.results.data);
								console.log(k);
								console.log(displayed[j].id)*/
								d[simulate.displayInformation.elementIds[i]] = simulate.results.data[k][displayed[j].id];
							}
						}
					}
				}

				if (inStore) {
					inStore.set(d);
					inStore.commit();
				} else {
					storeData.push(d);
				}
			}
			solver.maxLoaded = maxInData;
			simulate.displayInformation.store.maxLoaded = Math.max(simulate.displayInformation.store.maxLoaded, solver.maxLoaded)

			//console.log(storeData)

			simulate.displayInformation.store.suspendEvents();
			simulate.displayInformation.store.add(storeData);
			simulate.displayInformation.store.resumeEvents();
			simulate.displayInformation.store.filter();
		}
		//window.store = simulate.displayInformation.store;

		if (!simulate.resultsWindow) {
			simulate.resultsWindow = createResultsWindow(simulate.displayInformation, simulate.config);


			simulate.resultsWindow.scripter.loadTime(0);

			var period = (simulate.resultsWindow.scripter.combo.getValue() == -1) ? 200 : 100 / Math.min(0.5, simulate.resultsWindow.scripter.combo.getValue());

			var s = simulate.resultsWindow.scripter;
			simulate.resultsWindow.scripter.animInter = setInterval(function() {
				s.advanceTimer()
			}, period);
		}

		simulate.resultsWindow.sliders = simulate.sliders;

		if (k == simulate.displayInformation.times.length) {
			simulate.resultsWindow.scripter.finished();
		}
	}
}
