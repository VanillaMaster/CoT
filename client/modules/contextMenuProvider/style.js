export default
`
:host {
    font-size: 14px;
    z-index: 101;
    
    overflow: hidden;
    position: absolute;
    
    top: var(--y, 0);
    left: var(--x, 0);

    isolation: isolate;

    border-width: 1px 0 0 0;
    border-color: #1c1c1c;
    border-style: solid;

    color: #d8d9d9;
}

:host(:not([visible])) {
    display: none;
}

:host([visible]) {
    display: block;
}

:host>[data-class="content"] {
    border-width: 0 1px 1px 1px;
    border-color: #1c1c1c;
    border-style: solid;

    animation: context-menu-slide 250ms;
}

:host>[data-class="content"]::before {
    content: "";
    position: absolute;
    inset: 0;

    background-color: #282828;
    filter: url(#noise);
    z-index: -1;
}

@keyframes context-menu-slide {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    25% { opacity: 1; } 
    to {}
}`