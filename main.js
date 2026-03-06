document.addEventListener('DOMContentLoaded', function () {
    const binaryRain = document.getElementById('binaryRain');
    // Ganti '01' dengan karakter tambahan
    const binaryChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&'; 
    let columns = Math.floor(window.innerWidth / 20);
    let rows = Math.floor(window.innerHeight / 24);

    function createBinaryRain() {
        let output = '';
        for (let r = 0; r < rows; r++) {
            let line = '';
            for (let c = 0; c < columns; c++) {
                line += binaryChars[Math.floor(Math.random() * binaryChars.length)];
            }
            output += line + '\n';
        }
        binaryRain.textContent = output;
    }

    createBinaryRain();

    // Pastikan card ada sebelum menambahkan event listener
    const card = document.querySelector('.profile-card'); // Ganti .hologram-card menjadi .profile-card karena di HTML Anda menggunakan .profile-card

    if (card) {
        // Interval yang lebih cepat untuk efek "Matrix" yang lebih intens (opsional)
        let row = 0;
        const binaryInterval = setInterval(() => {
            const lines = binaryRain.textContent.split('\n');
            lines[row] = lines[row].split('').map(() =>
                binaryChars[Math.floor(Math.random() * binaryChars.length)]
            ).join('');
            binaryRain.textContent = lines.join('\n');
            row = (row + 1) % rows;
        }, 80); // Diubah dari 100ms menjadi 80ms

        window.addEventListener('mousemove', (e) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;

            const tiltX = (y / window.innerHeight) * 10;
            const tiltY = -(x / window.innerWidth) * 10;
            const depth = Math.sqrt(x * x + y * y) / 100;

            card.style.transform = `
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                translateZ(${depth * 20}px)
            `;

            card.style.boxShadow = `
                ${x / 20}px ${y / 20}px 30px rgba(0,0,0,0.7),
                0 0 0 1px rgba(255,255,255,0.1)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = `
                0 0 0 1px rgba(255,255,255,0.1),
                0 0 30px rgba(0,0,0,0.5)
            `;
        });
        
        // Menghapus fungsi createGrid karena elemen tersebut tidak ada di HTML Anda
        // dan Anda sudah memiliki efek partikel di background.
    } else {
        // Jika card tidak ditemukan, hanya jalankan binary rain
        let row = 0;
        setInterval(() => {
            const lines = binaryRain.textContent.split('\n');
            lines[row] = lines[row].split('').map(() =>
                binaryChars[Math.floor(Math.random() * binaryChars.length)]
            ).join('');
            binaryRain.textContent = lines.join('\n');
            row = (row + 1) % rows;
        }, 80);
    }


    window.addEventListener('resize', () => {
        columns = Math.floor(window.innerWidth / 20);
        rows = Math.floor(window.innerHeight / 24);
        createBinaryRain();
    });
});
