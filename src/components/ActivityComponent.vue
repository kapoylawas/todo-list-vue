<template>
  <section v-if="!isLoading" class="w-full px-5 py-10 mx-auto sm:max-w-5xl">
    <div class="flex justify-between w-full">
      <h1 class="text-4xl font-bold" data-cy="activity-title">Activity</h1>
      <button
        data-cy="activity-add-button"
        @click="createActivity"
        class="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-full"
      >
        <font-awesome-icon icon="fa-solid fa-plus fa-lg" class="mr-2" />
        Tambah
      </button>
    </div>
    <article
      v-if="activityLists"
      class="grid w-full grid-cols-1 gap-4 mx-auto mt-8 sm:max-w-5xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <ActivityItem
        data-cy="activity-item"
        v-for="activity in activityLists"
        :key="activity.id"
        :activity="activity"
        @delete-activity="(act) => deleteActivity(act)"
      />
    </article>
    <article v-else class="flex justify-center w-full p-5 mt-8">
      <img
        data-cy="activity-empty-state"
        src="../assets/activity-empty-state.png"
        alt="empty state"
        class="w-[300px] sm:w-[600px] mx-auto"
      />
    </article>
  </section>
  <section v-else class="w-full flex justify-center items-center h-[800px]">
    <img src="../assets/load.svg" alt="loader" class="animate-spin w-[50px]" />
  </section>
  <section
    @click.self="toggleModal"
    v-show="isModalOpen"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-screen p-5 transition-all ease-in-out delay-150 bg-black/50"
  >
    <Modal
      :modal-type="selectedActivity"
      @close-modal="toggleModal"
      @delete="deleteActivity"
    />
  </section>
  <section
    v-show="isConfirmModalOpen"
    @click.self="toggleConfirmModal"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-screen p-5 transition-all ease-in-out delay-150 bg-black/50"
  >
    <ModalConfirmation :modal-type="selectedActivity" />
  </section>
</template>

<script>
import axios from 'axios';
import ActivityItem from './ActivityItem.vue';
import Modal from './Modal.vue';
import ModalConfirmation from './ModalConfirmation.vue';
import Api from '../api/Api'

export default {
  name: 'ActivityComponent',
  components: {
    ModalConfirmation,
    ActivityItem,
    Modal,
  },
  data() {
    return {
      activityLists: null,
      isLoading: false,
      isModalOpen: false,
      isConfirmModalOpen: false,
      selectedActivity: null,
    };
  },
  created() {
    this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      this.isLoading = true;
      await Api.get('/activity-groups', {
          params: {
            email: 'arif.sangga@gmail.com',
          },
        })
        .then((res) => {
          if (res.data.data.length === 0) {
            this.isLoading = false;
            this.activityLists = null;
          } else {
            this.activityLists = res.data.data;
            this.isLoading = false;
          }
        });
    },
    async deleteActivity(activity) {
      if (this.isModalOpen) {
        await Api
          .delete(
            `/activity-groups/${this.selectedActivity.id}`
          )
          .then(() => (this.isModalOpen = false))
          .then(() => (this.isConfirmModalOpen = true))
          .then(async () => {
            this.selectedActivity = null;
            await this.fetchActivities();
          });
      } else {
        this.selectedActivity = {
          id: activity.id,
          type: 'activity',
          title: activity.title,
        };
        this.isModalOpen = true;
      }
    },
    createActivity() {
      Api
        .post('/activity-groups', {
          title: 'New Activity',
          email: 'arif.sangga@gmail.com',
        })
        .then(() => {
          this.fetchActivities();
        });
    },
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    toggleConfirmModal() {
      this.isConfirmModalOpen = !this.isConfirmModalOpen;
    },
  },
};
</script>

<style scoped></style>
