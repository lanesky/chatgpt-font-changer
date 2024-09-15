// content.js
console.log("Content script loaded and running");

// 创建面板的函数
function createPanel() {
    // 创建iframe来隔离样式
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("panel.html");
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.left = "20px";
    iframe.style.width = "200px";
    iframe.style.height = "100px";
    iframe.style.border = "none";
    iframe.style.zIndex = "1000";
    iframe.style.background = "transparent";
    document.body.appendChild(iframe);
  }
  
  // 调用创建面板的函数
  createPanel();
  
  // 监听来自面板的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message);
    if (message.enabled !== undefined && message.selectedFont) {
    //   假设 ChatGPT 的聊天容器有一个具体的类名，请根据实际情况修改选择器
      const chatContainer = document.querySelector("html"); 
      if (chatContainer) {
        if (message.enabled) {
          chatContainer.style.fontFamily = `"${message.selectedFont}", sans-serif`;
        } else {
          chatContainer.style.fontFamily = "";
        }
      }
    }

    // 返回响应以防止出现 "The message port closed before a response was received."
  sendResponse({ status: "Font applied successfully" });
  
  // 返回 true 以使得 sendResponse 异步执行
  return true;
  });
  