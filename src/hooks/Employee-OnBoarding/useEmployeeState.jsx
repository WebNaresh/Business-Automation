import { create } from "zustand";

const useEmployeeState = create((set) => ({
  // Basic Details
  first_name: undefined,
  last_name: undefined,
  gender: undefined,
  email: undefined,
  phone_number: undefined,
  address: undefined,
  date_of_birth: undefined,
  citizenship: undefined,
  adhar_card_number: undefined,
  pan_card_number: undefined,
  bank_account_no: undefined,
  pwd: false,
  uanNo: undefined,
  esicNo: undefined,

  // Emergency Contact Details
  emergency_contact_no: undefined,
  emergency_contact_name: undefined,
  relationship_with_emergency_contact: undefined,
  alternate_contact_no: undefined,

  // Personal Details
  height: undefined,
  weight: undefined,
  voting_card_no: undefined,
  blood_group: undefined,
  permanent_address: undefined,
  religion: undefined,
  parent_name: undefined,
  spouse_name: undefined,

  // Family Details
  father_first_name: undefined,
  father_middal_name: undefined,
  father_last_name: undefined,
  father_occupation: undefined,
  mother_first_name: undefined,
  mother_middal_name: undefined,
  mother_last_name: undefined,
  mother_occupation: undefined,

  // Lifestyle Details
  smoking_habits: false,
  drinking_habits: false,
  sports_interest: undefined,
  favourite_book: undefined,
  favourite_travel_destination: undefined,

  // Medical Details
  disability_status: undefined,
  emergency_medical_condition: undefined,

  // Goals and Traits
  short_term_goal: undefined,
  long_term_goal: undefined,
  strength: undefined,
  weakness: undefined,

  // Bank Details
  bank_name: undefined,
  ifsc_code: undefined,

  // Employment Details
  designation: undefined,
  worklocation: undefined,
  deptname: undefined,
  employmentType: undefined,
  empId: undefined,
  mgrempid: undefined,
  joining_date: undefined,
  salarystructure: undefined,
  dept_cost_center_no: undefined,
  companyemail: undefined,
  profile: [],
  shift_allocation: undefined,
  data: undefined,
  status: undefined,
  current_ctc: undefined,
  incentive: undefined,
  health_insurance: undefined,
  exit_date: undefined,
  travel_expenses_allowance: undefined,
  travel_requirement: undefined,
  id_card_no: undefined,
  company_assets: undefined,
  
  // Setter for updating multiple fields at once
  setStep1Data: (data) => {
    set({ ...data });
  },

  setStep2Data: (data) => {
    set({ ...data });
  },

  setStep3Data: (data) => {
    console.log(`🚀 ~ data:`, data);
    set({ data: { ...data } });
  },

  updateField: (fieldName, value) => {
    set((state) => ({
      ...state,
      [fieldName]: value,
    }));
  },

  // Reset state to default
  emptyState: () => {
    set({
      first_name: undefined,
      last_name: undefined,
      gender: undefined,
      email: undefined,
      phone_number: undefined,
      address: undefined,
      date_of_birth: undefined,
      citizenship: undefined,
      adhar_card_number: undefined,
      pan_card_number: undefined,
      bank_account_no: undefined,
      pwd: false,
      uanNo: undefined,
      esicNo: undefined,
      emergency_contact_no: undefined,
      emergency_contact_name: undefined,
      relationship_with_emergency_contact: undefined,
      alternate_contact_no: undefined,
      height: undefined,
      weight: undefined,
      voting_card_no: undefined,
      blood_group: undefined,
      permanent_address: undefined,
      religion: undefined,
      parent_name: undefined,
      spouse_name: undefined,
      father_first_name: undefined,
      father_middal_name: undefined,
      father_last_name: undefined,
      father_occupation: undefined,
      mother_first_name: undefined,
      mother_middal_name: undefined,
      mother_last_name: undefined,
      mother_occupation: undefined,
      smoking_habits: false,
      drinking_habits: false,
      sports_interest: undefined,
      favourite_book: undefined,
      favourite_travel_destination: undefined,
      disability_status: undefined,
      emergency_medical_condition: undefined,
      short_term_goal: undefined,
      long_term_goal: undefined,
      strength: undefined,
      weakness: undefined,
      bank_name: undefined,
      ifsc_code: undefined,
      designation: undefined,
      worklocation: undefined,
      deptname: undefined,
      employmentType: undefined,
      empId: undefined,
      mgrempid: undefined,
      joining_date: undefined,
      salarystructure: undefined,
      dept_cost_center_no: undefined,
      companyemail: undefined,
      profile: [],
      shift_allocation: undefined,
      data: undefined,
      status: undefined,
      current_ctc: undefined,
      incentive: undefined,
      health_insurance: undefined,
      exit_date: undefined,
      travel_expenses_allowance: undefined,
      travel_requirement: undefined,
      id_card_no: undefined,
   
    });
  },
}));

export default useEmployeeState;
