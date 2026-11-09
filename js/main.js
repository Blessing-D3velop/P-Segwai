(function () {
  'use strict';
  var WA = '27825851313';
  var EMAIL = 'Pietsegwai1@gmail.com';

  /* mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* "Request a Quote" buttons pre-select the service in the form */
  var select = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-service');
      if (!v) return;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === v) { select.selectedIndex = i; break; }
      }
    });
  });

  /* floating WhatsApp button appears after the hero */
  var fw = document.querySelector('.float-wa');
  function onScroll() { fw.classList.toggle('show', window.scrollY > 700); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* lightbox */
  var lb = document.getElementById('lb');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var cur = 0, opener = null;
  function show(i) {
    cur = (i + items.length) % items.length;
    lbImg.src = items[cur].dataset.src;
    lbImg.alt = items[cur].dataset.cap;
    lbCap.textContent = items[cur].dataset.cap;
  }
  function openLb(i, from) {
    opener = from; show(i); lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-x').focus();
  }
  function closeLb() {
    lb.hidden = true; document.body.style.overflow = '';
    if (opener) opener.focus();
  }
  items.forEach(function (b, i) { b.addEventListener('click', function () { openLb(i, b); }); });
  lb.querySelector('.lb-x').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* enquiry form: validates, then opens WhatsApp or the email app with the details filled in */
  var form = document.getElementById('enquiry');
  var err = document.getElementById('f-err');
  var mode = 'wa';
  form.querySelectorAll('button[type=submit]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.dataset.mode; });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = [];
    ['name', 'phone', 'email', 'service', 'message'].forEach(function (k) {
      var el = f[k], v = el.value.trim(), ok = v !== '';
      if (k === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (k === 'phone' && ok) ok = v.replace(/\D/g, '').length >= 9;
      el.classList.toggle('bad', !ok);
      if (!ok) bad.push(el);
    });
    if (bad.length) {
      err.textContent = 'Please complete the highlighted fields: a valid phone number and email address are needed.';
      err.hidden = false; bad[0].focus(); return;
    }
    err.hidden = true;
    var lines = [
      'Enquiry from the P Segwai Construction website',
      'Name: ' + f.name.value.trim(),
      'Phone: ' + f.phone.value.trim(),
      'Email: ' + f.email.value.trim(),
      'Service: ' + f.service.value,
      'Message: ' + f.message.value.trim()
    ].join('\n');
    if (mode === 'mail') {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quote enquiry: ' + f.service.value) + '&body=' + encodeURIComponent(lines);
    } else {
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
    }
  });
})();
