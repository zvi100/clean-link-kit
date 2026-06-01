declare namespace chrome {
  namespace runtime {
    const lastError: { message?: string } | undefined;
    const onInstalled: {
      addListener(callback: () => void): void;
    };
    const onMessage: {
      addListener(callback: (message: unknown, sender: unknown, sendResponse: (response?: unknown) => void) => boolean | void): void;
    };
  }

  namespace contextMenus {
    type OnClickData = {
      menuItemId: string | number;
      linkUrl?: string;
      pageUrl?: string;
    };

    type CreateProperties = {
      id?: string;
      title: string;
      contexts?: string[];
    };

    function create(createProperties: CreateProperties, callback?: () => void): void;

    const onClicked: {
      addListener(callback: (info: OnClickData, tab?: tabs.Tab) => void): void;
    };
  }

  namespace tabs {
    type Tab = {
      id?: number;
      url?: string;
    };
  }

  namespace scripting {
    type InjectionTarget = {
      tabId: number;
    };

    type ScriptInjection<Args extends unknown[]> = {
      target: InjectionTarget;
      func: (...args: Args) => unknown;
      args?: Args;
    };

    function executeScript<Args extends unknown[]>(injection: ScriptInjection<Args>): Promise<unknown[]>;
  }
}
