"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/



function Primitive() {
	this.parent = null;
	this.id = null;
	this.agentId = null;
	this.index = null;
	this.name = null;
	this.pastValues = [];
	this.pastData = new DataBank();
	this.units = new UnitStore();
	this.maximumConstraintType = null;
	this.minimumConstraintType = null;
	this.maximumConstraint = null;
	this.minimumConstraint = null;
	this.unitless = null;
	this.equation = null;
}
Primitive.method("clone", function(){
	var p = new this.constructorFunction();
	p.parent = this.parent;
	p.id = this.id;
	p.agentId = this.agentId;
	p.index = this.index
	p.name = this.name
	p.pastValues = this.pastValues.slice(0);
	p.units = this.units.clone();
	while(p.pastValues.length <= timeIndex){
		p.pastValues.push(new Material(0, this.units.clone()));
	}
	p.pastData = this.pastData.clone();
	p.maximumConstraintType = this.maximumConstraintType;
	p.minimumConstraintType = this.minimumConstraintType;
	p.maximumConstraint = this.maximumConstraints;
	p.minimumConstraint = this.minimumConstraint;
	p.unitless = this.unitless;
	
	//p.equation = 1;//equation is set through linking
	
	this.innerClone(p);
	
	return p;
});
Primitive.method("toNum", function(){
	return this.value();
});
Primitive.method("calculateValue", function() {
	throw "MSG: ["+this.name+"] does not have a value and can not be used as a value in an equation.";
});
Primitive.method("createIds", function(){
	this.fullId = ":"+this.id+"-"+this.agentId+"-"+this.index;
	this.instanceId = ":"+this.agentId+"-"+this.index;
});
Primitive.method("setup", function(units, extra) {
	this.units = units;
	this.toBase = units?(new Quantities(this.units)).toBase:1;//units?sn("#e"+(new Quantities(this.units)).toBase):1;
	this.unitless = (! units) || unitless(units);
	if(isDefined(extra)){
		for(var v in extra){
			this[v] = extra[v];
		}
	}
});
Primitive.method("setConstraints", function(max, maxType, min, minType) {
	this.maximumConstraint = max;
	this.maximumConstraintType = maxType;
	this.minimumConstraint = min;
	this.minimumConstraintType = minType;
});
Primitive.method("clearPastValues", function(count) {
	this.pastValues.splice(this.pastValues.length - 1 - count, count);
	this.pastData.trimValues(this.pastValues.length - 1);
});
Primitive.method("getPastValues",  function( length ){
	var res = [];
    if( isUndefined(length) ){
      res = map(this.pastValues, function(x){return new Material(fn["real-part"](x.value), x.units.clone())});
    }else{
		var bins =  Math.ceil(div(length.forceUnits(timeStart.units), timeStep).value);
		
	    for(var i = this.pastValues.length-1; i >= Math.max(0, this.pastValues.length-1-bins); i--){
	      	  res.push(new Material(fn["real-part"](this.pastValues[i].value), this.pastValues[i].units.clone()));
	    }
	}
	if(RKOrder==4){
		var it = true;
		for(var i=res.length-1; i>=0; i--){
			it=!it
			if(it){
				res.splice(i, 1);
			}
		}
	}
    return res;
});
Primitive.method("pastValue", function pastValue(delay, defaultValue){
    var periods;
	
    if( this.pastValues.length-1 < Math.round((time.value-timeStart.value)/timeStep.value) ){
      periods  = div(delay.forceUnits(timeStart.units), timeStep).value;
    }else{
      periods  = div(delay.forceUnits(timeStart.units), timeStep).value + 1;
    }
	
	if(periods==0){
		return this.value();
	}

    if( Math.ceil(periods) > this.pastValues.length ){
        if( isUndefined(defaultValue) ){
          if( this.pastValues.length > 0 ){
            return this.pastValues[0].fullClone();
          }else{
            return this.value();
          }
        }else{
          return defaultValue;
        }
    }
    
    if( periods == Math.round(periods) ){
      if( periods == 0 ){
        return value;
      }else{
        return this.pastValues[this.pastValues.length - periods].fullClone();
      }
    }
    
    var fraction =  periods - Math.floor(periods);
    var entry =  Math.floor(periods);
    var first_period, second_period;
    if( entry == 0 ){
      first_period = this.value();
    }else{
      first_period = this.pastValues[this.pastValues.length - entry];
    }
    second_period = this.pastValues[this.pastValues.length-1-entry];
    return plus(mult(first_period, new Material(1-fraction)), mult(second_period, new Material(fraction)));
});
Primitive.method("smoothF", function( delay , initialV){
	
    var  a =  div(timeStep, delay.forceUnits(timeStart.units)).value;
	
    var dat =  this.pastData.getSeries( "Smooth: " + a + "," + initialV );
    if( dat.length == 0  ){
      if( isUndefined(initialV) ){
         this.value();
        dat.push(this.pastValues[0]);
      }else{
        dat.push(initialV);
      }
    }

    for(var i=dat.length; i <= Math.round((time.value-timeStart.value)/timeStep.value)-1; i++){
		// dat.push(dat[i-1]*(1-a)+a*pastValues[i]);
       dat.push(plus(mult(dat[i-1], new Material(1-a)), mult(new Material(a), this.pastValues[i]))); 
    }
	
    return dat[dat.length-1].fullClone();
  });
