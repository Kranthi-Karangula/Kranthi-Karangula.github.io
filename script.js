(function () {
  var canvas = document.getElementById('network-bg');
  if (!canvas) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ctx = canvas.getContext('2d');
  var width, height, nodes;
  var NODE_COUNT = 46;
  var LINK_DIST = 150;
  var NAVY = '43, 95, 224';
  var AMBER = '255, 138, 76';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        warm: Math.random() < 0.12
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINK_DIST) {
          var alpha = (1 - dist / LINK_DIST) * 0.35;
          ctx.strokeStyle = 'rgba(' + NAVY + ', ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.warm ? 2.2 : 1.6, 0, Math.PI * 2);
      ctx.fillStyle = n.warm ? 'rgba(' + AMBER + ', 0.6)' : 'rgba(' + NAVY + ', 0.7)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  requestAnimationFrame(step);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      makeNodes();
    }, 200);
  });
})();
