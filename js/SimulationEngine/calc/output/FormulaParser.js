// $ANTLR 3.3 Nov 30, 2010 12:45:30 /Library/WebServer/Documents/calc/Formula.g 2012-12-05 14:17:47

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

                if ( (LA4_0==WHILESTATEMENT||LA4_0==FORSTATEMENT||LA4_0==IFSTATEMENT||LA4_0==FUNCTIONSTATEMENT||(LA4_0>=RETURNSTATEMENT && LA4_0<=IDENT)||LA4_0==PRIMITIVE||LA4_0==MINUS||(LA4_0>=NOT && LA4_0<=LARR)||(LA4_0>=INTEGER && LA4_0<=FALSE)||LA4_0==87||LA4_0==91) ) {
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

    // /Library/WebServer/Documents/calc/Formula.g:92:1: expression : ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef | returnExp );
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
         var returnExp13 = null;


        try {
            // /Library/WebServer/Documents/calc/Formula.g:93:2: ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef | returnExp )
            var alt5=8;
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
                case 8 :
                    // /Library/WebServer/Documents/calc/Formula.g:100:5: returnExp
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_returnExp_in_expression432);
                    returnExp13=this.returnExp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, returnExp13.getTree());


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
    returnExp_return: (function() {
        FormulaParser.returnExp_return = function(){};
        org.antlr.lang.extend(FormulaParser.returnExp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:103:1: returnExp : RETURNSTATEMENT logicalExpression ;
    // $ANTLR start "returnExp"
    returnExp: function() {
        var retval = new FormulaParser.returnExp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var RETURNSTATEMENT14 = null;
         var logicalExpression15 = null;

        var RETURNSTATEMENT14_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:104:2: ( RETURNSTATEMENT logicalExpression )
            // /Library/WebServer/Documents/calc/Formula.g:105:2: RETURNSTATEMENT logicalExpression
            root_0 = this.adaptor.nil();

            RETURNSTATEMENT14=this.match(this.input,RETURNSTATEMENT,FormulaParser.FOLLOW_RETURNSTATEMENT_in_returnExp444); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) {
            RETURNSTATEMENT14_tree = this.adaptor.create(RETURNSTATEMENT14);
            root_0 = this.adaptor.becomeRoot(RETURNSTATEMENT14_tree, root_0);
            }
            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_returnExp447);
            logicalExpression15=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, logicalExpression15.getTree());



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

    // /Library/WebServer/Documents/calc/Formula.g:108:1: innerBlock : ( expression ( ( NEWLINE )+ ) )* -> ^( LINES ( expression )+ ) ;
    // $ANTLR start "innerBlock"
    innerBlock: function() {
        var retval = new FormulaParser.innerBlock_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NEWLINE17 = null;
         var expression16 = null;

        var NEWLINE17_tree=null;
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_expression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:109:2: ( ( expression ( ( NEWLINE )+ ) )* -> ^( LINES ( expression )+ ) )
            // /Library/WebServer/Documents/calc/Formula.g:109:4: ( expression ( ( NEWLINE )+ ) )*
            // /Library/WebServer/Documents/calc/Formula.g:109:4: ( expression ( ( NEWLINE )+ ) )*
            loop7:
            do {
                var alt7=2;
                var LA7_0 = this.input.LA(1);

                if ( (LA7_0==WHILESTATEMENT||LA7_0==FORSTATEMENT||LA7_0==IFSTATEMENT||LA7_0==FUNCTIONSTATEMENT||(LA7_0>=RETURNSTATEMENT && LA7_0<=IDENT)||LA7_0==PRIMITIVE||LA7_0==MINUS||(LA7_0>=NOT && LA7_0<=LARR)||(LA7_0>=INTEGER && LA7_0<=FALSE)||LA7_0==87||LA7_0==91) ) {
                    alt7=1;
                }


                switch (alt7) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:109:5: expression ( ( NEWLINE )+ )
                    this.pushFollow(FormulaParser.FOLLOW_expression_in_innerBlock460);
                    expression16=this.expression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_expression.add(expression16.getTree());
                    // /Library/WebServer/Documents/calc/Formula.g:109:17: ( ( NEWLINE )+ )
                    // /Library/WebServer/Documents/calc/Formula.g:109:18: ( NEWLINE )+
                    // /Library/WebServer/Documents/calc/Formula.g:109:18: ( NEWLINE )+
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
                            // /Library/WebServer/Documents/calc/Formula.g:109:18: NEWLINE
                            NEWLINE17=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_innerBlock464); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE17);



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
            // 109:30: -> ^( LINES ( expression )+ )
            {
                // /Library/WebServer/Documents/calc/Formula.g:109:33: ^( LINES ( expression )+ )
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

    // /Library/WebServer/Documents/calc/Formula.g:112:1: whileLoop : WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( WHILE logicalExpression innerBlock ) ;
    // $ANTLR start "whileLoop"
    whileLoop: function() {
        var retval = new FormulaParser.whileLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var WHILESTATEMENT18 = null;
        var NEWLINE20 = null;
        var ENDBLOCK22 = null;
        var LOOPSTATEMENT23 = null;
         var logicalExpression19 = null;
         var innerBlock21 = null;

        var WHILESTATEMENT18_tree=null;
        var NEWLINE20_tree=null;
        var ENDBLOCK22_tree=null;
        var LOOPSTATEMENT23_tree=null;
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_LOOPSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOPSTATEMENT");
        var stream_WHILESTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token WHILESTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:113:2: ( WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( WHILE logicalExpression innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:113:4: WHILESTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            WHILESTATEMENT18=this.match(this.input,WHILESTATEMENT,FormulaParser.FOLLOW_WHILESTATEMENT_in_whileLoop489); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_WHILESTATEMENT.add(WHILESTATEMENT18);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_whileLoop491);
            logicalExpression19=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression19.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:113:37: ( NEWLINE )+
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
                    // /Library/WebServer/Documents/calc/Formula.g:113:37: NEWLINE
                    NEWLINE20=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_whileLoop493); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE20);



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

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_whileLoop496);
            innerBlock21=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock21.getTree());
            ENDBLOCK22=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_whileLoop499); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK22);

            LOOPSTATEMENT23=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_whileLoop501); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT23);



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
            // 113:81: -> ^( WHILE logicalExpression innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:113:84: ^( WHILE logicalExpression innerBlock )
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

    // /Library/WebServer/Documents/calc/Formula.g:116:1: forLoop : FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock ) ;
    // $ANTLR start "forLoop"
    forLoop: function() {
        var retval = new FormulaParser.forLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FORSTATEMENT24 = null;
        var IDENT25 = null;
        var FROMSTATEMENT26 = null;
        var TOSTATEMENT28 = null;
        var BYSTATEMENT30 = null;
        var NEWLINE32 = null;
        var ENDBLOCK34 = null;
        var LOOPSTATEMENT35 = null;
         var logicalExpression27 = null;
         var logicalExpression29 = null;
         var logicalExpression31 = null;
         var innerBlock33 = null;

        var FORSTATEMENT24_tree=null;
        var IDENT25_tree=null;
        var FROMSTATEMENT26_tree=null;
        var TOSTATEMENT28_tree=null;
        var BYSTATEMENT30_tree=null;
        var NEWLINE32_tree=null;
        var ENDBLOCK34_tree=null;
        var LOOPSTATEMENT35_tree=null;
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
            // /Library/WebServer/Documents/calc/Formula.g:117:2: ( FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:117:4: FORSTATEMENT IDENT FROMSTATEMENT logicalExpression TOSTATEMENT logicalExpression ( BYSTATEMENT logicalExpression )? ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            FORSTATEMENT24=this.match(this.input,FORSTATEMENT,FormulaParser.FOLLOW_FORSTATEMENT_in_forLoop522); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FORSTATEMENT.add(FORSTATEMENT24);

            IDENT25=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_forLoop524); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT25);

            FROMSTATEMENT26=this.match(this.input,FROMSTATEMENT,FormulaParser.FOLLOW_FROMSTATEMENT_in_forLoop526); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FROMSTATEMENT.add(FROMSTATEMENT26);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop528);
            logicalExpression27=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression27.getTree());
            TOSTATEMENT28=this.match(this.input,TOSTATEMENT,FormulaParser.FOLLOW_TOSTATEMENT_in_forLoop530); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_TOSTATEMENT.add(TOSTATEMENT28);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop532);
            logicalExpression29=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression29.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:117:85: ( BYSTATEMENT logicalExpression )?
            var alt9=2;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0==BYSTATEMENT) ) {
                alt9=1;
            }
            switch (alt9) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:117:86: BYSTATEMENT logicalExpression
                    BYSTATEMENT30=this.match(this.input,BYSTATEMENT,FormulaParser.FOLLOW_BYSTATEMENT_in_forLoop535); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_BYSTATEMENT.add(BYSTATEMENT30);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forLoop537);
                    logicalExpression31=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression31.getTree());


                    break;

            }

            // /Library/WebServer/Documents/calc/Formula.g:117:118: ( NEWLINE )+
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
                    // /Library/WebServer/Documents/calc/Formula.g:117:118: NEWLINE
                    NEWLINE32=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_forLoop541); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE32);



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

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_forLoop544);
            innerBlock33=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock33.getTree());
            ENDBLOCK34=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_forLoop547); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK34);

            LOOPSTATEMENT35=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_forLoop549); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT35);



            // AST REWRITE
            // elements: IDENT, innerBlock, logicalExpression
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 117:162: -> ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:117:165: ^( FOR IDENT ^( PARAMS ( logicalExpression )* ) innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FOR, "FOR"), root_1);

                this.adaptor.addChild(root_1, stream_IDENT.nextNode());
                // /Library/WebServer/Documents/calc/Formula.g:117:177: ^( PARAMS ( logicalExpression )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:117:186: ( logicalExpression )*
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

    // /Library/WebServer/Documents/calc/Formula.g:120:1: forInLoop : FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FORIN IDENT logicalExpression innerBlock ) ;
    // $ANTLR start "forInLoop"
    forInLoop: function() {
        var retval = new FormulaParser.forInLoop_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FORSTATEMENT36 = null;
        var IDENT37 = null;
        var INSTATEMENT38 = null;
        var NEWLINE40 = null;
        var ENDBLOCK42 = null;
        var LOOPSTATEMENT43 = null;
         var logicalExpression39 = null;
         var innerBlock41 = null;

        var FORSTATEMENT36_tree=null;
        var IDENT37_tree=null;
        var INSTATEMENT38_tree=null;
        var NEWLINE40_tree=null;
        var ENDBLOCK42_tree=null;
        var LOOPSTATEMENT43_tree=null;
        var stream_FORSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FORSTATEMENT");
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_LOOPSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOPSTATEMENT");
        var stream_INSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token INSTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:121:2: ( FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT -> ^( FORIN IDENT logicalExpression innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:121:4: FORSTATEMENT IDENT INSTATEMENT logicalExpression ( NEWLINE )+ innerBlock ENDBLOCK LOOPSTATEMENT
            FORSTATEMENT36=this.match(this.input,FORSTATEMENT,FormulaParser.FOLLOW_FORSTATEMENT_in_forInLoop577); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FORSTATEMENT.add(FORSTATEMENT36);

            IDENT37=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_forInLoop579); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT37);

            INSTATEMENT38=this.match(this.input,INSTATEMENT,FormulaParser.FOLLOW_INSTATEMENT_in_forInLoop581); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_INSTATEMENT.add(INSTATEMENT38);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_forInLoop583);
            logicalExpression39=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression39.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:121:53: ( NEWLINE )+
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
                    // /Library/WebServer/Documents/calc/Formula.g:121:53: NEWLINE
                    NEWLINE40=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_forInLoop585); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE40);



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

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_forInLoop588);
            innerBlock41=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock41.getTree());
            ENDBLOCK42=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_forInLoop591); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK42);

            LOOPSTATEMENT43=this.match(this.input,LOOPSTATEMENT,FormulaParser.FOLLOW_LOOPSTATEMENT_in_forInLoop593); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LOOPSTATEMENT.add(LOOPSTATEMENT43);



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
            // 121:98: -> ^( FORIN IDENT logicalExpression innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:121:101: ^( FORIN IDENT logicalExpression innerBlock )
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

    // /Library/WebServer/Documents/calc/Formula.g:124:1: ifThenElse : IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) ) ;
    // $ANTLR start "ifThenElse"
    ifThenElse: function() {
        var retval = new FormulaParser.ifThenElse_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IFSTATEMENT44 = null;
        var THENSTATEMENT46 = null;
        var NEWLINE47 = null;
        var ELSESTATEMENT49 = null;
        var IFSTATEMENT50 = null;
        var THENSTATEMENT52 = null;
        var NEWLINE53 = null;
        var ELSESTATEMENT55 = null;
        var NEWLINE56 = null;
        var ENDBLOCK58 = null;
        var IFSTATEMENT59 = null;
         var logicalExpression45 = null;
         var innerBlock48 = null;
         var logicalExpression51 = null;
         var innerBlock54 = null;
         var innerBlock57 = null;

        var IFSTATEMENT44_tree=null;
        var THENSTATEMENT46_tree=null;
        var NEWLINE47_tree=null;
        var ELSESTATEMENT49_tree=null;
        var IFSTATEMENT50_tree=null;
        var THENSTATEMENT52_tree=null;
        var NEWLINE53_tree=null;
        var ELSESTATEMENT55_tree=null;
        var NEWLINE56_tree=null;
        var ENDBLOCK58_tree=null;
        var IFSTATEMENT59_tree=null;
        var stream_IFSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IFSTATEMENT");
        var stream_NEWLINE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token NEWLINE");
        var stream_ENDBLOCK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ENDBLOCK");
        var stream_ELSESTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ELSESTATEMENT");
        var stream_THENSTATEMENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token THENSTATEMENT");
        var stream_innerBlock=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule innerBlock");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:125:2: ( IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) ) )
            // /Library/WebServer/Documents/calc/Formula.g:125:4: IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )* ( ELSESTATEMENT ( NEWLINE )+ innerBlock )? ENDBLOCK IFSTATEMENT
            IFSTATEMENT44=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse618); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT44);

            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_ifThenElse620);
            logicalExpression45=this.logicalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression45.getTree());
            THENSTATEMENT46=this.match(this.input,THENSTATEMENT,FormulaParser.FOLLOW_THENSTATEMENT_in_ifThenElse622); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_THENSTATEMENT.add(THENSTATEMENT46);

            // /Library/WebServer/Documents/calc/Formula.g:125:49: ( NEWLINE )+
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
                    // /Library/WebServer/Documents/calc/Formula.g:125:49: NEWLINE
                    NEWLINE47=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse625); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE47);



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

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse628);
            innerBlock48=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock48.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:125:70: ( ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock )*
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
                    // /Library/WebServer/Documents/calc/Formula.g:125:71: ELSESTATEMENT IFSTATEMENT logicalExpression THENSTATEMENT ( NEWLINE )+ innerBlock
                    ELSESTATEMENT49=this.match(this.input,ELSESTATEMENT,FormulaParser.FOLLOW_ELSESTATEMENT_in_ifThenElse632); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_ELSESTATEMENT.add(ELSESTATEMENT49);

                    IFSTATEMENT50=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse634); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT50);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_ifThenElse636);
                    logicalExpression51=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression51.getTree());
                    THENSTATEMENT52=this.match(this.input,THENSTATEMENT,FormulaParser.FOLLOW_THENSTATEMENT_in_ifThenElse638); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_THENSTATEMENT.add(THENSTATEMENT52);

                    // /Library/WebServer/Documents/calc/Formula.g:125:129: ( NEWLINE )+
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
                            // /Library/WebServer/Documents/calc/Formula.g:125:129: NEWLINE
                            NEWLINE53=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse640); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE53);



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

                    this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse643);
                    innerBlock54=this.innerBlock();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock54.getTree());


                    break;

                default :
                    break loop14;
                }
            } while (true);

            // /Library/WebServer/Documents/calc/Formula.g:125:151: ( ELSESTATEMENT ( NEWLINE )+ innerBlock )?
            var alt16=2;
            var LA16_0 = this.input.LA(1);

            if ( (LA16_0==ELSESTATEMENT) ) {
                alt16=1;
            }
            switch (alt16) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:125:152: ELSESTATEMENT ( NEWLINE )+ innerBlock
                    ELSESTATEMENT55=this.match(this.input,ELSESTATEMENT,FormulaParser.FOLLOW_ELSESTATEMENT_in_ifThenElse648); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_ELSESTATEMENT.add(ELSESTATEMENT55);

                    // /Library/WebServer/Documents/calc/Formula.g:125:166: ( NEWLINE )+
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
                            // /Library/WebServer/Documents/calc/Formula.g:125:166: NEWLINE
                            NEWLINE56=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_ifThenElse650); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE56);



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

                    this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_ifThenElse653);
                    innerBlock57=this.innerBlock();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock57.getTree());


                    break;

            }

            ENDBLOCK58=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_ifThenElse657); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK58);

            IFSTATEMENT59=this.match(this.input,IFSTATEMENT,FormulaParser.FOLLOW_IFSTATEMENT_in_ifThenElse659); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IFSTATEMENT.add(IFSTATEMENT59);



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
            // 125:209: -> ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) )
            {
                // /Library/WebServer/Documents/calc/Formula.g:125:212: ^( IFTHENELSE ^( PARAMS ( logicalExpression )+ ) ^( PARAMS ( innerBlock )+ ) )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(IFTHENELSE, "IFTHENELSE"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:125:225: ^( PARAMS ( logicalExpression )+ )
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
                // /Library/WebServer/Documents/calc/Formula.g:125:254: ^( PARAMS ( innerBlock )+ )
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

    // /Library/WebServer/Documents/calc/Formula.g:128:1: functionDef : FUNCTIONSTATEMENT IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock ) ;
    // $ANTLR start "functionDef"
    functionDef: function() {
        var retval = new FormulaParser.functionDef_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var FUNCTIONSTATEMENT60 = null;
        var IDENT61 = null;
        var char_literal62 = null;
        var IDENT63 = null;
        var EQUALS64 = null;
        var char_literal66 = null;
        var IDENT67 = null;
        var char_literal68 = null;
        var IDENT69 = null;
        var EQUALS70 = null;
        var char_literal72 = null;
        var NEWLINE73 = null;
        var ENDBLOCK75 = null;
        var FUNCTIONSTATEMENT76 = null;
         var number65 = null;
         var number71 = null;
         var innerBlock74 = null;

        var FUNCTIONSTATEMENT60_tree=null;
        var IDENT61_tree=null;
        var char_literal62_tree=null;
        var IDENT63_tree=null;
        var EQUALS64_tree=null;
        var char_literal66_tree=null;
        var IDENT67_tree=null;
        var char_literal68_tree=null;
        var IDENT69_tree=null;
        var EQUALS70_tree=null;
        var char_literal72_tree=null;
        var NEWLINE73_tree=null;
        var ENDBLOCK75_tree=null;
        var FUNCTIONSTATEMENT76_tree=null;
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
            // /Library/WebServer/Documents/calc/Formula.g:129:2: ( FUNCTIONSTATEMENT IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock ) )
            // /Library/WebServer/Documents/calc/Formula.g:129:4: FUNCTIONSTATEMENT IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' ( NEWLINE )+ innerBlock ENDBLOCK FUNCTIONSTATEMENT
            FUNCTIONSTATEMENT60=this.match(this.input,FUNCTIONSTATEMENT,FormulaParser.FOLLOW_FUNCTIONSTATEMENT_in_functionDef690); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FUNCTIONSTATEMENT.add(FUNCTIONSTATEMENT60);

            IDENT61=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef692); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT61);

            char_literal62=this.match(this.input,87,FormulaParser.FOLLOW_87_in_functionDef694); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_87.add(char_literal62);

            // /Library/WebServer/Documents/calc/Formula.g:129:32: ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )?
            var alt20=2;
            var LA20_0 = this.input.LA(1);

            if ( (LA20_0==IDENT) ) {
                alt20=1;
            }
            switch (alt20) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:129:33: IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )*
                    IDENT63=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef697); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT63);

                    // /Library/WebServer/Documents/calc/Formula.g:129:40: ( EQUALS number | ( ',' IDENT )* )
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
                            // /Library/WebServer/Documents/calc/Formula.g:129:41: EQUALS number
                            EQUALS64=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_functionDef701); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS64);

                            this.pushFollow(FormulaParser.FOLLOW_number_in_functionDef703);
                            number65=this.number();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_number.add(number65.getTree());


                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:129:57: ( ',' IDENT )*
                            // /Library/WebServer/Documents/calc/Formula.g:129:57: ( ',' IDENT )*
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
                                    // /Library/WebServer/Documents/calc/Formula.g:129:58: ',' IDENT
                                    char_literal66=this.match(this.input,88,FormulaParser.FOLLOW_88_in_functionDef708); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_88.add(char_literal66);

                                    IDENT67=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef710); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT67);



                                    break;

                                default :
                                    break loop17;
                                }
                            } while (true);



                            break;

                    }

                    // /Library/WebServer/Documents/calc/Formula.g:129:72: ( ',' IDENT EQUALS number )*
                    loop19:
                    do {
                        var alt19=2;
                        var LA19_0 = this.input.LA(1);

                        if ( (LA19_0==88) ) {
                            alt19=1;
                        }


                        switch (alt19) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:129:73: ',' IDENT EQUALS number
                            char_literal68=this.match(this.input,88,FormulaParser.FOLLOW_88_in_functionDef717); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_88.add(char_literal68);

                            IDENT69=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_functionDef719); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT69);

                            EQUALS70=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_functionDef721); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS70);

                            this.pushFollow(FormulaParser.FOLLOW_number_in_functionDef723);
                            number71=this.number();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_number.add(number71.getTree());


                            break;

                        default :
                            break loop19;
                        }
                    } while (true);



                    break;

            }

            char_literal72=this.match(this.input,89,FormulaParser.FOLLOW_89_in_functionDef730); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_89.add(char_literal72);

            // /Library/WebServer/Documents/calc/Formula.g:129:106: ( NEWLINE )+
            var cnt21=0;
            loop21:
            do {
                var alt21=2;
                var LA21_0 = this.input.LA(1);

                if ( (LA21_0==NEWLINE) ) {
                    alt21=1;
                }


                switch (alt21) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:129:106: NEWLINE
                    NEWLINE73=this.match(this.input,NEWLINE,FormulaParser.FOLLOW_NEWLINE_in_functionDef732); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_NEWLINE.add(NEWLINE73);



                    break;

                default :
                    if ( cnt21 >= 1 ) {
                        break loop21;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(21, this.input);
                        throw eee;
                }
                cnt21++;
            } while (true);

            this.pushFollow(FormulaParser.FOLLOW_innerBlock_in_functionDef735);
            innerBlock74=this.innerBlock();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_innerBlock.add(innerBlock74.getTree());
            ENDBLOCK75=this.match(this.input,ENDBLOCK,FormulaParser.FOLLOW_ENDBLOCK_in_functionDef738); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_ENDBLOCK.add(ENDBLOCK75);

            FUNCTIONSTATEMENT76=this.match(this.input,FUNCTIONSTATEMENT,FormulaParser.FOLLOW_FUNCTIONSTATEMENT_in_functionDef740); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_FUNCTIONSTATEMENT.add(FUNCTIONSTATEMENT76);



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
            // 129:154: -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock )
            {
                // /Library/WebServer/Documents/calc/Formula.g:129:157: ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) innerBlock )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCTION, "FUNCTION"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:129:168: ^( PARAMS ( IDENT )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:129:177: ( IDENT )*
                while ( stream_IDENT.hasNext() ) {
                    this.adaptor.addChild(root_2, stream_IDENT.nextNode());

                }
                stream_IDENT.reset();

                this.adaptor.addChild(root_1, root_2);
                }
                // /Library/WebServer/Documents/calc/Formula.g:129:185: ^( DEFAULTS ( number )* )
                {
                var root_2 = this.adaptor.nil();
                root_2 = this.adaptor.becomeRoot(this.adaptor.create(DEFAULTS, "DEFAULTS"), root_2);

                // /Library/WebServer/Documents/calc/Formula.g:129:196: ( number )*
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

    // /Library/WebServer/Documents/calc/Formula.g:132:1: assignment : ( IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' '<-' logicalExpression -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression ) | ( PRIMITIVE | IDENT ) '<-' logicalExpression -> ^( ASSIGN ( PRIMITIVE )* ( IDENT )* logicalExpression ) );
    // $ANTLR start "assignment"
    assignment: function() {
        var retval = new FormulaParser.assignment_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IDENT77 = null;
        var char_literal78 = null;
        var IDENT79 = null;
        var EQUALS80 = null;
        var char_literal82 = null;
        var IDENT83 = null;
        var char_literal84 = null;
        var IDENT85 = null;
        var EQUALS86 = null;
        var char_literal88 = null;
        var string_literal89 = null;
        var PRIMITIVE91 = null;
        var IDENT92 = null;
        var string_literal93 = null;
         var number81 = null;
         var number87 = null;
         var logicalExpression90 = null;
         var logicalExpression94 = null;

        var IDENT77_tree=null;
        var char_literal78_tree=null;
        var IDENT79_tree=null;
        var EQUALS80_tree=null;
        var char_literal82_tree=null;
        var IDENT83_tree=null;
        var char_literal84_tree=null;
        var IDENT85_tree=null;
        var EQUALS86_tree=null;
        var char_literal88_tree=null;
        var string_literal89_tree=null;
        var PRIMITIVE91_tree=null;
        var IDENT92_tree=null;
        var string_literal93_tree=null;
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
            // /Library/WebServer/Documents/calc/Formula.g:133:2: ( IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' '<-' logicalExpression -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression ) | ( PRIMITIVE | IDENT ) '<-' logicalExpression -> ^( ASSIGN ( PRIMITIVE )* ( IDENT )* logicalExpression ) )
            var alt27=2;
            var LA27_0 = this.input.LA(1);

            if ( (LA27_0==IDENT) ) {
                var LA27_1 = this.input.LA(2);

                if ( (LA27_1==87) ) {
                    alt27=1;
                }
                else if ( (LA27_1==90) ) {
                    alt27=2;
                }
                else {
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 27, 1, this.input);

                    throw nvae;
                }
            }
            else if ( (LA27_0==PRIMITIVE) ) {
                alt27=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 27, 0, this.input);

                throw nvae;
            }
            switch (alt27) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:134:2: IDENT '(' ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )? ')' '<-' logicalExpression
                    IDENT77=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment775); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT77);

                    char_literal78=this.match(this.input,87,FormulaParser.FOLLOW_87_in_assignment777); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_87.add(char_literal78);

                    // /Library/WebServer/Documents/calc/Formula.g:134:12: ( IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )* )?
                    var alt25=2;
                    var LA25_0 = this.input.LA(1);

                    if ( (LA25_0==IDENT) ) {
                        alt25=1;
                    }
                    switch (alt25) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:134:13: IDENT ( EQUALS number | ( ',' IDENT )* ) ( ',' IDENT EQUALS number )*
                            IDENT79=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment780); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT79);

                            // /Library/WebServer/Documents/calc/Formula.g:134:20: ( EQUALS number | ( ',' IDENT )* )
                            var alt23=2;
                            var LA23_0 = this.input.LA(1);

                            if ( (LA23_0==EQUALS) ) {
                                alt23=1;
                            }
                            else if ( ((LA23_0>=88 && LA23_0<=89)) ) {
                                alt23=2;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 23, 0, this.input);

                                throw nvae;
                            }
                            switch (alt23) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:134:21: EQUALS number
                                    EQUALS80=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_assignment784); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS80);

                                    this.pushFollow(FormulaParser.FOLLOW_number_in_assignment786);
                                    number81=this.number();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_number.add(number81.getTree());


                                    break;
                                case 2 :
                                    // /Library/WebServer/Documents/calc/Formula.g:134:37: ( ',' IDENT )*
                                    // /Library/WebServer/Documents/calc/Formula.g:134:37: ( ',' IDENT )*
                                    loop22:
                                    do {
                                        var alt22=2;
                                        var LA22_0 = this.input.LA(1);

                                        if ( (LA22_0==88) ) {
                                            var LA22_1 = this.input.LA(2);

                                            if ( (LA22_1==IDENT) ) {
                                                var LA22_3 = this.input.LA(3);

                                                if ( ((LA22_3>=88 && LA22_3<=89)) ) {
                                                    alt22=1;
                                                }


                                            }


                                        }


                                        switch (alt22) {
                                        case 1 :
                                            // /Library/WebServer/Documents/calc/Formula.g:134:38: ',' IDENT
                                            char_literal82=this.match(this.input,88,FormulaParser.FOLLOW_88_in_assignment791); if (this.state.failed) return retval; 
                                            if ( this.state.backtracking===0 ) stream_88.add(char_literal82);

                                            IDENT83=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment793); if (this.state.failed) return retval; 
                                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT83);



                                            break;

                                        default :
                                            break loop22;
                                        }
                                    } while (true);



                                    break;

                            }

                            // /Library/WebServer/Documents/calc/Formula.g:134:52: ( ',' IDENT EQUALS number )*
                            loop24:
                            do {
                                var alt24=2;
                                var LA24_0 = this.input.LA(1);

                                if ( (LA24_0==88) ) {
                                    alt24=1;
                                }


                                switch (alt24) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:134:53: ',' IDENT EQUALS number
                                    char_literal84=this.match(this.input,88,FormulaParser.FOLLOW_88_in_assignment800); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_88.add(char_literal84);

                                    IDENT85=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment802); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT85);

                                    EQUALS86=this.match(this.input,EQUALS,FormulaParser.FOLLOW_EQUALS_in_assignment804); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_EQUALS.add(EQUALS86);

                                    this.pushFollow(FormulaParser.FOLLOW_number_in_assignment806);
                                    number87=this.number();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_number.add(number87.getTree());


                                    break;

                                default :
                                    break loop24;
                                }
                            } while (true);



                            break;

                    }

                    char_literal88=this.match(this.input,89,FormulaParser.FOLLOW_89_in_assignment813); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_89.add(char_literal88);

                    string_literal89=this.match(this.input,90,FormulaParser.FOLLOW_90_in_assignment815); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_90.add(string_literal89);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_assignment817);
                    logicalExpression90=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression90.getTree());


                    // AST REWRITE
                    // elements: logicalExpression, number, IDENT
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 134:109: -> ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:134:112: ^( FUNCTION ^( PARAMS ( IDENT )* ) ^( DEFAULTS ( number )* ) logicalExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCTION, "FUNCTION"), root_1);

                        // /Library/WebServer/Documents/calc/Formula.g:134:123: ^( PARAMS ( IDENT )* )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(PARAMS, "PARAMS"), root_2);

                        // /Library/WebServer/Documents/calc/Formula.g:134:132: ( IDENT )*
                        while ( stream_IDENT.hasNext() ) {
                            this.adaptor.addChild(root_2, stream_IDENT.nextNode());

                        }
                        stream_IDENT.reset();

                        this.adaptor.addChild(root_1, root_2);
                        }
                        // /Library/WebServer/Documents/calc/Formula.g:134:140: ^( DEFAULTS ( number )* )
                        {
                        var root_2 = this.adaptor.nil();
                        root_2 = this.adaptor.becomeRoot(this.adaptor.create(DEFAULTS, "DEFAULTS"), root_2);

                        // /Library/WebServer/Documents/calc/Formula.g:134:151: ( number )*
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

                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:135:2: ( PRIMITIVE | IDENT ) '<-' logicalExpression
                    // /Library/WebServer/Documents/calc/Formula.g:135:2: ( PRIMITIVE | IDENT )
                    var alt26=2;
                    var LA26_0 = this.input.LA(1);

                    if ( (LA26_0==PRIMITIVE) ) {
                        alt26=1;
                    }
                    else if ( (LA26_0==IDENT) ) {
                        alt26=2;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 26, 0, this.input);

                        throw nvae;
                    }
                    switch (alt26) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:135:3: PRIMITIVE
                            PRIMITIVE91=this.match(this.input,PRIMITIVE,FormulaParser.FOLLOW_PRIMITIVE_in_assignment845); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_PRIMITIVE.add(PRIMITIVE91);



                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:135:15: IDENT
                            IDENT92=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_assignment849); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT92);



                            break;

                    }

                    string_literal93=this.match(this.input,90,FormulaParser.FOLLOW_90_in_assignment853); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_90.add(string_literal93);

                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_assignment855);
                    logicalExpression94=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression94.getTree());


                    // AST REWRITE
                    // elements: logicalExpression, PRIMITIVE, IDENT
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 135:46: -> ^( ASSIGN ( PRIMITIVE )* ( IDENT )* logicalExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:135:49: ^( ASSIGN ( PRIMITIVE )* ( IDENT )* logicalExpression )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(ASSIGN, "ASSIGN"), root_1);

                        // /Library/WebServer/Documents/calc/Formula.g:135:58: ( PRIMITIVE )*
                        while ( stream_PRIMITIVE.hasNext() ) {
                            this.adaptor.addChild(root_1, stream_PRIMITIVE.nextNode());

                        }
                        stream_PRIMITIVE.reset();
                        // /Library/WebServer/Documents/calc/Formula.g:135:69: ( IDENT )*
                        while ( stream_IDENT.hasNext() ) {
                            this.adaptor.addChild(root_1, stream_IDENT.nextNode());

                        }
                        stream_IDENT.reset();
                        this.adaptor.addChild(root_1, stream_logicalExpression.nextTree());

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
    logicalExpression_return: (function() {
        FormulaParser.logicalExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.logicalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:139:1: logicalExpression : booleanAndExpression ( OR booleanAndExpression )* ;
    // $ANTLR start "logicalExpression"
    logicalExpression: function() {
        var retval = new FormulaParser.logicalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR96 = null;
         var booleanAndExpression95 = null;
         var booleanAndExpression97 = null;

        var OR96_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:140:2: ( booleanAndExpression ( OR booleanAndExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:140:4: booleanAndExpression ( OR booleanAndExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_booleanAndExpression_in_logicalExpression884);
            booleanAndExpression95=this.booleanAndExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, booleanAndExpression95.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:140:25: ( OR booleanAndExpression )*
            loop28:
            do {
                var alt28=2;
                var LA28_0 = this.input.LA(1);

                if ( (LA28_0==OR) ) {
                    alt28=1;
                }


                switch (alt28) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:140:26: OR booleanAndExpression
                    OR96=this.match(this.input,OR,FormulaParser.FOLLOW_OR_in_logicalExpression887); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    OR96_tree = this.adaptor.create(OR96);
                    root_0 = this.adaptor.becomeRoot(OR96_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_booleanAndExpression_in_logicalExpression890);
                    booleanAndExpression97=this.booleanAndExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, booleanAndExpression97.getTree());


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
    booleanAndExpression_return: (function() {
        FormulaParser.booleanAndExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.booleanAndExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:145:1: booleanAndExpression : equalityExpression ( AND equalityExpression )* ;
    // $ANTLR start "booleanAndExpression"
    booleanAndExpression: function() {
        var retval = new FormulaParser.booleanAndExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND99 = null;
         var equalityExpression98 = null;
         var equalityExpression100 = null;

        var AND99_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:146:2: ( equalityExpression ( AND equalityExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:146:4: equalityExpression ( AND equalityExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_equalityExpression_in_booleanAndExpression921);
            equalityExpression98=this.equalityExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalityExpression98.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:146:23: ( AND equalityExpression )*
            loop29:
            do {
                var alt29=2;
                var LA29_0 = this.input.LA(1);

                if ( (LA29_0==AND) ) {
                    alt29=1;
                }


                switch (alt29) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:146:24: AND equalityExpression
                    AND99=this.match(this.input,AND,FormulaParser.FOLLOW_AND_in_booleanAndExpression924); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    AND99_tree = this.adaptor.create(AND99);
                    root_0 = this.adaptor.becomeRoot(AND99_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_equalityExpression_in_booleanAndExpression927);
                    equalityExpression100=this.equalityExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalityExpression100.getTree());


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
    equalityExpression_return: (function() {
        FormulaParser.equalityExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.equalityExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:151:1: equalityExpression : relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )* ;
    // $ANTLR start "equalityExpression"
    equalityExpression: function() {
        var retval = new FormulaParser.equalityExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set102 = null;
         var relationalExpression101 = null;
         var relationalExpression103 = null;

        var set102_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:152:2: ( relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:152:4: relationalExpression ( ( EQUALS | NOTEQUALS ) relationalExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_relationalExpression_in_equalityExpression958);
            relationalExpression101=this.relationalExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, relationalExpression101.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:152:25: ( ( EQUALS | NOTEQUALS ) relationalExpression )*
            loop30:
            do {
                var alt30=2;
                var LA30_0 = this.input.LA(1);

                if ( (LA30_0==EQUALS||LA30_0==NOTEQUALS) ) {
                    alt30=1;
                }


                switch (alt30) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:152:26: ( EQUALS | NOTEQUALS ) relationalExpression
                    
                    set102=this.input.LT(1);
                    if ( this.input.LA(1)==EQUALS||this.input.LA(1)==NOTEQUALS ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set102), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_relationalExpression_in_equalityExpression968);
                    relationalExpression103=this.relationalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, relationalExpression103.getTree());


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
    relationalExpression_return: (function() {
        FormulaParser.relationalExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.relationalExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:162:1: relationalExpression : additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )* ;
    // $ANTLR start "relationalExpression"
    relationalExpression: function() {
        var retval = new FormulaParser.relationalExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set105 = null;
         var additiveExpression104 = null;
         var additiveExpression106 = null;

        var set105_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:163:2: ( additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:163:4: additiveExpression ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_relationalExpression1010);
            additiveExpression104=this.additiveExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, additiveExpression104.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:163:23: ( ( LT | LTEQ | GT | GTEQ ) additiveExpression )*
            loop31:
            do {
                var alt31=2;
                var LA31_0 = this.input.LA(1);

                if ( ((LA31_0>=LT && LA31_0<=GTEQ)) ) {
                    alt31=1;
                }


                switch (alt31) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:163:25: ( LT | LTEQ | GT | GTEQ ) additiveExpression
                    
                    set105=this.input.LT(1);
                    if ( (this.input.LA(1)>=LT && this.input.LA(1)<=GTEQ) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set105), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_relationalExpression1025);
                    additiveExpression106=this.additiveExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, additiveExpression106.getTree());


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
    additiveExpression_return: (function() {
        FormulaParser.additiveExpression_return = function(){};
        org.antlr.lang.extend(FormulaParser.additiveExpression_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // /Library/WebServer/Documents/calc/Formula.g:171:1: additiveExpression : multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )* ;
    // $ANTLR start "additiveExpression"
    additiveExpression: function() {
        var retval = new FormulaParser.additiveExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set108 = null;
         var multiplicativeExpression107 = null;
         var multiplicativeExpression109 = null;

        var set108_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:172:2: ( multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:172:4: multiplicativeExpression ( ( PLUS | MINUS ) multiplicativeExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_multiplicativeExpression_in_additiveExpression1068);
            multiplicativeExpression107=this.multiplicativeExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplicativeExpression107.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:172:29: ( ( PLUS | MINUS ) multiplicativeExpression )*
            loop32:
            do {
                var alt32=2;
                var LA32_0 = this.input.LA(1);

                if ( ((LA32_0>=PLUS && LA32_0<=MINUS)) ) {
                    alt32=1;
                }


                switch (alt32) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:172:31: ( PLUS | MINUS ) multiplicativeExpression
                   
                    set108=this.input.LT(1);
                    if ( (this.input.LA(1)>=PLUS && this.input.LA(1)<=MINUS) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set108), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_multiplicativeExpression_in_additiveExpression1079);
                    multiplicativeExpression109=this.multiplicativeExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplicativeExpression109.getTree());


                    break;

                default :
                    break loop32;
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

    // /Library/WebServer/Documents/calc/Formula.g:178:1: multiplicativeExpression : negationExpression ( ( MULT | DIV | MOD ) negationExpression )* ;
    // $ANTLR start "multiplicativeExpression"
    multiplicativeExpression: function() {
        var retval = new FormulaParser.multiplicativeExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set111 = null;
         var negationExpression110 = null;
         var negationExpression112 = null;

        var set111_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:179:2: ( negationExpression ( ( MULT | DIV | MOD ) negationExpression )* )
            // /Library/WebServer/Documents/calc/Formula.g:179:4: negationExpression ( ( MULT | DIV | MOD ) negationExpression )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_negationExpression_in_multiplicativeExpression1109);
            negationExpression110=this.negationExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, negationExpression110.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:179:23: ( ( MULT | DIV | MOD ) negationExpression )*
            loop33:
            do {
                var alt33=2;
                var LA33_0 = this.input.LA(1);

                if ( ((LA33_0>=MULT && LA33_0<=MOD)) ) {
                    alt33=1;
                }


                switch (alt33) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:179:25: ( MULT | DIV | MOD ) negationExpression
                    
                    set111=this.input.LT(1);
                    if ( (this.input.LA(1)>=MULT && this.input.LA(1)<=MOD) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set111), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_negationExpression_in_multiplicativeExpression1122);
                    negationExpression112=this.negationExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, negationExpression112.getTree());


                    break;

                default :
                    break loop33;
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

    // /Library/WebServer/Documents/calc/Formula.g:186:1: negationExpression : ( MINUS powerExpression -> ^( NEGATE powerExpression ) | powerExpression );
    // $ANTLR start "negationExpression"
    negationExpression: function() {
        var retval = new FormulaParser.negationExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var MINUS113 = null;
         var powerExpression114 = null;
         var powerExpression115 = null;

        var MINUS113_tree=null;
        var stream_MINUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MINUS");
        var stream_powerExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule powerExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:187:2: ( MINUS powerExpression -> ^( NEGATE powerExpression ) | powerExpression )
            var alt34=2;
            var LA34_0 = this.input.LA(1);

            if ( (LA34_0==MINUS) ) {
                alt34=1;
            }
            else if ( (LA34_0==IDENT||LA34_0==PRIMITIVE||(LA34_0>=NOT && LA34_0<=LARR)||(LA34_0>=INTEGER && LA34_0<=FALSE)||LA34_0==87||LA34_0==91) ) {
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
                    // /Library/WebServer/Documents/calc/Formula.g:187:4: MINUS powerExpression
                    MINUS113=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_negationExpression1167); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_MINUS.add(MINUS113);

                    this.pushFollow(FormulaParser.FOLLOW_powerExpression_in_negationExpression1169);
                    powerExpression114=this.powerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_powerExpression.add(powerExpression114.getTree());


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
                    // 187:26: -> ^( NEGATE powerExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:187:29: ^( NEGATE powerExpression )
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
                    // /Library/WebServer/Documents/calc/Formula.g:188:3: powerExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_powerExpression_in_negationExpression1183);
                    powerExpression115=this.powerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, powerExpression115.getTree());


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

    // /Library/WebServer/Documents/calc/Formula.g:190:1: powerExpression : unaryExpression ( POW unaryOrNegate )* -> ^( POWER unaryExpression ( unaryOrNegate )* ) ;
    // $ANTLR start "powerExpression"
    powerExpression: function() {
        var retval = new FormulaParser.powerExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var POW117 = null;
         var unaryExpression116 = null;
         var unaryOrNegate118 = null;

        var POW117_tree=null;
        var stream_POW=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token POW");
        var stream_unaryOrNegate=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryOrNegate");
        var stream_unaryExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:191:2: ( unaryExpression ( POW unaryOrNegate )* -> ^( POWER unaryExpression ( unaryOrNegate )* ) )
            // /Library/WebServer/Documents/calc/Formula.g:191:4: unaryExpression ( POW unaryOrNegate )*
            this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_powerExpression1194);
            unaryExpression116=this.unaryExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_unaryExpression.add(unaryExpression116.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:191:20: ( POW unaryOrNegate )*
            loop35:
            do {
                var alt35=2;
                var LA35_0 = this.input.LA(1);

                if ( (LA35_0==POW) ) {
                    alt35=1;
                }


                switch (alt35) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:191:21: POW unaryOrNegate
                    POW117=this.match(this.input,POW,FormulaParser.FOLLOW_POW_in_powerExpression1197); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_POW.add(POW117);

                    this.pushFollow(FormulaParser.FOLLOW_unaryOrNegate_in_powerExpression1199);
                    unaryOrNegate118=this.unaryOrNegate();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unaryOrNegate.add(unaryOrNegate118.getTree());


                    break;

                default :
                    break loop35;
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
            // 191:43: -> ^( POWER unaryExpression ( unaryOrNegate )* )
            {
                // /Library/WebServer/Documents/calc/Formula.g:191:47: ^( POWER unaryExpression ( unaryOrNegate )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(POWER, "POWER"), root_1);

                this.adaptor.addChild(root_1, stream_unaryExpression.nextTree());
                // /Library/WebServer/Documents/calc/Formula.g:191:71: ( unaryOrNegate )*
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

    // /Library/WebServer/Documents/calc/Formula.g:194:1: unaryOrNegate : ( unaryExpression | MINUS unaryExpression -> ^( NEGATE unaryExpression ) );
    // $ANTLR start "unaryOrNegate"
    unaryOrNegate: function() {
        var retval = new FormulaParser.unaryOrNegate_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var MINUS120 = null;
         var unaryExpression119 = null;
         var unaryExpression121 = null;

        var MINUS120_tree=null;
        var stream_MINUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MINUS");
        var stream_unaryExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unaryExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:195:2: ( unaryExpression | MINUS unaryExpression -> ^( NEGATE unaryExpression ) )
            var alt36=2;
            var LA36_0 = this.input.LA(1);

            if ( (LA36_0==IDENT||LA36_0==PRIMITIVE||(LA36_0>=NOT && LA36_0<=LARR)||(LA36_0>=INTEGER && LA36_0<=FALSE)||LA36_0==87||LA36_0==91) ) {
                alt36=1;
            }
            else if ( (LA36_0==MINUS) ) {
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
                    // /Library/WebServer/Documents/calc/Formula.g:195:4: unaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_unaryOrNegate1226);
                    unaryExpression119=this.unaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unaryExpression119.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:196:3: MINUS unaryExpression
                    MINUS120=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_unaryOrNegate1232); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_MINUS.add(MINUS120);

                    this.pushFollow(FormulaParser.FOLLOW_unaryExpression_in_unaryOrNegate1234);
                    unaryExpression121=this.unaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unaryExpression.add(unaryExpression121.getTree());


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
                    // 196:25: -> ^( NEGATE unaryExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:196:28: ^( NEGATE unaryExpression )
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

    // /Library/WebServer/Documents/calc/Formula.g:201:1: unaryExpression : ( NOT primaryExpression | primaryExpression );
    // $ANTLR start "unaryExpression"
    unaryExpression: function() {
        var retval = new FormulaParser.unaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NOT122 = null;
         var primaryExpression123 = null;
         var primaryExpression124 = null;

        var NOT122_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:202:2: ( NOT primaryExpression | primaryExpression )
            var alt37=2;
            var LA37_0 = this.input.LA(1);

            if ( (LA37_0==NOT) ) {
                alt37=1;
            }
            else if ( (LA37_0==IDENT||LA37_0==PRIMITIVE||LA37_0==LARR||(LA37_0>=INTEGER && LA37_0<=FALSE)||LA37_0==87||LA37_0==91) ) {
                alt37=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 37, 0, this.input);

                throw nvae;
            }
            switch (alt37) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:202:4: NOT primaryExpression
                    root_0 = this.adaptor.nil();

                    NOT122=this.match(this.input,NOT,FormulaParser.FOLLOW_NOT_in_unaryExpression1262); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    NOT122_tree = this.adaptor.create(NOT122);
                    root_0 = this.adaptor.becomeRoot(NOT122_tree, root_0);
                    }
                    this.pushFollow(FormulaParser.FOLLOW_primaryExpression_in_unaryExpression1265);
                    primaryExpression123=this.primaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primaryExpression123.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:204:8: primaryExpression
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_primaryExpression_in_unaryExpression1277);
                    primaryExpression124=this.primaryExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primaryExpression124.getTree());


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

    // /Library/WebServer/Documents/calc/Formula.g:209:1: primaryExpression : ( '(' logicalExpression ')' | value );
    // $ANTLR start "primaryExpression"
    primaryExpression: function() {
        var retval = new FormulaParser.primaryExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var char_literal125 = null;
        var char_literal127 = null;
         var logicalExpression126 = null;
         var value128 = null;

        var char_literal125_tree=null;
        var char_literal127_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:210:2: ( '(' logicalExpression ')' | value )
            var alt38=2;
            var LA38_0 = this.input.LA(1);

            if ( (LA38_0==87) ) {
                alt38=1;
            }
            else if ( (LA38_0==IDENT||LA38_0==PRIMITIVE||LA38_0==LARR||(LA38_0>=INTEGER && LA38_0<=FALSE)||LA38_0==91) ) {
                alt38=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 38, 0, this.input);

                throw nvae;
            }
            switch (alt38) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:210:4: '(' logicalExpression ')'
                    root_0 = this.adaptor.nil();

                    char_literal125=this.match(this.input,87,FormulaParser.FOLLOW_87_in_primaryExpression1308); if (this.state.failed) return retval;
                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_primaryExpression1311);
                    logicalExpression126=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, logicalExpression126.getTree());
                    char_literal127=this.match(this.input,89,FormulaParser.FOLLOW_89_in_primaryExpression1313); if (this.state.failed) return retval;


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:211:4: value
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_value_in_primaryExpression1319);
                    value128=this.value();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, value128.getTree());


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

    // /Library/WebServer/Documents/calc/Formula.g:214:1: value : ( number | bool | funOrIdent | primitive | material | array );
    // $ANTLR start "value"
    value: function() {
        var retval = new FormulaParser.value_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var number129 = null;
         var bool130 = null;
         var funOrIdent131 = null;
         var primitive132 = null;
         var material133 = null;
         var array134 = null;


        try {
            // /Library/WebServer/Documents/calc/Formula.g:215:2: ( number | bool | funOrIdent | primitive | material | array )
            var alt39=6;
            switch ( this.input.LA(1) ) {
            case INTEGER:
            case FLOAT:
                alt39=1;
                break;
            case TRUE:
            case FALSE:
                alt39=2;
                break;
            case IDENT:
                alt39=3;
                break;
            case PRIMITIVE:
                alt39=4;
                break;
            case 91:
                alt39=5;
                break;
            case LARR:
                alt39=6;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 39, 0, this.input);

                throw nvae;
            }

            switch (alt39) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:215:5: number
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_number_in_value1333);
                    number129=this.number();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, number129.getTree());


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:216:4: bool
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_bool_in_value1338);
                    bool130=this.bool();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, bool130.getTree());


                    break;
                case 3 :
                    // /Library/WebServer/Documents/calc/Formula.g:217:4: funOrIdent
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_funOrIdent_in_value1343);
                    funOrIdent131=this.funOrIdent();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, funOrIdent131.getTree());


                    break;
                case 4 :
                    // /Library/WebServer/Documents/calc/Formula.g:218:4: primitive
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_primitive_in_value1348);
                    primitive132=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive132.getTree());


                    break;
                case 5 :
                    // /Library/WebServer/Documents/calc/Formula.g:219:4: material
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_material_in_value1353);
                    material133=this.material();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, material133.getTree());


                    break;
                case 6 :
                    // /Library/WebServer/Documents/calc/Formula.g:220:4: array
                    root_0 = this.adaptor.nil();

                    this.pushFollow(FormulaParser.FOLLOW_array_in_value1358);
                    array134=this.array();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, array134.getTree());


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

    // /Library/WebServer/Documents/calc/Formula.g:223:1: array : LARR ( logicalExpression ( ',' logicalExpression )* )? RARR -> ^( ARRAY ( logicalExpression )* ) ;
    // $ANTLR start "array"
    array: function() {
        var retval = new FormulaParser.array_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LARR135 = null;
        var char_literal137 = null;
        var RARR139 = null;
         var logicalExpression136 = null;
         var logicalExpression138 = null;

        var LARR135_tree=null;
        var char_literal137_tree=null;
        var RARR139_tree=null;
        var stream_RARR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RARR");
        var stream_LARR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LARR");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:224:2: ( LARR ( logicalExpression ( ',' logicalExpression )* )? RARR -> ^( ARRAY ( logicalExpression )* ) )
            // /Library/WebServer/Documents/calc/Formula.g:224:4: LARR ( logicalExpression ( ',' logicalExpression )* )? RARR
            LARR135=this.match(this.input,LARR,FormulaParser.FOLLOW_LARR_in_array1369); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_LARR.add(LARR135);

            // /Library/WebServer/Documents/calc/Formula.g:224:9: ( logicalExpression ( ',' logicalExpression )* )?
            var alt41=2;
            var LA41_0 = this.input.LA(1);

            if ( (LA41_0==IDENT||LA41_0==PRIMITIVE||LA41_0==MINUS||(LA41_0>=NOT && LA41_0<=LARR)||(LA41_0>=INTEGER && LA41_0<=FALSE)||LA41_0==87||LA41_0==91) ) {
                alt41=1;
            }
            switch (alt41) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:224:10: logicalExpression ( ',' logicalExpression )*
                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_array1372);
                    logicalExpression136=this.logicalExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression136.getTree());
                    // /Library/WebServer/Documents/calc/Formula.g:224:28: ( ',' logicalExpression )*
                    loop40:
                    do {
                        var alt40=2;
                        var LA40_0 = this.input.LA(1);

                        if ( (LA40_0==88) ) {
                            alt40=1;
                        }


                        switch (alt40) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:224:29: ',' logicalExpression
                            char_literal137=this.match(this.input,88,FormulaParser.FOLLOW_88_in_array1375); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_88.add(char_literal137);

                            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_array1377);
                            logicalExpression138=this.logicalExpression();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression138.getTree());


                            break;

                        default :
                            break loop40;
                        }
                    } while (true);



                    break;

            }

            RARR139=this.match(this.input,RARR,FormulaParser.FOLLOW_RARR_in_array1383); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_RARR.add(RARR139);



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
            // 224:60: -> ^( ARRAY ( logicalExpression )* )
            {
                // /Library/WebServer/Documents/calc/Formula.g:224:63: ^( ARRAY ( logicalExpression )* )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                // /Library/WebServer/Documents/calc/Formula.g:224:71: ( logicalExpression )*
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

    // /Library/WebServer/Documents/calc/Formula.g:230:1: number : ( INTEGER | FLOAT );
    // $ANTLR start "number"
    number: function() {
        var retval = new FormulaParser.number_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set140 = null;

        var set140_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:230:8: ( INTEGER | FLOAT )
            // /Library/WebServer/Documents/calc/Formula.g:
            root_0 = this.adaptor.nil();

            set140=this.input.LT(1);
            if ( (this.input.LA(1)>=INTEGER && this.input.LA(1)<=FLOAT) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set140));
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

    // /Library/WebServer/Documents/calc/Formula.g:240:1: bool : ( TRUE | FALSE );
    // $ANTLR start "bool"
    bool: function() {
        var retval = new FormulaParser.bool_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set141 = null;

        var set141_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:241:2: ( TRUE | FALSE )
            // /Library/WebServer/Documents/calc/Formula.g:
            root_0 = this.adaptor.nil();

            set141=this.input.LT(1);
            if ( (this.input.LA(1)>=TRUE && this.input.LA(1)<=FALSE) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set141));
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

    // /Library/WebServer/Documents/calc/Formula.g:253:1: material : '{' additiveExpression unitMultiplicativeExpression '}' -> ^( MATERIAL unitMultiplicativeExpression additiveExpression ) ;
    // $ANTLR start "material"
    material: function() {
        var retval = new FormulaParser.material_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var char_literal142 = null;
        var char_literal145 = null;
         var additiveExpression143 = null;
         var unitMultiplicativeExpression144 = null;

        var char_literal142_tree=null;
        var char_literal145_tree=null;
        var stream_92=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 92");
        var stream_91=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 91");
        var stream_unitMultiplicativeExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitMultiplicativeExpression");
        var stream_additiveExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule additiveExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:253:9: ( '{' additiveExpression unitMultiplicativeExpression '}' -> ^( MATERIAL unitMultiplicativeExpression additiveExpression ) )
            // /Library/WebServer/Documents/calc/Formula.g:253:12: '{' additiveExpression unitMultiplicativeExpression '}'
            char_literal142=this.match(this.input,91,FormulaParser.FOLLOW_91_in_material1571); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_91.add(char_literal142);

            this.pushFollow(FormulaParser.FOLLOW_additiveExpression_in_material1573);
            additiveExpression143=this.additiveExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_additiveExpression.add(additiveExpression143.getTree());
            this.pushFollow(FormulaParser.FOLLOW_unitMultiplicativeExpression_in_material1575);
            unitMultiplicativeExpression144=this.unitMultiplicativeExpression();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_unitMultiplicativeExpression.add(unitMultiplicativeExpression144.getTree());
            char_literal145=this.match(this.input,92,FormulaParser.FOLLOW_92_in_material1577); if (this.state.failed) return retval; 
            if ( this.state.backtracking===0 ) stream_92.add(char_literal145);



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
            // 253:68: -> ^( MATERIAL unitMultiplicativeExpression additiveExpression )
            {
                // /Library/WebServer/Documents/calc/Formula.g:253:71: ^( MATERIAL unitMultiplicativeExpression additiveExpression )
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

    // /Library/WebServer/Documents/calc/Formula.g:256:1: unitMultiplicativeExpression : unitClump ( ( MULT | DIV ) unitClump )* ;
    // $ANTLR start "unitMultiplicativeExpression"
    unitMultiplicativeExpression: function() {
        var retval = new FormulaParser.unitMultiplicativeExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set147 = null;
         var unitClump146 = null;
         var unitClump148 = null;

        var set147_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:257:2: ( unitClump ( ( MULT | DIV ) unitClump )* )
            // /Library/WebServer/Documents/calc/Formula.g:257:4: unitClump ( ( MULT | DIV ) unitClump )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_unitClump_in_unitMultiplicativeExpression1598);
            unitClump146=this.unitClump();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unitClump146.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:257:14: ( ( MULT | DIV ) unitClump )*
            loop42:
            do {
                var alt42=2;
                var LA42_0 = this.input.LA(1);

                if ( ((LA42_0>=MULT && LA42_0<=DIV)) ) {
                    alt42=1;
                }


                switch (alt42) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:257:16: ( MULT | DIV ) unitClump
                    
                    set147=this.input.LT(1);
                    if ( (this.input.LA(1)>=MULT && this.input.LA(1)<=DIV) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(this.adaptor.create(set147), root_0);
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    this.pushFollow(FormulaParser.FOLLOW_unitClump_in_unitMultiplicativeExpression1609);
                    unitClump148=this.unitClump();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unitClump148.getTree());


                    break;

                default :
                    break loop42;
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

    // /Library/WebServer/Documents/calc/Formula.g:260:1: unitClump : ( ( INTEGER DIV ) unitPowerExpression -> ^( UNITCLUMP unitPowerExpression NEGATE ) | unitPowerExpression -> ^( UNITCLUMP unitPowerExpression ) );
    // $ANTLR start "unitClump"
    unitClump: function() {
        var retval = new FormulaParser.unitClump_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var INTEGER149 = null;
        var DIV150 = null;
         var unitPowerExpression151 = null;
         var unitPowerExpression152 = null;

        var INTEGER149_tree=null;
        var DIV150_tree=null;
        var stream_INTEGER=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token INTEGER");
        var stream_DIV=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token DIV");
        var stream_unitPowerExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitPowerExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:261:2: ( ( INTEGER DIV ) unitPowerExpression -> ^( UNITCLUMP unitPowerExpression NEGATE ) | unitPowerExpression -> ^( UNITCLUMP unitPowerExpression ) )
            var alt43=2;
            var LA43_0 = this.input.LA(1);

            if ( (LA43_0==INTEGER) ) {
                alt43=1;
            }
            else if ( (LA43_0==IDENT||LA43_0==87) ) {
                alt43=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 43, 0, this.input);

                throw nvae;
            }
            switch (alt43) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:261:4: ( INTEGER DIV ) unitPowerExpression
                    // /Library/WebServer/Documents/calc/Formula.g:261:4: ( INTEGER DIV )
                    // /Library/WebServer/Documents/calc/Formula.g:261:5: INTEGER DIV
                    INTEGER149=this.match(this.input,INTEGER,FormulaParser.FOLLOW_INTEGER_in_unitClump1624); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_INTEGER.add(INTEGER149);

                    DIV150=this.match(this.input,DIV,FormulaParser.FOLLOW_DIV_in_unitClump1626); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_DIV.add(DIV150);




                    this.pushFollow(FormulaParser.FOLLOW_unitPowerExpression_in_unitClump1629);
                    unitPowerExpression151=this.unitPowerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitPowerExpression.add(unitPowerExpression151.getTree());


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
                    // 261:38: -> ^( UNITCLUMP unitPowerExpression NEGATE )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:261:41: ^( UNITCLUMP unitPowerExpression NEGATE )
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
                    // /Library/WebServer/Documents/calc/Formula.g:262:5: unitPowerExpression
                    this.pushFollow(FormulaParser.FOLLOW_unitPowerExpression_in_unitClump1645);
                    unitPowerExpression152=this.unitPowerExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitPowerExpression.add(unitPowerExpression152.getTree());


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
                    // 262:25: -> ^( UNITCLUMP unitPowerExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:262:28: ^( UNITCLUMP unitPowerExpression )
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

    // /Library/WebServer/Documents/calc/Formula.g:265:1: unitPowerExpression : unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )* ;
    // $ANTLR start "unitPowerExpression"
    unitPowerExpression: function() {
        var retval = new FormulaParser.unitPowerExpression_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var POW154 = null;
        var MINUS155 = null;
        var set156 = null;
         var unit153 = null;

        var POW154_tree=null;
        var MINUS155_tree=null;
        var set156_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:266:2: ( unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )* )
            // /Library/WebServer/Documents/calc/Formula.g:266:5: unit ( POW ( MINUS )? ( INTEGER | FLOAT ) )*
            root_0 = this.adaptor.nil();

            this.pushFollow(FormulaParser.FOLLOW_unit_in_unitPowerExpression1666);
            unit153=this.unit();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unit153.getTree());
            // /Library/WebServer/Documents/calc/Formula.g:266:10: ( POW ( MINUS )? ( INTEGER | FLOAT ) )*
            loop45:
            do {
                var alt45=2;
                var LA45_0 = this.input.LA(1);

                if ( (LA45_0==POW) ) {
                    alt45=1;
                }


                switch (alt45) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:266:12: POW ( MINUS )? ( INTEGER | FLOAT )
                    POW154=this.match(this.input,POW,FormulaParser.FOLLOW_POW_in_unitPowerExpression1670); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    POW154_tree = this.adaptor.create(POW154);
                    root_0 = this.adaptor.becomeRoot(POW154_tree, root_0);
                    }
                    // /Library/WebServer/Documents/calc/Formula.g:266:17: ( MINUS )?
                    var alt44=2;
                    var LA44_0 = this.input.LA(1);

                    if ( (LA44_0==MINUS) ) {
                        alt44=1;
                    }
                    switch (alt44) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:266:17: MINUS
                            MINUS155=this.match(this.input,MINUS,FormulaParser.FOLLOW_MINUS_in_unitPowerExpression1673); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) {
                            MINUS155_tree = this.adaptor.create(MINUS155);
                            this.adaptor.addChild(root_0, MINUS155_tree);
                            }


                            break;

                    }

                    set156=this.input.LT(1);
                    if ( (this.input.LA(1)>=INTEGER && this.input.LA(1)<=FLOAT) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set156));
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop45;
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

    // /Library/WebServer/Documents/calc/Formula.g:269:1: unit : ( IDENT ( IDENT )* -> ^( UNIT ( IDENT )+ ) | '(' unitMultiplicativeExpression ')' -> ^( UNITCLUMP unitMultiplicativeExpression ) );
    // $ANTLR start "unit"
    unit: function() {
        var retval = new FormulaParser.unit_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IDENT157 = null;
        var IDENT158 = null;
        var char_literal159 = null;
        var char_literal161 = null;
         var unitMultiplicativeExpression160 = null;

        var IDENT157_tree=null;
        var IDENT158_tree=null;
        var char_literal159_tree=null;
        var char_literal161_tree=null;
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_unitMultiplicativeExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule unitMultiplicativeExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:269:6: ( IDENT ( IDENT )* -> ^( UNIT ( IDENT )+ ) | '(' unitMultiplicativeExpression ')' -> ^( UNITCLUMP unitMultiplicativeExpression ) )
            var alt47=2;
            var LA47_0 = this.input.LA(1);

            if ( (LA47_0==IDENT) ) {
                alt47=1;
            }
            else if ( (LA47_0==87) ) {
                alt47=2;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 47, 0, this.input);

                throw nvae;
            }
            switch (alt47) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:269:8: IDENT ( IDENT )*
                    IDENT157=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_unit1693); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT157);

                    // /Library/WebServer/Documents/calc/Formula.g:269:14: ( IDENT )*
                    loop46:
                    do {
                        var alt46=2;
                        var LA46_0 = this.input.LA(1);

                        if ( (LA46_0==IDENT) ) {
                            alt46=1;
                        }


                        switch (alt46) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:269:15: IDENT
                            IDENT158=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_unit1696); if (this.state.failed) return retval; 
                            if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT158);



                            break;

                        default :
                            break loop46;
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
                    // 269:23: -> ^( UNIT ( IDENT )+ )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:269:26: ^( UNIT ( IDENT )+ )
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
                    // /Library/WebServer/Documents/calc/Formula.g:270:5: '(' unitMultiplicativeExpression ')'
                    char_literal159=this.match(this.input,87,FormulaParser.FOLLOW_87_in_unit1713); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_87.add(char_literal159);

                    this.pushFollow(FormulaParser.FOLLOW_unitMultiplicativeExpression_in_unit1715);
                    unitMultiplicativeExpression160=this.unitMultiplicativeExpression();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_unitMultiplicativeExpression.add(unitMultiplicativeExpression160.getTree());
                    char_literal161=this.match(this.input,89,FormulaParser.FOLLOW_89_in_unit1717); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_89.add(char_literal161);



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
                    // 270:42: -> ^( UNITCLUMP unitMultiplicativeExpression )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:270:45: ^( UNITCLUMP unitMultiplicativeExpression )
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

    // /Library/WebServer/Documents/calc/Formula.g:278:1: funOrIdent : ( ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' -> ^( FUNCALL IDENT ( logicalExpression )* ) | IDENT );
    // $ANTLR start "funOrIdent"
    funOrIdent: function() {
        var retval = new FormulaParser.funOrIdent_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var IDENT162 = null;
        var char_literal163 = null;
        var char_literal165 = null;
        var char_literal167 = null;
        var IDENT168 = null;
         var logicalExpression164 = null;
         var logicalExpression166 = null;

        var IDENT162_tree=null;
        var char_literal163_tree=null;
        var char_literal165_tree=null;
        var char_literal167_tree=null;
        var IDENT168_tree=null;
        var stream_IDENT=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENT");
        var stream_87=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 87");
        var stream_88=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 88");
        var stream_89=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token 89");
        var stream_logicalExpression=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule logicalExpression");
        try {
            // /Library/WebServer/Documents/calc/Formula.g:279:2: ( ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' -> ^( FUNCALL IDENT ( logicalExpression )* ) | IDENT )
            var alt50=2;
            var LA50_0 = this.input.LA(1);

            if ( (LA50_0==IDENT) ) {
                var LA50_1 = this.input.LA(2);

                if ( (this.synpred1_Formula()) ) {
                    alt50=1;
                }
                else if ( (true) ) {
                    alt50=2;
                }
                else {
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 50, 1, this.input);

                    throw nvae;
                }
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 50, 0, this.input);

                throw nvae;
            }
            switch (alt50) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:279:4: ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )=> IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')'
                    IDENT162=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_funOrIdent1763); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_IDENT.add(IDENT162);

                    char_literal163=this.match(this.input,87,FormulaParser.FOLLOW_87_in_funOrIdent1765); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_87.add(char_literal163);

                    // /Library/WebServer/Documents/calc/Formula.g:279:79: ( logicalExpression ( ',' logicalExpression )* )?
                    var alt49=2;
                    var LA49_0 = this.input.LA(1);

                    if ( (LA49_0==IDENT||LA49_0==PRIMITIVE||LA49_0==MINUS||(LA49_0>=NOT && LA49_0<=LARR)||(LA49_0>=INTEGER && LA49_0<=FALSE)||LA49_0==87||LA49_0==91) ) {
                        alt49=1;
                    }
                    switch (alt49) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:279:81: logicalExpression ( ',' logicalExpression )*
                            this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_funOrIdent1769);
                            logicalExpression164=this.logicalExpression();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression164.getTree());
                            // /Library/WebServer/Documents/calc/Formula.g:279:99: ( ',' logicalExpression )*
                            loop48:
                            do {
                                var alt48=2;
                                var LA48_0 = this.input.LA(1);

                                if ( (LA48_0==88) ) {
                                    alt48=1;
                                }


                                switch (alt48) {
                                case 1 :
                                    // /Library/WebServer/Documents/calc/Formula.g:279:100: ',' logicalExpression
                                    char_literal165=this.match(this.input,88,FormulaParser.FOLLOW_88_in_funOrIdent1772); if (this.state.failed) return retval; 
                                    if ( this.state.backtracking===0 ) stream_88.add(char_literal165);

                                    this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_funOrIdent1774);
                                    logicalExpression166=this.logicalExpression();

                                    this.state._fsp--;
                                    if (this.state.failed) return retval;
                                    if ( this.state.backtracking===0 ) stream_logicalExpression.add(logicalExpression166.getTree());


                                    break;

                                default :
                                    break loop48;
                                }
                            } while (true);



                            break;

                    }

                    char_literal167=this.match(this.input,89,FormulaParser.FOLLOW_89_in_funOrIdent1781); if (this.state.failed) return retval; 
                    if ( this.state.backtracking===0 ) stream_89.add(char_literal167);



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
                    // 279:131: -> ^( FUNCALL IDENT ( logicalExpression )* )
                    {
                        // /Library/WebServer/Documents/calc/Formula.g:279:134: ^( FUNCALL IDENT ( logicalExpression )* )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCALL, "FUNCALL"), root_1);

                        this.adaptor.addChild(root_1, stream_IDENT.nextNode());
                        // /Library/WebServer/Documents/calc/Formula.g:279:150: ( logicalExpression )*
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
                    // /Library/WebServer/Documents/calc/Formula.g:280:5: IDENT
                    root_0 = this.adaptor.nil();

                    IDENT168=this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_funOrIdent1798); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    IDENT168_tree = this.adaptor.create(IDENT168);
                    this.adaptor.addChild(root_0, IDENT168_tree);
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

    // /Library/WebServer/Documents/calc/Formula.g:288:1: primitive : PRIMITIVE ;
    // $ANTLR start "primitive"
    primitive: function() {
        var retval = new FormulaParser.primitive_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var PRIMITIVE169 = null;

        var PRIMITIVE169_tree=null;

        try {
            // /Library/WebServer/Documents/calc/Formula.g:289:2: ( PRIMITIVE )
            // /Library/WebServer/Documents/calc/Formula.g:289:4: PRIMITIVE
            root_0 = this.adaptor.nil();

            PRIMITIVE169=this.match(this.input,PRIMITIVE,FormulaParser.FOLLOW_PRIMITIVE_in_primitive1854); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) {
            PRIMITIVE169_tree = this.adaptor.create(PRIMITIVE169);
            this.adaptor.addChild(root_0, PRIMITIVE169_tree);
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
        // /Library/WebServer/Documents/calc/Formula.g:279:4: ( IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')' )
        // /Library/WebServer/Documents/calc/Formula.g:279:5: IDENT '(' ( logicalExpression ( ',' logicalExpression )* )? ')'
        this.match(this.input,IDENT,FormulaParser.FOLLOW_IDENT_in_synpred1_Formula1742); if (this.state.failed) return ;
        this.match(this.input,87,FormulaParser.FOLLOW_87_in_synpred1_Formula1744); if (this.state.failed) return ;
        // /Library/WebServer/Documents/calc/Formula.g:279:15: ( logicalExpression ( ',' logicalExpression )* )?
        var alt52=2;
        var LA52_0 = this.input.LA(1);

        if ( (LA52_0==IDENT||LA52_0==PRIMITIVE||LA52_0==MINUS||(LA52_0>=NOT && LA52_0<=LARR)||(LA52_0>=INTEGER && LA52_0<=FALSE)||LA52_0==87||LA52_0==91) ) {
            alt52=1;
        }
        switch (alt52) {
            case 1 :
                // /Library/WebServer/Documents/calc/Formula.g:279:17: logicalExpression ( ',' logicalExpression )*
                this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_synpred1_Formula1748);
                this.logicalExpression();

                this.state._fsp--;
                if (this.state.failed) return ;
                // /Library/WebServer/Documents/calc/Formula.g:279:35: ( ',' logicalExpression )*
                loop51:
                do {
                    var alt51=2;
                    var LA51_0 = this.input.LA(1);

                    if ( (LA51_0==88) ) {
                        alt51=1;
                    }


                    switch (alt51) {
                    case 1 :
                        // /Library/WebServer/Documents/calc/Formula.g:279:36: ',' logicalExpression
                        this.match(this.input,88,FormulaParser.FOLLOW_88_in_synpred1_Formula1751); if (this.state.failed) return ;
                        this.pushFollow(FormulaParser.FOLLOW_logicalExpression_in_synpred1_Formula1753);
                        this.logicalExpression();

                        this.state._fsp--;
                        if (this.state.failed) return ;


                        break;

                    default :
                        break loop51;
                    }
                } while (true);



                break;

        }

        this.match(this.input,89,FormulaParser.FOLLOW_89_in_synpred1_Formula1760); if (this.state.failed) return ;


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
        "\u0018\uffff",
    DFA5_eofS:
        "\u0001\uffff\u0002\u0003\u000a\uffff\u0001\u0003\u000a\uffff",
    DFA5_minS:
        "\u0001\u001b\u0002\u0015\u0002\uffff\u0001\u0035\u0003\uffff\u0001"+
    "\u0035\u0001\uffff\u0001\u0021\u0001\u0036\u0001\u0015\u0002\uffff\u0002"+
    "\u0035\u0002\u0036\u0002\u0035\u0002\u0036",
    DFA5_maxS:
        "\u0001\u005b\u0002\u005a\u0002\uffff\u0001\u0035\u0003\uffff\u0001"+
    "\u005b\u0001\uffff\u0001\u0023\u0001\u0059\u0001\u005a\u0002\uffff\u0002"+
    "\u005b\u0002\u0059\u0002\u005b\u0002\u0059",
    DFA5_acceptS:
        "\u0003\uffff\u0001\u0002\u0001\u0003\u0001\uffff\u0001\u0006\u0001"+
    "\u0007\u0001\u0008\u0001\uffff\u0001\u0001\u0003\uffff\u0001\u0004\u0001"+
    "\u0005\u0008\uffff",
    DFA5_specialS:
        "\u0018\uffff}>",
    DFA5_transitionS: [
            "\u0001\u0004\u0003\uffff\u0001\u0005\u000b\uffff\u0001\u0006"+
            "\u0005\uffff\u0001\u0007\u0002\uffff\u0001\u0008\u0001\u0001"+
            "\u0001\uffff\u0001\u0002\u0009\uffff\u0001\u0003\u0004\uffff"+
            "\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff\u0001\u0003"+
            "\u0003\uffff\u0001\u0003",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0011\uffff\u0001\u0009\u0002\uffff"+
            "\u0001\u000a",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0014\uffff\u0001\u000a",
            "",
            "",
            "\u0001\u000b",
            "",
            "",
            "",
            "\u0001\u000c\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0001\uffff\u0001\u000d\u0001\uffff\u0001\u0003",
            "",
            "\u0001\u000e\u0001\uffff\u0001\u000f",
            "\u0001\u0010\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0001\u0003\u0001\u0011\u0001\u000d",
            "\u0001\u0003\u0020\uffff\u0001\u0003\u0001\uffff\u0002\u0003"+
            "\u0001\uffff\u000b\u0003\u0014\uffff\u0001\u000a",
            "",
            "",
            "\u0001\u0003\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0002\u0012\u0002\u0003"+
            "\u000a\uffff\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0013\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0003\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0012\uffff\u0001\u0014\u0001\u000d",
            "\u0001\u0015\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0001\u0003\u0001\u0011\u0001\u000d",
            "\u0001\u0016\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0004\u0003\u000a\uffff"+
            "\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0003\u0001\uffff\u0001\u0003\u0009\uffff\u0001\u0003"+
            "\u0004\uffff\u0002\u0003\u0001\uffff\u0002\u0017\u0002\u0003"+
            "\u000a\uffff\u0001\u0003\u0003\uffff\u0001\u0003",
            "\u0001\u0015\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0011\uffff\u0003\u0003",
            "\u0001\u0003\u0001\uffff\u0002\u0003\u0001\uffff\u000b\u0003"+
            "\u0012\uffff\u0001\u0014\u0001\u000d"
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
        return "92:1: expression : ( assignment | logicalExpression | whileLoop | forLoop | forInLoop | ifThenElse | functionDef | returnExp );";
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(FormulaParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "NEGATE", "ASSIGN", "FUNCALL", "MATERIAL", "UNIT", "POWER", "DEFAULTS", "PARAMS", "UNITCLUMP", "ARRAY", "LINES", "WHILE", "IFTHENELSE", "ELSE", "FOR", "FORIN", "FUNCTION", "NEWLINE", "W", "H", "I", "L", "E", "WHILESTATEMENT", "F", "O", "R", "FORSTATEMENT", "M", "FROMSTATEMENT", "N", "INSTATEMENT", "T", "TOSTATEMENT", "B", "Y", "BYSTATEMENT", "P", "LOOPSTATEMENT", "IFSTATEMENT", "THENSTATEMENT", "S", "ELSESTATEMENT", "U", "C", "FUNCTIONSTATEMENT", "D", "ENDBLOCK", "RETURNSTATEMENT", "IDENT", "EQUALS", "PRIMITIVE", "OR", "AND", "A", "NOTEQUALS", "LT", "LTEQ", "GT", "GTEQ", "PLUS", "MINUS", "MULT", "DIV", "MOD", "POW", "NOT", "LARR", "RARR", "INTEGER", "FLOAT", "TRUE", "FALSE", "COMMENT", "LINE_COMMENT", "WS", "G", "J", "K", "Q", "V", "X", "Z", "'('", "','", "')'", "'<-'", "'{'", "'}'"],
    FOLLOW_NEWLINE_in_lines112: new org.antlr.runtime.BitSet([0x88200000, 0x00B20800,0x08801EC2, 0x00000000]),
    FOLLOW_expression_in_lines116: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_lines120: new org.antlr.runtime.BitSet([0x88200000, 0x00B20800,0x08801EC2, 0x00000000]),
    FOLLOW_EOF_in_lines123: new org.antlr.runtime.BitSet([0x88000000, 0x00B20800,0x08801EC2, 0x00000000]),
    FOLLOW_EOF_in_lines128: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_assignment_in_expression390: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_logicalExpression_in_expression396: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_whileLoop_in_expression402: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forLoop_in_expression408: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_forInLoop_in_expression414: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ifThenElse_in_expression420: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionDef_in_expression426: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_returnExp_in_expression432: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_RETURNSTATEMENT_in_returnExp444: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_returnExp447: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expression_in_innerBlock460: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_innerBlock464: new org.antlr.runtime.BitSet([0x88200002, 0x00B20800,0x08801EC2, 0x00000000]),
    FOLLOW_WHILESTATEMENT_in_whileLoop489: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_whileLoop491: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_whileLoop493: new org.antlr.runtime.BitSet([0x88200000, 0x00BA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_whileLoop496: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_whileLoop499: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_whileLoop501: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FORSTATEMENT_in_forLoop522: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_forLoop524: new org.antlr.runtime.BitSet([0x00000000, 0x00000002]),
    FOLLOW_FROMSTATEMENT_in_forLoop526: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop528: new org.antlr.runtime.BitSet([0x00000000, 0x00000020]),
    FOLLOW_TOSTATEMENT_in_forLoop530: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop532: new org.antlr.runtime.BitSet([0x00200000, 0x00000100]),
    FOLLOW_BYSTATEMENT_in_forLoop535: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forLoop537: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_forLoop541: new org.antlr.runtime.BitSet([0x88200000, 0x00BA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_forLoop544: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_forLoop547: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_forLoop549: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FORSTATEMENT_in_forInLoop577: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_forInLoop579: new org.antlr.runtime.BitSet([0x00000000, 0x00000008]),
    FOLLOW_INSTATEMENT_in_forInLoop581: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_forInLoop583: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_forInLoop585: new org.antlr.runtime.BitSet([0x88200000, 0x00BA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_forInLoop588: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_forInLoop591: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_LOOPSTATEMENT_in_forInLoop593: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IFSTATEMENT_in_ifThenElse618: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_ifThenElse620: new org.antlr.runtime.BitSet([0x00000000, 0x00001000]),
    FOLLOW_THENSTATEMENT_in_ifThenElse622: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse625: new org.antlr.runtime.BitSet([0x88200000, 0x00BA4800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse628: new org.antlr.runtime.BitSet([0x00000000, 0x00084000]),
    FOLLOW_ELSESTATEMENT_in_ifThenElse632: new org.antlr.runtime.BitSet([0x00000000, 0x00000800]),
    FOLLOW_IFSTATEMENT_in_ifThenElse634: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_ifThenElse636: new org.antlr.runtime.BitSet([0x00000000, 0x00001000]),
    FOLLOW_THENSTATEMENT_in_ifThenElse638: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse640: new org.antlr.runtime.BitSet([0x88200000, 0x00BA4800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse643: new org.antlr.runtime.BitSet([0x00000000, 0x00084000]),
    FOLLOW_ELSESTATEMENT_in_ifThenElse648: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_ifThenElse650: new org.antlr.runtime.BitSet([0x88200000, 0x00BA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_ifThenElse653: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_ifThenElse657: new org.antlr.runtime.BitSet([0x00000000, 0x00000800]),
    FOLLOW_IFSTATEMENT_in_ifThenElse659: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FUNCTIONSTATEMENT_in_functionDef690: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef692: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_functionDef694: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x02000000, 0x00000000]),
    FOLLOW_IDENT_in_functionDef697: new org.antlr.runtime.BitSet([0x00000000, 0x00400000,0x03000000, 0x00000000]),
    FOLLOW_EQUALS_in_functionDef701: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_functionDef703: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_functionDef708: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef710: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_functionDef717: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_functionDef719: new org.antlr.runtime.BitSet([0x00000000, 0x00400000]),
    FOLLOW_EQUALS_in_functionDef721: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_functionDef723: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_functionDef730: new org.antlr.runtime.BitSet([0x00200000, 0x00000000]),
    FOLLOW_NEWLINE_in_functionDef732: new org.antlr.runtime.BitSet([0x88200000, 0x00BA0800,0x08801EC2, 0x00000000]),
    FOLLOW_innerBlock_in_functionDef735: new org.antlr.runtime.BitSet([0x00000000, 0x00080000]),
    FOLLOW_ENDBLOCK_in_functionDef738: new org.antlr.runtime.BitSet([0x00000000, 0x00020000]),
    FOLLOW_FUNCTIONSTATEMENT_in_functionDef740: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_assignment775: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_assignment777: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x02000000, 0x00000000]),
    FOLLOW_IDENT_in_assignment780: new org.antlr.runtime.BitSet([0x00000000, 0x00400000,0x03000000, 0x00000000]),
    FOLLOW_EQUALS_in_assignment784: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_assignment786: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_assignment791: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_assignment793: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_assignment800: new org.antlr.runtime.BitSet([0x00000000, 0x00200000]),
    FOLLOW_IDENT_in_assignment802: new org.antlr.runtime.BitSet([0x00000000, 0x00400000]),
    FOLLOW_EQUALS_in_assignment804: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_number_in_assignment806: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_assignment813: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_90_in_assignment815: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_assignment817: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PRIMITIVE_in_assignment845: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_IDENT_in_assignment849: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x04000000, 0x00000000]),
    FOLLOW_90_in_assignment853: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_assignment855: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanAndExpression_in_logicalExpression884: new org.antlr.runtime.BitSet([0x00000002, 0x01000000]),
    FOLLOW_OR_in_logicalExpression887: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_booleanAndExpression_in_logicalExpression890: new org.antlr.runtime.BitSet([0x00000002, 0x01000000]),
    FOLLOW_equalityExpression_in_booleanAndExpression921: new org.antlr.runtime.BitSet([0x00000002, 0x02000000]),
    FOLLOW_AND_in_booleanAndExpression924: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_equalityExpression_in_booleanAndExpression927: new org.antlr.runtime.BitSet([0x00000002, 0x02000000]),
    FOLLOW_relationalExpression_in_equalityExpression958: new org.antlr.runtime.BitSet([0x00000002, 0x08400000]),
    FOLLOW_set_in_equalityExpression961: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_relationalExpression_in_equalityExpression968: new org.antlr.runtime.BitSet([0x00000002, 0x08400000]),
    FOLLOW_additiveExpression_in_relationalExpression1010: new org.antlr.runtime.BitSet([0x00000002, 0xF0000000]),
    FOLLOW_set_in_relationalExpression1014: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_additiveExpression_in_relationalExpression1025: new org.antlr.runtime.BitSet([0x00000002, 0xF0000000]),
    FOLLOW_multiplicativeExpression_in_additiveExpression1068: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000003, 0x00000000]),
    FOLLOW_set_in_additiveExpression1072: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_multiplicativeExpression_in_additiveExpression1079: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000003, 0x00000000]),
    FOLLOW_negationExpression_in_multiplicativeExpression1109: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000001C, 0x00000000]),
    FOLLOW_set_in_multiplicativeExpression1113: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_negationExpression_in_multiplicativeExpression1122: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000001C, 0x00000000]),
    FOLLOW_MINUS_in_negationExpression1167: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_powerExpression_in_negationExpression1169: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_powerExpression_in_negationExpression1183: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unaryExpression_in_powerExpression1194: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_POW_in_powerExpression1197: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_unaryOrNegate_in_powerExpression1199: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_unaryExpression_in_unaryOrNegate1226: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_MINUS_in_unaryOrNegate1232: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_unaryExpression_in_unaryOrNegate1234: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NOT_in_unaryExpression1262: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_primaryExpression_in_unaryExpression1265: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_primaryExpression_in_unaryExpression1277: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_87_in_primaryExpression1308: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_primaryExpression1311: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_89_in_primaryExpression1313: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_value_in_primaryExpression1319: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_number_in_value1333: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_bool_in_value1338: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_funOrIdent_in_value1343: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_primitive_in_value1348: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_material_in_value1353: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_array_in_value1358: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LARR_in_array1369: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801FC2, 0x00000000]),
    FOLLOW_logicalExpression_in_array1372: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000100, 0x00000000]),
    FOLLOW_88_in_array1375: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_array1377: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000100, 0x00000000]),
    FOLLOW_RARR_in_array1383: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_number0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_bool0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_91_in_material1571: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_additiveExpression_in_material1573: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitMultiplicativeExpression_in_material1575: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x10000000, 0x00000000]),
    FOLLOW_92_in_material1577: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unitClump_in_unitMultiplicativeExpression1598: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000000C, 0x00000000]),
    FOLLOW_set_in_unitMultiplicativeExpression1602: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitClump_in_unitMultiplicativeExpression1609: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x0000000C, 0x00000000]),
    FOLLOW_INTEGER_in_unitClump1624: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000008, 0x00000000]),
    FOLLOW_DIV_in_unitClump1626: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitPowerExpression_in_unitClump1629: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unitPowerExpression_in_unitClump1645: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unit_in_unitPowerExpression1666: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_POW_in_unitPowerExpression1670: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000602, 0x00000000]),
    FOLLOW_MINUS_in_unitPowerExpression1673: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000600, 0x00000000]),
    FOLLOW_set_in_unitPowerExpression1676: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000020, 0x00000000]),
    FOLLOW_IDENT_in_unit1693: new org.antlr.runtime.BitSet([0x00000002, 0x00200000]),
    FOLLOW_IDENT_in_unit1696: new org.antlr.runtime.BitSet([0x00000002, 0x00200000]),
    FOLLOW_87_in_unit1713: new org.antlr.runtime.BitSet([0x00000000, 0x00200000,0x00800200, 0x00000000]),
    FOLLOW_unitMultiplicativeExpression_in_unit1715: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x02000000, 0x00000000]),
    FOLLOW_89_in_unit1717: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_funOrIdent1763: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_funOrIdent1765: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x0A801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_funOrIdent1769: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_funOrIdent1772: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_funOrIdent1774: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_funOrIdent1781: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_funOrIdent1798: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PRIMITIVE_in_primitive1854: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENT_in_synpred1_Formula1742: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00800000, 0x00000000]),
    FOLLOW_87_in_synpred1_Formula1744: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x0A801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_synpred1_Formula1748: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_88_in_synpred1_Formula1751: new org.antlr.runtime.BitSet([0x00000000, 0x00A00000,0x08801EC2, 0x00000000]),
    FOLLOW_logicalExpression_in_synpred1_Formula1753: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x03000000, 0x00000000]),
    FOLLOW_89_in_synpred1_Formula1760: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();