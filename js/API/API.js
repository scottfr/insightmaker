"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl) (http://InsightMaker.com/impl).

*/

/*
Class: Insight Maker API

Functions to manipulate Insight Maker models.

Introduction:

The following is a set of API functions for Insight Maker. JavaScript is the language used for these interfaces. In addition to the Insight Maker specific functions listed here,
standard JavaScript is also supported in buttons.

There are three primary avenues for making use of this API.

* For the "Action" of Buttons embedded within models.

* For a parent page to manipulate an embedded IFRAME containing an Insight Maker model.

* Using the JavaScript console of the web browser to manipulate a model. To find the built-in JavaScript console for a web browser, 
see the relevant browser's documentation.

Primitive Types:

A number of the API function refer to primitives by their type. The following are the valid types. Types are usually quoted when used and should always be capitalized (e.g. "Stock").

* Stock
* Variable
* Converter
* Flow
* Link
* Text
* Picture
* Folder
* Button
* Ghost

Examples:

The following examples illustrate the usage of the API for certain scenarios.

Using Dialogues:

Ask the user to specify a URL and opens a new web page at the location.

> showURL(showPrompt("What page should I open?"));

Expanding and Collapsing Folders:

This example expands all the folders in the model.

> expandFolder(findType("Folder"));

And this collapses them.

> collapseFolder(findType("Folder"));

Notes:

Show the notes for all flow and link primitives in the model.

> var connectors = findType(["Flow", "Link"]);
> showNote(connectors);

Using Opacity:

Makes the currently selected primitives partially transparent.

> setOpacity(getSelected(), 50);

Rabbit Birth Rate:

This  example will  work with the default Insight Maker model.
It prompts the user to specify the birth rate for the rabbit population.
It then sets the relevant primitive to that value and runs the model.

> var birthRate = showPrompt("Enter the birth rate for the rabbits:", 0.1);
> var birthPrimitive = findName("Rabbit Birth Rate");
> setValue(birthPrimitive, birthRate);
> runModel();

This could also be written more compactly as

> setValue(findName("Rabbit Birth Rate"), showPrompt("Enter the birth rate for the rabbits:", 0.1));
> runModel();

Building a Model:

This example creates a new model with two stocks connected by a flow.

> clearModel();
>
> var source = createPrimitive("Source", "Stock", [100, 50], [140, 50]);
> setValue(source, 100); //Give the source an initial value of 100
>
> var sink = createPrimitive("Sink", "Stock", [100, 300], [140, 50]);
>
> var myFlow = createConnector("Leakage", "Flow", source, sink);
> setValue(myFlow, "0.1*[Source]"); //10% of the source's volume moves to the sink each time period

Manipulating a Model in an IFRAME:

To access the API of an embedded IFRAME, first give the IFRAME an "id" property. This is not added by default in Insight Maker. For instance change

> <IFRAME SRC="...

to

> <IFRAME ID="InsightMakerModel1" SRC="...

Then from the parent page you can use the following JavaScript syntax to call API functions. This example calls the API's <clearModel> function.

> document.getElementById('InsightMakerModel1').contentWindow.postMessage("clearModel()", "*");


*/

/*

Group: Dialogues and User Input

*/


/*
Method: showMessage

Shows a message in a dialogue window.

Parameters:

message - The string to show as the message.

See also:

<showPrompt>, <showChoice>
*/


function showMessage(message) {
	alert(message);
	//Ext.Msg.alert('', message);
}

/*
Method: showPrompt

Shows a prompt in a dialogue window and provides a text input for the user to enter a value.

Parameters:

message - The string to show as the prompt.
defaultValue - The default value for the prompt. This parameter is optional.

Returns:

The value entered by the user.

See also:

<showMessage>, <showChoice>
*/

function showPrompt(message, defaultValue) {
	return prompt(message, defaultValue)
}

/*
Method: showChoice

Shows a prompt in a dialogue window and provides the user the option to click "OK" or "Cancel". Returns the value the user clicked as a boolean.

Parameters:

message - The string to show as the prompt.

Returns:

The value of the button clicked by the user as a boolean. "OK" is true, "Cancel" is false.

See also:

<showMessage>, <showPrompt>
*/


function showChoice(message) {
	return confirm(message);
}

/*
Method: showURL

Creates a new web browser window and sets the URL.

Parameters:

url - The URL to show.

*/

function showURL(url) {
	window.open(url, '', 'scrollbars=yes,menubar=yes,height=500,width=700,resizable=yes,toolbar=yes,location=yes,status=yes');
}

/*
Method: showData

Creates a display to showcase data. Multiple tabs of data may be shown. This function is passed an array of objects each representing an individual tab.

Parameters:

title - The title for the data window
tabs - An array of tab objects
size - The dimensions of the window in the form [width, height] (optional)

Tab Objects:

Each tab object contains several properties.

name - The name of the tab
type - The tab type. E.g. "text", "HTML", "table" or "chart"
data - The data for the tab

The different types of tabs are as follows.

Text Tab:

A text tab displays a large amount of text. For a text tab, the data property should be the text string that will be displayed.

HTML Tab:

An HTML tab displays HTML content. For an HTML tab, the data property should be the HTML content that will be displayed.

Table Tab:

A table tab displays a grid of data. For a table tab, the data object should be an array of arrays. Each inner array represents a column in the resulting table. The following property is also supported for tables.

header - For a table, an array containing containing the titles of the columns (optional)

Chart Tab:

A chart creates a graphical display of your data. In this case the data should be an array of series objects.

The following property is also supported.

xData - The x coordinates for the series (each series must have the same number of points with the same x-coordinates). In the form [x1, x2, ..., xn]
xType - The data type for the x-axis can be "Numeric" or "Category" (for use with categorical data such as column charts). By default, "Numeric" data is assumed. (optional)
xLabel - A string for the x-Axis label (optional)
yLabel - A string for the y-Axis label (optional)
legend - A string controlling the position of the legend. Can be "left", "right", "bottom", "top", or "none" (optional)
verticalGrid - True/false value whether or not to plot a vertical grid (optional)
horizontalGird - True/false value whether or not to plot a horizontal grid (optional)

Each series object has the following the properties:

data - An array containing the data for the series of the form [y1, y2, ..., yn]
type - The display type for the series. Can be "line" or "column"
name - The series name as a string (for display in the legend)
color - The color of the series. A string such as "green" or "#00ff00" (optional)
hideLegend - Prevents the series from being displayed in the legend (optional)
fill - If the series is a line series, creates a solid filled area between the line and  the x-axis (optional)
hideMarkers - Hides the markers for individual data points (optional)

Returns:

The window object that was created.

Example:

> showData("Sample Data",
>  [
>  {name: "A Chart",
>	type: "chart",
>	xLabel: "Chart x-Axis",
>	yLabel: "Chart y-Axis",
>	legend: "top",
>	horizontalGrid: true,
>	verticalGrid: true,
>	xType: "Numeric",
>	xData: [1,2,3,4,5],
>	data: [{
>		data: [1,4,9,16,25],
>		type: "line",
>		name: "Energy"
>	},{
>		data: [1,2,3,4,5],
>		type: "line",
>		name: "Cost"
>	}]
>	},
>  {name: "I'm a Text Tab",
>	type: "text",
>	data: "This is a long data string..."
>	},
>  {name: "I'm an HTML Tab",
>	type: "html",
>	data: "<center><p>This is <b>HTML</b> content.</p></center>"
>	},
>  {name: "Here's a Grid",
>	type: "table",
>	data: [[1,2,3,4],[1,4,9,16]],
>	header: ["Value", "Value^2"]
>	}
>  ]
> )


*/

