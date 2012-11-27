"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


var sn = SchemeNumber;
var fn = sn.fn;
var ns = fn["number->string"];

sn.raise = function(conditionType,message){
	if (message == "division by exact zero"){
		throw "MSG: You cannot divide by 0."
	}else{
		throw "BigNum Error: "+message;
	}
}

var varBank = {};
var functionBank = {};
var primitiveBank = {};


varBank["-parent"] = null;
varBank["e"] = new Material(2.71828182845904523536);
varBank["pi"] = new Material(3.14159265358979323846264338);
varBank["phi"] = new Material(1.61803399);


if(! Primitive){
	var Primitive = function(){
		this.v = new Material(0);
		this.value = function(){
			return this.v.fullClone();
		};
		this.setValue = function(newValue){
			this.v = newValue;
		};
	}
	primitiveBank["test"] = new Primitive();
}
if(! Agent){
	var Agent = function(){}
}
if(! Agents){
	var Agents = function(){}
}

var PrimitiveStore = function(primitive, type){
	this.primitive = primitive;
	this.type = type; // "value", "totalValue", "object"
}

/*

var Primitive = function(value){
	this.val = value;
}
Primitive.prototype.value = function(){
	return this.val;
}
primitiveBank["x"] = new Primitive(10);
primitiveBank["xy"] = new Primitive(5);*/

Boolean.prototype.toNum = function(){
	return this.valueOf();
}
String.prototype.toNum = function(){
	return this.valueOf();
}
Number.prototype.toNum = function(){
	return this.valueOf();
}

var Vector = function(items){
	this.items = items;
}
Vector.prototype.toNum = function(){
	var res = [];
	for(var i=0; i<this.items.length; i++){
		res.push(this.items[i].toNum());
	}
	return new Vector(res);
};
Vector.prototype.toString = function(){
	return '&laquo;'+this.items.map(function(x){return prepareDisplay(x.toNum().toString())}).join(", ")+'&raquo;';
};
Vector.prototype.length = function(){
	return this.items.length;
};
Vector.prototype.combine = function(other, operation, rhs){	
	if(other instanceof Vector){
		if(this.length() != other.length()){
			throw "MSG: Vectors must have equal length when combined.";
		}
	}
	var res = [];
	for(var i=0; i< this.length(); i++){
		var x;
		if(other instanceof Vector){
			x = other.items[i];
		}else{
			x = other;
		}
		if(rhs){
			res.push(operation(x, this.items[i]));
		}else{
			res.push(operation(this.items[i], x));
		}
	}
	return new Vector(res)
};
Vector.prototype.apply = function(operation){
	var res = [];
	for(var i=0; i < this.items.length; i++){
		res.push(operation(this.items[i]));
	}
	return new Vector(res);
};
Vector.prototype.clone = function(){
	var newItems = [];
	for(var i=0; i<this.items.length; i++){
		if(this.items[i] instanceof Material){
			newItems.push(this.items[i]);
		}else{
			newItems.push(this.items[i].clone());
		}
	}
	return new Vector(newItems);
};
Vector.prototype.equals = function(vec){
	if(this.length() != vec.length()){
		return false;
	}
	for(var i = 0; i < this.items.length; i++){
		if(! strictEquals(this.items[i], vec.items[i])){
			return false;
		}
	}
	return true;
}

function strictEquals(a,b){
	if((a instanceof Agent) || (b instanceof Agent)){
		if((a instanceof Agent) && (b instanceof Agent)){
			if(a.instanceId == b.instanceId){
				return true
			}
		}
	}else if((a instanceof Vector) || (b instanceof Vector)){
		if((a instanceof Vector) && (b instanceof Vector)){
			if(a.equals(b)){
				return true;
			}
		}
	}else if(eq(a,b)){
		return true;
	}
	return false;
}

function createTree(input){
	var cstream = new org.antlr.runtime.ANTLRStringStream(input.replace(/\\n/g,"\n"));
	var lexer = new FormulaLexer(cstream);
	var tstream = new org.antlr.runtime.CommonTokenStream(lexer);
	var parser = new FormulaParser(tstream);
	var parsedTree = parser.lines();
	var root = convertToObject(parsedTree.tree, parser);
	if (isLocal()) {
		// console.log(root);
	}
	return root;
}
function trimTree(root, primitiveBank){
	return trimNode(root, primitiveBank);	
}
function evaluateTree(root, varBank){
	return evaluateNode(root, varBank);	
}

