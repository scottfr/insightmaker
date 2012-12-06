// $ANTLR 3.3 Nov 30, 2010 12:45:30 /Library/WebServer/Documents/calc/Formula.g 2012-12-05 14:17:48

var FormulaLexer = function(input, state) {
// alternate constructor @todo
// public FormulaLexer(CharStream input)
// public FormulaLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){
    }).call(this);

    this.dfa28 = new FormulaLexer.DFA28(this);
    FormulaLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(FormulaLexer, {
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
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(FormulaLexer, org.antlr.runtime.Lexer, {
    EOF : -1,
    T__87 : 87,
    T__88 : 88,
    T__89 : 89,
    T__90 : 90,
    T__91 : 91,
    T__92 : 92,
    NEGATE : 4,
    ASSIGN : 5,
    FUNCALL : 6,
    MATERIAL : 7,
    UNIT : 8,
    POWER : 9,
    DEFAULTS : 10,
    PARAMS : 11,
    UNITCLUMP : 12,
    ARRAY : 13,
    LINES : 14,
    WHILE : 15,
    IFTHENELSE : 16,
    ELSE : 17,
    FOR : 18,
    FORIN : 19,
    FUNCTION : 20,
    NEWLINE : 21,
    W : 22,
    H : 23,
    I : 24,
    L : 25,
    E : 26,
    WHILESTATEMENT : 27,
    F : 28,
    O : 29,
    R : 30,
    FORSTATEMENT : 31,
    M : 32,
    FROMSTATEMENT : 33,
    N : 34,
    INSTATEMENT : 35,
    T : 36,
    TOSTATEMENT : 37,
    B : 38,
    Y : 39,
    BYSTATEMENT : 40,
    P : 41,
    LOOPSTATEMENT : 42,
    IFSTATEMENT : 43,
    THENSTATEMENT : 44,
    S : 45,
    ELSESTATEMENT : 46,
    U : 47,
    C : 48,
    FUNCTIONSTATEMENT : 49,
    D : 50,
    ENDBLOCK : 51,
    RETURNSTATEMENT : 52,
    IDENT : 53,
    EQUALS : 54,
    PRIMITIVE : 55,
    OR : 56,
    AND : 57,
    A : 58,
    NOTEQUALS : 59,
    LT : 60,
    LTEQ : 61,
    GT : 62,
    GTEQ : 63,
    PLUS : 64,
    MINUS : 65,
    MULT : 66,
    DIV : 67,
    MOD : 68,
    POW : 69,
    NOT : 70,
    LARR : 71,
    RARR : 72,
    INTEGER : 73,
    FLOAT : 74,
    TRUE : 75,
    FALSE : 76,
    COMMENT : 77,
    LINE_COMMENT : 78,
    WS : 79,
    G : 80,
    J : 81,
    K : 82,
    Q : 83,
    V : 84,
    X : 85,
    Z : 86,
    getGrammarFileName: function() { return "/Library/WebServer/Documents/calc/Formula.g"; }
});
org.antlr.lang.augmentObject(FormulaLexer.prototype, {
    // $ANTLR start T__87
    mT__87: function()  {
        try {
            var _type = this.T__87;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:7:7: ( '(' )
            // /Library/WebServer/Documents/calc/Formula.g:7:9: '('
            this.match('('); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__87",

    // $ANTLR start T__88
    mT__88: function()  {
        try {
            var _type = this.T__88;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:8:7: ( ',' )
            // /Library/WebServer/Documents/calc/Formula.g:8:9: ','
            this.match(','); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__88",

    // $ANTLR start T__89
    mT__89: function()  {
        try {
            var _type = this.T__89;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:9:7: ( ')' )
            // /Library/WebServer/Documents/calc/Formula.g:9:9: ')'
            this.match(')'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__89",

    // $ANTLR start T__90
    mT__90: function()  {
        try {
            var _type = this.T__90;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:10:7: ( '<-' )
            // /Library/WebServer/Documents/calc/Formula.g:10:9: '<-'
            this.match("<-"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__90",

    // $ANTLR start T__91
    mT__91: function()  {
        try {
            var _type = this.T__91;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:11:7: ( '{' )
            // /Library/WebServer/Documents/calc/Formula.g:11:9: '{'
            this.match('{'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__91",

    // $ANTLR start T__92
    mT__92: function()  {
        try {
            var _type = this.T__92;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:12:7: ( '}' )
            // /Library/WebServer/Documents/calc/Formula.g:12:9: '}'
            this.match('}'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__92",

    // $ANTLR start NEWLINE
    mNEWLINE: function()  {
        try {
            var _type = this.NEWLINE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:37:2: ( ( ( '\\r' )? '\\n' ) )
            // /Library/WebServer/Documents/calc/Formula.g:37:4: ( ( '\\r' )? '\\n' )
            // /Library/WebServer/Documents/calc/Formula.g:37:4: ( ( '\\r' )? '\\n' )
            // /Library/WebServer/Documents/calc/Formula.g:37:5: ( '\\r' )? '\\n'
            // /Library/WebServer/Documents/calc/Formula.g:37:5: ( '\\r' )?
            var alt1=2;
            var LA1_0 = this.input.LA(1);

            if ( (LA1_0=='\r') ) {
                alt1=1;
            }
            switch (alt1) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:37:5: '\\r'
                    this.match('\r'); 


                    break;

            }

            this.match('\n'); 






            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NEWLINE",

    // $ANTLR start WHILESTATEMENT
    mWHILESTATEMENT: function()  {
        try {
            var _type = this.WHILESTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:41:2: ( W H I L E )
            // /Library/WebServer/Documents/calc/Formula.g:41:4: W H I L E
            this.mW(); 
            this.mH(); 
            this.mI(); 
            this.mL(); 
            this.mE(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WHILESTATEMENT",

    // $ANTLR start FORSTATEMENT
    mFORSTATEMENT: function()  {
        try {
            var _type = this.FORSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:45:2: ( F O R )
            // /Library/WebServer/Documents/calc/Formula.g:45:4: F O R
            this.mF(); 
            this.mO(); 
            this.mR(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FORSTATEMENT",

    // $ANTLR start FROMSTATEMENT
    mFROMSTATEMENT: function()  {
        try {
            var _type = this.FROMSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:49:2: ( F R O M )
            // /Library/WebServer/Documents/calc/Formula.g:49:4: F R O M
            this.mF(); 
            this.mR(); 
            this.mO(); 
            this.mM(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FROMSTATEMENT",

    // $ANTLR start INSTATEMENT
    mINSTATEMENT: function()  {
        try {
            var _type = this.INSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:53:2: ( I N )
            // /Library/WebServer/Documents/calc/Formula.g:53:4: I N
            this.mI(); 
            this.mN(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INSTATEMENT",

    // $ANTLR start TOSTATEMENT
    mTOSTATEMENT: function()  {
        try {
            var _type = this.TOSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:57:2: ( T O )
            // /Library/WebServer/Documents/calc/Formula.g:57:4: T O
            this.mT(); 
            this.mO(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TOSTATEMENT",

    // $ANTLR start BYSTATEMENT
    mBYSTATEMENT: function()  {
        try {
            var _type = this.BYSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:61:2: ( B Y )
            // /Library/WebServer/Documents/calc/Formula.g:61:4: B Y
            this.mB(); 
            this.mY(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "BYSTATEMENT",

    // $ANTLR start LOOPSTATEMENT
    mLOOPSTATEMENT: function()  {
        try {
            var _type = this.LOOPSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:65:2: ( L O O P )
            // /Library/WebServer/Documents/calc/Formula.g:65:4: L O O P
            this.mL(); 
            this.mO(); 
            this.mO(); 
            this.mP(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LOOPSTATEMENT",

    // $ANTLR start IFSTATEMENT
    mIFSTATEMENT: function()  {
        try {
            var _type = this.IFSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:69:2: ( I F )
            // /Library/WebServer/Documents/calc/Formula.g:69:4: I F
            this.mI(); 
            this.mF(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IFSTATEMENT",

    // $ANTLR start THENSTATEMENT
    mTHENSTATEMENT: function()  {
        try {
            var _type = this.THENSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:73:2: ( T H E N )
            // /Library/WebServer/Documents/calc/Formula.g:73:4: T H E N
            this.mT(); 
            this.mH(); 
            this.mE(); 
            this.mN(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "THENSTATEMENT",

    // $ANTLR start ELSESTATEMENT
    mELSESTATEMENT: function()  {
        try {
            var _type = this.ELSESTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:77:2: ( E L S E )
            // /Library/WebServer/Documents/calc/Formula.g:77:4: E L S E
            this.mE(); 
            this.mL(); 
            this.mS(); 
            this.mE(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ELSESTATEMENT",

    // $ANTLR start FUNCTIONSTATEMENT
    mFUNCTIONSTATEMENT: function()  {
        try {
            var _type = this.FUNCTIONSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:81:2: ( F U N C T I O N )
            // /Library/WebServer/Documents/calc/Formula.g:81:4: F U N C T I O N
            this.mF(); 
            this.mU(); 
            this.mN(); 
            this.mC(); 
            this.mT(); 
            this.mI(); 
            this.mO(); 
            this.mN(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FUNCTIONSTATEMENT",

    // $ANTLR start ENDBLOCK
    mENDBLOCK: function()  {
        try {
            var _type = this.ENDBLOCK;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:85:2: ( E N D )
            // /Library/WebServer/Documents/calc/Formula.g:85:4: E N D
            this.mE(); 
            this.mN(); 
            this.mD(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ENDBLOCK",

    // $ANTLR start RETURNSTATEMENT
    mRETURNSTATEMENT: function()  {
        try {
            var _type = this.RETURNSTATEMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:89:2: ( R E T U R N )
            // /Library/WebServer/Documents/calc/Formula.g:89:4: R E T U R N
            this.mR(); 
            this.mE(); 
            this.mT(); 
            this.mU(); 
            this.mR(); 
            this.mN(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RETURNSTATEMENT",

    // $ANTLR start OR
    mOR: function()  {
        try {
            var _type = this.OR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:143:5: ( '||' | O R )
            var alt2=2;
            var LA2_0 = this.input.LA(1);

            if ( (LA2_0=='|') ) {
                alt2=1;
            }
            else if ( (LA2_0=='O'||LA2_0=='o') ) {
                alt2=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }
            switch (alt2) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:143:8: '||'
                    this.match("||"); 



                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:143:15: O R
                    this.mO(); 
                    this.mR(); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OR",

    // $ANTLR start AND
    mAND: function()  {
        try {
            var _type = this.AND;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:149:5: ( '&&' | A N D )
            var alt3=2;
            var LA3_0 = this.input.LA(1);

            if ( (LA3_0=='&') ) {
                alt3=1;
            }
            else if ( (LA3_0=='A'||LA3_0=='a') ) {
                alt3=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }
            switch (alt3) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:149:8: '&&'
                    this.match("&&"); 



                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:149:15: A N D
                    this.mA(); 
                    this.mN(); 
                    this.mD(); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AND",

    // $ANTLR start EQUALS
    mEQUALS: function()  {
        try {
            var _type = this.EQUALS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:156:2: ( '=' | '==' )
            var alt4=2;
            var LA4_0 = this.input.LA(1);

            if ( (LA4_0=='=') ) {
                var LA4_1 = this.input.LA(2);

                if ( (LA4_1=='=') ) {
                    alt4=2;
                }
                else {
                    alt4=1;}
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                throw nvae;
            }
            switch (alt4) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:156:4: '='
                    this.match('='); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:156:10: '=='
                    this.match("=="); 



                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EQUALS",

    // $ANTLR start NOTEQUALS
    mNOTEQUALS: function()  {
        try {
            var _type = this.NOTEQUALS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:159:2: ( '!=' | '<>' )
            var alt5=2;
            var LA5_0 = this.input.LA(1);

            if ( (LA5_0=='!') ) {
                alt5=1;
            }
            else if ( (LA5_0=='<') ) {
                alt5=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 5, 0, this.input);

                throw nvae;
            }
            switch (alt5) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:159:4: '!='
                    this.match("!="); 



                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:159:11: '<>'
                    this.match("<>"); 



                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NOTEQUALS",

    // $ANTLR start LT
    mLT: function()  {
        try {
            var _type = this.LT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:166:4: ( '<' )
            // /Library/WebServer/Documents/calc/Formula.g:166:6: '<'
            this.match('<'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LT",

    // $ANTLR start LTEQ
    mLTEQ: function()  {
        try {
            var _type = this.LTEQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:167:6: ( '<=' )
            // /Library/WebServer/Documents/calc/Formula.g:167:8: '<='
            this.match("<="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LTEQ",

    // $ANTLR start GT
    mGT: function()  {
        try {
            var _type = this.GT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:168:4: ( '>' )
            // /Library/WebServer/Documents/calc/Formula.g:168:6: '>'
            this.match('>'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GT",

    // $ANTLR start GTEQ
    mGTEQ: function()  {
        try {
            var _type = this.GTEQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:169:6: ( '>=' )
            // /Library/WebServer/Documents/calc/Formula.g:169:8: '>='
            this.match(">="); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GTEQ",

    // $ANTLR start PLUS
    mPLUS: function()  {
        try {
            var _type = this.PLUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:175:6: ( '+' )
            // /Library/WebServer/Documents/calc/Formula.g:175:8: '+'
            this.match('+'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PLUS",

    // $ANTLR start MINUS
    mMINUS: function()  {
        try {
            var _type = this.MINUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:176:7: ( '-' )
            // /Library/WebServer/Documents/calc/Formula.g:176:9: '-'
            this.match('-'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MINUS",

    // $ANTLR start MULT
    mMULT: function()  {
        try {
            var _type = this.MULT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:182:6: ( '*' )
            // /Library/WebServer/Documents/calc/Formula.g:182:8: '*'
            this.match('*'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MULT",

    // $ANTLR start DIV
    mDIV: function()  {
        try {
            var _type = this.DIV;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:183:5: ( '/' )
            // /Library/WebServer/Documents/calc/Formula.g:183:7: '/'
            this.match('/'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIV",

    // $ANTLR start MOD
    mMOD: function()  {
        try {
            var _type = this.MOD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:184:5: ( '%' | M O D )
            var alt6=2;
            var LA6_0 = this.input.LA(1);

            if ( (LA6_0=='%') ) {
                alt6=1;
            }
            else if ( (LA6_0=='M'||LA6_0=='m') ) {
                alt6=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                throw nvae;
            }
            switch (alt6) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:184:7: '%'
                    this.match('%'); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:184:13: M O D
                    this.mM(); 
                    this.mO(); 
                    this.mD(); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MOD",

    // $ANTLR start POW
    mPOW: function()  {
        try {
            var _type = this.POW;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:199:5: ( '^' )
            // /Library/WebServer/Documents/calc/Formula.g:199:7: '^'
            this.match('^'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "POW",

    // $ANTLR start NOT
    mNOT: function()  {
        try {
            var _type = this.NOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:207:5: ( '!' | N O T )
            var alt7=2;
            var LA7_0 = this.input.LA(1);

            if ( (LA7_0=='!') ) {
                alt7=1;
            }
            else if ( (LA7_0=='N'||LA7_0=='n') ) {
                alt7=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                throw nvae;
            }
            switch (alt7) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:207:7: '!'
                    this.match('!'); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:207:13: N O T
                    this.mN(); 
                    this.mO(); 
                    this.mT(); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NOT",

    // $ANTLR start LARR
    mLARR: function()  {
        try {
            var _type = this.LARR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:227:6: ( 'Ç' | '<<' )
            var alt8=2;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0=='\u00AB') ) {
                alt8=1;
            }
            else if ( (LA8_0=='<') ) {
                alt8=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:227:8: 'Ç'
                    this.match('\u00AB'); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:227:14: '<<'
                    this.match("<<"); 



                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LARR",

    // $ANTLR start RARR
    mRARR: function()  {
        try {
            var _type = this.RARR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:228:6: ( 'È' | '>>' )
            var alt9=2;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0=='\u00BB') ) {
                alt9=1;
            }
            else if ( (LA9_0=='>') ) {
                alt9=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                throw nvae;
            }
            switch (alt9) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:228:8: 'È'
                    this.match('\u00BB'); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:228:14: '>>'
                    this.match(">>"); 



                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RARR",

    // $ANTLR start INTEGER
    mINTEGER: function()  {
        try {
            var _type = this.INTEGER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:233:2: ( ( '0' .. '9' )+ ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )? )
            // /Library/WebServer/Documents/calc/Formula.g:233:4: ( '0' .. '9' )+ ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )?
            // /Library/WebServer/Documents/calc/Formula.g:233:4: ( '0' .. '9' )+
            var cnt10=0;
            loop10:
            do {
                var alt10=2;
                var LA10_0 = this.input.LA(1);

                if ( ((LA10_0>='0' && LA10_0<='9')) ) {
                    alt10=1;
                }


                switch (alt10) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:233:5: '0' .. '9'
                    this.matchRange('0','9'); 


                    break;

                default :
                    if ( cnt10 >= 1 ) {
                        break loop10;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(10, this.input);
                        throw eee;
                }
                cnt10++;
            } while (true);

            // /Library/WebServer/Documents/calc/Formula.g:233:16: ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )?
            var alt13=2;
            var LA13_0 = this.input.LA(1);

            if ( (LA13_0=='e') ) {
                alt13=1;
            }
            switch (alt13) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:233:17: 'e' ( '+' | '-' )? ( '0' .. '9' )*
                    this.match('e'); 
                    // /Library/WebServer/Documents/calc/Formula.g:233:21: ( '+' | '-' )?
                    var alt11=2;
                    var LA11_0 = this.input.LA(1);

                    if ( (LA11_0=='+'||LA11_0=='-') ) {
                        alt11=1;
                    }
                    switch (alt11) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:
                            if ( this.input.LA(1)=='+'||this.input.LA(1)=='-' ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }

                    // /Library/WebServer/Documents/calc/Formula.g:233:32: ( '0' .. '9' )*
                    loop12:
                    do {
                        var alt12=2;
                        var LA12_0 = this.input.LA(1);

                        if ( ((LA12_0>='0' && LA12_0<='9')) ) {
                            alt12=1;
                        }


                        switch (alt12) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:233:33: '0' .. '9'
                            this.matchRange('0','9'); 


                            break;

                        default :
                            break loop12;
                        }
                    } while (true);



                    break;

            }




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INTEGER",

    // $ANTLR start FLOAT
    mFLOAT: function()  {
        try {
            var _type = this.FLOAT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:237:2: ( ( '0' .. '9' )* '.' ( '0' .. '9' )+ ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )? )
            // /Library/WebServer/Documents/calc/Formula.g:237:4: ( '0' .. '9' )* '.' ( '0' .. '9' )+ ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )?
            // /Library/WebServer/Documents/calc/Formula.g:237:4: ( '0' .. '9' )*
            loop14:
            do {
                var alt14=2;
                var LA14_0 = this.input.LA(1);

                if ( ((LA14_0>='0' && LA14_0<='9')) ) {
                    alt14=1;
                }


                switch (alt14) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:237:5: '0' .. '9'
                    this.matchRange('0','9'); 


                    break;

                default :
                    break loop14;
                }
            } while (true);

            this.match('.'); 
            // /Library/WebServer/Documents/calc/Formula.g:237:20: ( '0' .. '9' )+
            var cnt15=0;
            loop15:
            do {
                var alt15=2;
                var LA15_0 = this.input.LA(1);

                if ( ((LA15_0>='0' && LA15_0<='9')) ) {
                    alt15=1;
                }


                switch (alt15) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:237:21: '0' .. '9'
                    this.matchRange('0','9'); 


                    break;

                default :
                    if ( cnt15 >= 1 ) {
                        break loop15;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(15, this.input);
                        throw eee;
                }
                cnt15++;
            } while (true);

            // /Library/WebServer/Documents/calc/Formula.g:237:32: ( 'e' ( '+' | '-' )? ( '0' .. '9' )* )?
            var alt18=2;
            var LA18_0 = this.input.LA(1);

            if ( (LA18_0=='e') ) {
                alt18=1;
            }
            switch (alt18) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:237:33: 'e' ( '+' | '-' )? ( '0' .. '9' )*
                    this.match('e'); 
                    // /Library/WebServer/Documents/calc/Formula.g:237:37: ( '+' | '-' )?
                    var alt16=2;
                    var LA16_0 = this.input.LA(1);

                    if ( (LA16_0=='+'||LA16_0=='-') ) {
                        alt16=1;
                    }
                    switch (alt16) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:
                            if ( this.input.LA(1)=='+'||this.input.LA(1)=='-' ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }

                    // /Library/WebServer/Documents/calc/Formula.g:237:48: ( '0' .. '9' )*
                    loop17:
                    do {
                        var alt17=2;
                        var LA17_0 = this.input.LA(1);

                        if ( ((LA17_0>='0' && LA17_0<='9')) ) {
                            alt17=1;
                        }


                        switch (alt17) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:237:49: '0' .. '9'
                            this.matchRange('0','9'); 


                            break;

                        default :
                            break loop17;
                        }
                    } while (true);



                    break;

            }




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FLOAT",

    // $ANTLR start TRUE
    mTRUE: function()  {
        try {
            var _type = this.TRUE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:246:2: ( T R U E )
            // /Library/WebServer/Documents/calc/Formula.g:246:4: T R U E
            this.mT(); 
            this.mR(); 
            this.mU(); 
            this.mE(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TRUE",

    // $ANTLR start FALSE
    mFALSE: function()  {
        try {
            var _type = this.FALSE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:250:2: ( F A L S E )
            // /Library/WebServer/Documents/calc/Formula.g:250:5: F A L S E
            this.mF(); 
            this.mA(); 
            this.mL(); 
            this.mS(); 
            this.mE(); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FALSE",

    // $ANTLR start IDENT
    mIDENT: function()  {
        try {
            var _type = this.IDENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:285:2: ( ( 'a' .. 'z' | 'A' .. 'Z' ) ( 'a' .. 'z' | 'A' .. 'Z' | '_' | '0' .. '9' )* )
            // /Library/WebServer/Documents/calc/Formula.g:285:4: ( 'a' .. 'z' | 'A' .. 'Z' ) ( 'a' .. 'z' | 'A' .. 'Z' | '_' | '0' .. '9' )*
            if ( (this.input.LA(1)>='A' && this.input.LA(1)<='Z')||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}

            // /Library/WebServer/Documents/calc/Formula.g:285:26: ( 'a' .. 'z' | 'A' .. 'Z' | '_' | '0' .. '9' )*
            loop19:
            do {
                var alt19=2;
                var LA19_0 = this.input.LA(1);

                if ( ((LA19_0>='0' && LA19_0<='9')||(LA19_0>='A' && LA19_0<='Z')||LA19_0=='_'||(LA19_0>='a' && LA19_0<='z')) ) {
                    alt19=1;
                }


                switch (alt19) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:
                    if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop19;
                }
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IDENT",

    // $ANTLR start PRIMITIVE
    mPRIMITIVE: function()  {
        try {
            var _type = this.PRIMITIVE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:292:2: ( '[' ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+ ']' | '[' '[' ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+ ']' ']' | '<' IDENT ( IDENT | ' ' | '-' | '_' | INTEGER )* '>' )
            var alt23=3;
            var LA23_0 = this.input.LA(1);

            if ( (LA23_0=='[') ) {
                var LA23_1 = this.input.LA(2);

                if ( (LA23_1=='[') ) {
                    alt23=2;
                }
                else if ( (LA23_1==' '||(LA23_1>='#' && LA23_1<='&')||(LA23_1>=',' && LA23_1<='.')||(LA23_1>='0' && LA23_1<='9')||LA23_1=='?'||(LA23_1>='A' && LA23_1<='Z')||LA23_1=='_'||(LA23_1>='a' && LA23_1<='z')) ) {
                    alt23=1;
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 23, 1, this.input);

                    throw nvae;
                }
            }
            else if ( (LA23_0=='<') ) {
                alt23=3;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 23, 0, this.input);

                throw nvae;
            }
            switch (alt23) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:292:4: '[' ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+ ']'
                    this.match('['); 
                    // /Library/WebServer/Documents/calc/Formula.g:292:9: ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+
                    var cnt20=0;
                    loop20:
                    do {
                        var alt20=13;
                        switch ( this.input.LA(1) ) {
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                        case 'G':
                        case 'H':
                        case 'I':
                        case 'J':
                        case 'K':
                        case 'L':
                        case 'M':
                        case 'N':
                        case 'O':
                        case 'P':
                        case 'Q':
                        case 'R':
                        case 'S':
                        case 'T':
                        case 'U':
                        case 'V':
                        case 'W':
                        case 'X':
                        case 'Y':
                        case 'Z':
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'g':
                        case 'h':
                        case 'i':
                        case 'j':
                        case 'k':
                        case 'l':
                        case 'm':
                        case 'n':
                        case 'o':
                        case 'p':
                        case 'q':
                        case 'r':
                        case 's':
                        case 't':
                        case 'u':
                        case 'v':
                        case 'w':
                        case 'x':
                        case 'y':
                        case 'z':
                            alt20=1;
                            break;
                        case ' ':
                            alt20=2;
                            break;
                        case '-':
                            alt20=3;
                            break;
                        case '_':
                            alt20=4;
                            break;
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt20=5;
                            break;
                        case '#':
                            alt20=6;
                            break;
                        case '$':
                            alt20=7;
                            break;
                        case '?':
                            alt20=8;
                            break;
                        case '&':
                            alt20=9;
                            break;
                        case '.':
                            alt20=10;
                            break;
                        case ',':
                            alt20=11;
                            break;
                        case '%':
                            alt20=12;
                            break;

                        }

                        switch (alt20) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:10: IDENT
                            this.mIDENT(); 


                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:16: ' '
                            this.match(' '); 


                            break;
                        case 3 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:20: '-'
                            this.match('-'); 


                            break;
                        case 4 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:24: '_'
                            this.match('_'); 


                            break;
                        case 5 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:28: INTEGER
                            this.mINTEGER(); 


                            break;
                        case 6 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:36: '#'
                            this.match('#'); 


                            break;
                        case 7 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:40: '$'
                            this.match('$'); 


                            break;
                        case 8 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:44: '?'
                            this.match('?'); 


                            break;
                        case 9 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:48: '&'
                            this.match('&'); 


                            break;
                        case 10 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:52: '.'
                            this.match('.'); 


                            break;
                        case 11 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:56: ','
                            this.match(','); 


                            break;
                        case 12 :
                            // /Library/WebServer/Documents/calc/Formula.g:292:60: '%'
                            this.match('%'); 


                            break;

                        default :
                            if ( cnt20 >= 1 ) {
                                break loop20;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(20, this.input);
                                throw eee;
                        }
                        cnt20++;
                    } while (true);

                    this.match(']'); 


                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:293:5: '[' '[' ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+ ']' ']'
                    this.match('['); 
                    this.match('['); 
                    // /Library/WebServer/Documents/calc/Formula.g:293:14: ( IDENT | ' ' | '-' | '_' | INTEGER | '#' | '$' | '?' | '&' | '.' | ',' | '%' )+
                    var cnt21=0;
                    loop21:
                    do {
                        var alt21=13;
                        switch ( this.input.LA(1) ) {
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                        case 'G':
                        case 'H':
                        case 'I':
                        case 'J':
                        case 'K':
                        case 'L':
                        case 'M':
                        case 'N':
                        case 'O':
                        case 'P':
                        case 'Q':
                        case 'R':
                        case 'S':
                        case 'T':
                        case 'U':
                        case 'V':
                        case 'W':
                        case 'X':
                        case 'Y':
                        case 'Z':
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'g':
                        case 'h':
                        case 'i':
                        case 'j':
                        case 'k':
                        case 'l':
                        case 'm':
                        case 'n':
                        case 'o':
                        case 'p':
                        case 'q':
                        case 'r':
                        case 's':
                        case 't':
                        case 'u':
                        case 'v':
                        case 'w':
                        case 'x':
                        case 'y':
                        case 'z':
                            alt21=1;
                            break;
                        case ' ':
                            alt21=2;
                            break;
                        case '-':
                            alt21=3;
                            break;
                        case '_':
                            alt21=4;
                            break;
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt21=5;
                            break;
                        case '#':
                            alt21=6;
                            break;
                        case '$':
                            alt21=7;
                            break;
                        case '?':
                            alt21=8;
                            break;
                        case '&':
                            alt21=9;
                            break;
                        case '.':
                            alt21=10;
                            break;
                        case ',':
                            alt21=11;
                            break;
                        case '%':
                            alt21=12;
                            break;

                        }

                        switch (alt21) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:15: IDENT
                            this.mIDENT(); 


                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:21: ' '
                            this.match(' '); 


                            break;
                        case 3 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:25: '-'
                            this.match('-'); 


                            break;
                        case 4 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:29: '_'
                            this.match('_'); 


                            break;
                        case 5 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:33: INTEGER
                            this.mINTEGER(); 


                            break;
                        case 6 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:41: '#'
                            this.match('#'); 


                            break;
                        case 7 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:45: '$'
                            this.match('$'); 


                            break;
                        case 8 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:49: '?'
                            this.match('?'); 


                            break;
                        case 9 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:53: '&'
                            this.match('&'); 


                            break;
                        case 10 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:57: '.'
                            this.match('.'); 


                            break;
                        case 11 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:61: ','
                            this.match(','); 


                            break;
                        case 12 :
                            // /Library/WebServer/Documents/calc/Formula.g:293:65: '%'
                            this.match('%'); 


                            break;

                        default :
                            if ( cnt21 >= 1 ) {
                                break loop21;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(21, this.input);
                                throw eee;
                        }
                        cnt21++;
                    } while (true);

                    this.match(']'); 
                    this.match(']'); 


                    break;
                case 3 :
                    // /Library/WebServer/Documents/calc/Formula.g:294:5: '<' IDENT ( IDENT | ' ' | '-' | '_' | INTEGER )* '>'
                    this.match('<'); 
                    this.mIDENT(); 
                    // /Library/WebServer/Documents/calc/Formula.g:294:15: ( IDENT | ' ' | '-' | '_' | INTEGER )*
                    loop22:
                    do {
                        var alt22=6;
                        switch ( this.input.LA(1) ) {
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                        case 'G':
                        case 'H':
                        case 'I':
                        case 'J':
                        case 'K':
                        case 'L':
                        case 'M':
                        case 'N':
                        case 'O':
                        case 'P':
                        case 'Q':
                        case 'R':
                        case 'S':
                        case 'T':
                        case 'U':
                        case 'V':
                        case 'W':
                        case 'X':
                        case 'Y':
                        case 'Z':
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'g':
                        case 'h':
                        case 'i':
                        case 'j':
                        case 'k':
                        case 'l':
                        case 'm':
                        case 'n':
                        case 'o':
                        case 'p':
                        case 'q':
                        case 'r':
                        case 's':
                        case 't':
                        case 'u':
                        case 'v':
                        case 'w':
                        case 'x':
                        case 'y':
                        case 'z':
                            alt22=1;
                            break;
                        case ' ':
                            alt22=2;
                            break;
                        case '-':
                            alt22=3;
                            break;
                        case '_':
                            alt22=4;
                            break;
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt22=5;
                            break;

                        }

                        switch (alt22) {
                        case 1 :
                            // /Library/WebServer/Documents/calc/Formula.g:294:16: IDENT
                            this.mIDENT(); 


                            break;
                        case 2 :
                            // /Library/WebServer/Documents/calc/Formula.g:294:22: ' '
                            this.match(' '); 


                            break;
                        case 3 :
                            // /Library/WebServer/Documents/calc/Formula.g:294:26: '-'
                            this.match('-'); 


                            break;
                        case 4 :
                            // /Library/WebServer/Documents/calc/Formula.g:294:30: '_'
                            this.match('_'); 


                            break;
                        case 5 :
                            // /Library/WebServer/Documents/calc/Formula.g:294:34: INTEGER
                            this.mINTEGER(); 


                            break;

                        default :
                            break loop22;
                        }
                    } while (true);

                    this.match('>'); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PRIMITIVE",

    // $ANTLR start COMMENT
    mCOMMENT: function()  {
        try {
            var _type = this.COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:298:5: ( '/*' ( options {greedy=false; } : . )* '*/' )
            // /Library/WebServer/Documents/calc/Formula.g:298:9: '/*' ( options {greedy=false; } : . )* '*/'
            this.match("/*"); 

            // /Library/WebServer/Documents/calc/Formula.g:298:14: ( options {greedy=false; } : . )*
            loop24:
            do {
                var alt24=2;
                var LA24_0 = this.input.LA(1);

                if ( (LA24_0=='*') ) {
                    var LA24_1 = this.input.LA(2);

                    if ( (LA24_1=='/') ) {
                        alt24=2;
                    }
                    else if ( ((LA24_1>='\u0000' && LA24_1<='.')||(LA24_1>='0' && LA24_1<='\uFFFF')) ) {
                        alt24=1;
                    }


                }
                else if ( ((LA24_0>='\u0000' && LA24_0<=')')||(LA24_0>='+' && LA24_0<='\uFFFF')) ) {
                    alt24=1;
                }


                switch (alt24) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:298:42: .
                    this.matchAny(); 


                    break;

                default :
                    break loop24;
                }
            } while (true);

            this.match("*/"); 

            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMENT",

    // $ANTLR start LINE_COMMENT
    mLINE_COMMENT: function()  {
        try {
            var _type = this.LINE_COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:302:5: ( ( '//' | '#' ) (~ ( '\\n' | '\\r' ) )* )
            // /Library/WebServer/Documents/calc/Formula.g:302:7: ( '//' | '#' ) (~ ( '\\n' | '\\r' ) )*
            // /Library/WebServer/Documents/calc/Formula.g:302:7: ( '//' | '#' )
            var alt25=2;
            var LA25_0 = this.input.LA(1);

            if ( (LA25_0=='/') ) {
                alt25=1;
            }
            else if ( (LA25_0=='#') ) {
                alt25=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 25, 0, this.input);

                throw nvae;
            }
            switch (alt25) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:302:8: '//'
                    this.match("//"); 



                    break;
                case 2 :
                    // /Library/WebServer/Documents/calc/Formula.g:302:13: '#'
                    this.match('#'); 


                    break;

            }

            // /Library/WebServer/Documents/calc/Formula.g:302:18: (~ ( '\\n' | '\\r' ) )*
            loop26:
            do {
                var alt26=2;
                var LA26_0 = this.input.LA(1);

                if ( ((LA26_0>='\u0000' && LA26_0<='\t')||(LA26_0>='\u000B' && LA26_0<='\f')||(LA26_0>='\u000E' && LA26_0<='\uFFFF')) ) {
                    alt26=1;
                }


                switch (alt26) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:302:19: ~ ( '\\n' | '\\r' )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop26;
                }
            } while (true);

            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LINE_COMMENT",

    // $ANTLR start WS
    mWS: function()  {
        try {
            var _type = this.WS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // /Library/WebServer/Documents/calc/Formula.g:308:2: ( ( ' ' | '\\t' | '\\u000C' )+ )
            // /Library/WebServer/Documents/calc/Formula.g:308:5: ( ' ' | '\\t' | '\\u000C' )+
            // /Library/WebServer/Documents/calc/Formula.g:308:5: ( ' ' | '\\t' | '\\u000C' )+
            var cnt27=0;
            loop27:
            do {
                var alt27=2;
                var LA27_0 = this.input.LA(1);

                if ( (LA27_0=='\t'||LA27_0=='\f'||LA27_0==' ') ) {
                    alt27=1;
                }


                switch (alt27) {
                case 1 :
                    // /Library/WebServer/Documents/calc/Formula.g:
                    if ( this.input.LA(1)=='\t'||this.input.LA(1)=='\f'||this.input.LA(1)==' ' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt27 >= 1 ) {
                        break loop27;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(27, this.input);
                        throw eee;
                }
                cnt27++;
            } while (true);

            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WS",

    // $ANTLR start A
    mA: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:312:11: ( ( 'a' | 'A' ) )
            // /Library/WebServer/Documents/calc/Formula.g:312:12: ( 'a' | 'A' )
            if ( this.input.LA(1)=='A'||this.input.LA(1)=='a' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "A",

    // $ANTLR start B
    mB: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:313:11: ( ( 'b' | 'B' ) )
            // /Library/WebServer/Documents/calc/Formula.g:313:12: ( 'b' | 'B' )
            if ( this.input.LA(1)=='B'||this.input.LA(1)=='b' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "B",

    // $ANTLR start C
    mC: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:314:11: ( ( 'c' | 'C' ) )
            // /Library/WebServer/Documents/calc/Formula.g:314:12: ( 'c' | 'C' )
            if ( this.input.LA(1)=='C'||this.input.LA(1)=='c' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "C",

    // $ANTLR start D
    mD: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:315:11: ( ( 'd' | 'D' ) )
            // /Library/WebServer/Documents/calc/Formula.g:315:12: ( 'd' | 'D' )
            if ( this.input.LA(1)=='D'||this.input.LA(1)=='d' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "D",

    // $ANTLR start E
    mE: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:316:11: ( ( 'e' | 'E' ) )
            // /Library/WebServer/Documents/calc/Formula.g:316:12: ( 'e' | 'E' )
            if ( this.input.LA(1)=='E'||this.input.LA(1)=='e' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "E",

    // $ANTLR start F
    mF: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:317:11: ( ( 'f' | 'F' ) )
            // /Library/WebServer/Documents/calc/Formula.g:317:12: ( 'f' | 'F' )
            if ( this.input.LA(1)=='F'||this.input.LA(1)=='f' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "F",

    // $ANTLR start G
    mG: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:318:11: ( ( 'g' | 'G' ) )
            // /Library/WebServer/Documents/calc/Formula.g:318:12: ( 'g' | 'G' )
            if ( this.input.LA(1)=='G'||this.input.LA(1)=='g' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "G",

    // $ANTLR start H
    mH: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:319:11: ( ( 'h' | 'H' ) )
            // /Library/WebServer/Documents/calc/Formula.g:319:12: ( 'h' | 'H' )
            if ( this.input.LA(1)=='H'||this.input.LA(1)=='h' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "H",

    // $ANTLR start I
    mI: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:320:11: ( ( 'i' | 'I' ) )
            // /Library/WebServer/Documents/calc/Formula.g:320:12: ( 'i' | 'I' )
            if ( this.input.LA(1)=='I'||this.input.LA(1)=='i' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "I",

    // $ANTLR start J
    mJ: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:321:11: ( ( 'j' | 'J' ) )
            // /Library/WebServer/Documents/calc/Formula.g:321:12: ( 'j' | 'J' )
            if ( this.input.LA(1)=='J'||this.input.LA(1)=='j' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "J",

    // $ANTLR start K
    mK: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:322:11: ( ( 'k' | 'K' ) )
            // /Library/WebServer/Documents/calc/Formula.g:322:12: ( 'k' | 'K' )
            if ( this.input.LA(1)=='K'||this.input.LA(1)=='k' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "K",

    // $ANTLR start L
    mL: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:323:11: ( ( 'l' | 'L' ) )
            // /Library/WebServer/Documents/calc/Formula.g:323:12: ( 'l' | 'L' )
            if ( this.input.LA(1)=='L'||this.input.LA(1)=='l' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "L",

    // $ANTLR start M
    mM: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:324:11: ( ( 'm' | 'M' ) )
            // /Library/WebServer/Documents/calc/Formula.g:324:12: ( 'm' | 'M' )
            if ( this.input.LA(1)=='M'||this.input.LA(1)=='m' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "M",

    // $ANTLR start N
    mN: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:325:11: ( ( 'n' | 'N' ) )
            // /Library/WebServer/Documents/calc/Formula.g:325:12: ( 'n' | 'N' )
            if ( this.input.LA(1)=='N'||this.input.LA(1)=='n' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "N",

    // $ANTLR start O
    mO: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:326:11: ( ( 'o' | 'O' ) )
            // /Library/WebServer/Documents/calc/Formula.g:326:12: ( 'o' | 'O' )
            if ( this.input.LA(1)=='O'||this.input.LA(1)=='o' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "O",

    // $ANTLR start P
    mP: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:327:11: ( ( 'p' | 'P' ) )
            // /Library/WebServer/Documents/calc/Formula.g:327:12: ( 'p' | 'P' )
            if ( this.input.LA(1)=='P'||this.input.LA(1)=='p' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "P",

    // $ANTLR start Q
    mQ: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:328:11: ( ( 'q' | 'Q' ) )
            // /Library/WebServer/Documents/calc/Formula.g:328:12: ( 'q' | 'Q' )
            if ( this.input.LA(1)=='Q'||this.input.LA(1)=='q' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Q",

    // $ANTLR start R
    mR: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:329:11: ( ( 'r' | 'R' ) )
            // /Library/WebServer/Documents/calc/Formula.g:329:12: ( 'r' | 'R' )
            if ( this.input.LA(1)=='R'||this.input.LA(1)=='r' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "R",

    // $ANTLR start S
    mS: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:330:11: ( ( 's' | 'S' ) )
            // /Library/WebServer/Documents/calc/Formula.g:330:12: ( 's' | 'S' )
            if ( this.input.LA(1)=='S'||this.input.LA(1)=='s' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "S",

    // $ANTLR start T
    mT: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:331:11: ( ( 't' | 'T' ) )
            // /Library/WebServer/Documents/calc/Formula.g:331:12: ( 't' | 'T' )
            if ( this.input.LA(1)=='T'||this.input.LA(1)=='t' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "T",

    // $ANTLR start U
    mU: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:332:11: ( ( 'u' | 'U' ) )
            // /Library/WebServer/Documents/calc/Formula.g:332:12: ( 'u' | 'U' )
            if ( this.input.LA(1)=='U'||this.input.LA(1)=='u' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "U",

    // $ANTLR start V
    mV: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:333:11: ( ( 'v' | 'V' ) )
            // /Library/WebServer/Documents/calc/Formula.g:333:12: ( 'v' | 'V' )
            if ( this.input.LA(1)=='V'||this.input.LA(1)=='v' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "V",

    // $ANTLR start W
    mW: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:334:11: ( ( 'w' | 'W' ) )
            // /Library/WebServer/Documents/calc/Formula.g:334:12: ( 'w' | 'W' )
            if ( this.input.LA(1)=='W'||this.input.LA(1)=='w' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "W",

    // $ANTLR start X
    mX: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:335:11: ( ( 'x' | 'X' ) )
            // /Library/WebServer/Documents/calc/Formula.g:335:12: ( 'x' | 'X' )
            if ( this.input.LA(1)=='X'||this.input.LA(1)=='x' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "X",

    // $ANTLR start Y
    mY: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:336:11: ( ( 'y' | 'Y' ) )
            // /Library/WebServer/Documents/calc/Formula.g:336:12: ( 'y' | 'Y' )
            if ( this.input.LA(1)=='Y'||this.input.LA(1)=='y' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Y",

    // $ANTLR start Z
    mZ: function()  {
        try {
            // /Library/WebServer/Documents/calc/Formula.g:337:11: ( ( 'z' | 'Z' ) )
            // /Library/WebServer/Documents/calc/Formula.g:337:12: ( 'z' | 'Z' )
            if ( this.input.LA(1)=='Z'||this.input.LA(1)=='z' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Z",

    mTokens: function() {
        // /Library/WebServer/Documents/calc/Formula.g:1:8: ( T__87 | T__88 | T__89 | T__90 | T__91 | T__92 | NEWLINE | WHILESTATEMENT | FORSTATEMENT | FROMSTATEMENT | INSTATEMENT | TOSTATEMENT | BYSTATEMENT | LOOPSTATEMENT | IFSTATEMENT | THENSTATEMENT | ELSESTATEMENT | FUNCTIONSTATEMENT | ENDBLOCK | RETURNSTATEMENT | OR | AND | EQUALS | NOTEQUALS | LT | LTEQ | GT | GTEQ | PLUS | MINUS | MULT | DIV | MOD | POW | NOT | LARR | RARR | INTEGER | FLOAT | TRUE | FALSE | IDENT | PRIMITIVE | COMMENT | LINE_COMMENT | WS )
        var alt28=46;
        alt28 = this.dfa28.predict(this.input);
        switch (alt28) {
            case 1 :
                // /Library/WebServer/Documents/calc/Formula.g:1:10: T__87
                this.mT__87(); 


                break;
            case 2 :
                // /Library/WebServer/Documents/calc/Formula.g:1:16: T__88
                this.mT__88(); 


                break;
            case 3 :
                // /Library/WebServer/Documents/calc/Formula.g:1:22: T__89
                this.mT__89(); 


                break;
            case 4 :
                // /Library/WebServer/Documents/calc/Formula.g:1:28: T__90
                this.mT__90(); 


                break;
            case 5 :
                // /Library/WebServer/Documents/calc/Formula.g:1:34: T__91
                this.mT__91(); 


                break;
            case 6 :
                // /Library/WebServer/Documents/calc/Formula.g:1:40: T__92
                this.mT__92(); 


                break;
            case 7 :
                // /Library/WebServer/Documents/calc/Formula.g:1:46: NEWLINE
                this.mNEWLINE(); 


                break;
            case 8 :
                // /Library/WebServer/Documents/calc/Formula.g:1:54: WHILESTATEMENT
                this.mWHILESTATEMENT(); 


                break;
            case 9 :
                // /Library/WebServer/Documents/calc/Formula.g:1:69: FORSTATEMENT
                this.mFORSTATEMENT(); 


                break;
            case 10 :
                // /Library/WebServer/Documents/calc/Formula.g:1:82: FROMSTATEMENT
                this.mFROMSTATEMENT(); 


                break;
            case 11 :
                // /Library/WebServer/Documents/calc/Formula.g:1:96: INSTATEMENT
                this.mINSTATEMENT(); 


                break;
            case 12 :
                // /Library/WebServer/Documents/calc/Formula.g:1:108: TOSTATEMENT
                this.mTOSTATEMENT(); 


                break;
            case 13 :
                // /Library/WebServer/Documents/calc/Formula.g:1:120: BYSTATEMENT
                this.mBYSTATEMENT(); 


                break;
            case 14 :
                // /Library/WebServer/Documents/calc/Formula.g:1:132: LOOPSTATEMENT
                this.mLOOPSTATEMENT(); 


                break;
            case 15 :
                // /Library/WebServer/Documents/calc/Formula.g:1:146: IFSTATEMENT
                this.mIFSTATEMENT(); 


                break;
            case 16 :
                // /Library/WebServer/Documents/calc/Formula.g:1:158: THENSTATEMENT
                this.mTHENSTATEMENT(); 


                break;
            case 17 :
                // /Library/WebServer/Documents/calc/Formula.g:1:172: ELSESTATEMENT
                this.mELSESTATEMENT(); 


                break;
            case 18 :
                // /Library/WebServer/Documents/calc/Formula.g:1:186: FUNCTIONSTATEMENT
                this.mFUNCTIONSTATEMENT(); 


                break;
            case 19 :
                // /Library/WebServer/Documents/calc/Formula.g:1:204: ENDBLOCK
                this.mENDBLOCK(); 


                break;
            case 20 :
                // /Library/WebServer/Documents/calc/Formula.g:1:213: RETURNSTATEMENT
                this.mRETURNSTATEMENT(); 


                break;
            case 21 :
                // /Library/WebServer/Documents/calc/Formula.g:1:229: OR
                this.mOR(); 


                break;
            case 22 :
                // /Library/WebServer/Documents/calc/Formula.g:1:232: AND
                this.mAND(); 


                break;
            case 23 :
                // /Library/WebServer/Documents/calc/Formula.g:1:236: EQUALS
                this.mEQUALS(); 


                break;
            case 24 :
                // /Library/WebServer/Documents/calc/Formula.g:1:243: NOTEQUALS
                this.mNOTEQUALS(); 


                break;
            case 25 :
                // /Library/WebServer/Documents/calc/Formula.g:1:253: LT
                this.mLT(); 


                break;
            case 26 :
                // /Library/WebServer/Documents/calc/Formula.g:1:256: LTEQ
                this.mLTEQ(); 


                break;
            case 27 :
                // /Library/WebServer/Documents/calc/Formula.g:1:261: GT
                this.mGT(); 


                break;
            case 28 :
                // /Library/WebServer/Documents/calc/Formula.g:1:264: GTEQ
                this.mGTEQ(); 


                break;
            case 29 :
                // /Library/WebServer/Documents/calc/Formula.g:1:269: PLUS
                this.mPLUS(); 


                break;
            case 30 :
                // /Library/WebServer/Documents/calc/Formula.g:1:274: MINUS
                this.mMINUS(); 


                break;
            case 31 :
                // /Library/WebServer/Documents/calc/Formula.g:1:280: MULT
                this.mMULT(); 


                break;
            case 32 :
                // /Library/WebServer/Documents/calc/Formula.g:1:285: DIV
                this.mDIV(); 


                break;
            case 33 :
                // /Library/WebServer/Documents/calc/Formula.g:1:289: MOD
                this.mMOD(); 


                break;
            case 34 :
                // /Library/WebServer/Documents/calc/Formula.g:1:293: POW
                this.mPOW(); 


                break;
            case 35 :
                // /Library/WebServer/Documents/calc/Formula.g:1:297: NOT
                this.mNOT(); 


                break;
            case 36 :
                // /Library/WebServer/Documents/calc/Formula.g:1:301: LARR
                this.mLARR(); 


                break;
            case 37 :
                // /Library/WebServer/Documents/calc/Formula.g:1:306: RARR
                this.mRARR(); 


                break;
            case 38 :
                // /Library/WebServer/Documents/calc/Formula.g:1:311: INTEGER
                this.mINTEGER(); 


                break;
            case 39 :
                // /Library/WebServer/Documents/calc/Formula.g:1:319: FLOAT
                this.mFLOAT(); 


                break;
            case 40 :
                // /Library/WebServer/Documents/calc/Formula.g:1:325: TRUE
                this.mTRUE(); 


                break;
            case 41 :
                // /Library/WebServer/Documents/calc/Formula.g:1:330: FALSE
                this.mFALSE(); 


                break;
            case 42 :
                // /Library/WebServer/Documents/calc/Formula.g:1:336: IDENT
                this.mIDENT(); 


                break;
            case 43 :
                // /Library/WebServer/Documents/calc/Formula.g:1:342: PRIMITIVE
                this.mPRIMITIVE(); 


                break;
            case 44 :
                // /Library/WebServer/Documents/calc/Formula.g:1:352: COMMENT
                this.mCOMMENT(); 


                break;
            case 45 :
                // /Library/WebServer/Documents/calc/Formula.g:1:360: LINE_COMMENT
                this.mLINE_COMMENT(); 


                break;
            case 46 :
                // /Library/WebServer/Documents/calc/Formula.g:1:373: WS
                this.mWS(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(FormulaLexer, {
    DFA28_eotS:
        "\u0004\uffff\u0001\u002a\u0003\uffff\u0008\u0023\u0001\uffff\u0001"+
    "\u0023\u0001\uffff\u0001\u0023\u0001\uffff\u0001\u003c\u0001\u003e\u0003"+
    "\uffff\u0001\u0040\u0001\uffff\u0001\u0023\u0001\uffff\u0001\u0023\u0002"+
    "\uffff\u0001\u0043\u0009\uffff\u0005\u0023\u0001\u0049\u0001\u004a\u0001"+
    "\u004b\u0002\u0023\u0001\u004e\u0004\u0023\u0001\u0010\u0001\u0023\u0005"+
    "\uffff\u0002\u0023\u0001\uffff\u0001\u0023\u0001\u0057\u0003\u0023\u0003"+
    "\uffff\u0002\u0023\u0001\uffff\u0002\u0023\u0001\u005f\u0001\u0023\u0001"+
    "\u0012\u0001\u001b\u0001\u003c\u0001\u0023\u0001\uffff\u0001\u0062\u0002"+
    "\u0023\u0001\u0065\u0001\u0066\u0001\u0067\u0001\u0068\u0001\uffff\u0001"+
    "\u0023\u0001\u006a\u0001\uffff\u0001\u0023\u0001\u006c\u0004\uffff\u0001"+
    "\u0023\u0001\uffff\u0001\u0023\u0001\uffff\u0001\u006f\u0001\u0023\u0001"+
    "\uffff\u0001\u0071\u0001\uffff",
    DFA28_eofS:
        "\u0072\uffff",
    DFA28_minS:
        "\u0001\u0009\u0003\uffff\u0001\u002d\u0003\uffff\u0001\u0048\u0001"+
    "\u0041\u0001\u0046\u0001\u0048\u0001\u0059\u0001\u004f\u0001\u004c\u0001"+
    "\u0045\u0001\uffff\u0001\u0052\u0001\uffff\u0001\u004e\u0001\uffff\u0002"+
    "\u003d\u0003\uffff\u0001\u002a\u0001\uffff\u0001\u004f\u0001\uffff\u0001"+
    "\u004f\u0002\uffff\u0001\u002e\u0009\uffff\u0001\u0049\u0001\u0052\u0001"+
    "\u004f\u0001\u004e\u0001\u004c\u0003\u0030\u0001\u0045\u0001\u0055\u0001"+
    "\u0030\u0001\u004f\u0001\u0053\u0001\u0044\u0001\u0054\u0001\u0030\u0001"+
    "\u0044\u0005\uffff\u0001\u0044\u0001\u0054\u0001\uffff\u0001\u004c\u0001"+
    "\u0030\u0001\u004d\u0001\u0043\u0001\u0053\u0003\uffff\u0001\u004e\u0001"+
    "\u0045\u0001\uffff\u0001\u0050\u0001\u0045\u0001\u0030\u0001\u0055\u0003"+
    "\u0030\u0001\u0045\u0001\uffff\u0001\u0030\u0001\u0054\u0001\u0045\u0004"+
    "\u0030\u0001\uffff\u0001\u0052\u0001\u0030\u0001\uffff\u0001\u0049\u0001"+
    "\u0030\u0004\uffff\u0001\u004e\u0001\uffff\u0001\u004f\u0001\uffff\u0001"+
    "\u0030\u0001\u004e\u0001\uffff\u0001\u0030\u0001\uffff",
    DFA28_maxS:
        "\u0001\u00bb\u0003\uffff\u0001\u007a\u0003\uffff\u0001\u0068\u0001"+
    "\u0075\u0001\u006e\u0001\u0072\u0001\u0079\u0001\u006f\u0001\u006e\u0001"+
    "\u0065\u0001\uffff\u0001\u0072\u0001\uffff\u0001\u006e\u0001\uffff\u0001"+
    "\u003d\u0001\u003e\u0003\uffff\u0001\u002f\u0001\uffff\u0001\u006f\u0001"+
    "\uffff\u0001\u006f\u0002\uffff\u0001\u0039\u0009\uffff\u0001\u0069\u0001"+
    "\u0072\u0001\u006f\u0001\u006e\u0001\u006c\u0003\u007a\u0001\u0065\u0001"+
    "\u0075\u0001\u007a\u0001\u006f\u0001\u0073\u0001\u0064\u0001\u0074\u0001"+
    "\u007a\u0001\u0064\u0005\uffff\u0001\u0064\u0001\u0074\u0001\uffff\u0001"+
    "\u006c\u0001\u007a\u0001\u006d\u0001\u0063\u0001\u0073\u0003\uffff\u0001"+
    "\u006e\u0001\u0065\u0001\uffff\u0001\u0070\u0001\u0065\u0001\u007a\u0001"+
    "\u0075\u0003\u007a\u0001\u0065\u0001\uffff\u0001\u007a\u0001\u0074\u0001"+
    "\u0065\u0004\u007a\u0001\uffff\u0001\u0072\u0001\u007a\u0001\uffff\u0001"+
    "\u0069\u0001\u007a\u0004\uffff\u0001\u006e\u0001\uffff\u0001\u006f\u0001"+
    "\uffff\u0001\u007a\u0001\u006e\u0001\uffff\u0001\u007a\u0001\uffff",
    DFA28_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\u0003\u0001\uffff\u0001"+
    "\u0005\u0001\u0006\u0001\u0007\u0008\uffff\u0001\u0015\u0001\uffff\u0001"+
    "\u0016\u0001\uffff\u0001\u0017\u0002\uffff\u0001\u001d\u0001\u001e\u0001"+
    "\u001f\u0001\uffff\u0001\u0021\u0001\uffff\u0001\u0022\u0001\uffff\u0001"+
    "\u0024\u0001\u0025\u0001\uffff\u0001\u0027\u0001\u002a\u0001\u002b\u0001"+
    "\u002d\u0001\u002e\u0001\u0004\u0001\u0018\u0001\u001a\u0001\u0019\u0011"+
    "\uffff\u0001\u0023\u0001\u001c\u0001\u001b\u0001\u002c\u0001\u0020\u0002"+
    "\uffff\u0001\u0026\u0005\uffff\u0001\u000b\u0001\u000f\u0001\u000c\u0002"+
    "\uffff\u0001\u000d\u0008\uffff\u0001\u0009\u0007\uffff\u0001\u0013\u0002"+
    "\uffff\u0001\u000a\u0002\uffff\u0001\u0010\u0001\u0028\u0001\u000e\u0001"+
    "\u0011\u0001\uffff\u0001\u0008\u0001\uffff\u0001\u0029\u0002\uffff\u0001"+
    "\u0014\u0001\uffff\u0001\u0012",
    DFA28_specialS:
        "\u0072\uffff}>",
    DFA28_transitionS: [
            "\u0001\u0026\u0001\u0007\u0001\uffff\u0001\u0026\u0001\u0007"+
            "\u0012\uffff\u0001\u0026\u0001\u0015\u0001\uffff\u0001\u0025"+
            "\u0001\uffff\u0001\u001b\u0001\u0012\u0001\uffff\u0001\u0001"+
            "\u0001\u0003\u0001\u0019\u0001\u0017\u0001\u0002\u0001\u0018"+
            "\u0001\u0022\u0001\u001a\u000a\u0021\u0002\uffff\u0001\u0004"+
            "\u0001\u0014\u0001\u0016\u0002\uffff\u0001\u0013\u0001\u000c"+
            "\u0002\u0023\u0001\u000e\u0001\u0009\u0002\u0023\u0001\u000a"+
            "\u0002\u0023\u0001\u000d\u0001\u001c\u0001\u001e\u0001\u0011"+
            "\u0002\u0023\u0001\u000f\u0001\u0023\u0001\u000b\u0002\u0023"+
            "\u0001\u0008\u0003\u0023\u0001\u0024\u0002\uffff\u0001\u001d"+
            "\u0002\uffff\u0001\u0013\u0001\u000c\u0002\u0023\u0001\u000e"+
            "\u0001\u0009\u0002\u0023\u0001\u000a\u0002\u0023\u0001\u000d"+
            "\u0001\u001c\u0001\u001e\u0001\u0011\u0002\u0023\u0001\u000f"+
            "\u0001\u0023\u0001\u000b\u0002\u0023\u0001\u0008\u0003\u0023"+
            "\u0001\u0005\u0001\u0010\u0001\u0006\u002d\uffff\u0001\u001f"+
            "\u000f\uffff\u0001\u0020",
            "",
            "",
            "",
            "\u0001\u0027\u000e\uffff\u0001\u001f\u0001\u0029\u0001\u0028"+
            "\u0002\uffff\u001a\u0024\u0006\uffff\u001a\u0024",
            "",
            "",
            "",
            "\u0001\u002b\u001f\uffff\u0001\u002b",
            "\u0001\u002f\u000d\uffff\u0001\u002c\u0002\uffff\u0001\u002d"+
            "\u0002\uffff\u0001\u002e\u000b\uffff\u0001\u002f\u000d\uffff"+
            "\u0001\u002c\u0002\uffff\u0001\u002d\u0002\uffff\u0001\u002e",
            "\u0001\u0031\u0007\uffff\u0001\u0030\u0017\uffff\u0001\u0031"+
            "\u0007\uffff\u0001\u0030",
            "\u0001\u0033\u0006\uffff\u0001\u0032\u0002\uffff\u0001\u0034"+
            "\u0015\uffff\u0001\u0033\u0006\uffff\u0001\u0032\u0002\uffff"+
            "\u0001\u0034",
            "\u0001\u0035\u001f\uffff\u0001\u0035",
            "\u0001\u0036\u001f\uffff\u0001\u0036",
            "\u0001\u0037\u0001\uffff\u0001\u0038\u001d\uffff\u0001\u0037"+
            "\u0001\uffff\u0001\u0038",
            "\u0001\u0039\u001f\uffff\u0001\u0039",
            "",
            "\u0001\u003a\u001f\uffff\u0001\u003a",
            "",
            "\u0001\u003b\u001f\uffff\u0001\u003b",
            "",
            "\u0001\u0028",
            "\u0001\u003d\u0001\u0020",
            "",
            "",
            "",
            "\u0001\u003f\u0004\uffff\u0001\u0025",
            "",
            "\u0001\u0041\u001f\uffff\u0001\u0041",
            "",
            "\u0001\u0042\u001f\uffff\u0001\u0042",
            "",
            "",
            "\u0001\u0022\u0001\uffff\u000a\u0021",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0044\u001f\uffff\u0001\u0044",
            "\u0001\u0045\u001f\uffff\u0001\u0045",
            "\u0001\u0046\u001f\uffff\u0001\u0046",
            "\u0001\u0047\u001f\uffff\u0001\u0047",
            "\u0001\u0048\u001f\uffff\u0001\u0048",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u004c\u001f\uffff\u0001\u004c",
            "\u0001\u004d\u001f\uffff\u0001\u004d",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u004f\u001f\uffff\u0001\u004f",
            "\u0001\u0050\u001f\uffff\u0001\u0050",
            "\u0001\u0051\u001f\uffff\u0001\u0051",
            "\u0001\u0052\u001f\uffff\u0001\u0052",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0053\u001f\uffff\u0001\u0053",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0054\u001f\uffff\u0001\u0054",
            "\u0001\u0055\u001f\uffff\u0001\u0055",
            "",
            "\u0001\u0056\u001f\uffff\u0001\u0056",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0058\u001f\uffff\u0001\u0058",
            "\u0001\u0059\u001f\uffff\u0001\u0059",
            "\u0001\u005a\u001f\uffff\u0001\u005a",
            "",
            "",
            "",
            "\u0001\u005b\u001f\uffff\u0001\u005b",
            "\u0001\u005c\u001f\uffff\u0001\u005c",
            "",
            "\u0001\u005d\u001f\uffff\u0001\u005d",
            "\u0001\u005e\u001f\uffff\u0001\u005e",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0060\u001f\uffff\u0001\u0060",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0061\u001f\uffff\u0001\u0061",
            "",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0063\u001f\uffff\u0001\u0063",
            "\u0001\u0064\u001f\uffff\u0001\u0064",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "",
            "\u0001\u0069\u001f\uffff\u0001\u0069",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "",
            "\u0001\u006b\u001f\uffff\u0001\u006b",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "",
            "",
            "",
            "",
            "\u0001\u006d\u001f\uffff\u0001\u006d",
            "",
            "\u0001\u006e\u001f\uffff\u0001\u006e",
            "",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            "\u0001\u0070\u001f\uffff\u0001\u0070",
            "",
            "\u000a\u0023\u0007\uffff\u001a\u0023\u0004\uffff\u0001\u0023"+
            "\u0001\uffff\u001a\u0023",
            ""
    ]
});

org.antlr.lang.augmentObject(FormulaLexer, {
    DFA28_eot:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaLexer.DFA28_eotS),
    DFA28_eof:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaLexer.DFA28_eofS),
    DFA28_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(FormulaLexer.DFA28_minS),
    DFA28_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(FormulaLexer.DFA28_maxS),
    DFA28_accept:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaLexer.DFA28_acceptS),
    DFA28_special:
        org.antlr.runtime.DFA.unpackEncodedString(FormulaLexer.DFA28_specialS),
    DFA28_transition: (function() {
        var a = [],
            i,
            numStates = FormulaLexer.DFA28_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(FormulaLexer.DFA28_transitionS[i]));
        }
        return a;
    })()
});

FormulaLexer.DFA28 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 28;
    this.eot = FormulaLexer.DFA28_eot;
    this.eof = FormulaLexer.DFA28_eof;
    this.min = FormulaLexer.DFA28_min;
    this.max = FormulaLexer.DFA28_max;
    this.accept = FormulaLexer.DFA28_accept;
    this.special = FormulaLexer.DFA28_special;
    this.transition = FormulaLexer.DFA28_transition;
};

org.antlr.lang.extend(FormulaLexer.DFA28, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( T__87 | T__88 | T__89 | T__90 | T__91 | T__92 | NEWLINE | WHILESTATEMENT | FORSTATEMENT | FROMSTATEMENT | INSTATEMENT | TOSTATEMENT | BYSTATEMENT | LOOPSTATEMENT | IFSTATEMENT | THENSTATEMENT | ELSESTATEMENT | FUNCTIONSTATEMENT | ENDBLOCK | RETURNSTATEMENT | OR | AND | EQUALS | NOTEQUALS | LT | LTEQ | GT | GTEQ | PLUS | MINUS | MULT | DIV | MOD | POW | NOT | LARR | RARR | INTEGER | FLOAT | TRUE | FALSE | IDENT | PRIMITIVE | COMMENT | LINE_COMMENT | WS );";
    },
    dummy: null
});
 
})();