function showData(title, tabs, size) {
	if(! size){
		size = [640, 480];
	}
	
	var tabItems = [];
	for(var i = 0; i < tabs.length; i++){
		var tab = {layout: "fit"};
		tab.title = tabs[i].name;
		if(tabs[i].type.toLowerCase() == "text"){
			var textData = {xtype: "textareafield", value: tabs[i].data, readOnly: true};
			tab.items = [textData];
		}else if(tabs[i].type.toLowerCase() == "html"){
			var htmlData = {title: "Insight Equations", xtype: "box", html: tabs[i].data, style: "background-color: white", autoScroll: true};
			tab.items = [htmlData];
		}else if(tabs[i].type.toLowerCase() == "table"){
			var gridData = {xtype: "grid"};
			var gridColumns = [];
			var storeFields = [];
			var data = []
			for(var j = 0; j< tabs[i].data.length; j++){
				gridColumns.push({
					dataIndex: "a"+j,
					text: tabs[i].header?tabs[i].header[j]:""
				});
				storeFields.push({
					name: "a"+j,
					type: "string"
				})
				
			}
			for(var k=0; k<tabs[i].data[0].length; k++){
				data.push({});
			}
			for(var j =0; j<tabs[i].data.length; j++){
				for(var k = 0; k<tabs[i].data[0].length; k++){
					data[k]["a"+j] = tabs[i].data[j][k];
				}
			}
			
			gridData.columns = gridColumns;
			gridData.store = new Ext.data.JsonStore({fields:storeFields, data: data});
			if(!tabs[i].header){
				gridData.hideHeaders = true;
			}
			
			gridData.dockedItems = [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: ["->",
				{
					xtype: 'exporterbutton',
					downloadName: tabs[i].name
				}]
			}];
			tab.items = [gridData];
			
		}else if(tabs[i].type.toLowerCase() == "chart"){
			var defaultColors = [ "#94ae0a", "#115fa6","#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"];
			var defaultColorIndex = 0;
			var colors = [];
			for(var j = 0; j < tabs[i].data.length; j++){
				if(tabs[i].data[j].color){
					colors.push(tabs[i].data[j].color);
				}else{
					colors.push(defaultColors[defaultColorIndex]);
					defaultColorIndex++;
					defaultColorIndex = defaultColorIndex % defaultColors.length;
				}
			}
			
			var themeId = "theme"+Math.random();
			
		    Ext.chart.theme[themeId] = Ext.extend(Ext.chart.theme.Base, {
		           constructor: function(config) {
		               Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
		                   colors: colors
		               }, config));
		           }
		       });
			   
			
			var dataSeries = [];
			var storeFields = [{
					name: "x",
					type: tabs[i].xType=="Numeric"?"float":"string"
				}];
			var yFields = [];
			var data = [];
			for(var j=0; j < tabs[i].xData.length; j++){
				data.push({x: tabs[i].xData[j]});
			}
			
			for(var j = 0; j < tabs[i].data.length; j++){
				storeFields.push({
					name: "a"+j,
					type: "float"
				});
				
				dataSeries.push({
			        type: tabs[i].data[j].type,
					title: tabs[i].data[j].name,
			        axis: 'left',
			        xField: 'x',
			        yField: "a"+j,
					showInLegend: tabs[i].data[j].hideLegend?false:true,
					fill: tabs[i].data[j].fill?tabs[i].data[j].fill:false,
					showMarkers: tabs[i].data[j].hideMarkers?false:true,
					style: {opacity: 1}
			    });
				if(tabs[i].data[j].color){
					dataSeries[dataSeries.length-1].style = {
					    stroke: tabs[i].data[j].color,
					    fill: tabs[i].data[j].color,
						opacity:1
					};
				}
				
				yFields.push("a"+j);
				
				for(var k = 0; k<tabs[i].data[j].data.length; k++){
					data[k]["a"+j] = tabs[i].data[j].data[k];
				}
			}
			
			
			
			
			var chartData = {
				xtype: "chart",
				background: {
					//color string
					fill: '#fff'
				},
				/*theme: themeId,*/
				animate: false,
				shadow: false,
				legend: {position:tabs[i].legend, visible:(tabs[i].legend && tabs[i].legend!='none')},
				store: new Ext.data.JsonStore({fields:storeFields, data: data}),
				axes: [
					{	
						position: "bottom",
						type: tabs[i].xType?tabs[i].xType:"Numeric",
						grid: tabs[i].verticalGrid?tabs[i].verticalGrid:false,
						title: tabs[i].xLabel?tabs[i].xLabel:"",
						fields: ["x"]
					},
					{
						position: "left",
						type: "Numeric",
						grid: tabs[i].horizontalGrid?tabs[i].horizontalGrid:false,
						title: tabs[i].yLabel?tabs[i].yLabel:"",
						fields: yFields
					}
					],
				series: dataSeries
			};
			
			
			
			tab.items = [chartData];
			
			/*tab.dockedItems =  [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: ["->",
				{
					xtype: 'button',
					text: "Download",
					handler: function() {
						surpressCloseWarning = true;
						this.up("panel").down("chart").save({
							type: "image/png"
						});
					}
				}]
			}];*/
		
		}else{
			alert("Unknown tab type: "+tabs[i].type);
		}
		tabItems.push(tab);
	}
	
    var win = new Ext.Window({
        title: title,
        layout: 'fit',
        closeAction: 'destroy',
        border: false,
        modal: false,
        resizable: true,
		closable:true,
		maximizable: true,
		minimizable: true,
        shadow: true,
        width: size[0],
        height: size[1],
        items: [{
			xtype: "tabpanel",
			layout: "fit",
			items: tabItems
		}]
    });
	
	win.on('minimize', function(w) {
		if (w.expandedState) {
			w.expandedState = false;
			w.collapse();
		} else {
			w.expandedState = true;
			win.expand();
		}
	});
	
	
	win.show();
	
	return win;
}


/*

Group: General Model Functions

*/

/*
Method: runModel

Runs a simulation and optionally returns the results.

Parameters:

silent - If false, behaves the same way as if the user clicked the run simulation button. If true, no visible response is shown to running the simulation and the results of the simulation are returned as an object. Defaults to false.

Returns:

If silent is true, returns the simulation results as an object. This object contains the following properties.

Time - The times for each period of the simulation as an array.
value(primitive) - A function that takes a primitive reference and returns an array of the values that primitive took on over the course of the simulation.
lastValue(primitive) - A function that takes a primitive reference and returns the last value of the primitive during the simulation.
error - "none" if no simulation error occurred, otherwise an error message.
errorPrimitive - The primitive that caused the error.

*/

function runModel(silent) {
	return runSimulation(silent);
}

/*
Method: saveModel

Saves the model.

Parameters:

dialogue - Pass true to show the properties dialogues (e.g. name, description, tags). The dialogue is always shown if this is the first save.

*/



function saveModel(dialogue) {
	if (dialogue || graph_title == "") {
		updateProperties();
	} else {
		sendGraphtoServer(graph);
	}
}


/*
Method: clearModel

Removes all primitives from the model.
*/


function clearModel() {
	graph.getModel().beginUpdate();
	graph.selectAll();
	graph.removeCells(graph.getSelectionCells(), false);
	graph.getModel().endUpdate();
}

/*
Method: layoutModel

Reorganizes the primitives in the model according to an algorithm.

Parameters:

algorithm - The algorithm used to calculate the new positions of the primitive. Either "organic" or "circular"


*/

function layoutModel(algorithm){
	if(algorithm=="organic"){
		var layout = new mxFastOrganicLayout(graph);
		layout.forceConstant = 60;
		executeLayout(layout, true);
	}else if(algorithm=="circular"){
		executeLayout(new mxCircleLayout(graph), true);	
	}else{
		alert("Unknown layout algorithm: "+algorithm);
	}
}

var executeLayout = function(layout, animate, ignoreChildCount) {
	var cell = graph.getSelectionCell();

	if (cell == null || (!ignoreChildCount && graph.getModel().getChildCount(cell) == 0)) {
		cell = graph.getDefaultParent();
	}

	graph.getModel().beginUpdate();
	try {
		layout.execute(cell);
	} catch (e) {
		throw e;
	} finally {
		// Animates the changes in the graph model except
		// for Camino, where animation is too slow
		if (animate && navigator.userAgent.indexOf('Camino') < 0) {
			// New API for animating graph layout results asynchronously
			var morph = new mxMorphing(graph);
			morph.addListener(mxEvent.DONE, function() {
				graph.getModel().endUpdate();
			});

			morph.startAnimation();
		} else {
			graph.getModel().endUpdate();
		}
	}

};

/*

Group: Simulation Settings

*/

/*
Method: getTimeStep

Gets the time step used in the simulation.

Returns:

The time step for the simulation as a floating point number.

See also:

<setTimeStep>
*/


function getTimeStep() {
    return getSetting().getAttribute("TimeStep");
}


/*
Method: setTimeStep

Sets the time step used in the simulation.

Parameters:

timeStep - The time step to be used in the simulation.

See also:

<getTimeStep>
*/


function setTimeStep(timeStep) {
    var edit = new mxCellAttributeChange(
    getSetting(), "TimeStep",
    timeStep);
    graph.getModel().execute(edit);
	
}

/*
Method: getTimeStart

Gets the start time for the simulation.

Returns:

The start time for the simulation as a floating point number.

See also:

<setTimeStart>
*/


function getTimeStart() {
    return getSetting().getAttribute("TimeStart");
}


/*
Method: setTimeStart

Sets the start time for the simulation.

Parameters:

timeStart - The start time for the simulation.

See also:

<getTimeStart>
*/


function setTimeStart(timeStart) {
    var edit = new mxCellAttributeChange(
    getSetting(), "TimeStart",
    timeStart);
    graph.getModel().execute(edit);
	
}


