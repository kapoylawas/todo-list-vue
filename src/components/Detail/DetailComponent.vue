<template>
  <section class="w-full px-5 py-10 mx-auto sm:max-w-5xl">
    <div class="flex justify-between w-full">
      <div class="flex items-center">
        <router-link to="/" class="p-2" data-cy="todo-back-button">
          <font-awesome-icon icon="fa-solid fa-chevron-left" class="fa-xl" />
        </router-link>
        <div v-if="!isEditActivityTitle" class="flex items-center">
          <h1
            class="ml-4 text-4xl font-bold"
            data-cy="todo-title"
            @click="updateTitle"
          >
            {{ activity && activity.title ? activity.title : '' }}
          </h1>
          <a
            data-cy="todo-title-edit-button"
            class="p-2 mx-4 cursor-pointer"
            @click="updateTitle"
          >
            <font-awesome-icon
              icon="fa-solid fa-pencil"
              class="text-gray-500 fa-lg hover:text-amber-500"
            />
          </a>
        </div>
        <div v-else class="w-[500px] ml-4 flex items-center">
          <input
            data-cy="todo-title"
            v-model="activity.title"
            @blur="updateTitle(true)"
            type="text"
            class="flex-1 p-3 text-4xl font-bold bg-transparent border-b border-black focus:outline-none"
          />
          <a
            data-cy="todo-title-edit-button"
            @click="updateTitle(true)"
            class="flex items-center justify-center p-2 cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-check" class="fa-lg" />
          </a>
        </div>
      </div>
      <div class="flex items-center">
        <div class="relative mr-4">
          <button
            data-cy="todo-sort-button"
            @click="toggleFilterDropdown"
            class="w-[50px] h-[50px] bg-transparent border border-gray-400 hover:border-blue-500 text-gray-400 hover:text-blue-500 flex justify-center items-center rounded-full text-lg font-bold"
          >
            
            <img src="@/assets/filter.svg" alt="" />
            
          </button>
          <div
            v-show="isFilterDropdownOpen"
            class="absolute min-w-[200px] shadow-md bg-white rounded-lg mt-3"
          >
            <a
              data-cy="sort-selection"
              @click="setTodoFilter('terbaru')"
              class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-down-wide-short"
                  class="mr-3 text-blue-500"
                />
                Terbaru
              </div>
              <font-awesome-icon
                v-show="setFilter === 'terbaru'"
                icon="fa-solid fa-check"
              />
            </a>
            <a
              data-cy="sort-selection"
              @click="setTodoFilter('terlama')"
              class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-up-wide-short"
                  class="mr-3 text-blue-500"
                />
                Terlama
              </div>
              <font-awesome-icon
                v-show="setFilter === 'terlama'"
                icon="fa-solid fa-check"
              />
            </a>
            <a
              data-cy="sort-selection"
              @click="setTodoFilter('az')"
              class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-down-a-z"
                  class="mr-3 text-blue-500"
                />
                A-Z
              </div>
              <font-awesome-icon
                v-show="setFilter === 'az'"
                icon="fa-solid fa-check"
              />
            </a>
            <a
              data-cy="sort-selection"
              @click="setTodoFilter('za')"
              class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-down-z-a"
                  class="mr-3 text-blue-500"
                />
                Z-A
              </div>
              <font-awesome-icon
                v-show="setFilter === 'za'"
                icon="fa-solid fa-check"
              />
            </a>
            <a
              data-cy="sort-selection"
              @click="setTodoFilter('not-done')"
              class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200"
            >
              <div>
                <font-awesome-icon
                  icon="fa-solid fa-plus"
                  class="mr-3 text-blue-500"
                />
                Belum Selesai
              </div>
              <font-awesome-icon
                v-show="setFilter === 'not-done'"
                icon="fa-solid fa-check"
              />
            </a>
          </div>
        </div>
        <button
          data-cy="todo-add-button"
          @click="toggleTodoModal('add')"
          class="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-full"
        >
          <font-awesome-icon icon="fa-solid fa-plus fa-lg" class="mr-2" />
          Tambah
        </button>
      </div>
    </div>
    <article
      v-if="activity && activity.todo_items.length > 0"
      class="flex flex-col justify-center w-full p-5 mx-auto mt-8 sm:max-w-5xl"
    >
      <TodoItem
        data-cy="todo-item"
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo-item="todo"
        class="mt-3"
        @edit-todo="(id) => toggleTodoModal('edit', id)"
        @delete-todo="(id) => toggleModalWarning(id)"
        @update-activity="fetchActivity"
      />
    </article>
    <article
      data-cy="todo-empty-state"
      v-else
      class="flex justify-center w-full p-5 mt-8"
    >
      <img
        src="../../assets/todo-empty-state.png"
        alt="empty state"
        class="w-[300px] sm:w-[600px] mx-auto"
      />
    </article>
  </section>
  <section
    v-show="isTodoModalOpen"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-screen p-5 transition-opacity ease-in-out delay-150 bg-black/50"
  >
    <TodoModal
      @close-modal="toggleTodoModal"
      @update-todos="fetchAll"
      :activity-id="activity && activity.id ? activity.id : 0"
      :mode="modeTodoModal"
      :todo="setSelectedTodo"
      :key="modeTodoModal"
    />
  </section>
  <section
    v-show="isModalOpen"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-screen p-5 transition-opacity ease-in-out delay-150 bg-black/50"
  >
    <Modal
      :modal-type="setSelectedTodo"
      @close-modal="toggleModalWarning"
      @delete="(obj) => deleteTodo(obj.id)"
    />
  </section>
  <section
    v-show="isConfirmModalOpen"
    @click.self="toggleConfirmModal"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-screen p-5 transition-all ease-in-out delay-150 bg-black/50"
  >
    <ModalConfirmation :modal-type="{ type: 'List item' }" />
  </section>
