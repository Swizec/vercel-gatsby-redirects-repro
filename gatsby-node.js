exports.createPages = async ({ actions }) => {
    actions.createRedirect({
        fromPath: "/stats/js/script.js",
        toPath: "https://plausible.io/js/plausible.js",
        statusCode: 200,
    });

    actions.createRedirect({
        fromPath: "/i-dont-exist",
        toPath: "/hello",
        isPermanent: true,
    });
};