/*
Method: getTimeLength

Gets the length of the simulation.

Returns:

The length of the simulation as a floating point number.

See also:

<setTimeLength>
*/


function getTimeLength() {
    return getSetting().getAttribute("TimeLength");
}


/*
Method: setTimeLength

Sets the length of the simulation.

Parameters:

timeLength - The length of the simulation.

See also:

<getTimeLength>
*/


function setTimeLength(timeLength) {
    var edit = new mxCellAttributeChange(
    getSetting(), "TimeLength",
    timeLength);
    graph.getModel().execute(edit);
	
}

/*
Method: getTimeUnits

Gets the time units of the simulation.

Returns:

The time units of the simulation (e.g. "Seconds", "Minutes", "Days", "Years").

See also:

<setTimeUnits>
*/


function getTimeUnits() {
    return getSetting().getAttribute("TimeUnits");
}


/*
Method: setTimeUnits

Sets the time units of the simulation.

Parameters:

units - The time units of the simulation (e.g. "Seconds", "Minutes", "Days", "Years").

See also:

<getTimeUnits>
*/


function setTimeUnits(units) {
    var edit = new mxCellAttributeChange(
    getSetting(), "TimeUnits",
    units);
    graph.getModel().execute(edit);
}


/*
Method: getAlgorithm

Gets the algorithm for the simulation.

Returns:

The algorithm for the simulation as a string. "RK1" indicates Euler's method. "RK4" indicates a 4th order Runge-Kutta method.

See also:

<setAlgorithm>
*/


function getAlgorithm() {
    return getSetting().getAttribute("SolutionAlgorithm");
}


/*
Method: setAlgorithm

Sets the algorithm of the simulation.

Parameters:

algorithm - The algorithm for the simulation. "RK1" indicates Euler's method. "RK4" indicates a 4th order Runge-Kutta method.

See also:

<getAlgorithm>
*/


function setAlgorithm(algorithm) {
    var edit = new mxCellAttributeChange(
    getSetting(), "SolutionAlgorithm",
    algorithm);
    graph.getModel().execute(edit);
	
}

/*
Method: getMacros

Gets the macros for the insight.

Returns:

The macros for the insight as a string.

See also:

<setMacros>
*/


function getMacros() {
    return getSetting().getAttribute("Macros");
}


/*
Method: setMacros

Sets the macros of the insight.

Parameters:

macros - The macros for the insight.

See also:

<getMacros>
*/


function setMacros(macros) {
    var edit = new mxCellAttributeChange(
    getSetting(), "Macros",
    macros);
    graph.getModel().execute(edit);
	
}

/*

Group: Finding and Accessing Specific Primitives

*/

/*
Method: findName

Finds and returns a primitive by its name. If more than one primitive with the same name exists, returns an array of primitives.

Parameters:

name - The name of the primitive to return as a string. Also accepts an array of strings in which case all the primitives named in the array will be returned.

Return:

A primitive. If multiple primitives exist with the same name, an array of primitives will be returned. Returns null if no primitives are found.

See also:

<findType>, <findAll>, <findID>, <findValue>

*/


function findName(name) {
	var res = map(name, function(name){
		var res = [];
		var myCells = findAll();
		for (var i = 0; i < myCells.length; i++) {
			if (isDefined(myCells[i].getAttribute("name")) && myCells[i].getAttribute("name").toLowerCase() == name.toLowerCase()) {
				res.push(myCells[i]);
			}
		}
		return res;
	});
	
	res = Ext.Array.flatten(res);
	res = Ext.Array.filter(res, function(val) { return val !== null; });
	
	if(name instanceof Array){
		return res;
	}else{
		if (res.length == 0) {
			return null;
		} else if (res.length == 1) {
			return res[0];
		} else {
			return res;
		}
		
	}
	
}

/*
Method: findAll

Finds and returns all primitives in the model.

Return:

An array of primitives.

See also:

<findName>, <findType>, <findID>, <findValue>

*/


function findAll() {
	var all = findType();
	var res = [];
	for (var i =0 ; i < all.length; i++){
		if(!(all[i].value.nodeName=="Setting" || all[i].value.nodeName=="Display")){
			res.push(all[i]);
		}
	}
	return res;
}


/*
Method: findType

Finds and returns all primitives of a specific type.

Parameters:

type - The type of primitives to return. For instance: "Stock", "Flow", "Link", "Text", "Button", "Picture", "Converter" or "Variable". An array of type strings may also be passed.

Return:

An array of primitives of the specified type.

See also:

<findName>, <findAll>, <findID>, <findValue>

*/


function findType(type) {
	var res = map(type, function(type){
		var t = type;
		return primitives(t);

	});
	res = Ext.Array.flatten(res);
	return res;

}

/*
Method: findID

Finds and returns a primitive using its ID.

Parameters:

ID - The ID of the primitive to find. May also be an array of IDs.

Return:

A primitive. If an array of IDs was passed, returns an array of primitives.

See also:

<findName>, <findType>, <findAll>, <findValue>, <getID>

*/



function findID(id) {
	var myCells = findAll();
	var res = map(id, function(id){
	for (var i = 0; i < myCells.length; i++) {
		if (myCells[i].id == id) {
			return myCells[i];
		}
	}
	return null;
	});
	if(res===null){
		return res;
	}
	if(id instanceof Array){
		return res;
	}else{
		if(res.length==1){
			return res[0];
		}else{
			return res;
		}
	}
}

/*
Method: findValue

Finds and returns all primitives whose values match a regular expressions

Parameters:

search - The regular expression to search for. Can also be a string in which case the primitive values will be tested for strict case-sensitive equality against the string. May also be an array of regular expressions and strings in which case any primitive with a value that matches one element of the array will be returned.

Return:

An array of primitives whose values that match the regular expression. Returns an empty array if no primitives match.

Example:

> // Returns all primitives that use the log function
> var containingLog = findValue(/log\(/i);
>
> // Returns all primitives whose value is strictly "1"
> var isOne = findValue("1");

See also:

<findName>, <findType>, <findAll>, <getID>

*/


function findValue(search) {
	var myCells = findAll();
	

	var res = map(search, function(regEx){
		var res = [];
		for (var i = 0; i < myCells.length; i++) {
			if(regEx instanceof RegExp){
				if (regEx.test(getValue(myCells[i]))) {
					res.push(myCells[i]);
				}
			}else{
				if(getValue(myCells[i]) == regEx){
					res.push(myCells[i]);
				}
			}
		}
		return res;
	});
	
	return uniquePrimitives(Ext.Array.flatten(res));
}

/*

Group: Create and Delete Primitives

*/

/*
Method: createPrimitive

Creates a new primitive and adds it to the model. This function is only for node-type primitives not connectors (e.g. flows or links).

Parameters:

name - The name of the primitive to add.
type - The type of the primitive to add. For example, "Variable" or "Stock".
position - The location of the upper-left corner of the primitive in the form: [x, y].
size - The dimensions of the primitive in the form: [width, height].

Return:

The newly created primitive.

See also:

<createConnector>, <removePrimitive>

*/

function createPrimitive(name, type, position, size) {
	
	var parent = graph.getDefaultParent();
	var t = (type).toLowerCase();
	//console.log(t);
	//console.log(position);
	//console.log(size)
	var vertex = graph.insertVertex(parent, null, primitiveBank[t].cloneNode(true), position[0], position[1], size[0], size[1], t);
	
	
	setName(vertex, name);
	
	if (isValued(vertex) || vertex.value.nodeName == "Agents") {
		var displays = primitives("Display");
		for (var i = 0; i < displays.length; i++) {
			var d = displays[i];
			if (isTrue(d.getAttribute("AutoAddPrimitives")) && d.getAttribute("Type") != "Scatterplot" && (d.getAttribute("Type") != "Map" || vertex.value.nodeName == "Agents")) {
				var s = d.getAttribute("Primitives");
				if (typeof(s) == "undefined") {
					d.setAttribute("Primitives", vertex.id);
				} else {
					var items = s.split(",");
					items.push(vertex.id);
					d.setAttribute("Primitives", items.join(","));
				}
			}
		}
	}
	
	return vertex;
}

/*
Method: createConnector

Creates a new connector primitive and adds it to the model.

Parameters:

name - The name of the primitive to add.
type - The type of the primitive to add: "Link" or "Flow".
alpha - The primitive that will be at the start of the connector.
omega - The primitive that will be at the end of the connector.

Return:

The newly created connector primitive.

See also:

<createPrimitive>, <removePrimitive>

*/

