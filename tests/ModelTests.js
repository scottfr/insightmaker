
"use strict";
/*

Copyright 2010-2016 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/




var test;
var errorCount = 0 ;
var testCount = 0;
function runTests(){

	testCount = 0;

	errorCount = 0;

	if(window.ribbonPanel){
		testUI();
	}

	testCreate();
	testClearModel();
	testFolders();
	testPrimitiveGetSet();
	testFind();
	testUnitFunctions();
	testSimulationGetSet();
	testSimulation();
	testUnitsAndConstraints();
	testMacros();
	testTimeShift();
	testRunModel();

	clearModel();

	console.log("Tests complete!\n\n Errors: "+errorCount+"/"+testCount);
	alert("Tests complete! \n\n Errors: "+errorCount+"/"+testCount);
}

function testError(txt){
	console.log(txt);
	errorCount++;
}

function assertEqual(type, a, b) {
	testCount++;
	console.log("- "+test+" - "+type);
	if(a != b){
		testError(" *** FAILED  ***  " + test + " " + type + ". Found (" + a + ") expected (" + b + ")");
	}
}
function assertUnequal(type, a, b) {
	testCount++;
	console.log("- "+test+" - "+type);
	if(a == b){
		testError(" *** FAILED ***  " + test + " " + type + ". Found (" + a + ") expected not (" + b + ")");
	}
}
function assertNull(type, a) {
	testCount++;
	console.log("- "+test+" - "+type);
	if(a !== null){
		testError(" *** FAILED *** " + test + " " + type + ". Found (" + a + ") expected null.");
	}
}
function assertNotNull(type, a) {
	testCount++;
	console.log("- "+test+" - "+type);
	if(a === null){
		testError(" *** FAILED *** " + test + " " + type + ". Found null expected (" + a + ").");
	}
}

function testRunModel(){

	test = "RunModel";

	clearModel();

	var v = createPrimitive("Var", "Variable", [100,100], [100,100]);
	setTimeUnits("Years");
	setTimeStep(1);
	setTimeLength(10);
	setValue(v, "Years()^2");

	var res = runModel(true);
	assertEqual("Old Silent", res.value(v)[2], 4);

	setPauseInterval(1);
	var res = runModel(true);
	assertEqual("Pause Interval", res.value(v)[2], 4);
	setPauseInterval(0);

	runModel({silent: true, onSuccess: function(x){
		assertEqual("Silent Callback", x.value(v)[2], 4);
	}});

	setValue(v, "sds");
	var res = runModel(true)
	assertUnequal("Old Silent Error", res.error, "none");


	runModel({silent: true, onError: function(x){
		assertUnequal("Silent Callback Error", x.error, "none");
	}});

	if(!(graph instanceof SimpleNode)){
		runModel({silent: false, onError: function(x){
			assertUnequal("Non-Silent Callback Error", x.error, "none");
		}});
	}

	clearModel();

	//Test Pausing
	setTimeout(function(){
		//Test Pausing Simulations
		var p = createPrimitive("p", "Variable", [100,100], [100,100]);
		setShowSlider(p, true);
		setPauseInterval(2);
		setValue(p, 1);
		var counter = 1;
		runModel({
			silent: true,
			onPause: function(res){
				assertEqual("Pause "+counter, res.lastValue(p), counter);

				counter++;
				res.setValue(p, counter);

				res.resume()
			},
			onSuccess: function(res){
				assertEqual("Pause "+counter, res.lastValue(p), counter);
				assertEqual("Pause done", true, true);
			},
			onError: function(){
				assertEqual("Pause failed", true, false);
			}
		});

	}, 1000);

	clearModel();

}

function testBothAgents(){
	setAlgorithm("RK1");
	console.log("---RK1---")
	testAgents();

	setAlgorithm("RK4");
	console.log("---RK4---")
	testAgents();
}

function testSubscripting(){
	var prevTest = test;
	var prevTimeLength = getTimeLength();
	var prevTimeUnits = getTimeUnits();

	setTimeUnits("Years")
	setTimeLength(20)
	test = "Subscripting";

	var RK4 = getAlgorithm()=="RK4";

	clearModel();

	var res = runModel(true);
	assertEqual("Blank Model", res.error, "none");


	var p = createPrimitive("Population", "Stock", [100, 100], [100, 100]);
	var r = createPrimitive("Rate", "Variable", [100, 100], [100, 100]);
	var f = createConnector("Growth", "Flow", null, p);
	createConnector("Link", "Link", r, f);

	var a = createPrimitive("Aggregate", "Variable", [100, 100], [100, 100]);
	var b = createPrimitive("Aggregate 2", "Variable", [100, 100], [100, 100]);
	createConnector("Link", "Link", p, a);
	createConnector("Link", "Link", p, b);

	setValue(p, "«'a': 10, 'b': 5»");
	setValue(f, "[Rate]");
	setValue(r, "«a: 2, b: 1»");
	setValue(a, '[Population]{"a"}');
	setValue(b, '[Population]«"b"»');

	var res = runModel(true);
	assertEqual("Subscripting 1", res.value(a)[10], 30);
	assertEqual("Subscripting 2", res.value(b)[10], 15);


	setValue(a, '[Population]«mean»');
	setValue(b, '[Population]«max»');
	var res = runModel(true);
	assertEqual("Subscripting 3", res.value(a)[10], 45/2);
	assertEqual("Subscripting 4", res.value(b)[10], 30);

	setValue(r, "2");
	var res = runModel(true);
	assertUnequal("Subscripting Error 1", runModel(true).error, "none");

	setValue(r, "repeat(2, <<'a', 'b'>>)");
	var res = runModel(true);
	assertEqual("Subscripting 5", res.value(a)[10], 55/2);
	assertEqual("Subscripting 6", res.value(b)[10], 30);

	setValue(p, "«'males': «canada:1, usa:2,'mexico':3», 'females': «'usa':20, 'canada':10, 'mexico': 30» »");

	setValue(a, '([Population]«"males", *»).usa');
	setValue(b, '[Population]«"females", "mexico"»');
	var res = runModel(true);
	assertUnequal("Subscripting Error 2", runModel(true).error, "none");

	setValue(r, "repeat(repeat(2, <<'canada', 'usa', 'mexico'>>), <<'males', 'females'>>)");
	var res = runModel(true);
	assertEqual("Subscripting 7", res.value(a)[10], 2+20);
	assertEqual("Subscripting 8", res.value(b)[10], 30+20);

	setValue(a, '[Population]«"males", max»');
	setValue(b, '[Population]«min, "canada"»');
	var res = runModel(true);
	assertEqual("Subscripting 9", res.value(a)[10], 3+20);
	assertEqual("Subscripting 10", res.value(b)[10], 1+20);

	setValue(a, '([Population]«"males", *»)«"USA"»');
	setValue(b, '([Population]«* , "mexico"»)«"Females"»');
	var res = runModel(true);
	assertEqual("Subscripting 11", res.value(a)[10], 2+20);
	assertEqual("Subscripting 12", res.value(b)[10], 30+20);

	setValue(a, '([Population]{"males", *}){"USA"}');
	setValue(b, '([Population]{* , "mexico"}).Females');
	var res = runModel(true);
	assertEqual("Subscripting 13", res.value(a)[10], 2+20);
	assertEqual("Subscripting 14", res.value(b)[10], 30+20);


	setValue(r, "{males: repeat(3, {'canada', 'usa', 'mexico'}), females: repeat(1, {'canada', 'usa', 'mexico'})}");
	var res = runModel(true);
	assertEqual("Subscripting 15", res.value(a)[10], 2+30);
	assertEqual("Subscripting 16", res.value(b)[10], 30+10);

	setNonNegative(p, false);
	setNonNegative(f, true);
	setValue(r, "«'males': repeat(3, <<'canada', 'usa', 'mexico'>>), 'females': repeat(-4, <<'canada', 'usa', 'mexico'>>)»");
	var res = runModel(true);
	assertEqual("Flow OnlyPositive 1", res.value(a)[10], 2+30);
	assertEqual("Flow OnlyPositive  2", res.value(b)[10], 30+0);

	setNonNegative(f, false);
	var res = runModel(true);
	assertEqual("Flow OnlyPositive  3", res.value(a)[10], 2+30);
	assertEqual("Flow OnlyPositive  4", res.value(b)[10], 30-40);

	setNonNegative(p, true);
	var res = runModel(true);
	assertEqual("Stock Non Negative 1", res.value(a)[10], 2+30);
	assertEqual("Stock Non Negative 2", res.value(b)[10], 0);

	setNonNegative(p, false);
	setConstraints(p, [-100, true, 100, true]);
	var res = runModel(true);
	assertEqual("Constraints 1", runModel(true).error, "none");

	setConstraints(p, [-5, true, 100, true]);
	var res = runModel(true);
	assertUnequal("Constraints 2", runModel(true).error, "none");
	setConstraints(p, [-100, true, 31, true]);
	var res = runModel(true);
	assertUnequal("Constraints 3", runModel(true).error, "none");


	setConstraints(p, [-100, false, 31, false]);
	var res = runModel(true);
	assertEqual("Constraints 4", runModel(true).error, "none");

	setUnits([p,a,b], "Widgets");
	setUnits([f,r], "Widgets/Year");var res = runModel(true);
	var res = runModel(true);
	assertEqual("Units 1", runModel(true).error, "none");

	setValue(p, "«'males': «'canada':1,'usa':{2 cats},'mexico':3», 'females': «'usa':20, 'canada':10, 'mexico': 30» »");
	var res = runModel(true);
	assertUnequal("Units 2", runModel(true).error, "none");

	setValue(p, "«'males': «'canada':1,'usa':{2 widgets},'mexico':3», 'females': «'usa':20, 'canada':10, 'mexico': 30» »");
	var res = runModel(true);
	assertEqual("Units 3", runModel(true).error, "none");


	setStockType(p, "Conveyor");
	setDelay(p, 5);
	var res = runModel(true);
	assertEqual("Conveyor 1", res.value(a)[14], 2+30);
	assertEqual("Conveyor 2", Math.round(res.value(b)[14]*100000), (30-40)*100000);


	setValue(a, '([Population]«"males", *»)«"India"»');
	var res = runModel(true);
	assertUnequal("Errors 1", runModel(true).error, "none");
	setValue(a, '([Population]«"foobar", *»)«"USA"»');
	var res = runModel(true);
	assertUnequal("Errors 2", runModel(true).error, "none");

	clearModel();

	var p = createPrimitive("Population", "Stock", [100, 100], [100, 100]);
	var p2 = createPrimitive("Population 2", "Stock", [100, 100], [100, 100]);
	var r = createPrimitive("Rate", "Variable", [100, 100], [100, 100]);
	var f = createConnector("Growth", "Flow", p, p2);
	createConnector("Link", "Link", r, f);

	var a = createPrimitive("Aggregate", "Variable", [100, 100], [100, 100]);
	createConnector("Link", "Link", p2, a);
	var b = createPrimitive("Aggregate 2", "Variable", [100, 100], [100, 100]);
	createConnector("Link", "Link", p, b);

	setValue(p, 100);
	setValue(p2, 0);
	setValue(f, "[Rate]");
	setValue(r, "<<'dogs':1, 'cats':2>>");
	var res = runModel(true);
	assertEqual("Collapsing 1", res.value(p)[10], 100-10*3);
	assertEqual("Collapsing 2", res.value(p2)[10], 0+10*3);

	setValue(p2, "<<'dogs':5, 'cats':4>>");
	setValue(a, "[population 2]<<'dogs'>>");
	var res = runModel(true);
	assertEqual("Collapsing 3", res.value(p)[10], 100-10*3);
	assertEqual("Collapsing 4", res.value(a)[10], 5+10*1);

	setValue(r, "<<'dogs': <<'x': 1, 'y':2>>, 'cats': <<'x':3, 'y':4>> >>")
	var res = runModel(true);
	assertEqual("Collapsing 5", res.value(p)[10], 100-10*10);
	assertEqual("Collapsing 6", res.value(a)[10], 5+10*3);

	setValue(p, "<<x:40, y:60>>");
	setValue(b, "[Population]<<'x'>>");
	var res = runModel(true);
	assertEqual("Collapsing 7", res.value(b)[10], 40-4*10);
	assertEqual("Collapsing 8", res.value(a)[10], 5+10*3);

	setValue(p2, "<<'dogs':5, 'cats':4, rats:6>>");
	setValue(r, "<<'dogs': <<'x': 1, 'y':2>>, 'cats': <<'x':3, 'y':4>>, 'rats': <<'x':9, 'y':10>> >>")
	var res = runModel(true);
	assertEqual("Collapsing 9", res.value(b)[10], 40-13*10);
	assertEqual("Collapsing 10", res.value(a)[10], 5+10*3);

	setEnds(f, [p2, p]);
	var res = runModel(true);
	assertEqual("Collapsing 11", res.value(b)[10], 40+13*10);
	assertEqual("Collapsing 12", res.value(a)[10], 5-10*3);


	clearModel();

	test = prevTest;

	setTimeUnits(prevTimeUnits)
	setTimeLength(prevTimeLength)
}

function testAgents(){
	var prevTest = test;
	test = "Agents";

	var RK4 = getAlgorithm()=="RK4";

	clearModel();

	var s = createPrimitive("My State", "State", [100,100], [100,100]);
	var s2  = createPrimitive("My State 2", "State", [100,100], [100,100]);
	setValue(s, "false || true");
	setValue(s2, "false || 0");
	var res = runModel(true);
	assertEqual("State Start 1", res.value(s)[0], 1);
	assertEqual("State Start 2", res.value(s2)[0], 0);
	assertEqual("State Start 3", res.value(s)[10], 1);
	assertEqual("State Start 4", res.value(s2)[10], 0);

	setValue(s, "true");
	setValue(s2, "false");

	var act = createPrimitive("Action 1", "Action", [100,100], [100,100]);
	setValue(act, "[My State] <- false")
	setTriggerType(act, "Timeout");
	setTriggerValue(act, 5);
	var act2 = createPrimitive("Action 2", "Action", [100,100], [100,100]);
	setTriggerType(act2, "Timeout");
	setTriggerValue(act2, 100);
	setValue(act2, "[My State 2] <- true")
	var l = createConnector("Link", "Link", s, act);
	var l2 = createConnector("Link", "Link", s2, act2);

	var res = runModel(true);
	assertEqual("State Start 5", res.value(s)[0], 1);
	assertEqual("State Start 6", res.value(s2)[0], 0);
	assertEqual("State Start 7", res.value(s)[10], 0);
	assertEqual("State Start 8", res.value(s2)[10], 0);


	removePrimitive(act);
	removePrimitive(act2);

	removePrimitive(l);
	removePrimitive(l2);

	setValue(s, "false || true");
	setValue(s2, "false || 0");

	var t = createConnector("My Transition", "Transition", null, s2);
	var t2 = createConnector("My Transition", "Transition", s2, null);

	setTriggerType(t, "Timeout");
	setTriggerValue(t, "{2 years}");
	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "{3 years}");

	var res = runModel(true);
	assertEqual("Transition T Dangle 1", res.value(s)[0], 1);
	assertEqual("Transition T Dangle 2", res.value(s2)[0], 0);
	assertEqual("Transition T Dangle 3", res.value(s)[3], 1);
	assertEqual("Transition T Dangle 4", res.value(s2)[3], 1);
	assertEqual("Transition T Dangle 5", res.value(s2)[8], 0);

	removePrimitive(t)
	removePrimitive(t2);

	var t = createConnector("My Transition", "Transition", s, s2);
	var t2 = createConnector("My Transition", "Transition", s2, s);

	setTriggerType(t, "Timeout");
	setTriggerValue(t, "{10 Years} - Time()");
	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "{100 years}");

	var res = runModel(true);
	assertEqual("Recalculate 1", res.value(s)[0], 1);
	assertEqual("Recalculate 2", res.value(s2)[0], 0);
	assertEqual("Recalculate 3", res.value(s)[3], 1);
	assertEqual("Recalculate 4", res.value(s2)[3], 0);
	assertEqual("Recalculate 5", res.value(s)[6], 1);
	assertEqual("Recalculate 6", res.value(s2)[6], 0);

	setTriggerRecalculate(t, true);
	var res = runModel(true);
	assertEqual("Recalculate 7", res.value(s)[0], 1);
	assertEqual("Recalculate 8", res.value(s2)[0], 0);
	assertEqual("Recalculate 9", res.value(s)[3], 1);
	assertEqual("Recalculate 10", res.value(s2)[3], 0);
	assertEqual("Recalculate 11", res.value(s)[6], 0);
	assertEqual("Recalculate 12", res.value(s2)[6], 1);

	setTriggerRecalculate(t, false);

	setTriggerType(t, "Probability");
	setTriggerValue(t, "IfThenElse(years < 2, 0, 1)");

	var res = runModel(true);
	assertEqual("Recalculate 13", res.value(s)[0], 1);
	assertEqual("Recalculate 14", res.value(s2)[0], 0);
	assertEqual("Recalculate 15", res.value(s)[3], 1);
	assertEqual("Recalculate 16", res.value(s2)[3], 0);
	assertEqual("Recalculate 17", res.value(s)[6], 1);
	assertEqual("Recalculate 18", res.value(s2)[6], 0);

	setTriggerRecalculate(t, true);
	var res = runModel(true);
	assertEqual("Recalculate 19", res.value(s)[0], 1);
	assertEqual("Recalculate 20", res.value(s2)[0], 0);
	assertEqual("Recalculate 21", res.value(s)[3], 0);
	assertEqual("Recalculate 22", res.value(s2)[3], 1);
	assertEqual("Recalculate 23", res.value(s)[6], 0);
	assertEqual("Recalculate 24", res.value(s2)[6], 1);

	setTriggerRecalculate(t, false);


	setTriggerType(t, "Timeout");
	setTriggerValue(t, "{2 years}");
	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "{3 years}");

	var res = runModel(true);
	assertEqual("Transition T 1", res.value(s)[0], 1);
	assertEqual("Transition T 2", res.value(s2)[0], 0);
	assertEqual("Transition T 3", res.value(s)[3], 0);
	assertEqual("Transition T 4", res.value(s2)[3], 1);
	assertEqual("Transition T 5", res.value(s)[6], 1);
	assertEqual("Transition T 6", res.value(s2)[6], 0);

	setTriggerValue(t, "2");
	setTriggerValue(t2, "3");
	var res = runModel(true);
	assertEqual("Transition T 1.2", res.value(s)[0], 1);
	assertEqual("Transition T 2.2", res.value(s2)[0], 0);
	assertEqual("Transition T 3.2", res.value(s)[3], 0);
	assertEqual("Transition T 4.2", res.value(s2)[3], 1);
	assertEqual("Transition T 5.2", res.value(s)[6], 1);
	assertEqual("Transition T 6.2", res.value(s2)[6], 0);

	setResidency(s, "2");
	var res = runModel(true);
	assertEqual("Residency 1", res.value(s)[0], 1);
	assertEqual("Residency 2", res.value(s2)[0], 0);
	assertEqual("Residency 3", res.value(s)[3], 1);
	assertEqual("Residency 4", res.value(s2)[3], 0);
	assertEqual("Residency 5", res.value(s)[6], 0);
	assertEqual("Residency 6", res.value(s2)[6], 1);

	setResidency(s, "{2 years}");
	var res = runModel(true);
	assertEqual("Residency 7", res.value(s)[0], 1);
	assertEqual("Residency 8", res.value(s2)[0], 0);
	assertEqual("Residency 9", res.value(s)[3], 1);
	assertEqual("Residency 10", res.value(s2)[3], 0);
	assertEqual("Residency 11", res.value(s)[6], 0);
	assertEqual("Residency 12", res.value(s2)[6], 1);

	setResidency(s, "0");

	setTriggerType(t, "Probability");
	setTriggerValue(t, "1");
	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "{100 years}");
	var res = runModel(true);
	assertEqual("Transition P 1", res.value(s)[0], 1);
	assertEqual("Transition P 2", res.value(s2)[0], 0);
	assertEqual("Transition P 3", res.value(s)[2], 0);
	assertEqual("Transition P 4", res.value(s2)[2], 1);
	assertEqual("Transition P 5", res.value(s)[10], 0);
	assertEqual("Transition P 6", res.value(s2)[10], 1);
	setTriggerValue(t, "2");
	var res = runModel(true);
	assertUnequal(res.error, "none");
	setTriggerValue(t, "-1");
	var res = runModel(true);
	assertUnequal(res.error, "none");
	setTriggerValue(t, "0");
	var res = runModel(true);
	assertEqual("Transition P 1.3", res.value(s)[0], 1);
	assertEqual("Transition P 2.3", res.value(s2)[0], 0);
	assertEqual("Transition P 3.3", res.value(s)[2], 1);
	assertEqual("Transition P 4.3", res.value(s2)[2], 0);


	setTriggerType(t, "Condition");
	setTriggerValue(t, "years = 5");
	setTriggerType(t2, "Condition");
	setTriggerValue(t2, "years = 7");
	res = runModel(true);
	assertEqual("Transition C 1", res.value(s)[0], 1);
	assertEqual("Transition C 2", res.value(s2)[0], 0);
	assertEqual("Transition C 3", res.value(s)[6], 0);
	assertEqual("Transition C 4", res.value(s2)[6], 1);
	assertEqual("Transition C 5", res.value(s)[7], 0);
	assertEqual("Transition C 6", res.value(s2)[7], 1);
	assertEqual("Transition C 7", res.value(s)[8], 1);
	assertEqual("Transition C 8", res.value(s2)[8], 0);


	setTriggerRepeat(t, true);
	setTriggerRepeat(t2, true);
	res = runModel(true);
	assertEqual("Transition C Repeat 1", res.value(s)[0], 1);
	assertEqual("Transition C Repeat 2", res.value(s2)[0], 0);
	assertEqual("Transition C Repeat 3", res.value(s)[6], 0);
	assertEqual("Transition C Repeat 4", res.value(s2)[6], 1);
	assertEqual("Transition C Repeat 5", res.value(s)[7], 0);
	assertEqual("Transition C Repeat 6", res.value(s2)[7], 1);
	assertEqual("Transition C Repeat 7", res.value(s)[8], 1);
	assertEqual("Transition C Repeat 8", res.value(s2)[8], 0);


	clearModel();

	var s = createPrimitive("State", "State", [100,100], [100,100]);
	var v  = createPrimitive("Variable", "State", [300,100], [100,100]);
	var l = createConnector("My Link", "Link", s, v);

	setValue(s, "true");
	setValue(v, "ifThenElse([State], 1, 0)");
	res = runModel(true);
	assertEqual("State Values 1", res.value(s)[0], 1);
	assertEqual("State Values 2", res.value(v)[0], 1);
	setValue(s, "false");
	res = runModel(true);
	assertEqual("State Values 3", res.value(s)[0], 0);
	assertEqual("State Values 4", res.value(v)[0], 0);
	setValue(v, "if [State] then\n 1\nelse\n 0\nend if");
	res = runModel(true);
	assertEqual("State Values 5", res.value(s)[0], 0);
	assertEqual("State Values 6", res.value(v)[0], 0);
	setValue(s, "true");
	res = runModel(true);
	assertEqual("State Values 7", res.value(s)[5], 1);
	assertEqual("State Values 8", res.value(v)[5], 1);

	clearModel();


	var s = createPrimitive("State 1", "State", [100,100], [100,100]);
	var s2  = createPrimitive("State 2", "State", [100,100], [100,100]);
	var l = createConnector("My Link", "Link", s, s2);
	var t = createConnector("My Transition", "Transition", s, s2);
	var t2 = createConnector("My Transition", "Transition", s2, s);

	setTriggerType(t, "Timeout");
	setTriggerValue(t, "{2 years}");
	setTriggerType(t2, "Condition");
	setTriggerValue(t2, "false");
	setValue(s, "1");
	setValue(s2, "! [State 1]")

	var f = createPrimitive("My Agent", "Folder", [200,150], [400,400]);
	setParent([s, s2, l, t, t2], f);
	setFolderType(f, "Agent");

	var pop = createPrimitive("Population", "Agents", [1210,0], [200,200])
	createConnector("Link","Link", f, pop);
	setAgentBase(pop, f);
	setPopulationSize(pop, 10);

	var v = createPrimitive("My Variable", "Variable", [1200,150], [150,100]);
	var v2 = createPrimitive("My Variable 2", "Variable", [1200,150], [150,100]);
	setValue(v, "Count(FindAll([Population]))")
	setValue(v2, "PopulationSize([Population])+1")
	var l2 = createConnector("My Link", "Link", pop, v);
	var l3 = createConnector("My Link", "Link", pop, v2);

	res = runModel(true);
	assertEqual("Pop 1", res.value(v)[0], 10);
	assertEqual("Pop 2", res.value(v)[8], 10);
	assertEqual("Pop 2.1", res.value(v2)[0], 11);
	assertEqual("Pop 2.2", res.value(v2)[8], 11);

	setValue(v, "[Population].FindAll().length()")
	setValue(v2, "[Population].PopulationSize()+1")

	res = runModel(true);
	assertEqual("Pop 1 (Obj)", res.value(v)[0], 10);
	assertEqual("Pop 2 (Obj)", res.value(v)[8], 10);
	assertEqual("Pop 2.1 (Obj)", res.value(v2)[0], 11);
	assertEqual("Pop 2.2 (Obj)", res.value(v2)[8], 11);

	setValue(v, "Count(FindState([Population], [State 1]))")
	setValue(v2, "Count(FindState([Population], [State 2]))")

	res = runModel(true);
	assertEqual("Pop 3", res.value(v)[0], 10);
	assertEqual("Pop 4", res.value(v2)[0], 0);
	assertEqual("Pop 5", res.value(v)[8], 0);
	assertEqual("Pop 6", res.value(v2)[8], 10);

	setValue(v, "[Population].findState([State 1]).length()")
	setValue(v2, "[Population].findState([State 2]).length()")

	res = runModel(true);
	assertEqual("Pop 3 (Obj)", res.value(v)[0], 10);
	assertEqual("Pop 4 (Obj)", res.value(v2)[0], 0);
	assertEqual("Pop 5 (Obj)", res.value(v)[8], 0);
	assertEqual("Pop 6 (Obj)", res.value(v2)[8], 10);


	var v3 = createPrimitive("My Variable 3", "Variable", [1200,150], [150,100]);
	var l4 = createConnector("My Link", "Link", pop, v3);
	var l5 = createConnector("My Link", "Link", v3, v2);

	setValue(v3, "FindState([Population], [State 2])");
	setValue(v2, "Count([My Variable 3])")

	res = runModel(true);
	assertEqual("Pop 6.1", res.value(v)[0], 10);
	assertEqual("Pop 6.2", res.value(v2)[0], 0);
	assertEqual("Pop 6.3", res.value(v)[8], 0);
	assertEqual("Pop 6.4", res.value(v2)[8], 10);
	assertEqual("Pop 6.5", res.error, "none");

	setValue(v3, "[Population].findState([State 2])");
	setValue(v2, "[My Variable 3].length()")

	res = runModel(true);
	assertEqual("Pop 6.1 (Obj)", res.value(v)[0], 10);
	assertEqual("Pop 6.2 (Obj)", res.value(v2)[0], 0);
	assertEqual("Pop 6.3 (Obj)", res.value(v)[8], 0);
	assertEqual("Pop 6.4 (Obj)", res.value(v2)[8], 10);
	assertEqual("Pop 6.5 (Obj)", res.error, "none");



	setValue(v, "Count(FindNotState([Population], [State 1]))");
	setValue(v2, "Count(FindNotState([Population], [State 2]))");

	res = runModel(true);
	assertEqual("Pop 6.6", res.error, "none");

	setValue(v, "Count([Population].FindNotState([State 1]))");
	setValue(v2, "Count([Population].FindNotState([State 2]))");
	res = runModel(true);
	assertEqual("Pop 6.6 (Obj)", res.error, "none");


	setValue(v3, "FindState([Population], [State 2])+1");
	res = runModel(true);
	assertUnequal("Pop 6.7", res.error, "none");

	setValue(v3, "[Population].FindState([State 2])+1");
	res = runModel(true);
	assertUnequal("Pop 6.7 (Obj)", res.error, "none");

	setValue(v3, "[Population]+1");
	res = runModel(true);
	assertUnequal("Pop 6.8", res.error, "none");

	removePrimitive(v3);

	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "5");
	setTriggerType(t2, "Condition");
	setTriggerValue(t2, "index(self)=1 and years=7");

	res = runModel(true);
	assertEqual("Pop 7", res.value(v)[0], 0);
	assertEqual("Pop 8", res.value(v2)[0], 10);
	assertEqual("Pop 9", res.value(v)[8], 9);
	assertEqual("Pop 10", res.value(v2)[8], 1);

	setTriggerValue(t2, "self.index()=1 and years=7");

	res = runModel(true);
	assertEqual("Pop 7 (obj)", res.value(v)[0], 0);
	assertEqual("Pop 8 (obj)", res.value(v2)[0], 10);
	assertEqual("Pop 9 (obj)", res.value(v)[8], 9);
	assertEqual("Pop 10 (obj)", res.value(v2)[8], 1);


	var v3 = createPrimitive("Var", "Variable", [200,150], [150,100]);
	setParent(v3, f);

	var v4 = createPrimitive("Outside Var", "Variable", [200,150], [150,100]);
	setParent(v4, f);
	setValue(v4, "IfThenElse(years<5, 1, 0)");

	createConnector("Link", "Link", v4, v3);
	setValue(v3, "[Outside Var]*2");


	setValue(v, "Min(Value([Population], [Var]))")
	setValue(v2, "Max(Value([Population], [Var]))")
	res = runModel(true);
	assertEqual("Pop 10.1", res.value(v)[0], 2);
	assertEqual("Pop 10.2", res.value(v)[8], 0);

	setValue(v, "[Population].value([Var]).min()")
	setValue(v2, "Max([Population].Value([Var]))")
	res = runModel(true);
	assertEqual("Pop 10.1 (obj)", res.value(v)[0], 2);
	assertEqual("Pop 10.2 (obj)", res.value(v)[8], 0);

	setMacros("counter <- 0");

	var act = createPrimitive("Action", "Action", [200,150], [150, 100]);
	setTriggerType(act, "Condition");
	setTriggerValue(act, "true");
	setValue(act, "Counter <- counter + 1");
	setValue(v3, "counter*3")

	res = runModel(true);
	assertEqual("Pop 10.3", res.value(v)[0], 0);
	assertEqual("Pop 10.4", res.value(v)[8], 24);

	setTriggerRepeat(act, false);
	res = runModel(true);
	assertEqual("Repeat Off 1", res.value(v)[0], 0);
	assertEqual("Repeat Off 2", res.value(v)[8], 3);

	setTriggerRepeat(act, true);

	setTriggerValue(act, "false");
	res = runModel(true);
	assertEqual("Pop 10.5", res.value(v)[0], 0);
	assertEqual("Pop 10.6", res.value(v)[8], 0);

	setTriggerType(act, "Condition");
	setTriggerValue(act, "true");
	res = runModel(true);
	assertEqual("Pop 10.7", res.value(v)[0], 0);
	assertEqual("Pop 10.8", res.value(v)[8], 24);

	setTriggerValue(act, "false");
	res = runModel(true);
	assertEqual("Pop 10.9", res.value(v)[0], 0);
	assertEqual("Pop 10.10", res.value(v)[8], 0);

	setTriggerType(act, "Timeout");
	setTriggerValue(act, "100");
	res = runModel(true);
	assertEqual("Pop 10.11", res.value(v)[0], 0);
	assertEqual("Pop 10.12", res.value(v)[8], 0);
	setTriggerValue(act, "{100 years}");
	res = runModel(true);
	assertEqual("Pop 10.13", res.value(v)[0], 0);
	assertEqual("Pop 10.14", res.value(v)[8], 0);
	setTriggerType(act, "Condition");
	setTriggerValue(act, "true");

	var st = createPrimitive("Count", "Stock", [200,150], [150,100]);
	setParent([act, st], f);
	setValue(st, 10);
	setValue(act, "[Count] <- [Count] + 2");
	var l = createConnector("Link", "Link",st, v3);
	var l2 = createConnector("Link", "Link",st, act);
	setValue(v3, "[Count]");

	res = runModel(true);
	assertEqual("Pop 10.17", res.value(v)[0], 10);
	assertEqual("Pop 10.18", res.value(v)[8], 10+2*8);

	removePrimitive(act);
	removePrimitive(st);
	removePrimitive(l);
	removePrimitive(l2);

	setValue(v3, "index(self)");


	res = runModel(true);
	assertEqual("Pop 11", res.value(v)[0], 1);
	assertEqual("Pop 12", res.value(v2)[8], 10);

	setValue(v, "PopulationSize([Population])")
	setValue(v2, "Count(Value([Population], [Var]))")
	res = runModel(true);
	assertEqual("Pop 12.1", res.value(v)[0], res.value(v2)[0]);
	assertEqual("Pop 12.2", res.value(v)[8], res.value(v2)[8]);

	setValue(v, "[Population].PopulationSize()")
	setValue(v2, "Count([Population].Value([Var]))")
	res = runModel(true);
	assertEqual("Pop 12.1 (Obj)", res.value(v)[0], res.value(v2)[0]);
	assertEqual("Pop 12.2 (Obj)", res.value(v)[8], res.value(v2)[8]);

	setValue(v, "Count(Join(FindState([Population], [State 1]), FindState([Population], [State 2])))");
	setValue(v2, "Min(Value(Join(FindState([Population], [State 1]), FindState([Population], [State 2])), [Var]))");
	res = runModel(true);
	assertEqual("Pop 13", res.value(v)[0], 10);
	assertEqual("Pop 14", res.value(v2)[8], 1);

	setValue(v, "Join([Population].FindState([State 1]), [Population].FindState([State 2])).Length()");
	setValue(v2, "Join([Population].FindState([State 1]), [Population].FindState([State 2])).Value([Var]).Min()");
	res = runModel(true);
	assertEqual("Pop 13 (Obj)", res.value(v)[0], 10);
	assertEqual("Pop 14 (Obj)", res.value(v2)[8], 1);

	setValue(v, "Count(Join(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var]) <=3)))");
	setValue(v2, "Count(Union(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var]) <=3)))");
	res = runModel(true);
	assertEqual("Pop 14.1", res.value(v)[0], 5);
	assertEqual("Pop 14.2", res.value(v2)[8], 5);

	setValue(v, "Join(Filter([Population].FindAll(), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var]) <=3)).Length()");
	setValue(v2, "Union([Population].FindAll().Filter(x.value([Var])>8), [Population].FindAll().Filter(x.value([Var]) <=3)).Length()");
	res = runModel(true);
	assertEqual("Pop 14.1 (Obj)", res.value(v)[0], 5);
	assertEqual("Pop 14.2 (Obj)", res.value(v2)[8], 5);

	setValue(v, "Count(Intersection(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var])<=3)))");
	setValue(v2, "Count(Difference(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var])<=3)))");
	res = runModel(true);
	assertEqual("Pop 14.3", res.value(v)[0], 0);
	assertEqual("Pop 14.4", res.value(v2)[8], 5);

	setValue(v, "Distance(FindNearest([Population], FindIndex([population], 1)), FindIndex([population], 1)) = Min(map(Select(FindAll([Population]),join(false, repeat(true,9))), distance(x, FindIndex([population],1))))");
	setValue(v2, "Distance(FindFurthest([Population], FindIndex([population], 1)), FindIndex([population], 1)) = Max(map(Select(FindAll([Population]),join(false, repeat(true,9))), distance(x, FindIndex([population],1))))");
	res = runModel(true);
	assertEqual("Pop 14.5", res.value(v)[0], 1);
	assertEqual("Pop 14.6", res.value(v2)[8], 1);

	setValue(v, "Distance([Population].FindNearest([population].FindIndex(1)), [population].FindIndex(1)) = Min(map(Select([Population].FindAll(),join(false, repeat(true,9))), distance(x, [population].FindIndex(1))))");
	setValue(v2, "Distance([Population].FindFurthest([population].FindIndex(1)), [population].FindIndex(1)) = Max(map(Select(FindAll([Population]),join(false, repeat(true,9))), distance(x, [population].FindIndex(1))))");
	res = runModel(true);
	assertEqual("Pop 14.5 (Obj)", res.value(v)[0], 1);
	assertEqual("Pop 14.6 (Obj)", res.value(v2)[8], 1);

	setValue(v, "Distance(select(FindNearest([Population], FindIndex([population], 1),2),2), FindIndex([population], 1)) = Min(map(Select(FindAll([Population]),join(false, repeat(true,9))), distance(x, FindIndex([population],1))))");
	setValue(v2, "Distance(select(FindFurthest([Population], FindIndex([population], 1),3),2), FindIndex([population], 1)) = Max(map(Select(FindAll([Population]),join(false, repeat(true,9))), distance(x, FindIndex([population],1))))");
	res = runModel(true);
	assertEqual("Pop 14.5.2", res.value(v)[0], 0);
	assertEqual("Pop 14.6.2", res.value(v2)[8], 0);

	setValue(v, "Count(FindNearby([Population], FindIndex([Population], 1), 400))");
	setValue(v2, "Count(FindNearby([Population], FindIndex([Population], 1), 0))");
	res = runModel(true);
	assertEqual("Pop 14.7", res.value(v)[0], 9);
	assertEqual("Pop 14.8", res.value(v2)[8], 0);

	setValue(v, "[Population].FindNearby([Population].FindIndex(1), 400).length()");
	setValue(v2, "[Population].FindNearby([Population].FindIndex(1), 0).length()");
	res = runModel(true);
	assertEqual("Pop 14.7 (Obj)", res.value(v)[0], 9);
	assertEqual("Pop 14.8 (Obj)", res.value(v2)[8], 0);

	setValue(v, "[Population].FindNearby( {0,0}, 400).length()");
	setValue(v2, "[Population].FindNearby({0,0}, 0).length()");
	res = runModel(true);
	assertEqual("Pop 14.7.2", res.value(v)[0], 10);
	assertEqual("Pop 14.8.2", res.value(v2)[8], 0);

	setValue(v, "[Population].FindNearby( {0}, 400).length()");
	res = runModel(true);
	assertUnequal("Pop 14.7.3", res.error, "none");


	setValue(v, "[Population].FindNearby( {0,0}, 400).length()");
	setValue(v2, "[Population].FindNearby({0}, 0).length()");
	res = runModel(true);
	assertUnequal("Pop 14.8.3", res.error, "none");

	setValue(v2, "[Population].FindNearby({0,0}, 0).length()");
	res = runModel(true);
	assertEqual("Pop 14.7.4", res.value(v)[0], 10);
	assertEqual("Pop 14.8.4", res.value(v2)[8], 0);


	setValue(v, "[Population].FindNearby( 'abc', 400).length()");
	res = runModel(true);
	assertUnequal("Pop 14.8.5", res.error, "none");


	setValue(v, "width([Population])")
	setValue(v2, "height([Population])")
	res = runModel(true);
	assertEqual("Pop 14.9", res.value(v)[0], 200);
	assertEqual("Pop 14.10", res.value(v2)[8], 100);

	setValue(v, "[Population].FindIndex(2) == [Population].FindIndex(2)");
	setValue(v2, "[Population].FindIndex(2) == [Population].FindIndex(3)");
	res = runModel(true);
	assertEqual("Comparison 1", res.value(v)[0], true);
	assertEqual("Comparison 2", res.value(v2)[8], false);

	setValue(v, "[Population].FindIndex(2) != [Population].FindIndex(2)");
	setValue(v2, "[Population].FindIndex(2) != [Population].FindIndex(3)");
	res = runModel(true);
	assertEqual("Comparison 3", res.value(v)[0], false);
	assertEqual("Comparison 4", res.value(v2)[8], true);

	setValue(v, "[Population].FindIndex(2) > [Population].FindIndex(2)");
	res = runModel(true);
	assertUnequal("Comparison 5", res.error, "none");
	setValue(v, "[Population].FindIndex(2) >= [Population].FindIndex(2)");
	res = runModel(true);
	assertUnequal("Comparison 6", res.error, "none");
	setValue(v, "[Population].FindIndex(2) < [Population].FindIndex(2)");
	res = runModel(true);
	assertUnequal("Comparison 7", res.error, "none");
	setValue(v, "[Population].FindIndex(2) <= [Population].FindIndex(2)");
	res = runModel(true);
	assertUnequal("Comparison 8", res.error, "none");


	setAgentPlacement(pop, "Grid");
	setValue(v, "IfThenElse(Select(Location(FindIndex([Population], 1)),1)==Select(Location(FindIndex([Population], 2)),1), 1, 0)");
	setValue(v2, "IfThenElse(Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), 1, 0)");
	res = runModel(true);
	assertEqual("Grid Loc 15", res.value(v)[0], 0);
	assertEqual("Grid Loc 16", res.value(v2)[8], 1);

	setAgentPlacement(pop, "Ellipse");
	setValue(v, "IfThenElse(Select(Location(FindIndex([Population], 1)),1)==Select(Location(FindIndex([Population], 2)),1), 1, 0)");
	setValue(v2, "IfThenElse(Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), 1, 0)");
	res = runModel(true);
	assertEqual("Grid Loc 16.1", res.value(v)[0], 0);
	assertEqual("Grid Loc 16.2", res.value(v2)[8], 0);


	setAgentPlacement(pop, "Network");
	setValue(v, "IfThenElse(Select(Location(FindIndex([Population], 1)),1)==Select(Location(FindIndex([Population], 2)),1), 1, 0)");
	setValue(v2, "IfThenElse(Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), 1, 0)");
	res = runModel(true);
	assertEqual("Network Loc 17", res.value(v)[0], 0);
	assertEqual("Network Loc 18", res.value(v2)[8], 0);

	setAgentPlacement(pop, "Custom Function");
	setValue(v, "IfThenElse(Select(Location(FindIndex([Population], 1)),1)==Select(Location(FindIndex([Population], 2)),1), 1, 0)");
	setValue(v2, "IfThenElse(Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), 1, 0)");
	res = runModel(true);
	assertEqual("Custom Loc 19", res.value(v)[0], 0);
	assertEqual("Custom Loc 20", res.value(v2)[8], 0);

	setAgentPlacementFunction(pop, "<<index(Self)*10,index(Self)*20>>");
	setValue(v, "Location(FindIndex([Population], 1)).x");
	setValue(v2, "Location(FindIndex([Population], 2)).y");
	res = runModel(true);
	assertEqual("Custom Loc 21", res.value(v)[0], 10);
	assertEqual("Custom Loc 22", res.value(v2)[8], 40);

	setAgentPlacementFunction(pop, "{index(Self)*10, Self.index()*20}");
	res = runModel(true);
	assertEqual("Custom Loc 21 (Self)", res.value(v)[0], 10);
	assertEqual("Custom Loc 22 (Self)", res.value(v2)[8], 40);

	setAgentPlacementFunction(pop, "<<Self.index()*10,Self.index()*20>>");
	setValue(v, "[Population].FindIndex(1).Location().x");
	setValue(v2, "[Population].FindIndex(2).Location().y");
	res = runModel(true);
	assertEqual("Custom Loc 21 (Obj)", res.value(v)[0], 10);
	assertEqual("Custom Loc 22 (Obj)", res.value(v2)[8], 40);


	var mover = createPrimitive("Mover", "Action", [200,150], [150,100]);
	setParent(mover, f);
	setTriggerType(mover, "Condition");
	setTriggerValue(mover, "true")
	setValue(mover, "move(Self, {10, 20})");
	res = runModel(true);
	assertEqual("Custom Move 22", res.value(v)[2], 10+2*10);
	assertEqual("Custom Move 23", res.value(v2)[9], 40+9*20);

	setValue(mover, "Self.move({10, 20})");
	res = runModel(true);
	assertEqual("Custom Move 22 (Obj)", res.value(v)[2], 10+2*10);
	assertEqual("Custom Move 23 (Obj)", res.value(v2)[9], 40+9*20);


	setValue(mover, "Self.setLocation({11, 21})");
	res = runModel(true);
	assertEqual("Custom Move 24 (Obj)", res.value(v)[2], 11);
	assertEqual("Custom Move 25 (Obj)", res.value(v2)[9], 21);


	setFolderAgentParent(f, "x <- new AgentBase\n x.doMove <- function() self.move({10, 20})\n x")
	setValue(mover, "Self.doMove()");
	res = runModel(true);
	assertEqual("Custom Agent Parent 1", res.value(v)[2], 10+2*10);
	assertEqual("Custom Agent Parent 2", res.value(v2)[9], 40+9*20);

	setMacros("mover <- new AgentBase\n mover.doMove <- function(dist) self.move(dist*{1, 2})")
	setFolderAgentParent(f, "mover")
	setValue(mover, "Self.doMove(10)");
	res = runModel(true);
	assertEqual("Custom Agent Parent 3", res.value(v)[2], 10+2*10);
	assertEqual("Custom Agent Parent 4", res.value(v2)[9], 40+9*20);


	setGeometryWrap(pop, true);
	res = runModel(true);
	assertEqual("Custom Move 24", res.value(v)[2], (10+2*10) % 200);
	assertEqual("Custom Move 25", res.value(v2)[9], (40+9*20) % 100);

	createConnector("Link","Link", pop, mover);
	setAgentPlacementFunction(pop, "{index(Self)*10, 1}");

	setValue(mover, "moveTowards(Self, findIndex([Population], 1), 1)");
	setValue(v2, "Location(FindIndex([Population], 2)).x")
	res = runModel(true);
	assertEqual("Custom Move 26", res.value(v)[2], 10);
	assertEqual("Custom Move 27", res.value(v)[9], 10);
	assertEqual("Custom Move 27.1", res.value(v2)[2], 20-2*1);
	assertEqual("Custom Move 27.2", res.value(v2)[9], 20-9*1);

	setValue(mover, "Self.moveTowards([Population].findIndex(1), 1)");
	setValue(v2, "[Population].FindIndex(2).Location().x")
	res = runModel(true);
	assertEqual("Custom Move 26 (Obj)", res.value(v)[2], 10);
	assertEqual("Custom Move 27 (Obj)", res.value(v)[9], 10);
	assertEqual("Custom Move 27.1 (Obj)", res.value(v2)[2], 20-2*1);
	assertEqual("Custom Move 27.2 (Obj)", res.value(v2)[9], 20-9*1);



	setValue(mover, "1");


	setAgentNetwork(pop, "Custom Function");
	setAgentNetworkFunction(pop, "ifThenElse(index(a)=1 || index(b)=1, true, false)");
	setValue(v, "count(connected(findIndex([Population], 1)))")
	setValue(v2, "count(connected(findIndex([Population], 3)))")
	res = runModel(true);
	assertEqual("Custom Network 28", res.value(v)[0], 9);
	assertEqual("Custom Network 29", res.value(v2)[8], 1);

	setValue(v, "count(connectionWeight(findIndex([Population], 1), connected(findIndex([Population], 1))))")
	setValue(v2, "connectionWeight(findIndex([Population], 3), connected(findIndex([Population], 3))){1}")
	res = runModel(true);
	assertEqual("Custom Network 29.1", res.value(v)[0], 9);
	assertEqual("Custom Network 29.2", res.value(v2)[8], 1);


	setValue(v, "setConnectionWeight(findIndex([Population], 1), connected(findIndex([Population], 1)), 5)")
	setValue(v2, "connectionWeight(findIndex([Population], 1), connected(findIndex([Population], 1))){1}")
	res = runModel(true);
	assertEqual("Custom Network 29.3", res.value(v)[0], 1);
	assertEqual("Custom Network 29.4", res.value(v2)[8], 5);

	setValue(v, "[Population].findIndex(1).connected().length()")
	setValue(v2, "[Population].findIndex(3).connected().length()")
	res = runModel(true);
	assertEqual("Custom Network 28 (Obj)", res.value(v)[0], 9);
	assertEqual("Custom Network 29 (Obj)", res.value(v2)[8], 1);


	setValue(mover, "ifthenelse( index(self)==3, unconnect(self, findIndex([population], 1)), 0)");
	res = runModel(true);
	assertEqual("Custom Network 30", res.value(v)[0], 9);
	assertEqual("Custom Network 31", res.value(v2)[0], 1);
	assertEqual("Custom Network 32", res.value(v)[8], 8);
	assertEqual("Custom Network 33", res.value(v2)[8], 0);

	setValue(mover, "ifthenelse( index(self)==3, self.unconnect([population].findIndex(1)), 0)");
	res = runModel(true);
	assertEqual("Custom Network 30 (Obj)", res.value(v)[0], 9);
	assertEqual("Custom Network 31 (Obj)", res.value(v2)[0], 1);
	assertEqual("Custom Network 32 (Obj)", res.value(v)[8], 8);
	assertEqual("Custom Network 33 (Obj)", res.value(v2)[8], 0);


	setValue(mover, "ifthenelse(index(self)==3, connect(self, findIndex([population], 2)),0)");
	res = runModel(true);
	assertEqual("Custom Network 34", res.value(v)[0], 9);
	assertEqual("Custom Network 35", res.value(v2)[0], 1);
	assertEqual("Custom Network 36", res.value(v)[8], 9);
	assertEqual("Custom Network 37", res.value(v2)[8], 2);

	setValue(mover, "IfThenElse(self.index()==3, self.connect([population].findIndex(2)),0)");
	res = runModel(true);
	assertEqual("Custom Network 34 (Obj)", res.value(v)[0], 9);
	assertEqual("Custom Network 35 (Obj)", res.value(v2)[0], 1);
	assertEqual("Custom Network 36 (Obj)", res.value(v)[8], 9);
	assertEqual("Custom Network 37 (Obj)", res.value(v2)[8], 2);

	setValue(mover, "ifthenelse(index(self)==3, connect(self, true),0)");
	res = runModel(true);
	assertUnequal("Custom Network 38", res.error, "none");


	setValue(mover, "ifthenelse(index(self)==3, self.connect(true),0)");
	res = runModel(true);
	assertUnequal("Custom Network 38 (Obj)", res.error, "none");

	setValue(mover, "ifthenelse(index(self)==3, connect(self, 1),0)");
	res = runModel(true);
	assertUnequal("Custom Network 39", res.error, "none");

	setTriggerType(mover, "Condition");
	setTriggerValue(mover, "((index(self)==3 && years>=2) || (index(self)==5 && years>=5))");
	setValue(mover, "remove(self)");
	setValue(v, "populationSize([Population])")
	setValue(v2, "count(connected(findIndex([Population], 1)))")
	res = runModel(true);
	assertEqual("Add/Remove 1", res.value(v)[0], 10);
	assertEqual("Add/Remove 2", res.value(v)[4], 9);
	assertEqual("Add/Remove 3", res.value(v)[8], 8);

	setTriggerValue(mover, "((self.index()==3 && years==2) || (self.index()==5 && years==5))");
	setValue(mover, "self.remove()");
	setValue(v, "[Population].populationSize()")
	setValue(v2, "[Population].findIndex(1).connected().length()")
	res = runModel(true);
	assertEqual("Add/Remove 1 (Obj)", res.value(v)[0], 10);
	assertEqual("Add/Remove 2 (Obj)", res.value(v)[4], 9);
	assertEqual("Add/Remove 3 (Obj)", res.value(v)[8], 8);

	setTriggerValue(mover, "((index(self)==3 && years==2) || (index(self)==5 && years==5))");
	setValue(mover, "add([Population])");
	setValue(v, "populationSize([Population])")
	setValue(v2, "count(connected(findIndex([Population], 3)))")
	res = runModel(true);
	assertEqual("Add/Remove 5", res.value(v)[0], 10);
	assertEqual("Add/Remove 6", res.value(v)[4], 11);
	assertEqual("Add/Remove 7", res.value(v)[8], 12);

	setValue(mover, "[Population].add()");
	assertEqual("Add/Remove 5 (Obj)", res.value(v)[0], 10);
	assertEqual("Add/Remove 6 (Obj)", res.value(v)[4], 11);
	assertEqual("Add/Remove 7 (Obj)", res.value(v)[8], 12);

	setTriggerValue(mover, "((index(self)==3 && years==2) || (index(self)==5 && years==5))");
	setValue(mover, "add([Population], Self)");
	setValue(v, "populationSize([Population])")
	res = runModel(true);
	assertEqual("Add/Remove 8", res.value(v)[0], 10);
	assertEqual("Add/Remove 9", res.value(v)[4], 11);
	assertEqual("Add/Remove 10", res.value(v)[8], 12);

	setValue(mover, "[Population].add(Self)");
	assertEqual("Add/Remove 8 (Obj)", res.value(v)[0], 10);
	assertEqual("Add/Remove 9 (Obj)", res.value(v)[4], 11);
	assertEqual("Add/Remove 10 (Obj)", res.value(v)[8], 12);

	setAgentPlacement(pop, "Random");

	setPopulationSize(pop, 1);
	setTriggerValue(mover, "years == 5 ");
	setValue(mover, "[Population].add()");
	setValue(v, "populationSize([Population])")
	setValue(v2, "IfThenElse(populationsize([Population])==2, Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), -1)")

	res = runModel(true);
	assertEqual("Add/Remove 11", res.value(v)[0], 1);
	assertEqual("Add/Remove 12", res.value(v)[8], 2);
	assertEqual("Add/Remove 13", res.value(v2)[0], -1);
	assertEqual("Add/Remove 14", res.value(v2)[7], 0); //not clone

	setPopulationSize(pop, 1);
	setValue(mover, "add([Population], Self)");
	setValue(v, "populationSize([Population])")
	setValue(v2, "ifthenElse(populationsize([Population])==2, Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), -1)")
	res = runModel(true);
	assertEqual("Add/Remove 15", res.value(v)[0], 1);
	assertEqual("Add/Remove 16", res.value(v)[8], 2);
	assertEqual("Add/Remove 17", res.value(v2)[0], -1);
	assertEqual("Add/Remove 18", res.value(v2)[7], 1); //clone

	setPopulationSize(pop, 0);
	setParent(mover);
	setTriggerValue(mover, "years == 5 or years==3");
	setValue(mover, "add([Population])");
	setValue(v, "populationSize([Population])")
	setValue(v2, "IfThenElse(populationsize([Population])==2, Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), -1)")
	res = runModel(true);
	assertEqual("Add/Remove 19", res.value(v)[0], 0);
	assertEqual("Add/Remove 20", res.value(v)[8], 2);
	assertEqual("Add/Remove 21", res.value(v2)[0], -1);
	assertEqual("Add/Remove 22", res.value(v2)[7], 0); // not clone

	setPopulationSize(pop, 3);
	createConnector("Link", "Link", pop, t);
	setValue(mover, 1);
	setTriggerType(t, "Condition");
	setTriggerValue(t, "Distance(self, [Population].findIndex(1)) > 1");
	setTriggerRepeat(t, false);
	setTriggerRepeat(t2, false);
	res = runModel(true);
	assertEqual("Init Position With State", res.error, "none");

	setPopulationSize(pop, 2);
	removePrimitive(t);
	removePrimitive(t2);
	setParent(mover);
	setValue(s, "false");
	setTriggerValue(mover, "years == 5 ");
	setValue(mover, "SetValue([Population], [State 1], true)");
	setValue(v, "select(value([Population], [State 1]), 1)");
	setValue(v2, "select(value([Population],[State 1]), 2)")
	res = runModel(true);
	assertEqual("SetValue 1", res.value(v)[3], 0);
	assertEqual("SetValue 2", res.value(v)[8], 1);
	assertEqual("SetValue 3", res.value(v2)[3], 0);
	assertEqual("SetValue 4", res.value(v2)[8], 1);

	setValue(mover, "[Population].SetValue([State 1], true)");
	setValue(v, "[Population].value([State 1]){1}");
	setValue(v2, "[Population].value([State 1]){2}")
	res = runModel(true);
	assertEqual("SetValue 1 (Obj)", res.value(v)[3], 0);
	assertEqual("SetValue 2 (Obj)", res.value(v)[8], 1);
	assertEqual("SetValue 3 (Obj)", res.value(v2)[3], 0);
	assertEqual("SetValue 4 (Obj)", res.value(v2)[8], 1);


	setGeometryWidth(pop, "{1 Meter}");
	res = runModel(true);
	assertUnequal("Geo Units 1", res.error, "none");

	setGeometryWidth(pop, "2");
	setGeometryHeight(pop, "{2 Kilometers}");
	res = runModel(true);
	assertUnequal("Geo Units 2", res.error, "none");


	setGeometryUnits(pop, "Meters")
	res = runModel(true);
	assertEqual("Geo Units 3", res.error, "none");

	setGeometryWidth(pop, "{1 Meter}");
	res = runModel(true);
	assertEqual("Geo Units 4", res.error, "none");

	setGeometryWidth(pop, "{1 Dog}");
	res = runModel(true);
	assertUnequal("Geo Units 5", res.error, "none");


	clearModel()

	var v = createPrimitive("Var", "Variable", [350,350], [200,200]);
	var v2 = createPrimitive("Var2", "Variable", [0,300], [200,100]);
	var f = createPrimitive("Agent", "Folder", [300,300], [300,300]);
	setFolderType(f, "Agent");
	setParent(v,f);
	var p = createPrimitive("Population", "Agents", [0,0],[200,100]);
	var a = createPrimitive("Action", "Action", [300,0],[200,100]);
	createConnector("Link","Link", f,p);
	createConnector("Link","Link", p,v);
	createConnector("Link","Link", p,v2);
	createConnector("Link","Link", p,a);
	setAgentBase(p, f)
	setPopulationSize(p,5)
	setValue(v, "PopulationSize([Population])")
	setTriggerType(a, "Condition");
	setTriggerValue(a, "years=5");
	setValue(a, "repeat(add([Population]),10)");
	setValue(v2, "Count(unique(Value([Population],[Var])))")

	res = runModel(true);
	assertEqual("Additional Add 1", res.value(v2)[0], 1);
	assertEqual("Additional Add 2", res.value(v2)[5], 1);
	assertEqual("Additional Add 3", res.value(v2)[6], 1);
	assertEqual("Additional Add 4", res.value(v2)[7], 1);


	setValue(a, "repeat([Population].add(),10)");
	setValue(v2, "[Population].Value([Var]).unique().length()")
	res = runModel(true);
	assertEqual("Additional Add 1 (Obj)", res.value(v2)[0], 1);
	assertEqual("Additional Add 2 (Obj)", res.value(v2)[5], 1);
	assertEqual("Additional Add 3 (Obj)", res.value(v2)[6], 1);
	assertEqual("Additional Add 4 (Obj)", res.value(v2)[7], 1);

	setValue(v2, "max(Value([Population],[Var]))")
	res = runModel(true);
	assertEqual("Additional Add 5", res.value(v2)[0], 5);
	assertEqual("Additional Add 6", res.value(v2)[5], 5);
	assertEqual("Additional Add 7", res.value(v2)[6], 15);
	assertEqual("Additional Add 8", res.value(v2)[7], 15);

	setValue(v2, "[Population].value([Var]).max()")
	res = runModel(true);
	assertEqual("Additional Add 5 (Obj)", res.value(v2)[0], 5);
	assertEqual("Additional Add 6 (Obj)", res.value(v2)[5], 5);
	assertEqual("Additional Add 7 (Obj)", res.value(v2)[6], 15);
	assertEqual("Additional Add 8 (Obj)", res.value(v2)[7], 15);


	clearModel();

	// Test cross boundary flows

	var v = createPrimitive("Stock1", "Stock", [350,350], [200,200]);
	var v2 = createPrimitive("Stock2", "Stock", [0,300], [200,100]);
	var f = createPrimitive("Agent", "Folder", [300,300], [300,300]);
	setFolderType(f, "Agent");
	setParent(v,f);
	var p = createPrimitive("Population", "Agents", [0,0],[200,100]);
	var flow = createConnector("Flow","Flow", v,v2);
	setAgentBase(p, f)
	setPopulationSize(p,5)

	res = runModel(true);
	assertUnequal("Cross Boundary Flow 1", res.error, "none");
	setParent(v2,f);
	setParent(flow,f);
	res = runModel(true);
	assertEqual("Cross Boundary Flow 2", res.error, "none");
	removePrimitive(v2);
	res = runModel(true);
	assertEqual("Cross Boundary Flow 3", res.error, "none");
	var v2 = createPrimitive("Stock2", "Stock", [0,300], [200,100]);
	setEnds(f, v, v2);
	setParent(flow,null);
	removePrimitive(v2);
	res = runModel(true);
	assertUnequal("Cross Boundary Flow 4", res.error, "none");

	clearModel()

	test = prevTest;

}

function testUI(){
	test = "UI";

	var s = topBarShown();
	toggleTopBar();
	assertEqual("Top bar 1", topBarShown(), ! s);
	toggleTopBar();
	assertEqual("Top bar 2", topBarShown(), s);

	s = sideBarShown();
	toggleSideBar();
	assertEqual("Side bar 1", sideBarShown(), ! s);
	toggleSideBar();
	assertEqual("Side bar 2", sideBarShown(), s);


}

function testMacros(){

	test = "Macros";

	clearModel();

	var mString  = "a <- 52\nf(x)<-x^2";

	setMacros(mString);
	assertEqual("Get Macros", getMacros(), mString);


	var p1  = createPrimitive("p1", "Variable",[200,0],[100,100]);
	var p2  = createPrimitive("p2", "Variable",[0,0],[100,100]);
	setValue(p1, "a");
	setValue(p2, "f(2)");
	var res = runModel(true);
	assertEqual("Constant", res.value(p1)[3],52);
	assertEqual("Function", res.value(p2)[3],4);
}


function testUnitFunctions(){

	test = "Units Functions";

	clearModel();
	var p1  = createPrimitive("p1", "Variable",[200,0],[100,100]);
	var p2  = createPrimitive("p2", "Variable",[0,0],[100,100]);
	var p3  = createPrimitive("p3", "Variable",[0,0],[100,100]);
	var p4  = createPrimitive("p4", "Variable",[0,0],[100,100]);
	var p5  = createPrimitive("p5", "Variable",[0,0],[100,100]);
	var p6  = createPrimitive("p6", "Variable",[0,0],[100,100]);
	var p7  = createPrimitive("p7", "Variable",[0,0],[100,100]);
	setValue(p1, "Years");
	setValue(p2, "Months");
	setValue(p3, "Weeks");
	setValue(p4, "Days");
	setValue(p5, "Hours");
	setValue(p6, "Minutes");
	setValue(p7, "Seconds");
	var res = runModel(true);
	assertEqual("Y", res.value(p1)[3],3);
	assertEqual("Mo", res.value(p2)[3],3*12);
	assertEqual("W", Math.floor(res.value(p3)[3]), 3*52);
	assertEqual("D", res.value(p4)[3],3*365);
	assertEqual("H", res.value(p5)[3],3*365*24);
	assertEqual("Mi", res.value(p6)[3],3*365*24*60);
	assertEqual("S", res.value(p7)[3],3*365*24*60*60);

	setValue(p1, "Years(time*2)");
	setValue(p2, "Months(time*2)");
	setValue(p3, "Weeks(time*2)");
	setValue(p4, "Days(time*2)");
	setValue(p5, "Hours(time*2)");
	setValue(p6, "Minutes(time*2)");
	setValue(p7, "Seconds(time*2)");
	res = runModel(true);
	assertEqual("Y", res.value(p1)[3],2*3);
	assertEqual("Mo", res.value(p2)[3],2*3*12);
	assertEqual("W", Math.floor(res.value(p3)[3]),2*3*52);
	assertEqual("D", res.value(p4)[3],2*3*365);
	assertEqual("H", res.value(p5)[3],2*3*365*24);
	assertEqual("Mi", res.value(p6)[3],2*3*365*24*60);
	assertEqual("S", res.value(p7)[3],2*3*365*24*60*60);

	setValue(p1, "unitless(TimeStart)");
	setValue(p2, "unitless(TimeLength)");
	setValue(p3, "unitless(TimeStep)");
	setValue(p4, "unitless(TimeEnd)");
	res = runModel(true);
	assertEqual("Time Start", res.value(p1)[3], getTimeStart());
	assertEqual("Time Length", res.value(p2)[3], getTimeLength());
	assertEqual("Time Step", res.value(p3)[3], getTimeStep());
	assertEqual("Time End", res.value(p4)[3], getTimeStart()+getTimeLength());


}


function testUnitsAndConstraints(){

	test = "Units and Constraints";

	clearModel();

	var x = createPrimitive("tester", "Variable", [0,0], [100,10]);
	setValue(x, "time");
	setUnits(x, "Seconds");

	assertEqual("No error", runModel(true).error, "none");
	setUnits(x, "Qubits");
	assertUnequal("Units Error", runModel(true).error, "none");
	setUnits(x, "Minutes");
	assertEqual("No error Units", runModel(true).error, "none");

	setConstraints(x, [10, true, 5, false]);
	assertUnequal("Constraints Error", runModel(true).error, "none");
	setConstraints(x, [10, false, 5, false]);
	assertEqual("Constraints Error", runModel(true).error, "none");
	setConstraints(x, [10, false, 5, true]);
	assertUnequal("Constraints Error", runModel(true).error, "none");
	setConstraints(x, [10, false, 5, false]);
	assertEqual("Constraints Error", runModel(true).error, "none");


}


function testPrimitiveGetSet(){
	test = "Primitive Get Set";

	setupComplexDummy();

	var x = findName("x");
	setName(x, "xyz");
	assertEqual("Name", getName(x), "xyz");
	setNote(x, "abc");
	assertEqual("Note", getNote(x), "abc");
	setValue(x, "123");
	assertEqual("SetValue", getValue(x), "123");
	setValue(findName("My Flow"), "098");
	assertEqual("SetValue", getValue(findName("My Flow")), "098");
	setUnits(findName("My Flow"), "Qubits");
	assertEqual("SetUnits", getUnits(findName("My Flow")), "Qubits");
	setShowSlider(x, true);
	assertEqual("ShowSlider 1", getShowSlider(x), true);
	setShowSlider(x, false);
	assertEqual("ShowSlider 2", getShowSlider(x), false);
	setSliderMax(x, 72);
	assertEqual("SliderMax", getSliderMax(x), 72);
	setSliderMin(x, 12);
	assertEqual("SliderMin", getSliderMin(x), 12);
	setSliderStep(x, 15);
	assertEqual("SliderStep", getSliderStep(x), 15);

	if(!(graph instanceof SimpleNode)){
		setFillColor(x, "green");
		assertEqual("Fill Color", getFillColor(x), "green");
		setFontColor(x, "red");
		assertEqual("Font Color", getFontColor(x), "red");
		setLineColor(x, "yellow");
		assertEqual("Line Color", getLineColor(x), "yellow");
		setOpacity(x, 50);
		assertEqual("Opacity", getOpacity(x), 50);

		setImage(x, "http://testimage.com/image.png");
		assertEqual("Image", getImage(x), "http://testimage.com/image.png");
	}



	var f = findName("My Flow");
	setConstraints(f, [-10, true, 10, false]);
	assertEqual("SetConstraints", getConstraints(f)[0], -10);
	assertEqual("SetConstraints", getConstraints(f)[1], true);
	assertEqual("SetConstraints", getConstraints(f)[2], 10);
	assertEqual("SetConstraints", getConstraints(f)[3], false);
	setConstraints(findName("My Flow"), [-10, false, 10, true]);
	assertEqual("SetConstraints", getConstraints(f)[1], false);
	assertEqual("SetConstraints", getConstraints(f)[3], true);

	setNonNegative(f, true);
	assertEqual("Set Non Negative Flow", getNonNegative(f), true);
	setNonNegative(f, false);
	assertEqual("Set Non Negative Flow", getNonNegative(f), false);

	var s = findName("My Stock");
	setNonNegative(s, true);
	assertEqual("Set Non Negative Stock", getNonNegative(s), true);
	setNonNegative(s, false);
	assertEqual("Set Non Negative Stock", getNonNegative(s), false);
	setDelay(s, 5);
	assertEqual("Set Delay", getDelay(s), 5);
	setStockType(s, "Conveyor");
	assertEqual("Set Type", getStockType(s), "Conveyor");
	setStockType(s, "Store");
	assertEqual("Set Type", getStockType(s), "Store");


	var c = findName("My Converter");
	setData(c, "fdsgsdg");
	assertEqual("Set Data", getData(c), "fdsgsdg");
	setConverterInput(c, s);
	assertEqual("Set Source", getConverterInput(c).id, s.id);
	setConverterInput(c, null);
	assertNull("Set Source 2", getConverterInput(c));
	setInterpolation(c, "fdsf");
	assertEqual("Set Interpolation", getInterpolation(c), "fdsf");

	var state = createPrimitive("My State", "State", [100,60],[100,100]);
	setValue(state, "abc");
	assertEqual("State Set Value", getValue(state), "abc");
	assertEqual("State Get Residency", getResidency(state), "0");
	setResidency(state, "xyz");
	assertEqual("State Set Residency", getResidency(state), "xyz");

	var transition = createConnector("My Transition", "Transition", state, null);
	setValue(transition, "abc1");
	assertEqual("Transition Set Value", getValue(transition), "abc1");
	setTriggerValue(transition, "abc12");
	assertEqual("Transition Set Value 2", getTriggerValue(transition), "abc12");
	assertEqual("Transition Get Trigger 1", getTriggerType(transition), "Timeout");
	setTriggerType(transition, "Condition");
	assertEqual("Transition Get Trigger 2", getTriggerType(transition), "Condition");
	assertEqual("Transition Get Trigger Repeat 1", getTriggerRepeat(transition), false);
	setTriggerRepeat(transition, true);
	assertEqual("Transition Get Trigger Repeat 2", getTriggerRepeat(transition), true);
	assertEqual("Transition Get Trigger Recalculate 1", getTriggerRecalculate(transition), false);
	setTriggerRecalculate(transition, true);
	assertEqual("Transition Get Trigger Recalculate 2", getTriggerRecalculate(transition), true);

	var action = createPrimitive("My Action", "Action", [100,60],[100,100]);
	setValue(action, "abc1");
	assertEqual("Action Set Value", getValue(action), "abc1");
	setTriggerValue(action, "abc123");
	assertEqual("Action Set Value 2", getTriggerValue(action), "abc123");
	assertEqual("Action Set Value 3", getValue(action), "abc1");
	assertEqual("Action Get Trigger 1", getTriggerType(action), "Probability");
	setTriggerType(action, "Timeout");
	assertEqual("Action Get Trigger 2", getTriggerType(action), "Timeout");
	assertEqual("Action Get Trigger Repeat 1", getTriggerRepeat(action), true);
	setTriggerRepeat(action, false);
	assertEqual("Action Get Trigger Repeat 2", getTriggerRepeat(action), false);
	assertEqual("Action Get Trigger Recalculate 1", getTriggerRecalculate(action), false);
	setTriggerRecalculate(action, true);
	assertEqual("Action Get Trigger Recalculate 2", getTriggerRecalculate(action), true);


	var agents = createPrimitive("My Agents", "Agents", [300,300],[200,100]);
	setPopulationSize(agents, 123);
	assertEqual("Agents Size", getPopulationSize(agents), 123);
	setGeometryUnits(agents, "foo bar");
	assertEqual("Agents Units", getGeometryUnits(agents), "foo bar");
	setGeometryHeight(agents, "foo bar 1");
	assertEqual("Agents Height", getGeometryHeight(agents), "foo bar 1");
	setGeometryWidth(agents, "foo bar 2");
	assertEqual("Agents Width", getGeometryWidth(agents), "foo bar 2");
	setAgentPlacement(agents, "foo bar 3");
	assertEqual("Agents Placement", getAgentPlacement(agents), "foo bar 3");
	setAgentPlacementFunction(agents, "foo bar 4");
	assertEqual("Agents Placement Function", getAgentPlacementFunction(agents), "foo bar 4");
	setAgentNetwork(agents, "foo bar 5");
	assertEqual("Agents Network", getAgentNetwork(agents), "foo bar 5");
	setAgentNetworkFunction(agents, "foo bar 6");
	assertEqual("Agents Network Function", getAgentNetworkFunction(agents), "foo bar 6");
	setGeometryWrap(agents, true);
	assertEqual("Agents Wrap 1", getGeometryWrap(agents), true);
	setGeometryWrap(agents, false);
	assertEqual("Agents Wrap 2", getGeometryWrap(agents), false);

	var f = createPrimitive("f", "Folder", [200,150], [150,100]);
	createConnector("Link","Link", f, agents);
	setAgentBase(agents, f);
	assertEqual("Agents Base", getAgentBase(agents).id, f.id);
	setFolderSolver(f, {a:1});
	assertEqual("Folder Solver", getFolderSolver(f).a, 1);


}

function testSimulationGetSet(){

	test = "Simulation Get Set";

	setAlgorithm("x")
	assertEqual("Algorithm", getAlgorithm(), "x");

	setTimeStep(72)
	assertEqual("Time Step", getTimeStep(), 72);

	setTimeLength(43)
	assertEqual("Time Length", getTimeLength(), 43);

	setTimeStart(32)
	assertEqual("Time Start", getTimeStart(), 32);

	setPauseInterval(2)
	assertEqual("Pause Interval", getPauseInterval(), 2);

	setTimeUnits("foo")
	assertEqual("Time Units", getTimeUnits(), "foo");

}

function testSimulation(){

	test = "Simulation Test";

	setTimeUnits("Years")
	setTimeStep(1);
	setTimeStart(0);
	setTimeLength(10);

	var algorithms = ["RK1", "RK4"];
	for( var i=0; i<algorithms.length; i++){
		console.log("--- Using Algorithm: "+algorithms[i])
		setAlgorithm(algorithms[i]);
		setTimeLength(10);
		clearModel();

		var s = createPrimitive("My Stock", "Stock", [10,10], [140, 50]);
		var f = createConnector("My Flow", "Flow", s, null);
		setValue(s, "100");
		setValue(f, "0.1*[Alpha]");

		var res = runModel(true);
		assertEqual("Length", res.Time.length, 11);
		assertEqual("Time Start", res.Time[0], 0);
		assertEqual("Time End", res.Time[10], 10);
		assertEqual("Stock Start", res.value(s)[0], 100);
		clearModel();

		//Mathematica Parity Tests
		clearModel();

		var mathimaticaScale = 100000;

		setTimeStep(.1);
		setTimeLength(2);


		var y = createPrimitive("Y", "Stock", [10,10], [140, 50]);
		var by = createConnector("My Flow", "Flow",  null, y);
		setValue(y, "100");
		setValue(by, "0.04*[Y]");

		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica ExpGrow Small Time", Math.round(res.value(y)[20]*mathimaticaScale), Math.round(108.31142163*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica ExpGrow Small Time", Math.round(res.value(y)[20]*mathimaticaScale), Math.round(108.328706767*mathimaticaScale) );
		}

		setTimeStart(.12);
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica ExpGrow Start Time", Math.round(res.value(y)[20]*mathimaticaScale), Math.round(108.31142163*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica ExpGrow Start Time", Math.round(res.value(y)[20]*mathimaticaScale), Math.round(108.328706767*mathimaticaScale) );
		}
		assertEqual("Mathematica ExpGrow Start Time 2", res.times[0], .12);
		assertEqual("Mathematica ExpGrow Start Time 3", res.times[1], .22);


		setTimeStart(0)
		setTimeLength(100);
		setTimeStep(1);

		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica ExpGrow", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5050.49481843*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica ExpGrow", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5459.81455268*mathimaticaScale) );
		}




		setValue(by, "0.02*[Y]*(1-[Y]/100)*Sin(Years/3)^2");
		setValue(y, 2);
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica LogGrow", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5.2233233649*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica LogGrow", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5.30387612074*mathimaticaScale) );
		}

		setValue(by, "0.02*[Y]*(1-[Y]/100)*Sin({Years/3 Radians})^2");
		setValue(y, 2);
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica LogGrow 2", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5.2233233649*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica LogGrow 2", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(5.30387612074*mathimaticaScale) );
		}

		var x = createPrimitive("X", "Stock", [10,10], [140, 50]);
		var bx = createConnector("My Flow", "Flow", null, x);
		var dx = createConnector("My Flow", "Flow", x, null);
		var dy = createConnector("My Flow", "Flow", y, null);
		createConnector("Link", "Link", x, by);
		createConnector("Link", "Link", y, dx);

		setValue(by, "[Y]*0.001*[X]");
		setValue(dy, "[Y]*0.1");
		setValue(bx, "[X]*0.1");
		setValue(dx, "[X]*0.0001*[Y]");
		setValue(x, 200);
		setValue(y, 100);

		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Mathematica LV", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(15.2517207902*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Mathematica LV", Math.round(res.value(y)[100]*mathimaticaScale), Math.round(4118.37647504*mathimaticaScale) );
		}



		setTimeLength(10);
		clearModel();
		//End Mathematica Parity Tests

		var x = createPrimitive("X", "Stock", [10,10], [140, 50]);
		var v = createPrimitive("V", "Variable", [10,10], [140, 50]);
		var bx = createConnector("Flow", "Flow", null, x);
		var lx = createConnector("Link", "Link", bx, v);

		setValue(bx, "[X]*0.1");
		setValue(x, 200);
		setValue(v, "[Flow]");

		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Flow Time Correct 1", Math.round(res.value(bx)[0]*mathimaticaScale), Math.round(20*mathimaticaScale) );
			assertEqual("Flow Time Correct 2", Math.round(res.value(v)[0]*mathimaticaScale), Math.round(20*mathimaticaScale) );
		}else if(algorithms[i]=="RK4"){
			assertEqual("Flow Time Correct 1", Math.round(res.value(bx)[0]*mathimaticaScale), Math.round(21.03416666*mathimaticaScale) );
			assertEqual("Flow Time Correct 2", Math.round(res.value(v)[0]*mathimaticaScale), Math.round(21.03416666*mathimaticaScale) );
		}

		clearModel();



		var p = createPrimitive("p","Variable", [0,0], [100,100]);
		setValue(p, "years");
		res = runModel(true);
		assertEqual("Generic Units 1", res.value(p)[4], 4);
		setValue(p, "months");
		res = runModel(true);
		assertEqual("Generic Units 2", res.value(p)[4], 4*12);

		clearModel()

		setTimeLength(100);


		if(algorithms[i]=="RK1"){
			// More flow scaling tests

			var p = createPrimitive("My Variable", "Variable", [100, 100], [140, 50]);
			var f = createConnector("My Flow", "Flow", null, null);
			var l = createConnector("link", "Link", f, p);

			setUnits(f, "euros/seconds");
			setUnits(p, "euros");

			setValue(f, "years*{1 euros/seconds}");
			setValue(p, "[My Flow]*{1 seconds}");
			res = runModel(true);
			assertEqual("More Flow Scaling 1", res.value(p)[20], 20);
			setUnits(f, "euros/years");
			res = runModel(true);
			assertEqual("More Flow Scaling 2", res.value(p)[20], 20);

			setUnits(f, "euros per years");
			res = runModel(true);
			assertEqual("More Flow Scaling 2", res.value(p)[20], 20);

			setValue(f, "years");
			setUnits(p, "euros/years");
			setValue(p, "[My Flow]");
			res = runModel(true);
			assertEqual("More Flow Scaling 3", res.value(p)[20], 20);

			clearModel();

			var p = createPrimitive("My Variable", "Variable", [100, 100], [140, 50]);
			var f = createConnector("My Flow", "Flow", null, null);
			var l = createConnector("link", "Link", f, p);

			setUnits(f, "");
			setUnits(p, "");


			setNonNegative(f, false);

			setValue(f, "10-years");
			setValue(p, "[My Flow]");
			res = runModel(true);
			assertEqual("PositiveOnly with Units", res.value(p)[20], -10);

			clearModel();
		}

		testAgents();

		clearModel();

		testSubscripting();

		clearModel();

		var p = createPrimitive("My Variable", "Variable", [100, 100], [140, 50]);
		var f = createConnector("My Flow", "Flow", null, null);
		var l = createConnector("link", "Link", f, p);

		setUnits(f, "euros/seconds");
		setUnits(p, "euros/seconds");

		setValue(f, "10-years");
		setValue(p, "[My Flow]");
		res = runModel(true);
		assertEqual("PositiveOnly with Units", res.value(p)[20], 0);

		clearModel()

		var s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		var f = createConnector("My Flow", "Flow", null, s);

		setUnits(f, "euros/year");
		setUnits(s, "euros");

		setValue(f, "10");
		setValue(s, "1");
		res = runModel(true);
		assertEqual("Unit Flows 1", res.value(s)[10], 10*10+1);

		setValue(f, "{10 Euros/years}");
		setValue(s, "{1 Euros}");
		res = runModel(true);
		assertEqual("Unit Flows 2", res.value(s)[10], 10*10+1);

		clearModel()

		// Test fixing of values
		p = createPrimitive("My Variable", "Variable", [100, 100], [140,50]);

		setValue(p, "Fix(years+12)");
		res = runModel(true);
		assertEqual("Fix 1", res.value(p)[15], 12);

		setValue(p, "Fix(years+12, 5)");
		res = runModel(true);
		assertEqual("Fix 2", res.value(p)[14], 22);

		setValue(p, "Fix(years+13, {5 years})");
		res = runModel(true);
		assertEqual("Fix 3", res.value(p)[14], 23);

		clearModel()


		//General Tests
		s = createPrimitive("My Stock", "Stock", [100, 100], [140,50]);
		f = createConnector("My Flow", "Flow", null, s);
		p = createPrimitive("My Variable", "Variable", [100, 100], [140,50]);
		l = createConnector("My Link", "Link", s, p)
		setValue(f, "1");
		setValue(s, "0");

		setStockType(s, "Conveyor");
		setDelay(s, 5);
		setValue(p,"[[My Stock]]");

		res = runModel(true);

		assertEqual("Conveyor 1", res.value(s)[2], 0);
		assertEqual("Conveyor 2", res.value(s)[4], 0);
		assertEqual("Conveyor 3", res.value(s)[12], 8);
		assertEqual("Conveyor 4", res.value(p)[2], 2);
		assertEqual("Conveyor 5", res.value(p)[12], 12);

		setDelay(s, "{5 years}");

		res = runModel(true);

		assertEqual("Conveyor Units 1", res.value(s)[2], 0);
		assertEqual("Conveyor Units 2", res.value(s)[4], 0);
		assertEqual("Conveyor Units 3", res.value(s)[12], 8);
		assertEqual("Conveyor Units 4", res.value(p)[2], 2);
		assertEqual("Conveyor Units 5", res.value(p)[12], 12);

		setDelay(s, "{365 days}*5");

		res = runModel(true);

		assertEqual("Conveyor Units 6", res.value(s)[2], 0);
		assertEqual("Conveyor Units 7", res.value(s)[4], 0);
		assertEqual("Conveyor Units 8", res.value(s)[12], 8);
		assertEqual("Conveyor Units 9", res.value(p)[2], 2);
		assertEqual("Conveyor Units 10", res.value(p)[12], 12);


		setValue(p, "[[My Stock]]-[My Stock]")
		var outF = createConnector("Outflow", "Flow", s, null);
		setValue(outF, "[Alpha]");
		//outF.timeIndependent=true
		setValue(f, "2");
		res = runModel(true);
		assertEqual("FSF 1", Math.round(res.lastValue(s)*1000), 2*1000);
		assertEqual("FSF 2", res.lastValue(p), 8);
		assertEqual("FSF 3", res.value(p)[3], 6);
		assertEqual("FSF 4", Math.round(res.lastValue(outF)*1000), 2*1000);
		assertEqual("FSF 5", res.value(outF)[3], 0);
		assertEqual("FSF 6", res.lastValue(f), 2);


		clearModel();

		s = createPrimitive("My Stock", "Stock", [100, 100], [140,50]);
		f = createConnector("My Flow", "Flow", null, s);
		var f2 = createConnector("My Flow", "Flow", s, null);
		p = createPrimitive("My Variable", "Variable", [100, 100], [140,50]);
		l = createConnector("My Link", "Link", s, p)
		setValue(f, "10");
		setValue(s, "50");
		setValue(f2, "[My Stock]");

		setStockType(s, "Conveyor");
		setDelay(s, 5);
		setValue(p,"[[My Stock]]");


		res = runModel(true);

		assertEqual("Conveyor 11", res.value(p)[0], 50);
		assertEqual("Conveyor 12", res.value(p)[1], 50);
		assertEqual("Conveyor 13", res.value(p)[2], 50);
		assertEqual("Conveyor 14", res.value(p)[12], 50);
		assertEqual("Conveyor 15", res.value(s)[0], 10);
		assertEqual("Conveyor 16", res.value(s)[1], 10);
		assertEqual("Conveyor 17", res.value(s)[2], 10);
		assertEqual("Conveyor 18", res.value(s)[5], 10);
		assertEqual("Conveyor 19", res.value(s)[12], 10);




		clearModel()

		s = createPrimitive("My Stock", "Stock", [100, 100], [140,50]);
		s2 = createPrimitive("My Stock", "Stock", [100, 100], [140,50]);
		f = createConnector("My Flow", "Flow", s, s2);
		setValue(f, "1");
		setValue(s, "0");
		setValue(s2, "0");

		res = runModel(true);
		assertEqual("Same Name 1", res.value(s)[5], -5);
		assertEqual("Same Name 2", res.value(s2)[5], 5);
		assertEqual("Same Name 3", res.value(s)[10], -10);
		assertEqual("Same Name 4", res.value(s2)[10], 10);


		clearModel()

		// Test flow values

		p = createPrimitive("My Variable", "Variable", [100, 100], [140, 50]);
		f = createConnector("My Flow", "Flow", null, null);
		l = createConnector("link", "Link", f, p);

		setValue(f, 10);
		setValue(p, "[My Flow]");
		res = runModel(true);
		assertEqual("Flow Value Default", res.value(p)[20], 10);

		clearModel()

		var s1 = createPrimitive("Stock 1", "Stock", [100, 100], [140, 50]);
		var s2 = createPrimitive("Stock 2", "Stock", [100, 100], [140, 50]);
		var s3 = createPrimitive("Stock 3", "Stock", [100, 100], [140, 50]);
		var s4 = createPrimitive("Stock 4", "Stock", [100, 100], [140, 50]);
		var s5 = createPrimitive("Stock 5", "Stock", [100, 100], [140, 50]);

		var f1 = createConnector("Flow 1", "Flow", null, s1);
		var f2 = createConnector("Flow 2", "Flow", null, s2);
		var f3 = createConnector("Flow 3", "Flow", null, s3);
		var f4 = createConnector("Flow 4", "Flow", null, s4);
		var f5 = createConnector("Flow 5", "Flow", null, s5);

		setValue(f1, 1);
		setUnits(f2, "unitless");
		setValue(f2, 7);
		setUnits(f2, "1/years");
		setValue(f3, 3);
		setUnits(f3, "dollars/years");
		setUnits(s3, "dollars");
		setValue(f4, "{200 centimeters/year}");
		setUnits(f4, "meters/years");
		setUnits(s4, "centimeters")
		setValue(f5, 5);
		setUnits(f5, "1/days");
		res = runModel(true);
		assertEqual("Flow Value 1", Math.round(res.value(f1)[20]*1000), 1*1000);
		assertEqual("Flow Value 2", Math.round(res.value(f2)[20]*1000), 7*1000);
		assertEqual("Flow Value 3", Math.round(res.value(f3)[20]*1000), 3*1000);
		assertEqual("Flow Value 4", Math.round(res.value(f4)[20]*1000), 2*1000);
		assertEqual("Flow Value 5", Math.round(res.value(f5)[20]*1000), 5*1000);

		assertEqual("Flow Stock Value 1", res.value(s1)[2], 1*2);
		assertEqual("Flow Stock Value 2", Math.round(res.value(s2)[2]), 7*2);
		assertEqual("Flow Stock Value 3", res.value(s3)[2], 3*2);
		assertEqual("Flow Stock Value 4", res.value(s4)[2], 200*2);
		assertEqual("Flow Stock Value 5", Math.round(res.value(s5)[2]), 5*365*2);


		clearModel()



		// Test non-negative stocks

		s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		s2 = createPrimitive("My Stock 2", "Stock", [100, 100], [140, 50]);
		f = createConnector("My Flow", "Flow", s, s2);

		setValue(s, 10);
		setValue(s2, 0);
		setValue(f, 1);
		res = runModel(true);
		assertEqual("Non Negative Stock 1", res.value(s)[20], -10);
		assertEqual("Non Negative Stock 2", res.value(s2)[20], 20);
		setNonNegative(s, true);
		res = runModel(true);
		assertEqual("Non Negative Stock 3", res.value(s)[20], 0);
		assertEqual("Non Negative Stock 4", res.value(s2)[20], 10);

		clearModel();

		// Test ordering of non-negative flow's in and out

		var s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		var outflow = createConnector("Outflow", "Flow", s, null);
		var inflow = createConnector("Inflow", "Flow", null, s);
		setNonNegative(s, true);

		function testNonNegative(i) {
			setValue(s, 50);
			setValue(outflow, 110);
			setValue(inflow, 100);
			res = runModel(true);
			assertEqual("Non Negative Stock " + (i+1), res.value(s)[2], 30);
			assertEqual("Non Negative Stock " + (i+2), res.value(s)[10], 0);

			setValue(s, "{a:50, b:30}");
			setValue(outflow, "{a:-10, b:110}");
			setValue(inflow, "{a:-10, b:100}");
			res = runModel(true);
			assertEqual("Non Negative Stock " + (i+3), res.value(s)[2].a, 50);
			assertEqual("Non Negative Stock " + (i+4), res.value(s)[10].a, 50);
			assertEqual("Non Negative Stock " + (i+5), res.value(s)[2].b, 10);
			assertEqual("Non Negative Stock " + (i+6), res.value(s)[10].b, 0);

			clearModel();
		}

		testNonNegative(4);

		var s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		var inflow = createConnector("Inflow", "Flow", null, s); // Flip order
		var outflow = createConnector("Outflow", "Flow", s, null);
		setNonNegative(s, true);

		testNonNegative(10);


		// Test stock with functions in the initial value

		s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);

		setValue(s, "years+10");
		res = runModel(true);
		assertEqual("Stock Function Value 1", res.value(s)[20], 10);

		clearModel()


		// Test non-negative flows

		s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		f = createConnector("My Flow", "Flow", null, s);

		setValue(s, 10);
		setValue(f, "years-10");
		setNonNegative(f, false);
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("Non Negative Flow 1 - stock", res.value(s)[1], 0);
			assertEqual("Non Negative Flow 2", Math.round(res.value(f)[0]*1000), -10*1000);
		}
		setNonNegative(f, true);
		res = runModel(true);
		assertEqual("Non Negative Flow 3 -stock", res.value(s)[2], 10);
		assertEqual("Non Negative Flow 4", res.value(f)[1], 0);

		// Test Converter

		clearModel();

		var c = createPrimitive("my converter", "Converter", [0,0], [100,40]);

		setData(c, "1,1.1;1.5,4;2,4;3,9;4,16;100,200");


		p = createPrimitive("Param", "Variable",[0,0],[100,40]);
		l = createConnector("link", "Link",p,c);
		setValue(p,"years+40");
		setConverterInput(c, p);

		res = runModel(true);
		assertEqual("Primitive Input Value", 200, res.value(c)[60])

		setConverterInput(c, null)

		res = runModel(true);
		assertEqual("Time Input Value",1.1, res.value(c)[1]);

		setData(c, "0,2;20,4");

		res = runModel(true);
		assertEqual("Interpolation",res.value(c)[10],3);
		setInterpolation(c, "Discrete");
		res = runModel(true);
		assertEqual("No Interpolation",res.value(c)[10],2)
		setInterpolation(c, "Linear");
		res = runModel(true);
		assertEqual("Interpolation 2",res.value(c)[10],3)



		l = createConnector("link", "Link", c, p);

		setValue(p, "[my converter]+[my converter]");

		res = runModel(true);
		assertEqual("Converter Addition", res.value(p)[10], 6);
		assertEqual("Converter Addition", res.value(p)[20], 8);
		assertEqual("Converter Addition", res.value(p)[21], 8);

		setUnits(p, "Years");
		setUnits(c, "Years");
		res = runModel(true);
		assertEqual("Converter Addition", res.value(p)[10], 6);
		assertEqual("Converter Addition", res.value(p)[20], 8);
		assertEqual("Converter Addition", res.value(p)[21], 8);


		//Test stock initial values
		clearModel()
		var p  = createPrimitive("My Stock 1", "Stock",[0,0],[100,100]);
		var p2  = createPrimitive("My Stock 2", "Stock",[0,0],[100,100]);
		var l = createConnector("Link","Link", p, p2);
		setValue(p,"10");
		setValue(p2, "[My Stock 1]");
		res = runModel(true);
		assertEqual("Stock Init 1", res.value(p)[0],10);
		assertEqual("Stock Init 2", res.value(p2)[0], 10)

		var l = createConnector("Link","Link", p2, p);
		setValue(p,"[My Stock 2]");
		setValue(p2, "20");
		res = runModel(true);
		assertEqual("Stock Init 3", res.value(p)[0],20);
		assertEqual("Stock Init 4", res.value(p2)[0], 20)

		//Test Units Being Copied function
		clearModel()
		var p  = createPrimitive("My Variable 1", "Variable",[0,0],[100,100]);
		var p2  = createPrimitive("My Variable 2", "Variable",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		setValue(p,"10");
		setUnits(p2, "Rabbits");
		setValue(p2, "[My Variable 1]");
		res = runModel(true);
		assertEqual("Unit Conversion Vars 1", res.value(p)[3],10);
		assertEqual("Unit Conversion Vars 2", res.value(p2)[3], 10);

		//Test Units Being Copied function
		clearModel()
		var p  = createPrimitive("My Variable 1", "Variable",[0,0],[100,100]);
		var p2  = createPrimitive("My Variable 2", "Variable",[0,0],[100,100]);
		var p3  = createPrimitive("My Variable 3", "Variable",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		var l = createConnector("Link","Link",p2,p3);
		setValue(p,"{a: 1.2, b:3.2}");
		setValue(p2, "round([My Variable 1])");
		setValue(p3, "[My Variable 2].b");
		res = runModel(true);
		assertEqual("Recurse Function", res.value(p3)[3],3);

		//Test Frozen Folders
		clearModel();
		var p  = createPrimitive("My Param", "Variable",[0,0],[100,100]);
		var p2  = createPrimitive("Derived", "Variable",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		setValue(p, "Years");
		setValue(p2, "[My Param] + Years");
		var f = createPrimitive("Folder", "Folder",[0,0],[100,100]);
		setParent(p, f);
		setFrozen(f, false);
		res = runModel(true);
		assertEqual("Frozen 1", res.value(p)[3], 3);
		assertEqual("Frozen 2", res.value(p2)[3], 6);
		setFrozen(f, true);
		res = runModel(true);
		assertEqual("Frozen 3", res.value(p)[3], 0);
		assertEqual("Frozen 4", res.value(p2)[3], 3);




		//Test Delay function
		clearModel()
		var p  = createPrimitive("My Param", "Variable",[0,0],[100,100]);
		var p2  = createPrimitive("Delayed", "Variable",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		setValue(p,"Years");
		setValue(p2, "Delay([My Param], 5, -3)");
		res = runModel(true);
		assertEqual("Initial Value", res.value(p2)[3],-3);
		assertEqual("End Delay", res.value(p)[res.periods-6], res.lastValue(p2));

		setValue(p2, "Delay([My Param], 0)");
		res = runModel(true);
		assertEqual("0 Delay", res.value(p2)[3], res.value(p)[3]);

		setValue(p,"Years");
		setValue(p2, "Delay([My Param], 5, -3)");
		res = runModel(true);
		assertEqual("[ Initial Value", res.value(p2)[3],-3);
		assertEqual("[ End Delay", res.value(p)[res.periods-6], res.lastValue(p2));

		setValue(p2, "Delay([My Param], 0)");
		res = runModel(true);
		assertEqual("[ 0 Delay", res.value(p2)[3], res.value(p)[3]);


		//Test Pulse function
		clearModel()
		p  = createPrimitive("My Param", "Variable",[0,0],[100,100]);
		setValue(p, "Pulse(10,2,5)");
		res = runModel(true);
		assertEqual("Pulse 1",res.value(p)[5],0);
		assertEqual("Pulse 2",res.value(p)[12],2);
		assertEqual("Pulse 3",res.value(p)[16],0);
		setValue(p, "Pulse(20,.5,2,10)");
		res = runModel(true);
		assertEqual("Pulse 4",res.value(p)[28],0);
		assertEqual("Pulse 5",res.value(p)[20],0.5);
		assertEqual("Pulse 6",res.value(p)[30],0.5);

		//Test If Then Else
		setValue(p, "IfThenElse(Years<20 and Years >= 10, 1, 0)");
		res = runModel(true);
		assertEqual("IfThenElse 1",res.value(p)[5],0);
		assertEqual("IfThenElse 2",res.value(p)[11],1);

		//Test Ramp function
		setValue(p, "Ramp(10, 15, 10)");
		res = runModel(true);
		assertEqual("Ramp 1", res.value(p)[5], 0);
		assertEqual("Ramp 2", res.value(p)[12], 4);
		assertEqual("Ramp 3", res.value(p)[16], 10);

		//Test Stochastic
		res = runModel(true);
		assertEqual("Stochastic 1", res.stochastic, false);
		setValue(p, "Ramp(10, 15, 10)*rand()");
		res = runModel(true);
		assertEqual("Stochastic 2", res.stochastic, true);
		setValue(p, "Ramp(10, 15, 10)");
		res = runModel(true);
		assertEqual("Stochastic 3", res.stochastic, false);

		//Test Staircase function
		setValue(p, "Step(10,3)");
		res = runModel(true);
		assertEqual("Step 1",res.value(p)[5], 0);
		assertEqual("Step 2", res.value(p)[12], 3);
		assertEqual("Step 3", res.value(p)[16], 3);

		//Test Staircase function Vectorized
		setValue(p, "Step({a: 10, b:20, c:7}, {a:1, b:20, c:14}).c");
		res = runModel(true);
		assertEqual("Step Vec 1",res.value(p)[5], 0);
		assertEqual("Step Vec 2", res.value(p)[12], 14);
		assertEqual("Step Vec 3", res.value(p)[16], 14);

		//Test Staircase function Vectorized
		setValue(p, "Step(7, {a:1, b:20, c:12}).c");
		res = runModel(true);
		assertEqual("Step Vec 4",res.value(p)[5], 0);
		assertEqual("Step Vcc 5", res.value(p)[12], 12);
		assertEqual("Step Vec 6", res.value(p)[16], 12);

		setValue(p, "Step(7, {1, 20, 14}).c");
		res = runModel(true);
		assertUnequal("Step Vec 7", res.error, "none");

		setValue(p, "Step({a: 10, b:20, c:5}, {a:1, b:20, d:14}).b");
		res = runModel(true);
		assertUnequal("Step Vec 8", res.error, "none");

		// Units: pulse ramp step
		setUnits(p, "cows");
		setValue(p, "{1 cows} + Pulse(10,{2 cows},5)");
		res = runModel(true);
		assertEqual("Pulse Units 1",res.value(p)[5],1);
		assertEqual("Pulse Units 2",res.value(p)[12],3);
		assertEqual("Pulse Units 3",res.value(p)[16],1);
		setValue(p, "{1 cows} + Pulse(20,{.5 cows},2,10)");
		res = runModel(true);
		assertEqual("Pulse Units 4",res.value(p)[28],1);
		assertEqual("Pulse Units 5",res.value(p)[20],1.5);
		assertEqual("Pulse Units 6",res.value(p)[30],1.5);


		//Test Ramp function
		setValue(p, "{1 cows} + Ramp(10, 15, {10 cows})");
		res = runModel(true);
		assertEqual("Ramp Units 1", res.value(p)[5], 1);
		assertEqual("Ramp Units 2", res.value(p)[12], 5);
		assertEqual("Ramp Units 3", res.value(p)[16], 11);

		//Test Staircase function
		setValue(p, "{1 cows} + Step(10, {3 cows})");
		res = runModel(true);
		assertEqual("Step Units 1",res.value(p)[5], 1);
		assertEqual("Step Units 2", res.value(p)[12], 4);
		assertEqual("Step Units 3", res.value(p)[16], 4);

		//Test Mean, Median, Max, Min, StdDev functions
		clearModel()
		p  = createPrimitive("x", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("y", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "(Years-60)^2");
		setValue(p2, "PastMean([x])");
		res = runModel(true);
		assertEqual("Mean",res.lastValue(p2),950);
		setValue(p2, "[x].PastMean()");
		res = runModel(true);
		assertEqual("Mean (Obj)",res.lastValue(p2),950);

		setValue(p2, "PastMedian([x])");
		res = runModel(true);
		assertEqual("Median",Math.round(res.lastValue(p2)),625);
		setValue(p2, "[x].PastMedian()");
		res = runModel(true);
		assertEqual("Median (Obj)",Math.round(res.lastValue(p2)),625);

		setValue(p2, "Median(PastValues([x]))");
		res = runModel(true);
		assertEqual("Median 2",Math.round(res.lastValue(p2)),625);
		setValue(p2, "[x].PastValues().Median()");
		res = runModel(true);
		assertEqual("Median 2 (Obj)",Math.round(res.lastValue(p2)),625);

		setValue(p2, "PastStdDev([x])");
		res = runModel(true);
		assertEqual("StdDev", Math.round(res.lastValue(p2)*10), Math.round(962.8*10));
		setValue(p2, "[x].PastStdDev()");
		res = runModel(true);
		assertEqual("StdDev (Obj)", Math.round(res.lastValue(p2)*10), Math.round(962.8*10));

		setValue(p2, "PastMax([x])");
		res = runModel(true);
		assertEqual("Max", Math.round(res.lastValue(p2)), 3600);
		setValue(p2, "[x].PastMax()");
		res = runModel(true);
		assertEqual("Max (Obj)", Math.round(res.lastValue(p2)), 3600);

		setValue(p2, "PastMin([x])");
		res = runModel(true);
		assertEqual("Min", res.lastValue(p2),0);
		setValue(p2, "[x].PastMin()");
		res = runModel(true);
		assertEqual("Min (Obj)", res.lastValue(p2),0);

		setValue(p, "(Years-60)^2");
		setValue(p2, "Mean(1,2,3)");
		res = runModel(true);
		assertEqual("Mean",res.lastValue(p2),2);

		setValue(p2, "Median(1,2,4)");
		res = runModel(true);
		assertEqual("Median",Math.round(res.lastValue(p2)),2);

		setValue(p2, "Max(1,5,7,6)");
		res = runModel(true);
		assertEqual("Max", Math.round(res.lastValue(p2)), 7);

		setValue(p2, "Min(1,0,7,6)");
		res = runModel(true);
		assertEqual("Min", res.lastValue(p2),0);


		//Test Smooth function
		clearModel()
		p  = createPrimitive("My Param", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("Smoothed", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "StairCase(40, 3)");
		setValue(p2, "Smooth([My Param],20, 5)");
		res = runModel(true);
		assertEqual("Smooth 1", res.value(p2)[0], 5);
		assertEqual("Smooth 2", Math.round(res.value(p2)[40]*1000), Math.round(0.64256*1000));
		assertEqual("Smooth 3", Math.round(res.value(p2)[59]*1000), Math.round(2.110412*1000));
		setValue(p2, "[My Param].Smooth(20, 5)");
		res = runModel(true);
		assertEqual("Smooth 1 (Obj)", res.value(p2)[0],5);
		assertEqual("Smooth 2 (Obj)", Math.round(res.value(p2)[40]*1000), Math.round(0.64256*1000));
		assertEqual("Smooth 3 (obj)", Math.round(res.value(p2)[59]*1000), Math.round(2.110412*1000));


		setValue(p, "years");
		setValue(p2, "Smooth([My Param], 20, 5)");
		res = runModel(true);
		assertEqual("Smooth 4", res.value(p2)[0], 5);
		assertEqual("Smooth 5", res.value(p2)[1], 4.75);
		assertEqual("Smooth 6", Math.round(res.value(p2)[10]*1000), Math.round(4.96842*1000));

		setValue(p2, "Smooth([My Param], 20)");
		res = runModel(true);
		assertEqual("Smooth 4", res.value(p2)[0], 0);
		assertEqual("Smooth 5", res.value(p2)[1], 0);
		assertEqual("Smooth 6", Math.round(res.value(p2)[10]*1000), Math.round(1.97474*1000));

		//Test ExpDelay function
		clearModel()
		p  = createPrimitive("x", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("ExpValue", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "Staircase(20)");
		setValue(p2, "Delay3([x],10,2)");
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("ExpDelay 1", Math.round(res.value(p2)[3]*100), Math.round(1.946*100));
			assertEqual("ExpDelay 2", Math.round(res.value(p2)[2]*100), Math.round(2*100));
			assertEqual("ExpDelay 3",Math.round( res.value(p2)[26]*100), Math.round(0.269*100));
		}else if(algorithms[i]=="RK4"){
			assertEqual("ExpDelay 1", Math.floor(res.value(p2)[3]*10), Math.floor(1.946*10));
		}
		setValue(p2, "[x].Delay3(10,2)");
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("ExpDelay 1 (Obj)", Math.round(res.value(p2)[3]*100), Math.round(1.946*100));
			assertEqual("ExpDelay 2 (Obj)", Math.round(res.value(p2)[2]*100), Math.round(2*100));
			assertEqual("ExpDelay 3 (Obj)",Math.round( res.value(p2)[26]*100), Math.round(0.269*100));
		}else if(algorithms[i]=="RK4"){
			assertEqual("ExpDelay 1 (Obj)", Math.floor(res.value(p2)[3]*10), Math.floor(1.946*10));
		}

		//Test Rand Functions
		clearModel()
		p  = createPrimitive("RandParam", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("HalfRand", "Variable",[0,0],[100,100]);
		s  = createPrimitive("HalfRand", "Stock",[0,0],[100,100]);
		l = createConnector("Link","Link",p, p2);
		l = createConnector("Link","Link",p, s);
		setValue(p, "Rand");
		setValue(p2, "[RandParam]/2");
		setValue(s, "[RandParam]/4");
		res = runModel(true);
		assertEqual("Rand Cached Value", Math.round(res.lastValue(p)*10000), Math.round(res.lastValue(p2)*2*10000));
    if (algorithms[i]=="RK1") {
		  assertEqual("Rand Stock", Math.round(res.value(p)[0]*10000), Math.round(res.value(s)[0]*4*10000));
    }


		res = runModel(true);
		var r1 = res.lastValue(p);
		res = runModel(true);
		assertUnequal("Set Rand Seed 1",res.lastValue(p),r1);

		setMacros("SetRandSeed(1)");
		res = runModel(true);
		var r1 = res.lastValue(p);
		res = runModel(true);
		assertEqual("Set Rand Seed 2",res.lastValue(p),r1);

		setMacros("SetRandSeed(3)");
		res = runModel(true);
		assertUnequal("Set Rand Seed 3", res.lastValue(p2),r1);
		setMacros("");


		//Test Misc Function using tagged time units
		clearModel()
		p  = createPrimitive("x", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("y", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "Years");
		setValue(p2, "Delay([x], {3 Years} )");
		res = runModel(true);
		assertEqual("Time Units Delay 1", Math.round(res.value(p2)[6]*10000), Math.round(3*10000));

		setValue(p2, "Delay([x], {x: {3 years}, y: {5 years}} ).x");
		res = runModel(true);
		assertEqual("Time Units Delay Vec 1", Math.round(res.value(p2)[6]*10000), Math.round(3*10000));

		setValue(p2, "Delay([x], {x: 2, y: 4} ).y");
		res = runModel(true);
		assertEqual("Time Units Delay Vec 2", Math.round(res.value(p2)[6]*10000), Math.round(2*10000));


		var p3  = createPrimitive("z", "Variable",[0,0],[100,100]);
		setValue(p3, "{x: 2, y: 4}");
		l = createConnector("Link","Link", p3, p2);
		setValue(p2, "Delay([x], [z]).y");
		res = runModel(true);
		assertEqual("Time Units Delay Vec 3", Math.round(res.value(p2)[6]*10000), Math.round(2*10000));

		setValue(p2, "Delay([x], {x: -1, y: 4} ).y"); // Can't have negative delay
		res = runModel(true);
		assertUnequal("Time Units Delay Vec 4", res.error, "none");


		setValue(p2, "[x].Delay({3 Years} )");
		res = runModel(true);
		assertEqual("Time Units Delay 1 (Obj)", Math.round(res.value(p2)[6]*10000), Math.round(3*10000));

		setValue(p2, "Delay([x], {48 Months})");
		res = runModel(true);
		assertEqual("Time Units Delay 2", Math.round(res.value(p2)[6]*10000), Math.round(2*10000));

		setValue(p2, "PastMean([x], {48 Months})");
		res = runModel(true);
		assertEqual("Time Units Mean 1", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3+2)/5*10000));

		setValue(p2, "Mean(PastValues([x], {48 Months}))");
		res = runModel(true);
		assertEqual("Time Units Mean 2", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3+2)/5*10000));

		setValue(p2, "PastMean([x], {3 Years})");
		res = runModel(true);
		assertEqual("Time Units Mean 3", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3)/4*10000));

		setValue(p2, "PastCorrelation([x],[x])");
		res = runModel(true);
		assertEqual("Correlation", Math.round(res.value(p2)[6]*10000), 10000);

		setValue(p2, "PastCorrelation([x],[x], {3 Years})");
		res = runModel(true);
		assertEqual("Correlation", Math.round(res.value(p2)[6]*10000), 10000);




		// Test Units and Variables

		clearModel();

		var p1 = createPrimitive("x1", "Variable", [0,0], [100,100]);
		var p2 = createPrimitive("x2", "Variable", [0,0], [100,100]);
		var p3 = createPrimitive("y", "Variable", [0,0], [100,100]);
		var l = createConnector("l", "Link", p1, p3);
		var l2 = createConnector("l2", "Link", p2, p3);

		setUnits(p1,"Centimeters");
		setUnits(p2, "Meters^2");
		setUnits(p3, "Meters^3")
		setValue(p1, "200");
		setValue(p2, "3");
		setValue(p3, "[x1]*[x2]");
		var res = runModel(true);

		assertEqual("Variable Units Conversion 1",res.value(p3)[50], 6)
		setUnits(p1, "Seconds")
		res = runModel(true);
		assertUnequal("Variable Units Conversion 2", res.error, "none");

		clearModel();

		var p1 = createPrimitive("y1", "Variable", [0,0], [100,100]);
		var p2 = createPrimitive("y2", "Variable", [0,0], [100,100]);
		var p3 = createPrimitive("x", "Variable", [0,0], [100,100]);
		var l = createConnector("l", "Link", p3, p1);
		var l2 = createConnector("l2", "Link", p3, p2);

		setUnits(p2,"Centimeters");
		setValue(p3, "years");
		setValue(p1, "delay([x],3)");
		setValue(p2, "delay([x],5)");
		var res = runModel(true);

		assertEqual("Past Values Clone Check 1",res.value(p1)[10], 7)
		assertEqual("Past Values Clone Check 2",res.value(p2)[10], 5)
		assertEqual("Past Values Clone Check 3",res.value(p3)[10], 10)

		setValue(p1, "delay1([x],2)");
		setValue(p2, "delay1([x],2)");
		var res = runModel(true);

		assertEqual("Past Values Clone Check 4", res.error, "none");

		setValue(p1, "delay3([x],2)");
		setValue(p2, "delay3([x],2)");
		var res = runModel(true);

		assertEqual("Past Values Clone Check 5", res.error, "none");

		setValue(p1, "smooth([x],2)");
		setValue(p2, "smooth([x],2)");
		var res = runModel(true);

		assertEqual("Past Values Clone Check 6", res.error, "none");


		clearModel();


		p1 = createPrimitive("x", "Variable", [0,0], [100,100]);
		p2 = createPrimitive("y", "Variable", [0,0], [100,100]);

		l = createConnector("l", "Link", p1, p2);

		setValue(p1,"{36 Meters}");
		setValue(p2, "1");

		setUnits(p2,"Qubits");

		res = runModel(true);
		assertUnequal("Variable Units Scaling 1", res.error, "none");

		setUnits(p1, "Meters")
		res = runModel(true);
		assertEqual("Variable Units Scaling 2", res.error, "none");

		setValue(p2, "[x]");
		res = runModel(true);
		assertUnequal("Variable Units Scaling 3", res.error, "none");
	}
}


function testClearModel(){

	test = "ClearModel";

	setupDummy();
	assertUnequal("Initial", findAll().length, 0);
	clearModel();
	assertEqual("Final", findAll().length, 0);

}

function testTimeShift(){
	var oldTest = test;
	test = "Time Shift";

	clearModel();

	var A = createPrimitive("A", "Stock", [200,200], [140,30]);
	var B = createPrimitive("B", "Stock", [400,200], [140,30]);
	var flow_A = createConnector("Flow A", "Flow", null, A);
	var flow_B = createConnector("Flow B", "Flow", null, B);

	setValue(A, 10)
	setValue(B, 10)
	setValue(flow_A, "0.1*[A]");
	setValue(flow_B, "0.1*[B]");


	var fA = createPrimitive("f A", "Folder", [200,150], [150,100]);
	var fB = createPrimitive("f B", "Folder", [200,150], [150,100]);

	setParent([A, flow_A], fA);
	setParent([B, flow_B], fB);

	setTimeLength(10);
	setTimeStep(1);
	setAlgorithm("RK1");

	var res = runModel(true);
	assertEqual("Base 1", res.value(A)[1], 11);
	assertEqual("Base 2", res.value(B)[1], 11);

	setFolderSolver(fA, {enabled:true, algorithm: "RK4", timeStep: 1});
	res = runModel(true);
	assertEqual("Switch 1", Math.round(res.value(A)[1]*1000), Math.round(11.051708*1000));
	assertEqual("Switch 2", res.value(B)[1], 11);

	setFolderSolver(fB, {enabled:true, algorithm: "RK1", timeStep: 2.5});
	res = runModel(true);
	assertEqual("Switch 3", Math.round(res.value(A)[1]*1000), Math.round(11.051708*1000));
	assertEqual("Switch 4", isUndefined(res.value(B)[1]), true);
	assertEqual("Switch 5", res.value(B)[3], 12.5);
	assertEqual("Switch 6", isUndefined(res.value(A)[3]), true);

	setFolderSolver(fA, {enabled:true, algorithm: "RK4", timeStep: 2.5});
	setFolderSolver(fB, {enabled:true, algorithm: "RK1", timeStep: 1});
	res = runModel(true);
	assertEqual("Switch 7", isUndefined(res.value(A)[1]), true);
	assertEqual("Switch 8", res.value(B)[1], 11);
	assertEqual("Switch 9", Math.round(res.value(A)[3]*1000), Math.round(12.8401699*1000));
	assertEqual("Switch 10", isUndefined(res.value(B)[3]), true);


	test = oldTest;
}

function testFolders(){
	test = "Folders";

	var s = createPrimitive("s", "Stock", [300,200], [140,30]);
	var f = createPrimitive("f", "Folder", [200,150], [150,100]);

	assertNull("Parent Null", getParent(s));
	setParent(s, f);
	assertEqual("Set Parent", getID(getParent(s)), getID(f));

	if(!(graph instanceof SimpleNode)){
		assertEqual("Default Folder", getCollapsed(f), false);
		collapseFolder(f);
		assertEqual("Collapse Folder", getCollapsed(f), true);
		expandFolder(f);
		assertEqual("Expand Folder", getCollapsed(f), false);
	}

	setParent(s, null);
	assertNull("Set Parent Null", getParent(s));

	assertEqual("Get Initial Type 1", getFolderType(f), "None");
	setFolderType(f, "Agent")
	assertEqual("Get Initial Type 2", getFolderType(f), "Agent");

	setFolderAgentParent(f, "abc");
	assertEqual("Agent Parent", getFolderAgentParent(f), "abc");

	clearModel();
}


function testCreate(){
	test = "Create";

	var x = createPrimitive("Test Stock", "Stock", [300,200], [140,30]);
	assertEqual("Name", getName(x), "Test Stock");
	assertEqual("Type", getType(x), "Stock");

	if(!(graph instanceof SimpleNode)){
		var p = getPosition(x);
		assertEqual("Position x", p[0], 300);
		assertEqual("Position y", p[1], 200);

		setPosition(x, [100, 400]);
		p = getPosition(x);
		assertEqual("Position x 2", p[0], 100);
		assertEqual("Position y 2", p[1], 400);
	}


	x = createPrimitive("Test Variable", "Variable", [400,200], [140,30]);
	assertEqual("Type", getType(x), "Variable");

	x = createConnector("Test Link", "Link", findName("Test Stock"), findName("Test Variable"));
	assertEqual("Type", getType(x), "Link");

}

function testFind(){
	test = "Find";

	setupComplexDummy();

	assertEqual("findType", findType("Stock").length, 4);
	assertEqual("findNote", findNote("foo").length, 0);
	setNote(findType("Stock"), "foo")
	assertEqual("findNote", findNote("foo").length, 4);

	assertEqual("findType", findType(["Stock","Variable"]).length, 6);
	assertEqual("findType", findType(["dsfsdf"]).length, 0);
	assertEqual("findType", findType("dsfsdf").length, 0);

	assertEqual("findAll", findAll().length, 10);

	assertNull("findName", findName("fdfsdgfg"));
	assertNotNull("findName", findName("y"));
	assertEqual("findName", findName("y").length, 2);
	assertEqual("findName", findName(["x","y","fvdf"]).length, 3);


	var id = getID(findName("x"));
	assertNotNull("findID", findID(id));
	assertNotNull("findID", findID([id]));
	assertNull("findID", findID("gfdgdfg"));


}

function setupDummy(){
	clearModel();
	var x = createPrimitive("x", "Stock", [200,200], [140,30]);
}

function setupComplexDummy(){
	clearModel();

	createPrimitive("My Converter", "Converter", [200,200], [140,30]);

	createPrimitive("x", "Stock", [200,200], [140,30]);
	createPrimitive("y", "Stock", [100,200], [140,30]);
	createPrimitive("My Stock", "Stock", [200,100], [140,30]);
	createPrimitive("y", "Stock", [200,100], [140,30]);

	createPrimitive("a", "Variable", [300,200], [140,30]);
	createPrimitive("b", "Variable", [300,100], [140,30]);

	createConnector("Link", "Link", findName("x"), findName("b"));
	createConnector("Link 2", "Link", findName("x"), findName("My Converter"));
	createConnector("My Flow", "Flow", findName("x"), findName("My Stock"));
}
