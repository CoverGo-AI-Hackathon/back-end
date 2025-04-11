import config from 'config.json'

export default {
  googleLoginUrl: `https://accounts.google.com/o/oauth2/auth
    ?client_id=${config['googleOauthConfig']['clientId']}
    &redirect_uri=${config['googleOauthConfig']['redirectUri']}
    &response_type=${config['googleOauthConfig']['responseType']}
    &scope=${config['googleOauthConfig']['scope']}
    &access_type=${config['googleOauthConfig']['accessType']}
    &prompt=${config['googleOauthConfig']['prompt']}`.replace(/\s+/g, ''),

  envTemplate: [
    "PORT",

    "DB_HOST",
    "REDIS_HOST",

    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "CALLBACK_URL",

    "JWT_SECRET",
    "HMAC_SECRET_KEY",

    "AES_KEY",
    "IV",
    "FRONT_END_REDIRECT_URL",

    "ZALO_PAY_APP_ID",
    "ZALO_PAY_KEY_1",
    "ZALO_PAY_KEY_2",
    "ZALO_PAY_ENDPOINT",
  ]
}