function evaluate(input) {
	//console.log(input);
	var root = trimTree(createTree(input), primitiveBank);
	try {
		var x = evaluateTree(root, varBank);
		//console.log(root);
 	}catch(err){
 		if(err=="PLOT"){
			var res = {isPlot: true};
			res.data = [];
			var newBank = {};
			newBank["-parent"] = varBank;
 			for(var i = -100; i <= 100; i += 1){
				newBank["x"] = new Material(i/10);
				res.data.push([i/10, 0+evaluateTree(root, newBank).value]);
 			}
			
			return res;
 		}else{
 			throw(err);
 		}
 	}
	if(x instanceof Material){
		var q = new Quantities(x.units);
		//console.log(x.value);
		//console.log(ns(x.value));
		//console.log(x.value.toExponential());
		//console.log(x.value.toPrecision(21));
		x.value = fn["*"](x.value, sn("#e"+q.toBase)).toPrecision(21);//parseFloat((x.value*q.toBase).toPrecision(15));
		
		x.units = q.units;
		if(x.value.substr(x.value.length-1,1)=="."){
			x.value=x.value.substring(0, x.value.length-1)
		}
		x.value=x.value.replace(/\.?\+\.?/g,"+");
		x.value=x.value.replace(/\.?\-\.?/g,"-");
		x.value=x.value.replace(/\.i/g,"i");
		x.value=x.value.replace(/(\d)i/g,"$1*<i>i</i>");
		x.value=x.value.replace(/\.e/g,"e");
		x.value=x.value.replace(/e\+/g,"e");
		
		if(x.value=="+inf.0"){
			x.value="Infinity";
		}else if(x.value=="-inf.0"){
			x.value="-Infinity";
		}
	}
	
	return x;
}

var TreeNode = function(text, typeName){
	this.origText = text;
	this.text = text.toLowerCase();
	this.typeName = typeName;
	this.children = [];
};

function convertToObject(node, parser) {
	var current = new TreeNode( node.getToken().getText(), parser.getTokenNames()[node.getToken().getType()]);

	//Add children
	if (node.getChildCount() > 0) {
		var children = node.getChildren();
		for (var i=0; i<children.length; i++) {
			current.children.push(convertToObject(children[i], parser));
		}
	}

	return current;
}


var funcEvalMap = new Object();
var evaluatingLine = null;

funcEvalMap["LINES"] = function(node, scope) {
	if(node.children.length==0){
		return new Material(0);
	}
	var response;
	for(var i=0; i<node.children.length; i++){
		response =  evaluateNode(node.children[i], scope);
	}
	return response;
};

funcEvalMap["NEGATE"] = function(node, scope) {
	return negate(evaluateNode(node.children[0], scope).toNum());
};
function negate(x){
	if(x instanceof Vector){
		return x.apply( negate);
	}
	
	return new Material(fn["-"](x.value), x.units);
}

funcEvalMap["AND"] = function(node, scope) {
	return funAnd(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum())
};

function funAnd(lhs,rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, funAnd, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, funAnd, true);
	}
	
	return trueValue(lhs) && trueValue(rhs);
}

funcEvalMap["OR"] = function(node, scope) {
	return funOr(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum())
};

function funOr(lhs,rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, funOr, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, funOr, true);
	}
	
	return trueValue(lhs) || trueValue(rhs);
}


funcEvalMap["NOT"] = function(node, scope) {
	return fNot(evaluateNode(node.children[0], scope).toNum());
};

function fNot(x){
	if(x instanceof Vector){
		return x.apply(fNot);
	}
	
	return ! trueValue(x);
}