Primitive.method("expDelayF", function( order , delay , initialV ){
    this.value();

    var  a =  div(timeStep, delay.forceUnits(timeStart.units)).value * order;

    var  dat =  this.pastData.getSeries("ExpDelay: " + order+"," + delay.value + "," + initialV);

    if( dat.length == 0 ){
      if( isUndefined(initialV) ){
        dat.push(new ExpGroup( order, a, this.pastValues[0] ));
      }else{
        var exIV = new ExpGroup( order, a, initialV );
        dat.push(exIV.moveForward( this.pastValues[0] ));
      }
    }
    
    for(var i = dat.length; i < this.pastValues.length; i++){
      dat.push(dat[i-1].moveForward(this.pastValues[i]));
    }
    
    return dat[dat.length-1].out.fullClone();
  });
Primitive.method("testUnits", function(m, ignoreFlow) {
	if( unitless(this.units) && (! (m instanceof Vector) && ! unitless(m.units))){
		error("Wrong units generated for <i>"+clean(this.name)+"</i>. Expected no units and got <i>"+clean(m.units.toString())+"</i>. Either specify units for the primitive or adjust the equation.", this, true);
	}else if (! this.units.unitless() && m instanceof Vector) {
		error("Units error for <i>"+clean(this.name)+"</i>. Expected <i>"+clean(this.units.toString())+"</i> and the equation resulted in a vector.", this, true);
	}else if (! unitsEqual(this.units, m.units)) {
		var scale = convertUnits(m.units, this.units, true);
		if (scale == 0) {
			if(isLocal()){
				console.log(m.units);
				console.log(this.units);
			}
			error("Wrong units generated for <i>"+clean(this.name)+"</i>. Expected <i>"+clean(this.units.toString())+"</i>, and got <i>"+clean(m.units.toString())+"</i>.", this, true);
			return
		} else {
			//console.log("----+")
			m.value = m.value * scale;
			m.units = this.units.clone();
			//console.log((this instanceof Flow));
			//console.log(ignoreFlow);	
		}
	}
	if((this instanceof Flow) && (ignoreFlow != true) && this.flowUnitless){
		var x = mult(m, new Material(1, timeLength.units.clone()));
		m.value = x.value;
		m.units = x.units;
	}
});
Primitive.method("setValue", function() {
	throw "MSG: You cannot set the value for that primitive.";
});
Primitive.method("value", function() {
	//console.log("Value!");
	//console.log(this.name);
	
	if (this.pastValues.length - 1 < timeIndex) {
		try{
			var x = this.calculateValue().toNum();
		}catch(err){
			if(! err.substr){
				throw err; //it's already an object, let's kick it up the chain
			}
			if(isLocal()){
				console.log(err);
			}
			if(err.substr(0,4) == "MSG:"){
				error(err.substr(4,err.length), this, true);
			}else{
				error(err, this, true);
			}
		}
		if(! (this instanceof State)){
			//console.log(this.name);
			this.testUnits(x);
			this.testConstraints(x);
		}
		this.pastValues.push(x);
	}
	while (this.pastValues.length - 1 < timeIndex) {
		this.pastValues.push(x);
	}
	
	var x = this.pastValues[timeIndex];
	
	if(x && x.fullClone){
		return this.pastValues[timeIndex].fullClone();
	}else{
		return x;
	}
});
Primitive.method("testConstraints", function(x) {
	if ((this.maximumConstraintType == 1 && x.value > this.maximumConstraint) || (this.maximumConstraintType == 2 && x.value >= this.maximumConstraint)) {
		constraintAlert(this, "max", x);
	}
	if ((this.minimumConstraintType == 1 && x.value < this.minimumConstraint) || (this.minimumConstraintType == 2 && x.value <= this.minimumConstraint)) {
		constraintAlert(this, "min", x);
	}
});
Primitive.method("setEquation", function(tree, neighborhood) {

	//console.log("==");
	//console.log(this.name);
	//console.log(tree);
	if (this instanceof Flow || this instanceof Transition) {
		if(this.omega !== null){
			neighborhood.omega = this.omega;
		}
		if(this.alpha !== null){
			neighborhood.alpha = this.alpha;
		}
	}
		
	try{
		this.equation = trimTree(tree, neighborhood);
	}catch(err){
		if(isLocal()){
			console.log(err);
		}
		error(err.substr(4,err.length), this, true);
	}
})

