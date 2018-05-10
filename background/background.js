
firebase.initializeApp({
    apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
    projectId: "nguoitimship"
});
  // Initialize Cloud Firestore through Firebase
const  firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

var app = angular.module('app', []);
app.controller('mainCtrl', function($scope, request_center, message_center) {
  request_center.request_trigger();
});