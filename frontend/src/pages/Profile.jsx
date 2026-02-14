import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.jpg";
import { toast } from "sonner";
import axios from "axios";
import { setProfilePic, setUser } from "../redux/userSlice";
import { Loader2 } from "lucide-react"


const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId.toString();
  const [loading,setLoading] = useState(false)

  const [updateUser, setUpdateUser] = useState({
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic ? user.profilePic : userLogo,
    role: user?.role,
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const newPic = URL.createObjectURL(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
     dispatch(setProfilePic(newPic));
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

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 mt-6 text-2xl text-gray-800">
                Update Profile
              </h1>

              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                <div className="flex flex-col items-center">
                  <img
                    src={
                      updateUser.profilePic &&
                      updateUser.profilePic.trim() !== ""
                        ? updateUser.profilePic
                        : userLogo
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
                        value={updateUser.firstname || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        name="lastname"
                        value={updateUser.lastname || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium">Email</Label>
                    <Input
                      name="email"
                      value={updateUser.email || ""}
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
                      value={updateUser.phoneNo || ""}
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
                      value={updateUser.address || ""}
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
                        value={updateUser.city || ""}
                        placeholder="Enter your city"
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your zip code"
                        name="zipCode"
                        value={updateUser.zipCode || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
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
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                type="password"
                name="currentPassword"
                placeholder="Current password"
              />
              <Input
                type="password"
                name="newPassword"
                placeholder="New password"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full bg-pink-600">
                Save password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
