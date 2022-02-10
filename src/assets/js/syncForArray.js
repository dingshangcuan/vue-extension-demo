
function syncFor(cbObj,flag){
	if(cbObj.index < cbObj.arr.length){
		if(flag){
			cbObj.cb();
		}else{
			cbObj.breakCb();
		}
	}else{
		cbObj.finishCb();
	}
}

function syncForArray(arr,cb,breakCb,finishCb){
	let cbObj = {
		arr: arr,
		index: 0,
		cb: function(){
			if(cb){
				let _this = this;
				if(cb.constructor.name == 'AsyncFunction'){//回调函数为异步函数
					cb(_this).then((returnFlag)=> {
						//console.log("async function return:"+returnFlag);
						if(returnFlag==true){//使用 return true; 中断回调函数并继续循环
							//console.log(_this.continue());
							_this.continue(true);
						}
					});
				}else{
					let returnFlag = cb(_this);
					//console.log("function return:"+returnFlag);
					if(returnFlag==true){//使用 return true; 中断回调函数并继续循环
						//console.log(_this.continue());
						_this.continue(true);
					}
				}
				/*
				函数返回值说明：
					（1）return;或者没有return->undefined
					（2）return true;->true -> 继续循环
					（3）return false;->false
				*/
			}
		},
		breakCb: function(){
			if(breakCb){
				breakCb(this);
			}
		},
		finishCb: function(){
			if(finishCb){
				finishCb(this);
			}
		},
		continue: function(flag){
			this.index = this.index+1;
			syncFor(this,flag);
		},
		getItem: function(){
			return this.arr[this.index];
		}
	};
	syncFor(cbObj,true);
}

/*
syncForArray(["1","2","3","4","5"],async function(cbObj){//普通函数或者异步函数
	let item = cbObj.getItem();
	if(item=="1"){
		return true;//使用 return true; 中断回调函数并继续循环
	}
	console.log(item);
	if(item=="4"){
		cbObj.continue(false);//跳出循环，相当于break
	}else{
		cbObj.continue(true);//继续循环
	}
},function(cbObj){
	console.log("跳出循环！");
},function(cbObj){
	console.log("循环结束！");
});
*/


//---------------获取元素在dom中的css选择器

function cssPath(el,useId) {//useId为字符串"true"时才使用ID
	if (!(el instanceof Element)) 
		return;
	var path = [];
	while (el.nodeType === Node.ELEMENT_NODE) {
		var selector = el.nodeName.toLowerCase();
		if (el.id && useId && useId.toLowerCase()=="true") {
			selector += '#' + el.id;
			path.unshift(selector);
			break;
		} else {
			var sib = el, nth = 1;
			while (sib = sib.previousElementSibling) {
				if (sib.nodeName.toLowerCase() == selector)
				   nth++;
			}
			//if (nth != 1)
				selector += ":nth-of-type("+nth+")";
		}
		path.unshift(selector);
		el = el.parentNode;
	}
	return path.join(" > ");
}


//---------------等待执行
async function asyncAwaitFn(sec,callback,params) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
			if(callback){
				resolve(callback(params));
			}else{
				resolve();
            }
        }, sec*1000);
    })
}
//循环等待，指定间隔时间(秒)，函数，函数的参数
async function waitFlag(sec,flagFunc,params){
	while(true){
		let flag = await asyncAwaitFn(sec,flagFunc,params);
		if(flag){
			break;
		}
	}
}
//循环等待，指定间隔时间(秒)，【最长】间隔时间(秒)，函数，函数的参数
//如果是超时返回true，如果是正常返回false
async function waitTimeoutFlag(sec,tsec,flagFunc,params){
	let start = Date.now();
	let isTimeout = false;
	while(true){
		let flag = await asyncAwaitFn(sec,flagFunc,params);
		let end = Date.now();
		let interval = (end-start)/1000;
		if(flag || interval>=tsec){
			if(flag){
				isTimeout = false;
			}else{
				isTimeout = true;
			}
			break;
		}
	}
	return isTimeout;
}

//await waitFlag(1,waitNodeExist,node);
//await waitFlag(1,waitNodeExistAndClick,node);
//await waitFlag(1,waitNodeNotExist,node);
function waitNodeExist(node){
	if(node && node.click){
		return true;
	}else{
		return false;
	}
}
function waitNodeExistAndClick(node){
	if(waitNodeExist(node)){
		node.click();
		return true;
	}else{
		return false;
	}
}
function waitNodeNotExist(node){
	if(document.body.contains(node)){
		return false;
	}else{
		return true;
	}
}

//await waitFlag(1,waitNodeExistBySelector,"a[role='button'][data-tooltip-content*='Enter']",rootNode);
//await waitFlag(1,waitNodeExistBySelectorAndClick,"a[role='button'][data-tooltip-content*='Enter']",rootNode);
function waitNodeExistBySelector(selector,rootNode){
	let node;
	if(rootNode){
		node = rootNode.querySelector(selector);
	}else{
		node = document.querySelector(selector);
	}
	if(node && node.click){
		return true;
	}else{
		return false;
	}
}
function waitNodeExistBySelectorAndClick(selector,rootNode){
	if(waitNodeExistBySelector(selector,rootNode)){
		let node;
		if(rootNode){
			node = rootNode.querySelector(selector);
		}else{
			node = document.querySelector(selector);
		}
		node.click();
		return true;
	}else{
		return false;
	}
}
function waitNodeNotExistBySelector(selector,rootNode){
	let node;
	if(rootNode){
		node = rootNode.querySelector(selector);
	}else{
		node = document.querySelector(selector);
	}
	if(node && node.click){
		return false;
	}else{
		return true;
	}
}

//等待node加载完成
//await waitFlag(1,waitNodeLoaded,"a[role='button'][data-tooltip-content*='Enter']");
function waitNodeLoaded(selector){
	let node = document.querySelector(selector);
	if(node){
		if(node.complete){
        	return true;
		}else{
        	return false;
		}
	}else{
		return true;
	}
}

//等待url改变
//await waitFlag(1,waitUrlChange,location.href);
function waitUrlChange(oldUrl){
	let newUrl = location.href;
	if(oldUrl==newUrl){
		return false;
	}else{
		console.log("oldUrl:"+oldUrl);
		console.log("newUrl:"+newUrl);
		return true;
	}
}
//等待url变成
//await waitFlag(1,waitUrlTo,newUrl);
function waitUrlTo(newUrl){
	let curUrl = location.href;
	if(curUrl!=newUrl){
		return false;
	}else{
		return true;
	}
}

//await waitFlag(1,waitNodeAttributeTo,{node:node,name:"aria-disabled",newValue:"true"});
function waitNodeAttributeTo(obj){
	let node = obj.node;
	let name = obj.name;
	let newValue = obj.newValue;
	let value = node.getAttribute(name);
	if(value){
		if(value==newValue){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

//等待CSS变成
//await waitFlag(1,waitNodeStyleChangeTo,{node:node,name:"display",newValue:""});
function waitNodeStyleChangeTo(obj){
	let styleValue = obj.node.style[obj.name];
	if(styleValue == obj.newValue){
		return true;
	}else{
		return false;
	}
}

//等待图片加载完成
function waitImagesLoaded(params){
	let selector = params[0];
	let imgLen = params[1];
	let imgDivs = document.querySelectorAll(selector);
	if(imgLen>0 && imgLen!=imgDivs.length){
		return false;
	}else{
		return true;
	}
}


export {waitFlag,waitNodeExistBySelector}