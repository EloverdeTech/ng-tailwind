import { Injector } from '@angular/core';

export class NgtStylizableService {
    private _color: any;
    private _h: string;
    private _w: string;
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
    private _gap: string;
    private _border: string;
    private _shadow: string;
    private _rounded: string;
    private _font: string;
    private _text: string;
    private _breakWords: string;
    private _overflow: string;
    private _position: string;
    private _justifyContent: string;
    private _cursor: string;
    private _fontCase: string;

    public get color() {
        return this._color;
    }

    public get h(): string {
        return this._h;
    }

    public get w(): string {
        return this._w;
    }

    public get p(): string {
        return this._p;
    }

    public get px(): string {
        return this._px;
    }

    public get py(): string {
        return this._py;
    }

    public get pt(): string {
        return this._pt;
    }

    public get pr(): string {
        return this._pr;
    }

    public get pb(): string {
        return this._pb;
    }

    public get pl(): string {
        return this._pl;
    }

    public get m(): string {
        return this._m;
    }

    public get mx(): string {
        return this._mx;
    }

    public get my(): string {
        return this._my;
    }

    public get mt(): string {
        return this._mt;
    }

    public get mr(): string {
        return this._mr;
    }

    public get mb(): string {
        return this._mb;
    }

    public get ml(): string {
        return this._ml;
    }

    public get gap(): string {
        return this._gap;
    }

    public get border(): string {
        return this._border;
    }

    public get shadow(): string {
        return this._shadow;
    }

    public get rounded(): string {
        return this._rounded;
    }

    public get font(): string {
        return this._font;
    }

    public get text(): string {
        return this._text;
    }

    public get breakWords(): string {
        return this._breakWords;
    }

    public get overflow(): string {
        return this._overflow;
    }

    public get position(): string {
        return this._position;
    }

    public get justifyContent(): string {
        return this._justifyContent;
    }

    public get cursor(): string {
        return this._cursor;
    }

    public get fontCase(): string {
        return this._fontCase;
    }

    public set color(color) {
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

    public set textColor(textColor) {
        this._color = this._color ? this._color : {};
        this._color.text = this.getQualifiedValue('text-', textColor);
    }

    public set bgColor(bgColor) {
        this._color = this._color ? this._color : {};
        this._color.bg = this.getQualifiedValue('bg-', bgColor);
    }

    public set borderColor(borderColor) {
        this._color = this._color ? this._color : {};
        this._color.border = this.getQualifiedValue('border-', borderColor);
    }

    public set h(h: string) {
        this._h = this.getQualifiedValue('h-', h);
    }

    public set w(w: string) {
        this._w = this.getQualifiedValue('w-', w);
    }

    public set p(p: string) {
        this._p = this.getQualifiedValue('p-', p);
    }

    public set px(px: string) {
        this._px = this.getQualifiedValue('px-', px);
    }

    public set py(py: string) {
        this._py = this.getQualifiedValue('py-', py);
    }

    public set pt(pt: string) {
        this._pt = this.getQualifiedValue('pt-', pt);
    }

    public set pr(pr: string) {
        this._pr = this.getQualifiedValue('pr-', pr);
    }

    public set pb(pb: string) {
        this._pb = this.getQualifiedValue('pb-', pb);
    }

    public set pl(pl: string) {
        this._pl = this.getQualifiedValue('pl-', pl);
    }

    public set m(m: string) {
        this._m = this.getQualifiedValue('m-', m);
    }

    public set mx(mx: string) {
        this._mx = this.getQualifiedValue('mx-', mx);
    }

    public set my(my: string) {
        this._my = this.getQualifiedValue('my-', my);
    }

    public set mt(mt: string) {
        this._mt = this.getQualifiedValue('mt-', mt);
    }

    public set mr(mr: string) {
        this._mr = this.getQualifiedValue('mr-', mr);
    }

    public set mb(mb: string) {
        this._mb = this.getQualifiedValue('mb-', mb);
    }

    public set ml(ml: string) {
        this._ml = this.getQualifiedValue('ml-', ml);
    }

    public set gap(gap: string) {
        this._gap = this.getQualifiedValue('gap-', gap);
    }

    public set border(border: string) {
        this._border = this.getQualifiedValue('border', border);
    }

    public set shadow(shadow: string) {
        this._shadow = this.getQualifiedValue('shadow', shadow);
    }

    public set rounded(rounded: string) {
        this._rounded = this.getQualifiedValue('rounded', rounded);
    }

    public set font(font: string) {
        this._font = this.getQualifiedValue('font', font);
    }

    public set text(text: string) {
        this._text = this.getQualifiedValue('text', text);
    }

    public set breakWords(breakWords: string) {
        this._breakWords = this.getQualifiedValue('break', breakWords);
    }

    public set overflow(overflow: string) {
        this._overflow = this.getQualifiedValue('overflow', overflow);
    }

    public set position(position: string) {
        this._position = position;
    }

    public set justifyContent(justifyContent: string) {
        this._justifyContent = this.getQualifiedValue('justify', justifyContent);
    }

    public set cursor(cursor: string) {
        this._cursor = this.getQualifiedValue('cursor', cursor);
    }

    public set fontCase(fontCase: string) {
        this._fontCase = this.getQualifiedValue('', fontCase);
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

    public compile(styles: Array<string>) {
        return styles
            .map((style: string) => this.getQualifiedStyle(style))
            .join(' ');
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
            return keys.filter(key => [
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
                'rounded',
                'font',
                'text',
                'breakWords',
                'overflow',
                'position',
                'justifyContent',
                'cursor',
                'fontCase'
            ].includes(key));
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
