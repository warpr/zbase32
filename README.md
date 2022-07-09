zbase32
=======

This zbase32 library encodes ArrayBuffers to zbase32 encoded strings and back.

If you want to encode strings you'll have to convert them to ArrayBuffers, you
can use the [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
API or a [polyfill](https://www.npmjs.com/package/text-encoding).

Example
-------

```javascript
import zbase32 from 'zbase32';

zbase32.encode(new TextEncoder('utf-8').encode('hello'));
// => 'pb1sa5dx'

new TextDecoder('utf-8').decode(zbase32.decode('pb1sa5dx'));
// => 'hello'
```

License
=======

Copyright 2016  Kuno Woudt <kuno@frob.nl>

This program is free software: you can redistribute it and/or modify
it under the terms of copyleft-next 0.3.1.  See
[copyleft-next-0.3.1.txt](copyleft-next-0.3.1.txt).

