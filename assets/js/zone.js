// JavaScript Document
var dat = [];
var user = "";
var intag = false; //invalid tag
var tagname = "";
var userinfo = {};
var currentpage = 1;
var _ori = {};
var _pin = {};

function findtag(dataarr, taag) {
	var back = [];
	if (dataarr != [] && dataarr != undefined) {
		for (var i = 0; i < dataarr.length; i++) {
			if ((dataarr[i].tags).includes(taag)) {
				back.push(dataarr[i]);
			}
			if (back.length != 0) {
				intag = true;
			}
			else {
				intag = false;
			}
		}
		return back;
	}
	else {
		intag = true;
		return [];
	}
}

window.onload = function () {
	if (!window.localStorage) { }
	else {
		const zone = new AV.Query('Zone');
		const user = new AV.Query('_User');
		if (window.location.search == "") {
			//
		} else {
			var UsefulRequest = ((window.location.search + "?").split("?")[1] + "&user=BroXun").match(/user=[^>]+/)[0].split("&")[0];
			console.log(UsefulRequest);
			if (UsefulRequest != "") {
				if (Date.now() - Number(localStorage.getItem(UsefulRequest + "_update")) >= 90 * 1000) {
					var request = UsefulRequest.split("=")[1];
					user.equalTo('username', request);
					user.find().then((userinfor) => {
						if (userinfor.length != 0) {
							userinfo = userinfor[0].attributes;
							zone.equalTo('author', request);
							zone.limit(1000);
							// 按 createdAt 降序排列
							zone.descending('createdAt');
							zone.find().then((det) => {
								for (var i = 0; i < det.length; i++) {
									var object = det[i].attributes;
									//var id=det[i].id
									var obj = { author: object["author"], content: object["content"], copyright: object["copyright"], edit_time: object["edit_time"], forward: object["forward"], tags: object["tags"], timestamp: object["timestamp"], title: object["title"], views: object["views"], id: det[i].id ,pinned: object["pinned"]}
									dat.push(obj);
								}
								//console.log(det);
								console.log(dat);
								localStorage.setItem(UsefulRequest + "_zd", JSON.stringify(dat));
								localStorage.setItem(UsefulRequest + "_update", Date.now());
								localStorage.setItem(UsefulRequest + "_info", JSON.stringify(userinfo));
								p1alert("成功获取用户信息！");
								document.getElementById("username").innerHTML = userinfo.username;
								document.getElementById("avatar").innerHTML = "<img src='" + userinfo.avartar + "' class=\"rounded mx-auto d-block img-thumbnail\" alt=\"UserAvatar\" style=\"width: 240px; height: 240px;\"></img>";
								page();
							});
						}
						else {
							p1alert("用户不存在，换一个用户名试试吧~");
						}
					})
				}
				else {
					var request = UsefulRequest.split("=")[1];
					userinfo = JSON.parse(localStorage.getItem(UsefulRequest + "_info"));
					dat = JSON.parse(localStorage.getItem(UsefulRequest + "_zd"));
					//console.log("s2");
					p1alert("成功从本地获取用户信息！");
					document.getElementById("username").innerHTML = userinfo.username;
					document.getElementById("avatar").innerHTML = "<img src='" + userinfo.avartar + "' class=\"rounded mx-auto d-block img-thumbnail\" alt=\"UserAvatar\" style=\"width: 240px; height: 240px;\"></img>";
					page();
				}
				//console.log("ss1");
			} else {
				p1alert("错误的格式或无效输入哦~");
			}
		}

	}
}

function newpage(path,id) {//
	//const clickscount = AV.Object.createWithoutData('Zone', dat[list_number].id);
	//clickscount.increment('views', 1);
	//clickscount.save();
	if(!!localStorage){
		dat = JSON.parse(localStorage.getItem(path));
	}
	var data = findid(dat,id);
	if(!!localStorage){
		localStorage.setItem("data",JSON.stringify(data));
	}
	window.open("zdt.html");
	window.data = data;
	window.id = data.id;
}

function getLocalTime(mS) {
	return new Date(parseInt(mS)).toLocaleString('chinese', { hour12: false }).replace(/:\d{1,2}$/, ' ').replace(/24:/, "00:");
}

function sepinned() { //separate pinned items from oridinary items
	var pinned = [];
	var ori = [];
	var times = dat.length;
	for(var i=0;i<times;i++){
		if(dat[i].pinned == true){
			pinned.push(dat[i]);
		}
		else{
			ori.push(dat[i]);
		}
	}
	_ori = ori;
	_pin = pinned;
}

function p1alert(_con) { //put an alert on alertplace1
	var target = document.getElementById("alertplace1");
	target.innerHTML += "<div class=\"alert alert-danger alert-dismissable hide\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button><strong>" + _con + "</strong></div>";
}

function page() {  //page controller - will added later()
	var TagsRequest = ((window.location.search + "?").split("?")[1] + "&tag=none").match(/tag=[^>]+/)[0].split("&")[0];
	if (TagsRequest != "" && TagsRequest != null && TagsRequest != "tag=none") {
		var tagrequest = decodeURI(TagsRequest.split("=")[1]);
		dat = findtag(dat, tagrequest);
		tagname = tagrequest;
	}

	if (intag) {
		document.getElementsByClassName("infobar")[0].innerHTML = "点击退出 | 搜寻标签 " + tagname;
		//document.title += " | fetch tag " + tagname;
		document.getElementsByClassName("infobar")[0].style.display = "block";
		document.getElementsByClassName("infobar")[0].href = "//" + window.location.host + window.location.pathname + "?user=" + userinfo.username;
	}
	else {
		document.getElementsByClassName("infobar")[0].style.display = "none";
	}
	sepinned();
	document.getElementById("pincon").innerHTML = "";
	document.getElementById("con").innerHTML = "";
	console.log("cleared");
	if(_pin.length==0){
		//
	}
	else{
		for(var i=0;i<_pin.length;i++){
			document.getElementById("pincon").innerHTML += make(_pin[i]);
		}
	}
	for (var i = 0; i < _ori.length; i++) {
		document.getElementById("con").innerHTML += make(_ori[i]);
	}
	console.log("pushed");
}

function make(_in){
	var a = _in.title;
	var b = _in.content;
	if (b.length < 36) {
		b = b.replace(/<[^>]+>/g, " ");
	}
	else {
		b = b.replace(/<[^>]+>/g, " ").substring(0, 35) + "...";
	}
	var c = "";
	c = "'user=" + userinfo.username + "_zd','" + _in.id + "'";
	var d = getLocalTime(_in.timestamp);
	return "<div class=\"card col-lg-4 col-md-6 col-sm-12 text-center\" style=\"width: 18rem;margin:auto;border-width: 0px;\"><div class=\"card-body\"><h5 class=\"card-title\">" + a +"</h5><p class=\"card-text\">" + b + "</p><a href=\"javascript:newpage(" + c + ")\" class=\"btn btn-primary\">" + d + "</a></div></div>";
}

function findid(_src,_id){
	if (typeof(_src)=="object"){
		for(var i=0;i<_src.length;i++){
			if(_src[i].id==_id){
				return _src[i];
			}
		}
	}
}