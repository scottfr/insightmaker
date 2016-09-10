"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


functionLoaders.push(function(){

defineFunction("RandBeta", {params: [{name:"Alpha", noUnits:true, noVector:true}, {name:"Beta", noUnits:true, noVector:true}]}, function(x){
	
	return new Material(RandBeta(x[0].value, x[1].value));
});
defineFunction("RandDist", {params: [{name:"Distribution", noUnits:true, needVector:true}, {name:"Y (in which case Distribution is X)", noUnits:true, needVector:true, defaultVal: false}]}, function(x){
	var xVals, yVals;
	if(x.length == 1 || x[1] === false){
		var vec = x[0];
		xVals = [];
		yVals = [];
		for(var i=0; i<vec.items.length; i++){
			xVals.push(vec.items[i].items[0].toNum().value);
			yVals.push(vec.items[i].items[1].toNum().value);
		}
	}else{
		xVals = x[0].toNum().items.map(function(x){return x.value});
		yVals = x[1].toNum().items.map(function(x){return x.value});
	}
	return new Material(RandDist(xVals, yVals));
});
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
		return new Material(Rand(x[0].toNum().value, x[1].toNum().value));
	} else {
		return new Material(Rand());
	}
});
defineFunction("RandNormal", {params: [{name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	if (x.length != 0) {
		return new Material(RandNormal(x[0].toNum().value, x[1].toNum().value));
	} else {
		return new Material(RandNormal());
	}
});
defineFunction("RandExp", {params: [{name:"Rate", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	if (x.length != 0) {
		return new Material(RandExp(x[0].toNum().value));
	} else {
		return new Material(RandExp());
	}
});
defineFunction("RandLognormal", {params: [{name:"Mean", noUnits:true, noVector:true}, {name:"Standard Deviation", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandLognormal(x[0].toNum().value, x[1].toNum().value));
});
defineFunction("RandBinomial", {params: [{name:"Count", noUnits:true, noVector:true}, {name:"Probability", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandBinomial(x[0].toNum().value, x[1].toNum().value));
});
defineFunction("RandNegativeBinomial", {params: [{name:"Successes", noUnits:true, noVector:true}, {name:"Probability", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandNegativeBinomial(x[0].toNum().value, x[1].toNum().value));
});
defineFunction("RandGamma", {params:[{name:"Alpha", noUnits:true, noVector:true}, {name:"Beta", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandGamma(x[0].toNum().value, x[1].toNum().value));
});
defineFunction("RandPoisson", {params:[{name:"Rate", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandPoisson(x[0].toNum().value));
});
defineFunction("RandTriangular", {params:[{name:"Minimum", noUnits:true, noVector:true}, {name:"Maximum", noUnits:true, noVector:true}, {name:"Peak", noUnits:true, noVector:true}]}, function(x){
	return new Material(RandTriangular(x[0].toNum().value, x[1].toNum().value, x[2].toNum().value));
});

defineFunction("Real", {params:[{name: "Number"}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn["real-part"](r.value);
	return r;
});
defineFunction("Imag", {params:[{name: "Number"}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn["imag-part"](r.value);
	return r;
});
defineFunction("Magnitude", {params:[{name: "Number"}]}, function(x){
	if(x[0].toNum() instanceof Vector){
		return functionBank["sqrt"]([functionBank["sum"]([mult(x[0], x[0])])])
	}
	var r = x[0].toNum();
	r.value = fn.magnitude(r.value);
	return r;
});
defineFunction("Angle", {params:[{name: "Number"}], recurse: true}, function(x){
	return new Material(fn.angle(x[0].toNum().value), getUnitStore(["radians"], [1]));
});
defineFunction("Abs", {params:[{name: "Number"}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn.abs(r.value);
	return r;
});
defineFunction("sin", {params:[{name: "Number"}], recurse: true}, function(x){
	var z = x[0].toNum();
	
	if(z.units){
		z = mult(z, new Material(1, getUnitStore(["radians"], [-1])))
	}
	if(! z.units){
		return new Material(fn.sin(z.value));
	}else{
		throw "MSG: Non-angular units cannot be used in Sin().";
	}
});
defineFunction("cos", {params:[{name: "Number"}], recurse: true}, function(x){
	var z = x[0].toNum();
	
	if(z.units){
		z = mult(z, new Material(1, getUnitStore(["radians"], [-1])))
	}
	if(! z.units){
		return new Material(fn.cos(z.value));
	}else{
		throw "MSG: Non-angular units cannot be used in Cos().";
	}
	
});
defineFunction("tan", {params:[{name: "Number"}], recurse: true}, function(x){
	var z = x[0].toNum();
	
	if(z.units){
		z = mult(z, new Material(1, getUnitStore(["radians"], [-1])))
	}
	if(! z.units){
		return new Material(fn.tan(z.value));
	}else{
		throw "MSG: Non-angular units cannot be used in Tan().";
	}
	
});


defineFunction("asin", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.asin(x[0].toNum().value));
});
defineFunction("acos", {params:[{name: "Number",  noUnits: true}], recurse: true}, function(x){
	return new Material(fn.acos(x[0].toNum().value));
});
defineFunction("atan", {params:[{name: "Number",  noUnits: true}], recurse: true}, function(x){
	return new Material(fn.atan(x[0].toNum().value));
});

defineFunction("arcsin", {params:[{name: "Number",  noUnits: true}], recurse: true}, function(x){
	return new Material(fn.asin(x[0].toNum().value), getUnitStore(["radians"], [1]));
});
defineFunction("arccos", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.acos(x[0].toNum().value), getUnitStore(["radians"], [1]));
});
defineFunction("arctan", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.atan(x[0].toNum().value), getUnitStore(["radians"], [1]));
});

defineFunction("Sign", {params:[{name: "Number"}], recurse: true}, function(x){
	var r = x[0].toNum();
	if (r.value < 0) {
		return div(new Material(-1), new Material(1));
	} else if (r.value > 0) {
		return div(new Material(1), new Material(1));
	} else if(r.value == 0) {
		return new Material(0);
	}
	throw "MSG: Invalid value for Sign";
});

defineFunction("Sqrt", {params:[{name: "Number"}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn.sqrt(r.value);
	if(r.units){
		for (var i = 0; i < r.units.exponents.length; i++) {
			r.units.exponents[i] = r.units.exponents[i] / 2;
		}
	}
	return r;
});
defineFunction("Ln", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.log(x[0].toNum().value));
});
defineFunction("Log", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.log(x[0].toNum().value, 10));
});
defineFunction("Logit", {params:[{name: "Number",  noUnits: true}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn["-"](fn.log(r.value), fn.log(fn["-"](1, r.value)));
	return r;
});
defineFunction("Expit", {params:[{name: "Number",  noUnits: true}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn["/"](1, fn["+"](1, fn.exp(fn["-"](r.value)))) ;
	return r;
});
defineFunction("Round", {params:[{name: "Number", noUnits: false}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn.round(r.value);
	return r;
});
defineFunction("Ceiling", {params:[{name: "Number", noUnits: false}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn.ceiling(r.value);
	return r;
});
defineFunction("Floor", {params:[{name: "Number",  noUnits: false}], recurse: true}, function(x){
	var r = x[0].toNum();
	r.value = fn.floor(r.value);
	return r;
});
defineFunction("Exp", {params:[{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(fn.exp(x[0].toNum().value));
});

functionBank["ifthenelse"] = function(x) {
	testArgumentsSize(x, "IfThenElse", 3, 3);
	
	var v = evaluateNode(x[0].node, x[0].scope).toNum();
	
	if (v instanceof Vector) {
		return vecIfThenElse(v, evaluateNode(x[1].node, x[1].scope), evaluateNode(x[2].node, x[2].scope))
	}
	
	if(trueValue(v)){
		//console.log("T");
		return evaluateNode(x[1].node, x[1].scope);
	}else{
		//console.log("F")
		return evaluateNode(x[2].node, x[2].scope);
	}
};
functionBank["ifthenelse"].delayEvalParams = true;

function vecIfThenElse(test, tVal, fVal) {
	
	var choiceFn = function(t, f) {
		if (t instanceof Vector) {
			return t.combine(f, choiceFn);
		} else {
			return [t, f];
		}
	};
		
	var choices = tVal.cloneCombine(fVal, choiceFn);
	
	var testFn = function(test, val) {
		if (test instanceof Vector) {
			return test.combine(val, testFn);
		}
		
		if (trueValue(test)) {
			return val[0];
		} else {
			return val[1];
		}
	}
	
	return test.cloneCombine(choices, testFn)
}


functionBank["map"] = function(x) {
	//console.log(x);
	testArgumentsSize(x, "Map", 2, 2);
	var v;
	if(x[0].node instanceof Vector){
		v = x[0].node;
	}else if(x[0] instanceof Vector){
		v = x[0];
	}else{
		v = evaluateNode(x[0].node, x[1].scope);
	}
	
	if(v instanceof Primitive){
		v = v.toNum();
	}
	if(! (v instanceof Vector)){
		throw "MSG: Map() requires a vector as its first argument.";
	}
	v = v.fullClone();
	
	var fn;
	var scope = {x: null, "-parent": x[1].scope}
	var node = x[1].node;
	try{
		fn = evaluateNode(node, scope)
	}catch(err){
		
	};

	var f;
	if( (fn instanceof Function) || (fn instanceof UserFunction)){
		if(fn.fn){
			fn=fn.fn;
		}
		f = function(x, key){
			return fn([x]);
		};
	}else{
		f = function(input, key){
			scope.x = input;
			scope.key = key || "";
			return evaluateNode(node, scope);
		}
	}

	return  v.apply(f);
};
functionBank["map"].delayEvalParams = true;
VectorObject["map"] = functionBank["map"];

defineFunction( "Sample", {object: [functionBank, VectorObject], params:[{name: "Vector", needVector: true}, {name: "Sample Size"}, {name: "Repeat", noVector: true, allowBoolean: true, defaultVal: false}]}, function(x){
	var v = x[0].toNum();
	var count = x[1].toNum().value;
	if(count == 0){
		return new Vector([]);
	}

	var length = v.length();
	var repeat = x[2] && trueValue(x[2].toNum());
	
	if(length==0){
		throw "MSG: Sample() requires a non-empty vector.";
	}
	var res = [];
	if(repeat){
		for(var i = 0; i < count; i++){
			res.push(v.items[Math.floor(Rand()*length)]);
		}
	}else{
		if(length<count){
			throw "MSG: Vector for Sample() is too small for the given sample size.";	
		}
		
		var shuffled = v.items.slice();
		for (var i = 0; i < count; i++) {
		    res.push(shuffled.splice(Math.floor(Rand() * shuffled.length), 1)[0]);
		}
	}
	
	return new Vector(res);
});

defineFunction("IndexOf", {object: [functionBank, VectorObject],  params:[{name: "Haystack", needVector: true, noUnits: true}, {name: "Needle", allowBoolean:true, allowString: true}]}, function(x){

	var v = x[1];
	
	if(v instanceof Vector){
		var res = [];
		for(var i = 0; i < v.items.length; i++){
			res.push(findElement(v.items[i], x[0]));
		}
		return new Vector(res);
	}else{
		return findElement(v, x[0]);
	}
});

defineFunction("Contains", {object: [functionBank, VectorObject], params:[{name: "Haystack", needVector: true, noUnits: true}, {name: "Needle", allowBoolean: true, noVector: true, allowString: true}]}, function(x){
		
	if(eq(new Material(0), functionBank["indexof"](x))){
		return false;
	}else{
		return true;
	}
});

defineFunction("Collapse", {params:[{name: "Source", needVector: true, noUnits: false}, {name: "Target",  noVector:false}]}, function(x){
	return x[0].toNum().collapseDimensions(x[1].toNum());
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
	
	var v;
	if(x[0].node instanceof Vector){
		v = x[0].node;
	}else if(x[0] instanceof Vector){
		v = x[0];
	}else{
		v = evaluateNode(x[0].node, x[0].scope);
	}
	
	if(v instanceof Primitive){
		v = v.toNum();
	}
	if(! (v instanceof Vector)){
		throw "MSG: Filter() requires a vector as its first argument.";
	}
	v = v.fullClone();
	
	var t = functionBank["map"](x);
	return  functionBank["select"]([v,t]);
};
functionBank["filter"].delayEvalParams = true;
VectorObject["filter"] = functionBank["filter"];

functionBank["join"] = function(x){
	var res = [];
	var names = [];
	var hasNames = false;
	for(var i = 0; i < x.length; i++){
		var y = x[i];
		
		if(y instanceof Primitive){
			y = y.toNum();
		}
		
		if(y instanceof Vector){
			res = res.concat(y.items);
			if(y.names){
				names = names.concat(y.names)
				hasNames = true;
			}else{
				for(var j=0; j<y.items.length; j++){
					names.push(undefined)
				}
			}
		}else{
			res.push(y);
			names.push(undefined);
		}
	}
	return new Vector(res, hasNames?names:undefined);
};

functionBank["repeat"] = function(x){
	testArgumentsSize(x, "Repeat", 2, 2);
	var items = evaluateNode(x[1].node, x[1].scope).toNum();
	var count = items;
	if(items instanceof Vector){
		count = items.items.length;
	}
	var res = [];
	var scope = {x: null, "-parent": x[1].scope, key: null}
	for(var  i = 0; i < count; i++){
		if(items instanceof Vector){
			scope.key = items.items[i];
		}
		scope.x = new Material(i+1);
		res.push(evaluateNode(x[0].node, scope));
	}
	
	return  new Vector(res, (items instanceof Vector)?items.items.slice():undefined);
	
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
			var names = x[0].names?[]:undefined;
			if(v.length()!=x[0].length()){
				throw "MSG: Length of vector must be equal for boolean selection.";
			}
			for(var i=0; i<v.length();i++){
				if( trueValue(v.items[i]) ){
					res.push(x[0].items[i]);

					if(x[0].names){
						names.push(x[0].names[i])
					}
				}
			}
			return new Vector(res, names);
		}else{
			var res = [];
			var names = x[0].names?[]:undefined;
			for(var i=0; i<v.length();i++){
				var q = v.items[i].value
				if(q<=0 || q > x[0].length()){
					throw "MSG: Selected element out of range.";
				}
				res.push(x[0].items[q-1]);
				
				if(x[0].names){
					names.push(x[0].names[q-1])
				}
			}
			return new Vector(res, names);
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
	return functionBank["join"](x);
}}, function(x){
	return new Vector(x.items.slice().reverse(), x.names?x.names.slice().reverse():undefined);
});
defineFunction("Reverse", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["reverse"](x);
});

defineFunction("Sort", {allowEmpty:true, params:{name: "Items..."}, prep: function(x){
	return functionBank["join"](x).toNum();
}}, function(x){
	var res = x.stackApply(function(x){
		var items = [];
		for(var i=0; i<x.items.length; i++){
			items.push({item: x.items[i], name: x.names?x.names[i]:undefined})
		}

		var res = items.sort(function(a,b){
			if(lessThan(a.item, b.item)){
				return -1;
			}
			if(greaterThan(a.item, b.item)){
				return 1;
			}
			return 0;
		});
	
	
		var names = x.names?[]:undefined;
		items = []
	
		for(var i = 0; i < res.length; i++){
			items.push(res[i].item);
			if(names){
				names.push(res[i].name)
			}
		}
	
		return new Vector(items, names);
	});
	return res;
});
defineFunction("Sort", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["sort"](x);
});

defineFunction("Unique", {allowEmpty:true, params:{name: "Items....", allowBoolean:true}, prep: function(x){
	return functionBank["join"](x).toNum();
}}, function(x){	
	if(x.items.length==0){
		return new Vector([]);
	}
	
	var res = [];
	var names = x.names?[]:undefined;
	
	for(var i = 0; i < x.items.length; i++){
		var found = false;
		
		for(var j = 0; j < res.length; j++){
			if(strictEquals(x.items[i], res[j])){
				found = true;
				break;
			}
		}
		if(! found){
			res.push(x.items[i]);
			if(names){
				names.push(x.names[i]);
			}
		}
	}
	return new Vector(res, names);
});
defineFunction("Unique", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["unique"](x);
});



defineFunction("Union", {object: [functionBank, VectorObject], params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
	return functionBank["unique"](functionBank["join"](x).items);
});

defineFunction("Intersection", {object: [functionBank, VectorObject], params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
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


defineFunction("Difference", {object: [functionBank, VectorObject], params:[{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x){	
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

defineFunction("Factorial", {params: [{name: "Number", noUnits: true}], recurse: true}, function(x){
	return new Material(factorial(x[0].toNum().value));
});

defineFunction("Max", {params: {name: "Items..."}, prep: joinVector}, function(x){
	
	var res = x.stackApply(function(v){
		//console.log(v);
		var x = v.items;
		if(x.length > 0){
			var max = x[0];
			for (var i=1; i < x.length; i++) {
				if(greaterThan(x[i], max)){
					max = x[i];
				}
			}
			return max;
		}else{
			throw "MSG: You must have at least one element to calculate a max.";
		}
	});
	
	return res;
});
defineFunction("Max", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["max"](x);
});

function joinVector(x, notToNum, skip){
	if(! notToNum){
		for(var i=0; i<x.length; i++){
			x[i] = x[i].toNum();
		}
	}
	if(x.length == 1 && (x[0] instanceof Vector)){
		if(skip){
			return x[0];
		}else{
			return functionBank["flatten"]([x[0]]);
		}
	}else{
		return (new Vector(scalarsToVectors(x)));
	}
}
function joinArray(x){
	for(var i = 0; i < x.length; i++){
		if(x[i].toNum){
			x[i] = x[i].toNum();
		}
	}
	if(x.length == 1 && (x[0] instanceof Vector)){
		return functionBank["flatten"]([x[0].toNum()]).items;
	}
	return joinVector(x, undefined, true).items;
}
function scalarsToVectors(x){
	var needVector = false;
	var vec;
	
	for(var i=0; i<x.length; i++){
		if(x[i] instanceof Vector){
			vec = x[i];
			needVector = true;
			break;
		}
	}
	
	if(needVector){
		for(var i=0; i<x.length; i++){
			if(!(x[i] instanceof Vector)){
				x[i] = replicateVectorStructure(vec, x[i]);
			}
		}
	}
	
	return x;
}
function replicateVectorStructure(vec, val){
	var v = vec.fullClone();
	for(var i=0; i<v.items.length; i++){
		if(v.items[i] instanceof Vector){
			v.items[i] = replicateVectorStructure(v.items[i], val);
		}else{
			v.items[i] = val;
		}
	}
	return v;
}

defineFunction("Lookup", {params: [{name: "Value", noVector: true}, {name: "Value Vector", needVector: true}, {name: "Results Vector", needVector: true} ]}, function(x){
	var v = x[0].toNum();
	var xVec = x[1].toNum();
	var yVec = x[2].toNum();
	
	if(xVec.items.length != yVec.items.length){
		throw "MSG: The value and results vectors must be the same length";
	}
	
	if(xVec.items.length < 1){
		throw "MSG: You must have at least one element in your vectors";
	}
	
	var vec = [];
	for(var i = 0; i < xVec.items.length; i++){
		vec.push({x: xVec.items[i], y: yVec.items[i]});
	}
	
	vec.sort(function(a,b){
		if(greaterThan(a.x, b.x)){
			return 1;
		}else if(lessThan(a.x, b.x)){
			return -1;
		}else{
			return 0;
		}
	});
	
	for(var i = 0; i < vec.length; i++){
		if(eq(vec[i].x, v)){
			return vec[i].y.fullClone();
		}else if(greaterThan(vec[i].x, v)){
			if(i == 0){
				return vec[i].y.fullClone();
			}
			
			var dist = minus(vec[i].x, vec[i-1].x);
			var distLower = minus(v, vec[i-1].x);
			var distUpper = minus(vec[i].x, v);
			var fLower = div(distUpper, dist);
			var fUpper = div(distLower, dist);
			return plus(mult(vec[i-1].y, fLower),  mult(vec[i].y, fUpper));
		}
	}
	
	return vec[vec.length-1].y.fullClone();
});

defineFunction("Fill", {object: [functionBank, VectorObject], params: [{name: "Vector", needVector: true}, {name: "Value", allowBoolean: true} ]}, function(x){
	return replicateVectorStructure(x[0], x[1]);
});

defineFunction("Min", {params:{name: "Items..."}, prep: joinVector}, function(x){
	var res = x.stackApply(function(v){
		var x = v.items;
		if(x.length > 0){
			var min = x[0];
			for (var i=1; i < x.length; i++) {
				if(lessThan(x[i], min)){
					min = x[i];
				}
			}
			return min;

		}else{
			throw "MSG: You must have at least one element to calculate a median.";
		}
	});
	
	return res;
});
defineFunction("Min", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["min"](x);
});
defineFunction("Mean", {params:{name: "Items..."}, prep: joinArray}, function(x){
	var sum = x[0];
	for (var i = 1; i < x.length; i++) {
		sum = plus(sum, x[i]);
	}
	return div(sum, new Material(x.length));
});
defineFunction("Mean", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["mean"](x);
});
defineFunction("Sum", {params:{name: "Items..."}, prep: joinArray}, function(x){
	var sum = x[0];
	
	for (var i = 1; i < x.length; i++) {
		sum = plus(sum, x[i]);
	}
	return sum;
});
defineFunction("Sum", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["sum"](x);
});
defineFunction("Product", {params:{name: "Items..."}, prep: joinArray}, function(x){
	var total = x[0];
	for (var i = 1; i < x.length; i++) {
		total = mult(total, x[i]);
	}
	return total;
});
defineFunction("Product", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["product"](x);
});
defineFunction("Median", {params:{name: "Items..."}, prep: joinVector}, function(x){
	var res = x.stackApply(function(v){
		var x = functionBank["sort"]([v]).items;
		if(x.length > 0){
			if (Math.floor((x.length - 1) / 2) == (x.length - 1) / 2) {
				return x[(x.length - 1) / 2];
			} else {
				return div(plus(x[Math.floor(((x.length - 1) / 2))], x[Math.ceil(((x.length - 1) / 2))]), new Material(2));
			}
		}else{
			throw "MSG: You must have at least one element to calculate a median.";
		}
	});
	return res;
});
defineFunction("Median", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["median"](x);
});
defineFunction("StdDev", {params:{name: "Items..."}, prep: joinVector}, function(x){
	var res = x.stackApply(function(v){
		var x = v.items;
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
	return res;
});
defineFunction("StdDev", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["stddev"](x);
});
defineFunction("Correlation", {params:  [{name: "Vector 1", needVector: true}, {name: "Vector 2", needVector: true}]}, function(x) {
	var v1 = x[0].toNum();
	var v2 = x[1].toNum();

	if(v1.length() <= 1){
		throw "MSG: You must have at least two elements in your vectors to calculate their correlation.";
	}
	if(v1.length() != v2.length()){
		throw "MSG: The vectors for Correlation() must be of the same size.";
	}
	
	
	var v1_mean = functionBank["mean"]([v1]);
	var v2_mean = functionBank["mean"]([v2]);

	var v1_stddev = functionBank["stddev"]([v1]);
	var v2_stddev = functionBank["stddev"]([v2]);
	
	if(v1_stddev.value == 0 || v2_stddev.value == 0){
		return new Material(0);
	}
	
	return div(functionBank["sum"]([mult(minus(v1.clone(), v1_mean), minus(v2.clone(), v2_mean))]), mult(minus(functionBank["count"]([v1]), new Material(1)), mult(v1_stddev, v2_stddev)))
});
functionBank["count"] = function(x) {
	x = functionBank["join"](x).items;
	return new Material(sn("#e"+x.length));
};
functionBank["flatten"] = function(x) {
	var res = flatten(functionBank["join"](x));
	return new Vector(res.items, res.hasName?res.names:undefined);
};

defineFunction("Keys", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	if(! x[0].names){
		return new Vector([]);
	}
	return new Vector(x[0].names.filter(function(x){return isDefined(x)}).map(function(x){return s(x)}));
});
defineFunction("Values", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return new Vector(x[0].items);
});
defineFunction("Length", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return new Material(sn("#e"+x[0].items.length));
});
defineFunction("Count", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return new Material(sn("#e"+x[0].items.length));
});
defineFunction("Flatten", {object: VectorObject, params:[{name:"Vector", needVector: true}]}, function(x) {
	return functionBank["flatten"](x);
});

function flatten(x){
	var res = [];
	var names = [];
	var hasName = undefined;
	
	for(var i=0; i<x.length(); i++){
		if(x.items[i] instanceof Vector){
			var z = flatten(x.items[i]);
			res = res.concat(z.items);
			names = names.concat(z.names);
			hasName = hasName || z.hasName;
		}else{
			res.push(x.items[i]);
			if(x.names){
				names.push(x.names[i]);
				hasName = true;
			}else{
				names.push(undefined);
			}
		}
	}
	return {items: res, names: names, hasName: hasName};
}


/* Statistics */

defineFunction("CDFNormal", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.normal.cdf(val, mu, sd));
});

