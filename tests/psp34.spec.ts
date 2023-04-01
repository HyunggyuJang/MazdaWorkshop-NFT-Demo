import { expect, emit, hex2a } from './testHelpers';
import BN from 'bn.js';
import Rmrk_factory from '../types/constructors/shiden34';
import Rmrk from '../types/contracts/shiden34';

import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

const MAX_SUPPLY = 888;
const BASE_URI = "ipfs://tokenUriPrefix/";
const ONE = new BN(10).pow(new BN(18));
const PRICE_PER_MINT = ONE;

// Create a new instance of contract
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519' });

describe('Minting psp34 tokens', () => {
  let rmrkFactory: Rmrk_factory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  let bob: KeyringPair;
  let contract: Rmrk;

  async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri('//Alice');
    bob = keyring.addFromUri('//Bob');
    rmrkFactory = new Rmrk_factory(api, deployer);
    contract = new Rmrk((await rmrkFactory.new(
      'Shiden34' as unknown as string[],
      'SH34' as unknown as string[],
      BASE_URI as unknown as string[],
      MAX_SUPPLY,
      PRICE_PER_MINT,
    )).address, deployer, api);
  }

  it('Create collection works', async () => {
    await setup();
    expect((await contract.query.totalSupply()).value.ok.toNumber()).to.equal(0);
    expect((await contract.query.owner()).value.ok).to.equal(deployer.address);
    expect((await contract.query.maxSupply()).value.ok).to.equal(MAX_SUPPLY);
    expect((await contract.query.price()).value.ok.toString()).to.equal(PRICE_PER_MINT.toString());
    const collectionId = (await contract.query.collectionId()).value.ok;

    expect(hex2a((await contract.query.getAttribute(collectionId as unknown, "baseUri" as unknown as string[])).value.ok)).to.equal(BASE_URI);
  })

  it('Use mintNext works', async () => {
    await setup();
    const tokenId = 1;

    expect((await contract.query.totalSupply()).value.ok.toNumber()).to.equal(0);

    // mint
    let mintResult = await contract.withSigner(bob).tx.mintNext({ value: PRICE_PER_MINT });

    // verify minting results. The totalSupply value is BN
    expect((await contract.query.totalSupply()).value.ok.toNumber()).to.equal(1);
    expect((await contract.query.balanceOf(bob.address)).value.ok).to.equal(1);
    expect((await contract.query.ownerOf({ u64: tokenId })).value.ok).to.equal(bob.address);
    emit(mintResult, 'Transfer', { from: null, to: bob.address, id: `{"u64":${tokenId}}`, });

    // TODO verify tokenUri call
    // console.log("tokenUri", (await contract.query.tokenUri(1)).value);
    // expect((await contract.query.tokenUri(1))).to.equal(TOKEN_URI_1);
  })

  it('Mint 5 tokens works', async () => {
    await setup();

    expect((await contract.query.totalSupply()).value.ok.toNumber()).to.equal(0);

    await contract.withSigner(deployer).tx.setMaxMintAmount(5);

    await contract.withSigner(bob).tx.mint(bob.address, 5, { value: PRICE_PER_MINT.muln(5) });

    expect((await contract.query.totalSupply()).value.ok.toNumber()).to.equal(5);
    expect((await contract.query.ownerOf({ u64: 5 })).value.ok).to.equal(bob.address);
  })

  it('Token transfer works', async () => {
    await setup();

    // Bob mints
    let mintResult = await contract.withSigner(bob).tx.mintNext({ value: PRICE_PER_MINT });
    emit(mintResult, 'Transfer', { from: null, to: bob.address, id: `{"u64":${1}}`, });

    // Bob transfers token to Deployer
    let transferResult = await contract.withSigner(bob).tx.transfer(deployer.address, { u64: 1 }, []);

    // Verify transfer
    expect((await contract.query.ownerOf({ u64: 1 })).value.ok).to.equal(deployer.address);
    expect((await contract.query.balanceOf(bob.address)).value.ok).to.equal(0);
    emit(transferResult, 'Transfer', { from: bob.address, to: deployer.address, id: `{"u64":${1}}`, });
  })

  it('Token approval works', async () => {
    await setup();

    // Bob mints
    await contract.withSigner(bob).tx.mintNext({ value: PRICE_PER_MINT });

    // Bob approves deployer to be operator of the token
    let approveResult = await contract.withSigner(bob).tx.approve(deployer.address, { u64: 1 }, true);

    // Verify that Bob is still the owner and allowance is set
    expect((await contract.query.ownerOf({ u64: 1 })).value.ok).to.equal(bob.address);
    expect((await contract.query.allowance(bob.address, deployer.address, { u64: 1 })).value.ok).to.equal(true);
    emit(approveResult, 'Approval', { from: bob.address, to: deployer.address, id: `{"u64":${1}}`, approved: true, });
  })

  it('Minting token without funds should fail', async () => {
    await setup();

    // Bob tries to mint without funding
    let mintResult = await contract.withSigner(bob).query.mintNext();
    expect(hex2a(mintResult.value.ok.err.custom)).to.be.equal('BadMintValue');
  })
})
