import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Provider } from '../../../../shared/models/provider.model';
import { ProviderAboutComponent } from './provider-about.component';

describe('ProviderAboutComponent', () => {
  let component: ProviderAboutComponent;
  let fixture: ComponentFixture<ProviderAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProviderAboutComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAboutComponent);
    component = fixture.componentInstance;
    component.provider = {} as Provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
