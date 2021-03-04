export class SetLocation {
<<<<<<< HEAD
    static readonly type = '[location] set geolocation';
    constructor(public payload: {city: String, lng: Number, lat: Number}) {}
  }
export class getCards {
  static readonly type = '[user] gets child cards';
  constructor(){}
}
=======
  static readonly type = '[location] set geolocation';
  constructor(public payload: {city: String, lng: Number, lat: Number}) {}
}

export class GetChildrenActivitiesList {
  static readonly type = '[location] get children activities list';
}
>>>>>>> develop
