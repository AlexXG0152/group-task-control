import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [
    TaskComponent,
    BoardComponent
  ],
  imports: [CommonModule],
})
export class TaskModule {}
