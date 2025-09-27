import { d as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'vue/server-renderer';

const maintenance = defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith("/admin")) return;
  if (to.path === "/maintenance") return;
  return;
});

export { maintenance as default };
//# sourceMappingURL=maintenance.mjs.map
