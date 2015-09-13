console.log("html-parser.js");

var htmlSelfClosingTagNames = ['br','hr', 'input'];
var htmlPairedTagNames      = ['b', 'i', 'u', 'span', 'div'];


var htmlAttributeName  = or.apply(this, ['href', 'src', 'style', 'class', 'type']); // todo: make this any alphabetical word
var htmlAttributeValue = seq("\"", or.apply(this, ['checked','radio','disabled']), "\""); // todo: make this any alphanumeric word


var htmlAttribute = seq(htmlAttributeName, "=", htmlAttributeValue);
htmlAttribute.customName = "htmlAttribute";
var htmlAttributes = seq( any( seq(_, htmlAttribute) ), __ );
htmlAttributes.customName = "htmlAttributes";

var htmlSelfClosingTagName = or.apply(this, htmlSelfClosingTagNames);
var htmlSelfClosingTag = seq("<", htmlSelfClosingTagName, htmlAttributes, "/>");

var htmlPairedTagName = or.apply(this, htmlPairedTagNames);
htmlPairedTagName.customName = "htmlPairedTagName";
// This is where it starts to get a bit sticky, but we just have to remember:
//   "parse, THEN validate."
// So `<b>lol</u>` is perfectly parseable, just not valid syntax.
// Validate the parse tree later.
var htmlPairedTagStart = seq("<", htmlPairedTagName, htmlAttributes, ">");
var htmlPairedTagEnd = seq("</", htmlPairedTagName, ">");

