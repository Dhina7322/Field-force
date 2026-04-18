import { useState } from 'react';
import { UsersRound, Search, Plus, MoreVertical, Shield, UserPlus } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

const sampleTeams = [
  { id: 'TM-001', name: 'Alpha Squad', leader: 'John Smith', members: 12, area: 'North Wing', status: 'Active' },
  { id: 'TM-002', name: 'Beta Team', leader: 'Sarah Johnson', members: 8, area: 'South Sector', status: 'Active' },
  { id: 'TM-003', name: 'Harvest Group', leader: 'Michael Brown', members: 15, area: 'Main Field', status: 'On Break' },
  { id: 'TM-004', name: 'Maintenance', leader: 'Emily Davis', members: 5, area: 'Facility', status: 'Active' },
];

export function TeamsPage() {
  const [search, setSearch] = useState('');

  const filtered = sampleTeams.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.leader.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-indigo-600" />
            Teams & Groups
          </h1>
          <p className="text-slate-500 mt-1">Organize your workforce into efficient teams</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:translate-y-[-1px]">
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-sm font-semibold uppercase tracking-wider">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-700">12</div>
            <p className="text-xs text-indigo-500 mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-900 text-sm font-semibold uppercase tracking-wider">Active Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">142</div>
            <p className="text-xs text-emerald-500 mt-1">94% productivity rate</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-900 text-sm font-semibold uppercase tracking-wider">Idle Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">1</div>
            <p className="text-xs text-amber-500 mt-1">Scheduled for next shift</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search teams or leaders..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Team Leader</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Assigned Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((team) => (
              <TableRow key={team.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-semibold text-slate-900">{team.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{team.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                      {team.leader.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium">{team.leader}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-indigo-600 border-indigo-100">
                    {team.members} People
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{team.area}</TableCell>
                <TableCell>
                  <Badge 
                    className={team.status === 'Active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-none'}
                  >
                    {team.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                      <UserPlus className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Roster</DropdownMenuItem>
                        <DropdownMenuItem>Edit Team</DropdownMenuItem>
                        <DropdownMenuItem>Change Leader</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Dissolve Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
