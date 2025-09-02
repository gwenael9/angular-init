import { Routes } from '@angular/router';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
