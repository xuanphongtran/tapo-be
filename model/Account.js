import mongoose from 'mongoose'

const AccountSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    group: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Group'
        }
    }]
},{ collection : 'Account'})

const Account = mongoose.model('Account', AccountSchema)

export default Account