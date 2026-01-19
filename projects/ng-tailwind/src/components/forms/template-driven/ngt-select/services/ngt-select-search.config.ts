import { OutputEmitterRef } from '@angular/core';
import { Observer } from 'rxjs';

export interface NgtSelectSearchConfig {
	remoteResource: any;
	guessCompareWith: boolean;
	compareWith: (a: any, b: any) => boolean;
	autoSelectUniqueOption: boolean;
	currentValue: any;
	ngSearchObserver: Observer<any>;
	onNativeChange: (value: any) => void;
	onLoadRemoteResource: OutputEmitterRef<any>;
}
