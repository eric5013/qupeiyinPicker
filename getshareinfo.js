// getshareinfo.js
const tableHead = ["用户ID", "昵称", "作品名称", "上传日期", "播放次数", "点赞数", "采集时间", "视频链接", "源网址"];


//调试输出
var isDebug = true;

function showConsole(str) {
    if (isDebug == true) {
        console.info(str)
    }
}

//0419 搜索记录缓存
var searchResult = []

function saveResult(a, b, e, f, g, h, p, j, k) {

    if (a.length == 1) {
        a = a[0]
    } else {
        var aResult = "";
        for (i = 0; i < a.length; i++) {
            a[i].trim();
            a[i] = a[i].replace("id：", "");
            if (i == 0) {
                aResult += a[i];
            } else {
                aResult += "/" + a[i];
            }
        }
        a = aResult;
        b = "";
    }

    /**
     * @return {string}
     */
    function Stringfy(tmp) {
        var result = tmp + "";
        result.trim();
        return result;
    }

    e = Stringfy(e).trim();
    f = Stringfy(f).trim();
    g = Stringfy(g).trim();
    h = Stringfy(h).trim();
    // i = Stringfy(i).trim();
    j = Stringfy(j).trim();
    k = Stringfy(k).trim();

    var result = {
        "id": a,
        "nickname": b,
        "zpname": e,
        "uploadTime": f,
        "playTime": g,
        "favnum": h,
        "timestamp": p,
        "videoLink": j,
        "url": k
    };
    console.log(result)
    searchResult.push(result)
    var indexOfResult = searchResult.length
    return indexOfResult
}

function getDateTimeNow() {
    var myDate = new Date();
    var timestamp =
        myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString();
    return timestamp
}


