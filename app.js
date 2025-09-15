// Theme toggle with system preference + persistence
const root = document.documentElement;
const THEME_KEY = "theme";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(t) {
  root.dataset.theme = t;
  localStorage.setItem(THEME_KEY, t);
}

function currentTheme() {
  return localStorage.getItem(THEME_KEY) || (prefersDark.matches ? "dark" : "light");
}

applyTheme(currentTheme());

prefersDark.addEventListener("change", e => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});


// Mobile nav toggle
const navBtn = document.getElementById("nav-toggle");
const nav = document.getElementById("site-nav");

navBtn?.addEventListener("click", () => {
  const open = navBtn.getAttribute("aria-expanded") === "true";
  navBtn.setAttribute("aria-expanded", String(!open));
  nav.hidden = open;
});


// IntersectionObserver reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));


// Typewriter subtitle
const roles = [
  "Software Engineer",
  "ML Enthusiast",
  "Systems Builder"
];

let i = 0, j = 0, del = false;
const el = document.getElementById("typewriter");

function tick() {
  if (!el) return;

  const word = roles[i];
  el.textContent = word.slice(0, j);

  if (!del && j < word.length) {
    j++;
  } else if (del && j > 0) {
    j--;
  } else if (!del && j === word.length) {
    del = true;
    setTimeout(tick, 1200);
    return;
  } else if (del && j === 0) {
    del = false;
    i = (i + 1) % roles.length;
  }

  setTimeout(tick, del ? 40 : 70);
}
tick();


// Back to top
const topBtn = document.getElementById("to-top");

window.addEventListener("scroll", () => {
  if (topBtn) topBtn.hidden = window.scrollY < 400;
});

topBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// Project filters
const filters = document.querySelector(".filters");
const cards = [...document.querySelectorAll("#projects .card")];

filters?.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  filters.querySelectorAll("button").forEach(b =>
    b.classList.toggle("active", b === btn)
  );

  const f = btn.dataset.filter;
  cards.forEach(c => {
    const ok = f === "all" || c.dataset.tags?.split(" ").includes(f);
    c.style.display = ok ? "" : "none";
  });
});


// Deep-link tag filter (#tag=python)
const tagParam = new URL(location.href).hash.match(/tag=([\w-]+)/)?.[1];
if (tagParam) {
  const btn = document.querySelector(`.filters [data-filter="${tagParam}"]`);
  btn?.click();
}


// Sort projects (by stars/date)
const grid = document.getElementById("projects");

document.getElementById("sort")?.addEventListener("change", e => {
  const option = e.target.value;
  const wrap = grid?.querySelector(".grid");
  if (!wrap) return;

  const items = [...wrap.children];
  const get = (el, k) => el.dataset[k] || "";

  items.sort((a, b) => {
    if (option === "stars") return (+get(b, "stars")) - (+get(a, "stars"));
    if (option === "newest") return new Date(get(b, "date")) - new Date(get(a, "date"));
    return 0;
  }).forEach(el => wrap.appendChild(el));
});


// Copy buttons for <pre class="code"><code>...</code></pre>
document.querySelectorAll("pre.code").forEach(pre => {
  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.type = "button";
  btn.textContent = "Copy";

  btn.addEventListener("click", async () => {
    const text = pre.querySelector("code")?.innerText || "";
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = "Copy", 1200);
    } catch {
      btn.textContent = "Failed";
    }
  });

  pre.appendChild(btn);
});


// Lightbox for images
const lb = document.getElementById("lightbox"),
      lbImg = lb?.querySelector("img"),
      lbClose = lb?.querySelector("button");

document.addEventListener("click", e => {
  const z = e.target.closest?.(".zoomable");
  if (z && lb && lbImg) {
    lbImg.src = z.dataset.full || z.src;
    lb.hidden = false;
  }
});

lb?.addEventListener("click", e => {
  if (e.target === lb) lb.hidden = true;
});

lbClose?.addEventListener("click", () => lb.hidden = true);

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lb) lb.hidden = true;
});


// GitHub repos (optional). Show top repos by stars.
async function loadRepos(username, count = 6) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!res.ok) return; // silently ignore if rate-limited

    const data = await res.json();
    const top = data
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, count);

    const wrap = document.getElementById("gh-projects");
    if (!wrap) return;

    wrap.innerHTML = top.map(r => `
      <article class="card reveal" data-stars="${r.stargazers_count}" data-date="${r.created_at}">
        <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
        <p>${(r.description || "").slice(0, 140)}</p>
        <div class="tags">
          <span class="tag">${r.language || "Other"}</span>
          <span class="tag">★ ${r.stargazers_count}</span>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } catch (e) {
    // ignore network errors
  }
}

loadRepos("your-github-username");


// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "g") {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.getElementById("search")?.focus();
  }
});
