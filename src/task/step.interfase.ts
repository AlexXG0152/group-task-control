export interface IStep {
  stepNumber: number;
  name: string;
  desc?: string;
  done?: boolean;
  doneAt?: Date;
  comment?: string;
  finishedUserID?: string;
}
