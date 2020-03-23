import _ from 'lodash'
import jsyaml from 'js-yaml'
import lodashTemplate from './lib/lodash-template'

const hljs = require('highlight.js')
// const pug = require('pug')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})

function replaceRelUrls (html, base) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const images = doc.images
  for (let i = 0; i < images.length; i++) {
    let image = images[i]
    let src = image.getAttribute('src')
    if (/http:/.test(src)) { return html }
    if (/https:/.test(src)) { return html }
    if (/^\//.test(src)) {
      src = base + src
    } else {
      src = base + '/' + src
    }
    image.setAttribute('src', src)
  }
  return doc.body.innerHTML
}

function getFileExtension (filename) {
  const re = /(?:\.([^.]+))?$/
  const ext = re.exec(filename)[1]
  return ext
}

function getLanguage (text) {
  let language = ''
  const re = /^@language (\w+)/
  let languageTokens = re.exec(text)
  if (languageTokens) {
    language = languageTokens[1]
  }
  return language
}

// function removeFirstLine (text) {
//   // return text.split(/[\n]/).splice(1).join('\n')
//   const rets = []
//   const lines = text.split(/[\n]/)
//   const re = /^@\S+ (\w+)/
//   lines.forEach(line => {
//     if (re.test(line)) {
//       rets.push(line)
//     }
//   })
//   lines.splice(0,rets.length)
//   return lines.join('\n')
// }

function removeDirectives (text) {
  const rets = []
  const lines = text.split(/[\n]/)
  const re = /^@\S+ (\w+)/
  lines.forEach(line => {
    if (re.test(line)) {
      rets.push(line)
    }
  })
  lines.splice(0,rets.length)
  return lines.join('\n')
}

function getDirectives (text) {
  const rets = []
  const lines = text.split(/[\n]/)
  const re = /^@\S+ (\w+)/
  lines.forEach(line => {
    if (re.test(line)) {
      rets.push(line)
    }
  })
  return rets.join('\n')
}

function parseQueryString (config, url) {
  var urlParams = {}
  url.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    function ($0, $1, $2, $3) {
      urlParams[$1] = $3
    }
  )
  for (let k in urlParams) {
    let v = urlParams[k]
    if (/#/.test(v)){
      v = v.substring(0, v.indexOf('#'))
    }
    if (typeof v !== 'undefined') {
      config[k] = v.replace(/%2F/g, '/').replace(/%27/g, "'")
    }
  }
  const hash = window.location.hash
  let baseMode = 'o'
  if (window.lconfig.baseMode) { baseMode = window.lconfig.baseMode }
  if (!hash || hash.length < 3) {
    //window.location.hash = baseMode + '/1'
    //window.location = window.location
  }
  return urlParams
}
/**
 * return formatted text, e.g. markdown or html
 * @param text {string}
 * @param nowrapper {boolean} Skip the content div wrapper el
 * @returns {string}
 */
function rgbaFromTheme(name, alpha = 1.0, add = 0) {
  var val = rgbaObjectFromTheme(name, alpha, add)
  if (typeof val === 'object') {
    return 'rgba(' + val.r + ',' + val.g + ',' + val.b + ',' + val.a + ')'
  }
  return name
}

/**
 * return formatted text, e.g. markdown or html
 * @param text {string}
 * @param nowrapper {boolean} Skip the content div wrapper el
 * @returns {string}
 */
function rgbaFromObject(color, alpha = null, add = null) {
  var val = color
  if (typeof val === 'object') {
    if (alpha) {
      color.a = alpha
    }
    if (add) {
      val.r += add
      val.g += add
      val.b += add
      val.r = (val.r > 255) ? 255 : val.r
      val.g = (val.g > 255) ? 255 : val.g
      val.b = (val.b > 255) ? 255 : val.b
      val.r = (val.r < 0) ? 0 : val.r
      val.g = (val.g < 0) ? 0 : val.g
      val.b = (val.b < 0) ? 0 : val.b
    }
    return 'rgba(' + val.r + ',' + val.g + ',' + val.b + ',' + val.a + ')'
  }
  return rgba(0,0,0,1.0)
}

