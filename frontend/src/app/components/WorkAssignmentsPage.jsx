import { useState } from 'react';
import { ClipboardList, Plus, Search, Filter, Calendar, Clock, CheckCircle2, Circle, Loader2 } from 'lucide-react';
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
import { Card, CardContent } from './ui/card';

const sampleAssignments = [
  { id: 'WA-2024-001', task: 'Soil Preparation', team: 'Alpha Squad', area: 'Plot A-12', priority: 'High', status: 'In Progress', deadline: 'Today, 5:00 PM' },
  { id: 'WA-2024-002', task: 'Irrigation Check', team: 'Maintenance', area: 'All Sectors', priority: 'Medium', status: 'Pending', deadline: 'Tomorrow' },
  { id: 'WA-2024-003', task: 'Fertilizer Application', team: 'Beta Team', area: 'Plot B-05', priority: 'High', status: 'Completed', deadline: 'Oct 24, 2024' },
  { id: 'WA-2024-004', task: 'Equipment Audit', team: 'Maintenance', area: 'Storage A', priority: 'Low', status: 'Pending', deadline: 'Oct 26, 2024' },
];

export function WorkAssignmentsPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-indigo-600" />
            Work Assignments
          </h1>
          <p className="text-slate-500 mt-1">Track and manage active tasks across all teams</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dispatch Work Command</DialogTitle>
                <DialogDescription>Assign a new operational task to a field squad.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                  await api.post('/assignments', {
                    task: fd.get('task'),
                    team: fd.get('team'),
                    area: fd.get('area'),
                    deadline: fd.get('deadline'),
                    status: 'Pending',
                    id: `WA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
                  });
                  toast.success('Assignment dispatched');
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="task" placeholder="Task Objective" required />
                  <Input name="team" placeholder="Assigned Team" required />
                  <Input name="area" placeholder="Target Field / Area" required />
                  <Input name="deadline" placeholder="Deadline (e.g. Today, 5 PM)" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Dispatch'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
          {['All Tasks', 'In Progress', 'Pending', 'Completed', 'Overdue'].map((tab, i) => (
            <button 
              key={tab} 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search tasks, teams, or areas..." 
                className="pl-9 border-none bg-slate-50 focus-visible:ring-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Task & Details</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleAssignments.map((wa) => (
                <TableRow key={wa.id} className="cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-slate-900">{wa.task}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-mono">{wa.id}</span>
                      <span>•</span>
                      <span>{wa.area}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-700">{wa.team}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {wa.deadline}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        ${wa.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          wa.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                          'bg-slate-100 text-slate-600 border-slate-200'}
                        border shadow-none
                      `}
                    >
                      {wa.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-6">
          <Card className="border-indigo-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Due Today
              </h3>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 group">
                    <div className="mt-0.5">
                      {i === 1 ? <Circle className="w-5 h-5 text-slate-300" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${i === 2 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        General Field Inspection
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">09:00 AM - 11:30 AM</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="px-0 h-auto mt-4 text-indigo-600 text-xs font-semibold">
                View Today's Schedule →
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-400 text-xs uppercase tracking-widest mb-1">Weekly Efficiency</h3>
              <div className="text-3xl font-bold mb-4">92.4%</div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[92%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">
                You've completed 48 tasks this week, 4 more than last week.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
