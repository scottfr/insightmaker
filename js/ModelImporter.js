"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/



function showInsertModelWindow(pt) {
	Ext.Msg.prompt('Insert Insight Maker Model', 'Enter the URL for the Insight Maker model you wish to insert (e.g. <i>' + base_path + '/insight/1234</i>). This model will be inserted as a component into your current model.', function(btn, url) {
		if (btn == 'ok') {
			var progress = Ext.MessageBox.wait(getText("Inserting Model..."), undefined, {
				icon: 'run-icon',
				width: 300,
				closable: false,
				modal: true,
				progress: true,
				progressText: ' '
			});
			$.ajax({
				url: url,
				dataType: "html",
				success: function(txt) {
					var matches = txt.match(/var graph_source_data = (".*?");\n/);

					if ((!matches) || matches[1].trim() == "") {
						mxUtils.alert("Model could not be inserted. Please ensure the model URL is correct.");
						progress.close();
					} else {
						var data = JSON.parse(matches[1]);

						var title = JSON.parse(txt.match(/var graph_title = (".*?");\n/)[1]);
						var description = JSON.parse(txt.match(/var graph_description = (".*?");\n/)[1]);

						var doc = mxUtils.parseXml(data);
						var dec = new mxCodec(doc);

						var model = dec.decode(doc.documentElement);

						var cells = model.cells;
						

						graph.getModel().beginUpdate();

						var folder = createPrimitive(title, "Folder", [pt.x, pt.y], [100, 100]);

						cells = cells[1].children;

						cells = excludeType(cells, "Setting");
						cells = excludeType(cells, "Display");

						var getEdgeValidationError = graph.getEdgeValidationError;
						graph.getEdgeValidationError = function(){
							return mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
						};
						graph.importCells(cells, 0, 0, folder);
						graph.getEdgeValidationError = getEdgeValidationError;


						
						setImage(folder, "Plugin");
						setNote(folder, description);

						var geo = folder.geometry;
						geo.alternateBounds = new mxRectangle(0, 0, 128, 128);
						graph.getModel().setGeometry(folder, geo);

						collapseFolder(folder);
						folder.setAttribute("LabelPosition", "Bottom");
						setLabelPosition(folder);

						//Converter and agent population rewire

						graph.getModel().endUpdate();


						clearPrimitiveCache();
						setAllConnectable();

						progress.close();
					}
				},
				error: function() {
					mxUtils.alert("Model could not be inserted. Please ensure the morel URL is correct.");
					progress.close();
				}
			})
		}
	})
}



function importMXGraph(txt) {
	graph_source_data = txt.replace(/InsightMakerModel/g, "mxGraphModel");
	var doc = mxUtils.parseXml(graph_source_data);
	var dec = new mxCodec(doc);
	dec.decode(doc.documentElement, graph.getModel());
	clearPrimitiveCache();
	setAllConnectable();
}

function importSimgua(txt) {

	clearModel();

	graph.getModel().beginUpdate();

	var tempStock = createPrimitive("temp stock xyzz", "Stock", [200, 200], [100, 100])

	//console.log("0");
	var rows = txt.split("\n");

	//console.log(rows);

	for (var i = 0; i < rows.length; i++) {
		var items = rows[i].split(" --- ");
		var type = items[0];
		if (type == "STOCK") {
			var s = createPrimitive(items[1], "Stock", [500 * Math.random(), 500 * Math.random()], [100, 40]);
			setValue(s, items[3]);
			setNonNegative(s, items[2] == "true");
		} else if (type == "VARIABLE") {
			var s = createPrimitive(items[1], "Variable", [500 * Math.random(), 500 * Math.random()], [120, 50]);
			setValue(s, items[2]);
		} else if (type == "CONVERTER") {
			var s = createPrimitive(items[1], "Converter", [500 * Math.random(), 500 * Math.random()], [120, 50]);
			setData(s, items[4]);
			setInterpolation(s, items[2] == 1 ? "Linear" : "Discrete");
		} else if (type == "SETTING") {
			setTimeStart(items[1]);
			setTimeLength(items[2]);
			setTimeStep(items[3]);
		}
	}

	//console.log("A");

	for (var i = 0; i < rows.length; i++) {
		var items = rows[i].split(" --- ");
		var type = items[0];
		if (type == "FLOW") {
			var s = createConnector(items[1], "Flow", simguaPrim(findName(items[2])), simguaPrim(findName(items[3])));
			setValue(s, items[5]);
			setNonNegative(s, items[4] == "true");
		}
	}

	//console.log("B");

	for (var i = 0; i < rows.length; i++) {
		var items = rows[i].split(" --- ");

		var type = items[0];
		if (type == "LINK") {
			var s = createConnector(items[1], "Link", findName(items[2]), findName(items[3]));
		} else if (type == "CONVERTER") {
			setConverterInput(findName(items[1]), findName(items[3]));
		}
	}

	//console.log("C");



	layoutModel("organic");


	graph.getModel().endUpdate();

	function simguaPrim(item) {
		if (item == null) {
			return tempStock;
		} else {
			return item;
		}
	}

}

