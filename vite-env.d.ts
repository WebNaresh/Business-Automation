/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly VITE_GENERATE_SOURCEMAP: string;
    readonly VITE_API: string;
    readonly VITE_orgName: string;
    readonly VITE_foundation_date: string;
    readonly VITE_web_url: string;
    readonly VITE_industry_type: string;
    readonly VITE_email: string;
    readonly VITE_organization_linkedin_url: string;
    readonly VITE_location_address: string;
    readonly VITE_location_position_lat: string;
    readonly VITE_location_position_lng: string;
    readonly VITE_contact_number: string;
    readonly VITE_description: string;
    readonly VITE_creator: string;
    readonly VITE_isTrial: string;
    readonly VITE_packageInfo: string;
    readonly VITE_count: string;
    readonly VITE_cycleCount: string;
    readonly VITE_paymentType: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}