/* eslint-env node */
import Koa from 'koa'
import path from 'path'
import serve from 'koa-static'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ApplyTheme, createSheetsRegistry } from 'rambler-ui/theme'
import App from '../common/App'

const app = new Koa()

function render(ctx) {
  const sheetsRegistry = createSheetsRegistry()

  const app = renderToString(
    <ApplyTheme sheetsRegistry={sheetsRegistry}>
      <App />
    </ApplyTheme>
  )

  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Simple Rambler UI example</title>
        <style type="text/css" id="server-styles">
          ${sheetsRegistry.toString()}
        </style>
      </head>
      <body>
        <div id="app">
          ${app}
        </div>
        <script src="./index.js"></script>
      </body>
    </html>
  `
}

app.use(serve(path.join(__dirname, '../build')))
app.use(render)

app.listen(8080)
