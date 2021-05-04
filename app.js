const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Load config
dotenv.config();

connectDB();

const app = express();

app.use(cors());

// Body parser
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//home page route
app.get('/', (req, res) => {
    const response = {
        error: false,
        msg: 'Welcome to Renting System!',
    };
    res.send(response);
});

// Routes
app.use('/buyer', require('./routes/buyer'));
app.use('/seller', require('./routes/seller'));
app.use('/product', require('./routes/product'));
app.use('/order', require('./routes/order'));

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
