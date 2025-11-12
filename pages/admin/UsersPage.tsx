import React, { useState, useMemo, ReactElement } from 'react';
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';
import { UsersIcon, UserPlusIcon, MapPinIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';


// --- Reusable Components ---

const StatCard: React.FC<{ title: string; value: string; icon: ReactElement }> = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div className="p-3 bg-gradient-to-br from-brand-green to-brand-blue rounded-lg text-white">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-heading">{title}</p>
      <p className="text-2xl font-bold text-slate-800 font-heading">{value}</p>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="font-bold text-lg text-slate-800 mb-4 font-heading">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

type FormErrors = {
    name?: string;
    email?: string;
    location?: string;
};

const UserForm: React.FC<{ user?: User; onSave: (user: User) => void; onCancel: () => void }> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<User, 'id' | 'registeredDate'>>({
        name: user?.name || '',
        email: user?.email || '',
        location: user?.location || '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    
    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido.';
        }
        if (!formData.location.trim()) newErrors.location = 'La ubicación es obligatoria.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const userToSave: User = {
                id: user?.id || `user-${Date.now()}`,
                registeredDate: user?.registeredDate || new Date().toISOString().split('T')[0],
                ...formData,
            };
            onSave(userToSave);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center animate-fadeIn z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-scaleIn">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 font-heading">{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-700 font-medium mb-1 font-heading">Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded-xl ${errors.name ? 'border-red-500' : 'border-slate-300'}`} required />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-slate-700 font-medium mb-1 font-heading">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-2 border rounded-xl ${errors.email ? 'border-red-500' : 'border-slate-300'}`} required />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-slate-700 font-medium mb-1 font-heading">Ubicación</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className={`w-full p-2 border rounded-xl ${errors.location ? 'border-red-500' : 'border-slate-300'}`} required />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={onCancel} className="bg-slate-100 text-brand-dark font-semibold py-2 px-4 rounded-xl hover:bg-slate-200 transition-colors duration-300 shadow-sm hover:shadow-md">Cancelar</button>
                        <button type="submit" className="bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UsersPage: React.FC = () => {
    const { users, setUsers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

    const analytics = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsers = users.filter(u => new Date(u.registeredDate) > thirtyDaysAgo).length;
        
        const locationCounts = users.reduce((acc, user) => {
            acc[user.location] = (acc[user.location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topLocation = Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, 'N/A');
        
        const userDistributionData = Object.entries(locationCounts)
            .map(([name, count]) => ({ name, usuarios: count }))
            // FIX: Cast sorted properties to `number` to resolve TypeScript arithmetic operation error.
            .sort((a, b) => (b.usuarios as number) - (a.usuarios as number));

        return {
            totalUsers: users.length,
            newUsersLast30Days: newUsers,
            topLocation: topLocation,
            userDistributionData,
        };
    }, [users]);


    const handleAddUser = () => {
        setEditingUser(undefined);
        setIsModalOpen(true);
    };
    
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };
    
    const handleSaveUser = (user: User) => {
        const userExists = users.some(u => u.id === user.id);
        if (userExists) {
            setUsers(users.map(u => (u.id === user.id ? user : u)));
        } else {
            setUsers([user, ...users]);
        }
        setIsModalOpen(false);
        setEditingUser(undefined);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 font-heading">Gestión de Usuarios</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total de Usuarios" value={analytics.totalUsers.toString()} icon={<UsersIcon className="h-6 w-6"/>} />
                <StatCard title="Nuevos (Últimos 30 días)" value={analytics.newUsersLast30Days.toString()} icon={<ArrowUpIcon className="h-6 w-6"/>} />
                <StatCard title="Ubicación Principal" value={analytics.topLocation} icon={<MapPinIcon className="h-6 w-6"/>} />
            </div>
            
            {/* Analytics Chart */}
            <div className="mb-6">
                <ChartCard title="Desglose de Usuarios por Ubicación">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.userDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => [value, 'Usuarios']} />
                            <Bar dataKey="usuarios" fill="#86c391" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 font-heading">Todos los Usuarios</h3>
                    <button onClick={handleAddUser} className="flex items-center gap-2 bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">
                        <UserPlusIcon className="h-5 w-5" />
                        Agregar Usuario
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Nombre</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Email</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Ubicación</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Fecha Registro</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600 font-heading">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 text-slate-800 font-medium">{user.name}</td>
                                    <td className="py-3 px-4 text-slate-500">{user.email}</td>
                                    <td className="py-3 px-4 text-slate-500">{user.location}</td>
                                    <td className="py-3 px-4 text-slate-500">{user.registeredDate}</td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => handleEditUser(user)} className="font-semibold text-sky-500 hover:underline mr-4 font-heading">Editar</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="font-semibold text-red-500 hover:underline font-heading">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             {isModalOpen && <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default UsersPage;