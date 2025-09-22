"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStatus = exports.createPayment = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios_1 = require("axios");
const cors = require("cors");
admin.initializeApp();
const corsHandler = cors({ origin: true });
const WOMPI_BASE_URL = 'https://sandbox.wompi.co/v1';
const WOMPI_PUBLIC_KEY = ((_a = functions.config().wompi) === null || _a === void 0 ? void 0 : _a.public_key) || 'pub_test_QGBWuUVmwzb5sADWqysmAfNBaPjpMoMZ';
const WOMPI_PRIVATE_KEY = ((_b = functions.config().wompi) === null || _b === void 0 ? void 0 : _b.private_key) || 'prv_test_bpQgNG2wgK2QbheFpgXVXrpQbK8vosMZ';
exports.createPayment = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        try {
            if (req.method !== 'POST') {
                res.status(405).json({ error: 'Method not allowed' });
                return;
            }
            const paymentData = req.body;
            const response = await axios_1.default.post(`${WOMPI_BASE_URL}/transactions`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            await admin.firestore().collection('transactions').doc(response.data.data.id).set(Object.assign(Object.assign({}, response.data.data), { created_at: admin.firestore.FieldValue.serverTimestamp() }));
            res.json({
                success: true,
                transaction: response.data.data
            });
        }
        catch (error) {
            console.error('Payment error:', error);
            res.status(500).json({
                error: 'Payment failed',
                details: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message
            });
        }
    });
});
exports.getTransactionStatus = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        try {
            const transactionId = req.query.id;
            const response = await axios_1.default.get(`${WOMPI_BASE_URL}/transactions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
                }
            });
            res.json({
                success: true,
                transaction: response.data.data
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to get transaction',
                details: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message
            });
        }
    });
});
//# sourceMappingURL=index.js.map