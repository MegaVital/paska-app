import { createSlice } from '@reduxjs/toolkit'

interface PageState {
    page: number
}

const initialState: PageState = { page: 1 }
const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        currentPage(state: PageState, action: { payload: number }) {
            state.page = action.payload
        }
    }

})

export const { currentPage } = pageSlice.actions
export default pageSlice.reducer