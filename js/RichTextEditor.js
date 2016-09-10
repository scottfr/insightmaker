"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var RichTextEditor = Ext.extend(Ext.form.TextField, {
	enableKeyEvents: false,
	selectOnFocus: true,
	triggers: {
		edit: {
			hideOnReadOnly: false,
			handler: function() {
				this.editorWindow = new RichTextWindow({
					parent: this,
					html: this.getValue()
				});
				this.editorWindow.show();
			}
		}
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


function RichTextWindow(config) {
	var me = this;


	var win = new Ext.Window({
		title: getText('Note Editor'),
		layout: {
			type: "fit"
		},
		closeAction: 'destroy',
		border: false,
		modal: true,

		resizable: true,
		maximizable: true,
		stateful: is_editor && (!is_embed),
		stateId: "richtext_window",

		shadow: true,
		buttonAlign: 'right',
		width: Math.min(Ext.getBody().getViewSize().width, 520),
		height: Math.min(Ext.getBody().getViewSize().height, 400),
		items: [new Ext.form.field.HtmlEditor({
			enableColors: false,
			enableSourceEdit: true,
			enableFont: false,
			enableLists: true,
			enableFontSize: false,
			fieldLabel: '',
			name: 'richTextItem',
			id: 'richTextItem',
			allowBlank: true,
			emptyText: getText("Enter a Note..."),
			value: config.html
		})],
		buttons: [{
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
			scale: "large",
			glyph: 0xf00c,
			text: getText('Apply'),
			handler: function() {
				if (config.parent != "") {

					editingRecord.set("value", Ext.getCmp("richTextItem").getValue());
					saveConfigRecord(editingRecord);

				} else {
					graph.getModel().beginUpdate();
					setNote(config.cell, Ext.getCmp("richTextItem").getValue());
					graph.getModel().endUpdate();
					selectionChanged(false);
				}


				win.close();

			}
		}]

	});

	me.show = function() {
		win.show();
	}
}
