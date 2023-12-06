import YoutubeTransformer from "./src/YoutubeEmbedderTransformer.js";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config = {
    siteMetadata: {
        title: `Gatsby + Vercel`,
        siteUrl: `https://gatsby-template.vercel.app/`,
        convertkit: {
            userId: "785fc7ef1f",
            formId: "772ba7c9ba",
            defaultFormId: "772ba7c9ba",
            serverlessHandbookFormId: "2103715",
            seniorMindsetFormId: "1712642",
            ServerlessHandbookCUFormId: "1655570",
            javascriptFormId: "2507452",
            fullstackWebFormId: "2507619",
            ComputerScienceFormId: "2720965",
            ReactCUFormId: "2753675",
            IndieHackingFormId: "2753667",
            ServerlessFormId: "2849380",
            url: "https://pages.convertkit.com/785fc7ef1f/772ba7c9ba",
        },
    },
    plugins: [
        "@vercel/gatsby-plugin-vercel-builder",
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                extensions: [".mdx", ".md"],
                mdxOptions: {
                    rehypePlugins: [
                        rehypeSlug,
                        [rehypeAutolinkHeadings, { behavior: `wrap` }],
                    ],
                },
                gatsbyRemarkPlugins: [
                    "gatsby-remark-copy-linked-files",
                    //   {
                    //     resolve: "gatsby-remark-giphy",
                    //     options: {
                    //       giphyApiKey: process.env.GIPHY_API_KEY,
                    //       useVideo: true,
                    //       embedWidth: "80%",
                    //     },
                    //   },
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            markdownCaptions: false,
                            maxWidth: 890,
                            linkImagesToOriginal: false,
                            showCaptions: ["title", "alt"],
                            withWebp: true,
                            wrapperStyle:
                                "text-align: center; font-style: italic",
                        },
                    },
                    {
                        resolve: `${__dirname}/plugins/gatsby-remark-social-cards`,
                    },
                    {
                        resolve: "gatsby-remark-embedder",
                        options: {
                            customTransformers: [YoutubeTransformer],
                            services: {
                                Instagram: {
                                    accessToken:
                                        process.env.INSTAGRAM_OEMBED_TOKEN,
                                },
                                Twitter: {
                                    consumer_key:
                                        process.env.TWITTER_CONSUMER_KEY,
                                    consumer_secret:
                                        process.env.TWITTER_CONSUMER_SECRET,
                                },
                            },
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `src/pages`,
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/pages`,
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `src/components`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/components`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `src/@swizec/gatsby-theme-course-platform/components`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/components/FormCK`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/components/FormCK/ContentUpgrades`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `src/@swizec/gatsby-theme-course-platform/components/FormCK`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `src/@swizec/gatsby-theme-course-platform/components/FormCK/ContentUpgrades`,
                ignore: ["**/*.js"],
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `src/images`,
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/images`,
            },
        },
        "gatsby-plugin-twitter",
        "gatsby-plugin-catch-links",
        "gatsby-plugin-theme-ui",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-image",
        {
            resolve: "gatsby-plugin-advanced-sitemap",
            options: {
                createLinkInHead: true,
                addUncaughtPages: true,
                exclude: ["/404"],
            },
        },
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "Course platform",
                short_name: "Course platform",
                description: "Theme for a course platform",
                start_url: "/",
                background_color: "#fff",
                theme_color: "#FF002B",
                display: "standalone",
                icon: "./static/icon.png",
            },
        },
        {
            resolve: "gatsby-plugin-feed",
            options: {
                query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
                feeds: [
                    {
                        output: "/rss.xml",
                        title: "swizec.com RSS Feed",
                        match: "^/blog/|^/interviews/",
                        query: `{
  allMdx(
    filter: {internal: { contentFilePath: {regex: "/blog/.+/"}}}
    sort: {frontmatter: {published: DESC}}
    limit: 50
  ) {
    nodes {
      frontmatter {
        title
        description
        published
      }
      fields {
        slug
      }
    }
  }
}`,
                        serialize: ({ query: { site, allMdx } }) => {
                            return allMdx.nodes.map((node) => {
                                const url = new URL(site.siteMetadata.siteUrl);
                                url.pathname = node.fields.slug + "/";

                                return Object.assign({}, node.frontmatter, {
                                    date: node.frontmatter.published,
                                    url: url.href,
                                    guid: url.href,
                                });
                            });
                        },
                    },
                ],
            },
        },
    ],
};

export default config;
