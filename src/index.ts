import Editor from './components/Editor';
import Interface from './components/Interface';
import Player from './components/Player';

// Create a global instance for testing
declare global {
  interface Window {
    player?: Player;
  }
}

export { Editor, Interface, Player };
