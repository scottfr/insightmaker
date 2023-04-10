"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

function doLoops(){
	var a = getAdjList();
	var x = new ElementaryCyclesSearch(a.adjList, a.nodes);
	var cycles = x.getElementaryCycles();
	var connectors = findType(["Flow", "Transition" ,"Link"]);
	
	
	for(var i = cycles.length - 1; i >= 0; i--){
		if(cycles[i].length == 2){
			if((cycles[i][0].value.nodeName =="Stock" && (cycles[i][1].value.nodeName =="Flow" )) || (cycles[i][1].value.nodeName =="Stock" && (cycles[i][0].value.nodeName =="Flow" )) || (cycles[i][0].value.nodeName =="State" && ( cycles[i][1].value.nodeName =="Transition")) || (cycles[i][1].value.nodeName =="State" && ( cycles[i][0].value.nodeName == "Transition")) ){
				cycles.splice(i,1);
			}
		}
	}
	
	if(cycles.length == 0){
		mxUtils.alert("No loops found in the model.", "notice", true);
	}else{
		cycles.sort(function(a,b){
			return a.length - b.length;	
		});
		
		/*
		// remove cylces with duplicate elements
		var els = cycles.map(function(x){
			var z =  x.map(function(item){return +item.id});
			z.sort();
			return z.join(",");
		});
		
		for(var i=0; i<els.length-1; i++){
			for(var j=i+1; j<els.length; j++){
				if(els[i]==els[j]){
					els.splice(j,1);
					cycles.splice(j,1);
					j--;
				}
			}
		}*/
		
		var formatName = function(n){
			return "<span style='background-color: aliceblue; padding:5px; margin: 2px; border-radius: 5px; cursor: pointer;' onclick='highlight(findID("+n.id+"))'><nobr>" + n.value.getAttribute("name") + "</nobr></span>";
		};
		
		showData("Model Loops", [
				  {name: "List of Loops",
				    type: "html",
				    data: "<div style='padding:10px'><p>Insight Maker has identified "+cycles.length+" loop"+(cycles.length==1?'':'s')+" in the model diagram:</p>"+cycles.map(function(cycle){
						cycle.push(cycle[0]);
						var res = "<div style='line-height: 2.2em; margin:18px'>";
						for(var i=0; i<cycle.length; i++){
							var item = cycle[i];
							res += formatName(item);
							var color = "grey";
							if(i < cycle.length-1){
								var conn = findConnection(item, cycle[i+1]);
								if(conn){
									color = getLineColor(conn);
								}
								res += "<i class='fa fa-arrow-right' style='margin: 2px; color: "+color+"'></i>";
							}
							
						}
						res += "</div>"
						return res;
				    }).join("")+"</div>"
				   }
			]
		)
	}
	
	function findConnection(a, b){
		for(var j = 0; j < connectors.length; j++){
			var ends = getEnds(connectors[j]);
			if(ends[0] == a && ends[1] == b){
				return connectors[j];
			}
		}
	}
}


function getAdjList(){
	var connectors = findType(["Flow", "Transition" ,"Link"]);
	
	var nodes = [];
	var adjList = [];
	
	for(var i = 0; i < connectors.length; i++){
		var c = connectors[i];
		var ends = getEnds(orig(c));
		
		if(c.value.nodeName != "Link"){
			var cI = getIndex(orig(c));
			if(ends[0]){
				setAdjacent(cI, getIndex(orig(ends[0])));
				setAdjacent(getIndex(orig(ends[0])), cI);
			}
			if(ends[1]){
				setAdjacent(getIndex(orig(ends[1])), cI);
				//setAdjacent(cI, getIndex(orig(ends[1])));
			}
		}else{
			if(ends[0] && ends[1]){
				setAdjacent(getIndex(orig(ends[1])), getIndex(orig(ends[0])));
				if(isTrue(c.getAttribute("BiDirectional"))){
					setAdjacent(getIndex(orig(ends[0])), getIndex(orig(ends[1])));	
				}
			}
		}
		
	}
	
	function getIndex(node){
		if(nodes.indexOf(node) == -1){
			nodes.push(node);
			adjList.push([]);
		}
		return nodes.indexOf(node);
	}
	
	function setAdjacent(nI, oI){
		if(adjList[nI].indexOf(+oI) == -1){
			adjList[nI].push(+oI);
		}
	}
	
	adjList.map(function(x){
		x.sort(function(a,b){
			return a - b;
		});
	});
	
	return {nodes: nodes, adjList: adjList};
	
}
