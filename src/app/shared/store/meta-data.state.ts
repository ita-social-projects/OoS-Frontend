import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CityList } from './meta-data.actions';


export interface MetaDataStateModel {
    filteredCities:string[];
}

@State<MetaDataStateModel>({
    name: 'metaDataState',
    defaults: {
        filteredCities: []
    }
    
})
@Injectable()
export class MetaDataState {

    @Selector()
    static filteredCities(state: MetaDataStateModel) {
        return state.filteredCities;
    }
    @Action(CityList)
    cityList({ patchState }: StateContext<MetaDataStateModel>, { payload }: CityList): void {
        patchState({ filteredCities: payload});
    }
    
}
