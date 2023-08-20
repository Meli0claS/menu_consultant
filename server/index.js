require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const menusRouter = require('./routers/menu');
const authRouter = require('./routers/auth');
const userMenuRouter = require('./routers/userMenu');
const userRouter = require('./routers/user');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nydhg2t.mongodb.net/menu_consultation_system?retryWrites=true&w=majority`

// app.use(bodyParser.json({ limit: '30mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

app.use('/api/menus', menusRouter);
app.use('/api/auth', authRouter);
app.use('/api/usermenus', userMenuRouter);
app.use('/api/users', userRouter);

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log('err', err);
    });
