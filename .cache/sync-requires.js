const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/media/aqibiqbal/My Data/Bootcamp2020/Serverless_Projects/Serverless JAMStack Todo app with Netlify Gatsby GraphQL and FaunaDB/todoapp/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/media/aqibiqbal/My Data/Bootcamp2020/Serverless_Projects/Serverless JAMStack Todo app with Netlify Gatsby GraphQL and FaunaDB/todoapp/src/pages/404.js"))),
  "component---src-pages-index-tsx": hot(preferDefault(require("/media/aqibiqbal/My Data/Bootcamp2020/Serverless_Projects/Serverless JAMStack Todo app with Netlify Gatsby GraphQL and FaunaDB/todoapp/src/pages/index.tsx")))
}

