import { d as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const hello_get = defineEventHandler(() => {
  return { message: "Hello from Vercel!" };
});

export { hello_get as default };
//# sourceMappingURL=hello.get.mjs.map
