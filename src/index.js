require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
const api = require('./routers/api');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', api);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
