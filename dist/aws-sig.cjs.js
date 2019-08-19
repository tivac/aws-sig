'use strict';

/**
 * CryptoJS core components.
 */
/*
	* Local polyfil of Object.create
	*/
var create = Object.create || (function () {
	function F() {}
	return function (obj) {
		var subtype;

		F.prototype = obj;

		subtype = new F();

		F.prototype = null;

		return subtype;
	};
}());

/**
 * CryptoJS namespace.
 */
var C = {};

/**
 * Library namespace.
 */
var C_lib = C.lib = {};

/**
 * Base object for prototypal inheritance.
 */
var Base = C_lib.Base = (function () {


	return {
		/**
		 * Creates a new object that inherits from this object.
		 *
		 * @param {Object} overrides Properties to copy into the new object.
		 *
		 * @return {Object} The new object.
		 *
		 * @static
		 *
		 * @example
		 *
		 *     var MyType = CryptoJS.lib.Base.extend({
		 *         field: 'value',
		 *
		 *         method: function () {
		 *         }
		 *     });
		 */
		extend: function (overrides) {
			// Spawn
			var subtype = create(this);

			// Augment
			if (overrides) {
				subtype.mixIn(overrides);
			}

			// Create default initializer
			if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
				subtype.init = function () {
					subtype.$super.init.apply(this, arguments);
				};
			}

			// Initializer's prototype is the subtype object
			subtype.init.prototype = subtype;

			// Reference supertype
			subtype.$super = this;

			return subtype;
		},

		/**
		 * Extends this object and runs the init method.
		 * Arguments to create() will be passed to init().
		 *
		 * @return {Object} The new object.
		 *
		 * @static
		 *
		 * @example
		 *
		 *     var instance = MyType.create();
		 */
		create: function () {
			var instance = this.extend();
			instance.init.apply(instance, arguments);

			return instance;
		},

		/**
		 * Initializes a newly created object.
		 * Override this method to add some logic when your objects are created.
		 *
		 * @example
		 *
		 *     var MyType = CryptoJS.lib.Base.extend({
		 *         init: function () {
		 *             // ...
		 *         }
		 *     });
		 */
		init: function () {
		},

		/**
		 * Copies properties into this object.
		 *
		 * @param {Object} properties The properties to mix in.
		 *
		 * @example
		 *
		 *     MyType.mixIn({
		 *         field: 'value'
		 *     });
		 */
		mixIn: function (properties) {
			for (var propertyName in properties) {
				if (properties.hasOwnProperty(propertyName)) {
					this[propertyName] = properties[propertyName];
				}
			}

			// IE won't copy toString using the loop above
			if (properties.hasOwnProperty('toString')) {
				this.toString = properties.toString;
			}
		},

		/**
		 * Creates a copy of this object.
		 *
		 * @return {Object} The clone.
		 *
		 * @example
		 *
		 *     var clone = instance.clone();
		 */
		clone: function () {
			return this.init.prototype.extend(this);
		}
	};
}());

/**
 * An array of 32-bit words.
 *
 * @property {Array} words The array of 32-bit words.
 * @property {number} sigBytes The number of significant bytes in this word array.
 */
