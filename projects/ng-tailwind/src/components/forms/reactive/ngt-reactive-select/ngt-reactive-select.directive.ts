import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ngt-reactive-select-option]',
    standalone: true,
})
export class NgtReactiveSelectOptionTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-reactive-select-option-selected]',
    standalone: true,
})
export class NgtReactiveSelectOptionSelectedTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-reactive-select-header]',
    standalone: true,
})
export class NgtReactiveSelectHeaderTmp {
    public constructor(public template: TemplateRef<any>) { }
}
