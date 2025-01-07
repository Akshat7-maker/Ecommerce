import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart : null
}


const myCartSlice = createSlice({
    name:"myCart",
    initialState,
    reducers:{
        setCart : (state, {payload}) => {
            state.cart = payload
        }
    }
})

export const myCartActions = myCartSlice.actions;

export const myCartSliceReducer = myCartSlice.reducer