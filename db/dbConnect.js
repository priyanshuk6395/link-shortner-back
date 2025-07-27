const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.DB_CONNECT;

const MAX_RETRIES = 5; // Maximum number of retry attempts
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)

async function dbrun(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(uri);
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error: ", err);

    if (retries > 0) {
      console.log(`Retrying connection... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => dbrun(retries - 1), RETRY_DELAY);
    } else {
      console.error("Max retries reached. Failed to connect to MongoDB.");
    }
  }
}

module.exports=  {dbrun};