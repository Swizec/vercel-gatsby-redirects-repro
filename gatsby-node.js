const fs = require("fs");

exports.createPages = async ({ actions }) => {
    /**
     * It is specifically this that breaks. Awaiting an async function that creates redirects in a loop doesn't work.
     */
    // await createRedirectsFromConfigFile({ actions });

    /**
     * Copying the loop here also doesn't work. Looks like this is specific to how Vercel's platform parallelizes loops maybe?
     */
    const redirects = fs.readFileSync("./static/_redirects").toString();

    for (const line of redirects.split("\n")) {
        if (line.trim().length > 0) {
            // found a redirect
            let [fromPath, toPath] = line.trim().split(/\s+/);
            if (!fromPath.endsWith("/")) {
                fromPath += "/";
            }

            console.log(`Creating redirect from ${fromPath} to ${toPath}`);
            actions.createRedirect({
                fromPath,
                toPath,
            });
        }
    }

    console.log(`success create redirects from _redirects`);

    /**
     * Gatsby proxy: https://www.gatsbyjs.com/docs/how-to/cloud/working-with-redirects-and-rewrites/#rewrites-and-reverse-proxies
     *
     * We expect this redirect to return a 200,
     * but serve content from the toPath.
     *
     * Vercel returns a 307 and redirects you to the toPath
     */
    actions.createRedirect({
        fromPath: "/stats/js/script.js",
        toPath: "https://plausible.io/js/plausible.js",
        statusCode: 200,
    });
    actions.createRedirect({
        fromPath: "/stats/api/event/",
        toPath: "https://plausible.io/api/event",
        statusCode: 200,
    });

    /**
     * Gatsby redirect: https://www.gatsbyjs.com/docs/how-to/cloud/working-with-redirects-and-rewrites/#directions
     *
     * We expect this to return a 301 and redirect you to the toPath
     * Vercel returns a 404 and serves pages/404.js
     */
    actions.createRedirect({
        fromPath: "/i-dont-exist/",
        toPath: "/hello",
        isPermanent: true,
    });

    // actions.createRedirect({
    //     fromPath: "/blog/feed/",
    //     toPath: "/rss.xml",
    //     isPermanent: true,
    // });
};

async function createRedirectsFromConfigFile({ actions }) {
    const redirects = fs.readFileSync("./static/_redirects").toString();

    for (const line of redirects.split("\n")) {
        if (line.trim().length > 0) {
            // found a redirect
            let [fromPath, toPath] = line.trim().split(/\s+/);
            if (!fromPath.endsWith("/")) {
                fromPath += "/";
            }

            console.log(`Creating redirect from ${fromPath} to ${toPath}`);
            actions.createRedirect({
                fromPath,
                toPath,
            });
        }
    }

    console.log(`success create redirects from _redirects`);
}

// adds fields { slug } to every MD page
exports.onCreateNode = ({ node, actions }) => {
    const { createNodeField } = actions;

    if (
        node.internal.type === "MarkdownRemark" ||
        node.internal.type === "Mdx"
    ) {
        if (node.internal.contentFilePath.includes("/pages/")) {
            const slug = node.internal.contentFilePath
                .split("/pages/")[1]
                .replace(/\.(mdx|md)$/, "")
                .replace(/\/index$/, "");

            createNodeField({
                node,
                name: "slug",
                value: `/${slug}`,
            });
        }
    }
};
