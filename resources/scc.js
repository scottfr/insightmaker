// From: https://github.com/josch/cycles_johnson_meyer/tree/master/de/normalisiert/utils/graphs

/*

(BSD-2 license)

Copyright (c) 2012, Frank Meyer
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

function ElementaryCyclesSearch(adjList, nodes) {
	/** List of cycles */
	this.cycles = [];

	/** Adjacency-list of graph */
	this.adjList = adjList;

	/** Graphnodes */
	this.graphNodes = nodes;

	/** Blocked nodes, used by the algorithm of Johnson */
	this.blocked = [];

	/** B-Lists, used by the algorithm of Johnson */
	this.B = [];

	/** Stack for nodes, used by the algorithm of Johnson */
	this.stack = [];

}


/**
 * Returns List::List::Object with the Lists of nodes of all elementary
 * cycles in the graph.
 *
 * @return List::List::Object with the Lists of the elementary cycles.
 */
ElementaryCyclesSearch.prototype.getElementaryCycles = function() {
	this.cycles = [];
	this.blocked = this.adjList.map(function() {
		return false
	});
	this.B = this.adjList.map(function() {
		return null
	});
	this.stack = [];
	var sccs = new StrongConnectedComponents(this.adjList);
	var s = 0;

	while (true) {
		var sccResult = sccs.getAdjacencyList(s);
		if (sccResult != null && sccResult.getAdjList() != null) {
			var scc = sccResult.getAdjList();
			s = sccResult.getLowestNodeId();

			for (var j = 0; j < scc.length; j++) {
				if ((scc[j] != null) && (scc[j].length > 0)) {
					this.blocked[j] = false;
					this.B[j] = [];
				}
			}

			this.findCycles(s, s, scc);
			s++;
			
		} else {
			break;
		}
	}

	return this.cycles.map(function(x){return x.reverse()});
}

/**
 * Calculates the cycles containing a given node in a strongly connected
 * component. The method calls itself recursivly.
 *
 * @param v
 * @param s
 * @param adjList adjacency-list with the subgraph of the strongly
 * connected component s is part of.
 * @return true, if cycle found; false otherwise
 */
ElementaryCyclesSearch.prototype.findCycles = function(v, s, adjList) {
	var f = false;
	this.stack.push(v);
	this.blocked[v] = true;

	for (var i = 0; i < adjList[v].length; i++) {
		var w = adjList[v][i];
		// found cycle
		if (w == s) {
			var cycle = [];
			for (var j = 0; j < this.stack.length; j++) {
				var index = this.stack[j];
				cycle.push(this.graphNodes[index]);
			}
			this.cycles.push(cycle);
			f = true;
		} else if (!this.blocked[w]) {
			if (this.findCycles(w, s, adjList)) {
				f = true;
			}
		}
	}

	if (f) {
		this.unblock(v);
	} else {
		for (var i = 0; i < adjList[v].length; i++) {
			var w = adjList[v][i];
			if (this.B[w].indexOf(v) == -1) {
				this.B[w].push(v);
			}
		}
	}

	this.stack.splice(this.stack.indexOf(v), 1);
	return f;
}

/**
 * Unblocks recursivly all blocked nodes, starting with a given node.
 *
 * @param node node to unblock
 */
ElementaryCyclesSearch.prototype.unblock = function(node) {
	this.blocked[node] = false;
	var Bnode = this.B[node];
	while (Bnode.length > 0) {
		var w = Bnode[0];
		Bnode.splice(0, 1);
		if (this.blocked[w]) {
			this.unblock(w);
		}
	}
}

function StrongConnectedComponents(adjList) {
	/** Adjacency-list of original graph */
	this.adjListOriginal = adjList;

	/** Adjacency-list of currently viewed subgraph */
	this.adjList = null;

	/** Helpattribute for finding scc's */
	this.visited = null;

	/** Helpattribute for finding scc's */
	this.stack = null;

	/** Helpattribute for finding scc's */
	this.lowlink = null;

	/** Helpattribute for finding scc's */
	this.number = null;

	/** Helpattribute for finding scc's */
	this.sccCounter = 0;

	/** Helpattribute for finding scc's */
	this.currentSCCs = null;

}

/**
 * This method returns the adjacency-structure of the strong connected
 * component with the least vertex in a subgraph of the original graph
 * induced by the nodes {s, s + 1, ..., n}, where s is a given node. Note
 * that trivial strong connected components with just one node will not
 * be returned.
 *
 * @param node node s
 * @return SCCResult with adjacency-structure of the strong
 * connected component; null, if no such component exists
 */
