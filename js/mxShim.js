"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

/*

Lightweight shim for mxGraph when not using visualization components. Supports loading saved models and carrying out basic edit operations.

*/

function SimpleNode(){
	
}

SimpleNode.prototype.getAttribute = function(x){
	var v = this["@attributes"][x];
	
	return v;
}

SimpleNode.prototype.setAttribute = function(x, value){
	this["@attributes"][x] = ""+value;
}


function loadXML(modelString){
	var oParser = new DOMParser();
	graph = oParser.parseFromString(modelString, "text/xml");
	graph = mxGraphToJson(graph);
	graph.children[0].value = {nodeName: 'root', id: 1};
	graph.children[0].id = 1;
	
	clearPrimitiveCache();
	var connectors = findType(["Flow", "Link", "Transition"]);
	var items = primitives();
	connectors.forEach(function(x){
		x.source = null;
		x.target = null;
		items.forEach(function(i){
			if(x.children[0].getAttribute("source") && x.children[0].getAttribute("source") == i.id){
				x.source = i;
			}
			if(x.children[0].getAttribute("target") && x.children[0].getAttribute("target") == i.id){
				x.target = i;
			}
		})
	});
	
	clearPrimitiveCache();
	
	function cleanCell(x){
		if(x.children){
			var cells = x.children.filter(function(c){
				return c.value.nodeName == "mxCell";
			});
		
			if(cells.length > 0){
				if(cells[0].getAttribute("parent")){
					setParent(x, findID(cells[0].getAttribute("parent")));
				}
			}
		
			x.children = x.children.filter(function(c){
				return c.value.nodeName != "mxCell";
			});
		
			for(var i = x.children.length - 1; i >= 0; i--){
				cleanCell(x.children[i]);
			};
		}
		
	}
	cleanCell(graph);
	
	clearPrimitiveCache();
	
	return graph;
}

function simpleCloneNode(node, parent){
	var obj = new SimpleNode();
	obj.value = node.cloneNode(true);
	obj.parent = parent;
	obj.parentNode= parent;
	

	var currId = [1].concat(primitives().map(function(x){return x.id}).filter(function(x){return x}));
	
	obj["@attributes"] = {
		id: Math.max.apply(null, currId) + 1
	};
	
	if (node.attributes.length > 0) {
		
		for (var j = 0; j < node.attributes.length; j++) {
			var attribute = node.attributes.item(j);
			obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
		}
		
	}

	obj.id = obj["@attributes"].id;
	
	
	return obj;
}

function mxGraphToJson(xml, parent) {
	
	// Create the return object
	var obj = new SimpleNode();
	obj["@attributes"] = {};
	obj.value = xml;
	obj.parent = parent;
	obj.parentNode = parent;

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
			obj.id = obj["@attributes"].id;
			
		}
	} else if (xml.nodeType == 3) { // text
		return null;
	}

	if (xml.hasChildNodes()) {
		obj.children = [];
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			var x = mxGraphToJson(item, obj);
			if(x){
				obj.children.push(x);
			}
		}
	}
	return obj;
};

function setAttributeUndoable(primitive, name, value){
	if(primitive instanceof SimpleNode){
		primitive.setAttribute(name, value);
		clearPrimitiveCache();
	}else{
		var edit = new mxCellAttributeChange(primitive, name, value);
		graph.getModel().execute(edit);
	}
}