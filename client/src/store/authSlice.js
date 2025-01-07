import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    isLoggedIn: !!localStorage.getItem("user"), // check if user exists in local storage
    user: JSON.parse(localStorage.getItem("user")) || null,

};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (state, {payload}) =>{
            state.isLoggedIn = true;
            state.user = payload

            // save to local storage
            localStorage.setItem("user", JSON.stringify(payload));
        },

        updateUser: (state, {payload}) => {
            state.user = payload;
            // save to local storage
            localStorage.setItem("user", JSON.stringify(payload));
        },

        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;

            // remove from local storage
            localStorage.removeItem("user");
        },

        changeRole : (state, {payload}) => {
            state.user = payload;

            // save to local storage
            localStorage.setItem("user", JSON.stringify(payload));
        }
    }
})

// export actions
export const authSliceActions = authSlice.actions;

// export reducer
export const authSliceReducer = authSlice.reducer
