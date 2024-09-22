import React, {useState, useEffect} from 'react';
import {useWriteContract, useWaitForTransactionReceipt, useSimulateContract} from 'wagmi'
import {useEmbeddedWallet} from "@dynamic-labs/sdk-react-core";

const abi = [
    {
        "type": "function",
        "name": "mintAddressTagSBT",
        "inputs": [
            {
                "name": "target",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
];

const Popup = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('');
    const [selfAddress, setSelfAddress] = useState('');
    const [otherAddress, setOtherAddress] = useState('');
    const [selectedTx, setSelectedTx] = useState(null);
    const [tags] = useState([
        "Founder", "White Hat", "Hacker", "Whale Trader", "Malicious Actor",
        "Whale Holder", "Arbitrage Trader", "Airdrop Hunter", "Long-term Holder",
        "NFT Collector", "Bot Address", "DeFi Enthusiast", "Newbie Address",
        "Miner Address", "Airdrop Distributor", "DEX Liquidity Provider"
    ]);
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedTagColor, setSelectedTagColor] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState([]);

    const result = useSimulateContract({
        address: '0xE35a7d016e9Cc957609ca0F50E846EcdcC7f7807',
        abi: abi,
        functionName: 'mintAddressTagSBT',
        args: [selfAddress, 0n],
    });
    console.log('result',result)

    const {data: simulateData} = useSimulateContract({
        address: '0xE35a7d016e9Cc957609ca0F50E846EcdcC7f7807',
        abi: abi,
        functionName: 'mintAddressTagSBT',
        args: [selfAddress, 0n],
    });

    useEffect(()=>{
        console.log(simulateData)
    },[simulateData])

    const {writeContract, data, error, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({
        hash: data,
    });

    const handleMint = () => {
        if (simulateData) {
            writeContract(simulateData.request);
        }
    };

    const {userHasEmbeddedWallet} = useEmbeddedWallet();

    // 预先加载图片列表
    const images = Array.from({length: 10}, (_, index) => `/heads/${index + 1}.png`);

    // 为每个标签生成一个随机图片，仅在首次渲染时生成
    const [tagImages] = useState(tags.map(() => images[Math.floor(Math.random() * images.length)]));

    // 颜色数组
    const tagColors = ['#0784c3', '#4caf50', '#FF0000','#cc9a0680'];

    // 保留两个入口
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const address = queryParams.get('address');
        setCurrentAddress(address);

        if (address) {
            fetchTransactionData(address);
        }
    }, []);

    function getAddressFromURL(url) {
        const match = url.match(/\/address\/(0x[a-fA-F0-9]{40})/);
        return match ? match[1] : null;
    }

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const url = tabs[0].url;
            const address = getAddressFromURL(url);
            if (address) {
                setCurrentAddress(address);
                fetchTransactionData(address);
            }
        });
    }, []);

    if (!userHasEmbeddedWallet()) {
        return <div style={{height:'100%',width:'100%',display:'flex',placeItems:'center',justifyContent:'center'}}>
            Please sign in to wallet
        </div>
    }

    const fetchTransactionData = async (address) => {
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=0xFc331e6254A3ABb0aE9a4A955973E01C7F2fE222&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=IGT34AFR7ABQUKYEWJAQ65A1Y5JV11UYH4`;

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
            alert("Please choose a tag");
            return;
        }

        const transactionLink = `https://sepolia.etherscan.io/tx/${selectedTx.hash}`;
        const payload = {
            content,
            link: transactionLink,
            address: currentAddress,
            tag: selectedTag
        };

        sendPostRequest('https://testapi.ezswap.io/addressTag/save', { address: otherAddress, content: content, link: transactionLink, tag: selectedTag }, (error, response) => {
            if (error) {
                console.error('Request Failed:', error);
                return;
            }
        });
        handleMint();

        setContent('');
        setLink('');
    };

    const shortenAddress = (address) => {
        return address.length > 6 ? `${address.substring(0, 6)}...${address.substring(address.length - 6)}` : address;
    };

    const goAddTag = (tx, selfAddress,_otherAddress) => {
        console.log('selfAddress',selfAddress)
        console.log('_otherAddress',_otherAddress)
        setSelectedTx(tx);
        setSelfAddress(selfAddress);
        setOtherAddress(_otherAddress);
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
        setSelectedTagColor(randomColor);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {!selectedTx ? (
                <div>
                    <h2 style={{ fontFamily: "Londrina Solid, Tofu", fontSize: '20px' }}>Tx List</h2>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', fontFamily: "Londrina Solid, Tofu" }}>
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
                                        {shortenAddress(tx.from === "0xFc331e6254A3ABb0aE9a4A955973E01C7F2fE222".toLowerCase() ? tx.to : tx.from)}
                                    </td>
                                    <td style={{ padding: '5px' }}>
                                        <button
                                            onClick={() => goAddTag(tx, tx.from === "0xFc331e6254A3ABb0aE9a4A955973E01C7F2fE222".toLowerCase() ? tx.from : tx.to,tx.from === "0xFc331e6254A3ABb0aE9a4A955973E01C7F2fE222".toLowerCase() ? tx.to : tx.from)}
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
                    <h2 style={{ fontFamily: "Londrina Solid, Tofu" }}>Choose Tag</h2>
                    <div>
                        {tags.map((tag, index) => (
                            <div
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '5px 10px',
                                    margin: '5px',
                                    borderRadius: '20px',
                                    backgroundColor: selectedTag === tag ? selectedTagColor : '#ccc',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontFamily: "Londrina Solid, Tofu"
                                }}
                            >
                                <img src={tagImages[index]} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                {tag}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', fontFamily: "Londrina Solid, Tofu" }}>
                        <label htmlFor="contentInput">Content:</label>
                        <input
                            type="text"
                            id="contentInput"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter content"
                            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '5px', borderRadius: '5px', marginTop: '3px', border: "1px solid" }}
                        />
                        <button
                            onClick={handleSave}
                            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#5cb85c', color: 'white', borderRadius: '5px', border: "none" }}>
                            {isConfirming ? 'Tagging...' : 'Tag'}
                        </button>
                        {isConfirmed && (
                            <div>
                                Successfully tagged the address!
                                <div>
                                    <a href={`https://testnet.airdao.io/explorer/tx/${data}`}>Explorer</a>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div>
                                An error occurred: {error.message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;
