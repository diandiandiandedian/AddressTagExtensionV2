import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ContentApp = () => {
    const [tags, setTags] = useState([]);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        console.log('aaaaaa')
        // 提取地址
        const extractedAddress = getAddressFromURL();
        if (!extractedAddress) return;

        setAddress(extractedAddress);

        // 请求标签数据
        sendPostRequest('https://testapi.ezswap.io/addressTag/queryAddressTagList', { address: extractedAddress }, (error, response) => {
            if (error) {
                console.error('请求失败:', error);
                return;
            }

            const contentList = response.data || [];
            setTags(contentList);
        });

        // 监听来自 popup.js 的消息
        chrome.runtime.onMessage.addListener((request) => {
            if (request.type === 'addTag') {
                setTags((prevTags) => [...prevTags, { content: request.content, link: request.link }]);
            }
        });
    }, []);

    const getAddressFromURL = () => {
        const currentURL = window.location.href;
        const match = currentURL.match(/\/address\/(0x[a-fA-F0-9]{40})/);
        return match ? match[1] : null;
    };

    const sendPostRequest = (url, data, callback) => {
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
    };

    return (
        <div>
            {tags.map((tag, index) => (
                <div key={index} style={{ display: 'inline-block', padding: '5px 15px', margin: '5px', borderRadius: '20px', backgroundColor: '#4caf50', color: '#fff', fontSize: '14px', fontWeight: 'bold', boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)', cursor: tag.link ? 'pointer' : 'default', textDecoration: tag.link ? 'underline' : 'none' }}
                     onClick={() => tag.link && window.open(tag.link, '_blank')}
                >
                    {tag.content}
                </div>
            ))}
            <button
                onClick={() => chrome.runtime.sendMessage({ type: 'openPopup' })}
                style={{ backgroundColor: '#ff5722', color: '#fff', padding: '5px 15px', margin: '5px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', border: 'none' }}>
                Add New
            </button>
        </div>
    );
};

// 在目标位置渲染 React 组件
const targetElement = document.querySelector('section.container-xxl');
if (targetElement) {
    const container = document.createElement('div');
    targetElement.appendChild(container);
    ReactDOM.render(<ContentApp />, container);
}
