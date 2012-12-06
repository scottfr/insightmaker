"use strict";

function testTests(){
	test = "Test";
		
	// More flow scaling tests
		
	//testAgents();
	
	//killApp;
}

var test;
var errorCount = 0 ;
var testCount = 0;
function runTests(){

	testCount = 0;
	
	errorCount = 0;
	
	testTests();
	testUI();
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
	
	clearModel();
	
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

function testBothAgents(){
	setAlgorithm("RK1");
	console.log("---RK1---")
	testAgents();

	setAlgorithm("RK4");
	console.log("---RK4---")
	testAgents();
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
	
	var act = createPrimitive("Action", "Action", [100,100], [100,100]);
	setValue(act, "[My State] <- false")
	setTriggerType(act, "Timeout");
	setTriggerValue(act, 5);
	var act2 = createPrimitive("Action", "Action", [100,100], [100,100]);
	setTriggerType(act2, "Timeout");
	setTriggerValue(act2, 100);
	setValue(act2, "[My State 2] <- true")
	var l = createConnector("Link", "Link", act, s);
	var l2 = createConnector("Link", "Link", act2, s2);
	
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
	
	var t = createConnector("My Transition", "Transition", s, s2);
	var t2 = createConnector("My Transition", "Transition", s2, s);
	
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
	assertEqual("State Transition Val 1", res.value(t)[0], 2);
	assertEqual("State Transition Val 2", res.value(t2)[3], 3);
	setTriggerValue(t, "2");
	setTriggerValue(t2, "3");
	var res = runModel(true);
	assertEqual("Transition T 1.2", res.value(s)[0], 1);
	assertEqual("Transition T 2.2", res.value(s2)[0], 0);
	assertEqual("Transition T 3.2", res.value(s)[3], 0);
	assertEqual("Transition T 4.2", res.value(s2)[3], 1);
	assertEqual("Transition T 5.2", res.value(s)[6], 1);
	assertEqual("Transition T 6.2", res.value(s2)[6], 0);
	assertEqual("State Transition Val 1.2", res.value(t)[0], 2);
	assertEqual("State Transition Val 2.2", res.value(t2)[3], 3);
	
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
	setTriggerValue(t, "100");
	var res = runModel(true);
	assertEqual("Transition P 1.2", res.value(s)[0], 1);
	assertEqual("Transition P 2.2", res.value(s2)[0], 0);
	assertEqual("Transition P 3.2", res.value(s)[2], 0);
	assertEqual("Transition P 4.2", res.value(s2)[2], 1);
	assertEqual("Transition P 5.2", res.value(s)[10], 0);
	assertEqual("Transition P 6.2", res.value(s2)[10], 1);
	setTriggerValue(t, "-2");
	var res = runModel(true);
	assertEqual("Transition P 1.3", res.value(s)[0], 1);
	assertEqual("Transition P 2.3", res.value(s2)[0], 0);
	assertEqual("Transition P 3.2", res.value(s)[2], 1);
	assertEqual("Transition P 4.2", res.value(s2)[2], 0);
	
	
	setTriggerType(t, "Condition");
	setTriggerValue(t, "years=5");
	setTriggerType(t2, "Condition");
	setTriggerValue(t2, "years=7");
	res = runModel(true);
	assertEqual("Transition C 1", res.value(s)[0], 1);
	assertEqual("Transition C 2", res.value(s2)[0], 0);
	assertEqual("Transition C 3", res.value(s)[6], 0);
	assertEqual("Transition C 4", res.value(s2)[6], 1);
	assertEqual("Transition C 5", res.value(s)[7], 0);
	assertEqual("Transition C 6", res.value(s2)[7], 1);
	assertEqual("Transition C 7", res.value(s)[8], 1);
	assertEqual("Transition C 8", res.value(s2)[8], 0);
	
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
	
	setValue(v, "Count(FindState([Population], [State 1]))")
	setValue(v2, "Count(FindState([Population], [State 2]))")

	res = runModel(true);
	assertEqual("Pop 3", res.value(v)[0], 10);
	assertEqual("Pop 4", res.value(v2)[0], 0);
	assertEqual("Pop 5", res.value(v)[8], 0);
	assertEqual("Pop 6", res.value(v2)[8], 10);
	
	setValue(v, "Count(FindNotState([Population], [State 1]))")
	setValue(v2, "Count(FindNotState([Population], [State 2]))")
	
	setTriggerType(t2, "Timeout");
	setTriggerValue(t2, "5");
	setTriggerType(t2, "Condition");
	setTriggerValue(t2, "index([self])=1 and years=7");

	res = runModel(true);
	assertEqual("Pop 7", res.value(v)[0], 0);
	assertEqual("Pop 8", res.value(v2)[0], 10);
	assertEqual("Pop 9", res.value(v)[8], 9);
	assertEqual("Pop 10", res.value(v2)[8], 1);
	
	var v3 = createPrimitive("Var", "Variable", [200,150], [150,100]);
	setParent(v3, f);
	setValue(v, "Min(Value([Population], [Var]))")
	setValue(v2, "Max(Value([Population], [Var]))")
	
	var v4 = createPrimitive("Outside Var", "Variable", [200,150], [150,100]);
	setParent(v4, f);
	setValue(v4, "IfThenElse(years<5, 1, 0)");
	
	createConnector("Link", "Link", v4, v3);
	setValue(v3, "[Outside Var]*2");
	
	res = runModel(true);
	assertEqual("Pop 10.1", res.value(v)[0], 2);
	assertEqual("Pop 10.2", res.value(v)[8], 0);
	
	setMacros("counter <- 0");
	
	var act = createPrimitive("Action", "Action", [200,150], [150, 100]);
	setTriggerType(act, "Condition");
	setTriggerValue(act, "true");
	setValue(act, "Counter <- counter + 1");
	setValue(v3, "counter*3")
	
	res = runModel(true);
	assertEqual("Pop 10.3", res.value(v)[0], 0);
	assertEqual("Pop 10.4", res.value(v)[8], 24);
	setTriggerValue(act, "false");
	res = runModel(true);
	assertEqual("Pop 10.5", res.value(v)[0], 0);
	assertEqual("Pop 10.6", res.value(v)[8], 0);
	
	setTriggerType(act, "Probability");
	setTriggerValue(act, "1.1");
	res = runModel(true);
	assertEqual("Pop 10.7", res.value(v)[0], 0);
	assertEqual("Pop 10.8", res.value(v)[8], 24);
	setTriggerValue(act, "-.4");
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
	setTriggerValue(act, "0");
	setValue(act, "counter <- counter+1\\nresetTimer([Self])")
	res = runModel(true);
	assertEqual("Pop 10.15", res.value(v)[0], 0);
	assertEqual("Pop 10.16", res.value(v)[8], 24);
	
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
	
	setValue(v3, "index([self])");
	
	
	res = runModel(true);
	assertEqual("Pop 11", res.value(v)[0], 1);
	assertEqual("Pop 12", res.value(v2)[8], 10);
	
	setValue(v, "PopulationSize([Population])")
	setValue(v2, "Count(Value([Population], [Var]))")
	res = runModel(true);
	assertEqual("Pop 12.1", res.value(v)[0], res.value(v2)[0]);
	assertEqual("Pop 12.2", res.value(v)[8], res.value(v2)[8]);
	
	setValue(v, "Count(Join(FindState([Population], [State 1]), FindState([Population], [State 2])))");
	setValue(v2, "Min(Value(Join(FindState([Population], [State 1]), FindState([Population], [State 2])), [Var]))");
	res = runModel(true);
	assertEqual("Pop 13", res.value(v)[0], 10);
	assertEqual("Pop 14", res.value(v2)[8], 1);
	
	setValue(v, "Count(Join(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var]) <=3)))");
	setValue(v2, "Count(Union(Filter(FindAll([Population]), value(x, [Var])>8), Filter(FindAll([Population]), value(x, [Var]) <=3)))");
	res = runModel(true);
	assertEqual("Pop 14.1", res.value(v)[0], 5);
	assertEqual("Pop 14.2", res.value(v2)[8], 5);
	
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
	
	setValue(v, "width([Population])")
	setValue(v2, "height([Population])")
	res = runModel(true);
	assertEqual("Pop 14.9", res.value(v)[0], 200);
	assertEqual("Pop 14.10", res.value(v2)[8], 100);
	
	
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
	
	setAgentPlacementFunction(pop, "<<index([Self])*10,index([Self])*20>>");
	setValue(v, "Select(Location(FindIndex([Population], 1)),1)");
	setValue(v2, "Select(Location(FindIndex([Population], 2)),2)");
	res = runModel(true);
	assertEqual("Custom Loc 21", res.value(v)[0], 10);
	assertEqual("Custom Loc 22", res.value(v2)[8], 40);
	
	
	var mover = createPrimitive("Mover", "Action", [200,150], [150,100]);
	setParent(mover, f);
	setTriggerType(mover, "Condition");
	setTriggerValue(mover, "true")
	setValue(mover, "move([Self], <<10,20>>)");
	res = runModel(true);
	assertEqual("Custom Move 22", res.value(v)[2], 10+2*10);
	assertEqual("Custom Move 23", res.value(v2)[9], 40+9*20);
	
	setGeometryWrap(pop, true);
	res = runModel(true);
	assertEqual("Custom Move 24", res.value(v)[2], (10+2*10) % 200);
	assertEqual("Custom Move 25", res.value(v2)[9], (40+9*20) % 100);
	
	createConnector("Link","Link", pop, mover);
	setAgentPlacementFunction(pop, "<<index([Self])*10, 1>>");
	
	setValue(mover, "moveTowards([Self], findIndex([Population], 1), 1)");
	setValue(v2, "Select(Location(FindIndex([Population], 2)),1)")
	res = runModel(true);
	assertEqual("Custom Move 26", res.value(v)[2], 10);
	assertEqual("Custom Move 27", res.value(v)[9], 10);
	assertEqual("Custom Move 27.1", res.value(v2)[2], 20-2*1);
	assertEqual("Custom Move 27.2", res.value(v2)[9], 20-9*1);

	setValue(mover, "1");
		
	
	setAgentNetwork(pop, "Custom Function");
	setAgentNetworkFunction(pop, "ifThenElse(index(a)=1 || index(b)=1, true, false)");
	setValue(v, "count(connected(findIndex([Population], 1)))")
	setValue(v2, "count(connected(findIndex([Population], 3)))")
	res = runModel(true);
	assertEqual("Custom Network 28", res.value(v)[0], 9);
	assertEqual("Custom Network 29", res.value(v2)[8], 1);
	
	
	setValue(mover, "ifthenelse( index([self])==3, unconnect([self], findIndex([population], 1)), 0)");
	res = runModel(true);
	assertEqual("Custom Network 30", res.value(v)[0], 9); 
	assertEqual("Custom Network 31", res.value(v2)[0], 1);
	assertEqual("Custom Network 32", res.value(v)[8], 8);
	assertEqual("Custom Network 33", res.value(v2)[8], 0);
	
	setValue(mover, "ifthenelse(index([self])==3, connect([self], findIndex([population], 2)),0)");
	res = runModel(true);
	assertEqual("Custom Network 34", res.value(v)[0], 9);
	assertEqual("Custom Network 35", res.value(v2)[0], 1);
	assertEqual("Custom Network 36", res.value(v)[8], 9);
	assertEqual("Custom Network 37", res.value(v2)[8], 2);
	

	setTriggerType(mover, "Condition");
	setTriggerValue(mover, "((index([self])==3 && years==2) || (index([self])==5 && years==5))");
	setValue(mover, "remove([self])");
	setValue(v, "populationSize([Population])")
	setValue(v2, "count(connected(findIndex([Population], 1)))")
	res = runModel(true);
	assertEqual("Add/Remove 1", res.value(v)[0], 10);
	assertEqual("Add/Remove 2", res.value(v)[4], 9);
	assertEqual("Add/Remove 3", res.value(v)[8], 8);
	
	setTriggerValue(mover, "((index([self])==3 && years==2) || (index([self])==5 && years==5))");
	setValue(mover, "add([Population])");
	setValue(v, "populationSize([Population])")
	setValue(v2, "count(connected(findIndex([Population], 3)))")
	res = runModel(true);
	assertEqual("Add/Remove 5", res.value(v)[0], 10);
	assertEqual("Add/Remove 6", res.value(v)[4], 11);
	assertEqual("Add/Remove 7", res.value(v)[8], 12);
	
	setTriggerValue(mover, "((index([self])==3 && years==2) || (index([self])==5 && years==5))");
	setValue(mover, "add([Population], [Self])");
	setValue(v, "populationSize([Population])")
	res = runModel(true);
	assertEqual("Add/Remove 8", res.value(v)[0], 10);
	assertEqual("Add/Remove 9", res.value(v)[4], 11);
	assertEqual("Add/Remove 10", res.value(v)[8], 12);
	
	setAgentPlacement(pop, "Random");
	
	setPopulationSize(pop, 1);
	setTriggerValue(mover, "years == 5 ");
	setValue(mover, "add([Population])");
	setValue(v, "populationSize([Population])")
	setValue(v2, "IfThenElse(populationsize([Population])==2, Select(Location(FindIndex([Population], 1)),2)==Select(Location(FindIndex([Population], 2)),2), -1)")
	res = runModel(true);
	assertEqual("Add/Remove 11", res.value(v)[0], 1);
	assertEqual("Add/Remove 12", res.value(v)[8], 2);
	assertEqual("Add/Remove 13", res.value(v2)[0], -1);
	assertEqual("Add/Remove 14", res.value(v2)[7], 0); //not clone
	
	setPopulationSize(pop, 1);
	setValue(mover, "add([Population], [Self])");
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

	setValue(v2, "max(Value([Population],[Var]))")
	res = runModel(true);
	assertEqual("Additional Add 5", res.value(v2)[0], 5);
	assertEqual("Additional Add 6", res.value(v2)[5], 5);
	assertEqual("Additional Add 7", res.value(v2)[6], 15);
	assertEqual("Additional Add 8", res.value(v2)[7], 15);
	
	
	clearModel();
	
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
	assertEqual("Set NonNegative Flow", getNonNegative(f), true);
	setNonNegative(f, false);
	assertEqual("Set NonNegative Flow", getNonNegative(f), false);
	
	var s = findName("My Stock");
	setNonNegative(s, true);
	assertEqual("Set NonNegative Stock", getNonNegative(s), true);
	setNonNegative(s, false);
	assertEqual("Set NonNegative Stock", getNonNegative(s), false);
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
	setValue(state,"abc");
	assertEqual("State Set Value", getValue(state), "abc");
	
	var transition = createConnector("My Transition", "Transition", state, null);
	setValue(transition,"abc1");
	assertEqual("Transition Set Value", getValue(transition), "abc1");
	setTriggerValue(transition,"abc12");
	assertEqual("Transition Set Value 2", getTriggerValue(transition), "abc12");
	assertEqual("Transition Get Trigger 1", getTriggerType(transition), "Timeout");
	setTriggerType(transition,"Condition");
	assertEqual("Transition Get Trigger 2", getTriggerType(transition), "Condition");
	
	var action = createPrimitive("My Action", "Action", [100,60],[100,100]);
	setValue(action,"abc1");
	assertEqual("Action Set Value", getValue(action), "abc1");
	setTriggerValue(action,"abc123");
	assertEqual("Action Set Value 2", getTriggerValue(action), "abc123");
	assertEqual("Action Set Value 3", getValue(action), "abc1");
	assertEqual("Action Get Trigger 1", getTriggerType(action), "Condition");
	setTriggerType(action,"Timeout");
	assertEqual("Action Get Trigger 2", getTriggerType(action), "Timeout");
	
	
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
		assertEqual("Flow Start", Math.round(res.value(f)[0]*1000), 10*1000);
		if(algorithms[i]=="RK4"){
			assertEqual("Stock End", Math.round(res.value(s)[10]*100), Math.round(36.47*100));
		}else{
			assertEqual("Stock End", Math.round(res.value(s)[10]*100), Math.round(34.87*100));
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
			
			setValue(f, "years");
			setUnits(p, "euros/years");
			setValue(p, "[My Flow]");
			res = runModel(true);
			assertEqual("More Flow Scaling 3", res.value(p)[20], 20);
		
			clearModel();
			
			var p = createPrimitive("My Variable", "Variable", [100, 100], [140, 50]);
			var f = createConnector("My Flow", "Flow", null, null);
			var l = createConnector("link", "Link", f, p);

			setUnits(f, "unitless");
			setUnits(p, "unitless");
	
	
			setNonNegative(f, false);
	
			setValue(f, "10-years");
			setValue(p, "[My Flow]");
			res = runModel(true);
			assertEqual("PositiveOnly with Units", res.value(p)[20], -10);
		
			clearModel();
		}
		
		testAgents();
		
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
		
		assertEqual("SS 1", res.value(s)[2], 0);
		assertEqual("SS 2", res.value(s)[4], 0);
		assertEqual("SS 3", res.value(s)[12], 8);
		assertEqual("SS 4", res.value(p)[2], 2);
		assertEqual("SS 5", res.value(p)[12], 12);
		
		setDelay(s, "{5 years}");
		
		res = runModel(true);
		
		assertEqual("SS Units 1", res.value(s)[2], 0);
		assertEqual("SS Units 2", res.value(s)[4], 0);
		assertEqual("SS Units 3", res.value(s)[12], 8);
		assertEqual("SS Units 4", res.value(p)[2], 2);
		assertEqual("SS Units 5", res.value(p)[12], 12);
		
		setDelay(s, "{365 days}*5");
		
		res = runModel(true);
		
		assertEqual("SS Units 6", res.value(s)[2], 0);
		assertEqual("SS Units 7", res.value(s)[4], 0);
		assertEqual("SS Units 8", res.value(s)[12], 8);
		assertEqual("SS Units 9", res.value(p)[2], 2);
		assertEqual("SS Units 10", res.value(p)[12], 12);
		
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
		assertEqual("Flow Stock Value 5", res.value(s5)[2], 5*365*2);
		
		
		clearModel()
		
		
		
		// Test non-negative stocks
		
		s = createPrimitive("My Stock", "Stock", [100, 100], [140, 50]);
		s2 = createPrimitive("My Stock 2", "Stock", [100, 100], [140, 50]);
		f = createConnector("My Flow", "Flow", s, s2);
		
		setValue(s, 10);
		setValue(s2, 0);
		setValue(f, 1);
		res = runModel(true);
		assertEqual("NonNegative Stock 1", res.value(s)[20], -10);
		assertEqual("NonNegative Stock 2", res.value(s2)[20], 20);
		setNonNegative(s, true);
		res = runModel(true);
		assertEqual("NonNegative Stock 3", res.value(s)[20], 0);
		assertEqual("NonNegative Stock 4", res.value(s2)[20], 10);
		
		clearModel()
		
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
			assertEqual("NonNegative Flow 1 - stock", res.value(s)[1], 0);
		}
		assertEqual("NonNegative Flow 2", Math.round(res.value(f)[0]*1000), -10*1000);
		setNonNegative(f, true);
		res = runModel(true);
		assertEqual("NonNegative Flow 3 -stock", res.value(s)[2], 10);
		assertEqual("NonNegative Flow 4", res.value(f)[1], 0);
		
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
		


		//Test stock initial values
		clearModel()
		var p  = createPrimitive("My Stock 1", "Stock",[0,0],[100,100]);
		var p2  = createPrimitive("My Stock 2", "Stock",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		setValue(p,"10");
		setValue(p2, "[My Stock 1]");
		res = runModel(true);
		assertEqual("Stock Init 1", res.value(p)[0],10);
		assertEqual("Stock Init 2", res.value(p2)[0], 10)
		
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
		
		//Test Delay function
		clearModel()
		var p  = createPrimitive("My Param", "Variable",[0,0],[100,100]);
		var p2  = createPrimitive("Delayed", "Variable",[0,0],[100,100]);
		var l = createConnector("Link","Link",p,p2);
		setValue(p,"Years");
		setValue(p2, "Delay(<My Param>, 5, -3)");
		res = runModel(true);
		assertEqual("Initial Value", res.value(p2)[3],-3);
		assertEqual("End Delay", res.value(p)[res.periods-6], res.lastValue(p2));
		
		setValue(p2, "Delay(<My Param>, 0)");
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

		//Test Staircase function
		setValue(p, "Step(10,3)");
		res = runModel(true);
		assertEqual("Step 1",res.value(p)[5], 0);
		assertEqual("Step 2", res.value(p)[12], 3);
		assertEqual("Step 3", res.value(p)[16], 3);

		//Test Mean, Median, Max, Min, StdDev functions
		clearModel()
		p  = createPrimitive("x", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("y", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "(Years-60)^2");
		setValue(p2, "PastMean(<x>)");
		res = runModel(true);
		assertEqual("Mean",res.lastValue(p2),950);
		setValue(p2, "PastMedian(<x>)");
		res = runModel(true);
		assertEqual("Median",Math.round(res.lastValue(p2)),625);
		setValue(p2, "Median(PastValues([x]))");
		res = runModel(true);
		assertEqual("Median 2",Math.round(res.lastValue(p2)),625);
		setValue(p2, "PastStdDev(<x>)");
		res = runModel(true);
		assertEqual("StdDev", Math.round(res.lastValue(p2)*10), Math.round(962.8*10));
		setValue(p2, "PastMax(<x>)");
		res = runModel(true);
		assertEqual("Max", Math.round(res.lastValue(p2)), 3600);
		setValue(p2, "PastMin([x])");
		res = runModel(true);
		assertEqual("Min", res.lastValue(p2),0);
		
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
		setValue(p2, "Smooth(<My Param>,20, 5)");
		res = runModel(true);
		assertEqual("Smooth 1",Math.round(res.value(p2)[0]*100),500);
		assertEqual("Smooth 2", Math.round(res.value(p2)[40]*100), Math.round(0.6763*100));
		assertEqual("Smooth 3", Math.round(res.value(p2)[59]*10),21);
		
		//Test ExpDelay function
		clearModel()
		p  = createPrimitive("x", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("ExpValue", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p,p2);
		setValue(p, "Staircase(20)");
		setValue(p2, "Delay3(<x>,10,2)");
		res = runModel(true);
		if(algorithms[i]=="RK1"){
			assertEqual("ExpDelay 1", Math.round(res.value(p2)[3]*100), Math.round(1.946*100));
			assertEqual("ExpDelay 0", Math.round(res.value(p2)[2]*100), Math.round(2*100));
			assertEqual("ExpDelay 2",Math.round( res.value(p2)[26]*100), Math.round(0.269*100));
		}else if(algorithms[i]=="RK4"){
			assertEqual("ExpDelay 1", Math.floor(res.value(p2)[3]*10), Math.floor(1.946*10));
		}
		
		//Test Rand Functions
		clearModel()
		p  = createPrimitive("RandParam", "Variable",[0,0],[100,100]);
		p2  = createPrimitive("HalfRand", "Variable",[0,0],[100,100]);
		l = createConnector("Link","Link",p, p2);
		setValue(p, "Rand");
		setValue(p2, "[RandParam]/2");
		res = runModel(true);
		assertEqual("RK1 Cached Value", Math.round(res.lastValue(p)*10000), Math.round(res.lastValue(p2)*2*10000));

		
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
		setValue(p2, "Delay(<x>, {3 Years} )");
		res = runModel(true);
		assertEqual("Time Units Delay 1", Math.round(res.value(p2)[6]*10000), Math.round(3*10000));
		setValue(p2, "Delay(<x>, {48 Months})");
		res = runModel(true);
		assertEqual("Time Units Delay 2", Math.round(res.value(p2)[6]*10000), Math.round(2*10000));
		setValue(p2, "PastMean(<x>, {48 Months})");
		res = runModel(true);
		assertEqual("Time Units Mean 1", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3+2)/5*10000));
		setValue(p2, "Mean(PastValues([x], {48 Months}))");
		res = runModel(true);
		assertEqual("Time Units Mean 2", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3+2)/5*10000));
		setValue(p2, "PastMean(<x>, {3 Years})");
		res = runModel(true);
		assertEqual("Time Units Mean 3", Math.round(res.value(p2)[6]*10000), Math.round((6+5+4+3)/4*10000));
		setValue(p2, "PastCorrelation([x],[x])");
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

