import Vue from 'vue';
import Router from 'vue-router';
import affixDemo from '@/pages/affix-demo';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/affix',
      name: 'affixDemo',
      component: affixDemo,
    },
  ],
});