function createConnector(name, type, alpha, omega) {
	
	var parent = graph.getDefaultParent();
	
	var x;
	var usedTemp = false;
	
	if(alpha==null || omega==null){
		usedTemp=true;
		x = createPrimitive("temp stock xyz", "Stock",[300,300],[10,10]);

		if(alpha==null){
			alpha=x;
		}
		if(omega==null){
			omega=x;
		}
		
	}
	
	var t = type.toLowerCase();
	var edge = graph.insertEdge(parent, null, primitiveBank[t].cloneNode(true), alpha, omega, t);
	
	
	setName(edge, name);
	
	if(usedTemp){
		removePrimitive(x);
	}
	

	return edge;
}


/*
Method: removePrimitive

Removes a primitive from the model. You should not attempt to access or modify a primitive once it has been removed.

Parameters:

primitive - The primitive to delete, can also be an array of primitives.

See also:

<createPrimitive>, <createConnector>

*/

function removePrimitive(primitive) {
	if (primitive instanceof Array) {
		graph.removeCells(primitive, false);
	}else{
		graph.removeCells([primitive], false);
	}
}

/*

Group: Primitive Selections

*/


/*
Method: highlight

Highlights a single primitive. Selects the primitive, expands any collapsed folders the primitive is in, and scrolls to the position of the primitive.

Parameters:

primitive - The primitive to highlight.

*/

function highlight(primitive) {
	var folder = getParent(primitive);
	while(folder){
		if(getCollapsed(folder)){
			expandFolder(folder);
		}
		folder = getParent(folder);
	}
	setSelected(primitive);
	graph.scrollCellToVisible(primitive);
}


/*
Method: getSelected

Finds and returns the currently selected primitives.

Return:

An array of the selected primitives.

See also:

<setSelected>, <isSelected>
*/

function getSelected() {
	return graph.getSelectionCells();
}

/*
Method: setSelected

Sets the currently selected primitives.

Parameters:

primitives - An array of primitives to select. Can also be a single primitive.

See also:

<getSelected>, <isSelected>

*/

function setSelected(primitives) {
	if (primitives instanceof Array) {
		graph.setSelectionCells(primitives);
	}else{
		graph.setSelectionCells([primitives]);
	}
}

/*
Method: isSelected

Indicates whether a primitive is selected.

Parameters:

primitive - A primitive to return the selection status for. May also be an array of primitives.

Return:

Whether the primitive is selected or not as a boolean. If an array of primitives was passed to the function, an array of booleans is returned.

See also:

<getSelected>, <setSelected>

*/

function isSelected(primitive) {
	var selected = getSelected();
	return map(primitive, function(primitive) {
			return (primitiveIndex(selected, primitive) > -1);
	});
}



/*

Group: General Primitive Functions

*/

/*
Method: getID

Gets the ID of the passed primitive. The ID remains constant even if the name of a primitive changes. The ID is a string.

Parameters:

primitive - The primitive for which the ID is requested. May also be an array of primitives.

Return:

The ID of the primitive as a string. If an array of primitives was passed, returns an array of IDs.

See also:

<findID>
*/



function getID(primitive) {
	return map(primitive, function(primitive) {
		return primitive.id;
	});
}

/*
Method: getType

Gets the type of the passed primitive.

Parameters:

primitive - The primitive for which the type is requested. May also be an array of primitives.

Return:

The type of the primitive as a string. If an array of primitives was passed, returns an array of IDs.

*/



function getType(primitive) {
	return map(primitive, function(primitive) {
		return primitive.value.nodeName;
	});
}



/*
Method: getName

Gets the name of the passed primitive.

Parameters:

primitive - The primitive for which the name is requested. May also be an array of primitives.

Return:

The name of the primitive as a string. If an array of primitives was passed, returns an array of names.

See also:

<setName>
*/

function getName(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("name");
	});
}

/*
Method: setName

Sets the name of the passed primitive.

Parameters:

primitive - The primitive for which the name will be set. May also be an array of primitives in which case they will all be set to the same name.
name - The new name for the primitive.

See also:

<getName>
*/

function setName(primitive, name) {
	
	map(primitive, function(primitive) {
		if(validPrimitiveName(String(name), primitive)){
			var edit= new mxCellAttributeChange(primitive, "name", String(name));
			graph.getModel().execute(edit);
			propogateGhosts(primitive);
		}
	});
	
}

/*
Method: getUnits

Gets the units of the passed primitive.

Parameters:

primitive - The primitive for which the units are requested. May also be an array of primitives.

Return:

The units of the primitive as a string. If an array of primitives was passed, returns an array of units.

See also:

<setUnits>
*/



function getUnits(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Units");
	});
}

/*
Method: setUnits

Sets the units of the passed primitive.

Parameters:

primitive - The primitive for which the units will be set. May also be an array of primitives in which case they will all be set to the same units.
units - The new units for the primitive.

See also:

<getUnits>
*/


function setUnits(primitive, units) {
	
	map(primitive, function(primitive) {
			var edit= new mxCellAttributeChange(primitive, "Units", String(units));
			graph.getModel().execute(edit);
	});
	
}

/*
Method: getConstraints

Gets the upper and lower bounds on the passed primitive to test against during simulation.

Parameters:

primitive - The primitive for which the constraints are requested. May also be an array of primitives.

Return:

The constraints of the primitive as an array. The format is [MinimumConstraint, MinimumConstraintMode, MaximumConstraint, MaximumConstraintMode]. Constraint mode is false to disable the constraint and true to enable it.

See also:

<setConstraints>
*/


function getConstraints(primitive) {
	return map(primitive, function(primitive) {
		return [primitive.getAttribute("MinConstraint"), isTrue(primitive.getAttribute("MinConstraintUsed")), primitive.getAttribute("MaxConstraint"), isTrue(primitive.getAttribute("MaxConstraintUsed"))];
	});
}

/*
Method: setConstraints

Sets the upper and lower bounds on the passed primitive to test against during simulation.

Parameters:

primitive - The primitive for which the units will be set. May also be an array of primitives in which case they will all be set to the same constraints.
constraints - The constraints of the primitive as an array. The format is [MinimumConstraint, MinimumConstraintMode, MaximumConstraint, MAximumConstraintMode]. Constraint mode is false to disable the constraint and true to enable it.


See also:

<getConstraints>
*/


function setConstraints(primitive, constraints) {
	map(primitive, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "MinConstraint", constraints[0]);
			graph.getModel().execute(edit);
			edit = new mxCellAttributeChange(primitive, "MinConstraintUsed", constraints[1]);
			graph.getModel().execute(edit);
			edit = new mxCellAttributeChange(primitive, "MaxConstraint", constraints[2]);
			graph.getModel().execute(edit);
			edit = new mxCellAttributeChange(primitive, "MaxConstraintUsed", constraints[3]);
			graph.getModel().execute(edit);
	});

}

/*
Method: getNote

Gets the note of the passed primitive.

Parameters:

primitive - The primitive for which the note is requested. May also be an array of primitives.

Return:

The note of the primitive as a string. If an array of primitives was passed, returns an array of notes.

See also:

<setNote>
*/

function getNote(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Note");
	});
}

/*
Method: setNote

Sets the note of the passed primitive.

Parameters:

primitive - The primitive for which the note will be set. May also be an array of primitives in which case they will all be set to the same note.
note - The new note for the primitive.

See also:

<getNote>
*/

function setNote(primitive, note) {
	
	map(primitive, function(primitive) {
			var edit= new mxCellAttributeChange(primitive, "Note", String(note));
			graph.getModel().execute(edit);
	});
	
}

/*
Method: showNote

Shows the note for the passed primitive. The note is shown as a closable tooltip next to the primitive. If the note is empty, the note will not be shown.

Parameters:

primitive - The primitive for which the note will be shown. May also be an array of primitives in which case they will all have their notes shown.

See also:

<hideNote>
*/



function showNote(primitive) {
	return map(primitive, function(cell) {
		if(! (cell.value.getAttribute("Note",null)===null || cell.value.getAttribute("Note")=="")){		
	        var x = Ext.getCmp("note" + cell.id);
	        if (isUndefined(x)) {
	            var tooltip = new Ext.ToolTip(
	            {
	                html: "<big>" + clean(cell.value.getAttribute("Note").replace(/\n/g, "<br/>")) + "</big>",
	                autoHide: false,
	                closable: true,
					width:250,
	                draggable: true,
	                id: "note" + cell.id,
	                title: clean(cell.value.getAttribute("name")),
					closeAction:"destroy"
	            });
				var state = graph.view.getState(cell);
	            tooltip.showAt([state.x + mxPanel.getEl().getLeft()+ state.width+4-graph.container.scrollLeft, state.y + mxPanel.getEl().getTop()-graph.container.scrollTop]);
			
			}
		}
	});
}

/*
Method: hideNote

Hides the note for the passed primitive. The note is shown as a closable tooltip next to the primitive.

Parameters:

primitive - The primitive for which the note will be hidden. May also be an array of primitives in which case they will all have their notes hidden.

See also:

<showNote>
*/