function cleanMXGraphSnippet(xml) {
	var padding = "" + Math.floor(Math.random() * 10000);

	xml = xml.replace(/parent=\"1\"/g, "XXXROOT PARENTXXX");


	xml = xml.replace(/id=\"(\d+)\"/g, "id=\"" + padding + "$1\"");
	xml = xml.replace(/source=\"(\d+)\"/g, "source=\"" + padding + "$1\"");
	xml = xml.replace(/Source=\"(\d+)\"/g, "Source=\"" + padding + "$1\"");
	xml = xml.replace(/target=\"(\d+)\"/g, "target=\"" + padding + "$1\"");
	xml = xml.replace(/parent=\"(\d+)\"/g, "parent=\"" + padding + "$1\"");
	xml = xml.replace(/Agent=\"(\d+)\"/g, "Agent=\"" + padding + "$1\"");
	xml = xml.replace(/Primitives=\"([\d\,]+)\"/g, "Primitives=\"" + padding + "$1\""); //will be an issue when there are multiple primtives
	xml = xml.replace(/Primitives2=\"([\d\,]+)\"/g, "Primitives2=\"" + padding + "$1\""); //will be an issue when there are multiple primitives

	xml = xml.replace(/XXXROOT PARENTXXX/g, "parent=\"1\"");

	return xml;
}

function cleanMXGraph() {
	var xml = prompt("Enter mxGraphXML:");
	console.log(cleanMXGraphSnippet(xml));
}

function importInsightMaker() {
	openFile({
		read: "text",
		multiple: false,
		onCompleted: function(result) {
			importMXGraph(result.contents);
		}
	});
}

function importXMILE() {
	openFile({
		read: "text",
		multiple: true,
		onCompleted: function(result) {
			
			 var importProgress = Ext.MessageBox.show({msg:getText("Importing XMILE model...<br/><br/>This may take a few minutes."),icon:'run-icon',width:300, closable:false, modal:true});

			function xStr(str) {
				if (!str) {
					return str;
				}
				return str.replace(/_/g, " ").replace(/\\n/g, " ");
			}

			function makeEq(a) {
				if (!a.array) {
					return xEq(a.eqn);
				} else {
					var res = "{\n";
					res += a.array.map(function(item) {
						return "\t\"" + xStr(item._subscript) + "\": " + xEq(item.eqn);
					}).join(",\n");
					res += "\n}";
					return res;
				}
			}

			function xEq(eq) {
				if (!eq) {
					return eq;
				}
				eq = eq.replace(/\n/g, " ");
				eq = eq.replace(/\[(.*?)\]/g, '{"$1"}');
				eq = eq.replace(/([a-zA-z][^ ()+*/+\-,.\[\]{}\>\<\=\!\|]+) *([+*/\-\),.\[\]{}\>\<\=\!\|\&]|$)/g,
					function(match, a, b) {
						return "[" + xStr(a) + "]" + b;
					});
				eq = eq.replace(/\{\"\[/g, "{\"").replace(/\"\]\}/g, "\"\}");
				eq = eq.replace(/[a-zA-Z]+\./g, "");
				eq = eq.replace(/^(if\s+.*\s+then)\s+(.*)\s+else\s+(.*)\s*$/ig, "$1\n  $2\nelse\n  $3\nend if");
				return eq;
			}

			function arrify(item) {
				if (!item) {
					return [];
				}
				if (item.forEach) {
					return item;
				} else {
					return [item];
				}
			}

			var primitives = {};

			function getPrimitive(item, del) {
				if (item.alias) {
					item = item.alias._uid;
				}
				var obj = primitives[xStr(item)];
				if (del) {
					delete primitives[xStr(item)];
				}
				return obj;
			}
			var alphas = {};

			function findAlpha(name) {
				if (alphas[name]) {
					return alphas[name];
				}
				return null;
			}
			var omegas = {};

			function findOmega(name) {
				if (omegas[name]) {
					return omegas[name];
				}
				return null;
			}

			setTimeout(function(){
				
				
				try{
					var x2js = new X2JS();
					var n;
					try{
					
						var res = result.map(function(x) {
							n = x.name;
							var json = x2js.xml_str2json(x.contents);
							if(! json.xmile){
								throw "Invalid XMILE";
							}
							return json.xmile;
						});
					}catch(err){
						showNotification("Import was unsuccessful. '"+n+"' is not a valid XMILE model.")
						importProgress.close();
						return;
					}
			
					if(isLocal()){
						console.log("Import Objects:");
						console.log(res);
					}

					setTimeStart(res[0].sim_specs.start);
					setTimeStep(res[0].sim_specs.dt);
					setTimeLength(res[0].sim_specs.stop - res[0].sim_specs.start);

					var macros = "int(x) <- floor(x)";

					var dimensions = {};


					var scale = 1.1;
					res.forEach(function(x) {

						primitives = {};
						alphas = {};
						omegas = {};

						if (x.dimensions && x.dimensions.dim) {
							var addDim = function(d) {
								dimensions[d._name] = d;
							}

							arrify(x.dimensions.dim).forEach(addDim);

						}

						x.model.aux = arrify(x.model.aux);
						x.model.flow = arrify(x.model.flow);
						x.model.stock = arrify(x.model.stock);

						arrify(x.model.array).forEach(function(a) {
							if (a.stock) {
								x.model.stock.push(a);
								a.array = a.stock;
							}
							if (a.aux) {
								x.model.aux.push(a);
								a.array = a.aux;
							}
							if (a.flow) {
								x.model.flow.push(a);
								a.array = a.flow;
							}
						});
						
				


						arrify(x.model.aux).forEach(function(a) {
							var variable = createPrimitive(xStr(a._name), "Variable", [a.display._x * scale, a.display._y * scale], [100, 50]);
							primitives[xStr(a._name)] = variable;
							setValue(variable, makeEq(a));

							if (a.doc) {
								setNote(variable, a.doc);
							}
						});

				
						arrify(x.model.stock).forEach(function(a) {
							var stock = createPrimitive(xStr(a._name), "Stock", [a.display._x * scale, a.display._y * scale], [100, 40]);
							setValue(stock, makeEq(a));
							setNonNegative(stock, !! a.non_negative);


							primitives[xStr(a._name)] = stock;

							if (a.doc) {
								setNote(stock, a.doc);
							}

							if (a.inflow) {
								arrify(a.inflow).forEach(function(x) {
									omegas[x] = stock;
								});
							}

							if (a.outflow) {
								arrify(a.outflow).forEach(function(x) {
									alphas[x] = stock;
								})
							}
						});
				
						
						arrify(x.model.flow).forEach(function(a) {
							var flow = createConnector(xStr(a._name), "Flow", findAlpha(a._name), findOmega(a._name));

							primitives[xStr(a._name)] = flow;

							if (a.doc) {
								setNote(flow, a.doc);
							}

							setNonNegative(flow, !! a.non_negative);

							setValue(flow, makeEq(a));

						});


						if (x.model.display) {
						
							arrify(x.model.display.text_box).forEach(function(a){
							
								if(a.__text){
									var text = createPrimitive(a.__text, "Text", [a._x * scale, a._y * scale], [a._width * scale, a._height * scale]);
								
									graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE, [text]);
								
									if(a["_font-size"]){
										graph.setCellStyles(mxConstants.STYLE_FONTSIZE, a["_font-size"], [text]);
									}
									if(a["_font-family"]){
										graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, a["_font-family"], [text]);
									}
								

									primitives[a._uid] = text;
								}
							});
						
							arrify(x.model.display.alias).forEach(function(a) {

								var orig = primitives[xStr(a.of)];

								if (orig.value.nodeName == "Flow") {
									primitives[a._uid] = orig;
									return;
								}
								var item = makeGhost(orig);
								setPosition(item, [a._x * scale, a._y * scale]);
								primitives[a._uid] = item;


							});

							arrify(x.model.display.connector).forEach(function(a) {
								var link = createConnector("Link", "Link", getPrimitive(a.from), getPrimitive(a.to));
							});
							
							
						}
							
							
						
						if(x.model["interface"]){
							
							var findItems = function(a){
								a.sort(function(v1, v2){
									return v1._index - v2._index;
								});
								
								a = a.filter(function(item){
									return (! item._type) || (item._type=="variable");
								});
								
								var prims =  a.map(function(item){
									
									var prim = getPrimitive(item.entity._name);
									
									if(prim.indexOf){
										return prim[0]; // XXX FIXME; is this really necessary? maybe just add all when there is a match
									}else{
										return prim;
									}
								});
								
								return prims.join(",");
							};
							
							arrify(x.model["interface"].stacked_container).forEach(function(a){
								
								arrify(a.table).forEach(function(table){
									
									var d  = graph.insertVertex(graph.getDefaultParent(), null, primitiveBank.display.cloneNode(true), 10, 10, 64, 64, "display");
									d.visible = false;
								
									graph.getModel().execute(new mxCellAttributeChange(d, "name", table._title || "Table"));
									graph.getModel().execute(new mxCellAttributeChange(d, "AutoAddPrimitives", "false"));
									
									graph.getModel().execute(new mxCellAttributeChange(d, "Type", "Tabular"));
									
									graph.getModel().execute(new mxCellAttributeChange(d, "Primitives", findItems(arrify(table.item))));
									
								});
								
								arrify(a.graph).forEach(function(chart){
									if(chart._type == "time_series" || chart._type == "scatterplot"){
										
										var d = graph.insertVertex(graph.getDefaultParent(), null, primitiveBank.display.cloneNode(true), 10, 10, 64, 64, "display");
										d.visible = false;
										
										graph.getModel().execute(new mxCellAttributeChange(d, "name", chart._title || "Chart"));
										graph.getModel().execute(new mxCellAttributeChange(d, "AutoAddPrimitives", "false"));
											
										if(chart._type == "time_series"){
											graph.getModel().execute(new mxCellAttributeChange(d, "Type", "Time Series"));
											graph.getModel().execute(new mxCellAttributeChange(d, "xAxis", "Time (%u)"));
										}
										
										if(chart._type == "scatterplot"){
											graph.getModel().execute(new mxCellAttributeChange(d, "Type", "Scatterplot"));
											graph.getModel().execute(new mxCellAttributeChange(d, "xAxis", "%o"));
										}
										
										
										graph.getModel().execute(new mxCellAttributeChange(d, "yAxis", "%o"));
										
										graph.getModel().execute(new mxCellAttributeChange(d, "Primitives", findItems(arrify(chart.plot))));
									}
								});
							});
						}
						
						if (x.model.group) {
							arrify(x.model.group).forEach(function(a) {
								var toAdd = arrify(a.entity).map(function(entity) {
									return getPrimitive(entity._name, true);
								}).concat(
									arrify(a.display.item).map(function(item) {
										var obj = primitives[item._uid];
										delete primitives[item._uid];
										return obj;
									})
								).filter(function(x) {
									return x
								});

								var group = graph.groupCells(null, 30, toAdd);
								setName(group, xStr(a._name));
								group.setConnectable(true);
								graph.orderCells(true);
								primitives[a._name] = group;
							})
						}
						
							
						

						var group = graph.groupCells(null, 50, Object.keys(primitives).map(function(k) {
							return primitives[k]
						}));
						setName(group, xStr(x.header.name));
						group.setConnectable(true);
						graph.orderCells(true);
					});

					for (var dimension in dimensions) {
						dimension = dimensions[dimension];
						macros += "\n\n " + dimension._name + " <- ";
						if (dimension._size) {
							macros += "1:" + dimension._size;
						} else {
							macros += "{" + dimension.elem.map(function(e) {
								return '\"' + xStr(e._name) + '\"'
							}).join(", ") + "}";
						}

					}

					setMacros((getMacros() || "") + "\n\n" + macros);
			
				
					showNotification("XMILE import completed successfully. Some equations may require manual adjustment in order to work with Insight Maker.", "notice");
				}catch(err){
					
					showNotification("XMILE model could not be imported. Please ensure you have selected valid XMILE files.");
					
					if(isLocal()){
						console.log(err);
						throw(err);
					}
				}finally {
					importProgress.close();	
				}
			}, 15);

		}
	});

	clearPrimitiveCache();
	setAllConnectable();
}
