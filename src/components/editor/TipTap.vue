<template>
  <div>
    <el-tiptap
      placeholder="Let's write !! 👏"
      :editor-props="editorProps"
      :extensions="extensions"
      :content="content"
      @onUpdate="onUpdateEvent"
    >
    </el-tiptap>
  </div>
</template>

<style lang=scss>
.el-tiptap-editor {
  $root: &;
  > #{$root}__content {
    background-color: rgba(0,0,0,0);
    border: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  > #{$root}__menu-bar {
    position: fixed;
    width: 38px;
    background-color: rgba(0,0,0,0.0);
    border: 0px;
    margin-left: -60px;
    margin-top: 80px;
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>

<style>
    .ProseMirror,
    .el-tiptap-editor,
    .el-tiptap-editor__menu-bar,
    .el-tiptap-editor__content {
       background-color: rgba(0,0,0,0); 
       border-top-color: rgba(0,0,0,0); 
       border-bottom-color: rgba(0,0,0,0); 
       border-left-color: rgba(0,0,0,0); 
       border-right-color: rgba(0,0,0,0); 
    }
    .el-tiptap-editor__command-button {
      width: 32px;
      height: 32px;
      margin: 0px;
    }
    .el-tiptap-editor__footer {
       display: none;
    }
    .el-tiptap-editor__menu-bar svg {
        color: rgba(0,0,0,255);
        fill: rgba(0,0,0,255);
    }
    .el-tooltip {

    }
    .menubar {
      position: relative;
    }
</style>

<script>
import { firebaseDb } from '../../services/firebase'
import {
  Doc,
  Text,
  Paragraph,
  // text extensions
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  FontType,
  TextColor,
  TextHighlight,
  // FormatClear,
  // paragraph extensions
  Heading,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  LineHeight,
  Indent,
  Blockquote,
  CodeBlock,
  // rich and tools extensions
  Link,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Iframe,
  TrailingNode,
  HorizontalRule,
  // Fullscreen,
  // Print,
  // Preview,
  // SelectAll,
  History
} from 'element-tiptap'

export default {
  name: 'tiptap',
  props: {
    item: {
      type: Object,
      required: true
    } // ,
    // editable: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data () {
    return {
      litem: {},
      loopback: false,
      content: '',
      editorProps: { // https://prosemirror.net/docs/ref/#view.EditorProps
        handleKeyDown () {
          console.log('🚀EditorProps: Keydown')
        },
        handleTextInput () {
          console.log('🚀EditorProps: TextInput')
        }
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Bold({ bubble: true }),
        new Underline({ bubble: true }),
        new Italic({ bubble: true }),
        new Strike({ bubble: true }),
        new Code(),
        new FontType(),
        new TextColor({ bubble: true }),
        new TextHighlight({ bubble: true }),
        new Heading({ level: 5 }),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new LineHeight(),
        new Indent(),
        new Blockquote(),
        new CodeBlock(),
        new Link(),
        new Image(),
        new Iframe(),
        new Table({ resizable: true }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new HorizontalRule(),
        // new Print(),
        // new Preview(),
        // new SelectAll(),
        // new Fullscreen(),
        new TrailingNode(),
        new History()
      ],
      output: {
        json: '',
        html: ''
      }
    }
  },
  mounted () {
    this.content = '<div></div>'
    if (this.item && this.item.content) {
      this.content = this.item.content
      // const path = '/nodes/' + this.item.t
    }

    // const interval = setInterval(() => {
    //   if (document.querySelector('.el-tiptap-editor__menu-bar')) {
    //     document.querySelector('.el-tiptap-editor__menu-bar').style.backgroundColor = 'rgba(0.0.0.0.5)'
    //     clearInterval(interval)
    //     console.log(document.querySelector('.el-tiptap-editor__menu-bar').style)
    //   }
    // }, 10)
  },
  watch: {
    item () {
      this.content = this.item && this.item.content ? this.item.content : '<div></div>'
    } // ,
    // editable () {
    //   // document.querySelector('.el-tiptap-editor__menu-bar').style.display = this.editable ? 'inline' : 'none'
    // }
  },
  methods: {
    log (txt) {
      console.log(txt)
    },
    onInitEvent () {
      console.log('🔥init')
    },
    onTransactionEvent () {
      console.log('🔥transaction')
    },
    onFocusEvent () {
      console.log('🔥focus')
    },
    onBlurEvent () {
      console.log('🔥blur')
    },
    onPasteEvent () {
      console.log('🔥paste')
    },
    onDropEvent () {
      console.log('🔥drop')
    },
    onUpdateEvent (output, options) {
      const { getHTML } = options // getJSON
      var result = getHTML()
      if (this.item && this.item.content) {
        if (!result.startsWith('<div')) {
          result = '<div>' + result + '</div>'
        }
        result = result.replace('<image', '<img')
        result = result.replace('</image', '</img')
        result = result.replace('data-text-align', 'text-align')
        this.item.content = result

        const path = '/nodes/' + this.item.t
        firebaseDb.ref(path).set(this.item)

        if (!this.loopback) {
          firebaseDb.ref(path).on('value', (snapshot) => {
            var data = {}
            if (snapshot.val()) {
              data = snapshot.val()
            }
            this.litem = data
            this.content = this.litem.content
            // console.log(data)
          })
          this.loopback = true
        }
      }
      // console.log('🔥update: ', output)
      // this.output.json = getJSON()
      // this.output.html = getHTML()
    }
  }
}
</script>