function Placeholder(dna, primitive){
	Primitive.call(this);
	this.id = dna.id;
	this.name = dna.name;
	this.dna = dna;
	this.primitive = primitive;
}
Placeholder.inherits(Primitive);
Placeholder.method("calculateValue",function(){
	error("["+this.dna.name+"] is a placeholder and cannot be used as a direct value in equations.", this.primitive, true);
});

function State() {
	Primitive.call(this);
	this.active = null;
	this.oldActive = null;
	this.arrivalTime = null;
	this.oldArrivalTime = null;
	this.constructorFunction = State;
}
State.inherits(Primitive);
State.method("innerClone", function(p){
	p.active = this.active;
	p.oldActive = this.oldActive;
	p.arrivalTime = this.arrivalTime;
	p.oldArrivalTime = this.oldArrivalTime;
});
State.method("setValue", function(value) {
	//console.log("--")
	if(this.active === false && trueValue(value)){
		this.arrivalTime = time.fullClone();
	}
	this.active = trueValue(value);
	this.value();
	this.clearPastValues(1);
	//console.log(value.value.toString());
	//console.log(this.value().value.toString());
});
State.method("preserveActive", function() {
	this.oldActive = this.active;
	this.oldArrivalTime = this.arrivalTime;
});
State.method("restoreActive", function() {
	this.active = this.oldActive;
	this.arrivalTime = this.oldArrivalTime;
});
State.method("calculateValue", function() {
	if (this.active === null) {
		//console.log("calc");
		this.setInitialActive();
	}
	
	if (this.active){
		return new Material(1);
	}else{
		return new Material(0);
	}
});
State.method("setInitialActive", function() {
	var init;
	try{
		init = evaluateTree(this.equation, varBank).toNum();
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(isLocal()){
			console.log(err);
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, true);
		}else{
			error(err, this, true);
		}
	}
	
	if(init instanceof Vector){
		error("Cannot set the initial active state to a vector.", this, true);
	}

	this.active = trueValue(init);
	//console.log(this.active);
	if (this.active) {
		this.arrivalTime = timeStart.fullClone();
	}
});
State.method("getActive", function(){
	if (this.active === null) {
		//console.log("get");
		this.setInitialActive();
	}
	return this.active;
});


