"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

function importModel() {

	var tab = Ext.create("Ext.tab.Panel", {
			xtype: "tabpanel",
			layout: "fit",
			activeTab: 0,
			plain: true,
			flex: 1,
			items: [{
				padding: 4,
				title: "Insight Maker",
				xtype: "container",
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'displayfield',height:40,
					fieldLabel: '',
					value: 'Enter an Insight Maker Insight specification. This specification should begin with "&lt;InsightMakerModel&gt;" and end with "&lt;/InsightMakerModel&gt;".'
				}, {
					flex:1,
					xtype: 'textareafield',
					hideLabel: true,
					name: 'impIM',
					id: 'impIM',
					selectOnFocus: true
				}]
			},{
				padding: 4,hidden:true,
				title: "Simgua",
				xtype: "container",
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					xtype: 'displayfield',height:40,
					fieldLabel: '',
					value: 'Enter a Simgua export file created using <a href="#">this macro</a>.'
				}, {
					flex:1,
					xtype: 'textareafield',
					hideLabel: true,
					name: 'impSimgua',
					id: 'impSimgua',
					selectOnFocus: true
				}]
			},{
				padding: 4,hidden:true,
				title: "STELLA",
				xtype: "container",
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{height:40,
					xtype: 'displayfield',
					fieldLabel: '',
					value: 'Copy and paste the STELLA equation list. Equations preferences should be set to "Order by execution".'
				}, {
					flex:1,
					xtype: 'textareafield',
					hideLabel: true,
					name: 'impSTELLA',
					id: 'impSTELLA',
					selectOnFocus: true
				}]
			}]
		});
		
	var p = {
		padding: 8,
		xtype: "container",
		frame: false,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
			xtype: 'displayfield',
			fieldLabel: '',
			value: 'Select the type of import. <b>WARNING:</b> your current model will be cleared on import.'
		}, tab]
	};

	var win = new Ext.Window({
		title: 'Import Insight Equations',
		layout: 'fit',
		closeAction: 'destroy',
		border: false,
		modal: true,
		resizable: false,
		shadow: true,
		buttonAlign: 'right',
		width: 480,
		height: 420,
		items: [p],
		buttons: [{
			scale: "large",
			iconCls: "cancel-icon",
			text: 'Cancel',
			handler: function() {
				win.close();
			}
		}, {
			scale: "large",
			iconCls: "apply-icon",
			text: 'Import Insight Equations',
			handler: function() {
				
				if(tab.getActiveTab().title == "Insight Maker"){
					if(Ext.getCmp("impIM").getValue().trim()==""){
						alert("Error: No Insight Equations were entered.")
						return;
					}
					
					try{
						importMXGraph(Ext.getCmp("impIM").getValue());
					}catch(err){
						if(isLocal()){
							console.log(err);
						}
						mxUtils.alert("Import could not be completed as an error was encountered.");
						return;
					}
					
					
					
				}else if(tab.getActiveTab().title == "Simgua"){
					
					
					try{
						importSimgua(Ext.getCmp("impSimgua").getValue());
					}catch(err){
						if(isLocal()){
							console.log(err);
						}
						mxUtils.alert("Import could not be completed as an error was encountered.");
						return;
					}
					
					
				}else if(tab.getActiveTab().title == "STELLA"){
					
					
					try{
						importSTELLA(Ext.getCmp("impSTELLA").getValue());
					}catch(err){
						if(isLocal()){
							console.log(err);
						}
						mxUtils.alert("Import could not be completed as an error was encountered.");
						return;
					}
					
					
				}
				clearPrimitiveCache();
				setAllConnectable();
				win.close();
			}
		}]

	});

	win.show();

}



function importMXGraph(txt){
	graph_source_data  = txt.replace(/InsightMakerModel/g,"mxGraphModel");
	var doc = mxUtils.parseXml(graph_source_data);
	var dec = new mxCodec(doc);
	dec.decode(doc.documentElement, graph.getModel());
	clearPrimitiveCache();
	setAllConnectable();
}

