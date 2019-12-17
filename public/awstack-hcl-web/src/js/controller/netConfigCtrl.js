netConfigCtrl.$inject=["$scope", "$http", "$location","$timeout","$uibModal","NgTableParams"];
export function netConfigCtrl($scope, $http, $location,$timeout, $uibModal,NgTableParams){
    var self = $scope;
	self.changeStep = function(path){
		$location.path(path).replace();
	}

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
    function sortNumber(a,b){
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
    function getNetConfig(){
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
                self.data.floating_vlan_switch = data.mgmt['node-1'].vlan!=0?true:false;
                self.data.mgmt_vlan = data.mgmt['node-1'].vlan==0?"":data.mgmt['node-1'].vlan;

                self.data.floating_gateway = data.public.gateway;
                self.data.floating_netmask = data.public.netmask;
                self.data.floating_cidr = data.public.cidr;
                self.data.floating_start = data.public.ip_start;
                self.data.floating_end = data.public.ip_end;
                self.data.floating_vlan =  data.public.vlan;
                self.data.floating_vlan_switch = data.public.vlan!=''?true:false;

                self.data.vlan_range_end = data.tenant.vlan_range.split('-')[1];
                self.data.vlan_range_start = data.tenant.vlan_range.split('-')[0];
                self.data.ha_vlan = data.tenant.ha_vlan?data.tenant.ha_vlan:"";
                self.data.network_type = data.tenant.network_type;

                for(var i in data.mgmt){
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
    self.close = function(){
        self.showAlert = false;
    }
    self.toSass = function(){
        $.ajax({
            type: "GET",
            url: "/shutdown_nodes",
            success: function success(data) {
                self.modifyResult='shutdown';
                self.$apply();
            }, 
            error: function error(data) {
                console.log(data, "关机失败");
                self.modifyResult='shutdownerror';
                self.$apply();
            }
        });
        //window.open("http://"+self.data.saas_addr,"_self")
    }


    function to8Bit(number){
        var result = parseInt(number).toString(2);
        while(result.length < 8){
            result = "0" + result;
        }
        return result;
    }
    //校验IP地址，子网掩码和默认网关的关系是否正确。w是默认网关，y是子网掩码，i是IP地址。
    function checkIp(w,y,i){
        var ws = w.split('.');
        var ys = y.split('.');
        var is = i.split('.');
        for(var index in ws){
            var cw = to8Bit(ws[index]);
            var cy = to8Bit(ys[index]);
            var ci = to8Bit(is[index]);
            for(var jndex = 0;jndex < 8;jndex++){
                if(cy[jndex]=="1"){
                    if(cw[jndex] != ci[jndex]) return false;
                }
            }
        }
        return true;
    }

    self.confirm = function (ipForm) {
        if (ipForm.$valid) {
            //检测管理网ip地址
            //1.云管地址要在管理网范围内
            self.sassIpTips = !checkIp(self.data.mgmt_gateway,self.data.mgmt_netmask,self.data.saas_addr);

            for(var i=0;i<self.nodelist.length;i++){
                self.nodeIpTips = false;
                if(checkIp(self.data.mgmt_gateway,self.data.mgmt_netmask,self.nodelist[i].ipaddr)==false){
                    self.nodeIpTips = true;
                    break;
                }
            }
            for(var i=0;i<self.nodelist.length;i++){
                self.saasNodeIpTips = false;
                if(self.nodelist[i].ipaddr==self.data.saas_addr){
                    self.saasNodeIpTips = true;
                    break;
                }
            }
            //检测vlan是否冲突、
            if(self.data.network_type=='vlan'){
                if(self.data.ha_vlan !=""){
                    if(Number(self.data.ha_vlan)<=Number(self.data.vlan_range_end)&&
                        Number(self.data.ha_vlan)>=Number(self.data.vlan_range_start)
                        ){
                        self.haVlanTips = true;
                    }else{
                        self.haVlanTips = false;
                    }
                }else{
                    self.haVlanTips = false;
                }

                if(self.data.floating_vlan_switch){
                    if(Number(self.data.floating_vlan)<=Number(self.data.vlan_range_end)&&
                        Number(self.data.floating_vlan)>=Number(self.data.vlan_range_start)
                        ){
                        self.floatVlanTips = true;
                    }else{
                        self.floatVlanTips = false;
                    }
                }else{
                    self.floatVlanTips = false;
                }

                if(self.data.floating_vlan_switch){
                    if(Number(self.data.mgmt_vlan)<=Number(self.data.vlan_range_end)&&
                        Number(self.data.mgmt_vlan)>=Number(self.data.vlan_range_start)
                        ){
                        self.mgmtVlanTips = true;
                    }else{
                        self.mgmtVlanTips = false;
                    }
                }else{
                    self.mgmtVlanTips = false;
                }
            }

            if(self.mgmtVlanTips||self.floatVlanTips||self.haVlanTips||self.sassIpTips||self.nodeIpTips||self.saasNodeIpTips){
                $timeout(()=>{
                   self.mgmtVlanTips = false; 
                   self.floatVlanTips = false; 
                   self.haVlanTips = false; 
                   self.sassIpTips = false; 
                   self.nodeIpTips = false; 
                   self.saasNodeIpTips = false; 
                },3000)
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
                ntp_server.push(self.data.ntp)
                var params = {
				    "mgmt_gateway":self.data.mgmt_gateway,
				    "mgmt_netmask":self.data.mgmt_netmask,
				    "mgmt_dns":self.data.mgmt_dns,
				    "saas_addr":self.data.saas_addr,
				    "floating_gateway":self.data.floating_gateway,
				    "floating_netmask":self.data.floating_netmask,
				    "floating_cidr":self.data.floating_cidr,
				    "floating_start":self.data.floating_start,
				    "floating_end":self.data.floating_end,
				    "floating_vlan":self.data.floating_vlan_switch?self.data.floating_vlan:"",
				    "mgmt":[],
				    "ntp_server":ntp_server,
				    "tenant":{
				        "vlan_range":self.data.vlan_range_start+"-"+self.data.vlan_range_end,
				        "ha_vlan":self.data.ha_vlan!=''?self.data.ha_vlan:"",
				        "network_type":self.data.network_type,
                        "vlan_start":self.data.vlan_range_start,
                        "vlan_end":self.data.vlan_range_end
				    }
				}
                self.nodelist.forEach(function (node) {
                    params.mgmt.push({ hostname: node.hostname, ipaddr: node.ipaddr,vlan_id:self.data.floating_vlan_switch?self.data.mgmt_vlan:0});
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