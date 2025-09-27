// Service Worker Cleanup Script
// Run this in your browser console to manually clear service workers

console.log('🧹 Starting Service Worker Cleanup...');

// Function to unregister all service workers
async function unregisterServiceWorkers() {
    if ('serviceWorker' in navigator) {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            console.log(`Found ${registrations.length} service worker(s)`);
            
            for (let registration of registrations) {
                const success = await registration.unregister();
                console.log(`✅ Unregistered: ${registration.scope} (${success ? 'success' : 'failed'})`);
            }
            
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({type: 'SKIP_WAITING'});
                console.log('📤 Sent skip waiting message to controller');
            }
            
            console.log('✅ All service workers unregistered');
        } catch (error) {
            console.error('❌ Error unregistering service workers:', error);
        }
    } else {
        console.log('ℹ️ Service Worker API not available');
    }
}

// Function to clear all caches
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        console.log(`Found ${cacheNames.length} cache(s)`);
        
        await Promise.all(cacheNames.map(async (cacheName) => {
            const deleted = await caches.delete(cacheName);
            console.log(`✅ Deleted cache: ${cacheName} (${deleted ? 'success' : 'failed'})`);
        }));
        
        console.log('✅ All caches cleared');
    } catch (error) {
        console.error('❌ Error clearing caches:', error);
    }
}

// Function to clear storage
function clearStorage() {
    try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Cleared localStorage and sessionStorage');
    } catch (error) {
        console.error('❌ Error clearing storage:', error);
    }
}

// Main cleanup function
async function performCleanup() {
    console.log('🚀 Starting comprehensive cleanup...');
    
    await unregisterServiceWorkers();
    await clearAllCaches();
    clearStorage();
    
    console.log('🎉 Cleanup complete! You may need to refresh the page.');
    console.log('💡 If issues persist, try a hard refresh (Ctrl+Shift+R)');
}

// Auto-run cleanup
performCleanup();
