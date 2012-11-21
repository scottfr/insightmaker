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

	return this.oldValues[index];
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
	if (indexOf(this.names, n) > -1) {
		return this.dataSeries[indexOf(this.names, n)];
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
        this.stocks.push(iv.clone());
    }
    this.out = iv.clone();
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

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

	Array.prototype.forEach = function(callback, thisArg) {

		var T, k;

		if (this == null) {
			throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0; // Hack to convert O.length to a UInt32
		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if ({}.toString.call(callback) != "[object Function]") {
			throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (thisArg) {
			T = thisArg;
		}

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as the this value and
				// argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined
	};
}
