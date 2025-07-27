const express= require('express');
const {dbrun}=require('./db/dbConnect');
const cookieParser= require('cookie-parser')
const cors = require('cors');
dbrun();
const urlRoutes=require('./routes/route.url')
const app=express();
app.use(cors({ origin: true, credentials: true }));
console.log(process.env.REACT_URL);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT= process.env.PORT||3000;

app.use('/url',urlRoutes);

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})