function hideNote(primitive) {
	return map(primitive, function(cell) {
        var x = Ext.getCmp("note" + cell.id);
        if (! isUndefined(x)) {
			x.destroy();
		}
	});
}

/*
Method: showEditor

Shows the value editor for the passed primitive.

Parameters:

primitive - The primitive for which the editor will be shown. 
*/


function showEditor(primitive){
    if (primitive.value.nodeName == "Converter") {
        var editorWindow = new Ext.ConverterWindow({
            parent: "",
            cell: primitive,
            oldKeys: primitive.getAttribute("Data"),
            interpolation: primitive.getAttribute("Interpolation")
        });
        editorWindow.show();
    } else {
        var editorWindow = new Ext.EquationWindow({
            parent: "",
            cell: primitive,
            code: getValue(primitive)
        });
        editorWindow.show();
    }
}

/*
Method: getValue

Gets the value of the passed primitive. The value depends on the type of the primitive. For instance, the value of stock is its initial value while the value of a flow is its rate.

Parameters:

primitive - The primitive for which the value is requested. May also be an array of primitives.

Return:

The value of the primitive as a string. If an array of primitives was passed, returns an array of values.

See also:

<setValue>
*/



function getValue(primitive) {
	return map(primitive, function(primitive) {
		var n = primitive.value.nodeName;
		var v;
		if (n == "Stock") {
			v= primitive.getAttribute("InitialValue");
		} else if (n == "Flow") {
			v= primitive.getAttribute("FlowRate");
		} else if (n == "Transition") {
			v= primitive.getAttribute("Value");
		} else if (n == "State") {
			v= primitive.getAttribute("Active");
		} else if (n == "Variable") {
			v= primitive.getAttribute("Equation");
		} else if (n == "Button") {
			v= primitive.getAttribute("Function");
		} else if (n == "Converter") {
			v= primitive.getAttribute("Data");
		} else if (n == "Action") {
			v= primitive.getAttribute("Action");
		}
		if(isDefined(v)){
			return v;
		}else{
			return "";
		}
	});
}

/*
Method: setValue

Sets the value of the passed primitive. The value depends on the type of the primitive. For instance, the value of stock is its initial value while the value of a flow is its rate.

Parameters:

primitive - The primitive for which the value will be set. May also be an array of primitives in which case they will all be set to the same value.
value - The new value for the primitive. Can be a number or a string.

See also:

<getValue>
*/


function setValue(primitive, value) {
	
	map(primitive, function(primitive) {
		if (getValue(primitive) != value) {
			var n = primitive.value.nodeName;
			var edit;
			if (n == "Stock") {
				edit = new mxCellAttributeChange(primitive, "InitialValue", String(value));
			} else if (n == "Flow") {
				edit = new mxCellAttributeChange(primitive, "FlowRate", String(value));
			} else if (n == "Transition") {
				edit = new mxCellAttributeChange(primitive, "Value", String(value));
			} else if (n == "State") {
				edit = new mxCellAttributeChange(primitive, "Active", String(value));
			} else if (n == "Variable") {
				edit = new mxCellAttributeChange(primitive, "Equation", String(value));
			} else if (n == "Button") {
				edit = new mxCellAttributeChange(primitive, "Function", String(value));
			} else if (n == "Converter") {
				edit = new mxCellAttributeChange(primitive, "Data", String(value));
			} else if (n == "Action") {
				edit = new mxCellAttributeChange(primitive, "Action", String(value));
			}
			
			graph.getModel().execute(edit);
			
		}
	});
	
}


/*
Method: getPosition

Gets the position of the passed primitive.

Parameters:

primitive - The primitive for which the position is requested. May also be an array of primitives.

Return:

The position as an array of the form [x, y]. The position is measured from the top-left corner of the graph.

See also:

<setPosition>
*/



function getPosition(primitive) {
	return map(primitive, function(primitive) {
		var state = graph.view.getState(primitive);
		var scale = graph.view.getScale();
		
		return [state.x/scale, state.y/scale];
	});
}

/*
Method: setPosition

Sets the position of the passed primitive.

Parameters:

primitive - The primitive for which the position will be set. May also be an array of primitives in which case they will all be set to the same position.
position - The new position for the primitive in the form [x, y]. The position is measured from the top-left corner of the graph.

See also:

<getPosition>
*/


function setPosition(primitive, position) {
	
	map(primitive, function(primitive) {
		var state = graph.view.getState(primitive);

		var scale = graph.view.getScale();
		
		var geo = primitive.geometry;
		
		var dx = state.x/scale-geo.x;
		var dy = state.y/scale-geo.y;
		
		var res = geo.clone();
		
		res.x = position[0] - dx;
		res.y = position[1] - dy;
		
		graph.getModel().setGeometry(primitive, res);
	});
	
}

/*

Group: Primitive Styling Functions

*/

/*
Method: getOpacity

Gets the opacity of the passed primitive. Opacity is a value between 0 (invisible) to 100 (fully opaque).

Parameters:

primitive - The primitive for which the opacity will be returned. May also be an array of primitives.

Return:

The opacity of the primitive

*/

function getOpacity(primitive) {
	return map(primitive, function(primitive) {
			return graph.getCellStyle(primitive).opacity;
	});
	
}

/*
Method: setOpacity

Sets the opacity of the passed primitive. Opacity is a value between 0 (invisible) to 100 (fully opaque).

Parameters:

primitive - The primitive for which the opacity will be set. May also be an array of primitives in which case they will all be set to the same opacity.
opacity - The new opacity for the primitive.

*/

function setOpacity(primitive, opacity) {
	
	map(primitive, function(primitive) {
			var style = primitive.getStyle();
			style = mxUtils.setStyle(style, "opacity", opacity);
			style = mxUtils.setStyle(style, mxConstants.STYLE_TEXT_OPACITY, opacity);
			
			graph.getModel().execute(new mxStyleChange(	graph.getModel(),
			primitive,
			style));

			propogateGhosts(primitive);
			
	});
	
}

/*
Method: getLineColor

Gets the line color of the passed primitive.

Parameters:

primitive - The primitive for which the line color will be returned. May also be an array of primitives.

Return:

The line color of the primitive

*/

function getLineColor(primitive) {
	return map(primitive, function(primitive) {
		return graph.getCellStyle(primitive).strokeColor;
	});
}

/*
Method: setLineColor

Sets the line color of the passed primitive.

Parameters:

primitive - The primitive for which the line color will be set. May also be an array of primitives in which case they will all be set to the same color.
lineColor - The new line color for the primitive.

*/

function setLineColor(primitive, lineColor) {
	
	map(primitive, function(primitive) {
		var style = primitive.getStyle();
		style = mxUtils.setStyle(style, "strokeColor", lineColor);
			
		graph.getModel().execute(new mxStyleChange(	graph.getModel(),
		primitive,
		style));

		propogateGhosts(primitive);
			
	});
	
}

/*
Method: getFontColor

Gets the font color of the passed primitive.

Parameters:

primitive - The primitive for which the font color will be returned. May also be an array of primitives.

Return:

The font color of the primitive

*/

function getFontColor(primitive) {
	return map(primitive, function(primitive) {
		return graph.getCellStyle(primitive).fontColor;
	});
	
}

/*
Method: setFontColor

Sets the font color of the passed primitive.

Parameters:

primitive - The primitive for which the font color will be set. May also be an array of primitives in which case they will all be set to the same color.
fontColor - The new font color for the primitive.

*/

function setFontColor(primitive, fontColor) {
	
	map(primitive, function(primitive) {
		var style = primitive.getStyle();
		style = mxUtils.setStyle(style, "fontColor", fontColor);
			
		graph.getModel().execute(new mxStyleChange(	graph.getModel(),
		primitive,
		style));

		propogateGhosts(primitive);
			
	});
	
}

/*
Method: getFillColor

Gets the fill color of the passed primitive.

Parameters:

primitive - The primitive for which the fill color will be returned. May also be an array of primitives.

Return:

The fill color of the primitive

*/

function getFillColor(primitive) {
	return map(primitive, function(primitive) {
		return graph.getCellStyle(primitive).fillColor;
	});
	
}

/*
Method: setFillColor

Sets the fill color of the passed primitive.

Parameters:

primitive - The primitive for which the fill color will be set. May also be an array of primitives in which case they will all be set to the same color.
fillColor - The new fill color for the primitive.

*/

function setFillColor(primitive, fillColor) {
	
	map(primitive, function(primitive) {
		var style = primitive.getStyle();
		style = mxUtils.setStyle(style, "fillColor", fillColor);
			
		graph.getModel().execute(new mxStyleChange(	graph.getModel(),
		primitive,
		style));

		propogateGhosts(primitive);
			
	});
	
}


