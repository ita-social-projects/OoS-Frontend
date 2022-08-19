import { Address } from './../../../../shared/models/address.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { Workshop } from '../../../../shared/models/workshop.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../shared/modules/material.module';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule],
      declarations: [ContactsComponent],
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
