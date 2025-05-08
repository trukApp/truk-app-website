import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiConfig from "../Config/Config"; 
import { getSession } from "next-auth/react";

// Define the base URL
const baseUrl = apiConfig.develpoment.apiBaseUrl;

// Base query with headers
// const baseQuery = fetchBaseQuery({
//   baseUrl,
//   prepareHeaders: async (headers) => {
//     try {
//       const session = await getSession();
//       const token = session?.user?.accessToken;
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//     } catch (error) {
//       console.error("Error fetching headers", error);
//     }

//     return headers;
//   },
// });

const customBaseQuery = async (
  args: string | FetchArgs,
  api:BaseQueryApi ,
  extraOptions :Record<string, unknown>
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return rawBaseQuery(args, api, extraOptions);
};
// Define types for the API responses
interface User {
  id: string;
  name: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery:customBaseQuery,
  tagTypes: [
    "PARTNERS",
    "DRIVERS",
    "CARRIER",
    "LocationMaster",
    "VehicleMaster",
    "PackageMaster",
    "LaneMaster",
    "DeviceMaster",
    "ProductMaster",
    "UomMaster",
    "DockMaster",
    "CreateOrder",
    "PackagesForOrder",
    "Orders",
    "Orderss",
    "AssignedOrders",
    "SingleVehicleMaster",
    "DataCount",
    "ValidateRoute",
    "DockCarrier"
  ],
  endpoints: (builder) => ({
    userLogin: builder.mutation<User, { phone: string; password: string }>({
      query: (body) => ({
        url: "log/login",
        method: "POST",
        body,
      }),
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

    vendorRegistration: builder.mutation({
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
        url: "business/business-partners",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "PARTNERS", id: "LIST" }],
    }),

    getAllVendorsData: builder.query({
      query: (params) => ({
        url: "business/business-partners",
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

    getFilteredDrivers: builder.query({
      query: (searchKey) => ({
        url: `driver/search-drivers`,
        method: "GET",
        params: { searchKey },
      }),
      providesTags: [{ type: "DRIVERS", id: "SEARCH" }],
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

    getDriverData: builder.query({
      query: (params) => ({
        url: "driver/get-driver",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DRIVERS", id: "LIST" }],
    }),

    //  carrier master
    getCarrierMaster: builder.query({
      query: (params) => ({
        url: `carrier/all-carriers`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "CARRIER", id: "LIST" }],
    }),

    postCarrierMaster: builder.mutation({
      query: (body) => ({
        url: "carrier/create-carriers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CARRIER", id: "LIST" }, { type: "DataCount", id: "LIST" }],
    }),

    editCarrierMaster: builder.mutation({
      query: ({ body, carrierId }) => ({
        url: `carrier/edit-carrier?cr_id=${carrierId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "CARRIER", id: "LIST" }],
    }),

    deleteCarrierMaster: builder.mutation({
      query: (carrierId) => ({
        url: `carrier/delete-carrier?cr_id=${carrierId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CARRIER", id: "LIST" }],
    }),

    //  location master
    getLocationMaster: builder.query({
      query: (params) => ({
        url: `masLoc/all-locations`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    getFilteredLocations: builder.query({
      query: (searchKey) => ({
        url: `masLoc/search-locations`,
        method: "GET",
        params: { searchKey },
      }),
      providesTags: [{ type: "LocationMaster", id: "SEARCH" }],
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

    updateShipFromDefaultLocationId: builder.mutation({
      query: ({ locId, defShipFrom }) => ({
        url: `masLoc/update-location-flag?loc_ID=${locId}&def_ship_from=${defShipFrom}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    updateShipToDefaultLocationId: builder.mutation({
      query: ({ locId, defShipFrom }) => ({
        url: `masLoc/update-location-flag?loc_ID=${locId}&def_ship_to=${defShipFrom}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    updateBillToDefaultLocationId: builder.mutation({
      query: ({ locId, defShipFrom }) => ({
        url: `masLoc/update-location-flag?loc_ID=${locId}&def_bill_to=${defShipFrom}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "LocationMaster", id: "LIST" }],
    }),

    // vehciles master
    getVehicleMaster: builder.query({
      query: (params) => {
        return {
          url: `vehicle/vehicles`,
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    getFilteredVehicles: builder.query({
      query: (searchKey) => ({
        url: `self/search-self-vehicles`,
        method: "GET",
        params: { searchKey },
      }),
      providesTags: [{ type: "VehicleMaster", id: "SEARCH" }],
    }),

    postVehicleMaster: builder.mutation({
      query: (body) => ({
        url: "vehicle/add-vehicle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    editVehicleMaster: builder.mutation({
      query: ({ body, vehicleId }) => ({
        url: `vehicle/edit-vehicle?veh_id=${vehicleId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    deleteVehicleMaster: builder.mutation({
      query: (vehicleId) => ({
        url: `vehicle/delete-vehicle?veh_id=${vehicleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "VehicleMaster", id: "LIST" }],
    }),

    // Package master
    getPackageMaster: builder.query({
      query: (params) => ({
        url: `package/get-all-packages`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "PackageMaster", id: "LIST" }],
    }),

    postPackageMaster: builder.mutation({
      query: (body) => ({
        url: "package/create-package",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PackageMaster", id: "LIST" }],
    }),

    editPackageMaster: builder.mutation({
      query: ({ body, packageId }) => ({
        url: `package/edit-package?package_id=${packageId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "PackageMaster", id: "LIST" }],
    }),

    deletePackageMaster: builder.mutation({
      query: (packageId) => ({
        url: `package/delete-package?package_id=${packageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PackageMaster", id: "LIST" }],
    }),

    // Lanes master
    getLanesMaster: builder.query({
      query: (params) => ({
        url: `lane/all-lanes`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "LaneMaster", id: "LIST" }],
    }),

    postLaneMaster: builder.mutation({
      query: (body) => ({
        url: "lane/create-lanes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "LaneMaster", id: "LIST" }],
    }),

    editLaneMaster: builder.mutation({
      query: ({ body, laneId }) => ({
        url: `lane/edit-lane?ln_id=${laneId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "LaneMaster", id: "LIST" }],
    }),

    deleteLaneMaster: builder.mutation({
      query: (laneId) => ({
        url: `lane/delete-lane?ln_id=${laneId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LaneMaster", id: "LIST" }],
    }),

    // Device master
    getDeviceMaster: builder.query({
      query: (params) => ({
        url: `device/all-devices`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DeviceMaster", id: "LIST" }],
    }),

    postDeviceMaster: builder.mutation({
      query: (body) => ({
        url: "device/add-devices",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DeviceMaster", id: "LIST" }],
    }),

    editDeviceMaster: builder.mutation({
      query: ({ body, deviceId }) => ({
        url: `device/edit-device?device_id=${deviceId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "DeviceMaster", id: "LIST" }],
    }),

    deleteDeviceMaster: builder.mutation({
      query: (deviceId) => ({
        url: `device/delete-device?device_id=${deviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DeviceMaster", id: "LIST" }],
    }),

    //  UOM Master
    getUomMaster: builder.query({
      query: (params) => ({
        url: "masterUom/all-uom",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "UomMaster", id: "LIST" }],
    }),

    postUomMaster: builder.mutation({
      query: (body) => ({
        url: "masterUom/add-uom",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "UomMaster", id: "LIST" }],
    }),

    editUomMaster: builder.mutation({
      query: ({ body, uomId }) => ({
        url: `masterUom/edit-uom?unit_id=${uomId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "UomMaster", id: "LIST" }],
    }),

    deleteUomMaster: builder.mutation({
      query: (uomId) => ({
        url: `masterUom/delete-uom?unit_id=1${uomId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "UomMaster", id: "LIST" }],
    }),

    // Dock master 
        getDockMaster: builder.query({
      query: (params) => ({
        url: `masterDock/all-docks`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "DockMaster", id: "LIST" }],
    }),

    postDockMaster: builder.mutation({
      query: (body) => ({
        url: "masterDock/create-dock",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DockMaster", id: "LIST" }],
    }),

    editDockMaster: builder.mutation({
      query: ({ body, dock_ID }) => ({
        url: `masterDock/edit-dock?dock_ID=${dock_ID}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "DockMaster", id: "LIST" }],
    }),

    deleteDockMaster: builder.mutation({
      query: (dock_ID) => ({
        url: `masterDock/delete-dock?id=${dock_ID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DockMaster", id: "LIST" }],
    }),

    //Product Master
    getAllProducts: builder.query({
      query: (params) => ({
        url: `masterProducts/all-products`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "ProductMaster", id: "LIST" }],
    }),

    getFilteredProducts: builder.query({
      query: (searchKey) => ({
        url: `masterProducts/search-products`,
        method: "GET",
        params: { searchKey },
      }),
      providesTags: [{ type: "ProductMaster", id: "LIST" }],
    }),

    createProduct: builder.mutation({
      query: (body) => ({
        url: "masterProducts/add-products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProductMaster", id: "LIST" }],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `masterProducts/delete-product?prod_id=${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProductMaster", id: "LIST" }],
    }),

    editProduct: builder.mutation({
      query: ({ body, productId }) => ({
        url: `masterProducts/edit-product?prod_id=${productId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "ProductMaster", id: "LIST" }],
    }),

    getDataCount: builder.query({
      query: () => ({
        url: `data/count-data`,
        method: "GET",
      }),
      providesTags: [{ type: "DataCount", id: "LIST" }],
    }),

    //Packages API'S
    getAllPackagesForOrder: builder.query({
      query: (params) => ({
        url: `products/packages/all-packages`,
        method: "GET",
        params,
      }),
      providesTags: [
        { type: "PackagesForOrder", id: "LIST" },
        { type: "Orders", id: "LIST" },
      ],
    }),

    createPackageForOrder: builder.mutation({
      query: (body) => ({
        url: "products/packages/generate-package",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PackagesForOrder", id: "LIST" }],
    }),

    deletePackageForOrder: builder.mutation({
      query: (packageId) => ({
        url: ` products/packages/delete-package?pac_id?pac_id=${packageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PackagesForOrder", id: "LIST" }],
    }),

    editPackageForOrder: builder.mutation({
      query: ({ body, packageId }) => ({
        url: `products/packages/edit-package?pac_id=${packageId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "PackagesForOrder", id: "LIST" }],
    }),

    //Crearte order
    selectTheProducts: builder.mutation({
      query: (body) => {
        return {
          url: "createOrder/create-order",
          method: "POST",
          body,
        };
      },
    }),

    confomOrder: builder.mutation({
      query: (body) => {
        return {
          url: "order/confirm-order",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    editOrder: builder.mutation({
      query: ({body, params}) => {
        return {
          url: "order/edit-order",
          method: "PUT",
          body,
          params
        };
      },
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    getAllOrders: builder.query({
      query: (params) => ({
        url: `order/all-orders`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),

    getOrderById: builder.query({
      query: ({ orderId }) => ({
        url: `order/order-by-id`,
        method: "GET",
        params: { order_ID: orderId },
      }),
      providesTags: [{ type: "Orders", id: "LIST" },{type: "Orderss", id: "LIST"}],
    }),

    getAllAssignedOrders: builder.query({
      query: (params) => ({
        url: `ao/assigned-orders`,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "AssignedOrders", id: "LIST" }],
    }),
    postAssignOrder: builder.mutation({
      query: (body) => {
        return {
          url: "ao/assign-order",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "AssignedOrders", id: "LIST" }],
    }),

    editAssignOrderOrder: builder.mutation({
      query: ({ body, id }) => ({
        url: `ao/update-assigned-order?assigning_id=1${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "AssignedOrders", id: "LIST" }],
    }),

    // image uploading
    imageUploading: builder.mutation({
      query: (formData) => {
        return {
          url: "image/upload",
          method: "POST",
          body: formData,
        };
      },
    }),

    //single vehciles master
    getSingleVehicleMaster: builder.query({
      query: (params) => {
        return {
          url: `self/all-self-vehicles`,
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "SingleVehicleMaster", id: "LIST" }],
    }),

    postSingleVehicleMaster: builder.mutation({
      query: (body) => ({
        url: "self/add-self-vehicles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SingleVehicleMaster", id: "LIST" }],
    }),

    editSingleVehicleMaster: builder.mutation({
      query: ({ body, truckId }) => ({
        url: `self/edit-self-vehicle?str_id=${truckId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "SingleVehicleMaster", id: "LIST" }],
    }),

    deleteSingleVehicleMaster: builder.mutation({
      query: (truckId) => ({
        url: `self/delete-self-vehicle?str_id=${truckId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SingleVehicleMaster", id: "LIST" }],
    }),

    getAssignedOrderById: builder.query({
      query: (params) => ({
        url: `ao/assigned-order`,
        method: "GET",
        params,
      }),
    }),
    postValidateRoute: builder.mutation({
      query: (body) => ({
        url: "route/validate-route",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ValidateRoute" }],
    }),

    postAssignCarrier: builder.mutation({
      query: (body) => ({
        url: "carrier-assignment/assign-carrier",
        method: "POST",
        body,
      }),
      invalidatesTags :[{type: "Orderss", id: "LIST"}]
    }),

    postAssignCarrierToOrder: builder.mutation({
      query: (body) => ({
        url: "carrier-assignment/finalize-carrier-assignment",
        method: "POST",
        body,
      }),
      invalidatesTags :[{type: "Orderss", id: "LIST"}]
    }),
    getCarrierAssignmentReq: builder.query({
      query: (params) => ({
        url: `carrier-assignment/carrier-assignments`,
        method: "GET",
        params,
      }),
      providesTags :[{type: "Orderss", id: "LIST"}]
    }),
    postCarrierRejectigOrder: builder.mutation({
      query: (body) => ({
        url: "carrier-assignment/carrier-assignment/reject",
        method: "POST",
        body,
      }),
      invalidatesTags :[{type: "Orderss", id: "LIST"}]
    }),

    postCarrierAssigningOrderConfirm: builder.mutation({
      query: (body) => ({
        url: "carrier-assignment/carrier-assignment/confirm",
        method: "POST",
        body,
      }),
      invalidatesTags :[{type: "Orderss", id: "LIST"}]
    }),

    postInitiateBidding: builder.mutation({
      query: (body) => ({
        url: "assignment-bid/initiate-open-bidding",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

      getOrderAssignedToCarrier: builder.query({
        query: (params) => ({
          url: `carrier-assignment/assigned-order-by-id`,
          method: "GET",
          params
        }),
        providesTags :[{type: "Orderss", id: "LIST"}]
      }),

      getDockRequests: builder.query({
        query: (params) => ({
          url: `carrier-assignment/get-dock-reqs`,
          method: "GET",
          params
        }),
        providesTags :[{type: "DockCarrier", id: "LIST"}]
      }),
        getDocksByLocationId: builder.query({
        query: (params) => ({
          url: `masterDock/dock`,
          method: "GET",
          params
        }),
        // providesTags :[{type: "Orderss", id: "LIST"}]
      }),
      editAllocateDockToCarrier: builder.mutation({
        query: ( body ) => ({
          url: `masterDock/allocate-dock-to-carrier`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [{ type: "DockCarrier", id: "LIST" }],
      }),
    }), 

});

export const {
  useUserLoginMutation,
  useCustomerRegistrationMutation,
  useVendorRegistrationMutation,
  useDriverRegistrationMutation,
  useGetAllCustomersDataQuery,
  useGetAllVendorsDataQuery,
  useGetAllDriversDataQuery,
  useGetDriverDataQuery,
  useGetFilteredDriversQuery,
  useEditBusinessPartnerMutation,
  useDeleteBusinessPartnerMutation,
  useEditDriverMutation,
  useDeleteDriverMutation,
  useGetCarrierMasterQuery,
  usePostCarrierMasterMutation,
  useEditCarrierMasterMutation,
  useDeleteCarrierMasterMutation,
  useGetLocationMasterQuery,
  usePostLocationMasterMutation,
  useEditLocationMasterMutation,
  useDeleteLocationMasterMutation,
  useGetVehicleMasterQuery,
  useGetFilteredVehiclesQuery,
  usePostVehicleMasterMutation,
  useEditVehicleMasterMutation,
  useDeleteVehicleMasterMutation,
  useGetPackageMasterQuery,
  usePostPackageMasterMutation,
  useEditPackageMasterMutation,
  useDeletePackageMasterMutation,
  useGetLanesMasterQuery,
  usePostLaneMasterMutation,
  useEditLaneMasterMutation,
  useDeleteLaneMasterMutation,
  useGetDeviceMasterQuery,
  usePostDeviceMasterMutation,
  useEditDeviceMasterMutation,
  useDeleteDeviceMasterMutation,
  useGetUomMasterQuery,
  usePostUomMasterMutation,
  useEditUomMasterMutation,
  useDeleteUomMasterMutation,
  useGetDockMasterQuery,
  usePostDockMasterMutation,
  useEditDockMasterMutation,
  useDeleteDockMasterMutation,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useSelectTheProductsMutation,
  useGetDataCountQuery,
  useGetAllPackagesForOrderQuery,
  useCreatePackageForOrderMutation,
  useDeletePackageForOrderMutation,
  useEditPackageForOrderMutation,
  useConfomOrderMutation,
  useEditOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateShipFromDefaultLocationIdMutation,
  useUpdateShipToDefaultLocationIdMutation,
  useUpdateBillToDefaultLocationIdMutation,
  useGetFilteredLocationsQuery,
  useGetAllAssignedOrdersQuery,
  usePostAssignOrderMutation,
  useEditAssignOrderOrderMutation,
  useImageUploadingMutation,
  useGetSingleVehicleMasterQuery,
  usePostSingleVehicleMasterMutation,
  useEditSingleVehicleMasterMutation,
  useDeleteSingleVehicleMasterMutation,
  useGetAssignedOrderByIdQuery,
  useGetFilteredProductsQuery,
  usePostValidateRouteMutation,
  usePostAssignCarrierMutation,
  usePostAssignCarrierToOrderMutation,
  useGetCarrierAssignmentReqQuery,
  usePostCarrierRejectigOrderMutation,
  usePostCarrierAssigningOrderConfirmMutation,
  usePostInitiateBiddingMutation,
  useGetOrderAssignedToCarrierQuery,
  useGetDockRequestsQuery,
  useGetDocksByLocationIdQuery,
  useEditAllocateDockToCarrierMutation,
} = apiSlice;
