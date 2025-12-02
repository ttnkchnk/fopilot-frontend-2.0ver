// DeclarationPrintView.tsx
import React, { forwardRef } from "react";

interface DeclarationPrintViewProps {
  fullName: string;
  taxId: string;
  year: number;
  quarter: number;
  totalIncome: number;
  singleTax: number;
  esv: number;
}

export const DeclarationPrintView = forwardRef<HTMLDivElement, DeclarationPrintViewProps>(
  ({ fullName, taxId, year, quarter, totalIncome, singleTax, esv }, ref) => {
    const quarterText = ["", "I", "II", "III", "IV"][quarter];

    return (
      <div
        ref={ref}
        className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-8 text-[10pt] border border-gray-400"
      >
        <h1 className="text-center font-bold text-sm mb-2">
          Податкова декларація платника єдиного податку третьої групи (фізична особа-підприємець)
        </h1>

        {/* Розділ I */}
        <h2 className="font-semibold mt-4 mb-1 text-xs">I. Загальні відомості</h2>

        <div className="space-y-1 text-[9pt]">
          <div>
            <span className="font-semibold">1. Прізвище, ім'я, по батькові: </span>
            <span>{fullName}</span>
          </div>
          <div>
            <span className="font-semibold">2. Реєстраційний номер облікової картки платника податків: </span>
            <span>{taxId}</span>
          </div>
          <div>
            <span className="font-semibold">3. Звітний (податковий) період: </span>
            <span>{quarterText} квартал {year} року</span>
          </div>
        </div>

        {/* Розділ II */}
        <h2 className="font-semibold mt-4 mb-1 text-xs">II. Дохід, що підлягає оподаткуванню</h2>
        <table className="w-full border border-black border-collapse text-[9pt]">
          <thead>
            <tr>
              <th className="border border-black px-1 py-0.5 w-2/3 text-left">Показник</th>
              <th className="border border-black px-1 py-0.5 w-1/3 text-right">Сума, грн</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-1 py-0.5">
                1. Сума доходу за податковий (звітний) період
              </td>
              <td className="border border-black px-1 py-0.5 text-right">
                {totalIncome.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Розділ III */}
        <h2 className="font-semibold mt-4 mb-1 text-xs">III. Розрахунок податкових зобов'язань з єдиного податку</h2>
        <table className="w-full border border-black border-collapse text-[9pt]">
          <tbody>
            <tr>
              <td className="border border-black px-1 py-0.5 w-2/3">
                20. Ставка єдиного податку (%)
              </td>
              <td className="border border-black px-1 py-0.5 text-right">
                5
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5">
                21. Сума нарахованого єдиного податку
              </td>
              <td className="border border-black px-1 py-0.5 text-right">
                {singleTax.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5">
                30. ЄСВ за себе
              </td>
              <td className="border border-black px-1 py-0.5 text-right">
                {esv.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5">
                40. Загальна сума до сплати
              </td>
              <td className="border border-black px-1 py-0.5 text-right">
                {(singleTax + esv).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Підпис */}
        <div className="mt-8 text-[9pt]">
          <div>«___» __________ {year} р.</div>
          <div className="mt-2">
            Платник податку / уповноважена особа: ______________________ ({fullName})
          </div>
        </div>
      </div>
    );
  }
);
