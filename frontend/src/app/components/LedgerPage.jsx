import { useState } from 'react';
import { Landmark, Search, Filter, ArrowUpCircle, ArrowDownCircle, MoreVertical, Download, Calendar, History, Plus, Loader2 } from 'lucide-react';
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

const sampleTransactions = [
  { id: 'TXN-10024', date: 'Oct 25, 2024', description: 'Raw Material Purchase (N-P-K)', category: 'Operational', type: 'Debit', amount: 85000, status: 'Completed' },
  { id: 'TXN-10023', date: 'Oct 24, 2024', description: 'Fresh Mart Payment - Inv #402', category: 'Sales', type: 'Credit', amount: 320000, status: 'Completed' },
  { id: 'TXN-10022', date: 'Oct 23, 2024', description: 'Tractor T-01 Maintenance', category: 'Maintenance', type: 'Debit', amount: 12400, status: 'Completed' },
  { id: 'TXN-10021', date: 'Oct 22, 2024', description: 'Electricity Bill - Q3 East Field', category: 'Utilities', type: 'Debit', amount: 4500, status: 'Completed' },
];

export function LedgerPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Landmark className="w-8 h-8 text-indigo-600" />
            Financial Ledger
          </h1>
          <p className="text-slate-500 mt-1">Audit and monitor all income, expenses, and capital flow</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
            <History className="w-4 h-4" />
            Reconcile
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus className="w-4 h-4" />
                Record Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ledger Entry</DialogTitle>
                <DialogDescription>Manually record a financial inflow or outflow.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                  await api.post('/ledger', {
                    description: fd.get('description'),
                    category: fd.get('category'),
                    type: fd.get('type'),
                    amount: parseFloat(fd.get('amount')),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  });
                  toast.success('Transaction archived');
                  // fetchLedger(); // Assume fetchLedger exists or we just close
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="description" placeholder="Transaction Description" required />
                  <select name="category" className="h-10 rounded-md border border-slate-200 px-3 text-sm">
                    <option value="Operational">Operational</option>
                    <option value="Sales">Sales</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                  </select>
                  <select name="type" className="h-10 rounded-md border border-slate-200 px-3 text-sm">
                    <option value="Debit">Debit (-)</option>
                    <option value="Credit">Credit (+)</option>
                  </select>
                  <Input name="amount" type="number" placeholder="Amount (INR)" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Transaction'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white border-0 shadow-xl overflow-hidden relative">
            <CardContent className="p-8">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Net Balance</div>
                        <div className="text-5xl font-black tracking-tight mb-2">₹42.85 Lakh</div>
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase">This Month</span>
                                <span className="text-xl font-bold">+₹12.4L</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-indigo-300 font-bold uppercase">Expenses</span>
                                <span className="text-xl font-bold">-₹3.2L</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
                <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Landmark className="w-24 h-24" />
                </div>
            </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-100 shadow-none flex flex-col justify-center text-center p-6">
            <div className="p-3 bg-emerald-100/50 rounded-full w-fit mx-auto mb-3">
                <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Inflow</div>
            <div className="text-3xl font-black text-emerald-800 tracking-tight">₹156.4L</div>
            <p className="text-[10px] text-emerald-600/70 font-bold mt-1">FISCAL YEAR 2024</p>
        </Card>

        <Card className="bg-amber-50 border-amber-100 shadow-none flex flex-col justify-center text-center p-6 text-amber-900">
            <div className="p-3 bg-amber-100/50 rounded-full w-fit mx-auto mb-3">
                <ArrowDownCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Total Outflow</div>
            <div className="text-3xl font-black text-amber-800 tracking-tight">₹113.6L</div>
            <p className="text-[10px] text-amber-600/70 font-bold mt-1">FISCAL YEAR 2024</p>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search description or transaction ID..." 
              className="pl-9 bg-slate-50/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200"><Calendar className="w-4 h-4" /> Custom Range</Button>
            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200"><Download className="w-4 h-4" /> Download Statement</Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 uppercase">
            <TableRow>
              <TableHead className="text-[10px] font-black tracking-widest">Date & ID</TableHead>
              <TableHead className="text-[10px] font-black tracking-widest">Description</TableHead>
              <TableHead className="text-[10px] font-black tracking-widest">Category</TableHead>
              <TableHead className="text-[10px] font-black tracking-widest">Type</TableHead>
              <TableHead className="text-[10px] font-black tracking-widest">Amount</TableHead>
              <TableHead className="text-right text-[10px] font-black tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTransactions.map((tx) => (
              <TableRow key={tx.id} className="group hover:bg-slate-50/70 transition-colors">
                <TableCell>
                  <div className="text-xs font-bold text-slate-900">{tx.date}</div>
                  <div className="text-[10px] text-slate-400 font-mono italic">{tx.id}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold text-slate-800">{tx.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase">{tx.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                    {tx.type === 'Credit' ? <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownCircle className="w-3.5 h-3.5 text-red-500" />}
                    <span className={tx.type === 'Credit' ? 'text-emerald-700' : 'text-red-700'}>{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`text-base font-black ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'Credit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
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
