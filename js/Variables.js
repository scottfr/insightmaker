"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var graph;
var primitiveBank = {};
var defaultSolver = '{"enabled": false, "algorithm": "RK1", "timeStep": 1}';

var doc = document.implementation.createDocument("","",null);

primitiveBank.text = doc.createElement('Text');
primitiveBank.text.setAttribute('name', getText('Text Area'));
primitiveBank.text.setAttribute('LabelPosition', "Middle");

primitiveBank.folder = doc.createElement('Folder');
primitiveBank.folder.setAttribute('name', getText('New Folder'));
primitiveBank.folder.setAttribute('Note', '');
primitiveBank.folder.setAttribute('Type', 'None');
primitiveBank.folder.setAttribute('Solver', defaultSolver);
primitiveBank.folder.setAttribute('Image', 'None');
primitiveBank.folder.setAttribute('FlipHorizontal', false);
primitiveBank.folder.setAttribute('FlipVertical', false);
primitiveBank.folder.setAttribute('LabelPosition', "Middle");
primitiveBank.folder.setAttribute('AgentBase', "");

primitiveBank.ghost = doc.createElement('Ghost');
primitiveBank.ghost.setAttribute('Source', '');

primitiveBank.picture = doc.createElement('Picture');
primitiveBank.picture.setAttribute('name', '');
primitiveBank.picture.setAttribute('Note', '');
primitiveBank.picture.setAttribute('Image', 'Growth');
primitiveBank.picture.setAttribute('FlipHorizontal', false);
primitiveBank.picture.setAttribute('FlipVertical', false);
primitiveBank.picture.setAttribute('LabelPosition', "Bottom");

primitiveBank.display = doc.createElement('Display');
primitiveBank.display.setAttribute('name', getText('Default Display'));
primitiveBank.display.setAttribute('Note', '');
primitiveBank.display.setAttribute('Type', 'Time Series');
primitiveBank.display.setAttribute('xAxis', getText("Time") + ' (%u)');
primitiveBank.display.setAttribute('yAxis', '');
primitiveBank.display.setAttribute('yAxis2', '');
primitiveBank.display.setAttribute('showMarkers', false);
primitiveBank.display.setAttribute('showLines', true);
primitiveBank.display.setAttribute('showArea', false);
primitiveBank.display.setAttribute('ThreeDimensional', false);
primitiveBank.display.setAttribute('Primitives', '');
primitiveBank.display.setAttribute('Primitives2', '');
primitiveBank.display.setAttribute('AutoAddPrimitives', false);
primitiveBank.display.setAttribute('ScatterplotOrder', 'X Primitive, Y Primitive');
primitiveBank.display.setAttribute('Image', 'Display');
primitiveBank.display.setAttribute('FlipHorizontal', false);
primitiveBank.display.setAttribute('FlipVertical', false);
primitiveBank.display.setAttribute('LabelPosition', "Bottom");
primitiveBank.display.setAttribute('legendPosition', "Automatic");

function setValuedProperties(cell) {
	cell.setAttribute('Units', "Unitless")
	cell.setAttribute('MaxConstraintUsed', false)
	cell.setAttribute('MinConstraintUsed', false)
	cell.setAttribute('MaxConstraint', '100');
	cell.setAttribute('MinConstraint', '0');
	cell.setAttribute('ShowSlider', false);
	cell.setAttribute('SliderMax', 100);
	cell.setAttribute('SliderMin', 0);
	cell.setAttribute('SliderStep', '');
}

primitiveBank.stock = doc.createElement('Stock');
primitiveBank.stock.setAttribute('name', getText('New Stock'));
primitiveBank.stock.setAttribute('Note', '');
primitiveBank.stock.setAttribute('InitialValue', '0');
primitiveBank.stock.setAttribute('StockMode', 'Store');
primitiveBank.stock.setAttribute('Delay', '10');
primitiveBank.stock.setAttribute('Volume', '100');
primitiveBank.stock.setAttribute('NonNegative', false);
setValuedProperties(primitiveBank.stock);
primitiveBank.stock.setAttribute('Image', 'None');
primitiveBank.stock.setAttribute('FlipHorizontal', false);
primitiveBank.stock.setAttribute('FlipVertical', false);
primitiveBank.stock.setAttribute('LabelPosition', "Middle");

