<template>
  <nav class="w-full px-5 py-10 mx-auto sm:max-w-5xl">
    <router-link to="/">
      <h1 data-cy="header-title" class="text-3xl font-bold text-white">
        <font-awesome-icon icon="fa-solid fa-check" />
        TO DO LIST APP
      </h1>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped></style>
