console.clear();
console.log('Successful registered service worker.');
importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@6/build/workbox-sw.min.js');

const { core, precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;
const { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } = strategies;
const { ExpirationPlugin } = expiration;
const { CacheableResponsePlugin } = cacheableResponse;

const cacheSuffixVersion = '-210713';
const maxEntries = 100;

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key.includes('disqus-cdn-cache')) return caches.delete(key);
                if (key.includes('disqus-img-cache')) return caches.delete(key);
                if (!key.includes(cacheSuffixVersion)) return caches.delete(key);
            }));
        })
    );
});

core.setCacheNameDetails({
    prefix: 'oiercraft',
    suffix: cacheSuffixVersion
});

precaching.precacheAndRoute(
    [],
);

// math Google Fonts

routing.registerRoute(
    /^https:\/\/fonts\.(?:googleapis|gstatic)\.(?:com|cn)/,
    new CacheFirst({
        cacheName: 'google-fonts' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

// math CDN

routing.registerRoute(
    /^https:\/\/(?:fonts|cdnjs|gstatic|themes|ajax|gravatar)\.loli\.net/,
    new CacheFirst({
        cacheName: 'cdn-loli' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /^https:\/\/cdnjs\.cloudflare\.com/,
    new CacheFirst({
        cacheName: 'cdn-cdnjs' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /^https:\/\/cdn\.bootcdn\.net/,
    new CacheFirst({
        cacheName: 'cdn-bootcdn' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /^https:\/\/cdn\.bootcss\.com/,
    new CacheFirst({
        cacheName: 'cdn-bootcss' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /^https:\/\/cdn\.jsdelivr\.com/,
    new CacheFirst({
        cacheName: 'cdn-jsdelivr' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

// match images

routing.registerRoute(
    /.*(?:i|vip[0-9])\.loli\.(?:io|net)/,
    new CacheFirst({
        cacheName: 'img-cache-loli' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
    new CacheFirst({
        cacheName: 'img-cache' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

// match js / css

routing.registerRoute(
    /.*\.(css|js)/,
    new CacheFirst({
        cacheName: 'js-css-cache' + cacheSuffixVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit'
        },
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

routing.registerRoute(
    '/sw.js',
    new StaleWhileRevalidate()
);

routing.setDefaultHandler(
    new NetworkFirst({
        networkTimeoutSeconds: 3
    })
);