function importSimgua(txt){

	clearModel();
	

	graph.getModel().beginUpdate();
	
	var tempStock=createPrimitive("temp stock xyzz", "Stock", [200,200],[100,100])
	
	//console.log("0");
	var rows=txt.split("\n");
	
	//console.log(rows);
	
	for(var i=0; i<rows.length; i++){
		var items = rows[i].split(" --- ");
		var type = items[0];
		if(type=="STOCK"){
			var s = createPrimitive(items[1], "Stock", [500*Math.random(),500*Math.random()],[100, 40]);
			setValue(s, items[3]);
			setNonNegative(s, items[2]=="true");
		}else if(type=="VARIABLE"){
			var s = createPrimitive(items[1], "Variable", [500*Math.random(),500*Math.random()],[120, 50]);
			setValue(s, items[2]);
		}else if(type=="CONVERTER"){
			var s = createPrimitive(items[1], "Converter", [500*Math.random(),500*Math.random()],[120, 50]);
			setData(s, items[4]);
			setInterpolation(s, items[2]==1?"Linear":"Discrete");
		}else if(type=="SETTING"){
			setTimeStart(items[1]);
			setTimeLength(items[2]);
			setTimeStep(items[3]);
		}
	}

	//console.log("A");
	
	for(var i=0; i<rows.length; i++){
		var items = rows[i].split(" --- ");
		var type = items[0];
		if(type=="FLOW"){
			var s = createConnector(items[1], "Flow", simguaPrim(findName(items[2])), simguaPrim(findName(items[3])));
			setValue(s, items[5]);
			setNonNegative(s, items[4]=="true");
		}
	}

	//console.log("B");
	
	for(var i=0; i<rows.length; i++){
		var items = rows[i].split(" --- ");
		
		var type = items[0];
		if(type=="LINK"){
			var s = createConnector(items[1], "Link", findName(items[2]), findName(items[3]));
		}else if(type=="CONVERTER"){
			setConverterInput(findName(items[1]), findName(items[3]));
		}
	}

	//console.log("C");

	
	
	layoutModel("organic");
	

	graph.getModel().endUpdate();
	
	function simguaPrim(item){
		if(item==null){
			return tempStock;
		}else{
			return item;
		}
	}
	
}

function importSTELLA(txt){
	var rows = txt.split(/\r?\n/g);
	//console.log(rows);
	var primitives = [];
	var config = {};
	
	var mode = undefined;
	
	for(var i = 0; i < rows.length; i++){
		var row = rows[i];
		var items = row.split(" ");
		//console.log(items);
		
		if(items[0] == "{"){
			if(items[1]=="INITIALIZATION"){
				mode = "init";
			}else if(items[1]=="RUNTIME"){
				mode = "run";
			}else if(items[1]=="TIME"){
				mode = "config";
			}
		}else{
		if(mode == "init"){
			if(items[0] == ":"){
				if(items[1] == "s" || items[1] == "S"){
					var nonNegative = true;
					if(items[1]=="S"){
						nonNegative = false;
					}
					primitives.push({type:"stock", name: items[2], equation: items[4], nonNegative: nonNegative});
				}else if(items[1] == "c"){
					primitives.push({type:"variable", name: items[2], equation: items.slice(4).join(" ")});
				}else if(items[1] == "f"){
					primitives.push({type:"flow", name: items[2], equation: items.slice(4).join(" ")});
				}
			}else if(row[0] == "("){
				var pred = primitives[primitives.length-1];
				primitives.push({type:"converter", name: pred.name, data: row, equation: pred.name+"_Input"});
				pred.name = pred.name+"_Input";
			}else if(items[0] == "DOCUMENT:"){
				//console.log("adding note");
				var pred = primitives[primitives.length-1];
				pred.note = items.slice(1).join(" ");
				//console.log(pred.note);
			}
		}else if(mode =="run"){
			if(items[0] == ":"){
				if(items[1] == "s" || items[1] == "S"){
					
					//console.log(items);
					var data = items.slice(8,items.length-2);
					data[0] = data[0].substr(1);
					data[data.length-1] = data[data.length-1].substr(0, data[data.length-1].length-1)
					
					var dir = "in";
					for(var j=0; j<data.length; j++){
						if(data[j]=="-"){
							dir = "out";
						}else if(data[j]=="+"){
							dir = "in";
						}else{
							var name = data[j];
							//console.log(name);
							for(var k=0; k< primitives.length; k++){
								if(primitives[k].type=="flow" && primitives[k].name==name){
									//console.log(primitives[k]);
									if(dir == "in"){
										//console.log("adding omega");
										primitives[k].omega = items[2].split("(")[0];
									}else{
										//console.log("adding alpha");
										primitives[k].alpha = items[2].split("(")[0];
									}
								}
							}
						}
					}
				}
			}
		}else if(mode == "config"){
			var items = row.split("=");
			if(items[0]=="STARTTIME"){
				config.start = items[1];
			}else if(items[0]=="STOPTIME"){
				config.end = items[1];
			}else if(items[0]=="DT"){
				config.step = items[1];
			}
		}
		}
	}
	
	//console.log(primitives);
	//console.log(config);
	clearModel();
	

	//graph.getModel().beginUpdate();
	
	setTimeStart(config.start);
	setTimeLength(config.end-config.start);
	setTimeStep(config.step);
	
	var made = primitives.map(function(){return null});
	for(var i=0; i < primitives.length; i++){
		var p = primitives[i];
		//console.log(p)
		if(p.type=="stock"){
			var s = createPrimitive(fixStellaName(p.name), "Stock", [100,100], [140, 40]);
			setValue(s, fixStellaEquation(p.equation));
			setNonNegative(s, p.nonNegative)
			made[i] = s;
		}else if(p.type=="variable"){
			var s = createPrimitive(fixStellaName(p.name), "Variable", [100,100], [140, 40]);
			setValue(s, fixStellaEquation(p.equation))
			made[i] = s;
		}else if(p.type=="converter"){
			var s = createPrimitive(fixStellaName(p.name), "Converter", [100,100], [140, 40]);
			setData(s, convertStellaConverter(p.data))
			made[i] = s;
		}
	}
	
	//console.log("--")
	//Create flows
	for(var i=0; i < primitives.length; i++){
		var p = primitives[i];

		//console.log(p)
		if(p.type=="flow"){
			//console.log("making flow")
			var name = fixStellaName(p.name);
			//console.log(name);
			var alpha = made[getStellaPrimitive(primitives, p.alpha)];
			//console.log(alpha);
			var omega = made[getStellaPrimitive(primitives, p.omega)] ;
			//console.log(omega);
			var s = createConnector(name, "Flow", alpha, omega);
			setValue(s, fixStellaEquation(p.equation));
			made[i] = s;
		}
	}
	
	//console.log("++")
	//Create links and do converter sources
	for(var i=0; i < primitives.length; i++){
		var p = primitives[i];
		//console.log(p)
		if(p.note){
			//console.log(p.note);
			setNote(made[i], p.note);
		}
		if(p.equation){
			//console.log(p.name);
			//console.log(p.type);
			if(p.type=="converter"){
				var item = made[getStellaPrimitive(primitives, p.equation)]
				var l = createConnector("Link", "Link", item, made[i]);
				setConverterInput(made[i], item);
			}else{
				var r = (new RegExp("([A-Za-z][A-Za-z0-9\\\\_]+)($|[^(A-Za-z])","g"));
				var match = r.exec(p.equation.replace(/ /g,""));
				//console.log(match);
				while(match != null){
					//console.log(match);
					//console.log("making link")
					var l = createConnector("Link", "Link", made[getStellaPrimitive(primitives, match[1])], made[i] );

					var match = r.exec(p.equation.replace(/ /g,""));
				}
			}
		}
	}
	
	setMacros("#STELLA Compatibility Functions\nGRAPH(x) <- x\nINIT(x) <- Delay(x, (timeLength/timeStep)*10)")
	
	layoutModel("organic");
	

	//graph.getModel().endUpdate();
}

