import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateApplicationComponent } from './create-application.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatInputModule } from '@angular/material/input';
import { Component, Input } from '@angular/core';
import { cardType } from 'src/app/shared/enum/role';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

describe('CreateApplicationComponent', () => {
  let component: CreateApplicationComponent;
  let fixture: ComponentFixture<CreateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatTabsModule,
        RouterTestingModule,
        MatCardModule,
        MatDialogModule
      ],
      declarations: [
        CreateApplicationComponent,
        MockPersonCardComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-person-card',
  template: ''
})
class MockPersonCardComponent {
  @Input() card;
  @Input() cardType: cardType;
}
