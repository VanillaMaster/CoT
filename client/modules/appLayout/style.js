export default `
.sidebar {
    display: flex;
    flex-direction: column;
    background: darkslategrey;
    justify-content: space-between;
    align-items: center;

    gap: 0.25em;

    flex-basis: 0;
}

.sidebar button {
    padding: 0.4em;

    height: 3em;
    width: 3em;

    margin: 0;

    background-color: transparent;

    border: 0;

    font-size: inherit;
}

.sidebar button:active {
    background-color: rgba(0,0,0,0.1);
}

.sidebar button.last {
    margin-top: auto;
}

.sidebar svg {
    height: 100%;
    width: 100%;
}

.grid {

    width: 100%; 
    /*background-color: #282828;*/
    height: 100%;
    position: relative;
    overflow: hidden;
}
`;