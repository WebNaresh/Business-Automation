import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function PersonalInfo({ empId }) {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // Query to fetch employee profile
  const { isLoading, data: profile, error } = useQuery(
    ["empId", empId],
    async () => {
      if (empId) {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/route/employee/get/profile/${empId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data.employee;
      }
    },
    { enabled: Boolean(empId) } // Only fetch data if empId is provided
  );

  console.log("profile", profile);

  // Static fallback personal data with optional chaining
  const personalData = {
    first_name: profile?.first_name || '-',
    last_name: profile?.last_name || '-',
    email: profile?.email || '-',
    gender: profile?.gender || '-',
    phone_number: profile?.phone_number || '-',
    address: profile?.address || '-',
    permanent_address: profile?.additionalInfo?.['Permanent Address'] || '-',
    citizenship: profile?.citizenship || '-',
    adhar_card_number: profile?.adhar_card_number || '-',
    pan_card_number: profile?.pan_card_number || '-',
    bank_account_no: profile?.bank_account_no || '-',
    date_of_birth: profile?.date_of_birth
      ? new Date(profile?.date_of_birth).toLocaleDateString()
      : '-',
    pwd: profile?.pwd !== undefined ? profile?.pwd : '-',
    uanNo: profile?.uanNo || '-',
    esicNo: profile?.esicNo || '-',
    height: profile?.height || '-',
    weight: profile?.weight || '-',
    blood_group: profile?.blood_group || '-',
    voting_card_no: profile?.voting_card_no || '-',
    smoking_habits: profile?.smoking_habits || '-',
    drinking_habits: profile?.drinking_habits || '-',
    sports_interest: profile?.sports_interest || '-',
    favourite_book: profile?.favourite_book || '-',
    favourite_travel_destination: profile?.favourite_travel_destination || '-',
    disability_status: profile?.disability_status || '-',
    emergency_medical_condition: profile?.emergency_medical_condition || '-',
    short_term_goal: profile?.short_term_goal || '-',
    long_term_goal: profile?.long_term_goal || '-',
    strength: profile?.strength || '-',
    weakness: profile?.weakness || '-',
    bank_name: profile?.bank_name || '-',
    ifsc_code: profile?.ifsc_code || '-',
    spouse_name: profile?.spouse_name || '-',
  };


  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error loading profile data</div>; // Error handling
  }

  return (
    <div className="p-4 space-y-6">
      {/* Personal Info */}
      <Section title="Personal Details">
        <InfoItem label="Full Name" value={`${personalData.first_name} ${personalData.last_name}`} />
        <InfoItem label="Email" value={personalData.email} />
        <InfoItem label="Date of Birth" value={personalData.date_of_birth} />
        <InfoItem label="Phone Number" value={personalData.phone_number} />
        <InfoItem label="What's App Number" value={personalData.whatsapp_number} />
      
        <InfoItem label="Gender" value={personalData.gender} />
        <InfoItem label="Citizenship" value={personalData.citizenship} />
        <InfoItem label="Spouse Name" value={profile?.spouse_name} />
      </Section>

      {/* Residential Details */}
      <Section title="Residential Details">
        <div className="flex flex-col gap-4">
          {/* Current Address */}
          <InfoItem label="Current Address" value={personalData.address} />

          {/* Permanent Address */}
          <InfoItem label="Permanent Address" value={personalData.permanent_address} />
        </div>
      </Section>


      {/* ID Proof Details */}
      <Section title="ID Proof Details">
        <InfoItem label="Aadhar Card Number" value={personalData.adhar_card_number} />
        <InfoItem label="PAN Card Number" value={personalData.pan_card_number} />
        <InfoItem label="Voting Card Number" value={personalData.voting_card_no} />
        <InfoItem label="Bank Name" value={personalData.bank_name} />
        <InfoItem label="Bank Account Number" value={personalData.bank_account_no} />
        <InfoItem label="IFSC Code" value={personalData.ifsc_code} />
        <InfoItem label="UAN Number" value={personalData.uanNo} />
        <InfoItem label="ESIC Number" value={personalData.esicNo} />


      </Section>

      {/* Medical Details */}
      <Section title="Medical Details">
        <InfoItem label="Height" value={personalData.height} />
        <InfoItem label="Weight" value={personalData.weight} />
        <InfoItem label="Blood Group" value={personalData.blood_group} />
        <InfoItem label="Disability Status" value={personalData.disability_status} />
        <InfoItem label="Emergency Medical Condition" value={personalData.emergency_medical_condition} />
        <InfoItem label="Smoking Habits" value={personalData.smoking_habits} />
        <InfoItem label="Drinking Habits" value={personalData.drinking_habits} />
      </Section>

      {/* Additional Details */}
      <div className="p-4 rounded-lg shadow-md bg-white">
        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Additional Details</h2>

        <div className="space-y-4">
          {/* Short Term and Long Term Goals */}
          <InfoItem label="Short Term Goal" value={personalData.short_term_goal} />
          <InfoItem label="Long Term Goal" value={personalData.long_term_goal} />

          {/* Strength, Weakness, and Favourite Travel Destination */}
          <div className="grid grid-cols-3 gap-4">
            <InfoItem label="Strength" value={personalData.strength} />
            <InfoItem label="Weakness" value={personalData.weakness} />
            <InfoItem
              label="Favourite Travel Destination"
              value={personalData.favourite_travel_destination}
            />
          </div>
        </div>
      </div>


    </div>
  );
}

// Section Component for grouping
function Section({ title, children }) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2 border-b pb-1">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

// Individual Info Item Component
function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium capitalize">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
