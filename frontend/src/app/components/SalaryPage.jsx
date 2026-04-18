import { useState } from 'react';
import { DollarSign, Search, Plus, Filter, Download, ArrowUpRight, ArrowDownRight, Printer, CreditCard, Banknote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';

const sampleSalaries = [
  { id: 'PAY-001', name: 'John Smith', month: 'October 2024', base: 45000, overtime: 1250, deductions: 500, total: 45750, status: 'Paid' },
  { id: 'PAY-002', name: 'Sarah Johnson', month: 'October 2024', base: 42000, overtime: 0, deductions: 200, total: 41800, status: 'Paid' },
  { id: 'PAY-003', name: 'Michael Brown', month: 'October 2024', base: 38000, overtime: 4500, deductions: 1000, total: 41500, status: 'Pending' },
  { id: 'PAY-004', name: 'Emily Davis', month: 'October 2024', base: 42000, overtime: 800, deductions: 0, total: 42800, status: 'Paid' },
];

export function SalaryPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-indigo-600" />
            Payroll & Salaries
          </h1>
          <p className="text-slate-500 mt-1">Calculate, review, and process team member compensation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Printer className="w-4 h-4" />
            Print Slips
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
            <Banknote className="w-4 h-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-500 rounded-lg"><CreditCard className="w-5 h-5 text-white" /></div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-2">+12% vs LY</Badge>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Payout Oct</div>
            <div className="text-4xl font-black mb-1 tracking-tight">₹12.4L</div>
            <p className="text-xs text-slate-500 font-medium">For 142 total employees</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
        </Card>

        <Card className="border-slate-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg"><ArrowUpRight className="w-5 h-5 text-slate-600" /></div>
                    <Badge variant="outline" className="text-[10px] text-slate-400">Month-to-date</Badge>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overtime Bonus</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">₹42,350</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <ArrowUpRight className="w-3 h-3" />
                    Increased output by 24%
                </div>
            </CardContent>
        </Card>

        <Card className="border-slate-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg"><ArrowDownRight className="w-5 h-5 text-slate-600" /></div>
                    <Badge variant="outline" className="text-[10px] text-slate-400">Total</Badge>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deductions</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">₹8,120</div>
                <div className="text-xs text-slate-500 font-medium">Insurance, Tax & Penalties</div>
            </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Filter by name or ID..." 
              className="pl-9 bg-slate-50 focus-visible:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200 font-bold text-xs"><Filter className="w-3.5 h-3.5" /> Filters</Button>
            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200 font-bold text-xs"><Download className="w-3.5 h-3.5" /> Export</Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Payable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleSalaries.map((pay) => (
              <TableRow key={pay.id} className="hover:bg-slate-50/50 cursor-pointer">
                <TableCell>
                  <div className="font-bold text-slate-900">{pay.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider">{pay.id}</div>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-600">₹{pay.base.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-semibold text-emerald-600">+₹{pay.overtime.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-semibold text-red-600">-₹{pay.deductions.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="text-base font-black text-indigo-700">₹{pay.total.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                    <Badge className={`border-none ${pay.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {pay.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-indigo-600 font-bold text-xs">View Slip</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
