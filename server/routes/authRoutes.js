import express from "express"
import {
    google,
    googleMain,
    checkUser
} from "../controllers/authController.js"

const router = express.Router()

router.get('/google', google)
router.get('/google/main', googleMain)
router.get('/checkUser', checkUser)

export default router