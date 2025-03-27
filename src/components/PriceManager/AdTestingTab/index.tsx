import React, { useEffect, useState } from 'react';
import { Plus, Calculator } from 'lucide-react';
import { DaySection } from './components/DaySection';
import { DayData, NetworkMetrics } from './types';
import { calculateAverageMetrics } from './utils';
import { NETWORKS, NETWORK_COLORS, DEFAULT_NETWORK_METRICS } from './constants';
import { getAllDays } from '@/services/firebase';

export function AdTestingTab({ productId }: { productId: string }) {
  const DEFAULT_NETWORK_METRICS = {
    cpm: 0,
    cpc: 0,
    ctr: 0,
    budget: 0,
    impressions: 0,
    clicks: 0,
    leads: 0,
  };
  const [getStoredDays, setGetStoredDays] = useState([]);
  const [daysFetchLoading, setdaysFetchLoading] = useState(false);

  const [days, setDays] = useState<DayData[]>([
    {
      id: '1',
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes: '',
      networks: NETWORKS.reduce(
        (acc, network) => ({
          ...acc,
          [network]: {
            isActive: false,
            metrics: { ...DEFAULT_NETWORK_METRICS },
            notes: '',
          },
        }),
        {}
      ),
    },
  ]);
  const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    return new Date(timestamp.seconds * 1000);
  };

  useEffect(() => {
    const fetchDays = async () => {
      try {
        setdaysFetchLoading(true);
        const days = await getAllDays(productId);
        setGetStoredDays(days);
      } catch (error) {
        console.error('days not fetch err:', error);
      } finally {
        setdaysFetchLoading(false);
      }
    };
    fetchDays();
  }, [setDays]);

  // pre polating her
  useEffect(() => {
    const mappedDays = getStoredDays?.map(item => ({
      id: item.id,
      date: timestampToDate(item.date),

      time: item.time,
      notes: item.notes,
      networks: NETWORKS.reduce((acc, network) => {
        const networkData = item.networks[network] || {
          isActive: false,
          metrics: DEFAULT_NETWORK_METRICS,
          notes: '',
        };
        return {
          ...acc,
          [network]: {
            isActive: networkData.isActive,
            metrics: networkData.metrics,
            notes: networkData.notes,
          },
        };
      }, {}),
    }));

    setDays(mappedDays);
  }, [getStoredDays]);

  const handleAddDay = () => {
    setDays(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        date: new Date(),
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        notes: '',
        networks: NETWORKS.reduce(
          (acc, network) => ({
            ...acc,
            [network]: {
              isActive: false,
              metrics: { ...DEFAULT_NETWORK_METRICS },
              notes: '',
            },
          }),
          {}
        ),
      },
    ]);
  };

  const handleDateChange = (dayId: string, date: Date) => {
    setDays(prev => prev.map(day => (day.id === dayId ? { ...day, date } : day)));
  };

  const handleTimeChange = (dayId: string, time: string) => {
    setDays(prev => prev.map(day => (day.id === dayId ? { ...day, time } : day)));
  };

  const handleNotesChange = (dayId: string, notes: string) => {
    setDays(prev => prev.map(day => (day.id === dayId ? { ...day, notes } : day)));
  };

  const handleNetworkNotesChange = (dayId: string, network: string, notes: string) => {
    setDays(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            networks: {
              ...day.networks,
              [network]: {
                ...day.networks[network],
                notes,
              },
            },
          };
        }
        return day;
      })
    );
  };

  const handleNetworkToggle = (dayId: string, network: string) => {
    setDays(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            networks: {
              ...day.networks,
              [network]: {
                ...day.networks[network],
                isActive: !day.networks[network].isActive,
              },
            },
          };
        }
        return day;
      })
    );
  };

  const handleMetricsChange = (
    dayId: string,
    network: string,
    updates: Partial<NetworkMetrics>
  ) => {
    setDays(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            networks: {
              ...day.networks,
              [network]: {
                ...day.networks[network],
                metrics: {
                  ...day.networks[network].metrics,
                  ...updates,
                },
              },
            },
          };
        }
        return day;
      })
    );
  };
  // const handleAddDay = () => {
  //   setDays(prev => [
  //     ...prev,
  //     {
  //       id: (prev.length + 1).toString(),
  //       date: new Date(),
  //       time: new Date().toLocaleTimeString('en-US', {
  //         hour12: false,
  //         hour: '2-digit',
  //         minute: '2-digit',
  //       }),
  //       notes: '',
  //       networks: NETWORKS.reduce(
  //         (acc, network) => ({
  //           ...acc,
  //           [network]: {
  //             isActive: false,
  //             metrics: { ...DEFAULT_NETWORK_METRICS },
  //             notes: '',
  //           },
  //         }),
  //         {}
  //       ),
  //     },
  //   ]);
  // };

  // const handleDateChange = (dayId: string, date: Date) => {
  //   setDays(prev => prev.map(day => (day.id === dayId ? { ...day, date } : day)));
  // };

  // const handleTimeChange = (dayId: string, time: string) => {
  //   setDays(prev => prev.map(day => (day.id === dayId ? { ...day, time } : day)));
  // };

  // const handleNotesChange = (dayId: string, notes: string) => {
  //   setDays(prev => prev.map(day => (day.id === dayId ? { ...day, notes } : day)));
  // };

  // const handleNetworkNotesChange = (dayId: string, network: string, notes: string) => {
  //   setDays(prev =>
  //     prev.map(day => {
  //       if (day.id === dayId) {
  //         return {
  //           ...day,
  //           networks: {
  //             ...day.networks,
  //             [network]: {
  //               ...day.networks[network],
  //               notes,
  //             },
  //           },
  //         };
  //       }
  //       return day;
  //     })
  //   );
  // };

  // const handleNetworkToggle = (dayId: string, network: string) => {
  //   setDays(prev =>
  //     prev.map(day => {
  //       if (day.id === dayId) {
  //         return {
  //           ...day,
  //           networks: {
  //             ...day.networks,
  //             [network]: {
  //               ...day.networks[network],
  //               isActive: !day.networks[network].isActive,
  //             },
  //           },
  //         };
  //       }
  //       return day;
  //     })
  //   );
  // };

  // const handleMetricsChange = (
  //   dayId: string,
  //   network: string,
  //   updates: Partial<NetworkMetrics>
  // ) => {
  //   setDays(prev =>
  //     prev.map(day => {
  //       if (day.id === dayId) {
  //         return {
  //           ...day,
  //           networks: {
  //             ...day.networks,
  //             [network]: {
  //               ...day.networks[network],
  //               metrics: {
  //                 ...day.networks[network].metrics,
  //                 ...updates,
  //               },
  //             },
  //           },
  //         };
  //       }
  //       return day;
  //     })
  //   );
  // };

  // const handleUpdateDay = (dayId: string, updates: Partial<DailyMetrics>) => {
  //   updateDay(dayId, updates);
  // };

  // const handleDeleteDay = (dayId: string) => {
  //   // Prevent deleting if only one day remains
  //   if (days.length > 1) {
  //     deleteDay(dayId);

  //     // Reorder remaining days
  //     const updatedDays = days
  //       .filter(d => d.id !== dayId)
  //       .map((d, index) => ({
  //         ...d,
  //         day: index + 1,
  //       }));

  //     // Update each day with new order
  //     updatedDays.forEach(day => {
  //       updateDay(day.id, { day: day.day });
  //     });
  //   } else {
  //     // Show error or notification that at least one day is required
  //     console.warn('Cannot delete the last remaining day');
  //   }
  // };

  const averageMetrics = calculateAverageMetrics(days);

  const calculateTotalBudgetsAndLeads = days => {
    // Initialize totals
    let totalBudget = 0;
    let totalLeads = 0;

    // Iterate through all days
    days.forEach(day => {
      Object.values(day.networks).forEach((network: any) => {
        if (network.isActive && network.metrics) {
          // Add budget and leads to totals
          totalBudget += network.metrics.budget || 0;
          totalLeads += network.metrics.leads || 0;
        }
      });
    });

    return { totalBudget, totalLeads };
  };

  const { totalBudget, totalLeads } = calculateTotalBudgetsAndLeads(days);

  // Output the total sums

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Average CPL</h3>
          <p className="text-3xl font-bold">${averageMetrics.cpl.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Average CTR</h3>
          <p className="text-3xl font-bold">{averageMetrics.ctr.toFixed(2)}%</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Total Leads</h3>
          <p className="text-3xl font-bold">{totalLeads.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Total Spend</h3>
          <p className="text-3xl font-bold">${totalBudget.toFixed(2)}</p>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-4">
        {daysFetchLoading ? (
          <div className="w-full flex items-center justify-center px-7 text-purple-600 text-[22px] text-center">
            Data Loading
          </div>
        ) : (
          <>
            {days.map(day => (
              <DaySection
                key={day.id}
                day={day}
                onDateChange={date => handleDateChange(day.id, date)}
                onTimeChange={time => handleTimeChange(day.id, time)}
                onNetworkToggle={network => handleNetworkToggle(day.id, network)}
                onMetricsChange={(network, updates) =>
                  handleMetricsChange(day.id, network, updates)
                }
                onNotesChange={notes => handleNotesChange(day.id, notes)}
                onNetworkNotesChange={(network, notes) =>
                  handleNetworkNotesChange(day.id, network, notes)
                }
                productId={productId}
              />
            ))}
          </>
        )}
      </div>

      {/* Add Day Button */}
      <button
        onClick={handleAddDay}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Test Day
      </button>
    </div>
  );
}
