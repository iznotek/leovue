<template>
  <div id="app">
    <v-jsoneditor v-model="json"
                  :options="options"
                  @input="jsonChanged"
                  @error="jsonError">
    </v-jsoneditor>
  </div>
</template>

<script>
  // yarn add jsoneditor
  import VJsoneditor from './components/VJsoneditor';
  export default {
    name: 'vjsoneditor',
    components: {
      VJsoneditor,
    },
    data() {
      return {
        json: null,
        options: {
        },
      };
    },
    methods: {
      jsonChanged(value) {
        console.log('[VJsoneditor] JSON Changed =>', JSON.stringify(value));
      },
      jsonError(error) {
        console.log('[VJsoneditor] JSON Error =>', error);
      },
    },
    mounted() {
      this.json = {
        success: true,
      };
    },
  };
</script>

<style>
  div.jsoneditor-tree {
    padding-bottom: 10em !important;
  }
</style>