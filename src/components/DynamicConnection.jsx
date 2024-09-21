import { DynamicContextProvider, useEmbeddedWallet,DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core';
import { EmbeddedWalletChainEnum } from '@dynamic-labs/sdk-api-core';

const DynamicConnection = () => {
    const { createEmbeddedWalletAccount} = useEmbeddedWallet();

    createEmbeddedWalletAccount({ chain: EmbeddedWalletChainEnum.Evm }).then((res)=>console.log(res));
    

    
    return (<DynamicEmbeddedWidget background="default" /> );
}
 
export default DynamicConnection;