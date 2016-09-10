"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


function getStyleSheet() {
	return JSON.parse(getSetting().getAttribute("StyleSheet"));
}

function setStyleSheet(style) {
	var edit = new mxCellAttributeChange(
		getSetting(), "StyleSheet",
		JSON.stringify(style));
	graph.getModel().execute(edit);
}

function loadStyleSheet() {

	var node = mxUtils.parseXml('<mxStylesheet> 	<add as="defaultVertex" extend="defaultVertex">  		<add as="strokeColor" value="#666666"/> 		<add as="fontColor" value="#333333"/>  <add as="overflow" value=""/> 		<add as="fontSize" value="14"/> 		<add as="fontFamily" value="Comic Sans MS"/> 		<add as="strokeWidth" value="2"/> 	</add> 	<add as="defaultEdge" extend="defaultEdge"> 		<add as="labelBackgroundColor" value="white"/> 		<add as="rounded" value="1"/> 		<add as="fontSize" value="14"/> 		<add as="edgeStyle" value="elbowEdgeStyle"/> 		<add as="fontFamily" value="Comic Sans MS"/> 		<add as="strokeWidth" value="4"/> 	</add> 	<add as="stock" extend="defaultVertex"> 		<add as="fillColor" value="#A6D3F8"/> 	</add> 	<add as="state" extend="defaultVertex"> 	<add as="rounded" value="1"/> 	<add as="fillColor" value="#ffffff"/> 	</add> 	<add as="transition" extend="defaultEdge"> 		<add as="strokeColor" value="#000000"/> 		<add as="fontColor" value="#000000"/> 	</add> 	<add as="agents" extend="defaultVertex"> 		<add as="fillColor" value="#F0E68C"/> 		<add as="shape" value="cloud"/> 	</add> 	<add as="textArea" extend="defaultVertex"> 		<add as="strokeColor" value="none"/> 		<add as="fillColor" value="none"/> 		<add as="fontColor" value="black"/> 		<add as="fontSize" value="30"/> 		<add as="fontStyle" value="4"/> 	</add> 	<add as="text" extend="defaultVertex"> 		<add as="strokeColor" value="none"/> 		<add as="fillColor" value="none"/> 		<add as="fontColor" value="black"/> 		<add as="fontSize" value="30"/> 		<add as="fontStyle" value="4"/> 	</add> 	 	<add as="parameter" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FDCDAC"/> 	</add> 	<add as="variable" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FDCDAC"/> 	</add> 	<add as="action" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="perimeter" value="ellipsePerimeter"/> 		<add as="fillColor" value="#FFFFFF"/> 	</add> 	<add as="converter" extend="defaultVertex"> 		<add as="shape" value="hexagon"/> 	<add as="spacingLeft" value="20"/> <add as="spacingRight" value="20"/>	<add as="perimeter" value="hexagonPerimeter"/> 		<add as="fillColor" value="#B3E2CD"/> 	</add> 	<add as="button" extend="defaultVertex"> 		<add as="rounded" value="1"/> 		<add as="glass" value="1"/> 		<add as="fillColor" value="#C0C0C0"/> 		<add as="fontColor" value="black"/> 		<add as="strokeWidth" value="3"/> 		<add as="fontFamily" value="Helvetica"/> 	</add> 	<add as="display" extend="defaultVertex"> 		<add as="shape" value="ellipse"/> 		<add as="fillColor" value="#FFFFFF"/> 		<add as="strokeColor" value="#FFFFFF"/> 		<add as="fontColor" value="#FFFFFF"/> 		<add as="opacity" value="0"/> 	</add> 	<add as="picture" extend="defaultVertex"> 		<add as="shape" value="image"/> 		<add as="verticalLabelPosition" value="bottom"/> 		<add as="verticalAlign" value="top"/> 	</add> 	 	<add as="entity" extend="defaultEdge"> 		<add as="strokeColor" value="#808080"/> 		<add as="fontColor" value="#808080"/> 		<add as="opacity" value="70"/> 		<add as="edgeStyle" value="straight"/> 		<add as="strokeWidth" value="2"/> 		<add as="dashed" value="1"/> 		<add as="noLabel" value="0"/> 	</add> 	<add as="flow" extend="defaultEdge"> 	</add> 	<add as="link" extend="defaultEdge"> 		<add as="strokeColor" value="#808080"/> 		<add as="fontColor" value="#808080"/> 		<add as="opacity" value="70"/> 		<add as="edgeStyle" value="straight"/> 	<add as="curved" value="1"/> 	<add as="strokeWidth" value="2"/> 		<add as="dashed" value="1"/> 		<add as="noLabel" value="0"/> 	</add> 	 	<add as="line" extend="defaultVertex"> 		<add as="shape" value="line"/> 		<add as="strokeWidth" value="4"/> 		<add as="labelBackgroundColor" value="white"/> 		<add as="verticalAlign" value="top"/> 		<add as="spacingTop" value="8"/> 	</add> 	<add as="image" extend="defaultVertex"> 		<add as="shape" value="image"/> 		<add as="verticalLabelPosition" value="bottom"/> 		<add as="verticalAlign" value="top"/> 	</add> 	 	<add as="folder" extend="defaultVertex"> 		<add as="verticalAlign" value="top"/> 		<add as="dashed" value="1"/> 		<add as="fillColor" value="none"/> 		<add as="rounded" value="1"/> 	</add> </mxStylesheet> ');
	var dec = new mxCodec(node);
	dec.decode(node.documentElement, graph.getStylesheet());
	
	var stylesheet = getStyleSheet();
	for (var primitive in stylesheet) {
		graph.getStylesheet().putCellStyle(primitive.toLowerCase(), stylesheet[primitive]);
	}
	graph.refresh();
}

