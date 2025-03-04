import React, { useState } from 'react';
import axios from 'axios';

const PaymentComponent = () => {
  const [loading, setLoading] = useState(false);
  
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }
      
      // Create order on server
      const { data } = await axios.post('/api/payments/create-order', {
        amount: 500, // amount in rupees
        currency: 'INR',
        receipt: 'order_receipt_' + Date.now(),
        notes: {
          description: 'Test Payment'
        }
      });
      
      if (!data.success) {
        alert('Server error. Please try again.');
        setLoading(false);
        return;
      }
      
      // Initialize Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount:  data.order.amount,
        currency: "INR",
        name: 'College Admission Pro',
        description: 'Course Admission Fee',
        order_id:  data.order.id,
        handler: async function (response) {
          try {
            navigate(`/admission/${admission._id}/status`);
            // Verify payment on server
            const verifyData = await axios.post('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyData.data.success) {
              alert('Payment successful!');
              // Handle success (redirect, update UI, etc.)
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Your Company Address'
        },
        theme: {
          color: '#3399cc'
        }
      };
      const rzp = new window.Razorpay(options);
rzp.open();
      // Create Razorpay instance
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Handle payment window close
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button 
        onClick={handlePayment}
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentComponent;