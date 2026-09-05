/**
 * Caps how many sandboxed (Docker) code executions run at once. Each
 * container is individually resource-capped (see cpp-runner.ts), but nothing
 * else limits how many run *simultaneously* — without this, N concurrent
 * submissions spin up N concurrent containers, and their combined resource
 * use can exceed the host's actual capacity even though every individual
 * container behaves. One slot is held for a whole submission's compile +
 * all-its-tests sequence, not per docker call, so one submission can't
 * fragment its own work across multiple slots.
 */

const MAX_CONCURRENT = 4;
const MAX_QUEUE_WAIT_MS = 10_000;

let active = 0;
const waiters: (() => void)[] = [];

// When a slot frees up and someone is waiting, it's handed straight to them —
// `active` doesn't change (one consumer left, one immediately begins). It
// only decrements when nobody is waiting to take the freed slot.
function releaseSlot() {
  const next = waiters.shift();
  if (next) next();
  else active--;
}

/** Resolves with a release function once a slot is available, or throws if the wait times out. */
export function acquireSandboxSlot(): Promise<() => void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve(releaseSlot);
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const i = waiters.indexOf(onSlot);
      if (i !== -1) waiters.splice(i, 1);
      reject(new Error("SANDBOX_QUEUE_TIMEOUT"));
    }, MAX_QUEUE_WAIT_MS);

    function onSlot() {
      clearTimeout(timer);
      resolve(releaseSlot);
    }

    waiters.push(onSlot);
  });
}
