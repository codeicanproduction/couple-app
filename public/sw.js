const CACHE_NAME = 'coupleapp-v2'
const APP_SHELL_URLS = [
  '/',
  '/app/home',
  '/app/finance',
  '/app/partner',
  '/app/calendar',
  '/app/profile',
]

// ===== Install =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS))
  )
  self.skipWaiting()
})

// ===== Activate =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ===== Fetch — Tiered Caching Strategy =====
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  // 1. Static assets → Cache-first (immutable hashed files)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // 2. Icons & manifest → Cache-first with background update
  if (url.pathname.startsWith('/icons/') || url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        return cached || fetchPromise
      })
    )
    return
  }

  // 3. API routes → Network-first (data must be fresh)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)))
    return
  }

  // 4. Navigation (HTML pages) → Stale-while-revalidate
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
    return
  }

  // 5. Everything else → Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})

// ===== Push Notifications =====
self.addEventListener('push', (event) => {
  let data = { title: 'CoupleApp', body: 'Ada yang baru!', url: '/app/home' }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [{ action: 'open', title: 'Buka' }],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// ===== Notification Click =====
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/app/home'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})
