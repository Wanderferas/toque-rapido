self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("toque-rapido").then(cache =>
      cache.addAll([
        "index.html",
        "style.css",
        "game.js"
      ])
    )
  );
});
