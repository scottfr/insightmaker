"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

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
		index = Math.floor(div(minus(time, timeStart), timeStep).value);
	} else {
		index = Math.floor(div(minus(time, timeStart), this.spacing.forceUnits(timeStart.units)).value);
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
	this.dataSeries = [];
	this.names = [];
}

DataBank.method("clone", function(){
	var d = new DataBank();
	d.dataSeries = this.dataSeries.slice(0);
	d.names = this.names.slice(0);
	return d;
})

DataBank.method("getSeries", function(n) {
	if (this.names.indexOf(n) > -1) {
		return this.dataSeries[this.names.indexOf(n)];
	} else {

		this.names.push(n);
		var type = n.split(":")[0];
		if (type == "Smooth") {
			var d = [];
			this.dataSeries.push(d);
			return d;
		} else if (type == "ExpDelay") {
			var d = [];
			this.dataSeries.push(d);
			return d;
		}
	}
});

DataBank.method("trimValues", function(newUbound) {
	for (var i = 0; i < this.names.length; i++) {
		var n = this.names[i];
		var type = n.split(":")[0];
		if (type == "Smooth") {
			var d = this.getSeries(n);
			if (d.length - 1 > newUbound) {
				d.splice(newUbound+1, d.length-newUbound+1);
			}
		} else if (type == "ExpDelay") {
			var d = this.getSeries(n);
			if (d.length - 1 > newUbound) {
				d.splice(newUbound+1, d.length-newUbound+1);
				//console.log(d);
			}
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

