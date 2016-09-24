"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var scratchPadStatus = "";

function ribbonPanelItems() {
	var z = ribbonPanel.getDockedItems()[0];
	return z;
}

var reverseDirection = function() {
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
									
						
									if(myCells[i].value.nodeName == "Link"){
										linkBroken(myCells[i]);
									}
								}
							}
						}
						
						graph.getModel().endUpdate();


					};
					
var showMacros = function(annotations) {
		var equationEditor = new Ext.ux.AceEditor({
			id: 'macroTxt',
			name: 'macroTxt',
			readOnly: ! viewConfig.allowEdits,
			flex: 1,
			value: getSetting().getAttribute("Macros"),
			annotations: annotations
		});

		var macrosWin = new Ext.Window({
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			tools:[
				{
				    type: 'help',
				    tooltip: getText('Get Help'),
				    callback: function(panel, tool, event) {
				        showURL("/macros");
				    }
				}
			],
			modal: true,
			stateful: is_editor && (! is_embed),
			stateId: "macros_window",
			width: Math.min(Ext.getBody().getViewSize().width, 540),
			height: Math.min(Ext.getBody().getViewSize().height, 450),
			title: getText("Insight Macros"),
			resizable: true,
			maximizable: true,
			closeAction: 'destroy',
			plain: true,
			items: [
				equationEditor,
				
				 {
					xtype: "box",
					padding: 8,
					style:{
						"border-top": "solid 1px lightgrey"
					},
					html: "<b>"+getText('Example Macros') + "</b> (<a href='//insightmaker.com/macros' target='_blank'>More</a>)<br>g <- {9.80665 meters/seconds^2} # Custom Variable<br/>TemperatureFtoC(f) <- (f+32)*5/9 # Custom Function<br/>"
				}
			],

			buttons: [{
					scale: "large",
					glyph: 0xf05c,
					text: getText('Cancel'),
					handler: function() {
						macrosWin.close();
					}
				}, {
					glyph: 0xf00c,
					scale: "large",
					text: getText('Apply'),
					handler: function() {

						graph.getModel().beginUpdate();

						var edit = new mxCellAttributeChange(
							getSetting(), "Macros", Ext.getCmp('macroTxt').getValue());
						graph.getModel().execute(edit);

						graph.getModel().endUpdate();

						macrosWin.close();

					}
				}

			]
		});
	
	macrosWin.show();

	equationEditor.focus(true, true);
	equationEditor.editor.focus();
	setTimeout(function(){
		equationEditor.editor.focus();
	}, 200);
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
	ribbonPanel.down("#scratchpad").setChecked(scratchPadStatus=="shown");
};

var editActions = [];

editActions.copy = {
	hidden: is_ebook,
	itemId: 'copy',
	text: getText('Copy'),
	glyph: 0xf0c5,
	tooltip: getText('Copy') + ' ' + cmd("C"),
	handler: function() {
		mxClipboard.copy(graph);
		clipboardListener();
	},
	scope: this
};

editActions.cut = {
	hidden: is_ebook,
	itemId: 'cut',
	text: getText('Cut'),
	glyph: 0xf0c4,
	tooltip: getText('Cut') + ' ' + cmd("X"),
	handler: function() {
		mxClipboard.cut(graph);

		clipboardListener();

	},
	scope: this
};

editActions.paste = {
	hidden: is_ebook,
	text: getText('Paste'),
	glyph: 0xf0ea,
	tooltip: getText('Paste') + ' ' + cmd("V"),
	itemId: 'paste',
	handler: function() {
		mxClipboard.paste(graph);

		clipboardListener();

	},
	scope: this
};

editActions["delete"] = {
	itemId: 'delete',
	text: getText('Delete'),
	glyph: 0xf00d,
	tooltip: getText('Delete primitive'),
	handler: function() {
		graph.removeCells(graph.getSelectionCells(), false);
	},
	scope: this
};

