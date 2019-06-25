
# ZSH crash on small window sizes

This is a repro for a bug I found where ZSH crashes when you set the window too small.

It uses a Node app with the [node-pty](https://www.npmjs.com/package/node-pty) library to start a ZSH session with 2 rows and 2 cols.

Then it sends the command `ls`, and ZSH immediately crashes with a memory corruption bug. I've seen `free(): invalid pointer` and also things like `invalid next size`.

The whole thing is bundled up in a Docker container for reproducibility. You can test by running

```
docker build -t zsh-bug-demo .
docker run -it zsh-bug-demo
```

which produces

```
ZSH version:  zsh 5.5.1 (x86_64-ubuntu-linux-gnu)

ls
free(): invalid next size (fast)
```

Interestingly, this seems to happen with a 2x2 window but not a 3x3 window. You can test this by modifying `index.js`. You can modify the `Dockerfile` to try different Linux distros or ZSH versions.
