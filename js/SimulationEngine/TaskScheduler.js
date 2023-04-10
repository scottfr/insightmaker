"use strict";
/*

Copyright 2010-2015 Scott Fortmann-Roe. All rights reserved.

This file may distributed and/or modified under the
terms of the Insight Maker Public License (https://InsightMaker.com/impl).

*/

/*

	var t = new TaskQueue({start: new Material(0), end: new Material(20)});
	var a = new Task({
		name: "A",
		time: new Material(10),
		priority: 0,
		action: function(){
			console.log("A");
		}
	});
	var b = new Task({
		name: "B",
		time: new Material(10),
		priority: 1,
		action: function(){
			console.log("B");
			b.kill();
		}
	});
	var c = new Task({
		name: "C",
		time: new Material(10),
		priority: 1,
		action: function(){
			console.log("C");
		}
	});
	t.add(a);
	t.add(b);
	t.add(c);
	t.tasks.goMin();
	while(! t.completed()){
		t.step();
	}

	var t = new TaskQueue;
	t.add(new Task({
		name:"test 1",
		time: new Material(10),
		priority: -10,
		expires: 1,
		action: function(){},
		rollback: function(){}
	}));


var t =  new RedBlackTree();
function N(x){
	this.value = x;
}
N.prototype.toString = function(){
	return this.value.toString()
}
N.prototype.compare = function(other){
   if(this.value ==  other.value){
     return 0
   }else if(this.value < other.value){
		return -1
   }else{
		return 1;
   }
}
t.add(new N(10))
t.add(new N(5))
t.add(new N(2))
t.add(new N(11))
t.add(new N(3))
t.add(new N(12))
t.add(new N(15))
t.toString()

	var t = new TaskQueue(new Material(20));
	t.add(new Task({
		name:"test 1",
		time: new Material(10),
		priority: -10,
		expires: 1,
		action: function(){},
		rollback: function(){}
	}));

	var z = new Task({
		name:"test 12",
		time: new Material(10),
		priority: -10
	});
	t.add(z)
	
	t.add(new Task({
		name:"test 2",
		time: new Material(10),
		priority: -5
	}))
	t.add(new Task({
		name:"test 3",
		time: new Material(10),
		priority: -20
	}))

	t.add(new Task({
		name:"test b 1",
		time: new Material(20),
		priority: -10
	}))
	
	t.add(new Task({
		name:"test b 2",
		time: new Material(20),
		priority: -5
	}))
	t.add(new Task({
		name:"test b 3",
		time: new Material(20),
		priority: -20
	}))

	t.step();
	t.stepBack();
	t.step();
	t.stepBack();
	t.step();
	t.stepBack();
	t.step();
	t.stepBack();
	t.step();
	t.stepBack();
	t.step(); t.step()
	
	t.print();

	t.add(new Task({
		name:"test 4",
		time: new Material(10),
		priority: 0
	}))
	var q = new Task({
		name:"Early 1",
		time: new Material(5),
		priority: -10
	});
	t.add(q)
	t.add(new Task({
		name:"Late 1",
		time: new Material(15),
		priority: -10
	}))
	t.add(new Task({
		name:"test b 1",
		time: new Material(20),
		priority: -10
	}))
	
	t.add(new Task({
		name:"test b 2",
		time: new Material(20),
		priority: -5
	}))
	t.add(new Task({
		name:"test b 3",
		time: new Material(20),
		priority: -20
	}))
	t.add(new Task({
		name:"test b 4",
		time: new Material(20),
		priority: 0
	}))
	t.print()
	q.remove();
	z.remove();
	console.log("---")
	t.print();
	
	var t = new TaskQueue;
	scheduleRepeated(t, {name: "a", priority: -10}, new Material(0), new Material(10), new Material(30));
	scheduleRepeated(t, {name: "b", priority: -5}, new Material(0), new Material(10), new Material(30));
	t.print();
*/


function TaskQueue(config){
	config = config || {};
	this.tasks = new RedBlackTree();
	this.onMoveEvents = [];
	this.setTime(config.start);
	this.debug = false;
	this.end = config.end;
	this.states = {};
}

