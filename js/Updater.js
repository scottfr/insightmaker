"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/


function updateModel(){

	var mySetting = getSetting();

	if (mySetting.getAttribute("Version") < 3) {
		var converters = primitives("Converter");
		for (var i = 0; i < converters.length; i++) {
			var inps = converters[i].getAttribute("Inputs").split(",");
			var outs = converters[i].getAttribute("Outputs").split(",");
			var s = "";
			for (var j = 0; j < inps.length; j++) {
				if (j > 0) {
					s = s + ";";
				}
				s = s + inps[j] + "," + outs[j];
			}
			converters[i].setAttribute("Data", s);
		}
		mySetting.setAttribute("Version", 3);
	}
	if (mySetting.getAttribute("Version") < 4) {
		mySetting.setAttribute("SolutionAlgorithm", "RK1");
		mySetting.setAttribute("Version", 4)
	}

	if (mySetting.getAttribute("Version") < 5) {
		var stocks = primitives("Stock");
		for (var i = 0; i < stocks.length; i++) {
			stocks[i].setAttribute("NonNegative", false);
		}
		mySetting.setAttribute("Version", 5);
	}

	if (mySetting.getAttribute("Version") < 6) {
		var pictures = primitives("Picture");
		for (var i = 0; i < pictures.length; i++) {
			pictures[i].setAttribute("FlipHorizontal", false);
			pictures[i].setAttribute("FlipVertical", false);
		}
		mySetting.setAttribute("Version", 6);
	}

	if (mySetting.getAttribute("Version") < 7) {
		var links = primitives("Link");
		for (var i = 0; i < links.length; i++) {
			links[i].setAttribute("BiDirectional", false);
		}
		mySetting.setAttribute("Version", 7);
	}

	if (mySetting.getAttribute("Version") < 8) {
		var items = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"));
		for (var i = 0; i < items.length; i++) {
			items[i].setAttribute("Image", "None");
		}
		items = primitives("Display");
		for (var i = 0; i < items.length; i++) {
			items[i].setAttribute("Image", "Display");
		}
		mySetting.setAttribute("Version", 8);
	}

	if (mySetting.getAttribute("Version") < 9) {
		mySetting.setAttribute("BackgroundColor", "white");
		mySetting.setAttribute("Version", 9);
	}

	if (mySetting.getAttribute("Version") < 10) {
		var displays = primitives("Display");

		for (var i = 0; i < displays.length; i++) {
			displays[i].setVisible(false);
		}
		mySetting.setAttribute("Version", 10);
		graph.refresh()
	}

	if (mySetting.getAttribute("Version") < 11) {
		var cells = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"), primitives("Text"));

		if(! (graph instanceof SimpleNode)){
			graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, mxConstants.NONE, cells);
		}

		mySetting.setAttribute("Version", 11);
	}

	if (mySetting.getAttribute("Version") < 12) {
		var cells = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"));
		var pics = primitives("Picture");

		for (var i = 0; i < pics.length; i++) {
			pics[i].setAttribute("LabelPosition", "Bottom");
		}

		for (var i = 0; i < cells.length; i++) {
			cells[i].setAttribute("LabelPosition", "Middle");
		}

		mySetting.setAttribute("Version", 12);
	}

	if (mySetting.getAttribute("Version") < 13) {
		var items = primitives("Folder");
		for (var i = 0; i < items.length; i++) {
			items[i].setAttribute("Image", "None");
			items[i].setAttribute("LabelPosition", "Middle");
		}
		mySetting.setAttribute("Version", 13);
	}

	if (mySetting.getAttribute("Version") < 14) {
		var pictures = primitives("Stock").concat(primitives("Parameter"), primitives("Converter"), primitives("Folder"));
		for (var i = 0; i < pictures.length; i++) {
			pictures[i].setAttribute("FlipHorizontal", false);
			pictures[i].setAttribute("FlipVertical", false);
		}
		mySetting.setAttribute("Version", 14);
	}

	if (mySetting.getAttribute("Version") < 15) {
		var buttons = primitives("Button");
		for (var i = 0; i < buttons.length; i++) {
			var action = buttons[i].getAttribute("Function");
			action = action.replace(/getName/g, "findName");
			action = action.replace(/getType/g, "findType");
			action = action.replace(/getAll/g, "findAll");
			buttons[i].setAttribute("Function", action);
		}
		mySetting.setAttribute("Version", 15);
	}

	if (mySetting.getAttribute("Version") < 16) {
		var vars = primitives("Parameter");
		for (var i = 0; i < vars.length; i++) {
			vars[i].value = changeNodeName(vars[i].value, "Variable");
		}
		mySetting.setAttribute("Version", 16);
	}

	if (mySetting.getAttribute("Version") < 17) {
		mySetting.setAttribute("Throttle", -1);
		mySetting.setAttribute("Version", 17);
	}

	if (mySetting.getAttribute("Version") < 18) {
		var displays = primitives("Display");

		for (var i = 0; i < displays.length; i++) {
			displays[i].setAttribute("yAxis2", "");
			displays[i].setAttribute("Primitives2", "");
		}

		mySetting.setAttribute("Version", 18);

	}

	if (mySetting.getAttribute("Version") < 19) {
		mySetting.setAttribute("Macros", "");
		mySetting.setAttribute("Version", 19);
	}

	if (mySetting.getAttribute("Version") < 20) {
		var u = mySetting.getAttribute("Units");
		if (isDefined(u)) {
			mySetting.setAttribute("Units", u.replace(/,/g, "*"));
		}
		mySetting.setAttribute("Version", 20);
	}

	if (mySetting.getAttribute("Version") < 21) {
		var displays = primitives("Display");
		for (var i = 0; i < displays.length; i++) {
			if (displays[i].getAttribute('Type') == "Scatterplot") {
				displays[i].setAttribute("showMarkers", true);
				displays[i].setAttribute("showLines", false);
			} else {
				displays[i].setAttribute("showMarkers", false);
				displays[i].setAttribute("showLines", true);
			}
		}

		mySetting.setAttribute("Version", 21);
	}


	if (mySetting.getAttribute("Version") < 22) {

		mySetting.setAttribute("SensitivityPrimitives", "");
		mySetting.setAttribute("SensitivityRuns", 50);
		mySetting.setAttribute("SensitivityBounds", "50, 80, 95, 100");
		mySetting.setAttribute("SensitivityShowRuns", "false");

		mySetting.setAttribute("Version", 22);
	}

	if (mySetting.getAttribute("Version") < 23) {

		var obsolete = findValue([/\bmin\(\s*</i, /\bmax\(\s*</i, /\bmean\(\s*</i, /\bmedian\(\s*</i, /\bstddev\(\s*</i]);

		if (obsolete.length > 0) {
			if(window.Ext){
				var msg = '<p>Insight Maker has received an update that removes the need for the <i>&lt;Primitive&gt;</i> notation. You may now use the <i>[Primitive]</i> in place of it.</p> ';
				msg += '<br/><p>A side effect of this update is that the usage of the Min(), Max(), Mean(), Median() and StdDev() statistical functions for aggregating over a primitive\'s history have been renamed to PastMin(), PastMax(), etc... (the usage of these function for values is unchanged; e.g. Max(1, 4, 2) is still correct).</p>';
				msg += '<br/><p>To correct this you need to change equations like:</p>';
				msg += '<br/><b>Max(&lt;x&gt;)</b></p>';
				msg += '<br/>to</p>';
				msg += '<br/><b>PastMax([x])</b></p>';
				msg += '<br/><p>The following of your primitives appear to use these function and need to be updated to work correctly with this change. You can adjust their equations manually:</p>';
				msg += '<br/><p><b>' + Ext.Array.map(obsolete, function(x) {
					return x.getAttribute("name")
				}).join(", ") + '</b></p>';

				Ext.Msg.show({
					icon: Ext.MessageBox.WARNING,
					title: 'Model Update Required',
					msg: msg,
					buttons: Ext.MessageBox.OK
				});
			}
			

		}


		mySetting.setAttribute("Version", 23);
	}

	if (mySetting.getAttribute("Version") < 24) {
	
		var folders = primitives("Folder");
		for (var i = 0; i < folders.length; i++) {
			folders[i].setAttribute("Type", "None");
		}
	
		var displays = primitives("Display");
		for (var i = 0; i < displays.length; i++) {
			displays[i].setAttribute("showArea", false);
		}
	
		var texts = primitives("Text");
		for (var i = 0; i < texts.length; i++) {
			texts[i].setAttribute('LabelPosition', "Middle");
		}

		mySetting.setAttribute("Version", 24);
	}


	if (mySetting.getAttribute("Version") < 25) {
	
		if(!(graph instanceof SimpleNode )){
			setAllConnectable();
		}

		mySetting.setAttribute("Version", 25);
	}

	if (mySetting.getAttribute("Version") < 26) {
	
		var flows = primitives("Flow");
		for (var i = 0; i < flows.length; i++) {
			if(! (graph instanceof SimpleNode)){
		        if (! isTrue(flows[i].getAttribute("OnlyPositive"))) {
		            graph.setCellStyles(mxConstants.STYLE_STARTARROW, "block", [flows[i]]);
		            graph.setCellStyles("startFill", 0, [flows[i]]);
		        }
			}
	        
		}
	

		mySetting.setAttribute("Version", 26);
	}

	if (mySetting.getAttribute("Version") < 27) {
	
	
		var displays = primitives("Display");
		for (var i = 0; i < displays.length; i++) {
			displays[i].setAttribute("legendPosition", "Automatic");
		}
	
		mySetting.setAttribute("Version", 27);
	}

	if (mySetting.getAttribute("Version") < 28) {
	
		var items = primitives();
		for (var i = 0; i < items.length; i++) {
			if("ShowSlider" in items[i]){
				items[i].setAttribute("SliderStep", "");
			}
		}
	
		mySetting.setAttribute("Version", 28);
	}

	if (mySetting.getAttribute("Version") < 29) {

		var obsolete = excludeType(findValue(/[A-Za-z0-9_]\s+\(/i), "Button");
		if(window.Ext){
			if(viewConfig.allowEdits){
				if (obsolete.length > 0) {

					var msg = '<p>Insight Maker has received a significant update to its equation engine providing improved flexibility and power.</p>';
					msg += '<br/><p>A side effect of this update is that function names must now immediately be followed by a parenthesis. Thus, for instance, "Max&nbsp;&nbsp(1,2)" is no longer valid and needs to be replaced with  "Max(1,2)." This also improves the clarity and readability of equations.</p> ';
					msg += '<br/><p>The following of your primitives appear to use an unsupported format. Their equations will automatically be updated to use the correct format:</p>';
					msg += '<br/><p><b>' + Ext.Array.map(obsolete, function(x) {
						return x.getAttribute("name")
					}).join(", ") + '</b></p>';
		
					msg += '<br/><p>You may save your model to keep these updates.</p>'

					Ext.Msg.show({
						icon: Ext.MessageBox.WARNING,
						title: 'Model Update Required',
						msg: msg,
						buttons: Ext.MessageBox.OK
					});

				}
			}
		}

		if(obsolete.length>0){
			obsolete.map(function(x){
				setValue(x, getValue(x).replace(/([A-Za-z0-9_])\s+\(/gi, "$1("));
			});
		}

		mySetting.setAttribute("Version", 29);
	}

	if (mySetting.getAttribute("Version") < 30) {
		var folders = primitives("Folder");

		for (var i = 0; i < folders.length; i++) {
			folders[i].setAttribute("Solver", defaultSolver);
		}

		mySetting.setAttribute("Version", 30);
	}

	if (mySetting.getAttribute("Version") < 31) {
		var agents = primitives("Agents");

		for (var i = 0; i < agents.length; i++) {
			agents[i].setAttribute('ShowSlider', false);
			agents[i].setAttribute('SliderMax', 100);
			agents[i].setAttribute('SliderMin', 0);
			agents[i].setAttribute('SliderStep', 1);
		}

		mySetting.setAttribute("Version", 31);
	}

	if (mySetting.getAttribute("Version") < 32) {
		var folders = primitives("Folder");

		for (var i = 0; i < folders.length; i++) {
			folders[i].setAttribute("AgentBase", "");
		}

		mySetting.setAttribute("Version", 32);
	}

	if (mySetting.getAttribute("Version") < 33) {
		
		var actions = primitives("Action");
		for (var i = 0; i < actions.length; i++) {
			actions[i].setAttribute("Repeat", true);
			actions[i].setAttribute("Recalculate", true);
		}
	
		var transitions = primitives("Transition");
		for (var i = 0; i < transitions.length; i++) {
			transitions[i].setAttribute("Repeat", false);
			transitions[i].setAttribute("Recalculate", true);
		}
		
		var states = primitives("State");
		for (var i = 0; i < states.length; i++) {
			states[i].setAttribute("Residency", "0");
		}

		mySetting.setAttribute("Version", 33);
	}
	
	if (mySetting.getAttribute("Version") < 34) {

		var obsolete = excludeType(findValue(/\[self\]/i), "Button");

		if(window.Ext){
			if(viewConfig.allowEdits){
				if (obsolete.length > 0) {

					var msg = '<p>Insight Maker has received a significant update to its equation engine improving Agent Based Modeling..</p>';
					msg += '<br/><p>A side effect of this update is that the "Self" agent must always be referred to using the variable syntax -- <i>Self</i> -- instead of the old primitive syntax -- <i>[Self]</i>.</p> ';
					msg += '<br/><p>The following of your primitives appear to use the outdated format. Their equations will automatically be updated to use the correct format:</p>';
					msg += '<br/><p><b>' + Ext.Array.map(obsolete, function(x) {
						return x.getAttribute("name")
					}).join(", ") + '</b></p>';
		
					msg += '<br/><p>You may save your model to keep these updates.</p>'

					Ext.Msg.show({
						icon: Ext.MessageBox.WARNING,
						title: 'Model Update Required',
						msg: msg,
						buttons: Ext.MessageBox.OK
					});

				}
			}
		}

		if(obsolete.length>0){
			obsolete.map(function(x){
				setValue(x, getValue(x).replace(/\[Self\]/gi, "Self"));
			});
		}

		mySetting.setAttribute("Version", 34);
	}
	
	if (mySetting.getAttribute("Version") < 35) {

		mySetting.setAttribute("article", '{"comments":true, "facebookUID": ""}');

		mySetting.setAttribute("Version", 35);
	}
	
	if (mySetting.getAttribute("Version") < 36) {

		mySetting.setAttribute("StyleSheet", '{}');

		mySetting.setAttribute("Version", 36);
	}

}