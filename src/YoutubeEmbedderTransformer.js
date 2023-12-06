const official = require("gatsby-remark-embedder/dist/transformers/YouTube")

const getHTML = (urlString) => {
  const url = new URL(urlString)
  const id =
    url.host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v")

  let videoStartAt = 0
  url.searchParams.forEach((value, name) => {
    if (name === "t") {
      videoStartAt = official.getTimeValueInSeconds(value)
    }
  })

  return `<lite-youtube videoid="${id}" videoStartAt="${videoStartAt}"></lite-youtube>`
}

const name = "YouTube"

module.exports = { getHTML, name, shouldTransform: official.shouldTransform }
