import { FormControl } from '@angular/forms';

export class EventNameValidator {

  static validName(fc: FormControl){

    if(fc.value.toLowerCase() !== "" ){
      return {
        validName: true
      };
    } else {
      return null;
    }
  }
}
