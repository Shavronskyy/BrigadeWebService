declare global {
  interface Window {
    FB: {
      init: (config: { xfbml: boolean; version: string }) => void;
      XFBML: {
        parse: () => void;
      };
    };
    fbAsyncInit: () => void;
  }
}

export {};
