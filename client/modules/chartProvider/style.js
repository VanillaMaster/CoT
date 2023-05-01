export default `
svg {
    bottom: 0;
    right: 0;
    height: 100%;
    position: absolute;
}
svg line {
    stroke: var(--stroke, #0074d9);
    stroke-width: var(--stroke-width ,2);
    stroke-linecap: round;
}
svg circle {
    r: var(--r, 4);
    fill: var(--vertex-color, #0074d9);
}
svg text {
    transform: scale(-1, -1);
    transform-origin: center center;
    transform-box: fill-box;
    fill: white;
}
:host(*) {
    min-height: 100px;
    min-width: 100px;
    position: relative;
    overflow: hidden;
    display: block;
}`