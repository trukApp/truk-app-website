export const locationColumnNames = [
  { displayName: 'Location Description *', key: 'loc_desc' },
  { displayName: 'Location Type *', key: 'loc_type' },
  { displayName: 'GLN Code (13 characters)', key: 'gln_code' },
  { displayName: 'IATA Code (3 characters)', key: 'iata_code' },
  { displayName: 'Longitude *', key: 'longitude' },
  { displayName: 'Latitude *', key: 'latitude' },
  { displayName: 'Time Zone *', key: 'time_zone' },
  { displayName: 'Address line 1*', key: 'address_1' },
  { displayName: 'Address line 2', key: 'address_2' },
  { displayName: 'City*', key: 'city' },
  { displayName: 'State*', key: 'state' },
  { displayName: 'Country*', key: 'country' },
  { displayName: 'Pincode (6 digits)*', key: 'pincode' },
  { displayName: 'Contact person name*', key: 'contact_name' },
  { displayName: 'Contact phone number*', key: 'contact_phone_number' },
  { displayName: 'Contact email*', key: 'contact_email' },
];

export const vehicleColumnNames = [
  { displayName: 'Location ID*', key: 'loc_ID' },
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
  { displayName: 'Downtime Starts date (dd-mm-yyyy)*', key: 'downtime_starts_from', nestedKey: 'downtimes' },
  { displayName: 'Downtime Ends date (dd-mm-yyyy)*', key: 'downtime_ends_from', nestedKey: 'downtimes' },
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
  { displayName: 'Source Location ID*', key: 'src_loc_ID' },
  { displayName: 'Destination Location ID*', key: 'des_loc_ID' },
  { displayName: 'Vehicle Type*', key: 'vehcle_type', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Start Date*', key: 'start_time', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport End Date*', key: 'end_time', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Distance*', key: 'transport_distance', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Duration*', key: 'transport_duration', nestedKey: 'lane_transport_data' },
  { displayName: 'Transport Cost(Rs.)*', key: 'transport_cost', nestedKey: 'lane_transport_data' },
];

export const deviceColumnNames = [
  { displayName: 'Device Type*', key: 'device_type' },
  { displayName: 'Device UID*', key: 'device_UID' },
  { displayName: 'SIM IMEI Number*', key: 'sim_imei_num' },
  { displayName: 'Vehicle Number*', key: 'vehicle_number' },
  { displayName: 'Carrier ID', key: 'carrier_ID' },
  { displayName: 'Location ID', key: 'loc_ID' },
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
  { displayName: 'Carrier Correspondence Name*', key: 'name', nestedKey: 'carrier_correspondence' },
  { displayName: 'Carrier Correspondence Email*', key: 'email', nestedKey: 'carrier_correspondence' },
  { displayName: 'Carrier Correspondence Phone*', key: 'phone', nestedKey: 'carrier_correspondence' },
  { displayName: 'Is enrolled on Carrier Network Portal (if yes type 1 else 0)', key: 'carrier_network_portal' },
  { displayName: 'Vehicle Types Handling*', key: 'vehicle_types_handling' },
  { displayName: 'Carrier Location of Operation*', key: 'carrier_loc_of_operation' },
  { displayName: 'Carrier Lanes*', key: 'carrier_lanes' }
]

export const customerColumnNames = [
  { displayName: "Customer name*", key: "name" },
  { displayName: "Location ID*", key: "loc_ID" },
  { displayName: "Contact Person*", key: "contact_person", nestedKey: "correspondence" },
  { displayName: "Contact mobile number (10 digits)*", key: "contact_number", nestedKey: "correspondence" },
  { displayName: "Email*", key: "email", nestedKey: "correspondence" },
  { displayName: "Location of Source (Location id)*", key: "loc_of_source" },
  { displayName: "Is POD Relevant (if Yes type 1 else 0)", key: "pod_relevant" },
  { displayName: "Ship-to Party (Customer id)", key: "ship_to_party", nestedKey: "partner_functions" },
  { displayName: "Sold-to Party (Customer id)", key: "sold_to_party", nestedKey: "partner_functions" },
  { displayName: "Bill-to Party (Customer id)", key: "bill_to_party", nestedKey: "partner_functions" },
];

export const vendorColumnNames  = [
  { displayName: 'Vendor name*', key: 'name' },
  { displayName: 'Location ID*', key: 'loc_ID' },
  { displayName: 'Contact Person*', key: 'contact_person', nestedKey: 'correspondence' },
  { displayName: 'Contact mobile number (10 digits)*', key: 'contact_number', nestedKey: 'correspondence' },
  { displayName: 'Email ID*', key: 'email', nestedKey: 'correspondence' },
  { displayName: 'Location of Source (Location id)*', key: 'loc_of_source' },
  { displayName: 'Is POD Relevant (if Yes type 1 else 0)', key: 'pod_relevant' },
  { displayName: 'Ordering Address', key: 'ordering_address', nestedKey: 'partner_functions' },
  { displayName: 'Goods Supplier', key: 'goods_supplier', nestedKey: 'partner_functions' },
  { displayName: 'Forwarding Agent', key: 'forwarding_agent', nestedKey: 'partner_functions' }
];

export const driversColumnNames= [
  { displayName: 'Location ID*', key: 'locations' },
  { displayName: 'Driver Name*', key: 'driver_name' },
  {displayName: 'Driving License*', key: 'driving_license',nestedKey: 'driver_correspondence',},
  {displayName: 'Expiry Date*',key: 'expiry_date',nestedKey: 'driver_correspondence',},
  { displayName: 'Driver Contact Number (10 digits)*',key: 'phone',nestedKey: 'driver_correspondence',},
  {displayName: 'Email ID (Valid email)*',key: 'email',nestedKey: 'driver_correspondence',},
  { displayName: 'Vehicle Types*', key: 'vehicle_types' },
  { displayName: 'Is Logged in (if Yes type 1 else 0)', key: 'logged_in' },
  { displayName: 'Driver availability (if Yes type 1 else 0)*', key: 'driver_availability' },
];

export const productColumnNames = [
  { key: "product_name", displayName: "Product Name*" },
  { key: "product_desc", displayName: "Product Description*" },
  { key: "basic_uom", displayName: "Basic Unit of Measure" },
  { key: "sales_uom", displayName: "Sales Unit of Measure" },
  { key: "weight", displayName: "Weight" },
  { key: "weight_uom", displayName: "Weight Unit of Measure" },
  { key: "volume", displayName: "Volume" },
  { key: "volume_uom", displayName: "Volume Unit of Measure" },
  { key: "expiration", displayName: "Expiration Date" },
  { key: "best_before", displayName: "Best Before Date" },
  { key: "stacking_factor", displayName: "Stacking Factor" },
  { key: "sku_num", displayName: "SKU Number" },
  { key: "hsn_code", displayName: "HSN Code" },
  { key: "documents", displayName: "Documents" },
  { key: "loc_ID", displayName: "Location ID" },
  { key: "special_instructions", displayName: "Special Instructions" },
  { key: "packing_label", displayName: "Packing Label" },
  { key: "fragile_goods", displayName: "Fragile Goods" },
  { key: "dangerous_goods", displayName: "Dangerous Goods" },
  { key: "hazardous", displayName: "Hazardous" },
  { key: "temp_controlled", displayName: "Temperature Controlled" },
  { displayName: 'Packaging Type ID', key: 'pac_ID', nestedKey: 'packaging_type' },
  {displayName: 'Location id',key: 'location',nestedKey: 'packaging_type'},
];


