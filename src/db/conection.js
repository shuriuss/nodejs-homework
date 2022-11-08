const mongoose = require("mongoose");

// main().catch(err => console.log(err));

const connectMongo = async () => {
  return mongoose.connect(
    "mongodb+srv://Alex:131016@cluster0.dzjj0kw.mongodb.net/db-contacts?retryWrites=true&w=majority"
  );
};


module.exports = {connectMongo};
