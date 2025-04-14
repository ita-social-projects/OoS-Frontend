import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileWaitingPageComponent } from './profile-waiting-page.component';

describe('ProfileWaitingPageComponent', () => {
  let component: ProfileWaitingPageComponent;
  let fixture: ComponentFixture<ProfileWaitingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProfileWaitingPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileWaitingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
