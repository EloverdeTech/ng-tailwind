import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    Injector,
    input,
    Optional,
    Self,
    Signal,
    signal,
    ViewEncapsulation,
    WritableSignal,
} from '@angular/core';

import { NgtDropdownComponent, NgtDropdownOpenMethod } from '../ngt-dropdown/ngt-dropdown.component';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        NgtDropdownComponent,
        NgtSvgModule
    ],
})
export class NgtHelperComponent {
    /** Visual Inputs */

    public readonly helpTextColor = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTitle = input<string>();
    public readonly icon = input<string>();
    public readonly iconSize = input<string>();
    public readonly iconColor = input<string>('text-green-500');
    public readonly iconTitle = input<string>();
    public readonly tooltipSize = input<string>('max-w-xs');

    /** Behavior Inputs */

    public readonly autoXReverse = input<boolean>(true);
    public readonly helperReverseYPosition = input<boolean>();

    /** Computed Signals */

    public readonly hasIcon: Signal<boolean> = computed(() => !!this.icon());
    public readonly hasHelpText: Signal<boolean> = computed(() => !!this.helpText());
    public readonly hasIconTitle: Signal<boolean> = computed(() => !!this.iconTitle());
    public readonly displayHelpTitle: Signal<string> = computed(() =>
        this.helpTitle() || this.ngtTranslateService?.ngtStandardHelperTitle
    );

    /** Internal Signals */

    public readonly ngtStyle: WritableSignal<NgtStylizableService> = signal(new NgtStylizableService());
    public readonly NgtDropdownOpenMethod = NgtDropdownOpenMethod;

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,

        @Optional()
        public ngtTranslateService: NgtTranslateService,

        private injector: Injector,
    ) {
        this.setupNgtStylizable();
    }

    private setupNgtStylizable(): void {
        const styleService = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        styleService.load(this.injector, 'NgtHelper', {
            text: 'text-xs',
            fontCase: '',
            px: 'px-2',
            gap: '',
            color: {
                text: 'text-black',
                bg: 'bg-gray-200'
            }
        });

        this.ngtStyle.set(styleService);
    }
}
