(function () {
  var canvas = document.getElementById('network-bg');
  if (!canvas) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ctx = canvas.getContext('2d');
  var width, height, layers;
  var NAVY = '92, 135, 255';
  var AMBER = '255, 138, 76';
  var LINK_DIST = 150;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeLayers() {
    layers = [];
    var depths = [
      { count: 34, speed: 0.05, size: 1, alpha: 0.28, color: NAVY },
      { count: 22, speed: 0.11, size: 1.7, alpha: 0.5, color: NAVY },
      { count: 10, speed: 0.2, size: 2.4, alpha: 0.75, color: AMBER }
    ];
    depths.forEach(function (d) {
      var pts = [];
      for (var i = 0; i < d.count; i++) {
        pts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * d.speed,
          vy: (Math.random() - 0.5) * d.speed
        });
      }
      layers.push({ pts: pts, size: d.size, alpha: d.alpha, color: d.color });
    });
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    layers.forEach(function (layer) {
      layer.pts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (var i = 0; i < layer.pts.length; i++) {
        for (var j = i + 1; j < layer.pts.length; j++) {
          var a = layer.pts[i], b = layer.pts[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            var lineAlpha = (1 - dist / LINK_DIST) * layer.alpha * 0.5;
            ctx.strokeStyle = 'rgba(' + layer.color + ', ' + lineAlpha + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      layer.pts.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, layer.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + layer.color + ', ' + layer.alpha + ')';
        ctx.shadowBlur = 7;
        ctx.shadowColor = 'rgba(' + layer.color + ', 0.75)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });

    requestAnimationFrame(step);
  }

  resize();
  makeLayers();
  requestAnimationFrame(step);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      makeLayers();
    }, 200);
  });
})();
