import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { JudgeFormComponent } from './judge-form.component';

describe('JudgeFormComponent', () => {
  let fixture: ComponentFixture<JudgeFormComponent>;
  let component: JudgeFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JudgeFormComponent],
      imports: [TranslateModule.forRoot()]
    });

    fixture = TestBed.createComponent(JudgeFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
