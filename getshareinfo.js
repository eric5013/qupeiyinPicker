// getshareinfo.js
$("#button-search").click(function(event) {
  var searchText = $(".search-input").val();

  if (searchText.search("qupeiyin.com") != -1) {
    $(".single-search").removeClass("no-display");
    getshareinfo(searchText);
  } else {
    alert("链接格式不符合规范！请重试");
  }
});

function getshareinfo(url) {
  // on debug
  // url = "https://moive2.qupeiyin.com/home/show/share/sharefrom/other/id/MDAwMDAwMDAwMLCtpmSBi67er6eArg"

  // 清空查询对象
  $(".share-container")[0].innerHTML = "";

  //设置同步
  $.ajaxSettings.async = false;

  // 请求数据
  $.get({
    url: url,
    error: function(event) {
      alert("请求遇到错误！ERROR " + event.status);
      $(".single-search").addClass("no-display");
    },
    success: function(data) {
      $(".share-container")[0].innerHTML = data;
    }
  });

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
  } else {
    var authorList = $(".ch-one-of");
    var multAuthorExp = "";
    multAuthorExp += "<div class='box-inline'> <div class='const'>搭档人数：</div> <div class='getdata'>" +
    authorList.length +
    "人</div> </div> <hr>";

    for (var i = 0; i < authorList.length; i++) {
      multAuthorExp +=
        "<div class='box-inline'> <div class='const'>作者" +
        i +
        " ID：" +
        "</div> <div class='getdata'>" +
        $(".ch-id-p")[i].innerText +
        "</div> </div> <hr> <div class='box-inline'> <div class='const'>作者" +
        i +
        " 昵称：" +
        "</div> <div class='getdata'>" +
        $(".ch-one-info").children("p")[i].innerText +
        "</div> </div> <hr>";
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

  var myDate = new Date();
  var timestamp =
    myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString();
  var videoLink = $("#video-play").attr("src");

  // 数据处理
  if ($(".ch-one-info").length == 0) {
  userid = userid.replace("ID:", "");
}else{
    multAuthorExp = multAuthorExp.replace(/id：/g,"")
}

  uploadTime = uploadTime.replace("上传：", "");
  uploadTime = uploadTime.replace(/播放量：[0-9]{1,8}/, "");
  playTime = playTime.replace(/上传.{1,100}播放量/, "");

  //    赋值
  if ($(".ch-one-info").length == 0) {
    $(".user-id").text(userid);
    $(".nickname").text(nickname);
    $(".regday").text(regDay);
    $(".zptotal").text(zptotal);
  }else{
    $(".author-info")[0].innerHTML = multAuthorExp;
  }

  $(".zpname").text(zpname);
  $(".uploadtime").text(uploadTime);
  $(".playtime").text(playTime);
  $(".recent").text(recent);
  $(".favnum").text(favnum);
  $(".timestamp").text(timestamp);
  $(".video-link").attr("href", videoLink);

  // $(".share-container")[0].innerHTML = "";
}
