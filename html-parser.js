window.debug = false;

var debugLog = function() {
	if (window.debug == true) {
		var args = Array.prototype.slice.call(arguments);
		console.log(args.join(" "));
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

var makeParser = function(executor) {

	return function(optionalSubParsersArray) {

		var subParsers;
		if (optionalSubParsersArray && optionalSubParsersArray.length && arguments.length == 1) {
			subParsers = optionalSubParsersArray;
		} else {
			subParsers = Array.prototype.slice.call(arguments);
		}

		debugLog("Generating new parser with", subParsers);
		return {
			parse: function(input) {
				if (typeof input == "string") {
					debugLog("Made new input out of '" + input + "'");
					input = new ParserInput(input);
				}
				return executor(input, subParsers);
			}
		};
	};
};

var chr = makeParser(function(input, needle) {
	debugLog("str(" + needle + ")", input);
	input.mark();

	var chr = input.next();

	debugLog("Checking", chr, " against ", needle);
	if (chr === needle) {
		return chr;
	} else {
		input.rollback();
		return null;
	}

});

var digit = makeParser(function(input) {
	debugLog("digit()", input);
	input.mark();

	var chr = input.next();

	debugLog("Checking", chr, "for digitness");
	if ( !isNaN(parseInt(chr)) ) {
		return chr;
	} else {
		input.rollback();
		return null;
	}
});

var seq = makeParser(function(input, subParsers) {

	debugLog("seq(" + subParsers.join(',') + ")", input);
	input.mark();

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
		input.rollback();
		return null;
	}

});


var word = function(needle) {

	var characterParsers = needle.split('').map(function(needleCharacter) {
		return chr(needleCharacter);
	});

	return seq(characterParsers); // using alternate signature for seq: using array of parsers (not argument list)

};