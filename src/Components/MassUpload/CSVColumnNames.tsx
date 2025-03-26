export const locationColumnNames = [
  { displayName: 'Location Description*', key: 'loc_desc' },
  { displayName: 'Location Type (Warehouse or Production plant...)*', key: 'loc_type' },
  { displayName: 'GLN Code (13 characters)', key: 'gln_code' },
  { displayName: 'IATA Code (3 characters)', key: 'iata_code' },
  { displayName: 'Longitude*', key: 'longitude' },
  { displayName: 'Latitude*', key: 'latitude' },
  { displayName: 'Time Zone (IST)*', key: 'time_zone' },
  { displayName: 'Address line 1*', key: 'address_1' },
  { displayName: 'Address line 2', key: 'address_2' },
  { displayName: 'City*', key: 'city' },
  { displayName: 'State*', key: 'state' },
  { displayName: 'Country*', key: 'country' },
  { displayName: 'Pincode (6 digits)*', key: 'pincode' },
  { displayName: 'Contact person name*', key: 'contact_name' },
  { displayName: 'Contact phone number (10 digits)*', key: 'contact_phone_number' },
  { displayName: 'Contact email (Valid email)*', key: 'contact_email' },
];

export const vehicleColumnNames = [
  { displayName: 'Location ID (LOC000001...)*', key: 'loc_ID' },
  { displayName: 'Is Unlimited Usage (if Yes type 1 else 0)', key: 'unlimited_usage' },
  { displayName: 'Number of Individual Resources (if unlimited is 0 only)', key: 'individual_resource' },
  { displayName: 'Validity From (dd-mm-yyyy)*', key: 'validity_from', nestedKey: 'transportation_details' },
  { displayName: 'Validity To (dd-mm-yyyy)*', key: 'validity_to', nestedKey: 'transportation_details' },
  { displayName: 'Vehicle Type*', key: 'vehicle_type', nestedKey: 'transportation_details' },
  { displayName: 'Vehicle Group*', key: 'vehicle_group', nestedKey: 'transportation_details' },
  { displayName: 'Ownership (Self or Carrier)*', key: 'ownership', nestedKey: 'transportation_details' },
  { displayName: 'Payload Weight (Numeric)*', key: 'payload_weight', nestedKey: 'capacity' },
  { displayName: 'Payload Weight unit (unit only)*', key: 'payload_weight_unit', nestedKey: 'capacity' },
  { displayName: 'Cubic Capacity (Numeric)*', key: 'cubic_capacity', nestedKey: 'capacity' },
  { displayName: 'Cubic Capacity unit (unit only)*', key: 'cubic_capacity_unit', nestedKey: 'capacity' },
  { displayName: 'Interior Length*', key: 'interior_length', nestedKey: 'capacity' },
  { displayName: 'Interior Width*', key: 'interior_width', nestedKey: 'capacity' },
  { displayName: 'Interior Height*', key: 'interior_height', nestedKey: 'capacity' },
  { displayName: 'Tare Weight*', key: 'tare_weight', nestedKey: 'physical_properties' },
  { displayName: 'Max Gross Weight*', key: 'max_gross_weight', nestedKey: 'physical_properties' },
  { displayName: 'Tare Volume*', key: 'tare_volume', nestedKey: 'physical_properties' },
  { displayName: 'Maximum length*', key: 'max_length', nestedKey: 'physical_properties' },
  { displayName: 'Maximum width*', key: 'max_width', nestedKey: 'physical_properties' },
  { displayName: 'Maximum height*', key: 'max_height', nestedKey: 'physical_properties' },
  { displayName: 'Downtime Start date (dd-mm-yyyy)*', key: 'downtime_starts_from', nestedKey: 'downtimes' },
  { displayName: 'Downtime End date (dd-mm-yyyy)*', key: 'downtime_ends_from', nestedKey: 'downtimes' },
  { displayName: 'Downtime Location*', key: 'downtime_location', nestedKey: 'downtimes' },
  { displayName: 'Downtime Description*', key: 'downtime_desc', nestedKey: 'downtimes' },
  { displayName: 'Downtime Reason*', key: 'reason', nestedKey: 'downtimes' },
  { displayName: 'Cost Per Ton (Rs.)*', key: 'cost_per_ton', nestedKey: 'additional_details' },
  { displayName: 'Is Fragile vehicle (if Yes type 1 else 0)', key: 'fragile_vehicle' },
  { displayName: 'Is Danger proof vehicle (if Yes type 1 else 0)*', key: 'danger_proof' },
  { displayName: 'Is Hazardous proof vehicle (if Yes type 1 else 0)*', key: 'hazardous_proof' },
  { displayName: 'Is temperature controlled vehilce (if Yes type 1 else 0)*', key: 'temp_controlled_vehicle' },
];

