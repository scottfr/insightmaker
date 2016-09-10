"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

if(! sn){
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
}

var varBank = {};
var functionBank = varBank;

var functionLoaders = [];

function bootCalc(){
	varBank = {};
	functionBank = varBank;
	
	varBank["-parent"] = null;
	varBank["e"] = new Material(2.71828182845904523536);
	varBank["pi"] = new Material(3.14159265358979323846264338);
	varBank["phi"] = new Material(1.61803399);
	for(var i=0; i< functionLoaders.length; i++){
		functionLoaders[i]();
	}
	
	varBank["stringbase"] = StringBase;
	varBank["vectorbase"] = VectorBase;
	if(window.ObjectBase){
		varBank["objectbase"] = ObjectBase;
	}
	if(window.AgentBase){
		varBank["agentbase"] = AgentBase;
	}
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
Function.prototype.toNum = function(){
	return this([]);
}

function UserFunction(){
	
}
UserFunction.prototype.toNum = function(){
	if(!this.fn){
		return this([]);
	}else{
		return this.fn([]);
	}
}

var StringObject = {};
var StringBase;
var VectorObject = {};
var VectorBase = {};
var Vector = function(items, names, parent){
	this.parent = parent?parent:VectorBase;
	this.items = items;
	this.names = names;
	this.namesLC = undefined;
	if(names){
		this.namesLC = [];
		for(var i = 0; i < names.length; i++){
			if(names[i]){
				this.namesLC.push(names[i].toLowerCase())  
			}else{
				this.namesLC.push(undefined);
			}
		}
	}
	
}

Vector.prototype.toNum = function(){
	if(this.isNum){
		return this;
	}

	var v = this.fullClone();
	for(var i=0; i<v.items.length; i++){
		v.items[i] = v.items[i].toNum();
	}
	v.isNum = true;
	return v;
};
Vector.prototype.toString = function(){
	//console.log(this.names);
	var items = [];
	for(var i=0; i<this.items.length; i++){
		var str = prepareDisplay(this.items[i].toNum().toString())
		if(this.names && this.names[i]){
			str = this.names[i]+": "+str; 
		}
		items.push(str);
	}
	return '{'+items.join(", ")+'}';
};
Vector.prototype.length = function(){
	return this.items.length;
};
Vector.prototype.cloneCombine = function(other, operation, rhs, noswitch){
	return this.fullClone().combine(other, operation, rhs, noswitch);
}
Vector.prototype.combine = function(other, operation, rhs, noswitch){	
	if(other instanceof Vector){
		if((this.length() != other.length()) && (! this.names) && (! other.names)){
			throw "MSG: Vectors must have equal length when combined.";
		}
	}
	if((other instanceof Vector) && this.names && other.names){
		if((! noswitch) && other.depth() > this.depth()){
			return other.combine(this, operation, ! rhs);
		}
		if(! this.keysMatch(other.namesLC)){
			if(this.items[0] instanceof Vector){
				for(var i=0; i< this.items.length; i++){
					this.items[i].combine(other, operation, rhs, true)
				}
				return this;
			}else{
				throw "MSG: Keys do not match for vector operation."
			}
		}
	}
	for(var i=0; i< this.length(); i++){
		var x;
		if(other instanceof Vector){
			if(this.names && other.names){
				var index = other.namesLC.indexOf(this.namesLC[i]);
				if(this.names=="*"){
					index = -2;
				}
				if(isUndefined(index) || index == -1){
					index = other.names.indexOf("*");
				}
				if(isUndefined(index) || index == -1){
					throw "MSG: Mismatched keys for vector operation."
				}
				if( index == -2){
					x = undefined;
				}else{
					x = other.items[index];
				}
			}else{
				x = other.items[i];
			}
		}else{
			x = other;
		}
		if(isDefined(x)){
			if(rhs){
				this.items[i] = operation(x, this.items[i]);
			}else{
				this.items[i] = operation(this.items[i], x);
			}
		}
	}
	if(this.names && this.names.indexOf("*") > -1 && (other instanceof Vector) && other.names){
		var starred = this.items[this.names.indexOf("*")]
		for(var i = 0; i < other.names.length; i++){
			if(other.names[i] && (this.namesLC.indexOf(other.namesLC[i]) == -1 || other.names == "*")){

				if(rhs){
					this.items.push(operation(other.items[i], starred));
				}else{
					this.items.push(operation(starred, other.items[i]));
				}
				this.names.push(other.names[i])
				this.namesLC.push(other.namesLC[i])
			}
		}
	}
	return this;
};
Vector.prototype.collapseDimensions = function(target){
	if(target instanceof Vector){
		if(this.depth() == target.depth()){
			return this;
		}else{
			var selector = [];
			var base = this;
			var targetLevel = target;
			for(var i=0; i<this.depth(); i++){
				if(!(targetLevel instanceof Vector)){
					selector.push(function(x){return functionBank["sum"](x[0].items)});
					base = base.items[0];
				}else if(keysMatch(base.namesLC, targetLevel.namesLC)){
					selector.push("*");
					base = base.items[0];
					targetLevel = targetLevel.items[0]
				}else{
					selector.push(function(x){return functionBank["sum"](x[0].items)});
					
					base = base.items[0];
				}
			}
			if(targetLevel.items){
				throw "MSG: Keys do not match for vector collapsing.";
			}
			return selectFromMatrix(this, selector);
		}
	}else{
		return functionBank["sum"]([functionBank["flatten"]([this])]);
	}
};
function keysMatch(thisNames, keys){
	if(keys.indexOf("*") == -1){
		for(var i = 0; i < thisNames.length; i++){
			if(thisNames[i] != "*"){
				if(isUndefined(thisNames[i])){
					return false;
				}
				if(keys.indexOf(thisNames[i])==-1){
					return false
				}
			}
		}
	}
	if(thisNames.indexOf("*") == -1){
		for(var i = 0; i < keys.length; i++){
			if(keys[i] != "*"){
				if(isUndefined(keys[i])){
					return false;
				}
				if(thisNames.indexOf(keys[i])==-1){
					return false
				}
			}
		}
	}
	return true;
}
Vector.prototype.depth = function(){
	if(this.items.length == 0 || !(this.items[0] instanceof Vector)){
		return 1;
	}
	return this.items[0].depth()+1;
};
Vector.prototype.keysMatch = function(keys){
	if(this.names){
		return keysMatch(this.namesLC, keys)
	}else{
		return false
	}
	return true;
};
Vector.prototype.cloneApply = function(operation){
	return this.fullClone().apply(operation);
};
Vector.prototype.apply = function(operation){
	for(var i=0; i < this.items.length; i++){
		this.items[i] = operation(this.items[i], this.names?(this.names[i]):undefined);
	}
	return this;
};

Vector.prototype.stackApply = function(operation){
	//console.log("Stacking")
	if(this.depth() == 1){
		return operation(this);
	}
	var s = this.stack();
	//console.log(s);
	return s.recurseApply(operation);
};
Vector.prototype.stack = function(selector){
	//console.log("Stack!")
	var res = [];
	
	selector = selector || [0];
	
	var base = this.select(selector);
	
	
	for(var i=1; i<this.items.length; i++){
		selector[0] = i;
		var alt = this.select(selector);
		if((base instanceof Vector ) && (alt instanceof Vector)){
			if((base.names && (! alt.names)) || (alt.names && (! base.names))){
				throw "MSG: Mismatched keys for vector collapsing.";
			}else if(base.items.length != alt.items.length){
				throw "MSG: Vectors of unequal size.";
			}
		}else if(! ((base instanceof Vector ) || (alt instanceof Vector)) ){
			throw "MSG: Mismatched keys for vector collapsing.";
		}
	}
	selector[0] = 0
	
	selector.push(0)
	
	//console.log(base.items.length);
	for(var i = 0; i < base.items.length; i++){
		//console.log(i)
		selector[selector.length-1] = base.names?base.namesLC[i]:i;
		
		if(base.items[i] instanceof Vector){
			res.push(this.stack(selector.slice()));
		}else{
			var vecs = [];
			var baseSub;
			for(var j = 0; j < this.items.length; j++){
				var newSelector = selector.slice();
				newSelector[0] = j
				
				var item = this.select(newSelector);
				if(item instanceof Vector){
					throw("MSG: Number where vector expected in vector collapsing.")
				}
				vecs.push(item);
			}
			var v = new Vector(vecs);
			v.terminateApply = true; 
			res.push(v);
		}
	}
	
	return new Vector(res, base.names?base.names.slice():undefined);
};
Vector.prototype.select = function(selector){
	var b = this;
	
	for(var s = 0; s < selector.length; s++){
		if(! b.items){
			throw "MSG: Number where vector expected in vector collapsing.";
		}
		if((selector[s] instanceof String) || (typeof selector[s] == "string")){
			var ind = b.namesLC.indexOf(selector[s].valueOf());
			if(ind == -1){
				throw "MSG: Mismatched keys for vector collapsing.";
			}
			b = b.items[ind];
		}else{
			b = b.items[selector[s]];
		}
	}
	return b;
};
Vector.prototype.recurseApply = function(operation){
	for(var i=0; i < this.items.length; i++){
		if((this.items[i] instanceof Vector) && !(this.items[i].terminateApply)){
			this.items[i] = this.items[i].recurseApply(operation);
		}else{
			this.items[i] = operation(this.items[i]);
		}
	}
	return this;
};
Vector.prototype.fullNames = function(){
	if(this.items[0] instanceof Vector){
		var subn = this.items[0].fullNames()
		var n = [];
		for(var i = 0; i < this.names.length; i++){
			for(var j = 0; j< subn.length; j++){
				n.push([this.names[i]].concat(subn[j]))
			}
		}
		//console.log(n)
		return n;
	}else{
		
		var n = [];
		for(var i=0; i<this.names.length; i++){
			n.push([this.names[i]]);
		}
		return n
	}
}
Vector.prototype.clone = function(){
	var newItems = [];
	for(var i=0; i<this.items.length; i++){
		if(this.items[i] instanceof Vector){
			newItems.push(this.items[i].clone());
		}else{
			newItems.push(this.items[i]);
		}
	}
	return new Vector(newItems, this.names?this.names.slice():undefined, this.parent);
};
Vector.prototype.fullClone = function(){
	var newItems = [];
	for(var i=0; i<this.items.length; i++){
		if(this.items[i].fullClone){
			newItems.push(this.items[i].fullClone());
		}else{
			newItems.push(this.items[i]);
		}
	}
	return new Vector(newItems, this.names?this.names.slice():undefined, this.parent);
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


if(! Primitive){
	var Primitive = function(n){
		this.v = n;
		this.vector = new Vector([],[], VectorBase);
	}
	Primitive.prototype.value = function(){
		return this.v.fullClone();
	};
	Primitive.prototype.setValue = function(newValue){
		this.v = newValue;
		return newValue;
	};
	Primitive.prototype.toNum = function(){
		return this.v.fullClone();
	};
	Primitive.prototype.toString = function(){
		return "Primitive Reference";
	};
	
	
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
		//console.log(root);
	}
	return root;
}
function trimTree(root, primitiveBank){
	return trimNode(root, primitiveBank);	
}
function evaluateTree(root, varBank){
	evaluatingLine = undefined;
	try {
		return evaluateNode(root, varBank);	
	}catch(err){
		if(err.returnVal){
			return err.data;
		}else{
			throw(err);
		}
	}
}

var PB = {"test": new Primitive(new Material(3)),"a": new Primitive(new Material(1)),"b": new Primitive(new Material(2)),"c": new Primitive(new Material(3))};


function evaluate(input, dontToNum) {
	//console.log(input);
	
	PB["test vector"] = new Primitive(new Vector([new Material(1), new Material(2), new Material(3)],[], VectorBase));
	
	PB["test vector 2"] = new Primitive(new Vector([new Material(1.2), new Material(2.9), new Material(3)],[], VectorBase));
	
	var root = trimTree(createTree(input), PB);
	
	//console.log(root);
	var x;
	try {
		
		
		x = evaluateTree(root, varBank)
		
		if(! dontToNum){
			x = x.toNum();
		}

		
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
		if(x.value.toPrecision){
			if(x.value === 0){
				x.value = "0";
			}else{
				x.value = x.value.toPrecision(21);
			}
		}
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

var TreeNode = function(text, typeName, line){
	this.origText = text;
	this.text = text.toLowerCase();
	this.typeName = typeName;
	this.line = line;
	this.children = [];
};

function convertToObject(node, parser) {
	var t = node.getToken();
	var current = new TreeNode( t.getText(), parser.getTokenNames()[t.getType()], t.line);
	//Add children
	/*console.log("--")
	console.log(t);
	console.log(current);*/
	
	if (node.getChildCount() > 0) {
		var children = node.getChildren();
		for (var i=0; i<children.length; i++) {
			current.children.push(convertToObject(children[i], parser));

			if((! current.line) && current.children[current.children.length-1].line){
				current.line = current.children[current.children.length-1].line;
			}
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
		if(node.children[i].text=="return"){
			throw {returnVal: true, data: evaluateNode(node.children[i].children[0], scope)};
		}else{
			response =  evaluateNode(node.children[i], scope);
		}
	}
	return response;
};

funcEvalMap["NEGATE"] = function(node, scope) {
	return negate(evaluateNode(node.children[0], scope).toNum());
};
function negate(x){
	if(x instanceof Vector){
		return x.cloneApply(negate);
	}
	
	if((typeof x == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((x instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	return new Material(fn["-"](x.value), x.units);
};

funcEvalMap["AND"] = function(node, scope) {
	return funAnd(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum())
};

function funAnd(lhs,rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, funAnd, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, funAnd, true);
	}
	
	return trueValue(lhs) && trueValue(rhs);
};

funcEvalMap["OR"] = function(node, scope) {
	return funOr(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum())
};

function funOr(lhs,rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, funOr, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, funOr, true);
	}
	
	return trueValue(lhs) || trueValue(rhs);
};

funcEvalMap["XOR"] = function(node, scope) {
	return funXor(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum())
};

function funXor(lhs,rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, funXor, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, funXor, true);
	}
	
	return (trueValue(lhs) || trueValue(rhs)) && ! (trueValue(lhs) && trueValue(rhs));
};


funcEvalMap["NOT"] = function(node, scope) {
	return fNot(evaluateNode(node.children[0], scope).toNum());
};

function fNot(x){
	if(x instanceof Vector){
		return x.cloneApply(fNot);
	}
	
	return ! trueValue(x);
};

funcEvalMap["NOTEQUALS"] = function(node, scope) {
	return neq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function neq(lhs, rhs){
	if((typeof lhs == "boolean" && !(rhs instanceof Vector)) || (typeof rhs == "boolean" && !(lhs instanceof Vector))){
		return trueValue(lhs)!=trueValue(rhs);
	}
	if(( ((lhs instanceof String) || (typeof lhs == "string")) && !(rhs instanceof Vector)) || ( ((rhs instanceof String) || (typeof rhs == "string")) && !(lhs instanceof Vector))){
		return (lhs.toLowerCase?lhs.toLowerCase():lhs) != (rhs.toLowerCase?rhs.toLowerCase():rhs);
	}
	
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, neq, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, neq, true);
	}
	
	if((! (lhs instanceof Material)) || (! (rhs instanceof Material))){
		return lhs != rhs;
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			return true;
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}

	return ! fn["="](lhs.value, rhs.value);
};

funcEvalMap["EQUALS"] = function(node, scope) {
	return eq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function eq(lhs, rhs){
	if(((typeof lhs) == "boolean" && !(rhs instanceof Vector)) || ((typeof rhs) == "boolean" && !(lhs instanceof Vector))){
		return trueValue(lhs)==trueValue(rhs);
	}
	if(( ( (typeof lhs == "string") || (lhs instanceof String) ) && !(rhs instanceof Vector)) || (( (typeof rhs == "string") || (rhs instanceof String) ) && !(lhs instanceof Vector))){
		return (lhs.toLowerCase?lhs.toLowerCase():lhs) == (rhs.toLowerCase?rhs.toLowerCase():rhs);
	}
	
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, eq, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, eq, true);
	}
	
	if((! (lhs instanceof Material)) || (! (rhs instanceof Material))){
		return lhs == rhs;
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			return false;
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	

	return fn["="](lhs.value, rhs.value);
};

function comparisonValid(lhs, rhs){
	if((lhs instanceof String) || (typeof lhs == 'string') || (rhs instanceof String) || (typeof rhs == 'string')){
		throw "MSG: Cannot use Strings in logical inequality comparisons.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot use Agents in logical inequality comparisons.";
	}
}

funcEvalMap["LT"] = function(node, scope) {
	return lessThan(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};
function lessThan(lhs, rhs){
	
	comparisonValid(lhs, rhs);
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, lessThan, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, lessThan, true);
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}


	return fn["<"](lhs.value, rhs.value);;
};

