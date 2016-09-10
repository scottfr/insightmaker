"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


var grid;

function getRenderer(item) {
	
    if ("renderer" in item) {
        return item.renderer;
    }

    var val = item.value;
    if (typeof val == 'boolean') {
        return function(bval) {
            if (isTrue(bval)) {
                return 'Yes';
            } else {
                return 'No';
            }
        };
    }

    return false;
}

function getEditor(item) {
    if ("editor" in item) {
        return item.editor;
    }
    var val = item.value;
    if (val instanceof Date) {
        return new Ext.form.DateField({
            selectOnFocus: true,
			editable: true 
        });
    } else if (typeof val == 'number') {
        return Ext.create('Ext.form.field.Number', {
            selectOnFocus: true,
			editable: true 
        });
    } else if (typeof val == 'boolean') {
        return new Ext.form.ComboBox({
            triggerAction: "all",
            store: [["false", getText("No")], ["true", getText("Yes")]],
            selectOnFocus: false,
			editable: false
        });
    } else {
        return new Ext.form.TextField({
            selectOnFocus: true
        });
    }
}

function createGrid(properties, topItems, bottomItems, selectedPrimitive) {
	
	
	
	for(var i=0; i<topItems.length; i++){
		configPanel.add(topItems[i]);
	}
	
	
	
    if (properties.length > 0) {
        var data = [];
        var sourceConfig = {};
		
        for (i = 0; i < properties.length; i++) {
            data.push({
                id: properties[i].name,
                name: properties[i].name,
                text: properties[i].text,
                value: properties[i].value,
                group: properties[i].group
            });

            if (typeof data[i].value == 'boolean') {
                data[i].value = isTrue(data[i].value).toString();
            }
			var obj = {};
			sourceConfig[properties[i].name] = obj;
			
            obj.displayName = properties[i].text;

            obj.editor = getEditor(properties[i]);
            if (getRenderer(properties[i]) != false) {
                obj.renderer = getRenderer(properties[i]);
            }
			
			
			
        }
        // create the data store
        var gstore = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'name',
                type: 'string'
            },
            {
                name: 'text',
                type: 'string'
            },
            {
                name: 'value',
                type: 'string'
            },
            {
                name: 'group',
                type: 'string'
            }],
            data: data,
            groupField: "group"
        });

        handleGridEnables(gstore, selectedPrimitive);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}',
			collapsible: false
        });


        grid = Ext.create('Ext.grid.property.Grid', {
			nameColumnWidth: 165,
			selectedPrimitive: selectedPrimitive,
            store: gstore,
			hideHeaders: true,
            border: false,
            features: [groupingFeature],
            sourceConfig: sourceConfig,
            viewConfig: {
              getRowClass: function(record) {
                return (record.data['disabled'] == true) ? "disabled-cell": "";
              }
            },
			listeners: {
				beforeedit: (viewConfig.allowEdits)?function(grid, e){
					if(e.record.data.name == "Solver"){
						return false;
					}
					window.editingRecord = e.record;
				}:function(){return false;}
			}
        });

        configPanel.add(grid);

		//grid.plugins[0].ignoreNoChange=true;
        grid.plugins[0].on(
        "edit",
        function(editor, e) {
            if (is_editor) {
                saveConfigRecord(e.record, selectedPrimitive);
            }
        });
    }
	
	for(var i=0; i<bottomItems.length; i++){
		configPanel.add(bottomItems[i]);
	}
	
	/*var el = $('.slider-holder > div > div')[0];
	if(el){
		Sortable.create(el, {
			draggable: ".single-slider"
		});
	}*/
	
	
	

}

function saveConfigRecord(record, selectedPrimitive){
	var selectedPrimitive = selectedPrimitive || getSelected()[0];
    var itemId = (record.get("name"));
	var value = record.get("value");
    record.commit();
    graph.getModel().beginUpdate();
    try
    {
        if ( itemId != "name" ||  (! isPrimitive(selectedPrimitive) ) || (validPrimitiveName(String(value), selectedPrimitive))) {
			if(itemId == "name"){
				var oldName = getName(selectedPrimitive)
			}
            var edit = new mxCellAttributeChange(
            selectedPrimitive, itemId,
            String(value));
            graph.getModel().execute(edit);
			if(itemId=="name"){
				propogateGhosts(selectedPrimitive);
				propogateName(selectedPrimitive, oldName);
			}
        }

		if(selectedPrimitive.value.nodeName == "Folder"){
			if ( itemId == "Type" && String(value) == "None") {
				removeAgent(selectedPrimitive);
	        }
		}
		
		
		if (selectedPrimitive.value.nodeName == "Stock" && itemId=="AllowNegatives") {
			var edit = new mxCellAttributeChange(selectedPrimitive, "NonNegative", String(! isTrue(value)));
            graph.getModel().execute(edit);
        }

        if (selectedPrimitive.value.nodeName == "Flow") {
            if (isTrue(selectedPrimitive.getAttribute("OnlyPositive"))) {
                graph.setCellStyles(mxConstants.STYLE_STARTARROW, "",[selectedPrimitive]);
            } else {
                graph.setCellStyles(mxConstants.STYLE_STARTARROW, "block", [selectedPrimitive]);
                graph.setCellStyles("startFill", 0, [selectedPrimitive]);
            }
        }
        if (selectedPrimitive.value.nodeName == "Link") {
            if (!isTrue(selectedPrimitive.getAttribute("BiDirectional"))) {
                graph.setCellStyles(mxConstants.STYLE_STARTARROW, "", [selectedPrimitive]);
            } else {
                graph.setCellStyles(mxConstants.STYLE_STARTARROW, mxConstants.ARROW_CLASSIC, [selectedPrimitive]);
            }
        }
        if (itemId == "Image" || itemId == "FlipHorizontal" || itemId == "FlipVertical") {
            setPicture(selectedPrimitive);
        }
        if (itemId == "LabelPosition") {
            setLabelPosition(selectedPrimitive);
        }

    }
    finally
    {
        graph.getModel().endUpdate();
    }
    handleGridEnables(null, selectedPrimitive);
}

