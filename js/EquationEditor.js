"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

var codeEditor;

Ext.form.customFields = {
	'code': Ext.extend(Ext.form.TriggerField, {
		enableKeyEvents: false,
		selectOnFocus: true
	}),
	'converter': Ext.extend(Ext.form.TriggerField, {
		enableKeyEvents: false,
		selectOnFocus: true,
		stripCharsRe: /[^0-9\;\,\. \-]/g
	}),
	'units': Ext.extend(Ext.form.TriggerField, {
		enableKeyEvents: false,
		selectOnFocus: true,
		stripCharsRe: /[^A-Za-z 1\/\(\)\*]/g
	}),
	'richText': Ext.extend(Ext.form.TriggerField, {
		enableKeyEvents: false,
		selectOnFocus: true
	})
};

Ext.form.customFields['code'] = Ext.extend(Ext.form.customFields['code'], {
	onTriggerClick: function() {

		this.suspendEvents(false);
		this.editorWindow = new Ext.EquationWindow({
			parent: this,
			code: this.getValue(),
			cell: getSelected()[0]
		});
		this.editorWindow.show();
	},

	listeners: {
		'keydown': function(field) {
			field.setEditable(!/\\n/.test(field.getValue()));
		},
		'beforerender': function() {

			if (this.regex != undefined) {
				this.validator = function(value) {
					return this.regex.test(value);
				};
			}

		}
	}
});

