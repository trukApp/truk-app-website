import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiConfig from '../Config/Config'


const baseUrl = apiConfig.develpoment.apiBaseUrl;
const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders:  (headers) => {
        try {
            const token =  localStorage.getItem('accessToken');
            const uniqueDeviceId =  'uniqueid'
            const loginId =  '21'

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            if (loginId) {
                headers.set('login_id', loginId);
            }

            if (uniqueDeviceId) {
                headers.set('unq_d_id', uniqueDeviceId);
            }
        } catch (error) {
            console.error('Error fetching headers from AsyncStorage:', error);
        }

        return headers;
    },
});

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery,
  tagTypes: ['User', 'Post', 'Users',"News"], 
  endpoints: (builder) => ({
    

    getUsers: builder.query<any, void>({
      query: () => ({
        url: 'news-routes/news',
        method: 'GET',
      }),
    providesTags: (result) => [{ type: 'Users', id: 'LIST' }],
    }),
    getAllLatestNews: builder.query<any, void>({
            query: () => 'news-routes/news',
            providesTags: [{ type: 'News', id: 'LIST' }],
    }),

    userLogin : builder.mutation({
      query: (body) =>({
        url: 'log/login',
        method: 'POST',
        body: body
      })
    })

  }),
});


export const {
  useGetUsersQuery,
  useUserLoginMutation,
  useGetAllLatestNewsQuery,

} = apiSlice;
