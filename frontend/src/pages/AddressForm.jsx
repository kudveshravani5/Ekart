import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAddress, deleteAddress, setSelectedAddress } from '@/redux/productSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AddressForm = () => {
  const [formData , setFormData] = useState({
    fullName:"",
    phone:"",
    email:"",
    address:"",
    city:"",
    state:"",
    zip:"",
    country:"",
  })
  const { cart,addresses, selectedAddress} = useSelector((store)=>store.product)
  const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
  const dispatch = useDispatch();
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }
  const handleSave = () =>{
    dispatch(addAddress(formData))
    setShowForm(false)
  }
  const subtotal = cart.totalPrice
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal*0.05).toFixed(2))
  const total = subtotal + shipping + tax
  console.log(cart)
  return (
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 p-10 bg-white">
          {
            showForm ? (
              <>
              <div>
                <Label htmlFor = 'fullName'>
                  Full Name
                </Label>
                <Input 
                id='fullName'
                name='fullName'
                required
                placeholder='John Doe'
                value={formData.fullName}
                onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor = 'phone'>
                  Phone Number
                </Label>
                <Input 
                id='phone No'
                name='phone No'
                required
                placeholder='+91 8097473535'
                value={formData.phone}
                onChange={handleChange}/>
              </div>
              <div>
                <Label htmlFor = 'email'>
                  Email
                </Label>
                <Input 
                id='email'
                name='email'
                required
                placeholder="shravani@gmail.com"
                value={formData.email}
                onChange={handleChange}/>
              </div>
              <div>
                <Label htmlFor = 'address'>
                  Address
                </Label>
                <Input 
                id='address'
                name='address'
                required
                placeholder="123 Street Area"
                value={formData.address}
                onChange={handleChange}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor = 'city'>
                  City
                </Label>
                <Input 
                id='city'
                name='city'
                required
                placeholder="Kolkata"
                value={formData.city}
                onChange={handleChange}/>
              </div>
              <div>
                <Label htmlFor = 'state'>
                  State
                </Label>
                <Input 
                id='state'
                name='state'
                required
                placeholder="West Bengal"
                value={formData.state}
                onChange={handleChange}/>
              </div>
              <div>
                <Label htmlFor = 'zip'>
                  Zip Code
                </Label>
                <Input 
                id='zip'
                name='zip'
                required
                placeholder="70010"
                value={formData.zip}
                onChange={handleChange}/>
              </div>
              <div>
                <Label htmlFor = 'country'>
                  Country
                </Label>
                <Input 
                id='country'
                name='country'
                required
                placeholder="India"
                value={formData.country}
                onChange={handleChange}/>
              </div>
                
              </div>
              <Button onClick={handleSave} className='w-full bg-pink-500 hover:bg-pink-400 cursor-pointer'>Save & Continue</Button>
              </>
            ):(
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Saved Adresses</h2>
                {
                  addresses.map((addr,index)=>{
                    return <div onClick={()=>dispatch(setSelectedAddress(index))}key ={index} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50":"border-gray-300"}`}>
                      <p className='font-medium'>{addr.fullName}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.email}</p>
                      <p>{addr.address},{addr.city},{addr.state},{addr.zip},{addr.country}
                        <button onClick={()=>dispatch(deleteAddress(index))}className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'>Delete</button>
                      </p>
                    </div>
                  })
                }
                <Button variant='outline' className='w-full' onClick={()=>setShowForm(true)}>+Add New Address</Button>
                <Button disabled={selectedAddress === null} className='w-full bg-pink-600'>
                  Proceed To Checkout

                </Button>
              </div>
            )
          }
        </div>
        {/*Right side order summary */}
        <div>
          <Card className='w-[400px]'>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({cart.length}) items</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm texted-muted-foreground pt-4">
                <p> * Free shipping on orders over 299</p>
                <p>* 30 days return policy</p>
                <p>* Secure checkout with SSL encryption</p>

                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddressForm;