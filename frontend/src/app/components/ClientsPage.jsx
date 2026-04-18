import { useState, useEffect } from 'react';
import { 
  Building2, Search, Plus, Mail, Phone, MapPin, 
  ExternalLink, Globe, Star, Clock, User, Filter, 
  Calendar, Loader2, MoreVertical
} from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

const sampleClients = [
  { id: 1, name: 'Green Valley Farms', place: 'North Wing', timing: '08:00 - 17:00', status: 'Active', assigned_employee_name: 'John Smith' },
  { id: 2, name: 'Fresh Mart HQ', place: 'Downtown', timing: '09:00 - 18:00', status: 'Prospect', assigned_employee_name: 'Sarah Johnson' },
];

export function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const filtered = clients.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || 
                          c.place?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  async function fetchClients() {
    try {
      setLoading(true);
      if (!isConfigured) {
        setClients(sampleClients);
        return;
      }
      const data = await api.get('/clients');
      setClients(data || []);
    } catch (err) {
      toast.error('Client sync failed');
      setClients(sampleClients);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Client Directory
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Connected to CRM Backend Registry</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 h-11 px-6 font-black text-xs uppercase tracking-widest">
                <Plus className="w-4 h-4" />
                New Strategic Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Client</DialogTitle>
              <DialogDescription>Add a new strategic partner to your workforce network.</DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsAdding(true);
              const fd = new FormData(e.target);
              try {
                if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                await api.post('/clients', {
                  name: fd.get('name'),
                  place: fd.get('place'),
                  timing: fd.get('timing'),
                  status: 'Active'
                });
                toast.success('Partner registered successfully!');
                fetchClients();
              } catch (err) {
                toast.error(err.message);
              } finally {
                setIsAdding(false);
              }
            }}>
              <div className="grid gap-4 py-4">
                <Input name="name" placeholder="Corporation Name" required />
                <Input name="place" placeholder="Primary Location / City" required />
                <Input name="timing" placeholder="Operational Timing (e.g. 09:00 - 18:00)" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Registration'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name or city..." 
            className="pl-10 h-11 border-none bg-slate-50/50 text-[13px] font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          {['All', 'Active', 'Prospect'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center opacity-40">
           <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
           <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Corporate Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <Card key={client.id} className="group hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden border-slate-100">
              <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <Badge className={`uppercase text-[9px] font-black tracking-widest ${
                    client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {client.status}
                  </Badge>
                </div>
                <div className="mt-4">
                  <CardTitle className="text-lg font-black text-slate-900 tracking-tight">{client.name}</CardTitle>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    {client.place || 'Global Headquarters'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Visit Window</div>
                    <div className="text-xs font-black text-slate-700 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {client.timing}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Key Account Mgr</div>
                    <div className="text-xs font-black text-slate-700 flex items-center gap-2">
                        <User className="w-3 h-3 text-indigo-500" />
                        {client.assigned_employee_name || 'Unassigned'}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Engagement Metrics
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-green-50/50 border border-green-100/50">
                        <span className="font-bold text-green-700">Service Frequency</span>
                        <span className="font-black text-green-800">Bi-Weekly</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold text-xs gap-2 border-slate-200 hover:bg-slate-50 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    Contact
                  </Button>
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-slate-200">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Strategic Partners</h3>
            <p className="text-slate-400 font-medium">Try broadening your search or check filter parameters.</p>
          </div>
      )}
    </div>
  );
}
