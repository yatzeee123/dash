import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "auth/signup.tsx"),
  route("login", "auth/login.tsx"),
  route("logout", "auth/logout.ts"),
  route("auth/confirm", "routes/confirm.ts"),
  route("dashboard", "dashboard/dashboard.tsx", [
    index("dashboard/index.tsx"),
    route("products", "dashboard/products.tsx"),
    route("customers", "dashboard/customers.tsx"),
    route("settings", "dashboard/settings.tsx"),
  ]),
] satisfies RouteConfig;
