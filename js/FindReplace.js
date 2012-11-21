"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/

var findAndReplaceWin;
function showFindAndReplace(){
	if(! findAndReplaceWin){
		var p = new Ext.FormPanel({
			fieldDefaults: {
			    labelWidth: 100,
				width:375
			},
			autoScroll:true,
			frame: true,
			defaultType: 'textfield',

				items: [
				{
					xtype: 'textareafield',
				    fieldLabel: 'Search Text',
				    name: 'frSearchData',
				    id: 'frSearchData',
				    allowBlank: false,
					selectOnFocus: true, height:60,
				listeners: {
            		change: function(field, newVal, oldVal) {
                		Ext.getCmp('findNextBut').setDisabled(true);
            		}
        		}
				}, {
					xtype: 'textareafield',
				    fieldLabel: 'Replace Text',
				    name: 'frReplaceData',
				    id: 'frReplaceData',
				    allowBlank: true,
					selectOnFocus: true, height:60
				},{
            xtype: 'checkboxgroup',
            fieldLabel: 'Search In',
            items: [{
	                boxLabel: 'Names',
	                inputValue: '1',
	                name: 'frSearchNames',
	                id: 'frSearchNames',
					value:'1',checked:true
	            },
				{boxLabel: 'Notes',
	                inputValue: '1',
	                name: 'frSearchNotes',
	                id: 'frSearchNotes'
	            },
				{boxLabel: 'Values',
	                inputValue: '1',
	                name: 'frSearchValues',
	                id: 'frSearchValues'
	            }]
      	  		}
	            ,{
					xtype: "checkboxfield",
	                fieldLabel: 'Case Sensitive',
	                inputValue: '1',
	                name: 'frCaseSensitive',
	                id: 'frCaseSensitive'
	            }
			]
		});
								
	    findAndReplaceWin = new Ext.Window({
	        title: 'Find and Replace',
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
	        width: 404,
	        height: 275,
	        items: [p],
	        buttons: [
	        {
	            scale: "large",
	            iconCls: "cancel-icon",
	            text: 'Cancel',
	            handler: function()
	            {
	                findAndReplaceWin.hide();
	            }
	        },'->',
	        {
	            scale: "large",
	            iconCls: "replace-icon",
	            text: 'Replace All',
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
						mxUtils.alert("You must replace within at least one category.");
						return;
					}
					graph.getModel().beginUpdate();
					for(var i = 0; i<items.length; i++){
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
	            iconCls: "find-icon",
	            text: 'Find Next',
				disabled: true,
				id: 'findNextBut',tooltip: cmd("G"),
	            handler: function()
	            {
					findNext();
				}
			},
	        {
	            scale: "large",
	            iconCls: "find-icon",
	            text: 'Find',
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
		mxUtils.alert("You must search within at least one category.");
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
	mxUtils.alert("Search text not found in model.");
}

function findFirst(){
	

	Ext.getCmp('findNextBut').setDisabled(false);
	
	currentFindPrimitive = null;
	
	findNext();
	
}

