"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

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
	var win = window.open(url, '', 'scrollbars=yes,menubar=yes,height=500,width=700,resizable=yes,toolbar=yes,location=yes,status=yes');
	if (open == win || typeof(win)=='undefined'){
		Ext.Msg.alert('', "<big><big><center><a href='"+url+"' target='_blank'><i class='fa fa-external-link-square'></i> Open Link</a></center></big></big>")
	}
}

/*
Method: downloadFile

Downloads a file.

Parameters:

fileName - The name of the file to download
data - The data to download.

*/

function downloadFile(fileName, data) {
	// Create Blob and attach it to ObjectURL
	var blob = new Blob([data], {type: "octet/stream"}),
	url = window.URL.createObjectURL(blob);
	
	// Create download link and click it
	var a = document.createElement("a");
	a.style.display="none";
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	
	// The setTimeout is a fix to make it work in Firefox
	// Without it, the objectURL is removed before the click-event is triggered
	// And the download does not work
	setTimeout(function() {
		window.URL.revokeObjectURL(url);
		a.remove();
	},1);
};

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

The following properties are also supported.

xData - The x coordinates for the series (each series must have the same number of points with the same x-coordinates). In the form [x1, x2, ..., xn]
xType - The data type for the x-axis can be "numeric" or "category" (for use with categorical data such as column charts). By default, "numeric" data is assumed. (optional)
xLabel - A string for the x-Axis label (optional)
yLabel - A string for the y-Axis label (optional)
legend - A string controlling the position of the legend. Can be "left", "right", "bottom", "top", or "none" (optional)
verticalGrid - True/false value whether or not to plot a vertical grid (optional)
horizontalGird - True/false value whether or not to plot a horizontal grid (optional)
xMin - The minimum value of the x-Axis (optional)
xMax - The maximum value of the x-Axis (optional)
yMin - The minimum value of the y-Axis (optional)
yMax - The maximum value of the y-Axis (optional)

Each series object has the following the properties:

