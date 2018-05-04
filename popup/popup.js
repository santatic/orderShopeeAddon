var config = {
    apiKey: "AIzaSyDVNIaP7FBvbf5MuQ0snFvus83BJYCkLnc",
    authDomain: "shopngocanh-2018.firebaseapp.com",
    databaseURL: "https://shopngocanh-2018.firebaseio.com",
    projectId: "shopngocanh-2018",
    storageBucket: "shopngocanh-2018.appspot.com",
    messagingSenderId: "759441836020"
};
firebase.initializeApp(config);
var db = firebase.firestore();

$('a.btn-danger').click(() => {

    


    $('a.btn-danger').html('SAVED<img style="margin-left:6px;margin-top: -3px;" src="../images/success.png">');
    $('input#product-name').removeClass('warning')

});