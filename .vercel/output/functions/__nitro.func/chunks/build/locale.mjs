const locale = defineEventHandler((event) => {
  const path = event.path || event.req.url || "";
  if (path === "/" || path === "") {
    event.res.setHeader("X-Locale-Override", "true");
  }
});

export { locale as default };
//# sourceMappingURL=locale.mjs.map
