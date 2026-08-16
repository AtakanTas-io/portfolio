document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Tema Değiştirici (Dark/Light Mode) ---
  // Class <html> üzerinde tutulur; flaş (FOUC) önlemi head'deki
  // inline script tarafından erkenden uygulanır, burada yalnızca
  // butonun ikon/etiketini senkronluyoruz.
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;

  function syncThemeIcon() {
    if (!themeBtn) return;
    const isLight = htmlEl.classList.contains("light-mode");
    themeBtn.setAttribute(
      "aria-label",
      isLight ? "Koyu temaya geç" : "Açık temaya geç"
    );
    themeBtn.querySelector(".icon-sun").style.display = isLight ? "none" : "block";
    themeBtn.querySelector(".icon-moon").style.display = isLight ? "block" : "none";
  }

  if (themeBtn) {
    syncThemeIcon();
    themeBtn.addEventListener("click", () => {
      htmlEl.classList.toggle("light-mode");
      localStorage.setItem(
        "theme",
        htmlEl.classList.contains("light-mode") ? "light" : "dark"
      );
      syncThemeIcon();
    });
  }

  // --- 2. Mobil sekme (tab) menüsü ---
  const tabbarToggle = document.getElementById("tabbar-toggle");
  const tabbar = document.getElementById("tabbar");
  if (tabbarToggle && tabbar) {
    tabbarToggle.addEventListener("click", () => {
      tabbar.classList.toggle("open");
    });
  }

  // --- 3. Accordion (Hobiler sayfası) ---
  const hobbyHeaders = document.querySelectorAll(".hobby-header");
  hobbyHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.closest(".hobby-card");
      const body = card.querySelector(".hobby-body");
      const isOpen = card.classList.contains("open");

      document.querySelectorAll(".hobby-card.open").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("open");
          openCard.querySelector(".hobby-body").style.maxHeight = null;
        }
      });

      if (isOpen) {
        card.classList.remove("open");
        body.style.maxHeight = null;
      } else {
        card.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // --- 4. İletişim Formu (Netlify Forms, AJAX ile sayfa yenilemeden) ---
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  function encodeFormData(form) {
    const data = new FormData(form);
    return Array.from(data.entries())
      .map(
        (pair) =>
          encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1])
      )
      .join("&");
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "GÖNDERİLİYOR...";
      btn.disabled = true;

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(contactForm),
      })
        .then(() => {
          feedback.textContent =
            "✓ Mesajın ulaştı. En kısa sürede dönüş yapacağım.";
          feedback.className = "form-feedback show success";
          contactForm.reset();
        })
        .catch(() => {
          feedback.textContent =
            "✗ Bir şeyler ters gitti. Doğrudan e-posta ile de ulaşabilirsin: tasatakan5@gmail.com";
          feedback.className = "form-feedback show error";
        })
        .finally(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  }

  // --- 5. GitHub API — canlı repo listesi (Projeler sayfası) ---
  const repoGrid = document.getElementById("repo-grid");
  if (repoGrid) {
    const GITHUB_USER = "AtakaanShiva";
    const langColors = {
      Python: "#3572A5",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Java: "#b07219",
      Jupyter: "#DA5B0B",
      "Jupyter Notebook": "#DA5B0B",
      Shell: "#89e051",
      C: "#555555",
      "C++": "#f34b7d",
    };

    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9`
    )
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API isteği başarısız");
        return res.json();
      })
      .then((repos) => {
        const visible = repos.filter((r) => !r.fork);
        if (visible.length === 0) {
          repoGrid.innerHTML = `<div class="repo-state">Henüz herkese açık repo bulunmuyor. <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub profilime göz atabilirsin →</a></div>`;
          return;
        }
        repoGrid.innerHTML = visible
          .map((repo) => {
            const dotColor = langColors[repo.language] || "#8b8f9c";
            const updated = new Date(repo.updated_at).toLocaleDateString(
              "tr-TR",
              { year: "numeric", month: "short" }
            );
            const desc = repo.description
              ? escapeHtml(repo.description)
              : "Açıklama eklenmemiş.";
            return `
              <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
                <span class="repo-name">
                  <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  ${escapeHtml(repo.name)}
                </span>
                <p class="repo-desc">${desc}</p>
                <div class="repo-meta">
                  ${
                    repo.language
                      ? `<span><span class="repo-lang-dot" style="background:${dotColor}"></span>${escapeHtml(repo.language)}</span>`
                      : ""
                  }
                  <span>★ ${repo.stargazers_count}</span>
                  <span>${updated}</span>
                </div>
              </a>`;
          })
          .join("");
      })
      .catch(() => {
        repoGrid.innerHTML = `<div class="repo-state">Repo listesi şu an yüklenemedi. <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub profilimi doğrudan ziyaret edebilirsin →</a></div>`;
      });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 6. Durum çubuğu saati ---
  const clockEl = document.getElementById("status-clock");
  if (clockEl) {
    function tick() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    tick();
    setInterval(tick, 30000);
  }
});
