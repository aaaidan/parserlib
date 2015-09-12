console.log("html-parser-test.js");

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



// htmlTagName
testEqual(
    "htmlTagName doesn't parse non-existent tagname", function() { 
    return htmlTagName.parse("q"); }, null);
testEqual(
    "htmlTagName parses b", function() { 
    return htmlTagName.parse("b"); }, "b");
testEqual(
    "htmlTagName parses i", function() { 
    return htmlTagName.parse("i"); }, "i");
testEqual(
    "htmlTagName parses u", function() { 
    return htmlTagName.parse("u"); }, "u");


console.log("Tests Passed:", testsPassed);
if (testsFailed == 0) {
	console.log("Tests Failed:", testsFailed);
} else {
	console.warn("Tests Failed:", testsFailed);
}

})();