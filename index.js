const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const skillRoutes = require('./routes/skillRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorMiddleware = require('./utils/errors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

// INIT
const app = express();
app.use(express.json());
dotenv.config({ path: './.env' });

// DB
const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// Set security HTTP headers
app.use(helmet());
// Limit requests from same IP
const limiter = rateLimit({
    max: 200,
    windowMs: 60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit : '10kb' }));
app.use(cookieParser());

// Data santization against NoSql query injection
app.use(mongoSanitize());
// Data santization against XSS
app.use(xss());
//  prevent paramater pollution
// app.use(hpp({
//     whitelist: [
//       'title', 'content', 'category'
//     ]
// }));

app.use(compression())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// ROUTES
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);


// ERROR MIDDLEWARE
app.use(errorMiddleware);

// RUN THE SERVER
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server running on ${port}.....`))