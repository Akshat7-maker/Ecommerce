import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
    shippingInfo: {}

}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        
        addToCart: (state, {payload}) => {
            const itemIndex = state.cartItems.findIndex((item)=>item._id === payload._id);
            if(itemIndex >= 0){
                state.cartItems[itemIndex].quantity += payload.quantity;
            }else{
                // action.payload.quantity = 1;
                state.cartItems.push(payload);
            }

            state.totalAmount += payload.price * (payload.quantity);
            state.totalQuantity += payload.quantity ;
        },

        deleteFromCart: (state, {payload}) => {
            const itemIndex = state.cartItems.findIndex((item)=>item._id === payload._id);
            if(itemIndex >= 0){
                state.cartItems[itemIndex].quantity -= 1;
                state.totalAmount -= payload.price;
                state.totalQuantity -= 1;
            }
        },

        removeFromCart: (state, {payload}) => {
            const itemToRemove = state.cartItems.find((item) => item._id === payload._id);
            state.cartItems = state.cartItems.filter((item) => item._id !== payload._id);
            state.totalAmount -= itemToRemove.price * itemToRemove.quantity;
            state.totalQuantity -= itemToRemove.quantity;
        },

        addShippingInfo: (state, {payload}) => {
            state.shippingInfo = payload;
        },

        resetCart : (state) => {
            state.cartItems = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
            state.shippingInfo = {};
        },

        setCartItems: (state, {payload}) => {
            state.cartItems = payload;
        }
    }
})

export const cartActions = cartSlice.actions;

export const cartSliceReducer = cartSlice.reducer