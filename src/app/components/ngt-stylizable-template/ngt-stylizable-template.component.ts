import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-stylizable-template',
  templateUrl: './ngt-stylizable-template.component.html'
})
export class NgtStylizableTemplateComponent {
  @Input() public tagName: string;
  @Input() public styleName: string;

  public constructor() { }

  public getCodeModuleExample() {
    return `
 {
  provide: '${this.styleName}',
  useValue: {
    color: {
      bg: 'bg-white',
      text: 'text-gray-800'
    },
    mx: 'mx-3 md:mx-6',
    my: 'my-8',
    h: 'h-auto',
  }
 }
    `;
  }

  public getCodeDirectiveExample() {
    return `
 <${this.tagName} pr='pr-0' my='my-1' h='h-10' w='w-12' 
  color.bg='bg-gray-700' color.text='text-gray-700'
  color.border='border-gray-700' ngt-stylizable>
 </${this.tagName}>
    `;
  }
}
