"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

function formatUnitsBut(s) {
	if ((!s) || s.trim() == "") {
		return "Unitless";
	} else {
		return Ext.util.Format.ellipsis(s, 20);
	}
}

var EquationEditor = Ext.extend(Ext.form.TextField, {
	enableKeyEvents: false,
	selectOnFocus: true,
	triggers: {
		edit: {
			hideOnReadOnly: false,
			handler: function() {

				this.editorWindow = new EquationWindow({
					parent: this,
					equation: this.getValue(),
					cell: getSelected()[0],
					help: this.help
				});
				this.editorWindow.show();
			}
		}
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

function EquationWindow(config) {
	var me = this;


	var equation = config.equation.replace(/\\n/g, "\n");

	var cell = config.cell;
	var neighbors = [];
	var hood = neighborhood(cell);
	for (var i = 0; i < hood.length; i++) {
		if (!hood[i].linkHidden) {
			var s = '<i class="fa fa-plus-circle" style="color: green; font-size: 120%"></i> &nbsp;' + clean(hood[i].item.getAttribute("name"));
			if (hood[i].type == "agent") {
				s = "<i class='gray'>&nbsp;&nbsp;" + s + "</i>";
			}
			neighbors.push({
				insert: "[" + hood[i].item.getAttribute("name") + "]",
				display: s,
				group: " References",
				tip: undefined
			});
		}
	}

	if (neighbors.length == 0) {
		neighbors.push({
			insert: undefined,
			group: " References",
			tip: undefined,
			display: "<i class='gray'>" + getText("No references available") + "</i>"
		});
	}

	var availableLinks = new Ext.data.Store({
		autoDestroy: true,
		idIndex: 0,
		fields: [{
			type: "string",
			name: 'insert'
		}, {
			type: "string",
			name: 'display'
		}, {
			type: "string",
			name: "tip"
		}, {
			type: "string",
			name: "group"
		}],
		groupField: 'group',
		data: neighbors
	});


	var equationEditor = new Ext.ux.AceEditor({
		readOnly: !viewConfig.allowEdits,
		annotations: config.annotations,
		enterIsSpecial: true,
		value: equation,
		width: 200,
		margin: '0 0 0 0',
		region: 'center'
	});




	var helpData = [
		["Mathematical Functions", [
			["Round", "Round(##Value$$)", "Rounds a number to the nearest integer.", ["Round(3.6)", "4"]],
			["Round Up", "Ceiling(##Value$$)", "Rounds a number up to the nearest integer.", ["Ceiling(3.6)", "4"]],
			["Round Down", "Floor(##Value$$)", "Rounds a number down to the nearest integer.", ["Floor(3.6)", "3"]],
			["Cos", "Cos(##Angle$$)", "Finds the cosine of an angle.", ["Cos({180 Degrees})", "-1"]],
			["ArcCos", "ArcCos(##Value$$)", "Finds the arc-cosine of a value. The result includes units.", ["ArcCos(0)", "{90 Degrees}"]],
			["Sin", "Sin(##Angle$$)", "Finds the sine of an angle.", ["Sin({180 Degrees})", "0"]],
			["ArcSin", "ArcSin(##Value$$)", "Finds the arc-sine of a value.  The result includes units.", ["ArcSin(1)", "{90 Degrees}"]],
			["Tan", "Tan(##Angle$$)", "Finds the tangent of an angle.", ["Tan({Pi/4 Radians})", "1"]],
			["ArcTan", "ArcTan(##Value$$)", "Finds the arc-tangent of a value. The result includes units.", ["ArcTan(1)", "{45 Degrees}"]],
			["Log", "Log(##Value$$)", "Returns the base-10 logarithm of a number.", ["Log(1000)", "3"]],
			["Ln", "Ln(##Value$$)", "Returns the natural logarithm of a number.", ["Ln(e^2)", "2"]],
			["Exp", "Exp(##Value$$)", "Returns e taken to a power.", ["Exp(1)", "e"]],
			["Sum", "Sum(##Values$$)", "Returns the sum of a vector or list of numbers.", ["Sum(7, 5, 6)", "18"]],
			["Product", "Product(##Values$$)", "Returns the product of a vector or list of numbers.", ["Product(2, 4, -1)", "-8"]],
			["Maximum", "Max(##Values$$)", "Returns the largest of a vector or list of numbers.", ["Max(2, 4, -1)", "4"]],
			["Minimum", "Min(##Values$$)", "Returns the smallest of a vector or list of numbers.", ["Min(2, 4, -1, 3)", "-1"]],
			["Mean", "Mean(##Values$$)", "Returns the mean of a vector or list of numbers.", ["Mean(2, 7, 3)", "4"]],
			["Median", "Median(##Values$$)", "Returns the median of a vector or list of numbers.", ["Median(2, 7, 3)", "3"]],
			["Standard Deviation", "StdDev(##Values$$)", "Returns the standard deviation of a vector or list of numbers.", ["StdDev(1, 2, 3)", "1"]],
			["Absolute Value", "Abs(##Value$$)", "Returns the absolute value of a number.", ["Abs(-23)", "23"]],
			["Mod", "##(Value One)$$ mod ##(Value Two)$$", "Returns the remainder of the division of two numbers.", ["13 mod 5", "3"]],
			["Square Root", "Sqrt(##Value$$)", "Returns the square root of a number.", ["Sqrt(9)", "3"]],
			["Sign", "Sign(##Value$$)", "1 if the value is greater than 0, -1 if it is less than 0, and 0 if it is 0.", ["Sign(-12)", "-1"]],
			["Pi", "pi", "The value 3.14159265."],
			["e", "e", "The value 2.71828183."],
			["Logit", "Logit(##Value$$)", "Returns the logit transformation of the value. Converts values on a 0 to 1 scale to a -Infinity to Infinity scale.", ["Logit(0.5)", "0"]],
			["Expit", "Expit(##Value$$)", "Returns the expit transformation of the value. Converts values on a -Infinity to Infinity scale to a 0 to 1 scale.", ["Expit(0)", "0.5"]]
		]],
		["Time Functions", [
			["Seconds", "Seconds()", "The current time in seconds.", ["Seconds()*1000", "The time in milliseconds"]],
			["Minutes", "Minutes()", "The current time in minutes.", ["Seconds() = Minutes()*60", "True"]],
			["Hours", "Hours()", "The current time in hours."],
			["Days", "Days()", "The current time in days."],
			["Weeks", "Weeks()", "The current time in weeks."],
			["Months", "Months()", "The current time in months."],
			["Years", "Years()", "The current time in years.", "IfThenElse(Years() > 10, 15, 0)"],
			["Current Time", "Time()", "The current time including units.", "IfThenElse(Time() > {10 Years}, 15, 0)"],
			["Time Start", "TimeStart()", "The simulation start time including units."],
			["Time Step", "TimeStep()", "The simulation time step including units."],
			["Time Length", "TimeLength()", "The total length of the simulation including units."],
			["Time End", "TimeEnd()", "The time at which the simulation ends including units.", ["TimeStart() + TimeLength() = TimeEnd()", "True"]],
			["Seasonal", "Seasonal(Peak=0)", "Model of seasonality influences. Sine wave with a period of one year, a peak amplitude of one, and a peak at the specified time.", ["Seasonal({9 Months})*0.5+1", "A wave that oscillates from 0 to 1 and peaks in September"]]
		]],
		["Historical Functions", [
			["Delay", "Delay(##[Primitive]$$, ##Delay Length$$, ##Default Value$$)", "Returns the value of a primitive for a specified length of time ago. Default Value stands in for the primitive value in the case of negative times.", "Delay([Income], {5 Years})"],
			["Delay1", "Delay1(##[Primitive]$$, ##Delay Length$$, ##Initial Value$$)", "Returns a smoothed, first-order exponential delay of the value of a primitive. The Initial Value is optional.", "Delay1([Income], 5, 10000)"],
			["Delay3", "Delay3(##[Primitive]$$, ##Delay Length$$, ##Initial Value$$)", "Returns a smoothed, third-order exponential delay of the value of a primitive. The Initial Value is optional.", "Delay3([Income], {20 Months}, 10000)"],
			["Smooth", "Smooth(##[Primitive]$$, ##Length$$, ##Initial Value$$)", "Returns a smoothing of a primitive's past values. Results in an averaged curve fit. Length affects the weight of past values. The Initial Value is optional."],
			["PastValues", "PastValues(##[Primitive]$$, ##Period = All Time$$)", "Returns the values a primitive has taken on over the course of the simulation as a vector. The second optional argument is a time window to limit the depth of the history.", ["Sum(PastValues([Income]))", "Total past income"]],
			["Maximum", "PastMax(##[Primitive]$$, ##Period = All Time$$)", "Returns the maximum of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the calculation.", ["PastMax([Income], {10 Years})", "The maximum income in the past 10 years"]],
			["Minimum", "PastMin(##[Primitive]$$, ##Period = All Time$$)", "Returns the minimum of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the calculation.", ["PastMin([Income], 10)", "The minimum income in the past 10 units of time"]],
			["Median", "PastMedian(##[Primitive]$$, ##Period = All Time$$)", "Returns the median of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the calculation."],
			["Mean", "PastMean(##[Primitive]$$, ##Period = All Time$$)", "Returns the mean of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the calculation."],
			["Standard Deviation", "PastStdDev(##[Primitive]$$, ##Period = All Time$$)", "Returns the standard deviation of the values a primitive has taken on over the course of the simulation. The second optional argument is a time window to limit the calculation."],
			["Correlation", "PastCorrelation(##[Primitive]$$, ##[Primitive]$$, ##Period = All Time$$)", "Returns the correlation between the values that two primitives have taken on over the course of the simulation. The third optional argument is an optional time window to limit the calculation.", ["PastCorrelation([Income], [Expenditures], {10 Years})", "The correlation between income and expenditures over the past 10 years."]],
			["Fix", "Fix(##Value$$, ##Period=-1$$)", "Takes the dynamic value and forces it to be fixed over the course of the period. If period is -1, the value is held constant over the course of the whole simulation.", ["Fix(Rand(), {5 Years})", "Chooses a new random value every five years"]]
		]],
		["Random Number Functions", [
			["Uniform Distribution", "Rand(##Minimum$$, ##Maximum$$)", "Generates a uniformly distributed random number between the minimum and maximum. The minimum and maximum are optional and default to 0 and 1 respectively.", ["Rand()", "0.7481"]],
			["Normal Distribution", "RandNormal(##Mean$$, ##Standard Deviation$$)", "Generates a normally distributed random number with a mean and a standard deviation. The mean and standard deviation are optional and default to 0 and 1 respectively.", ["RandNormal(10, 1)", "11.23"]],
			["Lognormal Distribution", "RandLognormal(##Mean$$, ##Standard Deviation$$)", "Generates a log-normally distributed random number with a mean and a standard deviation."],
			["Binary Distribution", "RandBoolean(##Probability$$)", "Returns 1 with the specified probability, otherwise 0. The probability is optional and defaults to 0.5: a coin flip.", ["RandBoolean(0.1)", "False"]],
			["Binomial Distribution", "RandBinomial(##Count$$, ##Probability$$)", "Generates a binomially distributed random number. The number of successes in Count random events each with Probability of success."],
			["Negative Binomial", "RandNegativeBinomial(##Successes$$, ##Probability$$)", "Generates a negative binomially distributed random number. The number of random events each with Probability of success required to generate the specified Successes."],
			["Poisson Distribution", "RandPoisson(##Lambda$$)", "Generates a Poisson distributed random number."],
			["Triangular Distribution", "RandTriangular(##Minimum$$, ##Maximum$$, ##Peak$$)", "Generates a triangularly distributed random number."],
			["Exponential Distribution", "RandExp(##Lambda$$)", "Generates an exponentially distributed random number with the specified rate parameter."],
			["Gamma Distribution", "RandGamma(##Alpha$$, ##Beta$$)", "Generates a Gamma distributed random number."],
			["Beta Distribution", "RandBeta(##Alpha$$, ##Beta$$)", "Generates a Beta distributed random number."],
			["Custom Distribution", "RandDist(##X$$, ##Y$$)", "Generates a random number according to a custom distribution. Takes two vectors with the x- and y-coordinates respectively of points defining the distribution. Points are interpolated linearly. The distribution does not have to be normalized such that its area is 1, but the points must be sorted from smallest to largest x locations. You may also pass a single vector containing pairs of {x, y} coordinates (e.g. { {1, 0}, {3, 4}, {4, 0} } ).", ["RandDist({0, 1, 2, 3}, {0, 5, 1, 0})", "1.2"]]
		]],
		["Agent Functions", [
			["Find All", "##[Agent Population]$$.FindAll()", "Returns a vector of all the agents in the agent population."],
			["Find State", "##[Agent Population]$$.FindState(##[State]$$)", "Returns a vector of agents in the specified state.", ["[University].FindState([Smoker])", "All smokers in the University population"]],
			["Find Not State", "##[Agent Population]$$.FindNotState(##[State]$$)", "Returns a vector of agents not in the specified state.", ["[University].FindNotState([Smoker])", "All non-smokers in the University population"]],
			["Find Index", "##[Agent Population]$$.FindIndex(##Index$$)", "Returns an agent with the specified index. Agent indexes start at 1.", ["[Population].FindIndex(1)", "The first agent created"]],
			["Find Nearby", "##[Agent Population]$$.FindNearby(##Target$$, ##Distance$$)", "Returns a vector of agents that are within the specified distance of a target agent or location.", ["[Population].FindState([Infected]).FindNearby(Self, 25)", "All infected people who are near the agent"]],
			["Find Nearest", "##[Agent Population]$$.FindNearest(##Target$$, ##Count=1$$)", "Returns the nearest agents to the target agent or location. The number of agents returned is specified by the optional Count.", ["[Population].FindNearest(Target)", "The nearest agent to the target."]],
			["Find Furthest", "##[Agent Population]$$.FindFurthest(##Target$$, ##Count=1$$)", "Returns the agent farthest from the target agent or location. The number of agents returned is specified by the optional Count.", ["[Population].FindFurthest(Target, 4)", "The four furthest agents from the target"]],
			["Value", "##[Agent Population]$$.Value(##[Primitive]$$)", "Returns the values of the specified primitive for each agent in the population as a vector.", ["[University].Value([GPA]).Mean()", "The average GPA of all students in the University population"]],
			["Set Value", "##[Agent Population]$$.SetValue(##[Primitive]$$, ##Value$$)", "Sets the value of the specified primitive for each agent in the population to the given value. Can also be applied directly to an agent.", ["[University].SetValue([Smoker], false)", "Make all the smokers quit smoking"]],
			["Location", "##[Agent]$$.Location()", "Returns the location of an agent as the vector {x, y}.", ["Self.Location().x", "The x-coordinate of the agent"]],
			["Set Location", "##[Agent]$$.SetLocation(##New Location$$)", "Sets the location of the agent.", ["[Student].SetLocation({x: 60, y: 40})", "Moves the student to a new position"]],
			["Index", "##[Agent]$$.Index()", "Gets the numeric index of an agent within an agent population. Indexes are sequential within a population and start at 1."],
			["Distance", "Distance(##Location 1$$, ##Location 2$$)", "Returns the distance between two agents or locations."],
			["Move", "##[Agent]$$.Move(##{x, y}$$)", "Moves an agent the amount specified.", ["Self.Move({Rand(), Rand()})", "Take a random walk"]],
			["MoveTowards", "##[Agent]$$.MoveTowards(##Target$$, ##Distance$$)", "Moves an agent towards a target agent or location by the distance specified.", ["Self.MoveTowards({0, 100}, 10)", "Moves towards the point {0, 100}."]],
			["Connected", "##[Agent]$$.Connected()", "Returns the agents connected to an agent in the network.", ["Self.Connected().Length()", "The number of connections an agent has"]],
			["Connect", "##[Agent 1]$$.Connect(##[Agent 2]$$, ##Weight=1$$)", "Connects two agents in the network. The second agent can also be a vector of agents. Optionally, you can specify a connection weight which will be stored with the connection.", ["Self.Connect([Population].FindNearest(Self))", "Connects an agent to the nearest agent to it in the population"]],
			["Unconnect", "##[Agent 1]$$.Unconnect(##[Agent 2]$$)", "Unconnects two agents in the network. The second agent can also be a vector of agents.", ["Self.Unconnect(Self.Connected())", "Removes an agent's connections"]],
			["Connection Weight", "##[Agent 1]$$.ConnectionWeight(##[Agent 2]$$)", "Returns the connection weight between two agents."],
			["Set Connection Weight", "##[Agent 1]$$.SetConnectionWeight(##[Agent 2]$$, ##Weight$$)", "Sets the connection weight between two agents."],
			["PopulationSize", "##[Agent Population]$$.PopulationSize()", "The total number of agents in a population."],
			["Add", "##[Agent Population]$$.Add(##Base Agent=Initial Agent$$)", "Adds a new agent to the population. If Base is set, the new agent will be a clone of [Base]. Otherwise the agent will be like a newly created agent at the start of the simulation.", ["Repeat([University].Add(), 200)", "Enroll 200 new students in the University"]],
			["Remove", "##[Agent]$$.Remove()", "Removes an agent from the population. The agent will no longer be simulated. Can be used to \"Kill\" an agent.", ["[University].FindState([Smoker]).Map(x.Remove())", "Expel all the smokers from the University"]],
			["Width", "Width(##Agent$$)", "The width of the geographic region an agent is within."],
			["Height", "Height(##Agent$$)", "The height of the geographic region an agent is within."]
		]],
		["Vector Functions", [
			["Range", "##Start$$:##End$$", "Creates a vector with a range of sequential values going from start to end. To use step sizes other than 1, place the step size between the start and the end, for example \"0:0.5:10\".", ["1:5", "{1, 2, 3, 4, 5}"]],
			["Length", "##Vector$$.Length()", "The number of elements in a vector. Count() is a synonym for length.", ["{1, 1, 2, 3}.Length()", "4"]],
			["Select", "##Vector$${##Selector$$}", "Selects one or more elements from a vector. The selector can be an integer or vector of integers, a string or vector of strings (for named vectors), or a vector of booleans.", ["{1,3,7}{2}", "3"]],
			["Join", "Join(##Item 1$$, ##Item 2$$, ##Item N$$)", "Merges items together into a single vector.", ["Join(0, {1, 1, 2})", "{0, 1, 1, 2}"]],
			["Flatten", "##Vector$$.Flatten()", "Flattens a vector removing and expanding all nested vectors.", ["{ {0}, {1, 1, 2} }.Flatten()", "{0, 1, 1, 2}"]],
			["Unique", "##Vector$$.Unique()", "Returns a vector with duplicates removed.", ["{1, 1, 2, 3}.Unique()", "{1, 2, 3}"]],
			["Union", "##Vector$$.Union(##Vector 2$$)", "Returns the combined elements of two vectors (with duplicates removed).", ["{1, 2}.Union({2, 3})", "{1, 2, 3}"]],
			["Intersection", "##Vector$$.Intersection(##Vector 2$$)", "Returns the elements that exist in both vectors.", ["{1, 2}.Intersection({2, 3})", "{2}"]],
			["Difference", "##Vector$$.Difference(##Vector 2$$)", "Returns the elements that exist in only one of the two vectors.", ["{1, 2}.Difference({2, 3})", "{1, 3}"]],
			["Sort", "##Vector$$.Sort()", "Sorts a vector from smallest value to largest value.", ["{1, 3, 2}.Sort()", "{1, 2, 3}"]],
			["Reverse", "##Vector$$.Reverse()", "Reverses the ordering of elements in a vector.", ["{1, 2, 3}.Reverse()", "{3, 2, 1}"]],
			["Sample", "##Vector$$.Sample(##Sample Size$$, ##Allow Repeats=False$$)", "Takes a random sample from a vector. Allow Repeats determines whether the same index can be sampled multiple time and is false by default.", ["{1, 4, 9}.Sample(2)", "{9, 1}"]],
			["IndexOf", "##Vector$$.IndexOf(##Needle$$)", "Returns the position of the needle within the vector (starting with index 1). If the needle is not found, 0 is returned.", ["{1, 4, 9}.IndexOf(9)", "3"]],
			["Contains", "##Vector$$.Contains(##Needle$$)", "Returns true if the needle is in the vector. Otherwise returns false.", ["{1, 4, 9}.Contains(9)", "true"]],
			["Repeat", "Repeat(##Expression$$, ##Times$$)", "Creates a new vector by repeating an expression a specified expression a number of times. 'x' in the expression refers to the current index. Times may also be a vector of strings in which case a named vector is created.", ["Repeat(x^2, 3)", "{1, 4, 9}"]],
			["Map", "##Vector$$.Map(##Function$$)", "Applies a function to each element of a vector and returns the result. The function may also be an expression where 'x' in the expression represents the current element and, for named vectors, 'key' represents the current element's key.", ["{1, 2, 3}.Map(x*2)", "{2, 4, 6}"]],
			["Filter", "##Vector$$.Filter(##Function$$)", "Tests each element of a vector using a function and returns the elements which evaluate to true. The function may also be an expression where 'x' in the expression represents the current element.", ["{1, 2, 3}.Filter(x >= 2)", "{2, 3}"]],
			["Keys", "##Vector$$.Keys()", "Returns the keys for a named vector as a vector. Any element without a key will be omitted.", ["{a: 1, b: 4, b: 9}.Keys()", "{'a', 'b', 'c'}"]],
			["Values", "##Vector$$.Values()", "Returns the values of a vector (stripping away any keys if it is a named vector).", ["{a: 1, b: 4, b: 9}.Values()", "{1, 4, 9}"]]
		]],
		["General Functions", [
			["If Then Else", "IfThenElse(##Test Condition$$, ##Value if True$$, ##Value if False$$)", "Tests a condition and returns one value if the condition is true and another value if the condition is false.", ["IfThenElse(20 > 10, 7, 5)", "7"]],
			["Lookup", "Lookup(##Value$$, ##Values Vector$$, ##Results Vector$$)", "Finds the Value in the Values Vector and returns the corresponding item in the Results Vector. If the exact Value is not found in the Values Vector, linear interpolation of the nearby values will be used.", ["Lookup(6, {5, 7}, {10, 15})", "12.5"]],
			["Pulse", "Pulse(##Time$$, ##Height$$, ##Width=0$$, ##Repeat=-1$$)", "Creates a pulse input at the specified time with the specified Height and Width. Height defaults to 1 and Width defaults to 0. Repeat is optional and will create a pulse train with the specified time if positive..", "Pulse({10 Years}, 5, 2)"],
			["Step", "Step(##Start$$, ##Height=1$$)", "Creates an input that is initially set to 0 and after the time of Start is set to Height. Height defaults to 1.", "Step({10 Years}, 5)"],
			["Ramp", "Ramp(##Start$$, ##Finish$$, ##Height=1$$)", "Creates a ramp input which moves linearly from 0 to Height between the Start and Finish times. Before Start, the value is 0; after Finish, the value is Height. Height defaults to 1.", "Ramp({10 Year}, {20 Years}, 5)"],
			["Pause", "Pause()", "Pauses the simulation and allows sliders to be adjusted. Often used in combination with an IfThenElse function.", "IfThenElse(Years() = 20, Pause(), 0)"],
			["Stop", "Stop()", "Immediately terminates the simulation. Often used in combination with an IfThenElse function.", "IfThenElse(Rand() < 0.01, Stop(), 0)"]
		]],
		["String Functions", [
			["Length", "##String$$.Length()", "The length of a string in characters.", ['"abcde".Length()', "5"]],
			["Range", "##String$$.Range(##Characters$$)", "Obtains a certain character or set of characters.", ['"abcde".Range(2:4)', '"bcd"']],
			["Split", "##String$$.Split(##Deliminator$$)", "Splits a string into a vector at the locations of the Deliminator.", ['"abcde".Split("c")', '{"ab", "de"}']],
			["IndexOf", "##String$$.IndexOf(##Needle$$)", "Finds the location of the first occurrence of the needle in the string.", ['"abcde".IndexOf("c")', '3']],
			["Contains", "##String$$.Contains(##Needle$$)", "Returns true if the needle is in the string. Otherwise returns false.", ['"abcde".Contains("cd")', 'true']],
			["UpperCase", "##String$$.UpperCase()", "Uppercases all letters in a string.", ['"Test".UpperCase()', '"TEST"']],
			["LowerCase", "##String$$.LowerCase()", "Lowercases all letters in a string.", ['"Test".LowerCase()', '"test"']],
			["Join", "##Vector$$.Join(##String$$)", "Combines the characters in a vector using the given string.", ['{"a", "bc", "d"}.Join("-")', '"a-bc-d"']],
			["Trim", "##String$$.Trim()", "Removes whitespace on either side of a string.", ['" abc  ".Trim()', '"abc"']],
			["Parse", "##String$$.Parse()", "Converts a string to a number.", ['"1.2".Parse() + 3.3', '4.5']]
		]],
		["Programming Functions", [
			["Variables", "##Variable$$ <- ##Value$$", "Assigns a value to a reusable variable.", ['x <- 10\nx^2', "100"]],
			["If-Then-Else", "If ##Condition$$ Then\n  ##Expression$$\nElse If ##Condition$$ Then\n  ##Expression$$\nElse\n  ##Expression$$\nEnd If", "Test one or more conditions and selectively execute code based on these tests."],
			["While Loop", "While ##Condition$$\n  ##Expression$$\nEnd Loop", "Repeats an action until a condition is no longer true.", ['x <- 1\nWhile x < 10\n  x <- x*2\nEnd Loop\nx', "16"]],
			["For-In Loop", "For ##Variable$$ in ##Vector$$\n  ##Expression$$\nEnd Loop", "Repeats an action for each element in a vector.", ['sum <- 0\nFor x in {1, 10, 27}\n  sum <- sum + x\nEnd Loop\nsum', "38"]],
			["Functions", "Function ##Name$$()\n  ##Expression$$\nEnd Function", "Creates a reusable function.", ['Function Square(x)\n  x^2\nEnd Function\nSquare(5)', "25"]],
			["Anonymous Functions", "##Variable$$ <- Function()\n  ##Expression$$\nEnd Function", "Creates an anonymous function.", ['square <- Function(x)\n  x^2\nEnd Function\nsquare(5)', "25"]],
			["Anonymous Functions", "Function() ##Expression$$", "Creates a single-line anonymous function.", ['{1, 2, 3}.Map(Function(value) value^2 - value)', "{0, 2, 6}"]],
			["Throwing Errors", "throw '##Message$$'", "Passes an error message up to the nearest Try-Catch block or aborts the simulation with the error message.", 'throw "Error: Index out of range."'],
			["Error Handling", "Try\n  ##Expression$$\nCatch ##ErrorString$$\n  ##Expression // Handle the error$$\nEnd Try", 'Attempts to execute some code. If an error occurs, the error is passed as a string variable to the catch block which will then be executed. The catch block will not be executed unless an error occurs.', 'Try\n  mean(x)\nCatch err\n  alert("Could not calculate the mean of the variable. Error Message: "+err)\nEnd Try']
		]],
		["User Input Functions", [
			["Alert", "Alert(##Message$$)", "Show an alert dialogue with the message.", 'Alert("An event has occurred.")'],
			["Prompt", "Prompt(##Message$$, ##Default=''$$)", "Prompts the user for an input and returns it. Can optionally provide a default value for the input.", 'timeScale <- Prompt("What time scale should we use?.", 10).Parse()'],
			["Confirm", "Confirm(##Message$$)", "Prompts the user to confirm a statement and returns a boolean based on whether they confirmed it or not.", 'advanced <- Confirm("Use advanced mode?")']
		]],
		["Statistical Distributions", [
			["CDFNormal", "CDFNormal(##x$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of x in the CDF of the Normal Distribution.", ["CDFNormal(1.96)", "0.975"]],
			["PDFNormal", "PDFNormal(##x$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of x in the PDF of the Normal Distribution.", ["PDFNormal(1.5, 0, 1)", "0.12"]],
			["InvNormal", "InvNormal(##p$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of p in the inverse CDF of the Normal Distribution.", ["InvNormal(0.975)", "1.96"]],
			["CDFLognormal", "CDFLognormal(##x$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of x in the CDF of the Lognormal Distribution."],
			["PDFLognormal", "PDFLognormal(##x$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of x in the PDF of the Lognormal Distribution."],
			["InvLognormal", "InvLognormal(##p$$, ##Mean=0$$, ##StandardDeviation=1$$)", "Returns the value of p in the inverse CDF of the Lognormal Distribution."],
			["CDFt", "CDFt(##x$$, ##DegreesOfFreedom$$)", "Returns the value of x in the CDF of Student's t Distribution."],
			["PDFt", "PDFt(##x$$, ##DegreesOfFreedom$$)", "Returns the value of x in the PDF of Student's t Distribution."],
			["Invt", "Invt(##p$$, ##DegreesOfFreedom$$)", "Returns the value of p in the inverse CDF of Student's t Distribution."],
			["CDFF", "CDFF(##x$$, ##DegreesOfFreedom1$$, ##DegreesOfFreedom2$$)", "Returns the value of x in the CDF of the F Distribution."],
			["PDFF", "PDFF(##x$$, ##DegreesOfFreedom1$$, ##DegreesOfFreedom2$$)", "Returns the value of x in the PDF of the F Distribution."],
			["InvF", "InvF(##p$$, ##DegreesOfFreedom1$$, ##DegreesOfFreedom2$$)", "Returns the value of p in the inverse CDF of the F Distribution."],
			["CDFChiSquared", "CDFChiSquared(##x$$, ##DegreesOfFreedom$$)", "Returns the value of x in the CDF of the Chi-Squared Distribution."],
			["PDFChiSquared", "PDFChiSquared(##x$$, ##DegreesOfFreedom$$)", "Returns the value of x in the PDF of the Chi-Squared Distribution."],
			["InvChiSquared", "InvChiSquared(##p$$, ##DegreesOfFreedom$$)", "Returns the value of p in the inverse CDF of the Chi-Squared Distribution."],
			["CDFExponential", "CDFExponential(##x$$, ##Rate$$)", "Returns the value of x in the CDF of the Exponential Distribution."],
			["PDFExponential", "PDFExponential(##x$$, ##Rate$$)", "Returns the value of x in the PDF of the Exponential Distribution."],
			["InvExponential", "InvExponential(##p$$, ##Rate$$)", "Returns the value of p in the inverse CDF of the Exponential Distribution."],
			["CDFPoisson", "CDFPoisson(##x$$, ##Lambda$$)", "Returns the value of x in the CDF of the Poisson Distribution."],
			["PMFPoisson", "PMFPoisson(##x$$, ##Lambda$$)", "Returns the value of x in the PMF of the Poisson Distribution."]
		]]

	];


	var expandCount = 0;

	function addButton(title, vals) {
		var tip = "<b>" + vals[1].replace(/\$\$/g, "").replace(/##/g, "").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>").replace(/ /g, " ") + "</b><br/>" + vals[2];
		if (vals[3]) {
			tip = tip + "<br/><br/><b>Example:</b><br/>&nbsp;&nbsp;";
			if ((typeof vals[3]) == "string") {
				tip = tip + vals[3].replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>").replace(/ /g, " ");
			} else {
				tip = tip + vals[3][0].replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>").replace(/ /g, " ") + " <b>&rarr;</b> " + vals[3][1].replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\n/g, "<br/>").replace(/ /g, " ");
			}
		}
		expandCount++;
		availableLinks.add({
			display: " <span class='moreExpander' data-id='" + expandCount + "' style='padding: 0px 8px; float:right; cursor: pointer' class='gray'><i class='fa fa-question-circle' style='color: gray'></i></span>" + vals[0] + "<p id='expander" + expandCount + "' style='display:none; font-size: small; white-space: normal' class='gray'>" + tip + "</p>",
			start: vals[1].indexOf("##"),
			end: vals[1].indexOf("$$"),
			insert: vals[1].replace(/\#\#/g, "").replace(/\$\$/g, ""),
			tip: tip,
			group: title
		});
	}

	for (var i = 0; i < helpData.length; i++) {
		for (var j = 0; j < helpData[i][1].length; j++) {
			addButton(helpData[i][0], helpData[i][1][j]);
		}
	}

	var referenceItems = new Ext.grid.Panel({
		hidden: !viewConfig.allowEdits,
		store: availableLinks,
		split: true,
		region: 'east',
		hideHeaders: true,
		width: viewConfig.referenceBarWidth,
		margin: '0 0 0 4',
		hideGroupedHeader: true,
		columns: [{
			header: 'References',
			flex: 1,
			dataIndex: 'display',
			sortable: false
		}],
		features: [{
			groupHeaderTpl: "{name}",
			ftype: 'grouping',
			startCollapsed: true,
			hideGroupedHeader: true,
			id: "typeGrouping"
		}]
	});

	referenceItems.view.getFeature("typeGrouping").expand(" References");

	referenceItems.view.on("groupexpand", function(view, node) {
		var items = referenceItems.getEl().query(".moreExpander", false);
		items.forEach(function(x) {
			if (x.getAttribute("data-processed") != 1) {
				x.on("click", function(evt) {
					var a = Ext.get("expander" + x.getAttribute("data-id"));
					a.setVisibilityMode(2);
					a.toggle();
					evt.stopPropagation();
				});
				x.set({
					"data-processed": 1
				})
			}
		});
	});


	if (!mxClient.IS_TOUCH) {
		var left = new Ext.Component({
			html: "<span style='font-size: 280%'>=</span>",
			region: "west",
			margin: '5 0 0 3'
		});
	} else {
		var but = function(text, config) {
			config = config || {};
			return new Ext.Button({
				text: text,
				colspan: config.colspan,
				width: config.width || s,
				height: config.height || s,
				rowspan: config.rowspan,
				style: config.opacity ? ("opacity:" + config.opacity) : 'opacity: .7',
				handler: config.handler || function() {
					insertAtCursor(config.insert || text, config.start, config.end);
				},
				margin: config.margin || m
			});
		}
		
		var s= 40;
		var m = 3;


		var left = new Ext.panel.Panel({
			margin: 0,
			region: "west",
			frame: false,
			border: false,
			layout: {
				type: 'table',
				columns: 5
			},
			items: [
				but("("),
				but(")"),
				but("{"),
				but("}"),
				but(","),

				but("7", {
					opacity: 1
				}),
				but("8", {
					opacity: 1
				}),
				but("9", {
					opacity: 1
				}),
				but("*"),
				but("/"),

				but("4", {
					opacity: 1
				}),
				but("5", {
					opacity: 1
				}),
				but("6", {
					opacity: 1
				}),
				but("+"),
				but("-"),

				but("1", {
					opacity: 1
				}),
				but("2", {
					opacity: 1
				}),
				but("3", {
					opacity: 1
				}),
				but("^"),
				but("="),

				but("0", {
					opacity: 1
				}),
				but(".", {
					opacity: 1
				}),
				but(" ", {
					colspan: 2,
					width: s * 2 + m * 2
				}),
				but("#"),


				but("<small>⬅</small>", {
					handler: sendBackspace
				}),
				but("←", {
					colspan: 2,
					width: s * 2 + m * 2,
					handler: sendBackward
				}),
				but("→", {
					colspan: 2,
					width: s * 2 + m * 2,
					handler: sendForward
				})
			]

		});
	}



	var title = getText('Equation Editor');
	var type = cell.value.nodeName;
	if (type == "Stock") {
		title = getText("Initial Value Equation");
	} else if (type == "Variable") {
		title = getText("Variable Equation");
	} else if (type == "State") {
		title = getText("Initial Active Equation");
	} else if (type == "Flow") {
		title = getText("Flow Rate Equation");
	} else if (type == "Transition") {
		title = getText("Transition Equation");
	}

	var help = "";

	if (config.help) {
		if (config.help.toLowerCase) {
			help = config.help;
		} else {
			help = config.help(config);
		}
	}

	var genericHelp = {
		State: "This equation determines whether or not the state starts active. The result of the equation should be a value like <tt>True</tt> or <tt>False</tt>. Logical statements like <tt>[Primitive] > 10</tt> are commonly used.",
		Flow: "Material will move out of the source stock and into the sink stock at the rate determined by this equation.",
		Stock: "The initial value of the stock will be calculated by this equation. Inflows and outflows can increase or decrease the stock's value over time.",
		Variable: "The variable will take on the value calculated from this equation. The value will be recalculated as the simulation progresses.",
		Action: "This code will be executed when the action triggers. You can use it to adjust values in your simulation or make other changes such as moving agents.",
		Transition: function(config) {
			var cell = config.cell;
			if (cell.getAttribute("Trigger") == "Probability") {
				return "The transition is currently using the <i>Probability</i> trigger. For this trigger type, the value of the equation is the probability of the transition happening each unit of time.";
			} else if (cell.getAttribute("Trigger") == "Condition") {
				return "The transition is currently using the <i>Condition</i> trigger. For this trigger type, the transition will happen when the equation evaluates to <tt>True</tt>.";
			} else if (cell.getAttribute("Trigger") == "Timeout") {
				return "The transition is currently using the <i>Timeout</i> trigger. For this trigger type, the transition will happen after the time specified by this equation passes.";
			}
		}
	};

	if ((!help) && genericHelp[type]) {
		if (genericHelp[type].toLowerCase) {
			help = genericHelp[type];
		} else {
			help = genericHelp[type](config);
		}
	}
	
	var extraBox = {
		xtype: "container",
		hidden: ! config.extra,
		items: [config.extra],
		region: "south",
		padding: 6,
		style: {
			'background-color': '#eee'
		}
	};

	var helpBox = new Ext.Component({
		xtype: "box",
		html: help,
		hidden: (!help) || Ext.state.Manager.get('equationHelpCollapsed', false),
		region: "north",
		padding: 6,
		style: {
			'background-color': '#eee',
			'font-size': 'small'
		}

	});

	var win = new Ext.Window({
		title: title + ': ' + clean(cell.getAttribute("name")),
		layout: 'border',
		stateful: is_editor && (!is_embed),
		stateId: "equation_window",
		closeAction: 'destroy',
		border: false,
		modal: true,
		closable: true,
		tools: [

			{
				type: 'help',
				tooltip: getText('About Equations'),
				callback: function(panel, tool, event) {
					showURL("/equations");
				}
			}, {
				id: 'upButton',
				type: 'up',
				tooltip: getText('Hide Description'),
				hidden: (!help) || Ext.state.Manager.get('equationHelpCollapsed', false),
				callback: function(panel, tool, event) {
					helpBox.setVisible(false);
					tool.hide();
					Ext.getCmp('downButton').show();
					Ext.state.Manager.set('equationHelpCollapsed', true);
				}
			}, {

				id: 'downButton',
				type: 'down',
				tooltip: getText('Show Description'),
				hidden: (!help) || (!Ext.state.Manager.get('equationHelpCollapsed', false)),
				callback: function(panel, tool, event) {
					helpBox.setVisible(true);
					tool.hide();
					Ext.getCmp('upButton').show();
					Ext.state.Manager.set('equationHelpCollapsed', false);
				}
			}
		],
		items: [equationEditor, referenceItems, left, helpBox, extraBox],
		minHeight: 400,
		minWidth: 550,
		width: Math.min(Ext.getBody().getViewSize().width, mxClient.IS_TOUCH ? 770 : 720),
		height: Math.min(Ext.getBody().getViewSize().height, 500),
		resizable: true,
		maximizable: true,
		shadow: true,
		buttonAlign: 'left',
		buttons: [{
			hidden: !viewConfig.allowEdits || cell.value.nodeName == "State" || cell.value.nodeName == "Action" || cell.value.nodeName == "Transition" || cell.value.nodeName == "Agents",
			scale: "large",
			id: 'equationUnitsBut',
			text: formatUnitsBut(cell.getAttribute("Units")),
			glyph: 0xf1de,
			tooltip: getText('Primitive units'),
			handler: function() {
				var unitsWindow = new UnitsWindow({
					parent: "",
					cell: cell,
					units: cell.getAttribute("Units")
				});
				unitsWindow.show();
			}
		}, '->', {
			scale: "large",
			glyph: 0xf05c,
			text: getText('Cancel'),
			handler: function() {
				win.close();
				if (config.parent != "") {
					config.parent.resumeEvents();
				}
			}
		}, {
			hidden: !viewConfig.allowEdits,
			glyph: 0xf00c,
			scale: "large",
			text: getText('Apply'),
			handler: function() {
				var newEquation = equationEditor.getValue();
				newEquation = newEquation.replace(/\n|\r/g, "\\n");

				win.close();

				if (config.parent != "") {
					editingRecord.set("value", newEquation);
					saveConfigRecord(editingRecord);

					if(config.saveExtra){
						config.saveExtra();
					}
				} else {
					graph.getModel().beginUpdate();
					setValue(config.cell, newEquation);

					if(config.saveExtra){
						config.saveExtra();
					}
					
					graph.getModel().endUpdate();
					selectionChanged(false);
				}
			}
		}]
	});


	referenceItems.on('beforeselect', function(view, node, items, options) {
		if (node.data.insert) {
			insertAtCursor(node.data.insert);
		}
		return false;
	});



	me.show = function() {
		win.show();
		equationEditor.focus(true, true);
		equationEditor.editor.focus();
		setTimeout(function() {
			equationEditor.editor.focus();
		}, 100)
	}

	function insertAtCursor(myValue, start, end) {
		equationEditor.insertText(myValue);
		equationEditor.editor.focus();

	}

	function sendForward() {
		equationEditor.editor.execCommand("gotoright");
	}

	function sendBackward() {
		equationEditor.editor.execCommand("gotoleft");
	}

	function sendBackspace() {
		equationEditor.editor.execCommand("backspace");
	}

}
