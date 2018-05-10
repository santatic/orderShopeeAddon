


            switch(true){
            	case $(location).attr('href').indexOf('shopee.vn') !== -1:
		            var sitems = {};

		            $('a')
		                .filter(function() {
		                    return this.href.match(/\/.*i\.\d+\.\d+/);
		                })
		                .each(function(index, element) {//'a[class="shopee-item-card--link"][href^="/"]'
		                    var regex = /\/.+i\.(\d+\.\d+)/g;
		                    var matchs = regex.exec($(element).attr('href'));
		                    if(matchs.length === 2){
		                        var shopid_itemid = matchs[1].split('.');
		                        sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                            //var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    }
		                }); 

		            // check type of page: single page or other page
		            switch (true){
		                case /https:\/\/shopee.vn\/.*i\.\d+\.\d+/.test(window.location.href): //single page
		                    var regex = /\/.+i\.(\d+\.\d+)/g;
		                    var matchs = regex.exec(window.location.href);
		                    if(matchs.length === 2){
		                        var shopid_itemid = matchs[1].split('.');
		                        sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                            //var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    }


		                    // var links = window.location.href.match(/i\.(\d+)\.(\d+)/g); //"https://shopee.vn/Xả-Kho-bán-buôn-Tủ-vải-2-tầng-3-ngăn-kéo-i.868d9909.52050d386" ==> [ '8689909.52050386' ]
		                    // var shopid_itemid = links !== null ? links[0].split('.') : [];
		                    // if(shopid_itemid.length > 0){
		                    //     sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                    // }                    
		                    
		                    break;
		                default: //other page
		                    // var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    break;
		                
		            }


		            //highlight div by shopid(s)
		            chrome.storage.sync.get('todo', function(keys) {
		                if (keys.todo != null) {
		                    console.log(keys);
		                    for (var i = 0; i < keys.todo.length; i++) {
		                        $('a[href*=".' + keys.todo[i]['content'] + '"]').parent().css({"border": "2px solid orange"});
		                    }
		                    // _this.data = keys.todo;
		                    // for (var i=0; i<_this.data.length; i++) {
		                    //     _this.data[i]['id'] = i + 1;
		                    // }
		                    // console.log(_this.data);
		                    // callback(_this.data);
		                }
		            });                

		            console.log('gui tin nhan');
		            //send message to background.js
					chrome.runtime.sendMessage({mission: "sendShopIdAndItemId", data: sitems}, function(response) {//lấy thông tin cấu hình của trang định lấy nội dung
		                //changeScope(response);

		                var sel = 'div[ng-controller="' + 'mainCtrl' + '"]';
		                $scope =  angular.element(sel).scope();
		                // console.log($scope);
		                $scope.GLOBAL_FIRST_RESPONSE = response;
		                $scope.$apply();
		                for(var key in response) {
		                    if(response[key] !== null){
		                        $('a[href*=".' + key + '"]').before("<span>sold " + response[key]['sold'] + ' updated ' + moment(response[key]['createdTime']).fromNow() + "</span>");
		                    }
		                }
					    
		                $('a')
		                    .each(function(index, element) {//'a[class="shopee-item-card--link"][href^="/"]'
		                        $(element).attr('onclick','window.open("' + $(element).attr('href') + '");return false;');
		                        $(element).attr('href','#');

		                    }); 
					});
            		break;
            	case $(location).attr('href').indexOf('1688.com') !== -1:        		
			        var tds = document.getElementsByTagName('td');
			        
			        for(var i = 0; i < tds.length; i++) {
			            var td = tds[i];
			            if(td.className.indexOf('name') !== -1){// những td có class là name là những td chứa phân loại hàng sku 
			                td.onclick = function() {
								  var textArea = document.createElement("textarea"); 
								 
								  textArea.style.position = 'fixed';
								  textArea.style.top = 0;
								  textArea.style.left = 0;

								  // Ensure it has a small width and height. Setting to 1px / 1em
								  // doesn't work as this gives a negative w/h on some browsers.
								  textArea.style.width = '2em';
								  textArea.style.height = '2em';

								  // We don't need padding, reducing the size if it does flash render.
								  textArea.style.padding = 0;

								  // Clean up any borders.
								  textArea.style.border = 'none';
								  textArea.style.outline = 'none';
								  textArea.style.boxShadow = 'none';

								  // Avoid flash of white box if rendered for any reason.
								  textArea.style.background = 'transparent';

								  var strPrice = $(this).next().find('em.value').text(); //parents('td').first()
								  var strSupplier = $('a')
									  .filter(function() {
									  return this.href.match(/https\:\/\/.*\.1688\.com\/page\/companyinfo.htm/); //https\:\/\/.*\.1688\.com\/page\/companyinfo.htm
								  }).attr('href').replace('https://', '').replace('.1688.com/page/companyinfo.htm', '').replace('.1688.com/page/0701/tg.html','');
									// nếu không có ảnh thì lấy ảnh avatar
								  var strImage = $(this).find('img').length === 0 ? '=image("' + $('a[trace="largepic"] img').attr('src').replace('400x400.', '') + '")'
								  		: '=image("' + $(this).find('img').first().attr('src').replace('32x32.', '') + '")';
								  
								  var strClassify = $(this).find('img').length === 0 ? $.trim($(this).text()) : $(this).find('img').first().attr('alt');
								  
								  textArea.value = strSupplier + '\t' + strImage + '\t' + strClassify + '\t' + $(location).attr('href') + '\t5\t' + strPrice;
								  //console.log(textArea.value);
								  document.body.appendChild(textArea);

								  textArea.select();

								  try {
								    var successful = document.execCommand('copy');
								    var msg = successful ? new Noty({timeout: 3500, type: 'success', text: 'Copied'}).show() : new Noty({timeout: 3500, type: 'error', text: 'Copy Failed'}).show();
								    // console.log('Copying text command was ' + msg);
								    
								  } catch (err) {
								  	new Noty({timeout: 3500, type: 'error', text: 'Oops, unable to copy'}).show();
								  }

								  document.body.removeChild(textArea);
								}
			            }
			        }
			        new Noty({timeout: 5000, type: 'success', text: 'Có thể click vào phân loại hàng để copy'}).show();

            		break;
            }