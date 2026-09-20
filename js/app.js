/* Six at Seven — nav, reveals, hero lines, marquee clone, quiz */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── nav ── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navtoggle');
  var links = document.getElementById('navlinks');

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── scroll reveals (fixed-position-free; observes existing nodes only) ── */
  var els = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = Array.prototype.slice.call(el.parentElement.children).filter(function (n) {
          return n.hasAttribute && n.hasAttribute('data-reveal');
        });
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // safety net: anything still hidden after load gets shown
    window.addEventListener('load', function () {
      setTimeout(function () {
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && !el.classList.contains('in')) el.classList.add('in');
        });
      }, 400);
    });
  }

  /* ── hero lines ── */
  var lines = document.querySelectorAll('h1 .ln > span');
  lines.forEach(function (s, i) {
    if (reduced) return;
    s.style.transform = 'translateY(105%)';
    s.style.opacity = '0';
    requestAnimationFrame(function () {
      setTimeout(function () {
        s.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .9s ease';
        s.style.transform = 'none';
        s.style.opacity = '1';
      }, 120 + i * 130);
    });
  });

  /* ── marquee: duplicate the list so the loop is seamless ── */
  var mq = document.getElementById('mq1');
  if (mq && !reduced) mq.parentElement.appendChild(mq.cloneNode(true));

  /* ── quiz ── */
  var QUESTIONS = [
    { q: 'What are you building right now?', o: ['A product with paying users', 'A product, no revenue yet', 'A service business I want to productise', 'Still deciding — but I have quit the job'] },
    { q: 'How old is it?', o: ['Under six months', 'Six months to two years', 'Two to five years', 'Over five years'] },
    { q: 'Where does the money come from?', o: ['Customers only', 'Angels or friends and family', 'An institutional round', 'Nothing yet, savings'] },
    { q: 'At a table of six, you are the one who…', o: ['Asks the second question', 'Says the uncomfortable thing', 'Listens, then lands one line', 'Keeps it moving when it stalls'] },
    { q: 'Someone tells you your plan is wrong. You…', o: ['Ask them to argue it harder', 'Defend it, then think about it at 2am', 'Agree too fast, regret it later', 'Change course on the spot'] },
    { q: 'What would you rather not talk about?', o: ['Revenue', 'My co-founder', 'How long the runway is', 'Nothing — ask me anything'] },
    { q: 'Which dinner would you cancel plans for?', o: ['People solving my exact problem', 'People nothing like me', 'One person far ahead of me', 'No idea, surprise me'] },
    { q: 'Where should we seat you?', o: ['South Delhi', 'Gurgaon', 'Noida', 'Somewhere else — tell me when you open'] }
  ];

  var form = document.getElementById('quizForm');
  var body = document.getElementById('quizBody');
  var fill = document.getElementById('quizFill');
  var bar = form ? form.querySelector('.quizbar') : null;
  if (!form || !body) return;

  var step = 0;
  var answers = [];

  function progress(pct) {
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function renderQuestion() {
    var item = QUESTIONS[step];
    progress((step / (QUESTIONS.length + 1)) * 100);
    body.innerHTML =
      '<p class="qn">Question ' + (step + 1) + ' of ' + QUESTIONS.length + '</p>' +
      '<p class="qt serif">' + item.q + '</p>' +
      '<div class="opts" role="group" aria-label="' + item.q.replace(/"/g, '') + '">' +
      item.o.map(function (o, i) {
        var on = answers[step] === i;
        return '<button type="button" class="opt" data-i="' + i + '" aria-pressed="' + on + '">' + o + '</button>';
      }).join('') +
      '</div>' +
      '<div class="quiznav">' +
      (step > 0 ? '<button type="button" class="back" data-back>← Back</button>' : '<span></span>') +
      '</div>';

    body.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () {
        answers[step] = Number(b.dataset.i);
        body.querySelectorAll('.opt').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        setTimeout(function () {
          step++;
          step < QUESTIONS.length ? renderQuestion() : renderDetails();
        }, 180);
      });
    });
    var back = body.querySelector('[data-back]');
    if (back) back.addEventListener('click', function () { step--; renderQuestion(); });

    var first = body.querySelector('.opt');
    if (first && step > 0) first.focus();
  }

  function renderDetails() {
    progress((QUESTIONS.length / (QUESTIONS.length + 1)) * 100);
    body.innerHTML =
      '<p class="qn">Last bit</p>' +
      '<p class="qt serif">Where do we send the invite?</p>' +
      '<div class="field" id="fName"><label for="qName">Your name</label>' +
      '<input id="qName" name="name" autocomplete="name" required>' +
      '<span class="err">Tell us what to call you at the table.</span></div>' +
      '<div class="field" id="fPhone"><label for="qPhone">WhatsApp number</label>' +
      '<input id="qPhone" name="phone" inputmode="tel" autocomplete="tel" required placeholder="10 digits">' +
      '<span class="err">We need a 10-digit Indian mobile number — the invite goes there.</span></div>' +
      '<div class="field" id="fCo"><label for="qCo">What you are building (one line)</label>' +
      '<input id="qCo" name="company" required>' +
      '<span class="err">One line is enough. It is how we avoid seating competitors together.</span></div>' +
      '<div class="quiznav"><button type="button" class="back" data-back>← Back</button>' +
      '<button type="submit" class="btn btn-primary" id="qSubmit">Request my seat <span class="arw">→</span></button></div>';

    body.querySelector('[data-back]').addEventListener('click', function () {
      step = QUESTIONS.length - 1; renderQuestion();
    });

    ['fName', 'fPhone', 'fCo'].forEach(function (id) {
      var wrap = document.getElementById(id);
      wrap.querySelector('input').addEventListener('blur', function () { validate(id); });
    });
    body.querySelector('#qName').focus();
  }

  function validate(id) {
    var wrap = document.getElementById(id);
    var input = wrap.querySelector('input');
    var v = input.value.trim();
    var ok = id === 'fPhone' ? /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) && v.replace(/\D/g, '').length >= 10 : v.length > 1;
    wrap.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ids = ['fName', 'fPhone', 'fCo'];
    var bad = ids.filter(function (id) { return !validate(id); });
    if (bad.length) {
      document.getElementById(bad[0]).querySelector('input').focus();
      return;
    }
    var btn = document.getElementById('qSubmit');
    btn.disabled = true;
    btn.style.opacity = '.6';
    btn.textContent = 'Sending…';

    // Demo build: no backend attached. Point ENDPOINT at a webhook you control
    // (n8n / Make / Apps Script) to start collecting real leads.
    var ENDPOINT = '';
    var payload = {
      answers: answers.map(function (a, i) { return { q: QUESTIONS[i].q, a: QUESTIONS[i].o[a] }; }),
      name: document.getElementById('qName').value.trim(),
      phone: document.getElementById('qPhone').value.trim(),
      company: document.getElementById('qCo').value.trim()
    };

    var done = function () {
      progress(100);
      body.innerHTML =
        '<div class="quizdone">' +
        '<div class="tick"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg></div>' +
        '<p class="qt serif" style="margin-bottom:10px">You are in the pool.</p>' +
        '<p style="color:var(--dim);max-width:44ch;margin:0 auto 18px">' +
        'We build Thursday\'s tables on Tuesday. If you are on one, the invite lands on WhatsApp with the neighbourhood and the shape of the table.</p>' +
        '<p class="mono" style="font-size:12px;color:var(--brass)">Demo build — no seat has actually been reserved.</p>' +
        '</div>';
    };

    if (!ENDPOINT) { setTimeout(done, 550); return; }
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(done).catch(function () {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.textContent = 'Try again';
    });
  });

  renderQuestion();
})();
