import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AdditionalInfo } from "@/Components/CreatePackageTabs/AddtionalInformation";
import { FormValues } from "@/Components/CreatePackageTabs/PickUpAndDropOffDetails";
import { Package } from "@/Components/CreateOrderTables/PackagesTable";
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
}

export interface IAuthState {
  authState: boolean;
  bablu: string;
  accessToken: string | null;
  refreshToken: string | null;
  selectedTrucks: Array<ITruck> | null;
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
  shipFromState: IShipFrom | null;
  shipToState: IShipTo | null;
  packageDetailsState: IProductDetail | null;
  billToState: IShipFrom | null;
  additionalInfoState: AdditionalInfo | null;
  pickupDropoffState: FormValues | null;
  taxInfoState: IPackageTax | null;
  filters: {
    checkValidity: boolean;
    checkDowntime: boolean;
    sortUnlimitedUsage: boolean;
    sortOwnership: boolean;
    sortByCost: boolean;
    sortByCapacity: boolean;
  };
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
  shipFromState: null,
  shipToState: null,
  packageDetailsState: null,
  billToState: null,
  additionalInfoState: null,
  pickupDropoffState: null,
  taxInfoState: null,
  filters: {
    checkValidity: false,
    checkDowntime: false,
    sortUnlimitedUsage: false,
    sortOwnership: false,
    sortByCost: false,
    sortByCapacity: false,
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
    setSelectedTrucks: (state, action: PayloadAction<Array<ITruck>>) => {
      state.selectedTrucks = action.payload;
    },
    setUnitsofMeasurement: (state, action: PayloadAction<string[]>) => {
      state.unitsofMeasurement = action.payload;
    },
    setSelectedPackages: (state, action: PayloadAction<Array<Package>>) => {
      console.log("action.payload: ", action.payload);
      state.selectedPackages = action.payload; // Update selected packages
    },
    setCreateOrderDesination: (state, action: PayloadAction<string>) => {
      console.log("source location ", action.payload);
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
      console.log("Updating package details:", action.payload);
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

    setPackageShipFromState: (
      state,
      action: PayloadAction<IShipFrom | null>
    ) => {
      state.packageShipFrom = action.payload;
    },
    setPackageShipToState: (state, action: PayloadAction<IShipFrom | null>) => {
      state.packageShipTo = action.payload;
    },
    setProductsListState: (
      state,
      action: PayloadAction<Array<IProductDetail>>
    ) => {
      state.packagesDetails = action.payload;
    },
    setPackageBillToState: (state, action: PayloadAction<IShipFrom | null>) => {
      state.packageBillTo = action.payload;
    },

    setPackageTaxState: (state, action: PayloadAction<IPackageTax | null>) => {
      state.packageTax = action.payload;
    },
    setPackageAdditionalInfoState: (
      state,
      action: PayloadAction<IShipFrom | null>
    ) => {
      state.packageShipFrom = action.payload;
    },
    setPackagePickupDropState: (
      state,
      action: PayloadAction<IShipFrom | null>
    ) => {
      state.packageShipTo = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<IAuthState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
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
  setPackageShipFromState,
  setPackageShipToState,
  setProductsListState,
  setPackageBillToState,
  setPackageTaxState,
  setPackageAdditionalInfoState,
  setPackagePickupDropState,
  setFilters,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
