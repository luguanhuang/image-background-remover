(function () {
  const input = document.getElementById("fileInput");
  const pickBtn = document.getElementById("pickBtn");
  const removeBtn = document.getElementById("removeBtn");
  const resetBtn = document.getElementById("resetBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const dropzone = document.getElementById("dropzone");
  const sourcePreview = document.getElementById("sourcePreview");
  const resultPreview = document.getElementById("resultPreview");
  const statusText = document.getElementById("statusText");
  const statusMeta = document.getElementById("statusMeta");
  const statusError = document.getElementById("statusError");

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  let selectedFile = null;
  let sourceUrl = "";
  let resultUrl = "";

  function setStatus(text, meta, error) {
    statusText.textContent = text || "";
    statusMeta.textContent = meta || "";
    statusError.textContent = error || "";
  }

  function clearObjectUrls() {
    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
      sourceUrl = "";
    }
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      resultUrl = "";
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function setSourcePreview(file) {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    sourceUrl = URL.createObjectURL(file);
    sourcePreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = sourceUrl;
    img.alt = "原图预览";
    sourcePreview.appendChild(img);
  }

  function setResultPreview(blob) {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(blob);
    resultPreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = resultUrl;
    img.alt = "抠图结果";
    resultPreview.appendChild(img);
    downloadBtn.style.display = "inline-flex";
  }

  function resetAll() {
    clearObjectUrls();
    selectedFile = null;
    input.value = "";
    sourcePreview.textContent = "上传图片后，这里会显示原图。";
    resultPreview.textContent = "处理完成后，这里会显示透明背景结果。";
    downloadBtn.style.display = "none";
    setStatus("上传一张图片后即可开始抠图。", "", "");
  }

  function validateFile(file) {
    if (!file) {
      return "请先选择图片。";
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "请上传 JPG、PNG 或 WebP 格式图片。";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "当前版本仅支持 10MB 以内的图片。";
    }
    return "";
  }

  function applyFile(file) {
    const error = validateFile(file);
    if (error) {
      setStatus("文件校验失败", "", error);
      return;
    }

    selectedFile = file;
    setSourcePreview(file);
    resultPreview.textContent = "处理完成后，这里会显示透明背景结果。";
    downloadBtn.style.display = "none";
    setStatus("已选择图片，可以开始抠图。", file.name + " · " + formatFileSize(file.size), "");
  }

  pickBtn.addEventListener("click", function () {
    input.click();
  });

  resetBtn.addEventListener("click", function () {
    resetAll();
  });

  input.addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0];
    if (file) applyFile(file);
  });

  ["dragenter", "dragover"].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.remove("dragging");
    });
  });

  dropzone.addEventListener("drop", function (event) {
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) applyFile(file);
  });

  removeBtn.addEventListener("click", async function () {
    const error = validateFile(selectedFile);
    if (error) {
      setStatus("还没有开始处理", "", error);
      return;
    }

    removeBtn.disabled = true;
    removeBtn.textContent = "正在抠图...";
    setStatus("正在处理中，请稍等...", selectedFile.name + " · " + formatFileSize(selectedFile.size), "");

    try {
      const formData = new FormData();
      formData.append("image_file", selectedFile);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "当前图片暂时无法处理，请稍后再试。";
        try {
          const data = await response.json();
          message = [data.error, data.details].filter(Boolean).join("：");
        } catch (error2) {}
        setStatus("抠图失败", selectedFile.name + " · " + formatFileSize(selectedFile.size), message);
        return;
      }

      const blob = await response.blob();
      setResultPreview(blob);
      setStatus("抠图完成，可以预览或下载结果。", selectedFile.name + " · " + formatFileSize(selectedFile.size), "");
    } catch (error) {
      setStatus("网络异常", selectedFile.name + " · " + formatFileSize(selectedFile.size), "请检查网络连接后重试。");
    } finally {
      removeBtn.disabled = false;
      removeBtn.textContent = "开始抠图";
    }
  });

  downloadBtn.addEventListener("click", function () {
    if (!resultUrl || !selectedFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = selectedFile.name.replace(/\.[^.]+$/, "") + "-transparent.png";
    a.click();
  });

  window.addEventListener("beforeunload", function () {
    clearObjectUrls();
  });

  resetAll();
})();
