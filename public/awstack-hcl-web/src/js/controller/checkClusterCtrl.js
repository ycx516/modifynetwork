checkClusterCtrl.$inject=["$scope", "$http", "$location","$timeout","$uibModal","NgTableParams"];
export function checkClusterCtrl($scope, $http, $location,$timeout, $uibModal,NgTableParams){
    var self = $scope;
    self.nextBtn = false;
    self.nextStep = function(){
    	if(self.checkResult == 'success'){
    		self.showAlert = true;
    	}else{
    		self.showAlert = false;
    		$location.path('/loginSaas').replace();
    	}
    } 

    self.toNext = function(){
    	$location.path('/loginSaas').replace();
    }

    self.close = function(){
        self.showAlert = false;
    }

    self.mysql = 'init';
    self.checkClusterStart = function(){
    	self.checkResult = 'init';
    	self.mysql = 'init';
    	self.checkResultTips = false;
    	$.ajax({
		    type: "GET",
		    url: "/network_check",
		    success: function success(data) {
		    	if(data){
			        self.checkedData = data;
			        self.checkResult = 'success';
			        for(var node in self.checkedData){
			        	if(self.checkedData[node].local){
			        		self.sourceNode = node;
			        		break;
			        	}
			        }

			        for(var i in self.checkedData){
			        	if(
			        		!self.checkedData[i].cluster.ping_success||
			        		!self.checkedData[i].mgmt.ping_success||
			        		!self.checkedData[i].storage.ping_success||
			        		!self.checkedData[i].tenant.ping_success
		        		){
			        		self.checkResult = 'fail';
			        		break;
			        	}
			        }
			        //集群网
			        self.checkClusterResult = true;
			        for(var j in self.checkedData){
			        	if(!self.checkedData[j].cluster.ping_success){
			        		self.checkClusterResult = false;
			        		break;
			        	}
			        }
   					self.checkResultTips = false;
	   				$.ajax({
					    type: "GET",
					    url: "/health_check",
					    success: function success(data) {
					    	if(data){
					    		if(data.mysql_conn==false){
					    			self.checkResult = 'fail';
					    		}

					    		if(data.consul.unready&&data.consul.unready.length>0){
					    			self.checkResult = 'fail';
					    			self.consul_conn = false;
					    		}else{
					    			self.consul_conn = true;
					    		}

					    		if(data.nomad.unready&&data.nomad.unready.length>0){
					    			self.checkResult = 'fail';
					    			self.nomad_conn = false;
					    		}else{
					    			self.nomad_conn = true;
					    		}

					    		self.mysql = data.mysql_conn;

					    		if(self.checkClusterResult){
					    			self.nextBtn = true;
					    		}else{
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
					})
					self.$apply();
				}
		    },
		    error: function error(data) {
		    	self.checkResultTips = true;
		    	self.$apply();
		        console.log('检测集群网联调失败');
		    }
		}); 
    }
}