
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

I attached GDB to the ZSH process and got the following stacktrace after the crash:

```
#0  0x00007fc6dc868bf0 in raise () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#1  0x00007fc6dc869dd1 in abort () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#2  0x00007fc6dc8aa2bc in __libc_message () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#3  0x00007fc6dc8b04aa in malloc_printerr () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#4  0x00007fc6dc8b28c4 in _int_malloc () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#5  0x00007fc6dc8b4d0a in malloc () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#6  0x0000000000461b1f in zalloc ()
#7  0x00007fc6dc5de321 in zrefresh () from /nix_frozen/store/isvc5lsxw7gakdya8842wapnpln1rfm2-zsh-5.7.1/lib/zsh/5.7.1/zsh/zle.so
#8  0x00007fc6dc5d0f4e in zlecore () from /nix_frozen/store/isvc5lsxw7gakdya8842wapnpln1rfm2-zsh-5.7.1/lib/zsh/5.7.1/zsh/zle.so
#9  0x00007fc6dc5d1d69 in zleread () from /nix_frozen/store/isvc5lsxw7gakdya8842wapnpln1rfm2-zsh-5.7.1/lib/zsh/5.7.1/zsh/zle.so
#10 0x000000000044e82c in zleentry ()
#11 0x000000000044fdc7 in ingetc ()
#12 0x00000000004475fd in ?? ()
#13 0x0000000000459e6f in zshlex ()
#14 0x0000000000479d54 in parse_event ()
#15 0x000000000044b095 in loop ()
#16 0x000000000044ee8c in zsh_main ()
#17 0x00007fc6dc855b8e in __libc_start_main () from /nix_frozen/store/npmbja5cz33q52vkmggdq2phwykpb415-glibc-2.27/lib/libc.so.6
#18 0x0000000000413b9a in _start ()
```
