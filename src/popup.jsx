import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [extractedAddress, setExtractedAddress] = useState(null);

    useEffect(() => {
        // 主动请求 extractedAddress
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'requestAddress' }, (response) => {
                if (response && response.address) {
                    setExtractedAddress(response.address);
                    console.log('Received extractedAddress from content script:', response.address);
                } else {
                    console.log('No address received from content script.');
                }
            });
        });
    }, []);

    const handleSave = () => {
        if (!content) {
            alert('Content is required.');
            return;
        }

        if (!extractedAddress) {
            alert('Address not received from contentScript.');
            return;
        }

        // 发送保存请求到 contentScript.js
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'addTag',
                content: content,
                link: link,
                address: extractedAddress,
            });
        });

        // 清空输入框
        setContent('');
        setLink('');
        window.close(); // 关闭插件窗口
    };

    const handleClose = () => {
        window.close();
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <label htmlFor="contentInput">Content:</label>
            <input
                type="text"
                id="contentInput"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '5px' }}
            />

            <label htmlFor="linkInput">Link (Optional):</label>
            <input
                type="text"
                id="linkInput"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter link (optional)"
                style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '5px' }}
            />

            <button
                onClick={handleSave}
                style={{ backgroundColor: '#5cb85c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginRight: '5px' }}
            >
                Save
            </button>
            <button
                onClick={handleClose}
                style={{ backgroundColor: '#d9534f', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
            >
                Close
            </button>
        </div>
    );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
