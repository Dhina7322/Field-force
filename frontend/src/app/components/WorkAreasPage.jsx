import { useState } from 'react';
import { Map, MapPin, Maximize2, Search, Plus, Layers, TreePine, Mountain, Droplets, MoreHorizontal, Loader2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabase';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

const sampleAreas = [
  { id: 'AREA-01', name: 'North Wing', type: 'Orchard', size: '12.5 Acres', status: 'In Use', team: 'Alpha Squad', soilQuality: 'Prime' },
  { id: 'AREA-02', name: 'South Sector', type: 'Vineyard', size: '8.2 Acres', status: 'Idle', team: 'Beta Team', soilQuality: 'Moderate' },
  { id: 'AREA-03', name: 'Greenhouse B', type: 'Nursery', size: '2.4 Acres', status: 'Maintenance', team: 'Staff', soilQuality: 'Controlled' },
  { id: 'AREA-04', name: 'East Ridge', type: 'Grazing', size: '45.0 Acres', status: 'In Use', team: 'Harvest Group', soilQuality: 'Natural' },
];

export function WorkAreasPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Map className="w-8 h-8 text-indigo-600" />
            Operational Areas
          </h1>
          <p className="text-slate-500 mt-1">Geospatial management of your fields, facilities, and plots</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200 shadow-sm">
            <Layers className="w-4 h-4" />
            Layer Settings
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                <Plus className="w-4 h-4" />
                Define New Area
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Geospatial Mapping</DialogTitle>
                <DialogDescription>Define a new operational zone for workforce tracking.</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                const fd = new FormData(e.target);
                try {
                  if (!isConfigured) { toast.info('Local Mode: Sync disabled'); return; }
                  await api.post('/areas', {
                    name: fd.get('name'),
                    type: fd.get('type'),
                    size: fd.get('size'),
                    status: 'Idle',
                    id: `AREA-${Math.floor(10 + Math.random() * 89)}`
                  });
                  toast.success('Area defined in system');
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setIsAdding(false);
                }
              }}>
                <div className="grid gap-4 py-4">
                  <Input name="name" placeholder="Plot / Zone Name" required />
                  <select name="type" className="h-10 rounded-md border border-slate-200 px-3 text-sm">
                    <option value="Orchard">Orchard</option>
                    <option value="Vineyard">Vineyard</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Grazing">Grazing</option>
                  </select>
                  <Input name="size" placeholder="Total Area Size (e.g. 15 Acres)" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-indigo-600 w-full" disabled={isAdding}>
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Area Mapping'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-[400px] w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://api.placeholder.com/1200/800')]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <Map className="w-48 h-48" />
              </div>
            </div>
            
            {/* Map UI Elements */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm border border-white/20 flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700"><Plus className="w-4 h-4" /></Button>
                <div className="h-px bg-slate-200 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700"><Maximize2 className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-white/50">
              <div className="flex items-center gap-2 px-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-xs font-bold text-slate-700">Area-01</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 px-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-xs font-bold text-slate-700">Area-02</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-100 shadow-sm border-b-4 border-b-indigo-500">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><TreePine className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Coverage</div>
                  <div className="text-lg font-bold text-slate-900">68.1 Acres</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-100 shadow-sm border-b-4 border-b-emerald-500">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Droplets className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Irrigation Status</div>
                  <div className="text-lg font-bold text-slate-900">Optimal</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-100 shadow-sm border-b-4 border-b-amber-500">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Mountain className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Terrain Zones</div>
                  <div className="text-lg font-bold text-slate-900">4 Active</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Filter area list..." 
              className="pl-9 bg-white border-slate-200 h-10 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sampleAreas.map((area) => (
              <Card key={area.id} className="group hover:bg-slate-50 transition-all cursor-pointer border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <h4 className="font-bold text-slate-900 text-sm">{area.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">{area.type}</span>
                        <span>•</span>
                        <span>{area.size}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] border-none ${
                        area.status === 'In Use' ? 'bg-indigo-50 text-indigo-600' : 
                        area.status === 'Idle' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {area.status}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {area.team}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
