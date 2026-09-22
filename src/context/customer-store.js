import { readJson } from './json-store.js';

const customersUrl = new URL('../../fixtures/customers.json', import.meta.url);

export async function getCustomer(customerId) {
  const customers = await readJson(customersUrl);
  return customers.find((customer) => customer.id === customerId) ?? null;
}
