
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/userSlice"
const Login = () => {
  const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [formData ,setFormData] = useState({
      email:"",
      password:"",
    })
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleChange = (e) =>{
      const {name,value} = e.target;
      setFormData((prev)=>({
        ...prev,
        [name]:value
      }))
    }
    const submitHandler = async(e)=>{
      e.preventDefault();
      console.log(formData);
      try {
        setLoading(true)
        const res = await axios.post(`http://localhost:5000/api/v1/user/login`,formData,{
          headers:{
            "Content-Type":"application/json"
          }
        })
        if(res.data.success){
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(setUser(res.data.user))
          navigate('/');
          
          toast.success(res.data.message)
  
        }  
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Something went wrong")
  
        
      } finally{
        setLoading(false)
      }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
    <Card className="w-full max-w-sm bg-white ">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter given details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/*<div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
              id ="firstname"
              name="firstname"
              type="text"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={handleChange}
              />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Doe"
                required
                value={formData.lastname}
                onChange={handleChange}
                />
                </div>
                </div>*/}
                <div className="grid grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Input 
                      id="password" 
                      name="password"
                      placeholder="Enter a password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      required />
                      {
                      showPassword ? <EyeOff onClick={()=>setShowPassword(false)} className='w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'/>:
                      <Eye onClick={()=>setShowPassword(true)} className='w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'/>
                      }
                    </div>
                  </div>
        </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
            {loading?<><Loader2 className="h-4 w-4 animate-spin mr-2"/>Please wait</>:'Login'}
          </Button><p className="text-gray-700 text-sm">Don't have an account? <Link to = {"/signup"} className='hover:underline cursor-pointer text-pink-800'>Signup</Link></p>
        </CardFooter>
    </Card>
  </div>
  )
}

export default Login;