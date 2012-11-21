"use strict";
/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/



Ext.form.customFields['richText'] = Ext.extend(Ext.form.customFields['richText'], {
	onTriggerClick: function() {
		this.suspendEvents(false);
		this.editorWindow = new Ext.RichTextWindow({
			parent: this,
			html: this.getValue()
		});
		this.editorWindow.show();
	},

	listeners: {
		'keydown': function(field) {
			field.setEditable(false);
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



Ext.RichTextWindow = function(args) {
	var obj = this;


	obj.args = args;




	obj.win = new Ext.Window({
		title: 'Note Editor',
		layout: {
			type: "fit"
		},
		closeAction: 'destroy',
		border: false,
		modal: true,
		resizable: false,
		shadow: true,
		buttonAlign: 'right',
		width: 420,
		height: 350,
		items: [new Ext.form.field.HtmlEditor({
			enableColors: false,
			enableSourceEdit: false,
			enableFont: false,
			enableLists: true,
			enableFontSize: false,
			fieldLabel: '',
			name: 'richTextItem',
			id: 'richTextItem',
			allowBlank: true,
			emptyText: "Enter a Note...",
			value: obj.args.html
		})],
		buttons: [{
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
			scale: "large",
			iconCls: "apply-icon",
			text: 'Apply',
			handler: function() {
				if (obj.args.parent != "") {
					obj.args.parent.setValue(Ext.getCmp("richTextItem").getValue());
					obj.win.close();
					obj.args.parent.resumeEvents();
					grid.plugins[0].completeEdit();
					
				} else {
					graph.getModel().beginUpdate();
					setNote(obj.args.cell, Ext.getCmp("richTextItem").getValue());
					graph.getModel().endUpdate();
					selectionChanged(false);
					obj.win.close();
				}
				
			}
		}]

	});

	obj.show = function() {
		obj.win.show();
	}
}
