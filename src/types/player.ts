interface EditorOptions {
  root?: string;
  url?: string;
}

interface InterfaceOptions {
  url?: string;
}

interface PlayerOptions {
  audio?: boolean;
  editor?: EditorOptions;
  header?: boolean;
  interface?: InterfaceOptions;
}

export { EditorOptions, InterfaceOptions, PlayerOptions };
