export default `
dialog[data-is="modal"] {
    /*margin-left: 10%;*/
    /*margin-right: 10%;*/
    margin-top: 5%;
    margin-bottom: 5%;
    height: auto;
    width: 35em;
    padding: 0;

    position: relative;
    isolation: isolate;

    border: none;
    color: #d8d9d9;

    overflow: hidden;
}
dialog[data-is="modal"]:before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: #282828;
    filter: url(#noise);
}
dialog[data-is="modal"] > layout-viewport {
    --border-width: 2px;
    border: var(--border-width) solid black;
    height: calc(100% - (var(--border-width) * 2));
    width: calc(100% - (var(--border-width) * 2));
}
`