var WordArray = C_lib.WordArray = Base.extend({
	/**
	 * Initializes a newly created word array.
	 *
	 * @param {Array} words (Optional) An array of 32-bit words.
	 * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	 *
	 * @example
	 *
	 *     var wordArray = CryptoJS.lib.WordArray.create();
	 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	 */
	init: function (words, sigBytes) {
		words = this.words = words || [];

		if (sigBytes != undefined) {
			this.sigBytes = sigBytes;
		} else {
			this.sigBytes = words.length * 4;
		}
	},

	/**
	 * Converts this word array to a string.
	 *
	 * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	 *
	 * @return {string} The stringified word array.
	 *
	 * @example
	 *
	 *     var string = wordArray + '';
	 *     var string = wordArray.toString();
	 *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	 */
	toString: function (encoder) {
		return (encoder || Hex).stringify(this);
	},

	/**
	 * Concatenates a word array to this word array.
	 *
	 * @param {WordArray} wordArray The word array to append.
	 *
	 * @return {WordArray} This word array.
	 *
	 * @example
	 *
	 *     wordArray1.concat(wordArray2);
	 */
	concat: function (wordArray) {
		// Shortcuts
		var thisWords = this.words;
		var thatWords = wordArray.words;
		var thisSigBytes = this.sigBytes;
		var thatSigBytes = wordArray.sigBytes;

		// Clamp excess bits
		this.clamp();

		// Concat
		if (thisSigBytes % 4) {
			// Copy one byte at a time
			for (var i = 0; i < thatSigBytes; i++) {
				var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
				thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
			}
		} else {
			// Copy one word at a time
			for (var i = 0; i < thatSigBytes; i += 4) {
				thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
			}
		}
		this.sigBytes += thatSigBytes;

		// Chainable
		return this;
	},

	/**
	 * Removes insignificant bits.
	 *
	 * @example
	 *
	 *     wordArray.clamp();
	 */
	clamp: function () {
		// Shortcuts
		var words = this.words;
		var sigBytes = this.sigBytes;

		// Clamp
		words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		words.length = Math.ceil(sigBytes / 4);
	},

	/**
	 * Creates a copy of this word array.
	 *
	 * @return {WordArray} The clone.
	 *
	 * @example
	 *
	 *     var clone = wordArray.clone();
	 */
	clone: function () {
		var clone = Base.clone.call(this);
		clone.words = this.words.slice(0);

		return clone;
	},

	/**
	 * Creates a word array filled with random bytes.
	 *
	 * @param {number} nBytes The number of random bytes to generate.
	 *
	 * @return {WordArray} The random word array.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var wordArray = CryptoJS.lib.WordArray.random(16);
	 */
	random: function (nBytes) {
		var words = [];

		var r = (function (m_w) {
			var m_w = m_w;
			var m_z = 0x3ade68b1;
			var mask = 0xffffffff;

			return function () {
				m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
				m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
				var result = ((m_z << 0x10) + m_w) & mask;
				result /= 0x100000000;
				result += 0.5;
				return result * (Math.random() > .5 ? 1 : -1);
			}
		});

		for (var i = 0, rcache; i < nBytes; i += 4) {
			var _r = r((rcache || Math.random()) * 0x100000000);

			rcache = _r() * 0x3ade67b7;
			words.push((_r() * 0x100000000) | 0);
		}

		return new WordArray.init(words, nBytes);
	}
});

/**
 * Encoder namespace.
 */
var C_enc = C.enc = {};

/**
 * Hex encoding strategy.
 */
var Hex = C_enc.Hex = {
	/**
	 * Converts a word array to a hex string.
	 *
	 * @param {WordArray} wordArray The word array.
	 *
	 * @return {string} The hex string.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	 */
	stringify: function (wordArray) {
		// Shortcuts
		var words = wordArray.words;
		var sigBytes = wordArray.sigBytes;

		// Convert
		var hexChars = [];
		for (var i = 0; i < sigBytes; i++) {
			var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
			hexChars.push((bite >>> 4).toString(16));
			hexChars.push((bite & 0x0f).toString(16));
		}

		return hexChars.join('');
	},

	/**
	 * Converts a hex string to a word array.
	 *
	 * @param {string} hexStr The hex string.
	 *
	 * @return {WordArray} The word array.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	 */
	parse: function (hexStr) {
		// Shortcut
		var hexStrLength = hexStr.length;

		// Convert
		var words = [];
		for (var i = 0; i < hexStrLength; i += 2) {
			words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		}

		return new WordArray.init(words, hexStrLength / 2);
	}
};

/**
 * Latin1 encoding strategy.
 */
