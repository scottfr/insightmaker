"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

// ********** Code for UnitStore **************
function UnitStore(names, exponents) {
  this.names = names?names:[];
  this.exponents = exponents?exponents:[];
}

UnitStore.prototype.clone = function() {
  return new UnitStore(this.names.slice(), this.exponents.slice());
}
UnitStore.prototype.multiplyUnitStore = function(rhs, exponent) {
  for (var i = 0; i < rhs.names.length; i++) {
    var j = this.names.indexOf(rhs.names[i]);
    if (j != -1) {
      this.exponents[j] = this.exponents[j] + rhs.exponents[i] * exponent;
    }
    else {
      this.names.push(rhs.names[i]);
      this.exponents.push(rhs.exponents[i] * exponent);
    }
  }
}
UnitStore.prototype.unitless = function() {
	if((this.names.length == 0 || (this.names.length == 1 && this.names[0] == ""))){
		return true;
	}
	
	for(var i = this.names.length - 1 ; i >= 0; i--){
		if(this.names[i] == "" && this.exponents[i] > 1){
			this.exponents[i] = 1;
		}else if(this.exponents[i] == 0){
			this.exponents.splice(i, 1);
			this.names.splice(i, 1);
		}
	}
	
	return (this.names.length == 0 || (this.names.length == 1 && this.names[0] == ""));
	
}
UnitStore.prototype.fromString = function(expandString) {
  this.names = [];
  this.exponents = [];
  if (expandString != "") {
    var expandItems = expandString.split(",");
    for (var j = 0; j < expandItems.length; j++) {
      this.names.push(expandItems[j].split("^")[0]);
      if (expandItems[j].indexOf("^") != -1) {
        this.exponents.push(parseFloat(expandItems[j].split("^")[1]));
      }
      else {
        this.exponents.push(1);
      }
    }
  }
}
UnitStore.prototype.id = function(){
	return this.names.join(",")+this.exponents.join(",");
}
UnitStore.prototype.toStringShort = function() {
  if (this.unitless()) {
    return "";
  }
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
var titleCaseReg = /\w\S*/g;
var titleCaseFunc = function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();};
function toTitleCase(str)
{
    return str.replace(titleCaseReg, titleCaseFunc);
}
UnitStore.prototype.toString = function() {
  var n = "", den = "";
  var numItems = 0, denItems = 0;
  for (var i = 0; i < this.names.length; i++) {
	  if(this.names[i]!="" && this.names[i]!=""){
	    var item = null;
	    item = "<span class=\"unit\">" + toTitleCase(this.names[i]) + "</span>";
	    if (this.exponents[i] != 1 && this.exponents[i] != -1) {
	      item = item + "<span class='markup'>^</span><sup>" + Math.abs(this.exponents[i])+"</sup>";
	    }
	    if (this.exponents[i] > 0) {
			if(numItems > 0){
				n = n + "<span class='markup'>*</span>";
			}
	      n = n + item;
	      numItems = numItems + 1;
	    }
	    else {
			if(denItems > 0){
				den=den+"<span class='markup'>*</span>";
			}
	      den = den + item;
	      denItems = denItems + 1;
	    }
	}
  }
  
  if(n==""){
	  n="Unitless";
  }
  if (den == "") {
    return "<div class=\"units\">"+n+"</div>";
  }
  else {
	  if(n=="Unitless"){
		  n = "1";
	  }
    return "<span class=\"units\">"+ n + "<hr/><span class='markup'>/(</span>" + den + "<span class='markup'>)</span></span>";
  }
}
// ********** Code for Quantities **************
function Quantities(store) {
  this.units = store.clone();
  this.toBase = 1;
  this.unitless= true;
  this.ApplyConversions();
}

Quantities.prototype.ApplyConversions = function() {
  
  var modified = true;
  while (modified) {
    modified = false;
    for (var i = this.units.names.length - 1; i >= 0; i--) {
      if (this.units.exponents[i] == 0 || this.units.names[i]=="") {
        this.units.names.splice(i, 1);
        this.units.exponents.splice(i, 1);
      }
      else {
        var j = findSourceIndex(this.units.names[i]);
        if (j != -1) {
          this.toBase = fn["*"](this.toBase, fn.expt(conScalings[j], this.units.exponents[i]));
          this.units.multiplyUnitStore(conUnitTargets[j], this.units.exponents[i]);
          this.units.names.splice(i, 1);
          this.units.exponents.splice(i, 1);
          modified = true;
        }
      }
    }
    for (var i = this.units.names.length - 2; i >= 0; i--) {
      for (var j = this.units.names.length - 1; j >= i + 1; j--) {
        if (this.units.names[j] == this.units.names[i]) {
          this.units.exponents[i] = this.units.exponents[i] + this.units.exponents[j];
          this.units.exponents.splice(j, 1);
          this.units.names.splice(j, 1);
        }
      }
      if (this.units.exponents[i] == 0) {
        this.units.exponents.splice(i, 1);
        this.units.names.splice(i, 1);
      }
    }
  }
  this.unitless = (this.units.names.length==0);
}
Quantities.prototype.equal = function(rhs) {
  if (rhs == null) {
    return false;
  }
  if (! unitsEqual(rhs.units, this.units)) {
    return false;
  }
  return true;
}
// ********** Code for top level **************

function convertUnits(source, target, forceLoose) {
  if (source == null || target == null || unitsEqual(source, target, forceLoose)) {
    return 1;
  }
  var sQ = new Quantities(source);
  var tQ = new Quantities(target);
  
  if (! sQ.equal(tQ)) {
    return 0;
  }
  return fn["/"](sQ.toBase, tQ.toBase);
}
function unitsEqual(lhs, rhs, forceLoose) {
	
  if (lhs == null || rhs == null || ((strictUnits && forceLoose!==true)?(rhs.unitless() && lhs.unitless()):(rhs.unitless() || lhs.unitless()))) {// if (lhs == null || rhs == null || (rhs.unitless() && lhs.unitless())) {
    return true;
  }

  if (rhs.names.length != lhs.names.length) {
    return false;
  }

  for (var i = 0; i < lhs.names.length; i++) {
    if (rhs.names.indexOf(lhs.names[i]) == -1 || lhs.exponents[i] != rhs.exponents[rhs.names.indexOf(lhs.names[i])]) {
      return false;
    }
  }
  return true;
}


