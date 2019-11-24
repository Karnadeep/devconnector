const express= require('express');
const app = express();
const connectDb= require('./config/db');



//Connecting to database
connectDb();

app.get('/', (req, res)=> res.send('API Running'));
const port = process.env.PORT || 5000;

app.listen(port,()=> console.log(`Server running on port ${port}`));