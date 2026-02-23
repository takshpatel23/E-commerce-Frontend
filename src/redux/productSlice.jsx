import { createSlice } from "@reduxjs/toolkit"
import { menProducts, womenProducts, kidsProducts } from "../assets/data"

const initialState = {
  men: menProducts,
  women: womenProducts,
  kids: kidsProducts,
  selectedCategory: "all",
  searchQuery: "",
 
  allProducts: [...menProducts, ...womenProducts, ...kidsProducts],
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
     setSearchQuery: (state, action) => {   
      state.searchQuery = action.payload
    }
  },
})

export const { selectCategory, setSearchQuery } = productSlice.actions
export default productSlice.reducer