var Latin1 = C_enc.Latin1 = {
	/**
	 * Converts a word array to a Latin1 string.
	 *
	 * @param {WordArray} wordArray The word array.
	 *
	 * @return {string} The Latin1 string.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	 */
	stringify: function (wordArray) {
		// Shortcuts
		var words = wordArray.words;
		var sigBytes = wordArray.sigBytes;

		// Convert
		var latin1Chars = [];
		for (var i = 0; i < sigBytes; i++) {
			var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
			latin1Chars.push(String.fromCharCode(bite));
		}

		return latin1Chars.join('');
	},

	/**
	 * Converts a Latin1 string to a word array.
	 *
	 * @param {string} latin1Str The Latin1 string.
	 *
	 * @return {WordArray} The word array.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	 */
	parse: function (latin1Str) {
		// Shortcut
		var latin1StrLength = latin1Str.length;

		// Convert
		var words = [];
		for (var i = 0; i < latin1StrLength; i++) {
			words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		}

		return new WordArray.init(words, latin1StrLength);
	}
};

/**
 * UTF-8 encoding strategy.
 */
var Utf8 = C_enc.Utf8 = {
	/**
	 * Converts a word array to a UTF-8 string.
	 *
	 * @param {WordArray} wordArray The word array.
	 *
	 * @return {string} The UTF-8 string.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	 */
	stringify: function (wordArray) {
		try {
			return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		} catch (e) {
			throw new Error('Malformed UTF-8 data');
		}
	},

	/**
	 * Converts a UTF-8 string to a word array.
	 *
	 * @param {string} utf8Str The UTF-8 string.
	 *
	 * @return {WordArray} The word array.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	 */
	parse: function (utf8Str) {
		return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	}
};

/**
 * Abstract buffered block algorithm template.
 *
 * The property blockSize must be implemented in a concrete subtype.
 *
 * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
 */
var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	/**
	 * Resets this block algorithm's data buffer to its initial state.
	 *
	 * @example
	 *
	 *     bufferedBlockAlgorithm.reset();
	 */
	reset: function () {
		// Initial values
		this._data = new WordArray.init();
		this._nDataBytes = 0;
	},

	/**
	 * Adds new data to this block algorithm's buffer.
	 *
	 * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	 *
	 * @example
	 *
	 *     bufferedBlockAlgorithm._append('data');
	 *     bufferedBlockAlgorithm._append(wordArray);
	 */
	_append: function (data) {
		// Convert string to WordArray, else assume WordArray already
		if (typeof data == 'string') {
			data = Utf8.parse(data);
		}

		// Append
		this._data.concat(data);
		this._nDataBytes += data.sigBytes;
	},

	/**
	 * Processes available data blocks.
	 *
	 * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	 *
	 * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	 *
	 * @return {WordArray} The processed data.
	 *
	 * @example
	 *
	 *     var processedData = bufferedBlockAlgorithm._process();
	 *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	 */
	_process: function (doFlush) {
		// Shortcuts
		var data = this._data;
		var dataWords = data.words;
		var dataSigBytes = data.sigBytes;
		var blockSize = this.blockSize;
		var blockSizeBytes = blockSize * 4;

		// Count blocks ready
		var nBlocksReady = dataSigBytes / blockSizeBytes;
		if (doFlush) {
			// Round up to include partial blocks
			nBlocksReady = Math.ceil(nBlocksReady);
		} else {
			// Round down to include only full blocks,
			// less the number of blocks that must remain in the buffer
			nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		}

		// Count words ready
		var nWordsReady = nBlocksReady * blockSize;

		// Count bytes ready
		var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

		// Process blocks
		if (nWordsReady) {
			for (var offset = 0; offset < nWordsReady; offset += blockSize) {
				// Perform concrete-algorithm logic
				this._doProcessBlock(dataWords, offset);
			}

			// Remove processed words
			var processedWords = dataWords.splice(0, nWordsReady);
			data.sigBytes -= nBytesReady;
		}

		// Return processed words
		return new WordArray.init(processedWords, nBytesReady);
	},

	/**
	 * Creates a copy of this object.
	 *
	 * @return {Object} The clone.
	 *
	 * @example
	 *
	 *     var clone = bufferedBlockAlgorithm.clone();
	 */
	clone: function () {
		var clone = Base.clone.call(this);
		clone._data = this._data.clone();

		return clone;
	},

	_minBufferSize: 0
});

