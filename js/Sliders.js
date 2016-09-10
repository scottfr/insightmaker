"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

function sliderPrimitives(types) {
    var myCells;
	if(types){
		myCells = findType(types);
	}else{
		myCells = primitives();
 	}
    var slids = [];
    for (var i = 0; i < myCells.length; i++) {
        if (isTrue(myCells[i].getAttribute("ShowSlider"))) {
            slids.push(myCells[i]);
        }
    }
    return slids;
}

function createSliders(types, setValue, warning){
	var sliderHolder = Ext.create("Ext.container.Container", {
		layout: {
			type: "vbox",
			align: "stretch"
		},
		baseCls: 'slider-holder',
		margin: "0px 4px 0px 4px"
	});
	
	
	var slids = sliderPrimitives(types);
	sliders = [];

	for (var i = 0; i < slids.length; i++) {
		//if (isNaN(getValue(slids[i]))) {
		//	setValue(slids[i], (parseFloat(slids[i].getAttribute("SliderMin")) + parseFloat(slids[i].getAttribute("SliderMax"))) / 2);
		//}
		var step = parseFloat(slids[i].getAttribute("SliderStep"))?parseFloat(slids[i].getAttribute("SliderStep")):undefined;
		var perc = step?Math.ceil(-Math.log(step) /Math.log(10)):Math.floor(-(Math.log(Math.max(0.1, slids[i].getAttribute("SliderMax") - slids[i].getAttribute("SliderMin"))) / Math.log(10) - 4));

		var v = getValue(slids[i]).trim();
	
		perc = Math.max(0, perc);
		var slid = Ext.create("Ext.slider.Single", {
			flex: 1,
			minValue: parseFloat(slids[i].getAttribute("SliderMin")),
			sliderCell: slids[i],
			value: (parseFloat(v)==v)?parseFloat(v):undefined,
			maxValue: parseFloat(slids[i].getAttribute("SliderMax")),
			decimalPrecision: perc,
			increment: step,
			margin: '0px 5px 0px 0px'
		});
		sliders.push(slid);
	
		addSlid();
	
		
	}
	return sliderHolder;
	
	function addSlid(){
		var textField = Ext.create("Ext.form.field.Number", {
			slider: slid,
			width: 60,
			decimalPrecision: perc,
			ignoreChange: false,
			hideTrigger: true,
			keyNavEnabled: false,
			selectOnFocus: true,
			mouseWheelEnabled: false,
			minValue: parseFloat(slids[i].getAttribute("SliderMin")),
			maxValue: parseFloat(slids[i].getAttribute("SliderMax")),
			listeners: {
				change: function(item, e, ops) {
					if (!item.ignoreChange) {
						if(item.validate()){
							item.ignoreChange = true;
							var v = parseFloat(item.getValue());
							if ( ! isNaN(v) ) {
								item.slider.setValue(v);
							}
							item.ignoreChange = false;
						}
					}
				}
			}
		});
		slid.addListener("change", function(slider, newValue) {
			if(! slider.confirming){
				if ((!textField.ignoreChange) || (parseFloat(textField.getValue()) != parseFloat(newValue))) {
					textField.setRawValue(parseFloat(newValue));
				}
				if(getValue(slider.sliderCell).trim() != parseFloat(getValue(slider.sliderCell).trim())){
					slider.confirming = true;
					warning(slider, setValue, textField, newValue);
					
				}else{
					setValue(slider.sliderCell, parseFloat(newValue));
				}
			}
		});

		var n = slids[i].getAttribute("Note");
		if (isUndefined(n)) {
			n = "";
		}

		var slidCont = Ext.create("Ext.container.Container", {
			layout: {
				type: "vbox",
				align: "stretch"
			},
			baseCls: 'single-slider',
			margin: 0,
			items: []
		});
		
		slidCont.add(Ext.create("Ext.Component", {
			html: "<big> " + slids[i].getAttribute("name") + "</big>" + (n == "" ? "" : "<div style='font-size: 90%; margin-top: 3px; color: grey'>" + n + "</div>"),
			padding: '10px 3px 3px 3px'
		}));

		slidCont.add(Ext.create("Ext.container.Container", {
			layout: {
				type: "hbox",
				align: "stretch"
			},
			margin: 3,
			items: [slid, textField]
		}));
		
		sliderHolder.add(slidCont);

		if(v == parseFloat(v)){
			textField.setValue(parseFloat(getValue(slids[i])));
		}
	}
}

