"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

function RandList() {
  this.vals = [];
}
RandList.prototype.get = function(i) {
  if (i > this.vals.length - 1) {
    for (var j = this.vals.length; j <= i; j++) {
      this.vals.push(Math.random());
    }
  }
  return this.vals[i];
}
// ********** Code for top level **************
var PreviousRandLists = [];
var RandLoc = -1;
var lastRandPos = -1;
function getRandPos() {
    if(window.TimeStep === undefined){
    	return 0; //HeroCalc
    }else{
    	return Math.floor(Time.value/TimeStep.value); //Insight Maker
    }
}

function Rand(minVal, maxVal) {
  if (minVal != null) {
    return Rand() * (maxVal - minVal) + minVal;
  }
  var RandPos = getRandPos();
  if (RandPos != lastRandPos) {
    RandLoc = (-1);
    lastRandPos = RandPos;
  }
  while (PreviousRandLists.length <= RandPos) {
    PreviousRandLists.push(new RandList());
  }
  RandLoc = RandLoc + (1);
  return PreviousRandLists[RandPos].get(RandLoc);
}

function RandNormal(mu, sigma) {
    if (mu == null) {
      mu = 0;
    }
    if (sigma == null) {
      sigma = 1;
    }

  var z;
  z = Math.sqrt((-2) * Math.log((1) - Rand())) * Math.cos(Rand() * (2) * (3.141593));
  return z * sigma + mu;
}
function RandExp(lambda) {
    if (lambda == null) {
      lambda = 1;
    }
  return -lambda * Math.log(Rand());
}
function RandLognormal(mu, sigma) {
  var lmu = Math.log(mu) - (0.5) * Math.log((1) + Math.pow(sigma / mu, (2)));
  var lsigma = Math.sqrt(Math.log((1) + Math.pow(sigma / mu, (2))));
  return Math.exp(RandNormal(lmu, lsigma));
}
function RandBinomial(count, probability) {
  var res = (0);
  for (var i = (1);
   i <= count; i++) {
    if (Rand() <= probability) {
      res = res + (1);
    }
  }
  return res;
}
function RandNegativeBinomial(successes, probability) {
  var i = (0);
  var s = (0);
  while (s < successes) {
    if (Rand() <= probability) {
      s = s + (1);
    }
    i = i + (1);
  }
  return i;
}
function RandPoisson(lambda) {
  var L = Math.exp(-lambda);
  var k = (0);
  var p = (1);
  while (true) {
    k = k + (1);
    p = p * Rand();
    if (!(p > L)) {
      break;
    }
  }
  return k - (1);
}
function RandGamma(alpha, beta) {
  var temp = (1);
  for (var i = (1);
   i <= alpha; i++) {
    temp = temp * Rand();
  }
  return -beta * Math.log(temp);
}
function RandTriangular(minimum, maximum, peak) {
	if(minimum==maximum){
		throw "MSG: Maximum can't equal the minimum for the triangular distribution.";
	}
	var a = minimum;
	var b = maximum;
	var c = peak;
	
	var fc = (c-a)/(b-a);
	
	var u = Rand();
	
	if(u<fc){
		return a + Math.sqrt(u * (b-a) * (c-a));
	}else{
		return b - Math.sqrt((1-u) * (b-a) * (b-c));
	}
}


