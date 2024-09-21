import DynamicConnection from "./DynamicConnection";
import { SendSBT } from "./SendSBT";
import WorldcoinConnection from "./WorldcoinConnection";
import { useEmbeddedWallet } from "@dynamic-labs/sdk-react-core";

const Profile = () => {

    const {userHasEmbeddedWallet} = useEmbeddedWallet();

    // if(!userHasEmbeddedWallet()){
    //     return <div>
    //         Please sign in to wallet
    //     </div>
    // }

    return (
        <div>
            <h1>Hello from My Chrome Extension</h1>
            <DynamicConnection />
            <div style={{marginTop:'16px'}}></div>
            <WorldcoinConnection/>
            <SendSBT/>
        </div>  
    );
}
 
export default Profile;