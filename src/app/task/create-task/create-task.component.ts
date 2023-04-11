import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  FormArray,
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { OrganizationService } from 'src/app/services/organization.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  public taskForm!: FormGroup;
  public stepForm!: FormGroup;
  public organizationsForm!: FormGroup;
  public organizationsList$: any;

  constructor(
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.organizationsList$ = this.organizationService.getOrganizations();
    this.organizationsForm = this.formBuilder.group({
      selectedOrganizations: new FormArray([]),
    });

    this.taskForm = this.formBuilder.group({
      taskData: this.formBuilder.array([this.createTaskFormGroup()]),
    });

    this.stepForm = this.formBuilder.group({
      steps: this.formBuilder.array([this.createStepFormGroup()]),
    });
  }

  public onCheckboxChange(event: any) {
    const selectedOrganizations = this.organizationsForm.controls[
      'selectedOrganizations'
    ] as FormArray;
    if (event.target.checked) {
      selectedOrganizations.push(new FormControl(event.target.value));
    } else {
      const index = selectedOrganizations.controls.findIndex(
        (x) => x.value === event.target.value
      );
      selectedOrganizations.removeAt(index);
    }
    // https://edupala.com/how-to-implement-angular-checkbox-input/
  }

  public addStepFormGroup() {
    const step = this.stepForm.get('steps') as FormArray;
    step.push(this.createStepFormGroup());
  }

  public removeOrClearStep(i: number) {
    const step = this.stepForm.get('steps') as FormArray;
    if (step.length > 1) {
      step.removeAt(i);
    } else {
      step.reset();
    }
  }

  private createStepFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      desc: new FormControl(''),
    });
  }

  private createTaskFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      planFinishDate: new FormControl(''),
    });
  }

  get aliasesArrayControl() {
    return (this.stepForm.get('steps') as FormArray).controls;
  }

  get aliasesTaskArrayControl() {
    return (this.taskForm.get('taskData') as FormArray).controls;
  }

  public save(): any {
    if (
      this.taskForm.valid &&
      this.organizationsForm.valid &&
      this.stepForm.valid
    ) {
      let i = 1;
      for (const key in this.stepForm.value.steps) {
        if (
          Object.prototype.hasOwnProperty.call(this.stepForm.value.steps, key)
        ) {
          this.stepForm.value.steps[key].stepNumber = i;
          this.stepForm.value.steps[key].done = false;
          this.stepForm.value.steps[key].doneAt = null;
          this.stepForm.value.steps[key].comment = null;
          this.stepForm.value.steps[key].finishedUserID = null;
          i++;
        }
      }
      const formData = {
        ...this.taskForm.value.taskData[0],
        ...this.stepForm.value,
        organizationID: this.organizationsForm.value.selectedOrganizations,
      };

      return this.taskService.createTask(formData).subscribe();
    } else {
      this.taskForm.markAllAsTouched();
      this.organizationsForm.markAllAsTouched();
      this.stepForm.markAllAsTouched();
    }
  }
}
