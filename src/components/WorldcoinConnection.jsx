import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'

// TODO: Calls your implemented server route
// const verifyProof = async (proof) => {
//   throw new Error("TODO: verify proof server route")
// };

// TODO: Functionality after verifying
const onSuccess = () => {
  console.log("Success")
};

const verifyProof = async (proof) => {
    console.log('proof', proof);
    const response = await fetch(
      'https://developer.worldcoin.org/api/v1/verify/app_staging_129259332fd6f93d4fabaadcc5e4ff9d',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...proof, action: "test"}),
      }
    );
    if (response.ok) {
      const { verified } = await response.json();
      return verified;
    } else {
      const { code, detail } = await response.json();
      throw new Error(`Error Code ${code}: ${detail}`);
    }
  };

const WorldcoinConnection = () => {
    return ( 
    <IDKitWidget
        app_id="app_staging_29b110fe6e6cfb127bd111b21a70289a"
        action="verifynewhuman"
        false
        verification_level={VerificationLevel.Device}
        handleVerify={verifyProof}
        onSuccess={onSuccess}>
        {({ open }) => (
          <button
            onClick={open}
          >
            Verify with World ID
          </button>
        )}
    </IDKitWidget>);
}
 
export default WorldcoinConnection;