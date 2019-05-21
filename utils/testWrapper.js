import { ACCOUNT_NAMES } from "./constants";

export function testWrapper(callback) {
  Object.keys(ACCOUNT_NAMES).forEach(accountName => {
    callback(accountName);
  });
}
