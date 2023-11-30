exports.createPages = async ({ actions }) => {
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
};
