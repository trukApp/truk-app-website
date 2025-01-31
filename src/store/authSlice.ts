// import { IPackage } from './authSlice';
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ITruck {
  id: number;
  ownerName: string;
  truckNumber: string;
  height: string;
  width: string;
  length: string;
  volume: string;
  capacity: string;
  usage: string;
  truckName: string;

  allocatedVolume: number;
  vehicle_ID: string;
  allocatedWeight: number;
  leftoverWeight: string;
  leftoverVolume: string;
}

interface PackagingType {
  pac_ID: string;
  location: string;
}

interface Product {
  productName: string;
  productCode: string;
  category: string;
  subCategory: string;
  price: number;
  stockQuantity: number;
  manufacturer: string;
  description: string;
  warehouseLocation: string;
  warehousePincode: string;
  warehouseState: string;
  warehouseCity: string;
  warehouseCountry: string;
  product_ID: string;
  product_desc: string;
  sales_uom: string;
  basic_uom: string;
  weight: string;
  volume: string;
  expiration: string;
  best_before: string;
  hsn_code: string;
  sku_num: string;
  fragile_goods: boolean;
  dangerous_goods: boolean;
  id: number;
  prod_id: number;
  loc_ID: string;
  specialInstructions: string;
  documents: string;
  stacking_factor: string;
  packaging_type: PackagingType[];
  temp_controlled: boolean;
  hazardous: boolean;
  product_name: string;
  packagingType: PackagingType[];
  packing_label: boolean;
  special_instructions: string;
  tempControl: boolean;
  packingLabel: boolean;
}

export interface IAuthState {
  authState: boolean;
  bablu: string;
  accessToken: string | null;
  refreshToken: string | null;
  selectedTrucks: Array<ITruck> | null;
  unitsofMeasurement: string[];
  selectedPackages: Array<Product>;
  createOrderDesination: string;
}

const initialState: IAuthState = {
  authState: false,
  bablu: "",
  accessToken: null,
  refreshToken: null,
  selectedTrucks: [],
  unitsofMeasurement: [],
  selectedPackages: [],
  createOrderDesination: "",
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
    setSelectedTrucks: (state, action: PayloadAction<Array<ITruck>>) => {
      state.selectedTrucks = action.payload;
    },
    setUnitsofMeasurement: (state, action: PayloadAction<string[]>) => {
      state.unitsofMeasurement = action.payload;
    },
    setSelectedPackages: (state, action: PayloadAction<Array<Product>>) => {
      console.log("action.payload: ", action.payload);
      state.selectedPackages = action.payload; // Update selected packages
    },
    setCreateOrderDesination: (state, action: PayloadAction<string>) => {
      console.log("source location ", action.payload);
      state.createOrderDesination = action.payload;
    },
  },
});

export const {
  setAuthState,
  setBabluName,
  setAccessToken,
  setRefreshToken,
  setSelectedTrucks,
  setUnitsofMeasurement,
  setSelectedPackages,
  setCreateOrderDesination,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
