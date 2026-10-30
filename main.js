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
