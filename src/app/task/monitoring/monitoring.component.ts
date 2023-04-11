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

      this.tasks.forEach((element: any, i: any) => {
        element?.performers?.forEach((info: any, j: any) => {
          const percentage = `${Math.floor(
            (info.steps.reduce(
              (a: any, item: any) => a + (item.done === true ? 1 : 0),
              0
            ) /
              info.steps.length) *
              100
          )}%`;
          this.percentageArray[i] = {
            ...this.percentageArray[i],
            [j]: percentage,
          };
        });
      });
    });
  }
}
