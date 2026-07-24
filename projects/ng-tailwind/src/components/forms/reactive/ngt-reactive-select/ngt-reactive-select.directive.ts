import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ngt-reactive-select-option]',
    standalone: true,
})
export class NgtReactiveSelectOptionTemplate {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-reactive-select-option-selected]',
    standalone: true,
})
export class NgtReactiveSelectOptionSelectedTemplate {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-reactive-select-header]',
    standalone: true,
})
export class NgtReactiveSelectHeaderTemplate {
    public constructor(public template: TemplateRef<any>) { }
}
