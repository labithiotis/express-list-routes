interface Options {
  spacer?: number;
  prefix?: string;
  logger?: (method: string, space: string, path: string) => void;
}

interface Route {
  method?: string;
  path?: string;
}

interface Stack {
  route?: {
    stack: Route[];
    path?: string;
  };
  routerPath?: string;
}

interface ExpressApp {
  _router: {
    stack: Stack[];
  };
}

declare function expressListRoutes(app: ExpressApp, options?: Options): Array<{ method: string; path: string }>;

export { expressListRoutes as default };
