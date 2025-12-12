// ==UserScript==
// @name         网页自动滚动插件 (通用)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可设置速度的网页自动滚动功能，适用于所有可滚动页面。
// @author       Gemini
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 核心插件代码 (CLASS)
    class AutoScroller {
        constructor() {
            this.timer = null;
            this.createControls();
        }

        // 创建控制面板的 HTML 结构
        createControls() {
            const controlsHtml = `
                <div id="auto-scroll-controls" style="
                    position: fixed; top: 20px; right: 20px;
                    padding: 15px; background: white; border: 1px solid #ccc;
                    border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    z-index: 99999; font-size: 14px; color: #333;
                    font-family: Arial, sans-serif;
                ">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px;">滚动控制</h4>
                    <label style="display: block; margin-bottom: 8px;">
                        速度 (像素/次):
                        <input type="number" id="speed-setting" value="2" min="1" style="width: 50px; padding: 3px; border: 1px solid #ddd; margin-left: 5px;">
                    </label>
                    <label style="display: block; margin-bottom: 12px;">
                        间隔 (毫秒):
                        <input type="number" id="interval-setting" value="30" min="10" style="width: 50px; padding: 3px; border: 1px solid #ddd; margin-left: 5px;">
                    </label>
                    <button id="start-scroll" style="width: 100%; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px; transition: background-color 0.2s;">开始滚动</button>
                    <button id="stop-scroll" disabled style="width: 100%; padding: 8px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;">停止滚动</button>
                </div>
            `;
            // 将控制面板添加到页面底部
            document.body.insertAdjacentHTML('beforeend', controlsHtml);

            // 获取元素并绑定事件
            this.speedInput = document.getElementById('speed-setting');
            this.intervalInput = document.getElementById('interval-setting');
            this.startBtn = document.getElementById('start-scroll');
            this.stopBtn = document.getElementById('stop-scroll');

            this.startBtn.addEventListener('click', () => this.start());
            this.stopBtn.addEventListener('click', () => this.stop());
        }

        scrollStep() {
            // 获取用户设置的每次滚动的像素数
            const scrollSpeed = parseInt(this.speedInput.value) || 2;

            // 检查是否已滚动到页面底部
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1;

            if (isAtBottom) {
                this.stop(); // 到底部则停止
                console.log("已滚动到页面底部，自动停止。");
                return;
            }

            // 执行滚动
            window.scrollBy(0, scrollSpeed);
        }

        start() {
            if (this.timer) { this.stop(); }

            // 获取用户设置的滚动间隔（毫秒）
            const interval = parseInt(this.intervalInput.value) || 30;

            this.timer = setInterval(() => this.scrollStep(), interval);

            // 更新按钮状态
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.stopBtn.style.opacity = '1';
            this.startBtn.style.opacity = '0.6';
            console.log(`自动滚动启动：速度 ${this.speedInput.value} 像素/次，间隔 ${interval} 毫秒。`);
        }

        stop() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
                // 更新按钮状态
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
                this.stopBtn.style.opacity = '0.6';
                this.startBtn.style.opacity = '1';
                console.log("自动滚动已停止。");
            }
        }
    }

    // 网页加载完成后实例化插件
    new AutoScroller();
})();