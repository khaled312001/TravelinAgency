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
import 'vue-router';
import 'vue/server-renderer';

const admin = defineNuxtRouteMiddleware(async (to) => {
  console.log("🚀 Admin middleware called for:", to.path);
  if (to.path === "/admin/login") {
    console.log("⏭️ Skipping middleware for login page");
    return;
  }
  {
    console.log("⏭️ Skipping auth check on server-side");
    return;
  }
});

export { admin as default };
//# sourceMappingURL=admin.mjs.map