function handleGridEnables(gstore, selectedPrimitive) {
    var store;
    if (gstore != null) {
        store = gstore;
    }
    else {
        var store = grid.getStore();
    }

    if (selectedPrimitive.value.nodeName == "Folder") {
        if (selectedPrimitive.getAttribute("Type") == "Agent") {
            getGridRecord(store, 'AgentBase').set('disabled', false);
        } else {
            getGridRecord(store, 'AgentBase').set('disabled', true);
        }
    }
	
    if (selectedPrimitive.value.nodeName == "Action" || selectedPrimitive.value.nodeName == "Transition") {
        if (selectedPrimitive.getAttribute("Trigger") == "Condition") {
            getGridRecord(store, 'Recalculate').set('disabled', true);
            //getGridRecord(store, 'Repeat').set('disabled', true);
        } else {
            getGridRecord(store, 'Recalculate').set('disabled', false);
            //getGridRecord(store, 'Repeat').set('disabled', false);
        }
    }
	
    if (selectedPrimitive.value.nodeName == "Stock") {
        if (selectedPrimitive.getAttribute("StockMode") == "Store") {
            getGridRecord(store, 'Delay').set('disabled', true);
        } else if (selectedPrimitive.getAttribute("StockMode") == "Conveyor") {
            getGridRecord(store, 'Delay').set('disabled', false);
        }
    }
	
    if (selectedPrimitive.value.nodeName == "Agents") {
        if (selectedPrimitive.getAttribute("Placement") == "Custom Function") {
            getGridRecord(store, 'PlacementFunction').set('disabled', false);
        } else {
            getGridRecord(store, 'PlacementFunction').set('disabled', true);
        }
        if (selectedPrimitive.getAttribute("Network") == "Custom Function") {
            getGridRecord(store, 'NetworkFunction').set('disabled', false);
        } else {
            getGridRecord(store, 'NetworkFunction').set('disabled', true);
        }
    }

    if (is_editor && isValued(selectedPrimitive) && selectedPrimitive.value.nodeName != "State" && selectedPrimitive.value.nodeName != "Action") {
		try{
        	getGridRecord(store, 'MaxConstraint').set('disabled', !isTrue(selectedPrimitive.getAttribute("MaxConstraintUsed")));
        	getGridRecord(store, 'MinConstraint').set('disabled', !isTrue(selectedPrimitive.getAttribute("MinConstraintUsed")));
		}catch(err){}
        if (selectedPrimitive.value.nodeName != "Converter") {
			try{
            	getGridRecord(store, 'SliderMax').set('disabled', !isTrue(selectedPrimitive.getAttribute("ShowSlider")));
            	getGridRecord(store, 'SliderMin').set('disabled', !isTrue(selectedPrimitive.getAttribute("ShowSlider")));
            	getGridRecord(store, 'SliderStep').set('disabled', !isTrue(selectedPrimitive.getAttribute("ShowSlider")));
			}catch(err){}
        }
    }
}



var ConfigPanel = function()
 {

    return (
    {
		stateful: is_editor && (! is_embed),
		collapseFirst: false,
		tools:[
			{
			    type: 'help',
			    tooltip: getText('Insight Maker Help'),
			    callback: function(panel, tool, event) {
			        showURL("/help");
			    }
			}
		],
		stateId: "config_panel",
        region: 'east',
        width: viewConfig.sideBarWidth,
        split: true,
		autoScroll: true,
		listeners: {beforeexpand:function(p){setSelected([])}, beforecollapse:function(){
			//grid.destroy();
			//configPanel.removeAll();
		}},
        collapsible: ! mxClient.IS_TOUCH, /*XXX SFR FIXME TODO: Bug on mobile devices with collapsing when the grid has been created */
		header: ! is_embed,
        title: getText("Configuration"),
        border: false,
		layout: {
			type: "vbox",
			align: "stretch"
		}
    });
	
};

function getGridRecord(store, name) {
    return store.getAt(store.findBy(function(x) {
        return x.data.name == name
    }));
}
