if (window.opener != null) {
    document.ObjId = window.opener.id;
}
else {
    document.ObjId = JSON.parse(localStorage.getItem("data")).id;
}

function getLocalTime(mS) {
    return new Date(parseInt(mS)).toLocaleString('chinese', { hour12: false }).replace(/:\d{1,2}$/, ' ').replace(/24:/, "00:");
}

window.onload = function () {
    var ls = !window.localStorage;
    if (ls) {
        var data = window.opener.data;
    }
    else {
        if (window.opener == null) {
            var data = JSON.parse(localStorage.getItem("data"));
        }
        else {
            var data = window.opener.data;
        }
        if (ls == false) {
            localStorage.setItem("data", JSON.stringify(data));
        }
        document.ObjId = data.id;
        document.title = data.author + " | " + data.title;
        //document.getElementById("detailedinfo").innerHTML = "作者: " + data.author.replace("Hydi", "BroXun") + " " + "标签: " + String(data.tags).replace(/,/g, " | ") + " " + "时间: " + Math.floor((data.edit_time) / 6000) / 10 + "分钟" + " " + "日期: " + getLocalTime(data.timestamp) + " " + data.views + "阅读（重复统计）";
        document.getElementById("title").innerHTML = data.title;

        var taag = "";
        for (var i = 0; i < data.tags.length; i++) {
            taag += "<a class='tags' href='//" + window.location.host + "/zone.html?user=" + data.author + "&tag=" + encodeURI(data.tags[i]) + "' target='_blank'>" + data.tags[i] + "</a>";
        }

        document.getElementById("content").innerHTML = data.content;
        document.getElementById("detailedinfo").innerHTML = document.getElementById("detailedinfo").innerHTML.replace("author", data.author.replace("Hydi", "BroXun")).replace("tagss", taag).replace("edittime", Math.floor((data.edit_time) / 6000) / 10 + "分钟").replace("releasedate", getLocalTime(data.timestamp)).replace("view", data.views).replace("words", document.getElementById("content").innerText.length);
        console.log("script successfully run");
        document.getElementsByClassName("detailed-info")[1].innerHTML = document.getElementsByClassName("detailed-info")[1].innerHTML.replace("shareurl", "share this page at " + window.location.host + "/fetch?id=" + document.ObjId + "&&&");
        if (data.copyright == true) {
            document.getElementsByClassName("detailed-info")[0].innerHTML = document.getElementsByClassName("detailed-info")[0].innerHTML.replace("copyrighted", "本文著作权归作者所有，未经许可禁止用于商业用途");
            document.getElementsByClassName("fa-ban")[0].style.color = "red";
        }
        else {
            document.getElementsByClassName("detailed-info")[0].innerHTML = document.getElementsByClassName("detailed-info")[0].innerHTML.replace("copyrighted", "本文无著作权相关限制");
            document.getElementsByClassName("fa-ban")[0].style.color = "black";
        }
    }
}
