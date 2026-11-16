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

let lang = localStorage.getItem("site-lang") || "zh";

function t(key) {
  return I18N[lang][key] || key;
}

/* 应用语言：静态文案 + 重新渲染动态区域 */
function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $("lang-toggle").textContent = lang === "zh" ? "EN" : "中";
  $("hero-name").textContent = SITE.displayName;
  renderSkills();
  renderFooter();
  renderContacts(); // 依赖文案，需要时重建
}

function renderSkills() {
  const cloud = $("skill-cloud");
  cloud.textContent = "";
  SITE.skills.forEach((s) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.textContent = lang === "zh" ? s.zh : s.en;
    cloud.appendChild(chip);
  });
}

function renderFooter() {
  $("footer-text").textContent = t("footer").replace("{year}", new Date().getFullYear());
}

/* 联系方式：GitHub 必显，邮箱/博客按配置显隐 */
function renderContacts() {
  const list = $("contact-list");
  list.textContent = "";

  const items = [
    { icon: "⎇", label: t("label.github"), href: "https://github.com/" + SITE.username },
    SITE.email ? { icon: "✉", label: t("label.email"), href: "mailto:" + SITE.email } : null,
    SITE.blog ? { icon: "✎", label: t("label.blog"), href: SITE.blog } : null,
  ].filter(Boolean);

  items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "contact-item";
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = it.icon;
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = it.label;
    const link = document.createElement("a");
    link.href = it.href;
    link.target = it.href.startsWith("mailto:") ? "" : "_blank";
    link.rel = "noopener";
    link.textContent = it.href.replace(/^mailto:/, "");
    row.append(icon, label, link);
    list.appendChild(row);
  });

  // hero 里的快捷链接同步显隐
  $("hero-email").hidden = !SITE.email;
  if (SITE.email) $("hero-email").href = "mailto:" + SITE.email;
  $("hero-blog").hidden = !SITE.blog;
  if (SITE.blog) $("hero-blog").href = SITE.blog;
}

/* 头像：来自 GitHub，加载失败时用字母头像兜底 */
function renderAvatar() {
  const img = $("about-avatar");
  const fallback =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<rect width="100" height="100" fill="#161b22"/>' +
        '<text x="50" y="58" font-size="34" fill="#3fb950" text-anchor="middle" font-family="monospace">' +
        SITE.displayName.slice(0, 2).toUpperCase() +
        "</text></svg>"
    );
  img.onerror = () => {
    img.onerror = null;
    img.src = fallback;
  };
  img.src = "https://github.com/" + SITE.username + ".png?size=200";
}

/* 个人资料事实区（location / since / repos / followers） */
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

/* 项目卡片：从 GitHub API 拉公开仓库（排除本仓库），失败时给出提示 */
async function renderProjects() {
  const grid = $("project-grid");
  try {
    const res = await fetch(API + "/repos?sort=updated&per_page=10");
    if (!res.ok) throw new Error(res.status);
    let repos = await res.json();
    repos = repos.filter((r) => !r.fork && !r.name.toLowerCase().endsWith(".github.io"));
    grid.textContent = "";

    if (!repos.length) {
      const empty = document.createElement("div");
      empty.className = "loading";
      empty.textContent = t("projects.none");
      grid.appendChild(empty);
      return;
    }

    repos.slice(0, 6).forEach((r) => {
      const card = document.createElement("a");
      card.className = "project-card";
      card.href = r.html_url;
      card.target = "_blank";
      card.rel = "noopener";

      const name = document.createElement("div");
      name.className = "repo-name";
      name.textContent = r.name;

      const desc = document.createElement("div");
      desc.className = "repo-desc";
      desc.textContent = r.description || t("projects.nodesc");

      const meta = document.createElement("div");
      meta.className = "repo-meta";
      const langEl = document.createElement("span");
      langEl.className = "lang";
      langEl.textContent = r.language || "—";
      const stars = document.createElement("span");
      stars.className = "stars";
      stars.textContent = r.stargazers_count;

      meta.append(langEl, stars);
      card.append(name, desc, meta);
      grid.appendChild(card);
    });
  } catch {
    grid.textContent = "";
    const err = document.createElement("div");
    err.className = "loading";
    err.textContent = t("projects.error");
    grid.appendChild(err);
  }
}

/* 语言切换 */
$("lang-toggle").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("site-lang", lang);
  applyLang();
  renderFacts(); // location 文案跟随语言
});

/* 启动 */
applyLang();
renderAvatar();
renderFacts();
renderProjects();
