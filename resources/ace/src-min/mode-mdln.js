/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/mode/mdln', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/modelian_highlight_rules', 'ace/range'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var ModelianHighlightRules = require("./modelian_highlight_rules").ModelianHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new ModelianHighlightRules().getRules(), "i");
};
oop.inherits(Mode, TextMode);

(function() {
    var indentKeywords = {
        "function": 1,
        "then": 1,
        "while": 1,
        "for": 1,
		"end":-1,
        "else":1,
        "else if":1
    };
    var outdentKeywords = [
		"end",
		"else",
		"else if"
    ];

    function getNetIndentLevel(tokens) {
        var level = 0;
        for (var i in tokens){
            var token = tokens[i];
            if (token.type == "keyword") {
                if (token.value in indentKeywords) {
                    level += indentKeywords[token.value];
                }
            } else if (token.type == "paren.lparen") {
                level ++;
            } else if (token.type == "paren.rparen") {
                level --;
            }
        }
        if (level < 0) {
            return -1;
        } else if (level > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        var level = 0;

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (state == "start") {
            level = getNetIndentLevel(tokens);
        }
        if (level > 0) {
            return indent + tab;
        } else if (level < 0 && indent.substr(indent.length - tab.length) == tab) {
            if (!this.checkOutdent(state, line, "\n")) {
                return indent.substr(0, indent.length - tab.length);
            }
        }
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        if (input != "\n" && input != "\r" && input != "\r\n")
            return false;

        if (line.match(/^\s*[\)\}\]]$/))
            return true;

        var tokens = this.$tokenizer.getLineTokens(line.trim(), state).tokens;

        if (!tokens || !tokens.length)
            return false;

        return (tokens[0].type == "keyword" && outdentKeywords.indexOf(tokens[0].value) != -1);
    };

    this.autoOutdent = function(state, session, row) {
        var prevLine = session.getLine(row - 1);
        var prevIndent = this.$getIndent(prevLine).length;
        var prevTokens = this.$tokenizer.getLineTokens(prevLine, "start").tokens;
        var tabLength = session.getTabString().length;
        var expectedIndent = prevIndent + tabLength * getNetIndentLevel(prevTokens);
        var curIndent = this.$getIndent(session.getLine(row)).length;
        if (curIndent < expectedIndent) {
            return;
        }
        session.outdentRows(new Range(row, 0, row + 2, 0));
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/modelian_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ModelianHighlightRules = function() {

    var keywords = (
        "parent|self|new|else|end|for|function|if|in|"+
         "return|then|while|or|and|not|by|to|from|loop|throw|try|catch"
    );

    var builtinConstants = ("true|false|pi|e");

    var functions = (
    "parent|e|pi|phi|randbeta|randdist|randboolean|rand|randnormal|randexp|randlognormal|randbinomial|randnegativebinomial|randgamma|randpoisson|randtriangular|real|imag|magnitude|angle|abs|sin|cos|tan|asin|acos|atan|arcsin|arccos|arctan|sqrt|ln|log|logit|expit|round|ceiling|floor|exp|ifthenelse|map|sample|indexof|contains|collapse|filter|join|repeat|select|reverse|sort|unique|union|intersection|difference|factorial|max|fill|min|mean|sum|product|median|stddev|correlation|count|flatten|setrandseed|alert|console|prompt|confirm|stop|pause|time|timestep|timelength|timestart|timeend|seconds|minutes|hours|days|weeks|months|years|unitless|pastmean|pastmedian|pastvalues|paststddev|pastcorrelation|pastmax|pastmin|pulse|ramp|step|staircase|smooth|delay|delay1|delay3|fix|populationsize|remove|add|findall|resettimer|transition|value|setvalue|findindex|findstate|findnotstate|findnearby|findnearest|findfurthest|index|connect|unconnect|connected|connectionweight|setconnectionweight|die|print|width|height|distance|location|setlocation|move|movetowards|stringbase|vectorbase|agentbase"
    );


    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "support.function": functions,
        "constant.language": builtinConstants,
        "variable.language": "this"
    }, "identifier", true);

    var strPre = "";
	
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var integer = "(?:" + decimalInteger + "|" + hexInteger + ")";

    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var floatNumber = "(?:" + pointFloat + ")";

    var comment_stack = [];

	
    this.$rules = {
        "start" :
        [{
                token : "comment",
                regex : "\\/\\/.*$"
            },
            {
               token : "comment",
               regex : "#.*$"
            },
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            },

        {
            token : "string",           // " string
            regex : strPre + '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "string",           // ' string
            regex : strPre + "'(?:[^\\\\]|\\\\.)*?'"
        }, /*{
            token : "constant.numeric", // material
            regex : "{[^\n]*?}"
        },*/{
            token : "string", // primitive
            regex : "\\[[^\n]*?\\]"
        },  {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|<-|=|\\:|\\.\\.\\.|\\.\\."
        }, {
            token : "paren.lparen",
            regex : "[\\(\\{«]|<<"
        }, {
            token : "paren.rparen",
            regex : "[\\)\\}»]|>>"
        }, {
            token : "text",
            regex : "\\s+"
        } ],

		        "comment" : [
		            {
		                token : "comment", // closing comment
		                regex : ".*?\\*\\/",
		                next : "start"
		            }, {
		                token : "comment", // comment spanning whole line
		                regex : ".+"
		            }
		        ]

    };

}

oop.inherits(ModelianHighlightRules, TextHighlightRules);

exports.ModelianHighlightRules = ModelianHighlightRules;


});

