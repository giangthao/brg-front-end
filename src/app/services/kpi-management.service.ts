import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KPIManagementService {
  nameValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbiddenCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
      const maxLengthExceeded = control.value && control.value.length > 255;
      const containWhitespace = /^\s/.test(control.value) || /\s$/.test(control.value);

      if (maxLengthExceeded) {
        return { maxlength: true };
      }

      if (forbiddenCharacters) {
        return { forbiddenCharacter: true };
      }

      if(containWhitespace) {
        return { whitespace: true };
      }
  
      return null;
    };
  }

  checkNameExists(name: string): Observable<boolean> {
    const listKPIName = ['abc', 'abcd', '1', 'dataset', 'rule', 'kpi']
    const nameExists =  listKPIName.includes(name.toLowerCase());
    console.log(nameExists)
    return of(nameExists);
  }
}
