import { CircularProgress } from "@mui/material";
import React from "react";
import UserProfile from "../../../hooks/UserData/useUser";
import CalculationComponent from "../components/CalculationComponent";
import useGetTdsbyEmployee from "../hooks/queries/useGetTdsbyEmployee";

const CalculationTab = () => {
  const empId = UserProfile()?.getCurrentUser()?._id;

  const { tdsForEmployee, isFetching } = useGetTdsbyEmployee(
    empId,
    "2024-2025"
  );

  let salaryComponents = [
    {
      name: "Gross Salary",
      sectionname: "Salary",
      amountAccepted: isNaN(
        Number(tdsForEmployee?.salary) -
          Number(tdsForEmployee?.salaryDeclaration)
      )
        ? 0
        : Number(tdsForEmployee?.salary) -
          Number(tdsForEmployee?.salaryDeclaration),
    },
    ...(tdsForEmployee?.investment ?? []),
  ];

  return (
    <section>
      <headers className="flex items-center justify-between ">
        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Calculation</h2>
            <p class="text-sm text-muted-foreground">
              Here you can get you tax calculation
            </p>
          </div>
        </div>
      </headers>
      <article className=" mt-4 rounded-md">
        {isFetching ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <>
            <article className="bg-white border rounded-md">
              <CalculationComponent
                investments={salaryComponents}
                section="Salary"
                amount={tdsForEmployee?.salary ?? 0}
                heading={"Salary components"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="House"
                amount={tdsForEmployee?.houseDeclaration ?? 0}
                heading={"Income From House Property"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="Otherincome"
                amount={tdsForEmployee?.otherDeclaration ?? 0}
                heading={"Income From Other Sources"}
              />
              <CalculationComponent
                investments={tdsForEmployee?.investment}
                section="SectionDeduction"
                amount={tdsForEmployee?.sectionDeclaration ?? 0}
                heading={"Less : Deduction under chapter VI A"}
              />

              <div className="flex w-full  gap-2 py-3 px-4  justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Taxable Income
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  RS {tdsForEmployee?.totalTaxableIncome ?? 0}
                </h1>
              </div>

              <div className="flex w-full  gap-2 py-3 px-4  justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Cess
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  RS {tdsForEmployee?.cess ?? 0}
                </h1>
              </div>

              <div className="flex w-full bg-blue-100   gap-2 p-4 justify-between">
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  Tax Amount
                </h1>
                <h1 className="text-lg font-bold text-gray-700 leading-none">
                  RS {tdsForEmployee?.regularTaxAmount ?? 0}
                </h1>
              </div>
            </article>
          </>
        )}
      </article>
    </section>
  );
};

export default CalculationTab;
