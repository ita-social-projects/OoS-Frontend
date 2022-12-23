import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { EntityCheckboxDropdownComponent } from './entity-checkbox-dropdown.component';
import { TranslateCasesPipe } from '../../pipes/translate-cases.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('EntityCheckboxDropdownComponent', () => {
  let component: EntityCheckboxDropdownComponent;
  let fixture: ComponentFixture<EntityCheckboxDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [TranslateService],
      declarations: [EntityCheckboxDropdownComponent, TranslateCasesPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
