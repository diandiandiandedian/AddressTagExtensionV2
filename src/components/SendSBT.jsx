import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi'
import abiJSON from '../abi/AddressTagSBT.json'
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
]

export const SendSBT = () => {
  const { data: simulateData } = useSimulateContract({
    address: '0x2EC5CfDE6F37029aa8cc018ED71CF4Ef67C704AE',
    abi: abi,
    functionName: 'mintAddressTagSBT',
    args: ['0xA552c195A6eEC742B61042531fb92732F8A91D6b', 0n],
  })

  const { writeContract, data, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    })

  const handleMint = () => {
    if (simulateData) {
      writeContract(simulateData.request)
    }
  }

  return (
    <div>
      <p>Tag with SBT</p>
      <button disabled={!simulateData || isPending || isConfirming} onClick={handleMint}>
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
  )
}