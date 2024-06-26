
# TypoVibe

TypoVibe is a minimalistic Text editor. It's not much but it's something.

## Structure

> My approach is a little complicated and for this version probably too much but I have big plans for the future so I went with this.

### Main Process

The main process is basically just a simple electron app, starting the application with the window and sets the necessary attributes, such as the application icon or the window title.

### Renderer Process

The renderer process is started when the main process has finished setting up everything about the window.

### Internal server

There's an internal server running with which the frontend (i.e. the renderer process) is communicating. I went with this approach so other contributers can easily access the same interface, no matter how they do it. Using the electron IPC workflow, a few issues would arise in which case the whole project would have to be rewritten. The default port for the internal server is `13395` (can be changed in the settings.json).

The internal server writes and reads to and from the settings.json/session.json

## Keybindings
-  `Ctrl + S` - **Save Note**
-  `Ctrl + K` - **Open Command palette**
-  `Ctrl + T` - **Focus title**
-  `Ctrl + B` - **Focus body**
-  `Ctrl + P` - **Toggle Markdown Preview**

## Features
> Please refer to commands.js to view all commands in json format

- `Command Palette` - to execute all commands within seconds
- `Markdown Preview` - to properly design markdown fitting to your needs
- `Auto-Save` - so you never lose your stuff
- `Session-based` - take off where you left last time

### Themes
> Currently, there are two color themes available (light/dark) but i'm planning on implementing a lot more cool color themes.

## Installation  
### Prerequisites
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

### Clone the Repository
To get started, fork the repository and then clone it locally:

```sh
git clone https://github.com/{username}/typovibe.git
cd typovibe
```

### Install Dependencies
Install the required npm packages:
```sh
npm install
```

## Building the Application
### Windows/Linux/macOS
To build the application for Linux, use the following command:
```sh
npm run make
```
The build artifacts will be located in the out directory.

## Running in Development
To start the application in development mode:
```sh
npm start
```
This will build the tailwind css and launch the application.

## Example GIF

![gif](https://github.com/m4sc0/typovibe/assets/73311544/0af7eacc-b3d1-409d-81f0-22ba22e06bfa)

### Contributing
We welcome contributions from the community! To contribute:
> - Fork the repository. 
> - Create a new branch for your feature or bugfix. 
> - Make your changes. 
> - Commit and push your changes.
> - Open a pull request.
Please make sure to follow the code style.

## License

This project is licensed under a Custom License. See the LICENSE file for more details.

## Contact

For any questions or feedback, feel free to open an issue or contact the maintainer at help@typovibe.com

---
Thank you for using TypoVibe!
