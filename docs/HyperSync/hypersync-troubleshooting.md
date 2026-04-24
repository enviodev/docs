---
id: hypersync-troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
slug: /troubleshooting
description: Solutions for common HyperSync and HyperRPC connectivity issues including DNS resolution failures.
---

# HyperSync Troubleshooting

This guide covers common connectivity issues with HyperSync and HyperRPC endpoints. If you don't find a solution here, please join our [Discord community](https://discord.gg/DhfFhzuJQh) for additional support.

## DNS Resolution Failures

### Symptoms

- HyperSync or HyperRPC requests hang or timeout intermittently
- `curl` to HyperSync endpoints is slow on the first request but works after retrying
- Errors like `Could not resolve host` or `SERVFAIL` when querying `*.hypersync.xyz` or `*.rpc.hypersync.xyz`
- The issue appears on cold start (first request after a period of inactivity) but resolves after a successful lookup

### Cause

HyperSync and HyperRPC endpoints use geographic load balancing (GSLB) with a multi-step DNS delegation chain. Some ISP and home router DNS resolvers — particularly in regions like South Africa, parts of Asia, and other areas far from US/EU — cannot follow this delegation chain correctly and return `SERVFAIL` instead of resolving the domain.

The issue is made worse by the low TTL (time-to-live) on DNS records, which means your resolver needs to re-resolve the full chain frequently rather than serving from cache.

**This is a client-side DNS resolver issue, not a HyperSync service outage.** Public DNS resolvers like Cloudflare and Google handle the resolution correctly.

### How to verify

You can confirm this is a DNS issue by testing with different resolvers:

```bash
# This will likely fail or be slow (your system/ISP resolver)
dig eth.hypersync.xyz A

# These should succeed immediately
dig eth.hypersync.xyz A @1.1.1.1   # Cloudflare
dig eth.hypersync.xyz A @8.8.8.8   # Google
```

If the first command returns `status: SERVFAIL` but the others return `status: NOERROR` with IP addresses, your system DNS resolver is the problem.

### Solution

Configure your system to use public DNS resolvers (Cloudflare and Google) instead of your ISP/router DNS.

#### Linux (systemd-resolved — Ubuntu, Debian, Fedora, etc.)

```bash
sudo mkdir -p /etc/systemd/resolved.conf.d

echo '[Resolve]
DNS=1.1.1.1 8.8.8.8 1.0.0.1 8.8.4.4
FallbackDNS=9.9.9.9
Cache=yes
CacheFromLocalhost=yes' | sudo tee /etc/systemd/resolved.conf.d/dns.conf

sudo systemctl restart systemd-resolved
```

To revert:

```bash
sudo rm /etc/systemd/resolved.conf.d/dns.conf
sudo systemctl restart systemd-resolved
```

#### macOS

```bash
# Replace Wi-Fi with your network interface name if different
sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 8.8.8.8 1.0.0.1 8.8.4.4
```

To revert:

```bash
sudo networksetup -setdnsservers Wi-Fi Empty
```

#### Windows

1. Open **Settings > Network & Internet > Wi-Fi > Hardware properties**
2. Click **Edit** next to DNS server assignment
3. Set to **Manual** and enter:
   - Preferred DNS: `1.1.1.1`
   - Alternate DNS: `8.8.8.8`

#### Docker containers

If running HyperSync clients inside Docker, add DNS configuration to your container or compose file:

```yaml
# docker-compose.yml
services:
  your-service:
    dns:
      - 1.1.1.1
      - 8.8.8.8
```

### DNS resolvers reference

| IP | Provider | Notes |
|---|---|---|
| `1.1.1.1` / `1.0.0.1` | Cloudflare DNS | Generally the fastest global resolver |
| `8.8.8.8` / `8.8.4.4` | Google Public DNS | Reliable with good global coverage |
| `9.9.9.9` | Quad9 | Privacy-focused, blocks known malicious domains |

## Connection Timeouts

### Symptoms

- Requests to HyperSync endpoints timeout after DNS resolves successfully
- `curl https://<chain>.hypersync.xyz/height` hangs or returns a connection error

### Possible causes

1. **Firewall or corporate network blocking:** Some corporate or university networks block non-standard traffic. Try from a different network to confirm.
2. **Regional routing issues:** In rare cases, network routing between your region and the HyperSync servers may be degraded. This is typically transient.

### How to verify

```bash
# Check if the endpoint is reachable
curl -v --max-time 10 https://eth.hypersync.xyz/height

# Check latency to the resolved IP
ping -c 5 $(dig +short eth.hypersync.xyz A @1.1.1.1 | head -1)
```

If `curl` succeeds with a block height number, the service is healthy and the issue is likely on the network path between you and the server.

## Getting Help

If you're still experiencing issues after trying the above solutions:

1. Run the DNS check commands above and note the output
2. Note your geographic location and ISP
3. Share these details in our [Discord community](https://discord.gg/DhfFhzuJQh) so we can help debug further
