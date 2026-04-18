import { useState, useEffect } from 'react';
import { Droplets, Plus, Search, Filter, Fuel, Calendar, Car, Loader2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';

const sampleLogs = [
  { id: 1, vehicle_id: 'V-102', total_given: 50, remaining: 5, date: '2024-10-25' },
  { id: 2, vehicle_id: 'V-105', total_given: 40, remaining: 12, date: '2024-10-24' },
];

export function PetrolPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      if (!isConfigured) {
        setLogs(sampleLogs);
        return;
      }
      const data = await api.get('/petrol');
      setLogs(data || []);
    } catch (err) {
      console.error('API Fetch error:', err);
      toast.error('Sync failed: Falling back to local data');
      setLogs(sampleLogs);
    } finally {
      setLoading(false);
    }
  };

  const calculateConsumption = (total, remaining) => total - remaining;

  const totalConsumption = logs.reduce((acc, log) => acc + (log.total_given - log.remaining), 0);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Droplets className="w-8 h-8 text-indigo-600" />
            Petrol Logistics
          </h1>
          <p className="text-slate-500 mt-1">Real-time fuel inventory and vehicle consumption tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus className="w-4 h-4" />
                Record Fuel Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fuel Logistics Entry</DialogTitle>
                <DialogDescription>Record new petrol consumption data for fleet vehicles.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) {
                    toast.info('Feature unavailable in mock mode');
                    return;
                  }
                  await api.post('/petrol', {
                    vehicle_id: fd.get('vehicle_id'),
                    total_given: parseFloat(fd.get('total_given')),
                    remaining: parseFloat(fd.get('remaining')),
                    date: new Date().toISOString().split('T')[0]
                  });
                  toast.success('Log saved via Backend API');
                  fetchLogs();
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="vehicle_id" placeholder="Vehicle License ID" required />
                  <Input name="total_given" type="number" step="0.01" placeholder="Total Petrol Given (Leters)" required />
                  <Input name="remaining" type="number" step="0.01" placeholder="Remaining Petrol (Leters)" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Log Entry'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-[10px] font-black uppercase tracking-widest">Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-700">{totalConsumption} Liters</div>
            <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase">Cumulative from Supabase</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-900 text-[10px] font-black uppercase tracking-widest">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-700">{(totalConsumption / (logs.length || 1)).toFixed(1)} L/Avg</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase">Per recorded trip</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Filter by vehicle..." 
              className="pl-9 bg-slate-50/50 border-none h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
             <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
             </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6">Vehicle ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Log Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Total Given</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Remaining</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Consumption</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.filter(log => log.vehicle_id.toLowerCase().includes(search.toLowerCase())).map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Car className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="font-black text-slate-900 tracking-tight">{log.vehicle_id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-500">{new Date(log.date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell className="text-sm font-bold text-slate-600">{log.total_given} L</TableCell>
                  <TableCell className="text-sm font-bold text-slate-600">{log.remaining} L</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-indigo-100 text-indigo-700 bg-indigo-50 font-black text-[10px]">
                      {calculateConsumption(log.total_given, log.remaining)} L Used
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none uppercase text-[9px] font-black">Synced</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
