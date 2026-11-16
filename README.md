# LinZheX.github.io

我的 GitHub Pages 个人主页：深色极客风、中英双语、零依赖纯静态。

在线地址：<https://linzhex.github.io>

## 修改内容

所有个人信息都集中在 [`js/main.js`](js/main.js) 顶部的 `SITE` 对象：

- `username` — GitHub 用户名
- `displayName` — 首页显示的名字
- `title` / `bio` / `about` / `location` — 中英双语文案
- `email` / `blog` — 联系方式，留空则自动隐藏对应入口
- `skills` — 技能标签

项目卡片和头像、资料数据由 GitHub API 自动拉取，无需手动维护。

## 本地预览

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

## 部署

推送到 `main` 分支即可，GitHub Pages 会自动发布：

```bash
git add . && git commit -m "update site" && git push
```
