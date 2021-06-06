import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderConfigComponent } from './provider-config.component';
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../shared/models/user.model';

describe('ProviderConfigComponent', () => {
  let component: ProviderConfigComponent;
  let fixture: ComponentFixture<ProviderConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [ ProviderConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
