const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(path.dirname(__dirname), "public");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || readEnvLocal();

function readEnvLocal() {
  try {
    const envPath = path.join(path.dirname(__dirname), ".env.local");
    const text = fs.readFileSync(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (line.startsWith("REMOVE_BG_API_KEY=")) {
        return line.slice("REMOVE_BG_API_KEY=".length).trim();
      }
    }
  } catch (error) {
    return "";
  }

  return "";
}

function send(res, status, body, type = "text/html; charset=utf-8", extraHeaders = {}) {
  res.writeHead(status, { "Content-Type": type, ...extraHeaders });
  res.end(body);
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pageLayout({ title, description, body, isSimple = false }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="stylesheet" href="/site.css" />
</head>
<body>
  ${body}
</body>
</html>`;
}

function renderHome() {
  return pageLayout({
    title: "PixelCut Lite | 在线图片去背景工具",
    description:
      "上传图片后自动去背景，支持预览和下载透明 PNG，适合商品图、头像和内容封面素材。",
    body: `
    <main>
      <div class="container shell">
        <header class="topbar">
          <div>
            <div class="brand-mark">PixelCut Lite</div>
            <div class="brand-note">更像正式产品页的在线抠图工具，打开就能上传，处理后直接下载透明 PNG。</div>
          </div>
          <nav class="nav">
            <a href="#tool">开始抠图</a>
            <a href="#how-it-works">使用流程</a>
            <a href="#faq">常见问题</a>
            <a href="/privacy">隐私说明</a>
            <a class="pill-btn" href="/faq">帮助中心</a>
          </nav>
        </header>

        <section class="hero">
          <div>
            <div class="badge">在线智能去背景 · 实时预览 · 透明 PNG 下载</div>
            <h1>一键去除图片背景，让商品图和人物图更干净</h1>
            <p class="lead">上传一张图片，自动完成抠图，几秒内返回透明背景 PNG。适合电商主图、头像、封面素材、海报元素和各类营销内容制作。</p>
            <div class="button-row" style="margin-top: 28px;">
              <a class="primary-btn" href="#tool">立即上传图片</a>
              <a class="ghost-btn" href="/privacy">查看隐私说明</a>
            </div>
            <div class="stats">
              <div class="stat"><b>支持格式</b><span>JPG / PNG / WebP</span></div>
              <div class="stat"><b>最大大小</b><span>单张 10MB</span></div>
              <div class="stat"><b>输出结果</b><span>透明背景 PNG</span></div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="ribbon">示例效果</div>
            <div class="preview-grid">
              <article class="preview-card">
                <h3>原图</h3>
                <div class="inner">
                  <div class="frame"><img src="/hero-before.svg" alt="抠图前示例" /></div>
                </div>
              </article>
              <article class="preview-card">
                <h3>去背景后</h3>
                <div class="inner">
                  <div class="frame"><img src="/hero-after.svg" alt="抠图后示例" /></div>
                </div>
              </article>
            </div>
            <div class="meta-grid preview-meta">
              <div class="meta-card"><b>边缘更干净</b><span>适合二次排版、商品图展示和海报设计。</span></div>
              <div class="meta-card"><b>流程更直接</b><span>上传、处理、预览、下载，4 步完成。</span></div>
              <div class="meta-card"><b>没有登录门槛</b><span>当前 MVP 不做复杂账号流程，体验更轻。</span></div>
            </div>
          </div>
        </section>

        <section id="tool" class="tool">
          <div>
            <div class="section-kicker">在线抠图体验版</div>
            <h2>上传图片后，一键完成去背景</h2>
            <p class="copy">先上传原图，系统会自动处理并返回透明背景结果。你可以当场预览，确认无误后再下载 PNG。</p>

            <label class="dropzone" id="dropzone">
              <input id="fileInput" class="hidden-input" type="file" accept="image/jpeg,image/png,image/webp" />
              <div class="drop-icon">✦</div>
              <p><strong>拖拽图片到这里</strong></p>
              <p>或者点击上传本地图片</p>
              <div class="hint">支持 JPG、PNG、WebP，单张不超过 10MB。</div>
            </label>

            <div class="meta-grid" style="margin-top: 16px; grid-template-columns: repeat(3, minmax(0, 1fr));">
              <div class="meta-card"><b>上传格式</b><span>JPG / PNG / WebP</span></div>
              <div class="meta-card"><b>大小限制</b><span>最大 10MB</span></div>
              <div class="meta-card"><b>输出文件</b><span>透明背景 PNG</span></div>
            </div>

            <div class="button-row" style="margin-top: 16px;">
              <button class="primary-btn" id="pickBtn" type="button">选择图片</button>
              <button class="secondary-btn" id="removeBtn" type="button">开始抠图</button>
              <button class="ghost-btn" id="resetBtn" type="button">重新选择</button>
              <button class="ghost-btn" id="downloadBtn" type="button" style="display:none;">下载 PNG</button>
            </div>

            <div class="status-card">
              <b>当前状态</b>
              <p id="statusText">上传一张图片后即可开始抠图。</p>
              <p id="statusMeta" style="margin-top: 8px; font-size: 13px;"></p>
              <div id="statusError" class="error"></div>
            </div>
          </div>

          <div class="preview-shell">
            <div class="preview-box">
              <h3>原图预览</h3>
              <div class="preview-stage source" id="sourcePreview">上传图片后，这里会显示原图。</div>
            </div>
            <div class="preview-box">
              <h3>抠图结果</h3>
              <div class="preview-stage result" id="resultPreview">处理完成后，这里会显示透明背景结果。</div>
            </div>
          </div>
        </section>

        <section class="feature-grid">
          <article class="feature-card"><h3>一键抠图</h3><p>上传图片后自动去背景，适合商品图、头像、海报素材和内容封面，流程简单直接。</p></article>
          <article class="feature-card"><h3>透明 PNG 下载</h3><p>处理完成后可直接预览并下载透明背景 PNG，方便继续做设计、排版和二次创作。</p></article>
          <article class="feature-card"><h3>轻量快速</h3><p>当前版本聚焦最核心的单图处理体验，不做复杂账号系统，打开页面就能开始使用。</p></article>
        </section>

        <section class="section-grid">
          <div class="section-card">
            <div class="brand-mark" style="font-size: 12px;">适用场景</div>
            <h2 class="section-title">适合需要高频抠图的常见内容工作流</h2>
            <div class="use-grid">
              <div class="use-item"><span class="ok-dot">OK</span><span>电商商品主图与详情图</span></div>
              <div class="use-item"><span class="ok-dot">OK</span><span>个人头像与职业形象照</span></div>
              <div class="use-item"><span class="ok-dot">OK</span><span>海报、PPT、短视频封面素材</span></div>
              <div class="use-item"><span class="ok-dot">OK</span><span>社媒内容配图与广告创意</span></div>
            </div>
          </div>

          <section id="how-it-works" class="dark-panel">
            <div class="brand-mark" style="color:#7dd3fc;">使用流程</div>
            <h2 class="section-title" style="color:#fff;">三步完成在线抠图</h2>
            <div class="steps">
              <article class="step-card"><div class="step-no">01</div><h3>上传图片</h3><p>支持 JPG、PNG、WebP，单张图片大小最高 10MB。</p></article>
              <article class="step-card"><div class="step-no">02</div><h3>自动去背景</h3><p>服务端调用 remove.bg 处理图片，并返回透明背景结果。</p></article>
              <article class="step-card"><div class="step-no">03</div><h3>预览并下载</h3><p>处理完成后可直接在页面查看效果，再保存透明 PNG。</p></article>
            </div>
          </section>
        </section>

        <section id="faq" class="faq-shell">
          <div>
            <div class="brand-mark">常见问题</div>
            <h2 class="section-title">关于这个在线抠图工具，你可能想先了解这些</h2>
            <p class="copy">如果你想进一步了解数据处理方式和能力边界，可以继续查看 FAQ 和隐私说明页。</p>
            <div class="button-row" style="margin-top: 18px;">
              <a class="primary-btn" href="/faq">打开 FAQ</a>
              <a class="ghost-btn" href="/privacy">查看隐私说明</a>
            </div>
          </div>
          <div class="faq-list">
            <details class="faq-item"><summary>支持哪些图片格式？</summary><p>目前支持 JPG、JPEG、PNG、WebP，单张图片大小不超过 10MB。</p></details>
            <details class="faq-item"><summary>会保存我上传的图片吗？</summary><p>当前 MVP 不会长期保存上传图和处理结果，图片仅在请求处理过程中使用。</p></details>
            <details class="faq-item"><summary>为什么有时会处理失败？</summary><p>通常是因为文件格式不支持、图片太大、网络波动，或 remove.bg 上游接口暂时异常。</p></details>
            <details class="faq-item"><summary>适合哪些使用场景？</summary><p>适合商品抠图、人物头像、海报元素提取、封面素材制作等需要透明背景的场景。</p></details>
          </div>
        </section>

        <section class="banner">
          <div>
            <div class="brand-mark">现在开始</div>
            <h2>上传一张图片，马上试试实际抠图效果</h2>
            <p>当前版本先把最关键的体验做完整：上传、去背景、预览、下载，不加多余步骤。</p>
          </div>
          <div class="button-row" style="margin-top: 18px;">
            <a class="primary-btn" href="#tool">立即开始</a>
          </div>
        </section>

        <footer class="footer">
          <div>© 2026 PixelCut Lite. 一个轻量、直接、好上手的在线抠图 MVP。</div>
          <div class="footer-links">
            <a href="/privacy">隐私说明</a>
            <a href="/faq">FAQ</a>
            <a href="#tool">开始抠图</a>
          </div>
        </footer>
      </div>
    </main>
    <script src="/app.js"></script>
    `,
  });
}

function renderFaq() {
  return pageLayout({
    title: "FAQ | PixelCut Lite",
    description: "在线抠图工具常见问题。",
    isSimple: true,
    body: `
    <main class="simple-page">
      <div class="container shell">
        <header class="topbar">
          <div>
            <div class="brand-mark">PixelCut Lite</div>
            <div class="brand-note">在线图片去背景工具</div>
          </div>
          <nav class="nav">
            <a href="/">首页</a>
            <a href="/privacy">隐私说明</a>
          </nav>
        </header>
        <section class="section-card">
          <div class="brand-mark">帮助中心</div>
          <h1>常见问题 FAQ</h1>
          <ul>
            <li><strong>支持格式：</strong>JPG、JPEG、PNG、WebP，单张图片最大 10MB。</li>
            <li><strong>输出格式：</strong>处理完成后返回透明背景 PNG。</li>
            <li><strong>为什么失败：</strong>可能是文件过大、格式不支持、网络波动，或 remove.bg 上游异常。</li>
            <li><strong>是否需要登录：</strong>当前版本不需要登录，打开即可使用。</li>
          </ul>
        </section>
      </div>
    </main>
    `,
  });
}

function renderPrivacy() {
  return pageLayout({
    title: "隐私说明 | PixelCut Lite",
    description: "在线抠图工具隐私说明。",
    isSimple: true,
    body: `
    <main class="simple-page">
      <div class="container shell">
        <header class="topbar">
          <div>
            <div class="brand-mark">PixelCut Lite</div>
            <div class="brand-note">在线图片去背景工具</div>
          </div>
          <nav class="nav">
            <a href="/">首页</a>
            <a href="/faq">FAQ</a>
          </nav>
        </header>
        <section class="section-card">
          <div class="brand-mark">隐私说明</div>
          <h1>我们如何处理你的图片</h1>
          <p>当前 MVP 不会长期保存你上传的图片或处理结果。图片仅在你发起处理请求时使用，并转发给 remove.bg 完成背景去除。</p>
          <p>如果上游服务异常，页面会返回错误提示；如果你担心敏感内容，建议不要上传包含高敏感信息的图片。</p>
          <p>后续如果产品增加账号体系、历史记录或云端存储，我们会同步更新隐私说明。</p>
        </section>
      </div>
    </main>
    `,
  });
}

function serveStatic(reqPath, res) {
  const map = {
    "/site.css": { file: path.join(ROOT, "site.css"), type: "text/css; charset=utf-8" },
    "/app.js": { file: path.join(ROOT, "app.js"), type: "application/javascript; charset=utf-8" },
    "/hero-before.svg": { file: path.join(PUBLIC_DIR, "hero-before.svg"), type: "image/svg+xml" },
    "/hero-after.svg": { file: path.join(PUBLIC_DIR, "hero-after.svg"), type: "image/svg+xml" },
  };

  const item = map[reqPath];
  if (!item) return false;

  fs.readFile(item.file, (error, data) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }

    send(res, 200, data, item.type, { "Cache-Control": "no-store" });
  });

  return true;
}

function parseMultipart(buffer, boundary) {
  const boundaryText = `--${boundary}`;
  const text = buffer.toString("latin1");
  const parts = text.split(boundaryText).slice(1, -1);
  const files = [];

  for (const part of parts) {
    const trimmed = part.replace(/^\r\n/, "");
    const index = trimmed.indexOf("\r\n\r\n");
    if (index === -1) continue;

    const rawHeaders = trimmed.slice(0, index);
    const bodyText = trimmed.slice(index + 4).replace(/\r\n$/, "");
    const nameMatch = /name="([^"]+)"/.exec(rawHeaders);
    const fileNameMatch = /filename="([^"]*)"/.exec(rawHeaders);
    const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(rawHeaders);
    const data = Buffer.from(bodyText, "latin1");

    files.push({
      name: nameMatch ? nameMatch[1] : "",
      filename: fileNameMatch ? fileNameMatch[1] : "",
      type: typeMatch ? typeMatch[1].trim() : "application/octet-stream",
      data,
    });
  }

  return files;
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_FILE_SIZE + 1024 * 1024) {
        reject(new Error("上传文件过大"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function handleRemoveBg(req, res) {
  if (!REMOVE_BG_API_KEY) {
    sendJson(res, 500, {
      error: "服务端未配置 remove.bg Key",
      details: "请先在 .env.local 中配置 REMOVE_BG_API_KEY。",
    });
    return;
  }

  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = /boundary=(.+)$/.exec(contentType);
  if (!boundaryMatch) {
    sendJson(res, 400, {
      error: "请求格式不正确",
      details: "请使用 multipart/form-data 上传图片。",
    });
    return;
  }

  try {
    const body = await collectBody(req);
    const parts = parseMultipart(body, boundaryMatch[1]);
    const image = parts.find((part) => part.name === "image_file" && part.filename);

    if (!image) {
      sendJson(res, 400, {
        error: "缺少图片文件",
        details: "请通过 image_file 字段上传图片。",
      });
      return;
    }

    if (!ACCEPTED_TYPES.has(image.type)) {
      sendJson(res, 400, {
        error: "文件格式不支持",
        details: "目前支持 JPG、PNG、WebP。",
      });
      return;
    }

    if (image.data.length > MAX_FILE_SIZE) {
      sendJson(res, 400, {
        error: "文件过大",
        details: "当前版本仅支持 10MB 以内的图片。",
      });
      return;
    }

    const upstream = new FormData();
    upstream.append("image_file", new Blob([image.data], { type: image.type }), image.filename || "upload-image");
    upstream.append("size", "auto");
    upstream.append("format", "png");

    const upstreamResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: upstream,
    });

    if (!upstreamResponse.ok) {
      let details = `remove.bg returned status ${upstreamResponse.status}`;
      const upstreamType = upstreamResponse.headers.get("content-type") || "";
      if (upstreamType.includes("application/json")) {
        const data = await upstreamResponse.json().catch(() => null);
        const first = data && data.errors && data.errors[0];
        if (first) {
          details = [first.title, first.detail].filter(Boolean).join(" - ");
        }
      } else {
        const text = await upstreamResponse.text().catch(() => "");
        if (text) details = text.slice(0, 300);
      }

      sendJson(res, 502, {
        error: "抠图失败",
        details,
      });
      return;
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    send(res, 200, Buffer.from(arrayBuffer), "image/png", {
      "Content-Disposition": 'inline; filename="removed-background.png"',
      "Cache-Control": "no-store",
    });
  } catch (error) {
    sendJson(res, 500, {
      error: "服务异常",
      details: error && error.message ? error.message : "图片暂时无法处理，请稍后再试。",
    });
  }
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), "application/json; charset=utf-8", { "Cache-Control": "no-store" });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (serveStatic(pathname, res)) {
    return;
  }

  if (req.method === "GET" && pathname === "/") {
    send(res, 200, renderHome());
    return;
  }

  if (req.method === "GET" && pathname === "/faq") {
    send(res, 200, renderFaq());
    return;
  }

  if (req.method === "GET" && pathname === "/privacy") {
    send(res, 200, renderPrivacy());
    return;
  }

  if (req.method === "POST" && pathname === "/api/remove-bg") {
    handleRemoveBg(req, res);
    return;
  }

  send(res, 404, pageLayout({
    title: "404 | PixelCut Lite",
    description: "页面不存在",
    body: `<main class="simple-page"><div class="container shell"><section class="section-card"><h1>页面不存在</h1><p>你访问的页面没有找到，返回首页继续使用抠图工具。</p><div class="button-row" style="margin-top:16px;"><a class="primary-btn" href="/">返回首页</a></div></section></div></main>`,
  }));
});

server.listen(PORT, HOST, () => {
  console.log(`PixelCut Lite running on http://${HOST}:${PORT}`);
});
