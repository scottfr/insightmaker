/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/



Ext.onReady(function() {
    setTimeout(function() {
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
    var links = "";
	var arrow = "&uarr;";
    var toolbar = ribbonPanel.getDockedItems()[0];
    if (!toolbar.isVisible()) {
		arrow = "&darr;"
	}
    if (drupal_node_ID == -1) {
        links = '<div style="float:right;padding:0.2em;"><nobr><a href="'+base_path+'/help" target="_blank" >Help</a> | <a href="'+base_path+'/directory" target="_blank">Find More Insights</a> | <a href="javascript:toggleTopBar()"  id="toolbarToggle">'+arrow+'</a></nobr></div>';
    } else {
        if (is_editor) {
            links = '<div style="float:left;padding:0.2em;">';
            links = links + '<a href="'+base_path+'/discussion/' + drupal_node_ID + '" target="_blank" id="commentBut">Insight Discussion</a>';
            links = links + ' | <a href="'+base_path+'/node/' + drupal_node_ID + '/access" target="_blank" id="editBut">Insight Properties</a>';
            links = links + ' | <a href="'+base_path+'/node/' + drupal_node_ID + '/delete" id="deleteBut">Delete Insight</a>';
			links = links + '</div></div>';
      
		} else {
            links = links + '<div style="float:left;padding:0.2em;">';
            links = links + '<a href="'+base_path+'/discussion/' + drupal_node_ID + '" target="_blank" id="commentBut">Insight Discussion</a></div>';
        }
        links = links + '<div style="float:right;padding:0.2em;"><nobr>';
        if (is_embed) {
            links = links + '<a target="_blank" href="'+base_path+'/insight/' + drupal_node_ID + '">Full Screen Insight</a> | ';
        } else {
            links = links + '<a target="_blank" href="'+base_path+'/insight/">Make a New Insight</a> | ';
            links = links + '<a target="_blank" href="'+base_path+'/node/' + drupal_node_ID + '/clone">Duplicate Insight</a> | ';
        }
        links = links + '<a href="'+base_path+'/help" target="_blank">Help</a> | <a href="'+base_path+'/browse" target="_blank">Find More Insights</a> | <a href="javascript:toggleTopBar()" id="toolbarToggle">'+arrow+'</a></nobr></div>';
    }
	
    replace_html(document.getElementById("toplinks-holder"), links);
	

     $('#commentBut').frameWarp({
        url : base_path+'/discussion/' + drupal_node_ID
     });
     $('#editBut').frameWarp({
        url : base_path+'/node/' + drupal_node_ID + "/access"
     });
}

