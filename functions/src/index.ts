import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import * as cors from 'cors';

admin.initializeApp();

const corsHandler = cors({ origin: true });

const WOMPI_BASE_URL = 'https://sandbox.wompi.co/v1';
const WOMPI_PUBLIC_KEY = functions.config().wompi?.public_key || 'pub_test_QGBWuUVmwzb5sADWqysmAfNBaPjpMoMZ';
const WOMPI_PRIVATE_KEY = functions.config().wompi?.private_key || 'prv_test_bpQgNG2wgK2QbheFpgXVXrpQbK8vosMZ';

export const createPayment = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const paymentData = req.body;

      const response = await axios.post(
        `${WOMPI_BASE_URL}/transactions`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await admin.firestore().collection('transactions').doc(response.data.data.id).set({
        ...response.data.data,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        transaction: response.data.data
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      res.status(500).json({
        error: 'Payment failed',
        details: error.response?.data || error.message
      });
    }
  });
});

export const getTransactionStatus = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const transactionId = req.query.id as string;

      const response = await axios.get(
        `${WOMPI_BASE_URL}/transactions/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
          }
        }
      );

      res.json({
        success: true,
        transaction: response.data.data
      });

    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to get transaction',
        details: error.response?.data || error.message
      });
    }
  });
});