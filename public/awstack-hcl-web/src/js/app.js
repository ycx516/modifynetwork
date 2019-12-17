import "ip";
import { zh_CN } from "../i18n/zh_CN";
import { en_US } from "../i18n/en_US";
import * as checkClusterCtrl from "./controller/checkClusterCtrl";
import * as loginSaasCtrl from "./controller/loginSaasCtrl";
import * as netConfigCtrl from "./controller/netConfigCtrl";
var app = angular.module("app", ["ngRoute", "pascalprecht.translate","ngMessages", "ui.bootstrap","ui.bootstrap.tpls", "ngSanitize","ui.select","ngTable"])
    .constant("API_HOST", GLOBALCONFIG.APIHOST)
    .config(["$routeProvider", "$locationProvider",  "$translateProvider",
        function($routeProvider, $locationProvider,  $translateProvider) {
            $translateProvider.translations("en", en_US);
            $translateProvider.translations("zh", zh_CN);
            $translateProvider.preferredLanguage("zh");
            $routeProvider
                .when("/checkCluster", {
                    templateUrl: "../tmpl/checkCluster.html",
                    controller: "checkClusterCtrl",
                    reloadOnSearch: false
                })
                .when("/loginSaas", {
                    templateUrl: "../tmpl/loginSaas.html",
                    controller: "loginSaasCtrl",
                    reloadOnSearch: false
                })
                .when("/netConfig", {
                    templateUrl: "../tmpl/netConfig.html",
                    controller: "netConfigCtrl",
                    reloadOnSearch: false
                })
                .otherwise({ redirectTo: "/checkCluster" });
        }
    ])
    .filter("unitFilter", function() {
        return function(v) {
            return Number(v) / 1024;
        };
    })
    .config(["$controllerProvider", function($controllerProvider){
        $controllerProvider.register(checkClusterCtrl);
        $controllerProvider.register(loginSaasCtrl);
        $controllerProvider.register(netConfigCtrl);
    }])
    .controller("mainCtrl", ["$scope", "$rootScope", "$routeParams","$location","$http","$translate", function($scope, $rootScope, $routeParams,$location,$http,translate) {
        var self = $scope;
        $rootScope.$on("$routeChangeStart",function(e,next){

        });

        function changeSiteTitle(path) {
            var titles = path?path.replace("/", "").split("/"):"";
            var title = titles.length == 1 ? (titles[titles.length - 1] == "" ? "home" : titles[titles.length - 1]) : titles[1];
            var trans_title = translate.instant("aws.siteTitle." + title);
            $rootScope.pathTitle = trans_title;
        }
        $rootScope.$on("$routeChangeSuccess", function(a, cur) {
            changeSiteTitle(cur.originalPath);
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
            switch (cur.originalPath) {
            case "/checkCluster":
                self.stepOneActive = true;
                self.stepTwoActive =false;
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
    }])
    .service("regsrv",["$http",function($http){
        return {
            checkUserName:function(data){
                var loginsData = localStorage.LOGINS ? JSON.parse(localStorage.LOGINS) : "";
                var enterpriseUid = loginsData.enterpriseUid;
                return $http({
                    method: "POST",
                    url: "awstack-user/v1/enterprises/" + enterpriseUid + "/chkusername",
                    data:data
                });
            },
            signup:function(data){
                return $http({
                    method: "POST",
                    url: "awstack-user/v1/enterprises/signup",
                    data: data
                });
            },
            checkLoginName:function(data){
                return $http({
                    method: "POST",
                    url: "awstack-user/v1/enterprises/chkenterprisesname",
                    data: data
                });
            }
        };
    }])
    .directive("gtip", function () {
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
    })
    .directive("gtipnum", function () {
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
                    return startValue
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
    })
    .directive("maskCorrect", function () {
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
    })
    .directive("inIpRange", function () {
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
    })
    .directive("incidr", [function () {
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
    }])
    .directive("formValidate", ["$translate", function (translate) {
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
    }])
        .directive("vlan", [function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                $ngModel.$parsers.push(function(value){
                    scope.$watch(function(){
                        var min=$("input[name='tenantStart']").val();
                        var max=$("input[name='tenantEnd']").val();
                        return min+","+max;
                    },function(val){
                        var mins = Number(val.split(",")[0]);
                        var maxs = Number(val.split(",")[1]);
                        if(maxs && mins){
                            if(maxs>mins){
                                if(maxs-mins>4000){
                                    scope.vxlanTips = true;
                                }else{
                                    scope.vxlanTips = false;         
                                }
                                $ngModel.$setValidity("vlan", true);
                            }else{
                                scope.vxlanTips = false;
                                $ngModel.$setValidity("vlan", false);
                            }
                        }
                    });
                    return value;
                });
            }
        };
    }])
    .directive("logicalvlanlimit", function() {
        return {
            restrict:"A",
            require:"ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                var reg = /^[1-9]\d*$/;
                $ngModel.$parsers.push(function(viewValue){
                    var num = Number(viewValue);
                    if(reg.test(num)){
                        if(num>=2&&num<=4095){
                            $ngModel.$setValidity("logicalvlanlimit", true);
                        }else{
                            $ngModel.$setValidity("logicalvlanlimit", false);
                        }
                    }else{
                        if(num==0){
                            $ngModel.$setValidity("logicalvlanlimit", true);
                        }else{
                            $ngModel.$setValidity("logicalvlanlimit", false);    
                        }
                    }
                    return viewValue;
                })
            }
        };
    })
    .directive("vlanlimitstart", function() {
        return {
            restrict:"A",
            require:"ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                var reg = /^[1-9]\d*$/;
                $ngModel.$parsers.push(function(viewValue){
                    var num = Number(viewValue);
                    if(reg.test(num)){
                        if(num>=2&&num<=4095){
                            $ngModel.$setValidity("vlanlimitstart", true);
                            scope.valnstartFlag=true;
                        }else{
                            $ngModel.$setValidity("vlanlimitstart", false);
                            scope.valnstartFlag=false;
                        }
                    }else{
                        $ngModel.$setValidity("vlanlimitstart", false);
                        scope.valnstartFlag=false;
                    }
                    return viewValue;
                })
            }
        };
    })
    .directive("vlanlimitend", function() {
        return {
            restrict:"A",
            require:"ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                var reg = /^[1-9]\d*$/;
                $ngModel.$parsers.push(function(viewValue){
                    var num = Number(viewValue);
                    if(reg.test(num)){
                        if(num>=2&&num<=4095){
                            $ngModel.$setValidity("vlanlimitend", true);
                            scope.valnendFlag=true;
                        }else{
                            $ngModel.$setValidity("vlanlimitend", false);
                            scope.valnendFlag=false;
                        }
                    }else{
                        $ngModel.$setValidity("vlanlimitend", false);
                        scope.valnendFlag=false;
                        scope.valnstartFlag=false;
                    }
                    return viewValue;
                })
            }
        };
    })
    .directive("vxlanlimitstart", function() {
        return {
            restrict:"A",
            require:"ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                var reg = /^[1-9]\d*$/;
                $ngModel.$parsers.push(function(viewValue){
                    var num = Number(viewValue);
                    if(reg.test(num)){
                        if(num>=1&&num<=16777215){
                            $ngModel.$setValidity("vxlanlimitstart", true);
                            scope.valnstartFlag=true;
                        }else{
                            $ngModel.$setValidity("vxlanlimitstart", false);
                            scope.valnstartFlag=false;
                        }
                    }else{
                        $ngModel.$setValidity("vxlanlimitstart", false);
                        scope.valnstartFlag=false;
                    }
                    return viewValue;
                })
            }
        };
    })
    .directive("vxlanlimitend", function() {
        return {
            restrict:"A",
            require:"ngModel",
            link: function(scope, elem, attrs, $ngModel) {
                var reg = /^[1-9]\d*$/;
                $ngModel.$parsers.push(function(viewValue){
                    var num = Number(viewValue);
                    if(reg.test(num)){
                       if(num>=1&&num<=16777215){
                            $ngModel.$setValidity("vxlanlimitend", true);
                            scope.valnendFlag=true;
                        }else{
                            $ngModel.$setValidity("vxlanlimitend", false);
                            scope.valnendFlag=false;
                        }
                    }else{
                        $ngModel.$setValidity("vxlanlimitend", false);
                        scope.valnendFlag=false;
                        scope.valnstartFlag=false;
                    }
                    return viewValue;
                })
            }
        };
    })
    .directive("autoHeight",["$timeout",function($timeout){
        return {
            restrict:"A",
            link:function(scope,elem,attr,ngmodal){
                var timer;
                scope.$watch(function(){
                    return $("body").outerHeight();
                },function(bodyHeight){
                    $timeout.cancel(timer);
                    timer = $timeout(function(){
                        if(bodyHeight > $(window).height()){
                            $(elem).addClass('auto-height');
                        }else{
                            $(elem).removeClass('auto-height');
                        }
                    },5);
                }); 

                $(window).resize(function() {
                    if($('body').outerHeight() > $(window).height()){
                        $(elem).addClass('auto-height');
                    }else{
                        $(elem).removeClass('auto-height');
                    }
                });
            }
        }
    }])

