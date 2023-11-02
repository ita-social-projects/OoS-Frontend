import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { MessagesComponent } from './messages.component';
import { Component, Input } from '@angular/core';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesComponent, MockNoResultCardComponent],
      imports: [
        MatDialogModule, 
        NgxsModule.forRoot([]), 
        TranslateModule.forRoot(), 
        MatIconModule, 
        FormsModule, 
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    component.filterFormControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


@Component({
  selector: 'app-no-result-card',
  template: ''
})
class MockNoResultCardComponent {
  @Input() public title: string;
}