/**
 * Abstract hasher template.
 *
 * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
 */
var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	/**
	 * Configuration options.
	 */
	cfg: Base.extend(),

	/**
	 * Initializes a newly created hasher.
	 *
	 * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	 *
	 * @example
	 *
	 *     var hasher = CryptoJS.algo.SHA256.create();
	 */
	init: function (cfg) {
		// Apply config defaults
		this.cfg = this.cfg.extend(cfg);

		// Set initial values
		this.reset();
	},

	/**
	 * Resets this hasher to its initial state.
	 *
	 * @example
	 *
	 *     hasher.reset();
	 */
	reset: function () {
		// Reset data buffer
		BufferedBlockAlgorithm.reset.call(this);

		// Perform concrete-hasher logic
		this._doReset();
	},

	/**
	 * Updates this hasher with a message.
	 *
	 * @param {WordArray|string} messageUpdate The message to append.
	 *
	 * @return {Hasher} This hasher.
	 *
	 * @example
	 *
	 *     hasher.update('message');
	 *     hasher.update(wordArray);
	 */
	update: function (messageUpdate) {
		// Append
		this._append(messageUpdate);

		// Update the hash
		this._process();

		// Chainable
		return this;
	},

	/**
	 * Finalizes the hash computation.
	 * Note that the finalize operation is effectively a destructive, read-once operation.
	 *
	 * @param {WordArray|string} messageUpdate (Optional) A final message update.
	 *
	 * @return {WordArray} The hash.
	 *
	 * @example
	 *
	 *     var hash = hasher.finalize();
	 *     var hash = hasher.finalize('message');
	 *     var hash = hasher.finalize(wordArray);
	 */
	finalize: function (messageUpdate) {
		// Final message update
		if (messageUpdate) {
			this._append(messageUpdate);
		}

		// Perform concrete-hasher logic
		var hash = this._doFinalize();

		return hash;
	},

	blockSize: 512/32,

	/**
	 * Creates a shortcut function to a hasher's object interface.
	 *
	 * @param {Hasher} hasher The hasher to create a helper for.
	 *
	 * @return {Function} The shortcut function.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	 */
	_createHelper: function (hasher) {
		return function (message, cfg) {
			return new hasher.init(cfg).finalize(message);
		};
	},

	/**
	 * Creates a shortcut function to the HMAC's object interface.
	 *
	 * @param {Hasher} hasher The hasher to use in this HMAC helper.
	 *
	 * @return {Function} The shortcut function.
	 *
	 * @static
	 *
	 * @example
	 *
	 *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	 */
	_createHmacHelper: function (hasher) {
		return function (message, key) {
			return new C_algo.HMAC.init(hasher, key).finalize(message);
		};
	}
});

/**
 * Algorithm namespace.
 */
var C_algo = C.algo = {};

// Shortcuts
var C$1 = C;
var C_lib$1 = C$1.lib;
var Base$1 = C_lib$1.Base;
var C_enc$1 = C$1.enc;
var Utf8$1 = C_enc$1.Utf8;
var C_algo$1 = C$1.algo;

/**
 * HMAC algorithm.
 */
