<template>
<div>
  <section>
    <div class="container">
      <div class="add-group">
        <span class="add-group__title">Добавить новую группу</span>
        <label class="lable add-group__lable-name">
          Название
          <input type="text" class="add-group__name" v-model="newGroup.name">
        </label>
        <button class="btn-add" v-on:click="saveGroup(newGroup)">Сахранить</button>
      </div>
    </div>
    <div class="container"
      v-for="group in groups"
      :key="group.id"
    >
      <div 
        class="add-group list"
        v-if="group.id !== '0'"
      >
        <label class="lable add-group__lable-name">
          Название
          <input type="text" class="add-group__name" v-model="group.name">
        </label>
        <button class="btn-save" v-on:click="saveGroup(group)">
          <svg class="green">
            <use xlink:href="img/icons/icons.svg#save" />
          </svg>
        </button>
        <button 
          class="btn-delete"
          v-on:click="openDialog(group)"
        >
          <svg class="red">
            <use xlink:href="img/icons/icons.svg#delete" />
          </svg>
        </button>
      </div>
    </div>
  </section>
  <section>
    <div class="dialog-group" id="dialog" v-bind:class="{ active: dialog }" v-on:click.stop="closeDialog($event)">
      <div class="dialog-group__wrap">
        <div class="dialog-group__title">Удалить?</div>
        <div class="dialog-group__actions">
          <button class="dialog-group__btn bg-green" v-on:click="removeGroup()">Да</button>
          <button id="btn-close" class="dialog-group__btn bg-red">Нет</button>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
export default {
  name: 'Group',
  metaInfo: function () {
    return { title: this.title }
  },
  data: function () {
    return {
      deleteGroup: null,
      newGroup: {id: 'new', name: ''},
      dialog: false
    }
  },
  computed: {
    title () {
      this.$store.commit('SET_TITLE', 'Группы');
      return 'Группы'
    },
    groups () {
      return this.$store.getters.GROUPS
    },
  },
  methods: {
    saveGroup(group) {
      this.$store.dispatch('saveGroup', group)
      this.newGroup = {id: 'new', name: ''}
    },
    removeGroup() {
      this.$store.dispatch('deleteGroup', this.deleteGroup);
      this.dialog = false;
      this.deleteGroup = null;
    },
    openDialog (group) {
      this.deleteGroup = group
      this.dialog = true;
    },
    closeDialog (event) {
      if (event.target.id === 'dialog' || event.target.id === 'btn-close') {
        this.dialog = false;
      }
    }
  },
  mounted() {
    this.$store.commit('SET_MENU_SHOW');
    this.$store.commit('SET_STORAGE_GROUPS');
    this.$store.commit('SET_STORAGE_TASKS');
  },
}
</script>
