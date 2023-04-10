"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var unitsBank = {};

function sortAndCollapseUnits(names, exponents){
	if (names.length <= 1) {
		if (names.length == 1) {
			names[0] = names[0].toLowerCase();
		}
	} else {
		var sorter = [];
		for (var i = 0; i < names.length; i++) {
			sorter.push({
				name: names[i].toLowerCase(),
				exponent: exponents[i]
			});
		}
		sorter.sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});
		names = [];
		exponents = [];
		for (var i = 0; i < sorter.length; i++) {
			names.push(sorter[i].name);
			exponents.push(sorter[i].exponent);
		}
		for (var i = 0; i < names.length; i++) {
			for (var j = i + 1; j < names.length; j++) {
				if (names[i] === names[j]) {
					exponents[i] = exponents[i] + exponents[j];

					names.splice(j, 1);
					exponents.splice(j, 1);

					j--;
				}
			}
			
			if (exponents[i] == 0) {
				names.splice(i, 1);
				exponents.splice(i, 1)
				i--;
			}
		}
	}
	
	return {names: names, exponents: exponents};
}

function getUnitStore(names, exponents, checkNames) {
	if (checkNames) {
		var x = sortAndCollapseUnits(names, exponents);
		names = x.names;
		exponents = x.exponents;
		
	}

	if (names.length == 0) {
		return undefined;
	}

	var id = getUnitsId(names, exponents);
	
	if (!unitsBank[id]) {
		
		unitsBank[id] = new UnitStore(names, exponents);
	}
	
	return unitsBank[id];
}

function getUnitsId(names, exponents) {
	return names.join(",") + exponents.join(",");
}


function UnitStore(names, exponents) {
	this.names = names;
	this.exponents = exponents;
	this.toBase = null;
	this.baseUnits = null;
	this.multiples = {};
	this.id = getUnitsId(this.names, this.exponents);
}

UnitStore.prototype.addBase = function() {

	
	if (this.toBase) {
		return;
	}
	
	this.toBase = 1;
	
	
	var names = this.names.slice();
	var exponents =  this.exponents.slice();
	
	var modified = true;
	while (modified) {
		modified = false;
		
		for (var i = names.length - 1; i >= 0; i--) {
			var j = findSourceIndex(names[i]);
			if (j !== -1 && ! ( conUnitTargets[j].names.length == 1 && conUnitTargets[j].names[0] == names[i] )) {
				this.toBase = fn["*"](this.toBase, fn.expt(conScalings[j], exponents[i]));
				names = names.concat(conUnitTargets[j].names);
				names.splice(i, 1);
				exponents = exponents.concat(conUnitTargets[j].exponents.map(function(x){ return x*exponents[i] }))
				exponents.splice(i, 1);
				modified = true;
				break;
			}
		}
	}
	//console.log(names)
	//console.log(exponents)
	var x = sortAndCollapseUnits(names, exponents);
	
	this.baseUnits =  getUnitStore(x.names, x.exponents);
	
}

UnitStore.prototype.power = function(exponent){
	var names = this.names.slice();
	var exponents = this.exponents.slice();
	for(var i = 0; i < exponents.length; i++){
		exponents[i] = exponents[i]*exponent;
	}
	return getUnitStore(names, exponents);
}


UnitStore.prototype.toStringShort = function() {
  var s = "";
  for (var i = 0; i < this.names.length; i++) {
    if (s != "") {
      s = s + ",";
    }
    s = s + this.names[i];
    if (this.exponents[i] != 1) {
      s = s + "^" + this.exponents[i];
    }
  }
  return s;
}

UnitStore.prototype.multiply = function(rhs, exponent) {
	var id = rhs.id+";"+exponent;
	
	
	if(! this.multiples[id]){
		if(! this.toBase){
			this.addBase();
		}
		if(! rhs.toBase){
			rhs.addBase();
		}
		
		if(this.baseUnits){
			var names = this.baseUnits.names.slice();
			var exponents = this.baseUnits.exponents.slice();
		

			if(rhs.baseUnits){
				for (var i = 0; i < rhs.baseUnits.names.length; i++) {
					var j = names.indexOf(rhs.baseUnits.names[i]);
					if (j != -1) {
						exponents[j] = exponents[j] + rhs.baseUnits.exponents[i] * exponent;
					} else {
						var found = false;
						for(var k = 0; k < names.length; k++){
							if(rhs.baseUnits.names[i] < names[k]){
								names.splice(k, 0, rhs.baseUnits.names[i]);
								exponents.splice(k, 0, rhs.baseUnits.exponents[i] * exponent)
								found = true;
								break;
							}
						}
						if(! found){
							names.push(rhs.baseUnits.names[i]);
							exponents.push(rhs.baseUnits.exponents[i] * exponent);
						}
					}
				}
		
				for(var i = exponents.length-1; i >= 0; i--){
					if( exponents[i] == 0){
						exponents.splice(i, 1);
						names.splice(i, 1);
					}
				}
			}
		}else{
			var names = rhs.baseUnits.names.slice();
			var exponents = rhs.baseUnits.exponents.slice();
		}
		this.multiples[id] = getUnitStore(names, exponents);
	}

	return this.multiples[id];
}

function unitsFromString(expandString) {
	var names = [];
	var exponents = [];
	if (expandString != "") {
		var expandItems = expandString.split(",");
		for (var j = 0; j < expandItems.length; j++) {
			names.push(expandItems[j].split("^")[0]);
			if (expandItems[j].indexOf("^") != -1) {
				exponents.push(parseFloat(expandItems[j].split("^")[1]));
			} else {
				exponents.push(1);
			}
		}
	}
	return getUnitStore(names, exponents, true);
}

var titleCaseReg = /\w\S*/g;
var titleCaseFunc = function(txt) {
	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
};

function toTitleCase(str) {
	return str.replace(titleCaseReg, titleCaseFunc);
}
UnitStore.prototype.toString = function() {
	var n = "",
		den = "";
	var numItems = 0,
		denItems = 0;
	for (var i = 0; i < this.names.length; i++) {
		if (this.names[i] != "") {
			var item = "<span class=\"unit\">" + toTitleCase(this.names[i]) + "</span>";
			if (this.exponents[i] != 1 && this.exponents[i] != -1) {
				item = item + "<span class='markup'>^</span><sup>" + Math.abs(this.exponents[i]) + "</sup>";
			}
			if (this.exponents[i] > 0) {
				if (numItems > 0) {
					n = n + "<span class='markup'>*</span>";
				}
				n = n + item;
				numItems = numItems + 1;
			} else {
				if (denItems > 0) {
					den = den + "<span class='markup'>*</span>";
				}
				den = den + item;
				denItems = denItems + 1;
			}
		}
	}
		
		
	if (n == "") {
		n = "Unitless";
	}
	if (den == "") {
		return "<div class=\"units\">" + n + "</div>";
	} else {
		if (n == "Unitless") {
			n = "1";
		}
		return "<span class=\"units\">" + n + "<hr/><span class='markup'>/(</span>" + den + "<span class='markup'>)</span></span>";
	}
}


function convertUnits(source, target, loose) {
	if(source === target) {
		return 1;
	}
	if((source && (! target)) || (target && (! source))){
		if(loose){
			return 1
		}else{
			return 0;
		}
	}
	
	if(! source.toBase){
		source.addBase()
	}
	if(! target.toBase){
		target.addBase()
	}

	if (source.baseUnits !== target.baseUnits) {
		return 0;
	}
	
	return fn["/"](source.toBase, target.toBase);
}

