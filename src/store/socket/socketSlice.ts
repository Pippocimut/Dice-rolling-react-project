import {createSlice} from "@reduxjs/toolkit";
import type {Socket} from "socket.io-client";

const initialState: exportMenuState = {}

export type exportMenuState = {
    roomName?: string,
    userName?: string,
    socket?: Socket
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        emitUserName: (state, action) => {
            state.userName = action.payload;
        },
        emitRoomName: (state, action) => {
            state.roomName = action.payload;
        }
    }
})

export const {
    emitUserName,
    emitRoomName,
} = socketSlice.actions

export default socketSlice.reducer