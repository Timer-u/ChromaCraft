// Material Design 3 配色方案生成器
document.addEventListener("DOMContentLoaded", function () {
  const colorInput = document.getElementById("color-input");
  const generateBtn = document.getElementById("generate-btn");
  const schemeContainer = document.getElementById("scheme-container");
  const schemeSection = document.getElementById("scheme-section");
  const colorPreview = document.getElementById("color-preview");
  const themeToggle = document.getElementById("theme-toggle");

  // 初始化
  initializeApp();

  function initializeApp() {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      updateThemeIcon("light_mode");
    }

    // 生成默认配色方案
    generateScheme("#4A6FA5");

    // 绑定事件监听器
    bindEventListeners();
  }

  function bindEventListeners() {
    // 主题切换
    themeToggle.addEventListener("click", toggleTheme);

    // 输入颜色实时预览
    colorInput.addEventListener("input", handleColorInput);

    // 生成按钮点击事件
    generateBtn.addEventListener("click", handleGenerate);

    // 回车键触发生成
    colorInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleGenerate();
      }
    });

    // 添加涟漪效果到按钮
    document.querySelectorAll(".md3-button").forEach((button) => {
      button.addEventListener("click", createRipple);
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    updateThemeIcon(newTheme === "dark" ? "light_mode" : "dark_mode");
  }

  function updateThemeIcon(iconName) {
    themeToggle.querySelector(".material-symbols-rounded").textContent =
      iconName;
  }

  function handleColorInput() {
    const color = colorInput.value;
    if (isValidHex(color)) {
      updateColorPreview(color);
    }
  }

  function updateColorPreview(color) {
    colorPreview.style.backgroundColor = color;
    // 更新CSS变量以实现动态主题
    document.documentElement.style.setProperty("--md-sys-color-primary", color);
  }

  function handleGenerate() {
    const color = colorInput.value;
    if (isValidHex(color)) {
      generateScheme(color);
    } else {
      showError("请输入有效的十六进制颜色值，例如 #4A6FA5");
    }
  }

  function showError(message) {
    // Material Design 3 风格的错误提示
    const snackbar = document.createElement("div");
    snackbar.className = "md3-snackbar";
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    setTimeout(() => {
      snackbar.classList.add("md3-snackbar--visible");
    }, 10);

    setTimeout(() => {
      snackbar.classList.remove("md3-snackbar--visible");
      setTimeout(() => snackbar.remove(), 300);
    }, 3000);
  }

  function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("md3-ripple");

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // 验证十六进制颜色格式
  function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  // 生成并展示配色方案
  function generateScheme(primaryHex) {
    // 显示加载状态
    schemeSection.style.display = "block";
    schemeContainer.innerHTML =
      '<div class="md3-loading">正在生成配色方案...</div>';

    // 模拟计算过程
    setTimeout(() => {
      const scheme = generateColorScheme(primaryHex);
      renderScheme(scheme);
    }, 300);
  }

  // 渲染配色方案
  function renderScheme(scheme) {
    let html = "";

    // 定义颜色信息
    const colorInfo = [
      {
        name: "主色",
        key: "primary",
        desc: "品牌主色调，用于主要操作按钮",
        icon: "palette",
      },
      {
        name: "容器色",
        key: "primaryContainer",
        desc: "主色的浅色变体，用于容器背景",
        icon: "square",
      },
      {
        name: "次要色",
        key: "secondary",
        desc: "辅助色调，用于次要元素",
        icon: "brush",
      },
      {
        name: "次要容器色",
        key: "secondaryContainer",
        desc: "次要色的浅色变体",
        icon: "layers",
      },
      {
        name: "第三色",
        key: "tertiary",
        desc: "用于强调和装饰元素",
        icon: "auto_awesome",
      },
      {
        name: "错误色",
        key: "error",
        desc: "用于错误状态和警告",
        icon: "error",
      },
      {
        name: "表面色",
        key: "surface",
        desc: "用于卡片和容器背景",
        icon: "rectangle",
      },
      {
        name: "背景色",
        key: "background",
        desc: "应用程序背景色",
        icon: "wallpaper",
      },
    ];

    colorInfo.forEach((info) => {
      const color = scheme[info.key];
      const textColor = getTextColorForBackground(color);
      const contrastWhite = getContrastRatio(color, "#FFFFFF");
      const contrastBlack = getContrastRatio(color, "#000000");

      html += `
        <div class="md3-color-card">
          <div class="md3-color-card__display" style="background-color: ${color};">
            <span class="material-symbols-rounded" style="position: absolute; bottom: 12px; right: 12px; color: ${textColor}; font-size: 32px; opacity: 0.3;">
              ${info.icon}
            </span>
          </div>
          <div class="md3-color-card__content">
            <h4 class="md3-color-card__name">${info.name}</h4>
            <code class="md3-color-card__value">${color.toUpperCase()}</code>
            <p class="md3-color-card__description">${info.desc}</p>
            <div class="md3-color-card__contrast">
              <span class="md3-contrast-chip ${contrastWhite >= 4.5 ? "md3-contrast-chip--good" : "md3-contrast-chip--poor"}">
                <span class="material-symbols-rounded" style="font-size: 16px;">
                  ${contrastWhite >= 4.5 ? "check_circle" : "cancel"}
                </span>
                白色: ${contrastWhite.toFixed(2)}:1
              </span>
              <span class="md3-contrast-chip ${contrastBlack >= 4.5 ? "md3-contrast-chip--good" : "md3-contrast-chip--poor"}">
                <span class="material-symbols-rounded" style="font-size: 16px;">
                  ${contrastBlack >= 4.5 ? "check_circle" : "cancel"}
                </span>
                黑色: ${contrastBlack.toFixed(2)}:1
              </span>
            </div>
          </div>
        </div>
      `;
    });

    schemeContainer.innerHTML = html;

    // 添加动画效果
    setTimeout(() => {
      document.querySelectorAll(".md3-color-card").forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          card.style.transition = "all 0.3s ease";

          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        }, index * 50);
      });
    }, 100);
  }

  // 根据背景色计算文本颜色
  function getTextColorForBackground(bgColor) {
    const luminance = getRelativeLuminance(bgColor);
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  // 生成 Material Design 3 配色方案
  function generateColorScheme(primaryHex) {
    const primaryHSL = hexToHSL(primaryHex);

    return {
      primary: primaryHex,
      primaryContainer: generateTonalColor(primaryHSL, 90),
      secondary: generateSecondaryColor(primaryHSL),
      secondaryContainer: generateTonalColor(
        hexToHSL(generateSecondaryColor(primaryHSL)),
        90,
      ),
      tertiary: generateTertiaryColor(primaryHSL),
      error: "#BA1A1A",
      surface: generateNeutralColor(primaryHSL, 98),
      background: generateNeutralColor(primaryHSL, 99),
    };
  }

  // 生成色调颜色（用于容器色）
  function generateTonalColor(hsl, tone) {
    // Material Design 3 的色调系统
    const newL = tone; // tone 直接对应亮度百分比
    const newS = Math.max(10, hsl.s * (1 - (tone - 50) / 100)); // 高亮度时降低饱和度
    return hslToHex({ ...hsl, l: newL, s: newS });
  }

  // 生成次要色
  function generateSecondaryColor(primaryHSL) {
    // 使用类似色策略
    const hueShift = 30;
    const newH = (primaryHSL.h + hueShift) % 360;
    const newS = primaryHSL.s * 0.8; // 稍微降低饱和度
    return hslToHex({ h: newH, s: newS, l: primaryHSL.l });
  }

  // 生成第三色
  function generateTertiaryColor(primaryHSL) {
    // 使用互补色的邻近色
    const complementaryH = (primaryHSL.h + 180) % 360;
    const tertiaryH = (complementaryH + 30) % 360;
    const newS = primaryHSL.s * 0.7;
    return hslToHex({ h: tertiaryH, s: newS, l: primaryHSL.l });
  }

  // 生成中性色
  function generateNeutralColor(primaryHSL, tone) {
    // Material Design 3 的中性色带有轻微的色相
    const neutralS = 5; // 非常低的饱和度
    return hslToHex({ h: primaryHSL.h, s: neutralS, l: tone });
  }

  // 计算颜色对比度（WCAG 2.1标准）
  function getContrastRatio(color1, color2) {
    const luminance1 = getRelativeLuminance(color1);
    const luminance2 = getRelativeLuminance(color2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  // 计算相对亮度
  function getRelativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const rSRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gSRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bSRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;
  }

  // 颜色转换函数
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  function hexToHSL(hex) {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToHex(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
});

// 添加 Snackbar 样式
const style = document.createElement("style");
style.textContent = `
  .md3-snackbar {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    padding: 14px 16px;
    border-radius: var(--md-sys-shape-corner-extra-small);
    font: var(--md-sys-typescale-body-medium);
    box-shadow: var(--md-sys-elevation-level3);
    z-index: 1000;
    transition: transform 0.3s ease;
  }
  
  .md3-snackbar--visible {
    transform: translateX(-50%) translateY(0);
  }
  
  .md3-ripple {
    position: absolute;
    border-radius: 50%;
    background-color: currentColor;
    opacity: 0.2;
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  }
`;
document.head.appendChild(style);
