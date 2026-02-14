import { Button } from "@/components/ui/button"
import UserLogo from "../../assets/user.jpg"

import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect,useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"


const AdminUsers = () => {
  
  const [searchTerm,setSearchTerm] = useState("")
  const [users, setUser] = useState([])




  const dispatch = useDispatch();

  
  const navigate = useNavigate()
  useEffect(() => {
  const getAllUsers = async() =>{
    const accessToken = localStorage.getItem("accessToken")
    try {
      
      const res = await axios.get(`http://localhost:5000/api/v1/user/all-users`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      if(res.data.success)
        dispatch(setUser(res.data.users));
        
    } catch (error) {
      console.log(error)
      
    }
  }
      getAllUsers()
  }, [])
  
  
  const filteredUsers = users.filter(user=>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className='pl-[350px] py-24 pr-20 mx-auto px-4'>
      <h1 className='font-bold text-2xl'>User Management</h1>
      <p>View and manage registered users</p>
      <div className="flex relative w-[300px] mt-6">
        <Search className='absolute left-2 top-1 text-gray-600 w-5'/>
        <Input  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}className='pl-10' placeholder = "Search Users..."/>
      </div>
      <div className="grid grid-cols-3 gap-7 mt-7">
        {
          filteredUsers.map((user,index)=>{
            return <div key={index} className='bg-pink-100 p-5 rounded-lg'>
              <div className="flex items-center gap-2">
                <img src={user?.profilePic || UserLogo} alt="" className="rounded-full w-16 aspect-square object-cover border border-pink-600"/>
                <div>
                  <h1 className="font-semibold">{user?.firstname} {user?.lastname}</h1>
                  <h3>{user?.email}</h3>

                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Button className='bg-pink-300'onClick={()=>navigate(`/dashboard/users/${user?._id}`)} variant="outline"><Edit/>Edit</Button>
                <Button className='bg-white'><Eye/>Show Order</Button>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AdminUsers
