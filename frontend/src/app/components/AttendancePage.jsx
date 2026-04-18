import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, AlertCircle, Search, 
  Download, Calendar as CalendarIcon, UserCheck, Loader2 
} from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
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

const sampleAttendance = [
  { id: 1, employee_id: 'EMP001', check_in: '2024-10-25T08:00:00Z', working_hours: 8, leave_status: false, employees: { fullName: 'John Smith' } },
  { id: 2, employee_id: 'EMP002', check_in: '2024-10-25T09:15:00Z', working_hours: 7.5, leave_status: false, employees: { fullName: 'Sarah Johnson' } },
];

export function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('daily'); // 'daily' or 'summary'
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [view]);

  async function fetchAttendance() {
    try {
      setLoading(true);
      if (!isConfigured) {
        setAttendance(sampleAttendance);
        return;
      }

      const data = await api.get('/attendance');
      setAttendance(data || []);
    } catch (err) {
      console.error('API Error:', err);
      toast.error('Attendance sync failed: Falling back to local data');
      setAttendance(sampleAttendance);
    } finally {
      setLoading(false);
    }
  }

  const filtered = attendance.filter(row => 
    row.employees?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    row.employee_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-600" />
            CRM Attendance
          </h1>
          <p className="text-slate-500 mt-1">Cloud-synced personnel tracking and efficiency metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center h-10 border border-slate-200">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setView('daily')}
              className={`text-xs font-bold h-8 px-4 ${view === 'daily' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setView('summary')}
              className={`text-xs font-bold h-8 px-4 ${view === 'summary' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Summary
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 h-10 px-4 font-bold text-xs uppercase tracking-wider">
                <Plus className="w-4 h-4" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Offline Attendance Registry</DialogTitle>
                <DialogDescription>Manually record personnel hours for field assignments.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                  await api.post('/attendance', {
                    employee_id: fd.get('employee_id'),
                    check_in: new Date().toISOString().split('T')[0] + 'T' + fd.get('check_in'),
                    working_hours: parseFloat(fd.get('working_hours')),
                    date: new Date().toISOString().split('T')[0]
                  });
                  toast.success('Attendance recorded');
                  fetchAttendance();
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="employee_id" placeholder="Employee ID (e.g. EMP001)" required />
                  <Input name="check_in" type="time" required />
                  <Input name="working_hours" type="number" step="0.5" placeholder="Total Working Hours" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log Hours'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Present Today', value: '42', color: 'text-emerald-600' },
          { label: 'On Leave', value: '3', color: 'text-amber-600' },
          { label: 'Efficiency', value: '94%', color: 'text-indigo-600' },
          { label: 'Work Hours', value: '352h', color: 'text-slate-900' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Filter by name..." 
              className="pl-9 bg-slate-50/50 border-none h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none capitalize px-4 py-1.5 font-bold">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Badge>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6">Employee</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Clock In</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Clock Out</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Total Hours</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} className="group hover:bg-slate-50 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                        {row.employees?.fullName?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight">{row.employees?.fullName}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">{row.employee_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-600">{row.check_in ? new Date(row.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-600">{row.check_out ? new Date(row.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</TableCell>
                  <TableCell className="font-mono text-xs font-black text-slate-900">{row.working_hours || '0'}h</TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] font-black uppercase border-none ${row.leave_status ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {row.leave_status ? 'On Leave' : 'Present'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:bg-white group-hover:border-slate-200 border border-transparent">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center opacity-40">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No attendance records synchronized</p>
          </div>
        )}
      </div>
    </div>
  );
}
