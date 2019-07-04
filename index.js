/**
 *   This file is part of zbase32.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function(factory) {
    const imports = ['require'];

    if (typeof define === 'function' && define.amd) {
        define(imports, factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require);
    } else {
        console.log('Module system not recognized, please use AMD or CommonJS');
    }
})(function(require) {
    const MNET32 = 'ybndrfg8ejkmcpqxot1uwisza345h769';
    const MNET32Reverse = {};
    for (let i = 0; i < MNET32.length; i++) {
        MNET32Reverse[MNET32[i]] = i;
    }

    function IntegerTooLargeException(message) {
        this.message = message;
        this.name = 'IntegerTooLargeException';
    }

    function getBit(byte, offset) {
        return (byte >> offset) & 0x01;
    }

    function to5bit(ab) {
        const bytes = new Uint8Array(ab);

        let bitCount = 0;
        let chunks = [];
        let currentChunk = 0;
        for (let i = bytes.length - 1; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {
                currentChunk = (currentChunk >> 1) | (getBit(bytes[i], j) << 4);
                if (++bitCount > 4) {
                    bitCount = 0;
                    chunks.push(currentChunk);
                    currentChunk = 0;
                }
            }
        }

        if (bitCount) {
            chunks.push(currentChunk >> (5 - bitCount));
        }

        chunks.reverse();
        return chunks;
    }

    function from5bit(ab) {
        const chunks = new Uint8Array(ab);

        let bitCount = 0;
        let bytes = [];
        let currentByte = 0;
        for (let i = chunks.length - 1; i >= 0; i--) {
            for (let j = 0; j < 5; j++) {
                currentByte = (currentByte >> 1) | (getBit(chunks[i], j) << 7);
                if (++bitCount > 7) {
                    bitCount = 0;
                    bytes.push(currentByte);
                    currentByte = 0;
                }
            }
        }

        bytes.reverse();
        return new Uint8Array(bytes);
    }

    function toNumber(ab) {
        return (
            (ab[0] << 30) |
            (ab[1] << 25) |
            (ab[2] << 20) |
            (ab[3] << 15) |
            (ab[4] << 10) |
            (ab[5] << 5) |
            ab[6]
        );
    }

    function fromNumber(num) {
        if (num < 0 || num > 0x7fffffff) {
            throw new IntegerTooLargeException('fromNumber expects a 32-bit signed integer');
        }

        // Although javascript Numbers can safely represent integers up to (2^53)-1, the
        // bitwise operators operate on them as 32-bit signed integers.
        // FIXME: look for a popular bigint library which can easily convert big integers as
        // ArrayBuffers.
        return new Uint8Array([
            (num >>> 30) & 0x03,
            (num >>> 25) & 0x1f,
            (num >>> 20) & 0x1f,
            (num >>> 15) & 0x1f,
            (num >>> 10) & 0x1f,
            (num >>> 5) & 0x1f,
            (num >>> 0) & 0x1f,
        ]);
    }

    function decode32bitNumber(str) {
        return toNumber(decode(str));
    }

    function encode32bitNumber(int) {
        return encode(fromNumber(int));
    }

    function decode(x) {
        return from5bit(x.split('').map(chr => MNET32Reverse[chr]));
    }

    function encode(x) {
        return to5bit(x)
            .map(value => MNET32[value])
            .join('');
    }

    return {
        decode: decode,
        encode: encode,
        from5bit: from5bit,
        to5bit: to5bit,
        fromNumber: fromNumber,
        toNumber: toNumber,
        decode32bitNumber: decode32bitNumber,
        encode32bitNumber: encode32bitNumber,
    };
});
