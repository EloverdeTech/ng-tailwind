import { NgForm } from '@angular/forms';

export function resetNgForm(ngForm: NgForm) {
    ngForm.resetForm();
    setTimeout(() => {
        ngForm.reset();
    }, 500);
}

export function triggerNgFormSubmit(ngForm: NgForm) {
    ngForm.onSubmit(new Event("submit"));
}

export function isValidNgForm(ngForm: NgForm) {
    triggerNgFormSubmit(ngForm);

    return ngForm.valid;
}
