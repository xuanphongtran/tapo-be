import express from 'express'
import mongoose from 'mongoose'

const DMChatSchema = new mongoose.Schema({
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
        ref: 'Account'  
    },
    chatCategory:{
        type: String
    }
}, {
    collection : 'DMChat'
})

const DMChat = mongoose.model('DMChat', DMChatSchema)

export default DMChat