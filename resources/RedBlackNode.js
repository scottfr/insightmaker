/*****
*
*   RedBlackNode.js
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
RedBlackNode.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function RedBlackNode(value, parent) {
    this._left   = null;
    this._right  = null;
    this._value  = value;
    this._height = 1;
	this.parent = parent;
}


/*****
*
*   add
*
*****/
RedBlackNode.prototype.add = function(value) {
    var relation = value.compare(this._value);
    var addResult;
    var result;
    var newNode;

    if ( relation != 0 ) {
        if ( relation < 0 ) {
            if ( this._left != null ) {
                addResult = this._left.add(value);
                this._left = addResult[0];
				this._left.parent = this;
                newNode = addResult[1];
            } else {
                newNode = this._left = new RedBlackNode(value, this);
            }
        } else if ( relation > 0 ) {
            if ( this._right != null ) {
                addResult = this._right.add(value);
                this._right = addResult[0];
				this._right.parent = this;
                newNode = addResult[1];
            } else {
                newNode = this._right = new RedBlackNode(value, this);
            }
        }
        result = [this.balanceTree(), newNode];
    } else {
        result = [this, this];
    }

    return result;
};


/*****
*
*   balanceTree
*
*****/
RedBlackNode.prototype.balanceTree = function() {
    var leftHeight  = (this._left  != null) ? this._left._height  : 0;
    var rightHeight = (this._right != null) ? this._right._height : 0;
    var result;

    if ( leftHeight > rightHeight + 1 ) {
        result = this.swingRight();
    } else if ( rightHeight > leftHeight + 1 ) {
        result = this.swingLeft();
    } else {
        this.setHeight();
        result = this;
    }

    return result;
};


/*****
*
*   join
*
*****/
RedBlackNode.prototype.join = function(that) {
    var result;

    if ( that == null ) {
        result = this;
    } else {
        var top;

        if ( this._height > that._height ) {
            top = this;
            top._right = that.join(top._right);
			top._right.parent = top;
        } else {
            top = that;
            top._left = this.join(top._left);
			top._left.parent = top;
        }

        result = top.balanceTree();
    }

    return result;
};


/*****
*
*   moveLeft
*
*****/
RedBlackNode.prototype.moveLeft = function() {
    var right = this._right;
    var rightLeft = right._left;
    
    this._right = rightLeft;
	if(this._right){
		this._right.parent = this;
	}
	
    right._left = this;
	right._left.parent = right;
	
    this.setHeight();
    right.setHeight();

    return right;
};


/*****
*
*   moveRight
*
*****/
RedBlackNode.prototype.moveRight = function() {
    var left = this._left;
    var leftRight = left._right;
    
    this._left = leftRight;
	if(this._left){
		this._left.parent = this;
	}
	
    left._right = this;
	left._right.parent = left;
	
    this.setHeight();
    left.setHeight();

    return left;
};


/*****
*
*   remove
*
*****/
RedBlackNode.prototype.remove = function(value) {
    var relation = value.compare(this._value);
    var remResult;
    var result;
    var remNode;

    if ( relation != 0 ) {
        if ( relation < 0 ) {
            if ( this._left != null ) {
                remResult = this._left.remove(value);
                this._left = remResult[0];
				if(this._left){
					this._left.parent = this;
				}
                remNode = remResult[1];
            } else {
                remNode = null;
            }
        } else {
            if ( this._right != null ) {
                remResult = this._right.remove(value);
                this._right = remResult[0];
				if(this._right){
                	this._right.parent = this;
				}
                remNode = remResult[1];
            } else {
                remNode = null;
            }
        }

        result = this;
    } else {
        remNode = this;

        if ( this._left == null ) {
            result = this._right;
        } else if ( this._right == null ) {
            result = this._left;
        } else {
            result = this._left.join(this._right);
            this._left = null;
            this._right = null;
        }
    }

    if ( remNode != null ) {
        if ( result != null ) {
            return [result.balanceTree(), remNode];
        } else {
            return [result, remNode];
        }
    } else {
        return [this, null];
    }
};


/*****
*
*   setHeight
*
*****/
RedBlackNode.prototype.setHeight = function() {
    var leftHeight  = (this._left  != null) ? this._left._height  : 0;
    var rightHeight = (this._right != null) ? this._right._height : 0;
    
    this._height = (leftHeight < rightHeight) ? rightHeight + 1 : leftHeight + 1;
};


/*****
*
*   swingLeft
*
*****/
RedBlackNode.prototype.swingLeft = function() {
    var right      = this._right;
    var rightLeft  = right._left;
    var rightRight = right._right;
    var left       = this._left;

    var leftHeight       = (left       != null ) ? left._height       : 0;
    var rightLeftHeight  = (rightLeft  != null ) ? rightLeft._height  : 0;
    var rightRightHeight = (rightRight != null ) ? rightRight._height : 0;

    if ( rightLeftHeight > rightRightHeight ) {
        this._right = right.moveRight();
		this._right.parent = this;
    }

    return this.moveLeft();
};


/*****
*
*   swingRight
*
*****/
RedBlackNode.prototype.swingRight = function() {
    var left      = this._left;
    var leftRight = left._right;
    var leftLeft  = left._left;
    var right     = this._right;

    var rightHeight     = (right     != null ) ? right._height     : 0;
    var leftRightHeight = (leftRight != null ) ? leftRight._height : 0;
    var leftLeftHeight  = (leftLeft  != null ) ? leftLeft._height  : 0;

    if ( leftRightHeight > leftLeftHeight ) {
        this._left = left.moveLeft();
		this._left.parent = this;
    }

    return this.moveRight();
};


/*****
*
*   traverse
*
*****/
RedBlackNode.prototype.traverse = function(func) {
    if ( this._left  != null ) this._left.traverse(func);
    func(this);
    if ( this._right != null ) this._right.traverse(func);
};


/*****
*
*   toString
*
*****/
RedBlackNode.prototype.toString = function() {
    return this._value.toString();
};

RedBlackNode.prototype.validateParents = function(){
	if(this._right){
		if(this._right.parent !== this){
			console.log("Invalid right");
			console.log(this)
		}
		this._right.validateParents();
	}
	if(this._left){
		if(this._left.parent !== this){
			console.log("Invalid left");
			console.log(this)
		}
		this._left.validateParents();
	}
}

