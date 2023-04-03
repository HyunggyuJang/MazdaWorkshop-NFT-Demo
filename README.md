# NFT project using PSP34

[![workflow][a1]][a2] [![stack-exchange][s1]][s2] [![discord][d1]][d2] [![built-with-ink][i1]][i2] [![License][ap1]][ap2]

[s1]: https://img.shields.io/badge/click-white.svg?logo=StackExchange&label=ink!%20Support%20on%20StackExchange&labelColor=white&color=blue
[s2]: https://substrate.stackexchange.com/questions/tagged/ink?tab=Votes
[a1]: https://github.com/swanky-dapps/nft/actions/workflows/test.yml/badge.svg
[a2]: https://github.com/swanky-dapps/nft/actions/workflows/test.yml
[d1]: https://img.shields.io/discord/722223075629727774?style=flat-square&label=discord
[d2]: https://discord.gg/Z3nC9U4
[i1]: /.images/ink.svg
[i2]: https://github.com/paritytech/ink
[ap1]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[ap2]: https://opensource.org/licenses/Apache-2.0

This is an example nft project using ink! smart contract. The project is generated with Openbrush wizard for PSP34 with added PayableMinted trait.

### Purpose
This is to demonstrate how to development NFT project using ink! for Mazda Workshop.

### License
Apache 2.0

### 🏗️ How to use - Contracts
##### 💫 Build
- Use this [instructions](https://use.ink/getting-started/setup) to setup your ink!/Rust environment

```sh
yarn compile:release
```

##### 💫 Run unit test

```sh
cargo test
```
##### 💫 Deploy
First start your local node. Recommended [swanky-node](https://github.com/AstarNetwork/swanky-node) v1.1.0
```sh
swanky-node --dev -lerror,runtime::contracts::strace=trace,runtime::contracts=debug
```
- or deploy with polkadot.JS. Instructions on [Astar docs](https://docs.astar.network/docs/build/wasm/tooling/polkadotjs)

##### 💫 Run integration test
First start your local node. Recommended [swanky-node](https://github.com/AstarNetwork/swanky-node) v1.1.0
And then:
```sh
yarn test
```

##### 💫 NFT viewer
View minted NFT at [NFT viewer](https://swanky-nft.vercel.app/)!

#### 📚 Learn
Follow the [From Zero to ink! Hero](https://docs.astar.network/docs/build/wasm/from-zero-to-ink-hero/) tutorial tu learn how to build this smart contract