Ext.EquationWindow = function(args) {
	var obj = this;

	obj.args = args;

	var code = obj.args.code.replace(/\\n/g, "\n");

	var cell = obj.args.cell;
	var neighbors = [];
	var hood = neighborhood(cell);
	for(var i=0; i<hood.length; i++){
		if(! hood[i].linkHidden){
			var s = '<big><img width=16 height=16 src="/builder/images/add.png"/> ' + clean(hood[i].item.getAttribute("name")) + '</big>';
			if(hood[i].type=="agent"){
				s = "<i class='gray'>&nbsp;&nbsp;" + s + "</i>";
			}
			neighbors.push( {
				name: hood[i].item.getAttribute("name"),
				item: s
			});
		}
	}

	var refstore = new Ext.data.Store({
		autoDestroy: true,
		idIndex: 0,
		fields: [{
			type: "string",
			name: 'name'
		}, {
			type: "string",
			name: 'item'
		}],
		data: neighbors
	});

	var neighList = new Ext.grid.Panel({
		store: refstore,
		region: 'east',
		width: 200,
		margin: '3 3 3 3',
		columns: [{
			header: 'References',
			flex: 1,
			dataIndex: 'item',
			sortable: false
		}]
	});

	codeEditor = new Ext.form.TextArea({
		id: 'myCode',
		name: 'myCode',
		enterIsSpecial: true,
		value: code,
		fieldStyle: 'font-size:large;',
		width: 200,
		margin: '3 3 3 3',
		region: 'center',
		listeners: {
			specialkey: function(field, e) {
				// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
				// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
				if (e.getKey() == e.TAB) {
					insertAtCursor(String.fromCharCode("      "));
				}
			}
		}
	});




	var helpData = [
	["General",
	[["If Then Else", "IfThenElse(##Test Condition$$, ##Value if True$$, ##Value if False$$)", "Tests a condition and returns one value if the condition is true and another value if the condition is false."],
	["Pulse", "Pulse(##Time$$, ##Height$$, ##Width$$)", "Creates a pulse input at the specified time with the specified height and width. Height defaults to 1 and width defaults to 0."],
	["Step", "Step(##Start$$, ##Height$$)", "Creates a input that is initially set to 0 and after the time of start is set to height. Height defaults to 1."],
	["Ramp", "Ramp(##Start$$, ##Finish$$, ##Height$$)", "Creates a ramp input which moves linearly from 0 to height between the start and finish times. Before start, the value is 0, after finish the value is height. Height defaults to 1."],
	["Stop", "Stop()", "Immediately terminates the simulation. Often used in combination with an IfThenElse statement."]]],
	["Mathematical", 
	[
	["Round", "Round(##Value$$)", "Rounds a number to the nearest integer."],
	["Round Up", "Ceiling(##Value$$)", "Rounds a number up to the nearest integer."],
	["Round Down", "Floor(##Value$$)", "Rounds a number down to the nearest integer."],
	["Cos", "Cos(##Value$$)", "Finds the cosine of a value in radians."],
	["Acos", "Acos(##Value$$)", "Finds the arc-cosine of a value in radians."],
	["Sin", "Sin(##Value$$)", "Finds the sine of a value in radians."],
	["Asin", "Asin(##Value$$)", "Finds the arc-sine of a value in radians."],
	["Tan", "Tan(##Value$$)", "Finds the tangent of a value in radians."],
	["Atan", "Atan(##Value$$)", "Finds the arc-tangent of a value in radians."],
	["Log", "Log(##Value$$)", "Returns the natural logarithm of a number."],
	["Exp", "Exp(##Value$$)", "Returns e taken to a power."],
	["Sum", "Sum(##Value One$$, ##Value Two$$)", "Returns the sum of a vector or list of numbers."],
	["Product", "Sum(##Value One$$, ##Value Two$$)", "Returns the product of a vector or list of numbers."],
	["Maximum", "Max(##Value One$$, ##Value Two$$)", "Returns the largest of a vector or list of numbers."],
	["Minimum", "Min(##Value One$$, ##Value Two$$)", "Returns the smallest of a vector or list of numbers."],
	["Mean", "Mean(##Value One$$, ##Value Two$$)", "Returns the mean of a vector or list of numbers."],
	["Median", "Median(##Value One$$, ##Value Two$$)", "Returns the median of a vector or list of numbers."],
	["Standard Deviation", "StdDev(##Value One$$, ##Value Two$$)", "Returns the standard deviation of a vector or list of numbers."],
	["Absolute Value", "Abs(##Value$$)", "Returns the absolute value of a number."],
	["Mod", "##(Value One)$$ mod ##(Value Two)$$", "Returns the remainder of the division of two numbers."],
	["Square Root", "Sqrt(##Value$$)", "Returns the square root of a number."],
	["Pi", "pi", "3.14159265"],
	["e", "e", "2.71828183"]]],
	["Time", 
	[
	["Seconds", "Seconds()", "The current time in seconds."],
	["Minutes", "Minutes()", "The current time in minutes."],
	["Hours", "Hours()", "The current time in hours."],
	["Days", "Days()", "The current time in days."],
	["Weeks", "Weeks()", "The current time in weeks."],
	["Months", "Months()", "The current time in weeks."],
	["Years", "Years()", "The current time in years."],
	["Current Time", "Time", "The current time with units."],
	["Time Start", "TimeStart", "The simulation start time with units."],
	["Time Step", "TimeStep", "The simulation time step with units."],
	["Time Length", "TimeLength", "The total length of the simulation with units."],
	["Time End", "TimeEnd", "The time at which the simulation ends."]]],
	["Historical", 
	[
	["Delay", "Delay(##[Primitive Reference]$$, ##Delay Length$$, ##Default Value$$)", "Returns the value of a primitive (referenced with <...>) for a Delay Length of time ago. Default Value stands in for the primitive value in the case of negative times."],
	["Delay1", "Delay1(##[Primitive Reference]$$, ##Delay Length$$, ##Initial Value$$)", "Returns a smoothed, first-order exponential delay of the value of a primitive. Initial Value is optional."],
	["Delay3", "Delay3(##[Primitive Reference]$$, ##Delay Length$$, ##Initial Value$$)", "Returns a smoothed, third-order exponential delay of the value of a primitive. Initial Value is optional."],
	["Smooth", "Smooth(##[Primitive Reference]$$, ##Length$$, ##Initial Value$$)", "Returns a smoothing of a primitive's past values. Results in an averaged curve fit. Length affects the weight of past values. Initial Value is optional."],
	["PastValues", "PastValues(##[Primitive Reference]$$)", "Returns the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the depth of the history."],
	["Maximum", "PastMax(##[Primitive Reference]$$)", "Returns the maximum of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Minimum", "PastMin(##[Primitive Reference]$$)", "Returns the minimum of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Median", "PastMedian(##[Primitive Reference]$$)", "Returns the median of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Mean", "PastMean(##[Primitive Reference]$$)", "Returns the mean of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Standard Deviation", "PastStdDev(##[Primitive Reference]$$)", "Returns the standard deviation of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Correlation", "PastCorrelation(##[Primitive Reference]$$, ##[Primitive Reference]$$)", "Returns the correlation between the values of that two primitives have taken on over the course of the simulation. The second optional argument is a time window to limit the exploration."],
	["Fix", "Fix(##Value$$, ##Period=-1$$)", "Takes the dynamic value and forces it to be fixed over the course of the period. If period is -1, the value is held constant over the course of the whole simulation."]]],
	["Random Numbers", 
	[
	["Uniform Distribution", "Rand(##Minimum$$, ##Maximum$$)", "Generates a uniformly distributed random number between the minimum and maximum."],
	["Normal Distribution", "RandNormal(##Mean$$, ##Standard Deviation$$)", "Generates a normally distributed random number with a mean and a standard deviation."],
	["Lognormal Distribution", "RandLognormal(##Mean$$, ##Standard Deviation$$)", "Generates a lognormally distributed random number with a mean and a standard deviation."],
	["Binary Distribution", "RandBoolean(##Probability$$)", "Returns 1 with the specified probability, otherwise 0. Probability defaults to 0.5."],
	["Binomial Distribution", "RandBinomial(##Count$$, ##Probability$$)", "Generates a binomially distributed random number. The number of successes in Count random events each with Probability of success."],
	["Negative Binomial", "RandNegativeBinomial(##Successes$$, ##Probability$$)", "Generates a negative binomially distributed random number. The number of random events each with Probability of success required to generate the specified Successes."],
	["Poisson Distribution", "RandPoisson(##Lambda$$)", "Generates a Poisson distributed random number."],
	["Triangular Distribution", "RandTriangular(##Minimum$$, ##Maximum$$, ##Peak$$)", "Generates a triangularly distributed random number."],
	["Exponential Distribution", "RandExp(##Lambda$$)", "Generates an exponentially distributed random number with the specified rate parameter."],
	["Gamma Distribution", "RandGamma(##Alpha$$, ##Beta$$)", "Generates a gamma distributed random number."]]],
	["Agents",
	[
	["Find All", "FindAll(##[Agent Population]$$)", "Returns a vector of agents in an agent population."],
	["Find State", "FindState(##[Agent Population]$$, ##[State]$$)", "Returns an agent population of agents in the specified state."],
	["Find Not State", "FindNotState(##[Agent Population]$$, ##[State]$$)", "Returns a vector of agents not in the specified state."],
	["Find Index", "FindIndex(##[Agent Population]$$, ##Index$$)", "Returns an agent with the specified index."],
	["Find Nearby", "FindNearby(##[Agent Population]$$, ##[Target]$$, ##Distance$$)", "Returns a vector of agents that are within the specified distance of a target agent."],
	["Find Nearest", "FindNearest(##[Agent Population]$$, ##[Target]$$, ##Count=1$$)", "Returns the nearest agent to the target agent."],
	["Find Furthest", "FindFurthest(##[Agent Population]$$, ##[Target]$$, ##Count=1$$)", "Returns the agent farthest from the target agent."],
	["Value", "Value(##[Agent Population]$$, ##[Primitive]$$)", "Returns the values of the specified primitive for each agent in the population."],
	["Set Value", "SetValue(##[Agent Population]$$, ##[Primitive]$$, ##Value$$)", "Sets the value of the specified primitive for each agent in the population to the given value."],
	["Location", "Location(##[Agent]$$)", "Returns the location of an agent as the vector <<x, y>>."],
	["Distance", "Distance(##[Agent 1]$$, ##[Agent 2]$$)", "Returns the distance between two agents."],
	["Move", "Move(##[Agent]$$, ##<<x, y>>$$)", "Moves an agent the amount specified."],
	["MoveTowards", "MoveTowards(##[Agent]$$, ##[Target]$$, ##Distance$$)", "Moves an agent towards a target agent the distance specified."],
	["Connected", "Connected(##[Agent]$$)", "Returns the agents connected in the network to an agent."],
	["Connect", "Connect(##[Agent 1]$$, ##[Agent 2]$$)", "Connects two agents in the network."],
	["Unconnect", "Unconnect(##[Agent 1]$$, ##[Agent 2]$$)", "Unconnects two agents in the network."],
	["PopulationSize", "PopulationSize(##[Agent Population]$$)", "The total number of agents in a population."],
	["Add", "Add(##[Agent Population]$$, ##[Base]=Initial Agent$$)", "Adds a new agent to the population. If [Base] is set, the new agent will be a clone of [Base]. Otherwise the agent will be like a newly created agent at the start of the simulation."],
	["Remove", "Remove(##[Agent]$$)", "Removes an agent from the population. The agent will no longer be simulated. Can be used to \"Kill\" an agent."],
	["Width", "Width(##[Agent Population]$$)", "The width of the agent population region."],
	["Height", "Height(##[Agent Population]$$)", "The height of the agent population region."]
	]],
	["Vectors",
	[
	["Count", "Count(##Vector$$)", "Counts the number of elements in a vector."],
	["Join", "Join(##Item 1$$, ##Item 2$$, ##Item N$$)", "Merges items together into a combined vector."],
	["Flatten", "Flatten(##Vector$$)", "Flattens a vector removing and expanding all nested vectors."],
	["Unique", "Unique(##Vector$$)", "Returns a vector with duplicates removed."],
	["Union", "Union(##Vector 1$$, ##Vector 2$$)", "Returns the combined elements of two vectors (with duplicates removed)."],
	["Intersection", "Intersection(##Vector 1$$, ##Vector 2$$)", "Returns the elements that exist in both vectors."],
	["Difference", "Difference(##Vector 1$$, ##Vector 2$$)", "Returns the elements that exist in only one of the vectors."],
	["Sort", "Sort(##Vector$$)", "Sorts a vector from smallest value to largest value."],
	["Reverse", "Reverse(##Vector$$)", "Reverses the ordering of elements in a vector."],
	["Select", "Select(##Vector$$, ##Items$$)", "Subsets a vector. Items can be a single index or a vector of true false values."],
	["Sample", "Sample(##Vector$$, ##Sample Size$$, ##Allow Repeats$$)", "Takes a random sample from a vector. Allow repeats is false by default."],
	["IndexOf", "IndexOf(##Vector$$, ##Needle$$)", "Returns the position of the needle within the vector. If the needle is not found, 0 is returned."],
	["Contains", "Contains(##Vector$$, ##Needle$$)", "Returns true if the needle is in the vector. Otherwise returns false."],
	["Repeat", "Repeat(##x^2$$, ##Times$$)", "Creates a new vector by repeating a function a specified number of times."],
	["Map", "Map(##Vector$$, ##x^2+1$$)", "Applies a function to each element of a vector and returns the result."],
	["Filter", "Filter(##Vector$$, ##x>7$$)", "Tests each element of a vector using a function and returns the elements which evaluate to true."]
	]]
	
	];
	
	
	function addButton(vals){
		buttons.push(new Ext.Button({
			text: vals[0],
			margin:2,
			tooltip: "<b>"+vals[1].replace(/\$\$/g, "").replace(/##/g, "").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</b><br/>"+vals[2],
			handler: function(btn, e) {
				insertAtCursor(vals[1].replace(/\$\$/g, "").replace(/##/g, ""));
			}
		}));
	}
	
	var tabItems=[];
	for (var i = 0; i < helpData.length; i++) {
			var buttons = [];
			for (var j = 0; j < helpData[i][1].length; j++) {
				addButton(helpData[i][1][j]);
			}
			tabItems.push({
				title: helpData[i][0],
				items: buttons,
				layout: {
					type: 'hbox', 
					align:"stretch"
				},
				autoScroll: true
			});
	}

	var equal = new Ext.Component({
		html: "<big><big><big>=</big></big></big>",
		region: "west",
		margin: '0 0 0 3'
	});

	var tabs = new Ext.TabPanel({
		region: 'south',
		height: 85,
		activeTab: 0,
		margin: '0 3 0 3',
		enableTabScroll: true,
		items: tabItems,
		border: false
	});


	//var form = new Ext.FormPanel({layout:"border",frame:true,border:true, items: [syntax, refList, help]});
	obj.win = new Ext.Window({
		title: 'Equation Editor: '+clean(cell.getAttribute("name")),
		layout: 'border',
		closeAction: 'destroy',
		border: false,
		modal: true,
		items: [codeEditor, neighList, tabs, equal],
		width: 600,
		height: 400,
		resizable: false,
		shadow: true,
		buttonAlign: 'left',
		buttons: [{
			disabled: ! is_editor,
			scale: "large",
			text: 'Units',
			iconCls: 'units-icon',
			tooltip: 'Edit primitive units',
			handler: function() {
				var unitsWindow = new Ext.UnitsWindow({
					parent: "",
					cell: cell,
					units: cell.getAttribute("Units")
				});
				unitsWindow.show();
			}
		}, '->',
		{
			scale: "large",
			iconCls: "cancel-icon",
			text: 'Cancel',
			handler: function() {
				obj.win.close();
				if (obj.args.parent != "") {
					obj.args.parent.resumeEvents();
				}
			}
		}, {
			disabled: !is_editor,
			iconCls: "apply-icon",
			scale: "large",
			text: 'Apply',
			handler: function() {
				var newCode = codeEditor.getValue();
				newCode = newCode.replace(/\n|\r/g, "\\n");

				if (obj.args.parent != "") {
					obj.args.parent.setValue(newCode);
				}
				obj.win.close();


				if (obj.args.parent != "") {
					obj.args.parent.resumeEvents();
					grid.plugins[0].completeEdit();
					obj.args.parent.setEditable(!/\\n/.test(newCode));
				} else {
					graph.getModel().beginUpdate();
					setValue(obj.args.cell, newCode);
					graph.getModel().endUpdate();
					selectionChanged(false);
				}
			}
		}]
	});

	neighList.on('beforeselect', function(view, node, items, options) {
		insertAtCursor("[" + node.data.name + "]");
		codeEditor.focus(false, true);
		return false;
	});



	obj.show = function() {
		obj.win.show();
		codeEditor.focus(true, true);
	}
}


function insertAtCursor(myValue) {
	var document_id = codeEditor.getFocusEl().id;
	var text_field = document.getElementById(document_id);

	text_field.focus();
	var startPos = getInputSelection(text_field).start;
	var endPos = getInputSelection(text_field).end;

	codeEditor.setValue(codeEditor.getValue().substring(0, startPos) + myValue + codeEditor.getValue().substring(endPos, codeEditor.getValue().length));

	codeEditor.getFocusEl().focus();

	if (text_field.setSelectionRange) {
		text_field.focus();
		text_field.setSelectionRange(endPos + myValue.length, endPos + myValue.length);
	} else if (text_field.createTextRange) {
		var range = text_field.createTextRange();
		range.collapse(true);
		range.moveEnd('character', endPos + myValue.length);
		range.moveStart('character', endPos + myValue.length);
		range.select();
	}

	text_field.focus();
}

function getInputSelection(el) {
	var start = 0,
		end = 0,
		normalizedValue, range, textInputRange, len, endRange;

	if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
		start = el.selectionStart;
		end = el.selectionEnd;
	} else {
		range = document.selection.createRange();

		if (range && range.parentElement() == el) {
			len = el.value.length;
			normalizedValue = el.value.replace(/\r\n/g, "\n");

			// Create a working TextRange that lives only in the input
			textInputRange = el.createTextRange();
			textInputRange.moveToBookmark(range.getBookmark());

			// Check if the start and end of the selection are at the very end
			// of the input, since moveStart/moveEnd doesn't return what we want
			// in those cases
			endRange = el.createTextRange();
			endRange.collapse(false);

			if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
				start = end = len;
			} else {
				start = -textInputRange.moveStart("character", -len);
				start += normalizedValue.slice(0, start).split("\n").length - 1;

				if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
					end = len;
				} else {
					end = -textInputRange.moveEnd("character", -len);
					end += normalizedValue.slice(0, end).split("\n").length - 1;
				}
			}
		}
	}

	return {
		start: start,
		end: end
	};
}
