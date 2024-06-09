import createCommandPalette from './commandPalette.js';

async function isServerAvailable(port) {
  try {
    const response = await fetch(`http://localhost:${port}/settings`);
    return response.ok;
  } catch (error) {
    console.error('Server not available:', error);
    return false;
  }
}

let settings = {};
const setSettings = (newSettings) => {
  settings = newSettings;
};

let session = {};
const setSession = (newSession) => {
  session = newSession;
  updateNoteList();
};

let note = {};
const setNote = (newNote) => {
  if (!newNote) {
    console.error('setNote called with an undefined note');
    return;
  }
  note = newNote;
  document.querySelector('#main #title').value = note.title || '';
  document.querySelector('#main #body').value = note.body || '';
};

let port = 0;

document.addEventListener('DOMContentLoaded', async () => {
  const defaultPort = 13395;
  let settingsResponse = null;
  port = defaultPort;

  try {
    settingsResponse = await fetch(`http://localhost:${defaultPort}/settings`);
    notify('Connected to server!', 'success');
  } catch (err) {
    console.error(`Failed to fetch settings from default port ${defaultPort}:`, err);
  }

  if (settingsResponse && settingsResponse.ok) {
    setSettings(await settingsResponse.json());
    port = settings.localPort || defaultPort;
  } else {
    console.log('Retrying to connect to the server on the provided port...');
    const maxRetries = 5;
    let retries = 0;
    let serverAvailable = false;

    while (retries < maxRetries && !serverAvailable) {
      serverAvailable = await isServerAvailable(port);
      if (!serverAvailable) {
        retries++;
        console.log(`Retrying to connect to the server... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }

    if (!serverAvailable) {
      console.error('Server is not available. Please make sure the server is running.');
      alert('Server is not available. Please make sure the server is running.');
      return;
    }
  }

  setSettings(await (await fetch(`http://localhost:${port}/settings`)).json());
  setSession(await (await fetch(`http://localhost:${port}/session`)).json());

  // Check if session.notes.existing is defined and has elements
  if (session.notes && session.notes.existing && session.notes.existing.length > 0) {
    setNote(session.notes.existing[0]);
  } else {
    await createNote();
    setSession(await (await fetch(`http://localhost:${port}/session`)).json());
    setNote(session.notes.existing[0]);
  }

  const contextMenu = document.getElementById('custom-context-menu');

  if (settings.autoSave === true) {
    document.querySelector('#save-status').style.display = 'none';
  }

  document.querySelector('#main #title').addEventListener('input', (e) => {
    note.title = e.target.value;

    if (settings.autoSave === true) {
      saveNote();
    }
  });

  document.querySelector('#main #body').addEventListener('input', (e) => {
    note.body = e.target.value;

    if (settings.autoSave === true) {
      saveNote();
    }
  });

  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      await saveNote();
    }
  });

  createCommandPalette();

  document.querySelector('#note-list').addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === "LI") {
      const noteId = e.target.getAttribute('aria-data-id');
      loadNote(noteId);
    }
  });

  document.addEventListener('contextmenu', (e) => {
    console.log('opened contextmenu');
    e.preventDefault();

    contextMenu.classList.remove('hidden');
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
  });

  document.addEventListener('click', () => {
    contextMenu.classList.add('hidden');
  });

  contextMenu.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'LI') {
      const action = e.target.getAttribute('data-action');
      // Handle context menu action

      switch (action) {
        case 'new-note':
          createNote();
          break;
        case 'delete':
          deleteNote(note.id);
          break;
        default:
          break;
      }
    }
  });
});

async function loadNotes() {
  try {
    const response = await (await fetch(`http://localhost:${port}/session/notes`)).json();
    session.notes = response;
  } catch (err) {
    notify('Couldn\'t load notes: ' + err, 'error');
  }
}

export async function loadNote(id) {
  try {
    if (!session.notes.existing[0]) {
      createNote();
      return;
    }
    const response = await (await fetch(`http://localhost:${port}/session/notes/${id}`)).json();
    setNote(response);
  } catch (err) {
    notify('Couldn\'t open Note');
  }
}

export async function createNote() {
  try {
    const response = await (await fetch(`http://localhost:${port}/session/notes`, {
      method: 'POST'
    })).json();
    if (response) {
      setSession(response);
    }
  } catch (err) {
    notify('Creating new note failed, ' + err, 'error');
  }
}

async function saveNote() {
  try {
    if (note.title === '') note.title = 'Untitled';
    const response = await (await fetch(`http://localhost:${port}/session/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    })).json();
    setSession(response);

  } catch (err) {
    notify('Error saving note: ' + err, 'error');
  }
}

async function deleteNote(id) {
  try {
    const response = await (await fetch(`http://localhost:${port}/session/notes/${id}`, {
      method: 'DELETE'
    })).json();
    setSession(response);
    loadNote(response.notes.existing[0].id)

    notify('Successfully deleted note!', 'success');
  } catch (err) {
    notify("Error deleting note: " + err, 'error');
  }
}

function updateNoteList() {
  let noteList = '';
  if (session.notes && session.notes.existing) {
    session.notes.existing.forEach(note => {
      noteList += `
        <li class="w-full pl-2 hover:bg-neutral-700 cursor-pointer select-none" aria-data-id="${note.id}">${note.title}</li>
      `;
    });
  }
  document.querySelector('#note-list').innerHTML = noteList;
}

export async function toggleAutoSave() {
  try {
    settings.autoSave = !settings.autoSave;
    const response = await (await fetch(`http://localhost:${port}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    })).json();
    setSettings(response);
  } catch (err) {
    notify('Error toggling autosave, ' + err, 'error');
  }
}

export async function restartServer() {
  const response = await fetch(`http://localhost:${port}/restart`);
  if (response.status === 500) {
    notify('Server restarted', 'success');
  }
}

let notificationQueue = [];
let isNotificationShowing = false;

export function notify(msg, type = 'info') {
  notificationQueue.push({ msg, type });
  processNotificationQueue();
}

function processNotificationQueue() {
  if (isNotificationShowing) return;
  if (notificationQueue.length === 0) return;

  const { msg, type } = notificationQueue.shift();
  showNotification(msg, type);
}

function showNotification(msg, type) {
  isNotificationShowing = true;

  const notification = document.getElementById('notification');
  const text = document.querySelector('#notification #text');

  text.textContent = msg;
  let color = '';

  switch (type) {
    case 'info':
      color = 'blue-500';
      break;
    case 'error':
      color = 'red-400';
      break;
    case 'success':
      color = 'green-400';
      break;
    default:
      color = 'blue-500';
      break;
  }

  notification.classList.add(`border-${color}`);
  text.classList.add(`text-${color}`);

  notification.classList.remove(`hidden`);
  setTimeout(() => {
    notification.classList.remove('opacity-0');
  }, 200);

  setTimeout(() => {
    notification.classList.add('opacity-0');
    setTimeout(() => {
      notification.classList.add('hidden');
      isNotificationShowing = false;
      processNotificationQueue();
    }, 200);

    notification.classList.remove(`border-${color}`);
    text.classList.remove(`text-${color}`);
  }, 3000);
}
