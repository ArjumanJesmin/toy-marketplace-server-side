const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())


app.listen(port, ()=>{
    console.log(`Baby Toy Server is running on port: ${port}`)
})