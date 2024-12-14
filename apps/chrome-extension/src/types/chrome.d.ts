declare namespace Chrome {
  interface Tab {
    id: number;
    url?: string;
  }

  interface Runtime {
    lastError?: {
      message: string;
    };
  }
}

interface Window {
  chrome: {
    tabs: {
      query: (queryInfo: {
        active: boolean;
        currentWindow: true;
      }) => Promise<[Chrome.Tab]>;
      sendMessage: (
        tabId: number,
        message: any,
        callback: (response: any) => void
      ) => void;
    };
    runtime: Chrome.Runtime;
  };
}

declare const chrome: Window["chrome"];