function testFolders(){
	test = "Folders";
	
	var s = createPrimitive("s", "Stock", [300,200], [140,30]);
	var f = createPrimitive("f", "Folder", [200,150], [150,100]);

	assertNull("Parent Null", getParent(s));
	setParent(s, f);
	assertEqual("Set Parent", getID(getParent(s)), getID(f));
	assertEqual("Default Folder", getCollapsed(f), false);
	collapseFolder(f);
	assertEqual("Collapse Folder", getCollapsed(f), true);
	expandFolder(f);
	assertEqual("Expand Folder", getCollapsed(f), false);
	setParent(s, null);
	assertNull("Set Parent Null", getParent(s));

	assertEqual("Get Initial Type 1", getFolderType(f), "None");
	setFolderType(f, "Agent")
	assertEqual("Get Initial Type 2", getFolderType(f), "Agent");
	
	
	clearModel();
}


function testCreate(){
	test = "Create";
	
	var x = createPrimitive("Test Stock", "Stock", [300,200], [140,30]);
	assertEqual("Name", getName(x), "Test Stock");
	assertEqual("Type", getType(x), "Stock");

	var p = getPosition(x);
	assertEqual("Position x", p[0], 300);
	assertEqual("Position y", p[1], 200);
	
	setPosition(x, [100, 400]);
	p = getPosition(x);
	assertEqual("Position x 2", p[0], 100);
	assertEqual("Position y 2", p[1], 400);
	
	x = createPrimitive("Test Variable", "Variable", [400,200], [140,30]);
	assertEqual("Type", getType(x), "Variable");
	
	x = createConnector("Test Link", "Link", findName("Test Stock"), findName("Test Variable"));
	assertEqual("Type", getType(x), "Link");
	
}

function testFind(){
	test = "Find";
	
	setupComplexDummy();
	
	assertEqual("findType", findType("Stock").length, 4);
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
