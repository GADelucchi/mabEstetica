import axios from 'axios';

const paymentService = {
    processPayment: async (paymentData) => {
        try {
            const response = await axios.post('/api/payments', paymentData);
            return response.data;
        } catch (error) {
            throw new Error('Error processing payment: ' + error.message);
        }
    },

    getPaymentStatus: async (paymentId) => {
        try {
            const response = await axios.get(`/api/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching payment status: ' + error.message);
        }
    }
};

export default paymentService;