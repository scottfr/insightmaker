"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

function Simulator(config){

	this.randLoc = -1;
	this.lastRandPos = -1;
	this.previousRandLists = [];
	this.valuedPrimitives = [];
	this.unitsToBases = {};

	this.distanceCache = {};


	this.sliders = {};

	this.ids = {};
	this.idCount = 0;

	this.stochastic = false;

}

Simulator.prototype.setup = function(config){


	this.model = config.model;

	this.solversCompletedFirstPass = 0;

	this.timeStart = this.model.timeStart;
	this.timeLength = this.model.timeLength;
	this.timePause  = this.model.timePause;
	this.timeEnd = plus(this.timeStart, this.timeLength);
	this.timeStep = this.model.solvers.base.timeStep;
	this.userTimeStep = this.model.solvers.base.userTimeStep;
	this.timeUnits = this.timeStart.units;
	this.timeUnits.addBase();

	this.oldAggregateSeries = [];
	this.distanceCache = {};
	this.tasks = new TaskQueue({
		start: this.timeStart,
		end: this.timeEnd
	});

}

Simulator.prototype.getID = function(x){
	//console.log(x);
	if(! this.ids[x]){
		this.idCount++;
		this.ids[x] = this.idCount;
	}
	//console.log(this.ids[x])
	return this.ids[x];
}

Simulator.prototype.time = function(){
	return this.tasks.time;
}

Simulator.prototype.timeProgressed = function(){
	return minus(this.time(), this.timeStart);
}

Simulator.prototype.frame = function(valued, displayed){
	var l = valued.length;
	for(var i = 0; i < l; i++){
		valued[i].storeValue();
	}

	this.printStates(displayed);
}

Simulator.prototype.step = function(solver){
	if(! solver.completedFirstPass){
		solver.completedFirstPass = true;
		this.solversCompletedFirstPass++;
		if(this.solversCompletedFirstPass == Object.keys(this.model.solvers).length){
			if(this.config.onCompletedFirstPass){
				this.config.onCompletedFirstPass();
			}
		}
	}

	if(solver.displayed.length > 0){
		for (var i = this.results[solver.displayed[0].id].results.length; i < this.results.Time.length; i++) {
			//console.log(i)
			for(var j = 0; j < solver.displayed.length; j++){
				this.results[solver.displayed[j].id].results.push(this.results.data[i][solver.displayed[j].id])
			}
		}
	}

	if(this.config.onStep){
		this.config.onStep(solver);
	}
}

Simulator.prototype.sleep = function(updateWindow){
	var me = this;

	if(this.config){
		if(! this.config.silent){
			if(! window.storyConverter){
				this.shouldSleep = true;
			}else{
				this.shouldSleep = false;
			}
			this.shouldUpdateScripter = updateWindow;
		}else{
			if(this.config.onPause){

				this.shouldSleep = true;

			}
		}
	}

}

Simulator.prototype.resume = function(){

	try{
		this.run();
	}catch(err){
		return checkErr(err, this.config);
	}

}

Simulator.prototype.completed = function(){
	return this.terminated || this.tasks.completed();
}

Simulator.prototype.terminate = function(){
	if(! this.terminated){
		clearTimeout(this.timer);
		this.sleep();
		this.terminated = true;
		if(this.resultsWindow){
			this.resultsWindow.scripter.finished();
		}
	}
}

