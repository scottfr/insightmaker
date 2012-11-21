"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

var configWin;

var timeSettingsFn = function()
{
    var solutionAlgorithms = Ext.create('Ext.data.Store', {
        fields: [
        'abbr', "name"],
        data: [{
            'abbr': 'RK1',
            'name': 'Fast (Euler)'
        },
        {
            'abbr': 'RK4',
            'name': 'Accurate (RK4)'
        }]
    });

    if (!configWin) {
        configWin = new Ext.Window({
            layout: 'fit',
            modal: true,
            width: 370,
            title: "Simulation Time Settings",
            height: 380,
            resizable: false,
            closeAction: 'hide',
            plain: true,
            items: [new Ext.FormPanel({
                fieldDefaults: {
                    labelWidth: 150
                },
                frame: true,
                id: 'timeForm',

                bodyStyle: 'padding:5px 5px 0',
                width: 450,
                defaults: {
                    width: 330
                },
                defaultType: 'textfield',

                items: [new Ext.form.NumberField({
                    fieldLabel: 'Simulation Start',
                    name: 'stimestart',
                    id: 'stimestart',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 12
                }),
                new Ext.form.NumberField({
                    fieldLabel: 'Simulation Length',
                    name: 'stimelength',
                    id: 'stimelength',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 12
                }),
                new Ext.form.NumberField({
                    fieldLabel: 'Simulation Time Step',
                    name: 'stimestep',
                    id: 'stimestep',
                    allowBlank: false,
                    minValue: 0.000000000001,
                    step: .1,
                    decimalPrecision: 12
                }),
                {
                    xtype: 'radiogroup',
                    id: "tunits",
                    fieldLabel: 'Time Units',
                    columns: 1,
                    items: [
                    {
                        boxLabel: 'Seconds',
                        name: 'tunits',
                        inputValue: "Seconds"
                    },
                    {
                        boxLabel: 'Minutes',
                        name: 'tunits',
                        inputValue: "Minutes"
                    },
                    {
                        boxLabel: 'Hours',
                        name: 'tunits',
                        inputValue: "Hours"
                    },
                    {
                        boxLabel: 'Days',
                        name: 'tunits',
                        inputValue: "Days"
                    },
                    {
                        boxLabel: 'Weeks',
                        name: 'tunits',
                        inputValue: "Weeks"
                    },
                    {
                        boxLabel: 'Months',
                        name: 'tunits',
                        inputValue: "Months"
                    },
                    {
                        boxLabel: 'Years',
                        name: 'tunits',
                        inputValue: "Years"
                    }
                    ]
                },
                new Ext.form.ComboBox({
                    fieldLabel: "Analysis Algorithm",
                    typeAhead: true,
                    triggerAction: 'all',
                    queryMode: 'local',
                    selectOnFocus: true,
                    forceSelection: true,
                    store: solutionAlgorithms,
                    displayField: 'name',
                    valueField: 'abbr',
                    id: 'sSolutionAlgo',
                    editable: false
                })
                ],

                buttons: [{
					xtype:"button",
                    scale: "large",
                    iconCls: "cancel-icon",
                    text: 'Cancel',
					id: "timeCancleBut",
                    handler: function() {
                        configWin.hide();
						
                    }
                },
                {
					id: "timeApplyBut",
					xtype:"button",
                    iconCls: "apply-icon",
                    scale: "large",
                    text: 'Apply',
                    handler: function() {

					    var setting = getSetting();
						
						/*var steps = Ext.getCmp("stimelength").getValue()/Ext.getCmp("stimestep").getValue();
											
						if(steps>200){
							if(! confirm("This simulation has a length of "+Ext.getCmp("stimelength").getValue()+" and a time step of "+Ext.getCmp("stimestep").getValue()+".\n\nThe simulation will require "+steps+" iterations to complete, which could be very slow.\n\nAre you sure you want to use these settings?")){
								return;
							}
						}*/
                        graph.getModel().beginUpdate();

                        var edit = new mxCellAttributeChange(
                        setting, "SolutionAlgorithm",
                        Ext.getCmp('sSolutionAlgo').getValue());
                        graph.getModel().execute(edit);

                        var edit = new mxCellAttributeChange(
                        setting, "TimeLength",
                        Ext.getCmp('stimelength').getValue());
                        graph.getModel().execute(edit);

                        edit = new mxCellAttributeChange(
                        setting, "TimeStart",
                        Ext.getCmp('stimestart').getValue());
                        graph.getModel().execute(edit);

                        edit = new mxCellAttributeChange(
                        setting, "TimeStep",
                        Ext.getCmp('stimestep').getValue());
                        graph.getModel().execute(edit);


                        edit = new mxCellAttributeChange(
                        setting, "TimeUnits",
                        Ext.getCmp('timeForm').getForm().getValues()['tunits']);
                        graph.getModel().execute(edit);

                        graph.getModel().endUpdate();

                        configWin.hide();
                    }
                }
                ]
            })]

        })

    }

    var setting = getSetting();
	
    Ext.getCmp('stimestart').setValue(setting.getAttribute("TimeStart"));
    Ext.getCmp('tunits').items.items[["Seconds", "Minutes", "Hours", "Days", "Weeks", "Months", "Years"].indexOf(setting.getAttribute("TimeUnits"))].setValue(true);
    Ext.getCmp('stimelength').setValue(setting.getAttribute("TimeLength"));
    Ext.getCmp('stimestep').setValue(setting.getAttribute("TimeStep"));
    Ext.getCmp("sSolutionAlgo").setValue(setting.getAttribute("SolutionAlgorithm"));
    configWin.show();
};