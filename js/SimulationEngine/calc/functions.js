"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


defineFunction("RandBoolean", {params: [{name:"Probability", defaultVal: 0.5, noUnits:true, noVector:true}]}, function(x){
	var p;
	if (x.length != 0) {
		p = x[0].toNum().value;
	}else{
		p = 0.5;
	}
	
	if(Rand()< p){
		return true;
	}else{
		return false;
			
	}
});
defineFunction("Rand", {params: [{name:"Lower Bound", defaultVal: 0, noUnits:true, noVector:true}, {name:"Upper Bound", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	if (x.length != 0) {
		return new Material(Rand(x[0].toNum().value, x[1].toNum().value), new UnitStore());
	} else {
		return new Material(Rand(), new UnitStore());
	}
});
defineFunction("RandNormal", {params: [{name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	if (x.length != 0) {
		return new Material(RandNormal(x[0].toNum().value, x[1].toNum().value), new UnitStore());
	} else {
		return new Material(RandNormal(), new UnitStore());
	}
});
defineFunction("RandExp", {params: [{name:"Rate", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	if (x.length != 0) {
		return new Material(RandExp(x[0].toNum().value), new UnitStore());
	} else {
		return new Material(RandExp(), new UnitStore());
	}
});
defineFunction("RandLognormal", {params: [{name:"Mean", noUnits:true, noVector:true}, {name:"Standard Deviation", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandLognormal(x[0].toNum().value, x[1].toNum().value), new UnitStore());
});
defineFunction("RandBinomial", {params: [{name:"Count", noUnits:true, noVector:true}, {name:"Probability", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandBinomial(x[0].toNum().value, x[1].toNum().value), new UnitStore());
});
defineFunction("RandNegativeBinomial", {params: [{name:"Successes", noUnits:true, noVector:true}, {name:"Probability", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandNegativeBinomial(x[0].toNum().value, x[1].toNum().value), new UnitStore());
});
defineFunction("RandGamma", {params:[{name:"Alpha", noUnits:true, noVector:true}, {name:"Beta", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandGamma(x[0].toNum().value, x[1].toNum().value), new UnitStore());
});
defineFunction("RandPoisson", {params:[{name:"Rate", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandPoisson(x[0].toNum().value), new UnitStore());
});
defineFunction("RandTriangular", {params:[{name:"Minimum", noUnits:true, noVector:true}, {name:"Maximum", noUnits:true, noVector:true}, {name:"Peak", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandTriangular(x[0].toNum().value, x[1].toNum().value, x[2].toNum().value), new UnitStore());
});

defineFunction("Real", {params:[{name: "Number", noVector: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn["real-part"](r.value);
	return r;
});
defineFunction("Imag", {params:[{name: "Number", noVector: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn["imag-part"](r.value);
	return r;
});
defineFunction("Magnitude", {params:[{name: "Number"}]}, function(x){
	if(x[0].toNum() instanceof Vector){
		return functionBank["sqrt"]([functionBank["sum"]([mult(x[0], x[0])])])
	}
	var r = x[0].toNum().clone();
	r.value = fn.magnitude(r.value);
	return r;
});
defineFunction("Angle", {params:[{name: "Number", noVector: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.angle(r.value);
	return r;
});
defineFunction("Abs", {params:[{name: "Number", noVector: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.abs(r.value);
	return r;
});
defineFunction("sin", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.sin(r.value);
	return r;
});
defineFunction("cos", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.cos(r.value);
	return r;
});
defineFunction("tan", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.tan(r.value);
	return r;
});
defineFunction("asin", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.asin(r.value);
	return r;
});
defineFunction("acos", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.acos(r.value);
	return r;
});
defineFunction("atan", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.atan(r.value);
	return r;
});
defineFunction("Sqrt", {params:[{name: "Number", noVector: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.sqrt(r.value);
	for (var i = 0; i < r.units.exponents.length; i++) {
		r.units.exponents[i] = r.units.exponents[i] / 2;
	}
	return r;
});
defineFunction("Ln", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.log(r.value);
	return r;
});
defineFunction("Log", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.log(r.value, "10");
	return r;
});
defineFunction("Logit", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn["-"](fn.log(r.value), fn.log(fn["-"](1, r.value)));
	return r;
});
defineFunction("Expit", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn["/"](1, fn["+"](1, fn.exp(fn["-"](r.value)))) ;
	return r;
});
defineFunction("Round", {params:[{name: "Number", noVector: true, noUnits: false}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.round(r.value);
	return r;
});
defineFunction("Ceiling", {params:[{name: "Number", noVector: true, noUnits: false}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.ceiling(r.value);
	return r;
});
defineFunction("Floor", {params:[{name: "Number", noVector: true, noUnits: false}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.floor(r.value);
	return r;
});
defineFunction("Exp", {params:[{name: "Number", noVector: true, noUnits: true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = fn.exp(r.value);
	return r;
});
functionBank["ifthenelse"] = function(x) {
	testArgumentsSize(x, "IfThenElse", 3, 3);
	/*c("IfThenElse", x, [false, true, true]);
	if (x[0]) {
		return x[1];
	} else {
		return x[2];
		}*/
	var v = evaluateNode(x[0].node, x[0].scope).toNum();
	if(trueValue(v)){
		//console.log("T");
		return evaluateNode(x[1].node, x[1].scope);
	}else{
		//console.log("F")
		return evaluateNode(x[2].node, x[2].scope);
	}
};
functionBank["ifthenelse"].delayEvalParams = true;

functionBank["map"] = function(x) {
	testArgumentsSize(x, "Map", 2, 2);
	var v = evaluateNode(x[0].node, x[0].scope);
	if(! (v instanceof Vector)){
		throw "MSG: \"Map\" requires a vector as its first argument.";
	}
	var node = x[1].node;
	var scope = {x: null, "-parent": x[0].scope}
	function f(input){
		scope.x = input;
		return evaluateNode(node, scope);
	}
	return  v.apply(f);
};
functionBank["map"].delayEvalParams = true;

functionBank["sample"] = function(x) {
	testArgumentsSize(x, "Sample", 2, 3);
	var v = x[0].toNum();
	var count = x[1].toNum().value;
	if(! (v instanceof Vector)){
		throw "MSG: \"Sample\" requires a vector as its first argument.";
	}
	if(count == 0){
		return new Vector([]);
	}

	var length = v.length();
	var repeat = x[2] && trueValue(x[2].toNum());
	
	if(length==0){
		throw "MSG: \"Sample\" requires a non-empty vector.";
	}
	var res = [];
	if(repeat){
		for(var i = 0; i < count; i++){
			res.push(v.items[Math.floor(Rand()*length)]);
		}
	}else{
		if(length<count){
			throw "MSG: \"Sample\" vector is too small for the given sample size.";	
		}
		var arr = v.items;
		var size  = count;
		var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
		    while (i-- > min) {
		        index = Math.floor(i * Rand());
		        temp = shuffled[index];
		        shuffled[index] = shuffled[i];
		        shuffled[i] = temp;
		    }
		    res = shuffled.slice(min);
	}
	
	return new Vector(res);
};

defineFunction("IndexOf", {params:[{name: "Haystack", needVector: true, noUnits: true}, {name: "Needle", allowBoolean:true}]}, function(x){

	var v = x[1];
	if(v instanceof Vector){
		var res = [];
		for(var i=0; i<v.length(); i++){
			res.push(findElement(v.items[i], x[0]));
		}
		return new Vector(res);
	}else{
		return findElement(v, x[0]);
	}
});

defineFunction("Contains", {params:[{name: "Haystack", needVector: true, noUnits: true}, {name: "Needle", allowBoolean:true, noVector:true}]}, function(x){
		
	if(eq(new Material(0), functionBank["indexof"](x))){
		return false;
	}else{
		return true;
	}
});

function findElement(needle, haystack){
	for(var i=0; i<haystack.length(); i++){
		if(eq(needle, haystack.items[i])){
			return new Material(i+1);
		}
	}
	return new Material(0);
}

functionBank["filter"] = function(x) {
	testArgumentsSize(x, "Filter", 2, 2);
	var v = evaluateNode(x[0].node, x[0].scope);
	if(! (v instanceof Vector)){
		throw "MSG: \"Filter\" requires a vector as its first agrument.";
	}
	var t = functionBank["map"](x);
	return  functionBank["select"]([v,t]);
};
functionBank["filter"].delayEvalParams = true;

functionBank["join"] = function(x){
	var res = [];
	for(var i = 0; i < x.length; i++){
		if(x[i] instanceof Vector){
			res = res.concat(x[i].items)
		}else{
			res.push(x[i]);
		}
	}
	return new Vector(res);
};

functionBank["repeat"] = function(x){
	testArgumentsSize(x, "Repeat", 2, 2);
	var count = evaluateNode(x[1].node, x[1].scope).toNum();
	var res = [];
	var scope = {x: null, "-parent": x[1].scope}
	for(var  i = 0; i < count; i++){
		scope.x = new Material(i+1);
		res.push(evaluateNode(x[0].node, scope));
	}
	return  new Vector(res);
	
};
functionBank["repeat"].delayEvalParams = true;

defineFunction("Select", {params:[{name: "Haystack", needVector: true, noUnits: true}, {name: "Indexes", noUnits: true}]}, function(x){
		
	var indexes = x[1].toNum();
	if(x[1] instanceof Vector){
		var v = x[1].toNum();
		var isBoolean = true;
		for(var i=0; i < v.length(); i++){
			if(v.items[i] instanceof Material){
				isBoolean = false;
				break;
			}
		}
		if(isBoolean==true){
			var res = [];
			if(v.length()!=x[0].length()){
				throw "MSG: Length of vector must be equal for boolean selection.";
			}
			for(var i=0; i<v.length();i++){
				if( trueValue(v.items[i]) ){
					res.push(x[0].items[i]);
				}
			}
			return new Vector(res);
		}else{
			var res = [];
			for(var i=0; i<v.length();i++){
				var q = v.items[i].value
				if(q<=0 || q > x[0].length()){
					throw "MSG: Selected element out of range.";
				}
				res.push(x[0].items[q-1]);
			}
			return new Vector(res);
		}
	}else{
		if(x[1].value>0 && x[1].value <= x[0].length()){
			return x[0].items[x[1].value-1];
		}else{
			throw "MSG: Selected element out of range.";
		}
	}
});

defineFunction("Reverse", {allowEmpty:true, params:{name: "Items..."}, prep: function(x){
	return functionBank["join"](x).items;
}}, function(x){

	var res = [];
	for (var i = x.length-1; i >= 0; i--) {
		res.push(x[i]);
	}
	return new Vector(res);
});

defineFunction("Sort", {allowEmpty:true, params:{name: "Items..."}, prep: function(x){
	return functionBank["flatten"](x).toNum().items;
}}, function(x){

	return new Vector(x.sort(function(a,b){
		if(lessThan(a,b)){
			return -1;
		}
		if(greaterThan(a,b)){
			return 1;
		}
		return 0;
	}));
});

defineFunction("Unique", {allowEmpty:true, params:{name: "Items....", allowBoolean:true}, prep: function(x){
	return functionBank["join"](x).toNum().items;
}}, function(x){	
	if(x.length==0){
		return new Vector([]);
	}
	
	var res = [];
	
	for(var i = 0; i < x.length; i++){
		var found = false;
		for(var j = 0; j < res.length; j++){
			if(strictEquals(x[i], res[j])){
				found = true;
				break;
			}
		}
		if(! found){
			res.push(x[i]);
		}
	}
	return new Vector(res);
});

defineFunction("Union", {params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
	return functionBank["unique"](functionBank["join"](x).items);
});

defineFunction("Intersection", {params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
	var v1 = x[0];
	var v2 = x[1];
	
	var res = [];
	
	for(var i = 0; i < v1.items.length; i++){
		for(var j = 0; j < v2.items.length; j++){
			if(strictEquals(v1.items[i], v2.items[j])){
				res.push(v1.items[i]);
				break;
			}
		}
	}
	return functionBank["unique"](res);
});


defineFunction("Difference", {params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
	var v1 = x[0];
	var v2 = x[1];
	
	var res = [];
	
	for(var i = 0; i < v1.items.length; i++){
		var found = false;
		for(var j = 0; j < v2.items.length; j++){
			if(strictEquals(v1.items[i], v2.items[j])){
				found = true;
				break;
			}
		}
		if(! found){
			res.push(v1.items[i]);
		}
	}
	for(var i = 0; i < v2.items.length; i++){
		var found = false;
		for(var j = 0; j < v1.items.length; j++){
			if(strictEquals(v2.items[i], v1.items[j])){
				found = true;
				break;
			}
		}
		if(! found){
			res.push(v2.items[i]);
		}
	}
	
	return functionBank["unique"](res);
});

defineFunction("Factorial", {params: [{name: "Number", noUnits: true, noVector:true}]}, function(x){
	var r = x[0].toNum().clone();
	r.value = factorial(r.value);
	return r;
});

defineFunction("Max", {params: {name: "Items..."}, prep: function(x){return functionBank["join"](x).toNum().items}}, function(x){
	var maxItem = x[0].clone();
	for (var i = 1; i < x.length; i++) {
		if (greaterThan(x[i], maxItem)) {
			maxItem = x[i].clone();
		}
		if (maxItem.units.unitless()) {
			maxItem.units = x[i].units;
		}
	}
	return maxItem;
});
defineFunction("Min", {params:{name: "Items..."}, prep:function(x){return functionBank["join"](x).toNum().items}}, function(x){
	var minItem = x[0].clone();
	for (var i = 1; i < x.length; i++) {
		if (lessThan(x[i], minItem)) {
			minItem = x[i].clone();
		}
		if (minItem.units.unitless()) {
			minItem.units = x[i].units;
		}
	}
	return minItem;
});
defineFunction("Mean", {params:{name: "Items..."}, prep:function(x){return functionBank["join"](x).toNum().items}}, function(x){
	var sum = x[0];
	for (var i = 1; i < x.length; i++) {
		sum = plus(sum, x[i]);
	}
	return div(sum, new Material(x.length));
});
defineFunction("Sum", {params:{name: "Items..."}, prep:function(x){return functionBank["join"](x).toNum().items}}, function(x){
	var sum = x[0];
	for (var i = 1; i < x.length; i++) {
		sum = plus(sum, x[i]);
	}
	return sum;
});
defineFunction("Product", {params:{name: "Items..."}, prep:function(x){return functionBank["join"](x).toNum().items}}, function(x){
	var total = x[0];
	for (var i = 1; i < x.length; i++) {
		total = mult(total, x[i]);
	}
	return total;
});
defineFunction("Median", {params:{name: "Items..."}, prep:function(x){return functionBank["sort"](x).toNum().items}}, function(x){
	if (Math.floor((x.length - 1) / 2) == (x.length - 1) / 2) {
		return x[(x.length - 1) / 2];
	} else {
		return div(plus(x[Math.floor(((x.length - 1) / 2))], x[Math.ceil(((x.length - 1) / 2))]), new Material(2));
	}
});
defineFunction("StdDev", {params:{name: "Items..."}, prep:function(x){return functionBank["join"](x).toNum().items}}, function(x){
	
	if (x.length > 1) {

		var mean = functionBank["mean"](x);
		var sum = power(minus(x[0], mean), new Material(2));

		for (var i = 1; i < x.length; i++) {

			sum = plus(sum, power(minus(x[i], mean), new Material(2)));
		}
		var r = power(div(sum, new Material(x.length - 1)), new Material(0.5));

		return functionBank["real"]([r]);
	}else{
		throw "MSG: You must have at least two elements to calculate the standard deviation.";
	}
});
defineFunction("Correlation", {params:  [{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x) {
	var v1 = x[0].toNum();
	var v2 = x[1].toNum();

	if(v1.length() <= 1){
		throw "MSG: You must have at least two elements in your vectors to calculate their correlation.";
	}
	if(v1.length() != v2.length()){
		throw "MSG: The vectors for \"Correlation\" must be of the same size.";
	}
	
	var v1_mean = functionBank["mean"]([v1]);
	var v2_mean = functionBank["mean"]([v2]);
	
	return div(functionBank["sum"]([mult(minus(v1, v1_mean), minus(v2, v2_mean))]), mult(minus(functionBank["count"]([v1]), new Material(1)), mult(functionBank["stddev"]([v1]), functionBank["stddev"]([v2]))))
});
functionBank["count"] = function(x) {
	x = functionBank["join"](x).items;
	return new Material(x.length);
};
functionBank["flatten"] = function(x) {
	x = functionBank["join"](x).items;
	return new Vector(flatten(new Vector(x)));
};

function flatten(x){
	var res = [];
	for(var i=0; i<x.length(); i++){
		if(x.items[i] instanceof Vector){
			res = res.concat(flatten(x.items[i]));
		}else{
			res.push(x.items[i]);
		}
	}
	return res;
}


defineFunction("SetRandSeed", {params:[{name:"Seed Number", noUnits:true, noVector:true}]}, function(x) {
	Math.seedrandom(x[0].toNum());
	return "Random Seed Set";
});


function defineFunction(name, definition, fn){
	var configs = definition.params;
	var arr = $.isArray(configs);
	
	var requiredLength = configs.length;
	for(var i=0; i < configs.length; i++){
		if(configs[i].hasOwnProperty("defaultVal")){
			requiredLength = i;
			break;
		}
	}
	
	var fnName;
	if(arr){	
		 fnName = name + "(" + configs.map(function(x){return x.name+(x.hasOwnProperty("defaultVal")?"="+x.defaultVal.toString():"");}).join(", ")+")";
	} else{
		fnName = name + "(items...)";
	}
	
	functionBank[name.toLowerCase()] = function(x, id){
		if(definition.prep){
			x = definition.prep(x);
		}
		if ( arr && (x.length > configs.length || x.length < requiredLength) ) {
			throw "MSG: Wrong number of parameters for " + fnName + ".";
		}else if((! arr) && x.length == 0 && (! definition.allowEmpty)){
			throw "MSG: At least one parameter required for " + name + "().";
		}
		
		for (var i = 0; i < x.length; i++) {
			var config = arr?configs[i]:configs;
			if (config.noUnits && (!((!(x[i].toNum() instanceof Material)) || x[i].toNum().units.unitless()))) {
				throw "MSG: " + fnName + " does not except units for the argument '"+config.name+"'.";
			}
			if (config.noVector && (x[i] instanceof Vector)) {
				throw "MSG: " + fnName + " does not except vectors for the argument '"+config.name+"'.";
			}
			if (config.needVector && ! (x[i] instanceof Vector)) {
				throw "MSG: " + fnName + " requires a vector for the argument '"+config.name+"'.";
			}
			if (config.needPrimitive && ! (x[i] instanceof Primitive)) {
				throw "MSG: " + fnName + " requires a primitive for the argument '"+config.name+"'.";
			}
			if ((! config.allowBoolean) && (typeof x[i] == "boolean")) {
				throw "MSG: " + fnName + " does not accept boolean values.";
			}
			if (config.needAgent && (!  (x[i] instanceof Agent) )) {
				x[i] = agent(x[i], fnName, config.name);
			}
			if (config.needAgents && (!  (x[i] instanceof Agents) )) {
				x[i] = agents(x[i], fnName, config.name);
			}
			if (config.needPopulation && (!  (x[i] instanceof Vector) )) {
				x[i] = getPopulation(x[i], fnName, config.name);
			}
		}
		
		return fn(x, id);
	}
}


function factorial(x) {
	if (Math.round(x) != x) {
		throw "MSG: The \"factorial\" function only accepts integers.";
	} else if (x < 0) {
		throw "MSG: The \"factorial\" function is only defined for 0 or larger."
	}
	if (x > 1) {
		return x * factorial(x - 1);
	} else {
		return 1;
	}
}

function testArgumentsSize(x, name, min, max){
	if(x.length<min || x.length>max){
		throw "MSG: Wrong number of parameters for "+name+"()."
	}
}
