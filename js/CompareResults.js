"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var compareResults = {
	win: null,
	resultsStore: new Ext.data.JsonStore({
		fields: [{
			name: 'pid',
			type: 'string'
		}, {
			name: 'pname',
			type: 'string'
		}],
		data: []
	}),
	primitiveStore: new Ext.data.JsonStore({
		fields: [{
			name: 'rid',
			type: 'string'
		}, {
			name: 'rname',
			type: 'string'
		}],
		data: []
	})
};

function doCompare(){


	var rstoreData = [];
	var availableResults = [];
	var availablePrimitives = [];
	Ext.WindowMgr.each(
	      function(win){
				var t = win.down("#pinTool");
				if(t){
					availableResults.push(win.analysisCount);
					rstoreData.push({
						rid: win.analysisCount,
						rname: win.getTitle()
					});
				}
			}
	  );
	
	
	var pstoreData = [];
	var prims = excludeType(primitives(), "Ghost");
	for (var i = 0; i < prims.length; i++) {
		if (isValued(prims[i]) && (!inAgent(prims[i]))) {
			availablePrimitives.push(prims[i].id);
			pstoreData.push({
				pid: prims[i].id,
				pname: prims[i].getAttribute("name")
			});
		}
	}
	pstoreData.sort(function(a, b) {
		if (a.pname < b.pname) {
			return -1;
		} else if (a.pname > b.pname) {
			return 1;
		} else {
			return 0;
		}
	});

	
	if(!compareResults.win){
		var p = new Ext.FormPanel({
			fieldDefaults: {
				labelWidth: 195,
				width: "100%"
			},
			autoScroll: true,
			frame: false,
			bodyStyle: 'padding: 10px',
			defaultType: 'textfield',
			items: [

				Ext.create('Ext.form.field.Tag', {
					fieldLabel: getText('Results to Compare'),
					itemId: 'selResults',
					displayField: 'rname',
					filterPickList: true,
					valueField: 'rid',
					queryMode: 'local',
					store: compareResults.resultsStore,
					emptyText: getText('Select results windows')
				}),
				
				Ext.create('Ext.form.field.Tag', {
					fieldLabel: getText('Primitives to Contrast'),
					itemId: 'selPrimitives',
					displayField: 'pname',
					filterPickList: true,
					valueField: 'pid',
					queryMode: 'local',
					store: compareResults.primitiveStore,
					emptyText: getText('Select primitives')
				})
			
			]
		});

		compareResults.win = new Ext.Window({
			title: getText('Compare Simulation Results'),
			layout: 'fit',
			closeAction: 'hide',
			border: false,
			modal: true,
			resizable: false,
			maximizable: false,
			shadow: true,
			buttonAlign: 'right',
			layoutConfig: {
				columns: 1
			},
			width: Math.min(Ext.getBody().getViewSize().width, 480),
			autoHeight: true,
			items: [p],
			buttons: [{
				scale: "large",
				glyph: 0xf05c,
				text: getText('Cancel'),
				handler: function() {
					compareResults.win.close();
				}
			}, {
				scale: "large",
				glyph: 0xf00c,
				text: getText('Compare'),
				handler: function() {
					var primitives = compareResults.win.down("#selPrimitives").getValue();
					if(primitives.length == 0){
						showNotification(getText("You must select at least one primitive to contrast."), "error", true);
						return;
					}
					var res = compareResults.win.down("#selResults").getValue().map(function(x){
						return +x;
					});
					if(res.length < 2){
						showNotification(getText("You must select at least two results windows to compare."), "error", true);
						return;
					}
					
					var wins = [];
					var headers = [];
					var results = [];
					Ext.WindowMgr.each(
				      function(win){
						  if(res.indexOf(win.analysisCount)> -1){
							  wins.push(win);
							  headers.push(win.getTitle());
							  results.push(win.results);
						  }
					  }
				    );
					
					for(var i=1; i<results.length; i++){
						if(results[i].Time.join(",") != results[0].Time.join(",")){
							showNotification(getText("Compared results windows must have the same simulation time settings."), "error", true);
							return;
						}
					}
					
					var tabs = [];
					var failed =false;
					
					primitives.forEach(function(id){
						var p = findID(id);
						
						var series = [];
						results.forEach(function(r){
							if(!r[p.id]){
								if(!failed){
										showNotification(getText("The primitive '"+getName(p)+"' does not appear in all the results."), "error", true);
								}
								failed = true;
								return;
							}
							series.push(r.value(p));
						});
						if(failed){
							return;
						}
						
						tabs.push({
							name: getName(p)+" Chart",
							type: "chart",
							xData: results[0].Time,
							xType: "numeric",
							xLabel: "Time",
							yLabel: getName(p),
							legend: "top",
							verticalGrid:true,
							horizontalGrid: true,
							xMin: Math.min.apply(null,results[0].Time),
							xMax: Math.max.apply(null,results[0].Time),
							data: series.map(function(x, i){
								return {
									data: x,
									type: "line",
									name: headers[i],
									hideMarkers: true
								}
							})
						});
						
						tabs.push({
							name: getName(p)+" Table",
							type: "table",
							data: series,
							header: headers
						});
					});
					if(failed){
						return;
					}
					
					showData("Simulation Results Comparison", tabs);
					
					compareResults.win.close();
					  
				}
			}]

		});
		
	}

	var ps = compareResults.win.down("#selPrimitives").getValue().slice();
	compareResults.win.down("#selPrimitives").setValue(null);
	var newPs = [];
	ps.forEach(function(i){
		if(availablePrimitives.indexOf(i) > -1){
			newPs.push(i);
		}
	});
	
	var rs = compareResults.win.down("#selResults").getValue().slice();
	compareResults.win.down("#selResults").setValue(null);
	var newRs = [];
	rs.forEach(function(i){
		if(availableResults.indexOf(i) > -1){
			newRs.push(i);
		}
	});
	

	compareResults.resultsStore.loadData(rstoreData);
	compareResults.primitiveStore.loadData(pstoreData);
	compareResults.win.down("#selResults").setValue(newRs);
	compareResults.win.down("#selPrimitives").setValue(newPs)
	
	compareResults.win.show();
}