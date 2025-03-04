# zbase32

This zbase32 library encodes ArrayBuffers to zbase32 encoded strings and back.

If you want to encode strings you'll have to convert them to ArrayBuffers, you
can use the [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
API.

## Example

```javascript
import zbase32 from 'zbase32';

zbase32.encode(new TextEncoder('utf-8').encode('hello'));
// => 'pb1sa5dx'

new TextDecoder('utf-8').decode(zbase32.decode('pb1sa5dx'));
// => 'hello'
```

## Provenance

Some notes on releasing a new version, as I do this infrequently enough that I forget :)

1. Go to NPM -> user menu -> access tokens
2. Create a granular access token for GitHub actions, with read/write access to zbase32
3. Go to https://github.com/warpr/zbase32/settings -> Secrets and variables
4. Update the NPM_TOKEN environment variable to the newly created token
5. Push the version you want to publish to GitHub
6. At https://github.com/warpr/zbase32/releases create a new release
7. The publish action should now run automatically, which should publish the new version to npm and log the provenance info

# License

Copyright 2023 Kuno Woudt <kuno@frob.nl>

This program is free software: you can redistribute it and/or modify
it under the terms of copyleft-next 0.3.1. See
[copyleft-next-0.3.1.txt](copyleft-next-0.3.1.txt).
