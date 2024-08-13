const express = require('express')
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoute = require('./routes/userRoutes');
const campaignRoute = require('./routes/campaignRoutes')

const app = express();
app.use(bodyparser.json())
app.use(cors());

mongoose.connect('mongodb+srv://kanishka:ZzMh63NyKD42Nw8d@cluster05.pgwmpx4.mongodb.net/Blog').then(()=>{
    console.log('MongoDB Connected');
})

app.set('view engine','ejs');

app.use('/api',userRoute);
app.use('/api',campaignRoute);

app.listen(8000,()=>{
    console.log('Server running on port 8000');
})