/*
Method: getImage

Gets the image of the passed primitive.

Parameters:

primitive - The primitive for which the image will be returned. May also be an array of primitives.

Return:

The image of the primitive as a string

*/

function getImage(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Image");
	});
	
}

/*
Method: setImage

Sets the image of the passed primitive.

Parameters:

primitive - The primitive for which the image will be set. May also be an array of primitives in which case they will all be set to the same image.
image - The image url or alias as a string.

*/

function setImage(primitive, image) {
	
	map(primitive, function(primitive) {
		primitive.setAttribute("Image", image);
		setPicture(primitive);
	});
	
}

/*

Group: Stocks

*/

/*
Method: getNonNegative

Gets the non-negative property of stocks (also applicable to flows). A non-negative stock will never become negative.

Parameters:

primitive - The stock for which the value is requested. May also be an array of stock.

Return:

The non-negative value of the stock. If an array of primitives was passed, returns an array of values.

See also:

<setNonNegative>
*/


function getNonNegative(primitive) {
	return map(primitive, function(primitive) {
		if(primitive.value.nodeName == "Stock"){
			return isTrue(primitive.getAttribute("NonNegative"));
		}else{
			return isTrue(primitive.getAttribute("OnlyPositive"));
		}
	});
}

/*
Method: setNonNegative

Sets the non-negative value of the passed stocks (also applicable to flows).

Parameters:

primitive - The stock for which the non-negative value will be set. May also be an array of stocks in which case they will all be set to the same value.
nonNegative - The new non-negative status for the stock. Either true or false.

See also:

<getNonNegative>
*/


function setNonNegative(primitive, nonNegative) {
	map(primitive, function(primitive) {
		if(primitive.value.nodeName == "Stock"){
			var edit = new mxCellAttributeChange(primitive, "NonNegative", nonNegative);
			graph.getModel().execute(edit);
		}else{
			var edit = new mxCellAttributeChange(primitive, "OnlyPositive", nonNegative);
			graph.getModel().execute(edit);
		}
	});
}

/*
Method: getStockType

Gets the type of the stock. The type affects the behavior of the stock and may either be "Store" (the default) or "Conveyor".

Parameters:

primitive - The stock for which the type is requested. May also be an array of stocks.

Return:

The type of the stock as a string. If an array of stocks was passed, returns an array of strings.

See also:

<setStockType>
*/

function getStockType(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("StockMode");
	});
}

/*
Method: setStockType

Sets the type of the passed stock.

Parameters:

primitive - The stock for which the type will be set. May also be an array of stocks in which case they will all be set to the same type.
type - The type of the stock as a string. Either "Store" (the default) or "Conveyor".

See also:

<getStockType>
*/

function setStockType(primitive, type) {
	map(primitive, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "StockMode", type);
			graph.getModel().execute(edit);
	});
}


/*
Method: getDelay

Gets the delay length of conveyor stocks.

Parameters:

primitive - The stock for which the value is requested. May also be an array of stocks.

Return:

The delay length of the stock. If an array of stocks was passed, returns an array of lengths.

See also:

<setDelay>
*/

function getDelay(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Delay");
	});
}

/*
Method: setDelay

Sets the delay length of the passed conveyor stock.

Parameters:

primitive - The stock for which the delay length will be set. May also be an array of stocks in which case they will all be set to the same value.
delay - The delay length for the stock.

See also:

<getDelay>
*/

function setDelay(primitive, delay) {
	map(primitive, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "Delay", delay);
			graph.getModel().execute(edit);
	});
	
}

/* 

Group: Connectors

See <getNonNegative> and <setNonNegative> for setting the only-positive property of flows.

*/

/*
Method: getEnds

Gets the alpha and omega for the connector

Parameters:

connector - The connector for which the ends are requested. Can also be an array of connectors.

Return:

The alpha and omega as an array: [alpha, omega]. Array elements are returned as null if no connection exists.

See also:

<setEnds>
*/

function getEnds(connector) {
	return map(connector, function(primitive) {
		return [primitive.getTerminal(true), primitive.getTerminal(false)];
	});
}

/*
Method: setEnds

Sets the alpha and omega for a connector.

Parameters:

connector - The connector for which the alpha and omega will be set. May also be an array of connectors.
ends - The new alpha and omega for the connector as an array: [alpha, omega]. Use null for either alpha or omega to disconnect an end.

See also:

<getEnds>
*/

function setEnds(connector, ends) {
	map(connector, function(primitive) {
		var edit = new mxTerminalChange(graph.model, primitive, ends[0], true);
		graph.getModel().execute(edit);
		edit = new mxTerminalChange(graph.model, primitive, ends[1], false);
		graph.getModel().execute(edit);
	});
}

/*
Method: connected

Determines two primitives are connected by a link, flow, or transition. Alternatively if one of the primitives is a connector, checks if it connects directly to the other primitive.

Parameters:

primitive1 - A primitive.
primitive2 - A primitive to test whether it is connected to primitive1.

Return:

A boolean. True if the primitives are connected, false otherwise.
*/

function connected(primitive1, primitive2) {
	if(primitive1.isEdge){
		if(primitive1.source !== null && primitive1.source.id===primitive2.id){
			return true;
		}else if(primitive1.target !==null && primitive1.target.id===primitive2.id){
			return true;
		}
	}
	if(primitive2.isEdge){
		if(primitive2.source !== null && primitive2.source.id===primitive1.id){
			return true;
		}else if(primitive2.target !== null && primitive2.target.id===primitive1.id){
			return true;
		}
	}
	var items = findType(["Flow","Link","Transition"]);
	for(var i = 0; i < items.length; i++){
		if(items[i].source !== null && items[i].target !== null ){
			if(items[i].source.id===primitive1.id && items[i].target.id===primitive2.id){
				return true;
			}
			if(items[i].target.id===primitive1.id && items[i].source.id===primitive2.id){
				return true;
			}
		}
	}
	return false;
}


/* 

Group: Transitions and Actions

*/

/*
Method: getTriggerType

Gets the trigger type of a transition or action.

Parameters:

primitive - The transition or action for which the trigger is requested. May also be an array of transitions or actions.

Return:

The trigger mode as a string. May be "Timeout", "Probability" or "Condition".

See also:

<setTriggerType>
*/

function getTriggerType(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Trigger");
	});
}

/*
Method: setTriggerType

Sets the trigger type for a transition or action.

Parameters:

primitive - The transition or action for which the trigger will be set. May also be an array of transitions or actions.
trigger - The new trigger for the transition or action. May be "Timeout" "Probability" or "Condition".

See also:

<getTriggerType>
*/

function setTriggerType(primitive, trigger) {
	map(primitive, function(primitive) {
		var edit = new mxCellAttributeChange(primitive, "Trigger", trigger);
		graph.getModel().execute(edit);
	});
}

/*
Method: getTriggerValue

Gets the trigger value equation of a transition or action.

Parameters:

primitive - The transition or action for which the trigger value equation is requested. May also be an array of transitions or actions.

Return:

The trigger value equation as a string.

See also:

<setTriggerValue>
*/

function getTriggerValue(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("Value");
	});
}

/*
Method: setTriggerValue

Sets the trigger value for a transition or action.

Parameters:

primitive - The transition or action for which the trigger will be set. May also be an array of transitions or actions.
value - The new trigger value equation as a string.

See also:

<getTriggerValue>
*/

function setTriggerValue(primitive, value) {
	map(primitive, function(primitive) {
		var edit = new mxCellAttributeChange(primitive, "Value", value);
		graph.getModel().execute(edit);
	});
}

/* 

Group: Converters

*/

/*
Method: getData

Gets the data of a converter.

Parameters:

converter - The converter for which the data is requested. May also be an array of Converters.

Return:

The Converter data as a string. A set of input/output pairs separated by semicolons. Example data form: "1,1;2,4;3,9"

See also:

<setData>
*/

function getData(converter) {
	return map(converter, function(primitive) {
		return primitive.getAttribute("Data");
	});
}

/*
Method: setData

Sets the data of a converter.

Parameters:

converter - The converter for which the data will be set. May also be an array of Converters in which case they will all be set to the same value.
data - The data for the converter as a string. A set of input/output pairs separated by semicolons. Example data form: "1,1;2,4;3,9"

See also:

<getData>
*/

function setData(converter, data) {
	map(converter, function(primitive) {
		var edit = new mxCellAttributeChange(primitive, "Data", data);
		graph.getModel().execute(edit);
	});
}


/*
Method: getConverterInput

Gets the input source of a converter.

Parameters:

converter - The converter for which the input source is requested. May also be an array of Converters.

Return:

The input source. If the input source is a primitive, returns the primitive. Otherwise returns null (indicating the use of time as the input source).

See also:

<setInputSource>
*/

