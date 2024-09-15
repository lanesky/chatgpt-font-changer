// panel.js

// 常见字体列表（由于无法直接获取系统字体，此处使用常见字体）
const fonts = [
  "SimSun",         // 宋体
  "SimHei",         // 黑体
  "Microsoft YaHei",// 微软雅黑
  "Microsoft JhengHei", // 微软正黑体
  "KaiTi",          // 楷体
  "FangSong",       // 仿宋
  "DengXian",
  "Meiryo",
  "Arial",
  "Tahoma",
  "Verdana",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Palatino",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact"
  ];

  // 检测字体是否可用
  function isFontAvailable(font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const text = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // 设置字体为目标字体
    context.font = '72px monospace';
    const defaultWidth = context.measureText(text).width;

    // 设置字体为要检测的字体
    context.font = `72px "${font}", monospace`;
    const testWidth = context.measureText(text).width;

    return testWidth !== defaultWidth;
  }
  
  // 填充下拉列表
  const fontSelect = document.getElementById("font-select");
  fonts.forEach((font) => {
    if (isFontAvailable(font)) {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      fontSelect.appendChild(option);
    }
  });
  
 

  // Function to send message to content script
function sendMessageToContentScript(message) {
  // 获取当前激活的标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        console.log("Message sent to content script:", message);
      });
    }
  });
}

 // 加载存储的设置
 chrome.storage.sync.get(["enabled", "selectedFont"], (result) => {
  document.getElementById("enable-font").checked = result.enabled || false;
  if (result.selectedFont) {
    fontSelect.value = result.selectedFont;

    if (result.enabled) {
      sendMessageToContentScript({ enabled: true, selectedFont: fontSelect.value });
    }
  } 
  
});
  
  // 监听复选框变化
  document.getElementById("enable-font").addEventListener("change", (e) => {
    const enabled = e.target.checked;
    const selectedFont = fontSelect.value;
    chrome.storage.sync.set({ enabled, selectedFont });
    // 发送消息到内容脚本
    console.log("Sending message:", { enabled, selectedFont });
    // chrome.runtime.sendMessage({ enabled, selectedFont });
    sendMessageToContentScript({ enabled, selectedFont });
  });
  
  // 监听下拉列表变化
  document.getElementById("font-select").addEventListener("change", (e) => {
    const selectedFont = e.target.value;
    const enabled = document.getElementById("enable-font").checked;
    chrome.storage.sync.set({ selectedFont });
    // 发送消息到内容脚本
    console.log("Sending message:", { enabled, selectedFont });
    // chrome.runtime.sendMessage({ enabled, selectedFont });
    sendMessageToContentScript({ enabled, selectedFont });
  });


  