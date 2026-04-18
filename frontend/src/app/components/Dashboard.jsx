import { useState, useEffect } from 'react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { 
  Users, 
  Clock, 
  ClipboardList, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  FileText, 
  Tractor, 
  CheckCircle2, 
  MoreHorizontal,
  ArrowRight,
  Droplets,
  Building2,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

export function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ employees: 0, clients: 0 });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        if (!isConfigured) {
          setCounts({ employees: 142, clients: 28 });
          return;
        }

        const data = await api.get('/dashboard/counts');
        setCounts({
          employees: data.employees || 0,
          clients: data.clients || 0
        });
      } catch (err) {
        console.error('Stats error:', err);
        setCounts({ employees: 142, clients: 28 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);
  
  const stats = [
    { label: 'Total Employees', value: counts.employees.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4.5%' },
    { label: 'Active Clients', value: counts.clients.toString(), icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
    { label: 'Attendance (Present/Leave)', value: '156 / 24', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Monthly' },
    { label: 'Petrol Consumption', value: '1,240L', icon: Droplets, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'This Month' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 bg-white font-bold text-xs uppercase tracking-wider">
            Report Center
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Initialize High-Impact Project</DialogTitle>
                <DialogDescription>Deploy a new strategic operation to the field registry.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync restricted'); return; }
                  await api.post('/projects', {
                    name: fd.get('name'),
                    client: fd.get('client'),
                    team: fd.get('team'),
                    status: 'In Progress',
                    progress: 0
                  });
                  toast.success('Project deployed successfully!');
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="name" placeholder="Project Title (e.g. Plot B Irrigation)" required />
                  <Input name="client" placeholder="Strategic Partner / Client" />
                  <select name="team" className="h-10 rounded-md border border-slate-200 px-3 text-sm">
                    <option value="Alpha Squad">Alpha Squad</option>
                    <option value="Beta Team">Beta Team</option>
                    <option value="Maintenance">Maintenance Team</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deployment'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <p className="text-[10px] font-bold mt-1 flex items-center gap-1">
                {stat.trend.startsWith('+') ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                )}
                <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}>
                  {stat.trend}
                </span>
                <span className="text-slate-400 uppercase tracking-tighter ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Operational Health</CardTitle>
              <CardDescription className="text-xs font-medium">Real-time status of active field projects</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { name: 'Northern Orchard Expansion', status: 'In Progress', progress: 65, team: 'Alpha Squad' },
                { name: 'Soil PH Restoration - Sector B', status: 'Critical', progress: 12, team: 'Beta Team' },
                { name: 'Irrigation System Audit', status: 'Completed', progress: 100, team: 'Maintenance' },
                { name: 'Seedling Nursery Prep', status: 'Pending', progress: 0, team: 'None' },
              ].map((project, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/30 transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">{project.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{project.team}</span>
                      <Badge className={`text-[9px] font-black border-none uppercase ${
                        project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                        project.status === 'Critical' ? 'bg-rose-50 text-rose-600' :
                        project.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-slate-900">{project.progress}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            project.status === 'Critical' ? 'bg-rose-500' : 'bg-indigo-600'
                          }`} 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-indigo-600"><ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">Quick Operations</CardTitle>
              <CardDescription className="text-xs font-medium">Frequent team management actions</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => navigate('/employees')}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-800">Onboard Talent</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Add new employees</span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </button>
              
              <button 
                onClick={() => navigate('/work-assignments')}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-800">Dispatch Tasks</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Assign new field work</span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </button>

              <button 
                onClick={() => navigate('/machines')}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-800">Machine Health</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Audit equipment status</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600" />
              </button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
            <CardContent className="p-8">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">System is Healthy</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  All 12 fields are within optimal parameters. No critical alerts for the last 24 hours.
                </p>
                <Button variant="secondary" className="w-full bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest h-10">
                  View Security Audit
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-indigo-600/30 transition-colors" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

