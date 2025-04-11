// Node v10.15.3
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
require('dotenv').config(); 

// APP INFO
const config = {
    app_id: process.env.ZALO_PAY_APP_ID,
    key1: process.env.ZALO_PAY_KEY_1,
    key2: process.env.ZALO_PAY_KEY_2,
    endpoint: process.env.ZALO_PAY_ENDPOINT
};

export default {
    zaloPayCreateOrder: async (email:string, amount:number) => {
        const embed_data = {email: email};
        
        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "user12",
            app_time: Date.now(), 
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            description: `Make a transfer to ${email}`,
            bank_code: "zalopayapp",
            callback_url: process.env.ZALO_PAY_CALL_BACK_URL
        };
        
        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        
        // @ts-ignore
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        
        return await axios.post(config.endpoint, null, { params: order })
        // @ts-ignore
            .then(res => res.data)
            // @ts-ignore
            .catch(err => err);
    }
}