import { ValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";

export const passwordsMatch : ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const oldPass = control.get('oldPass')
    const newPass = control.get('newPass')
    const newPassConfirm = control.get('newPassConfirm')
    if(oldPass.value == newPass.value && (newPass.value != null && oldPass.value != null)) return {
        passwordsDiffer: {
            text: 'New password must be different'
        }
    }
    if(newPass.value != newPassConfirm.value && (newPass.value != null && newPassConfirm.value != null)) return {
        passwordsMatch: {
            text: 'Passwords do not match'
        }
    }
}