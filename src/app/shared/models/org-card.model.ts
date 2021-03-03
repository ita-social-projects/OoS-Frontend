export interface orgCard {
  id: 0,
  title: string,
  phone: string,
  email: string,
  website: string,
  facebook: string,
  instagram: string,
  minAge: 0,
  maxAge: 0,
  daysPerWeek: 0,
  price: 0,
  description: string,
  withDisabilityOptions: true,
  disabilityOptionsDesc: string,
  image: string,
  head: string,
  headBirthDate: number,
  category: {
    id: 0,
    title: string,
    subcategories: [
      {
        id: 0,
        title: string
      }
    ]
  },
  address: {
    id: 0,
    region: string,
    district: string,
    city: string,
    street: string,
    building: string,
    latitude: 0,
    longitude: 0
  },
  organization: {
    id: 0,
    title: string,
    phone: string,
    website: string,
    facebook: string,
    instagram: string,
    description: string,
    mfo: string,
    edrpou: string,
    inpp: string,
    image: string,
    userId: 0,
    type: 0
  },
  teachers: [
    {
      id: 0,
      firstName: string,
      lastName: string,
      middleName: string,
      description: string,
      image: string,
    }
  ]
}