// 主题切换功能 - 优化版本
(function () {
    "use strict";

    // 配置选项
    const CONFIG = {
        STORAGE_KEY: "theme",
        THEME_CLASS: "dark-theme",
        TRANSITION_DURATION: 300,
        DEFAULT_THEME: "light"
    };

    // 防闪烁：立即应用保存的主题
    // 防闪烁：立即应用保存的主题
    function applyThemeImmediately () {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? "dark" : CONFIG.DEFAULT_THEME);

        if (theme === "dark") {
            document.body.classList.add(CONFIG.THEME_CLASS);
        }
    }

    // 主题切换函数
    function toggleTheme () {
        try {
            const body = document.body;  // 改回使用body
            const currentTheme = getCurrentTheme();
            const newTheme = currentTheme === "light" ? "dark" : "light";

            // 添加过渡效果
            body.style.transition = `background-color ${CONFIG.TRANSITION_DURATION}ms ease, color ${CONFIG.TRANSITION_DURATION}ms ease`;

            if (newTheme === "dark") {
                body.classList.add(CONFIG.THEME_CLASS);
            } else {
                body.classList.remove(CONFIG.THEME_CLASS);
            }

            localStorage.setItem(CONFIG.STORAGE_KEY, newTheme);
            updateThemeIcon(newTheme);

            // 移除过渡效果
            setTimeout(() => {
                body.style.transition = "";
            }, CONFIG.TRANSITION_DURATION);

            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            }));

        } catch (error) {
            console.error('主题切换失败:', error);
        }
    }

    // 获取当前主题
    function getCurrentTheme () {
        return localStorage.getItem(CONFIG.STORAGE_KEY) || CONFIG.DEFAULT_THEME;
    }

    // 更新主题图标
    function updateThemeIcon (theme) {
        const lightIcon = document.querySelector(".light-icon");
        const darkIcon = document.querySelector(".dark-icon");

        if (!lightIcon || !darkIcon) {
            console.warn('主题图标元素未找到');
            return;
        }

        // 添加过渡效果
        [lightIcon, darkIcon].forEach(icon => {
            icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });

        if (theme === "dark") {
            // 暗色主题时显示太阳图标（表示可以切换到明亮主题）
            lightIcon.style.opacity = "1";
            lightIcon.style.transform = "rotate(0deg) scale(1)";
            darkIcon.style.opacity = "0";
            darkIcon.style.transform = "rotate(-180deg) scale(0.8)";
        } else {
            // 明亮主题时显示月亮图标（表示可以切换到暗色主题）
            lightIcon.style.opacity = "0";
            lightIcon.style.transform = "rotate(180deg) scale(0.8)";
            darkIcon.style.opacity = "1";
            darkIcon.style.transform = "rotate(0deg) scale(1)";
        }
    }

    // 监听系统主题变化
    function watchSystemTheme () {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // 只有在用户没有手动设置主题时才跟随系统
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(CONFIG.STORAGE_KEY)) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    applyTheme(newTheme);
                }
            });
        }
    }

    // 应用主题
    function applyTheme (theme) {
        const body = document.body;  // 改回使用body

        if (theme === "dark") {
            body.classList.add(CONFIG.THEME_CLASS);
        } else {
            body.classList.remove(CONFIG.THEME_CLASS);
        }

        updateThemeIcon(theme);
    }

    // 初始化主题
    function initTheme () {
        try {
            const savedTheme = getCurrentTheme();
            const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

            // 如果没有保存的主题，使用系统偏好
            const theme = localStorage.getItem(CONFIG.STORAGE_KEY) ||
                (systemPrefersDark ? "dark" : CONFIG.DEFAULT_THEME);

            // 确保主题状态正确（head脚本可能已经应用了）
            applyTheme(theme);

            // 如果是首次访问，保存检测到的主题偏好
            if (!localStorage.getItem(CONFIG.STORAGE_KEY)) {
                localStorage.setItem(CONFIG.STORAGE_KEY, theme);
            }

            // 绑定主题切换按钮事件（支持多种选择器）
            const selectors = [".theme-toggle", "#theme-toggle-btn", "[data-theme-toggle]"];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.addEventListener("click", toggleTheme);
                    element.setAttribute('aria-label', '切换主题');
                });
            });

            // 监听系统主题变化
            watchSystemTheme();

            // 添加键盘快捷键支持 (Ctrl/Cmd + Shift + T)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    toggleTheme();
                }
            });

        } catch (error) {
            console.error('主题初始化失败:', error);
        }
    }

    // 当 DOM 加载完成后完整初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }

    // 暴露 API 到全局作用域
    window.themeManager = {
        toggle: toggleTheme,
        getCurrentTheme,
        setTheme: applyTheme
    };

})();