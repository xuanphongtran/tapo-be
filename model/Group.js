import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String
    }
},{ collection : 'Group'})

const Group = mongoose.model('Group', GroupSchema)

export default Group