import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdditionalInfo } from "@/Components/CreatePackageTabs/AddtionalInformation";
import { FormValues } from "@/Components/CreatePackageTabs/PickUpAndDropOffDetails";
import { Truck } from "@/Components/CreateOrderTables/TrucksTable";
import { Package } from "@/Components/CreateOrderTables/PackagesTable";

export interface IShipFrom {
  addressLine1: string;
  addressLine2: string;
  city: string;
  contactPerson: string;
  country: string;
  email: string;
  locationDescription: string;
  locationId: string;
  phoneNumber: string;
  pincode: string;
  // saveAsDefaultShipFromLocation: boolean;
  // saveAsNewLocationId: boolean;
  state: string;
  latitude: string;
  longitude: string;
  timeZone: string;
  locationType: string;
  glnCode: string;
  iataCode: string;
}

export interface IShipTo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  contactPerson: string;
  country: string;
  email: string;
  locationDescription: string;
  locationId: string;
  phoneNumber: string;
  pincode: string;
  state: string;
  latitude: string;
  longitude: string;
  timeZone: string;
  locationType: string;
  glnCode: string;
  iataCode: string;
}

export interface IProductDetail {
  productId: string;
  productName: string;
  hsnCode: string;
  dimensions: string;
  packagingType: string;
  quantity: string;
  rfid: string;
  weight: string;
}

export interface IPackageTax {
  senderGSTN: string;
  receiverGSTN: string;
  carrierGSTN: string;
  isSelfTransport: string;
  taxRate: string;
}

export interface IAuthState {
  authState: boolean;
  bablu: string;
  accessToken: string | null;
  refreshToken: string | null;
  selectedTrucks: Array<Truck> | null;
  unitsofMeasurement: string[];
  selectedPackages: Array<Package>;
  createOrderDesination: string;
  packageShipFrom: IShipFrom | null;
  packageShipTo: IShipTo | null;
  packagesDetails: Array<IProductDetail>;
  packageBillTo: IShipFrom | null;
  packageAdditionalInfo: AdditionalInfo | null;
  packagePickAndDropTimings: FormValues | null;
  packageTax: IPackageTax | null;
  completedState: boolean[];
  filters: ConfigFilters;
}

export interface ConfigFilters {
  checkValidity: boolean;
  checkDowntime: boolean;
  sortUnlimitedUsage: boolean;
  sortOwnership: boolean;
  sortByCost: boolean;
  sortByCapacity: boolean;
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
  packageShipFrom: null,
  packageShipTo: null,
  packagesDetails: [],
  packageBillTo: null,
  packageAdditionalInfo: null,
  packagePickAndDropTimings: null,
  packageTax: null,
  completedState: [],
  filters: {
    checkValidity: true,
    checkDowntime: true,
    sortUnlimitedUsage: true,
    sortOwnership: true,
    sortByCost: true,
    sortByCapacity: true,
  },
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
    setSelectedTrucks: (state, action: PayloadAction<Array<Truck>>) => {
      state.selectedTrucks = action.payload;
    },
    setUnitsofMeasurement: (state, action: PayloadAction<string[]>) => {
      state.unitsofMeasurement = action.payload;
    },
    setSelectedPackages: (state, action: PayloadAction<Array<Package>>) => {
      state.selectedPackages = action.payload;
    },
    setCreateOrderDesination: (state, action: PayloadAction<string>) => {
      state.createOrderDesination = action.payload;
    },
    setPackageShipFrom: (state, action: PayloadAction<IShipFrom | null>) => {
      state.packageShipFrom = action.payload;
    },
    clearPackageShipFrom: (state) => {
      state.packageShipFrom = null;
    },
    setPackageShipTo: (state, action: PayloadAction<IShipFrom | null>) => {
      state.packageShipTo = action.payload;
    },

    setProductsList: (state, action: PayloadAction<Array<IProductDetail>>) => {
      state.packagesDetails = action.payload;
    },
    setPackageBillTo: (state, action: PayloadAction<IShipFrom | null>) => {
      state.packageBillTo = action.payload;
    },
    setPackageAddtionalInfo: (
      state,
      action: PayloadAction<AdditionalInfo | null>
    ) => {
      state.packageAdditionalInfo = action.payload;
    },
    setPackagePickAndDropTimings: (
      state,
      action: PayloadAction<FormValues | null>
    ) => {
      state.packagePickAndDropTimings = action.payload;
    },
    setPackageTax: (state, action: PayloadAction<IPackageTax | null>) => {
      state.packageTax = action.payload;
    },
    setCompletedState: (state, action: PayloadAction<number>) => {
      state.completedState[action.payload] = true;
    },
    resetCompletedSteps: (state) => {
      state.completedState = [];
    },
    setFilters: (state, action: PayloadAction<ConfigFilters>) => {
      state.filters = action.payload;
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
  setPackageShipFrom,
  clearPackageShipFrom,
  setPackageShipTo,
  setProductsList,
  setPackageBillTo,
  setPackageAddtionalInfo,
  setPackagePickAndDropTimings,
  setPackageTax,
  setCompletedState,
  resetCompletedSteps,
  setFilters,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