</template>

<script>
import axios from 'axios';
import TodoItem from '../TodoItem.vue';
import TodoModal from '../TodoModal.vue';
import Modal from '../Modal.vue';
import ModalConfirmation from '../ModalConfirmation.vue';

export default {
  name: 'DetailComponent',
  components: { TodoModal, TodoItem, Modal, ModalConfirmation },
  data() {
    return {
      activity: null,
      todos: null,
      filteredTodos: null,
      isTodoModalOpen: false,
      modeTodoModal: '',
      isModalOpen: false,
      isConfirmModalOpen: false,
      isEditActivityTitle: false,
      isFilterDropdownOpen: false,
      setFilter: 'terbaru',
      editedTitle: '',
      selectedTodoId: 0,
    };
  },
  created() {
    this.fetchActivity();
    this.fetchTodos();
  },
  computed: {
    setSelectedTodo() {
      return (this.activity || {}).todo_items?.filter(
        (item) => item.id === this.selectedTodoId
      )[0];
    },
  },
  watch: {
    setFilter(newVal) {
      switch (newVal) {
        case 'terbaru':
          return (this.filteredTodos = this.todos.sort((a, b) => b.id - a.id));
        case 'terlama':
          return (this.filteredTodos = this.todos.sort((a, b) => a.id - b.id));
        case 'az':
          return (this.filteredTodos = this.todos.sort((a, b) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
            else if (b.title.toLowerCase() > a.title.toLowerCase()) return -1;
            else return 0;
          }));
        case 'za':
          return (this.filteredTodos = this.todos.sort((a, b) => {
            if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
            else if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
            else return 0;
          }));
        case 'not-done':
          return (this.filteredTodos = this.todos.sort(
            (a, b) => Number(a.is_active) - Number(b.is_active)
          ));
      }
    },
  },
  methods: {
    async fetchAll() {
      await this.fetchActivity();
      await this.fetchTodos();
    },
    async fetchActivity() {
      await axios
        .get(
          `https://todo.api.devcode.gethired.id/activity-groups/${this.$route.params.id}`
        )
        .then((res) => {
          if (res.data && res.data !== {}) {
            this.activity = res.data;
          }
        });
    },
    async fetchTodos() {
      await axios
        .get(`https://todo.api.devcode.gethired.id/todo-items`, {
          params: {
            activity_group_id: this.$route.params.id,
          },
        })
        .then((res) => {
          if (res.data && res.data !== {}) {
            this.todos = res.data.data;
            this.filteredTodos = this.todos.sort((a, b) => b.id - a.id);
          }
        });
    },
    toggleTodoModal(mode, id) {
      this.modeTodoModal = mode;
      this.selectedTodoId = id;
      this.isTodoModalOpen = !this.isTodoModalOpen;
    },
    toggleModalWarning(id = 0) {
      this.selectedTodoId = id;
      this.isModalOpen = !this.isModalOpen;
    },
    toggleConfirmModal() {
      this.isConfirmModalOpen = !this.isConfirmModalOpen;
    },
    async deleteTodo(id) {
      await axios
        .delete(`https://todo.api.devcode.gethired.id/todo-items/${id}`)
        .then(() => {
          this.fetchAll();
          this.toggleModalWarning();
        });
    },
    async updateTitle(savePrompt) {
      if (savePrompt) {
        await axios
          .patch(
            `https://todo.api.devcode.gethired.id/activity-groups/${this.activity.id}`,
            {
              title: this.activity.title,
            }
          )
          .then(() => (this.isEditActivityTitle = !this.isEditActivityTitle));
      } else {
        this.isEditActivityTitle = !this.isEditActivityTitle;
      }
    },
    toggleFilterDropdown() {
      this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    },
    setTodoFilter(filter) {
      this.setFilter = filter;
      this.toggleFilterDropdown();
    },
  },
};
</script>

<style scoped></style>
