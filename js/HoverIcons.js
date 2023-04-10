"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/



// Defines a new class for all icons

var equalSrc = builder_path + '/images/equal.png';
new Image().src = equalSrc;
var infoSrc = builder_path + '/images/note.png';
new Image().src = infoSrc;

function mxIconSet(state) {
	this.images = [];
	var graph = state.view.graph;
	var events = ['mousedown', 'touchstart'];


	var cell = orig(state.cell);

	if (getOpacity(cell) !== 0){
		if (isValued(cell) || cell.value.nodeName == "Action") {
			//equation
			var img = mxUtils.createImage(equalSrc);
			img.setAttribute('title', '');
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.left = (state.x + 2) + "px";
			img.style.top = (state.y + 2) + "px";

			if (state.width < 2) {
				img.style.left = state.x + state.width - 20;
			}


			events.forEach(function(md) {
					mxEvent.addListener(img, md,
					mxUtils.bind(this,

					function(evt) {
						//console.log(Ext.get(evt.srcElement));
						showEditor(cell)//, Ext.get(evt.srcElement));

						mxEvent.consume(evt);
					})
				);
			});

			state.view.graph.container.appendChild(img);
			this.images.push(img);
		}


		if (cell.value.getAttribute("Note") != null && Ext.String.trim(cell.value.getAttribute("Note")) != "") {
			// Note
			var img = mxUtils.createImage(infoSrc);
			img.setAttribute('title', '');
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.left = (state.x + state.width - 18) + "px";
			img.style.top = (state.y + 2) + "px";
			if (state.width < 2) {
				img.style.left = state.x + 2;
			}


			events.forEach(function(md){
				mxEvent.addListener(img, md,
				mxUtils.bind(this,

				function(evt) {
					var x = Ext.getCmp("note" + cell.id);
					if (isUndefined(x)) {
						var tooltip = new Ext.ToolTip({
							html: "<big>" + clean(cell.value.getAttribute("Note")
								.replace(/\n/g, "<br/>")) + "</big>",
							autoHide: false,
							closable: true,
							width: 300,
							draggable: true,
							id: "note" + cell.id,
							title: clean(cell.value.getAttribute("name")),
							closeAction: 'destroy'
						});
						//console.log(evt);
						if(evt.clientX){
							tooltip.showAt([evt.clientX + 17, evt.clientY - 8]);
						}else{
							tooltip.showAt(getPosition(cell));
						}
						mxEvent.consume(evt);
					} else {
						x.destroy();
					}
				}));
			});
		
			state.view.graph.container.appendChild(img);
			this.images.push(img);
		}
	}
}
mxIconSet.prototype.destroy = function() {
	if (this.images != null) {
		for (var i = 0; i < this.images.length; i++) {
			var img = this.images[i];
			img.parentNode.removeChild(img);
		}
	}

	this.images = null;
};


function setupHoverIcons() {

	var iconTolerance = 20;

	var activate = function(sender, me) {
			// Ignores event if over current cell (with tolerance)
			if (this.currentState != null && (me.getState() == this.currentState || me.getState() == null)) {
				var tol = iconTolerance;
				var tmp = new mxRectangle(me.getGraphX() - tol,
				me.getGraphY() - tol, 2 * tol, 2 * tol);

				if (mxUtils.intersects(tmp, this.currentState)) {
					return;
				}
			}

			var tmp = graph.view.getState(me.getCell());

			// Ignores everything but vertices
			if (graph.isMouseDown || (tmp != null && !(graph.getModel()
				.isEdge(tmp.cell) || graph.getModel()
				.isVertex(tmp.cell)))) {
				tmp = null;
			}

			if (tmp != this.currentState) {
				if (this.currentState != null) {
					this.dragLeave(me.getEvent(), this.currentState);
				}

				this.currentState = tmp;

				if (this.currentState != null) {
					this.dragEnter(me.getEvent(), this.currentState);
				}
			}
		};
		
	var mouseState = {
		currentState: null,
		currentIconSet: null,
		mouseDown: function(sender, me) {
			// Hides icons on mouse down
			if (this.currentState != null) {
				this.dragLeave(me.getEvent(), this.currentState);
				this.currentState = null;
			}
		},
		mouseMove: activate,
		mouseUp: activate,
		dragEnter: function(evt, state) {
			if (this.currentIconSet == null) {
				this.currentIconSet = new mxIconSet(state);
			}
		},
		dragLeave: function(evt, state) {
			if (this.currentIconSet != null) {
				this.currentIconSet.destroy();
				this.currentIconSet = null;
			}
		}
	};
	
	// Shows icons if the mouse is over a cell
	graph.addMouseListener(mouseState);
	
	graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt) {
		
		if (mouseState.currentIconSet != null) {
			mouseState.currentIconSet.destroy();
			mouseState.currentIconSet = null;
		}
	});
}