defineFunction("PDFNormal", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.normal.pdf(val, mu, sd));
});

defineFunction("InvNormal", {params: [{name:"p", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.normal.inv(val, mu, sd));
});

defineFunction("CDFLogNormal", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.lognormal.cdf(val, mu, sd));
});

defineFunction("PDFLogNormal", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.lognormal.pdf(val, mu, sd));
});

defineFunction("InvLogNormal", {params: [{name:"p", noUnits:true, noVector:true}, {name:"Mean", defaultVal: 0, noUnits:true, noVector:true}, {name:"Standard Deviation", defaultVal: 1, noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var mu = x[1]?x[1].toNum().value:0;
	var sd = x[2]?x[2].toNum().value:1;
	
	return new Material(jStat.lognormal.inv(val, mu, sd));
});

defineFunction("CDFt", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.studentt.cdf(val, dof));
});

defineFunction("PDFt", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.studentt.pdf(val, dof));
});

defineFunction("Invt", {params: [{name:"p", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.studentt.inv(val, dof));
});

defineFunction("CDFF", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom 1", noUnits:true, noVector:true}, {name:"Degrees of Freedom 2", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof1 = x[1].toNum().value;
	if(dof1 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	var dof2 = x[2].toNum().value;
	if(dof2 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.centralF.cdf(val, dof1, dof2));
});

defineFunction("PDFF", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom 1", noUnits:true, noVector:true}, {name:"Degrees of Freedom 2", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof1 = x[1].toNum().value;
	if(dof1 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	var dof2 = x[2].toNum().value;
	if(dof2 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.centralF.pdf(val, dof1, dof2));
});

defineFunction("InvF", {params: [{name:"p", noUnits:true, noVector:true}, {name:"Degrees of Freedom 1", noUnits:true, noVector:true}, {name:"Degrees of Freedom 2", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var dof1 = x[1].toNum().value;
	if(dof1 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	var dof2 = x[2].toNum().value;
	if(dof2 <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.centralF.inv(val, dof1, dof2));
});

defineFunction("CDFChiSquared", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.chisquare.cdf(val, dof));
});

defineFunction("PDFChiSquared", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.chisquare.pdf(val, dof));
});