data - An array containing the data for the series of the form [y1, y2, ..., yn]
type - The display type for the series. Can be "line" or "bar"
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
>	xType: "numeric",
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
	if (!size) {
		size = [Math.min(Ext.getBody().getViewSize().width, 640), Math.min(Ext.getBody().getViewSize().height, 480)];
	}

	var tabItems = [];
	for (var i = 0; i < tabs.length; i++) {
		var tab = {
			layout: "fit"
		};
		tab.title = tabs[i].name;
		if (tabs[i].type.toLowerCase() == "text") {
			var textData = {
				xtype: "textareafield",
				value: tabs[i].data,
				readOnly: true
			};
			tab.items = [textData];
		} else if (tabs[i].type.toLowerCase() == "html") {
			var htmlData = {
				title: "Insight Equations",
				xtype: "box",
				html: tabs[i].data,
				style: "background-color: white",
				autoScroll: true
			};
			tab.items = [htmlData];
		} else if (tabs[i].type.toLowerCase() == "table") {
			var gridData = {
				xtype: "grid"
			};
			var gridColumns = [];
			var storeFields = [];
			var data = []
			for (var j = 0; j < tabs[i].data.length; j++) {
				gridColumns.push({
					dataIndex: "a" + j,
					text: tabs[i].header ? tabs[i].header[j] : ""
				});
				var columnType = "float";
				for (var k = 0; k < tabs[i].data[j].length; k++) {
					if ((typeof tabs[i].data[j][i]) == "string") {
						columnType = "string";
					}
				}
				storeFields.push({
					name: "a" + j,
					type: columnType
				})

			}
			for (var k = 0; k < tabs[i].data[0].length; k++) {
				data.push({});
			}
			for (var j = 0; j < tabs[i].data.length; j++) {
				for (var k = 0; k < tabs[i].data[0].length; k++) {
					data[k]["a" + j] = tabs[i].data[j][k];
				}
			}

			gridData.columns = gridColumns;
			gridData.store = new Ext.data.JsonStore({
				fields: storeFields,
				data: data
			});
			if (!tabs[i].header) {
				gridData.hideHeaders = true;
			}

			gridData.dockedItems = [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: ["->", downloadButton(tabs[i].name)]
			}];
			tab.items = [gridData];

		} else if (tabs[i].type.toLowerCase() == "chart") {
			var defaultColors = ["#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"];
			var defaultColorIndex = 0;
			var colors = [];
			for (var j = 0; j < tabs[i].data.length; j++) {
				if (tabs[i].data[j].color) {
					colors.push(tabs[i].data[j].color);
				} else {
					colors.push(defaultColors[defaultColorIndex]);
					defaultColorIndex++;
					defaultColorIndex = defaultColorIndex % defaultColors.length;
				}
			}

			var dataSeries = [];
			var storeFields = [{
				name: "x",
				type: tabs[i].xType.toLowerCase() == "numeric" ? "float" : "string"
			}];
			var yFields = [];
			var data = [];
			for (var j = 0; j < tabs[i].xData.length; j++) {
				data.push({
					x: tabs[i].xData[j]
				});
			}

			for (var j = 0; j < tabs[i].data.length; j++) {
				storeFields.push({
					name: "a" + j,
					type: "float"
				});

				dataSeries.push({
					shadow: false,
					type: tabs[i].data[j].fill ? "area" : tabs[i].data[j].type.toLowerCase(),
					title: tabs[i].data[j].name,
					colors: [colors[j]],
					axis: 'left',
					xField: 'x',
					yField: "a" + j,
					showInLegend: tabs[i].data[j].hideLegend ? false : true,
					showMarkers: tabs[i].data[j].hideMarkers ? false : true,
					style: {
						opacity: 1,
						"stroke-width": 3
					},
					marker: {
						radius: 3
					},
					animation: false
				});
				if (tabs[i].data[j].fill) {
					dataSeries[dataSeries.length - 1].style["stroke-width"] = 0;
				}

				yFields.push("a" + j);

				for (var k = 0; k < tabs[i].data[j].data.length; k++) {
					data[k]["a" + j] = tabs[i].data[j].data[k];
				}
			}



			var chartData = {
				xtype: "cartesian",

				animation: false,
				shadow: false,
				interactions: 'crosszoom',

				store: new Ext.data.JsonStore({
					fields: storeFields,
					data: data
				}),
				axes: [{
					position: "bottom",
					type: tabs[i].xType ? tabs[i].xType.toLowerCase() : "numeric",
					grid: tabs[i].verticalGrid ? tabs[i].verticalGrid : false,
					title: {
						text: tabs[i].xLabel ? tabs[i].xLabel : "",
						fontSize: 14
					},
					fields: ["x"],
					minimum: tabs[i].xMin,
					maximum: tabs[i].xMax
				}, {
					position: "left",
					type: "numeric",
					grid: tabs[i].horizontalGrid ? tabs[i].horizontalGrid : false,

					title: {
						text: tabs[i].yLabel ? tabs[i].yLabel : "",
						fontSize: 14
					},
					titleMargin: 20,
					fields: yFields,
					minimum: tabs[i].yMin,
					maximum: tabs[i].yMax
				}],
				series: dataSeries
			};

			if (tabs[i].legend && tabs[i].legend != 'none') {
				chartData.legend = {};
				chartData.legend.docked = tabs[i].legend;
				chartData.legend.toggleable = !tabs[i].legendStatic;
			}


			tab.items = [chartData];



		} else {
			alert("Unknown tab type: " + tabs[i].type);
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
		closable: true,
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
Method: frontWindow

Gets the frontmost window (if one exists).

Returns:

A window object.

*/

function frontWindow() {
	return Ext.WindowMgr.getActive();
}

/*
Method: closeAllWindows

Closes all open windows.

*/

function closeAllWindows() {
	var w;
	while (w = Ext.WindowMgr.getActive()) {
		w.close();
	}
}


/*
Method: openFile

Prompts the user to select one or more files on their computer. Information about the selected files are made available and the contents of the files are optionally read into memory.

Note that this function needs to be called as a direct result of user actions (such as the user clicking on a button). Browser security restrictions will prevent the function from operating if it is not called in response a user actions. Note also that this function is not supported on Internet Explorer 9.

Parameters:

config - A configuraiton object with the following optional properties:
multiple - If false, only a single file may be selected; if true, one or more files may be selected at a time.
accept - A string containing a MIME file type to filter file selection. If defined, only files matching the specified type may be selected. For example, "image/*" may be used to only accept image files.
read - If defined the selected files will be opened and their contents loaded. Read may either be "binary" in which case the contents is loaded as a binary string, "text" in which case the contents is loaded as a regular text string, or "xlsx" in which case an Excel file is loaded as an object.
onCompleted - A function to handle results. The openFile function is asynchronous. Once it completes, the callback function is called with the resulting data as a parameter.
onError - A function to handle the occurence of an error.
onSelected - A function fired once files have been selected but before data has been read.

Returns:

The openFile function is asynchronous and returns nothing directly. On the successful selection of files, the callback is called with the results. 

If config.multiple is false, these results are a single file object. If config.multiple is true, then these results are an array of file objects. Each file object has the following properties:

file - The orginal file object.
name - The name of the selected file.
type - The type of the selected file.
size - The size of the selected file.
contents - If config.read is true, the contents in the file is loaded with the specified type.

Examples:

>// Select a single text file and display its contents
>openFile({
>	read: "text",
>	multiple: false,
>	onCompleted: function(result){
>		alert(result.contents);
>	}
>});

*/

function openFile(config) {
	config = config || {
		multiple: false,
		accept: null,
		onCompleted: null,
		onSelected: null,
		onError: null,
		read: false
	};
	if (config.read) {
		config.read = config.read.toLowerCase();
	}
	if (config.read == "xlsx" && (!config.accept)) {
		config.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	}

	var opener = document.createElement("input");
	opener.setAttribute("type", "file");
	if (config.multiple) {
		opener.setAttribute("multiple", true);
	}
	if (config.accept) {
		opener.setAttribute("accept", config.accept);
	}

	var res = null;

	var loadCount = 0;
	var handleLoad = function() {
		$(opener).remove();

		if (!res.length) {
			config.onCompleted(res);
		} else {
			loadCount++;
			if (loadCount == res.length) {
				config.onCompleted(res);
			}
		}

	}

	var processFile = function(file) {
		var data = {};
		data.file = file;
		data.size = file.size;
		data.name = file.name;
		data.type = file.type;

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if (config.read == "xlsx") {
				require(['jszip'], function() {
					require(['xlsx'], function() {
						data.contents = XLSX.read(reader.result, {
							type: "binary"
						});
						handleLoad();
					});
				});
			} else {
				data.contents = reader.result;
				handleLoad();
			}
		};
		reader.onerror = function() {
			if (config.onError) {
				config.onError(reader.error)
			} else {
				alert("FileReader error.");
				console.log("FileReader Error");
				console.log(reader.error);
			}
		};

		reader.onabort = function() {
			if (config.onError) {
				config.onError(reader.error)
			} else {
				alert("FileReader aborted.");
				console.log("FileReader Error");
				console.log(reader.error);
			}

		}

		if (config.read == "binary") {
			reader.readAsBinaryString(file);
		} else if (config.read == "text") {
			reader.readAsText(file);
		} else if (config.read == "xlsx") {
			reader.readAsBinaryString(file);
		} else if (!config.read) {
			// leaving empty means don't load
			setTimeout(handleLoad, 1);
		} else {
			throw "Unknown data read type: " + config.type;
		}
		return data;
	}

	var callback = function() {

		var files = opener.files;

		if (config.onSelected) {
			config.onSelected(files);
		}

		if (config.onCompleted) {

			if (typeof files[0] == "undefined") {
				config.onCompleted(null);
			}

			if (!config.multiple) {
				res = processFile(files[0]);
			} else {
				res = Array.prototype.slice.call(files).map(function(x) {
					return processFile(x);
				});
			}
		}
	}

	opener.onchange = callback;
	document.body.appendChild(opener);
	opener.click();
}


/*

Group: General Model Functions

*/

