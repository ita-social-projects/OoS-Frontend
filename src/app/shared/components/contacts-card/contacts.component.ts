import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { Store } from '@ngxs/store';
import { Workshop } from '../../../shared/models/workshop.model';
import { Provider } from '../../../shared/models/provider.model';

@Component({
  selector: 'app-contacts-card',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsCardComponent implements OnInit {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  constructor(private store: Store) {}
  public contacts: any = [];
  public panelOpenState = false;
  private addressLink = 'https://www.google.com/maps/place/';
  public mockData = [
    {
      title: 'string',
      isDefault: true,
      address: {
        street: 'string',
        buildingNumber: 'string',
        latitude: 0,
        longitude: 0,
        catottgId: 0,
        codeficatorAddressDto: {
          id: 0,
          category: 'string',
          region: 'string',
          district: 'string',
          territorialCommunity: 'string',
          settlement: 'string',
          cityDistrict: 'string',
          latitude: 0,
          longitude: 0,
          order: 0,
          fullName: 'string',
          fullAddress: 'string'
        }
      },
      phones: [
        {
          type: 'string',
          number: '123345'
        },
        {
          type: 'string',
          number: '4564567578'
        },
        {
          type: 'string',
          number: '3453453453'
        }
      ],
      emails: [
        {
          type: 'Director',
          address: 'user@example.com'
        },
        {
          type: 'manager',
          address: 'user@example.com'
        },
        {
          type: 'educator',
          address: 'user@example.com'
        }
      ],
      socialNetworks: [
        {
          type: 'Instagram',
          url: 'string'
        },
        {
          type: 'Telegram',
          url: 'string'
        },
        {
          type: 'X',
          url: 'string'
        },
        {
          type: 'Facebook',
          url: 'string'
        }
      ]
    },
    {
      title: 'string',
      isDefault: true,
      address: {
        street: 'string',
        buildingNumber: 'string',
        latitude: 0,
        longitude: 0,
        catottgId: 0,
        codeficatorAddressDto: {
          id: 0,
          category: 'string',
          region: 'string',
          district: 'string',
          territorialCommunity: 'string',
          settlement: 'string',
          cityDistrict: 'string',
          latitude: 0,
          longitude: 0,
          order: 0,
          fullName: 'string',
          fullAddress: 'string'
        }
      },
      phones: [
        {
          type: 'string',
          number: '123345'
        },
        {
          type: 'string',
          number: '4564567578'
        },
        {
          type: 'string',
          number: '00000000000000000000000'
        }
      ],
      emails: [
        {
          type: 'Director',
          address: 'user@example.com'
        },
        {
          type: 'manager',
          address: 'user@example.com'
        },
        {
          type: 'educator',
          address: 'user@example.com'
        }
      ],
      socialNetworks: [
        {
          type: 'Instagram',
          url: 'string'
        },
        {
          type: 'Telegram',
          url: 'string'
        },
        {
          type: 'X',
          url: 'string'
        },
        {
          type: 'Facebook',
          url: 'string'
        }
      ]
    }
  ];

  public getFullAddress(address: Address): string {
    const { street, buildingNumber, codeficatorAddressDto } = address;
    const settlement = codeficatorAddressDto?.settlement ?? '';
    return `${settlement}, ${street ?? ''}, ${buildingNumber ?? ''}`.trim();
  }

  public ngOnInit(): void {
    this.getContactsData();
  }
  private getContactsData(): void {
    this.contacts = this.store.selectSnapshot((store) => store.user.selectedWorkshop?.contacts);
  }

  public mapLink(address: Address): void {
    const { street, buildingNumber, codeficatorAddressDto } = address;
    const fullAddress = codeficatorAddressDto?.fullAddress ?? '';
    const formattedAddress = [street, buildingNumber, fullAddress].filter((part) => part).join(', ');
    let addressLink = 'https://www.google.com/maps/search/?api=1&query=';
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      addressLink = 'https://maps.apple.com/?q=';
    } else if (/Android/i.test(navigator.userAgent)) {
      addressLink = 'geo:0,0?q=';
    }

    window.open(`${addressLink}${encodeURIComponent(formattedAddress)}`, '_blank');
  }
}
