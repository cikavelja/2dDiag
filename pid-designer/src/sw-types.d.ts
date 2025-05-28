/// <reference lib="webworker" />
/* eslint-disable no-undef */

// This adds the type definitions for the service worker API
// See: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

declare const self: ServiceWorkerGlobalScope;

interface ExtendableEvent extends Event {
  waitUntil(f: Promise<any>): void;
}

interface ExtendableMessageEvent extends ExtendableEvent {
  readonly data: any;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort>;
  readonly source: Client | ServiceWorker | MessagePort | null;
}

// Add missing Workbox types
declare module "workbox-precaching" {
  function precacheAndRoute(entries: Array<{ revision: string; url: string }> | any): void;
  function cleanupOutdatedCaches(): void;
}
