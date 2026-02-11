const express = require('express');
const app = express();
const connectDB = require('./config/db');
const userRoute = require('./routers/userRoute')
const shortenRoute = require('./routers/shortnerRoute')

const startServer = async () => {
    await connectDB();
    
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
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});