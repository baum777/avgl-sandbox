import { readJson } from './json-store.js';

const ordersUrl = new URL('../../fixtures/orders.json', import.meta.url);

export async function getOrder(orderId) {
  const orders = await readJson(ordersUrl);
  return orders.find((order) => order.id === orderId) ?? null;
}
