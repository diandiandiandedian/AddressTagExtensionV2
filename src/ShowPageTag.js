// 提取地址的函数
function getAddressFromURL() {
    const currentURL = window.location.href;
    const match = currentURL.match(/\/address\/(0x[a-fA-F0-9]{40})/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

// 发送 POST 请求的函数，使用原生 XMLHttpRequest
function sendPostRequest(url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, JSON.parse(xhr.responseText));
            } else {
                callback(xhr.status, null);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

// 创建标签的函数，添加随机图标
function createTag(content, link) {
    // 预先定义随机图片的路径数组
    const images = Array.from({ length: 49 }, (_, index) => `https://web3gamefi.s3.us-west-2.amazonaws.com/${index + 1}.png`);

    // 从图片列表中随机选择一张图片
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const customDiv = document.createElement('div');
    customDiv.style.display = 'inline-flex'; // 使用 inline-flex 使其不独占一行
    customDiv.style.alignItems = 'center';   // 图片和文字垂直居中
    customDiv.style.padding = '5px 15px';
    customDiv.style.margin = '5px';
    customDiv.style.borderRadius = '20px';

    // 随机选择一个颜色
    const colors = ['#0784c3', '#4caf50', '#FF0000','#cc9a0680'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    customDiv.style.backgroundColor = randomColor;

    customDiv.style.color = '#fff';
    customDiv.style.fontSize = '14px';
    customDiv.style.fontWeight = 'bold';
    customDiv.style.boxShadow = '2px 2px 8px rgba(0, 0, 0, 0.2)';

    // 创建 img 元素并将其添加到 customDiv
    const imgElement = document.createElement('img');
    imgElement.src = randomImage;
    imgElement.alt = 'icon';
    imgElement.style.width = '30px';
    imgElement.style.height = '30px';
    imgElement.style.marginRight = '5px';
    customDiv.appendChild(imgElement);

    // 添加标签内容
    const contentText = document.createTextNode(content || '');
    customDiv.appendChild(contentText);

    if (link) {
        customDiv.style.cursor = 'pointer';
        customDiv.style.textDecoration = 'underline';
        customDiv.addEventListener('click', () => {
            window.open(link, '_blank');
        });
    }

    return customDiv;
}

// 创建 "Add New" 按钮的函数
function createAddNewButton() {
    const addNewButton = document.createElement('button');
    addNewButton.textContent = 'Add New';
    addNewButton.style.display = 'inline-block';
    addNewButton.style.padding = '5px 15px';
    addNewButton.style.margin = '5px';
    addNewButton.style.borderRadius = '20px';
    addNewButton.style.backgroundColor = '#ff5722';
    addNewButton.style.color = '#fff';
    addNewButton.style.border = 'none';
    addNewButton.style.cursor = 'pointer';
    addNewButton.style.fontSize = '14px';
    addNewButton.style.fontWeight = 'bold';
    const extractedAddress = getAddressFromURL();

    // 点击按钮时打开 Chrome 插件弹窗
    addNewButton.addEventListener('click', () => {
        // 发送消息到后台以打开插件弹窗
        chrome.runtime.sendMessage({ type: 'openPopup', currentAddress: extractedAddress });
    });

    return addNewButton;
}

// 等待页面加载完成
window.addEventListener('load', () => {
    const extractedAddress = getAddressFromURL();
    if (!extractedAddress) return;

    // 将 extractedAddress 发送给 popup.js
    chrome.runtime.sendMessage({ type: 'address', address: extractedAddress });

    // 加载时请求标签数据
    sendPostRequest('https://testapi.ezswap.io/addressTag/queryAddressTagList', { address: extractedAddress }, (error, response) => {
        if (error) {
            console.error('Request Failed:', error);
            return;
        }

        const contentList = response.data || [];
        const targetElement = document.querySelector('section.container-xxl');

        if (targetElement) {
            // 遍历并创建初始标签
            contentList.forEach(item => {
                const tag = createTag(item.content, item.link);
                targetElement.appendChild(tag);
            });
        }
    });

    // 添加消息监听，处理来自 popup.js 的数据
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'addTag') {
            const { content, link, address } = request;
            console.log('Received data:', content, link, address);

            const targetElement = document.querySelector('section.container-xxl');
            if (targetElement) {
                const newTag = createTag(content, link);

                // 在列表中的第一个位置插入新标签
                const addNewButton = document.querySelector('section.container-xxl > button');
                if (addNewButton) {
                    targetElement.insertBefore(newTag, addNewButton);
                } else {
                    targetElement.appendChild(newTag); // 如果找不到按钮，将新标签添加到最后
                }
            }
        }
    });
});
