/**
 * 主题切换服务
 * 提供主题相关的 JavaScript 代码
 */

export const getThemeScript = (): string => {
  return `
// 主题切换功能
(function() {
  "use strict";

  // 主题切换函数
  function toggleTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    if (newTheme === "dark") {
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
    }
    
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  }

  // 更新主题图标
  function updateThemeIcon(theme) {
    const lightIcon = document.querySelector(".light-icon");
    const darkIcon = document.querySelector(".dark-icon");
    
    if (lightIcon && darkIcon) {
      if (theme === "dark") {
        // 暗色主题时显示太阳图标（表示可以切换到明亮主题）
        lightIcon.style.opacity = "1";
        lightIcon.style.transform = "rotate(0deg)";
        darkIcon.style.opacity = "0";
        darkIcon.style.transform = "rotate(-180deg)";
      } else {
        // 明亮主题时显示月亮图标（表示可以切换到暗色主题）
        lightIcon.style.opacity = "0";
        lightIcon.style.transform = "rotate(180deg)";
        darkIcon.style.opacity = "1";
        darkIcon.style.transform = "rotate(0deg)";
      }
    }
  }

  // 初始化主题（此时 DOM 已经完全加载）
  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const body = document.body;
    
    // 应用保存的主题
    if (savedTheme === "dark") {
      body.classList.add("dark-theme");
    }
    
    // 更新主题图标
    updateThemeIcon(savedTheme);
    
    // 绑定主题切换按钮事件
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme);
    }
  }

  // 立即初始化（因为脚本在 body 底部，DOM 已经加载完成）
  initTheme();

  // 暴露到全局作用域
  window.toggleTheme = toggleTheme;
})();
  `;
};

// 主题相关的配置
export const themeConfig = {
  cacheControl: 'public, max-age=3600',
  contentType: 'application/javascript'
};