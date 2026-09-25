/** 油猴脚本使用的全部隔离样式。 */
export const style = `
.ppv-preview {
  position: fixed;
  z-index: 2147483646;
  display: none;
  overflow: hidden;
  padding: 0;
  border: 2px solid #0096fa;
  border-radius: 3px;
  background: rgba(0, 150, 250, .1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, .32);
  pointer-events: none;
}
.ppv-preview-visible { display: block; }
.ppv-preview-loading { background: rgba(24, 24, 24, .94); }
.ppv-preview-loading .ppv-preview-info { display: none; }
.ppv-preview-ready .ppv-preview-loading-panel { display: none; }
.ppv-preview-info {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 25px;
  overflow: hidden;
  color: #fff;
  background: #0096fa;
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  white-space: nowrap;
}
.ppv-preview-info span {
  flex: 0 0 auto;
  padding: 0 6px;
  overflow: hidden;
  font-size: 12px;
  line-height: 25px;
  text-overflow: ellipsis;
}
.ppv-preview-info .ppv-preview-title { flex-shrink: 1; }
.ppv-preview-media { display: block; width: 100%; height: auto; }
.ppv-preview-loading-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  min-height: 68px;
  padding: 12px;
  color: #fff;
  font: 13px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-preview-loading-text {
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ppv-preview-progress-track {
  height: 5px;
  overflow: hidden;
  border-radius: 3px;
  background: rgba(255, 255, 255, .25);
}
.ppv-preview-progress-bar {
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: #29b6f6;
  transition: width .12s linear;
}
.ppv-preview-progress-bar-indeterminate {
  width: 35%;
  animation: ppv-progress 1s ease-in-out infinite;
}
@keyframes ppv-progress {
  from { transform: translateX(-110%); }
  to { transform: translateX(300%); }
}
.ppv-toast-container {
  position: fixed;
  z-index: 2147483647;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.ppv-toast {
  max-width: 360px;
  padding: 10px 14px;
  border-radius: 6px;
  color: #fff;
  background: #333;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .25);
  font: 14px/1.4 Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  opacity: 1;
  transition: opacity .3s, transform .3s;
}
.ppv-toast-info { background: #0096fa; }
.ppv-toast-success { background: #00a878; }
.ppv-toast-error { background: #d64242; }
.ppv-toast-leave { opacity: 0; transform: translateY(-6px); }
.ppv-settings-backdrop {
  position: fixed;
  z-index: 2147483647;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .55);
  font-family: Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}
.ppv-settings-backdrop.is-open { display: flex; }
.ppv-settings-panel {
  box-sizing: border-box;
  width: min(420px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  color: #f4f4f4;
  background: #242424;
  box-shadow: 0 16px 50px rgba(0, 0, 0, .45);
}
.ppv-settings-form { display: contents; }
.ppv-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #3d3d3d;
  font-size: 17px;
}
.ppv-settings-close {
  padding: 2px 8px;
  border: 0;
  color: #bbb;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}
.ppv-settings-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}
.ppv-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #ddd;
  font-size: 14px;
}
.ppv-settings-checkbox-row { justify-content: flex-start; }
.ppv-settings-row input[type="number"],
.ppv-settings-row select {
  box-sizing: border-box;
  width: 150px;
  padding: 7px 9px;
  border: 1px solid #555;
  border-radius: 5px;
  color: #fff;
  background: #181818;
  font: inherit;
}
.ppv-settings-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #0096fa;
}
.ppv-settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #3d3d3d;
}
.ppv-settings-actions button {
  padding: 8px 14px;
  border: 0;
  border-radius: 5px;
  color: #eee;
  background: #484848;
  font: 14px/1.2 inherit;
  cursor: pointer;
}
.ppv-settings-actions .ppv-settings-save {
  color: #fff;
  background: #0096fa;
}
`

/** 将预览样式写入当前页面。 */
export function injectStyle(): void {
  const element = document.createElement('style')
  element.textContent = style
  document.head.append(element)
}
