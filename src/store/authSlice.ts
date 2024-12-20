import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IPackage {
  id: Number;
  packageName: string;
  weight: string;
  length: string;
  width: string;
  volume: string;
  senderName: string;
  senderAddress: string;
  senderPincode: string;
  senderState: string;
  senderCountry: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverPincode: string;
  receiverState: string;
  receiverCountry: string;
  receiverPhone: string;
}

export interface ITruck {
  id: Number;
  ownerName: string;
  truckNumber: string;
  height: string;
  width: string;
  length: string;
  volume: string;
  capacity: string;
  usage: string;
  truckName: string;
}

export interface IAuthState {
  authState: boolean;
  bablu: string;
  accessToken: string | null;
  refreshToken: string | null;
  selectedPackages: Array<IPackage> | null;
  selectedTrucks: Array<ITruck> | null;
}

const initialState: IAuthState = {
  authState: false,
  bablu: "",
  accessToken: null,
  refreshToken: null,
  selectedPackages: [],
  selectedTrucks: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    setBabluName: (state, action: PayloadAction<string>) => {
      state.bablu = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setSelectedPackages: (state, action: PayloadAction<Array<IPackage>>) => {
      state.selectedPackages = action.payload;
    },
    setSelectedTrucks: (state, action: PayloadAction<Array<ITruck>>) => {
      state.selectedTrucks = action.payload;
    },
  },
});

export const {
  setAuthState,
  setBabluName,
  setAccessToken,
  setRefreshToken,
  setSelectedTrucks,
  setSelectedPackages,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