var HMAC = C_algo$1.HMAC = Base$1.extend({
	/**
	 * Initializes a newly created HMAC.
	 *
	 * @param {Hasher} hasher The hash algorithm to use.
	 * @param {WordArray|string} key The secret key.
	 *
	 * @example
	 *
	 *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	 */
	init: function (hasher, key) {
		// Init hasher
		hasher = this._hasher = new hasher.init();

		// Convert string to WordArray, else assume WordArray already
		if (typeof key == 'string') {
			key = Utf8$1.parse(key);
		}

		// Shortcuts
		var hasherBlockSize = hasher.blockSize;
		var hasherBlockSizeBytes = hasherBlockSize * 4;

		// Allow arbitrary length keys
		if (key.sigBytes > hasherBlockSizeBytes) {
			key = hasher.finalize(key);
		}

		// Clamp excess bits
		key.clamp();

		// Clone key for inner and outer pads
		var oKey = this._oKey = key.clone();
		var iKey = this._iKey = key.clone();

		// Shortcuts
		var oKeyWords = oKey.words;
		var iKeyWords = iKey.words;

		// XOR keys with pad constants
		for (var i = 0; i < hasherBlockSize; i++) {
			oKeyWords[i] ^= 0x5c5c5c5c;
			iKeyWords[i] ^= 0x36363636;
		}
		oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

		// Set initial values
		this.reset();
	},

	/**
	 * Resets this HMAC to its initial state.
	 *
	 * @example
	 *
	 *     hmacHasher.reset();
	 */
	reset: function () {
		// Shortcut
		var hasher = this._hasher;

		// Reset
		hasher.reset();
		hasher.update(this._iKey);
	},

	/**
	 * Updates this HMAC with a message.
	 *
	 * @param {WordArray|string} messageUpdate The message to append.
	 *
	 * @return {HMAC} This HMAC instance.
	 *
	 * @example
	 *
	 *     hmacHasher.update('message');
	 *     hmacHasher.update(wordArray);
	 */
	update: function (messageUpdate) {
		this._hasher.update(messageUpdate);

		// Chainable
		return this;
	},

	/**
	 * Finalizes the HMAC computation.
	 * Note that the finalize operation is effectively a destructive, read-once operation.
	 *
	 * @param {WordArray|string} messageUpdate (Optional) A final message update.
	 *
	 * @return {WordArray} The HMAC.
	 *
	 * @example
	 *
	 *     var hmac = hmacHasher.finalize();
	 *     var hmac = hmacHasher.finalize('message');
	 *     var hmac = hmacHasher.finalize(wordArray);
	 */
	finalize: function (messageUpdate) {
		// Shortcut
		var hasher = this._hasher;

		// Compute HMAC
		var innerHash = hasher.finalize(messageUpdate);
		hasher.reset();
		var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

		return hmac;
	}
});

// Shortcuts
var C$2 = C;
var C_lib$2 = C$2.lib;
var WordArray$1 = C_lib$2.WordArray;
var Hasher$1 = C_lib$2.Hasher;
var C_algo$2 = C$2.algo;

// Initialization and round constants tables
var H = [];
var K = [];

// Compute constants
(function () {
	function isPrime(n) {
		var sqrtN = Math.sqrt(n);
		for (var factor = 2; factor <= sqrtN; factor++) {
			if (!(n % factor)) {
				return false;
			}
		}

		return true;
	}

	function getFractionalBits(n) {
		return ((n - (n | 0)) * 0x100000000) | 0;
	}

	var n = 2;
	var nPrime = 0;
	while (nPrime < 64) {
		if (isPrime(n)) {
			if (nPrime < 8) {
				H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
			}
			K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

			nPrime++;
		}

		n++;
	}
}());

// Reusable object
var W = [];

/**
 * SHA-256 hash algorithm.
 */
