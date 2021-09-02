// Generate list of dashboard for variation of gla dashboard (public, sla,...)
const generateGlaChildren = (namePrefix) => {
  const children = [
    {
      path: '/',
      alias: 'overview',
      name: `${namePrefix}Overview`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/reportOverview/ReportOverview.vue'
      ),
    },
    {
      path: 'high',
      name: `${namePrefix}High`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/highLowItems/HighLowItems.vue'
      ),
    },
    {
      path: 'low',
      name: `${namePrefix}Low`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/highLowItems/HighLowItems.vue'
      ),
    },
    {
      path: 'gap',
      name: `${namePrefix}SignificantGap`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/significantGap/SignificantGap.vue'
      ),
    },
    {
      path: 'comments',
      name: `${namePrefix}Comments`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/writtenComments/WrittenComments.vue'
      ),
    },
    {
      path: 'respondents-overview',
      name: `${namePrefix}RespondentsOverview`,
      component: () => import(
        /* webpackChunkName: "gla" */ '../views/gla/content/respondentsOverview/RespondentsOverview.vue'
      ),
    },
  ];

  return children;
};

export default generateGlaChildren;
