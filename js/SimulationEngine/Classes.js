"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


function AggregateSeries(mid, mspacing) {
	this.id = mid;
	this.spacing = mspacing;
	this.oldValues = [];
}

AggregateSeries.method("match", function(mid) {
	return this.id == mid;
});


AggregateSeries.method("get", function(data) {
	var index = 0;
	if (this.spacing < 0) {
		index = 0;
	} else if (this.spacing == 0) {
		index = Math.floor(div(minus(simulate.time(), simulate.timeStart), simulate.UserTimeStep).value);
	} else {
		index = Math.floor(div(minus(simulate.time(), simulate.timeStart), this.spacing.forceUnits(simulate.timeUnits)).value);
	}
	
	while (this.oldValues.length - 1 < index) {
		this.oldValues.push(evaluateNode(data.node,data.scope));
	}
	if(this.oldValues[index].fullClone){
		return this.oldValues[index].fullClone();
	}else{
		return this.oldValues[index];
	}
});

function DataBank() {
	this.dataSeries = {};
}

DataBank.method("series", function(){
	return Object.keys(this.dataSeries);
});

DataBank.method("clone", function(){
	var d = new DataBank();
	var keys = this.series();
	for(var i=0; i<keys.length; i++){
		d.dataSeries[keys[i]] = this.dataSeries[keys[i]];
	}
	return d;
})

DataBank.method("getSeries", function(n) {
	if (! this.dataSeries[n]) {
		this.dataSeries[n] = [];
	}
	return this.dataSeries[n];
});

DataBank.method("trimValues", function(newUbound) {
	var series = this.series();
	for (var i = 0; i < series.length; i++) {
		var d = this.getSeries(series[i]);
		if (d.length - 1 > newUbound) {
			d.splice(newUbound+1, d.length-newUbound+1);
		}
	}
});

function ExpGroup(n , kv , iv){
  this.stocks = [];
  this.k = kv;
 
    for(var i=1; i<= n; i++){
        this.stocks.push(iv);
    }
    this.out = iv;
  }
  
ExpGroup.method("moveForward", function( inp ){
    var nexp = new ExpGroup(this.stocks.length, this.k, new Material(0));
    
    nexp.out = this.stocks[this.stocks.length-1];
    
    for(var i = this.stocks.length-1;  i > 0; i--){
      nexp.stocks[i] = plus(mult(this.stocks[i], new Material(1-this.k)), mult(this.stocks[i-1], new Material(this.k))); //this.stocks[i]*(1-k) + this.stocks[i-1]*k;
    }

    nexp.stocks[0] = plus(mult(this.stocks[0], new Material(1-this.k)), mult(inp, new Material(this.k)));//stocks[0]*(1-k) + inp*k;
    
    return nexp;
  }
);

