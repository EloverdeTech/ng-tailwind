import { Injector } from "@angular/core";

export class NgtStylizableService {

    private _color;
    private _h;
    private _w;
    private _p: string;
    private _px: string;
    private _py: string;
    private _pt: string;
    private _pr: string;
    private _pb: string;
    private _pl: string;

    get color() {
        return this._color;
    }

    set color(color) {
        if (color.bg) {
            color.bg = this.getQualifiedValue('bg-', color.bg);
        }

        if (color.text) {
            color.text = this.getQualifiedValue('text-', color.text);
        }

        if (color.border) {
            color.border = this.getQualifiedValue('border-', color.border);
        }

        this._color = color;
    }

    set textColor(textColor) {
        this._color = this._color ? this._color : {};
        this._color.text = this.getQualifiedValue('text-', textColor);
    }

    set bgColor(bgColor) {
        this._color = this._color ? this._color : {};
        this._color.bg = this.getQualifiedValue('bg-', bgColor);
    }

    set borderColor(borderColor) {
        this._color = this._color ? this._color : {};
        this._color.border = this.getQualifiedValue('border-', borderColor);
    }

    get h(): string {
        return this._h;
    }

    set h(h: string) {
        this._h = this.getQualifiedValue('h-', h);
    }

    get w(): string {
        return this._w;
    }

    set w(w: string) {
        this._w = this.getQualifiedValue('w-', w);
    }

    get p(): string {
        return this._p;
    }

    set p(p: string) {
        this._p = this.getQualifiedValue('p-', p);
    }

    get px(): string {
        return this._px;
    }

    set px(px: string) {
        this._px = this.getQualifiedValue('px-', px);
    }

    get py(): string {
        return this._py;
    }

    set py(py: string) {
        this._py = this.getQualifiedValue('py-', py);
    }

    get pt(): string {
        return this._pt;
    }

    set pt(pt: string) {
        this._pt = this.getQualifiedValue('pt-', pt);
    }

    get pr(): string {
        return this._pr;
    }

    set pr(pr: string) {
        this._pr = this.getQualifiedValue('pr-', pr);
    }

    get pb(): string {
        return this._pb;
    }

    set pb(pb: string) {
        this._pb = this.getQualifiedValue('pb-', pb);
    }

    get pl(): string {
        return this._pl;
    }

    set pl(pl: string) {
        this._pl = this.getQualifiedValue('pl-', pl);
    }

    public load(injector: Injector, style: string, defaultValue = null) {
        let ngtGlobalStyle = injector.get('NgtStyleGlobal', {});
        defaultValue = defaultValue ? defaultValue : {};

        let requestedStyle = <NgtStylizableService>injector.get(style + 'Style', defaultValue);

        this.loadObjectProperties(this, ngtGlobalStyle, this.getAllowedKeys(ngtGlobalStyle));
        this.loadObjectProperties(this, requestedStyle, this.getAllowedKeys(requestedStyle));
    }

    private loadObjectProperties(targetObject, object, properties: Array<string>) {
        properties.forEach((key) => {
            if (typeof (object[key]) === 'object') {
                targetObject[key] = targetObject[key] ? targetObject[key] : {};
                targetObject[key] = this.loadObjectProperties(targetObject[key], object[key], Object.keys(object[key]));
            } else {
                targetObject[key] = object[key];
            }
        });

        return targetObject;
    }

    public compile(styles: Array<string>) {
        return styles
            .map((style: string) => this.getQualifiedStyle(style))
            .join(' ');
    }

    private getQualifiedStyle(style: string) {
        if (!style.includes('color')) {
            return this['_' + style];
        }

        switch (style) {
            case 'color.bg': return this._color.bg;
            case 'color.text': return this._color.text;
            case 'color.border': return this._color.border;
        }
    }

    private getAllowedKeys(style: NgtStylizableService) {
        let keys = Object.keys(style);

        if (Array.isArray(keys)) {
            return keys.filter(key => {
                return [
                    'color',
                    'h',
                    'w',
                    'p',
                    'px',
                    'py',
                    'pt',
                    'pr',
                    'pb',
                    'pl',
                ].includes(key);
            });
        }
    }

    private getQualifiedValue(except: string, value: string) {
        if (value.includes(except)) {
            return value;
        }

        return except.concat(value);
    }
}