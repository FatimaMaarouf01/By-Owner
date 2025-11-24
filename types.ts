
import { translations } from "./constants/translations";

export type Language = 'en' | 'ar';

export type PropertyType = 'villa' | 'apartment' | 'commercial' | 'land';

export type PropertyCategory = PropertyType | 'all';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: number;
  type: PropertyType;
  coverImage: string; // Will be represented by a data URL from the uploaded file
  address: {
    en: string; // Will use the fullAddress form field
    ar:string; // Will use the fullAddress form field, can be enhanced later
  };
  price: number;
  size: number;
  bedrooms: number;
  livingRooms: number;
  balconies: number;
  kitchens: number;
  bathrooms: number;
  furnished: boolean;
  totalFloors?: number;
  floorNumber?: number;
  elevator?: boolean;
  constructionYear: number;
  waterSource: string;
  electricitySource: string[];
  mapsLink: string;
  parking: number;
  description?: string;
}

export interface PropertySubmission {
    id: number;
    status: SubmissionStatus;
    ownerName: string;
    ownerPhone: string;
    property: Omit<Property, 'id' | 'address' | 'coverImage'> & {
        fullAddress: string;
    };
    coverImage?: string;
    uploadedImages: string[];
    uploadedDocuments: string[];
    uploadedOwnerId: string[];
}

export interface FilterState {
  location: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
}


export type TranslationKey = 
  | 'all'
  | 'villas'
  | 'apartments'
  | 'commercial'
  | 'land'
  | 'submit_your_property'
  | 'featured_properties'
  | 'explore_our_exclusive_listings'
  | 'list_your_property'
  | 'by_owner_submission_form_subtitle'
  | 'owner_information'
  | 'owner_name'
  | 'owner_name_placeholder'
  | 'owner_phone'
  | 'owner_phone_placeholder'
  | 'property_details'
  | 'property_type'
  | 'select_property_type'
  | 'property_size'
  | 'property_size_placeholder'
  | 'bedrooms'
  | 'living_rooms'
  | 'balconies'
  | 'kitchens'
  | 'bathrooms'
  | 'furnished'
  | 'yes'
  | 'no'
  | 'total_floors'
  | 'total_floors_placeholder'
  | 'floor_number'
  | 'floor_number_placeholder'
  | 'elevator'
  | 'construction_year'
  | 'construction_year_placeholder'
  | 'utilities'
  | 'water_source'
  | 'water_source_placeholder'
  | 'electricity_source'
  | 'select_electricity_source'
  | 'solar'
  | 'building_generator'
  | 'other'
  | 'location'
  | 'google_maps_link'
  | 'google_maps_link_placeholder'
  | 'pick_on_map'
  | 'pick_on_map_tooltip'
  | 'full_address'
  | 'full_address_placeholder'
  | 'uploads'
  | 'property_images'
  | 'property_images_hint'
  | 'official_documents'
  | 'official_documents_hint'
  | 'owner_id'
  | 'owner_id_hint'
  | 'pricing'
  | 'property_price'
  | 'property_price_placeholder'
  | 'parking_spaces'
  // FIX: Added missing translation key
  | 'parking_spaces_placeholder'
  | 'submit_listing'
  | 'submission_successful'
  | 'submission_disclaimer'
  | 'close'
  | 'field_required'
  | 'footer_text'
  | 'villa'
  | 'apartment'
  | 'drag_drop_files'
  | 'or_click_to_select'
  | 'admin_panel'
  | 'pending_submissions'
  | 'no_pending_submissions'
  | 'approve'
  | 'reject'
  | 'admin'
  | 'search_by_location'
  | 'back_to_listings'
  | 'key_details'
  | 'general_information'
  | 'utilities_info'
  | 'location_info'
  | 'view_on_map'
  | 'parking'
  | 'min_price'
  | 'max_price'
  | 'min_size'
  | 'max_size'
  | 'price_range'
  | 'size_range'
  | 'apply_filters'
  | 'reset_filters'
  | 'any'
  | 'view_details'
  | 'approved_submissions'
  | 'remove'
  | 'no_approved_submissions'
  | 'remove_property_confirm'
  | 'published_properties'
  | 'no_published_properties'
  | 'choose_cover_image'
  | 'powered_by'
  | 'description'
  | 'description_placeholder'
  | 'uploaded_documents'
  | 'owner_id_card_view'
  | 'view'
  | 'no_documents_uploaded'
  | 'no_id_uploaded'
  | 'admin_login'
  | 'username'
  | 'password'
  | 'login'
  | 'invalid_credentials';
  

export type Translations = {
  [key in Language]: {
    [key in TranslationKey]: string;
  };
};

export type TFunction = (key: TranslationKey) => string;
