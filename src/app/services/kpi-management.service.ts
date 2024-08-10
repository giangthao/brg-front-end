import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Group, GroupItem } from '../share/components/kpi-form/kpi-form.default';

@Injectable({
  providedIn: 'root',
})
export class KPIManagementService {
  nameValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbiddenCharacters = control.value &&  /[!@#$%^&*(),.?":{}|<>]/.test(control.value.trim());
      const maxLengthExceeded = control.value && control.value.trim().length > 255;
      const containWhitespace = control.value && control.value.trim() === '';

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

  checkNameExists(name: string, kpiEditNameInstant?: string ): Observable<boolean> {
    const listKPIName = ['abc', 'abcd', '1', 'dataset', 'rule', 'kpi'];
    let nameExists =  listKPIName.includes(name.toLowerCase());
    if(kpiEditNameInstant && kpiEditNameInstant.toLowerCase() === name.trim().toLowerCase()) {
      nameExists = false;
    }
    console.log(nameExists)
    return of(nameExists);
  }

  unitValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
     
      const maxLengthExceeded = control.value && control.value.trim().length > 100;
      const containWhitespace = control.value && control.value.trim() === '';

      if (maxLengthExceeded) {
        return { maxlength: true };
      }

      if(containWhitespace) {
        return { whitespace: true };
      }
  
      return null;
    };
  }
  convertJsonToExpression(jsonData: Group[]): string {
    return jsonData
      .map((group) => {
        const groupExpression = group.groupItems
          .map((item: GroupItem) => {
            let itemString = item.item.toString();
            if (item.itemOperator) {
              itemString = `${
                item.itemOperator === 'PLUS'
                  ? '+'
                  : item.itemOperator === 'SUB'
                  ? '-'
                  : item.itemOperator === 'DIV'
                  ? '/'
                  : item.itemOperator === 'MUL'
                  ? '*'
                  : ''
              } ${itemString}`;
            }
            return itemString;
          })
          .join(' ');

        if (group.groupOperator) {
          return `${
            group.groupOperator === 'PLUS'
              ? '+'
              : group.groupOperator === 'SUB'
              ? '-'
              : group.groupOperator === 'DIV'
              ? '/'
              : group.groupOperator === 'MUL'
              ? '*'
              : ''
          } (${groupExpression})`;
        }

        return `(${groupExpression})`;
      })
      .join(' ');
  }
}
