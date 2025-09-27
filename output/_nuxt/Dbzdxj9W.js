const a=defineEventHandler(e=>{const r=e.path||e.req.url||"";(r==="/"||r==="")&&e.res.setHeader("X-Locale-Override","true")});export{a as default};
