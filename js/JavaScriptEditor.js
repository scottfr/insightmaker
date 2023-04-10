"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var JavaScriptEditor = Ext.extend(Ext.form.field.TextArea, {
	enableKeyEvents: true,
	selectOnFocus: true,
	disableKeyFilter: true,
	triggers: {
		edit: {
			hideOnReadOnly: false,
			handler: function() {
				this.editorWindow = new JavaScriptWindow({
					parent: this,
					code: this.getValue()
				});
				this.editorWindow.show();
			}
		}
	},

	listeners: {
		'keydown': function(field) {
			field.setEditable(true);
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

function JavaScriptWindow(config) {
	var me = this;


	var codeEditor = new Ext.ux.AceEditor({
		mode: "javascript",
		value: config.code
	});


	var win = new Ext.Window({
		title: getText('JavaScript Editor'),
		layout: {
			type: "fit"
		},
		tools: [{
			type: 'help',
			tooltip: getText('Get Help'),
			callback: function(panel, tool, event) {
				showURL("/sites/default/files/API/files/API-js.html");
			}
		}],
		closeAction: 'destroy',
		border: false,
		modal: true,
		resizable: true,
		maximizable: true,
		stateful: is_editor && (!is_embed),
		stateId: "js_window",
		shadow: true,
		buttonAlign: 'right',
		width: Math.min(Ext.getBody().getViewSize().width, 520),
		height: Math.min(Ext.getBody().getViewSize().height, 400),
		items: [codeEditor],
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

					editingRecord.set("value", codeEditor.getValue());
					saveConfigRecord(editingRecord);

				} else {
					graph.getModel().beginUpdate();
					setNote(config.cell, codeEditor.getValue());
					graph.getModel().endUpdate();
					selectionChanged(false);
				}


				win.close();

			}
		}]

	});

	me.show = function() {
		win.show();
		codeEditor.focus(true, true);
		codeEditor.editor.focus();
		setTimeout(function() {
			codeEditor.editor.focus();
		}, 100)
	}
}
