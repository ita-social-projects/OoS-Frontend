import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Constants } from 'shared/constants/constants';
import { JudgeCardComponent } from './judge-card.component';

jest.mock('shared/utils/utils', () => ({
  Utils: {
    getFullName: jest.fn()
  }
}));
describe('JudgeCardComponent', () => {
  let component: JudgeCardComponent;
  let fixture: ComponentFixture<JudgeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JudgeCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(JudgeCardComponent);
    component = fixture.componentInstance;
  });
  it('it should create component', () => {
    expect(component).toBeTruthy();
  });

  it('it should set correct tooltipPosition', () => {
    expect(component.tooltipPosition).toBe(Constants.MAT_TOOL_TIP_POSITION_BELOW);
  });
});
