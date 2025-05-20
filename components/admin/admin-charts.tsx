"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

// Map institution types to Russian labels
const typeLabels: Record<string, string> = {
  kindergarten: "Детские сады",
  school: "Школы",
  college: "Колледжи",
}

// Map status to Russian labels
const statusLabels: Record<string, string> = {
  pending: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
}

// Bar Chart for applications by institution type
export function BarChart({ data }: { data: any[] }) {
  // Format data for chart
  const labels = data.map((item) => typeLabels[item._id] || item._id)
  const values = data.map((item) => item.count)

  const chartData = {
    labels,
    datasets: [
      {
        label: "Количество заявок",
        data: values,
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return <Bar data={chartData} options={options} height={300} />
}

// Line Chart for applications over time
export function LineChart({ data }: { data: any[] }) {
  // Process data to group by date and status
  const dateMap = new Map()

  // Initialize with all dates for the last 30 days
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    dateMap.set(dateStr, {
      pending: 0,
      approved: 0,
      rejected: 0,
    })
  }

  // Fill in actual data
  data.forEach((item) => {
    const date = item._id.date
    const status = item._id.status
    const count = item.count

    if (dateMap.has(date)) {
      const statusCounts = dateMap.get(date)
      statusCounts[status] = count
    }
  })

  // Convert to arrays for chart
  const dates = Array.from(dateMap.keys())
  const pendingCounts = dates.map((date) => dateMap.get(date).pending)
  const approvedCounts = dates.map((date) => dateMap.get(date).approved)
  const rejectedCounts = dates.map((date) => dateMap.get(date).rejected)

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "На рассмотрении",
        data: pendingCounts,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        tension: 0.1,
      },
      {
        label: "Одобрено",
        data: approvedCounts,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Отклонено",
        data: rejectedCounts,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return <Line data={chartData} options={options} height={300} />
}

// Pie Chart for status distribution
export function PieChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return <Pie data={chartData} options={options} />
}