function getConverterInput(converter) {
	return map(converter, function(primitive) {
		var x= primitive.getAttribute("Source");
		if(x=="Time"){
			return null;
		}else{
			return findID(x);
		}
	});
}

/*
Method: setConverterInput

Sets the input source of a converter.

Parameters:

converter - The converter for which the input source will be set. May also be an array of Converters in which case they will all be set to the same value.
input - The input source. Pass either a primitive or use null to indicate the usage of time as the input.

See also:

<getConverterInput>
*/

function setConverterInput(converter, input) {
	map(converter, function(primitive) {
		var edit;
		if(input==null){
			edit = new mxCellAttributeChange(primitive, "Source", "Time");
		}else{
			edit = new mxCellAttributeChange(primitive, "Source", input.id);
		}
		graph.getModel().execute(edit);
	});
}


/*
Method: getInterpolation

Gets the interpolation mode of a converter.

Parameters:

converter - The converter for which the interpolation is requested. May also be an array of Converters.

Return:

The interpolation mode as a string. May be "Linear" or "Discrete".

See also:

<setInterpolation>
*/

function getInterpolation(converter) {
	return map(converter, function(primitive) {
		return primitive.getAttribute("Interpolation");
	});
}

/*
Method: setInterpolation

Sets the interpolation mode of a converter.

Parameters:

converter - The converter for which the interpolation will be set. May also be an array of Converters in which case they will all be set to the same value.
interpolation - The interpolation mode for the converter as a string. May either be "Linear" or "Discrete".

See also:

<getInterpolation>
*/

function setInterpolation(converter, interpolation) {
	map(converter, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "Interpolation", interpolation);
			graph.getModel().execute(edit);
	});
}


/* 

Group: Buttons

*/

/*
Method: pressButton

Simulates a press of the passed button(s) firing its action. Can be useful for chaining together methods.

Parameter:

button - The button to be pressed. Can also be an array of buttons.

*/



function pressButton(button) {
	"use strict";
	
	graph.getModel().beginUpdate();
	
	map(button, function(primitive) {
		try {
			eval("\"use strict;\"\n\n"+primitive.getAttribute("Function"));
		} catch (err) {
			Ext.Msg.show({
				title: 'Action Error',
				msg: '<p>There was error with the Action for the button <i>' + primitive.getAttribute("name") + '</i>.</p><br/><p><tt>' + err + "</tt></p>",
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	});
	
	graph.getModel().endUpdate();
	
}

/*

Group: Agents

*/


/*
Method: getPopulationSize

Gets the size of the agent population.

Parameters:

agents - The agent population for which the size will be returned. May also be an array of agent populations.

Return:

The population size.

See also:

<setPopulationSize>
*/

function getPopulationSize(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("Size");
	});
}

/*
Method: setPopulationSize

Sets the size of the agent population.

Parameters:

agents - The agent population for which the size will be set. May also be an array of agent populations.
size - The new population size.

See also:

<getPopulationSize>
*/

function setPopulationSize(agents, size) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "Size", size);
			graph.getModel().execute(edit);
	});
}

/*
Method: getAgentBase

Gets the base agent for the population.

Parameters:

agents - The agent population for which the base agent will be returned. May also be an array of agent populations.

Return:

The base agent folder.

See also:

<setAgentBase>
*/

function getAgentBase(agents) {
	return map(agents, function(primitive) {
		return findID(primitive.getAttribute("Agent"));
	});
}

/*
Method: setAgentBase

Sets the base agent for the population.

Parameters:

agents - The agent population for which the base agent will be set. May also be an array of agent populations.
folder - The base agent folder. The type for this folder should be set to "Agent".

See also:

<getAgentBase>
*/

function setAgentBase(agents, folder) {
	map(agents, function(primitive) {
		if(connected(primitive, folder)){
			var edit = new mxCellAttributeChange(primitive, "Agent", folder.id);
			graph.getModel().execute(edit);
		}else{
			mxUtils.alert("Agent Population and Folder must be connected by a Link.");
		}
	});
}


/*
Method: getGeometryWrap

Whether the geometry should wrap across edges.

Parameters:

agents - The agent population for which the geometry wrap property will be returned. May also be an array of agent populations.

Return:

The wrap property as a boolean

See also:

<setGeometryWrap>
*/

function getGeometryWrap(agents) {
	return map(agents, function(primitive) {
		return isTrue(primitive.getAttribute("GeoWrap"));
	});
}

/*
Method: setGeometryWrap

Sets the wrap property for the population area geometry.

Parameters:

agents - The agent population for which geometry wrap property will be set. May also be an array of agent populations.
wrap - The wrap property for the geometry.

See also:

<getGeometryWrap>
*/

function setGeometryWrap(agents, wrap) {
	map(agents, function(primitive) {
		var edit = new mxCellAttributeChange(primitive, "GeoWrap", wrap);
		graph.getModel().execute(edit);
	});
}

/*
Method: getGeometryUnits

Gets the units for the population area geometry.

Parameters:

agents - The agent population for which the units will be returned. May also be an array of agent populations.

Return:

The units as a string

See also:

<setGeometryUnits>
*/

function getGeometryUnits(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("GeoDimUnits");
	});
}

/*
Method: setGeometryUnits

Sets the units for the population area geometry.

Parameters:

agents - The agent population for which geometry units will be set. May also be an array of agent populations.
units - The units as a string.

See also:

<getGeometryUnits>
*/

function setGeometryUnits(agents, units) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "GeoDimUnits", units);
			graph.getModel().execute(edit);
	});
}

/*
Method: getGeometryWidth

Gets the width for the population area geometry.

Parameters:

agents - The agent population for which the width will be returned. May also be an array of agent populations.

Return:

The width of the geometry

See also:

<setGeometryWidth>
*/

function getGeometryWidth(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("GeoWidth");
	});
}

/*
Method: setGeometryWidth

Sets the width for the population area geometry.

Parameters:

agents - The agent population for which geometry width will be set. May also be an array of agent populations.
width - The desired width.

See also:

<getGeometryWidth>
*/

function setGeometryWidth(agents, width) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "GeoWidth", width);
			graph.getModel().execute(edit);
	});
}

/*
Method: getGeometryHeight

Gets the height for the population area geometry.

Parameters:

agents - The agent population for which the height will be returned. May also be an array of agent populations.

Return:

The height of the geometry

See also:

<setGeometryHeight>
*/

function getGeometryHeight(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("GeoHeight");
	});
}

/*
Method: setGeometryHeight

Sets the height for the population area geometry.

Parameters:

agents - The agent population for which geometry height will be set. May also be an array of agent populations.
height - The desired height.

See also:

<getGeometryHeight>
*/

function setGeometryHeight(agents, height) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "GeoHeight", height);
			graph.getModel().execute(edit);
	});
}

/*
Method: getAgentPlacement

The placement method for the agent population.

Parameters:

agents - The agent population for which the placement method will be returned. May also be an array of agent populations.

Return:

The placement method for the agent population. One of "Random", "Network", "Grid" or "Custom Function".

See also:

<setAgentPlacement>
*/

function getAgentPlacement(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("Placement");
	});
}

/*
Method: setAgentPlacement

Sets the placement method for the agent population.

Parameters:

agents - The agent population for which placement method will be set. May also be an array of agent populations.
method - The desired placemennt method. One of "Random", "Network", "Grid" or "Custom Function".

See also:

<getAgentPlacement>
*/

function setAgentPlacement(agents, method) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "Placement", method);
			graph.getModel().execute(edit);
	});
}

/*
Method: getAgentPlacementFunction

A custom placement function for the agent population.

Parameters:

agents - The agent population for which the custom placement function will be returned. May also be an array of agent populations.

Return:

The custom placement function for the agent population.

See also:

<setAgentPlacementFunction>
*/

function getAgentPlacementFunction(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("PlacementFunction");
	});
}

/*
Method: setAgentPlacementFunction

Sets the custom placement function for the agent population. The placement method should be set to "Custom Function" in order for this function to be used.

Parameters:

agents - The agent population for which the custom placement function will be set. May also be an array of agent populations.
func - The desired custom placement function.

See also:

<getAgentPlacementFunction>
*/

function setAgentPlacementFunction(agents, func) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "PlacementFunction", func);
			graph.getModel().execute(edit);
	});
}

/*
Method: getAgentNetwork

The network method for the agent population.

Parameters:

agents - The agent population for which the network method will be returned. May also be an array of agent populations.

Return:

The network method for the agent population. One of "None" or "Custom Function".

See also:

<setAgentNetwork>
*/

function getAgentNetwork(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("Network");
	});
}

