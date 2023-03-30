import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { BoardComponent } from './board/board.component';
import { TaskRoutingModule } from './task-routing.module';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    TaskComponent,
    BoardComponent,
    MonitoringComponent,
    CreateTaskComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskRoutingModule,
  ],
})
export class TaskModule {}
