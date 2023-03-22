interface InterfaceOptions {
  el: HTMLElement | string;
  url?: string;
}

interface PlayerOptions {
  audio?: boolean;
  editor?: boolean;
  interface?: InterfaceOptions;
}

export { InterfaceOptions, PlayerOptions };
