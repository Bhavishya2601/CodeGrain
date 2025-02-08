import express from "express"
import {
    compile,
    // stop
} from "../controllers/codeController.js"
const router = express()

router.post('/compile', compile);
// router.post('/stop', stop)

export default router