StrongConnectedComponents.prototype.getAdjacencyList = function(node) {
	this.visited = this.adjListOriginal.map(function() {
		return false
	});
	this.lowlink = this.adjListOriginal.map(function() {
		return 0
	});
	this.number = this.adjListOriginal.map(function() {
		return 0
	});
	this.visited = this.adjListOriginal.map(function() {
		return false
	});
	this.stack = [];
	this.currentSCCs = [];

	this.makeAdjListSubgraph(node);

	for (var i = node; i < this.adjListOriginal.length; i++) {
		if (!this.visited[i]) {
			this.getStrongConnectedComponents(i);
			var nodes = this.getLowestIdComponent();
			if (nodes != null && nodes.indexOf(node) == -1 && nodes.indexOf(node + 1) == -1) {
				return this.getAdjacencyList(node + 1);
			} else {
				var adjacencyList = this.getAdjList(nodes);
				if (adjacencyList != null) {
					for (var j = 0; j < this.adjListOriginal.length; j++) {
						if (adjacencyList[j].length > 0) {
							return new SCCResult(adjacencyList, j);
						}
					}
				}
			}
		}
	}

	return null;
}

/**
 * Builds the adjacency-list for a subgraph containing just nodes
 * >= a given index.
 *
 * @param node Node with lowest index in the subgraph
 */
StrongConnectedComponents.prototype.makeAdjListSubgraph = function(node) {
	this.adjList = this.adjListOriginal.map(function(x) {
		return []
	});

	for (var i = node; i < this.adjList.length; i++) {
		var successors = [];
		for (var j = 0; j < this.adjListOriginal[i].length; j++) {
			if (this.adjListOriginal[i][j] >= node) {
				successors.push(this.adjListOriginal[i][j]);
			}
		}
		if (successors.length > 0) {
			this.adjList[i] = successors.map(function(x) {
				return 0
			});
			for (var j = 0; j < successors.length; j++) {
				var succ = successors[j];
				this.adjList[i][j] = succ;
			}
		}
	}
}

/**
 * Calculates the strong connected component out of a set of scc's, that
 * contains the node with the lowest index.
 *
 * @return Vector::Integer of the scc containing the lowest nodenumber
 */
StrongConnectedComponents.prototype.getLowestIdComponent = function() {
	var min = this.adjList.length;
	var currScc = null;

	for (var i = 0; i < this.currentSCCs.length; i++) {
		var scc = this.currentSCCs[i];
		for (var j = 0; j < scc.length; j++) {
			var node = scc[j];
			if (node < min) {
				currScc = scc;
				min = node;
			}
		}
	}

	return currScc;
}

/**
 * @return Vector[]::Integer representing the adjacency-structure of the
 * strong connected component with least vertex in the currently viewed
 * subgraph
 */
StrongConnectedComponents.prototype.getAdjList = function(nodes) {
	nodes = nodes || null;
	
	var lowestIdAdjacencyList = null;

	if (nodes != null) {
		lowestIdAdjacencyList = this.adjList.map(function(x) {
			return []
		});
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			for (var j = 0; j < this.adjList[node].length; j++) {
				var succ = this.adjList[node][j];
				if (nodes.indexOf(succ) > -1) {
					lowestIdAdjacencyList[node].push(succ);
				}
			}
		}
	}

	return lowestIdAdjacencyList;
}

/**
 * Searchs for strong connected components reachable from a given node.
 *
 * @param root node to start from.
 */
StrongConnectedComponents.prototype.getStrongConnectedComponents = function(root) {
	this.sccCounter++;
	this.lowlink[root] = this.sccCounter;
	this.number[root] = this.sccCounter;
	this.visited[root] = true;
	this.stack.push(root);
	

	for (var i = 0; i < this.adjList[root].length; i++) {
		var w = this.adjList[root][i];
		if (!this.visited[w]) {
			this.getStrongConnectedComponents(w);
			this.lowlink[root] = Math.min(this.lowlink[root], this.lowlink[w]);
		} else if (this.number[w] < this.number[root]) {
			if (this.stack.indexOf(w) > -1) {
				this.lowlink[root] = Math.min(this.lowlink[root], this.number[w]);
			}
		}
	}

	// found scc
	if ((this.lowlink[root] == this.number[root]) && (this.stack.length > 0)) {
		var next = -1;
		var scc = [];

		do {
			next = this.stack[this.stack.length - 1];
			this.stack.splice(this.stack.length - 1, 1);
			scc.push(next);
		} while (this.number[next] > this.number[root]);

		// simple scc's with just one node will not be added
		if (scc.length > 1) {
			this.currentSCCs.push(scc);
		}
	}
}


function SCCResult(adjList, lowestNodeId) {

	this.adjList = adjList;
	this.lowestNodeId = lowestNodeId;

}

SCCResult.prototype.getAdjList = function() {
	return this.adjList;
}

SCCResult.prototype.getLowestNodeId = function() {
	return this.lowestNodeId;
}
