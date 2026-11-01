# 句间 · CET-6 写作表达

静态网页，可直接打开 `index.html` 预览。每日自动更新可用 GitHub Actions 定时运行 OpenAI Responses API（内置 web search），生成 `content.js` 并提交回仓库。随后 Vercel 连接该仓库即可自动发布。

## 启用自动更新

1. 将此文件夹作为 GitHub 仓库根目录推送到 GitHub（或者将其内容放入现有仓库的 `cet6-daily/` 子目录；下方 workflow 默认仓库根目录）。
2. 在仓库 **Settings → Secrets and variables → Actions → New repository secret** 添加 `OPENAI_API_KEY`。需要可调用 Responses API 且启用 web search 的 API 项目；密钥只放 GitHub Secret，不要写入网页文件。
3. 启用 **Settings → Actions → General → Workflow permissions → Read and write permissions**。
4. 将仓库导入 Vercel，若此目录是仓库根目录，Build Command 留空、Output Directory 留空（静态文件）；若作为子目录，Root Directory 选 `cet6-daily`。部署后每次 workflow 提交 `content.js`，Vercel 会自动重新部署。
5. Actions 页可手动运行 `Daily CET-6 content` 验证；定时为北京时间每天 06:00（UTC 22:00）。

GitHub Actions 定时任务在高负载时可能延迟。失败时网页保留上次内容；从 Actions 日志查看错误。每次生成会包含参考来源标题和链接，供核对事实与表达。

若暂不配置 API，也可以直接编辑 `content.js`，或者把页面内容发给助手，按需人工更新。自动流程需要 GitHub 仓库、OpenAI API 账户及其计费配置、Vercel 部署；网页本身无需服务器。