/**
 * return formatted text, e.g. markdown or html
 * @param name {string} color css name
 * @param alpha {float} Optional alpha
 * @returns {string}
 */
function rgbaObjectFromTheme(name, alpha = 1.0, add = 0) {
  var val = {r: 0, g: 0, b: 0, a: alpha }
  switch (name)
  {
    case 'blue':     val.g = 82, val.b = 255; break
    case 'yellow':   val.r = 255, val.g = 255; break
    case 'green':    val.g = 150; break
    case 'red':      val.r = 150; break
    case 'orange':   val.r = 255, val.g = 150; break
    case 'black':    val.r = 0; break 
    case 'white':    val.r = 255, val.g = 255, val.b = 255; break 
    case 'violet':    val.r = 150, val.g = 50, val.b = 255; break 
    case 'marron':    val.r = 140, val.g = 70, val.b = 0; break
    default:         return name
  }
  val.r += add
  val.g += add
  val.b += add
  val.r = (val.r > 255) ? 255 : val.r
  val.g = (val.g > 255) ? 255 : val.g
  val.b = (val.b > 255) ? 255 : val.b
  val.r = (val.r < 0) ? 0 : val.r
  val.g = (val.g < 0) ? 0 : val.g
  val.b = (val.b < 0) ? 0 : val.b
  return val
}

/**
 * return formatted text, e.g. markdown or html
 * @param text {string}
 * @param nowrapper {boolean} Skip the content div wrapper el
 * @returns {string}
 */