/*
Method: setAgentNetwork

Sets the network method for the agent population.

Parameters:

agents - The agent population for which network method will be set. May also be an array of agent populations.
method - The desired placemennt method. One of "None" or "Custom Function".

See also:

<getAgentNetwork>
*/

function setAgentNetwork(agents, method) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "Network", method);
			graph.getModel().execute(edit);
	});
}

/*
Method: getAgentNetworkFunction

A custom network function for the agent population.

Parameters:

agents - The agent population for which the custom network function will be returned. May also be an array of agent populations.

Return:

The custom network function for the agent population.

See also:

<setAgentNetworkFunction>
*/

function getAgentNetworkFunction(agents) {
	return map(agents, function(primitive) {
		return primitive.getAttribute("NetworkFunction");
	});
}

/*
Method: setAgentNetworkFunction

Sets the custom network function for the agent population. The network method should be set to "Custom Function" in order for this function to be used.

Parameters:

agents - The agent population for which the custom network function will be set. May also be an array of agent populations.
func - The desired custom network function.

See also:

<getAgentNetworkFunction>
*/

function setAgentNetworkFunction(agents, func) {
	map(agents, function(primitive) {
			var edit = new mxCellAttributeChange(primitive, "NetworkFunction", func);
			graph.getModel().execute(edit);
	});
}

/*

Group: Folders

*/

/*
Method: collapseFolder

Collapses a folder or an array of folders.

Parameter:

folder - Either a single folder primitive or an array of folder primitives.

See also:

<expandFolder>, <getCollapsed>

*/

function collapseFolder(folder) {
	
	map(folder, function(folder) {
		graph.foldCells(true, false, [folder]);
	});
	
}

/*
Method: expandFolder

Expands a folder or an array of folders.

Parameter:

folder - Either a single folder primitive or an array of folder primitives.

See also:

<collapseFolder>, <getCollapsed>
*/

function expandFolder(folder) {
	map(folder, function(folder) {
		graph.foldCells(false, false, [folder]);
	});
}

/*
Method: getCollapsed

Returns whether or not a given folder is collapsed.

Parameter:

folder - The folder for which the collapsed state is requested.

Return:

True is the folder is collapsed, false if it is expanded.

See also:

<collapseFolder>, <expandFolder>
*/

function getCollapsed(folder) {
	return map(folder, function(f) {
		return f.isCollapsed();
	});
}


/*
Method: getParent

Gets the parent folder for a primitive.

Parameters:

primitive - The primitive for which the parent folder will be returned. May also be an array of primitives.

Return:

The parent folder. Returns null if the primitive is not in a folder.

See also:

<setParent>
*/

function getParent(primitive) {
	var defaultID = graph.getDefaultParent().id;
	return map(primitive, function(primitive) {
		var p = primitive.getParent();
		if(p.id == defaultID){
			return null;
		}else{
			return p;
		}
	});
}

/*
Method: setParent

Sets the parent folder for a primitive.

Parameters:

primitive - The primitive for which the parent folder will be set. May also be an array of primitives in which case they will all be set to the same parent.
parent - The parent folder primitive. Use null to remove the primitive from all folders.

See also:

<getParent>
*/

function setParent(primitive, parent) {
	var p = (parent==null?graph.getDefaultParent():parent);
	//console.log(p)
	//console.log(primitive);
	map(primitive, function(primitive) {
		//console.log(primitive.getAttribute("name"));
		var loc = getPosition(primitive);
		var edit = new mxChildChange(graph.getModel(), 	p, primitive);
		graph.getModel().execute(edit);
		setPosition(primitive, loc);
	});
}

/*
Method: getChildren

Returns the children of a folder.

Parameters:

folder - The folder for which the children will be returned.
recursive - Optional. Whether the children of inner folders will be returned. Defaults to true.

Return:

The children primitves of the folder.

*/

function getChildren(folder, recursive) {
	if(isUndefined(recursive)){
		recursive = true;
	}
	
	if(recursive){
		return Ext.Array.flatten(map(folder.children, function(x){
			if(x.value.nodeName=="Folder"){
				return x.children.concat([x]);
			}else{
				return x;
			}
		}));
	}else{
		return folder.children;
	}
}

/*
Method: getFolderType

Gets the type of a folder.

Parameters:

folder - The folder for which the type is requested. May also be an array of folders.

Return:

The type mode as a string. May be "None" or "Agent".

See also:

<setFolderType>
*/

function getFolderType(folder) {
	return map(folder, function(primitive) {
		return primitive.getAttribute("Type");
	});
}

/*
Method: setFolderType

Sets the type of a folder.

Parameters:

folder - The folder for which the type will be set. May also be an array of folders.
type - The type mode as a string. May be "None" or "Agent".

See also:

<getFolderType>
*/

function setFolderType(folder, type) {
	map(folder, function(primitive) {
		var edit = new mxCellAttributeChange(primitive, "Type", type);
		graph.getModel().execute(edit);
	});
}

/*

Group: Utility Functions

*/


/*
Method: excludeType

Removes a specific type of primitive from an array of primitives.

Parameter:

array - An array of primitives.
type - The type of primitives to remove.

Return:

A duplicate of the input array without any primitives of the specified type.

*/


function excludeType(array, type){
	if(array instanceof Array){
		var res = [];
		for(var i=0; i<array.length; i++){
			if(array[i].value.nodeName != type){
				res.push(array[i]);
			}
		}
		return res;
	}else{
		if(array ==null){
			return array;
		}
		if(array.value.nodeName == type){
			return null
		}
		return array;
	}
}

/*
Method: primitiveIndex

Locates the index of a specific primitive in an array of primitives.

Parameter:

array - An array of primitives.
primitive - The specific primitive to find.

Return:

The index of the primitive in the array. Returns -1 if the primitive is not found.

*/


function primitiveIndex(array, primitive){
	for(var i=0; i<array.length; i++){
		if(array[i].id == primitive.id){
			return i;
		}
	}
	return -1;
}

/*
Method: uniquePrimitives

Returns the passed array with duplicated primitives removed

Parameter:

primitives - An array of primitives.

Return:

An array of primitives with any duplicated elements removed.

*/


function uniquePrimitives(primitives){
	var res = [];
	for(var i = 0; i < primitives.length; i++){
		var found = false;
		for(var r = 0; r < res.length; r++){
			if(res[r].id == primitives[i].id){
				found = true;
				break;
			}
		}
		if(! found){
			res.push(primitives[i]);
		}
	}
	return res;
}

/*
Method: setGlobal

Sets the value of a global variable. This can allow communication between buttons or the storing of some state.

Parameter:

name - The name of the global variable.
value - The value of the global variable.

See also:

<getGlobal>


*/

var globalVars = {};

function setGlobal(name, value){
	globalVars[name] = value;
}

/*
Method: getGlobal

Gets the value of a global variable. This can allow communication between buttons or the storing of some state.

Parameter:

name - The name of the global variable for which to get the value.

Return:

The value of the global variable specified by name.

Example:

> setGlobal("Example Var 1", 42);
> setGlobal("Example Var 2", "test");
> var z = getGlobal("Example Var 1"); // z is now set to 42
> var y = getGlobal("Example Var 2"); // y is now set to "test"

See also:

<setGlobal>

*/

function getGlobal(name){
	return globalVars[name];
}




/*

Group: Insight Maker Interface

*/

/*
Method: topBarShown

Determines whether or not the Insight Maker top toolbar (which contains the Run Simulation button and other tools) is currently shown.

Return:

True if the top toolbar is shown, false otherwise.

See also:

<toggleTopBar>

*/

function topBarShown() {
    var toolbar = ribbonPanel.getDockedItems()[0];
    return toolbar.isVisible();
}

/*
Method: toggleTopBar

Toggles the visibility of the top toolbar. If it is currently shown, it is hidden. If it is currently hidden, it is shown.

See also:

<topBarShown>

*/

function toggleTopBar() {
    var toolbar = ribbonPanel.getDockedItems()[0];
    if (!toolbar.isVisible()) {
        toolbar.show();
		Ext.get("toolbarToggle").update("&uarr;");
    } else {
        toolbar.hide();
		Ext.get("toolbarToggle").update("&darr;");
    }
}

/*
Method: sideBarShown

Determines whether or not the Insight Maker side panel (which contains parameter sliders and information about the selected primitive) is currently shown.

Return:

True if the side panel is shown, false otherwise.

See also:

<toggleSideBar>

*/

function sideBarShown() {
    return (! configPanel.collapsed);
}

/*
Method: toggleSideBar

Toggles the visibility of the side panel. If it is currently shown, it is hidden. If it is currently hidden, it is shown.

See also:

<sideBarShown>

*/

function toggleSideBar() {
	if(sideBarShown()){
		configPanel.collapse(Ext.Component.DIRECTION_RIGHT, false);
	}else{
		configPanel.expand(false);
	}
}

