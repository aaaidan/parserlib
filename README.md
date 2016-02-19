# parserlib

A simple parser combinator written in JS. 

**Note**: This is not ready for real use. There are probably better [javascript parser combinators](https://www.google.co.nz/search?q=javascript+parser+combinator&oq=javascript+parser+combinator&aqs=chrome..69i57j0l3.614j0j7&sourceid=chrome&es_sm=91&ie=UTF-8) out there.

## Usage

Build up complex, useful parsers out of basic built-in parsers, such as `or` and `seq`.

Here's a hammy parser that parses a fake (and silly) idea for what makes a valid email address.

    var user = or('aidan', 'billy', 'catness');
    
    var domain = seq(
    	or(
    		'google',
    		'apple',
    		'microsoft',
    		'facebook'
    	),
    	'.',
    	or(
    		'com',
    		'org',
    		'net'
    	)
    );
    
    var email = seq(user, "@", domain);
    
    email.parse("aidan@google.net"); // "aidan@google.net"
   	email.parse("billy@facebook.org"); // "billy@facebook.org"
    email.parse("zara@lolfactory.biz"); // null
