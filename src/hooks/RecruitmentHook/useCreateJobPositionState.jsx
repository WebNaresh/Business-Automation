import { create } from "zustand";

const useCreateJobPositionState = create((set) => {
  return {
    position_name: undefined,
    department_name: undefined,
    location_name: undefined,
    date: undefined,
    mode_of_working: undefined,
    job_type: undefined,
    job_level: undefined,
    required_skill: undefined,
    job_description: undefined,
    role_and_responsibility: undefined,
    hiring_manager: undefined,
    hiring_hr: undefined,
    education: undefined,
    experience_level: undefined,
    additional_certificate: undefined,
    age_requirement: undefined,
    working_time: undefined,

    setStep1Data: (data) => {
      set((state) => ({
        ...state,
        position_name: data.position_name,
        department_name: data.department_name,
        location_name: data.location_name,
        date: data.date,
        job_type: data.job_type,
        mode_of_working: data.mode_of_working,
        job_level: data.job_level,
        job_description: data.job_description,
        role_and_responsibility: data.role_and_responsibility,
      }));
    },
    setStep2Data: (data) => {
      set((state) => ({
        ...state,
        required_skill: data.required_skill,
        hiring_manager: data.hiring_manager,
        hiring_hr: data.hiring_hr,
        education: data.education,
        experience_level: data.experience_level,
        additional_certificate: data.additional_certificate,
        age_requirement: data.age_requirement,
        working_time: data.working_time,
    }));
    },
    emptyState: () => {
      set({
        position_name: undefined,
        department_name: undefined,
        location_name: undefined,
        date: undefined,
        mode_of_working: undefined,
        job_type: undefined,
        job_level: undefined,
        required_skill: undefined,
        job_description: undefined,
        role_and_responsibility: undefined,
        hiring_manager: undefined,
        hiring_hr: undefined,
        education: undefined,
        experience_level: undefined,
        additional_certificate: undefined,
        age_requirement: undefined,
        working_time: undefined,
        data: undefined,
      });
    },
  };
});

export default useCreateJobPositionState;