export const laneColumnNames = [
  { displayName: 'Source Location ID (LOC000001...)*', key: 'src_loc_ID' },
  { displayName: 'Destination Location ID (LOC000001...)*', key: 'des_loc_ID' },
  { displayName: 'Vehicle Type*', key: 'vehcle_type', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Start Date (dd-mm-yyyy)*', key: 'start_time', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport End Date (dd-mm-yyyy)*', key: 'end_time', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Distance*', key: 'transport_distance', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Duration*', key: 'transport_duration', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Cost(Rs.)*', key: 'transport_cost', nestedKey: 'lane_transport_data' },
];

export const deviceColumnNames = [
  { displayName: 'Device Type(GPS)*', key: 'device_type' },
  { displayName: 'Device UID*', key: 'device_UID' },
  { displayName: 'SIM IMEI Number*', key: 'sim_imei_num' },
  { displayName: 'Vehicle Number*', key: 'vehicle_number' },
  { displayName: 'Carrier ID (CR000001...)', key: 'carrier_ID' },
  { displayName: 'Location ID (LOC000001...)', key: 'loc_ID' },
];

export const packageColumnNames =[
  { displayName: 'Packaging Type Name*', key: 'packaging_type_name' },
  { displayName: 'Dimensions UOM', key: 'dimensions_uom' },
  { displayName: 'Package length*', key: 'pack_length'},
  { displayName: 'Package Width*', key: 'pack_width' },
  { displayName: 'Package height*', key: 'pack_height' },
  { displayName: 'Handling Unit Type*', key: 'handling_unit_type' }
]

export const carrierColumnNames = [
  { displayName: 'Carrier Name*', key: 'carrier_name' },
  { displayName: 'Carrier Address*', key: 'carrier_address' },
  { displayName: 'Correspondence Name*', key: 'name', nestedKey: 'carrier_correspondence' },
  { displayName: 'Correspondence Email*', key: 'email', nestedKey: 'carrier_correspondence' },
  { displayName: 'Correspondence Phone (10 digits)*', key: 'phone', nestedKey: 'carrier_correspondence' },
  { displayName: 'Is enrolled on Carrier Network Portal (if yes type 1 else 0)', key: 'carrier_network_portal' },
  { displayName: 'Vehicle Types Handling (Van or Truck or...)*', key: 'vehicle_types_handling' },
  { displayName: 'Carrier Location of Operation (Location ids-(LOC000001...))*', key: 'carrier_loc_of_operation' },
  { displayName: 'Carrier Lanes (Lane ids-(LN000001...))*', key: 'carrier_lanes' }
]

export const customerColumnNames = [
  { displayName: "Customer name*", key: "name" },
  { displayName: "Location ID (LOC000001...)*", key: "loc_ID" },
  { displayName: "Contact Person*", key: "contact_person", nestedKey: "correspondence" },
  { displayName: "Contact mobile number (10 digits)*", key: "contact_number", nestedKey: "correspondence" },
  { displayName: "Contact Valid Email*", key: "email", nestedKey: "correspondence" },
  { displayName: "Location of Source (Location id - (LOC000001...))*", key: "loc_of_source" },
  { displayName: "Is POD Relevant (if Yes type 1 else 0)", key: "pod_relevant" },
  { displayName: "Ship-to Party (Customer id - (CUST000001...))", key: "ship_to_party", nestedKey: "partner_functions" },
  { displayName: "Sold-to Party (Customer id - (CUST000001...))", key: "sold_to_party", nestedKey: "partner_functions" },
  { displayName: "Bill-to Party (Customer id - (CUST000001...))", key: "bill_to_party", nestedKey: "partner_functions" },
];

export const vendorColumnNames  = [
  { displayName: 'Vendor name*', key: 'name' },
  { displayName: 'Location ID (LOC000001...)*', key: 'loc_ID' },
  { displayName: 'Contact Person*', key: 'contact_person', nestedKey: 'correspondence' },
  { displayName: 'Contact mobile number (10 digits)*', key: 'contact_number', nestedKey: 'correspondence' },
  { displayName: 'Contact Valid Email*', key: 'email', nestedKey: 'correspondence' },
  { displayName: 'Location of Source (Location id - (LOC000001...))*', key: 'loc_of_source' },
  { displayName: 'Is POD Relevant (if Yes type 1 else 0)', key: 'pod_relevant' },
  { displayName: 'Ordering Address', key: 'ordering_address', nestedKey: 'partner_functions' },
  { displayName: 'Goods Supplier', key: 'goods_supplier', nestedKey: 'partner_functions' },
  { displayName: 'Forwarding Agent', key: 'forwarding_agent', nestedKey: 'partner_functions' }
];

export const driversColumnNames= [
  { displayName: 'Location ID (LOC000001...)*', key: 'locations' },
  { displayName: 'Driver Name*', key: 'driver_name' },
  {displayName: 'Driving License*', key: 'driving_license',nestedKey: 'driver_correspondence',},
  {displayName: 'Expiry Date (dd-mm-yyyy)*',key: 'expiry_date',nestedKey: 'driver_correspondence',},
  { displayName: 'Driver Contact Number (10 digits)*',key: 'phone',nestedKey: 'driver_correspondence',},
  {displayName: 'Valid Email*',key: 'email',nestedKey: 'driver_correspondence',},
  { displayName: 'Vehicle Types (Van or Truck or...)*', key: 'vehicle_types' },
  { displayName: 'Is Logged in (if Yes type 1 else 0)', key: 'logged_in' },
  { displayName: 'Is driver available (if Yes type 1 else 0)*', key: 'driver_availability' },
];

export const productColumnNames = [
  { displayName: "Product Name*" , key: "product_name"},
  { displayName: "Product Description*" ,key: "product_desc"},
  { displayName: "Basic Unit of Measure" ,key: "basic_uom"},
  { displayName: "Sales Unit of Measure",key: "sales_uom" },
  { displayName: "Product Weight*", key: "weight" },
  { displayName: "Weight Unit of Measure",key: "weight_uom" },
  { displayName: "Product Volume*",key: "volume" },
  { displayName: "Volume Unit of Measure",key: "volume_uom" },
  { displayName: "Expiration Date",key: "expiration" },
  { displayName: "Best Before Date",key: "best_before" },
  { displayName: "Stacking Factor",key: "stacking_factor" },
  { displayName: "SKU Number" ,key: "sku_num"},
  { displayName: "HSN Code*" ,key: "hsn_code"},
  { displayName: "Documents" ,key: "documents" },
  { displayName: "Location ID (LOC000001...)*",key: "loc_ID" },
  { displayName: "Special Instructions",key: "special_instructions" },
  { displayName: "Is Packaging Label (if Yes type 1 else 0)",key: "packing_label" },
  { displayName: "Is Fragile Goods (if Yes type 1 else 0)",key: "fragile_goods" },
  { displayName: "Is Dangerous Goods (if Yes type 1 else 0)",key: "dangerous_goods" },
  { displayName: "Is Hazardous (if Yes type 1 else 0)" , key: "hazardous"},
  { displayName: "Is Temperature Controlled (if Yes type 1 else 0)", key: "temp_controlled" },
  { displayName: 'Packaging Type ID (PKG000001...)*', key: 'pac_ID', nestedKey: 'packaging_type' },
  { displayName: 'Location id (LOC000001...)*',key: 'location',nestedKey: 'packaging_type'},
];


