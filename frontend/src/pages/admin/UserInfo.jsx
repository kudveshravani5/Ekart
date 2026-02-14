import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserLogo from "../../assets/user.jpg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState(null);
  const [file,setFile] = useState(null);
  const {setUser} = useSelector(store=>store.user);
  const params = useParams();
  const [loading,setLoading] = useState(false);
  const userId = params.id;
  const dispatch = useDispatch();
   const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("firstname", updateUser.firstname);
      formData.append("lastname", updateUser.lastname);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);
      if (file) {
        formData.append("file", file); //image file for backend multer
      }
      try {
        setLoading(true)
        const res = await axios.put(
        
        `http://localhost:5000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  }
    finally {
      setLoading(false);
    } 
  };
  const getUserDetails = async () =>{
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user/get-user/${userId}`)
      if(res.data.success){
        setUpdateUser(res.data.user)
      }
      
    } catch (error) {
      console.log(error)
      
    }
  }
  useEffect(()=>{
    getUserDetails()
  },[])
  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-10">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>
          <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
            <div className="flex flex-col items-center">
              <img
                src={
                  updateUser?.profilePic && updateUser.profilePic.trim() !== ""
                    ? updateUser.profilePic
                    : UserLogo
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-600"
              />

              <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-6 py-2 rounded-md">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    name="firstname"
                    value={updateUser?.firstname || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input
                    name="lastname"
                    value={updateUser?.lastname || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input
                  name="email"
                  value={updateUser?.email || ""}
                  disabled
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  name="phoneNo"
                  value={updateUser?.phoneNo || ""}
                  placeholder="Enter your contact no"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium">Address</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={updateUser?.address || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">City</Label>
                  <Input
                    type="text"
                    name="city"
                    value={updateUser?.city || ""}
                    placeholder="Enter your city"
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Zip Code</Label>
                  <Input
                    type="text"
                    placeholder="Enter your zip code"
                    name="zipCode"
                    value={updateUser?.zipCode || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Label className='block text-sm font-medium'>Role :</Label>
                <RadioGroup 
                value={updateUser?.role} 
                onValueChange={(value)=>setUpdateUser({...updateUser,role:value})}className='flex items-center'>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value='user' id='user'/>
                    <Label htmlFor='user'>User</Label>

                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value='admin' id='admin'/>
                    <Label htmlFor='admin'>Admin</Label>

                  </div>
                  
                </RadioGroup>
                
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
