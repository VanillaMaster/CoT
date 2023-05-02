export default `
:host {
    display: block;
    width: 100%;
    height: 100%;
    --padding: 1em;
}
::slotted(*) {
    padding: var(--padding);
    height: calc(100% - (var(--padding) * 2));
    width: calc(100% - (var(--padding) * 2));
}
`;