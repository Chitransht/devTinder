const mongoose = require('mongoose');

const connectDB = async () => {
        await mongoose.connect("mongodb+srv://tusharchitransh02_db_user:Ap4HM43r5HFcc0JS@devtinder.pbkqmq5.mongodb.net/devTinder")
}

module.exports = connectDB;



