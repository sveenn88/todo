import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Group from "../components/Group.vue";
import Task from "../components/Task.vue";

Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/task",
      props: (x) => x.query,
      name: "Task",
      component: Task,
    },
    {
      path: "/group",
      name: "Group",
      component: Group,
    },
  ];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
