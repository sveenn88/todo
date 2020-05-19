<template>
  <section>
    <div class="container">
      <div class="add-task">
        <label class="lable add-task__lable">
          Название
          <input
            v-model="task.name"
            type="text" 
            id="name" 
            class="add-task__name">
        </label>
        <label class="lable add-task__lable">
          Статус
          <select 
            v-model="task.status"
            name="status" 
            id="status" 
            class="add-task__group">
            <option v-bind:value="false">Не сделано</option>
            <option v-bind:value="true">Сделано</option>
          </select>
        </label>
        <label class="lable add-task__lable">
          Группа
          <select
            v-model="task.group"
            name="group" 
            id="group" 
            class="add-task__group">
            <option 
              v-for="item in groups"
              :key="item.id"
              v-bind:value="item.id">{{item.name}}</option>
          </select>
        </label>
        <label class="lable add-task__lable-disc">
          Описание
          <textarea
            v-model="task.disc"
            name="disc" 
            id="disc" 
            rows="5"
            class="add-task__disc"
            ></textarea>
        </label>
        <button 
          class="btn-add"
          v-show="lengthName"
          v-on:click="saveTask()"
          >Сахранить</button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'Task',
  metaInfo: function () {
    return { title: this.title }
  },
  props: {
    id: {
      default: null
    }
  },
  data: function () {
    return {
      newTask: { id: 'new', name: '', disc: '', status: false, group: '0' }
    }
  },
  computed: {
    title () {
      if (this.id) {
        this.$store.commit('SET_TITLE', 'Редактирование задания');
      } else {
        this.$store.commit('SET_TITLE', 'Добавление задания');
      }
      return this.$store.getters.TITLE
    },
    task () {
      if (this.id) {
        if (this.$store.getters.TASKS_BY_ID(this.id)) {
          return this.$store.getters.TASKS_BY_ID(this.id)
        }
      }
      return this.newTask
    },
    lengthName() {
      return this.task.name.trim().length > 3
    },
    groups () {
      return this.$store.getters.GROUPS
    },
  },
  methods: {
    saveTask() {
      this.$store.dispatch('saveTask', this.task)
      this.newTask = { id: 'new', name: '', disc: '', status: false, group: '0' }
    }
  },
  mounted() {
    this.$store.commit('SET_MENU_SHOW', false); 
    this.$store.commit('SET_STORAGE_GROUPS');
    this.$store.commit('SET_STORAGE_TASKS');
  },
}
</script>