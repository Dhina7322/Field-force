import { useState } from 'react';
import { Banknote, Plus, Search, Filter, History, User, Loader2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
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

const initialAdvances = [
  { id: 1, employee: 'John Smith', amount: 5000, date: '2024-10-15', reason: 'Personal emergency', balance: 5000 },
  { id: 2, employee: 'Sarah Johnson', amount: 2000, date: '2024-10-20', reason: 'Travel advance', balance: 7000 },
];

export function AdvanceRegisterPage() {
  const [advances, setAdvances] = useState(initialAdvances);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Banknote className="w-8 h-8 text-indigo-600" />
            Advance Register
          </h1>
          <p className="text-slate-500 mt-1">Track employee advances and pending balances</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
              <Plus className="w-4 h-4" />
              Give Advance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Employee Advance</DialogTitle>
              <DialogDescription>Record a new financial advance for a staff member.</DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsAdding(true);
              const fd = new FormData(e.target);
              try {
                if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                await api.post('/advances', {
                  employee: fd.get('employee'),
                  amount: parseFloat(fd.get('amount')),
                  reason: fd.get('reason'),
                  date: new Date().toISOString().split('T')[0]
                });
                toast.success('Advance issued successfully');
              } catch (err) {
                toast.error(err.message);
              } finally {
                setIsAdding(false);
              }
            }}>
              <div className="grid gap-4 py-4">
                <Input name="employee" placeholder="Employee Name" required />
                <Input name="amount" type="number" placeholder="Advance Amount (INR)" required />
                <Input name="reason" placeholder="Reason for Advance" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Advance Issue'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-900 text-sm font-semibold uppercase tracking-wider">Total Advances Given</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">₹7,000</div>
            <p className="text-xs text-amber-500 mt-1">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-sm font-semibold uppercase tracking-wider">Pending Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-700">₹12,450</div>
            <p className="text-xs text-indigo-500 mt-1">Total outstanding</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by Employee..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Running Balance (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advances.filter(adv => adv.employee.toLowerCase().includes(search.toLowerCase())).map((adv) => (
              <TableRow key={adv.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{adv.employee}</span>
                  </div>
                </TableCell>
                <TableCell>{adv.date}</TableCell>
                <TableCell className="font-bold text-slate-900">₹{adv.amount.toLocaleString()}</TableCell>
                <TableCell className="text-slate-500 italic max-w-xs truncate">"{adv.reason}"</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                    ₹{adv.balance.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">History</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
