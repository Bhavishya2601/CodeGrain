import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'NA'
    }
})

const User = mongoose.model('User', userSchema)
export default User