defineFunction("InvChiSquared", {params: [{name:"p", noUnits:true, noVector:true}, {name:"Degrees of Freedom", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var dof = x[1].toNum().value;
	if(dof <= 0){
		throw "MSG: Degrees of Freedom must be greater than 0."
	}
	
	return new Material(jStat.chisquare.inv(val, dof));
});


defineFunction("CDFExponential", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Rate", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var rate = x[1].toNum().value;
	if(rate <= 0){
		throw "MSG: Rate must be greater than 0."
	}
	
	return new Material(jStat.exponential.cdf(val, rate));
});

defineFunction("PDFExponential", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Rate", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var rate = x[1].toNum().value;
	if(rate <= 0){
		throw "MSG: Rate must be greater than 0."
	}
	
	return new Material(jStat.exponential.pdf(val, rate));
});

defineFunction("InvExponential", {params: [{name:"p", noUnits:true, noVector:true}, {name:"DRate", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	if(val < 0 || val > 1){
		throw "MSG: p is a probability and must be between 0 and 1 inclusive."
	}
	var rate = x[1].toNum().value;
	if(rate <= 0){
		throw "MSG: Rate must be greater than 0."
	}
	
	return new Material(jStat.exponential.inv(val, rate));
});

defineFunction("CDFPoisson", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Lambda", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var Lambda = x[1].toNum().value;
	if(Lambda <= 0){
		throw "MSG: Lambda must be greater than 0."
	}
	
	return new Material(jStat.poisson.cdf(val, Lambda));
});

defineFunction("PMFPoisson", {params: [{name:"x", noUnits:true, noVector:true}, {name:"Lambda", noUnits:true, noVector:true}]}, function(x){
	var val = x[0].toNum().value;
	var Lambda = x[1].toNum().value;
	if(Lambda <= 0){
		throw "MSG: Rate must be greater than 0."
	}
	
	return new Material(jStat.poisson.pdf(val, Lambda));
});



/* End Statistics */



defineFunction("SetRandSeed", {params:[{name:"Seed Number", noUnits:true, noVector:true}]}, function(x) {
	Math.seedrandom(x[0].toNum().value);
	return "Random Seed Set";
});

defineFunction("Alert", {params:[{name:"Message", allowString: true, allowBoolean: true}]}, function(x) {
	alert(x[0]);
	return 1;
});

defineFunction("Console", {params:[{name:"Message", allowString: true, allowBoolean: true}]}, function(x) {
	console.log(x[0]);
	return 1;
});

defineFunction("Prompt", {params:[{name:"Message", allowString: true, allowBoolean: true}, {name:"Default", defaultVal: "", allowString: true, allowBoolean: true}]}, function(x) {
	var y = x[1];
	if((y instanceof Material) && ! y.units){
		y = y.value;
	}
	var x = prompt(x[0], y);
	if(parseFloat(x).toString()==x){
		return new Material(parseFloat(x));
	}else{
		return x;
	}
});

defineFunction("Confirm", {params:[{name:"Message", allowString: true, allowBoolean: true}]}, function(x) {
	return confirm(x[0]);
});

defineFunction("Parse", {object: StringObject, params:[{name:"String", allowString: true}]}, function(x) {
	//if((typeof x[0] == "string") || (x[0] instanceof String)){
		return new Material(parseFloat(x[0], 10));
		//}else{
		//return x[0];
		//}
});

defineFunction("Split", {object: StringObject, params:[{name:"String", needString: true}, {name:"Splitter", needString: true}]}, function(x) {
	return s(new Vector(x[0].split(x[1])));
});

defineFunction("Join", {object: VectorObject, params:[{name:"String", needVector: true}, {name:"Joiner", needString: true}]}, function(x) {
	return s(x[0].items.join(x[1]));
});

defineFunction("Trim", {object: StringObject, params:[{name:"String", needString: true}], recurse: true}, function(x) {
	return s(x[0].trim());
});

defineFunction("Range", {object: StringObject, params:[{name:"String", needString: true}, {name:"Indexes", noUnits: true, allowVector: true}]}, function(x) {
	if(x[1] instanceof Vector){
		var res = "";
		for(var i=0; i < x[1].items.length; i++){
			res += x[0].charAt(x[1].items[i].toNum().value-1);
		}
		return s(res);
	}else{
		return s(x[0].charAt(x[1].toNum().value-1));
	}
});	

defineFunction("Length", {object: StringObject, params:[{name:"String", needString: true}]}, function(x) {
	return new Material(x[0].length);
});

defineFunction("IndexOf", {object: StringObject, params:[{name:"Haystack", needString: true}, {name:"Needle", needString: true}]}, function(x) {
	return new Material(x[0].indexOf(x[1])+1);
});

defineFunction("Contains", {object: StringObject, params:[{name:"Haystack", needString: true}, {name:"Needle", needString: true}]}, function(x) {
	return ! eq(StringObject["indexof"](x), new Material(0));
});

defineFunction("Lowercase", {object: StringObject, params:[{name:"String", needString: true}]}, function(x) {
	return s(x[0].toLowerCase());
});

defineFunction("Uppercase", {object: StringObject, params:[{name:"String", needString: true}]}, function(x) {
	return s(x[0].toUpperCase());
});

StringBase = makeObjectBase(StringObject);
VectorBase = makeObjectBase(VectorObject);

});

