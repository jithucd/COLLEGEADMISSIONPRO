// const Razorpay = require("razorpay");
// const Admission = require("../models/Admission");
// const crypto = require('crypto');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // Create a payment order
// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { admissionId, amount } = req.body;

//     const options = {
//       amount: amount * 100, // Razorpay expects amount in paise
//       currency: "INR",
//       receipt: `receipt_${admissionId}`
    
//     };


//     const order = await razorpay.orders.create(options);

//     res.json({ success: true, order });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create payment order" });
//   }
// };

// exports.verifyPaymentOrder = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature
//     } = req.body;
    
//     // Create a signature with your key_secret
//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + '|' + razorpay_payment_id)
//       .digest('hex');
    
//     // Verify signature
//     if (generatedSignature === razorpay_signature) {
//       // Payment is successful, save to your database
      
//       // Example: Save payment to MongoDB
//       // const payment = new Payment({
//       //   razorpay_order_id,
//       //   razorpay_payment_id,
//       //   amount: req.body.amount,
//       //   status: 'successful'
//       // });
//       // await payment.save();
      
//       res.json({
//         success: true,
//         message: 'Payment verified successfully'
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid signature'
//       });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       error: error.message
//     });
//   }
// };

