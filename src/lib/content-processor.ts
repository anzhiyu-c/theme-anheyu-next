/**
 * 内容处理器
 * 保存文章时对 HTML 进行后处理，确保输出与 anheyu-pro 后端兼容
 * 参考 anheyu-pro useContentProcessor.ts
 */

/**
 * 处理保存时的 HTML
 * @param html 编辑器输出的原始 HTML
 * @returns 处理后的 HTML
 */
export function processHtmlForSave(html: string): string {
  if (!html || typeof window === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  // 1. 表格包裹 div.table-container
  doc.querySelectorAll("table").forEach(table => {
    if (table.parentElement?.classList.contains("table-container")) return;
    const container = document.createElement("div");
    container.className = "table-container";
    if (table.parentNode) {
      table.parentNode.insertBefore(container, table);
      container.appendChild(table);
    }
  });

  // 2. 图片懒加载：使用浏览器原生 loading="lazy"
  //    不再将 src 替换为占位图（旧方案依赖 IntersectionObserver 存在 SSR 水合时序问题）
  doc.querySelectorAll("img").forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("data:")) {
      img.setAttribute("loading", "lazy");
    }
  });

  // 3. PreserveHTML 恢复：将 wrapper 还原为原始 HTML
  doc.querySelectorAll("div.preserve-html-wrapper[data-html]").forEach(wrapper => {
    const originalHtml = wrapper.getAttribute("data-html");
    if (originalHtml) {
      const temp = document.createElement("div");
      temp.innerHTML = originalHtml;
      // 用原始 HTML 替换 wrapper
      while (temp.firstChild) {
        wrapper.parentNode?.insertBefore(temp.firstChild, wrapper);
      }
      wrapper.remove();
    }
  });

  // 4. Mermaid 占位处理：保留源码
  doc.querySelectorAll("div[data-mermaid-code]").forEach(div => {
    const code = div.getAttribute("data-mermaid-code") || "";
    if (code) {
      // 保留 data-mermaid-code 属性以便重新渲染
      // 同时保留 pre > code.language-mermaid 作为回退
      const pre = div.querySelector("pre");
      if (!pre) {
        const newPre = document.createElement("pre");
        const newCode = document.createElement("code");
        newCode.className = "language-mermaid";
        newCode.textContent = code;
        newPre.appendChild(newCode);
        div.innerHTML = "";
        div.appendChild(newPre);
      }
    }
  });

  // 5. KaTeX 公式：确保 data-latex 属性保留
  doc.querySelectorAll("[data-type='math-block']").forEach(el => {
    const latex = el.getAttribute("data-latex") || "";
    if (latex) {
      el.setAttribute("data-latex", latex);
    }
  });
  doc.querySelectorAll("[data-type='math-inline']").forEach(el => {
    const latex = el.getAttribute("data-latex") || "";
    if (latex) {
      el.setAttribute("data-latex", latex);
    }
  });

  return doc.body.innerHTML;
}
