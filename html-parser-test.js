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

	var result;
	try { result = executor(); } catch(e) { result = e; }

	if (result !== expectedValue) {
		console.warn("Failed Test:", title, "Expected: ", expectedValue, "but got:", result);
		testsFailed++;
	} else {
		//console.log("Passed:", title);
		testsPassed++;
	}
}; 

function testThrows(title, executor) {
	if (!title || !title.length) {
		title = "Untitled Test";
	}

	var result = null;
	try { executor(); } catch(e) { result = e; }

	if (result === null) {
		console.warn("Failed Test:", title, "Expected a thrown error, but executed without error.");
		testsFailed++;
	} else {
		//console.log("Passed:", title);
		testsPassed++;
	}
};



// chr
testEqual(
    "chr doesn't parse wrong char", function() { 
    return chr("b").parse("a"); }, null);
testEqual(
    "chr parses correct input", function() { 
    return chr("a").parse("a"); }, "a");
testEqual(
    "chr parses only what it's asked", function() { 
    return chr("a").parse("abc"); }, "a");

// digit
testEqual(
    "digit doesn't parse wrong char", function() { 
    return digit.parse("a"); }, null);
testEqual(
    "digit parses correct input", function() { 
    return digit.parse("5"); }, "5");
testEqual(
    "digit parses only what it's asked", function() { 
    return digit.parse("5273"); }, "5");

// seq
testEqual(
    "seq works with chr", function() { 
    return seq(chr("a"), chr("b")).parse("ab"); }, "ab");
testEqual(
    "seq parses only what it's asked with chr", function() { 
    return seq(chr("a"), chr("b")).parse("abc"); }, "ab");
testEqual(
    "seq parses only what it's asked with digit", function() { 
    return seq(digit, digit, digit).parse("6460"); }, "646");
testEqual(
    "seq returns nothing when one of its elements fails", function() { 
    return seq(digit, digit, digit).parse("6a60"); }, null);

// word
testEqual(
    "word only parses correct input", function() { 
    return word("abc").parse("abc"); }, "abc");
testEqual(
    "word only parses what it's asked", function() { 
    return word("abc").parse("abcd"); }, "abc");
testEqual(
    "word fails correctly", function() { 
    return word("abc").parse("abdc"); }, null);
testEqual(
    "word can be part of another parser", function() { 
    return seq( word("abc"), _, word("def") ).parse("abc   def"); }, "abc   def");

// wsChar
testEqual("wsChar fails correctly", function() {
	return wsChar.parse("ABC") }, null);
testEqual("wsChar parses single space", function() {
	return wsChar.parse(" ") }, " ");
testEqual("wsChar parses single tab", function() {
	return wsChar.parse("\t") }, "\t");
testEqual("wsChar parses single LF", function() {
	return wsChar.parse("\n") }, "\n");
testEqual("wsChar parses single CR", function() {
	return wsChar.parse("\r") }, "\r");

// many
testEqual("many fails correctly", function() {
	return many( digit ).parse("ABC") }, null);
testEqual("many parses correct input", function() {
	return many( digit ).parse("123") }, "123");
testEqual("many parses only what it's asked", function() {
	return many( digit ).parse("123abc") }, "123");
testThrows("many doesn't take more than one parser", function() {
	return many( digit, digit ).parse("123abc") });

// any
testEqual("any matches optionally", function() {
	return any( digit ).parse("ABC") }, "");
testEqual("any parses correct input", function() {
	return any( digit ).parse("123") }, "123");
testEqual("any parses only what it's asked", function() {
	return any( digit ).parse("123abc") }, "123");
testThrows("any doesn't take more than one parser", function() {
	return any( digit, digit ).parse("123abc") });

// mandatory whitespace
testEqual("_ fails correctly", function() {
	return _.parse("ABC") }, null);
testEqual("_ parses single space", function() {
	return _.parse(" ") }, " ");
testEqual("_ parses 4 spaces", function() {
	return _.parse("    ") }, "    ");
testEqual("_ parses single LF", function() {
	return _.parse("\n") }, "\n");
testEqual("_ parses 4x LF", function() {
	return _.parse("\n\n\n\n") }, "\n\n\n\n");
testEqual("_ parses single CR", function() {
	return _.parse("\r") }, "\r");
testEqual("_ parses 4x CR", function() {
	return _.parse("\r\r\r\r") }, "\r\r\r\r");
testEqual("_ parses CRLF", function() {
	return _.parse("\r\n") }, "\r\n");
testEqual("_ parses LFCR", function() {
	return _.parse("\n\r") }, "\n\r");
testEqual("_ parses only what asked ", function() {
	return _.parse("   \r\n   \t  ABC") }, "   \r\n   \t  ");

// optional whitespace
testEqual("__ matches optionally", function() {
	return __.parse("ABC") }, "");
testEqual("__ parses single space", function() {
	return __.parse(" ") }, " ");
testEqual("__ parses 4 spaces", function() {
	return __.parse("    ") }, "    ");
testEqual("__ parses single LF", function() {
	return __.parse("\n") }, "\n");
testEqual("__ parses 4x LF", function() {
	return __.parse("\n\n\n\n") }, "\n\n\n\n");
testEqual("__ parses single CR", function() {
	return __.parse("\r") }, "\r");
testEqual("__ parses 4x CR", function() {
	return __.parse("\r\r\r\r") }, "\r\r\r\r");
testEqual("__ parses CRLF", function() {
	return __.parse("\r\n") }, "\r\n");
testEqual("__ parses LFCR", function() {
	return __.parse("\n\r") }, "\n\r");
testEqual("__ parses only what asked ", function() {
	return __.parse("   \r\n   \t  ABC") }, "   \r\n   \t  ");


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