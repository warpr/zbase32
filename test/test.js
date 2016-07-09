/**
 *   This file is part of zbase32 - a z-base-32 encoding/decoding library.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function (factory) {
    const imports = [
        'require',
        'chai',
        'text-encoding',
        '../index',
    ];

    if (typeof define === 'function' && define.amd) {
        define (imports, factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory (require);
    } else {
        console.log ('Module system not recognized, please use AMD or CommonJS');
    }
} (function (require) {
    const assert = require ('chai').assert;
    const zbase32 = require ('../index');
    const TextDecoder = require ('text-encoding').TextDecoder;
    const TextEncoder = require ('text-encoding').TextEncoder;

    function toUTF8 (str) {
        return new TextEncoder ('utf-8').encode (str);
    }

    function fromUTF8 (arrayBuffer) {
        return new TextDecoder ('utf-8').decode (arrayBuffer);
    }

    suite ('zbase32', function () {
        test ('to5bit', function () {
            //  H 0x48   e 0x65   l 0x6c   l 0x6c   o 0x6f
            // 01001000 01100101 01101100 01101100 01101111
            //
            //  0x09  0x01  0x12  0x16  0x18  0x1b  0x03  0x0f
            // 01001 00001 10010 10110 11000 11011 00011 01111
            let expected = [0x09, 0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual (zbase32.to5bit (toUTF8 ('Hello')), expected);

            expected = [0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual (zbase32.to5bit (toUTF8 ('ello')), expected);

            expected = [0x06, 0x18, 0x1b, 0x03, 0x0f];
            assert.deepEqual (zbase32.to5bit (toUTF8 ('llo')), expected);

            expected = [0x0, 0x1b, 0x03, 0x0f];
            assert.deepEqual (zbase32.to5bit (toUTF8 ('lo')), expected);

            expected = [0x03, 0x0f];
            assert.deepEqual (zbase32.to5bit (toUTF8 ('o')), expected);
        });

        test ('from5bit', function () {
            let input = [0x09, 0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal (fromUTF8 (zbase32.from5bit (input)), 'Hello');

            input = [0x01, 0x12, 0x16, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal (fromUTF8 (zbase32.from5bit (input)), 'ello');

            input = [0x06, 0x18, 0x1b, 0x03, 0x0f];
            assert.equal (fromUTF8 (zbase32.from5bit (input)), 'llo');

            input = [0x0, 0x1b, 0x03, 0x0f];
            assert.equal (fromUTF8 (zbase32.from5bit (input)), 'lo');

            input = [0x03, 0x0f];
            assert.equal (fromUTF8 (zbase32.from5bit (input)), 'o');
        });

        test ('encoding', function () {
            assert.equal (zbase32.encode (toUTF8 ('hello')), 'pb1sa5dx');
        });

        test ('decoding', function () {
            assert.equal (fromUTF8 (zbase32.decode ('pb1sa5dx')), 'hello');
        });
    });
}));

// -*- mode: javascript-mode -*-
