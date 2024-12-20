├── .env
├── .gitignore
├── component.json
├── craco.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── src
│   ├── App.jsx
│   ├── assets
│   │   ├── animation.json
│   │   ├── CalenderAnimation.gif
│   │   ├── CalenderAnimation2.json
│   │   ├── hrmsImg.png
│   │   ├── QRcode.svg
│   │   └── sign.png
│   ├── components
│   │   ├── app-layout
│   │   │   ├── components
│   │   │   │   ├── accordian.jsx
│   │   │   │   ├── NotificationIcon.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── test-nav-items.jsx
│   │   │   │   └── TestAccordian.jsx
│   │   │   ├── nav-items.jsx
│   │   │   ├── notification-zustand.jsx
│   │   │   └── swipable-drawer.jsx
│   │   ├── app-loader
│   │   │   └── page.jsx
│   │   ├── BackComponent
│   │   │   └── BackComponent.jsx
│   │   ├── date-picker
│   │   │   ├── Cdate-picker.jsx
│   │   │   ├── components
│   │   │   │   └── mini-form.jsx
│   │   │   ├── date-picker.jsx
│   │   │   ├── date-picker2.jsx
│   │   │   ├── date-picker3.jsx
│   │   │   └── DateDisplay.jsx
│   │   ├── emailverify
│   │   │   ├── emailverify.jsx
│   │   │   ├── styles.module.css
│   │   │   └── verification-animation.jsx
│   │   ├── EmptyAlertBox.jsx
│   │   ├── forgotpassword
│   │   │   └── forgotpassword.jsx
│   │   ├── GoogleMapAutocomplete
│   │   │   └── GoogleAutocomplete.jsx
│   │   ├── header
│   │   │   ├── component.jsx
│   │   │   ├── HeaderBackComponent2.jsx
│   │   │   ├── HeaderComponentPro.jsx
│   │   │   └── TempHeader.jsx
│   │   ├── InputFileds
│   │   │   ├── AuthInputFiled.jsx
│   │   │   ├── ChangeRole.jsx
│   │   │   ├── only-place-autocomplete.jsx
│   │   │   └── places-autocomplete.jsx
│   │   ├── Modal
│   │   │   ├── AdvanceSalaryModal
│   │   │   │   ├── ApplyAdvanceSalaryModal.jsx
│   │   │   │   └── EditAdvanceSalaryModal.jsx
│   │   │   ├── AttedanceBioModal
│   │   │   │   ├── AttendanceBioModal.jsx
│   │   │   │   └── AttendanceModel.jsx
│   │   │   ├── CalculateHourEmpModal
│   │   │   │   └── CalculateHourEmpModal.jsx
│   │   │   ├── CommunicationModal
│   │   │   │   ├── AddCommunicationModal.jsx
│   │   │   │   ├── CommunicationScheleton.jsx
│   │   │   │   ├── EditCommunicationModal.jsx
│   │   │   │   ├── NewCommunicationModal.jsx
│   │   │   │   ├── NewEditCommunicationModal.jsx
│   │   │   │   └── PreviewCommuncationModal.jsx
│   │   │   ├── component.jsx
│   │   │   ├── CreateSalaryModel
│   │   │   │   ├── CreateSalaryModel.jsx
│   │   │   │   ├── DeleteSalaryModal.jsx
│   │   │   │   └── UpdateSalaryModal.jsx
│   │   │   ├── DocModal
│   │   │   │   └── DocRejectModal.jsx
│   │   │   ├── EditEmployeeModal
│   │   │   │   ├── EditEmployeeModel.jsx
│   │   │   │   └── UpdateEmployeeModal.jsx
│   │   │   ├── EditEmpProfileModal
│   │   │   │   └── EditEmpProfileModal.jsx
│   │   │   ├── EditTemplateModal
│   │   │   │   └── EmpEditModal.jsx
│   │   │   ├── EmpCodeModel
│   │   │   │   ├── CreateEmpCodeModel.js
│   │   │   │   └── EditEmpCodeModel.js
│   │   │   ├── EmployeeSalaryDayModal
│   │   │   │   ├── CreateEmpSalCalDay.jsx
│   │   │   │   └── EmpSalaryDayModal.jsx
│   │   │   ├── EmployeeSurveyDetailsModal
│   │   │   │   └── EmployeeSurveyDetailsModal.jsx
│   │   │   ├── EmployeeTypesModal
│   │   │   │   └── EmpTypeModal.jsx
│   │   │   ├── Form16Modal
│   │   │   │   ├── Form16DeleteModal.jsx
│   │   │   │   ├── Form16Download.jsx
│   │   │   │   └── Form16UploadModal.jsx
│   │   │   ├── InputFieldModal.jsx
│   │   │   ├── LeaveModal
│   │   │   │   ├── LeaveRejectmodal.jsx
│   │   │   │   └── useLeaveData.jsx
│   │   │   ├── LeaveTypeModal
│   │   │   │   ├── create-leve-type-modal.jsx
│   │   │   │   └── leave-type-modal.jsx
│   │   │   ├── LoanMgtPieChartModal
│   │   │   │   └── LoanMgtPieChartModal.jsx
│   │   │   ├── LoanTypeModal
│   │   │   │   ├── AddLoanTypeModal.jsx
│   │   │   │   └── EditLoanTypeModal.jsx
│   │   │   ├── MissPunchJustifyModal
│   │   │   │   ├── MissPunchJustifyModal.jsx
│   │   │   │   └── useMissedJustifyState.jsx
│   │   │   ├── ModalForLoanAdvanceSalary
│   │   │   │   ├── CreateLoanMgtModal.jsx
│   │   │   │   └── EditLoanModal.jsx
│   │   │   ├── PackagesModal
│   │   │   │   └── package-info.jsx
│   │   │   ├── RecruitmentModal
│   │   │   │   └── ViewJobRoleModal.jsx
│   │   │   ├── RemotePunchingModal
│   │   │   │   ├── components
│   │   │   │   │   ├── card.jsx
│   │   │   │   │   ├── left-side-bar.jsx
│   │   │   │   │   └── mapped-form.jsx
│   │   │   │   ├── GeoFencingAcceptModal.jsx
│   │   │   │   ├── PunchAcceptModal.jsx
│   │   │   │   └── PunchingRejectModal.jsx
│   │   │   ├── SalaryInputFields
│   │   │   │   └── SalaryInputFieldsModal.jsx
│   │   │   ├── Selfi-Image
│   │   │   │   ├── components
│   │   │   │   │   ├── Loader.jsx
│   │   │   │   │   └── mini-form.jsx
│   │   │   │   ├── Selfie.jsx
│   │   │   │   └── useSelfieFaceDetect.jsx
│   │   │   ├── shift
│   │   │   │   └── ShiftModal.jsx
│   │   │   ├── ShiftRequestModal
│   │   │   │   └── ShiftRejectModel.jsx
│   │   │   └── ViewAttendanceCalModal
│   │   │       └── ViewAttendanceCalModal.jsx
│   │   ├── Payment
│   │   │   └── not-recieved.jsx
│   │   ├── phoneauth
│   │   │   └── phoneauth.jsx
│   │   ├── profieicon
│   │   │   └── profileIcon.jsx
│   │   ├── resetpassword
│   │   │   └── resetpassword.jsx
│   │   ├── SideNav
│   │   │   └── SetupSideNav.jsx
│   │   ├── step-form
│   │   │   ├── bottom.jsx
│   │   │   ├── header.jsx
│   │   │   └── wrapper.jsx
│   │   └── TermsPrivacyCookies
│   │       ├── CookiesPolicy.jsx
│   │       ├── PrivacyPolicy.jsx
│   │       ├── TabTermsPrivacyPolicy.jsx
│   │       └── termsconditonpage.jsx
│   ├── context
│   │   └── AuthProvider.jsx
│   ├── hooks
│   │   ├── AdvanceSalaryHook
│   │   │   ├── useAdvanceSalaryQuery.jsx
│   │   │   └── useAdvanceSalaryState.jsx
│   │   ├── CalculateSalaryHook
│   │   │   └── useCalculateSalaryQuery.jsx
│   │   ├── Dashboard
│   │   │   ├── useDashboardFilter.jsx
│   │   │   ├── useDashGlobal.jsx
│   │   │   └── useEmployee.jsx
│   │   ├── DepartmentHook
│   │   │   ├── useDepartmentState.jsx
│   │   │   ├── useDeptOption.jsx
│   │   │   ├── useDeptQuery.jsx
│   │   │   └── useEditDepartmentState.jsx
│   │   ├── Employee
│   │   │   └── useGetAllManager.jsx
│   │   ├── Employee-OnBoarding
│   │   │   ├── useEmployeeState.jsx
│   │   │   ├── useEmpOption.jsx
│   │   │   ├── useEmpQuery.jsx
│   │   │   └── useEmpState.jsx
│   │   ├── Employee-Update
│   │   │   ├── useEmployeeQuery.jsx
│   │   │   ├── useEmpOptions.jsx
│   │   │   └── useEmpState.jsx
│   │   ├── EmployeeSurvey
│   │   │   └── EmployeeSurvey.jsx
│   │   ├── FaceMode
│   │   │   ├── useFaceModal.jsx
│   │   │   └── useFaceStore.jsx
│   │   ├── IncomeTax
│   │   │   ├── useGetEmployeeSalaryByFinaicalYear.jsx
│   │   │   ├── useIncomeAPI.jsx
│   │   │   ├── useIncomeHouse.jsx
│   │   │   ├── useIncomeTax.jsx
│   │   │   ├── useOther.jsx
│   │   │   └── useTDS.jsx
│   │   ├── Leave
│   │   │   ├── useGetRemainingLeave.jsx
│   │   │   ├── useLeaveData.jsx
│   │   │   └── useLeaveTable.jsx
│   │   ├── LoanManagemet
│   │   │   ├── useCalculation.jsx
│   │   │   ├── useLaonState.jsx
│   │   │   ├── useLoanOption.jsx
│   │   │   └── useLoanQuery.jsx
│   │   ├── Location
│   │   │   ├── useGetCurrentLocation.jsx
│   │   │   └── useLocation.jsx
│   │   ├── MissedData
│   │   │   └── useMissedData.jsx
│   │   ├── Nav
│   │   │   └── useSetupSideNav.jsx
│   │   ├── Performance
│   │   │   ├── usePerformance.jsx
│   │   │   └── usePerformanceApi.jsx
│   │   ├── QueryHook
│   │   │   ├── Delegate-Super-Admin
│   │   │   │   ├── hook.jsx
│   │   │   │   └── mutation.jsx
│   │   │   ├── FaceRecognition
│   │   │   │   └── useFaceRec.jsx
│   │   │   ├── Leave-Requsation
│   │   │   │   ├── hook.jsx
│   │   │   │   └── mutaion.jsx
│   │   │   ├── Location
│   │   │   │   ├── independant-use-query.jsx
│   │   │   │   ├── mutation.jsx
│   │   │   │   └── zustand-store.jsx
│   │   │   ├── notification
│   │   │   │   ├── advance-salary-notification
│   │   │   │   │   └── useAdvanceSalary.jsx
│   │   │   │   ├── department-notification
│   │   │   │   │   └── hook.jsx
│   │   │   │   ├── document-notification
│   │   │   │   │   └── hook.jsx
│   │   │   │   ├── Form16Notification
│   │   │   │   │   └── useForm16NotificationHook.jsx
│   │   │   │   ├── geo-fencing-notification
│   │   │   │   │   └── hook.jsx
│   │   │   │   ├── job-position-notification
│   │   │   │   │   └── useJobPositionNotification.jsx
│   │   │   │   ├── leave-notification
│   │   │   │   │   └── hook.jsx
│   │   │   │   ├── loan-notification
│   │   │   │   │   └── useLoanNotificaiton.jsx
│   │   │   │   ├── MissedPunchNotification
│   │   │   │   │   └── MissedPunchNotification.jsx
│   │   │   │   ├── PayslipNotification
│   │   │   │   │   └── usePayslipNotificaitonHook.jsx
│   │   │   │   ├── punch-notification
│   │   │   │   │   └── hook.jsx
│   │   │   │   ├── shift-notificatoin
│   │   │   │   │   └── hook.jsx
│   │   │   │   └── tds-notification
│   │   │   │       └── hook.jsx
│   │   │   ├── Organisation
│   │   │   │   └── mutation.jsx
│   │   │   ├── Orglist
│   │   │   │   └── hook.jsx
│   │   │   ├── Remote-Punch
│   │   │   │   ├── components
│   │   │   │   │   ├── get-sing-entry.jsx
│   │   │   │   │   ├── hook.jsx
│   │   │   │   │   └── mutation.jsx
│   │   │   │   └── hook.jsx
│   │   │   ├── Remote-Punching
│   │   │   │   └── Hook.jsx
│   │   │   ├── Setup
│   │   │   │   ├── remote-punching.jsx
│   │   │   │   └── training.jsx
│   │   │   ├── Subscription
│   │   │   │   ├── hook.jsx
│   │   │   │   └── mutation.jsx
│   │   │   ├── Training
│   │   │   │   ├── hook
│   │   │   │   │   └── useDebounce.jsx
│   │   │   │   └── hook.jsx
│   │   │   └── Verification
│   │   │       └── hook.jsx
│   │   ├── record-hook
│   │   │   └── record-hook.jsx
│   │   ├── RecruitmentHook
│   │   │   ├── useCreateJobPositionState.jsx
│   │   │   └── useRecruitmentQuery.jsx
│   │   ├── Salary
│   │   │   └── useGetPfEsicSetup.jsx
│   │   ├── ShiftData
│   │   │   └── useShiftData.jsx
│   │   ├── Subscription
│   │   │   └── subscription.jsx
│   │   ├── Token
│   │   │   ├── useAuth.jsx
│   │   │   └── useUser.jsx
│   │   ├── useAddEmpForm.jsx
│   │   ├── useHoursHook
│   │   │   └── useHourHook.jsx
│   │   ├── useLoginForm.jsx
│   │   ├── useProfileForm.jsx
│   │   ├── UserData
│   │   │   └── useUser.jsx
│   │   ├── UserProfile
│   │   │   └── useHook.js
│   │   ├── useSignUpForm.jsx
│   │   └── useStepForm.jsx
│   ├── index.css
│   ├── index.js
│   ├── lib
│   │   └── utils.js
│   ├── pages
│   │   ├── add-delegate
│   │   │   ├── AddDelegate.jsx
│   │   │   └── components
│   │   │       └── form.jsx
│   │   ├── AddNewUserId
│   │   │   └── AddNewUserId.jsx
│   │   ├── AddOrganisation
│   │   │   ├── components
│   │   │   │   ├── data.js
│   │   │   │   ├── image-input.jsx
│   │   │   │   ├── pdf-input.jsx
│   │   │   │   ├── step-1.jsx
│   │   │   │   ├── step-2-components
│   │   │   │   │   ├── price-input.jsx
│   │   │   │   │   └── pricing-card.jsx
│   │   │   │   ├── step-2-mini-form.jsx
│   │   │   │   ├── step-2.jsx
│   │   │   │   ├── step-3.jsx
│   │   │   │   └── step-4.jsx
│   │   │   └── OrgFrom.jsx
│   │   ├── AdvanceSalary
│   │   │   └── AdvanceSalary.jsx
│   │   ├── AdvanceSalaryNotification
│   │   │   ├── AdvanceSalaryApproval.jsx
│   │   │   ├── AdvanceSalaryNotification.jsx
│   │   │   ├── AdvanceSalaryNotificationToEmp.jsx
│   │   │   ├── Component
│   │   │   │   ├── employee-salary-card.jsx
│   │   │   │   ├── employee-salary-loader.jsx
│   │   │   │   └── input-form.jsx
│   │   │   └── ViewDocumentModal.jsx
│   │   ├── AllNotifications
│   │   │   ├── components
│   │   │   │   ├── card.jsx
│   │   │   │   └── useNotification.jsx
│   │   │   ├── empShiftNotification.jsx
│   │   │   └── page.jsx
│   │   ├── Application
│   │   │   └── Application.jsx
│   │   ├── Billing
│   │   │   ├── components
│   │   │   │   ├── billing-card.jsx
│   │   │   │   ├── descripton-box.jsx
│   │   │   │   └── package
│   │   │   │       ├── pay-sub.jsx
│   │   │   │       ├── renew.jsx
│   │   │   │       ├── subscription-mutaiton.jsx
│   │   │   │       └── upgrade.jsx
│   │   │   └── page.jsx
│   │   ├── CateringAndFood
│   │   │   ├── Cateringandfoodsetup.jsx
│   │   │   └── VendorSignUp
│   │   │       ├── Page2.jsx
│   │   │       ├── Page3.jsx
│   │   │       ├── Signupvendor.jsx
│   │   │       └── Vendortest.jsx
│   │   ├── Communication
│   │   │   └── Communication.jsx
│   │   ├── custom
│   │   │   ├── Calendar.jsx
│   │   │   └── useCustomCal.jsx
│   │   ├── DashBoard
│   │   │   ├── Components
│   │   │   │   ├── Bar
│   │   │   │   │   ├── employee
│   │   │   │   │   │   └── SinglePayGraph.jsx
│   │   │   │   │   ├── HRgraph.jsx
│   │   │   │   │   ├── LineGraph.jsx
│   │   │   │   │   └── SuperAdmin
│   │   │   │   │       └── AttendenceBar.jsx
│   │   │   │   ├── Card
│   │   │   │   │   ├── employee
│   │   │   │   │   │   └── EmpCard.jsx
│   │   │   │   │   ├── MangerCard
│   │   │   │   │   │   └── DataCard.jsx
│   │   │   │   │   └── superadmin
│   │   │   │   │       └── SuperAdminCard.jsx
│   │   │   │   ├── Custom
│   │   │   │   │   └── ManagerEmployeeChart.jsx
│   │   │   │   ├── List
│   │   │   │   │   ├── EmployeLeaveReqest.jsx
│   │   │   │   │   ├── LeaveDisplayList.jsx
│   │   │   │   │   └── PublicHolidayDisplayList.jsx
│   │   │   │   ├── Pie
│   │   │   │   │   └── EmployeeLeavePie.jsx
│   │   │   │   ├── SkeletonComponents
│   │   │   │   │   └── PublicSkeletonComponent.jsx
│   │   │   │   └── Skeletons
│   │   │   │       ├── AdminCardSke.jsx
│   │   │   │       └── SkeletonFilterSection.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardDH.jsx
│   │   │   ├── DashBoardHR.jsx
│   │   │   ├── DashboardManger.jsx
│   │   │   ├── hooks
│   │   │   │   └── useRemoteCount.jsx
│   │   │   └── SuperAdmin.jsx
│   │   ├── Departments
│   │   │   ├── Components
│   │   │   │   ├── Step1.jsx
│   │   │   │   ├── Step2.jsx
│   │   │   │   └── Step3.jsx
│   │   │   ├── DepartmentList.jsx
│   │   │   └── EditDepartment.jsx
│   │   ├── DeptNotification
│   │   │   ├── Components
│   │   │   │   ├── department-card.jsx
│   │   │   │   ├── department-loader.jsx
│   │   │   │   └── input-form.jsx
│   │   │   ├── DepartmentApproval.jsx
│   │   │   ├── DepartmentNotification.jsx
│   │   │   └── DepartmentNotificationToEmp.jsx
│   │   ├── Designation
│   │   │   ├── components
│   │   │   │   ├── desingation-row.jsx
│   │   │   │   ├── edit-form.jsx
│   │   │   │   └── mini-form-add.jsx
│   │   │   ├── Designation.jsx
│   │   │   └── hooks
│   │   │       └── useDesignation.jsx
│   │   ├── doc-notification
│   │   │   └── DocNotification.jsx
│   │   ├── DocumentManagement
│   │   │   ├── components
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── DocList.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Modal2.jsx
│   │   │   │   ├── Options.jsx
│   │   │   │   ├── ShowDoc.jsx
│   │   │   │   ├── UploadDocumentModal.jsx
│   │   │   │   ├── ViewDocumentSkeleton.jsx
│   │   │   │   ├── ViewEmployeeRecord.jsx
│   │   │   │   └── ViewRecordModel.jsx
│   │   │   ├── DocManage.jsx
│   │   │   ├── DocManageAuth.jsx
│   │   │   ├── DocManageToHr.jsx
│   │   │   ├── OrgDocManage.jsx
│   │   │   └── RenderDocManage.jsx
│   │   ├── emp-notifications
│   │   │   ├── EmpGeoFencingNotification.jsx
│   │   │   └── EmpNotification.jsx
│   │   ├── EmpExcelOnboard
│   │   │   └── EmpExcelOnboard.jsx
│   │   ├── Employee
│   │   │   ├── Component
│   │   │   │   ├── Test1.jsx
│   │   │   │   ├── Test2.jsx
│   │   │   │   ├── Test3.jsx
│   │   │   │   ├── Test4.jsx
│   │   │   │   └── useHook.js
│   │   │   ├── DeleteEmployee.jsx
│   │   │   ├── EditEmployee.jsx
│   │   │   ├── Employee.jsx
│   │   │   ├── EmployeeListtoEmployee.jsx
│   │   │   └── EmployeeListToRole.jsx
│   │   ├── Employee-Confirm
│   │   │   ├── components
│   │   │   │   └── mapped-punches.jsx
│   │   │   └── page.jsx
│   │   ├── Employee-Notification
│   │   │   ├── components
│   │   │   │   └── card.jsx
│   │   │   └── page.jsx
│   │   ├── EmployeeSurvey
│   │   │   ├── components
│   │   │   │   ├── CloseSurveyList.jsx
│   │   │   │   ├── CreateNewSurvey.jsx
│   │   │   │   ├── EmployeeSurveyForm.jsx
│   │   │   │   ├── IndividualResponse.jsx
│   │   │   │   ├── OpenSurveyList.jsx
│   │   │   │   ├── QuestionStats.jsx
│   │   │   │   ├── SaveAsDraft.jsx
│   │   │   │   ├── SaveSurveyList.jsx
│   │   │   │   ├── SummaryTab.jsx
│   │   │   │   ├── SurveyDetails.jsx
│   │   │   │   └── TempPunchingData.jsx
│   │   │   ├── EmployeeSurvey.jsx
│   │   │   └── useContext
│   │   │       └── Permission.jsx
│   │   ├── Form16
│   │   │   ├── Form16.jsx
│   │   │   ├── Form16Emp.jsx
│   │   │   └── Form16Hr.jsx
│   │   ├── Form16NotificationToEmp
│   │   │   ├── Component
│   │   │   │   ├── Form16Card.jsx
│   │   │   │   ├── Form16Loader.jsx
│   │   │   │   └── InputForm.jsx
│   │   │   └── Form16NotificationToEmp.jsx
│   │   ├── Geo-Fence
│   │   │   ├── components
│   │   │   │   ├── AddGeoFencing.jsx
│   │   │   │   ├── GeoFenceCard.jsx
│   │   │   │   ├── GeoFencingEmployeeSide.jsx
│   │   │   │   ├── LocationRelated.jsx
│   │   │   │   ├── Map-Component.jsx
│   │   │   │   ├── Speed-dial-employee.jsx
│   │   │   │   ├── useGeoFencingMap.jsx
│   │   │   │   └── ViewDelete.jsx
│   │   │   ├── Mutation
│   │   │   │   ├── employeeListStore.jsx
│   │   │   │   ├── useGeoCard.jsx
│   │   │   │   └── useSearchEmployee.jsx
│   │   │   ├── page.jsx
│   │   │   ├── useGetRevGeo.jsx
│   │   │   ├── useOrgGeo.jsx
│   │   │   └── utils
│   │   │       ├── SearchAdd.jsx
│   │   │       ├── SearchAndAdd
│   │   │       │   └── SearchTableComponent.jsx
│   │   │       ├── SmallInputForm.jsx
│   │   │       └── TableComponent.jsx
│   │   ├── Geo-Fencing
│   │   │   ├── components
│   │   │   │   ├── FaceDetectionLoader.jsx
│   │   │   │   ├── MapComponent.jsx
│   │   │   │   ├── PhotoCaptureCamera.jsx
│   │   │   │   ├── PhotoCaptureForm.jsx
│   │   │   │   ├── StartGeoFencing.jsx
│   │   │   │   ├── StopGeoFencing.jsx
│   │   │   │   ├── useFaceStore.jsx
│   │   │   │   ├── useGeoFencingCircle.jsx
│   │   │   │   ├── useLocationMutation.jsx
│   │   │   │   ├── useSelfieFaceDetect.jsx
│   │   │   │   └── useStartGeoFencing.jsx
│   │   │   └── EmployeeSideGeoFencing.jsx
│   │   ├── Home
│   │   │   ├── components
│   │   │   │   ├── edit-organization.jsx
│   │   │   │   ├── Organisation.jsx
│   │   │   │   └── OrganizationSkelton.jsx
│   │   │   ├── Home.jsx
│   │   │   └── WelcomeAdmin
│   │   │       └── WelcomeAdmin.jsx
│   │   ├── Income
│   │   │   ├── components
│   │   │   │   ├── accountantDeclarations
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── RegimeModel.jsx
│   │   │   │   │   │   └── TDSDeclarationModel.jsx
│   │   │   │   │   └── DeclarationPage.jsx
│   │   │   │   ├── Calculations
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── Tab0.jsx
│   │   │   │   │   │   └── Tab1.jsx
│   │   │   │   │   └── TDSCalculation.jsx
│   │   │   │   ├── DeclarationTable.jsx
│   │   │   │   ├── DeleteModel.jsx
│   │   │   │   ├── ProofModel.jsx
│   │   │   │   ├── Tab0
│   │   │   │   │   └── SalaryDetails.jsx
│   │   │   │   ├── Tab0.jsx
│   │   │   │   ├── Tab1.jsx
│   │   │   │   ├── Tab2.jsx
│   │   │   │   ├── Tab3.jsx
│   │   │   │   ├── Tab4
│   │   │   │   │   ├── Tab4.jsx
│   │   │   │   │   └── TDSTab5.jsx
│   │   │   │   ├── Table
│   │   │   │   │   ├── myDeclarations
│   │   │   │   │   │   └── TDSTable0.jsx
│   │   │   │   │   ├── Tab4Table
│   │   │   │   │   │   ├── TDSTable4Tab1.jsx
│   │   │   │   │   │   ├── TDSTable4Tab2.jsx
│   │   │   │   │   │   └── TDSTable4Tab3.jsx
│   │   │   │   │   ├── TDSTable1.jsx
│   │   │   │   │   ├── TDSTable2.jsx
│   │   │   │   │   └── TDSTable3.jsx
│   │   │   │   └── TDSTab1.jsx
│   │   │   ├── IncomeTax.jsx
│   │   │   └── IncomeTaxNotification.jsx
│   │   ├── Income-Tax
│   │   │   ├── accountant
│   │   │   │   ├── EmployeeTable.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── components
│   │   │   │   ├── CalculationComponent.jsx
│   │   │   │   ├── CreateModal.jsx
│   │   │   │   ├── DeleteInvestmentModal.jsx
│   │   │   │   ├── InvestmentTable.jsx
│   │   │   │   ├── InvestmentTableSkeleton.jsx
│   │   │   │   ├── RegimeModal.jsx
│   │   │   │   └── viewPDFModal.jsx
│   │   │   ├── data.js
│   │   │   ├── hooks
│   │   │   │   ├── mutations
│   │   │   │   │   ├── useChangeRegime.jsx
│   │   │   │   │   ├── useCreateDeclaration.jsx
│   │   │   │   │   └── useDeleteInvestment.jsx
│   │   │   │   ├── queries
│   │   │   │   │   ├── useGetInvestmentSection.jsx
│   │   │   │   │   ├── useGetSalaryByFY.jsx
│   │   │   │   │   └── useGetTdsbyEmployee.jsx
│   │   │   │   └── useFunctions.jsx
│   │   │   ├── page.jsx
│   │   │   └── tabs
│   │   │       ├── CalculationTab.jsx
│   │   │       └── InvestmentTab.jsx
│   │   ├── leave-notification
│   │   │   ├── LeaveAcceptModal.jsx
│   │   │   └── page.jsx
│   │   ├── LeaveRequisition
│   │   │   ├── components
│   │   │   │   ├── DeleteModal.jsx
│   │   │   │   ├── LeaveTabel.jsx
│   │   │   │   ├── LottieAnimatedCalender.jsx
│   │   │   │   ├── mapped-form.jsx
│   │   │   │   ├── SideBalenceTable.jsx
│   │   │   │   ├── SideLeaveTable.jsx
│   │   │   │   ├── skeletonComponent.jsx
│   │   │   │   └── summaryTable.jsx
│   │   │   ├── hooks
│   │   │   │   ├── useCreateLeaveRequest.jsx
│   │   │   │   ├── useCustomStates.jsx
│   │   │   │   ├── useDeleteLeave.jsx
│   │   │   │   └── useGetWeekends.jsx
│   │   │   ├── LeaveRequisition.jsx
│   │   │   └── Manager
│   │   │       ├── ManagementCalender.jsx
│   │   │       └── useManagerCalender.jsx
│   │   ├── LetterTypes
│   │   │   └── LetterSetup.jsx
│   │   ├── LiveData
│   │   │   └── LiveData.jsx
│   │   ├── LoanManagement
│   │   │   ├── LoanManagement.jsx
│   │   │   ├── LoanManagementPieChart.jsx
│   │   │   └── LoanManagementSkeleton.jsx
│   │   ├── LoanMgtNotified
│   │   │   ├── Component
│   │   │   │   ├── InputForm.jsx
│   │   │   │   └── LoanMgtCard.jsx
│   │   │   ├── LoanMgtApproval.jsx
│   │   │   ├── LoanMgtNotification.jsx
│   │   │   ├── LoanNotificationToEmp.jsx
│   │   │   ├── ViewDocumentModal.jsx
│   │   │   └── ViewLoanDataNotificaitonModal.jsx
│   │   ├── MissedPunchNotification
│   │   │   ├── Component
│   │   │   │   ├── InputForm.jsx
│   │   │   │   └── MissedPunchCard.jsx
│   │   │   ├── MissedPunchNotification.jsx
│   │   │   ├── MissedPunchNotificationToEmp.jsx
│   │   │   └── missedPunchNotified.jsx
│   │   ├── MissPunch
│   │   │   ├── MissPunchInOut.jsx
│   │   │   └── MissPunchJustify.jsx
│   │   ├── My-Training
│   │   │   ├── components
│   │   │   │   ├── card-loader.jsx
│   │   │   │   ├── card-training
│   │   │   │   │   └── useQuery.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── mini-form.jsx
│   │   │   │   ├── mini-form2.jsx
│   │   │   │   ├── my-training-zustand.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   └── training-card.jsx
│   │   │   ├── miniform
│   │   │   │   ├── page1
│   │   │   │   │   ├── mini-form.jsx
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   ├── training-card.jsx
│   │   │   │   │   └── use-query.jsx
│   │   │   │   ├── page2
│   │   │   │   │   ├── components
│   │   │   │   │   │   └── mini-form.jsx
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   ├── training-card.jsx
│   │   │   │   │   └── use-query-page2.jsx
│   │   │   │   ├── page3
│   │   │   │   │   ├── mini-form.jsx
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   ├── training-card.jsx
│   │   │   │   │   └── use-query-page3.jsx
│   │   │   │   ├── page4
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   ├── training-card.jsx
│   │   │   │   │   └── use-query-page3.jsx
│   │   │   │   └── text-filed.jsx
│   │   │   ├── my-training-use-query.jsx
│   │   │   └── page.jsx
│   │   ├── Notification
│   │   │   ├── Error.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── login.jsx
│   │   │   ├── notification.jsx
│   │   │   ├── Notified.jsx
│   │   │   └── useHook.js
│   │   ├── OrgList
│   │   │   ├── AssignModal.jsx
│   │   │   ├── AssignOrg.jsx
│   │   │   └── OrgList.jsx
│   │   ├── OvertimeSetup
│   │   │   └── OvertimeSetup.jsx
│   │   ├── Payment
│   │   │   └── page.jsx
│   │   ├── PayslipNotification
│   │   │   └── PayslipNotification.jsx
│   │   ├── peformance
│   │   │   ├── components
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Dashboard
│   │   │   │   │   ├── DashboardTable.jsx
│   │   │   │   │   ├── EmpGraph.jsx
│   │   │   │   │   └── Tabs
│   │   │   │   │       ├── DashboardCardTab.jsx
│   │   │   │   │       ├── GoalsTab.jsx
│   │   │   │   │       └── ReviewTab.jsx
│   │   │   │   ├── GoalTable
│   │   │   │   │   ├── DeleteGoal.jsx
│   │   │   │   │   ├── GoalsModel.jsx
│   │   │   │   │   ├── GoalsTable.jsx
│   │   │   │   │   ├── Modal
│   │   │   │   │   │   ├── DashboardModel.jsx
│   │   │   │   │   │   ├── MonitoringModel.jsx
│   │   │   │   │   │   ├── PreviewGoalModal.jsx
│   │   │   │   │   │   ├── Rate_Review_Model.jsx
│   │   │   │   │   │   ├── RatingModel.jsx
│   │   │   │   │   │   └── RevaluateModel.jsx
│   │   │   │   │   └── Skelton
│   │   │   │   │       ├── PreviewSkeleton.jsx
│   │   │   │   │       └── TabelSkeleton.jsx
│   │   │   │   ├── Message.jsx
│   │   │   │   ├── PerformanceTab.jsx
│   │   │   │   ├── Review
│   │   │   │   │   └── ReviewTable.jsx
│   │   │   │   └── TestTab.jsx
│   │   │   ├── Performance.jsx
│   │   │   └── Tabs
│   │   │       ├── GoalSettingTab.jsx
│   │   │       ├── PerformanceDashboard.jsx
│   │   │       ├── ReviewTab.jsx
│   │   │       └── SingleEmployeeTab.jsx
│   │   ├── punch-notification
│   │   │   └── page.jsx
│   │   ├── PunchDataSync
│   │   │   ├── EmpInfoByDynanimacally.jsx
│   │   │   ├── EmpInfoPunchStatus.jsx
│   │   │   ├── LiveSyncData.jsx
│   │   │   └── RendarPunchSyncFile.jsx
│   │   ├── Recruitment
│   │   │   ├── ApplyJob.jsx
│   │   │   ├── components
│   │   │   │   ├── EditTest1.jsx
│   │   │   │   ├── EditTest2.jsx
│   │   │   │   ├── EditTest3.jsx
│   │   │   │   ├── Form1.jsx
│   │   │   │   ├── Form2.jsx
│   │   │   │   ├── Form3.jsx
│   │   │   │   ├── Form4.jsx
│   │   │   │   ├── InputForm.jsx
│   │   │   │   ├── JobPositionApproval.jsx
│   │   │   │   ├── JobPositionCard.jsx
│   │   │   │   ├── Test1.jsx
│   │   │   │   ├── Test2.jsx
│   │   │   │   └── Test3.jsx
│   │   │   ├── CreateJobPosition.jsx
│   │   │   ├── EditJobPosition.jsx
│   │   │   ├── Notification
│   │   │   │   ├── JobNotificationToEmp.jsx
│   │   │   │   └── JobPositonNotificatinToMgr.jsx
│   │   │   ├── OpenRoleJobPosition.jsx
│   │   │   └── ViewJobPosition.jsx
│   │   ├── Remote-Punch-Info
│   │   │   ├── main-map.jsx
│   │   │   ├── Map-Container.jsx
│   │   │   └── RemoteManager.jsx
│   │   ├── Remote-Punching
│   │   │   ├── components
│   │   │   │   ├── MapComponent.jsx
│   │   │   │   ├── PhotoCaptureCamera.jsx
│   │   │   │   ├── PhotoCaptureForm.jsx
│   │   │   │   ├── StartRemotePunch.jsx
│   │   │   │   ├── StopRemotePunching.jsx
│   │   │   │   ├── useLocationMutation.jsx
│   │   │   │   └── useStartRemotePunch.jsx
│   │   │   └── EmployeeSideRemotePunching.jsx
│   │   ├── Remote-Punching-Employee
│   │   │   ├── AddRemotePunchingTask.jsx
│   │   │   ├── components
│   │   │   │   ├── AcceptRejectTaskModal.jsx
│   │   │   │   ├── AddDoneTaskModal.jsx
│   │   │   │   ├── AddVisitDetails.jsx
│   │   │   │   ├── GetAddedTask.jsx
│   │   │   │   ├── Map-Component.jsx
│   │   │   │   ├── modalForStatusShow.jsx
│   │   │   │   ├── RemotePunchingTaskForm.jsx
│   │   │   │   ├── ShowCompletetaskInMap.jsx
│   │   │   │   ├── speed-dial.jsx
│   │   │   │   ├── stop-remote-punching.jsx
│   │   │   │   └── TaskListEmployee.jsx
│   │   │   ├── page.jsx
│   │   │   └── useGetGeoFencing.jsx
│   │   ├── RemotePunchIn
│   │   │   ├── components
│   │   │   │   ├── mapped-form.jsx
│   │   │   │   ├── MissedTable.jsx
│   │   │   │   └── SummaryTable.jsx
│   │   │   └── MissedPunch.jsx
│   │   ├── ReportingMis
│   │   │   ├── components
│   │   │   │   ├── data.jsx
│   │   │   │   └── MiniForm.jsx
│   │   │   └── page.jsx
│   │   ├── ResetNewPassword
│   │   │   └── ResetNewPassword.jsx
│   │   ├── SalaryCalculate
│   │   │   ├── CalculateSalary.jsx
│   │   │   └── Component
│   │   │       └── DisplayCalSalData.jsx
│   │   ├── SalaryManagement
│   │   │   ├── components
│   │   │   │   └── ChallanModal.jsx
│   │   │   └── SalaryManagement.jsx
│   │   ├── Self-Onboarding
│   │   │   └── SelfOnboardingFromModal.jsx
│   │   ├── SelfLeaveNotification
│   │   │   ├── components
│   │   │   │   ├── employee-leave-card.jsx
│   │   │   │   ├── employee-leave-loader.jsx
│   │   │   │   └── input-form.jsx
│   │   │   ├── page.jsx
│   │   │   ├── useLeaveNotification.jsx
│   │   │   └── UseLeaveNotificationCout.jsx
│   │   ├── SelfShiftNotification
│   │   │   ├── components
│   │   │   │   ├── employee-shift-card.jsx
│   │   │   │   ├── employee-shift-loader.jsx
│   │   │   │   └── input-form.jsx
│   │   │   ├── page.jsx
│   │   │   ├── UseEmployeeShiftNotification.jsx
│   │   │   ├── useShiftNotification.jsx
│   │   │   └── useShiftNotificationCount.jsx
│   │   ├── SetUpOrganization
│   │   │   ├── components
│   │   │   │   ├── EmployeeTypeSkeleton.jsx
│   │   │   │   └── SetupSideBar.jsx
│   │   │   ├── EmoloyeeSalaryCalculate
│   │   │   │   └── EmployeeSalaryCalculate.jsx
│   │   │   ├── EmpCommunication
│   │   │   │   └── EmpCommunication.jsx
│   │   │   ├── EmployeeCodeGenerator
│   │   │   │   └── EmployeeCodeGenerator.jsx
│   │   │   ├── EmployeeLoanManagement
│   │   │   │   └── EmpLoanMgt.jsx
│   │   │   ├── EmployementType
│   │   │   │   └── EmployementTypes.jsx
│   │   │   ├── JobLevel
│   │   │   │   ├── Component
│   │   │   │   │   ├── AddJobLevelModal.jsx
│   │   │   │   │   └── EditJobLevelModal.jsx
│   │   │   │   └── JobLevel.jsx
│   │   │   ├── LeaveComponents
│   │   │   │   ├── components
│   │   │   │   │   ├── leave-type-layoutbox.jsx
│   │   │   │   │   └── skeleton-for-leavetype.jsx
│   │   │   │   ├── LeavePublicholidayModal.jsx
│   │   │   │   └── LeaveTypes.jsx
│   │   │   ├── Performance
│   │   │   │   └── PerformanceSetup.jsx
│   │   │   ├── PFESIC.jsx
│   │   │   ├── PublicHolidayPage
│   │   │   │   ├── components
│   │   │   │   │   ├── edit-mini-form.jsx
│   │   │   │   │   ├── holiday-row.jsx
│   │   │   │   │   ├── miniform.jsx
│   │   │   │   │   └── usePublicHoliday.jsx
│   │   │   │   ├── PublicHoliday.jsx
│   │   │   │   └── usePublicHoliday.jsx
│   │   │   ├── Remote
│   │   │   │   ├── components
│   │   │   │   │   └── mini-form.jsx
│   │   │   │   └── RemoteSetup.jsx
│   │   │   ├── Roles
│   │   │   │   └── AddRoles.jsx
│   │   │   ├── SaleryInput
│   │   │   │   ├── SalaryInput.jsx
│   │   │   │   └── SkeletonSalaryInput.jsx
│   │   │   ├── Setup.jsx
│   │   │   ├── Subscription
│   │   │   │   ├── components
│   │   │   │   │   ├── subscription-card.jsx
│   │   │   │   │   └── subscriptionRow.jsx
│   │   │   │   └── Subscription.jsx
│   │   │   └── Traning
│   │   │       ├── components
│   │   │       │   └── mini-form.jsx
│   │   │       └── Training.jsx
│   │   ├── SetupPage
│   │   │   ├── CompOff
│   │   │   │   └── CompOff.jsx
│   │   │   ├── DepartmentDeletion.jsx
│   │   │   ├── EmailSetting.jsx
│   │   │   ├── ExtraDay
│   │   │   │   └── ExtraDay.jsx
│   │   │   ├── inputfield.jsx
│   │   │   ├── Shift
│   │   │   │   ├── components
│   │   │   │   │   ├── shift-add-model.jsx
│   │   │   │   │   ├── shift-edit-model.jsx
│   │   │   │   │   └── shift-row.jsx
│   │   │   │   ├── hook
│   │   │   │   │   └── useShiftQuery.jsx
│   │   │   │   └── Page.jsx
│   │   │   ├── ShiftManagement
│   │   │   │   ├── components
│   │   │   │   │   ├── mapped-form.jsx
│   │   │   │   │   ├── ShiftsTable.jsx
│   │   │   │   │   └── SummaryTable.jsx
│   │   │   │   ├── SetupShift.jsx
│   │   │   │   ├── shiftAllowance.jsx
│   │   │   │   ├── store
│   │   │   │   │   └── useShiftStore.jsx
│   │   │   │   └── useShiftQuery.jsx
│   │   │   └── WeekendHoliday.jsx
│   │   ├── shift-notification
│   │   │   ├── page.jsx
│   │   │   └── ShiftAcceptModal.jsx
│   │   ├── SignIn
│   │   │   ├── RolePage.jsx
│   │   │   └── SignIn.jsx
│   │   ├── SignUp
│   │   │   ├── NewSignUp.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── useAuthentication.jsx
│   │   ├── single-department
│   │   │   └── single-department.jsx
│   │   ├── single-orgnisation
│   │   │   └── single-organisation.jsx
│   │   ├── Test
│   │   │   ├── EmployeeCom
│   │   │   │   ├── Test1 .jsx
│   │   │   │   ├── Test2.jsx
│   │   │   │   ├── Test3.jsx
│   │   │   │   └── Test4.jsx
│   │   │   ├── EmployeeTest.jsx
│   │   │   ├── RemoteEmployee
│   │   │   │   ├── components
│   │   │   │   │   ├── MappedForm.jsx
│   │   │   │   │   ├── MiniForm.jsx
│   │   │   │   │   ├── rightSide.jsx
│   │   │   │   │   └── UpdateForm.jsx
│   │   │   │   ├── page.jsx
│   │   │   │   └── state
│   │   │   │       └── zustand.jsx
│   │   │   ├── RemoteNotification.jsx
│   │   │   ├── ResendTimer.jsx
│   │   │   ├── test.jsx
│   │   │   ├── test2.jsx
│   │   │   ├── test3.jsx
│   │   │   ├── testMap.jsx
│   │   │   ├── testNaresh.jsx
│   │   │   ├── TestNotification.jsx
│   │   │   └── testYash.jsx
│   │   ├── Test2
│   │   │   ├── DepartmentComp
│   │   │   │   ├── Step1.jsx
│   │   │   │   ├── Step2.jsx
│   │   │   │   └── Step3.jsx
│   │   │   └── DepartmentTest.jsx
│   │   ├── Training
│   │   │   ├── components
│   │   │   │   ├── header.jsx
│   │   │   │   ├── mini-form.jsx
│   │   │   │   ├── stepper
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── mutation.jsx
│   │   │   │   │   │   ├── step1
│   │   │   │   │   │   │   └── page.jsx
│   │   │   │   │   │   ├── step2
│   │   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   │   └── step2-hook.jsx
│   │   │   │   │   │   ├── step3
│   │   │   │   │   │   │   └── page.jsx
│   │   │   │   │   │   └── zustand-store.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   └── zustand-store.jsx
│   │   │   ├── page.jsx
│   │   │   └── training-table
│   │   │       ├── components
│   │   │       │   ├── assign-training.jsx
│   │   │       │   ├── bottom.jsx
│   │   │       │   ├── header.jsx
│   │   │       │   ├── loading-skeleton.jsx
│   │   │       │   ├── mutation.jsx
│   │   │       │   ├── TableRow.jsx
│   │   │       │   └── useAssignTraining.jsx
│   │   │       └── page.jsx
│   │   ├── UserProfile
│   │   │   └── UserProfile.jsx
│   │   ├── ViewAttendanceBiomatric
│   │   │   └── ViewAttendacneBiomatric.jsx
│   │   ├── ViewCalculateAttendance
│   │   │   ├── MyToolbar.jsx
│   │   │   └── ViewCalculateAttendance.jsx
│   │   ├── ViewPayslip
│   │   │   └── ViewPayslip.jsx
│   │   └── Waiting-comp
│   │       ├── components
│   │       │   └── waiting.jsx
│   │       └── waiting-main.jsx
│   ├── reportWebVitals.js
│   ├── Route.jsx
│   ├── services
│   │   ├── api.js
│   │   ├── docManageS3.js
│   │   └── i18n.js
│   ├── setupTests.js
│   ├── State
│   │   ├── Function
│   │   │   └── Main.jsx
│   │   ├── Org
│   │   │   └── Org.jsx
│   │   ├── UseEffect
│   │   │   └── UseEffectContext.jsx
│   │   └── UseState
│   │       └── UseContext.jsx
│   ├── Test
│   │   └── OrgChart.jsx
│   └── utils
│       ├── AppAlert
│       │   └── AppAlert.jsx
│       ├── AppLoader
│       │   └── AppLoader.jsx
│       ├── Data
│       │   └── data.jsx
│       ├── Forbidden
│       │   ├── NotFound.jsx
│       │   └── UnAuthorized.jsx
│       ├── TopLoadingBar
│       │   └── TopLoadingBar.jsx
│       └── TopNav
│           └── TopNav.jsx
└── tailwind.config.js