/*
Method: runModel

Runs a simulation and optionally returns the results.

Parameters:

config - A configuration object. For compatibility, if set to the Boolean value, equivalent to calling runModel with a configuration object with the silent property set to the boolean value.
config.silent - If false or undefined, behaves the same way as if the user clicked the run simulation button. If true, no visible response is shown to running the simulation and the results of the simulation are returned as an object.
config.selectedDisplay - The selected tab in the display, should be a display primitive.
config.rate - A multiplier to control the speed of the animation in the result window. Use -1 to skip animation.
config.onSuccess(results) - Callback called when the simulation completes successfully.
config.onError(results) - Callback called when an error occurs during the simulation.
config.onPause(results) - Callback called when the simulation is paused. If this is set and a pause interval is defined for the model, then the simulation will be asynchronous and a results object will not be returned directly by the function call. 

Returns:

If silent is true, returns the simulation results as a results object. If callbacks are defined, the callbacks are called with a results object. This object contains the following properties.

times - The times for each period of the simulation as an array.
value(primitive) - A function that takes a primitive reference and returns an array of the values that primitive took on over the course of the simulation.
lastValue(primitive) - A function that takes a primitive reference and returns the last value of the primitive during the simulation.
window - The results window object (if config.silent is false).
error - "none" if no simulation error occurred, otherwise an error message.
errorPrimitive - The primitive that caused the error.
resume() - If the simulation was paused, this function may be called to resume the simulation. Please note that Insight Maker currently only supports running a single simulation at a time. When a new simulation is started, any currently paused simulations will be terminated immediately.
setValue(primitive, value) - If the simulation is paused, allows changing the value of a primitive. Value can be any equation that does not depend on the model state. E.g. "{Cows: 1, Sheep: 2} * 2" is a valid Value, but "[Other Primitive] + 1" is not.
stochastic - True if the simulation contained an element of randomness.

Examples:

> # Runs a simulation, and displays the average value of the Stock named "Rabbits"
> runModel({
>   onSuccess: function(results){
>      var sum = 0;
>      for(var i = 0; i < results.times.length; i++){
>          sum += results.value(findName("Rabbits"))[i];
>      }
>      showMessage("The average value is: " + sum/results.times.length);
>   }
> })

> # Create interactive run of the model where the primitive "Rate" is adjusted each pause interval
> runModel({
> 	silent: true,
> 	onPause: function(results){
> 		console.log("Simulation Step");
> 		results.setValue(findName("Rate"), prompt("Enter New 'Rate' Value"));
>		results.resume();
> 	},
> 	onSuccess: function(results){
> 		console.log("Simulation Done");
> 		console.log(results);
> 	},
> 	onError: function(){
> 		alert("A simulation error occurred.");
> 	}
> });

*/

function runModel(config) {
	if (simulationRunning()) {
		if( (!simulate.config.silent) && (! config.resultsWindow) ){
			mxUtils.alert(getText("You have an existing simulation running that has not yet completed. Either close the results window or press the window's 'Stop' button. You may then run a new simulation."));
			simulate.resultsWindow.show();
			return;
		}
	}

	if (isUndefined(config)) {
		config = {silent: graph instanceof SimpleNode};
	} else if (typeof config == 'boolean') {
		config = {
			silent: config
		};
	}
	return runSimulation(config);
}

function simulationRunning() {
	return simulate && (!simulate.completed());
}

function endRunningSimulation() {
	if (simulate) {
		simulate.terminate();
	}
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
		if(!unfoldingManager.unfolding){
			sendGraphtoServer(graph);
		}
	}
}


/*
Method: clearModel

Removes all primitives from the model.
*/


function clearModel() {
	if(graph instanceof SimpleNode){
		graph.children[0].children[0].children = graph.children[0].children[0].children.filter(function(x){
			return x.value.nodeName == "Setting";
		});
		clearPrimitiveCache();
	}else{
		graph.getModel().beginUpdate();
		graph.allowButtonSelect = true;
		graph.selectAll();
		graph.allowButtonSelect = false;
		graph.removeCells(graph.getSelectionCells(), false);
		graph.getModel().endUpdate();
	}
}

/*
Method: layoutModel

Reorganizes the primitives in the model according to an algorithm.

Parameters:

algorithm - The algorithm used to calculate the new positions of the primitive. Either "organic" or "circular".

*/

