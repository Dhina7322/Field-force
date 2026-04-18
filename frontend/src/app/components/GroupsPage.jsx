import { useState } from 'react';
import { UsersRound, Plus, Search, MoreVertical, Shield, UserPlus, Layers } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const initialGroups = [
  { id: 1, name: 'Sales', description: 'Main sales and marketing team', memberCount: 12 },
  { id: 2, name: 'Field Team', description: 'Technicians and field agents', memberCount: 45 },
  { id: 3, name: 'Admin', description: 'Office administration', memberCount: 5 },
];

export function GroupsPage() {
  const [groups, setGroups] = useState(initialGroups);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-600" />
            Group Management
          </h1>
          <p className="text-slate-500 mt-1">Organize employees into functional groups</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:border-indigo-200 transition-all cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-slate-900">{group.name}</CardTitle>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-none">
                  {group.memberCount} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">{group.description}</p>
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-indigo-600 font-semibold p-0 h-auto">
                  View Members
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center text-slate-500">
        <p>Select a group above to manage its employees and settings.</p>
      </div>
    </div>
  );
}
