import React, {useState, useEffect, createContext, useContext} from 'react'
import axios from 'axios'

const userContext = createContext()

const UserProvider = ({children}) => {
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [reTrigger, setReTrigger] = useState(0)

    useEffect(()=>{
        fetchData()
    }, [reTrigger])

    const fetchData = async () => {
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/checkUser`,{
                withCredentials: true
            })
            setUserData(response.data.user)
        } catch (err){
            console.log('Error checking user status')
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <userContext.Provider value={{userData, setUserData, isLoading, setIsLoading, setReTrigger}}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider
export const useUser = () => useContext(userContext)