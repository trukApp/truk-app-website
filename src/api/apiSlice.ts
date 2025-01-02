import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiConfig from "../Config/Config";

// Define the base URL
const baseUrl = apiConfig.develpoment.apiBaseUrl;

// Base query with headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("token from apislice :", token)
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error fetching headers from AsyncStorage:", error);
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
  tagTypes: ["User", "Post", "Users", "News"],
  endpoints: (builder) => ({
    // getUsers: builder.query<User[], void>({
    //   query: () => ({
    //     url: "news-routes/news",
    //     method: "GET",
    //   }),
    //   providesTags: ["Users"], // Tag without using result
    // }),

    // getAllLatestNews: builder.query<News[], void>({
    //   query: () => "news-routes/news",
    //   providesTags: ["News"], // Tag without using result
    // }),

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

    getLocationMaster: builder.query({
      query: () => ({
        url: 'masLoc/all-locations',
        method: 'GET',
      }),
    }),

  }),
});

export const {
  // useGetUsersQuery,
  useUserLoginMutation,
  // useGetAllLatestNewsQuery,
  useCustomerRegistrationMutation,
  useGetLocationMasterQuery,
} = apiSlice;
