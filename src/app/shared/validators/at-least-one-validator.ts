import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';


export const  atLeastOneValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    let controls = control.controls;
    if (controls) {
      let theOne = Object.keys(controls).findIndex(key => controls[key].value !== null);
      if (theOne === -1) {
        return {
          atLeastOneRequired: {
            text: 'At least one should be selected'
          }
        }
      }
    };
}