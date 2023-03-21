import { Component, OnInit, ViewChild } from '@angular/core';
import { NgtFormComponent, NgtFormState } from 'projects/ng-tailwind/src/public-api';

@Component({
  selector: 'app-ngt-form-page',
  templateUrl: './ngt-form-page.component.html'
})
export class NgtFormPageComponent implements OnInit {
  @ViewChild(NgtFormComponent, { static: true }) private ngtFormComponent: NgtFormComponent;

  public codeExample = `
  <form>
    <ngt-form [customLayout]='true' message='Complete all the fields correctly' #ngtForm>
      <ngt-form-validation-message class="block mx-5 mt-5"></ngt-form-validation-message>
        <div class="flex flex-wrap">
          <span class="my-2 font-semibold text-left w-full block mx-5 text-sm">
            FormState: <span class="font-normal">{{ ngtForm.getFormState() }}</span>
          </span>

          <ngt-input class="block mx-5 w-full" name='inputTest' label='Input Test' 
            [isRequired]='true'>
          </ngt-input>

          <div class="flex mx-5 mt-5 w-full">
            <ngt-button class="block w-6/12 pr-6" type='success' (click)='save()'>
              <span class="text-center w-full">
                Save
              </span>
            </ngt-button>

          <ngt-button class="block w-6/12" type='warning' [noSubmit]='true'
            (click)='toggleFormState()'>
              <span class="text-center w-full">
                ToggleFormState
              </span>
          </ngt-button>
        </div>
      </div>
    </ngt-form>
  </form>
  `;

  public constructor() { }

  public ngOnInit() { }

  public toggleFormState() {
    if (this.ngtFormComponent.getFormState() == NgtFormState.CREATING) {
      return this.ngtFormComponent.setFormState(NgtFormState.EDITING);
    }

    return this.ngtFormComponent.setFormState(NgtFormState.CREATING);
  }

  public save() {
    this.ngtFormComponent.saveResource().subscribe(() => { });
  }
}
