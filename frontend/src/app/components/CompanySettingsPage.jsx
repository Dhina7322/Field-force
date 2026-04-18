import { useState } from 'react';
import { Settings, Building2, MapPin, Globe, Phone, Mail, Camera, ShieldCheck, CreditCard, Bell, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Security', 'Billing', 'Notifications'];

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-600" />
            Company Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your organization's core information and preferences</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all
                  ${activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-100'
                  }`}
              >
                {tab === 'General' && <Building2 className="w-4 h-4" />}
                {tab === 'Security' && <ShieldCheck className="w-4 h-4" />}
                {tab === 'Billing' && <CreditCard className="w-4 h-4" />}
                {tab === 'Notifications' && <Bell className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-none mb-3">Enterprise</Badge>
                <div className="text-sm font-bold mb-1">FieldForce Pro</div>
                <div className="text-[10px] text-slate-400 mb-4 tracking-wider uppercase">Next Renewal: Dec 2024</div>
                <Button variant="secondary" className="w-full text-xs font-bold h-8">Manage Plan</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Public information about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 group-hover:border-indigo-400 transition-colors">
                        <Building2 className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Company Logo</h4>
                    <p className="text-xs text-slate-500 max-w-xs">Recommended size 400x400px. PNG, JPG or SVG format.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Green Valley Agricultural Co." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyLegId">Registry ID / EIN</Label>
                  <Input id="companyLegId" defaultValue="99-88776655" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="website" className="pl-9" defaultValue="www.greenvalley.ag" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="email" className="pl-9" defaultValue="hq@greenvalley.ag" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Official Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    id="address" 
                    className="w-full pl-9 pt-2 text-sm bg-white border border-slate-200 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    defaultValue="1200 Field View Road, Emerald Valley, CA 90210, USA"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-900 text-lg">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your company account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-xl">
                <div>
                    <div className="text-sm font-black text-slate-900">Deactivate Organization</div>
                    <div className="text-xs text-slate-500 mt-1">This will pause all services and access immediately.</div>
                </div>
                <Button variant="destructive" className="font-bold text-xs h-9">Archive Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
