// Custom plugin that generates social cards
// take from frontmatter.hero by default
// generate custom one otherwise

const path = require("path")
const slugify = require("slugify")
const fsExtra = require("fs-extra")

module.exports = async ({ markdownNode, markdownAST, getNode }) => {
  const frontmatter = markdownNode.frontmatter

  if (
    frontmatter &&
    frontmatter.title &&
    ((frontmatter.image && !frontmatter.image.includes("defaultHero")) || 
      (frontmatter.hero && !frontmatter.hero.includes("defaultHero")))
  ) {

    const imageName = frontmatter.image ? frontmatter.image : frontmatter.hero;

    const imagePath = path.posix.join(
      getNode(markdownNode.parent).dir,
      imageName
    )
    const ext = imagePath.split(".").pop()
    const slugTitle = slugify(frontmatter.title, {
      remove: /[*+~.()[\]{}'"!?/:@,]/g,
    }).toLowerCase()
    const filename = `${slugTitle}.${ext}`

    const newPath = path.join(process.cwd(), "public", "social-cards", filename)

    try {
      await fsExtra.ensureDir(
        path.join(process.cwd(), "public", "social-cards")
      )
      await fsExtra.copy(imagePath, newPath)
    } catch (e) {
      console.error(e)
    }
  }

  return markdownAST
}