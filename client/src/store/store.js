import { configureStore } from "@reduxjs/toolkit";
import { authSliceReducer } from "./authSlice";
import { cartSliceReducer } from "./cartSlice";
import { myCartSliceReducer } from "./myCartSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        cart: cartSliceReducer,
        myCart: myCartSliceReducer
    }
})

export default store