var sizeCombo;
var fontCombo;
var RibbonPanel = function(graph, mainPanel, configPanel) {
	Ext.Ajax.timeout = 60000;

	var imageMenu = {
		xtype: "menu",
		iconsCls: "picture-icon",
		items: ["Growth", "Balance", 'Positive Feedback Clockwise', 'Positive Feedback Counterclockwise', 'Negative Feedback Clockwise', 'Negative Feedback Counterclockwise', 'Unknown Feedback Clockwise', 'Unknown Feedback Counterclockwise', 'Plus', 'Minus', 'Forwards', "Reload", "Play", "Pause", "Stop", "Info", 'Question', 'Warning', 'Checkmark', 'Prohibited', 'Idea', "Home", 'Book', 'Clock', 'Computer', 'Dice', 'Cards', 'Gear', 'Hammer', 'Smiley', 'Heart', 'Key', 'Lock', 'Loudspeaker', 'Footprints', 'Mail', 'Network', 'Notes', 'Paint', 'Pushpin', 'Paperclip', 'People', 'Person', 'Wallet', 'Money', 'Flag', 'Star', 'Rocket', 'Alarm', 'Beaker', 'Ball', 'Hat', 'List', 'Bolt', 'Cookie', 'Plugin', 'Monitor', 'Telescope', 'Chalkboard', 'Open', 'Trash'].map(function(x) {
			return {
				text: '<center><div class="x-combo-list-item" style=\"white-space:normal\";><img src="' + builder_path + '/images/SD/' + x + '.png" width=48 height=48/></div></center>',
				handler: function() {
					setImage(getSelected(), x);
				}
			}
		})

	}


	var colors = ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080", "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696", "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "6482B9", "993366", "C0C0C0", "FF99CC", "FDCDAC", "FFFF99", "B3E2CD", "CCFFFF", "A6D3F8", "CC99FF", "FFFFFF"];
	var fillColorMenu = [{
		xtype: 'colorpicker',
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
				
				if(document.activeElement && document.activeElement.blur){
					document.activeElement.blur()
				}
			}
		}
	},
	"-",
	{
		text: getText("Custom Color") + "...",
		handler: customColor(function(color){
			graph.getModel().beginUpdate();
			graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, color, excludeType(graph.getSelectionCells(), "Ghost"));
			var p = graph.getSelectionCells(),
				cells = [];
			for (var i = 0; i < p.length; i++) {
				if (p[i].value.nodeName == "Link" || p[i].value.nodeName == "Flow") {
					cells.push(p[i]);
				}
			}
			graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, color, cells, excludeType(graph.getSelectionCells(), "Ghost"));

			if (graph.isSelectionEmpty()) {
				graph.getModel().execute(new mxCellAttributeChange(getSetting(), "BackgroundColor",  color));
				loadBackgroundColor();
			}

			graph.getModel().endUpdate();
		})
	},
	{
		text: getText('No Fill Color'),
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
	},
	"-",
	{
		text: getText("Shape"),
		menu: [
			{
				text: getText('Rectangle'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_RECTANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RECTANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},
			{
				text: getText('Ellipse'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_ELLIPSE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_ELLIPSE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},
			{
				text: getText('Cylinder'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_CYLINDER, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RECTANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},

			{
				text: getText('Cloud'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_CLOUD, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RECTANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},

			/*{
				text: getText('Actor'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_ACTOR, excludeType(graph.getSelectionCells(), "Ghost"));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RECTANGLE, excludeType(graph.getSelectionCells(), "Ghost"));
				}
			},
			{
				text: getText('Arrow'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_ARROW, excludeType(graph.getSelectionCells(), "Ghost"));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RECTANGLE, excludeType(graph.getSelectionCells(), "Ghost"));
				}
			},*/
			{
				text: getText('Hexagon'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_HEXAGON, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_HEXAGON, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},
			{
				text: getText('Diamond'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_RHOMBUS, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_RHOMBUS, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			},
			{
				text: getText('Triangle'),
				handler: function() {
					graph.setCellStyles(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_TRIANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
					graph.setCellStyles(mxConstants.STYLE_PERIMETER, mxConstants.PERIMETER_TRIANGLE, excludeType(graph.getSelectionCells(), ["Ghost", "Flow", "Link", "Transition"]));
				}
			}
		]
	},
	"-",
	{
		text: getText('Rounded Corners'),
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_ROUNDED, 1, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	},
	{
		text: getText('Sharp Corners'),
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_ROUNDED, 0, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	}];
	
	
	function customColor(fn){
		return function(){
			getCustomColor(function(col){
				fn(col);
			});
		}
	}
	
	var fontColorMenu = [
		{
				xtype: 'colorpicker',
				colors: colors,
				allowReselect: true,
				handler: function(cm, color) {
					if (typeof(color) == "string") {
						graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, '#' + color, excludeType(graph.getSelectionCells(), "Ghost"));
					}
					if(document.activeElement && document.activeElement.blur){
						document.activeElement.blur()
					}
				}
			},
			'-',
			{
					text: getText("Custom Color") + "...",
					handler: customColor(function(color){graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, color, excludeType(graph.getSelectionCells(), "Ghost"))})
				}
	];
	
	var widthMenu = [];

	function widthItem(size) {
		widthMenu.push({
			text: getText('Width: %s', size),
			handler: function() {
				graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, size, excludeType(graph.getSelectionCells(), "Ghost"));
				graph.setCellStyles(mxConstants.ARROW_SIZE, size * 10, excludeType(graph.getSelectionCells(), "Ghost"));
			}
		});
	}
	for (var i = 1; i <= 10; i++) {
		widthItem(i);
	}
	for (var i = 15; i <= 50; i += 5) {
		widthItem(i);
	}
	
	function capMenu(start) {

		function createSetter(val) {
			return function() {
				if (start) {
					graph.setCellStyles(mxConstants.STYLE_STARTARROW, val, excludeType(graph.getSelectionCells(), "Ghost"));
				} else {
					graph.setCellStyles(mxConstants.STYLE_ENDARROW, val, excludeType(graph.getSelectionCells(), "Ghost"));
				}
			}
		}
		var items = [
			["None", mxConstants.NONE],
			'-', ["Regular Arrow", mxConstants.ARROW_CLASSIC],
			["Block Arrow", mxConstants.ARROW_BLOCK],
			["Open Arrow", mxConstants.ARROW_OPEN],
			["Diamond", mxConstants.ARROW_DIAMOND],
			["Thin Diamond", mxConstants.ARROW_DIAMOND_THIN],
			["Oval", mxConstants.ARROW_OVAL]
		];

		for (var i = 0; i < items.length; i++) {
			if (items[i] !== "-") {
				items[i] = {
					text: items[i][0],
					handler: createSetter(items[i][1])
				}
			}
		}
		return items;
	}
	
	
	var lineColorMenu =  [{
		xtype: 'colorpicker',
		colors: colors,
		allowReselect: true,
		handler: function(cm, color) {
			if (typeof(color) == "string") {
				graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, '#' + color, excludeType(graph.getSelectionCells(), "Ghost"));
			}
			if(document.activeElement && document.activeElement.blur){
				document.activeElement.blur()
			}
		}
	},
	"-",
	{
		text: getText("Custom Color") + "...",
		handler: customColor(function(color){
			graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, color, excludeType(graph.getSelectionCells(), "Ghost"));
		})
	},
	{
		text: getText('No Line Color'),
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, mxConstants.NONE, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	},
	"-",
	{
		text: getText('Solid Line'),
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_DASHED, 0, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	},
	{
		text: getText('Dashed Line'),
		handler: function() {
			graph.setCellStyles(mxConstants.STYLE_DASHED, 1, excludeType(graph.getSelectionCells(), "Ghost"));
		}
	},
	"-",
	{
		text: getText('Line Width'),
		menu: {
			items: widthMenu
		}
	},
	"-",
	{
		text: getText('Line Start'),
		menu: {
			items: capMenu(true)
		}
	},
	{
		text: getText('Line End'),
		menu: {
			items: capMenu(false)
		}
	}];



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

	fontCombo = {
		xtype: "combobox",
		store: fonts,
		itemId: 'fontCombo',
		iconCls: "font-family-icon",
		displayField: 'label',
		valueField: 'font',
		queryMode: 'local',
		width: 120,
		colspan: 3,
		triggerAction: 'all',
		emptyText: getText('Font Family...'),
		selectOnFocus: true,
		listeners: {
			select: function(p, entry) {
				if (entry != null) {
					graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, p.getValue(), excludeType(graph.getSelectionCells(), "Ghost"));
				}
			},
			specialkey: function(field, evt) {
				if (evt.keyCode == 10 || evt.keyCode == 13) {
					var family = field.getValue();

					if (family != null && family.length > 0) {
						graph.setCellStyles(mxConstants.STYLE_FONTFAMILY, family, excludeType(graph.getSelectionCells(), "Ghost"));
						this.setValue(family);
					}
				}
			}
		}
	};


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

	sizeCombo = {
		xtype: "combobox",
		colspan: 2,
		store: sizes,
		itemId: 'sizeCombo',
		iconCls: "font-size-icon",
		displayField: 'label',
		valueField: 'size',
		queryMode: 'local',
		width: 50,
		triggerAction: 'all',
		emptyText: 'Font Size...',
		selectOnFocus: true,
		listeners: {
			select: function(p, entry) {
				if (entry != null) {
					graph.setCellStyles(mxConstants.STYLE_FONTSIZE, p.getValue(), excludeType(graph.getSelectionCells(), "Ghost"));
				}
			},
			specialkey:   function(field, evt) {
				if (evt.keyCode == 10 || evt.keyCode == 13) {
					var size = parseInt(field.getValue());

					if (!isNaN(size) && size > 0) {
						this.setValue(size);
						graph.setCellStyles(mxConstants.STYLE_FONTSIZE, size, excludeType(graph.getSelectionCells(), "Ghost"));
					}
				}
			}
		}
	};


	window.zoomMenu = {
		items: [{
			text: '400%',
			scope: this,
			handler: function(item) {
				setZoom(4);
			}
		}, {
			text: '200%',
			scope: this,
			handler: function(item) {
				setZoom(2);
			}
		}, {
			text: '150%',
			scope: this,
			handler: function(item) {
				setZoom(1.5);
			}
		}, {
			text: '100%',
			scope: this,
			handler: function(item) {
				setZoom(1);
			}
		}, {
			text: '75%',
			scope: this,
			handler: function(item) {
				setZoom(0.75);
			}
		}, {
			text: '50%',
			scope: this,
			handler: function(item) {
				setZoom(0.5);
			}
		}, {
			text: '25%',
			scope: this,
			handler: function(item) {
				setZoom(0.25);
			}
		}, '-', {
			text: getText('Zoom In'),
			glyph: 0xf00e,
			scope: this,
			handler: function(item) {
				setZoom("in");
			}
		}, {
			text: getText('Zoom Out'),
		    glyph: 0xf010,
			scope: this,
			handler: function(item) {
				setZoom("out");
			}
		}, '-', {
			text: getText('Actual Size'),
			
			scope: this,
			handler: function(item) {
				setZoom("actual");
			}
		}, {
			text: getText('Fit Window'),
			scope: this,
			handler: function(item) {
				setZoom("fit");
			}
		}]
	};
	

	window.styleMenu = [

		fontCombo,

		sizeCombo,

		{
			itemId: 'fontcolor',
			text: 'Font Color',
			tooltip: getText('Font Color'),
			iconCls: 'fontcolor-icon',
			menu: fontColorMenu
		}, {
			itemId: 'linecolor',
			text: 'Line',
			tooltip: getText('Line Style'),
			iconCls: 'linecolor-icon',
			menu: lineColorMenu
		}, {
			itemId: 'fillcolor',
			text: 'Fill',
			tooltip: getText('Fill Color'),
			iconCls: 'fillcolor-icon',
			menu: fillColorMenu
		}, '-', {
			itemId: 'bold',
			xtype: 'menucheckitem',
			text: 'Bold',
			glyph: 0xf032,
			tooltip: getText('Bold') + ' ' + cmd("B"),
			handler: function() {
				graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, excludeType(graph.getSelectionCells(), "Ghost"));
				setStyles();
			},
			scope: this
		}, {
			itemId: 'italic',
			xtype: 'menucheckitem',
			text: 'Italic',
			tooltip: getText('Italic') + ' ' + cmd("I"),
			glyph: 0xf033,
			handler: function() {
				graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC, excludeType(graph.getSelectionCells(), "Ghost"));
				setStyles();
			},
			scope: this
		}, {
			itemId: 'underline',
			xtype: 'menucheckitem',
			text: 'Underline',
			tooltip: getText('Underline') + ' ' + cmd("U"),
			glyph: 0xf0cd,
			handler: function() {
				graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE, excludeType(graph.getSelectionCells(), "Ghost"));
				setStyles();
			},
			scope: this
		}, {
			itemId: 'align',
			text: 'Align',
			glyph: 0xf036,
			tooltip: getText('Label Position'),
			handler: function() {},
			menu: {
				items: [{
					text: getText('Align Left'),
					scope: this,
					iconCls: 'left-icon',
					handler: function() {
						graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT, excludeType(graph.getSelectionCells(), "Ghost"));
					}
				}, {
					text: getText('Align Center'),
					scope: this,
					iconCls: 'center-icon',
					handler: function() {
						graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, excludeType(graph.getSelectionCells(), "Ghost"));
					}
				}, {
					text: getText('Align Right'),
					scope: this,
					iconCls: 'right-icon',
					handler: function() {
						graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT, excludeType(graph.getSelectionCells(), "Ghost"));
					}
				}, '-', {
					text: getText('Position Middle'),
					scope: this,
					iconCls: 'middle-icon',
					handler: function() {
						var cells = excludeType(getSelected(), "Ghost");
						graph.getModel().beginUpdate();
						for (var i = 0; i < cells.length; i++) {
							if (isDefined(cells[i].getAttribute("LabelPosition"))) {
								var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Middle");
								graph.getModel().execute(edit);
								setLabelPosition(cells[i]);
							}
						}
						graph.getModel().endUpdate();

					}
				}, {
					text: getText('Position Top'),
					
					scope: this,
					iconCls: 'top-icon',
					handler: function() {
						var cells = excludeType(getSelected(), "Ghost");
						graph.getModel().beginUpdate();
						for (var i = 0; i < cells.length; i++) {
							if (isDefined(cells[i].getAttribute("LabelPosition"))) {
								var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Top");
								graph.getModel().execute(edit);
								setLabelPosition(cells[i]);
							}
						}
						graph.getModel().endUpdate();

					}
				}, {
					text: getText('Position Right'),
					scope: this,
					iconCls: 'left-icon',
					handler: function() {
						var cells = excludeType(getSelected(), "Ghost");
						graph.getModel().beginUpdate();
						for (var i = 0; i < cells.length; i++) {
							if (isDefined(cells[i].getAttribute("LabelPosition"))) {
								var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Right");
								graph.getModel().execute(edit);
								setLabelPosition(cells[i]);
							}
						}
						graph.getModel().endUpdate();

					}
				}, {
					text: getText('Position Bottom'),
					scope: this,
					iconCls: 'bottom-icon',
					handler: function() {
						var cells = excludeType(getSelected(), "Ghost");
						graph.getModel().beginUpdate();
						for (var i = 0; i < cells.length; i++) {
							if (isDefined(cells[i].getAttribute("LabelPosition"))) {
								var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Bottom");
								graph.getModel().execute(edit);
								setLabelPosition(cells[i]);
							}
						}
						graph.getModel().endUpdate();

					}
				}, {
					text: getText('Position Left'),
					
					scope: this,
					iconCls: 'right-icon',
					handler: function() {
						var cells = excludeType(getSelected(), "Ghost");
						graph.getModel().beginUpdate();
						for (var i = 0; i < cells.length; i++) {
							if (isDefined(cells[i].getAttribute("LabelPosition"))) {
								var edit = new mxCellAttributeChange(cells[i], "LabelPosition", "Left");
								graph.getModel().execute(edit);
								setLabelPosition(cells[i]);
							}
						}
						graph.getModel().endUpdate();

					}
				}]
			}
		}, '-', {
			itemId: 'movemenu',
			text: 'Order',
			tooltip: getText('Change Order'),
			glyph: 0xf0c9,
			handler: function() {},
			menu: {
				itemOd: 'move-menu',
				cls: 'move-menu',
				items: [{
					itemOd: 'moveback',
					text: getText('Move to Back'),
					iconCls: 'back-icon',
					handler: function() {
						graph.orderCells(true);
					},
					scope: this
				}, {
					itemId: 'movefront',
					text: getText('Move to Front'),
					iconCls: 'front-icon',
					handler: function() {
						graph.orderCells(false);
					},
					scope: this
				}]
			}
		}, '-', {
			itemId: 'picturemenu',
			text: 'Primitive Picture',
			tooltip: getText('Adjust Picture'),
			glyph: 0xf03e,
			handler: function() {},
			menu: {
				itemId: 'picture-menu',
				items: [{
						text: "No Image",
						glyph: 0xf057,
						handler: function() {
							setImage(getSelected(), "None");
						}
					},
					'-', {
						text: "Custom Image",
						glyph: 0xf0c1,
						handler: function() {
							Ext.Msg.prompt("Image URL", "<p>You may use a link to an existing custom image stored on-line. Please note that the image is only stored as a link within Insight Maker so you need to ensure that the original image stays on-line for it to remain in your model.</p><p>Enter the full URL to the image:</p>", function(btn, val) {
								if (btn == "ok") {
									setImage(getSelected(), val);
								}
							}, null, false, (urlImage(getSelected()[0]) ? getSelected()[0].getAttribute("Image") : ""))
						}
					}, {
						text: getText("Built-In Images"),
						menu: imageMenu,
						glyph: 0xf03e
					},
					'-', {
						itemId: 'fliphitem',
						text: getText('Flip Horizontal'),
						iconCls: 'fliph-icon',
						handler: function() {
							var cells = excludeType(getSelected(), "Ghost");

							graph.getModel().beginUpdate();

							for (var i = 0; i < cells.length; i++) {
								if (isDefined(cells[i].getAttribute("FlipHorizontal"))) {
									var edit = new mxCellAttributeChange(cells[i], "FlipHorizontal", !isTrue(cells[i].getAttribute("FlipHorizontal")));
									graph.getModel().execute(edit);
									setPicture(cells[i]);
								}
							}

							graph.getModel().endUpdate();

						},
						scope: this
					}, {
						itemId: 'flipvitem',
						text: getText('Flip Vertical'),
						iconCls: 'flipv-icon',
						handler: function() {
							var cells = excludeType(getSelected(), "Ghost");
							graph.getModel().beginUpdate();
							for (var i = 0; i < cells.length; i++) {
								if (isDefined(cells[i].getAttribute("FlipVertical"))) {
									var edit = new mxCellAttributeChange(cells[i], "FlipVertical", !isTrue(cells[i].getAttribute("FlipVertical")));
									graph.getModel().execute(edit);
									setPicture(cells[i]);
								}
							}
							graph.getModel().endUpdate();

						},
						scope: this
					}
				]
			}
		},
		'-',
		{
			itemId: 'useAsDefaultStyle',
			text: getText('Use as Default Style'),
			glyph: 0xf043,
			handler: function() {
				var cells = getSelected();
				
				var stylesheet = getStyleSheet();
				
				cells.forEach(function(x){
					var style = x.getStyle();
					var styles = style.split(";");
					var obj = {};
					
					var o2 = graph.getStylesheet().getCellStyle(x.value.nodeName.toLowerCase());
					
					for(var item in o2){
						obj[item] = o2[item];
					}
					
					for(var i = 1; i < styles.length; i++){
						var kv = styles[i].split("=");
						obj[kv[0]] = kv[1];
					}
					
					stylesheet[x.value.nodeName] = obj;
				});
				

				graph.getModel().beginUpdate();
				setStyleSheet(stylesheet);
				graph.getModel().endUpdate();
				
				loadStyleSheet();
			},
			scope: this
		},
		{
			excludeFromContext: true,
			itemId: 'styleManagerMenu',
			text: getText('Style Sheet Manager'),
			glyph: 0xf1c0,
			handler: showStyleManager
		}
	];



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
			items: FileMenu,
				{
					hidden: (!viewConfig.primitiveGroup),
					text: getText('Add Primitive'),
					itemId: 'valued',
					iconCls: 'green-icon',
					glyph: 0xf055,
					menu: [{
							xtype: "component",
							indent: false,
							html: "<b>" + getText('System Dynamics') + "</b>",
							disabled: true,
							style: {
								"margin": "10px 5px 10px 5px"
							}
						}, '-', {
							itemId: 'stock',
							text: getText('Add Stock'),
							glyph: 0xf1b2,
							tooltip: getText('Stocks store material'),
							handler: function() {
								var x = createPrimitive("New Stock", "Stock", [240, 80], [100, 40]);
								highlight(x);

								graph.orderCells(false);

								//setTimeout(function(){graph.cellEditor.startEditing(x)},20);
							}
						}, {
							itemId: 'variable',
							text: getText('Add Variable'),
							glyph: 0xf0e4,
							tooltip: getText('Variables can be constant or dynamically updated equations'),
							handler: function() {
								highlight(createPrimitive("New Variable", "Variable", [240, 80], [120, 50]))

								graph.orderCells(false);
							}
						}, {
							itemId: 'converter',
							text: getText('Add Converter'),
							glyph: 0xf1fe,
							tooltip: getText('Converters can contain graphical functions or input/output tables'),
							handler: function() {
								highlight(createPrimitive("New Converter", "Converter", [240, 80], [120, 50]))

								graph.orderCells(false);
							}
						}, '-', {
							xtype: "component",
							indent: false,
							html: "<b>" + getText('Agent Based Modeling') + "</b>",
							disabled: true,
							style: {
								"margin": "10px 5px 10px 5px"
							}
						}, '-', {
							itemId: 'population',
							glyph: 0xf0c0,
							text: getText('Add Agent Population'),
							tooltip: getText('Agent populations are a collection of agents'),
							handler: function() {
								highlight(createPrimitive("Agent Population", "Agents", [240, 80], [170, 80]))

								graph.orderCells(false);
							}
						}, {
							itemId: 'state',
							glyph: 0xf046,
							text: getText('Add State'),
							tooltip: getText('States are binary, true/false variables'),
							handler: function() {
								highlight(createPrimitive("New State", "State", [240, 80], [100, 40]))
							}
						}, {
							itemId: 'action',
							glyph: 0xf0e7,
							text: getText('Add Action'),
							tooltip: getText('Actions can trigger a change in the model state'),
							handler: function() {
								highlight(createPrimitive("New Action", "Action", [240, 80], [120, 50]))

								graph.orderCells(false);
							}
						},
						'-', {

							xtype: "component",
							indent: false,
							html: "<b>" + getText('User Interface') + "</b>",
							disabled: true,
							style: {
								"margin": "10px 5px 10px 5px"
							}
						},
						'-', {
							itemId: 'text',
							text: getText('Add Text Field'),
							glyph: 0xf035,
							tooltip: getText('Annotate your model'),
							handler: function() {
								highlight(createPrimitive("New Text", "Text", [240, 80], [200, 50]))

								graph.orderCells(false);
							}
						}, {
							itemId: 'picture',
							text: getText('Add Picture'),
							glyph: 0xf03e,
							tooltip: getText('Illustrate your model'),
							handler: function() {
								var x = createPrimitive("", "Picture", [240, 80], [64, 64]);
								setPicture(x);
								highlight(x);

								graph.orderCells(false);
							}
						}, {
							itemId: 'buttonBut',
							text: getText('Add Interactive Button'),
							glyph: 0xf196,
							tooltip: getText('Add interactivity to the model diagram'),
							handler: function() {
								highlight(createPrimitive("New Button", "Button", [240, 80], [120, 40]))

								graph.orderCells(false);
							}

						}, '-', {
							itemId: 'ghostBut',
							text: getText('Ghost Primitive'),
							glyph: 0xf0c5,
							tooltip: getText('Create a linked alias of the selected primitive which can help you organize your model'),
							scope: this,
							handler: makeGhost
						}, {
							itemId: 'folder',
							text: getText('Make Folder'),
							glyph: 0xf114,
							tooltip: getText('Create a new Folder containing the selected primitives'),
							scope: this,
							handler: makeFolder
						}

					]
				}, {
					xtype: 'tbseparator',
					hidden: (!is_editor) || is_embed
				},
				{
					hidden: (!viewConfig.connectionsGroup),
					xtype: "segmentedbutton",
					items: [
					{
						//glyph: 0xf0d1,
						//iconCls: 'green-icon',
						text: 'Flows/Transitions',
						id: "connect",
						pressed: true,
						tooltip: "Use flows or transitions to connect primitives. Select a primitive and drag the arrow that appears over the primitive to make a connection. Flows transfer material. Transitions switch between states."
					},
					{
						//glyph: 0xf095,
						//iconCls: 'green-icon',
						text: 'Links',
						tooltip: "Use links to connect primitives. Select a primitive and drag the arrow that appears over the primitive to make a connection. Links transfer information."
					}
					]
				}, /*{
					hidden: (!viewConfig.connectionsGroup),
					text: getText('Using Flows/Transitions'),
					id: 'connect',
					iconCls: 'green-icon',
					glyph: 0xf0d1,
					//iconCls: 'flow-small-icon',//f043
					tooltip: "The method used in new connections to connect primitive. Select a primitive and drag the arrow that appears to make a connection. Flows transfer material. Links transfer information.",
					handler: function() {
						var flow = (connectionType() == "Flow");
						if (flow) {
							Ext.getCmp("connect").setText("Using Information Links");
							Ext.getCmp("connect").setGlyph(0xf095);
						} else {
							Ext.getCmp("connect").setText("Using Flows/Transitions");
							Ext.getCmp("connect").setGlyph(0xf0d1);
						}
					},
					scope: this

				}*/, {
					itemId: 'reverse',
					hidden: (!viewConfig.connectionsGroup),
					glyph: 0xf0ec,
					tooltip: getText('Reverse connection direction'),
					handler: reverseDirection,
					scope: this
				}, {
					xtype: 'tbseparator',
					hidden: (!is_editor) || is_embed
				}, 
				{
					itemId: 'config',
					text: getText('Settings'),
					glyph: 0xf017,
					tooltip: getText('Configure time start and stop') + ' ' + cmd("L"),
					handler: timeSettingsFn,
					scope: this
				},
				'-', {
					hidden: (!viewConfig.saveEnabled),
					text: getText('Save'),
					glyph: 0xf0c7,
					tooltip: getText('Save Insight') + ' ' + cmd("S"),
					itemId: 'savebut',
					handler: function() {
						saveModel();
					},
					scope: this

				}, {

					itemId: 'run',
					text: getText('Simulate'),
					iconCls: 'blue-icon',
					glyph: 0xf01d,
					tooltip: getText('Run') + ' ' + cmd("Enter"),
					handler: function(me, evt) {
						runModel();
					},
					scope: this
				},

				'->',

				/*{
					hidden: (!is_editor) || is_embed || is_ebook,
					text: getText(''),
					glyph: 0xf059,
					tooltip: getText("Insight Maker Help"),
					handler: function() {
						showURL("//insightmaker.com/help")
					},
					scope: this
				}, {
					xtype: 'tbseparator',
					hidden: !viewConfig.actionsGroup
				},*/

				{
					hidden: (!viewConfig.actionsGroup),
					text: getText('Edit'),
					itemId: 'actions',
					menu: [
				    	{
		   					hidden: !viewConfig.actionsGroup,
		   					itemId: 'undo',
		   					text: "Undo",
		   					glyph: 0xf0e2,
		   					tooltip: getText('Undo change') + ' ' + cmd("Z"),
		   					handler: function() {
		   						undoHistory.undo();
		   					},
		   					scope: this
		   				}, {
		   					hidden: !viewConfig.actionsGroup,
		   					itemId: 'redo',
		   					text: "Redo",
		   					glyph: 0xf01e,
		   					tooltip: getText('Redo change') + ' ' + cmd("Y"),
		   					handler: function() {
		   						undoHistory.redo();
		   					},
		   					scope: this
		   				},
						'-',
						editActions.copy,
						editActions.cut,
						editActions.paste,
						'-',
						editActions["delete"],
						'-', {
							text: getText('Find/Replace...'),
							tooltip: getText('Find text in your model') + ' ' + cmd("F"),
							handler: showFindAndReplace
						}, {
							text: getText('Find Next'),
							tooltip: getText('Find the next occurrence of text in your model') + ' ' + cmd("G"),
							handler: function() {
								var but = Ext.getCmp('findNextBut');
								if (but && (!but.disabled)) {
									findNext();
								}
							}
						}, '-', {
							text: getText("Print..."),
							glyph: 0xf02f,
							handler: printGraph
						},
						'-', {
							itemId: "zoomMenuButton",
							text: getText('Zoom'),
							glyph: 0xf002,
							menu: zoomMenu
						},
						{
							text: getText('Layout Diagram'),
							glyph: 0xf0e8,
							menu: [
						        {
						            text: getText('Vertical Hierarchical Layout'),
						            scope: this,
						            handler: function(item)
						            {
						                var layout = new mxHierarchicalLayout(graph);
						                executeLayout(layout, true);
						            }
						        },
						        {
						            text: getText('Horizontal Hierarchical Layout'),
						            scope: this,
						            handler: function(item)
						            {
						                var layout = new mxHierarchicalLayout(graph,
						                mxConstants.DIRECTION_WEST);
						                executeLayout(layout, true);
						            }
						        }, '-', {
										text: getText('Organic Layout'),
										scope: this,
										handler: function(item) {
											layoutModel("organic");
										}
									}, {
										text: getText('Circle Layout'),
										scope: this,
										handler: function(item) {
											layoutModel("circular");
										}
									}
							]
						}
					]
				},{
					hidden: (!viewConfig.styleGroup),
					text: getText('Style'),
					itemId: 'style',
					menu: styleMenu/*,
					glyph: 0xf0d0*/
				}, {
					xtype: 'tbseparator',
					hidden: !viewConfig.actionsGroup
				}, 
				{
					hidden: (!viewConfig.styleGroup),
					text: getText('Share'),
					itemId: 'share',
					menu: [{
							hidden: (!is_editor) || is_ebook,
							text: getText('Storytelling') + "...",
							glyph: 0xf0e6,
							tooltip: getText('Display the model step-by-step to tell a story'),
							handler: blockUnfold(showUnfoldingWin),
							scope: this
						},
						{
							hidden: (!is_editor) || is_ebook,
							text: getText('Publish Article') + "...",
							glyph: 0xf0f6,
							tooltip: getText('Create a crisp, static webpage of describing your model'),
							handler: blockUnfold(articleWindow),
							scope: this
						},
						 '-', {
							itemId: 'embed_but',
							text: getText('Embed in Webpage') + "...",
							hidden: (!is_editor) || is_ebook,
							glyph: 0xf0ac,
							tooltip: getText('Embed this Insight in another web page'),
							handler: function() {
								if (drupal_node_ID == -1) {
									Ext.MessageBox.show({
										title: getText('Save the Insight'),
										msg: getText('You must save this Insight before you can embed it.'),
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									});
								} else {

									Ext.MessageBox.show({
										title: getText('Embed'),
										msg: getText('To embed this Insight in another webpage (such as a blog or a private site), copy and paste the following code into the source HTML code of your webpage: %s', '<br/><br/><center><tt>&lt;IFRAME SRC="//InsightMaker.com/insight/' + drupal_node_ID + '/embed?topBar=1&sideBar=1&zoom=1" TITLE="Embedded Insight" width=600 height=420&gt;&lt;/IFRAME&gt;</tt></center><br/>'),
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.INFO
									});
								}
							},
							scope: this
						},
						'-', {
							hidden: (!is_editor),
							text: "Import",
							glyph: 0xf093,
							menu: [{
									text: getText("Insight Maker URL..."),
									handler: function() {
										showInsertModelWindow({
											x: 200,
											y: 100
										});
									}
								}, ImportMenu,
								{
									text: getText("XMILE File... <span style='color: #bbb'>(Experimental)<span>"),
									handler: importXMILE
								}

							]
						},  {
							hidden: (!is_editor),
							text: "Export",
							glyph: 0xf019,
							menu: [ExportMenu,
								{
									/*hidden: (!is_editor),*/
									itemId: 'textBut',
									text: getText('Complete Equation List'),
									/*glyph: 0xf03a,*/
									tooltip: getText('A listing of all equations in the Insight'),
									handler: textEquations,
									scope: this
								},
								{
									glyph: 0xf1c5,
									text: getText("Export Diagram as SVG"),
									handler: function() {
										exportSvg();
									}
								}

							]
						}
					],
					glyph: 0xf1e0
				},
				 {

					hidden: (!viewConfig.toolsGroup),
					text: getText('Tools'),
					itemId: "configgroup",
					glyph: 0xf0ad,
					menu: [{
							itemId: 'scratchpad',
							text: getText('Scratchpad'),
							glyph: 0xf040,
							tooltip: getText('Draw notes on your diagram') + ' ' + cmd("K"),
							enableToggle: true,
							handler: scratchpadFn,
							xtype: 'menucheckitem',
							scope: this
						}, 
						{
							xtype: 'menuseparator',
							hidden: (!is_editor) || is_ebook
						}, {
							text: getText('Identify Loops') + "...",
							glyph: 0xf1ce,
							tooltip: getText('Identify Loops in the Diagram'),
							handler: doLoops,
							scope: this
						},{
							text: getText('Compare Results') + "...",
							glyph: 0xf02c,
							tooltip: getText('Compare Separate Simulation Runs'),
							handler: function(){
								var sum = 0;
								
								Ext.WindowMgr.each(
								      function(win){
											var t = win.down("#pinTool");
											if(t){
												sum++;
											}
										}
								  );
								  if(sum < 2){
									  showNotification(getText("You must have at least two open simulation results windows to do a comparison."), "notice", true);
								  }else{
	  								doCompare();
								  }
							},
							scope: this
						}, {
							xtype: 'menuseparator',
							hidden: (!is_editor) || is_ebook
						}, {
							itemId: 'sensitivityBut',
							text: getText('Sensitivity Testing') + "...",
							glyph: 0xf201,
							tooltip: getText('Model sensitivity testing'),
							handler: doSensitivity,
							scope: this
						}, {
							itemId: 'optimizeBut',
							text: getText('Optimization & Goal Seek') + "...",
							glyph: 0xf140,
							tooltip: getText('Optimize model parameters'),
							handler: doOptimizer,
							scope: this

						}, {
							xtype: 'menuseparator',
							hidden: (!is_editor) || is_ebook
						}, {
							hidden: (!is_editor) || is_embed || is_ebook,
							itemId: 'macroBut',
							text: getText('Macros & Variables') + "...",
							glyph: 0xf1c9,
							tooltip: getText('Edit macro functions and constants for use anywhere in your equations'),
							handler: showMacros,
							scope: this
						}



					]
				}, {
					hidden: is_editor,
					cls: 'button',
					text: getText('Zoom'),
					glyph: 0xf002,
					tooltip: getText('Zoom Diagram'),
					itemId: 'zoomlargebutgrouped',
					handler: function(menu) {},
					menu: zoomMenu
				}, {
					hidden: is_ebook,
					cls: 'button',
					/*glyph: 0xf015,*/
					iconCls: 'icon-icon',
					href: '//InsightMaker.com',
					tooltip: 'Insight Maker Home'
				}
		})

	});
};
