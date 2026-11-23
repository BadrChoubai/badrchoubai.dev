---
title: Home Server
description: A Framework laptop mainboard running headless as a home server, reachable over Tailscale.
stack: [Framework Mainboard, Fedora, Tailscale, SSH, Alacritty]
# repo: add one if the config lives on GitHub
order: 5
draft: true
---

## Why

When I bought a MacBook Air, my Framework laptop became a second laptop I didn't
need to carry around. Instead of letting it sit in a drawer, I took the mainboard
out and turned it into a headless home server that I can SSH into from the Mac
over Tailscale.

## The hardware

Framework has a [guide on YouTube](https://www.youtube.com/watch?v=gZs97pRqpRw)
for this, and in about an hour I had the mainboard out, set up in its enclosure,
and booting. Getting it online took longer: it was another week before I found
time to get a keyboard to plug in and pick up an Ethernet cable to connect it to
my router.

The enclosure is the
[Cooler Master Mainboard Case](https://frame.work/products/cooler-master-mainboard-case-and-mainboard-13th-gen-intel-core-kit?v=FRANHDCM01),
which I bought from Framework's website. Everything else came over from the
laptop: 32GB of RAM, the 512GB SSD, and the original Wi-Fi card and antennas.

<!-- TODO: a photo of the board in the case would fit here. -->

## Setup

I didn't install a new distro. The board already ran Fedora from when it was my
laptop, and running it headless didn't change that, so I kept it.

Before I sat down to finish the server, I used Claude to put together a
step-by-step checklist to follow. For the rest of the setup I used another
project of mine, [buddy.config](https://github.com/BadrChoubai/buddy.config). It's
the same CLI tool I run when setting up a new laptop, so the server gets set up
the same way my laptops do.

A few small issues came up along the way, but once I'd fixed them the rest went
smoothly.

<!-- TODO: name the issues; they're the most useful part for anyone doing the same. -->

## Why Tailscale?

I'd set up Tailscale before, so I knew what I was getting into. When I told
someone about this project, it was the first thing they suggested too. And it
was easy to set up: install it, run `sudo tailscale up`, and approve the machine
in the browser.

Tailscale puts the server and the MacBook on the same private network wherever
I am, so I can reach the server from anywhere without opening a port on my
router.

It also means SSH doesn't have to be reachable from anywhere else. The
`server` command in buddy.config trusts the `tailscale0` interface in firewalld
and closes `ssh` on the public zone, so the only way in is over Tailscale. On
top of that, `sshd` only accepts keys: no passwords, no root login, and only my
user can log in.

## Connecting from the Mac

I use regular OpenSSH over Tailscale, not Tailscale SSH. MagicDNS gives the
server the name `framework`, so the entry in `~/.ssh/config` on the Mac is
short:

```
Host framework
    HostName framework
    User bchoubai
```

On the Mac, Alacritty opens a plain local shell. A `dev` alias attaches to a
tmux session on the server, or starts one if it isn't running:

```sh
alias dev="ssh -t framework tmux new-session -A -s main"
```

Because the session lives on the server, I can close the terminal and pick up
where I left off. Copying in Neovim still lands on the Mac's clipboard, through
OSC 52.

## What it runs

Not much yet beyond Tailscale. The plan is to make it the machine I do remote
development on, with the MacBook as the screen and keyboard.
