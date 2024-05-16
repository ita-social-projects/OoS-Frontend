import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ImportProvidersComponent } from './import-providers.component';

describe('ImportProvidersComponent', () => {
  const providers = [
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: '12345678',
      licenseNumber: 123445,
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      elem: {},
      id: 1
    }
  ];
  let component: ImportProvidersComponent;
  let fixture: ComponentFixture<ImportProvidersComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportProvidersComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(ImportProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show Go Top button when scrolled past threshold', () => {
    const scrollPosition = component.topPosToStartShowing + 1;
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollPosition, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(component.isGoTopBtnVisible).toBe(true);
  });

  it('should hide Go Top button when scrolled above threshold', () => {
    const scrollPosition = component.topPosToStartShowing - 1;
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollPosition, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(component.isGoTopBtnVisible).toBe(false);
  });
  it('should call window.scroll with correct parameters when gotoTop is called', () => {
    const scrollSpy = jest.spyOn(window, 'scroll').mockImplementation(() => {});
    component.gotoTop();
    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    scrollSpy.mockRestore();
  });
  it('should reset values when resetValues is called', () => {
    component.dataSource = providers;
    component.dataSourceInvalid = providers;
    component.isToggle = true;
    component.isWarningVisible = true;
    component.resetValues();
    expect(component.dataSource).toBeNull();
    expect(component.dataSourceInvalid).toBeNull();
    expect(component.isToggle).toBe(false);
    expect(component.isWarningVisible).toBe(false);
  });
  it('should return true and cut the array when more than 100 providers', () => {
    const providersData = Array.from({ length: 150 }, (_, i) => providers[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(true);
    expect(providersData.length).toBe(100);
  });

  it('should return false and not cut the array when less than or equal to 100 providers', () => {
    const providersData = Array.from({ length: 100 }, (_, i) => providers[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(false);
    expect(providersData.length).toBe(100);
  });
  it('should return false and not cut the array when less than 100 providers', () => {
    const providersData = Array.from({ length: 50 }, (_, i) => providers[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(false);
    expect(providersData.length).toBe(50);
  });
});
