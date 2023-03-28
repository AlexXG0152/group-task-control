import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  tasks$: any;

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks();
  }
}
