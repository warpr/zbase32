/**
 *   This file is part of wald:find - a library for querying RDF.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function (factory) {
    const imports = [
        'require',
    ];

    if (typeof define === 'function' && define.amd) {
        define (imports, factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory (require);
    } else {
        console.log ('Module system not recognized, please use AMD or CommonJS');
    }
} (function (require) {
    const MNET32 = 'ybndrfg8ejkmcpqxot1uwisza345h769';
    const MNET32Reverse = {};
    for (let i = 0; i < MNET32.length; i++) {
        MNET32Reverse[MNET32[i]] = i;
    }

    function getBit (byte, offset) {
        return (byte >> offset) & 0x01;
    }

    function to5bit (ab) {
        const bytes = new Uint8Array (ab);

        let bitCount = 0;
        let chunks = [];
        let currentChunk = 0;
        for (let i = bytes.length - 1; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {
                currentChunk = (currentChunk >> 1) | (getBit (bytes[i], j) << 4);
                if (++bitCount > 4) {
                    bitCount = 0;
                    chunks.push (currentChunk);
                    currentChunk = 0;
                }
            }
        }

        if (bitCount) {
            chunks.push (currentChunk >> (5 - bitCount));
        }

        chunks.reverse ();
        return chunks;
    }

    function from5bit (ab) {
        const chunks = new Uint8Array (ab);

        let bitCount = 0;
        let bytes = [];
        let currentByte = 0;
        for (let i = chunks.length - 1; i >= 0; i--) {
            for (let j = 0; j < 5; j++) {
                currentByte = (currentByte >> 1) | (getBit (chunks[i], j) << 7);
                if (++bitCount > 7) {
                    bitCount = 0;
                    bytes.push (currentByte);
                    currentByte = 0;
                }
            }
        }

        bytes.reverse ();
        return new Uint8Array (bytes);
    }

    function decode (x) {
        return from5bit (x.split ('').map ((chr) => MNET32Reverse[chr]));
    }

    function encode (x) {
        return to5bit (x).map ((value) => MNET32[value]).join ('');
    }

    return {
        decode: decode,
        encode: encode,
        from5bit: from5bit,
        to5bit: to5bit,
    };
}));
