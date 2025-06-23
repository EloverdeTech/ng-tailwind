import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ngt-select-option]',
    standalone: false
})
export class NgtSelectOptionTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-select-option-selected]',
    standalone: false
})
export class NgtSelectOptionSelectedTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({
    selector: '[ngt-select-header]',
    standalone: false
})
export class NgtSelectHeaderTmp {
    public constructor(public template: TemplateRef<any>) { }
}
