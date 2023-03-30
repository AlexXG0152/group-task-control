import { Component } from '@angular/core';
import {
  FormArray,
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  public taskForm!: FormGroup;
  public stepForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      data: this.formBuilder.array([this.createTaskFormGroup()]),
    });

    this.stepForm = this.formBuilder.group({
      steps: this.formBuilder.array([this.createStepFormGroup()]),
    });
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
      taskOrganizations: new FormControl(''),
      taskStartDate: new FormControl(''),
      taskPlanFinishDate: new FormControl(''),
    });
  }

  get aliasesArrayControl() {
    return (this.stepForm.get('steps') as FormArray).controls;
  }

  get aliasesTaskArrayControl() {
    return (this.taskForm.get('data') as FormArray).controls;
  }

  save() {
    if (this.taskForm.valid && this.stepForm.valid) {
      console.log(this.taskForm.value);
      console.log(this.stepForm.value);
    } else {
      this.taskForm.markAllAsTouched();
      this.stepForm.markAllAsTouched();
    }
  }

  // form = this.fb.group({
  //   // ... other form controls ...
  //   lessons: this.fb.array([]),
  // });

  // constructor(private fb: FormBuilder) {}

  // get lessons() {
  //   return (this.form.controls['lessons'] as FormArray).controls as FormGroup[];
  // }

  // addLesson() {
  //   const lessonForm = this.fb.group({
  //     title: ['', Validators.required],
  //     level: ['beginner', Validators.required],
  //   });
  //   this.lessons.push(lessonForm);
  // }

  // // deleteLesson(lessonIndex: number) {
  // //   this.lessons.removeAt(lessonIndex);
  // // }

  // formArray=new FormArray([]);

  // getFormGroup(data: any) {
  //   data = data || ({} as any);
  //   return new FormGroup({
  //     id: new FormControl(data.id),
  //     name: new FormControl(data.name, Validators.required),
  //     fromDate: new FormControl(data.fromDate),
  //     fromTime: new FormControl(data.fromTime),
  //     toDate: new FormControl(data.toDate),
  //     toTime: new FormControl(data.toTime),
  //     selectedSupervisor2: new FormControl(data.selectedSupervisor2),
  //     selectedLeave2: new FormControl(data.selectedLeave2)
  //   }) as unknown as FormArray;
  // }
  // save(formArray:FormArray)
  // {
  //   if (formArray.valid)
  //   {
  //     console.log(formArray.value)
  //   }
  //   else
  //     formArray.markAllAsTouched();

  // }
}
