/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config = {
    siteMetadata: {
        title: `Gatsby + Vercel`,
        siteUrl: `https://gatsby-template.vercel.app/`,
    },
    plugins: ["gatsby-transformer-sharp", "gatsby-plugin-sharp"],
};

export default config;
