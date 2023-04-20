import { Address } from '../../../../shared/models/address.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule, TranslateModule.forRoot()],
      declarations: [ContactsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    component.address = { codeficatorAddressDto: {} } as Address;
    component.contactsData = {} as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
