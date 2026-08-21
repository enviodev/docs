---
id: hypersync-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
slug: /troubleshooting
description: Fixes for common HyperSync and HyperRPC connectivity issues, including DNS resolution failures.
---

# Troubleshooting

Common connectivity issues with HyperSync and HyperRPC endpoints. If nothing here helps, ask in our [Discord](https://discord.gg/DhfFhzuJQh).

## DNS resolution failures

**Symptoms:** requests hang or time out intermittently, the first request after idle is slow but retries work, or you see `Could not resolve host` / `SERVFAIL` for `*.hypersync.xyz` or `*.rpc.hypersync.xyz`.

**Cause:** HyperSync endpoints use geographic load balancing with a multi-step DNS delegation chain and short TTLs. Some ISP and home-router resolvers (notably in South Africa and parts of Asia) can't follow the chain and return `SERVFAIL`. This is a client-side resolver issue, not an outage; public resolvers like Cloudflare and Google resolve it correctly.

**Verify:**

```bash
dig eth.hypersync.xyz A           # your system/ISP resolver
dig eth.hypersync.xyz A @1.1.1.1  # Cloudflare
dig eth.hypersync.xyz A @8.8.8.8  # Google
```

If the first returns `SERVFAIL` and the others return `NOERROR` with IPs, your resolver is the problem.

**Fix:** switch your system DNS to public resolvers.

- **Linux (systemd-resolved):**

  ```bash
  sudo mkdir -p /etc/systemd/resolved.conf.d
  printf '[Resolve]\nDNS=1.1.1.1 8.8.8.8 1.0.0.1 8.8.4.4\nFallbackDNS=9.9.9.9\n' \
    | sudo tee /etc/systemd/resolved.conf.d/dns.conf
  sudo systemctl restart systemd-resolved
  ```

  Revert by deleting the file and restarting `systemd-resolved`.

- **macOS:** `sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 8.8.8.8 1.0.0.1 8.8.4.4` (replace `Wi-Fi` with your interface; revert with `... Wi-Fi Empty`).

- **Windows:** Settings > Network & Internet > Wi-Fi > Hardware properties > DNS server assignment > Edit > Manual. Preferred `1.1.1.1`, alternate `8.8.8.8`.

- **Docker:** add `dns: ["1.1.1.1", "8.8.8.8"]` to the service in your compose file, or pass `--dns 1.1.1.1 --dns 8.8.8.8` to `docker run`.

| Resolver | IPs |
|---|---|
| Cloudflare | `1.1.1.1`, `1.0.0.1` |
| Google | `8.8.8.8`, `8.8.4.4` |
| Quad9 | `9.9.9.9` |

## Connection timeouts

If DNS resolves but requests still hang, check the endpoint directly:

```bash
curl -v --max-time 10 https://eth.hypersync.xyz/height
```

If this returns a block height, the service is healthy and the problem is on the network path (typically a corporate/university firewall or transient regional routing). Try from a different network to confirm.

## Getting help

Share the output of the `dig` and `curl` commands above, plus your location and ISP, in our [Discord](https://discord.gg/DhfFhzuJQh).
