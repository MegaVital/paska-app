import { createSlice } from '@reduxjs/toolkit'

interface PageState {
    page: number
    items: number
}

const initialState: PageState = { page: 1, items: 4 }
const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        currentPage(state: PageState, action: { payload: number }) {
            state.page = action.payload
        },
        itemsPerPage(state: PageState, action: { payload: number }) {
            state.items = action.payload
        }
    }

})

export const { currentPage, itemsPerPage } = pageSlice.actions
export default pageSlice.reducer