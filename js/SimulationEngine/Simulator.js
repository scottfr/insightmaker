"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


var timeStart;
var timeEnd;
var userTimeStep;
var time;
var timeStep;
var RKOrder;
var RKPosition;
var oldAggregateSeries;
var timeLength;
var timeIndex;

//model: {primitives, timeStart, timeLength, timeStep, RKOrder}
var simulate = function(model, silent, callback){
	var firstTime = false;
	
	if(isDefined(silent)){
		firstTime = true;
		
		distanceCache = {};
		
		simulate.model = model;
		
		simulate.agentsChanged = false;
		
		simulate.callback = callback;
		
		simulate.timeLengthNumber = div(model.timeLength, model.timeStep).value.toPrecision(21);
		
		simulate.timeCounter = 0;
	
		

		simulate.results = {Time: []};
		simulate.displayed = [];
		simulate.displayInformation = {ids: []};
		model.submodels["base"].agents[0].children.forEach(function(x){
			if(! (x instanceof Action)){
				simulate.displayInformation.ids.push(x.id);
				simulate.displayed.push(x);
			}
		});
		
		for (var i = 0; i < simulate.displayed.length; i++) {
			var item = simulate.displayed[i];
			var data = {};
			if(simulate.displayed[i] instanceof Agents){
				data.width = item.geoWidth;
				data.height = item.geoHeight
				data.units = item.geoDimUnitsObject;
				data.states = item.states();
			}
			simulate.results[item.id] = {data: data, results: []};
		}
		
		fillDataSeries(simulate);
		
	}else{
		silent = false;
	}
	
	
	try{
	var start = (new Date()).getTime();
	while (lessThanEq(time, timeEnd)) {
		 timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);
		//console.log("Time:"+time.toString());
		//console.log("Time End:"+timeEnd.toString());
		
		RKPosition = 1;
		if( (! eq(time, timeStart))){
			if(simulate.agentsChanged){
				for(var submodel in submodels){
					submodel = submodels[submodel];
					if(submodel.id != "base"){
						submodel.agents =  submodel.agents.concat(submodel.nextCreate);
						submodel.nextCreate = [];
						for(var i = 0; i < submodel.nextDie.length; i++){
							submodel.nextDie[i].die();
						}
						submodel.nextDie = [];
					}
				}
				fillDataSeries(simulate);
				simulate.agentsChanged = false;
			}
			simulate.actions.forEach(function(a) {
				a.test();
			});
		}
		
		
		//console.log("---Start Predict");
		simulate.flows.forEach(function(f) {
			f.predict();
		});
		
		simulate.valued.forEach(function(v) {
			//console.log(v.name);
			//console.log(v);
			v.value();
		});
		
		//console.log("Time: "+time.value.toString());
		//console.log(varBank["counter"].value.toString())
		
		//console.log(varBank["counter"].value.toString())
		
		//console.log("---End Predict");
		for (RKPosition = 1; RKPosition < RKOrder; RKPosition++) {
			
			if(RKPosition != 1){
				simulate.valued.forEach(function(v) {
					v.value();
				});
			}
			
			simulate.stocks.forEach(function(s) {
				s.preserveLevels();
			});
			
			simulate.states.forEach(function(s) {
				s.preserveActive();
			});
			
			var moveSteps = 1;
			if (RKOrder == 4 && RKPosition == 3) {
				moveSteps = 2;
			}


			for (var moveCounter = 1; moveCounter <= moveSteps; moveCounter++) {

				simulate.flows.forEach(function(f) {
					f.apply();
				});
				
				simulate.transitions.forEach(function(t) {
					t.transition();
				});

				simulate.stocks.forEach(function(s) {
					s.stepForward();
				});

				time = plus(time, timeStep);
				timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);

				if (moveSteps == 2 && moveCounter == 1) {
					simulate.valued.forEach( function(v) {
						v.value();
					});
				}

			}

			simulate.flows.forEach(function(f) {
				//console.log(f.id);
				f.predict();
			});

			simulate.valued.forEach(function(v) {
				v.value();
			});

			simulate.stocks.forEach(function(s) {
				s.restoreLevels();
			});
			
			simulate.states.forEach(function(s) {
				s.restoreActive();
			});

			if (RKOrder == 2 || (RKOrder == 4 && RKPosition != 3)) {
				simulate.valued.forEach(function(v) {
					v.clearPastValues(2);
				});
			} else if (RKOrder == 4 && RKPosition == 3) {
				simulate.valued.forEach(function(v) {
					v.clearPastValues(3);
				});
			}
			
			time = plus(timeStart, mult(new Material(simulate.timeCounter), userTimeStep));
			 timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);
		}
		
			//console.log("---STEP----");
		
		
			//console.log(varBank["counter"].value.toString())
			//console.log("--");
		printStates(simulate);
		
		//console.log("--STATE--");

		var moveSteps = 1;

		
		if (RKOrder == 4) {
			moveSteps = 2;
		}
		

		for (var moveCounter = 1; moveCounter <= moveSteps; moveCounter++) {

			//console.log("--FLOWS--");
			simulate.flows.forEach(function(f) {
				f.apply();
				if (moveCounter == moveSteps) {
					f.clean();
				}
			});
			
			
			simulate.transitions.forEach(function(t) {
				t.transition();
			});

			//console.log("--STOCKS--");
			
			simulate.stocks.forEach(function(s) {
				s.stepForward();
			});
			
			time = plus(time, timeStep);
			 timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);
			
			//console.log("---- value start")
			if (moveSteps == 2 && moveCounter == 1) {
				simulate.valued.forEach(function(v) {
					v.value();
				});
			}
			//console.log("---- value end")
		}

		//console.log("--END--");

		simulate.timeCounter = simulate.timeCounter + 1;
		time = plus(timeStart, mult(userTimeStep, new Material(sn("#e"+simulate.timeCounter))));
		 timeIndex = Math.round((time.value - timeStart.value) / timeStep.value);

		 var timeTaken = new Date().getTime()-start;
		if((! silent) && ( ( (!firstTime) && timeTaken>600) || (simulate.timeCounter/simulate.timeLengthNumber<.12 && timeTaken>200) || timeTaken > 1000 ) ){
			simulatorProgress.updateProgress(simulate.timeCounter/simulate.timeLengthNumber, "Current Time: "+round(Math.min(timeEnd.value,time.value).toString(),12)+" "+time.units.names[0]);
			setTimeout(simulate,50);
			return;
		}
	}
	
	}catch(err){
		if(err.msg != "STOP"){
			if(silent){
				throw err;
			}else{
				simulatorProgress.close();
				handleErrorObject(err);
				return;
			}
		}
	}
	
	
	function unitsToBase(v, u, flow){
		//finders++;
		var i = v.id+"-"+u.id();
		//notfound++;
		//console.log(i);
		if(i in unitsToBase){return unitsToBase[i]};
		//console.log("not found");
		var x = 1;
		if(flow){
			 x =  new Quantities(timeLength.units).toBase;
		}
		var q = new Quantities(u);
		unitsToBase[i] = fn["/"](fn["/"](sn("#e"+q.toBase), v.toBase),sn("#e"+x));
		return unitsToBase[i];
		
	}
	
	function printStates(item){
		item.results["Time"].push(parseFloat(time.value.toPrecision(20)));
		//console.log("Time: " + time);
		for(var i = 0; i< item.displayed.length; i++){
			var v = item.displayed[i];
			//console.log(v);//XXX fixme
			
			if(v instanceof Agents){
				item.results[v.id].results.push({current: v.collectData()});
			}else{

				var x = v.value();
				//console.log("Counter:"+varBank["counter"].value.toString())
				//console.log("V: "+v.value().value.toString())
				
				if(x instanceof Vector){
					item.results[v.id].results.push(NaN);
				}else{
					//console.log(x);
					if(item.displayed[i].unitless && (! unitless(x.units))){
						error("The result of the calculation has units "+x.units.toString()+", but the primitive is unitless. Please set the units for the primitive so we can determine the proper output.", findID(v.id), true);
					}
					//console.log(x);
					if((item.displayed[i] instanceof Flow) && (! item.displayed[i].flowUnitless)){
						x = mult(x, new Material(1, timeLength.units.clone()));
					}
					//console.log(x);
			
					if( (item.displayed[i] instanceof State) || unitless(x.units) && (! v instanceof Flow)){
						x = x.value;
					}else{
						x = fn["*"](x.value, unitsToBase(v, x.units, v instanceof Flow));
					}
					//console.log(x);
					//console.log(parseFloat(x));
					//console.log("--");
					item.results[v.id].results.push(0+x);
				}
			}
		}
	}
	
	
	if(silent){
		return simulate.results;
	}else{
		simulatorProgress.close();
		simulate.callback(simulate.results, simulate.displayInformation);
	}
}

function fillDataSeries(simulate){
	var submodels = simulate.model.submodels;
	
	simulate.valued = [];
	simulate.actions = [];
	simulate.flows = [];
	simulate.stocks = [];
	simulate.states = [];
	simulate.transitions = [];
	
	for(var submodel in submodels){
		submodel = submodels[submodel];
		for(var i = 0; i<submodel.agents.length; i++){
			if(! submodel.agents[i].dead){
				for(var j=0; j<submodel.agents[i].children.length; j++){
					var item = submodel.agents[i].children[j];
					if(item instanceof Action){
						simulate.actions.push(item);
					}else if(! (item instanceof Agents)){
						simulate.valued.push(item)
						if(item instanceof Flow) {
							simulate.flows.push(item);
						}
						else if (item instanceof Stock) {
							simulate.stocks.push(item);
						}
						else if (item instanceof State) {
							simulate.states.push(item);
						}
						else if (item instanceof Transition) {
							simulate.transitions.push(item);
						}
					}
				}
			}
		}
	}
}
//var finders =0;
//var notfound=0;