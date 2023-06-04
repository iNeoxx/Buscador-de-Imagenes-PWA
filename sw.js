/*para manejar el caching de la PWA  en caso de no tener conexión
  a internet. También si el sitio ya fue visitado cargará los datos
  de la cache para no volver a acceder al sitio.
  Las paginas se guardan como pagina A caché A, página B caché B
*/
const nombreCache = 'apv-v1';
const archivos = [
  '/',          //la página principal o sea 127.0.0.1:5500
  '/index.html',//el archivo principal a renderizar
  '/css/custom.css',
  '/css/tailwind.min.css',
  '/js/app.js',
  '/js/appV.js'
];
self.addEventListener('install', event => {
  console.log('Instalado el service worker');

  event.waitUntil(
    caches.open(nombreCache)
      .then(cache => {
        console.log('Cacheando');
        return cache.addAll(archivos);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Activado el service worker');
});

self.addEventListener('fetch', event => {
  console.log('Fetch...', event);

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Si el recurso está en caché, lo retornamos
          return cachedResponse;
        }

        // Si no está en caché, realizamos una solicitud de red
        return fetch(event.request)
          .then(response => {
            // Clonamos la respuesta, ya que solo se puede leer una vez
            const clonedResponse = response.clone();

            // Almacenamos la respuesta en caché para futuras solicitudes
            caches.open(nombreCache)
              .then(cache => {
                cache.put(event.request, clonedResponse);
              });

            // Retornamos la respuesta original
            return response;
          });
      })
  );
});

