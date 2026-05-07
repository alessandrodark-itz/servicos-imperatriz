const CACHE_NAME = 'servitz-v1'
const STATIC_CACHE = 'servitz-static-v1'

const PRECACHE_URLS = [
  '/',
  '/buscar',
  '/categorias',
  '/como-funciona',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

/* ── Install ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => {})
    )
  )
  self.skipWaiting()
})

/* ── Activate: clear old caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

/* ── Fetch strategy ── */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, API routes, Supabase, Cloudinary, external
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('cloudinary') ||
    url.hostname.includes('unsplash') ||
    url.origin !== self.location.origin
  ) {
    return
  }

  // Cache first: static assets (JS, CSS, fonts, icons)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone()
              caches.open(STATIC_CACHE).then((c) => c.put(request, clone))
            }
            return response
          })
      )
    )
    return
  }

  // Network first: HTML pages — fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
  )
})
