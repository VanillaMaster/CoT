/**
 * @param { TemplateStringsArray } template 
 * @param  {...string} values 
 */
export function html(template, ...values) {
    const buffer = new Array(template.length + values.length);
    const templateIter = template[Symbol.iterator]();
    const valueIter = values[Symbol.iterator]();
    buffer[0] = templateIter.next().value;
    for (let i = 1; i < buffer.length; i+= 2) {
        ({ value: buffer[i]} = valueIter.next());
        ({ value: buffer[i + 1] } = templateIter.next());
    }
    const str = buffer.join("");
    return (new Range()).createContextualFragment(str);
}