function Transition() {
	Primitive.call(this);
	this.alpha = null;
	this.omega = null;
	this.trigger = null;
	this.constructorFunction = Transition;
}
Transition.inherits(Primitive);
Transition.method("innerClone", function(p){
	p.trigger = this.trigger;
});
Transition.method("setEnds", function(alpha, omega) {
	this.alpha = alpha;
	this.omega = omega;
});
Transition.method("calculateValue", function() {
	if(this.alpha && this.alpha.getActive()){
		var x = evaluateTree(this.equation, varBank).toNum();
		
		if(x instanceof Vector){
			error("Cannot set the value of a transition to a vector.", this, true);
		}
		
		if(x===true){
			return new Material(1);
		}else if(x===false){
			return new Material(0);
		}else{
			return x;
		}
	}else{
		return  new Material(0);
	}
});
Transition.method("transition", function() {
	if(this.alpha && this.alpha.getActive() && ( eq(timeStart, time) || (! eq(this.alpha.arrivalTime, time)))){
		if(this.trigger == "Timeout"){
			var v = this.value().toNum();
			if(unitless(v.units)){
				v.units = time.units.clone();
			}
			if(greaterThanEq(minus(time, this.alpha.arrivalTime), v)  ){
				this.doTransition();
			}
			
		}else if(this.trigger == "Condition"){
			if(trueValue(this.value().toNum())){
				this.doTransition();
			}
		}else if(this.trigger == "Probability"){
			var v = this.value().toNum();
			if(unitless(v.units)){
				if(greaterThanEq(v, new Material(1))){
					this.doTransition();
				}else if(lessThanEq(v, new Material(0))){
					//do nothing...
				}else if(lessThanEq(functionBank["rand"]([]), minus(new Material(1), power(minus(new Material(1), v), new Material(timeStep.value))))){
					this.doTransition();
				}
			}else{
				error("The probability for the trigger had units of "+this.value().units.toString()+". Probabilities must be unitless.", this, true);
			}
		}else{
			error("Unknown trigger: "+this.trigger, this, true);
		}
	}else{
		this.value();
	}
});
Transition.method("doTransition", function() {
	this.alpha.active = false;
	this.alpha.arrivalTime = null;
	if(this.omega){
		this.omega.active = true;
		this.omega.arrivalTime = time.fullClone();
	}
});

function Action() {
	Primitive.call(this);
	this.trigger = null;
	this.action = null;
	this.timerStart = null;
	this.constructorFunction = Action;
}
Action.inherits(Primitive);
Action.method("innerClone", function(p){
	p.trigger = this.trigger;
	p.timerStart = this.timerStart;
});
Action.method("resetTimer", function(){
	this.timerStart = time.fullClone();
});
Action.method("test", function() {
	var value;
	try{
		value = evaluateTree(this.equation, varBank).toNum();
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(isLocal()){
			console.log(err);
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, false);
		}else{
			error(err, this, false);
		}
	}
	if(this.trigger == "Timeout"){
		var v = value;
		if(unitless(v.units)){
			v.units = time.units.clone();
		}
		if(greaterThanEq(minus(time, this.timerStart), v)  ){
			this.act();
		}
	}else if(this.trigger == "Condition"){
		if(trueValue(value)){
			this.act();
		}
	}else if(this.trigger == "Probability"){
		var v = value;
		if(unitless(v.units)){;
			if(greaterThanEq(v, new Material(1))){
				this.act();
			}else if(lessThanEq(v, new Material(0))){
				//do nothing...
			}else if(lessThanEq(functionBank["rand"]([]), minus(new Material(1), power(minus(new Material(1), v), new Material(timeStep.value))))){
				this.act();
			}
		}else{
			error("The probability for the trigger had units of "+this.value().units.toString()+". Probabilities must be unitless.", this, true);
		}
	}else{
		error("Unknown trigger: "+this.trigger, this, true);
	}
	
});
Action.method("act", function() {
	try{
		evaluateTree(this.action, varBank);
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(isLocal()){
			console.log(err);
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, true);
		}else{
			error(err, this, true);
		}
	}
});

