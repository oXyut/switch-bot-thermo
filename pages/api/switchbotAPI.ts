// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
const crypto = require("crypto");


require('dotenv').config()

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const makeRequestHeader = (CLIENT_ID: string, CLIENT_SECRET: string) => {
        const t = Date.now();
        const nonce = "discordSwitchBot";
        const data = CLIENT_ID + t + nonce;
        const signTerm = crypto.createHmac('sha256', CLIENT_SECRET)
            .update(Buffer.from(data, 'utf-8'))
            .digest();
        const sign = signTerm.toString("base64");

        return {
          "Authorization": CLIENT_ID,
          "t": t,
          "nonce": nonce,
          "sign": sign,
        }
    }


  if(req.method !== 'GET'){
    res.status(400).json({ name: 'Bad Request' })
  } else {
    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const METER_ID = process.env.METER_ID
    if (CLIENT_ID === undefined || CLIENT_SECRET === undefined || METER_ID === undefined) {
      res.status(500).json({ name: 'Internal Server Error' })
    } else {
      const headers = makeRequestHeader(CLIENT_ID, CLIENT_SECRET)
      axios.get(`https://api.switch-bot.com/v1.1/devices/${METER_ID}/status`, {
          headers: headers
      }).then((response) => {
          console.log(response.data.body)
          res.status(200).json({ name: response.data.body })
      }).catch((error) => {
          console.log(error)
          res.status(500).json({ name: 'Internal Server Error' })
      })
    }
  }
}
