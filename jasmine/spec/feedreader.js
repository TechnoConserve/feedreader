/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        it('should have all URLs defined', function () {
            for (let i = 0; i < allFeeds.length; i ++) {
                expect(allFeeds[i].url).not.toBe(undefined);
            }
        });

        it('should have all names defined', function () {
            for (let i = 0; i < allFeeds.length; i ++) {
                expect(allFeeds[i].name).not.toBe(undefined);
            }
        });
    });


    describe('The menu', function () {
        /* Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('should hide the menu by default', function () {
            expect(document.getElementsByTagName("body")[0].className).toBe("menu-hidden");

        });

        /* Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('should change visibility when menu icon is clicked', function (done) {
            /* Returns the x coordinate of the css transform property
             * which is altered by a css transformation
             */
            function getMatrixX(menu) {
                // Get the appropriate property depending on browser
                let transformMatrix = menu.css("-webkit-transform") ||
                    menu.css("-moz-transform")    ||
                    menu.css("-ms-transform")     ||
                    menu.css("-o-transform")      ||
                    menu.css("transform");
                // Make it a neater array
                let matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
                // Return just the x coordinate of that array since that it what will change
                return matrix[12] || matrix[4];
            }

            const menu = $(".slide-menu");
            const menuIcon = $(".menu-icon-link");
            let firstClick = true;

            // Check the initial value
            let x = getMatrixX(menu);
            expect(x).toBe('-192');

            // Check again after clicking
            menu.on("transitionend", function () {
                x = getMatrixX(menu);
                if (firstClick) {
                    expect(x).toBe('0');

                    // Click again
                    firstClick = false;
                    menuIcon.trigger("click");
                } else {
                    // Check after second click
                    expect(x).toBe('-192');
                    done();
                }
            });
            menuIcon.trigger("click");
        });
    });


    describe("Initial Entries", function () {
        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        });

        /* Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it("should have at least one .entry element in the .feed container", function (done) {
            const container = $('.feed');
            expect(container.find(".entry").length).toBeGreaterThan(0);
            done();
        })
    });


    describe("New Feed Selection", function () {
        // Load the default feed
        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        });

        /* Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('should change the content when a new feed is loaded', function (done) {
            // Check what content we have before we change the feed
            const container = $('.feed');
            const initialContent = container.find(".entry h2").first().text();
            // Change from the default feed to the css-tricks feed
            loadFeed(1, function () {
                const newContent = container.find(".entry h2").first().text();
                expect(initialContent).not.toEqual(newContent);
                done();
            });
        });
    });
}());
