export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export type Route = {
  path: string;
  method: Method;
  handler: (request: Request) => Promise<Response>;
};

export type RouterHandle = (path: string, handler: Route["handler"]) => void;

export type Router = {
  getRoutes: () => Route[];
  match: (request: Request) => Route | undefined;
  get: RouterHandle;
  post: RouterHandle;
  put: RouterHandle;
  patch: RouterHandle;
  delete: RouterHandle;
  options: RouterHandle;
  head: RouterHandle;
};

export const createRouter = (): Router => {
  const routes: Route[] = [];

  const getRoutes: Router["getRoutes"] = () => routes;

  const handle = (method: Method, path: string, handler: Route["handler"]) => {
    routes.push({ method, path, handler });
  };

  const match: Router["match"] = (request) => {
    let requestedPathname = new URL(request.url).pathname;

    if (requestedPathname.endsWith("/") && requestedPathname.length > 1) {
      requestedPathname = requestedPathname.slice(0, -1);
    }

    const wildcardRoutes = routes.filter((route) => route.path.endsWith("*"));

    for (const route of wildcardRoutes) {
      const routePathname = route.path.slice(0, -1);
      if (requestedPathname.startsWith(routePathname)) {
        return route;
      }
    }

    return routes.find(
      (route) =>
        route.method === request.method && route.path === requestedPathname,
    );
  };

  return {
    getRoutes,
    match,
    get: (path, handler) => handle(Method.GET, path, handler),
    post: (path, handler) => handle(Method.POST, path, handler),
    put: (path, handler) => handle(Method.PUT, path, handler),
    patch: (path, handler) => handle(Method.PATCH, path, handler),
    delete: (path, handler) => handle(Method.DELETE, path, handler),
    options: (path, handler) => handle(Method.OPTIONS, path, handler),
    head: (path, handler) => handle(Method.HEAD, path, handler),
  };
};
