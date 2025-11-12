
import React, { useMemo, ReactElement } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  PieChart, Pie, Cell, 
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import { CreditStatus, CropType } from '../../types';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ShareIcon, 
  FunnelIcon, 
  Cog6ToothIcon, 
  PresentationChartLineIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  ScaleIcon
} from '@heroicons/react/24/solid';

// --- Reusable Components for the New Dashboard ---

const DashboardHeader: React.FC = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-slate-800 font-heading">Overview</h1>
    <div className="flex items-center gap-2">
      <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors font-heading">
        Economics Widget
      </button>
      <button className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
        <FunnelIcon className="h-5 w-5" />
      </button>
      <button className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
        <ShareIcon className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const StatCard: React.FC<{ title: string; value: string; change: number; icon: ReactElement }> = ({ title, value, change, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-brand-green to-brand-blue rounded-lg text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-heading">{title}</p>
        <p className="text-2xl font-bold text-slate-800 font-heading">{value}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1 text-sm">
      {change >= 0 ? (
        <ArrowUpIcon className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowDownIcon className="h-4 w-4 text-red-500" />
      )}
      <span className={change >= 0 ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>{Math.abs(change)}%</span>
      <span className="text-slate-500">vs último mes</span>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg text-slate-800 font-heading">{title}</h3>
      <button className="text-slate-400 hover:text-slate-600">
        <Cog6ToothIcon className="h-5 w-5" />
      </button>
    </div>
    <div className="h-72">{children}</div>
  </div>
);

// --- Main Dashboard Page ---

const DashboardPage: React.FC = () => {
  const { users, credits } = useData();

  const analytics = useMemo(() => {
    const activeCredits = credits.filter(c => c.status === CreditStatus.Active);
    const totalDisbursed = activeCredits.reduce((sum, c) => sum + c.amount, 0);
    const avgCreditAmount = credits.length > 0 ? credits.reduce((sum, c) => sum + c.amount, 0) / credits.length : 0;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = users.filter(u => new Date(u.registeredDate) >= firstDayOfMonth).length;
    const simulationsThisMonth = credits.filter(c => new Date(c.simulationDate) >= firstDayOfMonth).length;

    const creditsOverTime = credits.reduce((acc, credit) => {
        const month = new Date(credit.simulationDate).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!acc[month]) acc[month] = 0;
        acc[month] += credit.amount;
        return acc;
    }, {} as Record<string, number>);
    const creditsOverTimeData = Object.entries(creditsOverTime).map(([name, monto]) => ({ name, monto })).slice(-12);

    const creditsByLocation = credits.reduce((acc, credit) => {
        const user = users.find(u => u.id === credit.userId);
        if (user) {
            const location = user.location;
            if (!acc[location]) acc[location] = 0;
            acc[location]++;
        }
        return acc;
    }, {} as Record<string, number>);
    const creditsByLocationData = Object.entries(creditsByLocation).map(([name, créditos]) => ({ name, créditos })).slice(0, 5);
    
    const creditsByCrop = Object.values(CropType).map(crop => ({
      subject: crop,
      A: credits.filter(c => c.cropType === crop).length,
      fullMark: credits.length
    }));

    const creditsByStatus = [
        { name: CreditStatus.Active, value: credits.filter(c => c.status === CreditStatus.Active).length },
        { name: CreditStatus.Paid, value: credits.filter(c => c.status === CreditStatus.Paid).length },
        { name: CreditStatus.Simulated, value: credits.filter(c => c.status === CreditStatus.Simulated).length },
    ];
    
    return {
      totalDisbursed,
      avgCreditAmount,
      newUsersThisMonth,
      simulationsThisMonth,
      creditsOverTimeData,
      creditsByLocationData,
      creditsByCrop,
      creditsByStatus,
      totalUsers: users.length,
    };
  }, [credits, users]);
  
  const currencyFormatter = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

  const DONUT_COLORS = {
    [CreditStatus.Active]: '#86c391',
    [CreditStatus.Paid]: '#6db3d6',
    [CreditStatus.Simulated]: '#b8aea1',
  };

  return (
    <div className="p-6">
      <DashboardHeader />
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Desembolsado" value={analytics.totalDisbursed.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0})} change={12.4} icon={<CurrencyDollarIcon className="h-6 w-6"/>} />
        <StatCard title="Promedio por Crédito" value={analytics.avgCreditAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0})} change={-2.1} icon={<ScaleIcon className="h-6 w-6"/>} />
        <StatCard title="Nuevos Usuarios (Mes)" value={analytics.newUsersThisMonth.toString()} change={8} icon={<UsersIcon className="h-6 w-6"/>}/>
        <StatCard title="Total Simulaciones" value={credits.length.toString()} change={5.7} icon={<PresentationChartLineIcon className="h-6 w-6"/>}/>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart */}
        <div className="lg:col-span-2">
            <ChartCard title="Evolución de Créditos en el Tiempo">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.creditsOverTimeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={currencyFormatter}/>
                        <Tooltip formatter={(value: number) => value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} />
                        <Legend />
                        <Line type="monotone" dataKey="monto" stroke="#86c391" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        {/* Side Bar Chart */}
        <div>
            <ChartCard title="Créditos por Ubicación">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.creditsByLocationData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} stroke="#64748b" fontSize={12} />
                        <Tooltip cursor={{ fill: '#f1f5f9' }} />
                        <Bar dataKey="créditos" fill="#b8aea1" barSize={20} radius={[0, 10, 10, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        {/* Bottom Charts */}
        <div className="lg:col-span-1">
            <ChartCard title="Créditos por Cultivo">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.creditsByCrop}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" fontSize={12} />
                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 2']} />
                        <Radar name="Créditos" dataKey="A" stroke="#b8aea1" fill="#b8aea1" fillOpacity={0.6} />
                         <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        <div className="lg:col-span-1">
            <ChartCard title="Créditos por Estado">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={analytics.creditsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                            {analytics.creditsByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={DONUT_COLORS[entry.name as CreditStatus]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        <div className="lg:col-span-1 relative">
            <ChartCard title="Usuarios Registrados">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[{ value: analytics.totalUsers }]}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="70%"
                            outerRadius="100%"
                            cy="75%"
                            fill="#86c391"
                        />
                        <Pie
                            data={[{ value: 100 }]} // Mock total for background
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="70%"
                            outerRadius="100%"
                            cy="75%"
                            fill="#e2e8f0"
                            stroke="none"
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
                    <span className="text-4xl font-bold text-slate-800 font-heading">{analytics.totalUsers}</span>
                    <p className="text-slate-500">Total Usuarios</p>
                </div>
            </ChartCard>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;