function formatText (text, noWrapper, title) {
  if (!text) { return '' }
  let language = getLanguage(text)

  // text = text.replace(/<</g, '\u00AB')
  // text = text.replace(/>>/g, '\u00BB')
  text = text.replace(/<<(.*?)>>/g, '<sectionlink :title="\'$1\'"/>')
  // text = text.replace(/<<(.*?)>>/g, '<div class=section-link">«$1»</div>')
  text = text.replace(/\[\[(.*?)\]\]/g, '<nodelink :title="\'$1\'"/>')

  // just plain text
  if (!language) {
    language = 'plaintext'
  }
  // remove directives from first line
  if (/^\s*?@/.test(text)) {
    text = removeDirectives(text)
  }
  if (title) {
    text = title + text
  }
  let mu = ''
  let muv = null
  switch (language) {
    case 'yaml':
      const data = jsyaml.load(text.replace('@language yaml', ''))
      const dump = jsyaml.dump(data)
      console.log('YAML DATA..........', data)
      const template = _.get(data, 'params.template', '')
      if (template) {
        text = lodashTemplate.render(data, template)
        break
      } else {
        text = hiliteCode(text, language)
        text = '<div class="hcode">' + text + '</div>'
      }
    case 'text':
      text = `<div class="text">${text}</div>`
      break
    case 'plaintext':
      text = `<div class="text">${text}</div>`
      break
    case 'md':
      text = md.render(text)
      text = text.replace(/src="https:.*?https:/g, 'src="https:') // hack to fix md not handling absolute urls
      break
    case 'pug': // eslint-disable-line
      text = window.pug.render(text) // need to add pug for this to work, see commented out code in index.html
    case 'python':
      text = processPython(text)
      break
    case 'html':
      text = text.replace(/(@docs|others)/g, '<span class="directive" title="Leo Directive - does not appear in source file.">$1</span>')
      break
    case 'htmlsource':
      muv = hljs.highlight('html', text)
      text = muv.value
      text = text.replace(/(@\w+)/, '<span class="directive" title="Leo Directive - does not appear in source file.">$1</span>')
      text = text.replace(/@others/g, '<span class="directive" title="Leo Directive: rest of tree goes here.">@others</span>')
      text = `<pre>${text}</pre>`
      // hack to put section link component back in
      const re = /<span class="hljs-tag">&lt;<span class="hljs-name">sectionlink<\/span> <span class="hljs-attr">:title<\/span>=<span class="hljs-string">"' (.*?) '"<\/span>\/&gt;<\/span>/g
      const sl = '<sectionlink :title="\' $1 \'"/>'
      text = text.replace(re, sl) // put back section directive
      break
    case 'VueComponent':
      muv = hljs.highlight('javascript', text)
      text = muv.value
      text = `<pre>${text}</pre>`
      break
    default:
      text = hiliteCode(text, language)
      text = '<div class="hcode">' + text + '</div>'
  }
  if (noWrapper) { return text }
  text = `<div class='content'>${text}</div>`
  return text
}
function toTitleCase (str) {
  return str.replace(/\w*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

function sendGTag (item) {
  if (typeof gtag === 'undefined') { return } // eslint-disable-line
  if (!item) {
    console.log('No item in GTAG')
    return
  }
  gtag('config', 'UA-118289537-1', {  // eslint-disable-line
    'page_title': item.name,
    'page_path': '#/t/' + item.id,
    't': item.t
  })
}
/**
 * Chop the end of a string off
 * @param s {string} The input string
 * @param c {string} The character from which the string will be chopped
 * @returns {string} The chopped string
 */
function chop (s, c) {
  if (s.indexOf(c) < 0) { return s }
  return s.substring(0, s.lastIndexOf(c))
}

function hiliteCode(text, language) {
  text = text.replace(/<sectionlink :title="'(.*?)'"\/>/g, '«$1»')
  text = text.replace(/<sectionlink title="(.*?)"\/>/g, '«$1»')
  const mu = hljs.highlight(language, text)
  text = mu.value
  text = `<pre v-pre>${text}</pre>`
  text = text.replace(/«(.*?)»/g, '<span class="csection-link">«$1»</span>')
  return text
}

function processPython(t) {
  const a = t.split(/\n/)
  const b = []
  let c = []
  let buffer = ''
  let inDocString = false
  a.forEach(line => {
    if (/'''/.test(line)) {
      inDocString = !inDocString
      if (!inDocString) {
        c = c.map(line => line.replace(/^\s*?\|/g, '').replace(/</g, '&lt;').replace(/>/, '&gt;').replace(/^\s*?#/,''))
        let docString = c.join('\n')
        docString = md.render(docString)
        b.push(docString)
        c = []
      } else {
        buffer = hiliteCode(buffer, 'python')
        b.push(buffer)
        buffer = ''
      }
      return // skip this line
    }
    if (inDocString) {
      return c.push(line)
    }
    // line = processSingleDocstring(line)
    buffer = buffer + '\n' + line
  })
  t = b.join('') + hiliteCode(buffer, 'python')
  return t
}

function processSingleDocstring(t) {
  if (/"""/.test(t)) {
  }
  return t
}

function processDocstring(t) {
  if (/'''/.test(t)) {
    t = t.replace(/'''/, '</pre>')
    t = t.replace(/'''/, '<pre>')
    t = t.replace(/\|/g, '')
    t = md.render(t)
  }
  return t
}

function getObjectByKeyFromTree (d, k, v) {
  k = k + ''
  if (d[k].indexOf(v) > -1) {
    return d
  }
  if (!d.children) { return '' }
  for (let i = 0; i < d.children.length; i++) {
    let o = getObjectByKeyFromTree(d.children[i], k, v)
    if (o) { return o }
  }
}

// parseQueryString(window.location.href)

module.exports = {
  replaceRelUrls,
  getFileExtension,
  getLanguage,
  getDirectives,
  removeDirectives,
  parseQueryString,
  rgbaFromTheme,
  rgbaFromObject,
  rgbaObjectFromTheme,
  formatText,
  getObjectByKeyFromTree,
  sendGTag,
  chop,
  toTitleCase
}

