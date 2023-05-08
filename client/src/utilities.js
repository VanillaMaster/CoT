/**
 * Provide default behavior of string interpolation
 * @param { TemplateStringsArray } template 
 * @param  {...string} values 
 */
export function interpolate(template, ...values) {
    const buffer = new Array(template.length + values.length);
    let i = 0, j = 0;
    for (; i < values.length; i++) {
        buffer[j++] = template[i];
        buffer[j++] = values[i];
    }
    buffer[j] = template[i];
    const str = buffer.join("")
    return str;
}

/**
 * @param { TemplateStringsArray } template 
 * @param  {...string} values 
 */
export function html(template, ...values) {
    return html.range.createContextualFragment(interpolate(template, ...values));
}
html.range = new Range();
html.range.selectNode(document.body);

/**
 * @param { TemplateStringsArray } template 
 * @param  {...string} values 
 */
export function css(template, ...values) {
    return new CSSStyleSheet().replace(interpolate(template, ...values));
}