Simulator.prototype.run = function(config){
	var me = this;

	var addPause = function(time, repeat){
		me.tasks.add(new Task({
			time: time,
			expires: 1,
			name: "Interval Pause",
			priority: 1,
			action: function(){
				me.sleep(true);
				if(repeat && lessThan(plus(time, me.timePause), me.timeEnd)){
					addPause(plus(time, me.timePause), repeat);
				}
			}
		}));

		me.tasks.add(new Task({
			time: time,
			expires: 1,
			name: "Interval Pause",
			priority: 1,
			action: function(){
				if(me.valueChange){
					simulate.valuedPrimitives = [];
					for(var s in me.model.solvers){
						var solver = me.model.solvers[s];
						for(var i = 0; i < solver.valued.length; i++){
							solver.valued[i].clearCached();
						}
						for(var i = 0; i < solver.flows.length; i++){
							solver.flows[i].predict(true);
						}
					}
					me.valueChange = false;
				}
			}
		}));
	}

	if(config){
		this.config = config;

		var solvers = Object.keys(this.model.solvers);
		for(var i = 0; i < solvers.length; i++){
			this.createSolver(this.model.solvers[solvers[i]]);
		}

		if(this.timePause /*&& (! this.config.silent)*/ && (! window.storyConverter)){
			addPause(plus(this.timeStart, this.timePause), true);
		}

		this.tasks.tasks.goMin();
	}

	this.wakeUpTime = (new Date()).getTime();

	try{
		while (! this.completed()){
			this.tasks.step();

			if(this.shouldSleep){
				for(var solver in this.model.solvers){
					updateDisplayed(this.model.solvers[solver]);
				}
				if(this.shouldUpdateScripter){
					this.resultsWindow.scripter.endMode = "pause";
					this.shouldUpdateScripter = false;
				}
				if(this.config.onPause){
					setTimeout((function(){
						/*console.log(this);
						console.log(this.results);
						return;*/
						var res = formatSimResults(this.results);
						var l = res.data.length;
						var data = res.data[l-1];
						for(var key in data){
							if(res[key].results.length < l){
								res[key].results.push(data[key]);
							}
						}

						res.resume = me.resume.bind(this);
						res.setValue = function(cell, value){
							var val = simpleEquation(""+value, {"-parent": varBank});
							/*if(! this.sliders[cell.id]){
								throw "Primitive '" + getName(cell) + "' must have a slider defined for it to change its value.";
							}

							for (var i = 0; i < this.sliders[cell.id].length; i++) {
								this.sliders[cell.id][i].equation = val;
							}
							this.sliders[cell.id][0].dna.equation = val;*/
							this.valuedPrimitives.forEach(function(x){
								if(x.id == cell.id){
									if(val.fullClone){
										x.dna.equation = val.fullClone();
										x.equation = val.fullClone();
									}else{
										x.dna.equation = val;
										x.equation = val;
									}
								}
							})
							this.valueChange = true;
						}.bind(this);

						me.config.onPause(res);
					}).bind(this), 10);
				}

				this.shouldSleep = false;
				return;
			}
		}

	}catch(err){
		if(err.msg != "STOP"){
			throw err;
		}
	}


	this.results = formatSimResults(this.results);


	this.results.stochastic = this.stochastic;

	if(this.config.onSuccess){
		this.config.onSuccess(this.results);
	}

	this.terminate();

	if(this.resultsWindow){
		this.results.window = this.resultsWindow;
		for(var solver in this.model.solvers){
			updateDisplayed(this.model.solvers[solver]);
		}
	}

	return this.results;
}

Simulator.prototype.progress  = function(){
	return div(minus(this.time(), this.timeStart), this.timeLength).value;
}

Simulator.prototype.printStates = function(displayed){
	var t = parseFloat(this.time().value.toPrecision(20));

	if(this.results.Time.indexOf(t) == -1){
		for(var i = this.results.Time.length; i > 0; i--){
			if(this.results.Time[i-1]<t){
				this.results.Time.splice(i,0, t)
				this.results.data.splice(i,0, {})
				break;
			}
		}
		if(i == 0){
			this.results.Time.splice(0,0, t)
			this.results.data.splice(0,0, {})
		}
	}

	var data = this.results.data[this.results.Time.indexOf(t)];

	for(var i = 0; i < displayed.length; i++){
		var v = displayed[i];
		//console.log(v.dna.name);

		if( !( (v instanceof State) && isDefined(data[v.id]) ) ){
			if(v instanceof Agents){
				this.results[v.id].dataMode = "agents";
				data[v.id] = {current: v.collectData()};
			}else{
				var x = v.value();

				if((x instanceof Vector) && (! x.names)){
					data[v.id] = x;
					this.results[v.id].dataMode = "auto";
				}else if(x instanceof Vector){
					var me = this;
					x.recurseApply(function(x){
						return me.adjustNum(v, x);
					});
					data[v.id] = x;
				}else if(x instanceof Agent){
					data[v.id] = x;
					this.results[v.id].dataMode = "auto";
				}else{
					data[v.id] = this.adjustNum(v, x);
					//console.log(this.adjustNum(v, x));
				}

			}
		}
	}
}

Simulator.prototype.unitsToBase = function(v, u, flow){
	var i = v.id+"-"+(u?u.id:"");

	if(i in this.unitsToBases){
		return this.unitsToBases[i];
	}

	var x = 1;
	if(flow){
		 x = this.timeUnits.toBase;
	}
	var toBase = 1;
	if(u){
		u.addBase();
		toBase = u.toBase;
	}
	this.unitsToBases[i] = fn["/"](fn["/"](sn("#e"+toBase), v.dna.toBase),sn("#e"+x));
	return this.unitsToBases[i];

}

