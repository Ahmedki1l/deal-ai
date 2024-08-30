"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Dictionary } from "@/types/locale";

const chartData = [
  {
    date: "2024-04-01",
    facebook: 222,
    instagram: 150,
    linkedin: 150,
    twitter: 150,
  },
  {
    date: "2024-04-02",
    facebook: 97,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-04-03",
    facebook: 167,
    instagram: 120,
    linkedin: 120,
    twitter: 120,
  },
  {
    date: "2024-04-04",
    facebook: 242,
    instagram: 260,
    linkedin: 260,
    twitter: 260,
  },
  {
    date: "2024-04-05",
    facebook: 373,
    instagram: 290,
    linkedin: 290,
    twitter: 290,
  },
  {
    date: "2024-04-06",
    facebook: 301,
    instagram: 340,
    linkedin: 340,
    twitter: 340,
  },
  {
    date: "2024-04-07",
    facebook: 245,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-04-08",
    facebook: 409,
    instagram: 320,
    linkedin: 320,
    twitter: 320,
  },
  {
    date: "2024-04-09",
    facebook: 59,
    instagram: 110,
    linkedin: 110,
    twitter: 110,
  },
  {
    date: "2024-04-10",
    facebook: 261,
    instagram: 190,
    linkedin: 190,
    twitter: 190,
  },
  {
    date: "2024-04-11",
    facebook: 327,
    instagram: 350,
    linkedin: 350,
    twitter: 350,
  },
  {
    date: "2024-04-12",
    facebook: 292,
    instagram: 210,
    linkedin: 210,
    twitter: 210,
  },
  {
    date: "2024-04-13",
    facebook: 342,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-04-14",
    facebook: 137,
    instagram: 220,
    linkedin: 220,
    twitter: 220,
  },
  {
    date: "2024-04-15",
    facebook: 120,
    instagram: 170,
    linkedin: 170,
    twitter: 170,
  },
  {
    date: "2024-04-16",
    facebook: 138,
    instagram: 190,
    linkedin: 190,
    twitter: 190,
  },
  {
    date: "2024-04-17",
    facebook: 446,
    instagram: 360,
    linkedin: 360,
    twitter: 360,
  },
  {
    date: "2024-04-18",
    facebook: 364,
    instagram: 410,
    linkedin: 410,
    twitter: 410,
  },
  {
    date: "2024-04-19",
    facebook: 243,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-04-20",
    facebook: 89,
    instagram: 150,
    linkedin: 150,
    twitter: 150,
  },
  {
    date: "2024-04-21",
    facebook: 137,
    instagram: 200,
    linkedin: 200,
    twitter: 200,
  },
  {
    date: "2024-04-22",
    facebook: 224,
    instagram: 170,
    linkedin: 170,
    twitter: 170,
  },
  {
    date: "2024-04-23",
    facebook: 138,
    instagram: 230,
    linkedin: 230,
    twitter: 230,
  },
  {
    date: "2024-04-24",
    facebook: 387,
    instagram: 290,
    linkedin: 290,
    twitter: 290,
  },
  {
    date: "2024-04-25",
    facebook: 215,
    instagram: 250,
    linkedin: 250,
    twitter: 250,
  },
  {
    date: "2024-04-26",
    facebook: 75,
    instagram: 130,
    linkedin: 130,
    twitter: 130,
  },
  {
    date: "2024-04-27",
    facebook: 383,
    instagram: 420,
    linkedin: 420,
    twitter: 420,
  },
  {
    date: "2024-04-28",
    facebook: 122,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-04-29",
    facebook: 315,
    instagram: 240,
    linkedin: 240,
    twitter: 240,
  },
  {
    date: "2024-04-30",
    facebook: 454,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-05-01",
    facebook: 165,
    instagram: 220,
    linkedin: 220,
    twitter: 220,
  },
  {
    date: "2024-05-02",
    facebook: 293,
    instagram: 310,
    linkedin: 310,
    twitter: 310,
  },
  {
    date: "2024-05-03",
    facebook: 247,
    instagram: 190,
    linkedin: 190,
    twitter: 190,
  },
  {
    date: "2024-05-04",
    facebook: 385,
    instagram: 420,
    linkedin: 420,
    twitter: 420,
  },
  {
    date: "2024-05-05",
    facebook: 481,
    instagram: 390,
    linkedin: 390,
    twitter: 390,
  },
  {
    date: "2024-05-06",
    facebook: 498,
    instagram: 520,
    linkedin: 520,
    twitter: 520,
  },
  {
    date: "2024-05-07",
    facebook: 388,
    instagram: 300,
    linkedin: 300,
    twitter: 300,
  },
  {
    date: "2024-05-08",
    facebook: 149,
    instagram: 210,
    linkedin: 210,
    twitter: 210,
  },
  {
    date: "2024-05-09",
    facebook: 227,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-05-10",
    facebook: 293,
    instagram: 330,
    linkedin: 330,
    twitter: 330,
  },
  {
    date: "2024-05-11",
    facebook: 335,
    instagram: 270,
    linkedin: 270,
    twitter: 270,
  },
  {
    date: "2024-05-12",
    facebook: 197,
    instagram: 240,
    linkedin: 240,
    twitter: 240,
  },
  {
    date: "2024-05-13",
    facebook: 197,
    instagram: 160,
    linkedin: 160,
    twitter: 160,
  },
  {
    date: "2024-05-14",
    facebook: 448,
    instagram: 490,
    linkedin: 490,
    twitter: 490,
  },
  {
    date: "2024-05-15",
    facebook: 473,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-05-16",
    facebook: 338,
    instagram: 400,
    linkedin: 400,
    twitter: 400,
  },
  {
    date: "2024-05-17",
    facebook: 499,
    instagram: 420,
    linkedin: 420,
    twitter: 420,
  },
  {
    date: "2024-05-18",
    facebook: 315,
    instagram: 350,
    linkedin: 350,
    twitter: 350,
  },
  {
    date: "2024-05-19",
    facebook: 235,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-05-20",
    facebook: 177,
    instagram: 230,
    linkedin: 230,
    twitter: 230,
  },
  {
    date: "2024-05-21",
    facebook: 82,
    instagram: 140,
    linkedin: 140,
    twitter: 140,
  },
  {
    date: "2024-05-22",
    facebook: 81,
    instagram: 120,
    linkedin: 120,
    twitter: 120,
  },
  {
    date: "2024-05-23",
    facebook: 252,
    instagram: 290,
    linkedin: 290,
    twitter: 290,
  },
  {
    date: "2024-05-24",
    facebook: 294,
    instagram: 220,
    linkedin: 220,
    twitter: 220,
  },
  {
    date: "2024-05-25",
    facebook: 201,
    instagram: 250,
    linkedin: 250,
    twitter: 250,
  },
  {
    date: "2024-05-26",
    facebook: 213,
    instagram: 170,
    linkedin: 170,
    twitter: 170,
  },
  {
    date: "2024-05-27",
    facebook: 420,
    instagram: 460,
    linkedin: 460,
    twitter: 460,
  },
  {
    date: "2024-05-28",
    facebook: 233,
    instagram: 190,
    linkedin: 190,
    twitter: 190,
  },
  {
    date: "2024-05-29",
    facebook: 78,
    instagram: 130,
    linkedin: 130,
    twitter: 130,
  },
  {
    date: "2024-05-30",
    facebook: 340,
    instagram: 280,
    linkedin: 280,
    twitter: 280,
  },
  {
    date: "2024-05-31",
    facebook: 178,
    instagram: 230,
    linkedin: 230,
    twitter: 230,
  },
  {
    date: "2024-06-01",
    facebook: 178,
    instagram: 200,
    linkedin: 200,
    twitter: 200,
  },
  {
    date: "2024-06-02",
    facebook: 470,
    instagram: 410,
    linkedin: 410,
    twitter: 410,
  },
  {
    date: "2024-06-03",
    facebook: 103,
    instagram: 160,
    linkedin: 160,
    twitter: 160,
  },
  {
    date: "2024-06-04",
    facebook: 439,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-06-05",
    facebook: 88,
    instagram: 140,
    linkedin: 140,
    twitter: 140,
  },
  {
    date: "2024-06-06",
    facebook: 294,
    instagram: 250,
    linkedin: 250,
    twitter: 250,
  },
  {
    date: "2024-06-07",
    facebook: 323,
    instagram: 370,
    linkedin: 370,
    twitter: 370,
  },
  {
    date: "2024-06-08",
    facebook: 385,
    instagram: 320,
    linkedin: 320,
    twitter: 320,
  },
  {
    date: "2024-06-09",
    facebook: 438,
    instagram: 480,
    linkedin: 480,
    twitter: 480,
  },
  {
    date: "2024-06-10",
    facebook: 155,
    instagram: 200,
    linkedin: 200,
    twitter: 200,
  },
  {
    date: "2024-06-11",
    facebook: 92,
    instagram: 150,
    linkedin: 150,
    twitter: 150,
  },
  {
    date: "2024-06-12",
    facebook: 492,
    instagram: 420,
    linkedin: 420,
    twitter: 420,
  },
  {
    date: "2024-06-13",
    facebook: 81,
    instagram: 130,
    linkedin: 130,
    twitter: 130,
  },
  {
    date: "2024-06-14",
    facebook: 426,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-06-15",
    facebook: 307,
    instagram: 350,
    linkedin: 350,
    twitter: 350,
  },
  {
    date: "2024-06-16",
    facebook: 371,
    instagram: 310,
    linkedin: 310,
    twitter: 310,
  },
  {
    date: "2024-06-17",
    facebook: 475,
    instagram: 520,
    linkedin: 520,
    twitter: 520,
  },
  {
    date: "2024-06-18",
    facebook: 107,
    instagram: 170,
    linkedin: 170,
    twitter: 170,
  },
  {
    date: "2024-06-19",
    facebook: 341,
    instagram: 290,
    linkedin: 290,
    twitter: 290,
  },
  {
    date: "2024-06-20",
    facebook: 408,
    instagram: 450,
    linkedin: 450,
    twitter: 450,
  },
  {
    date: "2024-06-21",
    facebook: 169,
    instagram: 210,
    linkedin: 210,
    twitter: 210,
  },
  {
    date: "2024-06-22",
    facebook: 317,
    instagram: 270,
    linkedin: 270,
    twitter: 270,
  },
  {
    date: "2024-06-23",
    facebook: 480,
    instagram: 530,
    linkedin: 530,
    twitter: 530,
  },
  {
    date: "2024-06-24",
    facebook: 132,
    instagram: 180,
    linkedin: 180,
    twitter: 180,
  },
  {
    date: "2024-06-25",
    facebook: 141,
    instagram: 190,
    linkedin: 190,
    twitter: 190,
  },
  {
    date: "2024-06-26",
    facebook: 434,
    instagram: 380,
    linkedin: 380,
    twitter: 380,
  },
  {
    date: "2024-06-27",
    facebook: 448,
    instagram: 490,
    linkedin: 490,
    twitter: 490,
  },
  {
    date: "2024-06-28",
    facebook: 149,
    instagram: 200,
    linkedin: 200,
    twitter: 200,
  },
  {
    date: "2024-06-29",
    facebook: 103,
    instagram: 160,
    linkedin: 160,
    twitter: 160,
  },
  {
    date: "2024-06-30",
    facebook: 446,
    instagram: 400,
    linkedin: 400,
    twitter: 400,
  },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-1))",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-2))",
  },
  linkedin: {
    label: "LinkedIn",
    color: "hsl(var(--chart-5))",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type DashboardPostsBarChartProps = {} & Dictionary["dashboard-posts-bar-chart"];
export function DashboardPostsBarChart({
  dic: { "dashboard-posts-bar-chart": c },
}: DashboardPostsBarChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("facebook");

  const total = React.useMemo(
    () => ({
      facebook: chartData.reduce((acc, curr) => acc + curr.facebook, 0),
      instagram: chartData.reduce((acc, curr) => acc + curr.instagram, 0),
      linkedin: chartData.reduce((acc, curr) => acc + curr.linkedin, 0),
      twitter: chartData.reduce((acc, curr) => acc + curr.twitter, 0),
    }),
    [],
  );

  return (
    <div className="rounded-none border-none">
      {/* <div className="grid grid-cols-3 gap-10">
        <DashboardPostsBarChart />
        <DashboardPostsBarChart />
        <DashboardPostsBarChart />
      </div> */}
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{c?.["posts"]}</CardTitle>
          <CardDescription>
            {c?.["showing total posts for the last 3 months."]}
          </CardDescription>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {["facebook", "instagram", "linkedin", "twitter"].map((key) => {
            const chart = key as keyof typeof chartConfig;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {c?.[chart]}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total?.[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
