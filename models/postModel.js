const mongoose = require('mongoose')
const { stringify } = require('uuid')

const postSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "userModel"
    },

    title : {
        type : String
    },
     
    description : {
        type : String
    },

    image : {
        type :String
    } 
})

const postModel = mongoose.model('postModel' , postSchema)

module.exports = postModel