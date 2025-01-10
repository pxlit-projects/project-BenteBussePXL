// reject-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.css'],
})
export class RejectDialogComponent {
  rejectForm = new FormGroup({
    comment: new FormControl('', [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<RejectDialogComponent>
  ) {}

  onSubmit(): void {
    if (this.rejectForm.valid) {
      this.dialogRef.close(this.rejectForm.value.comment);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}