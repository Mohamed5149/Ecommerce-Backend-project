const mongoose = require('mongoose');

let connectionURL = process.env.MONGO_URL||'mongodb://localhost:27017/ecommerce';

mongoose.connect(connectionURL, {
  useCreateIndex: true,
  autoIndex: true,
  useNewUrlParser: true
}, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  else { console.log("sucess"); }
});
