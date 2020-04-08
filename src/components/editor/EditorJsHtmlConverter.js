// var TurndownService = require('turndown')

// var turndownService = new TurndownService()

module.exports = function (blocks, output = null) {
  var wrapBlock = function (html) {
    return `
    <div class="ce-block">
      <div class="ce-block__content">
        ${html}
      </div>
    </div>
    `
  }

  var toHtml = function () {
    let html = ''
    let styles = {
      header: 'ce-header'
    }
    blocks.forEach((block) => {
      let type = block.type
      let data = block.data
      if (type === 'header') {
        let _html = `<h${data.level} class="${styles.header}">${data.text}</h${
          data.level
        }>`
        html += wrapBlock(_html)
      } else if (type === 'paragraph') {
        let _html = `<p class="ce-paragraph cdx-block">${data.text}</p>`
        html += wrapBlock(_html)
      } else if (type === 'list') {
        let style = {
          unordered: 'li',
          ordered: 'ol'
        }
        let items = ''
        data.items.forEach(item => {
          items += `<${style[data.style]} class="cdx-list__item">
            ${item}
            </${style[data.style]}>`
        })
        html += wrapBlock(
          `<ul class="cdx-block cdx-list cdx-list--${data.style}">
            ${items}
          </ul>`
        )
      } else if (type === 'delimiter') {
        html += wrapBlock('<div class="ce-delimiter cdx-block"></div>')
      } else if (type === 'code') {
        html += wrapBlock(`<pre>${data.code}</pre>`)
      } else if (type === 'quote') {
        html += wrapBlock(
          `<blockquote class="cdx-block cdx-quote">
            <div class="cdx-quote__text">${data.text}</div>
          </blockquote>`
        )
      } else if (['rawTool', 'rawHTML', 'raw', 'html'].includes(type)) {
        html += wrapBlock(
          `<div class="cdx-block ce-rawtool">
            <pre class=''>${data.html}</pre>
          </div>`
        )
      } else if (type === 'image') {
        html += wrapBlock(
          `<div class="cdx-block image-tool">
            <div class="image-tool__image">
              <div class="image-tool__image-preloader"></div>
              <img class="image-tool__image-picture" alt='${data.caption}' src="${data.file.url}" title="${data.caption}">
            </div>
            <div class="cdx-input image-tool__caption" data-placeholder="Caption">${data.caption}</div>
          </div>`
        )
      } else if (type === 'warning') {
        html += wrapBlock(`
          <div><h4>${data.title}</h4><p>${data.message}</p></div>
        `)
      }
    })
    return html
  }

  if (output === 'html') return toHtml()
  else return {toHtml}

  // var toMd = function () {
  //   var html = toHtml()
  //   var markdown = turndownService.turndown(html)
  //   return markdown
  // }

  // if (!output) {
  //   return {
  //     toHtml,
  //     toMd
  //   }
  // } else {
  //   if (output === 'html') return toHtml()
  //   else if (output === 'md') return toMd()
  // }
}
