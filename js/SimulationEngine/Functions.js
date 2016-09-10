"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


var AgentBase;
var AgentObject = {} ;

var PrimitiveBase;
var PrimitiveObject = {} ;

functionLoaders.push(function(){
	

	defineFunction("Stop", {params:[]}, function(x) {
		throw {
			msg: "STOP"
		};
	});
	
	defineFunction("Pause", {params:[]}, function(x) {
		simulate.sleep(true);
		return new Material(0);
	});

	defineFunction("Time", {params:[]}, function(x) {
		return simulate.time().fullClone();
	});

	defineFunction("TimeStep", {params:[]}, function(x) {
		return simulate.timeStep.fullClone();
	});

	defineFunction("TimeLength", {params:[]}, function(x) {
		return simulate.timeLength.fullClone();
	});

	defineFunction("TimeStart", {params:[]}, function(x) {
		return simulate.timeStart.fullClone();
	});

	defineFunction("TimeEnd", {params:[]}, function(x) {
		return simulate.timeEnd.fullClone();
	});

	defineFunction("Seconds", { params:[{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["seconds"],[-1])));
	});

	defineFunction("Minutes", { params:[{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["minutes"],[-1])));
	});

	defineFunction("Hours", { params:[{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["hours"],[-1])));
	});

	defineFunction("Days", { params:[{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["days"],[-1])));
	});

	defineFunction("Weeks", { params:[{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["weeks"],[-1])));
	});

	defineFunction("Months", { params: [{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["months"],[-1])));
	});

	defineFunction("Years", {params: [{name: "Value", defaultVal: "time", vectorize: true}]}, function(x) {
		var item;
		if (x.length == 0) {
			item = simulate.time().fullClone();
		} else {
			item = x[0].toNum();
		}
		return mult(item, new Material(1, getUnitStore(["years"],[-1])));
	});
	
	defineFunction("Seasonal", {params: [{name: "Peak", defaultVal: "0", vectorize: true}]}, function(x){
		var peak;
		if(x.length == 0){
			peak = new Material(0,  simulate.timeUnits);
		}else{
			peak = x[0].fullClone();
			if(! peak.units){
				peak.units = simulate.timeUnits;
			}
		}
		var position = minus(functionBank["time"]([]), peak);
		var dist = position.forceUnits(createUnitStore("years")).value * 2 * 3.14159265359;
		return new Material(Math.cos(dist));
	});

	defineFunction("Unitless", { params:[{name: "Value",  noVector: true}]}, function(x) {
		return new Material(x[0].toNum().value);
	});

	defineFunction("PastMean", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {
		if (x.length == 1) {
			return functionBank["mean"](x[0].getPastValues());
		} else {
			return functionBank["mean"](x[0].getPastValues(x[1].toNum()));
		}
	});

	defineFunction("PastMedian", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {
	
		if (x.length == 1) {
			return functionBank["median"](x[0].getPastValues());
		} else {
			return functionBank["median"](x[0].getPastValues(x[1].toNum()));
		}
	});

	defineFunction("PastValues", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {
	
		var items;
		if (x.length == 1) {
			items = x[0].getPastValues();
		} else {
			items = x[0].getPastValues(x[1].toNum());
		}
		return new Vector(items);
	});

	defineFunction("PastStdDev", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {

		var items;
		if (x.length == 1) {
			items = x[0].getPastValues();
		} else {
			items = x[0].getPastValues(x[1].toNum());
		}
		if (items.length > 1) {
			return functionBank["stddev"](items);
		} else {
			return new Material(0);
		}
	});

	defineFunction("PastCorrelation", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "[Primitive]",  noVector: true, needPrimitive:true, object: [functionBank, PrimitiveObject]}, {name: "Past Range", vectorize: true, defaultVal: "All Time"}]}, function(x) {
		var items1;
		var items2;
		if (x[2] != "All Time") {
			items1 = x[0].getPastValues();
			items2 = x[1].getPastValues();
		} else {
			items1 = x[0].getPastValues(x[2].toNum());
			items2 = x[1].getPastValues(x[2].toNum());
		}

		if (items1.length > 1) {
			return functionBank["correlation"]([new Vector(items1), new Vector(items2)]);
		} else {
			return new Material(0);
		}
	});

	defineFunction("PastMax", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {

		if (x.length == 1) {
			return functionBank["max"](x[0].getPastValues());
		} else {
			return functionBank["max"](x[0].getPastValues(x[1].toNum()));
		}
	});

	defineFunction("PastMin", {object: [functionBank, PrimitiveObject], params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", vectorize: true}]}, function(x) {

		if (x.length == 1) {
			return functionBank["min"](x[0].getPastValues());
		} else {
			return functionBank["min"](x[0].getPastValues(x[1].toNum()));
		}
	});

	defineFunction("Pulse", { params:[{name: "Start Time",  vectorize: true}, {name: "Height",  vectorize: true, defaultVal: 1}, {name: "Width",  vectorize: true, defaultVal: 0}, {name: "Repeat Period",  vectorize: true, defaultVal: 0}]}, function(x) {

		var start = x[0].toNum();
		var height = new Material(1);
		var width = new Material(0);
		var repeat = new Material(0);

		if (x.length > 1) {
			height = x[1].toNum();
			if (x.length > 2) {
				width = x[2].toNum();
				if (x.length > 3) {
					repeat = x[3].toNum();
				}
			}
		}
		if (! start.units) {
			start.units = simulate.timeUnits;
		}
		if (! width.units) {
			width.units = simulate.timeUnits;
		}
		if (! repeat.units) {
			repeat.units = simulate.timeUnits;
		}

		if (repeat.value <= 0) {
			if (eq(simulate.time(), start) || greaterThanEq(simulate.time(), start) && lessThanEq(simulate.time(), plus(start, width))) {
				return height;
			}
		} else if (greaterThanEq(simulate.time(), start)) {
			var x = minus(simulate.time(), mult(functionBank["floor"]([div(minus(simulate.time(), start), repeat)]), repeat));
			var dv = minus(simulate.time(), start);
			if (minus(functionBank["round"]([div(dv, repeat)]), div(dv, repeat)).value == 0 || (greaterThanEq(x, start) && lessThanEq(x, plus(start, width)))) {
				return height;
			}
		}
		return new Material(0, height.units);
	});

	defineFunction("Ramp", { params: [{name: "Start Time",  vectorize: true}, {name: "Finish Time",  vectorize: true}, {name: "Height",  vectorize: true, defaultVal: 1}]}, function(x) {

		var start = x[0].toNum();
		var finish = x[1].toNum();
		var height = new Material(1);
		if (x.length == 3) {
			height = x[2].toNum();
		}
		if (! start.units) {
			start.units = simulate.timeUnits;
		}
		if (! finish.units) {
			finish.units = simulate.timeUnits;
		}
		if (greaterThanEq(simulate.time(), start)) {
			var q = div(mult(functionBank["min"]([minus(finish, start), minus(simulate.time(), start)]), height), minus(finish, start));
			//console.log(q);
			return q;
		}
		return new Material(0, height.units);
	});

	defineFunction("Step", { params: [{name: "Start Time",  vectorize: true},  {name: "Height",  vectorize: true, defaultVal: 1}]}, function(x) {


		var start = x[0].toNum();
		var height = new Material(1);
		if (x.length == 2) {
			height = x[1].toNum();
		}
		if (! start.units) {
			start.units = simulate.timeUnits;
		}

		if (greaterThanEq(simulate.time(), start)) {
			return height;
		}
		
		return new Material(0, height.units);
		
	});
	functionBank["staircase"] = functionBank["step"];

	defineFunction("Smooth", {object: [functionBank, PrimitiveObject], params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Period",  vectorize: true}, {name: "Initial Value",  vectorize: true, defaultVal: "None"}]}, function(x) {

		if (x[1].toNum().value <= 0) {
			throw "MSG: The smoothing period must be greater than 0.";
		}


		if (x.length == 2) {
			return x[0].smoothF(x[1].toNum());
		} else {
			return x[0].smoothF(x[1].toNum(), x[2].toNum()); //With default value
		}
	});

	defineFunction("Delay", {object: [functionBank, PrimitiveObject], params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Delay", vectorize: true}, {name: "Initial Value",  defaultVal: "None", vectorize: true}]}, function(x) {

		if (x[1].toNum().value < 0) {
			throw "MSG: The delay must be greater than or equal to 0.";
		}
		if (x.length == 2) {
			return x[0].pastValue(x[1].toNum());
		} else {
			return x[0].pastValue(x[1].toNum(), x[2].toNum()); //With default value
		}
	});


	defineFunction("Delay1", {object: [functionBank, PrimitiveObject], params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Delay",  vectorize: true}, {name: "Initial Value",  vectorize: true, defaultVal: "None"}]}, function(x) {

		if (x[1].toNum().value <= 0) {
			throw "MSG: The delay must be greater than 0.";
		}


		if (x.length == 2) {
			return x[0].expDelayF(1, x[1].toNum());
		} else {
			return x[0].expDelayF(1, x[1].toNum(), x[2].toNum()); //With default value
		}
	});

	defineFunction("Delay3", {object: [functionBank, PrimitiveObject], params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Delay",  vectorize: true}, {name: "Initial Value",  vectorize: true, defaultVal: "None"}]}, function(x) {

		if (x[1].toNum().value <= 0) {
			throw "MSG: The delay must be greater than 0.";
		}


		if (x.length == 2) {
			return x[0].expDelayF(3, x[1].toNum());
		} else {
			return x[0].expDelayF(3, x[1].toNum(), x[2].toNum()); //With default value
		}
	});



	functionBank["fix"] = function(x, id) {
		testArgumentsSize(x, "Fix", 1, 2);
		var spacing = -1;
		if (x.length == 2) {
			spacing = evaluateNode(x[1].node, x[1].scope).toNum();
		}

		var mySeries = null;
		for (var i = 0; i < simulate.oldAggregateSeries.length; i++) {
			if (simulate.oldAggregateSeries[i].match(id)) {
				mySeries = simulate.oldAggregateSeries[i];
				break;
			}
		}

		if (mySeries === null) {
			mySeries = new AggregateSeries(id, spacing);
			simulate.oldAggregateSeries.push(mySeries);
		}

		return mySeries.get(x[0]);
	};
	functionBank["fix"].delayEvalParams = true;


	functionBank["populationsize"] = function(x) {
		testArgumentsSize(x, "PopulationSize", 1, 1);
		if( x[0] instanceof Agents){
			return new Material(sn("#e"+x[0].agents.length));
		}
		throw "MSG: PopulationSize must be passed an agent population as an argument.";
	}
	PrimitiveObject["populationsize"] = functionBank["populationsize"];

	defineFunction("Remove", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent]"}]}, function(x) {	
		//console.log(x[0]);
		if(x[0].dead){
			throw "MSG: Cannot remove an already removed agent.";
		}
		
		simulate.tasks.add(new Task({
			time: simulate.time(),
			priority: 10,
			expires: 1,
			name: "Remove Agent",
			action: function(){
				x[0].die();
			}
		}))
		
		
		return new Material(1);
	});

	defineFunction("Add", {object: [functionBank, PrimitiveObject], params: [{name: "[Agent Population]"}, {needAgent: true, name: "[Base]", defaultVal: "Agent Base"}]}, function(x) {	
	
		while((! (x[0] instanceof Agents)) && x[0].container != null){
			x[0] = x[0].container;
		}
		if(! (x[0] instanceof Agents)){
			throw "MSG: You must pass an agent population as the first argument to Add().";
		}
		if(x.length == 2 ){
			return x[0].add(x[1]);
		}else{
			return x[0].add();
		}
	});

	defineFunction("FindAll", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}]}, function(x) {
		return x[0];	
	});

	defineFunction("ResetTimer", {object: [functionBank, PrimitiveObject], params: [{needPrimitive: true, name: "[Action]"}]}, function(x) {
		if(! (x[0] instanceof Action)){
			throw "MSG: ResetTimer requires an Action primitive.";
		}
		x[0].resetTimer();
		return new Material(0);
	});

	defineFunction("Transition", {object: [functionBank, PrimitiveObject], params: [{needPrimitive: true, name: "[Transition]"}]}, function(x) {
		if(! (x[0] instanceof Transition)){
			throw "MSG: Transition requires an Transition primitive.";
		}
		x[0].doTransition()
		return new Material(0);
	});

	defineFunction("Value", {object: [functionBank, VectorObject, AgentObject], params: [{name: "[Population]"}, {needPrimitive: true, name: "[Primitive]"}]}, function(x) {//need population should be false
		
		var id = x[1].id;
	
		//console.log("v:");
		var population = null;
		//sdsadas
		
		if(! ((x[0] instanceof Agents) || (x[0] instanceof Agent) || (x[0] instanceof Vector) || (! x[0]))){
			x[0] = x[0].toNum();
		}
		
		if(x[0] instanceof Agents){
			population = getPopulation(x[0]);
		}
	
		if(x[0] instanceof Vector){
			population = x[0];
		}
		if(population !== null){
			var res = [];
			var q = -1;
			for(var i = 0; i < population.items.length; i++){
				if(q != -1){
					res.push(population.items[i].children[q]);
				}else{
					for(var j = 0; j < population.items[i].children.length; j++){
						if(population.items[i].children[j].id == id){
							res.push(population.items[i].children[j]);
							q = j;
							break;
						}
					}
				}
			}
		
			return new Vector(res);
		}else if(x[0] instanceof Agent){
			//console.log(x[0].index);
			//console.log(id);
			for(var j = 0; j < x[0].children.length; j++){
				if(x[0].children[j].id == id){
					//console.log(id+"-"+x[0].children[j].value().toString())
					return x[0].children[j];
				}
			}
			throw "MSG: Could not find referenced primitive for \"Value()\".";
		}
		throw "MSG: Invalid type for the first argument of \"Value()\".";
	});

	defineFunction("SetValue", {object: [functionBank, VectorObject, PrimitiveObject, AgentObject], params: [{name: "[Population]"}, {needPrimitive: true, name: "[Primitive]"}, {name: "Value", noVector: true, allowBoolean: true}]}, function(x) {//need population should be false
		var id = x[1].id;
	
		//console.log("v:");
		var population = null;
	
		if(x[0] instanceof Agents){
			population = getPopulation(x[0]);
		}
		if(x[0] instanceof Vector){
			population = x[0];
		}
		if(population !== null){
			var res = [];
			for(var i = 0; i < population.length(); i++){
				for(var j = 0; j < population.items[i].children.length; j++){
					if(population.items[i].children[j].id == id){
						population.items[i].children[j].setValue(x[2]);
					}
				}
			}
			return new Material(1);
		}else if(x[0] instanceof Agent){
			//console.log(x[0].index);
			//console.log(id);
			for(var j = 0; j < x[0].children.length; j++){
				if(x[0].children[j].id == id){
					//console.log(id+"-"+x[0].children[j].value().toString())
					x[0].children[j].setValue(x[2]);
					return new Material(1);
				}
			}
			throw "MSG: Could not find referenced primitive for \"SetValue()\".";
		}
		throw "MSG: Invalid type for the first argument of \"SetValue()\".";
	});

	defineFunction("FindIndex", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {name: "Index", noVector:true, noUnits: true}]}, function(x) {
		var population = x[0];
		//console.log("hi")
		for(var i = 0; i < population.length(); i++){
			if(population.items[i].index+1 == x[1].value){
				return population.items[i];
			}
		}
		
	//	debugger;
	
		throw "MSG: Index not found in population."
	});

	defineFunction("FindState", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {needPrimitive: true, name: "[State]"}]}, function(x) {

		var population = x[0];
	
		if(! ((x[1] instanceof State) || (x[1].dna.type === "State"))){
			throw "MSG: FindState() requires a State primitive as its argument.";
		}
	
		var id = x[1].id;
		var res = [];
	
		for(var i = 0; i < population.items.length; i++){
			if(population.items[i].stateIDs.indexOf(id) !== -1){
				res.push(population.items[i]);
			}
		}
	
		return new Vector(res);
	});

	defineFunction("FindNotState", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {needPrimitive: true, name: "[State]"}]}, function(x) {
	
		var population = x[0];
		if(! ((x[1] instanceof State) || (x[1].dna.type === "State"))){
			throw "MSG: FindNotState() requires a State primitive as its argument.";
		}
	
		var id = x[1].id;
		var res = [];
	
		for(var i = 0; i < population.items.length; i++){
			if(population.items[i].stateIDs.indexOf(id) === -1){
				res.push(population.items[i]);
			}
		}
	
		return new Vector(res);
	});

	defineFunction("FindNearby", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {name: "Target"}, {name: "Distance Limit", noVector:true}]}, function(x) {
		var population = x[0];
		
		var loc = locationValue(x[1]);
		
		try{
			var a = agent(x[1]);
		}catch(err){
		}
		
		
		var res = [];
		for(var i = 0; i < population.length(); i++){
			var item = agent(population.items[i]);
			if(item !== a){
				if( lessThanEq(distance(loc, item), x[2]) ){
					res.push(item);
				}
			}
		}
		return new Vector(res);
	});

	defineFunction("FindNearest", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {name: "Target"}, {noUnits: true, noVector: true, defaultVal: 1, name: "Count"}]}, function(x) {
		var population = x[0];
		var count = 1;
		
		if(x.length == 3){
			count = x[2].value;
			
			if(count < 1){
				throw "MSG: You must select at least one agent in FindNearest().";
			}
			if(count != Math.floor(count)){
				throw "MSG: Count must be an integer."
			}
		}
		
	
		var loc = locationValue(x[1]);
		try{
			var a = agent(x[1]);
		}catch(err){
		}
		
	
		var res = [];
		for(var i = 0; i < population.items.length; i++){
			var item = agent(population.items[i]);
			if(item !== a){
				res.push({distance: distance(loc, item), item: item});
			}
		}
		
		if(res.length < count){
			throw "MSG: Can't find nearest "+count+" agents of a population of size "+res.length+".";
		}
		
	
		var minItems = [res[0]];
		for(var i = 1; i < res.length; i++){
			var added = false;
			for(var j = 0; j < minItems.length; j++){
				if(lessThan(res[i].distance, minItems[j].distance)){
					minItems.splice(j, 0, res[i])
					added = true;
					break;
				}
			}
			if((! added) && minItems.length<count){
				minItems.push(res[i]);
			}else if(minItems.length>count){
				minItems.length = count;
			}
		}
	
		if(minItems.length === 1){
			return minItems[0].item;
		}else{
			minItems.sort(function(a, b){
				return a.distance - b.distance;
			});
			return new Vector(minItems.map(function(x){return x.item}));
		}
	});


	defineFunction("FindFurthest", {object: [functionBank, VectorObject, PrimitiveObject], params: [{needPopulation: true, name: "[Agent Population]"}, {name: "Target"}, {noUnits:true, noVector:true, defaultVal:1, name: "Count"}]}, function(x) {
	
		var population = x[0];

		var count = 1;
		if(x.length === 3){
			count = x[2].value;
			
			if(count<1){
				throw "MSG: You must select at least one agent in FindFurthest().";
			}
			if(count != Math.floor(count)){
				throw "MSG: Count must be an integer."
			}
		}
		
	
	
		var loc = locationValue(x[1]);
		try{
			var a = agent(x[1]);
		}catch(err){
		}
		
		
		var res = [];
		for(var i = 0; i < population.items.length; i++){
			var item = agent(population.items[i]);
			if(item !== a){
				res.push({distance: distance(loc,item), item: item});
			}
		}
	
		if(res.length < count){
			throw "MSG: Can't find furthest "+count+" agents of a population of size "+res.length+".";
		}
	
		var minItems = [res[0]];
		for(var i = 1; i < res.length; i++){
			var added = false;
			for(var j = 0; j < minItems.length; j++){
				if(greaterThan(res[i].distance, minItems[j].distance)){
					minItems.splice(j, 0, res[i])
					added = true;
					break;
				}
			}
			if((! added) && minItems.length<count){
				minItems.push(res[i]);
			}else if(minItems.length>count){
				minItems.length = count;
			}
		}
	
		if(minItems.length === 1){
			return minItems[0].item;
		}else{
			minItems.sort(function(a, b){
				return b.distance - a.distance;
			});
			return new Vector(minItems.map(function(x){return x.item}));
		}
	});

	defineFunction("Index", {object: [functionBank, AgentObject], params: [{noVector: true, needAgent: true, name: "[Agent]"}]}, function(x) {
		//console.log("--")
		//console.log(x);
		//die
		return new Material(sn("#e"+(x[0].index+1)));
	});

	defineFunction("Connect", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}, {name: "Weight", defaultVal: "missing"}]}, function(x) {
		
		var weight = undefined;
		if( x[2] != "missing" ){
			weight = x[2];
		}
		
		if( x[1] instanceof Vector ){
			x[1].items.forEach(function(a){
				x[0].connect(a, weight);
			});
		}else{
			x[0].connect(x[1], weight);
		}
		return new Material(1);
	});

	defineFunction("Unconnect", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}]}, function(x) {
		if(x[1] instanceof Vector){
			x[1].items.forEach(function(a){
				x[0].unconnect(a);
			});
		}else{
			x[0].unconnect(x[1]);
		}
		return new Material(1);
	});

	defineFunction("Connected", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent]"}]}, function(x) {
		return new Vector(x[0].connected.slice());
	});
	
	defineFunction("ConnectionWeight", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}]}, function(x){
		if(x[1] instanceof Vector){
			return new Vector(x[1].items.map(function(a){
				return x[0].connectionWeight(a);
			}));
		}else{
			return x[0].connectionWeight(x[1]);
		}
	} );
	
	defineFunction("SetConnectionWeight", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}, {name: "Weight"}]}, function(x){
		if(x[1] instanceof Vector){
			x[1].items.forEach(function(a){
				x[0].setConnectionWeight(a, x[2]);
			});
		}else{
			x[0].setConnectionWeight(x[1], x[2]);
		}
		return new Material(1);
	} );

	functionBank["die"] = function(x) {
		console.log(x);
		throw "MSG: Terminated using \"die\".";
	}

	functionBank["print"] = function(x) {
		
		if(x.length==2){
			console.log(x[0].value.toString());
			console.log(x[1]);
			return x[1];
		}else{
			console.log(x[0]);
			return x[0];
		}
	}

	defineFunction("Width", {params: [{needAgents: true, name: "[Agent Population]"}]}, function(x) {
		return x[0].geoWidth;
	});

	defineFunction("Height", {params: [{needAgents: true, name: "[Agent Population]"}]}, function(x) {
		return x[0].geoHeight;
	});

	defineFunction("Distance", {object: [functionBank, AgentObject], params: [{name: "Location 1"}, {name: "Location 2"}]}, function(x) {
		x[0] = locationValue(x[0]);
		x[1] = locationValue(x[1]);
		
		return distance(x[0], x[1]);
	});



	defineFunction("Location", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent]"}]}, function(x) {
		if(! x[0].location){
			throw "MSG: The location is not defined."
		}else{
			return x[0].location.fullClone();
		}
	});

	defineFunction("SetLocation", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Agent]"}, {needVector: true, name: "Direction"}]}, function(x) {
		var v = x[1].toNum();
		var agent = x[0];
		agent.location = v.fullClone();
		if(! agent.location.names){
			agent.location.names = ["x", "y"];
			agent.location.namesLC = ["x", "y"];
		}
		return new Material(0);
	});

	defineFunction("Move", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Mover]"}, {needVector: true, name: "Direction"}]}, function(x) {
	
		var v = x[1].toNum();
		shiftLocation(x[0], plus(x[0].location, v));
		return new Material(0);
	});

	function locationValue(x){
		if(x instanceof Vector){
			if(x.items.length != 2){
				throw "MSG: Location vector does not contain exactly two elements."
			}
			else{
				return x;
			}
		}else{
			try{
				return agent(x).location;
			}catch(err){
				throw "MSG: Location must be a vector or an agent.";
			}
		}
	}
	
	defineFunction("MoveTowards", {object: [functionBank, AgentObject], params: [{needAgent: true, name: "[Mover]"}, {name: "[Target]"}, {name: "Distance", noVector: true}]}, function(x) {
		var a = x[0];
		
		var l1 = locationValue(x[1]);
		var l2 = a.location;
	
		var distx = minus(l1.items[0], l2.items[0]);
		var disty = minus(l1.items[1], l2.items[1]);
	
		if(distx.value==0 && disty.value==0){
			return new Material(1);
		}
	
	
		if(a.container.geoWrap){
		
			if(greaterThan(distx, a.container.halfWidth)){
				distx = minus(a.container.geoWidth, distx)
			}else if(lessThan(distx, negate(a.container.halfWidth))){
				distx = minus(distx, negate(a.container.geoWidth))
			}
			if(greaterThan(disty, a.container.halfHeight)){
				disty = minus(a.container.geoHeight, disty)
			}else if(lessThan(disty, negate(a.container.halfHeight))){
				disty = minus(disty, negate(a.container.geoHeight))
			}
		}
	
		var dir = new Vector([distx, disty], ["x","y"])
	
		//var dir = minus(agent(x[1]).location, agent(x[0]).location);

		shiftLocation(x[0], plus(x[0].location, mult(dir, div(x[2],distance(x[0], (x[1] instanceof Vector)?x[1]:agent(x[1]))))));
	
		return new Material(1);
	});

	PrimitiveBase = makeObjectBase(PrimitiveObject);

	AgentBase = makeObjectBase(AgentObject);
	
	PrimitiveBase.parent = AgentBase;

	VectorBase = makeObjectBase(VectorObject);

});