function getStellaPrimitive(primitives, name){
	for(var i=0; i< primitives.length; i++){
		if(primitives[i].name==name){
			return i;
		}
	}
}

function convertStellaConverter(txt){
	var items = txt.split("), (");
	items[0] = items[0].substr(1);
	items[items.length-1] = items[items.length-1].substr(0, items[items.length-1].length-1);
	for(var i=0; i<items.length; i++){
		items[i] = items[i].replace(", ", ",");
	}
	return items.join(";");
}

function fixStellaName(name){
	return name.replace(/[\/\\\*\+\-_]/g, " ")
}

function fixStellaEquation(equation){
	var result = equation.replace(/ /g,"").replace(/([A-Za-z][A-Za-z0-9\\_]+)($|\b[^(A-Za-z])/g, "[$1]$2");
	result = result.replace(/_/g, " ");
	result = result.replace(/\\/g, " ");
	//result = result.replace("INIT", "");
	return result;
}


function cleanMXGraphSnippet(xml){
	var padding = ""+Math.floor(Math.random()*10000);
	
	xml = xml.replace(/parent=\"1\"/g, "XXXROOT PARENTXXX");
	

	xml = xml.replace(/id=\"(\d+)\"/g, "id=\""+padding+"$1\"");
	xml = xml.replace(/source=\"(\d+)\"/g, "source=\""+padding+"$1\"");
	xml = xml.replace(/Source=\"(\d+)\"/g, "Source=\""+padding+"$1\"");
	xml = xml.replace(/target=\"(\d+)\"/g, "target=\""+padding+"$1\"");
	xml = xml.replace(/parent=\"(\d+)\"/g, "parent=\""+padding+"$1\"");
	xml = xml.replace(/Agent=\"(\d+)\"/g, "Agent=\""+padding+"$1\"");
	xml = xml.replace(/Primitives=\"([\d\,]+)\"/g, "Primitives=\""+padding+"$1\"");//will be an issue when there are multiple primtives
	xml = xml.replace(/Primitives2=\"([\d\,]+)\"/g, "Primitives2=\""+padding+"$1\"");//will be an issue when there are multiple primitives
	
	xml = xml.replace(/XXXROOT PARENTXXX/g, "parent=\"1\"");
	
	return xml;
}

function cleanMXGraph(){
	var xml = prompt("Enter mxGraphXML:");
	console.log(cleanMXGraphSnippet(xml));
}
