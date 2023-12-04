---
id: example-token-vaults
title: OpenZeppelin Tokenized Vault Contract (ERC4626)
sidebar_label: Tokenized Vaults
slug: /example-token-vaults
---

# Tokenized Vault Contract (ERC4626)

This [repo](https://github.com/enviodev/erc4626-token-vault-indexer) contains an Envio indexer template built using Javascript for indexing events for OpenZeppelin Tokenized Vault Contracts (ERC4626). 

This repo was forked from the [original indexer](https://github.com/en0c-026/erc4626-indexer) built by en0c, one of Envio's successful bounty applicants. 

The `TokenVault` entity stores information about the tokenized vault, such as assets, shares, proportions, and exchange rates. `Deposit` and `Withdrawal` entities capture details about corresponding events, including sender, owner, assets, shares, and the associated vault.

The indexer has been built using v0.0.22 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/enviodev/erc4626-token-vault-indexer)
1. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
1. Install Envio via `npm i -g envio@v0.0.22`
1. Generate indexing code via `envio codegen`
1. Run the indexer via `envio dev` (make sure you have Docker running)
1. Stop the indexer via `envio start`
