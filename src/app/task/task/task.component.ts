import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  id: string = '';
  task: any;
  percentage: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });

    this.task = this.taskService.getTask(this.id).subscribe((response) => {
      this.task = response;
      const done = this.task.steps.reduce((a: any, item: any) => a + (item.done === true ? 1 : 0), 0)
      this.percentage = `${Math.floor(done / this.task.steps.length * 100)}%`;
    });
  }

  onBackClick() {
    this.router.navigate(['/tasks']);
  }

  onFinishStepClick(id: string, stepNumber: string) {
    const data = {
      stepNumber,
      done: true,
      doneAt: new Date().toISOString(),
      comment: 'none',
    };
    return this.taskService.updateTask(id, data).subscribe();
  }
}