function Agents() {
	Primitive.call(this);
	this.size = null;
	this.agents = null;
	this.geoWidth = null;
	this.geoHeight = null;
	this.halfWidth = null;
	this.halfHeight = null;
	this.geoDimUnits = null;
	this.geoDimUnitsObject = null;
	this.geoWrap = null;
	this.DNA = null;
	this.nextDie = [];
	this.nextCreate = [];
	this.stateIds = [];
	this.constructorFunction = Agents;
}
Agents.inherits(Primitive);
Agents.method("collectData", function() {
	var u = this.geoDimUnitsObject;
	return this.agents.map(function(agent){
		var state = agent.state();
		return {id: agent.id, instanceId: agent.instanceId, connected: agent.connected.map(function(x){return x.instanceId}), location: simpleNum(agent.location.clone(), u), state: state?state.slice():null};
	});
});
Agents.method("states", function() {
	return this.stateIds.slice(0);
});
Agents.method("toNum", function(){
	return this;
});
Agents.method("add", function(base){
	this.size = 1 + parseInt(this.size, 10);
	//console.log("----");
	if(base){
		var agent = base.agentClone();
		agent.setIndex(this.size-1);
		agent.createAgentIds();
		for(var i = 0; i < this.DNA.length; i++){
			agent.children[i].parent = agent;
			linkPrimitive(agent.children[i], this.DNA[i]);
		}
	}else{
		//console.log("-----");
		var agent = new Agent();
		agent.parent = this;
		agent.children = [];
		agent.childrenId = {};
		agent.agentId = this.agentId;
		
		for(var i = 0; i < this.DNA.length; i++){
			decodeDNA(this.DNA[i], agent);
		}

		agent.setIndex(this.size-1);
		agent.createAgentIds();
		
		for(var i = 0; i < this.DNA.length; i++){
			linkPrimitive(agent.children[i], this.DNA[i]);
		}

		setAgentInitialValues(agent);
		
		var hood  =  getPrimitiveNeighborhood(this, this.dna);
		//console.log(hood);
		if(this.placement == "Custom Function"){
			hood.self = agent;
			agent.location = simpleUnitsTest(simpleEquation(this.placementFunction, varBank, hood), this.geoDimUnitsObject);
		}else{
			agent.location = new Vector([mult(this.geoWidth, new Material(Rand())),mult(this.geoHeight, new Material(Rand()))]);
		}
		if(this.network == "Custom Function"){
			var tree = trimTree(createTree(this.networkFunction), hood);
			for(var j = i+1; j < this.agents.length; j++){
				if(trueValue(simpleEquation(this.networkFunction, {"-parent": varBank, "a": agent, "b": this.agents[j]}, hood, tree))){
					agent.connect(this.agents[j]);
				}
			}
		}
		
	}
	
	this.nextCreate.push(agent);
	
	simulate.agentsChanged = true;
});

function Agent() {
	Primitive.call(this);
	this.index = null;
	this.children = null;
	this.location = null;
	this.connected = [];
	this.dead = false;
	this.constructorFunction = Agent;
}
Agent.inherits(Primitive);
Agent.method("toNum", function(){
	return this;
});
Agent.method("agentClone", function(){
	var agent = new Agent();
	agent.children = [];
	agent.childrenId = {};
	
	for(var i = 0; i < this.children.length; i++){
		agent.children.push(this.children[i].clone());
		agent.childrenId[agent.children[i].id] = agent.children[i];
	}

	agent.location = this.location.clone();
	agent.connected = this.connected.slice(0);
	agent.parent = this.parent;
	
	return agent;
});
Agent.method("setIndex", function(index){
	this.index = index;
	for(var i=0; i<this.children.length; i++){
		this.children[i].index = index;
	}
});
Agent.method("createAgentIds", function(){
	this.createIds();
	for(var i=0; i<this.children.length; i++){
		this.children[i].createIds();
	}
})
Agent.method("die", function(){
	while( this.connected.length > 0 ){
		this.unconnect(this.connected[0]);
	}
	
	for(var i=0; i<this.parent.agents.length; i++){
		if(this.parent.agents[i].fullId == this.fullId){
			this.parent.agents.splice(i,1);
			break;
		}
	}
	
	this.dead = true;
	simulate.agentsChanged = true;
});
Agent.method("state", function() {
	var states = [];
	for(var c = 0; c < this.children.length; c++){
		if(this.children[c].active){
			states.push(this.children[c]);
		}
	}
	//console.log(states);
	if(states.length > 0){
		return states;
	}else{
		return null;
	}
});
Agent.method("connect", function(x) {
	if(x.instanceId != this.instanceId){
		var i = indexOfID(this.connected, x.instanceId);
		if(i == -1){
			this.connected.push(x);
			x.connected.push(this);
		}
	}
});
Agent.method("unconnect", function(x) {
	if(x.instanceId != this.instanceId){
		var i = indexOfID(this.connected, x.instanceId);
		if(i != -1){
			this.connected.splice(i,1);
			i = indexOfID(x.connected, this.instanceId)
			x.connected.splice(i, 1);
		}
	}
});

function indexOfID(arr, id){
	for(var i = 0; i < arr.length; i++){
		if(arr[i].instanceId==id){
			return i;
		}
	}
	return -1;
}

