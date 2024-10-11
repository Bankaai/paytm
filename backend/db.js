const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


mongoose.connect("mongodb+srv://ameyawarang450:sf90stradle@cluster0.mvbnh55.mongodb.net/paytm?retryWrites=true&w=majority")
.then (()=>{
    console.log("server connected succesfully");
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
       lowerCase:true,
       trim:true,
       minLength:3,
       maxLength:30
    },
    password:{
        type: String,
        required: true,
        maxLength: 20
    },
    firstName: {
        type:String,
        lowerCase: true
    },
    lastname:{
        type: String,
        lowerCase: true
    }
})

const User= mongoose.model('User',UserSchema);

const accountSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    accountBalance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account',accountSchema);

module.exports = {
    User, Account
}