// window.debug = true;
// window.debugLogContent = "";

var debugLog = function() {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.log(args.join(" "));
		// window.debugLogContent += args.join(" ") + "\n";
	}
};
var debugWarn = function() {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.warn(args.join(" "));
		// window.debugLogContent += args.join(" ") + "\n";
	}
};
var debugGroup = function(name) {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.group(name);
		// window.debugLogContent += args.join(" ") + "\n";
	}
};
var debugGroupEnd = function() {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.groupEnd();
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

var constructParser = function(name, executor, autoConvertStrings) {
	// This is what the parser developer calls.

	if (typeof autoConvertStrings == "undefined") {
		autoConvertStrings = true;
	}

	return function buildParser() {
		// This is what the parser builder calls, e.g. or(), seq(), ...

		var subParsers = Array.prototype.slice.call(arguments);
		debugLog("Generating new " + name + " parser with", subParsers);

		return {
			toString: function() {
				return "[Parser " + name + "]";
			},
			parse: function(input) {
				if (typeof input == "string") {
					input = new ParserInput(input);
				}

				if (autoConvertStrings) {
					// This automatically converts literal strings into
					// a 'word' parser. or("b", "i", "u") --> or(word("b"), ...);
					subParsers = subParsers.map(function(p) {
						if (typeof p == "string") {
							if (p.length == 1) {
								return chr(p);
							} else {
								return word(p);
							}
						}
						return p;
					});
				}
				
				input.mark();
				
				debugGroup(name + "(" + subParsers.join(',') + ")");
				debugLog("Parsing:", input.toString());

				var result = executor(input, subParsers);

				debugGroupEnd();

				if (result === null) {
					debugWarn("RESULT: Failed");
					input.rollback();
				} else {
					debugLog("RESULT: Success");
				}

				return result;
			}
		};
	};
};

var chr = constructParser("chr", function(input, subParsers) {
	var needle = subParsers[0];

	var chr = input.next();
	if (chr === needle) {
		return chr;
	} else {
		return null;
	}

}, false);

var digit = (constructParser("digit", function(input) {
	var chr = input.next();

	if ( !isNaN(parseInt(chr)) ) {
		return chr;
	} else {
		return null;
	}
}))();

var wsChar = (constructParser("wsChar", function(input) {
	var chr = input.next();

	if ( chr.match(/\s/) ) {
		return chr;
	} else {
		return null;
	}
}))();

var many = constructParser("many", function(input, subParsers) {
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

var any = constructParser("any", function(input, subParsers) {
	var result = "";

	if (subParsers.length > 1) { throw new Error("any only takes one parser"); }
	
	var subParser = subParsers[0];

	var subParserResult;
	while ( (subParserResult = subParser.parse(input)) !== null ) {
		result += subParserResult;
	}

	return result;

});

var or = constructParser("or", function(input, subParsers) {
	var result = "";

	var success = subParsers.some(function(n) {
		var needleResult = n.parse(input);
		if (needleResult !== null) {
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

var seq = constructParser("seq", function(input, subParsers) {
	var result = "";

	var success = subParsers.every(function(n) {
		var needleResult = n.parse(input);
		if (needleResult !== null) {
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