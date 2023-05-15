---
id: installation
title: Installation
sidebar_label: Installation
slug: /installation
---

<sub><sup> NOTE: These docs are under active development 👷‍♀️👷 </sup></sub>

# Installation

Install prerequisite tools:
1. Node.js (install v18) https://nodejs.org/en
   (Recommended to use a node manager like fnm or nvm)
2. pnpm
   ```
   npm install --global pnpm
   ```
3. Cargo https://doc.rust-lang.org/cargo/getting-started/installation.html
   Run `curl https://sh.rustup.rs -sSf | sh`
4. Docker Desktop https://www.docker.com/products/docker-desktop/

Install Envio:
```
cargo install --path codegenerator`
```


Command to see available CLI commands
```
envio --help
```

---