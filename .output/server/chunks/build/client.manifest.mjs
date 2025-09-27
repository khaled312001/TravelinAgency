const client_manifest = {
  "middleware/admin.ts": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "BhOLYkc7.js",
    "name": "admin",
    "src": "middleware/admin.ts",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "middleware/locale.ts": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Dbzdxj9W.js",
    "name": "locale",
    "src": "middleware/locale.ts",
    "isDynamicEntry": true
  },
  "middleware/maintenance.ts": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "BDjMS6mE.js",
    "name": "maintenance",
    "src": "middleware/maintenance.ts",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "node_modules/nuxt/dist/app/entry.js": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "9A3s3Dxe.js",
    "name": "entry",
    "src": "node_modules/nuxt/dist/app/entry.js",
    "isEntry": true,
    "dynamicImports": [
      "middleware/admin.ts",
      "middleware/locale.ts",
      "middleware/maintenance.ts"
    ],
    "css": [
      "entry.BFKodIYM.css"
    ],
    "_globalCSS": true
  },
  "entry.BFKodIYM.css": {
    "file": "entry.BFKodIYM.css",
    "resourceType": "style",
    "prefetch": true,
    "preload": true
  },
  "pages/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "hN7Kj5D4.js",
    "name": "index",
    "src": "pages/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  }
};

export { client_manifest as default };
//# sourceMappingURL=client.manifest.mjs.map
