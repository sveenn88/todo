<template>
<div>
  <section>
    <div class="container">
      <div class="service" v-bind:class="{ active: service }">
        <div class="service__check">
          <input 
            type="checkbox" 
            class="custom-checkbox service__checkbox"
            v-model="allSelectTasks"
            v-on:change="setAllSelectTasks()"
          ><label><span>All</span></label>
        </div>
        <input
          v-model="filter.name"
          type="search"
          class="service__search"
          placeholder="Search">
        <select 
          v-model="filter.status"
          name="status" 
          id="status" 
          class="service__status">
          <option v-bind:value="null">Все</option>
          <option v-bind:value="false">Не сделано</option>
          <option v-bind:value="true">Сделано</option>
        </select>
        <select 
          v-model="filter.group"
          name="group"
          id="group"
          class="service__group">
          <option v-bind:value="null">Все</option>
          <option 
            v-for="item in groups"
            :key="item.id"
            v-bind:value="item.id">{{item.name}}</option>
        </select>
        <div class="service__action">
          <button class="btn-service" v-on:click="resetFilter()">
            <svg class="blue">
              <use xlink:href="img/icons/icons.svg#refresh" />
            </svg>
          </button>
          <button v-show="countSelectTask > 0" class="btn-service" v-on:click="dialogDelList = true">
            <svg class="red">
              <use xlink:href="img/icons/icons.svg#delete" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="not-fount" v-show="tasks.length === 0">
        <p>Записей не найдено!</p>
        <div class="help">
          Добрый день. 
          <br>
          <span>Некоторые особенности:</span> 
          <ul>
            <li>
              - Смена статуса возможна кликом по значку статуса в карточке.
            </li>
            <li>
              - Полное описание открывается кликом по тексту.
            </li>
            <li>
              - Имеется дефолтная группа для заданий. При удалении группы задания перемещаются в дефолтную группу.
            </li>
            <li>
              - Кнопка сохранить на странице "Add task" доступна после ввода более 3-х символов в поле "Название"
            </li>
          </ul>
        </div>
      </div>
      <div class="task">
        <div class="task__card" v-for="task in tasks"
          :key="task.id">
          <div class="task__short">
            <div class="task__check">
              <input 
                type="checkbox" 
                class="custom-checkbox"
                v-model="selectList[task.id]"
                v-on:change.stop="checkAllSelectTasks()"
              ><label><span></span></label>
            </div>
            <div class="task__status" v-on:click="toggleStatus(task)">
              <svg v-if="task.status" class="img-status done">
                <use xlink:href="img/icons/icons.svg#done" />
              </svg>
              <svg v-if="!task.status" class="img-status no-done">
                <use xlink:href="img/icons/icons.svg#done" />
              </svg>
            </div>
            <div class="task__title">{{task.name}}</div>
            <div class="task__group">{{ groupById(task.group).name}}</div>
            <div class="task__action">
              <button class="btn-edit" v-on:click="goEditTask(task.id)">
                <svg class="blue">
                  <use xlink:href="img/icons/icons.svg#edit" />
                </svg>
              </button>
              <button class="btn-delete" v-on:click="openDialog(task)">
                <svg class="red">
                  <use xlink:href="img/icons/icons.svg#delete" />
                </svg>
              </button>
            </div>
          </div>
          <div class="task__full">
            <div 
              class="task__text hidden"
              v-bind:id="task.id"
              v-on:click="openFullDisc($event)">
              {{task.disc}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="dialog-group" id="dialog" v-bind:class="{ active: dialog }" v-on:click.stop="closeDialog($event)">
      <div class="dialog-group__wrap">
        <div class="dialog-group__title">Удалить?</div>
        <div class="dialog-group__actions">
          <button class="dialog-group__btn bg-green" v-on:click="removeTask()">Да</button>
          <button id="btn-close" class="dialog-group__btn bg-red">Нет</button>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="dialog-group" id="dialogDelList" v-bind:class="{ active: dialogDelList }" v-on:click.stop="closeDialogDelList($event)">
      <div class="dialog-group__wrap">
        <div class="dialog-group__title">Удалить?</div>
        <div class="dialog-group__actions">
          <button class="dialog-group__btn bg-green" v-on:click="removeSelectTasks()">Да</button>
          <button id="btn-close" class="dialog-group__btn bg-red">Нет</button>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
export default {
  name: 'Home',
  metaInfo: function () {
    return { title: this.title }
  },
  data: function () {
    return {
      selectList: {},
      allSelectTasks: false,
      dialog: false,
      dialogDelList: false,
      deleteTask: null,
      delList: [],
      filter: {
        group: null,
        status: null,
        name: ''
      },
    }
  },
  computed: {
    title () {
      this.$store.commit('SET_TITLE', 'Главная');
      return 'Главная'
    },
    tasks () {
      if (Object.keys(this.filter).length > 0) {
        let tasks = this.$store.getters.TASKS
        let filter = this.filter
        return tasks.filter(function (elem) {
          let result = true
          for (var key in filter) {
            if (filter[key] !== null && filter[key] !== '') {
              if(key !== 'name') {
                elem[key] === filter[key] ? null : result = false
              } else {
                elem[key].trim().toLowerCase().indexOf(filter[key].trim().toLowerCase()) > -1 ? null : result = false
              }
            }
          }
          return result
        })
      } else {
        return this.$store.getters.TASKS
      }
    },
    groups () {
      return this.$store.getters.GROUPS
    },
    countSelectTask () {
      let count = 0
      let list = this.selectList
      this.tasks.forEach(x => {
        if(list[x.id]) {
          count++
        }
      })
      return count
    },
    service () {
      return this.$store.getters.SERVICE_SHOW
    },
  },
  methods: {
    groupById (id) {
      return this.$store.getters.GROUPS_BY_ID(id)
    },
    resetFilter() {
      this.filter = { group: null, status: null, name: '' }
    },
    goEditTask(id) {
      this.$router.push({ path: "task", query: { id: id } });
    },
    removeTask() {
      this.$store.dispatch('deleteTask', [this.deleteTask]);
      this.dialog = false;
      this.deleteTask = null;
    },
    removeSelectTasks() {
      this.delList = []
      this.tasks.forEach(x => {
        if(this.selectList[x.id]) {
          this.delList.push(x)
        }
      })
      this.delList.length > 0 
      ? this.$store.dispatch('deleteTask', this.delList)
      : null
      this.dialogDelList = false;
      this.resetSelectList()
      this.delList = []
    },
    setAllSelectTasks() {
      this.tasks.forEach(x => {
        this.selectList[x.id] = this.allSelectTasks
      });
    },
    checkAllSelectTasks() {
      let check = true
      this.tasks.forEach(x => {
        if(!this.selectList[x.id]) {
          check = false
        }
      });
      this.allSelectTasks = check
    },
    saveTask() {
      const parsed = JSON.stringify(this.tasks);
      localStorage.setItem('tasks', parsed);
    },
    toggleStatus(task) {
      task.status = !task.status
      this.$store.dispatch('saveTask', task)
    },
    openDialog (task) {
      this.deleteTask = task
      this.dialog = true;
    },
    closeDialog (event) {
      if (event.target.id === 'dialog' || event.target.id === 'btn-close') {
        this.dialog = false;
      }
    },
    closeDialogDelList (event) {
      if (event.target.id === 'dialogDelList' || event.target.id === 'btn-close') {
        this.dialogDelList = false;
      }
    },
    openFullDisc (event) {
      event.target.classList.toggle("hidden");
    },
    resetSelectList() {
      this.allSelectTasks = false
      for(let key in this.selectList) {
        this.selectList[key] = false
      }
    }
  },
  mounted() {
    this.resetSelectList()
    this.$store.commit('SET_MENU_SHOW');
    this.$store.commit('SET_STORAGE_GROUPS');
    this.$store.commit('SET_STORAGE_TASKS');
  }
}
</script>
