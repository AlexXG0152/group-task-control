import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { TaskComponent } from './task/task.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BoardComponent,
    canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: ':id',
    //     component: TaskComponent,
    //   },
    // ],
  },
  {
    path: 'tasks/:id',
    pathMatch: 'full',
    component: TaskComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
