(function () {
    angular.module('zilch', [])
        .constant('diceCount', 6)
        .constant('minTakeAmount', 350)
        .constant('lang', {
            1: {sg: 'one', pl: 'ones'},
            2: {sg: 'two', pl: 'twos'},
            3: {sg: 'three', pl: 'threes'},
            4: {sg: 'four', pl: 'fours'},
            5: {sg: 'five', pl: 'fives'},
            6: {sg: 'six', pl: 'sixes'},
            pair: {sg: 'pair', pl: 'pairs'},
            run: {sg: 'run', pl: 'runs'},
            noScore: 'no scoring dice'
        })

        .controller('GameController', function ($scope, $filter, diceCount, minTakeAmount) {
            // Initialization
            init();

            function init() {
                $scope.round = 0;
                $scope.actualScore = 0;
                $scope.totalScore = 0;
                $scope.minTakeAmount = minTakeAmount;
                $scope.selections = [];

                $scope.dices = [];
                for (var i = 0; i < diceCount; i++) {
                    $scope.dices.push({
                        id: i,
                        blocked: 0,     // 0 unblocked, 1 temporarily blocked, >1 blocked from last round
                        number: undefined
                    });
                }
            }

            function allDicesBlocked() {
                for (var i = 0, len = $scope.dices.length; i < len; i++) {
                    if ($scope.dices[i].blocked === 0) {
                        return false;
                    }
                }
                return true;
            }

            function unblockAllDices() {
                for (var i = 0, len = $scope.dices.length; i < len; i++) {
                    $scope.dices[i].blocked = 0;
                }
            }

            // Functions
            $scope.roll = function () {
                if (allDicesBlocked() || $scope.zilch) {
                    unblockAllDices();
                    $scope.zilch = false;
                }
                for (var i = 0, len = $scope.dices.length; i < len; i++) {
                    var dice = $scope.dices[i];
                    if (dice.blocked === 0) {
                        dice.number = 1 + Math.floor(Math.random() * 6);
                    } else {
                        dice.blocked++;
                    }
                }

                $scope.possibilities = $filter('possibilitiesFilter')($scope.dices);
                if ($scope.possibilities.length === 0) {
                    $scope.actualScore = 0;
                    $scope.totalScore -= 500;
                    $scope.zilch = true;
                } else {
                    $scope.round++;
                }
            };

            $scope.take = function () {
                if ($scope.actualScore >= minTakeAmount) {
                    $scope.totalScore += $scope.actualScore;
                    $scope.actualScore = 0;
                    $scope.round = 0;
                }
                unblockAllDices();
            };

            $scope.toggle = function (possibility) {
                var blockValue;
                if ($scope.isPossibilitySelected(possibility)) {
                    $scope.actualScore -= possibility.score;
                    blockValue = 0;
                } else {
                    $scope.actualScore += possibility.score;
                    blockValue = 1;
                }

                for (var i = 0, len = $scope.dices.length; i < len; i++) {
                    if (possibility.ids.indexOf($scope.dices[i].id) !== -1) {
                        $scope.dices[i].blocked = blockValue;
                    }
                }
                $scope.possibilities = $filter('possibilitiesFilter')($scope.dices);
            };

            $scope.rollEnabled = function () {
                if ($scope.zilch) {
                    return true;
                } else if ($scope.round > 0) {
                    for (var i = 0, len = $scope.dices.length; i < len; i++) {
                        if ($scope.dices[i].blocked === 1) {
                            return true;
                        }
                    }
                    return false
                } else {
                    return true;
                }
            };

            $scope.isPossibilitySelected = function (possibility) {
                for (var i = 0, len = possibility.ids.length; i < len; i++) {
                    if ($scope.dices[possibility.ids[i]].blocked !== 1) {
                        return false;
                    }
                }
                return true;
            };
        })
        .filter('possibilitiesFilter', function (lang, diceCount) {
            return function (input) {

                if (angular.isArray(input)) {
                    var possibilities = [],
                        activeDiceCount = 0;

                    // map which stores diceIds to corresponding numbers
                    var pointCounts = {
                        1: [],
                        2: [],
                        3: [],
                        4: [],
                        5: [],
                        6: []
                    };

                    // insert diceIds in map
                    for (var i = 0, len = input.length; i < len; i++) {
                        var dice = input[i];
                        if (dice.blocked < 1) {
                            pointCounts[dice.number].push(dice.id);
                            activeDiceCount++;
                        }
                    }

                    // set basic requirements for a run (1-2-3-4-5-6)
                    var allRolled = activeDiceCount === diceCount,
                        isRun = allRolled,
                        isPairs = true;


                    angular.forEach(pointCounts, function (ids, number) {
                        number = parseInt(number);
                        var count = ids.length;
                        switch (count) {
                            case 6:
                                possibilities.push(getSameNumberPossibility(ids, number, 6));

                            case 5:
                                possibilities.push(getSameNumberPossibility(ids, number, 5));

                            case 4:
                                possibilities.push(getSameNumberPossibility(ids, number, 4));

                            case 3:
                                possibilities.push(getSameNumberPossibility(ids, number, 3));

                            case 2:
                                if (number === 1 || number === 5) {
                                    var possibility = {};
                                    possibility.ids = ids.slice(0, 2);
                                    possibility.score = number === 1 ? 200 : 100;
                                    possibility.description = lang[2].sg + ' ' + lang[number].sg;
                                    possibility.selected = false;
                                    possibilities.push(possibility);
                                }
                                isRun = false;
                            case 1:
                                if (number === 1 || number === 5) {
                                    possibility = {};
                                    possibility.ids = ids.slice(0, 1);
                                    possibility.score = number === 1 ? 100 : 50;
                                    possibility.description = (number === 1 ? 'an ' : 'a ') + lang[number].sg;
                                    possibility.selected = false;
                                    possibilities.push(possibility);
                                }

                            default:
                                if (count !== 2) {
                                    isPairs = false;
                                }
                                break;
                        }
                    });


                    var possibility = {
                        ids: [],
                        description: '',
                        score: 0,
                        selected: false
                    };
                    if (isPairs || isRun) {
                        for (i = 0; i < activeDiceCount; i++) {
                            possibility.ids.push(i);
                        }
                        possibility.score = 1500;
                        possibility.selected = false;
                        possibility.description = isPairs ? (lang[3].sg + ' ' + lang.pair.pl) : ('a ' + lang.run.sg);
                        possibilities.push(possibility);
                    }

                    if (allRolled && possibilities.length === 0) {
                        for (i = 0; i < activeDiceCount; i++) {
                            possibility.ids.push(i);
                        }
                        possibility.score = 500;
                        possibility.selected = false;
                        possibility.description = lang.noScore;
                        possibilities.push(possibility);
                    }


                    function getSameNumberPossibility(ids, number, count) {
                        var possibility =
                        {
                            ids: ids.slice(0, count),
                            description: lang[count].sg + ' ' + lang[number].pl,
                            selected: false
                        };

                        if (number === 1) {
                            possibility.score = 1000;
                        } else {
                            possibility.score = 100 * number;
                        }

                        possibility.score = possibility.score * Math.pow(2, count - 3);

                        return possibility;
                    }

                    return possibilities;
                }

                return input;

            };
        }
    )
})();