function distance(a,b){
	var l1 = (a instanceof Vector)?a:a.location;
	var l2 = (b instanceof Vector)?b:b.location;
	//console.log(a)
	//console.log(b)
	
	var s1 = l1.items[0].toString()+","+l1.items[1].toString();
	var s2 = l2.items[0].toString()+","+l2.items[1].toString();
	if(simulate.distanceCache[s1+"-"+s2]){
		return simulate.distanceCache[s1+"-"+s2];
	}else if(simulate.distanceCache[s2+"-"+s1]){
		return simulate.distanceCache[s2+"-"+s1];
	}
	var distx = minus(l1.items[0], l2.items[0]);
	var disty = minus(l1.items[1], l2.items[1]);
	
	var agents = null;
	if(! (a instanceof Vector)){
		agents = a.container;
	}else if(! (b instanceof Vector)){
		agents = b.container;
	}
	if(agents !== null && agents.geoWrap){
		if(greaterThan(distx, agents.halfWidth)){
			distx = minus(agents.geoWidth, distx)
		}else if(lessThan(distx, negate(agents.halfWidth))){
			distx = minus(distx, negate(agents.geoWidth))
		}
		if(greaterThan(disty, agents.halfHeight)){
			disty = minus(agents.geoHeight, disty)
		}else if(lessThan(disty, negate(agents.halfHeight))){
			disty = minus(disty, negate(agents.geoHeight))
		}
	}

	var v1 = distx.value;
	var v2 = disty.value;
	
	if (distx.units !== disty.units) {
		v2 = fn["*"](v2, convertUnits(distx.units, disty.units));
	}
	
	var dist = fn["real-part"](fn["sqrt"](fn["+"]( fn["*"](v1,v1), fn["*"](v2,v2)) ));
	dist = new Material(dist, distx.units);
	simulate.distanceCache[s1+s2]=dist;
	return dist;
	//var dist = functionBank["sqrt"]([plus( power(distx, (new Material(2))), power(disty, (new Material(2))) )])

	//dist.value = fn["real-part"](dist.value);
	//return dist;
}

