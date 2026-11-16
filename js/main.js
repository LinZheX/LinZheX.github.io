/* ============================================================
 * linzhex.github.io — 站点配置与逻辑
 *
 * 想改个人信息？只需编辑下面 SITE 对象：
 *   username   GitHub 用户名
 *   displayName 首页显示的名字
 *   title/bio/about/location  中英双语文案
 *   email/blog  留空则对应入口自动隐藏
 *   skills  技能标签，{ zh: 中文名, en: 英文名 }
 * ============================================================ */

const SITE = {
  username: "LinZheX",
  displayName: "LinZheX",
  title: {
    zh: "你好，我是 LinZheX 👋",
    en: "Hi, I'm LinZheX 👋",
  },
  bio: {
    zh: "安全研究员 · 专注漏洞研究与 CVE 分析。",
    en: "Security researcher · focused on vulnerability research & CVE analysis.",
  },
  about: {
    zh: "这里是我的 GitHub 个人主页。我主要做安全研究，公开仓库里有漏洞分析与 CVE 报告；也喜欢开源、喜欢把技术细节讲清楚。",
    en: "Welcome to my GitHub home page. I do security research — my public repos include vulnerability research and CVE write-ups. I also enjoy open source and explaining technical details clearly.",
  },
  location: {
    zh: "地球",   // ← 改成你的所在地
    en: "Earth",  // ← change to your location
  },
  email: "",   // ← 例如 "me@example.com"，留空隐藏邮箱入口
  blog: "",    // ← 例如 "https://example.com"，留空隐藏博客入口
  skills: [
    { zh: "漏洞研究", en: "Vuln Research" },
    { zh: "CVE 分析", en: "CVE Analysis" },
    { zh: "安全报告", en: "Security Reports" },
    { zh: "Python", en: "Python" },
    { zh: "Git", en: "Git" },
    { zh: "Linux", en: "Linux" },
  ],
};

/* ---------- 固定文案（中英双语），一般不用改 ---------- */
const I18N = {
  zh: {
    "term.online": "ONLINE",
    "nav.about": "关于",
    "nav.skills": "技能",
    "nav.projects": "项目",
    "nav.contact": "联系",
    "hero.title": SITE.title.zh,
    "hero.bio": SITE.bio.zh,
    "about.heading": "关于我 / about",
    "about.text": SITE.about.zh,
    "skills.heading": "技能 / skills",
    "skills.hint": "（标签在 js/main.js 的 SITE.skills 里修改）",
    "projects.heading": "项目 / projects",
    "projects.sub": "来自 GitHub 的公开仓库，按最近更新排序。",
    "projects.loading": "$ git fetch origin …",
    "projects.more": "在 GitHub 上查看全部 →",
    "projects.none": "还没有公开仓库，先随便写点代码吧。",
    "projects.error": "仓库列表加载失败（可能触发了 API 限流），点上方链接去 GitHub 看吧。",
    "projects.nodesc": "（无描述）",
    "contact.heading": "联系 / contact",
    "contact.hint": "（联系方式在 js/main.js 的 SITE 里修改）",
    "footer": "© {year} LinZheX · Powered by GitHub Pages",
    "label.github": "GitHub",
    "label.email": "Email",
    "label.blog": "Blog",
  },
  en: {
    "term.online": "ONLINE",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.title": SITE.title.en,
    "hero.bio": SITE.bio.en,
    "about.heading": "about / 关于我",
    "about.text": SITE.about.en,
    "skills.heading": "skills / 技能",
    "skills.hint": "(edit tags in SITE.skills inside js/main.js)",
    "projects.heading": "projects / 项目",
    "projects.sub": "Public repos from GitHub, sorted by recent activity.",
    "projects.loading": "$ git fetch origin …",
    "projects.more": "View all on GitHub →",
    "projects.none": "No public repos yet — go write some code!",
    "projects.error": "Failed to load repos (API rate limit?). See the link above.",
    "projects.nodesc": "(no description)",
    "contact.heading": "contact / 联系",
    "contact.hint": "(edit contacts in SITE inside js/main.js)",
    "footer": "© {year} LinZheX · Powered by GitHub Pages",
    "label.github": "GitHub",
    "label.email": "Email",
    "label.blog": "Blog",
  },
};

