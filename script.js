
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Hamburger Menü & Navbar  ---
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active'); // X şekli için animasyon
        });
    }

    // --- 2. Tema Değiştirici (Dark/Light Mode) [cite: 17, 18] ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Kullanıcının tercihini hatırla (Opsiyonel ama iyi bir UX)
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeBtn.textContent = 'Dark Mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                themeBtn.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                themeBtn.textContent = 'Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 3. Accordion / İçerik Gizleme-Gösterme (Hobiler Sayfası) [cite: 19, 20] ---
    const accHeaders = document.querySelectorAll('.accordion-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Tıklanan başlığın içeriğini seç
            const content = header.nextElementSibling;

            // Eğer zaten açıksa kapat
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // Diğerlerini kapat (Opsiyonel: sadece biri açık kalsın isterseniz)
                document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = null);
                // Tıklananı aç
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- 4. İletişim Formu Doğrulama [cite: 15, 16] ---
    // Not: Bu kodu iletisim.html sayfasına <form id="contact-form"> eklediğinizde çalışır.
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Sayfa yenilenmesini engelle

            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            let isValid = true;
            let errorMsg = "";

            // Basit doğrulama kuralları
            if (email.trim() === "" || !email.includes('@')) {
                isValid = false;
                errorMsg += "Geçerli bir e-posta adresi giriniz.\n";
            }
            if (message.trim() === "") {
                isValid = false;
                errorMsg += "Mesaj alanı boş bırakılamaz.\n";
            }

            if (isValid) {
                alert("Mesajınız başarıyla simüle edildi! (Backend bağlı değil)");
                contactForm.reset();
            } else {
                alert("Hata:\n" + errorMsg); // DOM manipülasyonu ile hata göstermek için bir <div id="error"> da kullanılabilir.
            }
        });
    }
});