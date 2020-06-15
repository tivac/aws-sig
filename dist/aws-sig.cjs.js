/*! aws-sig@2.1.0 !*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sign = require('./sign.cjs.js');
var signedHeaders = require('./signed-headers.cjs.js');
var signedQuery = require('./signed-query.cjs.js');



exports.headerXAmzDate = sign.xamzdate;
exports.signedHeaders = signedHeaders.signedHeaders;
exports.signedQuery = signedQuery.signedQuery;
//# sourceMappingURL=aws-sig.cjs.js.map
