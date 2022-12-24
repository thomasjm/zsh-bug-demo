var child_process = require('child_process');
var os = require('os');
var pty = require('node-pty');

// Get the ZSH version
var child = child_process.spawnSync("zsh", ["--version"], { encoding : 'utf8' });
console.log("ZSH version: ", child.stdout);

// Run the test
var ptyProcess = pty.spawn("zsh", [], {
  name: 'xterm-color',
  cols: 2,
  rows: 2,
  cwd: process.env.HOME,
  env: process.env
});

ptyProcess.on('data', function(data) {
  process.stdout.write(data);
});

ptyProcess.write('ls\r');
// ptyProcess.write('asdf\r');

// Terminal crashes