function Stock() {
	Primitive.call(this);
	this.level = [null];
	this.oldLevel = [];
	this.nonNegative = false;
	this.delay = new Material(0);
	this.constructorFunction = Stock;
}
Stock.inherits(Primitive);
Stock.method("innerClone", function(p){
	p.level = this.level.slice(0);
	p.oldLevel = this.oldLevel.slice(0);
	p.nonNegative = this.nonNegative;
	p.delay = this.delay;
});
Stock.method("setValue", function(value) {
	//console.log("--")
	this.level[this.level.length-1] = value;
	this.value();
	this.clearPastValues(1);
	//console.log(value.value.toString());
	//console.log(this.value().value.toString());
});
Stock.method("stepForward", function() {
	if (this.level.length > 1) {
		for (var i = this.level.length - 1; i > 0; i--) {
			this.level[i] = plus(this.level[i], this.level[i - 1]);
			this.level[i - 1] = new Material(0, this.units.clone());
		}
	}
});
Stock.method("preserveLevels", function() {
	this.oldLevel = [];
	for (var i = 0; i < this.level.length; i++) {
		this.oldLevel.push(this.level[i]);
	}
});
Stock.method("restoreLevels", function() {
	this.level = [];
	for (var i = 0; i < this.oldLevel.length; i++) {
		this.level.push(this.oldLevel[i]);
	}
});
Stock.method("setDelay", function( ){
  this.setBuckets(Math.ceil(div(this.delay, timeStep).value)+1);
});
Stock.method("setBuckets", function( count ){
	this.level = [];
	for(var i = 0; i < count; i++){
		this.level.push(new Material(0, this.units.clone()));
	}
});
Stock.method("setInitialValue", function() {
	var init;
	
	//console.log("Setting Initial value:"+this.name);
	try{
		init = evaluateTree(this.equation, varBank).toNum();
	//	console.log(init);
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(isLocal()){
			console.log(err);
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, true);
		}else{
			error(err, this, true);
		}
	}
	
	if(init instanceof Vector){
		error("Cannot set the initial value of a stock to a vector.", this, true);
	}
	if(typeof init == "boolean"){
		if(init){
			init = new Material(1);
		}else{
			init = new Material(0);
		}
	}
	
	if (this.nonNegative && init.value < 0) {
		init = new Material(0, this.units.clone());
	}
	if (unitless(init.units)) {
		init.units = this.units.clone();
	}

	//this.testUnits(init);
	//this.testConstraints(init);

	init = [init];
	if (this.level.length == 1) { //it's a non-serialized stock;
		this.level = init;
	} else { 
		//it's serialized
		var per = div(init[0], new Material(this.level.length-1));
		for(var i=1; i<this.level.length; i++){
			this.level[i] = per;
		}
	}
});
Stock.method("subtract", function(amnt) {
	this.level[this.level.length - 1] = minus(this.level[this.level.length - 1], amnt);
	if (this.nonNegative && this.level[this.level.length - 1].value < 0) {
		this.level[this.level.length - 1] = new Material(0, this.units.clone());
	}
});
Stock.method("add", function(amnt) {
	this.level[0] = plus(this.level[0], amnt);
	if (this.nonNegative && this.level[0].value < 0) {
		this.level[0] = new Material(0, this.units.clone());
	}
});
Stock.method("totalContents", function() {
	var res = new Material(0, this.units.clone());
	for (var i = 0; i < this.level.length; i++) {;
		res = plus(res, this.level[i]);
	}
	return res;
});
Stock.method("calculateValue", function() {
	//console.log(this.name);
	//console.log(this.level.length);
	if (this.level[0] === null) {
		//console.log("Init");
		this.setInitialValue();
	}
	//console.log(this.level);
	//console.log(this.equation);
	//console.log(this.units);
	if (this.level.length > 1 && RKOrder == 4) {
		return plus(this.level[this.level.length - 1], this.level[this.level.length - 2]);
	} else {
		return this.level[this.level.length - 1];
	}
});

