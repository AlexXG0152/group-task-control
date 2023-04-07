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

  onCheckboxChange(event: any) {
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
    const steps = this.stepForm.get('steps') as FormArray;
    steps.push(this.createStepFormGroup());
  }

  public removeOrClearStep(i: number) {
    const steps = this.stepForm.get('steps') as FormArray;
    if (steps.length > 1) {
      steps.removeAt(i);
    } else {
      steps.reset();
    }
  }

  private createStepFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    });
  }

  private createTaskFormGroup(): FormGroup {
    return new FormGroup({
      taskName: new FormControl(''),
      taskDescription: new FormControl(''),
      taskStartDate: new FormControl(''),
      taskPlanFinishDate: new FormControl(''),
    });
  }

  get aliasesArrayControl() {
    return (this.stepForm.get('steps') as FormArray).controls;
  }

  get aliasesTaskArrayControl() {
    return (this.taskForm.get('taskData') as FormArray).controls;
  }

  save() {
    if (
      this.taskForm.valid &&
      this.organizationsForm.valid &&
      this.stepForm.valid
    ) {
      const formData = {
        ...this.taskForm.value,
        ...this.organizationsForm.value,
        ...this.stepForm.value,
      };
      console.log(formData);
      this.taskService.createTask(formData);
    } else {
      this.taskForm.markAllAsTouched();
      this.organizationsForm.markAllAsTouched();
      this.stepForm.markAllAsTouched();
    }
  }
}
