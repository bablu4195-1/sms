const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./Routes/users')
const stockRoutes = require('./Routes/stocks');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())
app.use('/api', userRoutes);
app.use('/api/stocks',stockRoutes);
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
