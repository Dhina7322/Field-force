import { useState } from 'react';
import { Shield, Search, Plus, Check, MoreVertical, Users, Lock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const sampleRoles = [
  { id: 'R-01', name: 'Super Admin', permissions: 'Full Access', users: 2, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'R-02', name: 'Field Manager', permissions: 'Team & Task Management', users: 8, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'R-03', name: 'Technician', permissions: 'Log Entry & Machine Access', users: 24, color: 'text-amber-600 bg-amber-50' },
  { id: 'R-04', name: 'Accounts Officer', permissions: 'Financial & Payroll Access', users: 3, color: 'text-rose-600 bg-rose-50' },
];

export function RolesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Roles & Permissions
          </h1>
          <p className="text-slate-500 mt-1">Define access levels and security protocols for your team members</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Plus className="w-4 h-4" />
          Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Search roles..." 
                    className="pl-9 bg-white border-slate-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="space-y-3">
                {sampleRoles.map((role) => (
                    <Card key={role.id} className="group hover:border-indigo-300 transition-all cursor-pointer border-slate-200 shadow-sm overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${role.color}`}>
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{role.name}</h4>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                                            <Users className="w-3 h-3" />
                                            {role.users} Active Users
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="lg:col-span-2">
            <Card className="border-indigo-100 shadow-xl shadow-indigo-50/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Field Manager - Permissions</CardTitle>
                            <CardDescription>Configure access rights for this role</CardDescription>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-none px-3">Active Role</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {[
                            { module: 'Workforce', desc: 'Can add, edit and archive employee profiles', access: 'Write' },
                            { module: 'Operations', desc: 'Can assign tasks and approve daily logs', access: 'Write' },
                            { module: 'Inventory', desc: 'View machines and report maintenance issues', access: 'Read' },
                            { module: 'Finance', desc: 'Can view base salary but not process payments', access: 'Read' },
                            { module: 'Settings', desc: 'No access to organization wide configuration', access: 'None' },
                        ].map((perm, i) => (
                            <div key={i} className="flex items-center justify-between p-6 group hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${perm.access === 'None' ? 'border-slate-200' : 'bg-indigo-600 border-indigo-600'}`}>
                                        {perm.access !== 'None' && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-900">{perm.module}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{perm.desc}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] font-bold border-none ${
                                        perm.access === 'Write' ? 'bg-indigo-50 text-indigo-700' : 
                                        perm.access === 'Read' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {perm.access}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
