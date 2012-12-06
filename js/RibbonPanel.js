"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

var macrosWin;
var scratchPadStatus = "";

function ribbonPanelItems() {
	var z = ribbonPanel.getDockedItems()[0];
	return z;
}

var showMacros = function() {
		if (isUndefined(macrosWin)) {

			macrosWin = new Ext.Window({
				layout: 'fit',
				modal: true,
				autoScroll: true,
				width: 440,
				title: "Insight Macros",
				height: 360,
				resizable: false,
				closeAction: 'close',
				plain: true,
				items: [new Ext.FormPanel({
					fieldDefaults: {
						labelWidth: 100
					},
					frame: true,
					autoScroll: true,
					bodyStyle: 'padding:5px 5px 0',
					defaults: {
						width: 405
					},
					items: [{
						xtype: "textareafield",
						fieldLabel: 'Macros',
						id: 'macroTxt',
						name: 'macroTxt',
						height: 210
					}, {
						xtype: "displayfield",
						labelAlign: 'center',
						fieldLabel: 'Example Macros',
						value: "g <- {9.80665 meters/seconds^2}<br/>TemperatureFtoC(f) <- (f+32)*5/9"
					}]
				})],

				buttons: [{
					scale: "large",
					iconCls: "cancel-icon",
					text: 'Cancel',
					handler: function() {
						macrosWin.hide();
					}
				}, {
					iconCls: "apply-icon",
					scale: "large",
					text: 'Apply',
					handler: function() {

						graph.getModel().beginUpdate();

						var edit = new mxCellAttributeChange(
						getSetting(), "Macros", Ext.getCmp('macroTxt').getValue());
						graph.getModel().execute(edit);

						graph.getModel().endUpdate();

						macrosWin.hide();

					}
				}

				]
			});
		}
		Ext.getCmp('macroTxt').setValue(getSetting().getAttribute("Macros"));
		macrosWin.show();
	};

var scratchpadFn = function() {
		if (scratchPadStatus == "shown") {
			Ext.get("mainGraph").setDisplayed("none");
			scratchPadStatus = "hidden";
		} else if (scratchPadStatus == "hidden") {
			Ext.get("mainGraph").setDisplayed("block");
			scratchPadStatus = "shown";
		} else {
			Ext.get("mainGraph").setDisplayed("block");
			Scratchpad($('#mainGraph'));
			scratchPadStatus = "shown";
		}
	};

