import { configureStore } from "@reduxjs/toolkit"

function adminReducer(state = {}, action) {
  return state
}

const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
})

export default store;