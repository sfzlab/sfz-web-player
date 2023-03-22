interface EditorOptions {
  url?: string;
}

interface InterfaceOptions {
  url?: string;
}

interface PlayerOptions {
  audio?: boolean;
  editor?: EditorOptions;
  interface?: InterfaceOptions;
}

export { EditorOptions, InterfaceOptions, PlayerOptions };