var SHA256Hasher = C_algo$2.SHA256 = Hasher$1.extend({
	_doReset: function () {
		this._hash = new WordArray$1.init(H.slice(0));
	},

	_doProcessBlock: function (M, offset) {
		// Shortcut
		var H = this._hash.words;

		// Working variables
		var a = H[0];
		var b = H[1];
		var c = H[2];
		var d = H[3];
		var e = H[4];
		var f = H[5];
		var g = H[6];
		var h = H[7];

		// Computation
		for (var i = 0; i < 64; i++) {
			if (i < 16) {
				W[i] = M[offset + i] | 0;
			} else {
				var gamma0x = W[i - 15];
				var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
								((gamma0x << 14) | (gamma0x >>> 18)) ^
								(gamma0x >>> 3);

				var gamma1x = W[i - 2];
				var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
								((gamma1x << 13) | (gamma1x >>> 19)) ^
								(gamma1x >>> 10);

				W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
			}

			var ch  = (e & f) ^ (~e & g);
			var maj = (a & b) ^ (a & c) ^ (b & c);

			var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
			var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

			var t1 = h + sigma1 + ch + K[i] + W[i];
			var t2 = sigma0 + maj;

			h = g;
			g = f;
			f = e;
			e = (d + t1) | 0;
			d = c;
			c = b;
			b = a;
			a = (t1 + t2) | 0;
		}

		// Intermediate hash value
		H[0] = (H[0] + a) | 0;
		H[1] = (H[1] + b) | 0;
		H[2] = (H[2] + c) | 0;
		H[3] = (H[3] + d) | 0;
		H[4] = (H[4] + e) | 0;
		H[5] = (H[5] + f) | 0;
		H[6] = (H[6] + g) | 0;
		H[7] = (H[7] + h) | 0;
	},

	_doFinalize: function () {
		// Shortcuts
		var data = this._data;
		var dataWords = data.words;

		var nBitsTotal = this._nDataBytes * 8;
		var nBitsLeft = data.sigBytes * 8;

		// Add padding
		dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		data.sigBytes = dataWords.length * 4;

		// Hash final blocks
		this._process();

		// Return final computed hash
		return this._hash;
	},

	clone: function () {
		var clone = Hasher$1.clone.call(this);
		clone._hash = this._hash.clone();

		return clone;
	}
});

/**
 * Shortcut function to the hasher's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 *
 * @return {WordArray} The hash.
 *
 * @static
 *
 * @example
 *
 *     var hash = CryptoJS.SHA256('message');
 *     var hash = CryptoJS.SHA256(wordArray);
 */
const SHA256 = Hasher$1._createHelper(SHA256Hasher);

/**
 * Shortcut function to the HMAC's object interface.
 *
 * @param {WordArray|string} message The message to hash.
 * @param {WordArray|string} key The secret key.
 *
 * @return {WordArray} The HMAC.
 *
 * @static
 *
 * @example
 *
 *     var hmac = CryptoJS.HmacSHA256(message, key);
 */
const HmacSHA256 = Hasher$1._createHmacHelper(SHA256Hasher);

/* eslint-disable new-cap */

const hash = (str) =>
    SHA256(str).toString();

const hmac = HmacSHA256;

// Replace one extra character beyond what encodeURIComponent does, "*"
// See https://github.com/aws/aws-sdk-js/blob/38bf84c144281f696768e8c64500f2847fe6f298/lib/util.js#L39-L49
const encode = (str) =>
    encodeURIComponent(str)
    .replace(/[*]/g, (x) =>
        // eslint-disable-next-line newline-per-chained-call
        `%${x.charCodeAt(0).toString(16).toUpperCase()}`
    );

const sort = (a, b) => a.localeCompare(b);

// Sort query parameters by key
// Then also sort by value because AWS
var query = ({ url }) => {
    const source = {};
    const params = [];
    
    url.searchParams.forEach((value, key) => {
        if(!source[key]) {
            source[key] = [];
        }

        source[key].push(value);
    });

    Object.keys(source)
        .sort(sort)
        .forEach((key) => {
            source[key]
                .sort(sort)
                .forEach((value) => {
                    params.push(`${encode(key)}=${encode(value)}`);
                });
        });

    return params.join("&");
};

const trim = (val) => {
    return val
        .toString()
        .trim()
        .replace(/\s+/g, " ");
};

const values = (headers) => {
    if(!headers.length) {
        return "";
    }

    return headers
        .map(([ key, vals ]) => {
            return `${key}:${Array.isArray(vals) ? vals.map(trim).join(",") : trim(vals)}`;
        })
        .join("\n");
};

const signed = (headers) => {
    return headers
        .map(([ key ]) => key)
        .join(";");
};

