var appKey    = "YOUR_APPKEY";
var clientKey = "YOUR_CLIENTKEY";
var storeClassName = "Shop";
var ncmb = new NCMB(appKey,clientKey);

///// Called when app launch
$(function() {
});


//----------------------------------SHOW MAP-------------------------------------//

//現在地を取得成功したら
var onSuccess = function(position){
    var location = { lat: position.coords.latitude, lng: position.coords.longitude};
    //mobile backendに登録しているストアを取得し、地図で表示
    //位置情報を検索するクラスのNCMB.Objectを作成する
    var StoreClass = ncmb.DataStore(storeClassName);
    //位置情報をもとに検索する条件を設定
    var geoPoint = ncmb.GeoPoint(location.lat, location.lng);
    var mapOptions = {
                    center: location,
                    zoom: 14
                };
    var map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
    //現在地を地図に追加
    markToMap("現在地", location, map, null);
    //mobile backend上のデータ検索を実行する
    StoreClass.withinKilometers("geolocation", geoPoint, 5)
              .fetchAll()
              .then(function(stores) {
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
               })
              .catch(function(error) {
                 // 検索に失敗した場合の処理
                 alert(error.message);
              });
};

//位置情報取得に失敗した場合のコールバック
var onError = function(error){
    alert("現在位置を取得できませんでした");
};

//地図でマーク表示
function markToMap(name, position, map, icon){
    var marker = new google.maps.Marker({
        position: position,
        title:name,
        icon: icon
    });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
        var infowindow = new google.maps.InfoWindow({
            content:marker.title
        });
        infowindow.open(map,marker);
    });
}

//現在地を取得する
function showMap(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError, null);
};
