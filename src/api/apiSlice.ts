import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiConfig from "../Config/Config";
// import { getAccessToken } from "./getAccessToken";
import { getSession } from "next-auth/react";

// Define the base URL
const baseUrl = apiConfig.develpoment.apiBaseUrl;

// Base query with headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    try {
      const session = await getSession();
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
  tagTypes: ["LocationMaster", "VehicleMaster", "PARTNERS", "DRIVERS"],
  endpoints: (builder) => ({
    userLogin: builder.mutation<User, { phone: string; password: string }>({
      query: (body) => ({
        url: "log/login",
        method: "POST",
        body,
      }),
    }),

    getLocationMaster: builder.query({
      query: () => ({
        url: "masLoc/all-locations",
        method: "GET",
      }),
      providesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    postLocationMaster: builder.mutation({
      query: (body) => ({
        url: "masLoc/create-location",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    editLocationMaster: builder.mutation({
      query: ({ body, locationId }) => ({
        url: `masLoc/edit-location?id=${locationId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    deleteLocationMaster: builder.mutation({
      query: (locationId) => ({
        url: `masLoc/delete-location?id=${locationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    getVehicleMaster: builder.query({
      query: () => ({
        url: "vehicle/vehicles",
        method: "GET",
      }),
      providesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    postVehicleMaster: builder.mutation({
      query: (body) => ({
        url: "vehicle/add-vehicle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    //Business Partners API'S
    customerRegistration: builder.mutation({
      query: (body) => ({
        url: "business/create-partners",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    editBusinessPartner: builder.mutation({
      query: ({ body, partnerId }) => ({
        url: `business/edit-partner?partner_id=${partnerId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    deleteBusinessPartner: builder.mutation({
      query: (partnerId) => ({
        url: `business/delete-partner?partner_id=${partnerId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    getAllCustomersData: builder.query({
      query: (params) => ({
        url: "business/get-partners",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    getAllVendorsData: builder.query({
      query: (params) => ({
        url: "business/get-partners",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    //Drivers API'S
    driverRegistration: builder.mutation({
      query: (body) => ({
        url: "driver/add-drivers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DRIVERS", id: "LIST" }],
    }),

    deleteDriver: builder.mutation({
      query: (driverId) => ({
        url: `driver/delete-driver?driver_id=${driverId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DRIVERS", id: "LIST" }],
    }),


    editDriver: builder.mutation({
      query: ({ body, driverId }) => ({
        url: `driver/edit-driver?driver_id=${driverId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "DRIVERS", id: "LIST" }],
    }),

    getAllDriversData: builder.query({
      query: (params) => ({
        url: "driver/get-drivers",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DRIVERS", id: "LIST" }],
    }),

  }),
});

export const {
  useUserLoginMutation,
  useCustomerRegistrationMutation,
  useGetLocationMasterQuery,
  useDriverRegistrationMutation,
  useGetAllCustomersDataQuery,
  useGetAllVendorsDataQuery,
  useGetAllDriversDataQuery,
  usePostLocationMasterMutation,
  useEditLocationMasterMutation,
  useDeleteLocationMasterMutation,
  useGetVehicleMasterQuery,
  usePostVehicleMasterMutation,
  useEditBusinessPartnerMutation,
  useDeleteBusinessPartnerMutation,
  useEditDriverMutation,
  useDeleteDriverMutation
} = apiSlice;
