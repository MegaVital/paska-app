import { createSlice } from "@reduxjs/toolkit"

interface TokenState {
    id: string,
    name: string,
    currentToken: string,
    isAuth: boolean
}

const initialState: TokenState = {
    id: '',
    name: '',
    currentToken: '',
    isAuth: false
}

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        addToken(state: TokenState, action: { payload: TokenState }) {

            state.id = action.payload.id
            state.name = action.payload.name
            state.currentToken = action.payload.currentToken
            state.isAuth = action.payload.isAuth

        },
        deleteToken(state: TokenState) {
            state.id = ''
            state.name = ''
            state.currentToken = ''
            state.isAuth = false

        },

    }
})


export const { addToken, deleteToken } = tokenSlice.actions
export default tokenSlice.reducer