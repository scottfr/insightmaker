var webdriver = require('wd')
  , assert = require('assert');

var browser = webdriver.remote(
  "ondemand.saucelabs.com"
  , 80
  , "rolandk"
  , "c72089ef-9246-4732-b8d5-f488b76498b6"
);

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});

browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

var desired = {
  browserName: 'opera'
  , version: '12'
  , platform: 'Linux'
  , tags: ["examples"]
  , name: "This is an example test"
}

browser.init(desired, function() {
  browser.get("http://insightmaker.com/", function() {
    browser.title(function(err, title) {
      assert.ok(~title.indexOf('Insight Maker'), 'Wrong title!');
      browser.elementById('edit-name', function(err, el) {
    	  browser.type(el,'insight.maker@mail.com',  
    			browser.elementById('edit-pass', function(err, el) {
				  browser.type(el,'hugendubl',  
    				browser.elementById('edit-submit', function(err, el) {
    					browser.clickElement(el, function() {
    						browser.eval("window.location.href", function(err, title) {
    							assert.ok(~title.indexOf('main'), 'Not landed where it should');
    								browser.quit()
    						 })
    					})
    				})
    			)})
      		)}
    	);
    })
  })
});
