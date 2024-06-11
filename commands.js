import { createNote, toggleAutoSave, restartServer, notify, note, deleteNote, saveNote, toggleDescriptions, openDirectory, setPreviewVisible, isPreviewVisible, switchTheme, settings } from "./renderer.js";

const commands = [
    {
        name: 'Notes: New Note',
        description: 'Create a new note',
        execute: () => {
            createNote();
        }
    },
    {
        name: 'Notes: Delete Current Note',
        description: 'Delete the current note',
        execute: () => {
            deleteNote(note.id);
        }
    },
    {
        name: 'Notes: Save Note',
        description: 'Save the current note',
        execute: () => {
            saveNote();
        }
    },
    {
        name: 'Settings: Toggle Preview',
        description: 'Toggle the markdown preview',
        execute: () => {
            setPreviewVisible(!isPreviewVisible);
        }
    },
    {
        name: 'Settings: Toggle theme',
        description: 'Toggle theme between dark and light mode',
        execute: () => {
            switchTheme(settings === 'dark' ? 'light' : 'dark');
        }
    },
    {
        name: 'Settings: Toggle Auto-save',
        description: 'Toggle the auto-save feature',
        execute: () => {
            toggleAutoSave();
        }
    },
    {
        name: 'Settings: Toggle show descriptions',
        description: 'Toggle the feature to show descriptions of commands',
        execute: () => {
            toggleDescriptions();
        }
    },
    {
        name: 'Settings: Restart Server',
        description: 'Restart the backend server in case some functionalities are not working',
        execute: () => {
            restartServer();
        }
    },
    {
        name: 'Settings: Open settings.json directory',
        description: 'Opens the directory in which the settings.json and session.json file are stored',
        execute: () => {
            openDirectory();
        }
    },
    {
        name: 'Notifications: Test Notification - Info',
        description: 'Show a test notification of type Info',
        execute: () => {
            notify('Test notification - Info', 'info');
        }
    },
    {
        name: 'Notifications: Test Notification - Error',
        description: 'Show a test notification of type Error',
        execute: () => {
            notify('Test notification - Error', 'error');
        }
    },
    {
        name: 'Notifications: Test Notification - Success',
        description: 'Show a test notification of type Success',
        execute: () => {
            notify('Test notification - Success', 'success');
        }
    }
];

export default commands;
