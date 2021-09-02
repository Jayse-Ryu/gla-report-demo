<template>
  <v-col
    class="mainCol mx-auto"
    cols="12"
    sm="11"
    md="10"
    lg="9"
    style="max-width: 1400px;"
  >
    <slot></slot>
  </v-col>
</template>

<style lang="scss">
  .clickableTable {
    tbody {
      tr:not(.v-data-table__empty-wrapper) {
        cursor: pointer;
      }
    }
  }
</style>
