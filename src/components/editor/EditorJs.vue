<template>
  <div id="vue-editorjs">
    <div :id="holderId"></div>
  </div>
</template>

<script>
  import EditorJS from '@editorjs/editorjs'
  import Converter from './EditorJsHtmlConverter.js'

  import Header from '@editorjs/header'
  import List from '@editorjs/list'
  import ImageTool from '@editorjs/image'
  import inlineCode from '@editorjs/inline-code'
  import embed from '@editorjs/embed'
  import quote from '@editorjs/quote'
  import marker from '@editorjs/marker'
  import code from '@editorjs/code'
  import link from '@editorjs/link'
  import delimiter from '@editorjs/delimiter'
  import raw from '@editorjs/raw'
  import table from '@editorjs/table'
  import warning from '@editorjs/warning'
  import paragraph from '@editorjs/paragraph'
  import checklist from '@editorjs/checklist'
  // import ImageAndText from '@editorjs/imageandtext'
  // import subscript from './EditorJsExtensions/subscript.js'

  // npm i --save-dev editorjs-subscript
  // npm i --save-dev editorjs-imageandtext

  export default {
    name: 'Editor',
    props: {
      holderId: {
        type: String,
        default: () => 'codex-editor',
        required: false
      },
      autofocus: {
        type: Boolean,
        default: () => true,
        required: false
      },
      placeholder: {
        type: String,
        default: () => 'Let`s write an awesome story!',
        required: false
      },
      data: {
        type: Object,
        default: () => {},
        required: false
      },
      tools: {
        type: Object,
        default: () => {
          return {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header'
              }
            },
            list: {
              class: List
            },
            code: {
              class: code
            },
            inlineCode: {
              class: inlineCode
            },
            embed: {
              class: embed
            },
            link: {
              class: link
            },
            marker: {
              class: marker
            },
            table: {
              class: table
            },
            raw: {
              class: raw
            },
            delimiter: {
              class: delimiter
            },
            quote: {
              class: quote
            },
            // blockquote: {
            //   class: BlockQuote,
            //   config: {
            //     placeholder: 'a BlockQuote'
            //   }
            // }
            image: {
              class: ImageTool
            },
            warning: {
              class: warning
            },
            paragraph: {
              class: paragraph
            },
            checklist: {
              class: checklist
            } // ,
            // imageAndText: {
            //   class: ImageAndText,
            //   config: {
            //     endpoints: {
            //       byFile: 'http://localhost:8008/uploadFile', // Your backend image file uploader endpoint
            //       byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading image by Url
            //     }
            //   }
            // }
          }
        },
        required: false
      }
    },
    data () {
      return {
        editor: null,
        holder: null
      }
    },
    mounted () {
      this.initEditor()
    },
    beforeDestroy () {
      if (this.editor) {
        this.editor.destroy()
        this.editor = null
        while (this.holder.firstChild) {
          this.holder.removeChild(this.holder.lastChild)
        }
      }
    },
    watch: {
      data: function () {
        this.initEditor()
      }
    },
    methods: {
      initEditor () {
        if (this.editor) {
          this.editor.isReady
            .then(() => {
              this.editor.render(this.data)
            }).catch(e => console.log(e))
        } else {
          this.holder = document.getElementById(this.holderId)
          while (this.holder.firstChild) {
            this.holder.removeChild(this.holder.lastChild)
          }

          this.editor = new EditorJS({
            holder: this.holderId,
            autofocus: this.autofocus,
            placeholder: this.placeholder,
            onReady: () => {
              this.$emit('ready')
            },
            onChange: async () => {
              const data = await this.editor.save()
              const html = Converter(data.blocks).toHtml()
              this.$emit('change', data, html)
            },
            data: this.data,
            tools: this.tools
          })
        }
      },
      async save () {
        const data = await this.editor.save()
        const html = Converter(data.blocks).toHtml()
        this.$emit('save', data, html)
      }
    }
  }
</script>

<style >
  .icon {
      padding: 0px;
  }
</style>