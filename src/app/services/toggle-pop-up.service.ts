import { Injectable } from "@angular/core";

export interface PopUpState {
    state: number
}
 
export enum PopUpStateEnum {
   POP_UP_ADD_NEW_DATASET =  0,
   HIDDEN = -1
}

@Injectable({
    providedIn: 'root'
})
export class TogglePopUPService{

    private readonly POP_UP_KEY = 'pop_up_state';

    constructor() { }
  
    
    savePopupState(popUpState: PopUpState): void {
      localStorage.setItem(this.POP_UP_KEY, JSON.stringify(popUpState));
    }
  
    getPopupState(): PopUpState | null {
      const stateString = localStorage.getItem(this.POP_UP_KEY);
      return stateString ? JSON.parse(stateString) : null;
    }
   
    clearRole(): void {
      localStorage.removeItem(this.POP_UP_KEY);
    }

}