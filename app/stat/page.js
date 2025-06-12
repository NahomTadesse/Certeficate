"use client";
import { useEffect, useState } from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import {
  Center,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Text,
  Loader,
  Select,
} from "@mantine/core";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { StatsGrid } from "./statGrid";

const icons = { up: IconArrowUpRight, down: IconArrowDownRight };

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function StatsDashboard() {
  const [summary, setSummary] = useState({
    monthly: { children: 0, fathers: 0, families: 0, churches: 0 },
    yearly: { children: 0, fathers: 0, families: 0, churches: 0 },
    trend: { children: "up", fathers: "up", families: "up", churches: "down" },
  });

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  });

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      try {
        const query = viewMode === "monthly"
          ? `?month=${selectedMonth}&year=${selectedYear}`
          : `?year=${selectedYear}`;
        const res = await fetch(`https://hall-api.hohitebirhan.com/api/v1/overview/summary${query}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error loading summary:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [viewMode, selectedMonth, selectedYear]);

  const stats = ["children", "fathers", "families", "churches"].map((key) => {
    const Icon = icons[summary.trend[key]];
    const colorMap = {
      children: "teal",
      fathers: "blue",
      families: "purple",
      churches: "orange",
    };
    const labelMap = {
      children: "Children",
      fathers: "Fathers",
      families: "Families",
      churches: "Churches",
    };

    return (
      <Paper withBorder radius="md" p="xs" key={key}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: colorMap[key] }]}
            label={
              <Center>
                <Icon size={20} stroke={1.5} />
              </Center>
            }
          />
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {labelMap[key]}
            </Text>
            <Text fw={700} size="xl">
              {loading ? <Loader size="xs" /> : summary[viewMode][key]}
            </Text>
            <Text size="xs" color="dimmed">{viewMode === "monthly" ? "Monthly" : "Yearly"}</Text>
          </div>
        </Group>
      </Paper>
    );
  });

  const chartData = {
    labels: ["Children", "Fathers", "Families", "Churches"],
    datasets: [
      {
        label: viewMode.charAt(0).toUpperCase() + viewMode.slice(1),
        data: [
          summary[viewMode].children,
          summary[viewMode].fathers,
          summary[viewMode].families,
          summary[viewMode].churches,
        ],
        borderColor: viewMode === "monthly" ? "rgb(75, 192, 192)" : "rgb(255, 159, 64)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Group position="center" mt="md" mb="md">
        <Select
          label="View Mode"
          value={viewMode}
          onChange={(val) => setViewMode(val)}
          data={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
        />
        {viewMode === "monthly" && (
          <Select
            label="Month"
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val)}
            data={monthOptions}
          />
        )}
        <Select
          label="Year"
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
          data={yearOptions}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="md" mx="md">
        {stats}
      </SimpleGrid>

      <StatsGrid summary={summary} loading={loading} />

      <div style={{ width: "90%", height: 300, margin: "40px auto" }}>
        {loading ? (
          <Center style={{ height: 300 }}><Loader /></Center>
        ) : (
          <Line
            data={chartData}
            options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
          />
        )}
      </div>
    </div>
  );
}
