import express from 'express';
import fs from 'fs';

const app = express();

const defaultSettings = {
    autoSave: true,
    theme: 'dark',
    keepSession: true,
    defaultNotePath: './notes',
    localPort: 13395
};

const defaultSession = {
    existingFolderPath: null,
    notes: {
        counter: 0,
        existing: []
    }
};

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Received fetch at ${req.method} ${req.url}`);
    next();
});

// settings
function ensureSettingsFile() {
    if (!fs.existsSync('settings.json')) {
        fs.writeFileSync('settings.json', JSON.stringify(defaultSettings, null, 2));
    }
}

function currentSettings() {
    ensureSettingsFile();
    const settings = JSON.parse(fs.readFileSync('settings.json'));
    return settings;
}

function saveCurrentSettings(settings) {
    ensureSettingsFile();
    fs.writeFileSync('settings.json', JSON.stringify(settings, null, 2));
}

// session settings
function ensureSessionFile() {
    if (!fs.existsSync('session.json')) {
        fs.writeFileSync('session.json', JSON.stringify(defaultSession, null, 2));
        // const newNote = {
        //     id: id,
        //     title: 'Untitled',
        //     body: '',
        //     type: 'md', // md or txt, based on file ending
        //     path: '',
        //     last_modified: new Date(),
        // };

        // curSettings.notes.existing.push(newNote);
        // curSettings.notes.counter += 1;
        // saveCurrentSession(curSettings);
    }
}

function currentSession() {
    ensureSessionFile();
    const session = JSON.parse(fs.readFileSync('session.json'));
    return session;
}

function saveCurrentSession(session) {
    ensureSessionFile();
    fs.writeFileSync('session.json', JSON.stringify(session, null, 2));
}

// settings endpoints
app.get('/settings', (req, res) => {
    res.send(currentSettings());
});

app.post('/settings', (req, res) => {
    saveCurrentSettings(req.body);
    res.sendStatus(200);
});

app.delete('/settings', (req, res) => {
    saveCurrentSettings(defaultSettings);
    res.sendStatus(200);
});

// session endpoints
app.get('/session', (req, res) => {
    res.send(currentSession());
});

app.post('/session', (req, res) => {
    saveCurrentSession(req.body);
    res.sendStatus(200);
});

app.delete('/session', (req, res) => {
    saveCurrentSession(defaultSession);
    res.sendStatus(200);
});

// Get note
app.get('/session/notes/:id', (req, res) => {
    const curSession = currentSession();
    const { id } = req.params;

    const note = curSession.notes.existing.find(note => note.id == id);
    if (note) {
        res.send(note);
    } else {
        res.status(404).send('Note not found');
    }
});

// Update note
app.put('/session/notes/:id', (req, res) => {
    const curSession = currentSession();
    const { id } = req.params;
    const data = req.body;

    const noteIndex = curSession.notes.existing.findIndex(note => note.id == id);
    if (noteIndex !== -1) {
        curSession.notes.existing[noteIndex] = { ...curSession.notes.existing[noteIndex], ...data };
        saveCurrentSession(curSession);
        res.send(curSession);
    } else {
        res.status(404).send('Note not found');
    }
});

// Delete note
app.delete('/session/notes/:id', (req, res) => {
    const curSession = currentSession();
    const { id } = req.params;
    
    const noteIndex = curSession.notes.existing.findIndex(note => note.id == id);
    if (noteIndex !== -1) {
        curSession.notes.existing.splice(noteIndex, 1);
        saveCurrentSession(curSession);
        res.send(curSession);
    } else {
        res.status(404).send('Note not found');
    }
})

// Get notes
app.get('/session/notes', (req, res) => {
    const curSession = currentSession();
    res.send(curSession.notes);
});

// Create new note
app.post('/session/notes', (req, res) => {
    const curSettings = currentSession();
    const id = new Date().getTime();

    const newNote = {
        id: id,
        title: 'Untitled',
        body: '',
        type: 'md', // md or txt, based on file ending
        path: '',
        last_modified: new Date(),
    };

    curSettings.notes.existing.push(newNote);
    curSettings.notes.counter += 1;
    saveCurrentSession(curSettings);

    res.send(curSettings);
});

app.get('/restart', (req, res) => {
    app.close();
})

// Ensure settings file exists before starting the server
ensureSettingsFile();
ensureSessionFile();
const settings = currentSettings();
const port = settings.localPort || defaultSettings.localPort;

export function startServer() {
    app.listen(port, () => {
        console.log(`Internal server running at http://localhost:${port}`);
    });

    return port;
}