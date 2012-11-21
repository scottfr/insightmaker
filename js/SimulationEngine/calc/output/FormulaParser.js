/*

Copyright 2010-2012 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (http://insightMaker.com/impl).

*/


var FormulaParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){
    }).call(this);

    FormulaParser.superclass.constructor.call(this, input, state);

    this.dfa5 = new FormulaParser.DFA5(this);

         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(FormulaParser, {
    EOF: -1,
    T__87: 87,
    T__88: 88,
    T__89: 89,
    T__90: 90,
    T__91: 91,
    T__92: 92,
    NEGATE: 4,
    ASSIGN: 5,
    FUNCALL: 6,
    MATERIAL: 7,
    UNIT: 8,
    POWER: 9,
    DEFAULTS: 10,
    PARAMS: 11,
    UNITCLUMP: 12,
    ARRAY: 13,
    LINES: 14,
    WHILE: 15,
    IFTHENELSE: 16,
    ELSE: 17,
    FOR: 18,
    FORIN: 19,
    FUNCTION: 20,
    NEWLINE: 21,
    W: 22,
    H: 23,
    I: 24,
    L: 25,
    E: 26,
    WHILESTATEMENT: 27,
    F: 28,
    O: 29,
    R: 30,
    FORSTATEMENT: 31,
    M: 32,
    FROMSTATEMENT: 33,
    N: 34,
    INSTATEMENT: 35,
    T: 36,
    TOSTATEMENT: 37,
    B: 38,
    Y: 39,
    BYSTATEMENT: 40,
    P: 41,
    LOOPSTATEMENT: 42,
    IFSTATEMENT: 43,
    THENSTATEMENT: 44,
    S: 45,
    ELSESTATEMENT: 46,
    U: 47,
    C: 48,
    FUNCTIONSTATEMENT: 49,
    D: 50,
    ENDBLOCK: 51,
    RETURNSTATEMENT: 52,
    IDENT: 53,
    EQUALS: 54,
    PRIMITIVE: 55,
    OR: 56,
    AND: 57,
    A: 58,
    NOTEQUALS: 59,
    LT: 60,
    LTEQ: 61,
    GT: 62,
    GTEQ: 63,
    PLUS: 64,
    MINUS: 65,
    MULT: 66,
    DIV: 67,
    MOD: 68,
    POW: 69,
    NOT: 70,
    LARR: 71,
    RARR: 72,
    INTEGER: 73,
    FLOAT: 74,
    TRUE: 75,
    FALSE: 76,
    COMMENT: 77,
    LINE_COMMENT: 78,
    WS: 79,
    G: 80,
    J: 81,
    K: 82,
    Q: 83,
    V: 84,
    X: 85,
    Z: 86
});

