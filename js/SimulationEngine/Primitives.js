"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


function Primitive() {
	this.id = null;
	this.agentId = null;
	this.index = null;
	this.instanceId = null;

	this.container = null;

	this.dna = null;

	this.equation = null;

	this.cachedValue = undefined;
	this.pastValues = [];
	this.pastData = new DataBank();

	this.frozen = false;

	this.parent = PrimitiveBase;
}
Primitive.method("clone", function(){
	var p = new this.constructorFunction();
	p.dna = this.dna;
	p.container = this.container;
	p.agentId = this.agentId;
	p.index = this.index;
	p.id = this.id;
	p.createIds();
	p.pastValues = this.pastValues.slice(0);

	if(this.dna.slider){
		if(simulate.sliders[this.dna.id]){
			simulate.sliders[this.dna.id].push(p);
		}else{
			simulate.sliders[this.dna.id] = [p];
		}

	}

	p.cachedValue = this.cachedValue?this.cachedValue.fullClone():this.cachedValue;

	this.innerClone(p);

	return p;
});
Primitive.method("clearCached", function(){
	this.cachedValue = undefined;
});
Primitive.method("storeValue", function(){
	if(isUndefined(this.cachedValue)){
		this.value();
	}
	this.pastValues.push(this.cachedValue)
})
Primitive.method("toNum", function(){
	return this.value();
});
Primitive.method("calculateValue", function() {
	throw "MSG: "+getText("[%s] does not have a value and can not be used as a value in an equation.", this.dna.name);
});
Primitive.method("createIds", function(){
	this.instanceId = simulate.getID(this.agentId+"-"+this.index);
});
Primitive.method("getPastValues",  function( length ){

	var items = this.pastValues.slice();

	/* Add current value to array if needed */
	var bins =  Math.ceil(div(simulate.time(), this.dna.solver.userTimeStep).value)+1;
	if(items.length < bins){
		items.push(this.value());
	}

    if( isUndefined(length) ){
      res = items.map(function(x){return x.fullClone()});
    }else{
		var bins =  Math.ceil(div(length.forceUnits(simulate.timeUnits), this.dna.solver.userTimeStep).value);

		var res = [];
	    for(var i = Math.max(0, items.length-1-bins); i < items.length; i++){
			res.push(items[i].fullClone());
	    }
	}

	//res = [this.value().fullClone()].concat(res);
	//console.log(res.map(function(x){return x.value}));
    return res;
});
Primitive.method("pastValue", function pastValue(delay, defaultValue){
    var periods;

    if( this.pastValues.length - 1 < Math.round((simulate.time().value-simulate.timeStart.value)/this.dna.solver.userTimeStep.value) ){
      periods  = div(delay.forceUnits(simulate.timeUnits), this.dna.solver.userTimeStep).value;
    }else{
      periods  = div(delay.forceUnits(simulate.timeUnits), this.dna.solver.userTimeStep).value + 1;
    }

	if(periods == 0){
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

Primitive.method("smoothF", function(delay, initialV){
	//console.log("--")
    var a =  div(this.dna.solver.userTimeStep, delay.forceUnits(simulate.timeUnits)).value;

    var dat =  this.pastData.getSeries( "Smooth: " + a + "," + initialV );

    if( dat.length == 0 ){
      if( isUndefined(initialV) ){
        dat.push(this.pastValues[0]?this.pastValues[0]:this.value());
      }else{
        dat.push(initialV);
      }
    }

	//console.log("--")
	//console.log(this.pastValues.slice())
	//console.log(dat.slice())
	var maxInd = Math.floor((simulate.time().value-simulate.timeStart.value)/this.dna.solver.userTimeStep.value);

    for(var i = dat.length-1; i < maxInd; i++){
		var m =  this.pastValues[i]?this.pastValues[i]:(this.cachedValue?this.cachedValue:this.pastValues[i-1]);
		//console.log(m.value);
		dat.push(plus(mult(dat[i], new Material(1-a)), mult(new Material(a), m)));
    }
	//if(dat.length <= maxInd){
	//	dat.push(plus(mult(dat[i-1], new Material(1-a)), mult(new Material(a), this.value())));
	//}

    return dat[dat.length-1].fullClone();
  });
Primitive.method("expDelayF", function( order , delay , initialV ){
    this.value();

    var  a =  div(this.dna.solver.userTimeStep, delay.forceUnits(simulate.timeUnits)).value * order;

    var  dat =  this.pastData.getSeries("ExpDelay: " + order+"," + delay.value + "," + initialV);

    if( dat.length == 0 ){
      if( isUndefined(initialV) ){
        dat.push(new ExpGroup( order, a, this.pastValues[0]?this.pastValues[0]:this.value() ));
      }else{
        var exIV = new ExpGroup( order, a, initialV );
        dat.push(exIV.moveForward( this.pastValues[0]?this.pastValues[0]:this.value() ));
      }
    }

    for(var i = dat.length; i < this.pastValues.length; i++){
      dat.push(dat[i-1].moveForward(this.pastValues[i]));
    }
    //console.log(dat);
    return dat[dat.length-1].out.fullClone();
  });
Primitive.method("testUnits", function(m, ignoreFlow) {
	//console.log("testing units")
	if(m instanceof Vector){
		var me = this;
		m.recurseApply(function(x){
			me.testUnits(x, ignoreFlow);
			return x;
		});
		return
	}

	if((! this.dna.units) && m.units){
		error(getText("Wrong units generated for %s. Expected no units and got %s. Either specify units for the primitive or adjust the equation.", "<i>"+clean(this.dna.name)+"</i>", "<i>"+clean(m.units.toString())+"</i>"), this, true);
	}else if (this.dna.units !== m.units) {
		var scale = convertUnits(m.units, this.dna.units, true);//XXX fixme
		if (scale == 0) {
			if(isLocal()){
				console.log(m.units);
				console.log(this.dna.units);
			}
			error(getText("Wrong units generated for %s. Expected %s, and got %s.", "<i>"+clean(this.dna.name)+"</i>", "<i>"+clean(this.dna.units.toString())+"</i>", "<i>"+clean(m.units.toString())+"</i>"), this, true);
			return
		} else {
			//console.log("----+")
			//console.log("mod1")
			//console.log(m.units.exponents)
			m.value = m.value * scale;
			m.units = this.dna.units;
			//console.log(m.units.exponents)
			//console.log((this instanceof Flow));
			//console.log(ignoreFlow);
		}
	}
	if((this instanceof Flow) && (ignoreFlow != true) && this.dna.flowUnitless){
			//console.log("mod2")
			//console.log(m.units.exponents)
		var x = mult(m, new Material(1, simulate.timeUnits));
		m.value = x.value;
		m.units = x.units;

		//console.log(m.units.exponents)
		//console.log("done")
	}
});
Primitive.method("setValue", function() {
	throw "MSG: "+getText("You cannot set the value for that primitive.");
});
Primitive.method("printPastValues", function() {
	console.log(this.pastValues.map(function(x){return x.value;}))
});

Primitive.method("value", function() {

	if(isUndefined(this.cachedValue) && this.frozen && this.pastValues.length > 0 ){
		var v = this.pastValues[this.pastValues.length - 1];
		if(v.fullClone){
			this.cachedValue = v.fullClone();
		}else{
			this.cachedValue = v;
		}
	}

	if (isUndefined(this.cachedValue)) {


		if(simulate.valuedPrimitives.indexOf(this) > -1){
			throw "MSG: "+getText("Circular equation loop identified including the primitives: %s", simulate.valuedPrimitives.slice(simulate.valuedPrimitives.indexOf(this)).map(function(x){return x.dna.name}).join(", "));
		}
		simulate.valuedPrimitives.push(this);

		try{
			var x = this.calculateValue().toNum();
			if((x instanceof Material) && ! isFinite(x.value)){
				if(isLocal()){
					console.log(x)
				}
				if(this instanceof Stock){
					throw("MSG: "+getText("The stock has become infinite in size. Check the flows into it for rapid growth."));
				}else{
					throw("MSG: "+getText("The result of this calculation is not a number (are you dividing by 0?)."));
				}
			}
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
			this.testUnits(x);
			this.testConstraints(x);
		}
		//if (this.pastValues.length - 1 < simulate.timeIndex-1) {
		//	this.pastValues = [];
			//this.pastValues.push(null);
		//	this.cutoff = simulate.timeIndex;
		//}
		this.cachedValue = x;
	}


	if(this.cachedValue.fullClone){
		return this.cachedValue.fullClone();
	}else{
		return this.cachedValue;
	}
});
Primitive.method("testConstraints", function(x) {
	var me = this;
	var test = function(x){
		if ((me.dna.maxConstraintType == 1 && x.value > me.dna.maxConstraint) || (me.dna.maxConstraintType == 2 && x.value >= me.dna.maxConstraint)) {
			constraintAlert(me, "max", x);
		}
		if ((me.dna.minConstraintType == 1 && x.value < me.dna.minConstraint) || (me.dna.minConstraintType == 2 && x.value <= me.dna.minConstraint)) {
			constraintAlert(me, "min", x);
		}
		return x;
	}
	if(x instanceof Vector){
		x.recurseApply(test);
	}else{
		test(x);
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
	this.dna = dna;
	this.id = dna.id;
	this.primitive = primitive;
}
Placeholder.inherits(Primitive);
Placeholder.method("calculateValue",function(){
	error(getText("[%s] is a placeholder and cannot be used as a direct value in equations.", clean(this.dna.name)), this.primitive, true);
});

function State() {
	Primitive.call(this);
	this.active = null;
	this.downStreamTransitions = [];
	this.constructorFunction = State;
}
State.inherits(Primitive);
State.method("innerClone", function(p){
	p.setValue(this.active);

});
State.method("setValue", function(value) {
	this.setActive(trueValue(value));
	this.cachedValue = undefined;
	simulate.valuedPrimitives = [];
	this.value();
	if(this.agentId){
		this.container.updateStates();
	}
});
State.method("calculateValue", function() {
	if (this.active === null) {
		//console.log("calc");
		this.setInitialActive(true);
	}

	if (this.active){
		return new Material(1);
	}else{
		return new Material(0);
	}

});
State.method("setInitialActive", function(suppress) {
	var init;

	try{
		init = evaluateTree(this.equation, globalVars(this)).toNum();
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

	//console.log("--")
	//console.log(this.dna.name)
	//console.log("init")

	this.setActive(trueValue(init), suppress);
	if(this.agentId){
		this.container.updateStates();
	}

});
State.method("setActive", function(active, suppress){
	this.active = active;

	if( (! active) || this.dna.residency === null){
		if(! suppress){
			if (active) {
				if (!simulate.transitionPrimitives) {
					simulate.transitionPrimitives = [];
				}

				if(simulate.transitionPrimitives.length > 1200 && simulate.transitionPrimitives.indexOf(this) > -1){
					throw "MSG: " + getText("Circular fully active transition loop identified including the states: %s", simulate.transitionPrimitives.slice(0, 5).map(function(x){return x.dna.name}).join(", "));
				}
				simulate.transitionPrimitives.push(this);
			}

			for(var i = 0; i < this.downStreamTransitions.length; i++){
				scheduleTrigger.call(this.downStreamTransitions[i]);
			}

			if (active) {
				simulate.transitionPrimitives = [];
			}

		}
	}else{
		var me = this;
		simulate.tasks.add(new Task({
			name: "State Residency",
			time: plus(simulate.time(), this.dna.residency),
			priority: 5,
			expires: 1,
			action: function(){
				for(var i = 0; i < me.downStreamTransitions.length; i++){
					scheduleTrigger.call(me.downStreamTransitions[i]);
				}
			}
		}));
	}

});
State.method("getActive", function(){
	if (this.active === null) {
		//console.log("get");
		this.setInitialActive(true);
	}
	return this.active;
});


function Transition() {
	Primitive.call(this);
	this.alpha = null;
	this.omega = null;
	this.scheduledTrigger = null;
	this.constructorFunction = Transition;
}
Transition.inherits(Primitive);
Transition.method("innerClone", function(p){
});
Transition.method("setEnds", function(alpha, omega) {
	this.alpha = alpha;
	this.omega = omega;
	if(alpha){
		alpha.downStreamTransitions.push(this);
	}
});
Transition.method("canTrigger", function() {
	return (! this.alpha) || (this.alpha && this.alpha.getActive()) || (this.dna.repeat && this.dna.trigger != "Condition");
});
Transition.method("trigger", function() {
	//console.log("--")
	//console.log(this.dna.name)
	//console.log(simulate.time().value);
	//console.log("transition");

	this.scheduledTrigger = null;

	if(this.frozen){
		return;
	}

	if(this.alpha){
		this.alpha.setActive(false);
	}
	if(this.omega){
		this.omega.setActive(true);
	}
	if(this.agentId){
		this.container.updateStates();
	}
	if(this.dna.repeat && this.dna.trigger != "Condition"){
		scheduleTrigger.call(this);
	}
});

function scheduleTrigger(){
	updateTrigger.call(this, true);

}

function clearTrigger(force){
	if(this.scheduledTrigger && (force || (! this.dna.repeat))){
		this.scheduledTrigger.kill();
		this.scheduledTrigger = null;
	}
}

function updateTrigger(clear){
	if( clear ){
		clearTrigger.call(this);
	}


	if( this.canTrigger() ){
		try{
			var v = evaluateTree(this.equation, globalVars(this)).toNum();
		}catch(err){
			if(! err.substr){
				throw err; //it's already an object, let's kick it up the chain
			}
			if(isLocal()){
				console.log(err);
			}
			if(err.substr(0,4)=="MSG:"){
				error(err.substr(4, err.length), this, true);
			}else{
				error(err, this, true);
			}
		}

		if(this.dna.trigger == "Condition"){
			if(trueValue(v)){
				//console.log("triggering")
				//console.log(v);
				this.trigger();
				//console.log("end triggering")
			}
		}else{
			if(! (v instanceof Material)){
				error(getText("The value of this trigger must evaluate to a number."), this, true);
			}

			var t;

			if( this.dna.trigger == "Timeout" ){

				if(! v.units){
					v.units = simulate.timeUnits;
				}

				if(this.scheduledTrigger && eq(v, this.scheduledTrigger.data.value)){
					return;
				}
				if(this.dna.repeat && v.value == 0){
					error(getText("A trigger Timeout of 0 with 'Repeat' set to true results in an infinite loop."), this, true);
				}

				t = v;

			}else if( this.dna.trigger == "Probability" ){

				if(v.units){
					error(getText("The probability for the trigger had units of %s. Probabilities must be unitless.", this.value().units.toString()), this, true);
				}
				var v = v.value
				if(this.scheduledTrigger && eq(v, this.scheduledTrigger.data.value)){
					return;
				}

				if(v == 1){
					if(this.dna.repeat){
						error(getText("A trigger probability of 1 with 'Repeat' as true results in an infinite loop."), this, true);
					}
					t = new Material(0, simulate.timeUnits);
				}else if(v > 1){
					error(getText("The probability for the trigger must be less than or equal to 1."), this, true);
				}else if(v < 0){
					error(getText("The probability for the trigger must be greater than or equal to 0."), this, true);
				}else if(v == 0){
					if(! this.scheduledTrigger){
						return;
					}
				}else{
					var l = -Math.log(1-v);
					t = new Material(RandExp(l), simulate.timeUnits);
				}

			}

			/*console.log("--");
			console.log(this);
			console.log(v);
			console.log(t);
			debugger;*/

			var start = simulate.time()

			if(this.scheduledTrigger){

				this.scheduledTrigger.kill();
				if(this.dna.trigger == "Timeout"){
					if(lessThanEq(t, minus(simulate.time(), this.scheduledTrigger.data.start))){
						this.scheduledTrigger = null;
						this.trigger();
						return;
					}else{
						var start = this.scheduledTrigger.data.start;
						t = minus(t, minus(simulate.time(), start));
						this.scheduledTrigger = null;
					}
				}else if(this.dna.trigger == "Probability"){
					if( v == 0){
						this.scheduledTrigger = null;
						return;
					}
					t = minus(this.scheduledTrigger.time, simulate.time());

					var l0 = -Math.log(1-this.scheduledTrigger.data.value);
					var l = -Math.log(1-v);

					t = mult(t, new Material(l0/l));

					start = this.scheduledTrigger.data.start;

					this.scheduledTrigger = null;
				}
			}
			//console.log(t);
			t = plus(t, simulate.time());

			var me = this;
			this.scheduledTrigger = new Task({
				name: "Trigger",
				time: t,
				priority: 5,
				expires: 1,
				action: function(){
					me.trigger();
				},
				data: {start: start, value: v}
			})
			simulate.tasks.add(this.scheduledTrigger);
		}
	}
}

function Action() {
	Primitive.call(this);
	this.action = null;
	this.scheduledTrigger = null;
	this.block = false;
	this.constructorFunction = Action;
}
Action.inherits(Primitive);
Action.method("innerClone", function(p){

});
Action.method("canTrigger", function() {
	return ! this.block;
});
Action.method("resetTimer", function(){
	scheduleTrigger.call(this);
});
Action.method("trigger", function() {

	this.scheduledTrigger = null;

	if(this.frozen){
		return;
	}

	try{
		//console.log("action")
		evaluateTree(this.action, globalVars(this));
		//console.log("end action")
		if(this.dna.repeat){
			if(this.dna.trigger !== "Condition"){
				scheduleTrigger.call(this);
			}
		}else{
			this.block = true;
		}
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
	this.DNAs = null;
	this.stateIds = [];
	this.constructorFunction = Agents;

	this.vector = new Vector([],[], PrimitiveBase);
}
Agents.inherits(Primitive);
Agents.method("collectData", function() {
	var x =[];
	for(var i=0; i<this.agents.length; i++){
		var agent = this.agents[i];
		x.push({instanceId: agent.instanceId, connected: agent.connected.map(function(x){return x.instanceId}), location: simpleNum(agent.location.clone(), this.geoDimUnitsObject), state: agent.states.length>0?agent.states.slice():null});
	}
	return x;
});
Agents.method("states", function() {
	return this.stateIds.slice(0);
});
Agents.method("toNum", function(){
	throw("MSG: "+getText("[%s] is a population of agents and cannot be used as a direct value in equations.", clean(this.dna.name)));
});
Agents.method("add", function(base){
	this.size = 1 + parseInt(this.size, 10);
	//console.log("----");
	if(base){
		var agent = base.agentClone();
		agent.agentId = this.agentId;
		agent.setIndex(this.size-1);
		agent.createAgentIds();

		for(var i = 0; i < this.DNAs.length; i++){
			var x = agent.children[i];
			var dna = this.DNAs[i];

			x.container = agent;

			linkPrimitive(x, dna);

		}

		agent.updateStates();

	}else{
		//console.log("-----");
		var agent = new Agent();
		agent.container = this;
		agent.children = [];
		agent.childrenId = {};
		agent.agentId = this.agentId;

		for(var i = 0; i < this.DNAs.length; i++){
			decodeDNA(this.DNAs[i], agent);
		}

		agent.setIndex(this.size-1);
		agent.createAgentIds();

		for(var i = 0; i < this.DNAs.length; i++){
			linkPrimitive(agent.children[i], this.DNAs[i]);
		}

		setAgentInitialValues(agent);

		var hood  =  getPrimitiveNeighborhood(this, this.dna);
		//console.log(hood);
		if(this.placement == "Custom Function"){
			hood.self = agent;
			agent.location = simpleUnitsTest(simpleEquation(this.placementFunction, {"-parent": varBank, self: agent}, hood), this.geoDimUnitsObject);
			if(! agent.location.names){
				agent.location.names = ["x", "y"];
				agent.location.namesLC = ["x", "y"];
			}
		}else{
			agent.location = new Vector([mult(this.geoWidth, new Material(Rand())),mult(this.geoHeight, new Material(Rand()))], ["x", "y"]);
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

	var me = this;
	simulate.tasks.add(new Task({
		priority: 10,
		expires: 1,
		name: "Add Agent",
		time: simulate.time(),
		action: function(){
			me.agents.push(agent);

			for(var i = 0; i < agent.children.length; i++){
				var x = agent.children[i];

				var dna = me.DNAs[i];

				if((x instanceof Action) || (x instanceof Transition)){
					if(dna.trigger != "Condition"){
						scheduleTrigger.call(x);
					}
				}

				if(base){
					if(x instanceof Action){
						dna.solver.actions.push(x);
					}else if (x instanceof Transition) {
						dna.solver.transitions.push(x);
					}else if(! (x instanceof Agents)){
						dna.solver.valued.push(x)
						if(x instanceof Flow) {
							dna.solver.flows.push(x);
						}else if (x instanceof Stock) {
							dna.solver.stocks.push(x);
						}else if (x instanceof State) {
							dna.solver.states.push(x);
						}
					}
				}


			}


		}
	}));

	return agent;
});


function Agent() {
	this.agentId = null;
	this.instanceId = null;
	this.index = null;
	this.children = null;
	this.location = null;
	this.connected = [];
	this.connectedWeights = [];
	this.dead = false;
	this.constructorFunction = Agent;
	this.stateIDs = [];
	this.states = [];

	this.vector = new Vector([],[], AgentBase);
}
Agent.prototype.createIds = Primitive.prototype.createIds;
Agent.method("toString", function(){
	return "Agent "+(this.index+1);
})
Agent.method("toNum", function(){
	return this;
	//throw("MSG: Invalid attempt to use an agent as a valued primitive.");
});
Agent.method("updateStates", function() {
	this.states = [];
	this.stateIDs = [];
	for(var c = 0; c < this.children.length; c++){
		if(this.children[c].active){
			this.states.push(this.children[c]);
			this.stateIDs.push(this.children[c].dna.id);
		}
	}
});
Agent.method("agentClone", function(){
	var agent = new Agent();
	agent.dna = this.dna;
	agent.children = [];
	agent.childrenId = {};

	for(var i = 0; i < this.children.length; i++){
		agent.children.push(this.children[i].clone());
		agent.childrenId[agent.children[i].dna.id] = agent.children[i];
	}

	agent.location = this.location.clone();
	agent.connected = this.connected.slice(0);
	agent.connectedWeights = this.connectedWeights.slice(0);
	agent.container = this.container;


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

	for(var i=0; i<this.container.agents.length; i++){
		if(this.container.agents[i] == this){
			this.container.agents.splice(i,1);
			break;
		}
	}

	for(var i = 0; i < this.children.length; i++){
		var x = this.children[i];
		var solver = x.dna.solver;
		if(x instanceof Action){
			solver.actions.splice(solver.actions.indexOf(x),1);
			clearTrigger.call(x, true);
		}else if(x instanceof Transition){
			solver.transitions.splice(solver.transitions.indexOf(x),1);
			clearTrigger.call(x, true);
		}else if(! (x instanceof Agents)){
			solver.valued.splice(solver.valued.indexOf(x),1);
			if(x instanceof Flow) {
				solver.flows.splice(solver.flows.indexOf(x),1);
			}
			else if (x instanceof Stock) {
				solver.stocks.splice(solver.stocks.indexOf(x),1);
			}
			else if (x instanceof State) {
				solver.states.splice(solver.states.indexOf(x),1);
			}
		}
	}


	this.dead = true;
});
Agent.method("connect", function(x, weight) {

	var w = (weight === undefined)?new Material(1):weight;
	if(x !== this){
		if(this.connected.indexOf(x) == -1){
			if(x instanceof Agent){
				this.connected.push(x);
				this.connectedWeights.push(w);
				x.connected.push(this);
				x.connectedWeights.push(w);
			}else{
				throw("MSG: Only agents may be connected.");
			}
		}else if(weight !== undefined){
			this.connectedWeights[this.connected.indexOf(x)] = weight;
			x.connectedWeights[x.connected.indexOf(x)] = weight;
		}
	}

});
Agent.method("unconnect", function(x) {
	if(x !== this){
		var i = this.connected.indexOf(x);
		if(i != -1){
			this.connected.splice(i, 1);
			this.connectedWeights.splice(i, 1);
			i = x.connected.indexOf(this);
			x.connected.splice(i, 1);
			x.connectedWeights.splice(i, 1);
		}
	}
});

Agent.method("connectionWeight", function(x) {
	if(x !== this){
		var i = this.connected.indexOf(x);

		if(i != -1){
			return this.connectedWeights[i].fullClone();
		}
	}
	throw "MSG: Agents are not connected and so do not have a connection weight.";
});

Agent.method("setConnectionWeight", function(x, w) {
	if(x !== this){
		var i = this.connected.indexOf(x);
		if(i != -1){
			this.connectedWeights[i] = w.fullClone();
			return;
		}
	}
	throw "MSG: Agents are not connected and so do not have a connection weight.";
});

function Stock() {
	Primitive.call(this);
	this.level = null;
	this.constructorFunction = Stock;
	this.delay = undefined;
	this.tasks = [];
	this.initRate = null;
	this.oldLevel;
}
Stock.inherits(Primitive);
Stock.method("innerClone", function(p){
	p.level = this.level;
	p.oldLevel = this.oldLevel;
	p.tasks = this.tasks;
	p.delay = this.delay;
});
Stock.method("setValue", function(value) {
	//console.log("--")
	this.level = value;
	this.cachedValue = undefined;
	simulate.valuedPrimitives = [];
	this.value();
});
Stock.method("print", function(){
	console.log(this.level.map(function(x){return x.value}));
});
Stock.method("preserveLevel", function() {
	//console.log("PRESERVING")
	//console.log("total:"+this.level.value)
	for(var i = this.tasks.length - 1; i >= 0; i--){
		this.tasks[i].data.tentative = false;
	}
	this.oldLevel = this.level;
});
Stock.method("restoreLevel", function() {
	//console.log("RESTORING")
	for(var i = this.tasks.length - 1; i >= 0; i--){
		if(this.tasks[i].data.tentative){
			this.tasks[i].remove();
			this.tasks.splice(i,1);
		}
	}
	this.level = this.oldLevel;
	//console.log("total: "+this.level.value)
});
Stock.method("setDelay", function(delay){
	delay = delay || this.dna.delay;
	this.delay = delay;
});
Stock.method("setInitialValue", function() {
	var me = this;
	var init;

	//console.log("Setting Initial value:"+this.dna.name);
	try{
		//console.log(this.equation);
		//console.log(globalVars(this))
		init = evaluateTree(this.equation, globalVars(this)).toNum();
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

	if(typeof init == "boolean"){
		if(init){
			init = new Material(1);
		}else{
			init = new Material(0);
		}
	}

	if(init instanceof Vector){
		var d = this.dna;
		init.recurseApply(function(x){
			if (d.nonNegative && x.value < 0) {
				x = new Material(0, d.units);
			}
			if (! x.units) {
				x.units = d.units;
			}
			return x;
		})
	}else{
		if (this.dna.nonNegative && init.value < 0) {
			init = new Material(0, this.dna.units);
		}
		if (! init.units) {
			init.units = this.dna.units;
		}
	}


	if (isUndefined(this.delay)) {
		//it's a non-serialized stock;
		this.level = init;
	} else {
		//it's serialized
		var startVal = mult(init, div(simulate.userTimeStep, this.delay))
		this.initRate = div(init, this.delay.forceUnits(simulate.timeUnits));
		//console.log(this.initRate);
		this.level = startVal;

		var me = this;

		simulate.tasks.addEvent(function(timeChange, oldTime, newTime){
			/*console.log('--')
			console.log(timeChange.value);
			console.log(me.totalContents().value);*/
			if(timeChange.value > 0){
				if(lessThanEq(minus(newTime, simulate.timeStart), minus(me.delay, simulate.userTimeStep))){
					timeChange = functionBank["min"]([timeChange, minus(me.delay, minus(oldTime, simulate.timeStart))]);
					me.level = plus(me.level, mult(timeChange, me.initRate));
				}
			}
		});
	}
});
Stock.method("subtract", function(amnt, time) {
	this.level = minus(this.level, amnt);
	if (this.dna.nonNegative) {
		if(this.level instanceof Vector){
			var d = this.dna;
			this.level.recurseApply(function(x){
				if(x.value < 0){
					return new Material(0, d.units);
				}else{
					return x;
				}
			});
		}else if(this.level.value < 0){
			this.level = new Material(0, this.dna.units);
		}
	}
});
Stock.method("add", function(amnt, time) {
	if(isUndefined(this.delay)){
		this.level = plus(this.level, amnt);
		if (this.dna.nonNegative) {
			if(this.level instanceof Vector) {
				var d = this.dna;
				this.level.recurseApply(function(x){
					if(x.value < 0){
						return new Material(0, d.units);
					}else{
						return x;
					}
				});
			}else if(this.level.value < 0){
				this.level = new Material(0, this.dna.units);
			}
		}
	}else{
		this.scheduleAdd(amnt, time);
	}
});
Stock.method("scheduleAdd", function(amnt, time, delay){
	//console.log("SCEDULING ADD "+time)
	//console.log(amnt)

	var me = this;
	delay = delay || this.delay;

	var oldLevel;

	var t = new Task({
		time: plus(time, delay),
		data: {
			amnt: amnt,
			tentative: true
		},
		priority: -100,
		name: "Conveyor Add ("+this.dna.name+")",
		action: function(){
			oldLevel = me.level;
			//console.log("ADDING "+amnt.value);
			me.level = plus(me.level, amnt);
			//console.log("total "+me.level.value);
			if (me.dna.nonNegative) {
				if(me.level instanceof Vector) {
					var d = me.dna;
					me.level.recurseApply(function(x){
						if(x.value < 0){
							return new Material(0, d.units);
						}else{
							return x;
						}
					});
				}else if(me.level.value < 0){
					me.level = new Material(0, me.dna.units);
				}
			}
		},
		rollback: function(){
			me.level = oldLevel;
		}
	});
	this.tasks.push(t);
	simulate.tasks.add(t);
})
Stock.method("totalContents", function() {
	if(isDefined(this.delay)){
		var res = this.level;
		for(var i = 0; i < this.tasks.length; i++){
			if(greaterThan(this.tasks[i].time, simulate.time()) && lessThanEq(this.tasks[i].time, plus(simulate.time(), this.delay)) ){
				res = plus(res, this.tasks[i].data.amnt);
			}
		}

		var x = minus(this.delay, simulate.userTimeStep);
		if(greaterThan(x, simulate.timeProgressed())){
			var timeLeft = minus(x, simulate.timeProgressed());
			res = plus(res, mult(this.initRate, timeLeft));
		}

		return res;
	}else{
		return this.level;
	}
});
Stock.method("calculateValue", function() {
	if (this.level === null) {
		this.setInitialValue();
	}
	if(isDefined(this.delay) && this.dna.solver.RKOrder == 4){
		var res = this.level;
		for(var i = 0; i < this.tasks.length; i++){
			if(greaterThan(this.tasks[i].time, simulate.time()) && lessThanEq(this.tasks[i].time, plus(simulate.time(), this.dna.solver.timeStep)) ){
				res = plus(res, this.tasks[i].data.amnt);
			}
		}
		return res;
	}else{
		return this.level;
	}
});

function Converter() {
	Primitive.call(this);
	this.source = null;
	this.constructorFunction = Converter;
}
Converter.inherits(Primitive);
Converter.method("innerClone", function(p){
});
Converter.method("setSource", function(source){
	this.source = source;
});
Converter.method("getInputValue", function(){
     var inp;
     if( this.source == "*time"){
        inp = simulate.time();
      }else{
		  /*console.log("---")
		  console.log(this.source.value());
		  console.log("====")
		  console.log(this.source);
		  console.log(this.source.value())
		  console.log(this.source.value().toNum());
		  */
        inp = this.source.value().toNum();
		if(! inp){
			error(getText("Undefined input value."), this, false);
		}
		if(inp instanceof Vector){
			error(getText("Converters do not accept vectors as input values."), this, false);
		}
		//console.log(inp);
      }
      return inp;
  }
);
Converter.method("calculateValue", function() {
	return new Material(this.getOutputValue().value, this.dna.units);
});
Converter.method("getOutputValue", function() {
	//console.log("---")

	var inp = this.getInputValue();

	if (this.dna.inputs.length == 0) {
		return new Material(0);
	}
	//console.log("+++")
	for (var i = 0; i < this.dna.inputs.length; i++) {
		if (this.dna.interpolation == "discrete") {

			if (greaterThan(this.dna.inputs[i], inp)) {
				if (i == 0) {
					return this.dna.outputs[0];
				} else {
					return this.dna.outputs[i - 1];
				}
			}

		} else if (this.dna.interpolation == "linear") {
			//console.log(i)
			if (eq(this.dna.inputs[i], inp)) {
				//console.log("eq")
				return this.dna.outputs[i];
			} else if (greaterThan(this.dna.inputs[i], inp)) {
				//console.log("gt")
				if (i == 0) {
					return this.dna.outputs[0];
				} else {
					///console.log("----")
					//console.log(mult(minus(inp, this.inputs[i - 1]), this.outputs[i]));
					//console.log(mult(minus(this.inputs[i], inp), this.outputs[i - 1]))
					var x = div(
						plus(
							mult(minus(inp, this.dna.inputs[i - 1]), this.dna.outputs[i]),
							mult(minus(this.dna.inputs[i], inp), this.dna.outputs[i - 1])
						),
						minus(this.dna.inputs[i], this.dna.inputs[i - 1]));
					//console.log("===")
					return x;
				}
			}
		}
	}
	return this.dna.outputs[this.dna.outputs.length-1];
});


function Variable() {
	Primitive.call(this);
	this.constructorFunction = Variable;
}
Variable.inherits(Primitive);
Variable.method("innerClone", function(p){
});
Variable.method("calculateValue", function() {
	//console.log("--")
	//console.log(this)
	//console.log("calc!");
	//console.log("--");
	//console.log(this.dna.name);
	//console.log(this.equation);
	//try{
	var x = evaluateTree(this.equation, globalVars(this));
	//console.log(x);
	//}catch(err){
	//	console.log(this.dna.name);
	//	throw "calc value error";
	//}
	//console.log(x);
	//return x;
	//console.log(x);
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
	if(! x.units) {
		x.units = this.dna.units;
	}
	return x;
});

function Flow() {
	Primitive.call(this);
	this.alpha = null;
	this.omega = null;
	this.rate = null;
	this.RKPrimary = [];
	this.constructorFunction = Flow;
}
Flow.inherits(Primitive);
Flow.method("innerClone", function(p){
});
Flow.method("setEnds", function(alpha, omega) {
	this.alpha = alpha;
	this.omega = omega;
});
Flow.method("calculateValue", function() {
	//while(this.RKPrimary.length < this.dna.solver.RKPosition){
		this.predict();
		//}
	return this.rate.fullClone();
});
Flow.method("clean", function() {
	this.rate = null;
	this.RKPrimary = [];
});
Flow.method("predict", function(override) {
	if (this.rate === null || override) {

		try{
			//console.log("---");
			var x = evaluateTree(this.equation, globalVars(this)).toNum();
			//console.log(this.equation);
			//console.log(x);
			if(!((x instanceof Vector) || isFinite(x.value))){
				throw("MSG: "+getText("The result of this calculation is not finite. Flows must have finite values. Are you dividing by 0?"));
			}

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
		if(typeof x== "boolean"){
			if(x){
				x = new Material(1);
			}else{
				x = new Material(0);
			}
		}

		this.rate = x.fullClone();

		if(this.rate instanceof Vector){
			var d = this.dna;
			this.rate.recurseApply(function(x){
				if (! x.units) {
					x.units = d.units;
				}
				return x
			})
		}else if (! this.rate.units) {
			this.rate.units = this.dna.units;
		}

		this.testUnits(this.rate, true);

		this.rate = mult(this.rate, this.dna.solver.timeStep);

		if(override){
			if(this.RKPrimary.length > 0){
				this.RKPrimary[this.RKPrimary.length-1] = this.rate;
			}else{
				this.RKPrimary.push(this.rate);
			}

		}else{
			this.RKPrimary.push(this.rate);
		}

		if (this.dna.solver.RKOrder == 4) {
			if (this.dna.solver.RKPosition == 1) {
				this.rate = this.RKPrimary[0];
			} else if (this.dna.solver.RKPosition == 2) {
				this.rate = this.RKPrimary[1];
			} else if (this.dna.solver.RKPosition == 3) {
				this.rate = this.RKPrimary[2];
			} else if (this.dna.solver.RKPosition == 4) {
				this.rate = div((plus(plus(plus(this.RKPrimary[0], mult(new Material(2), this.RKPrimary[1])), mult(new Material(2), this.RKPrimary[2])), this.RKPrimary[3])), new Material(6));
			}
		}

		this.rate  = div(this.rate, this.dna.solver.timeStep);

		if(this.dna.onlyPositive){
			if(this.rate instanceof Vector){
				this.rate.recurseApply(function(x){
					if(x.value >= 0 ){
						return x
					}else{
						return new Material(0, x.units);
					}
				});
			}else{
				if(this.rate.value <= 0){
					this.rate = new Material(0, this.rate.units);
				}
			}
		}



	}
});
Flow.method("apply", function(timeChange, oldTime, newTime) {

	try{

		//console.log(this.dna.name+" - apply")
		//console.log("RKPosition: "+this.dna.solver.RKPosition);
		//console.log(this.RKPrimary.map(function(x){return x.value}));
		//console.log(this.rate.value);

		if(this.rate === null){
			return;
		}

		var rate = this.rate.fullClone();

		rate = mult(rate, timeChange);


		var in_rate = rate;
		var out_rate = rate;
		var collapsed = false;

		if(this.alpha !== null){
			var v = this.alpha.level;
			if((rate instanceof Vector) && ( (! (v instanceof Vector)) || v.depth() < rate.depth())){
				in_rate = rate.fullClone().collapseDimensions(v);
				collapsed = true;
			}else if((v instanceof Vector) && ( (!(rate instanceof Vector)) || v.depth() > rate.depth()) ){
				error(getText("The alpha of the flow is a vector with a higher order than the flow rate. There has to be at least one element in the flow rate for each element in the alpha."), this, true)
			}
		}
		if(this.omega !== null){
			//console.log("c")
			var v = this.omega.level;
			if((rate instanceof Vector) && ((! (v instanceof Vector)) || v.depth() < rate.depth())){
				out_rate = rate.fullClone().collapseDimensions(v);
				collapsed = true;
			}else if((v instanceof Vector) && ( (!(rate instanceof Vector)) || v.depth() > rate.depth()) ){
				error(getText("The omega of the flow is a vector with a higher order than the flow rate. There has to be at least one element in the flow rate for each element in the omega."), this, true)
			}
		}

		if(! collapsed){
			var constraints = 0;

			if (this.omega !== null && this.omega.dna.nonNegative) {
				var modifier = plus(this.omega.level.toNum(), rate);
				if(modifier instanceof Vector){
					modifier.recurseApply(function(x){
						if (x.value < 0 ) {
							return x;
						}else{
							return new Material(0, x.units);
						}
					});
					rate = minus(rate, modifier);
				}else{
					if (modifier.value < 0 ) {
						rate = negate(this.omega.level.toNum());
					}
				}
				constraints++;
			}

			if (this.alpha !== null && this.alpha.dna.nonNegative) {

				var modifier = minus(this.alpha.level.toNum(), rate);
				if(modifier instanceof Vector){
					modifier.recurseApply(function(x){
						if (x.value < 0 ) {
							return x;
						}else{
							return new Material(0, x.units);
						}
					})
					rate = minus(rate, modifier);
					rate = minus(rate, modifier);
				}else{
					if (modifier.value < 0 ) {
						rate = this.alpha.level.toNum();
					}
				}
				constraints++;
			}

			if (this.omega !== null && this.omega.dna.nonNegative) {

				if(rate instanceof Vector){
					var vec = functionBank["flatten"]([plus(this.omega.level.toNum(), rate)]);
					for(var i=0; i<vec.items.length; i++){
						if (vec.items[i].value < 0 ) {
							error(getText("Inconsistent non-negative constraints for flow."), this, false);
						}
					}
				}else{
					if (plus(this.omega.level.toNum(), rate).value < 0) {

						error(getText("Inconsistent non-negative constraints for flow."), this, false);
					}
				}
			}
		}else{
			if (this.alpha !== null && this.alpha.dna.nonNegative) {
				error(getText("Cannot use non-negative stocks when the flow rate is a vector that needs to be collapsed."), this.alpha, false);
			}
			if (this.omega !== null && this.omega.dna.nonNegative) {
				error(getText("Cannot use non-negative stocks when the flow rate is a vector that needs to be collapsed."), this.omega, false);
			}
		}

		var additionTest = 0;
		try{
			if (this.omega !== null) {
				additionTest = 1;
				if(collapsed){
					this.omega.add(out_rate, oldTime);
				}else{
					this.omega.add(rate, oldTime);
				}
			}
			if (this.alpha !== null) {
				additionTest = 2;

				if(collapsed){
					this.alpha.subtract(in_rate, oldTime);
				}else{
					this.alpha.subtract(rate, oldTime);
				}
			}
		}catch(err){
			//throw err;
			var stock = "";
			if(additionTest==1){
				stock= this.omega;
			}else if(additionTest==2){
				stock= this.alpha;
			}

			if(err == "MSG: Keys do not match for vector operation."){
				error(getText("Incompatible vector keys for flow %s and connected stock %s.", "<i>["+clean(this.dna.name)+"]</i>", "<i>["+clean(stock.dna.name)+"]</i>"), this, false);
			}else{
				error(getText("Incompatible units for flow %s and connected stock %s. Stock has units of %s. The flow should have the equivalent units divided by some time unit such as Years.", "<i>["+clean(this.dna.name)+"]</i>", "<i>["+clean(stock.dna.name)+"]</i>", "<i>"+(stock.dna.units?clean(stock.dna.units.toString()):"unitless")+"</i>"), this, false);
			}

		}

		//console.log("null: "+this.id)
	}catch(err){
		if(! err.substr){
			throw err; //it's already an object, let's kick it up the chain
		}
		if(err.substr(0,4)=="MSG:"){
			error(err.substr(4,err.length), this, true);
		}else{
			error(err, this, true);
		}
	}
});

function globalVars(primitive){
	if(primitive instanceof Agent){
		return {"-parent": varBank, "self": primitive};
	}else if(primitive.container){
		return {"-parent": varBank, "self": primitive.container};
	}else{
		return varBank;
	}
}
