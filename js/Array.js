"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


function showArrayWin() {
	
	function saveDimension(){
		var selected = dimensions.getSelectionModel().getLastSelected();
		var keys = [];
		for(var i=0; i < itemsStore.count(); i++){
			keys.push(itemsStore.getAt(i).get("text"));
		}
		selected.set("data", JSON.stringify({keys: keys, primitives: boxselect.getValue()}))
	}

	var dimensionsStore = new Ext.data.Store({
		fields: [{
			name: 'text',
			type: 'string'
		},
		{
			name: 'data',
			type: 'string'
		}]
	});
	
	if(getSetting().getAttribute("arrays")){
		dimensionsStore.loadData(JSON.parse(getSetting().getAttribute("arrays")));
	}

	var dimensionsEditor = new Ext.grid.plugin.CellEditing({
		clicksToEdit: 2
	});

	var dimensions = Ext.create('Ext.grid.Panel', {
		flex: 1,
		id: "dimensionsGrid",
		store: dimensionsStore,
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop'
			},
            headersDisabled: true,
            markDirty: false
		},
		plugins: [dimensionsEditor],
		columns: [{
			sortable: false,
            menuDisabled: true,
			text: getText("Dimensions"),
			dataIndex: 'text',
			flex: 1,
			editor: {
				allowBlank: false
			}
		}, {
            menuDisabled: true,
			xtype: "actioncolumn",
			width: 40,
			items: [{
				iconCls: "units-remove-icon",
				tooltip: getText("Delete"),
				handler: function(grid, rowIndex, columnIndex) {
					dimensionsStore.remove(dimensionsStore.getAt(rowIndex));
					config.getLayout().setActiveItem(0);
				}
			}]
		}],
		listeners: {
			select: {
				fn: function(t, record, index, eOpts) {
					var data = JSON.parse(record.get("data"));
					var keys = data.keys;
					var primitives = data.primitives;
					itemsStore.loadData(keys.map(function(x){
						return {text: x};
					}));
					boxselect.setValue(primitives);
					
					
					config.getLayout().setActiveItem(1);
				}
			},
			edit: {
				fn: function(editor, e) {
					e.record.commit();
				}
			}
		},
		bbar: ["->", {
			glyph: 0xf055,
			text: getText('Add Dimension'),
			scope: this,
			handler: function() {
				dimensionsEditor.completeEdit();
				dimensionsStore.add({
					text: getText("New Dimension"),
					data: '{"keys":[], "primitives":[]}'
				})
				var index = dimensionsStore.count() - 1;
				dimensions.getSelectionModel()
					.selectRange(index, index);
				dimensionsEditor.startEdit(index, index);
			}

		}]

	});
	
	
	var itemsStore = new Ext.data.Store({
		fields: [{
			name: 'text',
			type: 'string'
		}]
	});

	var itemsEditor = new Ext.grid.plugin.CellEditing({
		clicksToEdit: 1
	});

	var items = Ext.create('Ext.grid.Panel', {
		flex: 1,
		id: "itemsGrid",
		store: itemsStore,
		viewConfig: {
			plugins: {
				ptype: 'gridviewdragdrop'
			},
			headersDisabled: true,
            markDirty: false,
			listeners:
			{
				drop: function(){
					saveDimension();
				}
			}
		},
		plugins: [itemsEditor],
		columns: [{
			sortable: false,
			text: getText("Dimension Keys"),
			dataIndex: 'text',
			flex: 1,
			editor: {
				allowBlank: false
			},
            menuDisabled: true
		}, {
			xtype: "actioncolumn",
			width: 40,
            menuDisabled: true,
			items: [{
				iconCls: "units-remove-icon",
				tooltip: getText("Delete"),
				handler: function(grid, rowIndex, columnIndex) {
					itemsStore.remove(itemsStore.getAt(rowIndex));
					saveDimension();
				}
			}]
		}],
		listeners: {
			edit: {
				fn: function(editor, e) {
					e.record.commit();
					saveDimension();
				}
			}
			
		},
		bbar: ["->", {
			glyph: 0xf055,
			text: getText('Add Key'),
			scope: this,
			handler: function() {
				itemsEditor.completeEdit();
				itemsStore.add({
					text: getText("New Key")
				})
				var index = itemsStore.count() - 1;
				items.getSelectionModel()
					.selectRange(index, index);
				itemsEditor.startEdit(index, index);
				saveDimension();
			}

		}]

	});
	
	



	var storeData = [];
	var prims = findType(["Stock", "Flow", "State", "Transition", "Variable"]);
	for (var i = 0; i < prims.length; i++) {
		var n = getName(prims[i]);
		storeData.push({
			pid: getID(prims[i]),
			pname: isDefined(n) ? n : "--"
		});
	}

	//console.log(storeData)
	storeData.sort(function(a, b) {
		return a.pname.localeCompare(b.pname);
	});

	var primitiveConfigStore = new Ext.data.JsonStore({
		fields: [{
			name: 'pid',
			type: 'string'
		}, {
			name: 'pname',
			type: 'string'
		}],
		data: storeData
	});

	var boxselect = Ext.create('Ext.form.field.Tag', {
						hideLabel: true,
						filterPickList: true,
						name: 'dimensionPrimitives',
						id: 'dimensionsPrimitives',
						displayField: 'pname',
						valueField: 'pid',
						queryMode: 'local',
						store: primitiveConfigStore,
						emptyText: getText("Data"),
						listeners: {
							change: function() {
								saveDimension();
							}
						}
					});

	var config = Ext.create('Ext.container.Container',{
		flex: 1,
		layout: 'card',
	    items: [
	        {
				xtype: "form",
				padding: 8,
				bodyStyle : 'background:none',
				border: false
			},
	        {
				xtype: "form",
				padding: 8,
				bodyStyle : 'background:none',
				border: false,
				autoScroll: true,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [
					items,
					{
						xtype:"displayfield",
						value: getText("Apply dimension to")+":"
					},
					boxselect
				]
			}
		]
	});


	var p = {
		padding: 8,
		xtype: "container",
		frame: false,
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
		items: [dimensions, config]
	};

	var win = new Ext.Window({
		title: getText('Array Designer'),
		layout: 'fit',
		closeAction: 'destroy',
		border: false,
		modal: false,
		resizable: true,
		shadow: true,
		buttonAlign: 'right',
		width: 600,
		height: 420,
		items: [p],
		buttons: [{
			scale: "large",
			glyph: 0xf05c,
			text: getText('Cancel'),
			handler: function() {
				win.close();
			}
		}, {
			scale: "large",
			glyph: 0xf00c,
			text: getText('Apply'),
			handler: function() {
			    graph.getModel().beginUpdate();

				var data = [];
				for(var i=0; i<dimensionsStore.count(); i++){
					var item = dimensionsStore.getAt(i);
					data.push({
						text: item.get("text"),
						data: item.get("data")
					})
				}
			    var edit = new mxCellAttributeChange(getSetting(), "arrays", JSON.stringify(data));
				graph.getModel().execute(edit);
	
				graph.getModel().endUpdate();


				win.close();
			}
		}]

	});

	win.show();

}
