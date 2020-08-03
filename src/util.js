import _ from 'lodash'
import jsyaml from 'js-yaml'
import lodashTemplate from './lib/lodash-template'
import axios from 'axios'

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

function urlCheck (url, cb) {
  // var vm = this
  // var xhr = new XMLHttpRequest()
  // xhr.onreadystatechange = function () {
  //   if (this.readyState === this.HEADERS_RECEIVED) {
  //     var status = this.status
  //     if (status === 0 || (status >= 200 && status < 400)) {
  //       vm.load(url)
  //     } else {
  //       vm.load()
  //     }
  //   }
  // }
  // console.log(url)
  // xhr.open('HEAD', url, true)
  // axios.head(url) // , {headers: {'Access-Control-Allow-Origin': '*'}})
  // .then((response) => {
  // function str2ab (str) {
  //   var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  //   var bufView = new Uint16Array(buf)
  //   for (var i = 0, strLen = str.length; i < strLen; i++) {
  //     bufView[i] = str.charCodeAt(i)
  //   }
  //   return buf
  // }
  // let ab = str2ab(response.data)
  // console.log(typeof ab)
  // untar(ab).then(
  //   function (extractedFiles) { // onSuccess
  //     console.log(extractedFiles)
  //   }
  // )
  axios.head(url)
    .then((response) => {
      cb(url)
    })
    .catch(function (error) {
      console.log(error)
      cb()
    })
}

function seedCheck (seeder, host, cb) {
  var full = seeder + '/json/wiki/get?name=space@' + host
  axios.get(full) // , {headers: {'Access-Control-Allow-Origin': '*'}})
    .then(response => {
      if (response.data.payload) {
        var manifest = JSON.parse(response.data.payload.content)
        cb(host, manifest)
      } else {
        cb()
      }
    })
    .catch(error => {
      console.log(error)
      cb()
    })
}

function seedStone (seeder, host, cb) {
  function callback (stone = null, manifest = null) {
    if (stone && manifest) {
      var stone = manifest.url
      var path
      if (process.env.NODE_ENV === 'production') {
        stone = stone.replace('http://', 'https://')
        if (!stone.includes('https://')) {
          stone = 'https://' + stone
        }
        path = stone + '/doc/trunk/deep/spaces/' + host + '/index.leo' 
      } else {
        path = window.location.origin + '/static/stones/' + stone + '/deep/spaces/' + host + '/index.leo'
      }
      urlCheck(path, cb)
    }
  }
  seedCheck(seeder, host, callback)
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

function parseColor(color) {
  var x = document.createElement('div');
  document.body.appendChild(x);
  var color, rgba;
  var red = 0, green = 0, blue = 0, alpha = 0;
  try {
    x.style = 'color: ' + color + '!important';
    color = window.getComputedStyle(x).color
    rgba = color.match(/rgba?\((.*)\)/)[1].split(',').map(Number);
    red = rgba[0];
    green = rgba[1];
    blue = rgba[2];
    alpha = '3' in rgba ? rgba[3] : 1;
  } catch (e) {
  }
  x.parentNode.removeChild(x);
  return {'r': red, 'g': green, 'b': blue, 'a': alpha};
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
    default:         val = parseColor(name); val.a = alpha; break
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
      // console.log('YAML DATA..........', data)
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
  if (text === '') { return text }
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

/**
 * Is url relative
 * @param url {string}
 * @returns {boolean} - if is relative
 * TODO: move to util
 */
function isRelative (url) {
  let ok = true
  if (/^[xh]ttp/.test(url)) { // xhttp is to indicate xframe header should be ignored
    return false
  }
  if (/^\//.test(url)) {
  //  return false
  }
  if (window.lconfig.filename) {
    return false
  }
  return ok
}

/**
 * clean up title for display, get url
 * @param title {String} This is an md format link, unless dataType is passed in
 * @param dataType {String} e.g. 'rgarticle', host will be in lconfig.dataSources, not extracted from title
 * @returns { url, label }
 */
function getUrlFromTitle (title, dataType) {
  let url = ''
  let label = ''
  title = title.replace(/^@[a-zA-Z-]*? /, '')
  let dataParams = null
  const re = /^\[(.*?)\]\((.*?)\)$/
  const match = re.exec(title)
  if (dataType) {
    dataType = dataType.replace('-', '')
    dataParams = window.lconfig.dataSources[dataType]
    if (!dataParams) {
      console.log('No match for dataType:', dataType)
      return { url, label }
    }
    url = dataParams.host + title
    if (match) {
      label = match[1]
      url = dataParams.host + match[2]
    } else {
      label = title.replace(/_/g, ' ').replace(/^\d+/, '') // remove leading numbers
    }
    return { url, label }
  }
  if (!match) { return { url, label } }
  url = match[2]
  label = match[1]
  if (!url) { return null }
  if (isRelative(url)) {
    // url = 'static/' + url
  }
  // absolute urls require no further processing
  if (/^[xh]ttp/.test(url)) { // xttp will result in http call via proxy
    return {url, label}
  }
  // add doc file host if docfile is not on current host
  // const hostname = window.location.hostname
  let cname = window.lconfig.filename
  // const cnameUrl = new URL(cname)
  // const leoFileHostname = cnameUrl.host
  if (cname.indexOf('/') < 0) {
    cname = ''
  }
  if (cname && (cname.indexOf('http') > -1)) {
    let u = window.lconfig.filename
    u = util.chop(u, '#')
    u = util.chop(u, '?')
    u = util.chop(u, '/')
    url = u + '/' + url
  }

  return {url, label}
}

// parseQueryString(window.location.href)

module.exports = {
  replaceRelUrls,
  getFileExtension,
  getLanguage,
  getDirectives,
  removeDirectives,
  urlCheck,
  seedCheck,
  seedStone,
  parseQueryString,
  rgbaFromTheme,
  rgbaFromObject,
  rgbaObjectFromTheme,
  formatText,
  getObjectByKeyFromTree,
  sendGTag,
  chop,
  toTitleCase,
  getUrlFromTitle,
  isRelative
}

