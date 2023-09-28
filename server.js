const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./Routes/users')
const kc = require('./stocks');

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
