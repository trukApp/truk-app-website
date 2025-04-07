import { gql } from "@apollo/client";
import exp from "constants";

export const GET_ASSIGNED_ORDER = gql`
  query GetAssignedOrder($assign_ID: ID, $order_ID: ID, $dri_ID: ID) {
    getAssignedOrder(assign_ID: $assign_ID, order_ID: $order_ID, dri_ID: $dri_ID) {
      message
      data {
        assign_ID
        order_ID
        assigned_vehicle_data
        self_transport
        pod
        pod_doc
        scenario_label
        total_cost
        allocations
        allocated_packages
        unallocated_packages
        allocated_vehicles
        created_at
        updated_at
        order_status
      }
    }
  }
`;
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($order_ID: ID!) {
    getOrderById(order_ID: $order_ID) {
      message
      order {
        order_ID
        customer_name
        status
        total_amount
        created_at
      }
    }
  }
`;
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $limit: Int) {
    allOrders(page: $page, limit: $limit) {
      message
      orders {
        order_id
        customer_name
        total_amount
        status
        created_at
      }
    }
  }
`;
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($page: Int, $limit: Int) {
    getAllProducts(page: $page, limit: $limit) {
      message
      products {
        product_name
        price
      }
    }
  }
`;

export const GET_ALL_PACKAGES = gql`
  query GetAllPackages {
    getAllPackages {
      message
      packages {
        package_id
        package_name
        package_description
        price
        created_at
        updated_at
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetAllLocations($page: Int, $limit: Int) {
    getAllLocations(page: $page, limit: $limit) {
      message
      locations {
        location_id
        location_name
        address
        latitude
        longitude
      }
    }
  }
`;
export const GET_BUSINESS_PARTNERS = gql`
query GetBusinessPartners($partner_type: String, $supplier_id: ID, $customer_id: ID) {
  getBusinessPartners(partner_type: $partner_type, supplier_id: $supplier_id, customer_id: $customer_id) {
    message
    partners {
      partner_id
      name
      partner_type
      supplier_id
      customer_id
      location {
        city
        state
        country
      }
    }
  }
}
`;

export const GET_ALL_VEHICLES = gql`
query {
  getAllVehicles {
    truk_id
    vehicle_name
    vehicle_type
    registration_number
    capacity
  }
}
`;
export const GET_COUNTS = gql`
  query GetCounts {
    getCounts {
      message
      counts {
        vehicles
        products
        locations
        lanes
        devices
        drivers
        carriers
        customers
        vendors
        packages
        uoms
      }
    }
  }
`;
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchKey: String!, $page: Int, $limit: Int) {
    searchProducts(searchKey: $searchKey, page: $page, limit: $limit) {
      product_ID
      product_name
      sku_num
      hsn_code
    }
  }
`;

export const GET_UOM = gql`
  query GetUOM {
    allUOM {
      id
      name
      symbol
    }
  }
`;
export const GET_DEVICES = gql`
query GetDevices($page: Int, $limit: Int) {
  allDevices(page: $page, limit: $limit) {
    message
    devices {
      device_id
      dev_ID
      device_type
      device_UID
      sim_imei_num
      vehicle_number
      carrier_name
      carrier_address
      location_desc
      city
      state
      country
    }
  }
}
`;
export const GET_LANES = gql`
  query AllLanes($page: Int, $limit: Int) {
    allLanes(page: $page, limit: $limit) {
      message
      lanes {
        ln_id
        lane_ID
        lane_transport_data
        src_loc_ID
        src_loc_desc
        src_longitude
        src_latitude
        src_city
        src_state
        des_loc_ID
        des_loc_desc
        des_longitude
        des_latitude
        des_city
        des_state
      }
    }
  }
`;
export const SEARCH_LOCATIONS = gql`
query SearchLocations($searchKey: String!, $page: Int, $limit: Int) {
  searchLocations(searchKey: $searchKey, page: $page, limit: $limit) {
    loc_ID
    city
    state
    pincode
    loc_type
  }
}
`;
export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($page: Int, $limit: Int) {
    getAllLocations(page: $page, limit: $limit) {
      message
      locations {
        loc_ID
        city
        state
        pincode
        loc_type
      }
    }
  }
`;