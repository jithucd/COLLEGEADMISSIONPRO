// const cors = require("cors");

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) {
//       // Allow requests without an origin (like Postman or backend-to-backend requests)
//       return callback(null, true);
//     }
//     callback(null, origin);
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

// module.exports = cors(corsOptions);
// import cors from 'cors';

// // Add this before your routes
// app.use(cors({
//   origin: 'http://localhost:5173', // Your Vite frontend port
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
