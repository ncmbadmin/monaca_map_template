、# Monaca x NIFTYCLOUD mobile backend 位置情報検索サンプル

===

# Overview

こちらはMonacaを利用して、mbaasサーバーに位置情報のデータを検索し、Google Map地図に表示するサンプルです。
* Android, iOSアプリをHTML, JavaScriptで簡単に作れるツール[Monaca](https://ja.monaca.io/)
* アプリのサーバー機能を簡単に作れるツール[Nifty cloud mobile backend](http://mb.cloud.nifty.com/) (以下からmBaaS)

![overview](readme-img/overview.JPG "概要図")

## Demo

* mBaaSサーバー側：位置情報があるデータを用意します(Storeクラスにインポートする)。
* MonacaでgithubのURL(Download zip file)をインポートし、
アプリキーとクライントキーを設定し、アプリを起動（プレビュー）します。
現在地を取得し、現在地から5km範囲のデータを取得し、地図にて表示します。

* トップ画面

![demo2](readme-img/demo1.JPG "登録完了")

* 位置情報検索を行い、データーを表示

![demo1](readme-img/demo2.JPG "起動画面")


## Description

* コードの説明

File: www/js/app.js

** 初期化設定
```JavaScript
var appKey    = "YOUR_APPKEY";
var clientKey = "YOUR_CLIENTKEY";

///// Called when app launch
$(function() {
  NCMB.initialize(appKey, clientKey);
});
```

上記のコードでキーを指定し、NCMB.initialize(appKey, clientKey), mBaaSサーバーと連携を行います。

* 現在地取得

地図検索ボタン処理メソッドに以下のように実装しています
```JavaScript
navigator.geolocation.getCurrentPosition(onSuccess, onError, null);
```

* 現在地取得が成功にonSuccessコールバックは以下のように設定しています。

```JavaScript
var onSuccess = function(position){
    var location = { lat: position.coords.latitude, lng: position.coords.longitude};
    //mobile backendに登録しているストアを取得し、地図で表示
    //位置情報を検索するクラスのNCMB.Objectを作成する
    var StoreClass = NCMB.Object.extend(storeClassName);
    //NCMB.Queryを作成
    var query = new NCMB.Query(StoreClass);
    //位置情報をもとに検索する条件を設定
    var geoPoint = new NCMB.GeoPoint(location.lat, location.lng);
    query.withinKilometers("geolocation", geoPoint, 5);
    var mapOptions = {
                    center: location,
                    zoom: 14
                };
    var map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    //現在地を地図に追加
    markToMap("現在地", location, map, null);
    //mobile backend上のデータ検索を実行する
    query.find({
        success: function(stores) {
            // 検索が成功した場合の処理
            for (var i = 0; i < stores.length; i++){
                var store = stores[i];
                var storeLocation = store.get("geolocation");
                var myLatlng = new google.maps.LatLng(storeLocation.latitude, storeLocation.longitude);
                //CREATE DETAIL
                var detail = "";
                var storeName = store.get("name");
                detail += "<h2>"+ storeName +"</h2>";
                var storeCapacity = store.get("capacity");
                var storeLocation = store.get("geolocation");
                var storeLatLng = new google.maps.LatLng(storeLocation.latitude,storeLocation.longitude);
                var locationLatLng = new google.maps.LatLng(location.lat,location.lng);
                var distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween (locationLatLng, storeLatLng));  
                detail += "<p>距離: "+ distance + "(m)</p>";
                detail += "<p>席数: " + storeCapacity + "</p>" ;
                markToMap(detail, myLatlng, map, 'images/marker_mbaas.png');
            }
        },
        error: function(error) {
            // 検索に失敗した場合の処理
            alert(error.message);
        }
    });
};
```

"Store"というクラスのデーターを検索するオブジェクトqueryを作ります.
検索条件は
query.withinKilometers("geolocation", geoPoint, 5);
現在地（geoPoint）から５kmの範囲でgeolocationというクラスのキーの値を検索します。
find()メソッドを利用し、非同期に検索を行います。
findの検索した後のコールバックを定義し、成功する場合、storesにデータが入っていますので。
表示する詳細を生成、markToMap()メソッドを利用し、地図にマーカーを付けます。


## Requirement

* Monaca環境
* Nifty cloud mobile backend Javascript SDK version 1.2.6
ダウンロード：[Javascript SDK](http://mb.cloud.nifty.com/doc/current/introduction/sdkdownload_javascript.html)

## Installation

* Monacaで新規アプリ作成し、プロジェクトをインポートする。
  - monacaの利用登録する
    [Monaca](https://ja.monaca.io/)
![monaca](readme-img/monaca.JPG "新規プロジェクト")
  - monacaで新規プロジェクトを作成する
![create](readme-img/monaca_new_project.JPG "新規プロジェクト")
![create](readme-img/monaca_new_project_2.JPG "新規プロジェクト")

* Monacaでアプリ作成する: プロジェクトインポートを選択し、「URLを指定してインポートする」と選び、以下のURLからインポートする。
 https://github.com/ncmbadmin/monaca_login_template/archive/master.zip

![newapp](readme-img/newapp.JPG "新規アプリ作成")

* mobile backendでアプリ作成する
  - mobile backendで利用登録する
    [Nifty cloud mobile backend](http://mb.cloud.nifty.com/)
![register](readme-img/register.JPG "登録画面")

* mobile backend側でデータをインポートする
 - 以下のURLからStore.jsonファイルをダウンロードする。
https://gist.github.com/ncmbadmin/c2bef258d2a63c40b0b1/archive/e9a844ed6b43d64cfc166b1788975890ff50280a.zip

mBaaSデータストアにて、作成＞inportダウンロードしたjsonファイルを指定し、インポートする。
![import1](readme-img/import1.JPG "初期化")

![import2](readme-img/import2.JPG "初期化")

インポートが成功した状態
![import3](readme-img/import3.JPG "初期化")

* monacaで作成したアプリをmobile backendサーバーと連携させる
  - monacaでアプリキー、クライアントキーを設定し、初期化を行う
![initialize2](readme-img/appKeyClientKey.JPG "初期化")
キーをコピーし、追記します。
![initialize](readme-img/appKeyClientKey_setting.JPG "初期化")

* Google map API キーの設定
 - ファイル：index.html
 - 方法は以下のように設定
 Google console: https://code.google.com/apis/console

![google key](readme-img/googleapi.JPG "google key")

* 動作確認
  - monacaで動作確認する
![demo](readme-img/demo2.JPG "動作確認")

## Usage

サンプルコードをカスタマイズする、key, value変数を変更していただきます。
以下のドキュメントを参照し、データ保存・検索・プッシュ通知を入れることができる。
* [ドキュメント](http://mb.cloud.nifty.com/doc/current/)
* [ドキュメント・データストア](http://mb.cloud.nifty.com/doc/current/sdkguide/javascript/datastore.html)
* [ドキュメント・会員管理](http://mb.cloud.nifty.com/doc/current/sdkguide/javascript/user.html)
* [ドキュメント・プッシュ通知](http://mb.cloud.nifty.com/doc/current/sdkguide/javascript/push.html)


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

* MITライセンス
* Nifty cloud mobile backendのJavascript SDKのライセンス
