import { ReactNode } from "react";

export interface AlertItem {
  orderId: string;
  text: string;
  level: "CRITICAL" | "WARNING" | "INFO";
  color: string;
  icon: ReactNode;
  time: string;
}

export interface PathPoint {
  lat: number;
  lng: number;
}

export interface AssignedVehicleData {
  self_vehicle_num?: string;
  dev_ID?: number;
  dri_ID?: string;
  strk_ID?: string;
}

export interface Assignment {
  assign_ID?: string | null;
  assigned_order_status?: string | null;
  assigned_vehicle_data?: AssignedVehicleData[];
}

export interface Tracking {
  tracking_id?: number;
  tracking_status?: string;
  vehicle_ID?: string;
  vehicle_num?: string | null;
  device_id?: string | null;
  trip_started_at?: string | null;
  last_gps_time?: string | null;
}

export interface Stop {
  id?: number;
  tracking_id?: number;
  stop_no?: number;
  loc_ID?: string;
  latitude?: string;
  longitude?: string;
  radius_m?: number;
  planned_eta?: string | null;
  actual_arrival?: string | null;
  actual_departure?: string | null;
  status?: string;
  created_at?: string;
}

export interface Insight {
  title: string;
  insight: string;
  tag: "HIGH" | "MEDIUM" | "LOW";
}

export interface Weather {
  condition?: string;
  description?: string;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  visibility?: number;
  rain1h?: number;
  snow1h?: number;
}

export interface Shipment {
  id: string;
  start: string;
  stop: string;
  mode?: string;
  status?: string;
  eta?: string | null;
  progress?: number;
  risk?: string;
  path: PathPoint[];

  tracking?: Tracking;

  assignment?: Assignment;

  current_position?: {
    latitude: number;
    longitude: number;
  } | null;

  stops?: Stop[];

  insights?: Insight[];

  weather?: Weather;
}

export interface ShipmentRow {
  id: string;
  route: string;
  mode: string;
  status: string;
  eta: string;
  progress: number;
  risk: string;
  path: PathPoint[];
  vehicle: string;
  trackingStatus: string;

  current_position?: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface ShipmentDashboardSummary {
  activeShipments: number;
  onTimeDelivery: number;
  avgTransitTime: number;
}

export interface ShipmentDashboardResponse {
  message: string;
  summary: ShipmentDashboardSummary;
  shipments: Shipment[];
}