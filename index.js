 const express = require('express');
 const app = express()
 const bodyParser = require('body-parser');
 const sequelize = require('./Config/db');
 const socketIo = require('socket.io');
 const path = require('path');
 const dotenv = require('dotenv');
dotenv.config();


 app.use(bodyParser.json());

 sequelize.sync().then(() => {
    console.log('Database synchronized');
  }).catch(err => {
    console.error('Unable to synchronize the database:', err);
  });

  // routes
const userRouter = require('./Routes/user-routes');
const itemRouter = require('./Routes/item-routes');
const bidRouter = require('./Routes/bid-routes');
const notificationRouter = require('./Routes/notification-routes');

app.use('/users', userRouter);
app.use('/items', itemRouter);
app.use('/bids', bidRouter); 
app.use('/notifications', notificationRouter);

// Serve static files (uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



 app.listen(5000,()=>{
    console.log("app listening on port no 5000")
 })