const sorted = ({ headers = {} }) => {
    const out = Object.keys(headers).map((key) => [ key.toLowerCase(), headers[key] ]);

    return out.sort(([ keya ], [ keyb ]) => keya.localeCompare(keyb));
};

const multipleSlashesRegex = /\/\/+/g;

var path = ({ service, url }) => {
    // S3 doesn't use normalized paths at all
    if(service === "s3") {
        return url.pathname;
    }
    
    return url.pathname
        .replace(multipleSlashesRegex, "/")
        .split("/")
        .map(encode)
        .join("/");
};

var request = (req) => {
    const { method, body, sortedHeaders } = req;

    // https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
    return [
        method.toUpperCase(),
        
        // Canonical Path
        path(req),
        
        // Canonical Query
        query(req),
        
        // Canonical Headers
        values(sortedHeaders),

        // Extra linebreak
        "",

        // Signed Headers
        signed(sortedHeaders),

        // Hashed payload
        hash(typeof body === "string" ? body.trim() : body),
    ].join("\n");
};

// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
var stringToSign = ({ algorithm, date, region, service }, canonical) => [
        // Signing Function
        algorithm,
        
        // Date Time
        date.long,
        
        // Scope
        `${date.short}/${region}/${service}/aws4_request`,
        
        // Signed canonical request
        hash(canonical),
    ].join("\n");

// https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
var signature = ({ date, secretAccessKey, region, service }, sts) => {
    const kDate = hmac(date.short, `AWS4${secretAccessKey}`);
    const kRegion = hmac(region, kDate);
    const kService = hmac(service, kRegion);
    const kSignature = hmac("aws4_request", kService);

    return hmac(sts, kSignature);
};

const requestRequired = [
    "url",
];

const configRequired = [
    "accessKeyId",
    "region",
    "secretAccessKey",
    "service",
];

// Check for required params
const validate = (source, config) => {
    if(!source) {
        throw new Error(`Missing request object`);
    }

    if(!config) {
        throw new Error(`Missing config object`);
    }

    let missing = requestRequired.filter((field) => !source[field]);

    if(missing.length) {
        throw new Error(`Missing required request fields: ${missing.join(", ")}`);
    }
    
    missing = configRequired.filter((field) => !config[field]);

    if(missing.length) {
        throw new Error(`Missing required config fields: ${missing.join(", ")}`);
    }
};

const authorization = (req, sig) => {
    const {
        algorithm,
        accessKeyId,
        date,
        region,
        service,
        sortedHeaders,
    } = req;

    return [
        `${algorithm} Credential=${accessKeyId}/${date.short}/${region}/${service}/aws4_request`,
        `SignedHeaders=${signed(sortedHeaders)}`,
        `Signature=${sig}`,
    ].join(", ");
};

const dateCleanRegex = /[:\-]|\.\d{3}/g;

const parseDate = ({ headers }) => {
    const datetime = "X-Amz-Date" in headers ?
        headers["X-Amz-Date"] :
        (new Date(headers.Date || Date.now()))
            .toISOString()
            .replace(dateCleanRegex, "");

    return {
        short : datetime.split("T")[0],
        long  : datetime,
    };
};

var index = (source, config) => {
    validate(source, config);

    if(!source.headers) {
        source.headers = {};
    }

    const details = Object.assign(
        Object.create(null),
        {
            method : "GET",
        },
        source,
        config,
        {
            url           : new URL(source.url),
            algorithm     : "AWS4-HMAC-SHA256",
            date          : parseDate(source),
            sortedHeaders : sorted(source),
        }
    );

    const canonical = request(details);
    const sts = stringToSign(details, canonical);
    const sig = signature(details, sts);
    const auth = authorization(details, sig);

    source.headers["X-Amz-Date"] = details.date.long;
    
    if(config.sessionToken) {
        source.headers["X-Amz-Security-Token"] = config.sessionToken;
    }
    
    source.headers.Authorization = auth;

    return source;
};

module.exports = index;
//# sourceMappingURL=aws-sig.cjs.js.map
