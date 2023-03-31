import { PaletteMode } from '@mui/material'
import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
    mode: PaletteMode
}

const initialState: ThemeState = { mode: 'light' }
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        currentTheme(state: ThemeState, action: { payload: PaletteMode }) {
            state.mode = action.payload
        },
    }
})

export const { currentTheme } = themeSlice.actions
export default themeSlice.reducer