function getshareinfo(url) {
    // on debug
    // url = "https://moive2.qupeiyin.com/home/show/share/sharefrom/other/id/MDAwMDAwMDAwMLCtpmSBi67er6eArg"


    // 清空查询对象
    $(".share-container")[0].innerHTML = "";

    //设置同步
    $.ajaxSettings.async = false;
    var noHTML = false;
    // 请求数据
    $.get({
        url: url,
        error: function (event) {
            alert("请求遇到错误！ERROR " + event.status);
            $(".single-search").addClass("no-display");
        },
        success: function (data) {
            if (data.match("当前视频不存在或已删除！") !== null) {
                saveResult("数据被删除", "", "", "", "", "", getDateTimeNow(), "", url)
                addToList("!", "N/A", "数据被删除", "N/A", url);
                createStatus("url: <a href='" + url + "'> " + url + "</a>数据被删除")
                $(".single-search").addClass("no-display");
                noHTML = true;
            } else {
                $(".share-container")[0].innerHTML = data;
            }

        }
    });

    //判断是否载入HTML
    if (noHTML == false) {


        // 去除样式&脚本
        $(".share-container link").remove();
        $(".share-container script").remove();

        // 读取数据

        if ($(".ch-one-info").length == 0) {
            var nickname = $(
                "body > div.share-container > div > div.header > div.user-info > div.username > span.username-text"
            )[0].innerText;
            var userid = $(
                "body > div.share-container > div > div.header > div.user-info > div.username > span.user_number"
            )[0].innerText;
            var regDay = $(
                "body > div.share-container > div > div.header > div.user-info > div.user-des > span:nth-child(1)"
            )[0].innerText;
            var zptotal = $(
                "body > div.share-container > div > div.header > div.user-info > div.user-des > span:nth-child(2)"
            )[0].innerText;

            var idResult = [userid]

        } else {
            //多人数据
            //导出变量初始化

            var authorList = $(".ch-one-of");
            var multAuthorExp = "";
            multAuthorExp += "<div class='box-inline'> <div class='const'>搭档人数：</div> <div class='getdata'>" +
                authorList.length +
                "人</div> </div> <hr>";

            var idResult = []
            for (var i = 0; i < authorList.length; i++) {

                if ($(".ch-id-p")[i] !== undefined) {
                    var a = $(".ch-id-p")[i].innerText;
                } else {
                    a = "无数据"
                }

                if ($(".ch-one-info").children("p")[i] !== undefined) {
                    var b = $(".ch-one-info").children("p")[i].innerText
                } else {
                    b = "无数据"
                }

                multAuthorExp +=
                    "<div class='box-inline'> <div class='const'>作者" +
                    i +
                    " ID：" +
                    "</div> <div class='getdata'>" +
                    a +
                    "</div> </div> <hr> <div class='box-inline'> <div class='const'>作者" +
                    i +
                    " 昵称：" +
                    "</div> <div class='getdata'>" +
                    b +
                    "</div> </div> <hr>";

                //导出id为数组
                idResult.push(a)
            }

        }

        var zpname = $(
            ".video-title"
        )[0].innerText;
        var uploadTime = $(
            ".video-play-count"
        )[0].innerText;
        var playTime = $(
            ".video-play-count"
        )[0].innerText;
        // var recent = $("")[0].innerText
        var recent;
        var favnum = $("#add-supports")[0].innerText;

        var timestamp = getDateTimeNow()
        var videoLink = $("#video-play").attr("src");

        // 数据处理
        if ($(".ch-one-info").length == 0) {
            userid = userid.replace("ID:", "");
        } else {
            multAuthorExp = multAuthorExp.replace(/id：/g, "")
        }

        uploadTime = uploadTime.replace("上传：", "");
        uploadTime = uploadTime.replace(/播放量：[0-9]{1,8}/, "");
        playTime = playTime.replace(/上传.{1,100}播放量：/, "");

        //    赋值
        if ($(".ch-one-info").length == 0) {
            $(".author-info")[0].innerHTML = " <div class='box-inline'> <div class='const'>用户ID：</div> <div class='getdata user-id'></div> </div> <hr> <div class='box-inline'> <div class='const'>昵称：</div> <div class='getdata nickname'></div> </div> <hr> <div class='box-inline'> <div class='const'>注册天数：</div> <div class='getdata regday'></div> </div> <hr> <div class='box-inline'> <div class='const'>作品数量：</div> <div class='getdata zptotal'></div> </div>";
            $(".user-id").text(userid);
            $(".nickname").text(nickname);
            $(".regday").text(regDay);
            $(".zptotal").text(zptotal);
        } else {
            $(".author-info")[0].innerHTML = multAuthorExp;
        }

        $(".zpname").text(zpname);
        $(".uploadtime").text(uploadTime);
        $(".playtime").text(playTime);
        $(".recent").text(recent);
        $(".favnum").text(favnum);
        $(".timestamp").text(timestamp);
        $(".video-link").attr("href", videoLink);

        $(".share-container")[0].innerHTML = "";

        //数据导出
        for (i = 0; i < idResult.length; i++) {
            idResult[i] = idResult[i].replace("ID:", "");
            idResult[i] = idResult[i].replace("id:", "");
        }


        var indexOfResult = saveResult(idResult, nickname, zpname, uploadTime, playTime, favnum, timestamp, videoLink, url);
        indexOfResult = indexOfResult - 1;
        addToList(indexOfResult, searchResult[indexOfResult].id, searchResult[indexOfResult].zpname, searchResult[indexOfResult].favnum, searchResult[indexOfResult].url)

    }

}

function toCSV(array) {
    var result = ""
    var lastIndex = array.length - 1;
    for (i = 0; i < array.length; i++) {
        if (i != lastIndex) {
            result = result + array[i] + ",";
        } else {
            result = result + array[i] + "\n";
        }
    }
    return result
}

// downFile
function downFile(content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

function exportDataToCSV() {
    var exportData = "";

    //tableHead = ["用户ID", "昵称", "作品名称", "上传日期", "播放次数", "点赞数", "采集时间", "视频链接", "源网址"];
    exportData += toCSV(tableHead);

//    操作JSON对象
    $.each(searchResult, function () {
        exportData += toCSV([this.id, this.nickname, this.zpname, this.uploadTime, this.playTime, this.favnum, this.timestamp, this.videoLink, this.url])
    });
    if (confirm("是否导出版权信息？")) {
        var timeStr = "导出于： " + getDateTimeNow();
        var copyright = "以上数据由北航飞行学院文艺中心技术组统计，保留一切权利。";
        exportData += "\n" + "\n" + timeStr + "\n";
        exportData += copyright + "\n";
    } else {
        var timeStr = "导出于： " + getDateTimeNow();
        var copyright = "";
        exportData += "\n" + "\n" + timeStr + "\n";
        exportData += copyright + "\n";
    }
    var d = new Date();
    var month = d.getMonth() + 1;
    var filename = "配音赛统计数据导出" + "2020" + month + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + ".csv";
    downFile(exportData, filename);
}


function exportDataToJSON() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var filename = "配音赛统计数据导出" + "2020" + month + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + ".json";

    var blob = new Blob([JSON.stringify(searchResult)], {type: ""});
    saveAs(blob, filename);

}