TaskQueue.prototype.print = function(){
	console.log("Current Time: "+this.time.value);
	this.tasks.goMin();
	while(this.tasks.current() !== null){
		console.log(this.tasks.current().name);
		console.log("    Time: "+this.tasks.current().time.value);
		console.log("    Priority: "+this.tasks.current().priority);
		if(isDefined(this.tasks.current().expires)){
			console.log("    Expires: "+this.tasks.current().expires);
		}
		if(isDefined(this.tasks.current().skip)){
			console.log("    Skip: "+this.tasks.current().skip);
		}
		this.tasks.next()
	}
}

TaskQueue.prototype.addEvent = function(event){
	this.onMoveEvents.push(event)
}

TaskQueue.prototype.fireEvents = function(timeChange, oldTime, newTime){
	if(this.debug){
		console.log("Firing Events")
	}
	for(var i = 0; i < this.onMoveEvents.length; i++){
		this.onMoveEvents[i](timeChange, oldTime, newTime);
	}
}

TaskQueue.prototype.setTime = function(t){
	if(isUndefined(this.time) || neq(t, this.time)){
		var oldTime = this.time;
		
		this.time = t;
		
		if(isDefined(oldTime)){
			this.fireEvents(minus(t, oldTime), oldTime, t);
		}
		
	}
}

TaskQueue.prototype.moveTime = function(timeChange){
	if(this.debug){
		console.log("Shifting time by: "+timeChange.value);
	}
	this.moveTo(timePlus(this.time, timeChange));
}

TaskQueue.prototype.moveTo = function(newTime){
	if(eq(this.time, newTime)){
		return;
	}else{
		if(this.debug){
			console.log("Shifting time to: " + newTime.value);
		}
		
		if(this.tasks.current() !== null){ // we have something defined
			var maxTime = this.tasks.max().time;
			var minTime = this.tasks.min().time;
			
			while(lessThan(this.time, newTime) && (! greaterThan(this.time, maxTime))){
				this.step()
			}
			while(greaterThan(this.time, newTime) && greaterThan(this.time, minTime)){
				this.stepBack();
			}
		}
		
		this.setTime(newTime);
		
		if(this.debug){
			console.log("Time shift to  "+newTime.value+" completed.");
		}
	}
}

TaskQueue.prototype.add = function(task){
	task.queue = this;
	
	this.tasks.add(task);
}

TaskQueue.prototype.step = function(){
	if(isUndefined(this.time)){
		this.tasks.goMin();
		this.setTime(this.tasks.current().time);
	}
	
	var t = this.tasks.current().time;
	//debugger;
	
//	console.log("--")
	if(this.tasks.current() !== null /*&& eq(t, this.tasks.current().time)*/){
		var dead = this.tasks.current().deadAction;
		this.tasks.current().execute();
		if((! dead) && this.tasks.current().timeShift){
			this.tasks.current().timeShift()
			return;
		}
		//console.log(this.tasks.current());
		this.tasks.next();
	}
	
//	console.log(this.tasks.current());
	
	if(this.tasks.current() !== null){
		this.setTime(this.tasks.current().time);
	}else{
//		console.log("null");
		this.tasks.next();
//		console.log(this.tasks.current())
		this.setTime(mult(this.tasks.max().time, new Material(10)));
	}
}

TaskQueue.prototype.stepBack = function(){
	if(isUndefined(this.time)){
		this.tasks.goMin();
		this.setTime(this.tasks.current().time);
		return;
	}
	
	if( this.tasks.current() === null){
		this.tasks.goMax();
	}else{
		this.tasks.previous();
	}
	
	var t = this.tasks.current().time;
	while(this.tasks.current() !== null && eq(t, this.tasks.current().time)){
		this.tasks.current().rollback();
		this.tasks.previous();
	}
	
	if(this.tasks.current() === null){
		this.tasks.goMin();
	}else{
		this.tasks.next();
	}
	
	this.setTime(this.tasks.current().time);
}

TaskQueue.prototype.atStart = function(){
	return isUndefined(this.time) || this.tasks.current() === this.tasks.min();
}

TaskQueue.prototype.completed = function(){
	return isDefined(this.time) && (greaterThan(this.time, this.end) || (this.tasks.current() === null));
}

