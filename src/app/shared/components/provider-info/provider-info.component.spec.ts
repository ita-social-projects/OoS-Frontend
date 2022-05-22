import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Provider } from '../../models/provider.model';
import { PhoneTransformPipe } from '../../pipes/phone-transform.pipe';

import { ProviderInfoComponent } from './provider-info.component';

describe('ProviderInfoComponent', () => {
  let component: ProviderInfoComponent;
  let fixture: ComponentFixture<ProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule,
        MatTabsModule,
        BrowserAnimationsModule,
      ],
      declarations: [ProviderInfoComponent, PhoneTransformPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderInfoComponent);
    component = fixture.componentInstance;
    component.provider = {} as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