primitiveBank.state = doc.createElement('State');
primitiveBank.state.setAttribute('name', getText('New State'));
primitiveBank.state.setAttribute('Note', '');
primitiveBank.state.setAttribute('Active', 'false');
primitiveBank.state.setAttribute('Residency', '0');
primitiveBank.state.setAttribute('Image', 'None');
primitiveBank.state.setAttribute('FlipHorizontal', false);
primitiveBank.state.setAttribute('FlipVertical', false);
primitiveBank.state.setAttribute('LabelPosition', "Middle");

primitiveBank.transition = doc.createElement('Transition');
primitiveBank.transition.setAttribute('name', getText('Transition'));
primitiveBank.transition.setAttribute('Note', '');
primitiveBank.transition.setAttribute('Trigger', 'Timeout');
primitiveBank.transition.setAttribute('Value', '1');
primitiveBank.transition.setAttribute('Repeat', false);
primitiveBank.transition.setAttribute('Recalculate', false);
setValuedProperties(primitiveBank.transition);

primitiveBank.action = doc.createElement('Action');
primitiveBank.action.setAttribute('name', getText('New Action'));
primitiveBank.action.setAttribute('Note', '');
primitiveBank.action.setAttribute('Trigger', 'Probability');
primitiveBank.action.setAttribute('Value', '0.5');
primitiveBank.action.setAttribute('Repeat', true);
primitiveBank.action.setAttribute('Recalculate', false);
primitiveBank.action.setAttribute('Action', 'Self.Move({Rand(), Rand()})');

primitiveBank.agents = doc.createElement('Agents');
primitiveBank.agents.setAttribute('name', getText('New Agent Population'));
primitiveBank.agents.setAttribute('Note', '');
primitiveBank.agents.setAttribute('Size', 100);
primitiveBank.agents.setAttribute('GeoWrap', false);
primitiveBank.agents.setAttribute('GeoDimUnits', 'Unitless');
primitiveBank.agents.setAttribute('GeoWidth', 200);
primitiveBank.agents.setAttribute('GeoHeight', 100);
primitiveBank.agents.setAttribute('Placement', "Random");
primitiveBank.agents.setAttribute('PlacementFunction', "{Rand()*Width(Self), Rand()*Height(Self)}");
primitiveBank.agents.setAttribute('Network', "None");
primitiveBank.agents.setAttribute('NetworkFunction', "RandBoolean(0.02)");
primitiveBank.agents.setAttribute('Agent', '');
primitiveBank.agents.setAttribute('Image', 'None');
primitiveBank.agents.setAttribute('FlipHorizontal', false);
primitiveBank.agents.setAttribute('FlipVertical', false);
primitiveBank.agents.setAttribute('LabelPosition', "Middle");
primitiveBank.agents.setAttribute('ShowSlider', false);
primitiveBank.agents.setAttribute('SliderMax', 100);
primitiveBank.agents.setAttribute('SliderMin', 0);
primitiveBank.agents.setAttribute('SliderStep', 1);

primitiveBank.variable = doc.createElement('Variable');
primitiveBank.variable.setAttribute('name', getText('New Variable'));
primitiveBank.variable.setAttribute('Note', '');
primitiveBank.variable.setAttribute('Equation', '0');
setValuedProperties(primitiveBank.variable);
primitiveBank.variable.setAttribute('Image', 'None');
primitiveBank.variable.setAttribute('FlipHorizontal', false);
primitiveBank.variable.setAttribute('FlipVertical', false);
primitiveBank.variable.setAttribute('LabelPosition', "Middle");

