import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('');
    const [selectedTx, setSelectedTx] = useState(null);
    const [tags] = useState([
        "项目方地址", "白客", "黑客", "Whale Trader", "Malicious Actor",
        "Whale Holder", "Arbitrage Trader", "Airdrop Hunter", "Long-term Holder",
        "NFT Collector", "Bot Address", "DeFi Enthusiast", "Newbie Address",
        "Miner Address", "Airdrop Distributor", "DEX Liquidity Provider"
    ]);
    const [selectedTag, setSelectedTag] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');

    // 保留两个入口
    useEffect(() => {
        console.log('addressaaaaaaaaa')
        const queryParams = new URLSearchParams(window.location.search);
        const address = queryParams.get('address');
        setCurrentAddress(address);

        if (address) {
            console.log('address', address)
            fetchTransactionData(address);
        }
    }, []);

    function getAddressFromURL(url) {
        const match = url.match(/\/address\/(0x[a-fA-F0-9]{40})/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    useEffect(() => {
        console.log('addressaaaaaaaabbbbbbba')
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            console.log('url', url)
            const address = getAddressFromURL(url);
            console.log('url', address)
            if (address) {
                setCurrentAddress(address);
                fetchTransactionData(address);
            }
        });
    }, []);

    const fetchTransactionData = async (address) => {
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=IGT34AFR7ABQUKYEWJAQ65A1Y5JV11UYH4`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "1" && data.result) {
                setTransactions(data.result);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

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

    const handleSave = () => {
        if (!content) {
            alert("Content is required.");
            return;
        }

        if (!selectedTag) {
            alert("请选择一个标签");
            return;
        }

        const transactionLink = `https://etherscan.io/tx/${selectedTx.hash}`;
        const payload = {
            content,
            link: transactionLink,
            address: currentAddress,
            tag: selectedTag
        };

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'addTag',
                content: payload.content,
                link: payload.link,
                address: payload.address
            });
        });

        // sendPostRequest('https://testapi.ezswap.io/addressTag/save', {address: currentAddress, content: content,link: transactionLink,tag: selectedTag}, (error, response) => {
        sendPostRequest('http://localhost:8085/addressTag/save', {address: currentAddress, content: content,link: transactionLink,tag: selectedTag}, (error, response) => {
            if (error) {
                console.error('请求失败:', error);
                return;
            }
        });

        setContent('');
        setLink('');
        alert(`已保存: ${selectedTag}`);
        // window.close();
    };

    // 截取字符串前3位和后3位，中间使用省略号
    const shortenAddress = (address) => {
        return address.length > 6 ? `${address.substring(0, 6)}...${address.substring(address.length - 6)}` : address;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {!selectedTx ? (
                <div>
                    <h2>Tx List</h2>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '5px' }}>Hash</th>
                                <th style={{ textAlign: 'left', padding: '5px' }}>Address</th>
                                <th style={{ textAlign: 'left', padding: '5px' }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.hash} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '5px' }}>{shortenAddress(tx.hash)}</td>
                                    <td style={{ padding: '5px' }}>
                                        {shortenAddress(tx.from === currentAddress.toLowerCase() ? tx.to : tx.from)}
                                    </td>
                                    <td style={{ padding: '5px' }}>
                                        <button
                                            onClick={() => setSelectedTx(tx)}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#4caf50',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Add Tag
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Choose Tag</h2>
                    <div>
                        {tags.map(tag => (
                            <div
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                style={{
                                    display: 'inline-block',
                                    padding: '5px 10px',
                                    margin: '5px',
                                    borderRadius: '20px',
                                    backgroundColor: selectedTag === tag ? '#4caf50' : '#ccc',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <label htmlFor="contentInput">Content:</label>
                        <input
                            type="text"
                            id="contentInput"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter content"
                            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '5px',borderRadius: '5px', marginTop:'3px',border:"1px solid" }}
                        />
                        <button
                            onClick={handleSave}
                            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#5cb85c', color: 'white',borderRadius: '5px',border:"none" }}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
