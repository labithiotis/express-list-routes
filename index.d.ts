interface Options {
  spacer?: number;
  prefix?: string;
  logger?: ((method: string, space: string, path: string) => void) | boolean;
  color?: boolean;
}

interface Route {
  method?: string | object;
  path?: string;
}

interface Layer {
  name: string;
  route?: Route;
}

interface ExpressApp {
  // Express 3
  routes?: Record<string, Route[][]>;
  // Express 4
  _router?: { stack: Layer[] };
  // Express 4, 5 Router
  stack?: Layer[];
  // Express 5
  router?: { stack: Layer[] } | string;
}

declare function expressListRoutes(app: ExpressApp, options?: Options): Array<{ method: string; path: string }>;

export = expressListRoutes;