function layoutModel(algorithm) {
	if (algorithm == "organic") {
		var layout = new mxFastOrganicLayout(graph);
		layout.forceConstant = 50;
		executeLayout(layout, true);
	} else if (algorithm == "circular") {
		executeLayout(new mxCircleLayout(graph), true);
	} else if (algorithm == "hierarchical") {
		var layout = new mxCompactTreeLayout(graph);
		layout.horizontal = false;
		layout.resizeParent = false;
		layout.moveTree = false;
		executeLayout(layout, true);
	} else {
		alert("Unknown layout algorithm: " + algorithm);
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
Method: setZoom

Sets the scale of the diagram display.

Parameters:

scale - The diagram scale. If this is a number, then it determine the scale level. 1 means 100%, 0.5 means 50%, 2 means 200% and so on. You also pass one of the following strings: "fit" to fit the model to the diagram area, "actual" to reset the scale, "in" to zoom further in based on the current scale, and "out" to further out based on the current scale.

*/

function setZoom(scale) {
	if (scale == "fit") {
		graph.fit();
	} else if (scale == "actual") {
		graph.zoomActual();
	} else if (scale == "in") {
		graph.zoomIn();
	} else if (scale == "out") {
		graph.zoomOut();
	} else {
		graph.getView().setScale(scale);
	}
}


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
	return parseFloat(getSetting().getAttribute("TimeStep"));
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
	setAttributeUndoable(
		getSetting(), "TimeStep",
		timeStep);

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
	return parseFloat(getSetting().getAttribute("TimeStart"));
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
	setAttributeUndoable(
		getSetting(), "TimeStart",
		timeStart);

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
	return parseFloat(getSetting().getAttribute("TimeLength"));
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
	setAttributeUndoable(
		getSetting(), "TimeLength",
		timeLength);
}

/*
Method: getPauseInterval

Gets the intervals at which to pause the simulation.

Returns:

The pause interval as a floating point number. Returns undefined if a pause interval has not been specified.

See also:

<setPauseInterval>
*/

function getPauseInterval() {
	return parseFloat(getSetting().getAttribute("TimePause"));
}


/*
Method: setPauseInterval

Sets the intervals at which to pause the simulation.

Parameters:

pauseInterval - The pause interval for the simulation.

See also:

<setPauseInterval>
*/


function setPauseInterval(pauseInterval) {
	setAttributeUndoable(
		getSetting(), "TimePause",
		pauseInterval);
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
	setAttributeUndoable(
		getSetting(), "TimeUnits",
		units);
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
	setAttributeUndoable(
		getSetting(), "SolutionAlgorithm",
		algorithm);

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
	setAttributeUndoable(
		getSetting(), "Macros",
		macros);
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

<findType>, <findAll>, <findID>, <findNote>, <findValue>

*/


function findName(name) {
	var res = map(name, function(name) {
		var res = [];
		var myCells = findAll();
		for (var i = 0; i < myCells.length; i++) {
			if (isDefined(myCells[i].getAttribute("name")) && myCells[i].getAttribute("name").toLowerCase() == name.toLowerCase()) {
				res.push(myCells[i]);
			}
		}
		return res;
	});

	res = flatten(res);
	res = res.filter(function(val) {
		return val !== null;
	});

	if (name instanceof Array) {
		return res;
	} else {
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

<findName>, <findType>, <findID>, <findNote>, <findValue>

*/


function findAll() {
	var all = primitives();
	var res = [];
	for (var i = 0; i < all.length; i++) {
		if (!(all[i].value.nodeName == "Setting" || all[i].value.nodeName == "Display")) {
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

<findName>, <findAll>, <findID>, <findNote>, <findValue>

*/


function findType(type) {
	var res = map(type, function(type) {
		var t = type;
		return primitives(t);

	});
	res = flatten(res);
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

<findName>, <findType>, <findAll>, <findValue>, <findNote>, <getID>

*/



function findID(id) {
	var myCells = primitives();
	var res = map(id, function(id) {
		for (var i = 0; i < myCells.length; i++) {
			if (myCells[i].id == id) {
				return myCells[i];
			}
		}
		return null;
	});
	if (res === null) {
		return res;
	}
	if (id instanceof Array) {
		return res;
	} else {
		if (res.length == 1) {
			return res[0];
		} else {
			return res;
		}
	}
}

/*
Method: findValue

Finds and returns all primitives whose values match a regular expression.

Parameters:

search - The regular expression to search for. Can also be a string in which case the primitive values will be tested for strict case-sensitive equality against the string. May also be an array of regular expressions and strings in which case any primitive with a value that matches one element of the array will be returned.

Return:

An array of primitives whose values match the regular expression. Returns an empty array if no primitives match.

Example:

> // Returns all primitives that use the log function
> var containingLog = findValue(/log\(/i);
>
> // Returns all primitives whose value is strictly "1"
> var isOne = findValue("1");

See also:

<findName>, <findType>, <findAll>, <findNote>, <getID>

*/


function findValue(search) {
	var myCells = findAll();


	var res = map(search, function(regEx) {
		var res = [];
		for (var i = 0; i < myCells.length; i++) {
			if (regEx instanceof RegExp) {
				if (regEx.test(getValue(myCells[i]))) {
					res.push(myCells[i]);
				}
			} else {
				if (getValue(myCells[i]) == regEx) {
					res.push(myCells[i]);
				}
			}
		}
		return res;
	});

	return uniquePrimitives(flatten(res));
}

/*
Method: findNote

Finds and returns all primitives whose notes match a regular expression.

Parameters:

search - The regular expression to search for. Can also be a string in which case the primitive notes will be tested for strict case-sensitive equality against the string. May also be an array of regular expressions and strings in which case any primitive with a note that matches one element of the array will be returned.

Return:

An array of primitives whose notes match the regular expression. Returns an empty array if no primitives match.

See also:

<findName>, <findType>, <findAll>, <findValue>, <getID>

*/


function findNote(search) {
	var myCells = findAll();


	var res = map(search, function(regEx) {
		var res = [];
		for (var i = 0; i < myCells.length; i++) {
			if (regEx instanceof RegExp) {
				if (regEx.test(getNote(myCells[i]))) {
					res.push(myCells[i]);
				}
			} else {
				if (getNote(myCells[i]) == regEx) {
					res.push(myCells[i]);
				}
			}
		}
		return res;
	});

	return uniquePrimitives(flatten(res));
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


	var t = type.toLowerCase();
	
	if(graph instanceof SimpleNode){
		var parent = graph.children[0].children[0];
		var vertex = simpleCloneNode(primitiveBank[t], parent);
		parent.children.push(vertex);
		clearPrimitiveCache();
	}else{
		var parent = graph.getDefaultParent();
		
		var vertex = graph.insertVertex(parent, null, primitiveBank[t].cloneNode(true), position[0], position[1], size[0], size[1], t);
	}
	


	setName(vertex, name);

	if (vertex.value.nodeName == "Converter") {
		setConverterInit(vertex);
	}

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


	var x;
	var usedTemp = false;


	var t = (type).toLowerCase();
	
	if(graph instanceof SimpleNode){
		var parent = graph.children[0].children[0];

		if(alpha){
			parent = alpha.parent;
		}
		if(omega){
			parent = omega.parent;
		}
		var edge = simpleCloneNode(primitiveBank[t], parent);
		parent.children.push(edge);
		setEnds(edge, [alpha, omega]);
		clearPrimitiveCache();
	}else{
		var parent = graph.getDefaultParent();
		
		if (omega == null && alpha == null) {
			usedTemp = true;
			x = createPrimitive("temp stock xyz", "Stock", [300, 300], [10, 10]);
			alpha = x;
			omega = x;
		} else if (alpha == null) {
			usedTemp = true;

			var pos = getPosition(omega);
			var size = getSize(omega);
			x = createPrimitive("temp stock xyz", "Stock", [pos[0] + size[0] / 2 - 5, pos[1] - 120], [10, 10]);

			alpha = x;

		} else if (omega == null) {
			usedTemp = true;

			var pos = getPosition(alpha);
			var size = getSize(alpha);
			x = createPrimitive("temp stock xyz", "Stock", [pos[0] + size[0] / 2 - 5, pos[1] + 120 + size[1]], [10, 10]);

			omega = x;
		}
	
		var edge = graph.insertEdge(parent, null, primitiveBank[t].cloneNode(true), alpha, omega, t);
	}
	
	


	setName(edge, name);

	if (usedTemp) {
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
	if (!(primitive instanceof Array)) {
		primitive = [primitive];
	}
	
	
	if(graph instanceof SimpleNode){

		var connectors = findType(["Flow", "Transition", "Link"]);
		primitive.forEach(function(x){
			x.parent.children.splice(x.parent.children.indexOf(x), 1);
			connectors.forEach(function(c){
				if(c.source == x){
					c.source = null;
					if(c.target && c.target.parent !== c.parent){
						setParent(c, c.target.parent);
					}
				}
				if(c.target == x){
					c.target = null;
					if(c.source && c.source.parent !== c.parent){
						setParent(c, c.source.parent);
					}
				}
			})
		});
		clearPrimitiveCache();
	}else{
		graph.removeCells(primitive, false);
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
	while (folder) {
		if (getCollapsed(folder)) {
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
	graph.allowButtonSelect = true;
	if (primitives instanceof Array) {
		graph.setSelectionCells(primitives);
	} else {
		graph.setSelectionCells([primitives]);
	}
	graph.allowButtonSelect = false;
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
		if (validPrimitiveName(String(name), primitive)) {
			setAttributeUndoable(primitive, "name", String(name));
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
		setAttributeUndoable(primitive, "Units", String(units));
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
constraints - The constraints of the primitive as an array. The format is [MinimumConstraint, MinimumConstraintMode, MaximumConstraint, MaximumConstraintMode]. Constraint mode is false to disable the constraint and true to enable it.


See also:

<getConstraints>
*/


function setConstraints(primitive, constraints) {
	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "MinConstraint", constraints[0]);
		setAttributeUndoable(primitive, "MinConstraintUsed", constraints[1]);
		setAttributeUndoable(primitive, "MaxConstraint", constraints[2]);
		setAttributeUndoable(primitive, "MaxConstraintUsed", constraints[3]);
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
		setAttributeUndoable(primitive, "Note", String(note));
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
		if (!(cell.value.getAttribute("Note", null) === null || cell.value.getAttribute("Note") == "")) {
			var x = Ext.getCmp("note" + cell.id);
			if (isUndefined(x)) {

				var state = graph.view.getState(cell);
				if (state) {
					var tooltip = new Ext.ToolTip({
						html: "<big>" + clean(cell.value.getAttribute("Note").replace(/\n/g, "<br/>")) + "</big>",
						autoHide: false,
						closable: true,
						width: 300,
						draggable: true,
						id: "note" + cell.id,
						title: clean(cell.value.getAttribute("name")),
						closeAction: "destroy"
					});

					tooltip.showAt([state.x + mxPanel.getEl().getLeft() + state.width + 4 - graph.container.scrollLeft, state.y + mxPanel.getEl().getTop() - graph.container.scrollTop]);
				}

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
		if (!isUndefined(x)) {
			x.destroy();
		}
	});
}

/*
Method: showEditor

Shows the value editor for the passed primitive.

Parameters:

primitive - The primitive for which the editor will be shown. 
annotations - An optional array containing a list of annotations. Only valid for primitives with equations.

Example:

> showEditor(primitive, [{type: "error", row: 7, text: "Incorrect syntax"}])

*/


function showEditor(primitive, annotations) {
	if (primitive.value.nodeName == "Converter") {
		var editorWindow = new ConverterWindow({
			parent: "",
			cell: primitive,
			oldKeys: primitive.getAttribute("Data"),
			interpolation: primitive.getAttribute("Interpolation")
		});
		editorWindow.show();
	} else if(primitive.value.nodeName == "Stock"){
		var checkbox = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: getText('Restrict this stock to positive values'),
			checked: getNonNegative(primitive),
			autoEl: {
                'data-qtip': "If checked, the value of the stock will not be allowed to fall below zero. The rates of outflows may be adjusted to ensure this condition is met."
            }
		});
				
		var editorWindow = new EquationWindow({
			parent: "",
			cell: primitive,
			equation: getValue(primitive),
			annotations: annotations,
			extra: checkbox,
			saveExtra: function(extra){
				setNonNegative(primitive, checkbox.getValue())
			}
		});
		editorWindow.show();
	} else if(primitive.value.nodeName == "Flow"){
		var checkbox = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: getText('Restrict this flow to positive rates'),
			checked: getNonNegative(primitive),
			autoEl: {
                'data-qtip': "If checked, the flow will not be applied if the calculated rate is less than zero."
            }
		});
				
		var editorWindow = new EquationWindow({
			parent: "",
			cell: primitive,
			equation: getValue(primitive),
			annotations: annotations,
			extra: checkbox,
			saveExtra: function(extra){
				setNonNegative(primitive, checkbox.getValue());
			}
		});
		editorWindow.show();
	} else if(primitive.value.nodeName == "Transition"){
		var testVisibility = function(){
			var cond = trigger.getValue() == "Condition";
			recalculate.setDisabled(cond);
			repeat.setDisabled(cond);
		}
		
		var trigger = new Ext.form.ComboBox({
			triggerAction: "all",
			store: ['Timeout', 'Probability', 'Condition'],
			editable: false,
			selectOnFocus: false,
			value: getTriggerType(primitive),
			fieldLabel: 'Trigger Type',
			width: 240,
			listeners: {
				change: function(){
					testVisibility();
				}
			}
		});
		
		var recalculate = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: getText('Recalculate each time step'),
			checked: getTriggerRecalculate(primitive),
			margin: '0 0 0 15',
			autoEl: {
                'data-qtip': "If this is not true, the equation will be evaluated once and the trigger time scheduled based on that calculation. If this is true, the timeout or probability will be recalculated as the state of the system changes."
            }
		});
		
		var repeat = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: getText('Repeat after triggering'),
			checked: getTriggerRepeat(primitive),
			margin: '0 0 0 15',
			autoEl: {
                'data-qtip': "If this is true, the transition will be rescheduled after it is triggered. If this is not true, the transition will only be rescheduled if its source state becomes active again."
            }
		});
		
		var items = {
			xtype: 'container',
			layout: 'hbox',
			items: [trigger, recalculate, repeat]
		}
				
		testVisibility();
		
		var editorWindow = new EquationWindow({
			parent: "",
			cell: primitive,
			equation: getValue(primitive),
			annotations: annotations,
			extra: items,
			saveExtra: function(extra){
				setTriggerType(primitive, trigger.value);
				setTriggerRecalculate(primitive, recalculate.getValue());
				setTriggerRepeat(primitive, repeat.getValue());
			}
		});
		editorWindow.show();
	} else {
		var editorWindow = new EquationWindow({
			parent: "",
			cell: primitive,
			equation: getValue(primitive),
			annotations: annotations
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
			v = primitive.getAttribute("InitialValue");
		} else if (n == "Flow") {
			v = primitive.getAttribute("FlowRate");
		} else if (n == "Transition") {
			v = primitive.getAttribute("Value");
		} else if (n == "State") {
			v = primitive.getAttribute("Active");
		} else if (n == "Variable") {
			v = primitive.getAttribute("Equation");
		} else if (n == "Button") {
			v = primitive.getAttribute("Function");
		} else if (n == "Converter") {
			v = primitive.getAttribute("Data");
		} else if (n == "Action") {
			v = primitive.getAttribute("Action");
		} else if (n == "Agents") {
			v = primitive.getAttribute("Size");
		}
		if (isDefined(v)) {
			return v;
		} else {
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
			if (n == "Stock") {
				setAttributeUndoable(primitive, "InitialValue", String(value));
			} else if (n == "Flow") {
				setAttributeUndoable(primitive, "FlowRate", String(value));
			} else if (n == "Transition") {
				setAttributeUndoable(primitive, "Value", String(value));
			} else if (n == "State") {
				setAttributeUndoable(primitive, "Active", String(value));
			} else if (n == "Variable") {
				setAttributeUndoable(primitive, "Equation", String(value));
			} else if (n == "Button") {
				setAttributeUndoable(primitive, "Function", String(value));
			} else if (n == "Converter") {
				setAttributeUndoable(primitive, "Data", String(value));
			} else if (n == "Action") {
				setAttributeUndoable(primitive, "Action", String(value));
			} else if (n == "Agents") {
				if (value < 0 || Math.round(value) != value) {
					alert("The agent population size must be a non-negative integer.");
					return;
				}
				setAttributeUndoable(primitive, "Size", parseFloat(value));
			}


		}
	});

}

/*
Method: getSize

Gets the size of the passed primitive.

Parameters:

primitive - The primitive for which the position is requested. May also be an array of primitives.

Return:

The size as an array of the form: [width, height].

*/



function getSize(primitive) {
	return map(primitive, function(primitive) {
		if(graph instanceof SimpleNode){
			return [0,0];
		}
		var size = graph.getCellBounds(primitive);
		var scale = graph.view.getScale();

		return [size.width / scale, size.height / scale];
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
		if(graph instanceof SimpleNode){
			return [0,0];
		}
		var state = graph.view.getState(primitive);
		var scale = graph.view.getScale();

		return [state.x / scale, state.y / scale];
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

		var dx = state.x / scale - geo.x;
		var dy = state.y / scale - geo.y;

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
Method: flash

Temporarily changes the opacity of a primitive. Opacity between 0 (invisible) to 100 (fully opaque).

Parameters:

primitive - The primitive which will be flashed. May also be an array of primitives.
opacity - Optional temporary opacity for the primitive. Defaults to 0.
duration - Optional duration the primitive will be at the temporary opacity in milliseconds. Defaults to 100.

Example:

> flash(getSelected());

*/

function flash(primitive, opacity, duration){
	map(primitive, function(primitive){
		if(primitive.value.nodeName == "Folder"){
			flash(getChildren(primitive, false), opacity, duration);
		}
		var orig = getOpacity(primitive);
		setOpacity(primitive, opacity || 0);
		setTimeout(function(){
			setOpacity(primitive, orig);
		}, duration || 100);
	})
}

/*
Method: getShowSlider

Gets the show slider property of the passed primitive.

Parameters:

primitive - The primitive for which the show slider property will be returned. May also be an array of primitives.

Return:

Whether to show the slider property of the primitive. A boolean.

*/

function getShowSlider(primitive) {
	return map(primitive, function(primitive) {
		return isTrue(primitive.getAttribute("ShowSlider"));
	});

}

/*
Method: setShowSlider

Sets the show slider property of the passed primitive. 

Parameters:

primitive - The primitive for which the show slider property will be set. May also be an array of primitives in which case they will all be set to the same show slider value.
showSlider - Boolean whether to show the slider.

*/

function setShowSlider(primitive, showSlider) {

	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "ShowSlider", showSlider);
	});

}

/*
Method: getSliderMin

Gets the slider min property of the passed primitive.

Parameters:

primitive - The primitive for which the slider min property will be returned. May also be an array of primitives.

Return:

The minimum allowed value for the slider

*/

function getSliderMin(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("SliderMin");
	});

}

/*
Method: setSliderMin

Sets the slider min property of the passed primitive. 

Parameters:

primitive - The primitive for which the slider property will be set. May also be an array of primitives in which case they will all be set to the same slider value.
sliderMin - The minimum value of the slider.

*/

function setSliderMin(primitive, sliderMin) {

	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "SliderMin", sliderMin);
	});

}

