import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import dotenv from 'dotenv'
dotenv.config()

const generateToken = ({id, email}) => {
    return jwt.sign({
        id, email
    },
    process.env.JWT_SECRET || 'COMPILEONIX',
    {
        expiresIn: '1d'
    })
}

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

export const google = async (req, res) => {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ]
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        response_type: "code",
        scope: scopes,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    });
    res.redirect(url)
}

export const googleMain = async (req, res) => {
    try {
        const code = req.query.code

        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL}`)
        }
        const { tokens } = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        const userInfoResponse = await oauth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
        })
        const userInfo = userInfoResponse.data

        const { id, email, name, picture } = userInfo
        let user = await User.findOne({ email })
        if (!user) {
            user = new User({
                name, email, id, picture
            })
            await user.save()
        }

        const cookie = generateToken({ id, email })
        res.cookie('compileonix', cookie, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None'
        })
        res.redirect(`${process.env.FRONTEND_URL}`)
    } catch (err) {
        console.log(err.message)
        console.log(err)
    }
}

export const checkUser = async (req, res) => {
    try {
        const token = req.cookies.compileonix
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'COMPILEONIX')
        const user = await User.findOne({ id: decoded.id })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        res.status(200).json({ user })
    } catch (err) {
        console.log(err.message)
        console.log(err)
        res.status(401).json({ message: 'Unauthorized' })
    }
}