// window.debug = true;
// window.debugLogContent = "";

var debugLog = function() {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.log(args.join(" "));
		// window.debugLogContent += args.join(" ") + "\n";
	}
};

debugLog("html-parser.js");

var ParserInput = function(string) {
	this.str = string;
	this._i = 0;
	this.marks = [];
}
ParserInput.prototype.mark = function() {
	this.marks.push(this._i);
};
ParserInput.prototype.rollback = function() {
	this._i = this.marks.pop();
};
ParserInput.prototype.next = function() {
	return this.str.charAt(this._i++);
};
// Delete this if you haven't used it... thought it might be a good idea to make writing parsers easier
// ParserInput.prototype.i = function() {
// 	// returns the index relative to the last mark, for the current parser
// 	return this._i - this.marks[this.marks.length-1];
// };
ParserInput.prototype.toString = function() {
	return "[ParserInput "+ this._i + ":" + this.str.charAt(this._i) +"]";
}

var makeParser = function(name, executor) {

	return function(optionalSubParsersArray) {

		var subParsers = Array.prototype.slice.call(arguments);

		debugLog("Generating new " + name + " parser with", subParsers );

		return {
			toString: function() {
				return "[Parser " + name + "]";
			},
			parse: function(input) {
				if (typeof input == "string") {
					debugLog("Made new input out of '" + input + "'");
					input = new ParserInput(input);
				}
				debugLog("" + name + "(" + subParsers.join(',') + ")");
				input.mark();
				
				var result = executor(input, subParsers);
				
				if (result === null) {
					input.rollback();
				}

				return result;
			}
		};
	};
};

var chr = makeParser("chr", function(input, subParsers) {
	var needle = subParsers[0];

	debugLog("chr(" + needle + ")", input);

	var chr = input.next();

	debugLog("Checking", chr, " against ", needle);
	if (chr === needle) {
		return chr;
	} else {
		return null;
	}

});

var digit = (makeParser("digit", function(input) {
	debugLog("digit", input);

	var chr = input.next();

	debugLog("Checking", chr, "for digitness");
	if ( !isNaN(parseInt(chr)) ) {
		return chr;
	} else {
		return null;
	}
}))();

var wsChar = (makeParser("wsChar", function(input) {
	debugLog("wsChar", input);

	var chr = input.next();

	debugLog("Checking", chr, "for whitespaceness");
	if ( chr.match(/\s/) ) {
		return chr;
	} else {
		return null;
	}
}))();

var many = makeParser("many", function(input, subParsers) {
	debugLog("many(" + subParsers.join(',') + ")", input);

	var result = "";

	if (subParsers.length > 1) { throw new Error("many only takes one parser"); }

	var subParser = subParsers[0];

	var subParserResult;
	while ( (subParserResult = subParser.parse(input)) !== null ) {
		result += subParserResult;
	}

	if (result.length > 0) {
		return result;
	} else {
		return null;
	}
});

var any = makeParser("any", function(input, subParsers) {
	debugLog("any(" + subParsers.join(',') + ")", input);

	var result = "";

	if (subParsers.length > 1) { throw new Error("any only takes one parser"); }
	
	var subParser = subParsers[0];

	var subParserResult;
	while ( (subParserResult = subParser.parse(input)) !== null ) {
		result += subParserResult;
	}

	return result;

});

var seq = makeParser("seq", function(input, subParsers) {
	debugLog("seq(" + subParsers.join(',') + ")", input);

	var result = "";

	var success = subParsers.every(function(n) {
		var needleResult = n.parse(input);
		if (needleResult !== null) {
			debugLog("Sequence worked! ", needleResult);
			result += needleResult;
			return true;
		} else {
			return false;
		}
	});

	if (success) {
		return result;
	} else {
		return null;
	}
});

var _ = many(wsChar);
var __ = any(wsChar);

var word = function(needle) {
	var characterParsers = needle.split('').map(function(needleCharacter) {
		return chr(needleCharacter);
	});
	return seq.apply(null, characterParsers);
};