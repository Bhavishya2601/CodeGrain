import React, { useState } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

import Loading from './Loading';
import google from '../assets/google.svg';
import { IoMdClose } from "react-icons/io";

const Popup = ({ setShowModal }) => {
    const { userData } = useUser();

    return (
        Object.entries(userData).length !== 0 ?
            inviteUser(setShowModal) :
            googleLogin(setShowModal)
    )
}

const googleLogin = (setShowModal) => {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center">
                <div className="bg-[#f6f6f6] text-black p-6 rounded-sm flex flex-col justify-center items-center gap-7 w-92 relative">
                    <h2 className="text-center text-2xl font-semibold">Log in to Continue</h2>
                    <div className="text-center border p-2 px-4 flex gap-3 items-center cursor-pointer" onClick={handleGoogleLogin}>
                        <div><img src={google} alt="" className='h-5' /></div>
                        <div className='text-lg font-semibold'>Continue With Google</div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleCloseModal}
                            className="text-2xl cursor-pointer absolute top-2 right-2 "
                        >
                            <IoMdClose />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const inviteUser = (setShowModal) => {
    const {userData} = useUser();
    const navigate = useNavigate()
    const [createRoom, setCreateRoom] = useState(false)
    const [joinRoom, setJoinRoom] = useState(false)
    const [joinRoomCode, setJoinRoomCode] = useState('')

    const createRoomFunc = () => {
        setCreateRoom(true);
        setTimeout(() => {
            generateLink();
        }, 2000)
    }

    const generateLink = () => {
        const uniqueId = uuidv4();

        navigator.clipboard.writeText(uniqueId)
            .then(async () => {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/create`, { roomId: uniqueId, user: userData.name })
                toast.success("Link copied to clipboard");
                navigate(`/invite/${uniqueId}`);
            })
            .catch(err => {
                console.log(err.message)
                toast.error("Something Went Wrong");
            }).finally(() => {
                setShowModal(false);
            })
    }

    const joinTheRoom = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/room/check/${joinRoomCode.trim()}`);
            if (response.data.exists) {
                navigate(`/invite/${joinRoomCode}`);
            } else {
                toast.error("Room Not Found");
            }
        } catch (err) {
            console.log(err.message);
            toast.error("Something Went Wrong");
        } finally {
            setShowModal(false);
        }
    }

    return (
        <div>
            <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center">
                {createRoom && <div className="bg-[#f6f6f6] text-black p-6 rounded-sm flex flex-col justify-center items-center gap-7 w-92 relative">
                    <h2 className="text-center text-2xl font-semibold">Please Wait...</h2>
                    <Loading fullHeight={false} />
                    <div>Generating your link</div>
                </div>}

                {joinRoom && <div className="bg-[#f6f6f6] text-black p-6 rounded-sm flex flex-col justify-center items-center gap-7 w-92 relative">
                    <h2 className="text-center text-2xl font-semibold">Enter the code</h2>
                    <input type="text" 
                    className="p-2 border border-black rounded-md w-60 text-center"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value)}  />
                    <div className="bg-red-500 rounded-md py-2 px-4 cursor-pointer" onClick={joinTheRoom}>Join Room</div>
                </div>}

                {!createRoom && !joinRoom && <div className="bg-[#f6f6f6] text-xl text-black p-6 rounded-sm flex justify-evenly items-center gap-7 w-[500px] relative h-40">
                    <div className='bg-red-500 rounded-md py-8 px-8 cursor-pointer' onClick={createRoomFunc}>Create a room</div>
                    <div className='bg-red-500 rounded-md py-8 px-8 cursor-pointer' onClick={()=>setJoinRoom(true)}>Join a room</div>
                </div>}

                <div className="flex justify-center">
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-5xl cursor-pointer absolute top-2 right-2 "
                    >
                        <IoMdClose />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Popup
