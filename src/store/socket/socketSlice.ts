import {createSlice} from "@reduxjs/toolkit";

const initialState: exportMenuState =
    document.cookie.includes("socketData") ? JSON.parse(decodeURIComponent(document.cookie.split("socketData=")[1].split(';')[0])) :
    {
    userName: "Guest"
}

export type exportMenuState = {
    roomName?: string,
    userName?: string
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        emitUserName: (state, action) => {
            state.userName = action.payload;

            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (5 * 60 * 1000)); // 5 minutes in milliseconds

            const expires = "expires=" + expirationDate.toUTCString();
            document.cookie = "socketData=" + JSON.stringify(state) + "; " + expires + "; path=/";

        },
        emitRoomName: (state, action) => {
            state.roomName = action.payload;

            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (5 * 60 * 1000)); // 5 minutes in milliseconds

            const expires = "expires=" + expirationDate.toUTCString();
            document.cookie = "socketData=" + JSON.stringify(state) + "; " + expires + "; path=/";
        }
    }
})

export const {
    emitUserName,
    emitRoomName,
} = socketSlice.actions

export default socketSlice.reducer