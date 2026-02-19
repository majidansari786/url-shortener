const express = require('express');
const app = express();
const userRoute = require('./routers/userRoute')
const shortenRoute = require('./routers/shortnerRoute')
const helmet = require('helmet')
const cookieParser = require("cookie-parser");
const apiLimiter = require('./middleware/rate-limit')

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(apiLimiter)

const startServer = async () => {
    
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