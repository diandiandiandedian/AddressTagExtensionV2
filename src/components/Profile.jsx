import DynamicConnection from "./DynamicConnection";
import { SendSBT } from "./SendSBT";
import WorldcoinConnection from "./WorldcoinConnection";

const Profile = () => {
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