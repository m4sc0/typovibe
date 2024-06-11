import commands from './commands.js';

function createCommandPalette(settings) {
  const commandPalette = document.getElementById('command-palette');
  const input = document.getElementById('command-input');
  const results = document.getElementById('command-results');
  const template = document.getElementById('command-palette-res-template');
  let selection = 0;

  function renderCommands() {
    const query = input.value.toLowerCase();
    results.innerHTML = '';

    commands
      .filter(command => command.name.toLowerCase().includes(query))
      .forEach((command, i) => {
        const commandElement = document.importNode(template.content, true);

        commandElement.querySelector('.command-title').textContent = command.name;
        if (settings.commandPalette.showDescriptions) commandElement.querySelector('.command-desc').textContent = command.description;

        const commandItem = commandElement.querySelector('.command-item');
        commandItem.setAttribute('data-index', i);
        commandItem.addEventListener('click', () => {
          command.execute();
          commandPalette.classList.add('hidden');
          input.value = '';
        });

        results.appendChild(commandElement);
      });

    setSelection(0); // Automatically select the first item
  }

  input.addEventListener('input', renderCommands);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'k' && e.ctrlKey) {
      commandPalette.classList.remove('hidden');
      input.focus();
      renderCommands();
      return;
    } else if (e.key === 'Escape') {
      commandPalette.classList.add('hidden');
      input.value = '';
      return;
    }

    if (!commandPalette.classList.contains('hidden')) {
      if (e.key === 'ArrowDown') {
        updateSelection(1);
        e.preventDefault(); // Prevent default scrolling
      } else if (e.key === 'ArrowUp') {
        updateSelection(-1);
        e.preventDefault(); // Prevent default scrolling
      } else if (e.key === 'Enter' && selection !== -1) {
        const selectedCommand = results.querySelector(`.command-item[data-index="${selection}"]`);
        if (selectedCommand) {
          selectedCommand.click();
          input.value = '';
        }
      }
    }
  });

  function setSelection(value) {
    const items = results.querySelectorAll('.command-item');
    if (selection !== -1 && items[selection]) {
      items[selection].classList.remove('bg-color-600', 'hover:bg-color-700');
    }
    selection = value;
    if (selection !== -1 && items[selection]) {
      items[selection].classList.add('bg-color-600', 'hover:bg-color-700');
      items[selection].scrollIntoView({ block: 'nearest' });
    }
  }

  function updateSelection(delta) {
    const items = results.querySelectorAll('.command-item');
    if (items.length === 0) return;

    let newSelection = selection + delta;
    if (newSelection < 0) newSelection = 0;
    if (newSelection >= items.length) newSelection = items.length - 1;

    setSelection(newSelection);
  }

  renderCommands(); // Initial render
}

export default createCommandPalette;
