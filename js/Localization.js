"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

var translations = {};

function getText(src){
	if(translations[src]){
		src = translations[src];
	}
	
	for(var i = 1; i < arguments.length; i++){
		src = src.replace("%s", arguments[i]);
	}
	
	return src;
}
