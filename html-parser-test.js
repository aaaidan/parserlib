console.log("html-parser-test.js");

/*
var TestVM = function(title, testFunc, argFactory) {
	this.title = title;
	this.test = testFunc;
	this.argFactory = argFactory;
	this.status = ko.observable("unknown");
};
TestVM.prototype.run = function() {
	this.test.apply(null, this.argFactory());
}

var TestCollectionVM = function() {
	this.tests = ko.observableArray();
	this.argFactory = function() {
		return [1,2,3];
	}
};
TestCollectionVM.prototype.add = function(title, testFunc) {
	this.tests.push(new TestVM(title, testFunc, this.argFactory));
};
TestCollectionVM.prototype.setArgumentFactory = function(factory) {
	this.argFactory = factory;
};
TestCollectionVM.prototype.runAll = function() {
	this.tests().forEach(function(test) {
		test.run();
	});
};


var htmlParserTestsVM = new TestCollectionVM();
htmlParserTestsVM.setArgumentFactory(function() {
	return [ HtmlParser ];
});
htmlParserTestsVM.add("parses a number", function() {
	console.log("Parsing a number", arguments);
	HtmlParser.numberDigit().;
});

ko.applyBindings(htmlParserTestsVM);

htmlParserTestsVM.runAll();
*/

(function() {

var testsPassed = 0;
var testsFailed = 0;

function testEqual(title, executor, expectedValue) {
	if (!title || !title.length) {
		title = "Untitled Test";
	}
	var result = executor();
	if (result !== expectedValue) {
		console.warn("Failed Test:", title, "Expected: ", expectedValue, "but got:", result);
		testsFailed++;
	} else {
		console.log("Passed:", title);
		testsPassed++;
	}
};

testEqual(
    "chr doesn't parse wrong char", function() { 
    return chr("b").parse("a"); }, null);
testEqual(
    "chr parses correct input", function() { 
    return chr("a").parse("a"); }, "a");
testEqual(
    "chr parses only what it's asked", function() { 
    return chr("a").parse("abc"); }, "a");
testEqual(
    "seq works with chr", function() { 
    return seq(chr("a"), chr("b")).parse("ab"); }, "ab");
testEqual(
    "seq parses only what it's asked with chr", function() { 
    return seq(chr("a"), chr("b")).parse("abc"); }, "ab");
testEqual(
    "seq parses only what it's asked with digit", function() { 
    return seq(digit(),digit(),digit()).parse("6460"); }, "646");
testEqual(
    "seq returns nothing when one of its elements fails", function() { 
    return seq(digit(),digit(),digit()).parse("6a60"); }, null);
testEqual(
    "seq can be called with an array (rather than arguments)", function() { 
    return seq([chr("a"),chr("b"),chr("c")]).parse("abcd"); }, "abc");
testEqual(
    "word only parses correct input", function() { 
    return word("abc").parse("abc"); }, "abc");
testEqual(
    "word only parses what it's asked", function() { 
    return word("abc").parse("abcd"); }, "abc");
testEqual(
    "word fails correctly", function() { 
    return word("abc").parse("abdc"); }, null);

console.log("Tests Passed:", testsPassed);
if (testsFailed == 0) {
	console.log("Tests Failed:", testsFailed);
} else {
	console.warn("Tests Failed:", testsFailed);
}

})();

/*
var tagName = or(str("b"), str("i"), str("u"));
var tag = seq(str("<"), tagName, str(">"));

tag.parse("<b>");
tag.parse("<hr>");
tag.parse("</hr>");
tag.parse("<b><i>");
*/