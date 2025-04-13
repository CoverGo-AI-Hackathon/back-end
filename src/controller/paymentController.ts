import { Request, Response }  from 'express';
import CryptoJS from 'crypto-js';
import zaloPayHelper from 'src/helper/zaloPayHelper';
import respond from 'view/respond';
import paymentService from 'service/paymentService';
import emailHelper from 'src/helper/emailHelper';

interface Result {
    return_code: number;
    return_message: string;
}
  

export default{
    zaloPayCallBackHandler: (req: Request, res: Response) => {
      let result: Result = { return_code: 0, return_message: '' };

      try {
        console.log(req.body)

        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALO_PAY_KEY_2!).toString();
        console.log("mac =", mac);

        // check if the callback is valid (from Zalopay server)
        if (reqMac !== mac) {
          // callback is invalid
          result.return_code = -1;
          result.return_message = "mac not equal";

          console.log("invalid mac")
        } else {
          // payment success
          // merchant update status for order's status
          // @ts-ignore
          let dataJson = JSON.parse(dataStr, process.env.ZALO_PAY_KEY_2!);
          console.log(
            "update order's status = success \n where data =",
            dataJson
          );

          result.return_code = 1;
          result.return_message = "success";

          let embedDataEmail = JSON.parse(dataJson.embed_data).email;
          let amount = dataJson.amount
          paymentService.addMoneyToUser(embedDataEmail, amount)

          const htmlContent = `
              <html>
                <body>
                  <p>Giao dịch thanh toán ZaloPay của bạn đã thành công.</p>
                  <p><strong>Số tiền thanh toán:</strong> ${amount} VND</p>
                  <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                </body>
              </html>
            `;
            emailHelper.sendMail(embedDataEmail, "Xác Nhận Thanh Toán Zalo Pay", htmlContent)
          }
        } catch (ex: any) {
          console.log(ex.message)

            result.return_code = 0; // callback again (up to 3 times)
            result.return_message = ex.message;
        }

          // returns the result for Zalopay server
          res.json(respond(400, result));
    },

    zaloPayCreateOrder: async (req: Request, res: Response) => {
      const email = req.query.email as string;
      const amount = req.query.amount as string

      if(!email || !amount) {
        res.json(respond(400, "Missing Email Param or Amount Param"))
        return
      }

      if(parseInt(amount) < 10000) {
        res.json(respond(400, "Amount below 10.000 not allow here"))
        return
      }

      const order = await zaloPayHelper.zaloPayCreateOrder(email, parseInt(amount))

      const orderUrl = order.order_url

      res.redirect(orderUrl)
    }
}