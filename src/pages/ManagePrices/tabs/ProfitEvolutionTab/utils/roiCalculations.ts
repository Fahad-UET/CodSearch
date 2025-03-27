export interface RoiData {
  date: string;
  investment: number;
  revenue: number;
  roi: number;
}

export function calculateRoi(revenue: number, investment: number): number {
  if (investment === 0) return 0;
  return (revenue - investment) / investment;
}

export function formatRoiPercentage(roi: number): string {
  return `${(roi * 100).toFixed(2)}%`;
}

export async function fetchRoiData(): Promise<RoiData[]> {
  // TODO: Replace with actual API call
  return [
    {
      date: '2024-01',
      investment: 1000,
      revenue: 1500,
      roi: 0.5
    },
    {
      date: '2024-02',
      investment: 1200,
      revenue: 2000,
      roi: 0.67
    },
    {
      date: '2024-03',
      investment: 1500,
      revenue: 3000,
      roi: 1
    }
  ];
}