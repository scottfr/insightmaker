"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var recordingRes;
function generateRecording(){
	recordingRes = [];
	var events = undoHistory.history.map(function(x){return x.changes});
	var changes = [];
	for(var i = 0; i < events.length; i++){
		changes = changes.concat(events[i]);
	}
	//console.log(changes);
	var lastRes = false;
	for(var i = 0; i < changes.length; i++){
		console.log("Item: "+i);
		var change = serializeChange(changes[i]);
		if(capture && (change !== null) && (change.id != capture.id || ((change.type != "attribute" || change.attribute != "name") && change.type != "geometry" && change.type!="terminal") )){
			/*console.log("--");
			console.log(i);
			console.log(change.type);
			console.log(capture.type)
			console.log(change.target);
			console.log(capture.target);*/
			console.log("Removing capture");
			console.log(change.id);
			console.log(capture.id);
			console.log(change.type);
			capture = false;
		}
		console.log(change);
		if(capture && (change !== null)){
			console.log("Inserting into capture");
			if(change.type == "attribute"){
				capture[change.attribute] = change.value;
			}else if(change.type == "terminal"){
				if(isDefined(change.alpha)){
					capture.alpha = change.alpha;
				}
				if(isDefined(change.omega)){
					capture.omega = change.omega;
				}
			}else if(change.type=="geometry"){
				capture["geometry"] = change.geometry;
			}
		}else{
			console.log("Adding change");
			if(change !== null){
				recordingRes.push(change);
			}
		}
		lastRes = recordingRes[recordingRes.length-1];
	}
	
	var x = JSON.stringify(cleanIds(recordingRes)).replace(/\}\,\{(.[^x])/g,"}\n\n{$1");
	return x.substr(1, x.length-2);
}

function cleanIds(dat){
	for(var i=0; i<dat.length; i++){
		dat[i].id = undefined;
		if(dat[i].type == "attribute"){
			dat[i].type = undefined;
			if(dat[i].attribute == "Agent"){
				dat[i].value = getName(findID(dat[i].value));
			}
		}
		if(dat[i].type == "create"){
			dat[i].create = dat[i].primitive;
			dat[i].primitive = undefined;
			dat[i].type = undefined;
		}
		if(dat[i].type == "geometry"){
			dat[i].type = undefined;
		}
		if(dat[i].type == "remove"){
			dat[i].remove = dat[i].target;
			dat[i].target = undefined;
			dat[i].type = undefined;
		}
	}
	return dat;
}

var capture = false;
var folderItems = [];
function serializeChange(i){
	//console.log(i)
	if(i instanceof mxCellAttributeChange){
		if(i.value == i.previous || (i.value=="" && isUndefined(i.previous))){
			return null;
		}
		var r = {type: "attribute", id: i.cell.id, attribute: i.attribute};
		if(i.attribute=="name"){
			r.target = i.previous;
		}else{
			r.target = i.cell.value.nodeName=="Display"?"DISPLAY":i.cell.getAttribute("name");
		}
		if(i.attribute=="Primitives"){
			r.value = getName(findID(i.value.split(",")));
		}else{
			r.value = i.value;
		}
		return r;
	}else if(i instanceof mxChildChange){
		
		if(isUndefined(i.index)){
			return {type: "remove", target: i.child.getAttribute("name")};
		}else{
			if(i.parent.value){
				folderItems.push(i.child);
			}else{
				var geo = i.child.geometry;
				capture =  {type: "create", id: i.child.id, primitive: i.child.value.nodeName, geometry: {x: geo.x, y: geo.y, width: geo.width, height: geo.height}};
				if(geo.sourcePoint && ! ((geo.sourcePoint.x==0 && geo.sourcePoint.y==100) || (geo.sourcePoint.x==100 && geo.sourcePoint.y==0))){
					capture.geometry.sourcePoint = {x: geo.sourcePoint.x, y: geo.sourcePoint.y};
				}
				if(geo.targetPoint && ! ((geo.sourcePoint.x==0 && geo.sourcePoint.y==100) || (geo.sourcePoint.x==100 && geo.sourcePoint.y==0))){
					capture.geometry.targetPoint = {x: geo.targetPoint.x, y: geo.targetPoint.y};
				}
				if(i.child.value.nodeName=="Folder"){
					if(folderItems.length == 0){
						return null;
					}
					capture.items = getName(folderItems);
					folderItems = [];
				}
				recordingRes.push(capture);
			}
			
			return null;
		}
		
	}else if(i instanceof mxGeometryChange){
		if(folderItems.length>0){
			return null;
		}
		var geo = i.cell.geometry;
		var g = {type: "geometry", id: i.cell.id, target: i.cell.getAttribute("name"), geometry: {x: geo.x, y: geo.y, width: geo.width, height: geo.height}};
		//console.log(geo);
		if(geo.sourcePoint && ! ((geo.sourcePoint.x==0 && geo.sourcePoint.y==100) || (geo.sourcePoint.x==100 && geo.sourcePoint.y==0)) ){
			g.geometry.sourcePoint = {x: geo.sourcePoint.x, y: geo.sourcePoint.y};
		}
		if(geo.targetPoint && ! ((geo.sourcePoint.x==0 && geo.sourcePoint.y==100) || (geo.sourcePoint.x==100 && geo.sourcePoint.y==0))){
			g.geometry.targetPoint = {x: geo.targetPoint.x, y: geo.targetPoint.y};
		}
		if(geo.points){
			g.geometry.points = geo.points.slice().map(function(x){return {x: x.x, y: x.y}});
		}
	//	console.log(g)
		return g;
	}else if(i instanceof mxTerminalChange){
		var x = {type: "terminal", id: i.cell.id, target: i.cell.getAttribute("name")};
		if(i.source){
			x.alpha = i.terminal?i.terminal.getAttribute("name"):null;
		}
		if(! i.source){
			x.omega = i.terminal?i.terminal.getAttribute("name"):null;
		}
		if(capture == false || capture.id != x.id){
			capture = x;
			recordingRes.push(capture);
			return null
		}
		return x;
	}else{
		return null;
	}
}
