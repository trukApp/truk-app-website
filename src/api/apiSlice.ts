import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiConfig from "../Config/Config";
// import { getAccessToken } from "./getAccessToken";
import { getSession } from "next-auth/react";


// Define the base URL
const baseUrl = apiConfig.develpoment.apiBaseUrl;

// Base query with headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders:async (headers) => {
    try {
      const session = await getSession()
      const token = session?.user?.accessToken;
      console.log("token from apislice :", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error fetching headers", error);
    }

    return headers;
  },
});

// Define types for the API responses
interface User {
  id: string;
  name: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["LocationMaster","VehicleMaster"],
  endpoints: (builder) => ({
    userLogin: builder.mutation<User, { phone: string; password: string }>({
      query: (body) => ({
        url: "log/login",
        method: "POST",
        body,
      }),
    }),

    customerRegistration: builder.mutation({
      query: (body) => ({
        url: "business/create-partners",
        method: "POST",
        body,
      }),
    }),

    driverRegistration: builder.mutation({
      query: (body) => ({
        url: "driver/add-drivers",
        method: "POST",
        body,
      }),
    }),

    getLocationMaster: builder.query({
      query: () => ({
        url: 'masLoc/all-locations',
        method: 'GET',
      }),
      providesTags: [{ type: 'LocationMaster', id: 'LIST' }],
    }),

    postLocationMaster: builder.mutation({
      query: (body) => ({
        url: "masLoc/create-location",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: 'LocationMaster', id: 'LIST' }],
    }),

    getVehicleMaster: builder.query({
      query: () => ({
        url: 'vehicle/vehicles',
        method: 'GET',
      }),
      providesTags: [{ type: 'VehicleMaster', id: 'LIST' }],
    }),

    postVehicleMaster: builder.mutation({
      query: (body) => ({
        url: "vehicle/add-vehicle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: 'VehicleMaster', id: 'LIST' }],
    }),
      

  }),
});

export const {
  useUserLoginMutation,
  useCustomerRegistrationMutation,
  useGetLocationMasterQuery,
  useDriverRegistrationMutation,
  usePostLocationMasterMutation,
  useGetVehicleMasterQuery,
  usePostVehicleMasterMutation
} = apiSlice;
