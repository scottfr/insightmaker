"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


Ext.onReady(function() {
    Ext.getBody().createChild({
        tag: 'style',
        type: 'text/css',
        html: '.x-item-disabled .x-grid-cell-inner {color: gray !important; font-style: italic !important}'
    });
})

 var converterStore = Ext.create('Ext.data.Store', {
    fields: [{
        type: 'string',
        name: 'myId'
    },
    {
        type: 'string',
        name: 'displayText'
    }],
    data: []
});

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
            selectOnFocus: true
        });
    } else if (typeof val == 'number') {
        return Ext.create('Ext.form.field.Number', {
            selectOnFocus: true
        });
    } else if (typeof val == 'boolean') {
        return new Ext.form.ComboBox({
            triggerAction: "all",
            store: [["false", "No"], ["true", "Yes"]],
            selectOnFocus: true, editable: false
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
        var nameDisplayPairs = [];
        var editors = [];
        var renderers = [];
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
            nameDisplayPairs[properties[i].name] = properties[i].text;

            editors[properties[i].name] = getEditor(properties[i]);
            if (getRenderer(properties[i]) != false) {
                renderers[properties[i].name] = getRenderer(properties[i]);
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
            groupers: [{
                property: "group"
            }]
        });

        handleGridEnables(gstore, selectedPrimitive);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}', collapse:Ext.emptyFn
        });

        grid = Ext.create('Ext.grid.property.Grid', {
			selectedPrimitive: selectedPrimitive,
            store: gstore,
			hideHeaders:true,
            border: false,
            id: 'propGrid',
            features: [groupingFeature],
            propertyNames: nameDisplayPairs,
            customEditors: editors,
            customRenderers: renderers,
            viewConfig: {
                getRowClass: function(record) {
                    return (record.data['disabled'] == true) ? "x-item-disabled": "";
                }
            },
			listeners: (is_editor?{}:{'beforeedit':{fn:function(){return false;}}})
        });

        configPanel.add(grid);

		//grid.plugins[0].ignoreNoChange=true;
        grid.plugins[0].on(
        "edit",
        function(editor, e) {
            if (is_editor) {
                var itemId = (e.record.get("name"));
                e.record.commit();
                graph.getModel().beginUpdate();
                try
                {
                    if ( itemId != "name" ||  (! isPrimitive(selectedPrimitive) ) || (validPrimitiveName(String(e.value), selectedPrimitive))) {
                        var edit = new mxCellAttributeChange(
                        selectedPrimitive, itemId,
                        String(e.value));
                        graph.getModel().execute(edit);
						if(itemId=="name"){
							propogateGhosts(selectedPrimitive);
						}
                    }

					if (selectedPrimitive.value.nodeName == "Folder" && itemId=="Type" && String(e.value)=="None") {
						removeAgent(selectedPrimitive);
                    }
					
					if (selectedPrimitive.value.nodeName == "Stock" && itemId=="AllowNegatives") {
						var edit = new mxCellAttributeChange(selectedPrimitive, "NonNegative", String(! isTrue(e.value)));
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
        });



    }

	for(var i=0; i<bottomItems.length; i++){
		configPanel.add(bottomItems[i]);
	}

}


function handleGridEnables(gstore, selectedPrimitive) {
    var store;
    if (gstore != null) {
        store = gstore;
    }
    else {
        var store = grid.getStore();
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
        getGridRecord(store, 'MaxConstraint').set('disabled', !isTrue(selectedPrimitive.getAttribute("MaxConstraintUsed")));
        getGridRecord(store, 'MinConstraint').set('disabled', !isTrue(selectedPrimitive.getAttribute("MinConstraintUsed")));
        if (selectedPrimitive.value.nodeName != "Converter") {
            getGridRecord(store, 'SliderMax').set('disabled', !isTrue(selectedPrimitive.getAttribute("ShowSlider")));
            getGridRecord(store, 'SliderMin').set('disabled', !isTrue(selectedPrimitive.getAttribute("ShowSlider")));
        }
    }
}



var ConfigPanel = function()
 {
	var panel_width = 300;
    if (is_embed) {
        panel_width = 210;
    }

    return (
    {
        id: 'configPanel',
        region: 'east',
        width: panel_width,
        split: true,
		autoScroll: true,
		listeners: {beforeexpand:function(p){setSelected([])}},
        collapsible: true,
        title: "Configuration",
        border: true,
		layout: {
			type: "vbox",
			align:"stretch"
		}
    });


};

function getGridRecord(store, name) {
    return store.getAt(store.findBy(function(x) {
        return x.data.name == name
    }));
}