var config_columns;
if ((!is_editor) || is_embed) {
	config_columns = 1;
} else {
	config_columns = 3;
}
var sizeCombo;
var fontCombo;
var RibbonPanel = function(graph, history, mainPanel, configPanel) {
	Ext.Ajax.timeout = 60000;

	var handlePrimToggle = function(item, pressed) {
			var topItems = ribbonPanelItems();

			if (item.id == "flow" && pressed) {
				topItems.getComponent('connect').getComponent('link').toggle(false);
			} else if (item.id == "link" && pressed) {
				topItems.getComponent('connect').getComponent('flow').toggle(false);
			}
			if (item.id == "stock" && pressed) {
				topItems.getComponent('valued').getComponent('variable').toggle(false);
				topItems.getComponent('valued').getComponent('text').toggle(false);
				topItems.getComponent('valued').getComponent('converter').toggle(false);
				topItems.getComponent('valued').getComponent('picture').toggle(false);
				topItems.getComponent('valued').getComponent('buttonBut').toggle(false);
			} else if (item.id == "variable" && pressed) {
				topItems.getComponent('valued').getComponent('stock').toggle(false);
				topItems.getComponent('valued').getComponent('text').toggle(false);
				topItems.getComponent('valued').getComponent('converter').toggle(false);
				topItems.getComponent('valued').getComponent('picture').toggle(false);
				topItems.getComponent('valued').getComponent('buttonBut').toggle(false);
			} else if (item.id == "text" && pressed) {
				topItems.getComponent('valued').getComponent('stock').toggle(false);
				topItems.getComponent('valued').getComponent('variable').toggle(false);
				topItems.getComponent('valued').getComponent('converter').toggle(false);
				topItems.getComponent('valued').getComponent('picture').toggle(false);
				topItems.getComponent('valued').getComponent('buttonBut').toggle(false);
			} else if (item.id == "converter" && pressed) {
				topItems.getComponent('valued').getComponent('stock').toggle(false);
				topItems.getComponent('valued').getComponent('variable').toggle(false);
				topItems.getComponent('valued').getComponent('text').toggle(false);
				topItems.getComponent('valued').getComponent('picture').toggle(false);
				topItems.getComponent('valued').getComponent('buttonBut').toggle(false);
			} else if (item.id == "picture" && pressed) {
				topItems.getComponent('valued').getComponent('stock').toggle(false);
				topItems.getComponent('valued').getComponent('variable').toggle(false);
				topItems.getComponent('valued').getComponent('text').toggle(false);
				topItems.getComponent('valued').getComponent('converter').toggle(false);
				topItems.getComponent('valued').getComponent('buttonBut').toggle(false);
			} else if (item.id == "buttonBut" && pressed) {
				topItems.getComponent('valued').getComponent('stock').toggle(false);
				topItems.getComponent('valued').getComponent('variable').toggle(false);
				topItems.getComponent('valued').getComponent('text').toggle(false);
				topItems.getComponent('valued').getComponent('converter').toggle(false);
				topItems.getComponent('valued').getComponent('picture').toggle(false);
			}
			handelCursors();
		}

	
	var colors = ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080", "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696", "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "6482B9", "993366", "C0C0C0", "FF99CC", "FDCDAC", "FFFF99", "B3E2CD", "CCFFFF", "A6D3F8", "CC99FF", "FFFFFF"];
	var fillColorMenu = Ext.create("Ext.menu.ColorPicker", {
		colors: colors,
		allowReselect: true,
		handler: function(cm, color) {
			if (typeof(color) == "string") {

				graph.getModel().beginUpdate();
				graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#' + color, excludeType(graph.getSelectionCells(), "Ghost"));
				var p = graph.getSelectionCells(),
					cells = [];
				for (var i = 0; i < p.length; i++) {
					if (p[i].value.nodeName == "Link" || p[i].value.nodeName == "Flow") {
						cells.push(p[i]);
					}
				}
				graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#' + color, cells, excludeType(graph.getSelectionCells(), "Ghost"));

				if (graph.isSelectionEmpty()) {
					graph.getModel().execute(new mxCellAttributeChange(getSetting(), "BackgroundColor", '#' + color));
					loadBackgroundColor();
				}

				graph.getModel().endUpdate();
			}
		}
	});
	fillColorMenu.add("-");
	fillColorMenu.add({
		text: 'Transparent',
		handler: function() {

			graph.getModel().beginUpdate();
			graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, mxConstants.NONE, excludeType(graph.getSelectionCells(), "Ghost"));
			var p = graph.getSelectionCells(),
				cells = [];
			for (var i = 0; i < p.length; i++) {
				if (p[i].value.nodeName == "Link" || p[i].value.nodeName == "Flow") {
					cells.push(p[i]);
				}
			}
			graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, mxConstants.NONE, cells, excludeType(graph.getSelectionCells(), "Ghost"));

			if (graph.isSelectionEmpty()) {

				graph.getModel().execute(new mxCellAttributeChange(getSetting(), "BackgroundColor", "white"));
				loadBackgroundColor();

			}

			graph.getModel().endUpdate();
		}
	});
	var fontColorMenu = new Ext.menu.ColorPicker({
		colors: colors,
		allowReselect: true,
		handler: function(cm, color) {
			if (typeof(color) == "string") {
				graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, '#' + color, excludeType(graph.getSelectionCells(), "Ghost"));
			}
		}
	});

	var lineColorMenu = new Ext.menu.ColorPicker({
		colors: colors,
		allowReselect: true,
		handler: function(cm, color) {
			if (typeof(color) == "string") {
				graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#' + color, excludeType(graph.getSelectionCells(), "Ghost"));
			}
		}
	});
	lineColorMenu.add("-");
	lineColorMenu.add({
		text: 'Transparent',
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, mxConstants.NONE, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	});

	var fonts = Ext.create('Ext.data.Store', {
		fields: [{
			type: 'string',
			name: 'label'
		}, {
			type: 'string',
			name: 'font'
		}],
		data: [{
			label: 'Comic',
			font: 'Comic Sans MS'
		}, {
			label: 'Helvetica',
			font: 'Helvetica'
		}, {
			label: 'Verdana',
			font: 'Verdana'
		}, {
			label: 'Times New Roman',
			font: 'Times New Roman'
		}, {
			label: 'Garamond',
			font: 'Garamond'
		}, {
			label: 'Courier New',
			font: 'Courier New'
		}]
	});

	fontCombo = new Ext.form.ComboBox({
		store: fonts,
		displayField: 'label',
		valueField: 'font',
		queryMode: 'local',
		width: 120,
		colspan: 3,
		triggerAction: 'all',
		emptyText: 'Select a font...',
		selectOnFocus: true,
		listeners: {
			select: function(p, entry) {
				if (entry != null) {
					graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, p.getValue(), excludeType(graph.getSelectionCells(), "Ghost"));
				}
			}
		}
	});

	// Handles typing a font name and pressing enter
	fontCombo.on('specialkey', function(field, evt) {
		if (evt.keyCode == 10 || evt.keyCode == 13) {
			var family = field.getValue();

			if (family != null && family.length > 0) {
				graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, family, excludeType(graph.getSelectionCells(), "Ghost"));
				this.setValue(family);
			}
		}
	});

	// Defines the font size menu
	var sizes = Ext.create('Ext.data.Store', {
		fields: [{
			type: 'string',
			name: 'label'
		}, {
			type: 'float',
			name: 'size'
		}],
		data: [{
			label: '6pt',
			size: 6
		}, {
			label: '8pt',
			size: 8
		}, {
			label: '9pt',
			size: 9
		}, {
			label: '10pt',
			size: 10
		}, {
			label: '12pt',
			size: 12
		}, {
			label: '14pt',
			size: 14
		}, {
			label: '18pt',
			size: 18
		}, {
			label: '24pt',
			size: 24
		}, {
			label: '30pt',
			size: 30
		}, {
			label: '36pt',
			size: 36
		}, {
			label: '48pt',
			size: 48
		}, {
			label: '60pt',
			size: 60
		}]
	});

	sizeCombo = new Ext.form.ComboBox({
		colspan: 2,
		store: sizes,
		displayField: 'label',
		valueField: 'size',
		queryMode: 'local',
		width: 50,
		triggerAction: 'all',
		emptyText: '',
		selectOnFocus: true,
		listeners: {
			select: function(p, entry) {
				if (entry != null) {
					graph.setCellStyles(mxConstants.STYLE_FONTSIZE, p.getValue(), excludeType(graph.getSelectionCells(), "Ghost"));
				}
			}
		}
	});

	// Handles typing a font size and pressing enter
	sizeCombo.on('specialkey', function(field, evt) {
		if (evt.keyCode == 10 || evt.keyCode == 13) {
			var size = parseInt(field.getValue());

			if (!isNaN(size) && size > 0) {
				this.setValue(size);
				graph.setCellStyles(mxConstants.STYLE_FONTSIZE, size, excludeType(graph.getSelectionCells(), "Ghost"));
			}
		}
	});

	var zoomMenu = {
		items: [

		{
			text: '400%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(4);
			}
		}, {
			text: '200%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(2);
			}
		}, {
			text: '150%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(1.5);
			}
		}, {
			text: '100%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(1);
			}
		}, {
			text: '75%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(0.75);
			}
		}, {
			text: '50%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(0.5);
			}
		}, {
			text: '25%',
			scope: this,
			handler: function(item) {
				graph.getView().setScale(0.25);
			}
		}, '-',
		{
			text: 'Zoom In',
			iconCls: 'zoomin-icon',
			scope: this,
			handler: function(item) {
				graph.zoomIn();
			}
		}, {
			text: 'Zoom Out',
			iconCls: 'zoomout-icon',
			scope: this,
			handler: function(item) {
				graph.zoomOut();
			}
		}, '-',
		{
			text: 'Actual Size',
			iconCls: 'zoomactual-icon',
			scope: this,
			handler: function(item) {
				graph.zoomActual();
			}
		}, {
			text: 'Fit Window',
			iconCls: 'fit-icon',
			scope: this,
			handler: function(item) {
				graph.fit();
			}
		}]
	};
	if ((!is_embed) && is_editor) {
		zoomMenu.items.push(
/*'-',
        {
            text: 'Vertical Hierarchical Layout',
            scope: this,
            handler: function(item)
            {
                var layout = new mxHierarchicalLayout(graph);
                executeLayout(layout, true);
            }
        },
        {
            text: 'Horizontal Hierarchical Layout',
            scope: this,
            handler: function(item)
            {
                var layout = new mxHierarchicalLayout(graph,
                mxConstants.DIRECTION_WEST);
                executeLayout(layout, true);
            }
        },*/
		'-', {
			text: 'Organic Layout',
			scope: this,
			handler: function(item) {
				layoutModel("organic");
			}
		}, {
			text: 'Circle Layout',
			scope: this,
			handler: function(item) {
				layoutModel("circular");
			}
		});
	}



	return ({
		id: 'ribbonPanel',
		xtype: 'panel',
		layout: 'border',
		region: 'center',
		split: true,
		border: false,
		items: [mainPanel, configPanel],
		collapsible: false,
		tbar: new Ext.toolbar.Toolbar({
			enableOverflow: true,
			items: [

			{
				hidden: (!is_editor) || is_embed,
				xtype: 'buttongroup',
				columns: 4,
				height: 95,
				title: 'Primitives',
				id: 'valued',
				items: [{
					iconAlign: 'top',
					scale: 'large',
					cls: 'x-btn-as-arrow',
					rowspan: 3,
					id: 'stock',
					text: 'Stock',
					iconCls: 'stock-icon',
					tooltip: 'Create a new Stock by clicking on the canvas',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,
					scope: this
				}, {
					iconAlign: 'top',
					scale: 'large',
					cls: 'x-btn-as-arrow',
					rowspan: 3,
					id: 'variable',
					text: 'Variable',
					iconCls: 'parameter-icon',
					tooltip: 'Create a new Variable by clicking on the canvas',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,

					scope: this
				},

				{
					id: 'converter',
					text: 'Converter',
					iconCls: 'converter-icon',
					tooltip: 'Create a new Converter by clicking on the canvas',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,
					scope: this
				}, {
					id: 'text',
					text: 'Text',
					iconCls: 'font-icon',
					tooltip: 'Create a new Text Area by clicking on the canvas',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,
					scope: this
				},

				{
					id: 'ghostBut',
					text: 'Ghost',
					iconCls: 'ghost-icon',
					tooltip: 'Create a linked clone of the selected primitive which can help you organize your model',
					scope: this,
					handler: makeGhost
				}, {
					id: 'picture',
					text: 'Picture',
					iconCls: 'picture-icon',
					tooltip: 'Create a new Picture by clicking on the canvas',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,
					scope: this
				}, {
					id: 'folder',
					text: 'Folder',
					iconCls: 'folder-icon',
					tooltip: 'Creates a new Folder containing the selected primitives',
					scope: this,
					handler: makeFolder
				}, {
					id: 'buttonBut',
					text: 'Button',
					iconCls: 'button-icon',
					tooltip: 'Creates a new Button with interactivity',
					scope: this,
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false

				}

				]
			}, {
				hidden: (!is_editor) || is_embed,
				xtype: 'buttongroup',
				columns: 1,
				height: 95,
				title: 'Connections',
				id: 'connect',
				items: [{
					id: 'link',
					text: 'Use Links',
					iconCls: 'link-small-icon',
					tooltip: 'Use Links to connect nodes',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: false,

					scope: this
				}, {
					id: 'flow',
					text: 'Use Flows',
					iconCls: 'flow-small-icon',
					tooltip: 'Use Flows to connect nodes',
					enableToggle: true,
					toggleHandler: handlePrimToggle,
					pressed: drupal_node_ID == -1,

					scope: this
				}, {
					id: 'reverse',
					text: 'Reverse',
					iconCls: 'reverse-icon',
					tooltip: 'Reverse connection direction',
					handler: function() {
						graph.getModel().beginUpdate();

						var myCells = graph.getSelectionCells();
						if (myCells != null) {
							for (var i = 0; i < myCells.length; i++) {
								if (myCells[i].isEdge()) {
									var geo = myCells[i].getGeometry();

									var tmp = myCells[i].source;
									var edit = new mxTerminalChange(graph.getModel(), myCells[i], myCells[i].target, true);
									graph.getModel().execute(edit);
									edit = new mxTerminalChange(graph.getModel(), myCells[i], tmp, false);
									graph.getModel().execute(edit);

									tmp = geo.sourcePoint;
									geo.sourcePoint = geo.targetPoint;
									geo.targetPoint = tmp;
									if (geo.points != null) {
										geo.points.reverse();
									}
									edit = new mxGeometryChange(graph.getModel(), myCells[i], geo);
									graph.getModel().execute(edit);
								}
							}
						}
						graph.getModel().endUpdate();


					},
					scope: this
				}

				]
			}, {
				hidden: (!is_editor) || is_embed,
				xtype: 'buttongroup',
				columns: 2,
				height: 95,
				title: 'Actions',
				id: 'actions',
				items: [

				{
					id: 'undo',
					text: 'Undo',
					iconCls: 'undo-icon',
					tooltip: 'Undo change ' + cmd("Z"),
					handler: function() {
						history.undo();
					},
					scope: this
				}, {
					id: 'redo',
					text: 'Redo',
					iconCls: 'redo-icon',
					tooltip: 'Redo change ' + cmd("Y"),
					handler: function() {
						history.redo();
					},
					scope: this
				}, {
					id: 'copy',
					text: 'Copy',
					iconCls: 'copy-icon',
					tooltip: 'Copy ' + cmd("C"),
					handler: function() {
						mxClipboard.copy(graph);
						clipboardListener();
					},
					scope: this
				}, {
					id: 'cut',
					text: 'Cut',
					iconCls: 'cut-icon',
					tooltip: 'Cut ' + cmd("X"),
					handler: function() {
						mxClipboard.cut(graph);

						clipboardListener();
						
					},
					scope: this
				}, {
					text: 'Paste',
					iconCls: 'paste-icon',
					tooltip: 'Paste ' + cmd("V"),
					id: 'paste',
					handler: function() {
						mxClipboard.paste(graph);

						clipboardListener();
						
					},
					scope: this
				}, {
					id: 'delete',
					text: 'Delete',
					iconCls: 'delete-icon',
					tooltip: 'Delete',
					handler: function() {
						graph.removeCells(graph.getSelectionCells(), false);
					},
					scope: this
				}]
			}, {
				hidden: (!is_editor) || is_embed,
				xtype: 'buttongroup',
				columns: 5,
				height: 95,
				title: 'Style',
				id: 'style',
				items: [

				fontCombo,

				sizeCombo,

				{
					id: 'fontcolor',
					text: '',
					tooltip: 'Font Color',
					iconCls: 'fontcolor-icon',
					menu: fontColorMenu
				}, {
					id: 'linecolor',
					text: '',
					tooltip: 'Line Color',
					iconCls: 'linecolor-icon',
					menu: lineColorMenu
				}, {
					id: 'fillcolor',
					text: '',
					colspan: 1,
					tooltip: 'Fill Color',
					iconCls: 'fillcolor-icon',
					menu: fillColorMenu
				}, {
					id: 'movemenu',
					text: '',
					tooltip: 'Change Order',
					iconCls: 'back-icon',
					handler: function() {},
					menu: {
						id: 'move-menu',
						cls: 'move-menu',
						items: [{
							id: 'moveback',
							text: 'Move to Back',
							iconCls: 'back-icon',
							handler: function() {
								graph.orderCells(true);
							},
							scope: this
						}, {
							id: 'movefront',
							text: 'Move to Front',
							iconCls: 'front-icon',
							handler: function() {
								graph.orderCells(false);
							},
							scope: this
						}]
					}
				}, {
					id: 'picturemenu',
					text: '',
					tooltip: 'Adjust Picture',
					iconCls: 'picture-icon',
					handler: function() {},
					menu: {
						id: 'picture-menu',
						cls: 'picture-menu',
						items: [
						{
							id: 'fliphitem',
							text: 'Flip Horizontal',
							iconCls: 'fliph-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");

				                graph.getModel().beginUpdate();
								
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("FlipHorizontal"))){
										var edit = new mxCellAttributeChange(cells[i], "FlipHorizontal", ! isTrue(cells[i].getAttribute("FlipHorizontal")));
					                    graph.getModel().execute(edit);
										setPicture(cells[i]);
									}
								}

				                graph.getModel().endUpdate();
								
							},
							scope: this
						}, {
							id: 'flipvitem',
							text: 'Flip Vertical',
							iconCls: 'flipv-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("FlipVertical"))){
										var edit = new mxCellAttributeChange(cells[i], "FlipVertical", ! isTrue(cells[i].getAttribute("FlipVertical")));
					                    graph.getModel().execute(edit);
										setPicture(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
								
							},
							scope: this
						}]
					}
				}, {
					id: 'bold',
					text: '',
					iconCls: 'bold-icon',
					tooltip: 'Bold ' + cmd("B"),
					handler: function() {
						graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, excludeType(graph.getSelectionCells(), "Ghost"));
						setStyles();
					},
					scope: this
				}, {
					id: 'italic',
					text: '',
					tooltip: 'Italic ' + cmd("I"),
					iconCls: 'italic-icon',
					handler: function() {
						graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC, excludeType(graph.getSelectionCells(), "Ghost"));
						setStyles();
					},
					scope: this
				}, {
					id: 'underline',
					text: '',
					enableToggle: true,
					tooltip: 'Underline ' + cmd("U"),
					iconCls: 'underline-icon',
					handler: function() {
						graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE, excludeType(graph.getSelectionCells(), "Ghost"));
						setStyles();
					},
					scope: this
				}, {
					id: 'align',
					text: '',
					iconCls: 'left-icon',
					tooltip: 'Label Position',
					handler: function() {},
					menu: {
						id: 'reading-menu',
						cls: 'reading-menu',
						items: [{
							text: 'Align Left',
							checked: false,
							group: 'rp-group',
							scope: this,
							iconCls: 'left-icon',
							handler: function() {
								graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT, excludeType(graph.getSelectionCells(), "Ghost"));
							}
						}, {
							text: 'Align Center',
							checked: true,
							group: 'rp-group',
							scope: this,
							iconCls: 'center-icon',
							handler: function() {
								graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, excludeType(graph.getSelectionCells(), "Ghost"));
							}
						}, {
							text: 'Align Right',
							checked: false,
							group: 'rp-group',
							scope: this,
							iconCls: 'right-icon',
							handler: function() {
								graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT, excludeType(graph.getSelectionCells(), "Ghost"));
							}
						}, '-',
						{
							text: 'Position Middle',
							checked: true,
							group: 'vrp-group',
							scope: this,
							iconCls: 'middle-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("LabelPosition"))){
										var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Middle");
					                    graph.getModel().execute(edit);
										setLabelPosition(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
						
							}
						},
						{
							text: 'Position Top',
							checked: false,
							group: 'vrp-group',
							scope: this,
							iconCls: 'top-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("LabelPosition"))){
										var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Top");
					                    graph.getModel().execute(edit);
										setLabelPosition(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
								
							}
						},{
							text: 'Position Right',
							checked: false,
							group: 'vrp-group',
							scope: this,
							iconCls: 'right-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("LabelPosition"))){
										var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Right");
					                    graph.getModel().execute(edit);
										setLabelPosition(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
								
							}
						}, {
							text: 'Position Bottom',
							checked: false,
							group: 'vrp-group',
							scope: this,
							iconCls: 'bottom-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("LabelPosition"))){
										var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Bottom");
					                    graph.getModel().execute(edit);
										setLabelPosition(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
								
							}
						}, {
							text: 'Position Left',
							checked: false,
							group: 'vrp-group',
							scope: this,
							iconCls: 'left-icon',
							handler: function() {
								var cells = excludeType(getSelected(), "Ghost");
				                graph.getModel().beginUpdate();
								for(var i=0; i<cells.length; i++){
									if(isDefined(cells[i].getAttribute("LabelPosition"))){
										var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Left");
					                    graph.getModel().execute(edit);
										setLabelPosition(cells[i]);
									}
								}
				                graph.getModel().endUpdate();
								
							}
						}]
					}
				}, {
					id: "zoomMenuButton",
					text: '',
					iconCls: 'zoom-icon',
					handler: function() {},
					menu: zoomMenu
				}]
			}, {
				hidden: (is_editor || is_embed),
				id: 'control-no-edit',
				xtype: 'buttongroup',
				columns: 2,
				height: 95,
				title: 'Explore',
				items: [{
					iconAlign: 'top',
					id: 'scratchpadLarge',
					text: 'Scratchpad',
					iconCls: 'scratchpad-large-icon',
					tooltip: 'Draw a sketch on your diagram ' + cmd("K"),
					enableToggle: true,
					scale: 'large',
					cls: 'button',
					rowspan: 3,
					handler: scratchpadFn,
					scope: this
				}, {
					iconAlign: 'top',
					scale: 'large',
					cls: 'button',
					rowspan: 3,
					text: 'Zoom',
					iconCls: 'zoom-large-icon',
					tooltip: 'Zoom Diagram',
					id: 'zoomlargebutgrouped',
					handler: function(menu) {},
					menu: zoomMenu
				}]
			}, {

				hidden: (is_embed || (!is_editor)),
				xtype: 'buttongroup',
				columns: config_columns,
				height: 95,
				title: 'Tools',
				id: "configgroup",
				items: [{
					iconAlign: 'top',
					scale: 'large',
					cls: 'x-btn-as-arrow',
					rowspan: 3,
					id: 'config',
					text: 'Time Settings',
					iconCls: 'clock-icon',
					tooltip: 'Configure Insight Time Settings ' + cmd("L"),
					handler: timeSettingsFn,
					scope: this
				}, {
					hidden: (!is_editor) || is_embed,
					id: 'scratchpad',
					text: 'Scratchpad',
					iconCls: 'scratchpad-icon',
					tooltip: 'Draw notes on your diagram ' + cmd("K"),
					enableToggle: true,
					handler: scratchpadFn,
					scope: this
				}, {
					hidden: (!is_editor) || is_embed,
					id: 'macroBut',
					text: 'Macros',
					iconCls: 'download-icon',
					tooltip: 'Edit macro functions and constants for use anywhere in the Insight',
					handler: showMacros,
					scope: this
				},{
					hidden: (!is_editor) || is_embed,
					id: 'sensitivityBut',
					text: 'Sensitivity',
					iconCls: 'sensitivity-icon',
					tooltip: 'Sensitivity testing',
					handler: doSensitivity,
					scope: this
				}
/*,
                {
                    hidden: (!is_editor) || is_embed,
                    id: 'download',
                    text: 'Download',
                    iconCls: 'download-icon',
                    tooltip: 'Download this Insight to your computer',
                    handler: function()
                    {
                        Ext.Msg.show({
                            icon: Ext.MessageBox.INFO,
                            title: 'Download Insight',
                            msg: 'You may download your Insights for further analysis. Insights are saved in a text-based format. One software package that can edit and carry out advanced analysis on the downloaded Insights is <a href="http://simgua.com" target="_blank">Simgua</a>.',
                            buttons: Ext.MessageBox.OKCANCEL,
                            fn: function(btn) {
                                if (btn == "ok") {
                                    downloadModel();
                                }
                            }
                        });
                    },
                    scope: this
                }*/
				,

				{
					id: 'embed_but',
					text: 'Embed',
					hidden: (!is_editor) || is_embed,
					iconCls: 'embed-icon',
					tooltip: 'Embed this Insight in another web page',
					handler: function() {
						if (drupal_node_ID == -1) {
							Ext.MessageBox.show({
								title: 'Save this Insight',
								msg: 'You must save this Insight before you can embed it in another webpage.',
								buttons: Ext.MessageBox.OK,
								animEl: 'mb9',
								icon: Ext.MessageBox.ERROR
							});
						} else {

							Ext.MessageBox.show({
								title: 'Embed',
								msg: 'To embed this Insight in another webpage (such as a blog or a private site), copy and paste the following code into the source HTML code of your webpage:<br/><br/><center><tt>&lt;IFRAME SRC="http://InsightMaker.com/insight/' + drupal_node_ID + '/embed?topBar=1&sideBar=1&zoom=1" TITLE="Embedded Insight" width=600 height=420&gt;&lt;/IFRAME&gt;</tt></center><br/>',
								buttons: Ext.MessageBox.OK,
								animEl: 'mb9',
								icon: Ext.MessageBox.INFO
							});
						}
					},
					scope: this
				},  {
					hidden: (!is_editor) || is_embed,
					id: 'textBut',
					text: 'Equations',
					iconCls: 'equations-icon',
					tooltip: 'A listing of all equations in the Insight',
					handler: textEquations,
					scope: this
				}


				]
			}, {
				hidden: (!is_embed),
				iconAlign: 'top',
				id: 'scratchpadLargeEmbed',
				text: 'Scratchpad',
				iconCls: 'scratchpad-large-icon',
				tooltip: 'Draw notes on your diagram ' + cmd("K"),
				enableToggle: true,
				scale: 'large',
				cls: 'button',
				rowspan: 3,
				handler: scratchpadFn,
				scope: this
			}, {
				hidden: (!is_embed),
				iconAlign: 'top',
				scale: 'large',
				cls: 'button',
				rowspan: 3,
				text: 'Zoom',
				iconCls: 'zoom-large-icon',
				tooltip: 'Zoom Diagram',
				id: 'zoomlargebutEmbed',
				handler: function(menu) {},
				menu: zoomMenu
			}, '-',
			{
				hidden: ((!is_editor) || is_embed),
				id: 'savegroup',
				xtype: 'buttongroup',
				columns: 1,
				height: 95,
				width: 90,
				title: 'Save',
				items: [{
					hidden: (!is_editor) || is_embed,
					iconAlign: 'top',
					scale: 'large',
					cls: 'x-btn-as-arrow',
					rowspan: 3,
					text: 'Save Insight',
					iconCls: 'save-icon',
					tooltip: 'Save Insight ' + cmd("S"),
					id: 'savebut',
					handler: function() {
						saveModel();
					},
					scope: this
				}]
			}, {
				hidden: (!is_embed),
				iconAlign: 'top',
				scale: 'large',
				cls: 'button',
				rowspan: 3,
				id: 'run_embed',
				text: 'Run Simulation',
				iconCls: 'run-icon',
				tooltip: 'Run ' + cmd("Enter"),
				handler: function() {
					runModel()
				},
				scope: this
			}, {
				hidden: is_embed,
				xtype: 'buttongroup',
				columns: 1,
				title: 'Simulate',
				height: 95,
				items: [{
					iconAlign: 'top',
					scale: 'large',
					cls: 'x-btn-as-arrow',
					rowspan: 3,
					id: 'run',
					text: 'Run Simulation',
					iconCls: 'run-icon',
					tooltip: 'Run ' + cmd("Enter"),
					handler: function(me, evt) {
						runModel();
					},
					scope: this
				}]
			}, "->",
			{
				scale: "large",
				iconAlign: 'top',
				cls: 'button',
				width: 154,
				id: 'logo',
				text: '',
				iconCls: "logo-icon",
				tooltip: 'InsightMaker.com',
				handler: function() {
					showURL("http://InsightMaker.com")
				},
				scope: this

			}]
		})

	});
};
