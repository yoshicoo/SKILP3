"use client";

import dynamic from "next/dynamic";

const SalaryChartDynamic = dynamic(() => import("./salary/SalaryChartInner"), { ssr: false });

export default function SalaryChart({ data }: { data: { stage: string; value: number }[] }) {
  return (
    <div className="w-full h-64">
      <SalaryChartDynamic data={data} />
    </div>
  );
}
