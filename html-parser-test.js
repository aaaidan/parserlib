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



// htmlSelfClosingTagName
testEqual(
    "htmlSelfClosingTagName doesn't parse non-existent tagname", function() { 
    return htmlSelfClosingTagName.parse("kumquat"); }, null);

htmlSelfClosingTagNames.forEach(function(tagName) {
	testEqual(
	    "htmlSelfClosingTagName parses " + tagName, function() { 
	    return htmlSelfClosingTagName.parse(tagName); }, tagName);
});

// htmlSelfClosingTag
testEqual(
    "htmlSelfClosingTag doesn't parse non-existent tagname", function() { 
    return htmlSelfClosingTag.parse("<kumquat />"); }, null);

htmlSelfClosingTagNames.forEach(function(tagName) {
	testEqual(
	    "htmlSelfClosingTag parses " + tagName, function() { 
	    return htmlSelfClosingTag.parse("<" + tagName + " />"); }, "<" + tagName + " />");
});

htmlSelfClosingTagNames.forEach(function(tagName) {
	testEqual(
	    "htmlSelfClosingTag parses " + tagName + " without trailing space.", function() { 
	    return htmlSelfClosingTag.parse("<" + tagName + "/>"); }, "<" + tagName + "/>");
});

// htmlPairedTagName
testEqual(
    "htmlPairedTagName doesn't parse non-existent tagname", function() { 
    return htmlPairedTagName.parse("kumquat"); }, null);

htmlPairedTagNames.forEach(function(tagName) {
	testEqual(
	    "htmlPairedTagName parses " + tagName, function() { 
	    return htmlPairedTagName.parse(tagName); }, tagName);
});

// htmlPairedTagStart
testEqual(
    "htmlPairedTagStart parses a paired tag", function() { 
    return htmlPairedTagStart.parse("<b>"); }, "<b>");

testEqual(
    "htmlPairedTagStart refuses a self closing tag", function() { 
    return htmlPairedTagStart.parse("<hr>"); }, null);

// htmlPairedTagEnd
testEqual(
    "htmlPairedTagEnd parses a paired tag", function() { 
    return htmlPairedTagEnd.parse("</b>"); }, "</b>");

testEqual(
    "htmlPairedTagEnd refuses a self closing tag", function() { 
    return htmlPairedTagEnd.parse("</hr>"); }, null);

// htmlPairedTag



console.log("Tests Passed:", testsPassed);
if (testsFailed == 0) {
	console.log("Tests Failed:", testsFailed);
} else {
	console.warn("Tests Failed:", testsFailed);
}

})();