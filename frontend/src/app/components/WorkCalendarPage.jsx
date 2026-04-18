import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, MapPin, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function WorkCalendarPage() {
  const [currentDate] = useState(new Date(2024, 9, 25)); // Oct 2024

  // Mock calendar data
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = {
    15: { type: 'Maintenance', team: 'Staff', color: 'bg-amber-100 text-amber-700' },
    22: { type: 'Harvest', team: 'Alpha', color: 'bg-emerald-100 text-emerald-700' },
    25: { type: 'Inspection', team: 'Beta', color: 'bg-indigo-100 text-indigo-700' },
    28: { type: 'Training', team: 'All', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-600" />
            Work Calendar
          </h1>
          <p className="text-slate-500 mt-1">Plan and coordinate team schedules and field events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-1 flex shadow-sm">
            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-md bg-indigo-50 text-indigo-600 font-bold">Month</Button>
            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-md text-slate-500">Week</Button>
            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-md text-slate-500">Day</Button>
          </div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-xl font-bold text-slate-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 bg-white">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="h-8 px-4 border-slate-200 bg-white font-semibold">Today</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 bg-white">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {days.map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-l border-t border-slate-100">
            {/* Blank days for padding */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`blank-${i}`} className="h-32 border-r border-b border-slate-100 bg-slate-50/30" />
            ))}
            
            {calendarDays.map(day => {
              const event = events[day];
              const isToday = day === 25;
              return (
                <div key={day} className={`h-32 p-3 border-r border-b border-slate-100 transition-colors hover:bg-slate-50 cursor-pointer group`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isToday ? 'w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center' : 'text-slate-600'}`}>
                      {day}
                    </span>
                    {event && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />}
                  </div>
                  {event && (
                    <div className={`text-[10px] font-bold p-1.5 rounded-md ${event.color} border border-transparent shadow-sm truncate`}>
                      {event.type}: {event.team}
                    </div>
                  )}
                </div>
              );
            })}

            {/* End padding */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`end-blank-${i}`} className="h-32 border-r border-b border-slate-100 bg-slate-50/30" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-indigo-50 bg-indigo-50/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Upcoming Today
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm">
                  <div className="text-xs font-bold text-indigo-600 mb-1">10:00 AM - 12:30 PM</div>
                  <h4 className="text-sm font-bold text-slate-800">Field Irrigation Audit</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-3 h-3" />
                      Section A
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Users className="w-3 h-3" />
                      Alpha Team
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm opacity-70">
                  <div className="text-xs font-bold text-emerald-600 mb-1">02:00 PM - 04:00 PM</div>
                  <h4 className="text-sm font-bold text-slate-800">Seedling Transfer</h4>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Greenhouse 2
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="link" className="w-full mt-4 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                Full Agenda View
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Reminders</span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-none">3 Pending</Badge>
            </div>
            <CardContent className="p-4 bg-slate-50/80">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-400" />
                    <div className="text-[11px] text-slate-700 leading-tight">
                      Equipment maintenance logs due by end of month.
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