funcEvalMap["NOTEQUALS"] = function(node, scope) {
	return neq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function neq(lhs, rhs){
	if((typeof lhs == "boolean" && !(rhs instanceof Vector)) || (typeof rhs == "boolean" && !(lhs instanceof Vector))){
		return trueValue(lhs)!=trueValue(rhs);
	}
	
	if(lhs instanceof Vector){
		return lhs.combine(rhs, neq, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, neq, true);
	}
	
	if (!unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			return true;
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return ! fn["="](lhs.value, rhs.value);
}

funcEvalMap["EQUALS"] = function(node, scope) {
	return eq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function eq(lhs, rhs){
	if(((typeof lhs) == "boolean" && !(rhs instanceof Vector)) || ((typeof rhs) == "boolean" && !(lhs instanceof Vector))){
		return trueValue(lhs)==trueValue(rhs);
	}
	
	if(lhs instanceof Vector){
		return lhs.combine(rhs, eq, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, eq, true);
	}
	
	if (!unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			return false;
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return fn["="](lhs.value, rhs.value);
}

funcEvalMap["LT"] = function(node, scope) {
	return lessThan(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};
function lessThan(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, lessThan, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, lessThan, true);
	}
	
	
	if (!unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return fn["<"](lhs.value, rhs.value);;
}

funcEvalMap["LTEQ"] = function(node, scope) {
	return lessThanEq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};
function lessThanEq(lhs, rhs){
	
	if(lhs instanceof Vector){
		return lhs.combine(rhs, lessThanEq, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, lessThanEq, true);
	}
	
	if (!unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return fn["<="](lhs.value, rhs.value);
}

funcEvalMap["GT"] = function(node, scope) {
	return greaterThan(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function greaterThan(lhs, rhs){
	
	if(lhs instanceof Vector){
		return lhs.combine(rhs, greaterThan, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, greaterThan, true);
	}
	
	if (! unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return fn[">"](lhs.value, rhs.value);
}

funcEvalMap["GTEQ"] = function(node, scope) {
	return greaterThanEq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function greaterThanEq(lhs, rhs){
	
	if(lhs instanceof Vector){
		return lhs.combine(rhs, greaterThanEq, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, greaterThanEq, true);
	}
	
	if (! unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
		}
	}

	return fn[">="](lhs.value, rhs.value);
}

funcEvalMap["PLUS"] = function(node, scope) {
	return plus(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function plus(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, plus, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, plus, true);
	}
	
	if (!unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "addition");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return new Material(fn["+"](lhs.value, rhs.value), rhs.units.clone());

}

funcEvalMap["MINUS"] = function(node, scope) {
	return minus(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function minus(lhs, rhs){

	if(lhs instanceof Vector){
		return lhs.combine(rhs, minus, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, minus, true);
	}
	
	if (! unitsEqual(lhs.units, rhs.units)) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale == 0) {
			unitAlert(lhs.units, rhs.units, "subtraction");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units.clone();
		}
	}

	return new Material(fn["-"](lhs.value, rhs.value), rhs.units.clone());
}

funcEvalMap["MULT"] = function(node, scope) {
	return mult(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function mult(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, mult, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, mult, true);
	}
	
	var x = new Material(fn["*"](lhs.value, rhs.value), lhs.units.clone());
	x.units.multiplyUnitStore(rhs.units, 1);
	x.simplify();
	return x;
}

funcEvalMap["DIV"] = function(node, scope) {
	return div(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function div(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, div, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, div, true);
	}
	
	var x = new Material(fn["/"](lhs.value, rhs.value), lhs.units.clone());
	x.units.multiplyUnitStore(rhs.units, -1);
	x.simplify();
	return x;
}


funcEvalMap["POWER"] = function(node, scope) {
	if(node.children.length == 1){
		return evaluateNode(node.children[0], scope);
	}

	var rhs = evaluateNode(node.children[node.children.length - 1], scope).toNum();
	
	for(var j = node.children.length - 1; j > 0; j--){
		var lhs = evaluateNode(node.children[j - 1], scope).toNum();
		if ((rhs instanceof Vector) || rhs.units.unitless()) {
			rhs = power(lhs, rhs);
		} else {
			throw "MSG: Exponents may not have units.";
		}
	}
	return rhs;
};

function power(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, power, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, power, true);
	}
	
	for (var i = 0; i < lhs.units.exponents.length; i++) {
		lhs.units.exponents[i] = lhs.units.exponents[i] * rhs.value;
	}
	
	var x = lhs.value;
	if(typeof x == "number"){
		x = sn("#e"+x)
	}
	return new Material(fn.expt(x, rhs.value), lhs.units.clone());
}

funcEvalMap["MOD"] = function(node, scope) {
	return doMod(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function doMod(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.combine(rhs, doMod, false);
	}else if(rhs instanceof Vector){
		return rhs.combine(lhs, doMod, true);
	}
	
	if (rhs.units.unitless()) {
		return new Material(fn.mod(lhs.value, rhs.value), lhs.units.clone());
	} else {
		throw "MSG: The right hand side of \"mod\" may not have units."
	}
}


funcEvalMap["IDENT"] = function(node, scope) {
	var varName = node.text;
	
	while ( !(varName in scope) ) {
		if ( scope["-parent"] ) {
			scope = scope["-parent"];
		} else {
			//Attempt to use the variable as a function call
			if(varName in functionBank){
				if ("fn" in functionBank[varName]) {
					return functionBank[varName].fn([]) // user defined function
				} else {
					return functionBank[varName]([]); //built-in
				}
			}
			if(varName == "x"){
				throw "PLOT" ;
			}else if(varName=="i"){//imaginary number
				return new Material(sn("i"));
			}else{
				throw "MSG: The variable \"" + node.origText + "\" does not exist.";
			}
		}
	}

	return scope[varName];
};

funcEvalMap["ARRAY"] = function(node, scope) {
	var vals = [];
	for (var i = 0; i < node.children.length; i++){
		vals.push(evaluateNode(node.children[i], scope));
	}
	return new Vector(vals);
};

funcEvalMap["FUNCALL"] = function(node, scope) {
	if(! node.functionFingerprint){
		node.functionFingerprint = "FINGERPRINT-" + Math.random();
		
		var fnName = node.children[0].text;
		if (functionBank[fnName]) {
			if (functionBank[fnName].fn) {
				node.fn = functionBank[fnName].fn; // user defined function
			} else {
				node.delayEvalParams = functionBank[fnName].delayEvalParams;
				node.fn = functionBank[fnName]; //built-in
			}
		}else{
			throw "MSG: The function \"" + node.children[0].origText + "\" does not exist.";
		}
	}
	

	var vals = [];
	
	if(node.delayEvalParams){
		//don't evaluate params right away. needed for IfThenElse and short circuiting
		for (var i = 1; i < node.children.length; i++){
			vals.push({node: node.children[i], scope: scope});
		}
	}else{
		for (var i = 1; i < node.children.length; i++){
			vals.push(evaluateNode(node.children[i], scope));
		}
	}
	return node.fn(vals, node.functionFingerprint);
	
};

function makeFunctionCall(varName, varNames, varDefaults, node) {

	var fn = new Object();

	fn.localScope = new Object();
	fn.localScope["nVars"] = varNames.length;
	for (var i = 0; i < varNames.length; i++) {
		fn.localScope[i += ""] = varNames[i];
	}
	fn.localScope["-parent"] = varBank;
	fn.defaults = varDefaults;
	
	fn.fn = function(x) {
		if (fn.localScope["nVars"] - fn.defaults.length > x.length || x.length > fn.localScope["nVars"]) {
			var names = [];
			for (var i = 0; i < fn.localScope["nVars"]; i++) {
				if(fn.defaults.length - (fn.localScope["nVars"]-i)>-1){
					names.push(this.localScope[i += ""] + "=" + this.defaults[fn.defaults.length - (fn.localScope["nVars"]-i)]);
				}else{
					names.push(this.localScope[i += ""]);
				}
			}
			
			throw "MSG: Wrong number of parameters for " + varName + "("+names.join(", ")+").";
		}
		//console.log(this.localScope);
		for (var i = 0; i < x.length; i++) {
			fn.localScope[fn.localScope[i += ""]] = x[i];
		}
		for (var i = x.length; i < fn.localScope["nVars"]; i++) {
			fn.localScope[fn.localScope[i += ""]] = fn.defaults[fn.defaults.length - (fn.localScope["nVars"]-i)];
		}
		return evaluateNode(node, fn.localScope);
	};

	return fn;
}

funcEvalMap["WHILE"] = function(node, scope) {
	var lastResult = new Material(0);
	var innerScope = {"-parent": scope};
	while(trueValue(evaluateNode(node.children[0], scope))){
		lastResult = evaluateNode(node.children[1], innerScope);
	}
	return lastResult;
}

funcEvalMap["IFTHENELSE"] = function(node, scope) {
	//console.log(node);
	var innerScope = {"-parent": scope};
	for(var i=0; i<node.children[0].children.length; i++){
		if(trueValue(evaluateNode(node.children[0].children[i], scope))){
			return evaluateNode(node.children[1].children[i], innerScope);
		}
	}
	if(node.children[0].children.length != node.children[1].children.length){
		return evaluateNode(node.children[1].children[i], innerScope);
	}
	
	return new Material(0);
}

funcEvalMap["FORIN"] = function(node, scope) {
	var lastResult = new Material(0);
	var id = node.children[0].text;
	
	var innerScope = {"-parent": scope};
	var vec = evaluateNode(node.children[1], scope);
	if(! (vec instanceof Vector)){
		throw "MSG: The in argument of a For-In loop mush be a a vector."
	}
	for(var i=0; i<vec.items.length; i++){
		innerScope[id] = vec.items[i];
		lastResult = evaluateNode(node.children[2].children[0], innerScope);
	}
	return lastResult;
}

funcEvalMap["FOR"] = function(node, scope) {
	var lastResult = new Material(0);
	var id = node.children[0].text;
	var start = evaluateNode(node.children[1].children[0], scope);
	var by = new Material(1);
	
	if(node.children[1].children.length==3){
		by = evaluateNode(node.children[1].children[2], scope);
	}
	var innerScope = {"-parent": scope};

	innerScope[id] = start;
	while(fn["<="](innerScope[id].value, evaluateNode(node.children[1].children[1], scope))){
		lastResult = evaluateNode(node.children[2].children[0], innerScope);
		innerScope[id] = plus(innerScope[id], by);
	}
	return lastResult;
}

funcEvalMap["FUNCTION"] = function(node, scope) {
	var id = node.children[0].children[0].text;
	
	functionGenerator(id, node.children[0], node.children[1], node.children[2])
			
	return '"' + id + "\" defined"; 
}

funcEvalMap["ASSIGN"] = function(node, scope) {
	//console.log(node);
	if(node.children[0] instanceof PrimitiveStore){
		var x = evaluateNode(node.children[3], scope);
		node.children[0].primitive.setValue(x);
		return x;
	}else{
		var varName = node.children[0].children[0].text;
		if (node.children[0].children.length == 1) {// variable assignment
			var x = evaluateNode(node.children[2], scope);
			var origScope = scope;
			while(scope["-parent"] !== null){
				if(isDefined(scope[varName])){
					break;
				}
				scope = scope["-parent"];
			}
			if(scope["-parent"]===null && isUndefined(scope[varName])){
				scope = origScope;
			}
			scope[varName] = x;
			return varName + " = " + x;
		} else { // function definition
	
			functionGenerator(varName, node.children[0], node.children[1], node.children[2])
			
			return '"' + varName + "\" defined"; 
		}
	}
};

function functionGenerator(varName, paramNames, paramDefaults, code){
	var varNames = [];
	var varDefaults = [];
	for (var i = 1; i < paramNames.children.length ; i++) {
		varNames.push(paramNames.children[i].text);
	}
		
	for (var i = 0; i < paramDefaults.children.length ; i++) {
		varDefaults.push(paramDefaults.children[i]);
	}

	functionBank[varName] = makeFunctionCall(varName, varNames, varDefaults, code);
}

var unitEvalMap = new Object();
unitEvalMap["MULT"] = function(node) {
	return evaluateUnits(node.children[0]).concat(evaluateUnits(node.children[1]));
};
unitEvalMap["POW"] = function(node) {
	var rhsMult = 1;
	var rhsLoc = 1;
	var lhsLoc = 0;
	
	if(node.children.length == 3 + lhsLoc){
		rhsMult = rhsMult*-1;
	 	rhsLoc++;
	}
	var lhs = evaluateUnits(node.children[lhsLoc]);
	var rhs = evaluateUnits(node.children[rhsLoc]) * rhsMult;
	
	if (lhs instanceof Array) {
		for (var i = 0; i < lhs.length; i++) {
			lhs[i].exponent = lhs[i].exponent * rhs;
		}
		return lhs;
	} else {
		return Math.pow(lhs, rhs);
	}
};
unitEvalMap["DIV"] = function(node) {
	var lhs = evaluateUnits(node.children[0]);
	var rhs = evaluateUnits(node.children[1]);
	for (var i = 0; i < rhs.length; i++) {
		rhs[i].exponent = rhs[i].exponent * -1;
	}
	return lhs.concat(rhs);
};

unitEvalMap["UNIT"] = function(node) {
	var unitName = "";
	for (var i = 0; i < node.children.length; i++) {
		unitName = unitName + node.children[i].text;
		if (i < node.children.length - 1) {
			unitName = unitName + " ";
		}
	}
	return [{
		id: unitName,
		exponent: 1
	}];
};
unitEvalMap["UNITCLUMP"] = function(node) {
	var x = evaluateUnits(node.children[0]);
	if(node.children.length==2){
		for (var i = 0; i < x.length; i++) {
			x[i].exponent = x[i].exponent * -1;
		}
	}
	return x;
};
unitEvalMap["INTEGER"] = function(node) {
	return parseInt(node.text);
};
unitEvalMap["FLOAT"] = function(node) {
	return parseFloat(node.text);
};

function evaluateUnits(node) {
	if(node instanceof Material){
		return node.value;
	}
	//console.log( node.typeName);
	
	//console.log(node);
	return unitEvalMap[node.typeName](node);
}

function evaluateNode(node, scope) {
	if(node instanceof TreeNode){
		return funcEvalMap[node.typeName](node, scope);
	}else if(node instanceof PrimitiveStore){
		if(node.type == "totalValue"){
			return node.primitive.totalContents();
		}else if(node.type == "object"){
			return node.primitive;
		}
	}else{
		return node;
	}
}

var trimEvalMap = new Object();

trimEvalMap["POWER"] = function(node, primitives) {
	if(node.children.length == 1){
		return trimNode(node.children[0], primitives);
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		for(var i = 0; i < node.children.length; i++){
			n.children.push(trimNode(node.children[i], primitives));
		}
		return n;
	}
};
trimEvalMap["TRUE"] = function(node) {
	return true;
};
trimEvalMap["FALSE"] = function(node) {
	return false;
};
trimEvalMap["INTEGER"] = function(node) {
	return new Material(sn("#e"+node.text));
};
trimEvalMap["MATERIAL"] = function(node, scope) {
	var units = node.children[0];
	var x = trimNode(node.children[1], scope);
	var units = evaluateUnits(units);
	var exponents = [], names = [];
	for(var i=0; i<units.length; i++){
		exponents.push(units[i].exponent);
		names.push(units[i].id);
	}
	return new Material(x.value, new UnitStore(names, exponents));
};
trimEvalMap["MULT"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if((lhs instanceof Material) && (rhs instanceof Material)){
		return mult(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		n.children = [lhs,rhs]
		return n;
	}
};
trimEvalMap["DIV"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if((lhs instanceof Material) && (rhs instanceof Material)){
		return div(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		n.children = [lhs,rhs]
		return n;
	}
};
trimEvalMap["PLUS"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if((lhs instanceof Material) && (rhs instanceof Material)){
		return plus(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText,  node.typeName);
		n.children = [lhs,rhs]
		return n;
	}
};
trimEvalMap["MINUS"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if((lhs instanceof Material) && (rhs instanceof Material)){
		return minus(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		n.children = [lhs,rhs]
		return n;
	}
};

trimEvalMap["FLOAT"] = trimEvalMap["INTEGER"];
trimEvalMap["PRIMITIVE"] = function(node, primitiveBank) {
	var res;
	if(node.text.substr(0, 2)=="[["){
		res = new PrimitiveStore(primitiveBank[node.text.substr(2, node.text.length-4)], "totalValue");
	}else{
		res = new PrimitiveStore(primitiveBank[node.text.substr(1, node.text.length-2)], "object");
	}
	if(typeof res.primitive === "undefined"){
		throw "MSG: The primitive <i>"+node.origText+"</i> could not be found.";
	}
	return res;
};
trimEvalMap["NEGATE"] = function(node, scope) {
	if(node.children.length==0){
		return new TreeNode(node.origText,  node.typeName);
	}
	var x = trimNode(node.children[0], scope);
	if(x instanceof Material){
		return negate(x)
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		n.children = [x]
		return n;
	}
};


function trimNode(node, primitives) {
	if(trimEvalMap.hasOwnProperty(node.typeName)){
		return trimEvalMap[node.typeName](node, primitives);
	}else{
		var n = new TreeNode(node.origText, node.typeName);
		for(var i = 0; i < node.children.length; i++){
			n.children.push(trimNode(node.children[i], primitives));
		}
		return n;
	}
}

function trueValue(q){
	if(q instanceof Vector){
		throw "MSG: Cannot use a vector as a boolean.";
	}
	return q && (isUndefined(q.value) || (q.value.toString() != "0" && q.value.toString() != "0.") )
}

function isLocal() {
	return (document.location.hostname == "localhost");
}

function isUndefined(item){
	return typeof(item)=="undefined";
}

function isDefined(item){
	return (! isUndefined(item));
}
