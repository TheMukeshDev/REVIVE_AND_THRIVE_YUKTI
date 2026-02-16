/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="@types/google.maps" />

declare module '*.css' {
  const css: {};
  export default css;
}

declare namespace google {
  namespace maps {
    interface DirectionsResult {
      routes: DirectionsRoute[];
      geocoded_waypoints: GeocodedWaypoint[];
    }
    
    interface DirectionsRoute {
      legs: DirectionsLeg[];
      overview_path: google.maps.LatLng[];
      overview_polyline: string;
      [key: string]: any;
    }
    
    interface DirectionsLeg {
      steps: DirectionsStep[];
      distance: TextValueObject;
      duration: TextValueObject;
      end_address: string;
      start_address: string;
      end_location: google.maps.LatLng;
      start_location: google.maps.LatLng;
      [key: string]: any;
    }
    
    interface DirectionsStep {
      distance: TextValueObject;
      duration: TextValueObject;
      end_location: google.maps.LatLng;
      start_location: google.maps.LatLng;
      polyline: { points: string };
      travel_mode: string;
      [key: string]: any;
    }
    
    interface TextValueObject {
      text: string;
      value: number;
    }
    
    interface GeocodedWaypoint {
      geocoder_status: string;
      [key: string]: any;
    }
    
    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (result: DirectionsResult | null, status: DirectionsStatus) => void
      ): void;
    }
    
    interface DirectionsRequest {
      origin: string | LatLng | LatLngLiteral;
      destination: string | LatLng | LatLngLiteral;
      travelMode: TravelMode;
      waypoints?: DirectionsWaypoint[];
      optimizeWaypoints?: boolean;
      languageCode?: string | null;
      region?: string | null;
      unitSystem?: UnitSystem;
      drivingOptions?: DrivingOptions;
      transitOptions?: TransitOptions;
      [key: string]: any;
    }
    
    interface DirectionsWaypoint {
      location: string | LatLng | LatLngLiteral;
      stopover: boolean;
    }
    
    interface DrivingOptions {
      departureTime: Date;
      trafficModel?: TrafficModel;
    }
    
    interface TransitOptions {
      arrivalTime?: Date;
      departureTime?: Date;
      modes?: TransitMode[];
      routePreference?: TransitRoutePreference;
    }
    
    enum TravelMode {
      DRIVING = "DRIVING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
      WALKING = "WALKING"
    }
    
    enum DirectionsStatus {
      OK = "OK",
      NOT_FOUND = "NOT_FOUND",
      ZERO_RESULTS = "ZERO_RESULTS",
      MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
      INVALID_REQUEST = "INVALID_REQUEST",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR"
    }
    
    enum UnitSystem {
      METRIC = 0,
      IMPERIAL = 1
    }
    
    enum TrafficModel {
      BEST_GUESS = "best_guess",
      PESSIMISTIC = "pessimistic",
      OPTIMISTIC = "optimistic"
    }
    
    enum TransitMode {
      BUS = "bus",
      SUBWAY = "subway",
      TRAIN = "train",
      TRAM = "tram",
      RAIL = "rail"
    }
    
    enum TransitRoutePreference {
      LESS_WALKING = "less_walking",
      FEWER_TRANSFERS = "fewer_transfers"
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
}
