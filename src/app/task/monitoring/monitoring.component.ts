import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
})
export class MonitoringComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  tasks: any;
  percentage: string = '';
  percentageArray: any = [];

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((response) => {
      this.tasks = response;

      this.tasks.forEach((element: any) => {
        const taskDone = element.steps.reduce(
          (a: any, item: any) => a + (item.done === true ? 1 : 0),
          0
        );
        const percentage = `${Math.floor(
          (taskDone / element.steps.length) * 100
        )}%`;
        this.percentageArray.push(percentage);
      });
    });
  }
}
