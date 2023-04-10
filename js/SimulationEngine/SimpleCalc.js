"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var notsupportedfn = function(){
	console.log("Not supported");
}
var sn = function(x){
	if(x[0]=="#"){
		return parseFloat(x.substr(2));
	}else{
		return parseFloat(x);
	}
}
var fn = {
	"+": function(a,b){return a+b},
	"-": function(a,b){if(isDefined(b)){return a-b}else{return -a;}},
	"*": function(a,b){return a*b},
	"/": function(a,b){return a/b},
	"=": function(a,b){return a==b},
	"<": function(a,b){return a<b},
	"<=": function(a,b){return a<=b},
	">": function(a,b){return a>b},
	">=": function(a,b){return a>=b},
	"mod": function(a,b){return a % b},
	"expt": function(a,b){return Math.pow(a,b)},
	"abs": Math.abs,
	"sin": Math.sin,
	"asin": Math.asin,
	"cos": Math.cos,
	"acos": Math.acos,
	"tan": Math.tan,
	"atan": Math.atan,
	"sqrt": Math.sqrt,
	"log": function(a, b){if(isDefined(b)){return Math.log(a)/Math.log(b)}else{return Math.log(a);}},
	"exp": Math.exp,
	"round": Math.round,
	"floor": Math.floor,
	"ceiling": Math.ceil,
	"angle": notsupportedfn,
	"magnitude": notsupportedfn,
	"real-part": function(x){return x}
}
