interface UserData {
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  creatingTime: string;
  lastLogin: string;
}

interface ProviderAddress {
  region: string;
  district: string;
  city: string;
  street: string;
  buildingNumber: string;
  latitude: number;
  longitude: number;
}

export interface ProviderConfigData {
  title: string;
  shortTitle: string;
  website: string;
  facebook: string;
  instagram: string;
  description: string;
  mfo: string;
  edrpou: string;
  koatuu: string;
  inpp: string;
  director: string;
  directorPosition: string;
  authorityHolder: string;
  directorBirthDay: string;
  directorPhonenumber: string;
  managerialBody: string;
  ownership: number;
  type: number;
  form: string;
  profile: number;
  index: string;
  isSubmitPZ1: boolean;
  attachedDocuments: string;
  addressId: number;
  userId: string;
  user: object;
  address: object;
}

export class ProviderConfigAddress implements ProviderAddress {
  constructor(
    region: string,
    district: string,
    city: string,
    street: string,
    buildingNumber: string,
    latitude: number,
    longitude: number,
  ) {
    this.region = region;
    this.district = district;
    this.city = city;
    this.street = street;
    this.buildingNumber = buildingNumber;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  region: string;
  district: string;
  city: string;
  street: string;
  buildingNumber: string;
  latitude: number;
  longitude: number;
}

export class ProviderConfigModel implements ProviderConfigData {
  constructor(title: string,
              shortTitle: string,
              website: string,
              facebook: string,
              instagram: string,
              description: string,
              mfo: string,
              edrpou: string,
              koatuu: string,
              inpp: string,
              director: string,
              directorPosition: string,
              authorityHolder: string,
              directorBirthDay: string,
              directorPhonenumber: string,
              managerialBody: string,
              ownership: number,
              type: number,
              form: string,
              profile: number,
              index: string,
              isSubmitPZ1: boolean,
              attachedDocuments: string,
              addressId: number,
              userId: string,
              user: object,
              address: object
  ) {
    this.title = title;
    this.shortTitle = shortTitle;
    this.website = website;
    this.facebook = facebook;
    this.instagram = instagram;
    this.description = description;
    this.mfo = mfo;
    this.edrpou = edrpou;
    this.koatuu = koatuu;
    this.inpp = inpp;
    this.director = director;
    this.directorPosition = directorPosition;
    this.authorityHolder = authorityHolder;
    this.directorBirthDay = directorBirthDay;
    this.directorPhonenumber = directorPhonenumber;
    this.managerialBody = managerialBody;
    this.ownership = ownership;
    this.type = type;
    this.form = form;
    this.profile = profile;
    this.index = index;
    this.isSubmitPZ1 = isSubmitPZ1;
    this.attachedDocuments = attachedDocuments;
    this.addressId = addressId;
    this.userId = userId;
    this.user = user;
    this.address = address;
  }

  address: object;
  addressId: number;
  attachedDocuments: string;
  authorityHolder: string;
  description: string;
  director: string;
  directorBirthDay: string;
  directorPhonenumber: string;
  directorPosition: string;
  edrpou: string;
  facebook: string;
  form: string;
  index: string;
  inpp: string;
  instagram: string;
  isSubmitPZ1: boolean;
  koatuu: string;
  managerialBody: string;
  mfo: string;
  ownership: number;
  profile: number;
  shortTitle: string;
  title: string;
  type: number;
  user: object;
  userId: string;
  website: string;
}

export class ProviderConfigUser implements UserData {
  constructor(
    userName: string,
    normalizedUserName: string,
    email: string,
    normalizedEmail: string,
    emailConfirmed: boolean,
    passwordHash: string,
    securityStamp: string,
    concurrencyStamp: string,
    phoneNumber: string,
    phoneNumberConfirmed: boolean,
    twoFactorEnabled: boolean,
    lockoutEnd: string,
    lockoutEnabled: boolean,
    accessFailedCount: number,
    creatingTime: string,
    lastLogin: string) {
    this.userName = userName;
    this.normalizedUserName = normalizedUserName;
    this.email = email;
    this.normalizedEmail = normalizedEmail;
    this.emailConfirmed = emailConfirmed;
    this.passwordHash = passwordHash;
    this.securityStamp = securityStamp;
    this.concurrencyStamp = concurrencyStamp;
    this.phoneNumber = phoneNumber;
    this.phoneNumberConfirmed = phoneNumberConfirmed;
    this.twoFactorEnabled = twoFactorEnabled;
    this.lockoutEnd = lockoutEnd;
    this.lockoutEnabled = lockoutEnabled;
    this.accessFailedCount = accessFailedCount;
    this.creatingTime = creatingTime;
    this.lastLogin = lastLogin;
  }

  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  creatingTime: string;
  lastLogin: string;
}






