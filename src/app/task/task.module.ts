import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { BoardComponent } from './board/board.component';
import { TaskRoutingModule } from './task-routing.module';

@NgModule({
  declarations: [TaskComponent, BoardComponent],
  imports: [CommonModule, TaskRoutingModule],
})
export class TaskModule {}
