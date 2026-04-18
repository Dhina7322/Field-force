import { useState } from 'react';
import { Tractor, Plus, Search, Battery, Fuel, Settings2, AlertTriangle, CheckCircle2, MoreVertical, PenTool as Tool, Loader2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

const sampleMachines = [
  { id: 'M-101', name: 'John Deere 5050D', type: 'Tractor', power: '50 HP', fuel: '82%', status: 'Available', lastService: 'Oct 10, 2024' },
  { id: 'M-102', name: 'Kubota MU4501', type: 'Harvester', power: '45 HP', fuel: '45%', status: 'In Use', lastService: 'Sep 15, 2024' },
  { id: 'M-103', name: 'Mahindra Arjun 555', type: 'Tractor', power: '50 HP', fuel: '12%', status: 'Low Fuel', lastService: 'Oct 15, 2024' },
  { id: 'M-104', name: 'New Holland 3630', type: 'Plow', power: '55 HP', fuel: '100%', status: 'Maintenance', lastService: 'Oct 22, 2024' },
];

export function MachinesPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Tractor className="w-8 h-8 text-indigo-600" />
            Machine Inventory
          </h1>
          <p className="text-slate-500 mt-1">Manage, track, and monitor your heavy machinery and equipment</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Settings2 className="w-4 h-4" />
            Maintenance Log
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus className="w-4 h-4" />
                Register Machine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>Register a piece of heavy machinery to the fleet database.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                  await api.post('/machines', {
                    name: fd.get('name'),
                    type: fd.get('type'),
                    power: fd.get('power'),
                    status: 'Available',
                    fuel: '100%',
                    id: `M-${Math.floor(100 + Math.random() * 900)}`
                  });
                  toast.success('Machine registered in cloud');
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="name" placeholder="Machine Model Name" required />
                  <select name="type" className="h-10 rounded-md border border-slate-200 px-3 text-sm">
                    <option value="Tractor">Tractor</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Plow">Plow</option>
                    <option value="Sprayer">Sprayer</option>
                  </select>
                  <Input name="power" placeholder="Power Specifications (e.g. 50 HP)" required />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleMachines.map((m) => (
          <Card key={m.id} className="relative overflow-hidden group hover:border-indigo-200 transition-all shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${m.status === 'Maintenance' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Tractor className="w-5 h-5" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-none ${
                    m.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 
                    m.status === 'In Use' ? 'bg-blue-50 text-blue-700' :
                    m.status === 'Low Fuel' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {m.status}
                </Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{m.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">{m.type} • {m.power}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <span>Fuel Level</span>
                    <span>{m.fuel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${parseInt(m.fuel) < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: m.fuel }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Tool className="w-3 h-3" />
                    Last Service: {m.lastService}
                  </div>
                  <div className="font-mono">{m.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by ID, name or type..." 
              className="pl-9 border-slate-200 focus-visible:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              12 Online
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              2 Critical
            </div>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Machine Name</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>System Health</TableHead>
              <TableHead>Operations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleMachines.map((m) => (
              <TableRow key={m.id} className="group">
                <TableCell>
                  <div className="font-semibold text-slate-900">{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-widest">{m.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-slate-700">{m.type}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Power Output: {m.power}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{m.fuel}</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: m.fuel }} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Battery className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">92%</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {m.status === 'Available' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    <span className="text-xs font-medium text-slate-600">No issues reported</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
