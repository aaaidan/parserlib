console.log("html-parser.js");

var htmlSelfClosingTagNames = ['br','hr', 'input'];
var htmlPairedTagNames      = ['b', 'i', 'u', 'span', 'div'];


var htmlAttributeName  = or.apply(this, ['href', 'src', 'style', 'class']); // todo: make this any alphabetical word
var htmlAttributeValue = seq("\"", or.apply(this, ['checked','radio','disabled']), "\""); // todo: make this any alphanumeric word


var htmlAttribute = seq(htmlAttributeName, "=", htmlAttributeValue);
var htmlAttributes = any(seq(_, htmlAttribute));

var htmlSelfClosingTagName = or.apply(this, htmlSelfClosingTagNames);
var htmlSelfClosingTag = seq("<", htmlSelfClosingTagName, or(__, htmlAttributes), "/>");

var htmlPairedTagName = or.apply(this, htmlPairedTagNames);
// This is where it starts to get a bit sticky, but we just have to remember:
//   "parse, THEN validate."
// So `<b>lol</u>` is perfectly parseable, just not valid syntax.
// Validate the parse tree later.
var htmlPairedTagStart = seq("<", htmlPairedTagName, ">");
var htmlPairedTagEnd = seq("</", htmlPairedTagName, ">");

