"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


var baseSources = ["Degree", "Radians?","Ampere","Gram","Second","Meter","(Meters? ?Squared?|Squared? ?Meters?)", "(Centimeters? ?Squared?|Squared? ?Centimeters?)", "(Centimeters? ?Cubed?|Cubic ?Centimeters?)", "(Meters? Cubed?|Cubic ?Meters?)", "(Kilometers? ?Cubed?|Cubic ?Kilometers?)", "(Inches? Squared?|Squared? ?Inches?)", "(Miles? ?Squared?|Squared? ?Miles?)", "(Kilometers? Squared?|Squared? ?Kilometers?)", "Acre? ?(Feet|Foot)", "Meters? ?per ?Seconds?", "Meters? ?per ?Seconds? ?Squared?", "(Foot|Feet) ?per ?Seconds?", "(Foot|Feet) ?per ?Seconds? ?Squared?", "Miles? ?per ?Hours?", "Miles? ?per ?Hours? ?Squared?", "Kilometers? ?per ?Hours?", "Kilometers? ?per ?Hours? ?Squared?", "Liters? ?per ?Seconds?", "(Cubic ?Meters?|Meters? ?Cubed?) ?per ?Seconds?", "(Squared? ?Yards?|Yards? ?Squared?)", "(Squared? ?(Feet|Foot)|(Feet|Foot) ?Squared?)", "(Squared? Millimeters?|Millimeters? ?Squared?)", "(Millimeters? ?Cubed?|Cubic ?Millimeters?)", "Gallons? ?per ?Seconds?", "Gallons? ?per ?Minutes?", "Pounds? ?per ?Seconds?", "Kilograms? ?per ?Seconds?", "Dollars? ?per ?Seconds?", "Dollars? ?per ?Hours?", "Dollars? ?per ?Days?", "Dollars? ?per ?Weeks?", "Dollars? ?per ?Months?", "Dollars? ?per ?Quarters?", "Dollars? ?per ?Years?", "Euros? ?per ?Seconds?", "Euros? ?per ?Hours?", "Euros? ?per ?Days?", "Euros? ?per ?Weeks?", "Euros? ?per ?Months?", "Euros? ?per ?Quarters?", "Euros? ?per ?Years?", "Centimeters?", "Millimeters?", "Kilometers?", "Inch(es)?", "(Foot|Feet)", "Yards?", "Miles?", "Acres?", "Hectares?", "Liters?", "Gallons?", "Quarts?", "Fluid ?Ounces?", "Years?", "Quarters?", "Months?", "Weeks?", "Days?", "Hours?", "Minutes?", "Kilograms?", "Milligrams?", "Ounces?", "Pounds?", "Tonnes?", "Tons?", "Watts?", "Kilowatts?", "Megawatts?", "Gigawatts?", "Calories?", "Kilocalories?", "(BTUs?|British ?Thermal ?units?)", "Kilojoules?", "Joules?", "Coulombs?", "Volts?", "Millivolts?", "Kilovolts?", "Newtons?", "Pounds? ?Force", "Atoms?", "Molecules?", "Farads?", "Pascals?", "Kilopascals?", "Bars?", "Atmospheres?", "Pounds? ?per ?Squared? ?Inch(es)?"];
var baseTargets = ["Degrees", "Degrees", "Amperes","Grams","Seconds","Meters","Meters^2", "Centimeters^2", "Centimeters^3", "Meters^3", "Kilometers^3", "Inches^2", "Miles^2", "Kilometers^2", "Acres,Feet", "Meters,Seconds^-1", "Meters,Seconds^-2", "Feet,Seconds^-1", "Feet,Seconds^-2", "Miles,Hours^-1", "Miles,Hours^-2", "Kilometers,Hours^-1", "Kilometers,Hours^-2", "Liters,Seconds^-1", "Meters^3,Seconds^-1", "Yards^2", "Feet^2", "Millimeters^2", "Millimeters^3", "Gallons,Seconds^-1", "Gallons,Minutes^-1", "Pounds,Seconds^-1", "Kilograms,Seconds^-1", "Dollars,Seconds^-1", "Dollars,Hours^-1", "Dollars,Days^-1", "Dollars,Weeks^-1", "Dollars,Months^-1", "Dollars,Quarters^-1", "Dollars,Years^-1", "Euros,Seconds^-1", "Euros,Hours^-1", "Euros,Days^-1", "Euros,Weeks^-1", "Euros,Months^-1", "Euros,Quarters^-1", "Euros,Years^-1", "Meters", "Meters", "Meters", "Meters", "Meters", "Meters", "Meters", "Meters^2", "Meters^2", "Meters^3", "Meters^3", "Meters^3", "Meters^3", "Seconds", "Seconds", "Seconds", "Seconds", "Seconds", "Seconds", "Seconds", "Grams", "Grams", "Grams", "Grams", "Grams", "Grams", "Joules,Seconds^-1", "Watts", "Watts", "Watts", "Joules", "Joules", "Joules", "Joules", "Newtons,Meters", "Amperes,Seconds", "Watts,Amperes^-1", "Volts", "Volts", "Kilograms,Meters,Seconds^-2", "Pounds,Feet per Second Squared", "Moles", "Moles", "Joules,Volts^-2", "Newton,Meters^-2", "Pascals", "Pascals", "Pascals", "Pascals"];
var baseScalings = [1, 180/Math.PI, 1, 1, 1, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, (0.01), (0.001), (1000), (0.0254), (0.3048), (0.9144), (1609.344), (4046.85642), (10000), (0.001), (0.003785), (0.000946), (0.00003), (31536000), (7884000), (2628000), (604800), (86400), (3600), (60), (1000), (0.001), (28.349523), (453.59237), (1000000), (907184.74),  1, (1000), (1000000), (1000000000), (4.184), (4184), (1055.05585), (1000),  1,  1,  1, (0.001), (1000),  1, (32.17405), (0.0), (0.0),  1,  1, (1000), (100000), (101325), (6894)];

