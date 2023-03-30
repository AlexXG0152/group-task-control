import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskComponent } from './task/task/task.component';
import { MonitoringComponent } from './task/monitoring/monitoring.component';
import { CreateTaskComponent } from './task/create-task/create-task.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'monitoring', component: MonitoringComponent },
  { path: 'createTask', component: CreateTaskComponent },
  { path: 'about', component: TaskComponent },
  {
    path: 'tasks',
    loadChildren: () => import('./task/task.module').then((m) => m.TaskModule),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
