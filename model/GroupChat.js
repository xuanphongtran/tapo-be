import express from 'express'
import mongoose from 'mongoose'

const GroupChatSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    chatDate:{
        type: Date
    },
    content:{
        type: String
    },
    from_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    to_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'  
    },
    chatCategory:{
        type: String
    }
}, {
    collection : 'GroupChat'
})

const GroupChat = mongoose.model('GroupChat', GroupChatSchema)

export default GroupChat