import { gql } from "@apollo/client";
import exp from "constants";

export const GET_ASSIGNED_ORDER = gql`
  query GetAssignedOrder($assign_ID: ID, $order_ID: ID, $dri_ID: ID) {
    getAssignedOrder(assign_ID: $assign_ID, order_ID: $order_ID, dri_ID: $dri_ID) {
      message
      data {
        assign_ID
        order_ID
        assigned_vehicle_data{
          dev_ID
  dri_ID
  self_vehicle_num
  strk_ID
        }
        self_transport
        # pod
        pod_doc
        scenario_label
        total_cost
        allocations{
          cost
          packages
          vehicle_ID
          leftoverVolume
          leftoverWeight
          occupiedVolume
          occupiedWeight
          totalVolumeCapacity
          totalWeightcapacity
          loadArrangement {
            location
            packages
            stop
          }
          sampleRoutePoints {
            lat
            lng
          }
          route {
            distance
            duration
            loadAfterStop
            start {
              address
              latitude
              longitude
            }
            end {
              address
              latitude
              longitude
            }
          }
        }
        allocated_packages
        unallocated_packages
        allocated_vehicles
        created_at
        updated_at
        order_status
  # order_docs:[String]

      }
    }
  }
`;
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($order_ID: String) {
    getOrderById(order_ID: $order_ID) {
      message
      order {
        ord_id
        order_ID
        order_status
        scenario_label
        total_cost
        created_at
        updated_at
        allocated_packages
        allocated_vehicles
        unallocated_packages
        # order_docs
        allocations {
          cost
          packages
          vehicle_ID
          leftoverVolume
          leftoverWeight
          occupiedVolume
          occupiedWeight
          totalVolumeCapacity
          totalWeightcapacity
          loadArrangement {
            location
            packages
            stop
          }
          sampleRoutePoints {
            lat
            lng
          }
          route {
            distance
            duration
            loadAfterStop
            start {
              address
              latitude
              longitude
            }
            end {
              address
              latitude
              longitude
            }
          }
        }
      }

      allocated_packages_details {
        pac_id
        package_info
        pack_ID
        bill_to
        ship_from
        ship_to
        return_label
        pickup_date_time
        dropoff_date_time
        package_status
        additional_info {
          attachment
  department
  invoice
  po_number
  reference_id
  sales_order_number
        }
        tax_info {
          carrier_gst
  receiver_gst
  self_transport
  sender_gst
  tax_rate
        }
        product_ID {
          prod_ID
         quantity
         package_info
        }
    




      
    }
    allocated_vehicles {
      veh_id
        vehicle_ID
        loc_desc
        city
        state
        latitude
        longitude
        pincode
        country
        time_zone
        loc_ID
        loc_type

  gln_code
  iata_code
  unlimited_usage
  fragile_vehicle
  hazardous_proof
  danger_proof
  temp_controlled_vehicle
  individual_resource
 
  capacity{
    cubic_capacity
  interior_width
  payload_weight
  interior_height
  interior_length
  }
 
  vehicle_group{
    vehicle_type
  vehicle_group_desc
  }
  downtimes {
    reason
  downtime_desc
  downtime_location
  downtime_starts_from
  downtime_ends_from
  }
        physical_properties {
          max_width
          max_height

  
  max_length
  tare_volume
  tare_weight
  max_gross_weight
        }
        transportation_details {
          vehicle_type
          ownership

     
  validity_from
  validity_to

  vehicle_group
        }
        additional_details {
          cost_per_ton
        }
    
    }
    }
  }
`;
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $limit: Int) {
    getAllOrders(page: $page, limit: $limit) {
      message
      orders {
        ord_id
        order_ID
        order_status
        scenario_label
        total_cost
        created_at
        updated_at
        allocated_packages
        allocated_vehicles
        unallocated_packages
        # order_docs
        allocations {
          cost
          packages
          vehicle_ID
          leftoverVolume
          leftoverWeight
          occupiedVolume
          occupiedWeight
          totalVolumeCapacity
          totalWeightcapacity
          loadArrangement {
            location
            packages
            stop
          }
          sampleRoutePoints {
            lat
            lng
          }
          route {
            distance
            duration
            loadAfterStop
            start {
              address
              latitude
              longitude
            }
            end {
              address
              latitude
              longitude
            }
          }
        }
      }
    }
  }
`;


export const GET_DEVICES = gql`
  query GetDevices($page: Int, $limit: Int) {
    getDevices(page: $page, limit: $limit) {
      device_id
      dev_ID
      device_type
      device_UID
      sim_imei_num
      vehicle_number
      carrier_ID
      loc_ID
      carrier_name
      carrier_address
      location_desc
      city
      state
      country
    }
  }
`;