function agent(obj){
	if((obj instanceof Variable) || (obj instanceof Stock)){
		obj = obj.toNum();
	}
	if(obj instanceof Agent){
		return obj;
	}else if((! strictAgentResolution) && obj instanceof Primitive){ // flexAgents is now disabled by default, kept for compatibility 
		return agent(obj.container);
	}else{
		throw "MSG: An agent is required here.";
	}
}

function agents(obj){
	if(obj instanceof Agents){
		return obj;
	}else if((obj instanceof Primitive) || (obj instanceof Agent)){
		return agents(obj.container);
	}else{
		throw "MSG: An agent population is required here.";
	}
}

function getPopulation(item){
	if(item.items){
		return item;
	}
	var res = [];
	if(item instanceof Agents){
		return new Vector(item.agents.slice());
	}else if(item.toNum() instanceof Vector){
		return item.toNum();
	}else{
		return new Vector([agent(item)]);
	}
}

function shiftLocation(agent, newLocation){
	
	if(agent.container.geoWrap){
		while(lessThan(newLocation.items[0], new Material(0))){
			newLocation.items[0] = plus(newLocation.items[0], agent.container.geoWidth);
		}
		while(greaterThan(newLocation.items[0], agent.container.geoWidth)){
			newLocation.items[0] = minus(newLocation.items[0], agent.container.geoWidth);
		}
		while(lessThan(newLocation.items[1], new Material(0))){
			newLocation.items[1] = plus(newLocation.items[1], agent.container.geoHeight);
		}
		while(greaterThan(newLocation.items[1], agent.container.geoHeight)){
			newLocation.items[1] = minus(newLocation.items[1], agent.container.geoHeight);
		}
	}
	
	agent.location = newLocation;
	if(! agent.location.names){
		agent.location.names = ["x","y"];
		agent.location.namesLC = ["x","y"];
	}
}

