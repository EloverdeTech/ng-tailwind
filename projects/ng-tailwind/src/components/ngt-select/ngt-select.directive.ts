import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ngt-select-option]' })
export class NgtSelectOptionTmp {
	constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ngt-select-option-selected]' })
export class NgtSelectOptionSelectedTmp {
	constructor(public template: TemplateRef<any>) { }
}