(function(){
// public class variables
var EOF= -1,
    T__87= 87,
    T__88= 88,
    T__89= 89,
    T__90= 90,
    T__91= 91,
    T__92= 92,
    NEGATE= 4,
    ASSIGN= 5,
    FUNCALL= 6,
    MATERIAL= 7,
    UNIT= 8,
    POWER= 9,
    DEFAULTS= 10,
    PARAMS= 11,
    UNITCLUMP= 12,
    ARRAY= 13,
    LINES= 14,
    WHILE= 15,
    IFTHENELSE= 16,
    ELSE= 17,
    FOR= 18,
    FORIN= 19,
    FUNCTION= 20,
    NEWLINE= 21,
    W= 22,
    H= 23,
    I= 24,
    L= 25,
    E= 26,
    WHILESTATEMENT= 27,
    F= 28,
    O= 29,
    R= 30,
    FORSTATEMENT= 31,
    M= 32,
    FROMSTATEMENT= 33,
    N= 34,
    INSTATEMENT= 35,
    T= 36,
    TOSTATEMENT= 37,
    B= 38,
    Y= 39,
    BYSTATEMENT= 40,
    P= 41,
    LOOPSTATEMENT= 42,
    IFSTATEMENT= 43,
    THENSTATEMENT= 44,
    S= 45,
    ELSESTATEMENT= 46,
    U= 47,
    C= 48,
    FUNCTIONSTATEMENT= 49,
    D= 50,
    ENDBLOCK= 51,
    RETURNSTATEMENT= 52,
    IDENT= 53,
    EQUALS= 54,
    PRIMITIVE= 55,
    OR= 56,
    AND= 57,
    A= 58,
    NOTEQUALS= 59,
    LT= 60,
    LTEQ= 61,
    GT= 62,
    GTEQ= 63,
    PLUS= 64,
    MINUS= 65,
    MULT= 66,
    DIV= 67,
    MOD= 68,
    POW= 69,
    NOT= 70,
    LARR= 71,
    RARR= 72,
    INTEGER= 73,
    FLOAT= 74,
    TRUE= 75,
    FALSE= 76,
    COMMENT= 77,
    LINE_COMMENT= 78,
    WS= 79,
    G= 80,
    J= 81,
    K= 82,
    Q= 83,
    V= 84,
    X= 85,
    Z= 86;

// public instance methods/vars
org.antlr.lang.extend(FormulaParser, org.antlr.runtime.Parser, {
        
    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return FormulaParser.tokenNames; },
    getGrammarFileName: function() { return "/Library/WebServer/Documents/calc/Formula.g"; }
});
org.antlr.lang.augmentObject(FormulaParser.prototype, {

    // inline static return class
    lines_return: (function() {
        FormulaParser.lines_return = function(){};
        org.antlr.lang.extend(FormulaParser.lines_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:32:1: lines : ( NEWLINE )* ( expression ( ( NEWLINE )+ | EOF ) )* EOF -> ^( LINES ( expression )* ) ;
    // $ANTLR start "lines"
    lines: function() {
        var retval = new FormulaParser.lines_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NEWLINE1 = null;
        var NEWLINE3 = null;
        var EOF4 = null;
        var EOF5 = null;
         var expression2 = null;

        var NEWLINE1_tree=null;
        var NEWLINE3_tree=null;
        var EOF4_tree=null;
        var EOF5_tree=null;
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_EOF=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EOF");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:33:2: ( ( NEWLINE )* ( expression ( ( NEWLINE )+ | EOF ) )* EOF -> ^( LINES ( expression )* ) )
            // /Library/WebServer/Documents/calc/Formula.g:33:4: ( NEWLINE )* ( expression ( ( NEWLINE )+ | EOF ) )* EOF
            // /Library/WebServer/Documents/calc/Formula.g:33:4: ( NEWLINE )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NEWLINE) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:33:4: NEWLINE
                    NEWLINE1=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_lines112); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE1);



                    break;

                default :
                    break loop1;
                }
            } while (true);

            // /Library/WebServer/Documents/calc/Formula.g:33:13: ( expression ( ( NEWLINE )+ | EOF ) )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( (LA4_0==WHILESTATEMENT||LA4_0==FORSTATEMENT||LA4_0==IFSTATEMENT||LA4_0==FUNCTIONSTATEMENT||LA4_0==IDENT||LA4_0==PRIMITIVE||LA4_0==MINUS||(LA4_0>=NOT && LA4_0<=LARR)||(LA4_0>=INTEGER && LA4_0<=FALSE)||LA4_0==87||LA4_0==91) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:33:14: expression ( ( NEWLINE )+ | EOF )
                    this.pushFollow(FormulaParser.FOLLOW_expression_in_lines116);
                    expression2=this.expression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_expression.add(expression2.getTree());
                    // /Library/WebServer/Documents/calc/Formula.g:33:26: ( ( NEWLINE )+ | EOF )
                    var alt3=2;
                    var LA3_0 = this.input.LA(1);

                    if ( (LA3_0==NEWLINE) ) {
                        alt3=1;
                    }
                    else if ( (LA3_0==EOF) ) {
                        alt3=2;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                        throw nvae;
                    }
                    switch (alt3) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:33:27: ( NEWLINE )+
                            // /Library/WebServer/Documents/calc/Formula.g:33:27: ( NEWLINE )+
                            var cnt2=0;
                            loop2:
                            do {
                                var alt2=2;
                                var LA2_0 = this.input.LA(1);

                                if ( (LA2_0==NEWLINE) ) {
                                    alt2=1;
                                }


                                switch (alt2) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:33:27: NEWLINE
                                    NEWLINE3=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_lines120); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE3);



                                    break;

                                default :
                                    if ( cnt2 >= 1 ) {
                                        break loop2;
                                    }
                                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                        var eee = new org.antlr.runtime.EarlyExitException(2, this.input);
                                        throw eee;
                                }
                                cnt2++;
                            } while (true);



                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:33:36: EOF
                            EOF4=this.match(this.input,EOF,FormulaParser.FOLLOW_EOF_in_lines123); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_EOF.add(EOF4);



                            break;

                    }



                    break;

                default :
                    break loop4;
                }
            } while (true);

            EOF5=this.match(this.input,EOF,FormulaParser.FOLLOW_EOF_in_lines128); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_EOF.add(EOF5);



            // AST REWRITE
            // elements: expression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 33:47: -> ^( LINES ( expression )* )
            {
                // /Library/WebServer/Documents/calc/Formula.g:33:50: ^( LINES ( expression )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(LINES, "LINES"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:33:58: ( expression )*
                while ( stream_expression.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_expression.nextTree());

                }
                stream_expression.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    expression_return: (function() {
        FormulaParser.expression_return = function(){};
        org.antlr.lang.extend(FormulaParser.expression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:92:1: expression : ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef );
    // $ANTLR start "expression"
    expression: function() {
        var retval = new FormulaParser.expression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var assignment6 = null;
         var logicalExpression7 = null;
         var whileLoop8 = null;
         var forLoop9 = null;
         var forInLoop10 = null;
         var ifThenElse11 = null;
         var functionDef12 = null;


        try {
            // /Library/WebServer/Documents/calc/Formula.g:93:2: ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef )
            var alt5=7;
            alt5 = this.dfa5.predict(this.input);
            switch (alt5) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:93:5: assignment
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_assignment_in_expression390);
                    assignment6=this.assignment();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, assignment6.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:94:5: logicalExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_expression396);
                    logicalExpression7=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, logicalExpression7.getTree());


                    break;
                case 3 :
                    // /Library/WebServer/Documents/calc/Formula.g:95:5: whileLoop
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_whileLoop_in_expression402);
                    whileLoop8=this.whileLoop();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, whileLoop8.getTree());


                    break;
                case 4 :
                    // /Library/WebServer/Documents/calc/Formula.g:96:5: forLoop
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_forLoop_in_expression408);
                    forLoop9=this.forLoop();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, forLoop9.getTree());


                    break;
                case 5 :
                    // /Library/WebServer/Documents/calc/Formula.g:97:5: forInLoop
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_forInLoop_in_expression414);
                    forInLoop10=this.forInLoop();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, forInLoop10.getTree());


                    break;
                case 6 :
                    // /Library/WebServer/Documents/calc/Formula.g:98:5: ifThenElse
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_ifThenElse_in_expression420);
                    ifThenElse11=this.ifThenElse();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, ifThenElse11.getTree());


                    break;
                case 7 :
                    // /Library/WebServer/Documents/calc/Formula.g:99:5: functionDef
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_functionDef_in_expression426);
                    functionDef12=this.functionDef();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, functionDef12.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    innerBlock_return: (function() {
        FormulaParser.innerBlock_return = function(){};
        org.antlr.lang.extend(FormulaParser.innerBlock_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:102:1: innerBlock : ( expression ( ( NEWLINE )+ ) )* -> ^( LINES ( expression )+ ) ;
    // $ANTLR start "innerBlock"
    innerBlock: function() {
        var retval = new FormulaParser.innerBlock_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NEWLINE14 = null;
         var expression13 = null;

        var NEWLINE14_tree=null;
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:103:2: ( ( expression ( ( NEWLINE )+ ) )* -> ^( LINES ( expression )+ ) )
            // /Library/WebServer/Documents/calc/Formula.g:103:4: ( expression ( ( NEWLINE )+ ) )*
            // /Library/WebServer/Documents/calc/Formula.g:103:4: ( expression ( ( NEWLINE )+ ) )*
            loop7:
            do {
                var alt7=2;
                var LA7_0 = this.input.LA(1);

                if ( (LA7_0==WHILESTATEMENT||LA7_0==FORSTATEMENT||LA7_0==IFSTATEMENT||LA7_0==FUNCTIONSTATEMENT||LA7_0==IDENT||LA7_0==PRIMITIVE||LA7_0==MINUS||(LA7_0>=NOT && LA7_0<=LARR)||(LA7_0>=INTEGER && LA7_0<=FALSE)||LA7_0==87||LA7_0==91) ) {
                    alt7=1;
                }


                switch (alt7) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:103:5: expression ( ( NEWLINE )+ )
                    this.pushFollow(FormulaParser.FOLLOW_expression_in_innerBlock438);
                    expression13=this.expression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_expression.add(expression13.getTree());
                    // /Library/WebServer/Documents/calc/Formula.g:103:17: ( ( NEWLINE )+ )
                    // /Library/WebServer/Documents/calc/Formula.g:103:18: ( NEWLINE )+
                    // /Library/WebServer/Documents/calc/Formula.g:103:18: ( NEWLINE )+
                    var cnt6=0;
                    loop6:
                    do {
                        var alt6=2;
                        var LA6_0 = this.input.LA(1);

                        if ( (LA6_0==NEWLINE) ) {
                            alt6=1;
                        }


                        switch (alt6) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:103:18: NEWLINE
                            NEWLINE14=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_innerBlock442); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE14);



                            break;

                        default :
                            if ( cnt6 >= 1 ) {
                                break loop6;
                            }
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var eee = new org.antlr.runtime.EarlyExitException(6, this.input);
                                throw eee;
                        }
                        cnt6++;
                    } while (true);






                    break;

                default :
                    break loop7;
                }
            } while (true);



            // AST REWRITE
            // elements: expression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 103:30: -> ^( LINES ( expression )+ )
            {
                // /Library/WebServer/Documents/calc/Formula.g:103:33: ^( LINES ( expression )+ )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(LINES, "LINES"), root_1);

                if ( !(stream_expression.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_expression.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_expression.nextTree());

                }
                stream_expression.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    whileLoop_return: (function() {
        FormulaParser.whileLoop_return = function(){};
        org.antlr.lang.extend(FormulaParser.whileLoop_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:106:1: whileLoop : WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( WHILE logicalExpression innerBlock ) ;
    // $ANTLR start "whileLoop"
    whileLoop: function() {
        var retval = new FormulaParser.whileLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var WHILESTATEMENT15 = null;
        var NEWLINE17 = null;
        var ENDBLOCK19 = null;
        var LOOPSTATEMENT20 = null;
         var logicalExpression16 = null;
         var innerBlock18 = null;

        var WHILESTATEMENT15_tree=null;
        var NEWLINE17_tree=null;
        var ENDBLOCK19_tree=null;
        var LOOPSTATEMENT20_tree=null;
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_LOOPSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOPSTATEMENT");
        var stream_WHILESTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token WHILESTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:107:2: ( WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( WHILE logicalExpression innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:107:4: WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            WHILESTATEMENT15=this.match(this.input,WHILESTATEMENT,FormulaParser.FOLLOW_WHILESTATEMENT_in_whileLoop467); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_WHILESTATEMENT.add(WHILESTATEMENT15);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_whileLoop469);
            logicalExpression16=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression16.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:107:37: ( NEWLINE )+
            var cnt8=0;
            loop8:
            do {
                var alt8=2;
                var LA8_0 = this.input.LA(1);

                if ( (LA8_0==NEWLINE) ) {
                    alt8=1;
                }


                switch (alt8) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:107:37: NEWLINE
                    NEWLINE17=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_whileLoop471); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE17);



                    break;

                default :
                    if ( cnt8 >= 1 ) {
                        break loop8;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(8, this.input);
                        throw eee;
                }
                cnt8++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_whileLoop474);
            innerBlock18=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock18.getTree());
            ENDBLOCK19=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_whileLoop477); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK19);

            LOOPSTATEMENT20=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_whileLoop479); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT20);



            // AST REWRITE
            // elements: innerBlock, logicalExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 107:81: -> ^( WHILE logicalExpression innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:107:84: ^( WHILE logicalExpression innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(WHILE, "WHILE"), root_1);

                this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());
                this.adaptor.addChild(root_1, stream_innerBlock.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    forLoop_return: (function() {
        FormulaParser.forLoop_return = function(){};
        org.antlr.lang.extend(FormulaParser.forLoop_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:110:1: forLoop : FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock ) ;
    // $ANTLR start "forLoop"
    forLoop: function() {
        var retval = new FormulaParser.forLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FORSTATEMENT21 = null;
        var IDENT22 = null;
        var FROMSTATEMENT23 = null;
        var TOSTATEMENT25 = null;
        var BYSTATEMENT27 = null;
        var NEWLINE29 = null;
        var ENDBLOCK31 = null;
        var LOOPSTATEMENT32 = null;
         var logicalExpression24 = null;
         var logicalExpression26 = null;
         var logicalExpression28 = null;
         var innerBlock30 = null;

        var FORSTATEMENT21_tree=null;
        var IDENT22_tree=null;
        var FROMSTATEMENT23_tree=null;
        var TOSTATEMENT25_tree=null;
        var BYSTATEMENT27_tree=null;
        var NEWLINE29_tree=null;
        var ENDBLOCK31_tree=null;
        var LOOPSTATEMENT32_tree=null;
        var stream_FORSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FORSTATEMENT");
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_FROMSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FROMSTATEMENT");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_TOSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token TOSTATEMENT");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_LOOPSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOPSTATEMENT");
        var stream_BYSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token BYSTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:111:2: ( FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:111:4: FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            FORSTATEMENT21=this.match(this.input,FORSTATEMENT,FormulaParser.FOLLOW_FORSTATEMENT_in_forLoop500); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FORSTATEMENT.add(FORSTATEMENT21);

            IDENT22=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_forLoop502); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT22);

            FROMSTATEMENT23=this.match(this.input,FROMSTATEMENT,FormulaParser.FOLLOW_FROMSTATEMENT_in_forLoop504); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FROMSTATEMENT.add(FROMSTATEMENT23);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop506);
            logicalExpression24=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression24.getTree());
            TOSTATEMENT25=this.match(this.input,TOSTATEMENT,FormulaParser.FOLLOW_TOSTATEMENT_in_forLoop508); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_TOSTATEMENT.add(TOSTATEMENT25);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop510);
            logicalExpression26=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression26.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:111:85: ( BYSTATEMENT logicalExpression )?
            var alt9=2;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0==BYSTATEMENT) ) {
                alt9=1;
            }
            switch (alt9) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:111:86: BYSTATEMENT logicalExpression
                    BYSTATEMENT27=this.match(this.input,BYSTATEMENT,FormulaParser.FOLLOW_BYSTATEMENT_in_forLoop513); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_BYSTATEMENT.add(BYSTATEMENT27);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop515);
                    logicalExpression28=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression28.getTree());


                    break;

            }

            // /Library/WebServer/Documents/calc/Formula.g:111:118: ( NEWLINE )+
            var cnt10=0;
            loop10:
            do {
                var alt10=2;
                var LA10_0 = this.input.LA(1);

                if ( (LA10_0==NEWLINE) ) {
                    alt10=1;
                }


                switch (alt10) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:111:118: NEWLINE
                    NEWLINE29=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_forLoop519); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE29);



                    break;

                default :
                    if ( cnt10 >= 1 ) {
                        break loop10;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(10, this.input);
                        throw eee;
                }
                cnt10++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_forLoop522);
            innerBlock30=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock30.getTree());
            ENDBLOCK31=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_forLoop525); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK31);

            LOOPSTATEMENT32=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_forLoop527); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT32);



            // AST REWRITE
            // elements: logicalExpression, IDENT, innerBlock
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 111:162: -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:111:165: ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FOR, "FOR"), root_1);

                this.adaptor.addChild(root_1, stream_IDENT.nextNode());
                // /Library/WebServer/Documents/calc/Formula.g:111:177: ^( PARAMS ( logicalExpression )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:111:186: ( logicalExpression )*
                while ( stream_logicalExpression.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_logicalExpression.nextTree());

                }
                stream_logicalExpression.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                this.adaptor.addChild(root_1, stream_innerBlock.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    forInLoop_return: (function() {
        FormulaParser.forInLoop_return = function(){};
        org.antlr.lang.extend(FormulaParser.forInLoop_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:114:1: forInLoop : FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FORIN IDENT logicalExpression innerBlock ) ;
    // $ANTLR start "forInLoop"
    forInLoop: function() {
        var retval = new FormulaParser.forInLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FORSTATEMENT33 = null;
        var IDENT34 = null;
        var INSTATEMENT35 = null;
        var NEWLINE37 = null;
        var ENDBLOCK39 = null;
        var LOOPSTATEMENT40 = null;
         var logicalExpression36 = null;
         var innerBlock38 = null;

        var FORSTATEMENT33_tree=null;
        var IDENT34_tree=null;
        var INSTATEMENT35_tree=null;
        var NEWLINE37_tree=null;
        var ENDBLOCK39_tree=null;
        var LOOPSTATEMENT40_tree=null;
        var stream_FORSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FORSTATEMENT");
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_LOOPSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOPSTATEMENT");
        var stream_INSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token INSTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:115:2: ( FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FORIN IDENT logicalExpression innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:115:4: FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            FORSTATEMENT33=this.match(this.input,FORSTATEMENT,FormulaParser.FOLLOW_FORSTATEMENT_in_forInLoop555); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FORSTATEMENT.add(FORSTATEMENT33);

            IDENT34=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_forInLoop557); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT34);

            INSTATEMENT35=this.match(this.input,INSTATEMENT,FormulaParser.FOLLOW_INSTATEMENT_in_forInLoop559); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_INSTATEMENT.add(INSTATEMENT35);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forInLoop561);
            logicalExpression36=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression36.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:115:53: ( NEWLINE )+
            var cnt11=0;
            loop11:
            do {
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( (LA11_0==NEWLINE) ) {
                    alt11=1;
                }


                switch (alt11) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:115:53: NEWLINE
                    NEWLINE37=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_forInLoop563); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE37);



                    break;

                default :
                    if ( cnt11 >= 1 ) {
                        break loop11;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(11, this.input);
                        throw eee;
                }
                cnt11++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_forInLoop566);
            innerBlock38=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock38.getTree());
            ENDBLOCK39=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_forInLoop569); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK39);

            LOOPSTATEMENT40=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_forInLoop571); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT40);



            // AST REWRITE
            // elements: logicalExpression, innerBlock, IDENT
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 115:98: -> ^( FORIN IDENT logicalExpression innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:115:101: ^( FORIN IDENT logicalExpression innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FORIN, "FORIN"), root_1);

                this.adaptor.addChild(root_1, stream_IDENT.nextNode());
                this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());
                this.adaptor.addChild(root_1, stream_innerBlock.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    ifThenElse_return: (function() {
        FormulaParser.ifThenElse_return = function(){};
        org.antlr.lang.extend(FormulaParser.ifThenElse_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:118:1: ifThenElse : IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) ) ;
    // $ANTLR start "ifThenElse"
    ifThenElse: function() {
        var retval = new FormulaParser.ifThenElse_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IFSTATEMENT41 = null;
        var THENSTATEMENT43 = null;
        var NEWLINE44 = null;
        var ELSESTATEMENT46 = null;
        var IFSTATEMENT47 = null;
        var THENSTATEMENT49 = null;
        var NEWLINE50 = null;
        var ELSESTATEMENT52 = null;
        var NEWLINE53 = null;
        var ENDBLOCK55 = null;
        var IFSTATEMENT56 = null;
         var logicalExpression42 = null;
         var innerBlock45 = null;
         var logicalExpression48 = null;
         var innerBlock51 = null;
         var innerBlock54 = null;

        var IFSTATEMENT41_tree=null;
        var THENSTATEMENT43_tree=null;
        var NEWLINE44_tree=null;
        var ELSESTATEMENT46_tree=null;
        var IFSTATEMENT47_tree=null;
        var THENSTATEMENT49_tree=null;
        var NEWLINE50_tree=null;
        var ELSESTATEMENT52_tree=null;
        var NEWLINE53_tree=null;
        var ENDBLOCK55_tree=null;
        var IFSTATEMENT56_tree=null;
        var stream_IFSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IFSTATEMENT");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_ELSESTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ELSESTATEMENT");
        var stream_THENSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token THENSTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:119:2: ( IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) ) )
            // /Library/WebServer/Documents/calc/Formula.g:119:4: IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT
            IFSTATEMENT41=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse596); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT41);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_ifThenElse598);
            logicalExpression42=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression42.getTree());
            THENSTATEMENT43=this.match(this.input,THENSTATEMENT,FormulaParser.FOLLOW_THENSTATEMENT_in_ifThenElse600); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_THENSTATEMENT.add(THENSTATEMENT43);

            // /Library/WebServer/Documents/calc/Formula.g:119:49: ( NEWLINE )+
            var cnt12=0;
            loop12:
            do {
                var alt12=2;
                var LA12_0 = this.input.LA(1);

                if ( (LA12_0==NEWLINE) ) {
                    alt12=1;
                }


                switch (alt12) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:119:49: NEWLINE
                    NEWLINE44=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse603); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE44);



                    break;

                default :
                    if ( cnt12 >= 1 ) {
                        break loop12;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(12, this.input);
                        throw eee;
                }
                cnt12++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse606);
            innerBlock45=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock45.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:119:70: ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )*
            loop14:
            do {
                var alt14=2;
                var LA14_0 = this.input.LA(1);

                if ( (LA14_0==ELSESTATEMENT) ) {
                    var LA14_1 = this.input.LA(2);

                    if ( (LA14_1==IFSTATEMENT) ) {
                        alt14=1;
                    }


                }


                switch (alt14) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:119:71: ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock
                    ELSESTATEMENT46=this.match(this.input,ELSESTATEMENT,FormulaParser.FOLLOW_ELSESTATEMENT_in_ifThenElse610); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_ELSESTATEMENT.add(ELSESTATEMENT46);

                    IFSTATEMENT47=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse612); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT47);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_ifThenElse614);
                    logicalExpression48=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression48.getTree());
                    THENSTATEMENT49=this.match(this.input,THENSTATEMENT,FormulaParser.FOLLOW_THENSTATEMENT_in_ifThenElse616); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_THENSTATEMENT.add(THENSTATEMENT49);

                    // /Library/WebServer/Documents/calc/Formula.g:119:129: ( NEWLINE )+
                    var cnt13=0;
                    loop13:
                    do {
                        var alt13=2;
                        var LA13_0 = this.input.LA(1);

                        if ( (LA13_0==NEWLINE) ) {
                            alt13=1;
                        }


                        switch (alt13) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:119:129: NEWLINE
                            NEWLINE50=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse618); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE50);



                            break;

                        default :
                            if ( cnt13 >= 1 ) {
                                break loop13;
                            }
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var eee = new org.antlr.runtime.EarlyExitException(13, this.input);
                                throw eee;
                        }
                        cnt13++;
                    } while (true);

                    this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse621);
                    innerBlock51=this.innerBlock();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock51.getTree());


                    break;

                default :
                    break loop14;
                }
            } while (true);

            // /Library/WebServer/Documents/calc/Formula.g:119:151: ( ELSESTATEMENT ( NEWLINE )+ innerBlock )?
            var alt16=2;
            var LA16_0 = this.input.LA(1);

            if ( (LA16_0==ELSESTATEMENT) ) {
                alt16=1;
            }
            switch (alt16) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:119:152: ELSESTATEMENT ( NEWLINE )+ innerBlock
                    ELSESTATEMENT52=this.match(this.input,ELSESTATEMENT,FormulaParser.FOLLOW_ELSESTATEMENT_in_ifThenElse626); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_ELSESTATEMENT.add(ELSESTATEMENT52);

                    // /Library/WebServer/Documents/calc/Formula.g:119:166: ( NEWLINE )+
                    var cnt15=0;
                    loop15:
                    do {
                        var alt15=2;
                        var LA15_0 = this.input.LA(1);

                        if ( (LA15_0==NEWLINE) ) {
                            alt15=1;
                        }


                        switch (alt15) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:119:166: NEWLINE
                            NEWLINE53=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse628); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE53);



                            break;

                        default :
                            if ( cnt15 >= 1 ) {
                                break loop15;
                            }
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var eee = new org.antlr.runtime.EarlyExitException(15, this.input);
                                throw eee;
                        }
                        cnt15++;
                    } while (true);

                    this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse631);
                    innerBlock54=this.innerBlock();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock54.getTree());


                    break;

            }

            ENDBLOCK55=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_ifThenElse635); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK55);

            IFSTATEMENT56=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse637); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT56);



            // AST REWRITE
            // elements: logicalExpression, innerBlock
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 119:209: -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) )
            {
                // /Library/WebServer/Documents/calc/Formula.g:119:212: ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(IFTHENELSE, "IFTHENELSE"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:119:225: ^( PARAMS ( logicalExpression )+ )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                if ( !(stream_logicalExpression.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_logicalExpression.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_logicalExpression.nextTree());

                }
                stream_logicalExpression.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                // /Library/WebServer/Documents/calc/Formula.g:119:254: ^( PARAMS ( innerBlock )+ )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                if ( !(stream_innerBlock.hasNext()) ) {
                    throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                }
                while ( stream_innerBlock.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_innerBlock.nextTree());

                }
                stream_innerBlock.reset();

                this.adaptor.addChild(root_1, root_2);
                }

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    functionDef_return: (function() {
        FormulaParser.functionDef_return = function(){};
        org.antlr.lang.extend(FormulaParser.functionDef_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:122:1: functionDef : FUNCTIONSTATEMENT IDENT '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock ) ;
    // $ANTLR start "functionDef"
    functionDef: function() {
        var retval = new FormulaParser.functionDef_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FUNCTIONSTATEMENT57 = null;
        var IDENT58 = null;
        var char_literal59 = null;
        var IDENT60 = null;
        var EQUALS61 = null;
        var char_literal63 = null;
        var IDENT64 = null;
        var char_literal65 = null;
        var IDENT66 = null;
        var EQUALS67 = null;
        var char_literal69 = null;
        var NEWLINE70 = null;
        var ENDBLOCK72 = null;
        var FUNCTIONSTATEMENT73 = null;
         var number62 = null;
         var number68 = null;
         var innerBlock71 = null;

        var FUNCTIONSTATEMENT57_tree=null;
        var IDENT58_tree=null;
        var char_literal59_tree=null;
        var IDENT60_tree=null;
        var EQUALS61_tree=null;
        var char_literal63_tree=null;
        var IDENT64_tree=null;
        var char_literal65_tree=null;
        var IDENT66_tree=null;
        var EQUALS67_tree=null;
        var char_literal69_tree=null;
        var NEWLINE70_tree=null;
        var ENDBLOCK72_tree=null;
        var FUNCTIONSTATEMENT73_tree=null;
        var stream_FUNCTIONSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FUNCTIONSTATEMENT");
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_EQUALS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EQUALS");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_number=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule number");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:123:2: ( FUNCTIONSTATEMENT IDENT '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:123:4: FUNCTIONSTATEMENT IDENT '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT
            FUNCTIONSTATEMENT57=this.match(this.input,FUNCTIONSTATEMENT,FormulaParser.FOLLOW_FUNCTIONSTATEMENT_in_functionDef668); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FUNCTIONSTATEMENT.add(FUNCTIONSTATEMENT57);

            IDENT58=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef670); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT58);

            char_literal59=this.match(this.input,87,FormulaParser.FOLLOW_87_in_functionDef672); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_87.add(char_literal59);

            IDENT60=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef674); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT60);

            // /Library/WebServer/Documents/calc/Formula.g:123:39: ( EQUALS number | ( ',' IDENT )* )
            var alt18=2;
            var LA18_0 = this.input.LA(1);

            if ( (LA18_0==EQUALS) ) {
                alt18=1;
            }
            else if ( ((LA18_0>=88 && LA18_0<=89)) ) {
                alt18=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 18, 0, this.input);

                throw nvae;
            }
            switch (alt18) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:123:40: EQUALS number
                    EQUALS61=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_functionDef678); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS61);

                    this.pushFollow(FormulaParser.FOLLOW_number_in_functionDef680);
                    number62=this.number();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_number.add(number62.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:123:56: ( ',' IDENT )*
                    // /Library/WebServer/Documents/calc/Formula.g:123:56: ( ',' IDENT )*
                    loop17:
                    do {
                        var alt17=2;
                        var LA17_0 = this.input.LA(1);

                        if ( (LA17_0==88) ) {
                            var LA17_1 = this.input.LA(2);

                            if ( (LA17_1==IDENT) ) {
                                var LA17_3 = this.input.LA(3);

                                if ( ((LA17_3>=88 && LA17_3<=89)) ) {
                                    alt17=1;
                                }


                            }


                        }


                        switch (alt17) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:123:57: ',' IDENT
                            char_literal63=this.match(this.input,88,FormulaParser.FOLLOW_88_in_functionDef685); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_88.add(char_literal63);

                            IDENT64=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef687); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT64);



                            break;

                        default :
                            break loop17;
                        }
                    } while (true);



                    break;

            }

            // /Library/WebServer/Documents/calc/Formula.g:123:71: ( ',' IDENT EQUALS number )*
            loop19:
            do {
                var alt19=2;
                var LA19_0 = this.input.LA(1);

                if ( (LA19_0==88) ) {
                    alt19=1;
                }


                switch (alt19) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:123:72: ',' IDENT EQUALS number
                    char_literal65=this.match(this.input,88,FormulaParser.FOLLOW_88_in_functionDef694); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_88.add(char_literal65);

                    IDENT66=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef696); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT66);

                    EQUALS67=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_functionDef698); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS67);

                    this.pushFollow(FormulaParser.FOLLOW_number_in_functionDef700);
                    number68=this.number();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_number.add(number68.getTree());


                    break;

                default :
                    break loop19;
                }
            } while (true);

            char_literal69=this.match(this.input,89,FormulaParser.FOLLOW_89_in_functionDef705); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_89.add(char_literal69);

            // /Library/WebServer/Documents/calc/Formula.g:123:103: ( NEWLINE )+
            var cnt20=0;
            loop20:
            do {
                var alt20=2;
                var LA20_0 = this.input.LA(1);

                if ( (LA20_0==NEWLINE) ) {
                    alt20=1;
                }


                switch (alt20) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:123:103: NEWLINE
                    NEWLINE70=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_functionDef707); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE70);



                    break;

                default :
                    if ( cnt20 >= 1 ) {
                        break loop20;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(20, this.input);
                        throw eee;
                }
                cnt20++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_functionDef710);
            innerBlock71=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock71.getTree());
            ENDBLOCK72=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_functionDef713); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK72);

            FUNCTIONSTATEMENT73=this.match(this.input,FUNCTIONSTATEMENT,FormulaParser.FOLLOW_FUNCTIONSTATEMENT_in_functionDef715); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FUNCTIONSTATEMENT.add(FUNCTIONSTATEMENT73);



            // AST REWRITE
            // elements: innerBlock, number, IDENT
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 123:151: -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:123:154: ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCTION, "FUNCTION"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:123:165: ^( PARAMS ( IDENT )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:123:174: ( IDENT )*
                while ( stream_IDENT.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_IDENT.nextNode());

                }
                stream_IDENT.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                // /Library/WebServer/Documents/calc/Formula.g:123:182: ^( DEFAULTS ( number )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(DEFAULTS, "DEFAULTS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:123:193: ( number )*
                while ( stream_number.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_number.nextTree());

                }
                stream_number.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                this.adaptor.addChild(root_1, stream_innerBlock.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    assignment_return: (function() {
        FormulaParser.assignment_return = function(){};
        org.antlr.lang.extend(FormulaParser.assignment_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:126:1: assignment : ( PRIMITIVE | IDENT ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )? ) '<-' logicalExpression -> ^( ASSIGN ( PRIMITIVE )* ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression ) ;
    // $ANTLR start "assignment"
    assignment: function() {
        var retval = new FormulaParser.assignment_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var PRIMITIVE74 = null;
        var IDENT75 = null;
        var char_literal76 = null;
        var IDENT77 = null;
        var EQUALS78 = null;
        var char_literal80 = null;
        var IDENT81 = null;
        var char_literal82 = null;
        var IDENT83 = null;
        var EQUALS84 = null;
        var char_literal86 = null;
        var string_literal87 = null;
         var number79 = null;
         var number85 = null;
         var logicalExpression88 = null;

        var PRIMITIVE74_tree=null;
        var IDENT75_tree=null;
        var char_literal76_tree=null;
        var IDENT77_tree=null;
        var EQUALS78_tree=null;
        var char_literal80_tree=null;
        var IDENT81_tree=null;
        var char_literal82_tree=null;
        var IDENT83_tree=null;
        var EQUALS84_tree=null;
        var char_literal86_tree=null;
        var string_literal87_tree=null;
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_EQUALS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token EQUALS");
        var stream_90=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 90");
        var stream_PRIMITIVE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token PRIMITIVE");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_number=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule number");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:127:2: ( ( PRIMITIVE | IDENT ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )? ) '<-' logicalExpression -> ^( ASSIGN ( PRIMITIVE )* ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression ) )
            // /Library/WebServer/Documents/calc/Formula.g:128:2: ( PRIMITIVE | IDENT ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )? ) '<-' logicalExpression
            // /Library/WebServer/Documents/calc/Formula.g:128:2: ( PRIMITIVE | IDENT ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )? )
            var alt25=2;
            var LA25_0 = this.input.LA(1);

            if ( (LA25_0==PRIMITIVE) ) {
                alt25=1;
            }
            else if ( (LA25_0==IDENT) ) {
                alt25=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 25, 0, this.input);

                throw nvae;
            }
            switch (alt25) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:128:3: PRIMITIVE
                    PRIMITIVE74=this.match(this.input,PRIMITIVE,FormulaParser.FOLLOW_PRIMITIVE_in_assignment751); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_PRIMITIVE.add(PRIMITIVE74);



                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:128:15: IDENT ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )?
                    IDENT75=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment755); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT75);

                    // /Library/WebServer/Documents/calc/Formula.g:128:21: ( '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')' )?
                    var alt24=2;
                    var LA24_0 = this.input.LA(1);

                    if ( (LA24_0==87) ) {
                        alt24=1;
                    }
                    switch (alt24) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:128:22: '(' IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* ')'
                            char_literal76=this.match(this.input,87,FormulaParser.FOLLOW_87_in_assignment758); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_87.add(char_literal76);

                            IDENT77=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment760); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT77);

                            // /Library/WebServer/Documents/calc/Formula.g:128:33: ( EQUALS number | ( ',' IDENT )* )
                            var alt22=2;
                            var LA22_0 = this.input.LA(1);

                            if ( (LA22_0==EQUALS) ) {
                                alt22=1;
                            }
                            else if ( ((LA22_0>=88 && LA22_0<=89)) ) {
                                alt22=2;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 22, 0, this.input);

                                throw nvae;
                            }
                            switch (alt22) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:128:34: EQUALS number
                                    EQUALS78=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_assignment764); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS78);

                                    this.pushFollow(FormulaParser.FOLLOW_number_in_assignment766);
                                    number79=this.number();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_number.add(number79.getTree());


                                    break;
                                case 2 :
                                    // /Library/WebServer/Documents/calc/Formula.g:128:50: ( ',' IDENT )*
                                    // /Library/WebServer/Documents/calc/Formula.g:128:50: ( ',' IDENT )*
                                    loop21:
                                    do {
                                        var alt21=2;
                                        var LA21_0 = this.input.LA(1);

                                        if ( (LA21_0==88) ) {
                                            var LA21_1 = this.input.LA(2);

                                            if ( (LA21_1==IDENT) ) {
                                                var LA21_3 = this.input.LA(3);

                                                if ( ((LA21_3>=88 && LA21_3<=89)) ) {
                                                    alt21=1;
                                                }


                                            }


                                        }


                                        switch (alt21) {
                                        case 1 :
                                            // /Library/WebServer/Documents/calc/Formula.g:128:51: ',' IDENT
                                            char_literal80=this.match(this.input,88,FormulaParser.FOLLOW_88_in_assignment771); if (this.state.failed) return retval; 
                                            if ( this.state.backtracking===0 ) stream_88.add(char_literal80);

                                            IDENT81=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment773); if (this.state.failed) return retval; 
                                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT81);



                                            break;

                                        default :
                                            break loop21;
                                        }
                                    } while (true);



                                    break;

                            }

                            // /Library/WebServer/Documents/calc/Formula.g:128:65: ( ',' IDENT EQUALS number )*
                            loop23:
                            do {
                                var alt23=2;
                                var LA23_0 = this.input.LA(1);

                                if ( (LA23_0==88) ) {
                                    alt23=1;
                                }


                                switch (alt23) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:128:66: ',' IDENT EQUALS number
                                    char_literal82=this.match(this.input,88,FormulaParser.FOLLOW_88_in_assignment780); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_88.add(char_literal82);

                                    IDENT83=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment782); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT83);

                                    EQUALS84=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_assignment784); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS84);

                                    this.pushFollow(FormulaParser.FOLLOW_number_in_assignment786);
                                    number85=this.number();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_number.add(number85.getTree());


                                    break;

                                default :
                                    break loop23;
                                }
                            } while (true);

                            char_literal86=this.match(this.input,89,FormulaParser.FOLLOW_89_in_assignment791); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_89.add(char_literal86);



                            break;

                    }



                    break;

            }

            string_literal87=this.match(this.input,90,FormulaParser.FOLLOW_90_in_assignment796); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_90.add(string_literal87);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_assignment798);
            logicalExpression88=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression88.getTree());


            // AST REWRITE
            // elements: number, IDENT, logicalExpression, PRIMITIVE
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 128:123: -> ^( ASSIGN ( PRIMITIVE )* ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression )
            {
                // /Library/WebServer/Documents/calc/Formula.g:128:126: ^( ASSIGN ( PRIMITIVE )* ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ASSIGN, "ASSIGN"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:128:135: ( PRIMITIVE )*
                while ( stream_PRIMITIVE.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_PRIMITIVE.nextNode());

                }
                stream_PRIMITIVE.reset();
                // /Library/WebServer/Documents/calc/Formula.g:128:146: ^( PARAMS ( IDENT )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:128:155: ( IDENT )*
                while ( stream_IDENT.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_IDENT.nextNode());

                }
                stream_IDENT.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                // /Library/WebServer/Documents/calc/Formula.g:128:163: ^( DEFAULTS ( number )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(DEFAULTS, "DEFAULTS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:128:174: ( number )*
                while ( stream_number.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_number.nextTree());

                }
                stream_number.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    logicalExpression_return: (function() {
        FormulaParser.logicalExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.logicalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:131:1: logicalExpression : booleanAndExpression ( OR booleanAndExpression )* ;
    // $ANTLR start "logicalExpression"
    logicalExpression: function() {
        var retval = new FormulaParser.logicalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR90 = null;
         var booleanAndExpression89 = null;
         var booleanAndExpression91 = null;

        var OR90_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:132:2: ( booleanAndExpression ( OR booleanAndExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:132:4: booleanAndExpression ( OR booleanAndExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_booleanAndExpression_in_logicalExpression836);
            booleanAndExpression89=this.booleanAndExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, booleanAndExpression89.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:132:25: ( OR booleanAndExpression )*
            loop26:
            do {
                var alt26=2;
                var LA26_0 = this.input.LA(1);

                if ( (LA26_0==OR) ) {
                    alt26=1;
                }


                switch (alt26) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:132:26: OR booleanAndExpression
                    OR90=this.match(this.input,OR,FormulaParser.FOLLOW_OR_in_logicalExpression839); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    OR90_tree = this.adaptor.create(OR90);
                    root_0 = this.adaptor.becomeRoot(OR90_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_booleanAndExpression_in_logicalExpression842);
                    booleanAndExpression91=this.booleanAndExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, booleanAndExpression91.getTree());


                    break;

                default :
                    break loop26;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    booleanAndExpression_return: (function() {
        FormulaParser.booleanAndExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.booleanAndExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:137:1: booleanAndExpression : equalityExpression ( AND equalityExpression )* ;
    // $ANTLR start "booleanAndExpression"
    booleanAndExpression: function() {
        var retval = new FormulaParser.booleanAndExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND93 = null;
         var equalityExpression92 = null;
         var equalityExpression94 = null;

        var AND93_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:138:2: ( equalityExpression ( AND equalityExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:138:4: equalityExpression ( AND equalityExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_equalityExpression_in_booleanAndExpression873);
            equalityExpression92=this.equalityExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalityExpression92.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:138:23: ( AND equalityExpression )*
            loop27:
            do {
                var alt27=2;
                var LA27_0 = this.input.LA(1);

                if ( (LA27_0==AND) ) {
                    alt27=1;
                }


                switch (alt27) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:138:24: AND equalityExpression
                    AND93=this.match(this.input,AND,FormulaParser.FOLLOW_AND_in_booleanAndExpression876); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    AND93_tree = this.adaptor.create(AND93);
                    root_0 = this.adaptor.becomeRoot(AND93_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_equalityExpression_in_booleanAndExpression879);
                    equalityExpression94=this.equalityExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalityExpression94.getTree());


                    break;

                default :
                    break loop27;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    equalityExpression_return: (function() {
        FormulaParser.equalityExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.equalityExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:143:1: equalityExpression : relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )* ;
    // $ANTLR start "equalityExpression"
    equalityExpression: function() {
        var retval = new FormulaParser.equalityExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set96 = null;
         var relationalExpression95 = null;
         var relationalExpression97 = null;

        var set96_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:144:2: ( relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:144:4: relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_relationalExpression_in_equalityExpression910);
            relationalExpression95=this.relationalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, relationalExpression95.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:144:25: ( ( EQUALS | NOTEQUALS ) relationalExpression )*
            loop28:
            do {
                var alt28=2;
                var LA28_0 = this.input.LA(1);

                if ( (LA28_0==EQUALS||LA28_0==NOTEQUALS) ) {
                    alt28=1;
                }


                switch (alt28) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:144:26: ( EQUALS | NOTEQUALS ) relationalExpression
                    
                    set96=this.input.LT(1);
                    if ( this.input.LA(1)==EQUALS||this.input.LA(1)==NOTEQUALS ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set96), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_relationalExpression_in_equalityExpression920);
                    relationalExpression97=this.relationalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, relationalExpression97.getTree());


                    break;

                default :
                    break loop28;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    relationalExpression_return: (function() {
        FormulaParser.relationalExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.relationalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:154:1: relationalExpression : additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )* ;
    // $ANTLR start "relationalExpression"
    relationalExpression: function() {
        var retval = new FormulaParser.relationalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set99 = null;
         var additiveExpression98 = null;
         var additiveExpression100 = null;

        var set99_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:155:2: ( additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:155:4: additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_relationalExpression962);
            additiveExpression98=this.additiveExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, additiveExpression98.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:155:23: ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )*
            loop29:
            do {
                var alt29=2;
                var LA29_0 = this.input.LA(1);

                if ( ((LA29_0>=LT && LA29_0<=GTEQ)) ) {
                    alt29=1;
                }


                switch (alt29) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:155:25: ( LT | LTEQ | GT | GTEQ ) additiveExpression
                    
                    set99=this.input.LT(1);
                    if ( (this.input.LA(1)>=LT && this.input.LA(1)<=GTEQ) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set99), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_relationalExpression977);
                    additiveExpression100=this.additiveExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, additiveExpression100.getTree());


                    break;

                default :
                    break loop29;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    additiveExpression_return: (function() {
        FormulaParser.additiveExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.additiveExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:163:1: additiveExpression : multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )* ;
    // $ANTLR start "additiveExpression"
    additiveExpression: function() {
        var retval = new FormulaParser.additiveExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set102 = null;
         var multiplicativeExpression101 = null;
         var multiplicativeExpression103 = null;

        var set102_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:164:2: ( multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:164:4: multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_multiplicativeExpression_in_additiveExpression1020);
            multiplicativeExpression101=this.multiplicativeExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplicativeExpression101.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:164:29: ( ( PLUS | MINUS ) multiplicativeExpression )*
            loop30:
            do {
                var alt30=2;
                var LA30_0 = this.input.LA(1);

                if ( ((LA30_0>=PLUS && LA30_0<=MINUS)) ) {
                    alt30=1;
                }


                switch (alt30) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:164:31: ( PLUS | MINUS ) multiplicativeExpression
                    
                    set102=this.input.LT(1);
                    if ( (this.input.LA(1)>=PLUS && this.input.LA(1)<=MINUS) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set102), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_multiplicativeExpression_in_additiveExpression1031);
                    multiplicativeExpression103=this.multiplicativeExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplicativeExpression103.getTree());


                    break;

                default :
                    break loop30;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    multiplicativeExpression_return: (function() {
        FormulaParser.multiplicativeExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.multiplicativeExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:170:1: multiplicativeExpression : negationExpression ( ( MULT | DIV | MOD ) negationExpression )* ;
    // $ANTLR start "multiplicativeExpression"
    multiplicativeExpression: function() {
        var retval = new FormulaParser.multiplicativeExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set105 = null;
         var negationExpression104 = null;
         var negationExpression106 = null;

        var set105_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:171:2: ( negationExpression ( ( MULT | DIV | MOD ) negationExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:171:4: negationExpression ( ( MULT | DIV | MOD ) negationExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_negationExpression_in_multiplicativeExpression1061);
            negationExpression104=this.negationExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, negationExpression104.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:171:23: ( ( MULT | DIV | MOD ) negationExpression )*
            loop31:
            do {
                var alt31=2;
                var LA31_0 = this.input.LA(1);

                if ( ((LA31_0>=MULT && LA31_0<=MOD)) ) {
                    alt31=1;
                }


                switch (alt31) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:171:25: ( MULT | DIV | MOD ) negationExpression
                    
                    set105=this.input.LT(1);
                    if ( (this.input.LA(1)>=MULT && this.input.LA(1)<=MOD) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set105), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_negationExpression_in_multiplicativeExpression1074);
                    negationExpression106=this.negationExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, negationExpression106.getTree());


                    break;

                default :
                    break loop31;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    negationExpression_return: (function() {
        FormulaParser.negationExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.negationExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:178:1: negationExpression : ( MINUS powerExpression -> ^( NEGATE powerExpression ) | powerExpression );
    // $ANTLR start "negationExpression"
    negationExpression: function() {
        var retval = new FormulaParser.negationExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var MINUS107 = null;
         var powerExpression108 = null;
         var powerExpression109 = null;

        var MINUS107_tree=null;
        var stream_MINUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MINUS");
        var stream_powerExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule powerExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:179:2: ( MINUS powerExpression -> ^( NEGATE powerExpression ) | powerExpression )
            var alt32=2;
            var LA32_0 = this.input.LA(1);

            if ( (LA32_0==MINUS) ) {
                alt32=1;
            }
            else if ( (LA32_0==IDENT||LA32_0==PRIMITIVE||(LA32_0>=NOT && LA32_0<=LARR)||(LA32_0>=INTEGER && LA32_0<=FALSE)||LA32_0==87||LA32_0==91) ) {
                alt32=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 32, 0, this.input);

                throw nvae;
            }
            switch (alt32) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:179:4: MINUS powerExpression
                    MINUS107=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_negationExpression1119); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_MINUS.add(MINUS107);

                    this.pushFollow(FormulaParser.FOLLOW_powerExpression_in_negationExpression1121);
                    powerExpression108=this.powerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_powerExpression.add(powerExpression108.getTree());


                    // AST REWRITE
                    // elements: powerExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 179:26: -> ^( NEGATE powerExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:179:29: ^( NEGATE powerExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(NEGATE, "NEGATE"), root_1);

                        this.adaptor.addChild(root_1, stream_powerExpression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:180:3: powerExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_powerExpression_in_negationExpression1135);
                    powerExpression109=this.powerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, powerExpression109.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    powerExpression_return: (function() {
        FormulaParser.powerExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.powerExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:182:1: powerExpression : unaryExpression ( POW unaryOrNegate )* -> ^( POWER unaryExpression ( unaryOrNegate )* ) ;
    // $ANTLR start "powerExpression"
    powerExpression: function() {
        var retval = new FormulaParser.powerExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var POW111 = null;
         var unaryExpression110 = null;
         var unaryOrNegate112 = null;

        var POW111_tree=null;
        var stream_POW=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token POW");
        var stream_unaryOrNegate=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryOrNegate");
        var stream_unaryExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:183:2: ( unaryExpression ( POW unaryOrNegate )* -> ^( POWER unaryExpression ( unaryOrNegate )* ) )
            // /Library/WebServer/Documents/calc/Formula.g:183:4: unaryExpression ( POW unaryOrNegate )*
            this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_powerExpression1146);
            unaryExpression110=this.unaryExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_unaryExpression.add(unaryExpression110.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:183:20: ( POW unaryOrNegate )*
            loop33:
            do {
                var alt33=2;
                var LA33_0 = this.input.LA(1);

                if ( (LA33_0==POW) ) {
                    alt33=1;
                }


                switch (alt33) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:183:21: POW unaryOrNegate
                    POW111=this.match(this.input,POW,FormulaParser.FOLLOW_POW_in_powerExpression1149); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_POW.add(POW111);

                    this.pushFollow(FormulaParser.FOLLOW_unaryOrNegate_in_powerExpression1151);
                    unaryOrNegate112=this.unaryOrNegate();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unaryOrNegate.add(unaryOrNegate112.getTree());


                    break;

                default :
                    break loop33;
                }
            } while (true);



            // AST REWRITE
            // elements: unaryOrNegate, unaryExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 183:43: -> ^( POWER unaryExpression ( unaryOrNegate )* )
            {
                // /Library/WebServer/Documents/calc/Formula.g:183:47: ^( POWER unaryExpression ( unaryOrNegate )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(POWER, "POWER"), root_1);

                this.adaptor.addChild(root_1, stream_unaryExpression.nextTree());
                // /Library/WebServer/Documents/calc/Formula.g:183:71: ( unaryOrNegate )*
                while ( stream_unaryOrNegate.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_unaryOrNegate.nextTree());

                }
                stream_unaryOrNegate.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unaryOrNegate_return: (function() {
        FormulaParser.unaryOrNegate_return = function(){};
        org.antlr.lang.extend(FormulaParser.unaryOrNegate_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:186:1: unaryOrNegate : ( unaryExpression | MINUS unaryExpression -> ^( NEGATE unaryExpression ) );
    // $ANTLR start "unaryOrNegate"
    unaryOrNegate: function() {
        var retval = new FormulaParser.unaryOrNegate_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var MINUS114 = null;
         var unaryExpression113 = null;
         var unaryExpression115 = null;

        var MINUS114_tree=null;
        var stream_MINUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MINUS");
        var stream_unaryExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:187:2: ( unaryExpression | MINUS unaryExpression -> ^( NEGATE unaryExpression ) )
            var alt34=2;
            var LA34_0 = this.input.LA(1);

            if ( (LA34_0==IDENT||LA34_0==PRIMITIVE||(LA34_0>=NOT && LA34_0<=LARR)||(LA34_0>=INTEGER && LA34_0<=FALSE)||LA34_0==87||LA34_0==91) ) {
                alt34=1;
            }
            else if ( (LA34_0==MINUS) ) {
                alt34=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 34, 0, this.input);

                throw nvae;
            }
            switch (alt34) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:187:4: unaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_unaryOrNegate1178);
                    unaryExpression113=this.unaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unaryExpression113.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:188:3: MINUS unaryExpression
                    MINUS114=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_unaryOrNegate1184); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_MINUS.add(MINUS114);

                    this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_unaryOrNegate1186);
                    unaryExpression115=this.unaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unaryExpression.add(unaryExpression115.getTree());


                    // AST REWRITE
                    // elements: unaryExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 188:25: -> ^( NEGATE unaryExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:188:28: ^( NEGATE unaryExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(NEGATE, "NEGATE"), root_1);

                        this.adaptor.addChild(root_1, stream_unaryExpression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unaryExpression_return: (function() {
        FormulaParser.unaryExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.unaryExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:193:1: unaryExpression : ( NOT primaryExpression | primaryExpression );
    // $ANTLR start "unaryExpression"
    unaryExpression: function() {
        var retval = new FormulaParser.unaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NOT116 = null;
         var primaryExpression117 = null;
         var primaryExpression118 = null;

        var NOT116_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:194:2: ( NOT primaryExpression | primaryExpression )
            var alt35=2;
            var LA35_0 = this.input.LA(1);

            if ( (LA35_0==NOT) ) {
                alt35=1;
            }
            else if ( (LA35_0==IDENT||LA35_0==PRIMITIVE||LA35_0==LARR||(LA35_0>=INTEGER && LA35_0<=FALSE)||LA35_0==87||LA35_0==91) ) {
                alt35=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 35, 0, this.input);

                throw nvae;
            }
            switch (alt35) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:194:4: NOT primaryExpression
                    root_0 = this.adaptor.nil();

                    NOT116=this.match(this.input,NOT,FormulaParser.FOLLOW_NOT_in_unaryExpression1214); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    NOT116_tree = this.adaptor.create(NOT116);
                    root_0 = this.adaptor.becomeRoot(NOT116_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_primaryExpression_in_unaryExpression1217);
                    primaryExpression117=this.primaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primaryExpression117.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:196:8: primaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_primaryExpression_in_unaryExpression1229);
                    primaryExpression118=this.primaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primaryExpression118.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    primaryExpression_return: (function() {
        FormulaParser.primaryExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.primaryExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:201:1: primaryExpression : ( '(' logicalExpression ')' | value );
    // $ANTLR start "primaryExpression"
    primaryExpression: function() {
        var retval = new FormulaParser.primaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var char_literal119 = null;
        var char_literal121 = null;
         var logicalExpression120 = null;
         var value122 = null;

        var char_literal119_tree=null;
        var char_literal121_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:202:2: ( '(' logicalExpression ')' | value )
            var alt36=2;
            var LA36_0 = this.input.LA(1);

            if ( (LA36_0==87) ) {
                alt36=1;
            }
            else if ( (LA36_0==IDENT||LA36_0==PRIMITIVE||LA36_0==LARR||(LA36_0>=INTEGER && LA36_0<=FALSE)||LA36_0==91) ) {
                alt36=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 36, 0, this.input);

                throw nvae;
            }
            switch (alt36) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:202:4: '(' logicalExpression ')'
                    root_0 = this.adaptor.nil();

                    char_literal119=this.match(this.input,87,FormulaParser.FOLLOW_87_in_primaryExpression1260); if (this.state.failed) return retval;
                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_primaryExpression1263);
                    logicalExpression120=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, logicalExpression120.getTree());
                    char_literal121=this.match(this.input,89,FormulaParser.FOLLOW_89_in_primaryExpression1265); if (this.state.failed) return retval;


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:203:4: value
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_value_in_primaryExpression1271);
                    value122=this.value();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, value122.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    value_return: (function() {
        FormulaParser.value_return = function(){};
        org.antlr.lang.extend(FormulaParser.value_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:206:1: value : ( number | bool | funOrIdent | primitive | material | array );
    // $ANTLR start "value"
    value: function() {
        var retval = new FormulaParser.value_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var number123 = null;
         var bool124 = null;
         var funOrIdent125 = null;
         var primitive126 = null;
         var material127 = null;
         var array128 = null;


        try {
            // /Library/WebServer/Documents/calc/Formula.g:207:2: ( number | bool | funOrIdent | primitive | material | array )
            var alt37=6;
            switch ( this.input.LA(1) ) {
            case INTEGER:
            case FLOAT:
                alt37=1;
                break;
            case TRUE:
            case FALSE:
                alt37=2;
                break;
            case IDENT:
                alt37=3;
                break;
            case PRIMITIVE:
                alt37=4;
                break;
            case 91:
                alt37=5;
                break;
            case LARR:
                alt37=6;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 37, 0, this.input);

                throw nvae;
            }

            switch (alt37) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:207:5: number
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_number_in_value1285);
                    number123=this.number();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, number123.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:208:4: bool
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_bool_in_value1290);
                    bool124=this.bool();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, bool124.getTree());


                    break;
                case 3 :
                    // /Library/WebServer/Documents/calc/Formula.g:209:4: funOrIdent
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_funOrIdent_in_value1295);
                    funOrIdent125=this.funOrIdent();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, funOrIdent125.getTree());


                    break;
                case 4 :
                    // /Library/WebServer/Documents/calc/Formula.g:210:4: primitive
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_primitive_in_value1300);
                    primitive126=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive126.getTree());


                    break;
                case 5 :
                    // /Library/WebServer/Documents/calc/Formula.g:211:4: material
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_material_in_value1305);
                    material127=this.material();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, material127.getTree());


                    break;
                case 6 :
                    // /Library/WebServer/Documents/calc/Formula.g:212:4: array
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_array_in_value1310);
                    array128=this.array();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, array128.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    array_return: (function() {
        FormulaParser.array_return = function(){};
        org.antlr.lang.extend(FormulaParser.array_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:215:1: array : LARR ( logicalExpression ( ',' logicalExpression )* )? RARR -> ^( ARRAY ( logicalExpression )* ) ;
    // $ANTLR start "array"
    array: function() {
        var retval = new FormulaParser.array_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LARR129 = null;
        var char_literal131 = null;
        var RARR133 = null;
         var logicalExpression130 = null;
         var logicalExpression132 = null;

        var LARR129_tree=null;
        var char_literal131_tree=null;
        var RARR133_tree=null;
        var stream_RARR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RARR");
        var stream_LARR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LARR");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:216:2: ( LARR ( logicalExpression ( ',' logicalExpression )* )? RARR -> ^( ARRAY ( logicalExpression )* ) )
            // /Library/WebServer/Documents/calc/Formula.g:216:4: LARR ( logicalExpression ( ',' logicalExpression )* )? RARR
            LARR129=this.match(this.input,LARR,FormulaParser.FOLLOW_LARR_in_array1321); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LARR.add(LARR129);

            // /Library/WebServer/Documents/calc/Formula.g:216:9: ( logicalExpression ( ',' logicalExpression )* )?
            var alt39=2;
            var LA39_0 = this.input.LA(1);

            if ( (LA39_0==IDENT||LA39_0==PRIMITIVE||LA39_0==MINUS||(LA39_0>=NOT && LA39_0<=LARR)||(LA39_0>=INTEGER && LA39_0<=FALSE)||LA39_0==87||LA39_0==91) ) {
                alt39=1;
            }
            switch (alt39) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:216:10: logicalExpression ( ',' logicalExpression )*
                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_array1324);
                    logicalExpression130=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression130.getTree());
                    // /Library/WebServer/Documents/calc/Formula.g:216:28: ( ',' logicalExpression )*
                    loop38:
                    do {
                        var alt38=2;
                        var LA38_0 = this.input.LA(1);

                        if ( (LA38_0==88) ) {
                            alt38=1;
                        }


                        switch (alt38) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:216:29: ',' logicalExpression
                            char_literal131=this.match(this.input,88,FormulaParser.FOLLOW_88_in_array1327); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_88.add(char_literal131);

                            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_array1329);
                            logicalExpression132=this.logicalExpression();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression132.getTree());


                            break;

                        default :
                            break loop38;
                        }
                    } while (true);



                    break;

            }

            RARR133=this.match(this.input,RARR,FormulaParser.FOLLOW_RARR_in_array1335); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_RARR.add(RARR133);



            // AST REWRITE
            // elements: logicalExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 216:60: -> ^( ARRAY ( logicalExpression )* )
            {
                // /Library/WebServer/Documents/calc/Formula.g:216:63: ^( ARRAY ( logicalExpression )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:216:71: ( logicalExpression )*
                while ( stream_logicalExpression.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());

                }
                stream_logicalExpression.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    number_return: (function() {
        FormulaParser.number_return = function(){};
        org.antlr.lang.extend(FormulaParser.number_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:222:1: number : ( INTEGER | FLOAT );
    // $ANTLR start "number"
    number: function() {
        var retval = new FormulaParser.number_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set134 = null;

        var set134_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:222:8: ( INTEGER | FLOAT )
            // /Library/WebServer/Documents/calc/Formula.g:
            root_0 = this.adaptor.nil();

            set134=this.input.LT(1);
            if ( (this.input.LA(1)>=INTEGER && this.input.LA(1)<=FLOAT) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set134));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    bool_return: (function() {
        FormulaParser.bool_return = function(){};
        org.antlr.lang.extend(FormulaParser.bool_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:232:1: bool : ( TRUE | FALSE );
    // $ANTLR start "bool"
    bool: function() {
        var retval = new FormulaParser.bool_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set135 = null;

        var set135_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:233:2: ( TRUE | FALSE )
            // /Library/WebServer/Documents/calc/Formula.g:
            root_0 = this.adaptor.nil();

            set135=this.input.LT(1);
            if ( (this.input.LA(1)>=TRUE && this.input.LA(1)<=FALSE) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set135));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    material_return: (function() {
        FormulaParser.material_return = function(){};
        org.antlr.lang.extend(FormulaParser.material_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:245:1: material : '{' additiveExpression unitMultiplicativeExpression '}' -> ^( MATERIAL unitMultiplicativeExpression additiveExpression ) ;
    // $ANTLR start "material"
    material: function() {
        var retval = new FormulaParser.material_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var char_literal136 = null;
        var char_literal139 = null;
         var additiveExpression137 = null;
         var unitMultiplicativeExpression138 = null;

        var char_literal136_tree=null;
        var char_literal139_tree=null;
        var stream_92=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 92");
        var stream_91=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 91");
        var stream_unitMultiplicativeExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitMultiplicativeExpression");
        var stream_additiveExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule additiveExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:245:9: ( '{' additiveExpression unitMultiplicativeExpression '}' -> ^( MATERIAL unitMultiplicativeExpression additiveExpression ) )
            // /Library/WebServer/Documents/calc/Formula.g:245:12: '{' additiveExpression unitMultiplicativeExpression '}'
            char_literal136=this.match(this.input,91,FormulaParser.FOLLOW_91_in_material1523); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_91.add(char_literal136);

            this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_material1525);
            additiveExpression137=this.additiveExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_additiveExpression.add(additiveExpression137.getTree());
            this.pushFollow(FormulaParser.FOLLOW_unitMultiplicativeExpression_in_material1527);
            unitMultiplicativeExpression138=this.unitMultiplicativeExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_unitMultiplicativeExpression.add(unitMultiplicativeExpression138.getTree());
            char_literal139=this.match(this.input,92,FormulaParser.FOLLOW_92_in_material1529); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_92.add(char_literal139);



            // AST REWRITE
            // elements: unitMultiplicativeExpression, additiveExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 245:68: -> ^( MATERIAL unitMultiplicativeExpression additiveExpression )
            {
                // /Library/WebServer/Documents/calc/Formula.g:245:71: ^( MATERIAL unitMultiplicativeExpression additiveExpression )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(MATERIAL, "MATERIAL"), root_1);

                this.adaptor.addChild(root_1, stream_unitMultiplicativeExpression.nextTree());
                this.adaptor.addChild(root_1, stream_additiveExpression.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unitMultiplicativeExpression_return: (function() {
        FormulaParser.unitMultiplicativeExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.unitMultiplicativeExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:248:1: unitMultiplicativeExpression : unitClump ( ( MULT | DIV ) unitClump )* ;
    // $ANTLR start "unitMultiplicativeExpression"
    unitMultiplicativeExpression: function() {
        var retval = new FormulaParser.unitMultiplicativeExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set141 = null;
         var unitClump140 = null;
         var unitClump142 = null;

        var set141_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:249:2: ( unitClump ( ( MULT | DIV ) unitClump )* )
            // /Library/WebServer/Documents/calc/Formula.g:249:4: unitClump ( ( MULT | DIV ) unitClump )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_unitClump_in_unitMultiplicativeExpression1550);
            unitClump140=this.unitClump();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unitClump140.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:249:14: ( ( MULT | DIV ) unitClump )*
            loop40:
            do {
                var alt40=2;
                var LA40_0 = this.input.LA(1);

                if ( ((LA40_0>=MULT && LA40_0<=DIV)) ) {
                    alt40=1;
                }


                switch (alt40) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:249:16: ( MULT | DIV ) unitClump
                   
                    set141=this.input.LT(1);
                    if ( (this.input.LA(1)>=MULT && this.input.LA(1)<=DIV) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set141), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_unitClump_in_unitMultiplicativeExpression1561);
                    unitClump142=this.unitClump();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unitClump142.getTree());


                    break;

                default :
                    break loop40;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unitClump_return: (function() {
        FormulaParser.unitClump_return = function(){};
        org.antlr.lang.extend(FormulaParser.unitClump_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:252:1: unitClump : ( ( INTEGER DIV ) unitPowerExpression -> ^( UNITCLUMP unitPowerExpression NEGATE ) | unitPowerExpression -> ^( UNITCLUMP unitPowerExpression ) );
    // $ANTLR start "unitClump"
    unitClump: function() {
        var retval = new FormulaParser.unitClump_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var INTEGER143 = null;
        var DIV144 = null;
         var unitPowerExpression145 = null;
         var unitPowerExpression146 = null;

        var INTEGER143_tree=null;
        var DIV144_tree=null;
        var stream_INTEGER=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token INTEGER");
        var stream_DIV=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token DIV");
        var stream_unitPowerExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitPowerExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:253:2: ( ( INTEGER DIV ) unitPowerExpression -> ^( UNITCLUMP unitPowerExpression NEGATE ) | unitPowerExpression -> ^( UNITCLUMP unitPowerExpression ) )
            var alt41=2;
            var LA41_0 = this.input.LA(1);

            if ( (LA41_0==INTEGER) ) {
                alt41=1;
            }
            else if ( (LA41_0==IDENT||LA41_0==87) ) {
                alt41=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 41, 0, this.input);

                throw nvae;
            }
            switch (alt41) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:253:4: ( INTEGER DIV ) unitPowerExpression
                    // /Library/WebServer/Documents/calc/Formula.g:253:4: ( INTEGER DIV )
                    // /Library/WebServer/Documents/calc/Formula.g:253:5: INTEGER DIV
                    INTEGER143=this.match(this.input,INTEGER,FormulaParser.FOLLOW_INTEGER_in_unitClump1576); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_INTEGER.add(INTEGER143);

                    DIV144=this.match(this.input,DIV,FormulaParser.FOLLOW_DIV_in_unitClump1578); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_DIV.add(DIV144);




                    this.pushFollow(FormulaParser.FOLLOW_unitPowerExpression_in_unitClump1581);
                    unitPowerExpression145=this.unitPowerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitPowerExpression.add(unitPowerExpression145.getTree());


                    // AST REWRITE
                    // elements: unitPowerExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 253:38: -> ^( UNITCLUMP unitPowerExpression NEGATE )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:253:41: ^( UNITCLUMP unitPowerExpression NEGATE )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(UNITCLUMP, "UNITCLUMP"), root_1);

                        this.adaptor.addChild(root_1, stream_unitPowerExpression.nextTree());
                        this.adaptor.addChild(root_1, this.adaptor.create(NEGATE, "NEGATE"));

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:254:5: unitPowerExpression
                    this.pushFollow(FormulaParser.FOLLOW_unitPowerExpression_in_unitClump1597);
                    unitPowerExpression146=this.unitPowerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitPowerExpression.add(unitPowerExpression146.getTree());


                    // AST REWRITE
                    // elements: unitPowerExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 254:25: -> ^( UNITCLUMP unitPowerExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:254:28: ^( UNITCLUMP unitPowerExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(UNITCLUMP, "UNITCLUMP"), root_1);

                        this.adaptor.addChild(root_1, stream_unitPowerExpression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unitPowerExpression_return: (function() {
        FormulaParser.unitPowerExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.unitPowerExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:257:1: unitPowerExpression : unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )* ;
    // $ANTLR start "unitPowerExpression"
    unitPowerExpression: function() {
        var retval = new FormulaParser.unitPowerExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var POW148 = null;
        var MINUS149 = null;
        var set150 = null;
         var unit147 = null;

        var POW148_tree=null;
        var MINUS149_tree=null;
        var set150_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:258:2: ( unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )* )
            // /Library/WebServer/Documents/calc/Formula.g:258:5: unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_unit_in_unitPowerExpression1618);
            unit147=this.unit();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unit147.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:258:10: ( POW ( MINUS )? ( INTEGER | FLOAT ) )*
            loop43:
            do {
                var alt43=2;
                var LA43_0 = this.input.LA(1);

                if ( (LA43_0==POW) ) {
                    alt43=1;
                }


                switch (alt43) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:258:12: POW ( MINUS )? ( INTEGER | FLOAT )
                    POW148=this.match(this.input,POW,FormulaParser.FOLLOW_POW_in_unitPowerExpression1622); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    POW148_tree = this.adaptor.create(POW148);
                    root_0 = this.adaptor.becomeRoot(POW148_tree, root_0);
                    }
                    // /Library/WebServer/Documents/calc/Formula.g:258:17: ( MINUS )?
                    var alt42=2;
                    var LA42_0 = this.input.LA(1);

                    if ( (LA42_0==MINUS) ) {
                        alt42=1;
                    }
                    switch (alt42) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:258:17: MINUS
                            MINUS149=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_unitPowerExpression1625); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) {
                            MINUS149_tree = this.adaptor.create(MINUS149);
                            this.adaptor.addChild(root_0, MINUS149_tree);
                            }


                            break;

                    }

                    set150=this.input.LT(1);
                    if ( (this.input.LA(1)>=INTEGER && this.input.LA(1)<=FLOAT) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set150));
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop43;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unit_return: (function() {
        FormulaParser.unit_return = function(){};
        org.antlr.lang.extend(FormulaParser.unit_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:261:1: unit : ( IDENT ( IDENT )* -> ^( UNIT ( IDENT )+ ) | '(' unitMultiplicativeExpression ')' -> ^( UNITCLUMP unitMultiplicativeExpression ) );
    // $ANTLR start "unit"
    unit: function() {
        var retval = new FormulaParser.unit_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IDENT151 = null;
        var IDENT152 = null;
        var char_literal153 = null;
        var char_literal155 = null;
         var unitMultiplicativeExpression154 = null;

        var IDENT151_tree=null;
        var IDENT152_tree=null;
        var char_literal153_tree=null;
        var char_literal155_tree=null;
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_unitMultiplicativeExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitMultiplicativeExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:261:6: ( IDENT ( IDENT )* -> ^( UNIT ( IDENT )+ ) | '(' unitMultiplicativeExpression ')' -> ^( UNITCLUMP unitMultiplicativeExpression ) )
            var alt45=2;
            var LA45_0 = this.input.LA(1);

            if ( (LA45_0==IDENT) ) {
                alt45=1;
            }
            else if ( (LA45_0==87) ) {
                alt45=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 45, 0, this.input);

                throw nvae;
            }
            switch (alt45) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:261:8: IDENT ( IDENT )*
                    IDENT151=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_unit1645); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT151);

                    // /Library/WebServer/Documents/calc/Formula.g:261:14: ( IDENT )*
                    loop44:
                    do {
                        var alt44=2;
                        var LA44_0 = this.input.LA(1);

                        if ( (LA44_0==IDENT) ) {
                            alt44=1;
                        }


                        switch (alt44) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:261:15: IDENT
                            IDENT152=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_unit1648); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT152);



                            break;

                        default :
                            break loop44;
                        }
                    } while (true);



                    // AST REWRITE
                    // elements: IDENT
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 261:23: -> ^( UNIT ( IDENT )+ )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:261:26: ^( UNIT ( IDENT )+ )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(UNIT, "UNIT"), root_1);

                        if ( !(stream_IDENT.hasNext()) ) {
                            throw new org.antlr.runtime.tree.RewriteEarlyExitException();
                        }
                        while ( stream_IDENT.hasNext() ) {
                            this.adaptor.addChild(root_1, stream_IDENT.nextNode());

                        }
                        stream_IDENT.reset();

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:262:5: '(' unitMultiplicativeExpression ')'
                    char_literal153=this.match(this.input,87,FormulaParser.FOLLOW_87_in_unit1665); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_87.add(char_literal153);

                    this.pushFollow(FormulaParser.FOLLOW_unitMultiplicativeExpression_in_unit1667);
                    unitMultiplicativeExpression154=this.unitMultiplicativeExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitMultiplicativeExpression.add(unitMultiplicativeExpression154.getTree());
                    char_literal155=this.match(this.input,89,FormulaParser.FOLLOW_89_in_unit1669); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_89.add(char_literal155);



                    // AST REWRITE
                    // elements: unitMultiplicativeExpression
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 262:42: -> ^( UNITCLUMP unitMultiplicativeExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:262:45: ^( UNITCLUMP unitMultiplicativeExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(UNITCLUMP, "UNITCLUMP"), root_1);

                        this.adaptor.addChild(root_1, stream_unitMultiplicativeExpression.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    funOrIdent_return: (function() {
        FormulaParser.funOrIdent_return = function(){};
        org.antlr.lang.extend(FormulaParser.funOrIdent_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:270:1: funOrIdent : ( ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' -> ^( FUNCALL IDENT ( logicalExpression )* ) | IDENT );
    // $ANTLR start "funOrIdent"
    funOrIdent: function() {
        var retval = new FormulaParser.funOrIdent_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IDENT156 = null;
        var char_literal157 = null;
        var char_literal159 = null;
        var char_literal161 = null;
        var IDENT162 = null;
         var logicalExpression158 = null;
         var logicalExpression160 = null;

        var IDENT156_tree=null;
        var char_literal157_tree=null;
        var char_literal159_tree=null;
        var char_literal161_tree=null;
        var IDENT162_tree=null;
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:271:2: ( ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' -> ^( FUNCALL IDENT ( logicalExpression )* ) | IDENT )
            var alt48=2;
            var LA48_0 = this.input.LA(1);

            if ( (LA48_0==IDENT) ) {
                var LA48_1 = this.input.LA(2);

                if ( (this.synpred1_Formula()) ) {
                    alt48=1;
                }
                else if ( (true) ) {
                    alt48=2;
                }
                else {
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 48, 1, this.input);

                    throw nvae;
                }
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 48, 0, this.input);

                throw nvae;
            }
            switch (alt48) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:271:4: ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')'
                    IDENT156=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_funOrIdent1715); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT156);

                    char_literal157=this.match(this.input,87,FormulaParser.FOLLOW_87_in_funOrIdent1717); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_87.add(char_literal157);

                    // /Library/WebServer/Documents/calc/Formula.g:271:79: ( logicalExpression ( ',' logicalExpression )* )?
                    var alt47=2;
                    var LA47_0 = this.input.LA(1);

                    if ( (LA47_0==IDENT||LA47_0==PRIMITIVE||LA47_0==MINUS||(LA47_0>=NOT && LA47_0<=LARR)||(LA47_0>=INTEGER && LA47_0<=FALSE)||LA47_0==87||LA47_0==91) ) {
                        alt47=1;
                    }
                    switch (alt47) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:271:81: logicalExpression ( ',' logicalExpression )*
                            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_funOrIdent1721);
                            logicalExpression158=this.logicalExpression();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression158.getTree());
                            // /Library/WebServer/Documents/calc/Formula.g:271:99: ( ',' logicalExpression )*
                            loop46:
                            do {
                                var alt46=2;
                                var LA46_0 = this.input.LA(1);

                                if ( (LA46_0==88) ) {
                                    alt46=1;
                                }


                                switch (alt46) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:271:100: ',' logicalExpression
                                    char_literal159=this.match(this.input,88,FormulaParser.FOLLOW_88_in_funOrIdent1724); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_88.add(char_literal159);

                                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_funOrIdent1726);
                                    logicalExpression160=this.logicalExpression();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression160.getTree());


                                    break;

                                default :
                                    break loop46;
                                }
                            } while (true);



                            break;

                    }

                    char_literal161=this.match(this.input,89,FormulaParser.FOLLOW_89_in_funOrIdent1733); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_89.add(char_literal161);



                    // AST REWRITE
                    // elements: logicalExpression, IDENT
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 271:131: -> ^( FUNCALL IDENT ( logicalExpression )* )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:271:134: ^( FUNCALL IDENT ( logicalExpression )* )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCALL, "FUNCALL"), root_1);

                        this.adaptor.addChild(root_1, stream_IDENT.nextNode());
                        // /Library/WebServer/Documents/calc/Formula.g:271:150: ( logicalExpression )*
                        while ( stream_logicalExpression.hasNext() ) {
                            this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());

                        }
                        stream_logicalExpression.reset();

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:272:5: IDENT
                    root_0 = this.adaptor.nil();

                    IDENT162=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_funOrIdent1750); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    IDENT162_tree = this.adaptor.create(IDENT162);
                    this.adaptor.addChild(root_0, IDENT162_tree);
                    }


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    primitive_return: (function() {
        FormulaParser.primitive_return = function(){};
        org.antlr.lang.extend(FormulaParser.primitive_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:280:1: primitive : PRIMITIVE ;
    // $ANTLR start "primitive"
    primitive: function() {
        var retval = new FormulaParser.primitive_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var PRIMITIVE163 = null;

        var PRIMITIVE163_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:281:2: ( PRIMITIVE )
            // /Library/WebServer/Documents/calc/Formula.g:281:4: PRIMITIVE
            root_0 = this.adaptor.nil();

            PRIMITIVE163=this.match(this.input,PRIMITIVE,FormulaParser.FOLLOW_PRIMITIVE_in_primitive1806); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) {
            PRIMITIVE163_tree = this.adaptor.create(PRIMITIVE163);
            this.adaptor.addChild(root_0, PRIMITIVE163_tree);
            }



            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // $ANTLR start "synpred1_Formula"
    synpred1_Formula_fragment: function() {
        // /Library/WebServer/Documents/calc/Formula.g:271:4: ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )
        // /Library/WebServer/Documents/calc/Formula.g:271:5: IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')'
        this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_synpred1_Formula1694); if (this.state.failed) return ;
        this.match(this.input,87,FormulaParser.FOLLOW_87_in_synpred1_Formula1696); if (this.state.failed) return ;
        // /Library/WebServer/Documents/calc/Formula.g:271:15: ( logicalExpression ( ',' logicalExpression )* )?
        var alt50=2;
        var LA50_0 = this.input.LA(1);

        if ( (LA50_0==IDENT||LA50_0==PRIMITIVE||LA50_0==MINUS||(LA50_0>=NOT && LA50_0<=LARR)||(LA50_0>=INTEGER && LA50_0<=FALSE)||LA50_0==87||LA50_0==91) ) {
            alt50=1;
        }
        switch (alt50) {
            case 1 :
                // /Library/WebServer/Documents/calc/Formula.g:271:17: logicalExpression ( ',' logicalExpression )*
                this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_synpred1_Formula1700);
                this.logicalExpression();

                this.state._fsp--;
                if (this.state.failed) return ;
                // /Library/WebServer/Documents/calc/Formula.g:271:35: ( ',' logicalExpression )*
                loop49:
                do {
                    var alt49=2;
                    var LA49_0 = this.input.LA(1);

                    if ( (LA49_0==88) ) {
                        alt49=1;
                    }


                    switch (alt49) {
                    case 1 :
                        // /Library/WebServer/Documents/calc/Formula.g:271:36: ',' logicalExpression
                        this.match(this.input,88,FormulaParser.FOLLOW_88_in_synpred1_Formula1703); if (this.state.failed) return ;
                        this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_synpred1_Formula1705);
                        this.logicalExpression();

                        this.state._fsp--;
                        if (this.state.failed) return ;


                        break;

                    default :
                        break loop49;
                    }
                } while (true);



                break;

        }

        this.match(this.input,89,FormulaParser.FOLLOW_89_in_synpred1_Formula1712); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred1_Formula"

    // Delegated rules



    synpred1_Formula: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred1_Formula_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(FormulaParser, {
    DFA5_eotS:
        "\u0017\uffff",
    DFA5_eofS:
        "\u0001\uffff\u0002\u0003\u000d\uffff\u0001\u0003\u0006\uffff",
    DFA5_minS:
        "\u0001\u001b\u0002\u0015\u0002\uffff\u0001\u0035\u0003\uffff\u0001"+
    "\u0035\u0001\u0021\u0001\u0036\u0002\uffff\u0002\u0035\u0001\u0015\u0002"+
    "\u0036\u0002\u0035\u0002\u0036",
    DFA5_maxS:
        "\u0001\u005b\u0002\u005a\u0002\uffff\u0001\u0035\u0003\uffff\u0001"+
    "\u005b\u0001\u0023\u0001\u0059\u0002\uffff\u0002\u005b\u0001\u005a\u0002"+
    "\u0059\u0002\u005b\u0002\u0059",
    DFA5_acceptS:
        "\u0003\uffff\u0001\u0002\u0001\u0003\u0001\uffff\u0001\u0006\u0001"+
    "\u0007\u0001\u0001\u0003\uffff\u0001\u0004\u0001\u0005\u0009\uffff",
    DFA5_specialS:
        "\u0017\uffff}>",
    DFA5_transitionS: [
            "\u0001\u0004\u0003\uffff\u0001\u0005\u000b\uffff\u0001\u0006"+
            "\u0005\uffff\u0001\u0007\u0003\uffff\u0001\u0002\u0001\uffff"+
            "\u0001\u0001\u0009\uffff\u0001\u0003\u0004\uffff\u0002\u0003"+
            "\u0001\uffff\u0004\u0003\u000a\uffff\u0001\u0003\u0003\uffff"+
            "\u0001\u0003",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0014\uffff\u0001\u0008",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0011\uffff\u0001\u0009\u0002\uffff"+
            "\u0001\u0008",
            "",
            "",
            "\u0001\u000a",
            "",
            "",
            "",
            "\u0001\u000b\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0001\uffff\u0001\u0003\u0001\uffff\u0001\u0003",
            "\u0001\u000c\u0001\uffff\u0001\u000d",
            "\u0001\u000e\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0001\u0003\u0001\u000f\u0001\u0010",
            "",
            "",
            "\u0001\u0003\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0002\u0011\u0002\u0003"+
            "\u000a\uffff\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0012\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0014\uffff\u0001\u0008",
            "\u0001\u0003\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0012\uffff\u0001\u0013\u0001\u0010",
            "\u0001\u0014\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0001\u0003\u0001\u000f\u0001\u0010",
            "\u0001\u0015\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0003\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0002\u0016\u0002\u0003"+
            "\u000a\uffff\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0014\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0003\u0003",
            "\u0001\u0003\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0012\uffff\u0001\u0013\u0001\u0010"
    ]
});

org.antlr.lang.augmentObject(FormulaParser, {
    DFA5_eot:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaParser.DFA5_eotS),
    DFA5_eof:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaParser.DFA5_eofS),
    DFA5_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(FormulaParser.DFA5_minS),
    DFA5_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(FormulaParser.DFA5_maxS),
    DFA5_accept:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaParser.DFA5_acceptS),
    DFA5_special:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaParser.DFA5_specialS),
    DFA5_transition: (function() {
        var a = [],
            i,
            numStates = FormulaParser.DFA5_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(FormulaParser.DFA5_transitionS[i]));
        }
        return a;
    })()
});

FormulaParser.DFA5 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 5;
    this.eot = FormulaParser.DFA5_eot;
    this.eof = FormulaParser.DFA5_eof;
    this.min = FormulaParser.DFA5_min;
    this.max = FormulaParser.DFA5_max;
    this.accept = FormulaParser.DFA5_accept;
    this.special = FormulaParser.DFA5_special;
    this.transition = FormulaParser.DFA5_transition;
};

org.antlr.lang.extend(FormulaParser.DFA5, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "92:1: expression : ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef );";
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(FormulaParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "NEGATE", "ASSIGN", "FUNCALL", "MATERIAL", "UNIT", "POWER", "DEFAULTS", "PARAMS", "UNITCLUMP", "ARRAY", "LINES", "WHILE", "IFTHENELSE", "ELSE", "FOR", "FORIN", "FUNCTION", "NEWLINE", "W", "H", "I", "L", "E", "WHILESTATEMENT", "F", "O", "R", "FORSTATEMENT", "M", "FROMSTATEMENT", "N", "INSTATEMENT", "T", "TOSTATEMENT", "B", "Y", "BYSTATEMENT", "P", "LOOPSTATEMENT", "IFSTATEMENT", "THENSTATEMENT", "S", "ELSESTATEMENT", "U", "C", "FUNCTIONSTATEMENT", "D", "ENDBLOCK", "RETURNSTATEMENT", "IDENT", "EQUALS", "PRIMITIVE", "OR", "AND", "A", "NOTEQUALS", "LT", "LTEQ", "GT", "GTEQ", "PLUS", "MINUS", "MULT", "DIV", "MOD", "POW", "NOT", "LARR", "RARR", "INTEGER", "FLOAT", "TRUE", "FALSE", "COMMENT", "LINE_COMMENT", "WS", "G", "J", "K", "Q", "V", "X", "Z", "'('", "','", "')'", "'<-'", "'{'", "'}'"],
    FOLLOW_NEWLINE_in_lines112: new org.antlr.runtime.BitSet([0x88200000, 0x00A20800,0x08801EC2, 0x00000000]),
    FOLLOW_expression_in_lines116: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_lines120: new org.antlr.runtime.BitSet([0x88200000, 0x00A20800,0x08801EC2, 0x00000000]),
    FOLLOW_EOF_in_lines123: new org.antlr.runtime.BitSet([0x88000000, 0x00A20800,0x08801EC2, 0x00000000]),
    FOLLOW_EOF_in_lines128: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_assignment_in_expression390: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_logicalExpression_in_expression396: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_whileLoop_in_expression402: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forLoop_in_expression408: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forInLoop_in_expression414: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ifThenElse_in_expression420: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionDef_in_expression426: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expression_in_innerBlock438: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_innerBlock442: new org.antlr.runtime.BitSet([0x88200002, 0x00A20800,0x08801EC2, 0x00000000]),
    FOLLOW_WHILESTATEMENT_in_whileLoop467: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_whileLoop469: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_whileLoop471: new org.antlr.runtime.BitSet([0x88200000, 0x00AA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_whileLoop474: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_whileLoop477: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_whileLoop479: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FORSTATEMENT_in_forLoop500: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_forLoop502: new org.antlr.runtime.BitSet([0x00000000, 0x00000002]),
    FOLLOW_FROMSTATEMENT_in_forLoop504: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop506: new org.antlr.runtime.BitSet([0x00000000, 0x00000020]),
    FOLLOW_TOSTATEMENT_in_forLoop508: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop510: new org.antlr.runtime.BitSet([0x00200000, 0x00000100]),
    FOLLOW_BYSTATEMENT_in_forLoop513: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop515: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_forLoop519: new org.antlr.runtime.BitSet([0x88200000, 0x00AA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_forLoop522: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_forLoop525: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_forLoop527: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FORSTATEMENT_in_forInLoop555: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_forInLoop557: new org.antlr.runtime.BitSet([0x00000000, 0x00000008]),
    FOLLOW_INSTATEMENT_in_forInLoop559: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forInLoop561: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_forInLoop563: new org.antlr.runtime.BitSet([0x88200000, 0x00AA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_forInLoop566: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_forInLoop569: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_forInLoop571: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IFSTATEMENT_in_ifThenElse596: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_ifThenElse598: new org.antlr.runtime.BitSet([0x00000000, 0x00001000]),
    FOLLOW_THENSTATEMENT_in_ifThenElse600: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse603: new org.antlr.runtime.BitSet([0x88200000, 0x00AA4800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse606: new org.antlr.runtime.BitSet([0x00000000, 0x00084000]),
    FOLLOW_ELSESTATEMENT_in_ifThenElse610: new org.antlr.runtime.BitSet([0x00000000, 0x00000800]),
    FOLLOW_IFSTATEMENT_in_ifThenElse612: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_ifThenElse614: new org.antlr.runtime.BitSet([0x00000000, 0x00001000]),
    FOLLOW_THENSTATEMENT_in_ifThenElse616: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse618: new org.antlr.runtime.BitSet([0x88200000, 0x00AA4800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse621: new org.antlr.runtime.BitSet([0x00000000, 0x00084000]),
    FOLLOW_ELSESTATEMENT_in_ifThenElse626: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse628: new org.antlr.runtime.BitSet([0x88200000, 0x00AA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse631: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_ifThenElse635: new org.antlr.runtime.BitSet([0x00000000, 0x00000800]),
    FOLLOW_IFSTATEMENT_in_ifThenElse637: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FUNCTIONSTATEMENT_in_functionDef668: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef670: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_functionDef672: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef674: new org.antlr.runtime.BitSet([0x00000000, 0x00400000,0x03000000, 0x00000000]),
    FOLLOW_EQUALS_in_functionDef678: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_functionDef680: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_functionDef685: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef687: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_functionDef694: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef696: new org.antlr.runtime.BitSet([0x00000000, 0x00400000]),
    FOLLOW_EQUALS_in_functionDef698: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_functionDef700: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_functionDef705: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_functionDef707: new org.antlr.runtime.BitSet([0x88200000, 0x00AA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_functionDef710: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_functionDef713: new org.antlr.runtime.BitSet([0x00000000, 0x00020000]),
    FOLLOW_FUNCTIONSTATEMENT_in_functionDef715: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PRIMITIVE_in_assignment751: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_IDENT_in_assignment755: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04800000, 0x00000000]),
    FOLLOW_87_in_assignment758: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_assignment760: new org.antlr.runtime.BitSet([0x00000000, 0x00400000,0x03000000, 0x00000000]),
    FOLLOW_EQUALS_in_assignment764: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_assignment766: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_assignment771: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_assignment773: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_assignment780: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_assignment782: new org.antlr.runtime.BitSet([0x00000000, 0x00400000]),
    FOLLOW_EQUALS_in_assignment784: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_assignment786: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_assignment791: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_90_in_assignment796: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_assignment798: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanAndExpression_in_logicalExpression836: new org.antlr.runtime.BitSet([0x00000002, 0x01000000]),
    FOLLOW_OR_in_logicalExpression839: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_booleanAndExpression_in_logicalExpression842: new org.antlr.runtime.BitSet([0x00000002, 0x01000000]),
    FOLLOW_equalityExpression_in_booleanAndExpression873: new org.antlr.runtime.BitSet([0x00000002, 0x02000000]),
    FOLLOW_AND_in_booleanAndExpression876: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_equalityExpression_in_booleanAndExpression879: new org.antlr.runtime.BitSet([0x00000002, 0x02000000]),
    FOLLOW_relationalExpression_in_equalityExpression910: new org.antlr.runtime.BitSet([0x00000002, 0x08400000]),
    FOLLOW_set_in_equalityExpression913: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_relationalExpression_in_equalityExpression920: new org.antlr.runtime.BitSet([0x00000002, 0x08400000]),
    FOLLOW_additiveExpression_in_relationalExpression962: new org.antlr.runtime.BitSet([0x00000002, 0xF0000000]),
    FOLLOW_set_in_relationalExpression966: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_additiveExpression_in_relationalExpression977: new org.antlr.runtime.BitSet([0x00000002, 0xF0000000]),
    FOLLOW_multiplicativeExpression_in_additiveExpression1020: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000003, 0x00000000]),
    FOLLOW_set_in_additiveExpression1024: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_multiplicativeExpression_in_additiveExpression1031: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000003, 0x00000000]),
    FOLLOW_negationExpression_in_multiplicativeExpression1061: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000001C, 0x00000000]),
    FOLLOW_set_in_multiplicativeExpression1065: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_negationExpression_in_multiplicativeExpression1074: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000001C, 0x00000000]),
    FOLLOW_MINUS_in_negationExpression1119: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_powerExpression_in_negationExpression1121: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_powerExpression_in_negationExpression1135: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unaryExpression_in_powerExpression1146: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_POW_in_powerExpression1149: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_unaryOrNegate_in_powerExpression1151: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_unaryExpression_in_unaryOrNegate1178: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_MINUS_in_unaryOrNegate1184: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_unaryExpression_in_unaryOrNegate1186: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NOT_in_unaryExpression1214: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_primaryExpression_in_unaryExpression1217: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_primaryExpression_in_unaryExpression1229: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_87_in_primaryExpression1260: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_primaryExpression1263: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_89_in_primaryExpression1265: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_value_in_primaryExpression1271: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_number_in_value1285: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_bool_in_value1290: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_funOrIdent_in_value1295: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_primitive_in_value1300: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_material_in_value1305: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_array_in_value1310: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LARR_in_array1321: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801FC2, 0x00000000]),
    FOLLOW_logicalExpression_in_array1324: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000100, 0x00000000]),
    FOLLOW_88_in_array1327: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_array1329: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000100, 0x00000000]),
    FOLLOW_RARR_in_array1335: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_number0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_bool0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_91_in_material1523: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_additiveExpression_in_material1525: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitMultiplicativeExpression_in_material1527: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_92_in_material1529: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unitClump_in_unitMultiplicativeExpression1550: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000000C, 0x00000000]),
    FOLLOW_set_in_unitMultiplicativeExpression1554: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitClump_in_unitMultiplicativeExpression1561: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000000C, 0x00000000]),
    FOLLOW_INTEGER_in_unitClump1576: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000008, 0x00000000]),
    FOLLOW_DIV_in_unitClump1578: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitPowerExpression_in_unitClump1581: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unitPowerExpression_in_unitClump1597: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unit_in_unitPowerExpression1618: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_POW_in_unitPowerExpression1622: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000602, 0x00000000]),
    FOLLOW_MINUS_in_unitPowerExpression1625: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_set_in_unitPowerExpression1628: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_IDENT_in_unit1645: new org.antlr.runtime.BitSet([0x00000002, 0x00200000]),
    FOLLOW_IDENT_in_unit1648: new org.antlr.runtime.BitSet([0x00000002, 0x00200000]),
    FOLLOW_87_in_unit1665: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitMultiplicativeExpression_in_unit1667: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_89_in_unit1669: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_funOrIdent1715: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_funOrIdent1717: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x0A801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_funOrIdent1721: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_funOrIdent1724: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_funOrIdent1726: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_funOrIdent1733: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_funOrIdent1750: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PRIMITIVE_in_primitive1806: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_synpred1_Formula1694: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_synpred1_Formula1696: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x0A801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_synpred1_Formula1700: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_synpred1_Formula1703: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_synpred1_Formula1705: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_synpred1_Formula1712: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();