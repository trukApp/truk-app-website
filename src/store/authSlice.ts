import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdditionalInfo } from "@/Components/CreatePackageTabs/AddtionalInformation";
import { FormValues } from "@/Components/CreatePackageTabs/PickUpAndDropOffDetails";
import { Truck } from "@/Components/CreateOrderTables/TrucksTable";
import { Package } from "@/Components/CreateOrderTables/PackagesTable";

export interface Address {
  address: string;
  latitude: number;
  longitude: number;
}
export interface Route {
  distance: string;
  duration: string;
  start: Address;
  end: Address;
  loadAfterStop: number;
}
export interface ISelectedRoute {
  route: Route;
  routeIndex: number | null;
  vehicle: string;
}
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
  destination_radius: string;
  destination_radius_unit: string
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
  product_ID: string;
}

export interface IPackageTax {
  senderGSTN: string;
  receiverGSTN: string;
  carrierGSTN: string;
  isSelfTransport: string;
  taxRate: string;
}

export interface DriverPointDeviation {
  lat: number;
  lng: number;
  time: string;
  deviationDistanceKM: string;
  reason: string;
}

interface DeviationState {
  message: string;
  order_ID: string;
  vehicle_ID: string;
  expected_distance: string;
  actual_distance: string;
  start_deviation_km: string;
  end_deviation_km: string;
  deviation_detected: boolean;
  deviation_reasons: string[];
  driverPointDeviations: DriverPointDeviation[];
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
  selectedRoutes: ISelectedRoute[];
  packageShipFrom: IShipFrom | null;
  packageShipTo: IShipTo | null;
  packagesDetails: Array<IProductDetail>;
  packageBillTo: IShipFrom | null;
  packageAdditionalInfo: AdditionalInfo | null;
  packagePickAndDropTimings: FormValues | null;
  packageTax: IPackageTax | null;
  completedState: boolean[];
  filters: ConfigFilters;
  deviationData: DeviationState | null;
}

export interface ConfigFilters {
  checkValidity: boolean;
  checkDowntime: boolean;
  sortUnlimitedUsage: boolean;
  sortOwnership: boolean;
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
  selectedRoutes: [],
  filters: {
    checkValidity: true,
    checkDowntime: true,
    sortUnlimitedUsage: true,
    sortOwnership: true,
  },
  deviationData: null,
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
    setSelectedRoutes: (state, action: PayloadAction<ISelectedRoute[]>) => {
      state.selectedRoutes = action.payload;
    },
    setDeviationData: (state, action: PayloadAction<DeviationState>) => {
      state.deviationData = action.payload;
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
  setSelectedRoutes,
  setDeviationData,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
