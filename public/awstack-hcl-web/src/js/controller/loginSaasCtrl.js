loginSaasCtrl.$inject=["$scope", "$http", "$location","$timeout","$uibModal","NgTableParams"];
export function loginSaasCtrl($scope, $http, $location,$timeout, $uibModal,NgTableParams){
    var self = $scope;
    self.submitted = false;
    self.login={
    	username:'',
    	password:''
    }
    self.userNameErrorMsg = "只能输入字母、汉字、数字、横线";
    self.passwordErrorMsg = "密码长度为8-16个字符且至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符。特殊字符包括! - @ . ^ _ % , : /";

	self.interacted = function (field) {
        if (field) {
            return self.submitted || field.$dirty;
        }
    }

    self.changeStep = function(path){
    	$location.path(path).replace();
    }
    self.passwordType = true;
    self.changeType = function(){
        self.passwordType = !self.passwordType;
    }
    self.change = function(){
        self.loginTips = false;
    }

    self.loginSaas = function(m,v){
    	if(m.$valid){
			//var params = 'request=' + JSON.stringify({"username":"admin","password":"Awcloud!23"});
	    	var params = 'request=' + JSON.stringify({"username":v.username,"password":v.password});
		    $.ajax({
		        type: "POST",
		        url: "/login ",
		        data: params,
		        dataType: 'json',
		        success: function success(data) {
                    self.loginTips = false;
		            if(data==true){
		            	$location.path('/netConfig').replace();
		            }else{
                       self.loginTips = true; 
                    }
		            self.$apply();
		        },
		        error: function error(data) {
		            console.log(data, "登录失败信息");
		        }
		    });	
    	}else{
    		self.submitted = true;
    	}
    	
    }
}