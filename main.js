(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== Tahun footer otomatis ===== */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ===== Reveal saat scroll ===== */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('in'));
    }

    /* ===== Cahaya kartu ngikutin kursor ===== */
    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* ===== Background partikel (canvas) ===== */
    const canvas = document.getElementById('bg');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0, dots = [], raf = 0;
        const LINK = 120;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth; h = window.innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(70, Math.floor((w * h) / 18000));
            dots = Array.from({ length: count }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
                r: Math.random() * 1.4 + .6
            }));
        }

        function frame() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < dots.length; i++) {
                const a = dots[i];
                a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > w) a.vx *= -1;
                if (a.y < 0 || a.y > h) a.vy *= -1;
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(120,180,255,.7)';
                ctx.fill();
                for (let k = i + 1; k < dots.length; k++) {
                    const b = dots[k];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < LINK) {
                        ctx.strokeStyle = 'rgba(140,110,255,' + (0.22 * (1 - d / LINK)).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(frame);
        }

        resize();
        frame();
        window.addEventListener('resize', resize);
        // hemat baterai: berhenti saat tab disembunyikan
        document.addEventListener('visibilitychange', () => {
            cancelAnimationFrame(raf);
            if (!document.hidden) frame();
        });
    }

    /* ===== Modal sendiri (pengganti SweetAlert) ===== */
    if (!document.getElementById('modal')) return; // halaman /payment tidak punya modal
    const modal = document.getElementById('modal');
    const mIcon = document.getElementById('mIcon');
    const mTitle = document.getElementById('mTitle');
    const mText = document.getElementById('mText');
    const mOk = document.getElementById('mOk');
    const mCancel = document.getElementById('mCancel');
    let onOk = null;
    let lastFocus = null;

    function openModal(opts) {
        lastFocus = document.activeElement;
        mIcon.className = 'mIcon' + (opts.iconClass ? ' ' + opts.iconClass : '');
        mIcon.innerHTML = opts.icon;
        mTitle.textContent = opts.title;
        mText.textContent = opts.text;
        mOk.textContent = opts.okText || 'OK';
        mCancel.textContent = opts.cancelText || 'Batal';
        mCancel.hidden = !opts.showCancel;
        onOk = opts.onOk || null;
        modal.hidden = false;
        mOk.focus();
    }

    function closeModal() {
        modal.hidden = true;
        onOk = null;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    mOk.addEventListener('click', () => {
        const cb = onOk;
        closeModal();
        if (cb) cb();
    });
    mCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

    /* ===== Tombol ===== */
    const WA_CONTACT = 'https://wa.me/6285810287828';

    document.getElementById('btnWA').addEventListener('click', () => {
        openModal({
            icon: '<i class="fab fa-whatsapp"></i>',
            title: 'Lanjut ke WhatsApp?',
            text: 'Kamu akan diarahkan ke chat WhatsApp.',
            showCancel: true,
            okText: 'Ya, lanjut',
            cancelText: 'Batal',
            onOk: () => window.open(WA_CONTACT, '_blank', 'noopener')
        });
    });
})();
