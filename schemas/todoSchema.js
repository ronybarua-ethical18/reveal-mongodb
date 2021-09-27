const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date:{
        type: Date,
        default: Date.now
    },

    //make relation with user todo
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})


//custom instance method
todoSchema.methods  = {
    findActive: function(){
        return mongoose.model('Todo').find({status: 'inactive'})
    },
    findActiveCallback: function(callback){
        return mongoose.model('Todo').find({status: 'active'}, callback)
    }
}

//static methods
todoSchema.statics = {
    findByJs: function(){
        return this.find({title: /js/i})
    }
}

//query helpers
todoSchema.query = {
    byLanguage: function(lang){
        return this.find({title: new RegExp(lang, 'i')})
    }
}
module.exports = todoSchema