import { create } from "zustand";

const useOrg = create((set) => {
  // Get decodedToken synchronously at the time of store creation

  return {
    // Organization details
    orgName: import.meta.env.VITE_orgName ?? undefined,
    foundation_date: import.meta.env.VITE_foundation_date ?? undefined,
    web_url: import.meta.env.VITE_web_url ?? undefined,
    industry_type: import.meta.env.VITE_industry_type ?? undefined,
    email: import.meta.env.VITE_email ?? undefined,
    organization_linkedin_url:
      import.meta.env.VITE_organization_linkedin_url ?? undefined,
    location: {
      address: import.meta.env.VITE_location_address ?? undefined,
      position: {
        lat: import.meta.env.VITE_location_position_lat ?? undefined,
        lng: import.meta.env.VITE_location_position_lng ?? undefined,
      },
    },
    contact_number: import.meta.env.VITE_contact_number ?? undefined,
    description: import.meta.env.VITE_description ?? undefined,
    verfiedToken: undefined,
    creator: import.meta.env.VITE_creator ?? undefined, // Using the obtained decoded token
    isTrial: Boolean(import.meta.env.VITE_isTrial) ?? false,
    packageInfo: import.meta.env.VITE_packageInfo ?? undefined,
    count: import.meta.env.VITE_count ?? undefined,
    cycleCount: import.meta.env.VITE_cycleCount ?? "1",
    paymentType: import.meta.env.VITE_paymentType ?? undefined,
    packages: undefined,
    coupan: undefined,

    // Setter function for updating multiple properties at once
    setStep2Data: (packageInfo) => {
      set({ packageInfo });
    },
    setStep1Data: async (orgName) => {
      await set({
        ...orgName,
      });
    },
    setStep3Data: (data) => {
      set({
        count: data.count,
        cycleCount: data.cycleCount,
        paymentType: data?.paymentType,
        packages: data?.packages,
        coupan: data?.coupan,
      });
    },
    setVerifyToken: (data) => {
      set({ verifyToken: data });
    },
    setCreator: (creator) => set({ creator: creator.user._id }),
    logData: () => {
      const currentState = set(); // Access the current state
      console.log("store Data", currentState);
    },
  };
});

export default useOrg;
