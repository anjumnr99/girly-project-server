const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('Girly project server is running....')
  })
  
  app.listen(port, () => {
    console.log(`Girly project server is running on port ${port}`)
  })