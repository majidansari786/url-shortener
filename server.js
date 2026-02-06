const express = require('express');
const shortenedModel = require('./models/shortened');
const app = express();
const connectDB = require('./config/db');
const { default: mongoose } = require('mongoose');
const userModel = require('./models/user');
const userRoute = require('./routers/userRoute')
const shortenRoute = require('./routers/shortnerRoute')

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("URL SHORTNER API")
})

app.use('/api/user',userRoute)
app.use('/api/url',shortenRoute)

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});