TaskQueue.prototype.remove = function(task){
	//var c;
	if(task == this.tasks.current()){
		//console.log("overlap!!!")
		//console.log(this.time.value);
		this.tasks.next();
		//if(this.tasks.current() !== null){
		//	this.setTime(this.tasks.current().time);
		//}else{
		//	this.tasks.next();
		//	this.setTime(mult(this.tasks.max().time, new Material(10)));
		//}
		//var c = this.tasks._cursor;
	}
	this.tasks.remove(task);
	//if(c){
	//	this.tasks._cursor = c;
		//console.log(this.time.value);
		//console.log(this.tasks.current().name);
		//}
}

var TaskId = 0
// new Take({name: "solver", time: t, action: fn(), rollback: fn(), priority: -10, expires: 1})
function Task(config){
	this.id = TaskId++;
	this.name =  config.name;
	this.time = config.time;
	this.action = config.action;
	this.reverse = config.rollback;
	this.priority = config.priority || 0; // Lower priorities will be run before higher priorities at the same time
	this.expires = config.expires; // if defined, the number of times this is called before it expires
	this.skip = config.skip;
	this.timeShift = config.timeShift;
	this.data = config.data; //optional data object to be carried along, the task scheduler makes no use of this
	this.blocker = config.blocker;
	
	this.deadAction = false; // once dead no longer executes
	this.deadReverse = false; // once dead no longer executes
	
	if(this.action){
		this.action.task = this;
	}
	if(this.reverse){
		this.action.reverse = this
	}

}

Task.prototype.execute = function(){
	if(this.action && (! this.deadAction) && ((! this.blocker) || ! this.queue.states[this.blocker])){
		if(isDefined(this.skip) && this.skip > 0){
			this.skip--;
			if(this.queue.debug){
				console.log("Skipping: "+this.name);
			}
		}else{
			if(this.queue.debug){
				console.log("%c Executing: "+this.name+ " (Time: "+this.time.value+")", "color:blue");
			}
		
			if(isDefined(this.expires)){
				this.expires--;
				if(this.queue.debug){
					console.log("    Current count before expire: "+this.expires);
				}
				if(this.expires <= 0){
					if(this.queue.debug){
						console.log("    Task expired.");
					}
					this.deadAction = true;
				}
			}
		}
		

		this.action();
	}
}

Task.prototype.rollback = function(){
	if(this.reverse && (! this.deadReverse) && ((! this.blocker) || ! this.queue.states[this.blocker]) ){
		if(this.queue.debug){
			console.log("Rolling back: "+this.name+" (Time: "+this.time.value+")");
		}

		if(isDefined(this.expires)){
			if(this.expires <= 0){
				if(this.queue.debug){
					console.log("    Rollback expired.");
				}
				this.deadReverse = true;
			}
		}

		this.reverse();
	}
}

Task.prototype.reschedule = function(newTime){
	this.queue.remove(this);
	this.time = newTime;
	this.queue.add(this);
}

Task.prototype.remove = function(){
	this.queue.remove(this);
}

Task.prototype.kill = function(){
	this.deadAction = true;
	this.deadReverse = true;
}

Task.prototype.block = function(id){
	id = id || this.blocker;
	this.queue.states[id] = true;
}

Task.prototype.unblock = function(id){
	id = id || this.blocker;
	this.queue.states[id] = false;
}

Task.prototype.compare = function(other){
	if(eq(other.time, this.time)){
		if(other.priority == this.priority){
			if(other.id == this.id){
				return 0;
			}else if(other.id < this.id){
				return 1;
			}else{
				return -1;
			}
		}else if(other.priority < this.priority){
			return 1
		}else{
			return -1;
		}
	}else{
		if(lessThan(other.time, this.time)){
			return 1
		}else{
			return -1;
		}
	}
	throw "Comparison error";
}

Task.prototype.toString = function(){
	return this.name+" - "+this.id;
}


function scheduleRepeated(queue, config, start, step, end){
	var count = div(minus(end, start), step);
	for(var i = 0; i <= count; i++){
		config.time = plus(start, mult(step, new Material(i)));
		queue.add(new Task(config));
	}
}

