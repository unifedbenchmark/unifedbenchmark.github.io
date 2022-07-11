angular.module('decision.tree', ['ui.select', 'ngSanitize', 'ui.bootstrap'])

.directive('decisionTree', ['$compile', '$timeout', function($compile, $timeout) {

    return {
        restrict: 'E',
        scope: {
            node: '=',
            onResult: '&',
            onClear: '&'
        },
        templateUrl: 'decision-tree.html',
        link: function(scope, element, attributes) {

            scope.decision = {};

            // Grab container for next decision
            var childDecisionContainer = element.find('.next-decision-container');

            // Shallow copy all the immediate children so we can safely set extra properties
            scope.children = [];
            angular.forEach(scope.node.children, function (child) {
                scope.children.push(angular.extend({}, child));
            });

            // Focus on the first "focusable" element found
            $timeout(function() {
                element.find('* [data-focusable]').first().focus();
                scope.$broadcast('new-decision-appended');
            });

            scope.selectNode = function(node) {

                scope.decision.selected = node;
            };

            scope.$watch('decision.selected', function (node) {

                if (node) {
                    angular.forEach(scope.children, function (child) {
                        child.selected = (child === node);
                    });

                    childDecisionContainer.empty();

                    if (node.result) {
                        if (scope.onResult) {
                            $timeout(function(){
                                scope.onResult({result: node.result});
                            });
                        }
                    } else {
                        if (scope.onClear) {
                            scope.onClear();
                        }

                        var el = angular.element('<decision-tree node="decision.selected" on-result="onResult({result: result})" on-clear="onClear()"></decision-tree>');
                        $compile(el)(scope);
                        childDecisionContainer.html(el);
                    }
                }
            });
        }
    };
}])

.directive('modalBody', ['$compile', '$templateRequest', function ($compile, $templateRequest) {

    return {
        restrict: 'C',
        link: function (scope, element, attributes) {

            var resultContainer = element.find('div.decision-tree-result');

            function injectResultTemplate(template) {

                var el = angular.element(template);

                $compile(el)(scope);
                resultContainer.html(el);
            }

            if (scope.resultTemplate) {
                injectResultTemplate(scope.resultTemplate);
            } else if (scope.resultTemplateUrl) {
                $templateRequest(scope.resultTemplateUrl)
                    .then(
                        function(template) {
                            injectResultTemplate(template);
                        }
                    );
            }
        }
    };
}])

.factory('$decisionTree', ['$uibModal', '$timeout', function ($uibModal, $timeout) {

    return {

        openWizard: function (config) {

            return $uibModal.open({
                animation: false,
                templateUrl: 'decision-tree-wizard-modal.html',
                resolve: {
                    config: function () { return config; }
                },
                controller: function ($scope, $uibModalInstance, config) {

                    $scope.title = config.title;
                    $scope.decisionTree = config.decisionTree;
                    $scope.resultTemplate = config.resultTemplate;
                    $scope.resultTemplateUrl = config.resultTemplateUrl;

                    $scope.onDecisionResult = function (result) {

                      $scope.result = result;
                        
                      $timeout(function() {
                            $('#acceptButton').focus();
                      });
                    };

                    $scope.onDecisionClear = function () {

                        $scope.result = undefined;
                    };
                }
            }).result;
        }
    };
}]);
