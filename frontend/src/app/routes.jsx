import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { EmployeesPage } from './components/EmployeesPage';
import { Dashboard } from './components/Dashboard';
import { Placeholder } from './components/Placeholder';
import { TeamsPage } from './components/TeamsPage';
import { WorkAssignmentsPage } from './components/WorkAssignmentsPage';
import { PetrolPage } from './components/PetrolPage';
import { GroupsPage } from './components/GroupsPage';
import { AdvanceRegisterPage } from './components/AdvanceRegisterPage';
import { AttendancePage } from './components/AttendancePage';
import { WorkCalendarPage } from './components/WorkCalendarPage';
import { MachinesPage } from './components/MachinesPage';
import { ClientsPage } from './components/ClientsPage';
import { WorkAreasPage } from './components/WorkAreasPage';
import { SalaryPage } from './components/SalaryPage';
import { LedgerPage } from './components/LedgerPage';
import { CompanySettingsPage } from './components/CompanySettingsPage';
import { RolesPage } from './components/RolesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'employees', Component: EmployeesPage },
      { path: 'groups', Component: GroupsPage },
      { path: 'teams', Component: TeamsPage },
      { path: 'work-assignments', Component: WorkAssignmentsPage },
      { path: 'petrol', Component: PetrolPage },
      { path: 'attendance', Component: AttendancePage },
      { path: 'time-tracking', Component: WorkCalendarPage },
      { path: 'machines', Component: MachinesPage },
      { path: 'clients', Component: ClientsPage },
      { path: 'work-areas', Component: WorkAreasPage },
      { path: 'salary-calculation', Component: SalaryPage },
      { path: 'advance-register', Component: AdvanceRegisterPage },
      { path: 'ledger', Component: LedgerPage },
      { path: 'company', Component: CompanySettingsPage },
      { path: 'roles', Component: RolesPage },
      { path: '*', Component: Placeholder },
    ],
  },
]);