export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($page: Int, $limit: Int) {
    getAllProducts(page: $page, limit: $limit) {
      message
      products {
        product_id
        product_name
        product_description
        price
        stock
        created_at
        updated_at
        basic_uom
        best_before
        can_combine
        dangerous_goods
        documents
        expiration
        fragile_goods
        hazardous
        hsn_code
        loc_ID
        packaging_type {
          pac_ID
          location
        }
        packing_label
        prod_id
        product_ID
        product_desc
        sales_uom
        sku_num
        special_instructions
        stacking_factor
        temp_controlled
        volume
        volume_uom
        weight
        weight_uom
      }
    }
  }
`;


export const ALL_PACKAGES = gql`
  query AllPackages($page: Int, $limit: Int) {
    allPackages(page: $page, limit: $limit) {
      message
      packages {
        pac_id
        package_info
        pack_ID
        bill_to
        ship_from
        ship_to
        return_label
        pickup_date_time
        dimensions_uom
        dropoff_date_time
        package_status
        additional_info {
          invoice
          reference_id
        }
        tax_info {
          tax_rate
        }
        product_ID {
          prod_ID
         quantity
        }
      }
    }
  }
  
`;

export const GET_ALL_PACKAGES = gql`
  query GetAllPackages($page: Int, $limit: Int) {
    getAllPackages(page: $page, limit: $limit) {
      message
      packages {
        pac_ID
        package_id
        handling_unit_type
        pack_length
        pack_volume
        pack_volume_uom
        pack_width
        pack_height
        dimensions_uom
        packaging_type_name
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
  query GetBusinessPartners($partner_type: String, $supplier_id: Int, $customer_id: String) {
    getBusinessPartners(partner_type: $partner_type, supplier_id: $supplier_id, customer_id: $customer_id) {
      message
      partners {
        partner_id
        customer_id
        name
        partner_type
        correspondence {
          contact_person
          contact_number
          email
        }
        partner_functions {
          ship_to_party
          sold_to_party
          bill_to_party
        }
        location_city
        location_state
        pod_relevant
        location_loc_ID
        loc_ID
        supplier_id
  location_pincode
  loc_of_source
  loc_of_source_pincode
  loc_of_source_state
  loc_of_source_city
  loc_of_source_country
  loc_of_source_loc_ID
      }
    }
  }
`;

export const GET_ALL_VEHICLES = gql`
  query {
    getAllVehicles {
      message
      vehicles {
        available
        costing {
          cost
          cost_criteria_per
        }
        self_vehicle_docs {
          insurance
          permit
          registration
        }
        self_vehicle_num
        str_id
        strk_ID
        vehicle_ID
      }
    }
  }
`;

export const GET_ALL_SELF_VEHICLES = gql`
  query {
    getAllSelfVehicles {
      message
      data {
        available
        costing {
          cost
          cost_criteria_per
        }
        self_vehicle_docs {
          insurance
          permit
          registration
        }
        self_vehicle_num
        str_id
        strk_ID
        vehicle_ID
      }
    }
  }
`;



// export const GET_VEHICLES = gql`
//   query GetVehicles($page: Int, $limit: Int) {
//     getVehicles(page: $page, limit: $limit) {
//       message
//       vehicles {
//         veh_id
//         vehicle_ID
//         loc_desc
//         city
//         state
//         latitude
//         longitude
//         pincode
//         country
//         time_zone
//         loc_ID
//         loc_type

//   gln_code
//   iata_code
//   unlimited_usage
//   fragile_vehicle
//   hazardous_proof
//   danger_proof
//   temp_controlled_vehicle
//   individual_resource
 
//   capacity{
//     cubic_capacity
//   interior_width
//   payload_weight
//   interior_height
//   interior_length
//   }
 
//   vehicle_group{
//     vehicle_type
//   vehicle_group_desc
//   }
//   downtimes {
//     reason
//   downtime_desc
//   downtime_location
//   downtime_starts_from
//   downtime_ends_from
//   }
//         physical_properties {
//           max_width
//           max_height

  
//   max_length
//   tare_volume
//   tare_weight
//   max_gross_weight
//         }
//         transportation_details {
//           vehicle_type
//           ownership

     
//   validity_from
//   validity_to

//   vehicle_group
//         }
//         additional_details {
//           cost_per_ton
//         }
//       }




  



  

//     }
//   }
// `;

export const GET_VEHICLES = gql`
  query GetVehicles {
    getVehicles {
      message
      vehicles {
        veh_id
        vehicle_ID
        loc_desc
        city
        state
        latitude
        longitude
        pincode
        country
        time_zone
        loc_ID
        loc_type
        gln_code
        iata_code
        unlimited_usage
        fragile_vehicle
        hazardous_proof
        danger_proof
        temp_controlled_vehicle
        individual_resource
        capacity {
          cubic_capacity
          interior_width
          payload_weight
          interior_height
          interior_length
        }
        vehicle_group {
          vehicle_type
          vehicle_group_desc
        }
        downtimes {
          reason
          downtime_desc
          downtime_location
          downtime_starts_from
          downtime_ends_from
        }
        physical_properties {
          max_width
          max_height
          max_length
          tare_volume
          tare_weight
          max_gross_weight
        }
        transportation_details {
          vehicle_type
          ownership
          validity_from
          validity_to
          vehicle_group
        }
        additional_details {
          cost_per_ton
        }
      }
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


export const GET_UOM = gql`
  query GetUOM {
    allUOM {

    alt_unit_desc
alt_unit_name
unit_desc
unit_id
unit_name
    }
  }
`;
export const GET_ALL_DEVICES = gql`
  query GetAllDevices($page: Int, $limit: Int) {
    getAllDevices(page: $page, limit: $limit) {
      message
      devices {
        device_id
        dev_ID
        device_type
        device_UID
        sim_imei_num
        vehicle_number
        carrier_ID
        loc_ID
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
  query GetAllLanes($page: Int, $limit: Int) {
    allLanes(page: $page, limit: $limit) {
      message
      lanes {
        ln_id
        lane_ID
        src_loc_ID
        des_loc_ID
        lane_transport_data {
          start_time
          end_time
          transport_cost
          transport_distance
          transport_duration
          vehcle_type
        }
        src_location_id
        src_loc_desc
        src_longitude
        src_latitude
        src_city
        src_state
        des_location_id
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
  query searchLocations($searchKey: String, $page: Int, $limit: Int) {
    searchLocations(searchKey: $searchKey, page: $page, limit: $limit) {
      message
      searchKey
      results {
        loc_ID
        city
        state
        pincode
        loc_type
        loc_desc
        country
        latitude
        longitude
      }
    }
  }
`;
export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($page: Int, $limit: Int) {
    getAllLocations(page: $page, limit: $limit) {
      message
      locations {
        address_1
address_2
city
contact_email
contact_name
contact_phone_number
country
def_bill_to
def_ship_from
def_ship_to
gln_code
iata_code
latitude
loc_ID
loc_desc
loc_type
location_id
longitude
pincode
state
time_zone

      }
    }
  }
`;


export const GET_CARRIERS = gql`
  query AllCarriers($page: Int, $limit: Int) {
    allCarriers(page: $page, limit: $limit) {
      message
      carriers {
        carrier_ID
        carrier_name
        carrier_loc_of_operation
        carrier_lanes
        vehicle_types_handling
        carrier_correspondence {
          name
          email
          phone
        }
        carrier_address
        cr_id
        carrier_network_portal
        contract
        contract_valid_upto
      }
    }
  }
`;

export const GET_DRIVERS = gql`
query GetDrivers($page: Int, $limit: Int) {
  getDrivers(page: $page, limit: $limit) {
    message
    drivers {
      driver_id
      driver_name
      address
      dri_ID
      driver_availability
      driver_correspondence {
        email
        phone
        expiry_date
        driving_license
      }
      locations
      logged_in
      vehicle_types
    }
  }
}
`;

export const SEARCH_TRUCKS = gql`
  query SearchTrucks($searchKey: String!, $page: Int, $limit: Int) {
    searchTrucks(searchKey: $searchKey, page: $page, limit: $limit) {
      message
      searchKey
      results {
        act_truk_ID
        act_vehicle_num
        carrier_ID
        truk_id
        carrier_name
        carrier_address
        carrier_correspondence
        vehicle_types_handling
        carrier_network_portal
        carrier_loc_of_operation
        carrier_lanes
      }
    }
  }
`;


export const SEARCH_DRIVERS = gql`
  query SearchDrivers($searchKey: String!, $page: Int, $limit: Int) {
    searchDrivers(searchKey: $searchKey, page: $page, limit: $limit) {
      message
      searchKey
      results {
        dri_ID
        driver_name
        driver_correspondence
      }
    }
  }
`;
export const GET_COUNT_DATA = gql`
  query GetCountData{
    getCountData {
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
      message
      results {
        product_ID
        product_name
        sku_num
        hsn_code
      }
    }
  }
`;