var conScalings = [];
var conTargets = [];
var conSourceNames = [];
var conUnitTargets = [];
var conSourceRegEx = [];
function loadUnits(addedSources, addedTargets, addedScalings){
	conScalings = addedScalings;
	conTargets = addedTargets;
	conSourceNames = addedSources;
	for(var i = 0; i < baseSources.length; i++){
		conScalings.push(baseScalings[i]);
		conTargets.push(baseTargets[i]);
		conSourceNames.push(baseSources[i]);
	}
	
	conSourceRegEx = [];
	conUnitTargets= [];
	cachedUnits = {};
	unitsBank = {};
	for (var uk = 0; uk < conTargets.length; uk++) {
		conUnitTargets.push(unitsFromString(conTargets[uk].toLowerCase()));
  		conSourceRegEx.push(new RegExp("^"+conSourceNames[uk]+"$", "i"));
	}
}
loadUnits([], [], []);

var cachedUnits = {};

var findSourceIndex = function(name){
	if(name in cachedUnits){
		return cachedUnits[name];//memonization
	}
	for(var i = conSourceNames.length-1; i >= 0 ; i--){
		if(cachedUnits[i] != "" && conSourceRegEx[i].test(name)){
			cachedUnits[name] = i;
			return i;
		}
	}
	cachedUnits[name] = -1;
	return -1;
}

function Material(value, units) {
	this.value =  value;
  	this.units = units;
}

Material.prototype.toNum = function(){
	return this;
};

Material.prototype.toString = function(){
	if(this.units){
		return "<span class='markup'>{</span>"+this.value+"&nbsp"+this.units.toString()+"<span class='markup'>}</span>";
	}else{
		return this.value+"";
	}
}

Material.prototype.fullClone = function(){
	return new Material(this.value, this.units);
}

Material.prototype.forceUnits = function(newUnits){
	if(! this.units){
		this.units = newUnits;
	}else{
		var scale = convertUnits(this.units, newUnits);
		if (scale == 0) {
			unitAlert(this.units, newUnits, "forceUnits");
		} else {
			this.value = fn["*"](this.value, scale);
			this.units = newUnits;
		}
	}
	return this;
}


function unitAlert(lhs, rhs, type){
	throw "MSG: Incompatible units for the "+type+" of "+(lhs?lhs.toString():"unitless")+" and "+(rhs?rhs.toString():"unitless")+".";
}
