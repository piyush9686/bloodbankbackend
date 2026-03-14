// import dotenv from 'dotenv';
// import connectDB from './src/config/db.js';
// import {app} from './app.js';

// dotenv.config({
//     path:'./.env'
// });



// connectDB()
// .then(() => {
// app.listen(() => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });})
// .catch((error) => {
//     console.error('Failed to connect to the database:', error);
//     process.exit(1);
// });

import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env"
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });