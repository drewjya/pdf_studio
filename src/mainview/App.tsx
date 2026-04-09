import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { MergeView } from "./view/MergeView";
import { NumberingView } from "./view/NumberingView";
import { WatermarkView } from "./view/WatermarkView";

// Create the router tree
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MergeView,
});

const watermarkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watermark",
  component: WatermarkView,
});

const numberingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/numbering",
  component: NumberingView,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  watermarkRoute,
  numberingRoute,
]);
const router = createRouter({ routeTree });

// Standard React mount
function App() {
  return <RouterProvider router={router} />;
}

export default App;
