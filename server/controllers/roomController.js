import Room from "../models/roomModel.js"

export const checkRoom = async (req, res) => {
    const {roomId} = req.params
    
    try {
        const room = await Room.findOne({ roomCode: roomId })
        if(room) {
            return res.status(200).json({exists: true})
        } else {
            return res.status(200).json({exists: false})
        }
    } catch (err) {
        console.log(err.message)
        res.status(404).json({message: 'Something went wrong'})
    }
}

export const createRoom = async (req, res) => {
    try{
        const {roomId, user} = req.body
        const room = new Room({roomCode: roomId, roomOwner: user})
        room.save()
        return res.status(200).json({message: 'Room Created'})
    } catch (err) {
        console.log(err.message)
        res.status(404).json({message: 'Something went wrong'})
    }
}