funcEvalMap["LTEQ"] = function(node, scope) {
	return lessThanEq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};
function lessThanEq(lhs, rhs){
	
	comparisonValid(lhs, rhs);
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, lessThanEq, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, lessThanEq, true);
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	

	return fn["<="](lhs.value, rhs.value);
};

funcEvalMap["GT"] = function(node, scope) {
	return greaterThan(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function greaterThan(lhs, rhs){
	
	comparisonValid(lhs, rhs);
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, greaterThan, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, greaterThan, true);
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	

	return fn[">"](lhs.value, rhs.value);
};

funcEvalMap["GTEQ"] = function(node, scope) {
	return greaterThanEq(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function greaterThanEq(lhs, rhs){
	
	comparisonValid(lhs, rhs);
	
	
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, greaterThanEq, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, greaterThanEq, true);
	}
	
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "comparison");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	

	return fn[">="](lhs.value, rhs.value);
};

funcEvalMap["PLUS"] = function(node, scope) {
	return plus(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function plus(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, plus, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, plus, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	if(((typeof lhs == 'string') || (lhs instanceof String)) || ((typeof rhs == 'string') || (rhs instanceof String)) ){
		var s = new String(lhs.toString()+rhs.toString());
		s.parent = StringBase;
		return s;
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "addition");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	
	return new Material(fn["+"](lhs.value, rhs.value), rhs.units);

};

funcEvalMap["MINUS"] = function(node, scope) {
	return minus(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function minus(lhs, rhs){

	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, minus, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, minus, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	if (lhs.units !== rhs.units) {
		var scale = convertUnits(rhs.units, lhs.units);
		if (scale === 0) {
			unitAlert(lhs.units, rhs.units, "subtraction");
		} else {
			rhs.value = fn["*"](rhs.value, scale);
			rhs.units = lhs.units;
		}
	}
	
	

	return new Material(fn["-"](lhs.value, rhs.value), rhs.units);
};

funcEvalMap["MULT"] = function(node, scope) {
	return mult(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function mult(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, mult, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, mult, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	var x = fn["*"](lhs.value, rhs.value);
	if(lhs.units && rhs.units){
		lhs.units.addBase(); rhs.units.addBase();
		return new Material(fn["*"](fn["*"](lhs.units.toBase, x), rhs.units.toBase), lhs.units.multiply(rhs.units, 1));
	}else if(lhs.units){
		return new Material(x, lhs.units);
	}else if(rhs.units){
		return new Material(x, rhs.units);
	}
	
	return new Material(x);
};

funcEvalMap["DIV"] = function(node, scope) {
	return div(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function div(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, div, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, div, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	var x = fn["/"](lhs.value, rhs.value);
	if(lhs.units && rhs.units){
		lhs.units.addBase(); rhs.units.addBase();
		return new Material(fn["/"](fn["*"](lhs.units.toBase, x), rhs.units.toBase), lhs.units.multiply(rhs.units, -1));
	}else if(lhs.units){
		return new Material(x, lhs.units);
	}else if(rhs.units){
		return new Material(x, rhs.units.power(-1));
	}
	
	return new Material(x);
	
};


funcEvalMap["POWER"] = function(node, scope) {
	if(node.children.length == 1){
		return evaluateNode(node.children[0], scope);
	}

	var rhs = evaluateNode(node.children[node.children.length - 1], scope).toNum();
	
	for(var j = node.children.length - 1; j > 0; j--){
		
		var lhs = evaluateNode(node.children[j - 1], scope).toNum();
		if ((rhs instanceof Vector) || ! rhs.units) {
			rhs = power(lhs, rhs);
		} else {
			throw "MSG: Exponents may not have units.";
		}
	}
	return rhs;
};

function power(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, power, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, power, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	var x = lhs.value;
	if(typeof x == "number"){
		x = sn("#e"+x)
	}
	return new Material(fn.expt(x, rhs.value), lhs.units?lhs.units.power(rhs.value):undefined);
};

funcEvalMap["MOD"] = function(node, scope) {
	return doMod(evaluateNode(node.children[0], scope).toNum(), evaluateNode(node.children[1], scope).toNum());
};

function doMod(lhs, rhs){
	if(lhs instanceof Vector){
		return lhs.cloneCombine(rhs, doMod, false);
	}else if(rhs instanceof Vector){
		return rhs.cloneCombine(lhs, doMod, true);
	}
	
	if((typeof lhs == 'boolean') || (typeof rhs == 'boolean')){
		throw "MSG: Cannot convert Booleans to Numbers.";
	}
	if((lhs instanceof Agent) || (rhs instanceof Agent)){
		throw "MSG: Cannot convert Agents to Numbers.";
	}
	
	if (! rhs.units) {
		return new Material(fn.mod(lhs.value, rhs.value), lhs.units);
	} else {
		throw "MSG: The right hand side of \"mod\" may not have units."
	}
};


funcEvalMap["IDENT"] = function(node, scope) {
	var varName = node.text;
	
	while ( !(varName in scope) ) {
		if ( scope["-parent"] ) {
			scope = scope["-parent"];
		} else {
			if(varName == "x" && window.isCalc){
				throw "PLOT" ;
			}else if(varName=="i"){//imaginary number
				return new Material(sn("i"));
			}else{
				throw "MSG: The variable or function \"" + node.origText + "\" does not exist.";
			}
		}
	}
	
	var v = scope[varName];
	
	if((v instanceof TreeNode) && v.typeName == "ARRAY"){
		v = evaluateNode(v, scope);
	}
	if(v.fullClone && !(v instanceof Vector)){
		return v.fullClone();
	}else{
		return v;
	}
};

funcEvalMap["NEW"] = function(node, scope) {
	
	var base = evaluateNode(node.children[0], scope);
	if(base instanceof Vector){
		var n = new Vector([],undefined, base);
		var constructor;
		var r;
		try{
			r = selectFromVector(base, "constructor");
			constructor = r.data;
		}catch(err){}
		
		if(! constructor){
			if(node.children.length==2 && node.children[1].children.length>0){
				throw "MSG: No constructor available for '"+node.children[0].text+"'.";
			}
		}else{
			if(node.children.length==2){
				callFunction(constructor, node.children[1], scope, n, r.parent);
			}else{
				callFunction(constructor, {children:[]}, scope, n, r.parent);
			}
		}
		return n;
	}else{
		throw "MSG: 'New' can only be use to create instances of Vectors.";
	}
}

funcEvalMap["INNER"] = function(node, scope) {
	
	var base = evaluateNode(node.children[0], scope);
	
	if(node.children.length==2 & node.children[1].typeName=="FUNCALL"){
		return callFunction(base, node.children[1], scope);
	}

	var lastSelf; // for "self" binding
	var lastBase; // for "self" binding

	if(scope.self && node.children[0].text=="parent"){
		lastSelf = scope.self;
	}else if(!((base instanceof Function) || (base instanceof UserFunction))){
		lastSelf = base;
	}
	
	for(var i=1; i< node.children.length; i++){
		//console.log(node.children[i].typeName)
		
		
		if(node.children[i].typeName == "SELECTOR" ){
			if(node.children[i].children[0].typeName == "DOTSELECTOR"){
				
				for(var j=0; j<node.children[i].children[0].children.length; j++){
					var res = [];
					if(node.children[i].children[0].children[j].text){
						res.push(node.children[i].children[0].children[j].text);
					}else{
						res.push(node.children[i].children[0].children[j].valueOf());
					}
					try{
						base = selectFromMatrix(base, res);
					}catch(err){
						if(base instanceof Primitive && !(base instanceof Agent)){
							base = base.toNum();
							j--;
						}else{
							throw(err);
						}
					}
					
					if(!((base instanceof Function) || (base instanceof UserFunction))){
						lastSelf = base;
						lastBase = base;
					}
				}
				
			}else{
			
				if(base instanceof Primitive){
					base = base.toNum();
			
					if(!((base instanceof Function) || (base instanceof UserFunction))){
						lastSelf = base;
						lastBase = base;
					}
				}
		
		
				try{
					base = selectFromMatrix(base, createMatrixSelector(node.children[i], scope, 0, true));
				}catch(err){
					if(base instanceof Primitive ){
						base = base.toNum();
						i--;
					}else{
						throw(err);
					}
				}
				
				if(!((base instanceof Function) || (base instanceof UserFunction))){
					lastSelf = base;
					lastBase = base;
				}
			}
			
			
		}else{//"FUNCALL"
			base = callFunction(base, node.children[i], scope, lastSelf, lastBase);
			
			if(!((base instanceof Function) || (base instanceof UserFunction))){
				lastSelf = base;
				lastBase = base;
			}
		}
	}
	return base;
};

function callFunction(base, node, scope, lastSelf, lastBase){
	if((typeof base != "function") && ! (base instanceof UserFunction)){
		//if(isLocal()){
		//	console.log(base);
		//}
		throw "MSG: Trying to call a non-function.";
	}
	
	var vals = [];
	var fingerprint = "";
	if(node instanceof Array){
		vals = node;
	}else{
		if(! node.functionFingerprint){
			node.functionFingerprint = "FINGERPRINT-" + Math.random();
		}
		fingerprint = node.functionFingerprint;

		if(base.delayEvalParams){
			//don't evaluate params right away. needed for IfThenElse and short circuiting
			for (var j = 0; j < node.children.length; j++){
				vals.push({node: node.children[j], scope: scope});
			}
		}else{
			for (var j = 0; j < node.children.length; j++){
				var item = evaluateNode(node.children[j], scope);
				if(item.fullClone && ! (item instanceof Vector)){
					item = item.fullClone();
				}
				vals.push(item);
			}
		}
	}
	
	var fn;
	if (base.fn) {
		 fn = base.fn; // user defined function
	} else {
		node.delayEvalParams = base.delayEvalParams;
		fn = base; //built-in
	}
	
	var oldLine = evaluatingLine;
	
	var x = fn(vals, fingerprint, lastSelf, lastBase);
	
	evaluatingLine = oldLine;
	
	return x;
	
}

function createMatrixSelector(node, scope, offset, createFunctions){
	var selector = [];
	offset = offset || 0;
	for(var i=offset; i<node.children.length; i++){
		var child = node.children[i];
		if(child.typeName=="MULT"){
			selector.push("*");
		}else{
			var x = evaluateNode(node.children[i], scope);
			if((typeof x == "function") || (x instanceof UserFunction)){
				if(typeof x == "function"){
					var fn = x;
				}else{
					var fn = x.fn;
				}
				(function(f){
				selector.push(function(x){
					if(! x[0].stackApply){
						throw "MSG: Can't apply function across elements of non-vector."
					}
					
					return x[0].stackApply(function(x){
						return f([x]);	
					});
				})
				})(fn);
			}else{
				selector.push(x.toNum());
			}
		}
	}
	return selector
}

function selectFromMatrix(mat, items, fill){
	//console.log("--")
	//console.log(items)

	var m = mat;
	if(! (m instanceof Vector)){
		if(m.vector){
			m = m.vector;
		}else if(m.parent){
			m = new Vector([],[], m.parent);
		}
	}
	if(isUndefined(fill) && m.fullClone){
		m = m.fullClone();
	}
	//console.log("--")
	
	var root = selectFromVector(m, items.shift(), items.length==0?fill:undefined, isDefined(fill))
	var children = [];
	if(root.collapsed){
	 	children = [root.data];
	}else{
		children = root.data.items;
	}
	
	while(items.length > 0){
		//console.log("iteration");
		//console.log(children);
		var newChildren = [];
		var selector = items.shift();
		//console.log(selector)
		for(var i = 0; i < children.length; i++){
			//console.log("child")
			//console.log(children[i])
			if(! (children[i] instanceof Vector)){
			//	if(children[i].parent instanceof Vector){
			//		children[i] = children[i].parent.fullClone();
			//	}else if(children[i].vector instanceof Vector){
			//		children[i] = children[i].vector.fullClone();
			//	}else{
					throw "MSG: No element available for: "+selector;
			//	}
			}
			//console.log(children[i])
			var vec = selectFromVector(children[i], selector, items.length==0?fill:undefined);
			//console.log(vec);
			
			if(vec.collapsed){

				if(! fill){
					children[i].items = [vec.data];
					children[i].names = ["!!BREAKOUT DATA"]; 
				}
			
				newChildren=newChildren.concat(vec.data)
			}else{
				newChildren=newChildren.concat(vec.data.items)

				if(! fill){
					children[i].items = vec.data.items;
					children[i].names = vec.data.names;
				}
			}
		}
		children = newChildren;
	}
	
	//console.log("done:")
	//console.log(root.data)
	//console.log(root);
	return doBreakouts(root.data);
}

function doBreakouts(vec){
	if(! (vec instanceof Vector)){
		return vec;
	}
	if(vec.items.length==1 && vec.names && vec.names[0]=="!!BREAKOUT DATA"){
		return doBreakouts(vec.items[0]);
	}
	for(var i=0; i < vec.items.length; i++){
		vec.items[i] = doBreakouts(vec.items[i])
	}
	return vec;
}

function selectFromVector(vec, items, fill, doNotClone){
	
	

	if(items=="*"){
		return {data: vec};
	}else if(typeof items == "function"){
		return {data: items([vec]), collapsed: true};
	}else if(items=="parent"){
		if(vec.parent){
			return {data: doNotClone?vec.parent:vec.parent.fullClone(), collapsed:true};
		}else{
			throw "MSG: Vector does not have a parent.";
		}
	}

	if(items instanceof Vector){
		var res = [];
		var names = vec.names?[]:undefined;
		for(var i=0; i < items.items.length; i++){
			var v = items.items[i];
			var shouldSelect = true;
			if(typeof v == "boolean"){
				if(v){
					v = new Material(i+1);
				}else{
					shouldSelect = false;
				}
			}
			if(shouldSelect){
				var r = selectElementFromVector(vec, v, fill)
				res.push(r.value);
				if(names){
					names.push(r.name);
				}
			}
		}
		return {collapsed: false, parent: vec, data: new Vector(res, names, vec.parent)};
	}else{
		return {collapsed: true, parent: vec, data: selectElementFromVector(vec, items, fill).value};
	}
}


function selectElementFromVector(vec, item, fill){
	
	/*if(! (vec instanceof Vector)){
		if(vec.vector){
			vec = vec.vector;
		}else if(vec.parent){
			vec = vec.parent;
		}else{
			throw "MSG: Upping failed."
		}
	}*/
		
	
	var name = undefined;
	var value = undefined;
	
	var index;

	
	if( (item instanceof String) || (typeof item == "string")){
		try{
			if(isUndefined(fill)){
				if(!vec.names){
					throw "MSG: Key '"+item+"' not in vector."
				}
			}
			if(vec.names){
				index = -1;
				var lc = item.toLowerCase();
				for(var i=0; i<vec.names.length; i++){
					if(vec.names[i] && vec.names[i].toLowerCase() === lc){
						index = i;
						break;
					}
				}
				if(index<0 || isUndefined(index)){
					index = vec.names.indexOf("*");
				}
			}
			if(index < 0 || isUndefined(index)){
				if(isUndefined(fill)){
					throw "MSG: Key '"+item+"' not in vector.";
				}else{
					index = item;
				}
		
			}
		}catch(err){
			if(vec.parent){
				return selectElementFromVector(vec.parent, item, fill);
			}else{
				throw err;
			}
		}
	
	}else{
		index = parseFloat(item.toNum())-1;
	}
	
	if((index instanceof String) || (typeof index == "string")){
		if(! vec.names){
			vec.names = [];
			for(var i=0; i<vec.items.length; i++){
				vec.names.push(undefined);
			}
		}
		vec.items.push(fill);
		vec.names.push(index.valueOf());
		value = fill;
		name = index;
		
	}else{
		if(index < 0 || (!vec.items) || index >= vec.items.length || index % 1 != 0 ){
			throw "MSG: Index "+(1+index)+" is not in the vector.";
		}
		if(!isUndefined(fill)){
			vec.items[index] = fill;
		}
		value = vec.items[index];
		if(vec.names){
			name = vec.names[index];
		}
	}

	return {name: name, value: value};
}



funcEvalMap["ARRAY"] = function(node, scope) {
	
	if(node.children.length == 1 && node.children[0] instanceof Vector){
		return node.children[0].fullClone(); // pre calculated vector
	}
	
	var vals = [];
	var names = [];
	var hasName = false;
	for (var i = 0; i < node.children.length; i++){
		vals.push(evaluateNode(node.children[i].children[0], scope));
		if(node.children[i].children.length>1){
			if(node.children[i].children[1].text){
				names.push(node.children[i].children[1].origText);
			}else{
				names.push(node.children[i].children[1].valueOf());
			}
			hasName = true;
		}else{
			names.push(undefined);
		}
	}
	return new Vector(vals, hasName?names:undefined);
};

funcEvalMap["RANGE"] = function(node, scope) {
	if(node.children.length==1){
		return evaluateNode(node.children[0], scope);
	}
	var vals = [];
	var start = evaluateNode(node.children[0], scope).toNum();
	var end = evaluateNode(node.children[node.children.length-1], scope).toNum();

	if((! (start instanceof Material)) || (! (end instanceof Material))){
		throw "MSG: Range elements must be numbers.";
	}
	
	vals.push(start.fullClone());
	if (start.units !== end.units) {
		var scale = convertUnits(start.units, end.units);
		if (scale != 1) {
			//console.log(scale)
			throw "MSG: Units on both sides of ':' must be equal."
		}
	}
	//throw "modsa";
	var step = node.children.length==2?new Material(1, start.units):evaluateNode(node.children[1], scope).toNum();
	
	if(! (step instanceof Material)){
		throw "MSG: Range elements must be numbers.";
	}
	
	if(eq(start,end)){
		
	}else if(lessThan(start, end)){
		var it = plus(start, step);
		while(lessThanEq(it, end)){
			vals.push(it);
			it = plus(it, step);
		}
	}else if(greaterThan(start, end)){
		if(node.children.length==2){
			step = negate(step);
		}
		var it = plus(start, step);
		while(greaterThanEq(it, end)){
			vals.push(it);
			it = plus(it, step);
		}
	}
	//console.log(vals)
	
	return new Vector(vals);
};

function makeFunctionCall(varName, varNames, varDefaults, node, scope) {

	var fn = new UserFunction();

	fn.localScope = new Object();
	fn.localScope["nVars"] = varNames.length;
	for (var i = 0; i < varNames.length; i++) {
		fn.localScope[i += ""] = varNames[i];
	}
	fn.localScope["-parent"] = scope;
	fn.defaults = varDefaults;
	
	fn.fn = function(x, fingerPrint, lastSelf, lastBase) {
		var minLength = x.length;
		for(var i=0;i<x.length; i++){
			if(x[i].optional){
				minLength--;
			}
		}
		if (fn.localScope["nVars"] - fn.defaults.length > x.length || minLength > fn.localScope["nVars"]) {
			var names = [];
			for (var i = 0; i < fn.localScope["nVars"]; i++) {
				if(fn.defaults.length - (fn.localScope["nVars"]-i)>-1){
					names.push(fn.localScope[i += ""] + "=" + fn.defaults[fn.defaults.length - (fn.localScope["nVars"]-i)]);
				}else{
					names.push(fn.localScope[i += ""]);
				}
			}
			
			throw "MSG: Wrong number of parameters for " + varName + "("+names.join(", ")+").";
		}
		var localScope = {"-parent": scope};
		
		//console.log(fn.localScope);
		for (var i = 0; i < x.length; i++) {
			localScope[fn.localScope[i += ""]] = x[i];
		}
		for (var i = x.length; i < fn.localScope["nVars"]; i++) {
			//console.log(fn.defaults[fn.defaults.length - (fn.localScope["nVars"]-i)]);
			localScope[fn.localScope[i += ""]] = fn.defaults[fn.defaults.length - (fn.localScope["nVars"]-i)];
			//if(localScope[fn.localScope[i += ""]].fullClone){
			//	localScope[fn.localScope[i += ""]] = localScope[fn.localScope[i += ""]].fullClone();
			//}
		}
		
		
		if(lastSelf){
			if(! localScope.self){
				localScope["self"] = lastSelf;
			}
			//if(! localScope.parent){
		}
		if(lastBase){	
			if(lastBase.parent){
				localScope["parent"] = lastBase.parent;
			}
				//}
		}

		try{
			//console.log(localScope)
			return evaluateNode(node, localScope);
		}catch(err){
			if(err.returnVal){
				return err.data;
			}else{
				throw(err);
			}
		}
	};

	return fn;
};

funcEvalMap["THROW"] = function(node, scope) {
	throw "MSG: "+evaluateNode(node.children[0], scope);
};

funcEvalMap["TRYCATCH"] = function(node, scope) {
	try{
		return evaluateNode(node.children[0], scope);
	}catch(err){
		var localScope = {"-parent": scope};
		if((typeof err == "string") || err instanceof String){
			localScope[node.children[2].text] = s(err.substr(5));
		}else{
			localScope[node.children[2].text] = s("An error has occurred.");
		}
		return evaluateNode(node.children[1], localScope)
	}
};

funcEvalMap["WHILE"] = function(node, scope) {
	var lastResult = new Material(0);
	var innerScope = {"-parent": scope};
	while(trueValue(evaluateNode(node.children[0], scope).toNum())){
		lastResult = evaluateNode(node.children[1], innerScope);
	}
	return lastResult;
};

funcEvalMap["IFTHENELSE"] = function(node, scope) {
	//console.log(node);
	var innerScope = {"-parent": scope};
	for(var i=0; i<node.children[0].children.length; i++){
		if(trueValue(evaluateNode(node.children[0].children[i], scope).toNum())){
			return evaluateNode(node.children[1].children[i], innerScope);
		}
	}
	if(node.children[0].children.length != node.children[1].children.length){
		return evaluateNode(node.children[1].children[i], innerScope);
	}
	
	return new Material(0);
};

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
		lastResult = evaluateNode(node.children[2], innerScope);
	}
	return lastResult;
};

funcEvalMap["FOR"] = function(node, scope) {
	var lastResult = new Material(0);
	var id = node.children[0].text;
	var start = evaluateNode(node.children[1].children[0], scope).toNum();
	var by = new Material(1);
	
	if(node.children[1].children.length==3){
		by = evaluateNode(node.children[1].children[2], scope).toNum();
	}
	var innerScope = {"-parent": scope};

	innerScope[id] = start;
	while(fn[by.value>=0?"<=":">="](innerScope[id].value, evaluateNode(node.children[1].children[1], scope).toNum())){
		lastResult = evaluateNode(node.children[2], innerScope);
		innerScope[id] = plus(innerScope[id], by);
	}
	return lastResult;
}

funcEvalMap["FUNCTION"] = function(node, scope) {
	var id = node.children[0].children[0].text;
	
	functionGenerator(id, node.children[0], node.children[1], node.children[2], scope)
			
	return '"' + id + "\" defined"; 
};

funcEvalMap["ANONFUNCTION"] = function(node, scope) {
	return functionGenerator(null, node.children[0], node.children[1], node.children[2], scope); 
};

funcEvalMap["ASSIGN"] = function(node, scope) {
	//console.log(node);
	var items = node.children.length-1;
	var x = evaluateNode(node.children[node.children.length-1], scope);
	if(items>1 && (!(x instanceof Vector) || x.items.length<items)){
		throw "MSG: Too few elements returned for assignment.";
	}
	for(var i=0; i<items; i++){
		if(node.children[i] instanceof PrimitiveStore){
			if(items==1){
				node.children[i].primitive.setValue(x);
			}else{
				node.children[i].primitive.setValue(x.items[i]);
			}
		}else{
			//console.log(node);
			var varName = node.children[i].children[0].text;
			if(node.children[i].children.length > 1){
				var selector = createSelector(node.children[i].children[1], scope);
			}
			//console.log(selector);
			
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
			
			var v;
			if(items == 1){
				v = x;
			}else{
				v = x.items[i];
			}
			if(node.children[i].children.length == 1){
				scope[varName] = v;
			}else{
				if(isDefined(scope[varName])){
					//if( scope[varName] instanceof Vector){
					selectFromMatrix(scope[varName], selector, v);
					//}else{
					//throw "MSG: The variable '"+node.children[i].children[0].origText+"' is not a vector.";
					//}
				}else{
					throw "MSG: The variable '"+node.children[i].children[0].origText+"' does not exist.";
				}
			}
		}
	}
	if(items>1){
		return new Vector(x.items.slice(0,items));
	}else{
		return x;
	}
};

function createSelector(node, scope){
	if(node.children[0].typeName == "DOTSELECTOR"){
		var res = [];
		for(var i=0; i<node.children[0].children.length; i++){
			if(node.children[0].children[i].text){
				res.push(node.children[0].children[i].text);
			}else{
				res.push(node.children[0].children[i].valueOf());
			}
		}
		return res;
	}else{
		return createMatrixSelector(node, scope, 0, true)
	}
}

funcEvalMap["MATERIAL"] = function(node, scope) {
	var v =evaluateNode(node.children[0], scope).toNum();
	if(v.units){
		throw "MSG: Cannot create material where numeric part itself has units."
	}
	return new Material(v.value, node.children[1]);
};

function functionGenerator(varName, paramNames, paramDefaults, code, scope){
	var varNames = [];
	var varDefaults = [];
	for (var i = ((varName===null)?0:1); i < paramNames.children.length ; i++) {
		varNames.push(paramNames.children[i].text);
	}
		
	for (var i = 0; i < paramDefaults.children.length ; i++) {
		varDefaults.push(paramDefaults.children[i]);
	}
	if(varName===null){
		return makeFunctionCall(varName===null?"Function":varName, varNames, varDefaults, code, scope);
	}else{
		scope[varName] = makeFunctionCall(varName, varNames, varDefaults, code, scope);
	}
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
unitEvalMap["PER"] = unitEvalMap["DIV"];

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
	if(node.children.length>1){
		for(var i=1; i<node.children.length; i++){
			if(node.children[i].typeName == "NEGATE"){
				for (var j = 0; j < x.length; j++) {
			 		x[j].exponent = x[j].exponent * -1;
			 	}
		 	}else if(node.children[i].typeName == "SQUARED"){
				for (var j = 0; j < x.length; j++) {
			 		x[j].exponent = x[j].exponent * 2;
			 	}
			}else if(node.children[i].typeName == "CUBED"){
				for (var j = 0; j < x.length; j++) {
			 		x[j].exponent = x[j].exponent * 3;
			 	}
			}
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
		evaluatingLine = node.line || evaluatingLine;
		
		return funcEvalMap[node.typeName](node, scope);
	}else if(node instanceof PrimitiveStore){
		if(node.type == "totalValue"){
			if(! node.primitive.totalContents){
				throw "MSG: You can only use the double-bracket notation for total conveyor contents on Stock primitives.";
			}
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
		var n = new TreeNode(node.origText, node.typeName, node.line);
		for(var i = 0; i < node.children.length; i++){
			n.children.push(trimNode(node.children[i], primitives));
		}
		return n;
	}
};
trimEvalMap["INNER"] = function(node, primitives) {
	if(node.children.length == 1){
		return trimNode(node.children[0], primitives);
	}else{
		var n = new TreeNode(node.origText, node.typeName, node.line);
		for(var i = 0; i < node.children.length; i++){
			n.children.push(trimNode(node.children[i], primitives));
		}
		return n;
	}
};;
trimEvalMap["RANGE"] = trimEvalMap["POWER"];
trimEvalMap["TRUE"] = function(node) {
	return true;
};
trimEvalMap["FALSE"] = function(node) {
	return false;
};
trimEvalMap["STRING"] = function(node) {
	//console.log(node.origText);
	var sub = node.origText.substr(1, node.origText.length-2);
	var s;
	if(node.origText[0]=="\""){
		s = sub.replace(/\\\\/g,"\\\\TEMPTXT\\\\").replace(/\\"/g,"\"").replace(/\\'/g,"\'").replace(/\\t/g,"\t").replace(/\\b/g,"\b").replace(/\\f/g,"\f").replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\\\TEMPTXT\\\\/g, "\\");
	}else{
		s = sub.replace(/\n/,"\\n");
	}
	s = new String(s);
	s.vector = new Vector([],[],StringBase);
	return s;
};
trimEvalMap["INTEGER"] = function(node) {
	return new Material(sn("#e"+node.text));
};
trimEvalMap["MATERIAL"] = function(node, scope) {
	var units = node.children[0];
	var x = trimNode(node.children[1], scope);
	var units = evaluateUnits(units);
	var exponents = [], names = [];
	for(var i=0; i < units.length; i++){
		var j = names.indexOf(units[i].id);
		if(j == -1){
			exponents.push(units[i].exponent);
			names.push(units[i].id);
		}else{
			exponents[j] = exponents[j]+units[i].exponent;
		}
	}
	if(x instanceof Material){
		if(x.units){
			throw "MSG: Cannot create material where numeric part itself has units."
		}
		return new Material(x.value, getUnitStore(names, exponents, true));
	}else{
		var m = new TreeNode(node.origText, "MATERIAL", node.line);
		m.children = [x, getUnitStore(names, exponents, true)]
		return m;
	}
};
trimEvalMap["MULT"] = function(node, scope) {

	if(node.children.length==0){
		return "*";
	}
	
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if(isConst(lhs) && isConst(rhs)){
		return mult(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName, node.line);
		n.children = [lhs, rhs]
		return n;
	}
};

trimEvalMap["DIV"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if(isConst(lhs) && isConst(rhs)){
		return div(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName, node.line);
		n.children = [lhs,rhs]
		return n;
	}
};
trimEvalMap["PLUS"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if(isConst(lhs) && isConst(rhs)){
		return plus(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText,  node.typeName, node.line);
		n.children = [lhs,rhs]
		return n;
	}
};
trimEvalMap["MINUS"] = function(node, scope) {
	var lhs = trimNode(node.children[0], scope);
	var rhs = trimNode(node.children[1], scope);
	if(isConst(lhs) && isConst(rhs)){
		return minus(lhs, rhs);
	}else{
		var n = new TreeNode(node.origText, node.typeName, node.line);
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
		return new TreeNode(node.origText,  node.typeName, node.line);
	}
	var x = trimNode(node.children[0], scope);
	if(isConst(x)){
		return negate(x)
	}else{
		var n = new TreeNode(node.origText, node.typeName, node.line);
		n.children = [x]
		return n;
	}
};

trimEvalMap["ARRAY"] = function(node, scope){
	var n = new TreeNode(node.origText, node.typeName,node.line);
	var vals = [];
	var names = [];
	var hasName = false;
	for(var i = 0; i < node.children.length; i++){
		n.children.push(trimNode(node.children[i], scope));
		vals.push(n.children[i].children[0]);
		if(n.children[i].children.length>1){
			if(n.children[i].children[1].text){
				names.push(n.children[i].children[1].origText);
			}else{
				names.push(n.children[i].children[1].valueOf());
			}
			hasName = true;
		}else{
			names.push(undefined);
		}
	}
	
	var allConst = true;
	for(var i=0; i<vals.length; i++){
		if(! isConst(vals[i]) ){
			allConst = false;
			break;
		}
	}
	
	if(allConst){
		n.children = [new Vector(vals, hasName?names:undefined)];
	}
	return n;
}

function isConst(x){
	if( (x instanceof Material) || (typeof x == "string") || (x instanceof String) || (typeof x == "boolean") || (x instanceof Vector) ){
		return true;
	}
	return false
}

function trimNode(node, primitives) {
	if(trimEvalMap.hasOwnProperty(node.typeName)){
		evaluatingLine = node.line || evaluatingLine;
		return trimEvalMap[node.typeName](node, primitives);
	}else{
		var n = new TreeNode(node.origText, node.typeName,node.line);
		for(var i = 0; i < node.children.length; i++){
			n.children.push(trimNode(node.children[i], primitives));
		}
		return n;
	}
}

function trueValue(q){
	if(typeof q == "boolean"){
		return q;
	}else if(q instanceof Material){
		return neq(q.value, 0);	
	}else{
		throw "MSG: Only numbers can be used in place of booleans."
	}
}

function isLocal() {
	return (document.location.hostname == "localhost" || document.location.hostname == "insightmaker.dev" || document.location.hostname == "calc.dev" );
}

function isUndefined(item){
	return typeof(item)=="undefined";
}

function isDefined(item){
	return (! isUndefined(item));
}

function fireEvent(obj, eventName, eventObj){
	var p;
	var lastSelf  = obj;
	if(obj instanceof Vector){
		p = obj.parent;
	}else if (obj.vector instanceof Vector){
		obj = obj.vector;
		p = obj.parent;
	}else if (obj.parent instanceof Vector){
		obj = obj.parent;
		p = obj;
	}else{
		return false;
	}
	
	try{
		//console.log(eventName);
		//console.log(obj);
		var r = selectFromVector(obj, eventName);
		//console.log("found!");
	}catch(err){
		//console.log(err);
		return false;
	}
	
	eventObj.optional = true;
	
	return callFunction(r.data, [eventObj], varBank, lastSelf, p);
}

function ObjToVec(obj){
	var keys = Object.keys(obj);
	var vals = [];
	for(var i=0; i<keys.length; i++){
		vals.push(obj[keys[i]]);
	}
	return new Vector(vals, keys);
	
}
