const routes = [
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "movies", component: () => import("components/MovieList.vue") }, //
    ],
  },
  {
    path: "/",
    component: () => import("components/auth/LoginPrin.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;