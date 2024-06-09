import { createNote, toggleAutoSave, restartServer, notify } from "./renderer.js";

const commands = [
    {
        name: 'New Note',
        description: 'Create a new note',
        execute: () => {
            createNote();
        }
    },
    // {
    //     name: 'Toggle Auto-save',
    //     description: 'Toggle the auto-save feature',
    //     execute: () => {
    //         toggleAutoSave();
    //     }
    // },
    {
        name: "Restart Server",
        description: "Restart the backend Server in case some functionalities are not working",
        execute: () => {
            restartServer();
        }
    },
    {
        name: 'Test Notification - Info',
        execute: () => {
            notify('Test notification - Info', 'info');
        }
    },
    {
        name: 'Test Notification - Error',
        execute: () => {
            notify('Test notification - Error', 'error');
        }
    },
    {
        name: 'Test Notification - Success',
        execute: () => {
            notify('Test notification - Success', 'success');
        }
    }
]

export default commands;