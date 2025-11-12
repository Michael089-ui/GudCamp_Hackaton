import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { CropType, PlanType } from '../../types';

const COLORS = ['#86c391', '#b8aea1', '#d7eccc', '#6db3d6'];

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="font-bold text-lg text-slate-800 mb-4 font-heading">{title}</h3>
    <div className="h-96">{children}</div>
  </div>
);


const AnalyticsPage: React.FC = () => {
    const { credits, users } = useData();

    const creditAmountByCropData = useMemo(() => {
        const data = new Map<CropType, number>();
        credits.forEach(credit => {
            const currentAmount = data.get(credit.cropType) || 0;
            data.set(credit.cropType, currentAmount + credit.amount);
        });
        return Array.from(data.entries()).map(([name, value]) => ({ name, value }));
    }, [credits]);
    
    const avgCreditByLocationData = useMemo(() => {
        const locationData = new Map<string, { totalAmount: number; count: number }>();
        const userLocationMap = new Map<string, string>();
        
        users.forEach(u => {
            if(u.id) {
                userLocationMap.set(u.id, u.location)
            }
        });

        credits.forEach(credit => {
            // Credits can exist without a user, especially old ones or from public calculator
            const location = credit.userId ? userLocationMap.get(credit.userId) : 'Desconocida';
            if (location) {
                const current = locationData.get(location) || { totalAmount: 0, count: 0 };
                locationData.set(location, {
                    totalAmount: current.totalAmount + credit.amount,
                    count: current.count + 1
                });
            }
        });

        return Array.from(locationData.entries()).map(([name, data]) => ({
            name,
            'Promedio': data.totalAmount / data.count,
        }));

    }, [credits, users]);

    const planPopularityData = useMemo(() => {
      const planCounts = credits.reduce((acc, credit) => {
        if (credit.plan) {
          acc[credit.plan] = (acc[credit.plan] || 0) + 1;
        }
        return acc;
      }, {} as Record<PlanType, number>);
  
      return Object.entries(planCounts)
        .map(([name, value]) => ({ name, simulaciones: value }))
        // FIX: Cast sorted properties to `number` to resolve TypeScript arithmetic operation error.
        .sort((a,b) => (b.simulaciones as number) - (a.simulaciones as number));
    }, [credits]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 font-heading">Analíticas e Insights</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Monto Total por Cultivo">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={creditAmountByCropData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {creditAmountByCropData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Monto Promedio de Crédito por Zona">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avgCreditByLocationData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value: number) => (value/1000000).toFixed(1) + 'M'} />
                            <YAxis dataKey="name" type="category" width={80} stroke="#64748b" fontSize={12} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}/>
                            <Legend />
                            <Bar dataKey="Promedio" fill="#b8aea1" barSize={30} radius={[0, 4, 4, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Popularidad de Planes Financieros">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={planPopularityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                        <Tooltip cursor={{ fill: '#f1f5f9' }} />
                        <Legend />
                        <Bar dataKey="simulaciones" fill="#86c391" barSize={50} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default AnalyticsPage;