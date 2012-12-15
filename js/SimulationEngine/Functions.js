"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


defineFunction("Stop", {params:[]}, function(x) {
	throw {
		msg: "STOP"
	};
});

defineFunction("Time", {params:[]}, function(x) {
	return time.fullClone();
});

defineFunction("TimeStep", {params:[]}, function(x) {
	return timeStep.fullClone();
});

defineFunction("TimeLength", {params:[]}, function(x) {
	return timeLength.fullClone();
});

defineFunction("TimeStart", {params:[]}, function(x) {
	return timeStart.fullClone();
});

defineFunction("TimeEnd", {params:[]}, function(x) {
	return plus(timeStart, timeLength);
});

defineFunction("Seconds", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["seconds"],[-1])));
});

defineFunction("Minutes", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["minutes"],[-1])));
});

defineFunction("Hours", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["hours"],[-1])));
});

defineFunction("Days", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["days"],[-1])));
});

defineFunction("Weeks", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["weeks"],[-1])));
});

defineFunction("Months", { params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["months"],[-1])));
});

defineFunction("Years", {params:[{name: "Value", defaultVal: "time", noVector: true}]}, function(x) {
	var item;
	if (x.length == 0) {
		item = time.fullClone();
	} else {
		item = x[0].toNum();
	}
	return mult(item, new Material(1, new UnitStore(["years"],[-1])));
});

defineFunction("Unitless", { params:[{name: "Value",  noVector: true}]}, function(x) {
	return new Material(x[0].toNum().value);
});

defineFunction("PastMean", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {
	if (x.length == 1) {
		return functionBank["mean"](x[0].getPastValues());
	} else {
		return functionBank["mean"](x[0].getPastValues(x[1].toNum()));
	}
});

defineFunction("PastMedian", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {
	
	if (x.length == 1) {
		return functionBank["median"](x[0].getPastValues());
	} else {
		return functionBank["median"](x[0].getPastValues(x[1].toNum()));
	}
});

defineFunction("PastValues", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {
	
	var items;
	if (x.length == 1) {
		items = x[0].getPastValues();
	} else {
		items = x[0].getPastValues(x[1].toNum());
	}
	return new Vector(items);
});

