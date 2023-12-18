const { default: mongoose } = require("mongoose");
const mongooseLocal = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({

    email:{
        type : String,
        required : true
    },

    fullname : {
        type : String,
        required : true
    },

    username : {
        type : String,
        required : true
    },

    password : {
        type : String,
    },

    profileImage : {
        type : String
    },

    dateOfBirth : {
        type : Date
    },

    boards : {
        type : Array,
        default : []
    }, 

    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'postModel'
    }]
})

userSchema.plugin(mongooseLocal)

const userModel = new mongoose.model('userModel' , userSchema)



module.exports = userModel