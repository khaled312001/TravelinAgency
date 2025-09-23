 export default defineEventHandler((event) => {
       // Get the URL path
       const path = event.path || event.req.url || ''
       
       // If we're on the root path and there's a cookie or localStorage preference,
       // we want to respect that instead of redirecting based on browser language
       if (path === '/' || path === '') {
         // Set a header to indicate we want to skip browser language detection
         event.res.setHeader('X-Locale-Override', 'true')
       }
     })