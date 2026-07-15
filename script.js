(function () {
  var canvas = document.getElementById('network-bg');
  if (!canvas) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ctx = canvas.getContext('2d');
  var width, height, nodes;
  var NODE_COUNT = 60;
  var LINK_DIST = 190;
  var NAVY = '43, 95, 224';
  var NAVY_BRIGHT = '92, 135, 255';
  var AMBER = '255, 138, 76';
  var tick = 0;
  var sparkLink = null;
  var sparkLife = 0;

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
    tick++;
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    var closeLinks = [];

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINK_DIST) {
          var alpha = (1 - dist / LINK_DIST) * 0.55;
          ctx.strokeStyle = 'rgba(' + NAVY + ', ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          closeLinks.push([i, j]);
        }
      }
    }

    /* Occasionally flare one active connection brighter, echoing a link
       forming, then let it fade. This is the "fragmented systems syncing
       up" motif from the brief. */
    if (sparkLink === null && closeLinks.length && tick % 40 === 0) {
      sparkLink = closeLinks[Math.floor(Math.random() * closeLinks.length)];
      sparkLife = 30;
    }

    if (sparkLink !== null) {
      var a = nodes[sparkLink[0]], b = nodes[sparkLink[1]];
      var flareAlpha = (sparkLife / 30) * 0.9;
      ctx.strokeStyle = 'rgba(' + NAVY_BRIGHT + ', ' + flareAlpha + ')';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      sparkLife--;
      if (sparkLife <= 0) sparkLink = null;
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pulse = 0.75 + 0.25 * Math.sin(tick * 0.02 + i);
      var radius = (n.warm ? 2.4 : 1.9) * pulse;
      var color = n.warm ? AMBER : NAVY_BRIGHT;

      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(' + color + ', 0.8)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ', ' + (0.7 * pulse + 0.2) + ')';
      ctx.fill();
      ctx.shadowBlur = 0;
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