/* ============================================================ */

const $ = (id) => document.getElementById(id);
const API = "https://api.github.com/users/" + SITE.username;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lang = localStorage.getItem("site-lang") || "zh";

function t(key) {
  return I18N[lang][key] || key;
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 终端打字机 ---------- */
function renderHeroLinks() {
  const box = $("hero-links");
  if (!box) return;
  box.textContent = "";
  const links = [
    { text: "GitHub", href: "https://github.com/" + SITE.username },
    SITE.email ? { text: "Email", href: "mailto:" + SITE.email } : null,
    SITE.blog ? { text: "Blog", href: SITE.blog } : null,
  ].filter(Boolean);
  links.forEach((l) => {
    const a = el("a", null, l.text);
    a.href = l.href;
    if (!l.href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    box.appendChild(a);
  });
}

async function buildTerminal() {
  const body = $("terminal-body");
  if (!body) return;
  body.textContent = "";

  const seq = [
    { cmd: "whoami", out: SITE.displayName, cls: "hero-name" },
    { cmd: "cat title.txt", out: t("hero.title"), cls: "hero-title" },
    { cmd: "cat bio.txt", out: t("hero.bio"), cls: "hero-bio" },
    { cmd: "ls ./links", out: null },
  ];

  for (const item of seq) {
    // 命令行
    const line = el("div", "line");
    const prompt = el("span", "t-prompt", "$ ");
    const cmd = el("span", "cmd");
    line.append(prompt, cmd);
    body.appendChild(line);

    if (REDUCED_MOTION) {
      cmd.textContent = item.cmd;
    } else {
      for (const ch of item.cmd) {
        cmd.textContent += ch;
        await sleep(26 + Math.random() * 30);
      }
      await sleep(140);
    }

    // 输出
    if (item.out !== null) {
      const out = el("div", "line out out-appear");
      const span = el("span", item.cls, item.out);
      if (item.cls === "hero-title") span.id = "hero-title";
      if (item.cls === "hero-bio") span.id = "hero-bio";
      out.appendChild(span);
      body.appendChild(out);
      await sleep(REDUCED_MOTION ? 0 : 420);
    }
  }

  // 链接行 + 常亮光标
  const linkLine = el("div", "line out out-appear");
  const linkBox = el("div", "hero-links");
  linkBox.id = "hero-links";
  linkLine.appendChild(linkBox);
  body.appendChild(linkLine);
  renderHeroLinks();

  const finalLine = el("div", "line");
  finalLine.append(el("span", "t-prompt", "$ "), el("span", "cursor"));
  body.appendChild(finalLine);
}

/* ---------- 语言 ---------- */
function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("lang-toggle").textContent = lang === "zh" ? "EN" : "中";
  const setTxt = (id, txt) => {
    const node = $(id);
    if (node) node.textContent = txt;
  };
  setTxt("hero-title", t("hero.title"));
  setTxt("hero-bio", t("hero.bio"));
  renderSkills();
  renderFooter();
  renderContacts();
}

function renderSkills() {
  const cloud = $("skill-cloud");
  cloud.textContent = "";
  SITE.skills.forEach((s) => {
    cloud.appendChild(el("span", "skill-chip", lang === "zh" ? s.zh : s.en));
  });
}

function renderFooter() {
  $("footer-text").textContent = t("footer").replace("{year}", new Date().getFullYear());
}

/* ---------- 联系方式 ---------- */
function renderContacts() {
  const list = $("contact-list");
  list.textContent = "";

  const items = [
    { icon: "⎇", label: t("label.github"), href: "https://github.com/" + SITE.username },
    SITE.email ? { icon: "✉", label: t("label.email"), href: "mailto:" + SITE.email } : null,
    SITE.blog ? { icon: "✎", label: t("label.blog"), href: SITE.blog } : null,
  ].filter(Boolean);

  items.forEach((it) => {
    const row = el("div", "contact-item");
    row.append(
      el("span", "icon", it.icon),
      el("span", "label", it.label)
    );
    const link = el("a", null, it.href.replace(/^mailto:/, ""));
    link.href = it.href;
    if (!it.href.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    row.appendChild(link);
    list.appendChild(row);
  });
}

/* ---------- 头像 ---------- */
function renderAvatar() {
  const img = $("about-avatar");
  const fallback =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<rect width="100" height="100" fill="#161b22"/>' +
        '<text x="50" y="58" font-size="34" fill="#00ff9d" text-anchor="middle" font-family="monospace">' +
        SITE.displayName.slice(0, 2).toUpperCase() +
        "</text></svg>"
    );
  img.onerror = () => {
    img.onerror = null;
    img.src = fallback;
  };
  img.src = "https://github.com/" + SITE.username + ".png?size=200";
}

/* ---------- 个人资料事实区 ---------- */
async function renderFacts() {
  const set = (id, val) => {
    $(id).textContent = val;
  };
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(res.status);
    const p = await res.json();
    set("fact-location", p.location || (lang === "zh" ? SITE.location.zh : SITE.location.en));
    set("fact-since", p.created_at ? p.created_at.slice(0, 4) : "—");
    set("fact-repos", p.public_repos ?? "—");
    set("fact-followers", p.followers ?? "—");
  } catch {
    set("fact-location", lang === "zh" ? SITE.location.zh : SITE.location.en);
    set("fact-since", "—");
    set("fact-repos", "—");
    set("fact-followers", "—");
  }
}

