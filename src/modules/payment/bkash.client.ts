import axios from 'axios';
import { env } from '../../config/env';

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenCache | null = null;

const getToken = async (): Promise<string> => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
    {
      app_key: env.BKASH_APP_KEY,
      app_secret: env.BKASH_APP_SECRET,
    },
    {
      headers: {
        username: env.BKASH_USERNAME,
        password: env.BKASH_PASSWORD,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.data?.statusCode !== '0000' || !res.data?.id_token) {
    throw new Error(
      `bKash token grant failed: ${res.data?.statusMessage || 'unknown'}`
    );
  }

  cachedToken = {
    token: res.data.id_token,
    expiresAt: Date.now() + (Number(res.data.expires_in) - 60) * 1000,
  };
  return cachedToken.token;
};

export const bkashCreate = async (payload: {
  amount: string;
  payerReference: string;
  merchantInvoiceNumber: string;
  callbackURL: string;
}) => {
  const token = await getToken();

  const res = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/create`,
    {
      mode: '0011',
      payerReference: payload.payerReference,
      callbackURL: payload.callbackURL,
      amount: payload.amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: payload.merchantInvoiceNumber,
    },
    {
      headers: {
        Authorization: token,
        'X-APP-Key': env.BKASH_APP_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.data?.statusCode !== '0000' || !res.data?.bkashURL) {
    throw new Error(
      `bKash create failed: ${res.data?.statusMessage || 'unknown'}`
    );
  }

  return res.data;
};

export const bkashExecute = async (paymentID: string) => {
  const token = await getToken();

  const res = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/execute`,
    { paymentID },
    {
      headers: {
        Authorization: token,
        'X-APP-Key': env.BKASH_APP_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.data?.statusCode !== '0000') {
    throw new Error(
      `bKash execute failed: ${res.data?.statusMessage || 'unknown'}`
    );
  }

  return res.data;
};

export const bkashQuery = async (paymentID: string) => {
  const token = await getToken();

  const res = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/payment/status`,
    { paymentID },
    {
      headers: {
        Authorization: token,
        'X-APP-Key': env.BKASH_APP_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
};