const mongoose = require('mongoose');
const config= require('config');

const db = config.get('mongoURI');

const connectDB = async ()=> {
try{
    await mongoose.connect('mongodb://karna:karna123@ds033831.mlab.com:33831/karna',{useNewUrlParser : true});

    console.log('Database Connected');
}

    catch(err){
        console.error(err.message);
        process.exit(1);
}

};

module.exports= connectDB;

//mongodb+srv://karna:@cluster0-yoyqf.mongodb.net/test?retryWrites=true&w=majority

