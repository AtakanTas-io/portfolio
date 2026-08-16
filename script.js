document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Hamburger Menü & Navbar ---
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // --- 2. Tema Değiştirici (Dark/Light Mode) ---
  // Not: Tema class'ı artık <html> etiketinde tutuluyor. Flaş (FOUC) önlemi
  // için ilgili class, head içindeki inline script tarafından erkenden
  // (CSS/DOM yüklenmeden önce) uygulanıyor; burada sadece buton metnini
  // senkronluyoruz.
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  if (themeBtn) {
    themeBtn.textContent = htmlEl.classList.contains("light-mode")
      ? "Dark Mode"
      : "Light Mode";

    themeBtn.addEventListener("click", () => {
      htmlEl.classList.toggle("light-mode");

      if (htmlEl.classList.contains("light-mode")) {
        themeBtn.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
      } else {
        themeBtn.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // --- 3. Accordion / İçerik Gizleme-Gösterme (Hobiler Sayfası) ---
  const accHeaders = document.querySelectorAll(".accordion-header");

  accHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        document
          .querySelectorAll(".accordion-content")
          .forEach((c) => (c.style.maxHeight = null));
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // --- 4. İletişim Formu Frontend Kontrolü (Netlify Forms için) ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = "GÖNDERİLİYOR...";
      btn.disabled = true;
    });
  }
});
