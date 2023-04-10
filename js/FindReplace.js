"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var findAndReplaceWin;
function showFindAndReplace(){
	if(! findAndReplaceWin){
		var p = new Ext.FormPanel({
			fieldDefaults: {
			    labelWidth: 120,
				width:485
			},
			margin: '5 5 5 10',
			autoScroll:true,
			frame: false,
			defaultType: 'textfield',

				items: [
				{
					xtype: 'textareafield',
				    fieldLabel: getText('Search Text'),
				    name: 'frSearchData',
				    id: 'frSearchData',
					selectOnFocus: true, height:60,
					listeners: {
	            		change: function(field, newVal, oldVal) {
	                		Ext.getCmp('findNextBut').setDisabled(true);
	            		}
	        		}
				}, {
					xtype: 'textareafield',
				    fieldLabel: getText('Replace Text'),
				    name: 'frReplaceData',
				    id: 'frReplaceData',
				    allowBlank: true,
					selectOnFocus: true, height:60
				},{
            xtype: 'checkboxgroup',
            fieldLabel: getText('Search in'),
            items: [{
	                boxLabel: getText('Names'),
	                inputValue: '1',
	                name: 'frSearchNames',
	                id: 'frSearchNames',
					value:'1',checked:true, width: 90
	            },
				{boxLabel: getText('Notes'),
	                inputValue: '1',
	                name: 'frSearchNotes',
	                id: 'frSearchNotes',width:90
	            },
				{boxLabel: getText('Equations'),
	                inputValue: '1',
	                name: 'frSearchValues',
	                id: 'frSearchValues',width:90
	            }]
      	  		}
	            ,{
					xtype: "checkboxfield",
	                fieldLabel: getText('Case Sensitive'),
	                inputValue: '1',
	                name: 'frCaseSensitive',
	                id: 'frCaseSensitive'
	            }
			]
		});
								
	    findAndReplaceWin = new Ext.Window({
	        title: getText('Find and Replace'),
	        layout: 'fit',
	        closeAction: 'hide',
	        border: false,
	        modal: true,
	        resizable: false,
	        shadow: true,
	        buttonAlign: 'left',
	        layoutConfig: {
	            columns: 1
	        },
	        width: 524,
	        height: 355,
	        items: [p],
	        buttons: [
	        {
	            scale: "large",
	            glyph: 0xf05c,
	            text: getText('Cancel'),
	            handler: function()
	            {
	                findAndReplaceWin.hide();
	            }
	        },'->',
	        {
	            scale: "large",
	            text: getText('Replace All'),
	            handler: function()
	            {
					var items = primitives();
					var search = Ext.getCmp("frSearchData").getValue().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					var replace = Ext.getCmp("frReplaceData").getValue();
					var searchNames = Ext.getCmp("frSearchNames").getValue();
					var searchValues = Ext.getCmp("frSearchValues").getValue();
					var searchNotes = Ext.getCmp("frSearchNotes").getValue();
					var caseSensitive = Ext.getCmp("frCaseSensitive").getValue();
					if(caseSensitive){
						search = new RegExp(search,"g");
					}else{
						search = new RegExp(search,"ig");
					}
					
					if((! searchNames) && (! searchValues) && (! searchNotes)){
						showNotification(getText("You must search within at least one category."), "error", true);
						return;
					}
					graph.getModel().beginUpdate();
					for(var i = 0; i < items.length; i++){
						var item = items[i];
						if(item.isVisible()){
							if(searchNames && getName(item)){
								setName(item, getName(item).replace(search, replace));
							}
							if(searchNotes && getNote(item)){
								setNote(item, getNote(item).replace(search, replace));
							}
							if(searchValues && getValue(item)){
								setValue(item, getValue(item).replace(search, replace));
							}
						}
					}
					graph.getModel().endUpdate();
					findAndReplaceWin.hide();
				}
	        },{
	            scale: "large",
	            text: getText('Find Next'),
				disabled: true,
				id: 'findNextBut',tooltip: cmd("G"),
	            handler: function()
	            {
					findNext();
				}
			},
	        {
	            scale: "large",
            	glyph: 0xf00c,
	            text: getText('Find'),
	            handler: function()
	            {
					findFirst();
				}
	        }]

	    });
	}
	findAndReplaceWin.show();
	Ext.getCmp("frSearchData").focus(true, 100);
}

var currentFindPrimitive;

function findNext(){
	var items = primitives();
	var search = Ext.getCmp("frSearchData").getValue().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	var searchNames = Ext.getCmp("frSearchNames").getValue();
	var searchValues = Ext.getCmp("frSearchValues").getValue();
	var searchNotes = Ext.getCmp("frSearchNotes").getValue();
	var caseSensitive = Ext.getCmp("frCaseSensitive").getValue();
	if(caseSensitive){
		search = new RegExp(search);
	}else{
		search = new RegExp(search,"i");
	}
	if((! searchNames) && (! searchValues) && (! searchNotes)){
		showNotification(getText("You must search within at least one category."), "error", true);
		return;
	}
	
	var start = 0;
	if(currentFindPrimitive){
		for(var i = 0; i<items.length; i++){
			if(currentFindPrimitive.id == items[i].id){
				start = i+1;
				break
			}
		}
	}
	if(start >= items.length){
		start = 0;
	}
	var loops=2;
	if(start == 0){
		loops = 1;
	}
	while(loops>0){
		for(var i = start; i<items.length; i++){	
			var item = items[i];
			currentFindPrimitive = item;
			if(item.isVisible()){
				if(searchNames && getName(item)){
					if(getName(item).search(search) != -1){
						highlight(item);
						findAndReplaceWin.hide();
						return;
					}
				}
				if(searchNotes && getNote(item)){
					if(getNote(item).search(search) != -1){
						highlight(item);
						findAndReplaceWin.hide();
						showNote(item);
						return;
					}
				}
				if(searchValues && getValue(item)){
					if(getValue(item).replace("/\\n/g","\n").search(search) != -1){
						highlight(item);
						findAndReplaceWin.hide();
						showEditor(item);
						return;
					}
				}
			}
		}
		loops--;
		start = 0;
	}
	showNotification(getText("Search text not found in model."), "notice", true);
}

function findFirst(){
	

	Ext.getCmp('findNextBut').setDisabled(false);
	
	currentFindPrimitive = null;
	
	findNext();
	
}