function Converter() {
	Primitive.call(this);
	this.inputs = [];
	this.outputs = [];
	this.interpolation = "linear";
	this.source = null;
	this.constructorFunction = Converter;
}
Converter.inherits(Primitive);
Converter.method("innerClone", function(p){
	p.interpolation = this.interpolation;
	p.inputs = this.inputs.slice(0);
	p.outputs = this.outputs.slice(0);
});
Converter.method("setSource", function(source){
	this.source = source;
});
Converter.method("setData", function(input, output){
	this.inputs = input;
	this.outputs = output;
});
Converter.method("getInputValue", function(){
     var inp;
     if( this.source == "*time"){
        inp = time;
      }else{
		  /*console.log("---")
		  console.log(this.source.value());
		  console.log("====")*/
        inp = this.source.value().toNum();
		if(! inp){

			error("Undefined input value.", this, false);
			
		}
		//console.log(inp);
      }
      return inp;
  }
);
Converter.method("calculateValue", function() {
	return new Material(this.getOutputValue(), this.units.clone());
});
Converter.method("getOutputValue", function() {
	//console.log("---")
	
	var inp = this.getInputValue();

	if (this.inputs.length == 0) {
		return new Material(0);
	}
	//console.log("+++")
	for (var i = 0; i < this.inputs.length; i++) {
		if (this.interpolation == "discrete") {

			if (greaterThan(this.inputs[i], inp)) {
				if (i == 0) {
					return this.outputs[0];
				} else {
					return this.outputs[i - 1];
				}
			}

		} else if (this.interpolation == "linear") {
			//console.log(i)
			if (eq(this.inputs[i], inp)) {
				//console.log("eq")
				return this.outputs[i];
			} else if (greaterThan(this.inputs[i], inp)) {
				//console.log("gt")
				if (i == 0) {
					return this.outputs[0];
				} else {
					///console.log("----")
					//console.log(mult(minus(inp, this.inputs[i - 1]), this.outputs[i]));
					//console.log(mult(minus(this.inputs[i], inp), this.outputs[i - 1]))
					var x = div(
						plus(
							mult(minus(inp, this.inputs[i - 1]), this.outputs[i]),
							mult(minus(this.inputs[i], inp), this.outputs[i - 1])
						),
						minus(this.inputs[i], this.inputs[i - 1]));
					//console.log("===")
					return x;
				}
			}
		}
	}
		return this.outputs[this.outputs.length-1];
	});


function Variable() {
	Primitive.call(this);
	this.constructorFunction = Variable;
}
Variable.inherits(Primitive);
Variable.method("innerClone", function(p){
});
Variable.method("calculateValue", function() {
	//console.log("calc!");
	//console.log("--");
	//console.log(this.name);
	//console.log(this.equation);
	var x = evaluateTree(this.equation, varBank).toNum();
	//console.log(x);
	//return x;
	if(typeof x == "boolean"){
		if(x){
			x = new Material(1);
		}else{
			x = new Material(0);
		}
	}else if(x instanceof Vector){
		return x;
	//	error("Cannot set a variable value to a vector.", this, true)
	}
	if(unitless(x.units)) {
		x.units = this.units.clone();
	}
	return x;
});

