/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	module.exports = __webpack_require__(25);


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(13);
	
	var _zh_CN = __webpack_require__(20);
	
	var _en_US = __webpack_require__(21);
	
	var _checkClusterCtrl = __webpack_require__(22);
	
	var checkClusterCtrl = _interopRequireWildcard(_checkClusterCtrl);
	
	var _loginSaasCtrl = __webpack_require__(23);
	
	var loginSaasCtrl = _interopRequireWildcard(_loginSaasCtrl);
	
	var _netConfigCtrl = __webpack_require__(24);
	
	var netConfigCtrl = _interopRequireWildcard(_netConfigCtrl);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var app = angular.module("app", ["ngRoute", "pascalprecht.translate", "ngMessages", "ui.bootstrap", "ui.bootstrap.tpls", "ngSanitize", "ui.select", "ngTable"]).constant("API_HOST", GLOBALCONFIG.APIHOST).config(["$routeProvider", "$locationProvider", "$translateProvider", function ($routeProvider, $locationProvider, $translateProvider) {
	    $translateProvider.translations("en", _en_US.en_US);
	    $translateProvider.translations("zh", _zh_CN.zh_CN);
	    $translateProvider.preferredLanguage("zh");
	    $routeProvider.when("/checkCluster", {
	        templateUrl: "../tmpl/checkCluster.html",
	        controller: "checkClusterCtrl",
	        reloadOnSearch: false
	    }).when("/loginSaas", {
	        templateUrl: "../tmpl/loginSaas.html",
	        controller: "loginSaasCtrl",
	        reloadOnSearch: false
	    }).when("/netConfig", {
	        templateUrl: "../tmpl/netConfig.html",
	        controller: "netConfigCtrl",
	        reloadOnSearch: false
	    }).otherwise({ redirectTo: "/checkCluster" });
	}]).filter("unitFilter", function () {
	    return function (v) {
	        return Number(v) / 1024;
	    };
	}).config(["$controllerProvider", function ($controllerProvider) {
	    $controllerProvider.register(checkClusterCtrl);
	    $controllerProvider.register(loginSaasCtrl);
	    $controllerProvider.register(netConfigCtrl);
	}]).controller("mainCtrl", ["$scope", "$rootScope", "$routeParams", "$location", "$http", "$translate", function ($scope, $rootScope, $routeParams, $location, $http, translate) {
	    var self = $scope;
	    $rootScope.$on("$routeChangeStart", function (e, next) {});
	
	    function changeSiteTitle(path) {
	        var titles = path ? path.replace("/", "").split("/") : "";
	        var title = titles.length == 1 ? titles[titles.length - 1] == "" ? "home" : titles[titles.length - 1] : titles[1];
	        var trans_title = translate.instant("aws.siteTitle." + title);
	        $rootScope.pathTitle = trans_title;
	    }
	    $rootScope.$on("$routeChangeSuccess", function (a, cur) {
	        changeSiteTitle(cur.originalPath);
	        history.pushState(null, null, document.URL);
	        window.addEventListener('popstate', function () {
	            history.pushState(null, null, document.URL);
	        });
	        switch (cur.originalPath) {
	            case "/checkCluster":
	                self.stepOneActive = true;
	                self.stepTwoActive = false;
	                self.stepThreeActive = false;
	                break;
	            case "/loginSaas":
	                self.stepOneActive = true;
	                self.stepTwoActive = true;
	                self.stepThreeActive = false;
	                break;
	            case "/netConfig":
	                self.stepOneActive = true;
	                self.stepTwoActive = true;
	                self.stepThreeActive = true;
	                break;
	        }
	    });
	}]).service("regsrv", ["$http", function ($http) {
	    return {
	        checkUserName: function checkUserName(data) {
	            var loginsData = localStorage.LOGINS ? JSON.parse(localStorage.LOGINS) : "";
	            var enterpriseUid = loginsData.enterpriseUid;
	            return $http({
	                method: "POST",
	                url: "awstack-user/v1/enterprises/" + enterpriseUid + "/chkusername",
	                data: data
	            });
	        },
	        signup: function signup(data) {
	            return $http({
	                method: "POST",
	                url: "awstack-user/v1/enterprises/signup",
	                data: data
	            });
	        },
	        checkLoginName: function checkLoginName(data) {
	            return $http({
	                method: "POST",
	                url: "awstack-user/v1/enterprises/chkenterprisesname",
	                data: data
	            });
	        }
	    };
	}]).directive("gtip", function () {
	    //校验结束ip是否大于等于开始ip
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, ngModel) {
	            ngModel.$parsers.push(function (viewValue) {
	                var startValue = angular.element("#" + attrs.gtip).val();
	                if (startValue) {
	                    if (_IP.isV4Format(viewValue)) {
	                        if (_IP.toLong(viewValue) <= _IP.toLong(startValue)) {
	                            ngModel.$setValidity("gtip", false);
	                        } else {
	                            ngModel.$setValidity("gtip", true);
	                        }
	                    } else {
	                        ngModel.$setValidity("gtip", true);
	                    }
	                } else {
	                    if (_IP.isV4Format(ngModel.$viewValue) && !attrs.required) {
	                        ngModel.$setValidity("gtip", false);
	                    } else {
	                        ngModel.$setValidity("gtip", true);
	                    }
	                }
	                return viewValue;
	            });
	            ngModel.$formatters.push(function (viewValue) {
	                var startValue = angular.element("#" + attrs.gtip).val();
	                if (startValue) {
	                    if (_IP.isV4Format(viewValue)) {
	                        if (_IP.toLong(viewValue) <= _IP.toLong(startValue)) {
	                            ngModel.$setValidity("gtip", false);
	                        } else {
	                            ngModel.$setValidity("gtip", true);
	                        }
	                    } else {
	                        ngModel.$setValidity("gtip", true);
	                    }
	                } else {
	                    if (_IP.isV4Format(ngModel.$viewValue) && !attrs.required) {
	                        ngModel.$setValidity("gtip", false);
	                    } else {
	                        ngModel.$setValidity("gtip", true);
	                    }
	                }
	                return viewValue;
	            });
	            scope.$watch(function () {
	                var startValue = angular.element("#" + attrs.gtip).val();
	                return startValue;
	            }, function (startValue) {
	                if (startValue) {
	                    if (_IP.isV4Format(ngModel.$viewValue)) {
	                        if (_IP.toLong(ngModel.$viewValue) <= _IP.toLong(startValue)) {
	                            ngModel.$setValidity("gtip", false);
	                        } else {
	                            ngModel.$setValidity("gtip", true);
	                        }
	                    }
	                } else {
	                    if (_IP.isV4Format(ngModel.$viewValue) && !attrs.required) {
	                        ngModel.$setValidity("gtip", false);
	                    } else {
	                        ngModel.$setValidity("gtip", true);
	                    }
	                }
	            });
	        }
	    };
	}).directive("gtipnum", function () {
	    //校验结束ip大于开始ip具体个数
	    return {
	        restrict: "A",
	        require: "ngModel",
	        scope: {
	            num: "="
	        },
	        link: function link(scope, elem, attrs, ngModel) {
	            function valid(viewValue) {
	                var startValue = angular.element("#" + attrs.gtipnum).val();
	                if (startValue && scope.num) {
	                    if (_IP.isV4Format(viewValue)) {
	                        if (_IP.toLong(viewValue) < _IP.toLong(startValue) + scope.num) {
	                            ngModel.$setValidity("gtipnum", false);
	                        } else {
	                            ngModel.$setValidity("gtipnum", true);
	                        }
	                    } else {
	                        ngModel.$setValidity("gtipnum", true);
	                    }
	                } else {
	                    if (_IP.isV4Format(ngModel.$viewValue) && !attrs.required) {
	                        ngModel.$setValidity("gtipnum", false);
	                    } else {
	                        ngModel.$setValidity("gtipnum", true);
	                    }
	                }
	                return viewValue;
	            }
	            ngModel.$parsers.push(valid);
	            ngModel.$formatters.push(valid);
	            scope.$watch(function () {
	                var startValue = angular.element("#" + attrs.gtipnum).val();
	                return startValue;
	            }, function (startValue) {
	                if (startValue && scope.num) {
	                    if (_IP.isV4Format(ngModel.$viewValue)) {
	                        if (_IP.toLong(ngModel.$viewValue) < _IP.toLong(startValue) + scope.num) {
	                            ngModel.$setValidity("gtipnum", false);
	                        } else {
	                            ngModel.$setValidity("gtipnum", true);
	                        }
	                    }
	                } else {
	                    if (_IP.isV4Format(ngModel.$viewValue) && !attrs.required) {
	                        ngModel.$setValidity("gtipnum", false);
	                    } else {
	                        ngModel.$setValidity("gtipnum", true);
	                    }
	                }
	            });
	        }
	    };
	}).directive("maskCorrect", function () {
	    //校验mask
	    return {
	        restrict: "A",
	        require: "ngModel",
	        scope: {
	            cidrValue: "="
	        },
	        link: function link(scope, elem, attrs, ngModel) {
	            var maskreg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	            var cidrreg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))[\/]([1-9]|[1-2][0-9]|[3][0]|[3][1])$/;
	            function valid(viewValue) {
	                if (maskreg.test(viewValue) && cidrreg.test(scope.cidrValue)) {
	                    if (_IP.cidrSubnet(scope.cidrValue).subnetMask == viewValue) {
	                        ngModel.$setValidity("maskcorrect", true);
	                    } else {
	                        ngModel.$setValidity("maskcorrect", false);
	                    }
	                } else {
	                    ngModel.$setValidity("maskcorrect", true);
	                }
	                return viewValue;
	            }
	            ngModel.$parsers.push(valid);
	            ngModel.$formatters.push(valid);
	            scope.$watch(function () {
	                return scope.cidrValue;
	            }, function (startValue) {
	                valid(ngModel.$viewValue);
	            });
	        }
	    };
	}).directive("inIpRange", function () {
	    //校验结束ip大于开始ip具体个数
	    return {
	        restrict: "A",
	        require: "ngModel",
	        scope: {
	            startIp: "=",
	            endIp: "="
	        },
	        link: function link(scope, elem, attrs, ngModel) {
	            function valid(viewValue) {
	                if (_IP.isV4Format(viewValue) && _IP.isV4Format(scope.startIp) && _IP.isV4Format(scope.endIp)) {
	                    if (_IP.toLong(scope.startIp) <= _IP.toLong(viewValue) && _IP.toLong(viewValue) <= _IP.toLong(scope.endIp)) {
	                        ngModel.$setValidity("iniprange", true);
	                    } else {
	                        ngModel.$setValidity("iniprange", false);
	                    }
	                } else {
	                    ngModel.$setValidity("iniprange", true);
	                }
	                return viewValue;
	            }
	            ngModel.$parsers.push(valid);
	            ngModel.$formatters.push(valid);
	            scope.$watch(function () {
	                return scope.startIp + scope.endIp;
	            }, function (value) {
	                valid(ngModel.$viewValue);
	            });
	        }
	    };
	}).directive("incidr", [function () {
	    return {
	        require: "ngModel",
	        scope: {
	            cidrVal: "="
	        },
	        link: function link(scope, elem, attrs, $ngModel) {
	            var cidrVal = scope.cidrVal;
	            var reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))[\/]([1-9]|[1-2][0-9]|[3][0]|[3][1])$/;
	            $ngModel.$parsers.push(function (value) {
	                cidrVal = scope.cidrVal;
	                if (cidrVal) {
	                    var min = _IP.cidrSubnet(cidrVal).networkAddress;
	                    var max = _IP.cidrSubnet(cidrVal).broadcastAddress;
	                }
	                //if(_IP.isV4Format(value)){
	                if (_IP.isV4Format(value) && reg.test(cidrVal)) {
	                    if (!_IP.cidrSubnet(cidrVal).contains(value) || _IP.cidrSubnet(cidrVal).contains(value) && (_IP.toLong(min) >= _IP.toLong(value) || _IP.toLong(max) <= _IP.toLong(value))) {
	                        $ngModel.$setValidity("incidr", false);
	                        return value;
	                    }
	                }
	                $ngModel.$setValidity("incidr", true);
	                return value;
	            });
	            $ngModel.$formatters.push(function (value) {
	                cidrVal = scope.cidrVal;
	                if (cidrVal) {
	                    var min = _IP.cidrSubnet(cidrVal).networkAddress;
	                    var max = _IP.cidrSubnet(cidrVal).broadcastAddress;
	                }
	                //if(_IP.isV4Format(value)){
	                if (_IP.isV4Format(value) && reg.test(cidrVal)) {
	                    if (!_IP.cidrSubnet(cidrVal).contains(value) || _IP.cidrSubnet(cidrVal).contains(value) && (_IP.toLong(min) >= _IP.toLong(value) || _IP.toLong(max) <= _IP.toLong(value))) {
	                        $ngModel.$setValidity("incidr", false);
	                        return value;
	                    }
	                }
	                $ngModel.$setValidity("incidr", true);
	                return value;
	            });
	            scope.$watch(function () {
	                return scope.cidrVal;
	            }, function (val) {
	                if ($ngModel.$viewValue) {
	                    //if(_IP.cidrSubnet(val)&&reg.test(val)){
	                    if (reg.test(val)) {
	                        var min = _IP.cidrSubnet(val).networkAddress;
	                        var max = _IP.cidrSubnet(val).broadcastAddress;
	                        if (!_IP.cidrSubnet(val).contains($ngModel.$viewValue) || _IP.cidrSubnet(val).contains($ngModel.$viewValue) && (_IP.toLong(min) >= _IP.toLong($ngModel.$viewValue) || _IP.toLong(max) <= _IP.toLong($ngModel.$viewValue))) {
	                            $ngModel.$setValidity("incidr", false);
	                            return;
	                        }
	                        $ngModel.$setValidity("incidr", true);
	                    } else {
	                        $ngModel.$setValidity("incidr", true);
	                    }
	                }
	            });
	        }
	    };
	}]).directive("formValidate", ["$translate", function (translate) {
	    return {
	        restrict: "EA",
	        scope: {
	            maxNum: "=",
	            patternMsg: "="
	        },
	        template: "<div ng-message='required'>必填项</div>" + "<div ng-message='pattern'>{{patmsg}}</div>" + "<div ng-message='maxlength'>{{msg}}</div>" + "<div ng-message='minlength'>{{minmsg}}</div>" + "<div ng-message='pwCheck'>{{'aws.errors.pswdNotEqual'|translate}}</div>",
	        link: function link(scope) {
	            scope.patternMsg ? scope.patmsg = scope.patternMsg : scope.patmsg = "";
	        }
	    };
	}]).directive("vlan", [function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            $ngModel.$parsers.push(function (value) {
	                scope.$watch(function () {
	                    var min = $("input[name='tenantStart']").val();
	                    var max = $("input[name='tenantEnd']").val();
	                    return min + "," + max;
	                }, function (val) {
	                    var mins = Number(val.split(",")[0]);
	                    var maxs = Number(val.split(",")[1]);
	                    if (maxs && mins) {
	                        if (maxs > mins) {
	                            if (maxs - mins > 4000) {
	                                scope.vxlanTips = true;
	                            } else {
	                                scope.vxlanTips = false;
	                            }
	                            $ngModel.$setValidity("vlan", true);
	                        } else {
	                            scope.vxlanTips = false;
	                            $ngModel.$setValidity("vlan", false);
	                        }
	                    }
	                });
	                return value;
	            });
	        }
	    };
	}]).directive("logicalvlanlimit", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            var reg = /^[1-9]\d*$/;
	            $ngModel.$parsers.push(function (viewValue) {
	                var num = Number(viewValue);
	                if (reg.test(num)) {
	                    if (num >= 2 && num <= 4095) {
	                        $ngModel.$setValidity("logicalvlanlimit", true);
	                    } else {
	                        $ngModel.$setValidity("logicalvlanlimit", false);
	                    }
	                } else {
	                    if (num == 0) {
	                        $ngModel.$setValidity("logicalvlanlimit", true);
	                    } else {
	                        $ngModel.$setValidity("logicalvlanlimit", false);
	                    }
	                }
	                return viewValue;
	            });
	        }
	    };
	}).directive("vlanlimitstart", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            var reg = /^[1-9]\d*$/;
	            $ngModel.$parsers.push(function (viewValue) {
	                var num = Number(viewValue);
	                if (reg.test(num)) {
	                    if (num >= 2 && num <= 4095) {
	                        $ngModel.$setValidity("vlanlimitstart", true);
	                        scope.valnstartFlag = true;
	                    } else {
	                        $ngModel.$setValidity("vlanlimitstart", false);
	                        scope.valnstartFlag = false;
	                    }
	                } else {
	                    $ngModel.$setValidity("vlanlimitstart", false);
	                    scope.valnstartFlag = false;
	                }
	                return viewValue;
	            });
	        }
	    };
	}).directive("vlanlimitend", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            var reg = /^[1-9]\d*$/;
	            $ngModel.$parsers.push(function (viewValue) {
	                var num = Number(viewValue);
	                if (reg.test(num)) {
	                    if (num >= 2 && num <= 4095) {
	                        $ngModel.$setValidity("vlanlimitend", true);
	                        scope.valnendFlag = true;
	                    } else {
	                        $ngModel.$setValidity("vlanlimitend", false);
	                        scope.valnendFlag = false;
	                    }
	                } else {
	                    $ngModel.$setValidity("vlanlimitend", false);
	                    scope.valnendFlag = false;
	                    scope.valnstartFlag = false;
	                }
	                return viewValue;
	            });
	        }
	    };
	}).directive("vxlanlimitstart", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            var reg = /^[1-9]\d*$/;
	            $ngModel.$parsers.push(function (viewValue) {
	                var num = Number(viewValue);
	                if (reg.test(num)) {
	                    if (num >= 1 && num <= 16777215) {
	                        $ngModel.$setValidity("vxlanlimitstart", true);
	                        scope.valnstartFlag = true;
	                    } else {
	                        $ngModel.$setValidity("vxlanlimitstart", false);
	                        scope.valnstartFlag = false;
	                    }
	                } else {
	                    $ngModel.$setValidity("vxlanlimitstart", false);
	                    scope.valnstartFlag = false;
	                }
	                return viewValue;
	            });
	        }
	    };
	}).directive("vxlanlimitend", function () {
	    return {
	        restrict: "A",
	        require: "ngModel",
	        link: function link(scope, elem, attrs, $ngModel) {
	            var reg = /^[1-9]\d*$/;
	            $ngModel.$parsers.push(function (viewValue) {
	                var num = Number(viewValue);
	                if (reg.test(num)) {
	                    if (num >= 1 && num <= 16777215) {
	                        $ngModel.$setValidity("vxlanlimitend", true);
	                        scope.valnendFlag = true;
	                    } else {
	                        $ngModel.$setValidity("vxlanlimitend", false);
	                        scope.valnendFlag = false;
	                    }
	                } else {
	                    $ngModel.$setValidity("vxlanlimitend", false);
	                    scope.valnendFlag = false;
	                    scope.valnstartFlag = false;
	                }
	                return viewValue;
	            });
	        }
	    };
	}).directive("autoHeight", ["$timeout", function ($timeout) {
	    return {
	        restrict: "A",
	        link: function link(scope, elem, attr, ngmodal) {
	            var timer;
	            scope.$watch(function () {
	                return $("body").outerHeight();
	            }, function (bodyHeight) {
	                $timeout.cancel(timer);
	                timer = $timeout(function () {
	                    if (bodyHeight > $(window).height()) {
	                        $(elem).addClass('auto-height');
	                    } else {
	                        $(elem).removeClass('auto-height');
	                    }
	                }, 5);
	            });
	
	            $(window).resize(function () {
	                if ($('body').outerHeight() > $(window).height()) {
	                    $(elem).addClass('auto-height');
	                } else {
	                    $(elem).removeClass('auto-height');
	                }
	            });
	        }
	    };
	}]);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["_IP"] = __webpack_require__(14);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var ip = exports;
	var Buffer = __webpack_require__(15).Buffer;
	var os = __webpack_require__(19);
	
	ip.toBuffer = function(ip, buff, offset) {
	  offset = ~~offset;
	
	  var result;
	
	  if (this.isV4Format(ip)) {
	    result = buff || new Buffer(offset + 4);
	    ip.split(/\./g).map(function(byte) {
	      result[offset++] = parseInt(byte, 10) & 0xff;
	    });
	  } else if (this.isV6Format(ip)) {
	    var sections = ip.split(':', 8);
	
	    var i;
	    for (i = 0; i < sections.length; i++) {
	      var isv4 = this.isV4Format(sections[i]);
	      var v4Buffer;
	
	      if (isv4) {
	        v4Buffer = this.toBuffer(sections[i]);
	        sections[i] = v4Buffer.slice(0, 2).toString('hex');
	      }
	
	      if (v4Buffer && ++i < 8) {
	        sections.splice(i, 0, v4Buffer.slice(2, 4).toString('hex'));
	      }
	    }
	
	    if (sections[0] === '') {
	      while (sections.length < 8) sections.unshift('0');
	    } else if (sections[sections.length - 1] === '') {
	      while (sections.length < 8) sections.push('0');
	    } else if (sections.length < 8) {
	      for (i = 0; i < sections.length && sections[i] !== ''; i++);
	      var argv = [ i, 1 ];
	      for (i = 9 - sections.length; i > 0; i--) {
	        argv.push('0');
	      }
	      sections.splice.apply(sections, argv);
	    }
	
	    result = buff || new Buffer(offset + 16);
	    for (i = 0; i < sections.length; i++) {
	      var word = parseInt(sections[i], 16);
	      result[offset++] = (word >> 8) & 0xff;
	      result[offset++] = word & 0xff;
	    }
	  }
	
	  if (!result) {
	    throw Error('Invalid ip address: ' + ip);
	  }
	
	  return result;
	};
	
	ip.toString = function(buff, offset, length) {
	  offset = ~~offset;
	  length = length || (buff.length - offset);
	
	  var result = [];
	  if (length === 4) {
	    // IPv4
	    for (var i = 0; i < length; i++) {
	      result.push(buff[offset + i]);
	    }
	    result = result.join('.');
	  } else if (length === 16) {
	    // IPv6
	    for (var i = 0; i < length; i += 2) {
	      result.push(buff.readUInt16BE(offset + i).toString(16));
	    }
	    result = result.join(':');
	    result = result.replace(/(^|:)0(:0)*:0(:|$)/, '$1::$3');
	    result = result.replace(/:{3,4}/, '::');
	  }
	
	  return result;
	};
	
	var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
	var ipv6Regex =
	    /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
	
	ip.isV4Format = function(ip) {
	  return ipv4Regex.test(ip);
	};
	
	ip.isV6Format = function(ip) {
	  return ipv6Regex.test(ip);
	};
	function _normalizeFamily(family) {
	  return family ? family.toLowerCase() : 'ipv4';
	}
	
	ip.fromPrefixLen = function(prefixlen, family) {
	  if (prefixlen > 32) {
	    family = 'ipv6';
	  } else {
	    family = _normalizeFamily(family);
	  }
	
	  var len = 4;
	  if (family === 'ipv6') {
	    len = 16;
	  }
	  var buff = new Buffer(len);
	
	  for (var i = 0, n = buff.length; i < n; ++i) {
	    var bits = 8;
	    if (prefixlen < 8) {
	      bits = prefixlen;
	    }
	    prefixlen -= bits;
	
	    buff[i] = ~(0xff >> bits) & 0xff;
	  }
	
	  return ip.toString(buff);
	};
	
	ip.mask = function(addr, mask) {
	  addr = ip.toBuffer(addr);
	  mask = ip.toBuffer(mask);
	
	  var result = new Buffer(Math.max(addr.length, mask.length));
	
	  var i = 0;
	  // Same protocol - do bitwise and
	  if (addr.length === mask.length) {
	    for (i = 0; i < addr.length; i++) {
	      result[i] = addr[i] & mask[i];
	    }
	  } else if (mask.length === 4) {
	    // IPv6 address and IPv4 mask
	    // (Mask low bits)
	    for (i = 0; i < mask.length; i++) {
	      result[i] = addr[addr.length - 4  + i] & mask[i];
	    }
	  } else {
	    // IPv6 mask and IPv4 addr
	    for (var i = 0; i < result.length - 6; i++) {
	      result[i] = 0;
	    }
	
	    // ::ffff:ipv4
	    result[10] = 0xff;
	    result[11] = 0xff;
	    for (i = 0; i < addr.length; i++) {
	      result[i + 12] = addr[i] & mask[i + 12];
	    }
	    i = i + 12;
	  }
	  for (; i < result.length; i++)
	    result[i] = 0;
	
	  return ip.toString(result);
	};
	
	ip.cidr = function(cidrString) {
	  var cidrParts = cidrString.split('/');
	
	  var addr = cidrParts[0];
	  if (cidrParts.length !== 2)
	    throw new Error('invalid CIDR subnet: ' + addr);
	
	  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
	
	  return ip.mask(addr, mask);
	};
	
	ip.subnet = function(addr, mask) {
	  var networkAddress = ip.toLong(ip.mask(addr, mask));
	
	  // Calculate the mask's length.
	  var maskBuffer = ip.toBuffer(mask);
	  var maskLength = 0;
	
	  for (var i = 0; i < maskBuffer.length; i++) {
	    if (maskBuffer[i] === 0xff) {
	      maskLength += 8;
	    } else {
	      var octet = maskBuffer[i] & 0xff;
	      while (octet) {
	        octet = (octet << 1) & 0xff;
	        maskLength++;
	      }
	    }
	  }
	
	  var numberOfAddresses = Math.pow(2, 32 - maskLength);
	
	  return {
	    networkAddress: ip.fromLong(networkAddress),
	    firstAddress: numberOfAddresses <= 2 ?
	                    ip.fromLong(networkAddress) :
	                    ip.fromLong(networkAddress + 1),
	    lastAddress: numberOfAddresses <= 2 ?
	                    ip.fromLong(networkAddress + numberOfAddresses - 1) :
	                    ip.fromLong(networkAddress + numberOfAddresses - 2),
	    broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
	    subnetMask: mask,
	    subnetMaskLength: maskLength,
	    numHosts: numberOfAddresses <= 2 ?
	                numberOfAddresses : numberOfAddresses - 2,
	    length: numberOfAddresses,
	    contains: function(other) {
	      return networkAddress === ip.toLong(ip.mask(other, mask));
	    }
	  };
	};
	
	ip.cidrSubnet = function(cidrString) {
	  var cidrParts = cidrString.split('/');
	
	  var addr = cidrParts[0];
	  if (cidrParts.length !== 2)
	    throw new Error('invalid CIDR subnet: ' + addr);
	
	  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
	
	  return ip.subnet(addr, mask);
	};
	
	ip.not = function(addr) {
	  var buff = ip.toBuffer(addr);
	  for (var i = 0; i < buff.length; i++) {
	    buff[i] = 0xff ^ buff[i];
	  }
	  return ip.toString(buff);
	};
	
	ip.or = function(a, b) {
	  a = ip.toBuffer(a);
	  b = ip.toBuffer(b);
	
	  // same protocol
	  if (a.length === b.length) {
	    for (var i = 0; i < a.length; ++i) {
	      a[i] |= b[i];
	    }
	    return ip.toString(a);
	
	  // mixed protocols
	  } else {
	    var buff = a;
	    var other = b;
	    if (b.length > a.length) {
	      buff = b;
	      other = a;
	    }
	
	    var offset = buff.length - other.length;
	    for (var i = offset; i < buff.length; ++i) {
	      buff[i] |= other[i - offset];
	    }
	
	    return ip.toString(buff);
	  }
	};
	
	ip.isEqual = function(a, b) {
	  a = ip.toBuffer(a);
	  b = ip.toBuffer(b);
	
	  // Same protocol
	  if (a.length === b.length) {
	    for (var i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	
	  // Swap
	  if (b.length === 4) {
	    var t = b;
	    b = a;
	    a = t;
	  }
	
	  // a - IPv4, b - IPv6
	  for (var i = 0; i < 10; i++) {
	    if (b[i] !== 0) return false;
	  }
	
	  var word = b.readUInt16BE(10);
	  if (word !== 0 && word !== 0xffff) return false;
	
	  for (var i = 0; i < 4; i++) {
	    if (a[i] !== b[i + 12]) return false;
	  }
	
	  return true;
	};
	
	ip.isPrivate = function(addr) {
	  return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i
	      .test(addr) ||
	    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
	    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
	      .test(addr) ||
	    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
	    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
	    /^f[cd][0-9a-f]{2}:/i.test(addr) ||
	    /^fe80:/i.test(addr) ||
	    /^::1$/.test(addr) ||
	    /^::$/.test(addr);
	};
	
	ip.isPublic = function(addr) {
	  return !ip.isPrivate(addr);
	};
	
	ip.isLoopback = function(addr) {
	  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
	      .test(addr) ||
	    /^fe80::1$/.test(addr) ||
	    /^::1$/.test(addr) ||
	    /^::$/.test(addr);
	};
	
	ip.loopback = function(family) {
	  //
	  // Default to `ipv4`
	  //
	  family = _normalizeFamily(family);
	
	  if (family !== 'ipv4' && family !== 'ipv6') {
	    throw new Error('family must be ipv4 or ipv6');
	  }
	
	  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1';
	};
	
	//
	// ### function address (name, family)
	// #### @name {string|'public'|'private'} **Optional** Name or security
	//      of the network interface.
	// #### @family {ipv4|ipv6} **Optional** IP family of the address (defaults
	//      to ipv4).
	//
	// Returns the address for the network interface on the current system with
	// the specified `name`:
	//   * String: First `family` address of the interface.
	//             If not found see `undefined`.
	//   * 'public': the first public ip address of family.
	//   * 'private': the first private ip address of family.
	//   * undefined: First address with `ipv4` or loopback address `127.0.0.1`.
	//
	ip.address = function(name, family) {
	  var interfaces = os.networkInterfaces();
	  var all;
	
	  //
	  // Default to `ipv4`
	  //
	  family = _normalizeFamily(family);
	
	  //
	  // If a specific network interface has been named,
	  // return the address.
	  //
	  if (name && name !== 'private' && name !== 'public') {
	    var res = interfaces[name].filter(function(details) {
	      var itemFamily = details.family.toLowerCase();
	      return itemFamily === family;
	    });
	    if (res.length === 0)
	      return undefined;
	    return res[0].address;
	  }
	
	  var all = Object.keys(interfaces).map(function (nic) {
	    //
	    // Note: name will only be `public` or `private`
	    // when this is called.
	    //
	    var addresses = interfaces[nic].filter(function (details) {
	      details.family = details.family.toLowerCase();
	      if (details.family !== family || ip.isLoopback(details.address)) {
	        return false;
	      } else if (!name) {
	        return true;
	      }
	
	      return name === 'public' ? ip.isPrivate(details.address) :
	          ip.isPublic(details.address);
	    });
	
	    return addresses.length ? addresses[0].address : undefined;
	  }).filter(Boolean);
	
	  return !all.length ? ip.loopback(family) : all[0];
	};
	
	ip.toLong = function(ip) {
	  var ipl = 0;
	  ip.split('.').forEach(function(octet) {
	    ipl <<= 8;
	    ipl += parseInt(octet);
	  });
	  return(ipl >>> 0);
	};
	
	ip.fromLong = function(ipl) {
	  return ((ipl >>> 24) + '.' +
	      (ipl >> 16 & 255) + '.' +
	      (ipl >> 8 & 255) + '.' +
	      (ipl & 255) );
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(16)
	var ieee754 = __webpack_require__(17)
	var isArray = __webpack_require__(18)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function getLens (b64) {
	  var len = b64.length
	
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=')
	  if (validLen === -1) validLen = len
	
	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4)
	
	  return [validLen, placeHoldersLen]
	}
	
	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function toByteArray (b64) {
	  var tmp
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	
	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
	
	  var curByte = 0
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen
	
	  for (var i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)]
	    arr[curByte++] = (tmp >> 16) & 0xFF
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF)
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(
	      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
	    ))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    )
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    )
	  }
	
	  return parts.join('')
	}


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = (nBytes * 8) - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = (nBytes * 8) - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	exports.endianness = function () { return 'LE' };
	
	exports.hostname = function () {
	    if (typeof location !== 'undefined') {
	        return location.hostname
	    }
	    else return '';
	};
	
	exports.loadavg = function () { return [] };
	
	exports.uptime = function () { return 0 };
	
	exports.freemem = function () {
	    return Number.MAX_VALUE;
	};
	
	exports.totalmem = function () {
	    return Number.MAX_VALUE;
	};
	
	exports.cpus = function () { return [] };
	
	exports.type = function () { return 'Browser' };
	
	exports.release = function () {
	    if (typeof navigator !== 'undefined') {
	        return navigator.appVersion;
	    }
	    return '';
	};
	
	exports.networkInterfaces
	= exports.getNetworkInterfaces
	= function () { return {} };
	
	exports.arch = function () { return 'javascript' };
	
	exports.platform = function () { return 'browser' };
	
	exports.tmpdir = exports.tmpDir = function () {
	    return '/tmp';
	};
	
	exports.EOL = '\n';


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var zh_CN = exports.zh_CN = {
	    aws: {
	        "siteTitle": {
	            "checkCluster": "环境验证",
	            "loginSaas": "认证登录",
	            "netConfig": "网络配置"
	        },
	        errors: {
	            "disunity": "节点信息不统一,请重新注册节点",
	            "disfault": "节点故障域信息不统一，请调整！",
	            "fault_domain": "格式不正确",
	            "required": "必填项",
	            "integer": "请输入正整数",
	            "maxlength": "请至多输入32位",
	            "noSpecial": "只能输入字母、数字、汉字、横线以及下划线",
	            "toInput": "请输入",
	            "toNum": "的正整数",
	            "limit_1000": "请输入小于或等于1000的值",
	            "pswdNotEqual": "两次输入的密码不同",
	            "phone": "请输入正确的手机号",
	            "email": "请输入正确的邮箱",
	            "limit_volume": "请输入不大于1000的正整数",
	            "description": "描述信息不能超过80个字符"
	        },
	        "action": {
	            "ok": "确定",
	            "cancel": "取消",
	            "empty": "清空"
	        },
	        "register": {
	            "title": "AWSTACK注册配置管理",
	            "reg": {
	                "haveAccount": "我有登录账号",
	                "backlogin": "返回登录",
	                "register": "用户注册",
	                "EAccount": "企业名称",
	                "inputaccount": "请输入企业名称",
	                "required": "必填项",
	                "char4_16": "请输入4-16个字符，允许有英文字母、数字和下划线",
	                "char4_16_cn": "请输入4-16个字符，允许有数字，字母，下划线，中文",
	                "accountexit": "账号已存在",
	                "EName": "企业名称",
	                "ENamesetting": "设置企业名称",
	                "email": "电子邮箱",
	                "emailSet": "设置邮箱",
	                "emailtest": "请输入正确的邮箱格式,例如example@mycompany.com",
	                "inputEmail": "请输入邮箱地址",
	                "emailExist": "邮箱已存在",
	                "sendemail": "发送邮件",
	                "tel": "联系电话",
	                "telinput": "+86 请输入手机号码",
	                "telSet": "手机号码为11位数",
	                "formaterror": "格式不正确",
	                "newPassword": "新密码",
	                "passwd": "登录密码",
	                "passwdSet": "设置密码",
	                "resetPassword": "重置密码",
	                "passwd6": "密码位数至少6位",
	                "passwd16": "密码位数不能超过16位",
	                "confirmPasswd": "确认密码",
	                "inputpasswdagain": "再次输入密码",
	                "passwddiff": "两次输入密码不一致",
	                "confirm": "确认",
	                "servererror": "服务器错误",
	                "succeed": "恭喜您注册成功",
	                "loginname": "您的登录名为",
	                "loginder": "该账号为云管理平台登录企业名称",
	                "regionKey": "您的注册码为",
	                "regionder": "注册码是服务器注册的唯一认证码",
	                "backloginpage": "返回登录页"
	            },
	            "comp": {
	                "progress": "30% Complete",
	                "ceph": "分布式存储",
	                "keystone": "身份认证",
	                "glance": "镜像",
	                "cinder": "块存储",
	                "ha": "高可用",
	                "nova": "计算",
	                "neutron": "网络",
	                "failed": "部署失败",
	                "playing": "正在安装中",
	                "restart": "重新部署",
	                "detail": "查看配置详情",
	                "reallyRestart": "您确定要重新部署吗?",
	                "tosass": "前往控制中心",
	                "success": "云环境部署成功",
	                "warning": "如果长时间没有安装进度提示，请联系管理员",
	                "readyTips": "系统配置中，请稍候....",
	                "successAll": "您的私有云环境已经部署完毕，现在可以前往控制中心,进行操作.",
	                "start": "您的云环境正在创建",
	                "decr": "该安装过程可能会受到您的网络环境、设备环境的影响出现安装缓慢的情况，请您耐心等待！"
	            },
	            "info": {
	                "alias": "别名",
	                "hostChoice": "选择主机",
	                "netSetting": "网络配置",
	                "accSetting": "账号设置",
	                "infoSummary": "信息汇总",
	                "hostName": "主机名",
	                "area": "区域",
	                "datacluster": "数据中心",
	                "ManagementNetwork": "管理网",
	                "cpu": "CPU(核)",
	                "mem": "内存(GB)",
	                "next": "下一步",
	                "iprange": "IP范围",
	                "clusternetwork": "集群网",
	                "start": "起始IP",
	                "iperrorformat": "IP格式不正确",
	                "ipnotnone": "IP不能为空",
	                "end": "结束IP",
	                "vlan": "VLAN ID",
	                "vlanstart": "起始VLAN",
	                "vlanend": "结束VLAN",
	                "addRangeIp": "增加IP范围",
	                "netmask": "子网掩码",
	                "inputint": "请输入1-4095范围内的正整数",
	                "Storagenetwork": "存储网",
	                "TenantNetwork": "租户网",
	                "required": "必填项",
	                "extNetwork": "外网",
	                "last": "上一步",
	                "Administrator": "管理员账号",
	                "char4_16": "请输入4-16个字符，允许有英文字母、数字和下划线",
	                "special_8_16": "密码长度为8-16个字符且至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符。特殊字符包括! - @ . ^ _ % , : /",
	                "accountexit": "账号已存在",
	                "passwd": "密码",
	                "passwd6": "密码位数至少6位",
	                "passwd16": "密码位数不能超过16位",
	                "confirm": "确认密码",
	                "passwddiff": "两次输入密码不一致",
	                "type": "网络类型",
	                "IPaddresses": "IP地址段",
	                "vlantag": "标签",
	                "areaConf": "数据中心配置",
	                "EAdministrator": "企业管理员账号",
	                "account": "账号",
	                "deployment": "开始部署",
	                "floatingip": "浮动ip",
	                "floatinggateway": "网关",
	                "cidr": "CIDR",
	                "cluster": "集群网",
	                "storage": "存储网",
	                "tenant": "租户网",
	                "floating": "业务网",
	                "ceph_nova_pool_size": "虚拟机系统盘副本数",
	                "ceph_glance_pool_size": "镜像副本数",
	                "ceph_cinder_pool_size": "块存储副本数",
	                "ipDomain": "请输入正确的IP或者域名",
	                "max_length_80": "有效字符长度不能大于80个字符",
	                "ipDomainPlaceHoder": "支持输入IP或域名",
	                "ntpserver": "NTP服务器",
	                "isHa": "是否高可用",
	                "offline": "与集群断开连接，如果长时间无响应请联系管理员",
	                "restart": "系统重启中，请勿刷新页面，如果页面长时间不刷新，请联系管理员排查",
	                "rangeTotal": "IP地址数量不够",
	                "rangeSame": "IP地址范围有重复",
	                "fault": "故障域",
	                "copyright": window.SETTING.COPYRIGHT
	            },
	            "login": {
	                "Eguestlogin": "企业客户登录",
	                // "account": "企业账号",
	                "user": "企业名称",
	                "required": "必填项",
	                "passwd": "密码",
	                "login": "登录",
	                "userorpasswderror": "用户名或密码错误",
	                "servererror": "服务器错误",
	                "forgetpasswd": "忘记密码",
	                "aws_account": "还没有账号？",
	                "register": "立即注册"
	            }
	        }
	    }
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var en_US = exports.en_US = {
	    aws: {}
	};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.checkClusterCtrl = checkClusterCtrl;
	checkClusterCtrl.$inject = ["$scope", "$http", "$location", "$timeout", "$uibModal", "NgTableParams"];
	function checkClusterCtrl($scope, $http, $location, $timeout, $uibModal, NgTableParams) {
					var self = $scope;
					self.nextBtn = false;
					self.nextStep = function () {
									if (self.checkResult == 'success') {
													self.showAlert = true;
									} else {
													self.showAlert = false;
													$location.path('/loginSaas').replace();
									}
					};
	
					self.toNext = function () {
									$location.path('/loginSaas').replace();
					};
	
					self.close = function () {
									self.showAlert = false;
					};
	
					self.mysql = 'init';
					self.checkClusterStart = function () {
									self.checkResult = 'init';
									self.mysql = 'init';
									self.checkResultTips = false;
									$.ajax({
													type: "GET",
													url: "/network_check",
													success: function success(data) {
																	if (data) {
																					self.checkedData = data;
																					self.checkResult = 'success';
																					for (var node in self.checkedData) {
																									if (self.checkedData[node].local) {
																													self.sourceNode = node;
																													break;
																									}
																					}
	
																					for (var i in self.checkedData) {
																									if (!self.checkedData[i].cluster.ping_success || !self.checkedData[i].mgmt.ping_success || !self.checkedData[i].storage.ping_success || !self.checkedData[i].tenant.ping_success) {
																													self.checkResult = 'fail';
																													break;
																									}
																					}
																					//集群网
																					self.checkClusterResult = true;
																					for (var j in self.checkedData) {
																									if (!self.checkedData[j].cluster.ping_success) {
																													self.checkClusterResult = false;
																													break;
																									}
																					}
																					self.checkResultTips = false;
																					$.ajax({
																									type: "GET",
																									url: "/health_check",
																									success: function success(data) {
																													if (data) {
																																	if (data.mysql_conn == false) {
																																					self.checkResult = 'fail';
																																	}
	
																																	if (data.consul.unready && data.consul.unready.length > 0) {
																																					self.checkResult = 'fail';
																																					self.consul_conn = false;
																																	} else {
																																					self.consul_conn = true;
																																	}
	
																																	if (data.nomad.unready && data.nomad.unready.length > 0) {
																																					self.checkResult = 'fail';
																																					self.nomad_conn = false;
																																	} else {
																																					self.nomad_conn = true;
																																	}
	
																																	self.mysql = data.mysql_conn;
	
																																	if (self.checkClusterResult) {
																																					self.nextBtn = true;
																																	} else {
																																					self.nextBtn = false;
																																	}
																													}
																													self.$apply();
																									},
																									error: function error(data) {
																													self.checkResultTips = true;
																													self.$apply();
																													console.log('检测数据库联通失败');
																									}
																					});
																					self.$apply();
																	}
													},
													error: function error(data) {
																	self.checkResultTips = true;
																	self.$apply();
																	console.log('检测集群网联调失败');
													}
									});
					};
	}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.loginSaasCtrl = loginSaasCtrl;
	loginSaasCtrl.$inject = ["$scope", "$http", "$location", "$timeout", "$uibModal", "NgTableParams"];
	function loginSaasCtrl($scope, $http, $location, $timeout, $uibModal, NgTableParams) {
	    var self = $scope;
	    self.submitted = false;
	    self.login = {
	        username: '',
	        password: ''
	    };
	    self.userNameErrorMsg = "只能输入字母、汉字、数字、横线";
	    self.passwordErrorMsg = "密码长度为8-16个字符且至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符。特殊字符包括! - @ . ^ _ % , : /";
	
	    self.interacted = function (field) {
	        if (field) {
	            return self.submitted || field.$dirty;
	        }
	    };
	
	    self.changeStep = function (path) {
	        $location.path(path).replace();
	    };
	    self.passwordType = true;
	    self.changeType = function () {
	        self.passwordType = !self.passwordType;
	    };
	    self.change = function () {
	        self.loginTips = false;
	    };
	
	    self.loginSaas = function (m, v) {
	        if (m.$valid) {
	            //var params = 'request=' + JSON.stringify({"username":"admin","password":"Awcloud!23"});
	            var params = 'request=' + JSON.stringify({ "username": v.username, "password": v.password });
	            $.ajax({
	                type: "POST",
	                url: "/login ",
	                data: params,
	                dataType: 'json',
	                success: function success(data) {
	                    self.loginTips = false;
	                    if (data == true) {
	                        $location.path('/netConfig').replace();
	                    } else {
	                        self.loginTips = true;
	                    }
	                    self.$apply();
	                },
	                error: function error(data) {
	                    console.log(data, "登录失败信息");
	                }
	            });
	        } else {
	            self.submitted = true;
	        }
	    };
	}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.netConfigCtrl = netConfigCtrl;
	netConfigCtrl.$inject = ["$scope", "$http", "$location", "$timeout", "$uibModal", "NgTableParams"];
	function netConfigCtrl($scope, $http, $location, $timeout, $uibModal, NgTableParams) {
	    var self = $scope;
	    self.changeStep = function (path) {
	        $location.path(path).replace();
	    };
	
	    self.submitted = false;
	    self.canNotFill = false;
	    self.modifySuccess = false;
	    self.data = {};
	    self.selectedPage = 1;
	    self.ipErrorMsg = "请输入正确的IP地址";
	    self.cidrErrorMsg = "请输入正确的CIDR";
	    self.gatewayErrorMsg = "请输入正确的网关地址";
	    self.netMaskError = "请输入正确的子网掩码";
	    self.dnsError = "请输入正确的DNS地址";
	    self.interacted = function (field) {
	        if (field) {
	            return self.submitted || field.$dirty;
	        }
	    };
	    self.nodelist = [];
	    self.pageList = [];
	    self.twoModule = {};
	    self.twoModule.publicCheck = true;
	    function sortNumber(a, b) {
	        return _IP.toLong(a.ipaddr) - _IP.toLong(b.ipaddr);
	    }
	    // self.data = {
	    //     "mgmt_gateway": "192.168.1.1",
	    //     "mgmt_netmask": "255.255.255.0",
	    //     "mgmt_dns": "192.168.3.1",
	    //     "saas_addr": "192.168.1.15",
	    //     "floating_gateway": "192.168.2.1",
	    //     "floating_netmask": "255.255.255.0",
	    //     "floating_cidr": "192.168.3.1/24",
	    //     "floating_start": "192.168.3.1",
	    //     "floating_end": "192.168.3.5",
	    //     "vlan_range_start":"300",
	    //     "vlan_range_end":"500",
	    //     "ha_vlan":"200",
	    //     "network_type":"vxlan",
	    //     "ntp":"org.cn"
	    // };
	    // self.nodelist =[
	    //     { hostname: 'node-1', ipaddr: '192.168.1.1'},
	    //     { hostname: 'node-2', ipaddr: '192.168.1.2'},
	    //     { hostname: 'node-3', ipaddr: '192.168.1.3'},
	    //     { hostname: 'node-4', ipaddr: '192.168.1.4'}
	    // ]
	    //获取网络信息
	    function getNetConfig() {
	        self.nodelist = [];
	        $.ajax({
	            type: "GET",
	            url: "/get_info",
	            success: function success(data) {
	                self.data.mgmt_gateway = data.gateway;
	                self.data.mgmt_netmask = data.netmask;
	                self.data.mgmt_dns = data.dns;
	                self.data.saas_addr = data.saas_ip;
	                self.data.ntp = data.ntp_server[0];
	                self.data.floating_vlan_switch = data.mgmt['node-1'].vlan != 0 ? true : false;
	                self.data.mgmt_vlan = data.mgmt['node-1'].vlan == 0 ? "" : data.mgmt['node-1'].vlan;
	
	                self.data.floating_gateway = data.public.gateway;
	                self.data.floating_netmask = data.public.netmask;
	                self.data.floating_cidr = data.public.cidr;
	                self.data.floating_start = data.public.ip_start;
	                self.data.floating_end = data.public.ip_end;
	                self.data.floating_vlan = data.public.vlan;
	                self.data.floating_vlan_switch = data.public.vlan != '' ? true : false;
	
	                self.data.vlan_range_end = data.tenant.vlan_range.split('-')[1];
	                self.data.vlan_range_start = data.tenant.vlan_range.split('-')[0];
	                self.data.ha_vlan = data.tenant.ha_vlan ? data.tenant.ha_vlan : "";
	                self.data.network_type = data.tenant.network_type;
	
	                for (var i in data.mgmt) {
	                    var obj = { hostname: i, ipaddr: data.mgmt[i].ip };
	                    self.nodelist.push(obj);
	                }
	                self.nodelist = self.nodelist.sort(sortNumber);
	                self.$apply();
	
	                // var num = parseInt(self.nodelist.length / 8) + (self.nodelist.length % 8 == 0 ? 0 : 1);
	                // for (var i = 0; i < num; i++) {
	                //     if (self.nodelist.length < 8) {
	                //         break;
	                //     }
	                //     self.pageList.push(i + 1);
	                // }
	            },
	            error: function error(data) {
	                console.log('获取节点列表失败');
	            }
	        });
	    }
	    getNetConfig();
	
	    self.clickPage = function (num) {
	        self.selectedPage = num;
	        var topHeight = -(num - 1) * 120;
	        $('.node-box').css("top", topHeight + 'px');
	    };
	
	    self.clear = function () {
	        //重置表单
	        self.ipForm.$setPristine();
	        self.ipForm.$setUntouched();
	        getNetConfig();
	
	        // self.nodelist.forEach(function (node) {
	        //     node.ipaddr = "";
	        // });
	    };
	
	    function isRepeatFunc(arr) {
	        var hash = {};
	        for (var i in arr) {
	            if (hash[arr[i].ipaddr]) return true;
	            hash[arr[i].ipaddr] = true;
	        }
	        return false;
	    }
	
	    function getIpPoolsZone(allocationPools) {
	        var pools = {};
	        allocationPools.forEach(function (item, i) {
	            pools[i] = [_IP.toLong(item.start), _IP.toLong(item.end)];
	        });
	        return pools; //返回所有IP池的IP范围
	    }
	
	    function checkIpInPool(allocationPools, ip) {
	        //校验IP地址池中是否含有网关IP(校验IP池中是否含有某个IP)
	        var ipInPool = false;
	        var poolsObj = getIpPoolsZone(allocationPools);
	        for (var key in poolsObj) {
	            if (_IP.toLong(ip) >= poolsObj[key][0] && _IP.toLong(ip) <= poolsObj[key][1]) {
	                ipInPool = true;
	                break;
	            }
	        }
	        return ipInPool;
	    };
	    self.fill = function () {
	        if (self.ipForm.mgmt_endIp.$valid && self.ipForm.mgmt_startIp.$valid) {
	            self.nodelist.forEach(function (node, index) {
	                node.ipaddr = _IP.fromLong(_IP.toLong(self.data.mgmt_startIp) + index);
	            });
	        } else {
	            self.canNotFill = true;
	            $timeout(function () {
	                self.canNotFill = false;
	            }, 2000);
	        }
	    };
	    self.close = function () {
	        self.showAlert = false;
	    };
	    self.toSass = function () {
	        $.ajax({
	            type: "GET",
	            url: "/shutdown_nodes",
	            success: function success(data) {
	                self.modifyResult = 'shutdown';
	                self.$apply();
	            },
	            error: function error(data) {
	                console.log(data, "关机失败");
	                self.modifyResult = 'shutdownerror';
	                self.$apply();
	            }
	        });
	        //window.open("http://"+self.data.saas_addr,"_self")
	    };
	
	    function to8Bit(number) {
	        var result = parseInt(number).toString(2);
	        while (result.length < 8) {
	            result = "0" + result;
	        }
	        return result;
	    }
	    //校验IP地址，子网掩码和默认网关的关系是否正确。w是默认网关，y是子网掩码，i是IP地址。
	    function checkIp(w, y, i) {
	        var ws = w.split('.');
	        var ys = y.split('.');
	        var is = i.split('.');
	        for (var index in ws) {
	            var cw = to8Bit(ws[index]);
	            var cy = to8Bit(ys[index]);
	            var ci = to8Bit(is[index]);
	            for (var jndex = 0; jndex < 8; jndex++) {
	                if (cy[jndex] == "1") {
	                    if (cw[jndex] != ci[jndex]) return false;
	                }
	            }
	        }
	        return true;
	    }
	
	    self.confirm = function (ipForm) {
	        if (ipForm.$valid) {
	            //检测管理网ip地址
	            //1.云管地址要在管理网范围内
	            self.sassIpTips = !checkIp(self.data.mgmt_gateway, self.data.mgmt_netmask, self.data.saas_addr);
	
	            for (var i = 0; i < self.nodelist.length; i++) {
	                self.nodeIpTips = false;
	                if (checkIp(self.data.mgmt_gateway, self.data.mgmt_netmask, self.nodelist[i].ipaddr) == false) {
	                    self.nodeIpTips = true;
	                    break;
	                }
	            }
	            for (var i = 0; i < self.nodelist.length; i++) {
	                self.saasNodeIpTips = false;
	                if (self.nodelist[i].ipaddr == self.data.saas_addr) {
	                    self.saasNodeIpTips = true;
	                    break;
	                }
	            }
	            //检测vlan是否冲突、
	            if (self.data.network_type == 'vlan') {
	                if (self.data.ha_vlan != "") {
	                    if (Number(self.data.ha_vlan) <= Number(self.data.vlan_range_end) && Number(self.data.ha_vlan) >= Number(self.data.vlan_range_start)) {
	                        self.haVlanTips = true;
	                    } else {
	                        self.haVlanTips = false;
	                    }
	                } else {
	                    self.haVlanTips = false;
	                }
	
	                if (self.data.floating_vlan_switch) {
	                    if (Number(self.data.floating_vlan) <= Number(self.data.vlan_range_end) && Number(self.data.floating_vlan) >= Number(self.data.vlan_range_start)) {
	                        self.floatVlanTips = true;
	                    } else {
	                        self.floatVlanTips = false;
	                    }
	                } else {
	                    self.floatVlanTips = false;
	                }
	
	                if (self.data.floating_vlan_switch) {
	                    if (Number(self.data.mgmt_vlan) <= Number(self.data.vlan_range_end) && Number(self.data.mgmt_vlan) >= Number(self.data.vlan_range_start)) {
	                        self.mgmtVlanTips = true;
	                    } else {
	                        self.mgmtVlanTips = false;
	                    }
	                } else {
	                    self.mgmtVlanTips = false;
	                }
	            }
	
	            if (self.mgmtVlanTips || self.floatVlanTips || self.haVlanTips || self.sassIpTips || self.nodeIpTips || self.saasNodeIpTips) {
	                $timeout(function () {
	                    self.mgmtVlanTips = false;
	                    self.floatVlanTips = false;
	                    self.haVlanTips = false;
	                    self.sassIpTips = false;
	                    self.nodeIpTips = false;
	                    self.saasNodeIpTips = false;
	                }, 3000);
	                return;
	            }
	
	            var allocationPools = [{ start: self.data.floating_start, end: self.data.floating_end }];
	            self.ipEqToGateway = checkIpInPool(allocationPools, self.data.floating_gateway); //校验IP地址池中是否含有网关IP(校验IP池中是否含有某个IP)
	            self.repeatNodeIp = isRepeatFunc(self.nodelist);
	            $timeout(function () {
	                self.ipEqToGateway = false;
	                self.repeatNodeIp = false;
	            }, 3000);
	            if (!self.repeatNodeIp && !self.ipEqToGateway) {
	                self.modifyResult = 'modifying';
	                self.showAlert = true;
	                var ntp_server = [];
	                ntp_server.push(self.data.ntp);
	                var params = {
	                    "mgmt_gateway": self.data.mgmt_gateway,
	                    "mgmt_netmask": self.data.mgmt_netmask,
	                    "mgmt_dns": self.data.mgmt_dns,
	                    "saas_addr": self.data.saas_addr,
	                    "floating_gateway": self.data.floating_gateway,
	                    "floating_netmask": self.data.floating_netmask,
	                    "floating_cidr": self.data.floating_cidr,
	                    "floating_start": self.data.floating_start,
	                    "floating_end": self.data.floating_end,
	                    "floating_vlan": self.data.floating_vlan_switch ? self.data.floating_vlan : "",
	                    "mgmt": [],
	                    "ntp_server": ntp_server,
	                    "tenant": {
	                        "vlan_range": self.data.vlan_range_start + "-" + self.data.vlan_range_end,
	                        "ha_vlan": self.data.ha_vlan != '' ? self.data.ha_vlan : "",
	                        "network_type": self.data.network_type,
	                        "vlan_start": self.data.vlan_range_start,
	                        "vlan_end": self.data.vlan_range_end
	                    }
	                };
	                self.nodelist.forEach(function (node) {
	                    params.mgmt.push({ hostname: node.hostname, ipaddr: node.ipaddr, vlan_id: self.data.floating_vlan_switch ? self.data.mgmt_vlan : 0 });
	                });
	                params = 'request=' + JSON.stringify(params);
	                $.ajax({
	                    type: "POST",
	                    url: "/modify",
	                    data: params,
	                    dataType: 'json',
	                    success: function success(data) {
	                        self.modifyResult = 'success';
	                        self.$apply();
	                    },
	                    error: function error(data) {
	                        console.log(data, "修改错误信息");
	                        self.modifyResult = 'fail';
	                        self.$apply();
	                    }
	                });
	            }
	        } else {
	            self.submitted = true;
	        }
	    };
	}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map