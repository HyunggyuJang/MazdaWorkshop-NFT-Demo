import type { DecodedEvent } from '@polkadot/api-contract/types';
import { Result } from '@arthswap/typechain-types';
import { expect } from 'chai';
export { expect };

export function parseUnits(amount: bigint | number, decimals = 18): bigint {
  return BigInt(amount) * 10n ** BigInt(decimals);
}

export function emit(
  result: { events?: DecodedEvent[] },
  name: string,
  args: object,
  index = 0,
): void {
  const events = result.events.filter(
    (event) => event.event.identifier === name,
  );
  const event = events[index];
  expect(event.args.map((arg) => arg.toString())).to.eql(
    Object.values(args).map((arg) => (arg !== null ? arg.toString() : '')),
  );
}

export function revertedWith(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: { value: { err?: any } },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  errorTitle: any,
): void {
  if (result.value instanceof Result) {
    result.value = result.value.ok;
  }
  if (typeof errorTitle === 'object') {
    expect(result.value).to.have.property('err', errorTitle);
  } else {
    expect(result.value.err).to.have.property(errorTitle);
  }
}

// Helper function to convert error code to string
export function hex2a(psp34CustomError: any): string {
  var hex = psp34CustomError.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str.substring(1);
}
