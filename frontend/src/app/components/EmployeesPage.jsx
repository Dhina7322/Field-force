import { useState, useEffect } from 'react';
import { Users, Search, Plus, MoreVertical, Download, Loader2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const sampleEmployees = [
  { id: 'EMP001', fullName: 'John Smith', group_name: 'Sales', doj: '2023-01-15', status: 'Active' },
  { id: 'EMP002', fullName: 'Sarah Johnson', group_name: 'Field Team', doj: '2023-03-22', status: 'Active' },
  { id: 'EMP003', fullName: 'Michael Brown', group_name: 'Admin', doj: '2022-11-03', status: 'Active' },
];

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      if (!isConfigured) {
        setEmployees(sampleEmployees);
        return;
      }

      const data = await api.get('/employees');
      setEmployees(data || []);
    } catch (error) {
      toast.error('Failed to load employees from API');
      setEmployees(sampleEmployees); // Fallback on error
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusToggle(emp) {
    if (!isConfigured) {
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: e.status === 'Active' ? 'Removed' : 'Active' } : e));
      toast.info('Local data updated (Mock Mode)');
      return;
    }

    const newStatus = emp.status === 'Active' ? 'Removed' : 'Active';
    try {
      await api.patch(`/employees/${emp.id}/status`, { status: newStatus });
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus } : e));
      toast.success(`Status updated via Backend API`);
    } catch (error) {
      toast.error('API Update failed: ' + error.message);
    }
  }

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase();
    const matchesSearch = (emp.fullName?.toLowerCase() || '').includes(q) || (emp.id?.toLowerCase() || '').includes(q);
    const matchesGroup = groupFilter === 'All' || emp.group_name === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            CRM Workforce
          </h1>
          <p className="text-slate-500 mt-1">Manage and track your entire team database via Supabase</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md h-10 px-5">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Input employee details to sync with CRM backend.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const formData = new FormData(e.target);
                const newEmp = {
                  id: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
                  fullName: formData.get('fullName'),
                  group_name: formData.get('group'),
                  doj: formData.get('doj'),
                  status: 'Active'
                };

                try {
                  if (!isConfigured) {
                    toast.info('Local Mode: Sync disabled');
                    return;
                  }
                  await api.post('/employees', newEmp);
                  toast.success('Employee hired successfully!');
                  fetchEmployees();
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Full Name</label>
                    <Input name="fullName" placeholder="Full Legal Name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-bold uppercase text-slate-400">Group</label>
                      <select name="group" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
                        <option value="Sales">Sales</option>
                        <option value="Field Team">Field Team</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-bold uppercase text-slate-400">DOJ</label>
                      <Input name="doj" type="date" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Hire'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search database..." 
              className="pl-9 bg-slate-50/50 border-none h-10 focus-visible:ring-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {['All', 'Sales', 'Field Team', 'Admin'].map(g => (
                <button
                  key={g}
                  onClick={() => setGroupFilter(g)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${
                    groupFilter === g ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-slate-400 text-xs mt-4 font-bold uppercase tracking-widest">Connecting to Supabase...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6">Employee</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Group</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">D.O.J</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id} className={`group hover:bg-slate-50 transition-colors ${emp.status === 'Removed' ? 'opacity-50 grayscale' : ''}`}>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
                        {emp.fullName?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight">{emp.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Staff Member</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-black text-indigo-600 tracking-tighter">
                    {emp.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-indigo-100 text-indigo-600 bg-indigo-50/50 font-bold text-[10px]">
                      {emp.group_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-600">
                    {new Date(emp.doj).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] font-black uppercase border-none ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white border border-transparent hover:border-slate-200">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-bold">
                        <DropdownMenuItem className="text-xs">Quick Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onClick={() => handleStatusToggle(emp)}>
                          {emp.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-slate-400 font-black tracking-tight uppercase text-xs">No records found in database</p>
          </div>
        )}
      </div>
    </div>
  );
}
