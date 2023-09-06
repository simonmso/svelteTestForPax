import { writable } from 'svelte/store';

export const segments = writable([]);
export const startPos = writable();
export const running = writable(false);
