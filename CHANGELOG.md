# [2.1.0](https://github.com/tivac/aws-sig/compare/v2.0.1...v2.1.0) (2020-06-15)


### Features

* expose X-Amz-Date fn ([#71](https://github.com/tivac/aws-sig/issues/71)) ([644b41a](https://github.com/tivac/aws-sig/commit/644b41a627fba0ad2438886c10ed3fc1583c4d78))



## [2.0.1](https://github.com/tivac/aws-sig/compare/v2.0.0...v2.0.1) (2020-03-24)


### Bug Fixes

* corrected module path ([2421f26](https://github.com/tivac/aws-sig/commit/2421f26d96f84f5d90e915ed87cc1e0bc0716714))



# [2.0.0](https://github.com/tivac/aws-sig/compare/v1.3.0...v2.0.0) (2020-03-24)


### Features

* query signature support ([#52](https://github.com/tivac/aws-sig/issues/52)) ([750d228](https://github.com/tivac/aws-sig/commit/750d22879ad2fe770138abc21fb2e11a66789cc5))


### BREAKING CHANGES

* No more default export, now two named exports. `signedHeaders` and `signedQuery`, pick the type of request object you want to get back.



# [1.3.0](https://github.com/tivac/aws-sig/compare/v1.2.2...v1.3.0) (2019-08-19)


### Features

* double-encoding paths correctly ([#18](https://github.com/tivac/aws-sig/issues/18)) ([edc61f4](https://github.com/tivac/aws-sig/commit/edc61f4ba895bc33c845848b58368c72868c3932))



## [1.2.2](https://github.com/tivac/aws-sig/compare/v1.2.1...v1.2.2) (2018-08-02)



## [1.2.1](https://github.com/tivac/aws-sig/compare/v1.1.4...v1.2.1) (2018-08-02)


### Bug Fixes

* change test code replacement approach ([77a5155](https://github.com/tivac/aws-sig/commit/77a515585a33e65108d5408fa9e5e5eedf42ad7e))


### Features

* throw errors on incorrect params ([1df5fc6](https://github.com/tivac/aws-sig/commit/1df5fc698a28cd800921aa185204dff173c78611))



## [1.1.4](https://github.com/tivac/aws-sig/compare/v1.1.3...v1.1.4) (2018-02-16)



## [1.1.3](https://github.com/tivac/aws-sig/compare/v1.1.2...v1.1.3) (2018-02-15)



## [1.1.2](https://github.com/tivac/aws-sig/compare/v1.1.1...v1.1.2) (2018-02-15)


### Bug Fixes

* more metadata & re-organized ([5541579](https://github.com/tivac/aws-sig/commit/55415799ee0e932af88dac558f62abd7d726b68d))



## [1.1.1](https://github.com/tivac/aws-sig/compare/v1.1.0...v1.1.1) (2018-02-15)


### Bug Fixes

* always build UMD in production mode ([98b4421](https://github.com/tivac/aws-sig/commit/98b44217c8a2ad96d882986979baf9d8fef77092))



# [1.1.0](https://github.com/tivac/aws-sig/compare/v1.0.1...v1.1.0) (2018-02-15)


### Bug Fixes

* don't assume that X-Amz-Date is [] ([20b8ef8](https://github.com/tivac/aws-sig/commit/20b8ef8a37a35c59ad966795089a015a58d050e1))
* ensure that headers are alphabetized ([e966572](https://github.com/tivac/aws-sig/commit/e966572d674aae2c36ba6a03c963a9bfa1847995))
* sort headers, but only once ([75b341b](https://github.com/tivac/aws-sig/commit/75b341b2565769ae7e38ae5fa21e8c01cfe95ccf))


### Features

* assume GET ([b981655](https://github.com/tivac/aws-sig/commit/b9816552b9e524a41a9768572ad611663864f1a3))



## [1.0.1](https://github.com/tivac/aws-sig/compare/v1.0.0...v1.0.1) (2018-02-14)



# [1.0.0](https://github.com/tivac/aws-sig/compare/dfa8886e59ad5ee1c045090907e8cb6df7c004a0...v1.0.0) (2018-02-14)


### Bug Fixes

* re-enable session token header ([06c37f0](https://github.com/tivac/aws-sig/commit/06c37f059b470292dca5ddc2ad10ae67146beb2b))


### Features

* create esm version of crypto-js funcs ([dfa8886](https://github.com/tivac/aws-sig/commit/dfa8886e59ad5ee1c045090907e8cb6df7c004a0))



