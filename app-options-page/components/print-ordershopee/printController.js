const firestore = firebase.firestore();
const settings = { /* your settings... */
    timestampsInSnapshots: true
};
firestore.settings(settings);

app.controller("print-controller", function ($scope, $routeParams) {

    var id = $routeParams.id;

    var products = []

    function myPrint(){
        $("#left").append("<div id='line' class='row' style='margin-top: 20px; border-bottom: #000 dashed 1px; margin-bottom: 25px;'></div>")
        $("#trackno").css({
            "font-size": "30px"
        })
        window.print()
        $("#line").remove()
        $("#trackno").css({
            "font-size": "15px"
        })
    }

    docRef = firestore.collection("orderShopee").doc(id);
    docRef.get().then(
        function (doc) {
            if (doc.exists) {
                const data = doc.data();
                console.log(data);
                $scope.trackingNo = data.shipping_traceno;
                $scope.nickName = data.user.name;  
                data['order-items'].forEach((item, index)=>{
                    console.log(item.snapshotid + " = "+item.modelid);
                    let product = data['products'].find(o=>o.id === item.snapshotid);
                    let model = data['item-models'].find(o=>o.id === item.modelid)
                    var productsObj = new Object();
                    productsObj = {
                        name: product.name,
                        model: model.name,
                        amount: item.amount
                    }
                    products.push(productsObj)
                });       
                console.log(products); 
                $scope.products = products;
                      
            } else {
                alert("Đơn này chưa có trong database");
                window.close()
            }
            $scope.$apply()
        }).then(()=>{
            $("tr:nth-child(n + 6)").css({"display" : "none"});
            if(products.length > 5){
                $("#products").append("<span style='color:red; padding-left: 10px;' >một số sản phẩm được ẩn đi do quá nhiều ("+products.length+" sp)</span>")
            }
            myPrint()
        })

});