/*
Method: getSliderMax

Gets the slider max property of the passed primitive.

Parameters:

primitive - The primitive for which the slider max property will be returned. May also be an array of primitives.

Return:

The maximum allowed value for the slider

*/

function getSliderMax(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("SliderMax");
	});

}

/*
Method: setSliderMax

Sets the slider max property of the passed primitive. 

Parameters:

primitive - The primitive for which the slider property will be set. May also be an array of primitives in which case they will all be set to the same slider value.
sliderMax - The maximum value of the slider.

*/

function setSliderMax(primitive, sliderMax) {

	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "SliderMax", sliderMax);
	});

}

/*
Method: getSliderStep

Gets the slider step property of the passed primitive.

Parameters:

primitive - The primitive for which the slider property will be returned. May also be an array of primitives.

Return:

The step value for the slider

*/

function getSliderStep(primitive) {
	return map(primitive, function(primitive) {
		return primitive.getAttribute("SliderStep");
	});

}

/*
Method: setSliderStep

Sets the slider step property of the passed primitive. 

Parameters:

primitive - The primitive for which the slider property will be set. May also be an array of primitives in which case they will all be set to the same slider value.
sliderStep - The step value of the slider.

*/

function setSliderStep(primitive, sliderStep) {

	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "SliderStep", sliderStep);
	});

}


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

		graph.getModel().execute(new mxStyleChange(graph.getModel(),
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

		graph.getModel().execute(new mxStyleChange(graph.getModel(),
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

		graph.getModel().execute(new mxStyleChange(graph.getModel(),
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

		graph.getModel().execute(new mxStyleChange(graph.getModel(),
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
		if (primitive.value.nodeName == "Stock") {
			return isTrue(primitive.getAttribute("NonNegative"));
		} else {
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
		if (primitive.value.nodeName == "Stock") {
			setAttributeUndoable(primitive, "NonNegative", nonNegative);
		} else {
			setAttributeUndoable(primitive, "OnlyPositive", nonNegative);
			if(!(primitive instanceof SimpleNode)){
				if (nonNegative) {
	                graph.setCellStyles(mxConstants.STYLE_STARTARROW, "", [primitive]);
	            } else {
	                graph.setCellStyles(mxConstants.STYLE_STARTARROW, "block", [primitive]);
	                graph.setCellStyles("startFill", 0, [primitive]);
	            }
			}
           
			
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
		setAttributeUndoable(primitive, "StockMode", type);
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
		setAttributeUndoable(primitive, "Delay", delay);
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
		return [primitive.source, primitive.target];
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
		if(! (connector instanceof SimpleNode)){
			var edit = new mxTerminalChange(graph.model, primitive, ends[0], true);
			graph.getModel().execute(edit);
			edit = new mxTerminalChange(graph.model, primitive, ends[1], false);
			graph.getModel().execute(edit);
		}else{
			primitive.source = ends[0];
			primitive.target = ends[1];
			clearPrimitiveCache();
		}
		
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
	if (primitive1.isEdge) {
		if (primitive1.source !== null && primitive1.source.id === primitive2.id) {
			return true;
		} else if (primitive1.target !== null && primitive1.target.id === primitive2.id) {
			return true;
		}
	}
	if (primitive2.isEdge) {
		if (primitive2.source !== null && primitive2.source.id === primitive1.id) {
			return true;
		} else if (primitive2.target !== null && primitive2.target.id === primitive1.id) {
			return true;
		}
	}
	var items = findType(["Flow", "Link", "Transition"]);
	for (var i = 0; i < items.length; i++) {
		if (items[i].source !== null && items[i].target !== null) {
			if (items[i].source.id === primitive1.id && items[i].target.id === primitive2.id) {
				return true;
			}
			if (items[i].target.id === primitive1.id && items[i].source.id === primitive2.id) {
				return true;
			}
		}
	}
	return false;
}

/* 

Group: States

*/


/*
Method: getResidency

Gets the residency property of a state primitive.

Parameters:

state - The state for which the residency property is requested. May also be an array of states.

Return:

The residency property as a string.

See also:

<setResidency>
*/

function getResidency(state) {
	return map(state, function(state) {
		return state.getAttribute("Residency");
	});
}

/*
Method: setResidency

Sets the residency property of a state primitive.

Parameters:

state - The state primitive for which the residency property will be set. May also be an array of states.
residency - The new value for the residency property.

See also:

<getResidency>
*/

function setResidency(state, residency) {
	map(state, function(primitive) {
		setAttributeUndoable(primitive, "Residency", residency);
	});
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
		setAttributeUndoable(primitive, "Trigger", trigger);
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
		setAttributeUndoable(primitive, "Value", value);
	});
}

/*
Method: getTriggerRepeat

Gets the trigger Repeat property of a transition or action.

Parameters:

primitive - The transition or action for which the property is requested. May also be an array of transitions or actions.

Return:

The trigger Repeat property as a boolean.

See also:

<setTriggerRepeat>
*/

function getTriggerRepeat(primitive) {
	return map(primitive, function(primitive) {
		return isTrue(primitive.getAttribute("Repeat"));
	});
}

/*
Method: setTriggerRepeat

Sets the trigger Repeat property for a transition or action.

Parameters:

primitive - The transition or action for which the Repeat property will be set. May also be an array of transitions or actions.
repeat - A boolean determining whether to repeat the trigger

See also:

<getTriggerRepeat>
*/

function setTriggerRepeat(primitive, repeat) {
	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "Repeat", repeat);
	});
}

/*
Method: getTriggerRecalculate

Gets the trigger Recalculate property of a transition or action.

Parameters:

primitive - The transition or action for which the property is requested. May also be an array of transitions or actions.

Return:

The trigger Recalculate property as a boolean.

See also:

<setTriggerRecalculate>
*/

function getTriggerRecalculate(primitive) {
	return map(primitive, function(primitive) {
		return isTrue(primitive.getAttribute("Recalculate"));
	});
}

/*
Method: setTriggerRecalculate

Sets the trigger Recalculate property for a transition or action.

Parameters:

primitive - The transition or action for which the Recalculate property will be set. May also be an array of transitions or actions.
recalculate - A boolean determining whether to recalculate each time step

See also:

<getTriggerRecalculate>
*/

function setTriggerRecalculate(primitive, recalculate) {
	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "Recalculate", recalculate);
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
		setAttributeUndoable(primitive, "Data", data);
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
		var x = primitive.getAttribute("Source");
		if (x == "Time") {
			return null;
		} else {
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
		if (input == null) {
			setAttributeUndoable(primitive, "Source", "Time");
		} else {
			setAttributeUndoable(primitive, "Source", input.id);
		}
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
		setAttributeUndoable(primitive, "Interpolation", interpolation);
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
		runAction(primitive.getAttribute("Function"), '<p>There was an error with the Action for the button <i>' + primitive.getAttribute("name") + '</i>.</p><br/>', primitive);

	});

	graph.getModel().endUpdate();

}

function runAction(code, errHeader, button) {
	try {
		eval("\"use strict;\"\n\n" + code);
	} catch (err) {
		errHeader = errHeader || '';
		Ext.Msg.show({
			title: getText('Action Error'),
			msg: errHeader + '<p><tt>' + err + "</tt></p><p><b>Code:</b></p><p><tt><pre>" + code + "</pre></tt></p>",
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.ERROR
		});

		if (button) {
			setTimeout(function() {
				highlight(button);
			}, 100)
		}
	}
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
		setAttributeUndoable(primitive, "Size", size);
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
		setAttributeUndoable(primitive, "Agent", folder.id);
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
		setAttributeUndoable(primitive, "GeoWrap", wrap);
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
		setAttributeUndoable(primitive, "GeoDimUnits", units);
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
		setAttributeUndoable(primitive, "GeoWidth", width);
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
		setAttributeUndoable(primitive, "GeoHeight", height);
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
		setAttributeUndoable(primitive, "Placement", method);
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
		setAttributeUndoable(primitive, "PlacementFunction", func);
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
		setAttributeUndoable(primitive, "Network", method);
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
		setAttributeUndoable(primitive, "NetworkFunction", func);
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
	var defaultID = "1"; //graph.getDefaultParent().id;
	return map(primitive, function(primitive) {
		
		var p = primitive.parentNode || primitive.parent;
		
		if ((p.value && p.value.nodeName =="root") || p.nodeName=="root" || p.id == defaultID) {
			return null;
		} else {
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

function setParent(primitive, parent, perserveLoc) {
	if(graph instanceof SimpleNode){
		if(parent == null){
			parent = graph.children[0].children[0];
		}
	}else{
		var p = (parent == null ? graph.getDefaultParent() : parent);
	}
	//console.log(p)
	//console.log(primitive);
	map(primitive, function(primitive) {
		//console.log(primitive.getAttribute("name"));

		if(graph instanceof SimpleNode){
			primitive.parent.children.splice(primitive.parent.children.indexOf(primitive),1);
			primitive.parent = parent;
			primitive.parentNode = parent;
			if(!parent.children){
				parent.children = [];
			}
			parent.children.push(primitive);
		}else{
			var loc = getPosition(primitive);
			var edit = new mxChildChange(graph.getModel(), p, primitive);
			graph.getModel().execute(edit);
			if (!perserveLoc) {
					setPosition(primitive, loc);
			}
		}
	});
}

/*
Method: getFrozen

Gets the frozen state for a primitive.

Parameters:

primitive - The primitive for which the frozen will be returned. May also be an array of primitives.

Return:

The frozen state for the primitive.

See also:

<setFrozen>
*/

function getFrozen(primitive) {
	return map(primitive, function(primitive) {
		
		return isTrue(primitive.getAttribute("Frozen"));
	});
}

/*
Method: setFrozen

Sets the frozen state for a primitive.

Parameters:

primitive - The primitive for which the frozen state will be set. May also be an array of primitives in which case they will all be set to the same frozen state.
frozen - The new frozen state for the primitive.

See also:

<getFrozen>
*/

function setFrozen(primitive, frozen) {
	
	map(primitive, function(primitive) {
		setAttributeUndoable(primitive, "Frozen", frozen);
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
	if (isUndefined(recursive)) {
		recursive = true;
	}
	
	if(!folder.children){
		return [];
	}

	if (recursive) {
		return flatten(map(folder.children, function(x) {
			if (x.value.nodeName == "Folder") {
				return x.children.concat([x]);
			} else {
				return x;
			}
		}));
	} else {
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
		setAttributeUndoable(primitive, "Type", type);
	});
}

/*
Method: getFolderAgentParent

Gets the agent parent of a folder.

Parameters:

folder - The folder for which the agent parent is requested. May also be an array of folders.

Return:

The agent parent as a string.

See also:

<setFolderAgentParent>
*/

function getFolderAgentParent(folder) {
	return map(folder, function(primitive) {
		return primitive.getAttribute("AgentBase");
	});
}

/*
Method: setFolderAgentParent

Sets the agent parent of a folder.

Parameters:

folder - The folder for which the type will be set. May also be an array of folders.
agentParent - The agent parent as a string.

See also:

<getFolderAgentParent>
*/

function setFolderAgentParent(folder, agentParent) {
	map(folder, function(primitive) {
		setAttributeUndoable(primitive, "AgentBase", agentParent);
	});
}


/*
Method: getFolderSolver

Gets the solver configuation for a folder. The configuration is an object with the properties:

enabled - true is the folder should have its own solver
algorithm - the solution algorithm. Current allowed values are "RK1" for Euler's method and "RK4" for a fourth order Runge-Kutta method
timeStep - the time step for the folder's solver

Parameters:

folder - The folder for which the solver is requested. May also be an array of folders.

Return:

The solver object

See also:

<setFolderSolver>
*/

function getFolderSolver(folder) {
	return map(folder, function(primitive) {
		return JSON.parse(primitive.getAttribute("Solver"));
	});
}

/*
Method: setFolderSolver

Sets the solver object for a folder

Parameters:

folder - The folder for which the solver will be set. May also be an array of folders.
solver - The solver object

See also:

<getFolderSolver>
*/

function setFolderSolver(folder, solver) {
	map(folder, function(primitive) {
		setAttributeUndoable(primitive, "Solver", JSON.stringify(solver));
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
type - The type of primitives to remove (e.g. "Flow" or "Stock"). May also be an array of types. 

Return:

A duplicate of the input array without any primitives of the specified type.

*/


function excludeType(array, type) {
	var removeSingle = function(array, type){
		if (array instanceof Array) {
			var res = [];
			for (var i = 0; i < array.length; i++) {
				if (array[i].value.nodeName != type) {
					res.push(array[i]);
				}
			}
			return res;
		} else {
			if (array == null) {
				return array;
			}
			if (array.value.nodeName == type) {
				return null
			}
			return array;
		}
	}
	
	if(Array.isArray(type)){
		for(var i = 0; i < type.length; i++){
			array = removeSingle(array, type[i]);
		}
		return array;
	}else{
		return removeSingle(array, type);
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


function primitiveIndex(array, primitive) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].id == primitive.id) {
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


function uniquePrimitives(primitives) {
	var res = [];
	for (var i = 0; i < primitives.length; i++) {
		var found = false;
		for (var r = 0; r < res.length; r++) {
			if (res[r].id == primitives[i].id) {
				found = true;
				break;
			}
		}
		if (!found) {
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

var globalVarBank = {};

function setGlobal(name, value) {
	globalVarBank["_" + name] = value;
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

function getGlobal(name) {
	return globalVarBank["_" + name];
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
		try {
			Ext.get("toolbarToggle").update("&uarr;");
			Ext.get("toplinks-holder").removeCls("collapsed");
		} catch (err) {}
	} else {
		toolbar.hide();
		try {
			Ext.get("toolbarToggle").update("&darr;");
			Ext.get("toplinks-holder").addCls("collapsed");
		} catch (err) {}
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
	return (!configPanel.collapsed);
}

/*
Method: toggleSideBar

Toggles the visibility of the side panel. If it is currently shown, it is hidden. If it is currently hidden, it is shown.

See also:

<sideBarShown>

*/

function toggleSideBar() {
	if (sideBarShown()) {
		configPanel.collapse(Ext.Component.DIRECTION_RIGHT, false);
	} else {
		configPanel.expand(false);
	}
}

/*
Method: updateSideBar

Refreshes the values in the side panel to reflect any changes in the model.

*/

function updateSideBar() {
	selectionChanged(true);
}
