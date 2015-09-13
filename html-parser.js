console.log("html-parser.js");

var htmlSelfClosingTagNames = ['br','hr', 'input'];
var htmlPairedTagNames = ['b', 'i', 'u', 'span', 'div'];

var htmlSelfClosingTagName = or.apply(this, htmlSelfClosingTagNames);
var htmlSelfClosingTag = seq("<", htmlSelfClosingTagName, __, "/>");

var htmlPairedTagName = or.apply(this, htmlPairedTagNames);
// This is where it starts to get a bit sticky, but we just have to remember:
//   "parse, THEN validate."
// So `<b>lol</u>` is perfectly parseable, just not valid syntax.
// Validate the parse tree later.
var htmlPairedTagStart = seq("<", htmlPairedTagName, ">");
var htmlPairedTagEnd = seq("</", htmlPairedTagName, ">");

