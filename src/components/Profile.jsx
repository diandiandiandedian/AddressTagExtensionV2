import DynamicConnection from "./DynamicConnection";
import { SendSBT } from "./SendSBT";
import WorldcoinConnection from "./WorldcoinConnection";

const Profile = () => {

    return (
        <div style={{padding:'10px'}}>
            <h1>Identity Tagger</h1>
            <DynamicConnection />
            <div style={{marginTop:'24px'}}></div>
            <WorldcoinConnection/>  
            <div style={{height:'100px',width:'100%'}}></div>

            {/* <SendSBT/> */}
        </div>  
    );
}
 
export default Profile;