function s(x){
	if(x instanceof Vector){
		return x.recurseApply(s);
	}
	var res = new String(x);
	res.parent= StringBase;
	return res;
}

function makeObjectBase(x){
	var names = Object.keys(x);
	var items = [];
	for(var i=0; i<names.length; i++){
		items.push(objectizeFunction(x[names[i]]));
	}
	var vec = new Vector(items, names);
	vec.parent = undefined;
	return vec;
}


function defineFunction(name, definition, fn){
	var configs = definition.params;
	var arr = Array.isArray(configs);
	
	var vectorized = [];
	
	var requiredLength = configs.length;
	for(var i=0; i < configs.length; i++){
		if(configs[i].hasOwnProperty("defaultVal")){
			requiredLength = i;
			break;
		}
	}
	
	for(var i=0; i < configs.length; i++){
		if(configs[i].vectorize){
			vectorized.push(i);
			if(configs[i].noVector){
				throw "MSG: Cannot have a non-vector vectorized parameter. Function '" + name + "', parameter '" + configs[i].name + "'.";
			}
		}
	}
	
	
	
	
	var fnName;
	if(arr){
		if(! definition.object){
			fnName = name + "(" + configs.map(function(x){return x.name+(x.hasOwnProperty("defaultVal")?"="+x.defaultVal.toString():"");}).join(", ")+")";
		}else{
			fnName = name + "(" + configs.slice(1).map(function(x){return x.name+(x.hasOwnProperty("defaultVal")?"="+x.defaultVal.toString():"");}).join(", ")+")";
		}
	} else{
		fnName = name + "(items...)";
	}
	
	var f = function(x, id){
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
			
			if (config.noUnits && (!((!(x[i].toNum() instanceof Material)) || ! x[i].toNum().units))) {
				throw "MSG: " + fnName + " does not except units for the argument '"+config.name+"'.";
			}
			if (config.noVector && (x[i] instanceof Vector)) {
				throw "MSG: " + fnName + " does not except vectors for the argument '"+config.name+"'.";
			}
			if (config.vectorize && (x[i] instanceof Vector) && ! x[i].names) {
				throw "MSG: " + fnName + " does not accepted non-named vectors for the argument '"+config.name+"'.";
			}
			if (config.needVector) {
				if(x[i] instanceof Primitive){
					x[i] = x[i].toNum();
				}
				if(! (x[i] instanceof Vector)){
					throw "MSG: " + fnName + " requires a vector for the argument '"+config.name+"'.";
				}
			}
			if (config.needPrimitive && ! (x[i] instanceof Primitive)) {
				throw "MSG: " + fnName + " requires a primitive for the argument '"+config.name+"'.";
			}
			if ((! config.allowBoolean) && (typeof x[i] == "boolean")) {
				throw "MSG: " + fnName + " does not accept boolean values for the argument '"+config.name+"'.";
			}
			if (config.needAgent && (!  (x[i] instanceof Agent) )) {
				x[i] = agent(x[i], fnName, config.name);
			}
			if (config.needString) {
				if(! ((typeof x[i] == "string") || (x[i] instanceof String))){
					throw "MSG: " + fnName + " requires a string for the argument '"+config.name+"'.";
				}
			}
			if (((! config.allowString) && (! config.needString))
				&& ((typeof x[i] == "string") || (x[i] instanceof String))) {
				throw "MSG: " + fnName + " does not accept string values for the argument '" + config.name + "'.";
			}
			if (config.needAgents && (!  (x[i] instanceof Agents) )) {
				x[i] = agents(x[i], fnName, config.name);
			}
			if (config.needPopulation && (!  (x[i] instanceof Vector) )) {
				x[i] = getPopulation(x[i], fnName, config.name);
			}
			if (config.needFunction && (!  ((x[i] instanceof Function) || (x[i] instanceof UserFunction)) )) {
				throw "MSG: " + fnName + " requires a function for the argument '"+config.name+"'.";
			}
		}
		if(definition.recurse){
			var q = x[0].toNum();
		}
		if(definition.recurse && (q instanceof Vector)){
			return q.cloneApply(function(z){return f([z].concat(x.slice(1)), id)});
		}else if(vectorized.length > 0){
			// Auto-vectorize the inner function
		
			
			var base = undefined, baseI = -1;
			for(var i = 0; i < vectorized.length; i++){
				if(x[vectorized[i]]){
					var v = x[vectorized[i]].toNum();
					if( (v instanceof Vector) && (v.namesLC)){
						if(!base){
							base = v;
							baseI = vectorized[i];
						}else{
							if(!base.keysMatch(v.namesLC)){
								throw "MSG: Vector keys do not match between parameters '" + configs[baseI].name + "' and '" + configs[vectorized[i]].name +"' in " + fnName + ".";
							}
						}
					}
				}
			}
			
			if(! base){
				// Nothing is vectorized, we can behave normally
				return fn(x, id);
			}else{
				// We need to vectorize
				//console.log("getting facney!")
				var keys = base.namesLC;
				var res = [];
				for(var i = 0; i < keys.length; i++){
					var newX = [];
					for(var j = 0; j < x.length; j++){
						if(vectorized.indexOf(j) == -1){
							newX.push(x[j]);
						}else{
							var v = x[j].toNum();
							if( (v instanceof Vector) && (v.namesLC)){
								newX.push(v.select([keys[i]]));
							}else{
								newX.push(v);
							}
							
						}
					}
					//console.log(newX);
					var z = fn(newX, id);
					if(z instanceof Vector){
						if(!base.keysMatch(z.namesLC)){
							throw "MSG: Vector keys do not match between parameter '" + configs[baseI].name + "' and calculation result.";
						}
						
						res.push(z.select([keys[i]]));
					}else{
						res.push(z);
					}
				}
				return new Vector(res, keys);
			}
				
			
		}else{
			return fn(x, id);
		}
	}
	
	if(! definition.object){
		functionBank[name.toLowerCase()] = f;
	}else{
		if(definition.object instanceof Array){
			for(var i=0; i<definition.object.length; i++){
				definition.object[i][name.toLowerCase()] = f;
			}
		}else{
			definition.object[name.toLowerCase()] = f;
		}
	}
		
	if(definition.recurse){
		VectorObject[name.toLowerCase()] = f;
	}
}

function objectizeFunction(fn){
	var f = function(x, fingerprint, lastSelf){
		return fn([lastSelf].concat(x), fingerprint, lastSelf)
	}
	f.delayEvalParams = fn.delayEvalParams;
	return f;
}

function factorial(x) {
	if (Math.round(x) != x) {
		throw "MSG: The factorial() function only accepts integers.";
	} else if (x < 0) {
		throw "MSG: The factorial() function is only defined for integers 0 or larger.";
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

