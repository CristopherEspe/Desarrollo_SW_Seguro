const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            config.viewportWidth = 1366;
            config.viewportHeight = 768;
        },
    },
});
