import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(private taskService: TaskService, private auth: AuthService) {}

  tasks: any;

  ngOnInit(): void {
    this.taskService
      .getTask('6409b3cb2ea882147bdd0762')
      .subscribe((data) => (this.tasks = JSON.stringify(data)));
  }
}
