type Listener = () => void;

let listeners: Listener[] = [];

export const onUnauthorized = (fn: Listener): (() => void) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
};

export const emitUnauthorized = (): void => {
  listeners.forEach((fn) => fn());
};