defineFunction("PastStdDev", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {

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

defineFunction("PastCorrelation", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", needPrimitive: true, noVector: true}]}, function(x) {

	var items1;
	var items2;
	if (x.length == 2) {
		items1 = x[0].getPastValues();
		items2 = x[1].getPastValues();
	} else {
		items1 = x[0].getPastValues(x[3].toNum());
		items2 = x[1].getPastValues(x[3].toNum());
	}
	if (items1.length > 1) {
		return functionBank["correlation"]([new Vector(items1), new Vector(items2)]);
	} else {
		return new Material(0);
	}
});

defineFunction("PastMax", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {

	if (x.length == 1) {
		return functionBank["max"](x[0].getPastValues());
	} else {
		return functionBank["max"](x[0].getPastValues(x[1].toNum()));
	}
});

defineFunction("PastMin", {params:[{name: "[Primitive]",  noVector: true, needPrimitive:true}, {name: "Past Range", defaultVal: "All Time", noVector: true}]}, function(x) {

	if (x.length == 1) {
		return functionBank["min"](x[0].getPastValues());
	} else {
		return functionBank["min"](x[0].getPastValues(x[1].toNum()));
	}
});

defineFunction("Pulse", { params:[{name: "Start Time",  noVector: true}, {name: "Height",  noVector: true, defaultVal: 1}, {name: "Width",  noVector: true, defaultVal: 0}, {name: "Repeat Period",  noVector: true, defaultVal: 0}]}, function(x) {

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
	if (unitless(start.units)) {
		start.units = time.units.clone();
	}
	if (unitless(width.units)) {
		width.units = time.units.clone();
	}
	if (unitless(repeat.units)) {
		repeat.units = time.units.clone();
	}

	if (repeat.value <= 0) {
		if (eq(time, start) || greaterThanEq(time, start) && lessThanEq(time, plus(start, width))) {
			return height;
		}
	} else if (greaterThanEq(time, start)) {
		var x = minus(time, mult(functionBank["floor"]([div(minus(time, start), repeat)]), repeat));
		var dv = minus(time, start);
		if (minus(functionBank["round"]([div(dv, repeat)]), div(dv, repeat)).value == 0 || (greaterThanEq(x, start) && lessThanEq(x, plus(start, width)))) {
			return height;
		}
	}
	return new Material(0);
});

defineFunction("Ramp", { params: [{name: "Start Time",  noVector: true}, {name: "Finish Time",  noVector: true}, {name: "Height",  noVector: true, defaultVal: 1}]}, function(x) {

	var start = x[0].toNum();
	var finish = x[1].toNum();
	var height = new Material(1);
	if (x.length == 3) {
		height = x[2].toNum();
	}
	if (unitless(start.units)) {
		start.units = time.units.clone();
	}
	if (unitless(finish.units)) {
		finish.units = time.units.clone();
	}
	if (greaterThanEq(time, start)) {
		var q = div(mult(functionBank["min"]([minus(finish, start), minus(time, start)]), height), minus(finish, start));
		//console.log(q);
		return q;
	}
	return new Material(0);
});

defineFunction("Step", { params: [{name: "Start Time",  noVector: true},  {name: "Height",  noVector: true, defaultVal: 1}]}, function(x) {


	var start = x[0].toNum();
	var height = new Material(1);
	if (x.length == 2) {
		height = x[1].toNum();
	}
	if (unitless(start.units)) {
		start.units = time.units.clone();
	}

	if (greaterThanEq(time, start)) {
		return height;
	}
	return new Material(0);
});
functionBank["staircase"] = functionBank["step"];

defineFunction("Smooth", {params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Length",  noVector: true}, {name: "Initial Value",  noVector: true, defaultVal: "None"}]}, function(x) {

	if (x[1].toNum().value <= 0) {
		throw "MSG: The smoothing period must be greater than 0.";
	}


	if (x.length == 2) {
		return x[0].smoothF(x[1].toNum());
	} else {
		return x[0].smoothF(x[1].toNum(), x[2].toNum()); //With default value
	}
});

defineFunction("Delay", {params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Length",  noVector: true}, {name: "Initial Value",  noVector: true, defaultVal: "None"}]}, function(x) {

	if (x[1].toNum().value < 0) {
		throw "MSG: The delay must be greater than or equal to 0.";
	}
	if (x.length == 2) {
		return x[0].pastValue(x[1].toNum());
	} else {
		return x[0].pastValue(x[1].toNum(), x[2].toNum()); //With default value
	}
});


defineFunction("Delay1", {params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Length",  noVector: true}, {name: "Initial Value",  noVector: true, defaultVal: "None"}]}, function(x) {

	if (x[1].toNum().value <= 0) {
		throw "MSG: The delay must be greater than 0.";
	}


	if (x.length == 2) {
		return x[0].expDelayF(1, x[1].toNum());
	} else {
		return x[0].expDelayF(1, x[1].toNum(), x[2].toNum()); //With default value
	}
});

defineFunction("Delay3", {params: [{name: "[Primitive]",  noVector: true, needPrimitive: true}, {name: "Length",  noVector: true}, {name: "Initial Value",  noVector: true, defaultVal: "None"}]}, function(x) {

	if (x[1].toNum().value <= 0) {
		throw "MSG: The delay must be greater than 0.";
	}


	if (x.length == 2) {
		return x[0].expDelayF(3, x[1].toNum());
	} else {
		return x[0].expDelayF(3, x[1].toNum(), x[2].toNum()); //With default value
	}
});

defineFunction("Exp", { params: [{name: "Number",  noVector: true, noUnits: true}]}, function(x) {	
	var r = x[0].toNum();
	r.value = fn.exp(r.value);
	if(fn["imag-part"](r.value) != 0){
		throw("MSG: Exp() function resulted in an imaginary result.");
	}else{
		r.value = fn["real-part"](r.value);
		return r;
	}
});


functionBank["fix"] = function(x, id) {
	testArgumentsSize(x, "Fix", 1, 2);
	var spacing = -1;
	if (x.length == 2) {
		spacing = evaluateNode(x[1].node, x[1].scope).toNum();
	}

	var mySeries = null;
	for (var i = 0; i < oldAggregateSeries.length; i++) {
		if (oldAggregateSeries[i].match(id)) {
			mySeries = oldAggregateSeries[i];
			break;
		}
	}

	if (mySeries === null) {
		mySeries = new AggregateSeries(id, spacing);
		oldAggregateSeries.push(mySeries);
	}

	return mySeries.get(x[0]);
};
functionBank["fix"].delayEvalParams = true;

function getPopulation(item){
	if(item.items){
		return item;
	}
	var res = [];
	if(item instanceof Agents){
		for(var i=0; i<item.agents.length; i++){
			res.push(item.agents[i]);
		}
	}else{
		res.push(agent(item));
	}
	return new Vector(res);
}

functionBank["populationsize"] = function(x) {
	testArgumentsSize(x, "PopulationSize", 1, 1);
	if( x[0] instanceof Agents){
		return new Material(sn("#e"+x[0].agents.length));
	}
	throw "MSG: PopulationSize must be passed an agent population as an argument.";
}

defineFunction("Remove", {params: [{needAgent: true, name: "[Agent]"}]}, function(x) {	
	//console.log(x[0]);
	x[0].parent.nextDie.push(x[0]);
	simulate.agentsChanged = true;
	
	return new Material(1);
});

defineFunction("Add", {params: [{name: "[Agent Population]"}, {needAgent: true, name: "[Base]", defaultVal: "Agent Base"}]}, function(x) {	
	
	while((! (x[0] instanceof Agents)) && x[0].parent != null){
		x[0] = x[0].parent;
	}
	if(! (x[0] instanceof Agents)){
		throw "MSG: You must pass an agent population as the first argument to Create().";
	}
	if(x.length == 2 ){
		return x[0].add(x[1]);
	}else{
		return x[0].add();
	}
});

defineFunction("FindAll", {params: [{needPopulation: true, name: "[Agent Population]"}]}, function(x) {
	return x[0];	
});

defineFunction("ResetTimer", {params: [{needPrimitive: true, name: "[Action]"}]}, function(x) {
	if(! (x[0] instanceof Action)){
		throw "ResetTimer requires an Action primitive.";
	}
	x[0].resetTimer();
	return new Material(0);
});

defineFunction("Value", {params: [{name: "[Population]"}, {needPrimitive: true, name: "[Primitive]"}]}, function(x) {//need population should be false
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
		var j = -1;
		for(var i = 0; i < population.length(); i++){
			if(j != -1){
				res.push(population.items[i].children[j]);
			}else{
				for(var j = 0; j < population.items[i].children.length; j++){
					if(population.items[i].children[j].id == id){
						res.push(population.items[i].children[j]);
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

defineFunction("SetValue", {params: [{name: "[Population]"}, {needPrimitive: true, name: "[Primitive]"}, {name: "Value", noVector: true, allowBoolean: true}]}, function(x) {//need population should be false
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

defineFunction("FindIndex", {params: [{needPopulation: true, name: "[Agent Population]"}, {name: "Index", noVector:true, noUnits: true}]}, function(x) {
	var population = x[0];
	
	for(var i = 0; i < population.length(); i++){
		if(population.items[i].index+1 == x[1].value){
			return population.items[i];
		}
	}
	
	throw "MSG: Index not found in population."
});

defineFunction("FindState", {params: [{needPopulation: true, name: "[Agent Population]"}, {needPrimitive: true, name: "[State]"}]}, function(x) {

	var population = x[0];
	if(! ((x[1] instanceof State) || (x[1].dna.type == "State"))){
		throw "MSG: FindState() requires a State primitive as its second argument.";
	}
	var id = x[1].id;
	var res = [];
	for(var i = 0; i < population.length(); i++){
		var popState = population.items[i].state();
		if(popState !== null && popState.map(function(x){return x.id}).indexOf(id)>-1){
			res.push(population.items[i]);
		}
	}
	
	//console.log(res);
	
	return new Vector(res);
});

defineFunction("FindNotState", {params: [{needPopulation: true, name: "[Agent Population]"}, {needPrimitive: true, name: "[State]"}]}, function(x) {
	
	var population = x[0];
	if(! ((x[1] instanceof State) || (x[1].dna.type == "State"))){
		throw "MSG: FindState() requires a State primitive as its second argument.";
	}
	
	var id = x[1].id;
	var res = [];
	for(var i = 0; i < population.length(); i++){
		var popState = population.items[i].state();
		if(popState !== null && popState.map(function(x){return x.id}).indexOf(id)==-1){
			res.push(population.items[i]);
		}
	}
	return new Vector(res);
});

defineFunction("FindNearby", {params: [{needPopulation: true, name: "[Agent Population]"}, {needAgent: true, name: "[Agent]"}, {name: "Distance Limit", noVector:true}]}, function(x) {
	var population = x[0];
	
	var res = [];
	for(var i = 0; i < population.length(); i++){
		var item = agent(population.items[i]);
		if(item.fullId != x[1].fullId){
			if( lessThanEq(distance(x[1],item), x[2]) ){
				res.push(item);
			}
		}
	}
	return new Vector(res);
});

defineFunction("FindNearest", {params: [{needPopulation: true, name: "[Agent Population]"}, {needAgent: true, name: "[Agent]"}, {noUnits:true, noVector:true, defaultVal:1, name: "Count"}]}, function(x) {
	var population = x[0];

	var count = 1;
	if(x.length==3){
		count = x[2];
	}
	
	var res = [];
	population.items.forEach(function(q){
		var item = agent(q);
		if(item.fullId != x[1].fullId){
			res.push({distance: distance(x[1],item), item: item});
		}else{
			return null;
		}
	});
	
	if(res.length < count){
		throw "MSG: Can't find nearest "+count+" agents of a population of size "+res.length+".";
	}
	if(count<1){
		throw "MSG: You must select at least one agent.";
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
	
	if(minItems.length == 1){
		return minItems[0].item;
	}else{
		return new Vector(minItems.map(function(x){return x.item}));
	}
});


defineFunction("FindFurthest", {params: [{needPopulation: true, name: "[Agent Population]"}, {needAgent: true, name: "[Agent]"}, {noUnits:true, noVector:true, defaultVal:1, name: "Count"}]}, function(x) {
	
	var population = x[0];

	var count = 1;
	if(x.length==3){
		count = x[2];
	}
	if(count<1){
		throw "MSG: You must select at least one agent.";
	}
	
	var res = [];
	population.items.forEach(function(q){
		var item = agent(q);
		if(item.fullId != x[1].fullId){
			res.push({distance: distance(x[1],item), item: item});
		}else{
			return null;
		}
	});
	
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
	
	if(minItems.length == 1){
		return minItems[0].item;
	}else{
		return new Vector(minItems.map(function(x){return x.item}));
	}
});



function agent(obj, fnName, pName){
	if(obj instanceof Agent){
		return obj;
	}else if(obj instanceof Primitive){
		return agent(obj.parent, fnName, pName);
	}else{
		throw "MSG: An agent is required for '"+pName+"' in the function "+fnName+".";
	}
}

function agents(obj){
	if(obj instanceof Agents){
		return obj;
	}else if((obj instanceof Primitive) || (obj instanceof Agent)){
		return agents(obj.parent);
	}else{
		throw "MSG: An agent population is required for '"+pName+"' in the function "+fnName+".";
	}
}

defineFunction("Index", {params: [{noVector: true, needAgent: true, name: "[Agent]"}]}, function(x) {
	return new Material(sn("#e"+(x[0].index+1)));
});


defineFunction("Connect", {params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}]}, function(x) {
	if(x[1] instanceof Vector){
		x[1].items.map(function(a){
			x[0].connect(a);
		});
	}else{
		x[0].connect(x[1]);
	}
	return new Material(1);
});

defineFunction("Unconnect", {params: [{needAgent: true, name: "[Agent 1]"}, {name: "[Agent 2]"}]}, function(x) {
	if(x[1] instanceof Vector){
		x[1].items.map(function(a){
			x[0].unconnect(a);
		});
	}else{
		x[0].unconnect(x[1]);
	}
	return new Material(1);
});

defineFunction("Connected", {params: [{needAgent: true, name: "[Agent]"}]}, function(x) {
	return new Vector(x[0].connected.slice());
});

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

defineFunction("Distance", {params: [{name: "[Agent 1]"}, {name: "[Agent 2]"}]}, function(x) {
	if(! (x[0] instanceof Vector)){
		x[0] =agent(x[0]);
	}
	if(! ( x[1] instanceof Vector)){
		x[1] = agent(x[1]);
	}
	return distance(x[0], x[1]);
});

var distanceCache = {};
function distance(a,b){
	var l1 = (a instanceof Vector)?a:a.location;
	var l2 = (b instanceof Vector)?b:b.location;
	//console.log(a)
	//console.log(b)
	var s1 = l1.items[0].toString()+","+l1.items[1].toString();
	var s2 = l2.items[0].toString()+","+l2.items[1].toString();
	if(distanceCache[s1+"-"+s2]){
		return distanceCache[s1+"-"+s2];
	}else if(distanceCache[s2+"-"+s1]){
		return distanceCache[s2+"-"+s1];
	}
	var distx = minus(l1.items[0], l2.items[0]);
	var disty = minus(l1.items[1], l2.items[1]);
	
	var agents = null;
	if(! (a instanceof Vector)){
		agents = a.parent;
	}else if(! (b instanceof Vector)){
		agents = b.parent;
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
	
	if (!unitsEqual(distx.units, disty.units)) {
		v2 = fn["*"](v2, convertUnits(distx.units, disty.units));
	}
	
	var dist = fn["real-part"](fn["sqrt"](fn["+"]( fn["*"](v1,v1), fn["*"](v2,v2)) ));
	dist = new Material(dist, distx.units.clone());
	distanceCache[s1+s2]=dist;
	return dist;
	//var dist = functionBank["sqrt"]([plus( power(distx, (new Material(2))), power(disty, (new Material(2))) )])

	//dist.value = fn["real-part"](dist.value);
	//return dist;
}

defineFunction("Location", {params: [{needAgent: true, name: "[Primitive]"}]}, function(x) {
	return x[0].location;
});


defineFunction("Move", {params: [{needAgent: true, name: "[Mover]"}, {needVector: true, name: "Direction"}]}, function(x) {
	
	var v = x[1].toNum();
	shiftLocation(x[0], plus(x[0].location, v));
	return new Material(0);
});

defineFunction("MoveTowards", {params: [{needAgent: true, name: "[Mover]"}, {name: "[Target]"}, {name: "Distance", noVector: true}]}, function(x) {
	var a = x[0];
	var l1 = (x[1] instanceof Vector)?x[1]:agent(x[1]).location;
	var l2 = a.location;
	
	var distx = minus(l1.items[0], l2.items[0]);
	var disty = minus(l1.items[1], l2.items[1]);
	
	if(distx.value==0 && disty.value==0){
		return new Material(1);
	}
	
	
	if(a.parent.geoWrap){
		
		if(greaterThan(distx, a.parent.halfWidth)){
			distx = minus(a.parent.geoWidth, distx)
		}else if(lessThan(distx, negate(a.parent.halfWidth))){
			distx = minus(distx, negate(a.parent.geoWidth))
		}
		if(greaterThan(disty, a.parent.halfHeight)){
			disty = minus(a.parent.geoHeight, disty)
		}else if(lessThan(disty, negate(a.parent.halfHeight))){
			disty = minus(disty, negate(a.parent.geoHeight))
		}
	}
	
	var dir = new Vector([distx, disty])
	
	//var dir = minus(agent(x[1]).location, agent(x[0]).location);

	shiftLocation(x[0], plus(x[0].location, mult(dir, div(x[2],distance(x[0], (x[1] instanceof Vector)?x[1]:agent(x[1]))))));
	
	return new Material(1);
});

function shiftLocation(agent, newLocation){
	
	if(agent.parent.geoWrap){
		while(lessThan(newLocation.items[0], new Material(0))){
			newLocation.items[0] = plus(newLocation.items[0], agent.parent.geoWidth);
		}
		while(greaterThan(newLocation.items[0], agent.parent.geoWidth)){
			newLocation.items[0] = minus(newLocation.items[0], agent.parent.geoWidth);
		}
		while(lessThan(newLocation.items[1], new Material(0))){
			newLocation.items[1] = plus(newLocation.items[1], agent.parent.geoHeight);
		}
		while(greaterThan(newLocation.items[1], agent.parent.geoHeight)){
			newLocation.items[1] = minus(newLocation.items[1], agent.parent.geoHeight);
		}
	}
	
	agent.location = newLocation;
}

function isUndefined(item) {
	return typeof(item) == "undefined";
}

function isDefined(item) {
	return !isUndefined(item);
}

function constraintAlert(item, type, val) {
	var msg = "The " + (type == "max" ? "maximum" : "minimum") + " constraint on the primitive <b>" + clean(getName(findID(item.id))) + "</b> has been violated. The primitive's value attempted to become " + val.value + " when the " + (type == "max" ? "maximum" : "minimum") + " allowed value is " + (type == "max" ? item.maximumConstraint : item.minimumConstraint) + ".";
	error(msg, item, false);
}

function error(msg, primitive, showEditor) {
	var x = {
		msg: msg,
		primitive: primitive,
		showEditor: showEditor
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
