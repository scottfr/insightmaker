/*****
*
*   RedBlackTree.js
*
*   copyright 2004, Kevin Lindsey
*   licensing info available at: http://www.kevlindev.com/license.txt
*
*****/

/*****
*
*   class variables
*
*****/
RedBlackTree.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function RedBlackTree() {
    this._root      = null;
    this._cursor    = null;
}


/*****  private methods *****/

/*****
*
*   _findNode
*
*****/
RedBlackTree.prototype._findNode = function(value) {

    var result = this._root;

    
    while ( result != null ) {
        var relation = value.compare(result._value);

        if ( relation != 0 ) {
            if ( relation < 0 ) {
                result = result._left;
            } else {
                result = result._right;
            }
        } else {
            break;
        }
    }

    return result;
};


/*****
*
*   _maxNode
*
*****/
RedBlackTree.prototype._maxNode = function(node) {
    if ( node == null ) node = this._root;

    if ( node != null ) {
        while ( node._right != null ) {
            node = node._right;
        }
    }

    return node;
};


/*****
*
*   _minNode
*
*****/
RedBlackTree.prototype._minNode = function(node) {
    if ( node == null ) node = this._root;

    if ( node != null ) {
        while ( node._left != null ) {
            node = node._left;
        }
    }

    return node;
};


/*****
*
*   _nextNode
*
*****/
RedBlackTree.prototype._nextNode = function(node) {
    if ( node != null ) {
        if ( node._right != null ) {
            node = this._minNode(node._right);
        } else {
			//console.log("--")
			//console.log(node._value.value)
            while ( node.parent != null && node.parent._right === node ) {
                node = node.parent;

			//	console.log(node._value.value)
            }

            node = node.parent;
			//console.log("-")
			//console.log(node._value.value)
        }
    } else {
        node = this._minNode(this._root);
    }

    return node;
};


/*****
*
*   _previousNode
*
*****/
RedBlackTree.prototype._previousNode = function(node) {
    if ( node != null ) {
        if ( node._left != null ) {
            node = this._maxNode(node._left);
        } else {
            
            while ( node.parent != null && node.parent._left === node ) {
                node = node.parent;
            }

            node = node.parent;
        }
    } else {
        node = this._maxNode(this._root);
    }

    return node;
};


/*****  public methods  *****/

/*****
*
*   add
*
*****/
RedBlackTree.prototype.add = function(value) {
    var result;
    
    if ( this._root == null ) {
        result = this._root = new RedBlackNode(value);
    } else {
        var addResult = this._root.add(value);

        this._root = addResult[0];
		this._root.parent = null;
        result = addResult[1];
    }

    return result;
};


/*****
*
*   find
*
*****/
RedBlackTree.prototype.find = function(value) {
    var node = this._findNode(value);
    
    return ( node != null ) ? node : null;
};


/*****
*
*   findNext
*
*****/
RedBlackTree.prototype.findNext = function(value) {
    var current = this._findNode(value, true);

    current = this._nextNode(current);

    return (current != null ) ? current._value : null;
};


/*****
*
*   findPrevious
*
*****/
RedBlackTree.prototype.findPrevious = function(value) {
    var current = this._findNode(value, true);

    current = this._previousNode(current);

    return (current != null ) ? current._value : null;
};


/*****
*
*   max
*
*****/
RedBlackTree.prototype.max = function() {
    var result = this._maxNode();

    return ( result != null ) ? result._value : null;
};


/*****
*
*   min
*
*****/
RedBlackTree.prototype.min = function() {
    var result = this._minNode();

    return ( result != null ) ? result._value : null;
};


/*****
*
*   next
*
*****/
RedBlackTree.prototype.next = function() {
    this._cursor = this._nextNode(this._cursor);

    return ( this._cursor ) ? this._cursor._value : null;
};


/*****
*
*   previous
*
*****/
RedBlackTree.prototype.previous = function() {
    this._cursor = this._previousNode(this._cursor);

    return ( this._cursor ) ? this._cursor._value : null;
};


/*****
*
*   remove
*
*****/
RedBlackTree.prototype.remove = function(value) {
    var result;

    if ( this._root != null ) {
        var remResult = this._root.remove(value);

        this._root = remResult[0];
        result = remResult[1];
    } else {
        result = null;
    }

    return result;
};


/*****
*
*   set
*
*****/
RedBlackTree.prototype.goMin = function() {
    this._cursor = this._minNode(this._root);
};

RedBlackTree.prototype.goMax = function() {
	this._cursor = this._maxNode(this._root);
};


RedBlackTree.prototype.current = function() {
    return this._cursor?this._cursor._value:null;
};



/*****
*
*   traverse
*
*****/
RedBlackTree.prototype.traverse = function(func) {
    if ( this._root != null ) {
        this._root.traverse(func);
    }
};


/*****
*
*   toString
*
*****/
RedBlackTree.prototype.toString = function() {
    var lines = [];

    if ( this._root != null ) {
        var indentText = "  ";
        var stack = [[this._root, 0, "^"]];

        while ( stack.length > 0 ) {
            var current = stack.pop();
            var node    = current[0];
            var indent  = current[1];
            var line    = "";

            for ( var i = 0; i < indent; i++ ) {
                line += indentText;
            }
            
            line += current[2] + "(" + node.toString() + ")";
            lines.push(line);

            if ( node._right != null ) stack.push([node._right, indent+1, "R"]);
            if ( node._left  != null ) stack.push([node._left,  indent+1, "L"]);
        }
    }
    
    return lines.join("\n");
};

RedBlackTree.prototype.validateParents = function(){
	if(! (this._root.parent == null)){
		console.log("Invalid root node parent");
		this._root.validateParents();
	}
	console.log("done");
}