import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:'product',
    initialState:{
        products:[],
        filteredProducts:[],
        cart:[],
        addresses:[],
        selectedAddress:null //current chosen address
        
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products = action.payload;
            state.filteredProducts = action.payload;
        },
        setFilteredProducts:(state,action)=>{
            state.filteredProducts = action.payload;
        },
        setCart:(state,action)=>{
            state.cart = action.payload;
        },
        //Address Management
        addAddress:(state, action)=>{
            if(!state.addresses) state.addresses =[];
            state.addresses.push(action.payload)
        },
        setSelectedAddress : (state, action)=>{
            state.selectedAddress = action.payload
        },
        deleteAddress:(state,action)=>{
            state.addresses = state.addresses.filter((__, index)=>index !== action.payload)
            //Reset selectedAddress if it was deleted
            if(state.selectedAddress === action.payload){
                state.addresses = null

            }
        }
    }   
});
export const {setProducts , setFilteredProducts, setCart, addAddress, setSelectedAddress, deleteAddress} = productSlice.actions;
export default productSlice.reducer;
        
