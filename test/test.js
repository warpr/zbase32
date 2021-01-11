/**
 *   This file is part of zbase32 - a z-base-32 encoding/decoding library.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function (factory) {
    const imports = ['require', 'chai', 'text-encoding', 'jsverify', '../index'];

    if (typeof define === 'function' && define.amd) {
        define(imports, factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        console.log('Module system not recognized, please use AMD or CommonJS');
    }
})(function (require) {
    const assert = require('chai').assert;
    const zbase32 = require('../index');
    const TextDecoder = require('text-encoding').TextDecoder;
    const TextEncoder = require('text-encoding').TextEncoder;
    const jsverify = require('jsverify');

    function toUTF8(str) {
        return new TextEncoder('utf-8').encode(str);
    }

    function fromUTF8(arrayBuffer) {
        return new TextDecoder('utf-8').decode(arrayBuffer);
    }

    suite('zbase32', function () {
        test('to5bit', function () {
            //  H 0x48   e 0x65   l 0x6c   l 0x6c   o 0x6f
            // 01001000 01100101 01101100 01101100 01101111
            //
            //  0x09  0x01  0x12  0x16  0x18  0x1b  0x03  0x0f
            // 01001 00001 10010 10110 11000 11011 00011 01111
            let expected = [0x09, 0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual(zbase32.to5bit(toUTF8('Hello')), expected);

            expected = [0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual(zbase32.to5bit(toUTF8('ello')), expected);

            expected = [0x06, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual(zbase32.to5bit(toUTF8('llo')), expected);

            expected = [0x0, 0x1b, 0x03, 0x0f];
            assert.deepEqual(zbase32.to5bit(toUTF8('lo')), expected);

            expected = [0x03, 0x0f];
            assert.deepEqual(zbase32.to5bit(toUTF8('o')), expected);
        });

        test('from5bit', function () {
            let input = [0x09, 0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal(fromUTF8(zbase32.from5bit(input)), 'Hello');

            input = [0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal(fromUTF8(zbase32.from5bit(input)), 'ello');

            input = [0x06, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal(fromUTF8(zbase32.from5bit(input)), 'llo');

            input = [0x0, 0x1b, 0x03, 0x0f];
            assert.equal(fromUTF8(zbase32.from5bit(input)), 'lo');

            input = [0x03, 0x0f];
            assert.equal(fromUTF8(zbase32.from5bit(input)), 'o');
        });

        test('encoding', function () {
            assert.equal(zbase32.encode(toUTF8('hello')), 'pb1sa5dx');
        });

        test('decoding', function () {
            assert.equal(fromUTF8(zbase32.decode('pb1sa5dx')), 'hello');
        });

        test('roundtrip', function () {
            const roundTrip = jsverify.forall('string', (testString) => {
                const encoded = zbase32.encode(toUTF8(testString));
                return testString === fromUTF8(zbase32.decode(encoded));
            });

            // FIXME: size is the max size of each generated random value,
            // it doesn't increase the test string size significantly.
            // See also:
            // - https://github.com/jsverify/jsverify/issues/167
            // - https://github.com/jsverify/jsverify/issues/169
            jsverify.assert(roundTrip, { size: Number.MAX_SAFE_INTEGER });
        });

        test('valid zbase32', function () {
            const valid = jsverify.forall('string', (testString) => {
                const encoded = zbase32.encode(toUTF8(testString));
                return /^[13456789abcdefghijkmnopqrstuwxyz]*$/.test(encoded);
            });

            jsverify.assert(valid, { size: Number.MAX_SAFE_INTEGER });
        });

        test('fromNumber', function () {
            // 11 00000 11111 00000 11111 00000 11111
            const expected = [1, 0, 0x1f, 0, 0x1f, 0, 0x1f];
            const buf = zbase32.fromNumber(0x41f07c1f);
            assert.deepEqual(expected, [].slice.call(buf));
        });

        test('toNumber', function () {
            const num = zbase32.toNumber([1, 0, 0x1f, 0, 0x1f, 0, 0x1f]);
            assert.equal(0x41f07c1f, num);
        });

        test('encode number', function () {
            assert.equal(zbase32.encode32bitNumber(0), 'yyyyyyyyyyyy');
            assert.equal(zbase32.encode32bitNumber(23), 'yyyyyyyyyyyz');
            assert.equal(zbase32.encode32bitNumber(0x7fffffff), 'yye9dhxt68a9');
            assert.equal(zbase32.encode32bitNumber(0xffff), 'yyyyyyyt68a9');
        });

        test('decode number', function () {
            assert.equal(zbase32.decode32bitNumber('yyyyyyyyyyyy'), 0);
            assert.equal(zbase32.decode32bitNumber('yyyyyyyyyyyz'), 23);
            assert.equal(zbase32.decode32bitNumber('yye9dhxt68a9'), 0x7fffffff);
            assert.equal(zbase32.decode32bitNumber('yyyyyyyt68a9'), 0xffff);
        });

        test('number roundtrip', function () {
            const roundTrip = jsverify.forall('string', (testString) => {
                const encoded = zbase32.encode(toUTF8(testString));
                return testString === fromUTF8(zbase32.decode(encoded));
            });

            // FIXME: size is the max size of each generated random value,
            // it doesn't increase the test string size significantly.
            // See also:
            // - https://github.com/jsverify/jsverify/issues/167
            // - https://github.com/jsverify/jsverify/issues/169
            jsverify.assert(roundTrip, { size: Number.MAX_SAFE_INTEGER });
        });
    });
});

// -*- mode: javascript-mode -*-
