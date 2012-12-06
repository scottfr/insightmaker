"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


Ext.form.customFields['converter'] = Ext.extend(Ext.form.customFields['converter'], {


    onTriggerClick: function()
    {
        this.suspendEvents(false);
        this.editorWindow = new Ext.ConverterWindow({
            parent: this,
            oldKeys: this.getValue(),
            interpolation: graph.getSelectionCell().getAttribute("Interpolation")
        });
        this.editorWindow.show();
    },

    listeners: {
        'keydown': function(field)
        {
            field.setEditable(false);
        },
        'beforerender': function()
        {
            if (this.regex != undefined) {
                this.validator = function(value)
                {
                    return this.regex.test(value);
                };
            }

        }
    }
});



Ext.ConverterWindow = function(args)
 {
    var obj = this;

    obj.args = args;

    var discreteStore = null;
    function makeDiscrete() {
		if(! isUndefined(chart)){
		//console.log(chart.items.items[0].axes.items[0]);
		//console.log(getXRange());
			chart.axes.items[1].minimum = getXRange()[0];
			chart.axes.items[1].maximum = getXRange()[1];
		}
	
        var oldKeys = "";
        for (var i = 0; i < store.getCount(); i++)
        {
            if (i > 0) {
                oldKeys = oldKeys + ";";
            }
            oldKeys = oldKeys + store.getAt(i).data.xVal + "," + store.getAt(i).data.yVal;
        }
        var data = [];
        var items = oldKeys.split(";");
        var oldXY = [];
        for (var i = 0; i < items.length; i++) {
            var xy = items[i].split(",")
            if (i > 0) {
                data.push({
                    xVal: parseFloat(xy[0]),
                    yVal: parseFloat(oldXY[1])
                });
            }

            data.push({
                xVal: parseFloat(xy[0]),
                yVal: parseFloat(xy[1])
            });
            oldXY = xy;
        }

        if (discreteStore == null) {
            discreteStore = new Ext.data.Store({
                fields: dataFields,
                data: data
            });
        } else {
            discreteStore.removeAll();
            discreteStore.loadData(data);
        }
    }


    var data = [];
    var items = obj.args.oldKeys.split(";");
    for (var i = 0; i < items.length; i++) {
        var xy = items[i].split(",")
        data.push({
            xVal: parseFloat(xy[0]),
            yVal: parseFloat(xy[1])
        });
    }

    var dataFields = [{
        name: 'xVal',
        type: 'float'
    },
    {
        name: 'yVal',
        type: 'float'
    }];
    var store = new Ext.data.Store({
        fields: dataFields,
        data: data,
        sorters: ['xVal']
    });

    var editor = new Ext.grid.plugin.CellEditing({
		clicksToEdit: 1
    });

    var gridPan = new Ext.grid.GridPanel({
        store: store,
        width: 600,
        region: 'center',
        margins: '0 5 5 5',
        plugins: [editor],
        viewConfig: {
            headersDisabled: true,
            markDirty: false
        },
        tbar: [{
            iconCls: 'units-add-icon',
            text: 'Add Point',
            handler: function() {
                var e = {
                    xVal: 0,
                    yVal: 0
                };
                editor.completeEdit();
                var index = 0;
                store.insert(index, e);
                gridPan.getView().refresh();
                gridPan.getSelectionModel().selectRange(index, index);
                editor.startEdit(index, index);
            }
        },
        {
            id: "converterRemoveBut",
            iconCls: 'units-remove-icon',
            text: 'Remove Point',
            disabled: true,
            handler: function() {
                editor.completeEdit();
                var s = gridPan.getSelectionModel().getSelection();
                for (var i = 0, r; r = s[i]; i++) {
                    store.remove(r);
                }
            }
        }],

        columns: [
        new Ext.grid.RowNumberer(),
        {
            id: 'xVal',
            header: 'Input Value',
            dataIndex: 'xVal',
            flex: 1,
            sortable: false,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                decimalPrecision: 10,
				selectOnFocus:true
            }
        },
        {
            header: 'Output Value',
            dataIndex: 'yVal',
            flex: 1,
            sortable: false,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                decimalPrecision: 10,
				selectOnFocus:true
            }
        }
        ]
    });

    makeDiscrete();
    var chartStore;
    if (obj.args.interpolation == "Linear") {
        chartStore = store;
    } else {
        chartStore = discreteStore;
    }

    var sourceName = "";

	var cell;
	if(obj.args.parent != ""){
		cell = graph.getSelectionCell();
	}else{
		cell = obj.args.cell;
	}
    if (cell.getAttribute("Source") == "Time") {
        sourceName = "Time";
    } else {
        sourceName = findID(cell.getAttribute("Source")).getAttribute("name");
    }

    var chart = new Ext.chart.Chart({
            xtype: 'chart',
            store: chartStore,
            animate: false,
            shadow: false,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ["yVal"],
                title: "Output",
                grid: true,
				labelTitle: {
					font: '14px Verdana'
				}
            },
            {
                type: 'Numeric',
                position: 'bottom',
                fields: ["xVal"],
                title: "Input (" + clean(sourceName) + ")",
                grid: true,maximum: getXRange()[1],/*minimum: getXRange()[0],*/
				labelTitle: {
					font: '14px Verdana'
				}
            }],

            series: [{
                type: 'line',
                axis: 'left',
                showMarkers: true,
                highlight: false,
                smooth: false,
                style: {
                    'stroke-width': 3
                },
                xField: 'xVal',
                yField: "yVal",
                tips: {
                    trackMouse: true,
                    width: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>(" + item.value[0] + ", " + item.value[1] + ")</center>");
                    }
                }
            }]
        });
	

		
		
	var chartPanel = new Ext.Panel({
        width: 490,
        height: 200,
        layout: 'fit',
        margins: '5 5 0',
        region: 'north',
        split: true,
        minHeight: 100,
        maxHeight: 500,

        items: chart
    });


    obj.win = new Ext.Window({
        title: 'Converter Data Specification',
        layout: 'border',
        closeAction: 'destroy',
        border: false,
        modal: true,
        resizable: false,
        shadow: true,
        buttonAlign: 'left',
        layoutConfig: {
            columns: 1
        },
        width: 508,
        height: 500,
        items: [chartPanel, gridPan],
        buttons: [{
			disabled: ! is_editor,
			scale: "large",
			text: 'Units',
			iconCls: 'units-icon',
			tooltip: 'Edit primitive units',
			handler: function() {
				var unitsWindow = new Ext.UnitsWindow({
					parent: "",
					cell: obj.args.cell,
					units: obj.args.cell.getAttribute("Units")
				});
				unitsWindow.show();
			}
		},{
			disabled: ! is_editor,
			scale: "large",
			text: 'Import Data',
			iconCls: 'import-icon',
			tooltip: 'Import data from a CSV or other text file',
			handler: function() {
				importData(store);
			}
		},
		 '->',
        {
            scale: "large",
            iconCls: "cancel-icon",
            text: 'Cancel',
            handler: function()
            {
                obj.win.close();
				if(obj.args.parent!=""){
                	obj.args.parent.resumeEvents();
				}
            }
        },
        {
			disabled: ! is_editor,
            scale: "large",
            iconCls: "apply-icon",
            text: 'Apply',
            handler: function()
            {	
				editor.completeEdit();
				if(obj.args.parent != ""){
                	obj.args.parent.setValue(getKeys());
				}else{
					obj.args.cell.setAttribute("Data", getKeys())
				}
			
                obj.win.close();
				
				
				if(obj.args.parent != ""){
                	obj.args.parent.resumeEvents();
                	grid.plugins[0].completeEdit();
				}else{
					selectionChanged(false);
				}
            }
        }]

    });

    function getKeys() {
        var s = "";
        for (var i = 0; i < store.getCount(); i++)
        {
            if (i > 0) {
                s = s + "; ";
            }
            s = s + store.getAt(i).data.xVal + "," + store.getAt(i).data.yVal;
        }
        return s;
    }
	
	function getXRange(){
        return [store.getAt(0).data.xVal, store.getAt(store.getCount()-1).data.xVal]
	}

    gridPan.getSelectionModel().on('selectionchange',
    function(sm) {
        Ext.getCmp("converterRemoveBut").setDisabled(sm.getCount() < 1);
    });



    store.on('update',
    function() {
        store.sort('xVal', 'ASC');
        makeDiscrete();
    });

    store.on('dataChanged',
    function() {
        makeDiscrete();
    });

    obj.show = function()
    {
        obj.win.show();

		/*chart.on({
		  click: function(e) {
			  
		    console.log(e);
			console.log(chart.getEventXY(e));
			console.log(e.getXY());
			console.log(e.getPoint());
		  }
		});*/
    }
}

