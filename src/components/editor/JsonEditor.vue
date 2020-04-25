<template>
  <modal 
    name="jsoneditor"
    classes="jsoneditormodal"
    transition="nice-modal-fade"
    :draggable="true"
    :resizable="true"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
   <!-- <div 
      slot="top-right"
      class="ct-top-right"
      @click="$modal.hide('settings')"
    >
      EXIT
    </div> -->

    <json-editor ref="JsonEditor" class="jsoneditor" :schema="schema" v-model="model">
      <button @click="submit">submit</button>
      <button @click="reset">Reset</button>
    </json-editor>
  </modal>
</template>

<script>
import JsonEditor from 'vue-json-ui-editor'
const SCHEMA = {
  type: 'object',
  title: 'deep.look',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  }
}

export default {
  components: {
    JsonEditor
  },
  data: () => ({
    // init json schma file ( require('@/schema/newsletter') )
    schema: SCHEMA,
    // data
    model: {
      name: 'Yourtion'
    }
  }),
  methods: {
    submit (_e) {
      alert(JSON.stringify(this.model))
    },
    reset () {
      this.$refs.JsonEditor.reset()
    },
    beforeOpen (event) {
    },
    beforeClose (event) {
      // event.stop()
      // if (!this.$store.state.connected) {
      // }
    }
  }
}
</script>

<style>
  .jsoneditormodal {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 2%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.8);
    border: 0px solid rgba(255, 255, 255, 0.65);
  }
  .jsoneditor {
    padding: 20px;
  }
</style>