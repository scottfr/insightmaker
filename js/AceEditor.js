// "use strict"; // use strict not support due to ExtJS OO abuses.

/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

Ext.define('Ext.ux.AceEditor', {
    extend: 'Ext.Component', // subclass Ext.Component
    alias: 'widget.aceeditor', 

	config: {
		theme: 'chrome',
		mode: 'mdln',
		readOnly: false
	},

    // Add custom processing to the onRender phase.
    // Add a 'load' listener to the element.
    onRender: function() {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        //this.el.on('load', this.onLoad, this);
    },
	
	onResize: function(width, height){
		this.editor.resize();
	},
	
	afterRender: function(){
		var me = this;
		
		var el = this.getEl().dom;
		/*el.style.zoom = "140%"*/
		el.style["font-size"] = "13pt";
		var editor = ace.edit(el);
		
		this.editor = editor;
		editor.setTheme("ace/theme/"+this.theme);
		
		editor.$blockScrolling = Infinity;

		//editor.getSession().setMode("ace/mode/javascript");
		editor.getSession().setMode("ace/mode/"+this.mode);
		editor.setShowPrintMargin(false);
		//editor.renderer.setShowGutter(false); 
		editor.setHighlightActiveLine(false);
		editor.getSession().setUseSoftTabs(true);
		setTimeout(function(){
			editor.getSession().setUseWrapMode(true);
		}, 100);
		
		editor.setOptions({
		  fontSize: "13pt",
		  showLineNumbers: false/*,
		  enableBasicAutocompletion: true*/
		});
		
		editor.setReadOnly(me.readOnly);
		
		editor.setValue(this.value || "");
		this.oldValue = this.value || "";
		
		editor.focus();
		
		var timer;
		editor.on('change', function(){
			
			if(me.mode == "mdln"){
				clearInterval(timer);
				timer = setTimeout(function(){
					try{
						createTree(me.getValue());
						editor.getSession().setAnnotations();
					}catch(err){
						var s = err.toString();
						try{
							var r = Math.max(0, s.match(/line (\d+)/i)[1]-1);
						}catch(err){
							r = 0;
							s = "Syntax error."
						}
						editor.getSession().setAnnotations([{type: "error", row: r, text: s}])
					}
				}, 400)
			}
			
					
					
			me.fireEvent('change', me, me.getValue(), me.oldValue);
			me.oldValue = me.getValue();
		})
		
		if(this.annotations){
			editor.getSession().setAnnotations(this.annotations);
		}
		
	},
	
	setValue: function(text){
		this.oldValue = text;
		this.editor.setValue(text);
	},
	
	getValue: function(){
		return this.editor.getValue();
	},
	
	insertText: function(text){
		this.editor.insert(text)
	}

});