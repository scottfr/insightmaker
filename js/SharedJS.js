"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var viewConfig = {
	showTopLinks: true,
	sideBarWidth: 330,
	referenceBarWidth: 240,
	enableContextMenu: true,
	focusDiagram: true,
	allowEdits: is_editor && (! is_embed),
	saveEnabled: true,
	buttonGroups: true,
	showLogo: true,
	primitiveGroup: true,
	connectionsGroup: true,
	actionsGroup: true,
	styleGroup: true,
	toolsGroup: true,
	exploreGroup: false,
	fullScreenResults: false,
	showResultsEdit: true
};

if(is_ebook){
	viewConfig.showTopLinks = false;
	viewConfig.sideBarWidth = 250;
	viewConfig.referenceBarWidth = 150;
	viewConfig.focusDiagram = false;
	viewConfig.saveEnabled = false;
	viewConfig.showLogo = false;
	viewConfig.primitiveGroup = false;
	viewConfig.actionsGroup = true;
	viewConfig.styleGroup = false;
	viewConfig.runFlush = true;
	viewConfig.fullScreenResults = true;
	viewConfig.showResultsEdit = false;
	
}

if(is_embed){
	viewConfig.sideBarWidth = 200;
	viewConfig.referenceBarWidth = 150;
	viewConfig.focusDiagram = false;
	viewConfig.saveEnabled = false;
	viewConfig.buttonGroups = false;
	viewConfig.primitiveGroup = false;
	viewConfig.connectionsGroup = false;
	viewConfig.actionsGroup = false;
	viewConfig.styleGroup = false;
	viewConfig.toolsGroup = false;
	viewConfig.fullScreenResults = true;
	viewConfig.showResultsEdit = false;
	
}

if(! is_editor){
	viewConfig.saveEnabled = false;
	viewConfig.primitiveGroup = false;
	viewConfig.connectionsGroup = false;
	viewConfig.actionsGroup = false;
	viewConfig.styleGroup = false;
	viewConfig.toolsGroup = true;
	if(! is_embed){
		viewConfig.exploreGroup = true;
	}
	viewConfig.showResultsEdit = false;
}




Ext.onReady(function() {
    setTimeout(function() {
		setTimeout(function(){
			try{
		        Ext.get('model-overview').fadeOut({
					duration: 1000,
		            remove: true
		        });
			}catch(err){
			
			}	
		}, 250)
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove: true
        });
		
    },
    250);
});

function replace_html(el, html) {
    if (el) {
        var oldEl = (typeof el === "string" ? document.getElementById(el) : el);
        var newEl = document.createElement(oldEl.nodeName);

        // Preserve any properties we care about (id and class in this example)
        newEl.id = oldEl.id;
        newEl.className = oldEl.className;

        //set the new HTML and insert back into the DOM
        newEl.innerHTML = html;
        if (oldEl.parentNode)
        oldEl.parentNode.replaceChild(newEl, oldEl);
        else
        oldEl.innerHTML = html;

        //return a reference to the new element in case we need it
        return newEl;
    }
};

function setTopLinks() {
	if(viewConfig.showTopLinks){
	    var links = "";
		var arrow = "&uarr;";
	    var toolbar = ribbonPanel.getDockedItems()[0];
	    if (!toolbar.isVisible()) {
			arrow = "&darr;"
		}
	    if (drupal_node_ID == -1) {
	        links = '<div style="float:right;padding:0.2em;"><nobr><a href="'+base_path+'/browse" target="_blank">'+getText("Find More Insights")+'</a> | <a href="javascript:toggleTopBar()"  id="toolbarToggle">'+arrow+'</a></nobr></div>';
	    } else {
	        if (is_editor) {
	            links = '<div style="float:left;padding:0.2em;">';
	            //links = links + '<a href="'+base_path+'/discussion/' + drupal_node_ID + '" target="_blank" id="commentBut">'+getText("Insight Discussion")+'</a>';
	            links = links + '<a href="'+base_path+'/node/' + drupal_node_ID + '/access" target="_blank" id="editBut">'+getText("Insight Access")+'</a>';
	            links = links + ' | <a href="'+base_path+'/node/' + drupal_node_ID + '/delete" id="deleteBut">'+getText("Delete Insight")+'</a>';
				links = links + '</div></div>';
      
			} else {
	            //links = links + '<div style="float:left;padding:0.2em;">';
	            //links = links + '<a href="'+base_path+'/discussion/' + drupal_node_ID + '" target="_blank" id="commentBut">'+getText("Insight Discussion")+'</a></div>';
	        }
	        links = links + '<div style="float:right;padding:0.2em;"><nobr>';
	        if (is_embed) {
	            links = links + '<a target="_blank" href="'+base_path+'/insight/' + drupal_node_ID + '">'+getText("Full Screen Insight")+'</a> | ';
	        } else {
	            links = links + '<a target="_blank" href="'+base_path+'/insight/">'+getText("Make New Insight")+'</a> | ';
	            links = links + '<a target="_blank" href="'+base_path+'/node/' + drupal_node_ID + '/clone">'+getText("Clone Insight")+'</a> | ';
	        }
			if(star_link){
				var unstar = (star_link.indexOf("unflag") > -1);
				links = links + '<span id="star-link"><a href="#" onclick="doStar('+(!unstar)+')">'+(unstar?"<i class='fa fa-star'></i> Unstar":"<i class='fa fa-star-o'></i> Star")+'</a></span> | ';
			}
	        links = links + '<a href="'+base_path+'/browse" target="_blank">'+getText("Find More Insights")+'</a> | <a href="javascript:toggleTopBar()" id="toolbarToggle">'+arrow+'</a></nobr></div>';
	    }
	
	    replace_html(document.getElementById("toplinks-holder"), links);
	
		if($.fn.frameWarp){
		     //$('#commentBut').frameWarp({
		     //   url : base_path+'/discussion/' + drupal_node_ID
		     //});
		     $('#editBut').frameWarp({
		        url : base_path+'/node/' + drupal_node_ID + "/access"
		     });
	 	}
	}
}

function doStar(shouldStar){
	$.ajax( {
		url: star_link,
		method: "GET"
	});
	$("#star-link").html("<i class='fa fa-star"+(shouldStar?'':'-o')+"'></i>")
}
