import { FastBackwardFilled } from '@ant-design/icons';
import { HmacSHA256 } from 'crypto-js';
import e from 'express';
import userRepository from 'repository/userRepository';
import jwtHelper from 'src/helper/jwtHelper';

export default {
  handleGoogleOAuth: async (code: string, fingerprint: string) => {
    const tokenData = await getGoogleToken(code);
    const userInfo = await getUserInfo(tokenData.access_token);

    const { email, name, picture } = userInfo;

    const existUser = await userRepository.existUserByEmail(email)
    if (existUser) {
      const jwt = jwtHelper.jwtSign(existUser.email, fingerprint, existUser.password)

      return jwt
    }

    await userRepository.saveUserByInfo(email, name, picture);
    const jwt = jwtHelper.jwtSign(email, fingerprint, "null")

    return jwt
  },
  updatePassword: async (password: string, email: string) => {
      const exitsUser = await userRepository.existUserByEmail(email)
      if (exitsUser) {
        exitsUser.password = HmacSHA256(password, process.env.HMAC_SECRET_KEY || '').toString()
        exitsUser.save()
        const jwt = jwtHelper.jwtSign(email, 'unknow', exitsUser.password)
        return jwt
      }
      return false
  }
}

// Support Function
async function getGoogleToken(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: process.env.CALLBACK_URL || '',
      grant_type: 'authorization_code',
      code
    })
  });

  const data = await res.json()
  console.log(data)

  if (!res.ok) throw new Error('Failed to get token from Google');
  return data;
}

async function getUserInfo(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error('Failed to fetch user info');
  return res.json();
}


