/* Abel Haile — portfolio interactions */
(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* footer year */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- header, scrollspy & back-to-top ---------- */
  const header = $('.site-header');
  const toTop = $('#toTop');
  const sections = $$('main section[id]');
  const navA = $$('.nav-links a');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 24);
    toTop.classList.toggle('show', scrollY > 640);
    let current = 'home';
    sections.forEach(sec => { if (scrollY >= sec.offsetTop - 220) current = sec.id; });
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const closeMenu = () => { document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navA.forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- about: interactive code editor ---------- */
  const editor = $('.editor');
  if (editor && !reduceMotion) {
    const edLines = $$('.ed-code', editor);
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    /* snapshot the syntax-coloured markup once, then rebuild from it on every replay */
    const edSrc = edLines.map(el => [...el.childNodes]
      .map(n => ({ cls: n.nodeType === 1 ? n.className : '', txt: n.textContent }))
      .filter(seg => seg.txt.length));
    const edTotals = edSrc.map(segs => segs.reduce((n, seg) => n + seg.txt.length, 0));
    const edLast = edLines.length - 1;
    let edTimers = [], edRunning = false;
    const edRender = (i, upto, caret) => {
      let html = '', done = 0;
      for (const seg of edSrc[i]) {
        if (done >= upto) break;
        const txt = esc(seg.txt.slice(0, upto - done));
        html += seg.cls ? `<span class="${seg.cls}">${txt}</span>` : txt;
        done += seg.txt.length;
      }
      edLines[i].innerHTML = html + (caret ? '<span class="ed-caret"></span>' : '');
    };
    const edType = () => {
      edTimers.forEach(clearTimeout); edTimers = [];
      edRunning = true;
      let i = 0, c = 0;
      const step = () => {
        /* done — leave a caret blinking on the last line */
        if (i > edLast) { edRunning = false; edRender(edLast, edTotals[edLast], true); return; }
        edRender(i, c, true);
        if (c < edTotals[i]) { c++; edTimers.push(setTimeout(step, 26)); return; }
        edRender(i, edTotals[i], false);
        i++; c = 0;
        edTimers.push(setTimeout(step, 230));
      };
      step();
    };
    editor.classList.add('js-ready');
    edLines.forEach((el, i) => edRender(i, 0, false));
    $('.editor-replay', editor).addEventListener('click', edType);
    /* re-type each time the editor scrolls back into view */
    new IntersectionObserver(entries => {
      if (!edRunning && entries.some(e => e.isIntersecting)) edType();
    }, { threshold: .4 }).observe(editor);
  }

  /* ---------- typed hero role ---------- */
  const roles = ['Web Developer', 'Frontend Developer', 'Full-Stack Developer', 'IT Systems Engineer'];
  const typed = $('#typedRole');
  if (typed && !reduceMotion) {
    let ri = 0, ci = roles[0].length, deleting = true;
    setInterval(() => {
      const word = roles[ri];
      if (deleting) {
        typed.textContent = word.slice(0, Math.max(0, --ci));
        if (ci <= 0) { deleting = false; ri = (ri + 1) % roles.length; }
      } else {
        const next = roles[ri];
        typed.textContent = next.slice(0, ++ci);
        if (ci >= next.length) { deleting = true; ci = next.length + 10; }
      }
    }, 85);
  }

  /* ---------- tilt cards + magnetic elements ---------- */
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `translate(${(x * 8).toFixed(1)}px, ${(y * 8).toFixed(1)}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
/* ---------- contact form ---------- */
  const form = $('#contactForm'), formMsg = $('#formMsg'), toast = $('#toast');
  let toastTimer;
  const showToast = text => {
    $('#toastText').textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  };
  const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const mark = (el, bad) => el.classList.toggle('bad', bad);
  const inputs = [$('#cfName'), $('#cfEmail'), $('#cfMsg')];
  inputs.forEach(el => el.addEventListener('input', () => el.classList.remove('bad')));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#cfName').value.trim();
    const email = $('#cfEmail').value.trim();
    const message = $('#cfMsg').value.trim();
    mark($('#cfName'), !name);
    mark($('#cfEmail'), !emailOK(email));
    mark($('#cfMsg'), !message);
    if (!name || !emailOK(email) || !message) {
      formMsg.textContent = 'Please add your name, a valid email and a short message.';
      formMsg.className = 'form-msg err';
      return;
    }
    formMsg.textContent = `Thanks, ${name}! Opening your email app…`;
    formMsg.className = 'form-msg ok';
    showToast('Message ready — thanks for reaching out!');
    const href = `mailto:Abelzzz125@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')')}`;
    setTimeout(() => { location.href = href; form.reset(); }, 500);
  });

  /* ---------- live GitHub repo count ---------- */
  (async () => {
    const badge = $('.live-badge');
    const el = $('#repoCount');
    try {
      const res = await fetch('https://api.github.com/users/Abel13MK');
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      if (data.public_repos != null) { el.textContent = data.public_repos; return; }
      throw new Error('empty');
    } catch (err) {
      badge.style.display = 'none';
    }
  })();

  /* ---------- command palette ---------- */
  const cmd = $('#commandPalette'), cmdInput = $('#commandInput');
  const openCmd = () => { cmd.classList.add('open'); cmd.setAttribute('aria-hidden', 'false'); setTimeout(() => cmdInput.focus(), 30); };
  const closeCmd = () => { cmd.classList.remove('open'); cmd.setAttribute('aria-hidden', 'true'); cmdInput.value = ''; filterCmd(''); };
  $('#commandHint').addEventListener('click', openCmd);
  $('[data-command-close]').addEventListener('click', closeCmd);
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmd.classList.contains('open') ? closeCmd() : openCmd();
    }
    if (e.key === 'Escape') { closeCmd(); closeMenu(); }
  });
  $$('.command-items button').forEach(b => b.addEventListener('click', () => {
    closeCmd();
    document.querySelector(b.dataset.target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  cmdInput.addEventListener('input', () => filterCmd(cmdInput.value));
  function filterCmd(q) {
    const query = q.trim().toLowerCase();
    $$('.command-items button').forEach(b => { b.hidden = !b.textContent.toLowerCase().includes(query); });
  }

  /* ---------- back to top ---------- */
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- ambient particles ---------- */
  if (!reduceMotion) {
    const canvas = $('#particle-canvas'), ctx = canvas.getContext('2d');
    let w, h, dpr, pts = [];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.min(64, Math.floor(w / 22)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12,
        r: Math.random() * 1.5 + .4
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(139,124,246,.35)';
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize', resize); draw();
  }
})();