Simulator.prototype.adjustNum = function(v, x){
	if(v.unitless && x.units){
		error(getText("The result of the calculation has units %s, but the primitive is unitless. Please set the units for the primitive so we can determine the proper output.", x.units.toString()), findID(v.id), true);
	}
	//console.log(x);
	if((v instanceof Flow) && (! v.dna.flowUnitless)){
		x = mult(x, new Material(1, this.timeUnits));
	}
	//console.log(x);

	if( (v instanceof State) || (! x.units) && (! v instanceof Flow)){
		x = x.value;
	}else{
		x = fn["*"](x.value, this.unitsToBase(v, x.units, v instanceof Flow));
	}

	return x+0;
}

Simulator.prototype.createSolver = function(solver){

	var me = this;

	var stocks = solver.stocks;
	var flows = solver.flows;

	var actions = solver.actions;
	var states = solver.states;
	var transitions = solver.transitions;
	var valued = solver.valued;
	var displayed = solver.displayed;

	var id = solver.id;

	var timeStep = solver.timeStep;
	var userTimeStep = solver.userTimeStep;
	var RKOrder = solver.RKOrder;
	solver.RKPosition = 1;

	var ts = timeStep.value;
	ts = ts.toPrecision();
	if(ts.indexOf(".") == -1){
		var timeStepDecimals = 0;
	}else{
		var timeStepDecimals = ts.length - ts.indexOf(".") - 1;
	}
	var timeStepScaled = parseFloat(ts.replace(".", ""));

	var index = 0;
	var times = [];
	var maxIndex = Math.ceil((me.timeEnd.value - me.timeStart.value)/timeStep.value)
	for(var i = 0; i <= maxIndex+2; i++){
		times.push(new Material(me.timeStart.value + i * timeStepScaled / Math.pow(10, timeStepDecimals), timeStep.units) );
	}


	var l = actions.length;
	for(var i = 0; i < l; i++){
		if(actions[i].dna.trigger !== "Condition"){
			updateTrigger.call(actions[i]);
		}
	}

	var l = transitions.length;
	for(var i = 0; i < l; i++){
		updateTrigger.call(transitions[i]);
	}


	function addRK1Solver(time, repeat, clear){
		me.tasks.add(new Task({
				time: time,
				expires: 1,
				name: "RK1 Solver - " +solver.id,
				action: function(){
        	simulate.valuedPrimitives = [];
          if (clear) {
  					var l = flows.length;
  					for(var i = 0; i < l; i++){
  						flows[i].clean();
  					}


  					l = valued.length;
  					for(var i = 0; i < l; i++){
  						valued[i].clearCached();
  					}
          }

					me.frame(valued, displayed);

					var l = actions.length;
					for(var i = 0; i < l; i++){
						if(actions[i].dna.recalculate && ! actions[i].block){
							updateTrigger.call(actions[i]);
						}
					}

					l = transitions.length;
					for(var i = 0; i < l; i++){
						if( transitions[i].dna.recalculate ){
							updateTrigger.call(transitions[i]);
						}
					}
					//console.log("B")
					me.step(solver);


					if(repeat &&  index <= maxIndex){
						index++;
						addRK1Solver(times[index], true, true)
					}

				}
			})
		);
	}

	function addRK4Solver(time, repeat){
		/*

		1. (t=0) Calculate rates at t=0, move to t=0.5 (rollback restore stocks)
		2. (t=0.5) Calculate rates at t=0.5
		3. (t=0) Use rate of (t=0.5) to move to t=0.5 (rollback restores stocks)
		4. (t=0.5) Calculate rates at t=0.5
		5. (t=0) Use rates of (t=0.5 (2)) to move to t=1 (rollback restores stocks)
		6. (t=1) Calculate rates at t=1
		7. (t=0) Use average rates to move to t=0

		*/


		me.tasks.add(new Task({
				time: time,
				name: "RK4 Solver (Init)  - " +solver.id,
				priority: -10,
				expires: 1,
				blocker: id+" init",
				action: function(){


					var l = flows.length;
					for(var i = 0; i < l; i++){
						flows[i].clean();
					}

					simulate.valuedPrimitives =[];

					l = valued.length;
					for(var i = 0; i < l; i++){
						valued[i].clearCached();
					}

					solver.RKPosition = 1;

					this.unblock(id+" start");
					this.block();
				}
			})
		);
		me.tasks.add(new Task({
				time: time,
				name: "RK4 Solver (step 1) - " +solver.id,
				priority: -5,
				expires: 4,
				blocker: id+" start",
				action: function(){
					if(solver.RKPosition > 1){
						simulate.valuedPrimitives = [];
						var l = valued.length;
						for(var i = 0; i < l; i++){
							valued[i].clearCached();
							valued[i].pastValues.pop();
						}
					}

					me.frame(valued, displayed);

					if(solver.RKPosition == 4){

						var l = actions.length;
						for(var i = 0; i < l; i++){
							if(actions[i].dna.recalculate && ! actions[i].block){
								updateTrigger.call(actions[i]);
							}
						}

						l = transitions.length;
						for(var i = 0; i < l; i++){
							if( transitions[i].dna.recalculate ){
								updateTrigger.call(transitions[i]);
							}
						}

						this.unblock(id+" init")

						if(repeat &&  index <= maxIndex){
							index += 2;
							addRK4Solver(times[index], true)
						}

						me.step(solver);
					}else if(eq(simulate.time(), simulate.timeEnd)){
						me.step(solver);
					}else{
						var l = stocks.length;
						for(var i = 0; i < l; i++){
							stocks[i].preserveLevel();
						}
					}

					this.block();
					this.unblock(id+" mid")
				},
				rollback: function(){
					var l = stocks.length;
					for(var i = 0; i < l; i++){
						stocks[i].restoreLevel();
					}

				}
			})
		);
		me.tasks.add(new Task({
				time: times[index+1],
				name: "RK4 Solver (step 2,3) - " +solver.id,
				priority: -10,
				expires: 2,
				blocker: id+" mid",
				action: function(){

					simulate.valuedPrimitives = [];
					var l = valued.length;
					for(var i = 0; i < l; i++){
						if(!( valued[i] instanceof State)){
							valued[i].clearCached();
						}
					}


					solver.RKPosition++;

					l = flows.length;
					for(var i = 0; i < l; i++){
						flows[i].rate = null;
						flows[i].predict();

					}

					this.unblock(id+" start");
					this.block();
				},
				timeShift: function(){

					me.tasks.moveTo(times[index]);
				}
			})
		);

		me.tasks.add(new Task({
				time: times[index+2],
				name: "RK4 Solver (step 4) - " +solver.id,
				priority: -30,
				expires: 1,
				action: function(){

					simulate.valuedPrimitives = [];
					var l = valued.length;
					for(var i = 0; i < l; i++){
						if(!( valued[i] instanceof State)){
							valued[i].clearCached();
						}

					}

					solver.RKPosition++;

					l = flows.length;
					for(var i = 0; i < l; i++){
						flows[i].rate = null;
						flows[i].predict();
					}

					this.unblock(id + " start");
				},
				timeShift: function(){

					me.tasks.moveTo(times[index]);
				}
			})
		);
	}

	function valMatches(val, fn) {
		if (val instanceof Vector) {
			var matches = false;
			val.recurseApply(function(x){
				matches =  matches || fn(x);
			});
			return matches;
		} else {
			return fn(val);
		}
	}

	function valHasNegative(val) {
		return val && valMatches(val.toNum(), function(x) {return (x instanceof Material) && x.value < 0});
	}

	function valHasPositive(val) {
		return val && valMatches(val.toNum(), function(x) {return (x instanceof Material) && x.value > 0});
	}

	function doFlows(timeChange, oldTime, newTime) {
		var l = flows.length;
		var post = [];
		for(var i = 0; i < l; i++){
			if (flows[i].alpha && flows[i].alpha.dna.nonNegative && valHasPositive(flows[i].rate)) {
				post.push(flows[i]);
			} else if (flows[i].omega && flows[i].omega.dna.nonNegative && valHasNegative(flows[i].rate)) {
				post.push(flows[i]);
			} else {
				flows[i].apply(timeChange, oldTime, newTime);
			}
		}
		for(var i = 0; i < post.length; i++){
			post[i].apply(timeChange, oldTime, newTime);
		}
	}


	if(RKOrder == 1){
		this.tasks.addEvent(function(timeChange, oldTime, newTime){
			doFlows.apply(null, arguments);
		})

		addRK1Solver(this.timeStart, true);
	}else if(RKOrder == 4){

		this.tasks.addEvent(function(timeChange, oldTime, newTime){
			if(timeChange.value > 0){
				doFlows.apply(null, arguments);
			}
		});

		addRK4Solver(this.timeStart, true);

	}else{
		throw "Unknown solution algorithm."
	}
}