primitiveBank.button = doc.createElement('Button');
primitiveBank.button.setAttribute('name', getText('New Button'));
primitiveBank.button.setAttribute('Note', '');
primitiveBank.button.setAttribute('Function', 'showMessage("Button action triggered!\\n\\nIf you want to edit this Action, click on the button while holding down the Shift key on your keyboard.")');
primitiveBank.button.setAttribute('Image', 'None');
primitiveBank.button.setAttribute('FlipHorizontal', false);
primitiveBank.button.setAttribute('FlipVertical', false);
primitiveBank.button.setAttribute('LabelPosition', "Middle");

primitiveBank.converter = doc.createElement('Converter');
primitiveBank.converter.setAttribute('name', getText('New Converter'));
primitiveBank.converter.setAttribute('Note', '');
primitiveBank.converter.setAttribute('Source', 'Time');
primitiveBank.converter.setAttribute('Data', '0,0; 1,1; 2,4; 3,9');
primitiveBank.converter.setAttribute('Interpolation', 'Linear');
setValuedProperties(primitiveBank.converter);
primitiveBank.converter.setAttribute('Image', 'None');
primitiveBank.converter.setAttribute('FlipHorizontal', false);
primitiveBank.converter.setAttribute('FlipVertical', false);
primitiveBank.converter.setAttribute('LabelPosition', "Middle");

primitiveBank.flow = doc.createElement('Flow');
primitiveBank.flow.setAttribute('name', getText('Flow'));
primitiveBank.flow.setAttribute('Note', '');
primitiveBank.flow.setAttribute('FlowRate', '0');
primitiveBank.flow.setAttribute('OnlyPositive', true);
primitiveBank.flow.setAttribute('TimeIndependent', false);
setValuedProperties(primitiveBank.flow);

primitiveBank.link = doc.createElement('Link');
primitiveBank.link.setAttribute('name', getText('Link'));
primitiveBank.link.setAttribute('Note', '');
primitiveBank.link.setAttribute('BiDirectional', false);

primitiveBank.setting = doc.createElement('Setting');
primitiveBank.setting.setAttribute('Note', '');
primitiveBank.setting.setAttribute('Version', '36');
primitiveBank.setting.setAttribute('Throttle', '1');
primitiveBank.setting.setAttribute('TimeLength', '100');
primitiveBank.setting.setAttribute('TimeStart', '0');
primitiveBank.setting.setAttribute('TimeStep', '1');
primitiveBank.setting.setAttribute('TimeUnits', 'Years');
primitiveBank.setting.setAttribute('Units', "");
primitiveBank.setting.setAttribute("SolutionAlgorithm", "RK1");
primitiveBank.setting.setAttribute("BackgroundColor", "white");
primitiveBank.setting.setAttribute("Macros", "");
primitiveBank.setting.setAttribute("SensitivityPrimitives", "");
primitiveBank.setting.setAttribute("SensitivityRuns", 50);
primitiveBank.setting.setAttribute("SensitivityBounds", "50, 80, 95, 100");
primitiveBank.setting.setAttribute("SensitivityShowRuns", "false");
primitiveBank.setting.setAttribute("StrictUnits", "true");
primitiveBank.setting.setAttribute("StrictLinks", "true");
primitiveBank.setting.setAttribute("StrictAgentResolution", "true");
primitiveBank.setting.setAttribute("StyleSheet", "{}");


