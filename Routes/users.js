const User = require('../models/users');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const database = require('../config/database');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const saltRounds = 10;
database.connect();

router.get('', (req, res) => {
    console.log('users',res)
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const query = `INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;
  
    try {
      const result = await sequelize.query(query);
      res.status(201).send(result);
    } catch(error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  });
  
//compare the hashed password with the password in the database
   router.post('/login', async (req, res) => {
     const { email, password } = req.body;
        const query = `SELECT * FROM Users WHERE email='${email}'`;
        try {
            const result = await sequelize.query(query);
            const user = result[0][0];
            console.log(user);
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).send('Logged in');
            } else {
                res.status(401).send('Not authorized');
            }
        } catch(error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    });

    
        


module.exports = router;