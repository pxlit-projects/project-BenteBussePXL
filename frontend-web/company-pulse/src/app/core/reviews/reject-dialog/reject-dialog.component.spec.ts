import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectDialogComponent } from './reject-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('RejectDialogComponent', () => {
  let component: RejectDialogComponent;
  let fixture: ComponentFixture<RejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RejectDialogComponent,
        CommonModule,          
      ],
      providers: [
        {
          provide: MatDialogRef, 
          useValue: jasmine.createSpyObj('MatDialogRef', ['close']),
        },
        provideAnimations()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
