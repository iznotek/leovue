require('babel-core/register')
const leo = require('../src/services/leo')
const fs = require('fs')
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const xslt4node = require('xslt4node')
const _ = require('lodash')
const util = require('../src/util')
const header = fs.readFileSync('./build/build-static-header.html')
const footer = fs.readFileSync('./build/build-static-footer.html')
let indexHTML = fs.readFileSync('./dist/index.html', 'utf8')

// mark index.html as having generated static pages
if (!/"staticSite":/.test(indexHTML)) {
  indexHTML = indexHTML.replace(/"showAppTitle"/,'"staticSite": "site",\n      "showAppTitle"')
  fs.writeFileSync('./dist/index.html', indexHTML)
}

let re = /window\.lconfig\s?=(.*?)<\/script>/
const indexHTMLn = indexHTML.replace(/[\n\r]/g, '')
let match = re.exec(indexHTMLn)
const config = JSON.parse(JSON.stringify(match[1]))

const xml = fs.readFileSync(config.filename + '.leo', 'utf8')

// create site folder
const dir = './dist/static/site'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}


const xslString = `
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="v">
    <xsl:variable name="t" select="@t"/>
    <div class="level{count(ancestor::*)}">
      <a>
      <xsl:attribute name="href">
         <xsl:value-of select="@t"/>
      </xsl:attribute>
      <xsl:value-of select="./vh"/>
      </a>
    </div>
    <xsl:text>
    </xsl:text>
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="text()"/>

</xsl:stylesheet>
`
const startId = 'L1'

leo.transformLeoXML2XML(xml, startId, DOMParser)
  .then(data => createMenu(data, xslString))

function createMenu(data, xslString) {
  const xml = data.xml
  const vnodes = xml.getElementsByTagName('v')
  let a = null
  let t = null
  for (let i = 0; i < vnodes.length; i++) {
    a = vnodes[i].getAttribute("t")
    a = a.replace(/\./g, '_')
    a = a.replace(/^.*?_/, '')
    a = startId + '-' + a + '.html'
    try {
      let title = vnodes[i].getElementsByTagName('vh')[0].lastChild
      let data = title.data
      const re = /^\[(.*?)\]\((.*?)\)$/
      const match = re.exec(data)
      if (match) {
        data = match[1]
        a = match[2]
      }
      title.data = data
    } catch (e) {

    }
    vnodes[i].setAttribute('t', a)
  }
  const xmlString = new XMLSerializer().serializeToString(data.xml)
  const config = {
    xslt: xslString,
    source: xmlString,
    result: String,
    props: {
      indent: 'yes'
    }
  }
  xslt4node.transform(config, (err, result) => {
    if (err) {
      console.log('ERROR:', err)
    }
    result = header + result + footer
    writeMenuFile(result)
  })
}

leo.transformLeoXML(xml, 'L1', DOMParser, xslt4node, XMLSerializer)
  .then(data => writeFiles(data))

function writeFiles(data) {
  const textItems = data.textItems
  _.each(textItems, (v, k) => {
    v = util.formatText(v)
    v = header + v + footer
    let filename = k + '.html'
    fs.writeFileSync('dist/static/site/' + filename, v)
  })
  process.exit(0)
}

function writeMenuFile(data) {
  fs.writeFileSync('dist/static/site/index.html', data)
}
