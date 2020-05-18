import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuShow: false,
    serviceShow: false,
    title: "",
    tasks: [],
    groups: [],
    loading: null,
    success: null,
    error: null,
  },
  mutations: {
    SET_STORAGE_TASKS(state, data = null) {
      if (data) {
        const parsed = JSON.stringify(data);
        localStorage.setItem("tasks", parsed);
      } else {
        if (localStorage.getItem("tasks")) {
          try {
            state.tasks = JSON.parse(localStorage.getItem("tasks"));
          } catch (e) {
            state.error = "Ошибка приложения!";
            console.log(e);
            localStorage.removeItem("tasks");
          }
        }
      }
    },
    SET_TASK(state, data) {
      if (!data) {
        return;
      }
      let route = false;
      if (data.id === "new") {
        route = true;
        data.id = Number(new Date());
        state.tasks.push(data);
      } else {
        state.groups.forEach((x) => {
          x.id === data.id ? (x = data) : null;
        });
      }
      try {
        const parsed = JSON.stringify(state.tasks);
        localStorage.setItem("tasks", parsed);
        route ? router.push({ path: "task", query: { id: data.id } }) : null;
      } catch (e) {
        state.error = "Ошибка приложения!";
        setTimeout(() => {
          state.error = null;
        }, 3000);
        console.log(e);
        localStorage.removeItem("tasks");
      }
    },
    DELETE_TASK(state, task) {
      task.forEach((item) => {
        state.tasks.forEach((x, i) => {
          x.id === item.id ? state.tasks.splice(i, 1) : null;
        });
      });
      try {
        const parsed = JSON.stringify(state.tasks);
        localStorage.setItem("tasks", parsed);
      } catch (e) {
        state.error = "Ошибка приложения!";
        console.log(e);
        localStorage.removeItem("tasks");
      }
    },
    SET_STORAGE_GROUPS(state) {
      if (localStorage.getItem("groups")) {
        try {
          state.groups = JSON.parse(localStorage.getItem("groups"));
        } catch (e) {
          state.error = "Ошибка приложения!";
          console.log(e);
          localStorage.removeItem("groups");
        }
      } else {
        state.groups.length === 0
          ? state.groups.push({ id: "0", name: "Без группы" })
          : null;
        const parsed = JSON.stringify(state.groups);
        localStorage.setItem("groups", parsed);
      }
    },
    SET_GROUP(state, group) {
      if (!group) {
        return;
      }
      if (group.id === "new") {
        group.id = Number(new Date());
        state.groups.push(group);
      } else {
        state.groups.forEach((x) => {
          x.id === group.id ? (x = group) : null;
        });
      }
      try {
        const parsed = JSON.stringify(state.groups);
        localStorage.setItem("groups", parsed);
      } catch (e) {
        state.error = "Ошибка приложения!";
        setTimeout(() => {
          state.error = null;
        }, 3000);
        console.log(e);
        localStorage.removeItem("tasks");
      }
    },
    DELETE_GROUP(state, group) {
      state.groups.forEach((x, i) => {
        x.id === group.id ? state.groups.splice(i, 1) : null;
      });
      try {
        const parsed = JSON.stringify(state.groups);
        localStorage.setItem("groups", parsed);
      } catch (e) {
        state.error = "Ошибка приложения!";
        console.log(e);
        localStorage.removeItem("groups");
      }
    },
    SET_SERVICE_SHOW(state) {
      state.serviceShow = !state.serviceShow;
    },
    SET_MENU_SHOW(state) {
      state.menuShow = !state.menuShow;
    },
    SET_TITLE(state, title) {
      if (!title) {
        return;
      }
      state.title = title;
    },
    SET_LOADING(state) {
      state.loading = true;
      setTimeout(() => {
        state.loading = null;
      }, 1500);
    },
    SET_SUCCESS(state, success) {
      state.success = success;
      setTimeout(() => {
        state.success = null;
      }, 2000);
    },
    SET_ERROR(state, err) {
      state.error = err;
      setTimeout(() => {
        state.error = null;
      }, 2000);
    },
  },
  actions: {
    saveTask({ commit }, task) {
      commit("SET_LOADING");
      commit("SET_TASK", task);
      setTimeout(() => {
        commit("SET_SUCCESS", "Сохранил!");
      }, 2000);
    },
    deleteTask({ commit }, task) {
      commit("SET_LOADING");
      commit("DELETE_TASK", task);
      setTimeout(() => {
        commit("SET_SUCCESS", "Удалил!");
      }, 2000);
    },
    saveGroup({ commit }, group) {
      commit("SET_LOADING");
      commit("SET_GROUP", group);
      setTimeout(() => {
        commit("SET_SUCCESS", "Сохранил!");
      }, 2000);
    },
    deleteGroup({ commit, state }, group) {
      commit("SET_LOADING");
      state.tasks.forEach(x => {
        x.group === group.id ? x.group = '0' : null;
      })
      commit("SET_STORAGE_TASKS", state.tasks);
      commit("DELETE_GROUP", group);
      setTimeout(() => {
        commit("SET_SUCCESS", "Удалил!");
      }, 2000);
    },
  },
  getters: {
    TITLE(state) {
      return state.title;
    },
    TASKS(state) {
      return state.tasks;
    },
    TASKS_BY_ID(state) {
      return (id) => {
        return state.tasks.find((tasks) => tasks.id === Number(id));
      };
    },
    GROUPS(state) {
      return state.groups;
    },
    GROUPS_BY_ID(state) {
      return (id) => {
        return state.groups.find((group) => group.id === id);
      };
    },
    MENU_SHOW(state) {
      return state.menuShow;
    },
    SERVICE_SHOW(state) {
      return state.serviceShow;
    },
    SUCCESS(state) {
      return state.success;
    },
    LOADING(state) {
      return state.loading;
    },
    ERROR(state) {
      return state.error;
    },
  },
});