function addToList(index, userid, zpname, favnum, url) {
    if ($("tbody")[0].innerHTML.indexOf(zpname) == -1) {
        var str = "<tr data-link='" + url + "'><th scope='row'>" + index + "</th><td>" + userid + "</td><td>" + zpname + "</td><td>" + favnum + "</td></tr>";
        $("tbody").append(str)
    }
    $("td").click(function () {
        var label = $(this).parent("tr");
        $(".search-input").val(label.attr("data-link"));
        $("#button-search").click();
    });
}


function search(link) {
    var searchText = link
    if (searchText.search("qupeiyin.com") !== -1) {
        $(".single-search").removeClass("no-display");
        $(".table-container").removeClass("no-display");
        getshareinfo(searchText);
    } else {
        alert("链接格式不符合规范！请重试");
    }
}

//注册事件
$("#button-search").click(function (event) {
    var searchText = $(".search-input").val();
    search(searchText);
});

//批量录入
$("#multi-search").click(function () {
    console.log("批量录入开始");
    var multUrlArr = [];
    var multUrlIndex = 0;
    var continueLoop = true;
    while (continueLoop) {
        var thisURL = prompt("请粘贴趣配音链接，回车键输入下一个\n 已输入 " + multUrlIndex + " 个链接", "输入结束直接按回车结束搜索");
        if (thisURL === "输入结束直接按回车结束搜索") {
            alert("搜索结束")
            continueLoop = false
        } else {
            multUrlArr.push(thisURL);
            console.info("第 " + multUrlIndex + " 个URL:" + thisURL);
            multUrlIndex = multUrlIndex + 1;
        }
    }
    if (multUrlArr.length === 0) {
        alert("未输入数据！")
    } else {
        for (var multLoop = 0; multLoop < multUrlArr.length; multLoop++) {
            search(multUrlArr[multLoop]);
        }
        createStatus("已导入" + searchResult.length + "条记录")
    }
})
$("#export-json").click(function (event) {
    exportDataToJSON()
});

$("#export-csv").click(function (event) {
    exportDataToCSV()
});


function autoSearch() {
    var query = window.location.search.substring(1);
    if (query != "") {
        if (query.match("url")) {
            var searchUrl = query.replace("url=", "");
            search(searchUrl);
            var zpname = $(".zpname")[0].innerText;
            $(".doc-title")[0].innerText = zpname + " 点赞统计";
            document.title = zpname + " - 飞行学院配音大赛数据统计系统"
        }
    } else {
        $(".search-container").removeClass("never-display")
        $(".search-container").removeClass("never-display")
        $(".table-container").removeClass("never-display");
        $(".input-group").removeClass("never-display");
        console.log("show!")
    }

}

function createStatus(status) {
    var ele = document.createElement("p");
    ele.setAttribute("class", "status-text");
    ele.innerHTML = status;
    $(".status").append(ele);
}

var urlDict
var inputElement = document.getElementById("inputGroupFile04");
inputElement.addEventListener("change", handleFiles, false);


function handleFiles() {
    var selectedFile = document.getElementById("inputGroupFile04").files[0];//获取读取的File对象
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    console.log("文件名:" + name + "大小：" + size);
    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容

    reader.onload = function () {
        console.log(this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
        urlDict = JSON.parse(this.result)
        createStatus("读取成功！共读取" + urlDict.length + "条信息")
        $(".table-container").removeClass("no-display")
        for (var searchItem = 0; searchItem < urlDict.length; searchItem++) {
            if (urlDict[searchItem].id == "数据被删除") {
                saveResult("数据被删除", "", "", "", "", "", getDateTimeNow(), "", urlDict[searchItem].url)
                addToList("!", "N/A", "数据被删除", "N/A", urlDict[searchItem].url);
            } else {
                search(urlDict[searchItem].url)
            }
        }
        createStatus("于" + getDateTimeNow() + "完成" + name + "的数据更新，\n请点击保存至JSON/CSV完成数据导出")

    };
}

//监听事件：注册列表事件
// var mytable = document.getElementById("my-table-body");
// mytable.addEventListener("change", setHref, false);
// function setHref() {
//     $("td").click(function () {
//         var label = $(this).parent("tr");
//         $(".search-input").val(label.attr("data-link"));
//         $("#button-search").click();
//     });
// }

window.onload = function () {
    autoSearch()
}

