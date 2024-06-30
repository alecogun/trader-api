import { BaseProvider, HttpProvider, loadFromEnv, PostOrderRequestV2, WsProvider } from "@bloxroute/solana-trader-client-ts";
import axios from 'axios'

const config = loadFromEnv();

const MAINNET_API_NY_HTTP = process.env.MAINNET_API_NY_HTTP
const api_url = process.env.MAINNET_API_NY_HTTP

const provider = new HttpProvider(
    config.authHeader,
    config.privateKey,
    MAINNET_API_NY_HTTP,
)

// Get orderbook 
const getOrderbook = async (provider: BaseProvider) => {
    await console.info("Retrieving orderbook for SOLUSDC market")
    try {
        const req = await provider.getOrderbookV2({
        market: "SOLUSDC",
        limit: 10
    })
    console.info(req)
    } catch(error) {
        console.error(`Error Fetching orderbook ${error}`)
    }
}

// Create transaction
const createOrder = async (provider: BaseProvider) => {
    const typelimit = 'limit'
    try {
        const order: PostOrderRequestV2 = {
            ownerAddress: 'AM3wLYNq5HDNnUrYY4oym8uaXTNG8Z3Ybcm3ZHngatiN',
            payerAddress: 'AM3wLYNq5HDNnUrYY4oym8uaXTNG8Z3Ybcm3ZHngatiN',
                market: "SOLUSDC",
                side: "S_ASK",
                type: typelimit,
                amount: 0.1,
                price: 200,
                openOrdersAddress: '',  // optional
                clientOrderID: "12345",
                computeLimit: 0,
                computePrice: '0',
        }
        const response = await axios.post(
            'https://ny.solana.dex.blxrbdn.com/api/v2/openbook/place',
            {
                order,
            },
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Your Auth header',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Order placed successfully: ', response)
    } catch(error) {
        console.error('Error placing order: ', error)
    }
};

(async () => {
        // await getOrderbook(provider)
        await createOrder(provider)
})();