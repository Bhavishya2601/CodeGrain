import React, { useEffect } from 'react'
import google from '../assets/google.svg';
import { IoMdClose } from "react-icons/io";
import Loading from './Loading';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

import { useUser } from '../context/userContext';

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

    useEffect(() => {
        generateLink()
    })

    const generateLink = () => {
        const uniqueId = uuidv4(); 
        const uniqueLink = `${import.meta.env.VITE_FRONTEND_URL}/invite/${uniqueId}`

        navigator.clipboard.writeText(uniqueLink)
            .then(() => {
                toast.success("Link copied to clipboard");
            })
            .catch(err => {
                console.log(err.message)
                toast.error("Something Went Wrong");
            }).finally(() => {
                setShowModal(false);
            })
    }

    return (
        <div>
            <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center">
                <div className="bg-[#f6f6f6] text-black p-6 rounded-sm flex flex-col justify-center items-center gap-7 w-92 relative">
                    <h2 className="text-center text-2xl font-semibold">Please Wait...</h2>
                    <Loading />
                    <div>Generating your link</div>
                </div>
            </div>
        </div>
    )
}

export default Popup
