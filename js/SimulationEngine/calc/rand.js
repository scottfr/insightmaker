"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

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

function getRandPos() {
    if(window.timeStep === undefined){
    	return 0; //HeroCalc
    }else{
    	return Math.floor(time.value/timeStep.value); //Insight Maker
    }
}

function Rand(minVal, maxVal) {
  if(! isUndefined(window.simulate) ){
	simulate.stochastic = true;
  }
	
	
  if (minVal != null) {
    return Rand() * (maxVal - minVal) + (0+minVal);
  }
  if(isUndefined(window.simulate) || simulate.RKOrder == 1){
  	return Math.random();
  }
  var RandPos = getRandPos();
  if (RandPos != simulate.lastRandPos) {
    simulate.randLoc = (-1);
    simulate.lastRandPos = RandPos;
  }
  while (simulate.previousRandLists.length <= RandPos) {
    simulate.previousRandLists.push(new RandList());
  }
  simulate.randLoc = simulate.randLoc + 1;
  return simulate.previousRandLists[RandPos].get(simulate.randLoc);
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
  return z * (sigma) + (0+mu);
}
function RandExp(lambda) {
    if (lambda == null) {
      lambda = 1;
    }
  return -(1/lambda) * Math.log(Rand());
}
function RandLognormal(mu, sigma) {
  var lmu = Math.log(mu) - (0.5) * Math.log((1) + Math.pow(sigma / mu, (2)));
  var lsigma = Math.sqrt(Math.log((1) + Math.pow(sigma / mu, (2))));
  return Math.exp(RandNormal(lmu, lsigma));
}
function RandBinomial(count, probability) {
  var res = 0;
  for (var i = 1; i <= count; i++) {
    if (Rand() <= probability) {
      res = res + (1);
    }
  }
  return res;
}
function RandNegativeBinomial(successes, probability) {
  var i = 0;
  var s = 0;
  while (s < successes) {
    if (Rand() <= probability) {
      s = s + 1;
    }
    i = i + 1;
  }
  return i;
}
function RandPoisson(lambda) {
  var L = Math.exp(-lambda);
  var k = 0;
  var p = 1;
  while (true) {
    k = k + 1;
    p = p * Rand();
    if (!(p > L)) {
      break;
    }
  }
  return k - 1;
}

function RandGamma(alpha, beta) {
  var temp = 1;
  for (var i = 1; i <= alpha; i++) {
    temp = temp * Rand();
  }
  return -beta * Math.log(temp);
}

function RandBeta(alpha, beta) {
	var x = RandGamma(alpha, 1);
	var y = RandGamma(beta, 1);
	return x/(x+y);
}

function RandTriangular(minimum, maximum, peak) {
	
	var a = (0+minimum);
	var b = (0+maximum);
	var c = (0+peak);
	
	if(a == b){
		throw "MSG: Maximum can't equal the minimum for the triangular distribution.";
	}
	
	if(c<a || c>b){
		throw "MSG: The peak must be within the maximum and minimum for the triangular distribution.";
	}
	
	var fc = (c-a)/(b-a);
	
	var u = Rand();
	
	if(u<fc){
		return a + Math.sqrt(u * (b-a) * (c-a));
	}else{
		return b - Math.sqrt((1-u) * (b-a) * (b-c));
	}
}

function RandDist(x, y){
	//console.log(x);
	//console.log(y);
	if(x.length != y.length){
		throw "MSG: The lengths of the 'x' and 'y' vectors must be the same.";
	}
	if(x.length < 2){
		throw "MSG: There must be at least 2 points in a distribution to generate a random number."
	}
	var area = 0;
	for(var i = 0; i < x.length - 1; i++){
		area += (x[i+1]-x[i])*(y[i+1]+y[i])/2;
	}
	if(area == 0){
		throw "MSG: The area of the distribution cannot be 0."
	}
	//console.log(area);
	
	var a = area*Rand();
	var area = 0
	for(var i = 0; i < x.length-1; i++){
		var nextArea = (x[i+1]-x[i])*(y[i+1]+y[i])/2;
		if(a > area && a < area + nextArea){
			var neededArea = a - area;
			var slope = (y[i+1]-y[i])/(x[i+1]-x[i]);
			//var dist = neededArea/((y[i+1]+y[i])/2); 	// a = h*x+x*s*x/2 = x^2*s/2+h*x - a
														// x= (-h +/- sqrt(h^2+4*s/2*a))/s
			var dist;
			if(slope == 0 ){
				dist = neededArea/y[i];
			}else{
			//	console.log("--")
			//	console.log(y[i]);
			//	console.log(Math.pow(y[i],2));
			//	console.log(slope);
			//	console.log(neededArea);
				dist = (-y[i]+Math.sqrt(Math.pow(y[i], 2)+2*slope*neededArea))/slope;
			//	console.log(dist);
			}
			
			return x[i]+dist;
		}
		area += nextArea;
	}
	
}


