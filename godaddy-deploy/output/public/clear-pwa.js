// Complete PWA cleanup script
// Run this in browser console to completely remove PWA remnants

console.log('🧹 Starting complete PWA cleanup...');

// 1. Unregister all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log(`Found ${registrations.length} service workers to unregister`);
    for(let registration of registrations) {
      registration.unregister().then(function(boolean) {
        console.log('✅ Service worker unregistered:', boolean);
      });
    }
  });
}

// 2. Clear all caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    console.log(`Found ${cacheNames.length} caches to clear`);
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log('🗑️ Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log('✅ All caches cleared');
  });
}

// 3. Clear localStorage
try {
  localStorage.clear();
  console.log('✅ localStorage cleared');
} catch (e) {
  console.log('❌ Error clearing localStorage:', e);
}

// 4. Clear sessionStorage
try {
  sessionStorage.clear();
  console.log('✅ sessionStorage cleared');
} catch (e) {
  console.log('❌ Error clearing sessionStorage:', e);
}

// 5. Clear IndexedDB
if ('indexedDB' in window) {
  // This is a simplified approach - in production you might want to be more specific
  try {
    indexedDB.deleteDatabase('workbox-precache-v2');
    indexedDB.deleteDatabase('workbox-runtime-cache');
    console.log('✅ IndexedDB cleared');
  } catch (e) {
    console.log('❌ Error clearing IndexedDB:', e);
  }
}

// 6. Remove PWA install prompt
if ('beforeinstallprompt' in window) {
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    console.log('✅ PWA install prompt prevented');
  });
}

// 7. Force reload after cleanup
setTimeout(function() {
  console.log('🔄 Reloading page to complete cleanup...');
  window.location.reload(true);
}, 2000);

console.log('🎉 PWA cleanup completed! Page will reload in 2 seconds.');

