export default `
.loader-config-modal {
    height: 80%;
    flex-direction: column;
    overflow: hidden;
    gap: 1em;
    width: 35em;

    background-color: rgb(40, 40, 40);
    color: inherit;
}
.loader-config-modal[open] {
    display: flex;
}

.loader-config-modal .add-block {
    display: flex;
    gap: 1em;
    align-items: center;
}

.loader-config-modal fieldset {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.5em;
}

.loader-config-modal button {
    font-size: inherit;
    font-family: inherit;
}

.loader-config-modal button.delete {
    margin-left: auto;
}


.loader-config-modal>.content {
    overflow-y: scroll;
    flex-grow: 1;
}

.loader-config-modal .url {
    display: flex;
    gap: 1em;
    align-items: center;
}

.loader-config-modal .extra {
    display: flex;
    gap: 1em;
    align-items: center;
}

.loader-config-modal input[type="text"] {
    flex-grow: 1;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    border: 1px solid rgb(216, 217, 217);
    border-radius: 0.5em;
    padding: 0.25em;
}`