function Flow() {
	Primitive.call(this);
	this.alpha = null;
	this.omega = null;
	this.onlyPositive = true;
	this.timeIndependent = false;
	this.primaryRate = null;
	this.RKPrimary = [];
	this.constructorFunction = Flow;
}
Flow.inherits(Primitive);
Flow.method("innerClone", function(p){
	p.onlyPositive = this.onlyPositive;
	p.timeIndependent = this.timeIndependent;
});
Flow.method("setEnds", function(alpha, omega) {
	this.alpha = alpha;
	this.omega = omega;
});
Flow.method("calculateValue", function() {
	this.predict();
	var sr = this.scaledPrimaryRate();
	if ((!this.onlyPositive) || sr.value >= 0) {
		return sr;
	} else {
		return new Material(0, this.units.clone());
	}
});
Flow.method("clean", function() {
	this.primaryRate = null;
	//console.log("clean: "+this.id)
	this.RKPrimary = [];
});
Flow.method("predict", function() {
	if (this.primaryRate === null) {
		try{
			//console.log("---");
			var x = evaluateTree(this.equation, varBank).toNum();
			//console.log(this.equation);
			//console.log(x);
		}catch(err){
			if(! err.substr){
				throw err; //it's already an object, let's kick it up the chain
			}
			if(isLocal()){
				console.log(err);
			}
			if(err.substr(0,4)=="MSG:"){
				error(err.substr(4,err.length), this, true);
			}else{
				error(err, this, true);
			}
		}
		if(x instanceof Vector){
			error("Cannot set the value of a flow to a vector.", this, true);
		}else if(typeof x== "boolean"){
			if(x){
				x = new Material(1);
			}else{
				x = new Material(0);
			}
		}
		
		this.primaryRate = x.fullClone();
		
		//console.log(this.primaryRate.units);
		if (unitless(this.primaryRate.units)) {
			this.primaryRate.units = this.units.clone();
		}
		//console.log("---")
//		console.log(this.primaryRate)
		this.testUnits(this.primaryRate, true);
		//console.log("+++")
		
		if (this.timeIndependent) {
			if (RKOrder == 4) {
				this.primaryRate = div(this.primaryRate, new Material(2));
			}
		} else {
			this.primaryRate = mult(this.primaryRate, timeStep);
		}
		//console.log("push: "+this.id)
		this.RKPrimary.push(this.primaryRate);
	}
});
Flow.method("scaledPrimaryRate", function() {
	var sr = this.primaryRate==null?null:this.primaryRate.fullClone();
	

	if (RKOrder > 1) {
		if (this.timeIndependent && this.RKPrimary.length > 0) {
			sr = this.RKPrimary[0];
		} else {
			if (RKOrder == 2 && RKPosition == 2) {
				sr = div(plus(this.RKPrimary[0], this.RKPrimary[1]), new Material(2));
			} else if (RKOrder == 4) {
				if (RKPosition == 1) {
					sr = this.RKPrimary[0];
				} else if (RKPosition == 2) {
					sr = this.RKPrimary[1];
				} else if (RKPosition == 3) {
					sr = this.RKPrimary[2];
				} else if (RKPosition == 4) {
					//console.log(this);
					//console.log(this.RKPrimary);
					
					sr = div((plus(plus(plus(this.RKPrimary[0], mult(new Material(2), this.RKPrimary[1])), mult(new Material(2), this.RKPrimary[2])), this.RKPrimary[3])), new Material(6));
				}
			}
		}
	}
	
	if (this.timeIndependent) {
		if (RKOrder == 4) {
			sr = div(sr, new Material(2));
		}
	} else {
		sr = div(sr, timeStep);
	}
	
	return sr;
});
Flow.method("apply", function() {
	try{
		var rate = this.scaledPrimaryRate();
	
		//console.log(rate);
	
		if (this.timeIndependent) {
			if (RKOrder == 4) {
				//secondary_rate = calculate_secondary(my_primary_rate)/2;
				rate = div(rate, 2);
			} else {
				//secondary_rate = calculate_secondary(my_primary_rate);
			}
		} else {
			//secondary_rate = calculate_secondary(my_primary_rate) * (TimeStep / Per);
			//my_primary_rate = my_primary_rate * (TimeStep / Per);
			rate = mult(rate, timeStep);
		}

		//console.log(rate);
	
		var in_r = rate;
		var out_r = rate;

		if (this.onlyPositive == false || rate.value >= 0) {
			if (this.omega !== null && this.omega.nonNegative) {
				if (plus(this.omega.value().toNum(), out_r).value < 0 ) {
					var modifier = plus(this.omega.value().toNum(), out_r);
					out_r = minus(out_r, modifier);
					in_r = minus(in_r, modifier);
				}
			}
		
			if (this.alpha !== null && this.alpha.nonNegative) {
				if (minus(this.alpha.value().toNum(), in_r).value < 0) {
					var modifier = minus(this.alpha.value().toNum(), in_r);
					out_r = plus(out_r, modifier);
					in_r = plus(in_r, modifier);
				}
			}
			if (this.omega !== null && this.omega.nonNegative) {
				if (plus(this.omega.value().toNum(), out_r).value < 0) {
					error("Inconsistent non-negative constraints for flow.", this, false);
				}
			}

			if (this.omega !== null) {
				this.omega.add(out_r);
			}
			if (this.alpha !== null) {
				this.alpha.subtract(in_r);
			}
		}
		//console.log("null: "+this.id)
		this.primaryRate = null;
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, true);
		}else{
			error(err, thi, true);
		}
	}
});
