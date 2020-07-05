import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ngt-select-option]' })
export class NgtSelectOptionTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ngt-select-option-selected]' })
export class NgtSelectOptionSelectedTmp {
    public constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ngt-select-header]' })
export class NgtSelectHeaderTmp {
    public constructor(public template: TemplateRef<any>) { }
}
