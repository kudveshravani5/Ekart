import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
  },
  reducers: {
    //actions
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfilePic: (state, action) => {
      if (state.user) {
        state.user.profilePic = action.payload;
      }
    },
    firstname: (state, action) => {
      if (state.user) {
        state.user.firstname = action.payload;
      }
    },
  },
});
export const { setUser , setProfilePic , firstname} = userSlice.actions;
export default userSlice.reducer;
