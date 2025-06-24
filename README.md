# AssaultCube Frida Script

A Frida script for analyzing and modifying AssaultCube game behavior. This script demonstrates how to hook into the game's damage calculation system and modify damage values for specific weapons.

## Features

- Hooks into AssaultCube's damage calculation function
- Modifies damage values for "unarmed" weapon to zero
- Provides detailed logging of function calls and parameters
- Demonstrates Frida's ability to intercept native library functions

## Prerequisites

- Frida installed on your system
- AssaultCube game running on Android
- Node.js and npm

## Installation

```sh
$ git clone <your-repo-url>
$ cd assaultcube-frida-script
$ npm install
```

## Usage

### Compile and Load

```sh
# Build the agent
$ npm run build

# Attach to AssaultCube process
$ frida -U -f com.assaultcube.android -l _agent.js
```

### Development Workflow

To continuously recompile on changes, keep this running in a terminal:

```sh
$ npm run watch
```

And use an editor like Visual Studio Code for code completion and instant type-checking feedback.

## How It Works

The script works by:

1. **Finding Library Symbols**: Locates `do_dlopen` and `call_constructor` symbols in the linker
2. **Hooking Library Loading**: Intercepts when `libmain.so` is loaded into memory
3. **Hooking Damage Function**: Once `libmain.so` is loaded, hooks into the damage calculation function at offset `0x9074C`
4. **Modifying Damage**: When the "unarmed" weapon is detected, sets damage to zero

## Project Structure

```
assaultcube-frida-script/
├── agent/
│   ├── index.ts      # Main Frida script
│   └── logger.ts     # Logging utilities
├── _agent.js         # Compiled JavaScript output
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Disclaimer

This project is for educational and research purposes only. Use responsibly and in accordance with applicable laws and terms of service.

## License

This project is open source and available under the MIT License.
