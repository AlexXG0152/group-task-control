import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BoardComponent,
    children: [
      {
        path: ':id',
        component: TaskComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
