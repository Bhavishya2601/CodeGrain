import express from "express"
import {
    checkRoom,
    createRoom
} from "../controllers/roomController.js"

const router = express.Router()

router.get('/check/:roomId', checkRoom);
router.post('/create', createRoom)

export default router