"use client";

import dynamic from "next/dynamic";

const RadarChartDynamic = dynamic(() => import("./radar/RadarInner"), { ssr: false });

export default function SkillRadar({ data }: { data: { subject: string; A: number; fullMark: number }[] }) {
  return (
    <div className="w-full h-64">
      <RadarChartDynamic data={data} />
    </div>
  );
}