var blankGraphTemplate = "<mxGraphModel>\n  <root>\n    <mxCell id=\"0\"\/>\n    <mxCell id=\"1\" parent=\"0\"\/>\n    <Folder name=\"Step 2. Share your Insights\" Note=\"\" Type=\"None\" Solver=\"{&quot;enabled&quot;: false, &quot;algorithm&quot;: &quot;RK1&quot;, &quot;timeStep&quot;: 1}\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Top\" AgentBase=\"\" id=\"44\">\n      <mxCell style=\"folder;dashed=0;fontSize=18;fontFamily=Verdana;fontStyle=1;rounded=0;strokeColor=#C0C0C0;strokeWidth=1;30=10;fillColor=#FFFFFF\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"710\" y=\"90\" width=\"320\" height=\"522\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Folder>\n    <Setting Note=\"\" Version=\"34\" TimeLength=\"20\" TimeStart=\"0\" TimeStep=\"1\" TimeUnits=\"Years\" StrictUnits=\"true\" StrictLinks=\"true\" StrictAgentResolution=\"true\" Units=\"\" HiddenUIGroups=\"Validation,User Interface\" SolutionAlgorithm=\"RK1\" BackgroundColor=\"white\" Throttle=\"1\" Macros=\"\" SensitivityPrimitives=\"\" SensitivityRuns=\"50\" SensitivityBounds=\"50, 80, 95, 100\" SensitivityShowRuns=\"false\" id=\"2\">\n      <mxCell parent=\"1\" vertex=\"1\" visible=\"0\">\n        <mxGeometry x=\"20\" y=\"20\" width=\"80\" height=\"40\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Setting>\n    <Display name=\"Default Display\" Note=\"\" Type=\"Time Series\" xAxis=\"Time (%u)\" yAxis=\"%o\" ThreeDimensional=\"false\" Primitives=\"35\" AutoAddPrimitives=\"true\" ScatterplotOrder=\"X Primitive, Y Primitive\" Image=\"Display\" yAxis2=\"\" Primitives2=\"\" showMarkers=\"false\" showLines=\"true\" showArea=\"false\" legendPosition=\"None\" id=\"3\">\n      <mxCell style=\"roundImage;image=\/builder\/images\/DisplayFull.png;\" parent=\"1\" vertex=\"1\" visible=\"0\">\n        <mxGeometry x=\"50\" y=\"20\" width=\"64\" height=\"64\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Display>\n    <Button name=\"Click me to Clear this Demo Model\" Note=\"\" Function=\"clearModel()\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" id=\"23\">\n      <mxCell style=\"button;fontSize=18;fillColor=#FFFF99;strokeColor=#FF9900;fontColor=#FF6600;fontStyle=1;fontFamily=Verdana\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"510\" y=\"12\" width=\"520\" height=\"58\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Button>\n    <Picture name=\"\" Note=\"\" Image=\"List\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Bottom\" id=\"46\">\n      <mxCell style=\"picture;image=https:\/\/insightmaker.com\/builder\/images\/SD\/List.png;imageFlipV=0;imageFlipH=0;shape=image\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"30\" y=\"10\" width=\"64\" height=\"64\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Text name=\"Insight Maker Basics\" LabelPosition=\"Middle\" id=\"47\">\n      <mxCell style=\"text;fontStyle=1;fontFamily=Helvetica\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"100\" y=\"17\" width=\"320\" height=\"50\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Picture name=\"\" Note=\"\" Image=\"Network\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Bottom\" id=\"48\">\n      <mxCell style=\"picture;image=https:\/\/insightmaker.com\/builder\/images\/SD\/Network.png;imageFlipV=0;imageFlipH=0;shape=image\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"950\" y=\"492\" width=\"132\" height=\"132\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Text name=\"&lt;i style=&quot;float:left;margin-right:8px;margin-bottom:5px;color:lightgrey&quot; class=&quot;fa fa-3x fa-share-alt&quot;&gt;&lt;\/i&gt; Insight Maker models are web pages, so sharing them is as easy as emailing a link or posting it to Twitter or Facebook. If you have your own web page or blog, you can embed Insight Maker models right in your page.&#xa;&lt;hr style=&quot;width:50%; margin-top:16px;margin-bottom:16px&quot;&gt;&lt;i style=&quot;float:left;margin-right:10px;margin-bottom:5px;color:lightgrey&quot; class=&quot;fa fa-4x fa-file-text-o&quot;&gt;&lt;\/i&gt; Insight Maker provides two great ways to help you explain your model: Stories and Articles.&#xa;&#xa;&lt;a href=&quot;\/storytelling&quot; target=&quot;_blank&quot;&gt;Stories&lt;\/a&gt; create a walkthrough of your model where you can show messages and reveal the model step-by-step. Articles take a story and convert it into a crisp static web page.&#xa;&#xa;Here are a few example articles made with Insight Maker. What will you write your article on?&#xa;&#xa; \u2022 &quot;&lt;a href=&quot;https:\/\/insightmaker.com\/article\/20382&quot; target=&quot;_blank&quot;&gt;Air Pollution Dynamics&lt;\/a&gt;&quot;&#xa; \u2022 &quot;&lt;a href=&quot;https:\/\/insightmaker.com\/article\/8872&quot; target=&quot;_blank&quot;&gt;Bird Feeder Dilemma&lt;\/a&gt;&quot;&#xa; \u2022 &quot;&lt;a href=&quot;https:\/\/insightmaker.com\/article\/133&quot; target=&quot;_blank&quot;&gt;Balancing Loop with Delay&lt;\/a&gt;&quot;\" LabelPosition=\"Middle\" id=\"55\">\n      <mxCell style=\"text;fontFamily=Helvetica;fontStyle=0;fontSize=15;align=left;labelPosition=middle;verticalLabelPosition=middle;verticalAlign=middle\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"730\" y=\"138\" width=\"280\" height=\"455\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Folder name=\"Step 1. Build your Model\" Note=\"\" Type=\"None\" Solver=\"{&quot;enabled&quot;: false, &quot;algorithm&quot;: &quot;RK1&quot;, &quot;timeStep&quot;: 1}\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" AgentBase=\"\" id=\"42\">\n      <mxCell style=\"folder;dashed=0;fontSize=18;fontFamily=Verdana;fontStyle=1;image=None;shape=rectangle;rounded=0;strokeColor=#C0C0C0;strokeWidth=1;30=10\" parent=\"1\" vertex=\"1\">\n        <mxGeometry x=\"15\" y=\"90\" width=\"680\" height=\"522\" as=\"geometry\">\n          <mxRectangle x=\"15\" y=\"98\" width=\"250\" height=\"30\" as=\"alternateBounds\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Folder>\n    <Link name=\"Link\" Note=\"\" BiDirectional=\"false\" id=\"28\">\n      <mxCell style=\"link;dashed=0;strokeColor=#003366;strokeWidth=5;30=50;endArrow=block\" parent=\"42\" source=\"51\" target=\"49\" edge=\"1\">\n        <mxGeometry x=\"35\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"35\" y=\"100\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"135\" as=\"targetPoint\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Link>\n    <Link name=\"Link\" Note=\"\" BiDirectional=\"false\" id=\"29\">\n      <mxCell style=\"link;strokeColor=#003366;dashed=0;strokeWidth=5;30=50;endArrow=block\" parent=\"42\" source=\"49\" target=\"50\" edge=\"1\">\n        <mxGeometry x=\"35\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"35\" y=\"100\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"135\" as=\"targetPoint\"\/>\n          <Array as=\"points\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Link>\n    <Text name=\"Use an extensive set of &lt;a href=&quot;\/diagramming&quot; target=&quot;_blank&quot;&gt;drawing tools to create&lt;\/a&gt; causal loop diagrams, flow charts or rich pictures. Build the diagram that communicates your insights and mental models.&#xa;&#xa;This diagram is an Insight Maker model. Feel free to change it. Each  picture, textbox or other element is called a &quot;&lt;a href=&quot;\/primitives&quot; target=&quot;_blank&quot;&gt;Primitive&lt;\/a&gt;&quot;. You can click and drag primitives to move them or edit their contents in the sidebar.\" LabelPosition=\"Middle\" id=\"45\">\n      <mxCell style=\"text;fontFamily=Helvetica;fontStyle=0;fontSize=15;align=left;labelPosition=middle;verticalLabelPosition=middle;verticalAlign=middle\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"185\" y=\"36\" width=\"475\" height=\"136\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Picture name=\"Simulate\" Note=\"\" Image=\"https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kchart.png\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Left\" id=\"49\">\n      <mxCell style=\"picture;image=https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kchart.png;imageFlipV=0;imageFlipH=0;shape=image;verticalLabelPosition=middle;verticalAlign=middle;labelPosition=left;align=right;fontStyle=1\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"79\" y=\"223\" width=\"90\" height=\"90\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Picture name=\"Analyze\" Note=\"\" Image=\"https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kformula.png\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Left\" id=\"50\">\n      <mxCell style=\"picture;image=https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kformula.png;imageFlipV=0;imageFlipH=0;shape=image;verticalLabelPosition=middle;verticalAlign=middle;labelPosition=left;align=right;fontStyle=1\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"79\" y=\"402\" width=\"90\" height=\"90\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Picture name=\"Diagram\" Note=\"\" Image=\"https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kivio.png\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Left\" id=\"51\">\n      <mxCell style=\"picture;image=https:\/\/insightmaker.com\/sites\/default\/files\/misc\/kivio.png;imageFlipV=0;imageFlipH=0;shape=image;verticalLabelPosition=middle;verticalAlign=middle;labelPosition=left;align=right;fontStyle=1\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"79\" y=\"40\" width=\"90\" height=\"90\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Picture>\n    <Text name=\"Add equations to your model to &lt;a href=&quot;\/simulating&quot; target=&quot;_blank&quot;&gt;simulate&lt;\/a&gt; future behavior and changes. Use a powerful &lt;a href=&quot;\/equations&quot; target=&quot;_blank&quot;&gt;equation language&lt;\/a&gt; and large library of &lt;a href=&quot;\/functions&quot; target=&quot;_blank&quot;&gt;built-in functions&lt;\/a&gt; to simulate &lt;a href=&quot;\/systemdynamics&quot; target=&quot;_blank&quot;&gt;System Dynamics&lt;\/a&gt; or &lt;a href=&quot;\/agentbased&quot; target=&quot;_blank&quot;&gt;Agent Based Models&lt;\/a&gt;. View and explore results directly within Insight Maker.\" LabelPosition=\"Middle\" id=\"52\">\n      <mxCell style=\"text;fontFamily=Helvetica;fontStyle=0;fontSize=15;align=left;labelPosition=middle;verticalLabelPosition=middle;verticalAlign=middle\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"185\" y=\"215\" width=\"290\" height=\"120\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Text name=\"Analyze your model results. Study the trends to understand the dynamics of your system. Use Insight Maker&#39;s &lt;a href=&quot;\/sensitivitytesting&quot; target=&quot;_blank&quot;&gt;Sensitivity Testing Tool&lt;\/a&gt; to understand the effect of randomness. Apply Insight Maker&#39;s &lt;a href=&quot;\/optimization&quot; target=&quot;_blank&quot;&gt;Optimization Tool&lt;\/a&gt; to maximize or minimize a goal. Utilize Insight Maker&#39;s &lt;a href=&quot;\/scripting&quot; target=&quot;_blank&quot;&gt;scripting&lt;\/a&gt; capabilities to take complete control of your analysis.\" LabelPosition=\"Middle\" id=\"53\">\n      <mxCell style=\"text;fontFamily=Helvetica;fontStyle=0;fontSize=15;align=left;labelPosition=middle;verticalLabelPosition=middle;verticalAlign=middle\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"185\" y=\"387\" width=\"475\" height=\"120\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Text>\n    <Folder name=\"Product Adoption\" Note=\"\" Type=\"None\" Solver=\"{&quot;enabled&quot;: false, &quot;algorithm&quot;: &quot;RK1&quot;, &quot;timeStep&quot;: 1}\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" AgentBase=\"\" id=\"41\">\n      <mxCell style=\"folder;strokeWidth=1;30=10;fontSize=13;image=None;shape=rectangle;\" parent=\"42\" vertex=\"1\">\n        <mxGeometry x=\"490\" y=\"213\" width=\"170\" height=\"122\" as=\"geometry\">\n          <mxRectangle x=\"490\" y=\"213\" width=\"170\" height=\"27\" as=\"alternateBounds\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Folder>\n    <Stock name=\"Users\" Note=\"\" InitialValue=\"1000\" StockMode=\"Store\" Delay=\"10\" Volume=\"100\" NonNegative=\"false\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"100\" SliderMin=\"0\" SliderStep=\"\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" id=\"35\">\n      <mxCell style=\"stock;fontSize=9;strokeWidth=1;30=10\" parent=\"41\" vertex=\"1\">\n        <mxGeometry x=\"20\" y=\"90\" width=\"40\" height=\"20\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Stock>\n    <Flow name=\"Adoption\" Note=\"\" FlowRate=\"[Users]*[Rate]\" OnlyPositive=\"true\" TimeIndependent=\"false\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"100\" SliderMin=\"0\" SliderStep=\"\" id=\"36\">\n      <mxCell style=\"flow;fontSize=9;strokeWidth=2;30=20\" parent=\"41\" target=\"35\" edge=\"1\">\n        <mxGeometry x=\"-680\" y=\"-150\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"40\" y=\"40\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"-680\" y=\"-50\" as=\"targetPoint\"\/>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Flow>\n    <Variable name=\"Rate\" Note=\"\" Equation=\"0.2\" Units=\"Unitless\" MaxConstraintUsed=\"false\" MinConstraintUsed=\"false\" MaxConstraint=\"100\" MinConstraint=\"0\" ShowSlider=\"false\" SliderMax=\"100\" SliderMin=\"0\" SliderStep=\"\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" id=\"37\">\n      <mxCell style=\"variable;fontSize=9;strokeWidth=1;30=10\" parent=\"41\" vertex=\"1\">\n        <mxGeometry x=\"60\" y=\"25\" width=\"40\" height=\"20\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Variable>\n    <Link name=\"Link\" Note=\"\" BiDirectional=\"false\" id=\"38\">\n      <mxCell style=\"link;strokeWidth=1;30=10\" parent=\"41\" source=\"37\" target=\"36\" edge=\"1\">\n        <mxGeometry x=\"-650\" y=\"-150\" width=\"100\" height=\"100\" as=\"geometry\">\n          <mxPoint x=\"-650\" y=\"-50\" as=\"sourcePoint\"\/>\n          <mxPoint x=\"-550\" y=\"-150\" as=\"targetPoint\"\/>\n          <Array as=\"points\">\n            <mxPoint x=\"50\" y=\"42\"\/>\n          <\/Array>\n        <\/mxGeometry>\n      <\/mxCell>\n    <\/Link>\n    <Button name=\"Click me to Simulate\" Note=\"\" Function=\"runModel();\" Image=\"None\" FlipHorizontal=\"false\" FlipVertical=\"false\" LabelPosition=\"Middle\" id=\"40\">\n      <mxCell style=\"button;fillColor=#B3E2CD;strokeWidth=2;30=20;fontSize=12\" parent=\"41\" vertex=\"1\">\n        <mxGeometry x=\"80\" y=\"63\" width=\"75\" height=\"35\" as=\"geometry\"\/>\n      <\/mxCell>\n    <\/Button>\n  <\/root>\n<\/mxGraphModel>\n";

function setConverterInit(converter) {
	var start = parseFloat(getTimeStart(), 10);
	var end = parseFloat(getTimeStart(), 10) + parseFloat(getTimeLength(), 10);

	converter.setAttribute("Data", start + "," + Math.pow(start, 2) + "; " + (start + end) / 2 + "," + Math.pow((start + end) / 2, 2) + "; " + end + "," + Math.pow(end, 2))
}
