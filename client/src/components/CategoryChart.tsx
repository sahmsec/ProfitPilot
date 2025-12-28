import { Card } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  amount: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  title: string;
  type: "income" | "expense";
  currencySymbol?: string;
}

export default function CategoryChart({ data, title, type, currencySymbol = "$" }: CategoryChartProps) {
  const colors = [
    "hsl(220, 85%, 55%)",
    "hsl(142, 76%, 45%)",
    "hsl(280, 70%, 55%)",
    "hsl(35, 85%, 55%)",
    "hsl(0, 72%, 55%)",
    "hsl(190, 85%, 55%)",
  ];

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${currencySymbol}${value.toLocaleString()}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${currencySymbol}${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-6" data-testid={`card-category-chart-${type}`}>
      <h2 className="text-xl font-semibold mb-6" data-testid={`text-chart-title-${type}`}>
        {title}
      </h2>
      <div className="relative" style={{ height: "300px" }}>
        <Doughnut data={chartData} options={options} />
        <div className="absolute top-1/2 left-[30%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold tabular-nums break-all" data-testid={`text-total-${type}`}>
            {currencySymbol}{total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </Card>
  );
}