/* ---------- 项目卡片 ---------- */
async function renderProjects() {
  const grid = $("project-grid");
  try {
    const res = await fetch(API + "/repos?sort=updated&per_page=10");
    if (!res.ok) throw new Error(res.status);
    let repos = await res.json();
    repos = repos.filter((r) => !r.fork && !r.name.toLowerCase().endsWith(".github.io"));
    grid.textContent = "";

    if (!repos.length) {
      grid.appendChild(el("div", "loading", t("projects.none")));
      return;
    }

    repos.slice(0, 6).forEach((r) => {
      const card = el("a", "project-card");
      card.href = r.html_url;
      card.target = "_blank";
      card.rel = "noopener";

      const meta = el("div", "repo-meta");
      meta.append(
        el("span", "lang", r.language || "—"),
        el("span", "stars", String(r.stargazers_count))
      );
      card.append(
        el("div", "repo-name", r.name),
        el("div", "repo-desc", r.description || t("projects.nodesc")),
        meta
      );
      grid.appendChild(card);
    });
  } catch {
    grid.textContent = "";
    grid.appendChild(el("div", "loading", t("projects.error")));
  }
}

/* ---------- 星空粒子背景 ---------- */
function initStarfield() {
  const canvas = $("bg-canvas");
  if (!canvas || REDUCED_MOTION) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const COLORS = ["0,255,157", "0,212,255", "167,139,250"];
  const mouse = { x: null, y: null };
  let w = 0, h = 0, raf = 0, pts = [];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(110, Math.round((w * h) / 16000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.4,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (const p of pts) {
      // 鼠标轻微吸引
      if (mouse.x !== null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120 && d2 > 1) {
          p.vx += dx * 0.00035;
          p.vy += dy * 0.00035;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      p.tw += 0.02;
      // 限速
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > 0.6) {
        p.vx *= 0.6 / sp;
        p.vy *= 0.6 / sp;
      }
      // 环绕边界
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

      const a = 0.35 + 0.3 * Math.sin(p.tw);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
      ctx.fill();
    }

    // 近距粒子连线（星座网络）
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 110 * 110) {
          const alpha = (1 - Math.sqrt(d2) / 110) * 0.12;
          ctx.strokeStyle = "rgba(0,255,157," + alpha.toFixed(3) + ")";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function onVisibility() {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  raf = requestAnimationFrame(frame);
}

/* ---------- 滚动浮现 ---------- */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".section").forEach((s) => io.observe(s));
}

/* ---------- 语言切换 ---------- */
$("lang-toggle").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("site-lang", lang);
  applyLang();
  renderFacts(); // location 文案跟随语言
});

/* ---------- 启动 ---------- */
applyLang();
buildTerminal();
renderAvatar();
renderFacts();
renderProjects();
initStarfield();
initReveal();