function showStyleManager() {
	var win = new Ext.Window({
		title: getText('Style Sheet Manager'),
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		closeAction: 'hide',
		border: false,
		modal: true,
		resizable: false,
		shadow: true,
		buttonAlign: 'left',
		layoutConfig: {
			columns: 1
		},
		width: 500,
		height: 310,
		items: [{
				xtype: "container",
				layout: {
					type: 'hbox',
					align: 'middle'
				},
				padding: 5,
				items: [{
					xtype: 'box',
					flex: 1
				}, {
					xtype: "button",
					text: getText("Download Style Sheet"),
					glyph: 0xf0ed,
					handler: function(){

						new mxXmlRequest(builder_path + "/download.php", $.param({
							name: "Insight Maker Style Sheet",
							"format": "json",
							"data": JSON.stringify(getStyleSheet())
						})).simulate(document, "_blank");
						
					},
					margin: 4
				}, {
					xtype: "button",
					text: getText("Load Style Sheet"),
					glyph: 0xf0ee,
					handler: function(){
						
						openFile({
							read: "text",
							multiple: false,
							onCompleted: function(result) {
								var json = JSON.parse(result.contents);
								
								setStyleSheet(json);
								loadStyleSheet();
								
						
								mxUtils.alert("The style sheet has been loaded.", "notice");
								win.close();
							}
						})
					},
					margin: 4
				}, {
					xtype: 'box',
					flex: 1
				}]
			}, {
				xtype: "box",
				margin: 9,
				html: "The style sheet controls the default appearence of primitives  in the insight. Select a primitive and choose 'Use as Default Style' to add its current styling to the style sheet. Properties like font, font size, and background color will be copied to other primitives of the same type. You can  download style sheets for sharing or reuse."
			}, {
				xtype: "container",
				layout: {
					type: 'hbox',
					align: 'middle'
				},
				padding: 5,
				items: [{
					xtype: 'box',
					flex: 1
				}, {
					xtype: "button",
					text: getText("Reset Style Sheet"),
					glyph: 0xf05e,
					handler: function(){

						graph.getModel().beginUpdate();
						setStyleSheet({});
						graph.getModel().endUpdate();
						
						loadStyleSheet();
						
						mxUtils.alert("The style sheet has been reset.", "notice");
				
					},
					margin: 4
				}, {
					xtype: 'box',
					flex: 1
				}]
			}


		],
		buttons: ['->', {
			scale: "large",
			glyph: 0xf00c,
			text: getText('Done'),
			handler: function() {
				win.close();
			}
		}]

	});


	win.show();
}
