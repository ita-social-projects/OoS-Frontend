export interface actCard {
    id: number,
    title: string,
    phone: string,
    email: string,
    website: string,
    facebook: string,
    instagram: string,
    minAge: number,
    maxAge: number,
    daysPerWeek: number,
    price: number,
    description: string,
    withDisabilityOptions: true,
    disabilityOptionsDesc: string,
    image: string,
    head: string,
    headBirthDate: number,
    category: {
      id: number,
      title: string,
      subcategories: [
        {
          id: number,
          title: string
        }
      ]
    },
    address: {
      id: number,
      region: string,
      district: string,
      city: string,
      street: string,
      building: string,
      latitude: number,
      longitude: number
    },
    organization: {
      id: number,
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
      userId: number,
      type: number
    },
    teachers: [
      {
        id: number,
        firstName: string,
        lastName: string,
        middleName: string,
        description: string,
        image: string,
      }
    ]
  }