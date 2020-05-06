<template>
  <modal 
    name="jsoneditor"
    classes="jsoneditormodal"
    transition="nice-modal-fade"
    :draggable="true"
    :resizable="true"
    :adaptive="true"
    :scrollable="true"
    :reset="true"
    width="40%"
    height="auto"
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

    <json-editor 
      ref="JsonEditor" 
      :schema="schema" 
      v-model="model">
      <el-button type="primary" @click="submit">Subscribe</el-button>
      <el-button type="reset" @click="reset">Reset</el-button>
      <!-- <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Model</span>
        </div> 
        <pre class="json">{{ jsonString }}</pre>
      </el-card> -->
    </json-editor>
  </modal>
</template>

<script>
import JsonEditor from '../editor/JsonEditor.js'
const util = require('../../util.js')

export default {
  components: {
    JsonEditor
  },
  props: [
    'item'
  ],
  data: () => ({
    schema: require('@/schema/deep'),
    default: { deep: { look: {} } },
    model: { deep: { look: {} } }
  }),
  computed: {
    jsonString () {
      return JSON.stringify(this.model, null, 2).trim()
    }
  },
  methods: {
    submit (val) {
      alert(JSON.stringify(this.model))
    },
    reset () {
      this.$refs.JsonEditor.reset()
    },
    beforeOpen (event) {
      // console.log(this.item)
      var model = JSON.search(this.$store.state.leodata, '//*[id="' + this.$store.state.currentItem.id + '"]')
      if (!model) return
      if (model.length) model = model[0]

      var amodel = {}
      let {url} = util.getUrlFromTitle(model.name)
      amodel.name = model.vtitle
      amodel.link = url
      amodel.deep = model.deep
      this.default = amodel
      this.model = amodel
    },
    beforeClose (event) {
      var model = JSON.search(this.$store.state.leodata, '//*[id="' + this.$store.state.currentItem.id + '"]')
      if (!model) return
      if (model.length) model = model[0]
      // model.deep = this.model.deep
    }
  },
  watch: {
    'model': {
      handler: function (after, before) {
        // this.$events.fire('deepUpdate', after)
      },
      deep: true
    }
  }
}
</script>

<style>
  .jsoneditormodal {
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 2%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.8);
    border: 0px solid rgba(255, 255, 255, 0.65);
    padding: 20px;
  }
  .jsoneditor {
    padding: 20px;
  }
  .el-form .sub {
    margin-left: 10%;
  }
</style>