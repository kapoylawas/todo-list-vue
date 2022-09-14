<template>
  <section data-cy="modal-delete" class="flex flex-col items-center justify-center w-full p-8 bg-white rounded-lg sm:max-w-lg">
    <img data-cy="modal-delete-icon" src="../assets/warning.png" alt="warning icon" class="w-[150px]">
    <h1 data-cy="modal-delete-title" class="mt-5 text-xl text-center">
      Apakah anda yakin ingin menghapus {{ (modalType && modalType.type === 'activity') ? 'activity' : 'List Item' }} 
      <span class="font-bold">
        "{{ (modalType && modalType.title ? modalType.title : '') }}" ?
      </span>
    </h1>
    <div class="flex items-center justify-center w-full mt-5 text-lg font-bold">
      <button data-cy="modal-delete-cancel-button" @click="() => $emit('close-modal', false)" class="px-12 py-3 text-gray-700 bg-gray-300 rounded-full">
        Batal
      </button>
      <button data-cy="modal-delete-confirm-button" @click="() => $emit('delete', modalType)" class="px-12 py-3 ml-4 text-white bg-red-500 rounded-full">
        Hapus
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "Modal",
  props: {
    modalType: {
      type: Object,
      default: {}
    }
  }
}
</script>