function isUndefined(item) {
	return typeof(item) == "undefined";
}

function isDefined(item) {
	return !isUndefined(item);
}

function constraintAlert(item, type, val) {
	var msg = "The " + (type == "max" ? "maximum" : "minimum") + " constraint on the primitive <b>" + clean(getName(findID(item.id))) + "</b> has been violated. The primitive's value attempted to become " + val.value + " when the " + (type == "max" ? "maximum" : "minimum") + " allowed value is " + (type == "max" ? item.dna.maxConstraint : item.dna.minConstraint) + ".";
	error(msg, item, false);
}

function error(msg, primitive, showEditor, line, details) {
	var x = {
		msg: msg,
		primitive: primitive,
		showEditor: showEditor,
		line: line,
		details: details
	};
	if (isLocal()) {
		console.log("Error:")
		console.log(x);
	}
	throw x;
}

function testPrimitive(x, name, primitiveIndexes) {
	for (var i = 0; i < primitiveIndexes.length; i++) {
		if (! (x[primitiveIndexes[i]] instanceof Primitive)) {
			throw "MSG: " + name + "() requires a primitive reference to be passed to it as argument number "+(primitiveIndexes[i]+1)+".";
		}
	}

}

// For printing vectors
function prepareDisplay(x){
	return x;
}
