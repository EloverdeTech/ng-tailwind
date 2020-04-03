import { Injector } from '@angular/core';

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
    private _m: string;
    private _mx: string;
    private _my: string;
    private _mt: string;
    private _mr: string;
    private _mb: string;
    private _ml: string;
    private _border: string;
    private _shadow: string;

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

    get m(): string {
        return this._m;
    }

    set m(m: string) {
        this._m = this.getQualifiedValue('m-', m);
    }

    get mx(): string {
        return this._mx;
    }

    set mx(mx: string) {
        this._mx = this.getQualifiedValue('mx-', mx);
    }

    get my(): string {
        return this._my;
    }

    set my(my: string) {
        this._my = this.getQualifiedValue('my-', my);
    }

    get mt(): string {
        return this._mt;
    }

    set mt(mt: string) {
        this._mt = this.getQualifiedValue('mt-', mt);
    }

    get mr(): string {
        return this._mr;
    }

    set mr(mr: string) {
        this._mr = this.getQualifiedValue('mr-', mr);
    }

    get mb(): string {
        return this._mb;
    }

    set mb(mb: string) {
        this._mb = this.getQualifiedValue('mb-', mb);
    }

    get ml(): string {
        return this._ml;
    }

    set ml(ml: string) {
        this._ml = this.getQualifiedValue('ml-', ml);
    }

    get border(): string {
        return this._border;
    }

    set border(border: string) {
        this._border = this.getQualifiedValue('border', border);
    }

    get shadow(): string {
        return this._shadow;
    }

    set shadow(shadow: string) {
        this._shadow = this.getQualifiedValue('shadow', shadow);
    }

    public load(injector: Injector, style: string, defaultValue = null, inheritanceStyles = []) {
        let ngtGlobalStyle = injector.get('NgtStyleGlobal', {});
        defaultValue = defaultValue ? defaultValue : {};

        let requestedStyle = <NgtStylizableService>injector.get(style + 'Style', defaultValue);

        this.loadObjectProperties(this, ngtGlobalStyle, this.getAllowedKeys(ngtGlobalStyle));

        inheritanceStyles.forEach(style => {
            let requestedStyle = <NgtStylizableService>injector.get(style, {});
            this.loadObjectProperties(this, requestedStyle, this.getAllowedKeys(requestedStyle));
        });

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
                    'm',
                    'mx',
                    'my',
                    'mt',
                    'mr',
                    'mb',
                    'ml',
                    'border',
                    'shadow',
                ].includes(key);
            });
        }
    }

    private getQualifiedValue(requiredPrefix: string, value: string) {
        value.split(' ').forEach((item) => {
            if (!item.includes(requiredPrefix)) {
                throw new Error('Invalid class [' + item + '], must have [' + requiredPrefix + ']');
            }
        });

        return value;
    }
}