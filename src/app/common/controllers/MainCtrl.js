angular.module('just.common')
    .directive("scroll", function ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                function getDocHeight() {
                    return Math.max(
                        document.body.scrollHeight, document.documentElement.scrollHeight,
                        document.body.offsetHeight, document.documentElement.offsetHeight,
                        document.body.clientHeight, document.documentElement.clientHeight
                    );
                }
                console.log(getDocHeight()-200);
                if (this.pageYOffset <= getDocHeight()-200) {
                    element.addClass('sticky');
                } else {
                    element.removeClass('sticky');
                }
            });
        };
    })
    .controller('MainCtrl', ['authService', '$location', 'justFlowService', 'justRoutes', 'i18nService', '$scope', 'Resources', function (authService, $location, flow, routes, i18nService, $scope, Resources) {
            var that = this;
            this.signedIn = function () {
                return authService.isAuthenticated();
            };
            this.signout = function () {
                authService.logout();
                flow.completed(routes.global.start.url);
                this.menu(0);
            };
            this.signin = function () {
                var path = $location.path();
                flow.redirect(routes.user.signin.url, function () {
                    flow.reload(path);
                });
                this.menu(0);
            };
            this.updateLanguage = function () {
                i18nService.getLanguage().then(function (lang) {
                    that.language = lang;
                });
            };
            i18nService.addLanguageChangeListener(function () {
                that.updateLanguage();
            });

            this.selectLanguage = function (show) {
                //show = 1 : force open
                //show = 0 : force hide
                //show = undefined : toggle
                show = show | !routes.global.isSelectLanguageOpen;
                routes.global.isSelectLanguageOpen = show;
            };
            this.menu = function (show) {
                //show = 1 : force open
                //show = 0 : force hide
                //show = undefined : toggle
                show = show | !routes.global.isMainMenuOpen;
                routes.global.isMainMenuOpen = show;
            };

            if (this.signedIn()) {
                $scope.user = Resources.user.get({
                    id: authService.userId().id,
                    "include": "user-images"
                });
            }

            this.updateLanguage();
        }]
    );
