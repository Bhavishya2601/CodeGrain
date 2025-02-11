import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    roomOwner: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Room = mongoose.model('Room', roomSchema)
export default Room