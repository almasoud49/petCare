import axios from 'axios';
import { env } from '../../config/env';

const SANDBOX = env.NODE_ENV !== 'production';
const BASE = SANDBOX
  ? 'https://sandbox.sslcommerz.com'
  : 'https://securepay.sslcommerz.com';

export const sslcommerzInit = async (payload: {
  total_amount: number;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
}) => {
  const params = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID || '',
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD || '',
    ...Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [k, String(v)])
    ),
  });

  const res = await axios.post(
    `${BASE}/gwprocess/v4/api.php`,
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res.data;
};

export const sslcommerzValidate = async (valId: string) => {
  const res = await axios.get(`${BASE}/validator/api/validationserverAPI.php`, {
    params: {
      val_id: valId,
      store_id: env.SSLCOMMERZ_STORE_ID,
      store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
      format: 'json',
    },
  });
  return res.data;
};