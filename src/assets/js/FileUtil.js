const $ = require ('jquery');
let FileUtil = {
// module.exports = {
	key: "PrfqwNVEQdP9TRGw",
	//****Get file method 1****
	getImageDataUri: function(url, toName, toJpgOrPng, callback) {
		let _this = this;
		/*
		let image = new Image();
		//image.style.width = "200px";
		//image.style.display = "none";
		image.onload = function () {
			let canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth; // or "width" if you want a special/scaled size
			canvas.height = image.naturalHeight; // or "height" if you want a special/scaled size

			canvas.getContext("2d").drawImage(image, 0, 0);
			toJpgOrPng = toJpgOrPng.toLowerCase();
			let mimeType = "image/"+(toJpgOrPng=="jpg"?"jpeg":toJpgOrPng);
			let reg = new RegExp("^data:image\\/(png|jpeg);base64,","i");
			let base64Data = canvas.toDataURL(mimeType).replace(reg, "");
			// Get raw image data
			callback(toName,toJpgOrPng,mimeType,base64Data);
		};
		image.crossOrigin = "anonymous";//before set src
		image.src = url;
		*/
		//通过background获取图片解决跨域问题
		chrome.extension.sendRequest({
				type: "fetchImageByUrl",
				url: url,
				toJpgOrPng: toJpgOrPng
			},function(response) {
				if(response.success){
					let mimeType = response.mimeType;
					let base64Data = response.base64Data;
					callback(toName,toJpgOrPng,mimeType,base64Data);
				}
		});
	},
	imageUrlToFile: function(url,name,urlHandler){
		let _this = this;
		return new Promise(function(resolve,reject){
			if(urlHandler){
				url = urlHandler(url);
			}
			let extIdx = name.lastIndexOf(".");
			if(extIdx==-1 || extIdx==0 || extIdx==(name.length-1)){
				reject(new Error("File name error!"+name));
			}else{
				let toName = name.substring(0,extIdx);
				let toJpgOrPng = name.substring(extIdx+1);
				_this.getImageDataUri(url, 
				toName,
				toJpgOrPng,
				function(toName_,toJpgOrPng_,mimeType,dataUri) {
					let byteString = atob(dataUri);
					let buffer = new ArrayBuffer(byteString.length);
					let array = new Uint8Array(buffer);
					for (let i = 0; i < byteString.length; i++) {
					array[i] = byteString.charCodeAt(i);
					}
					let blob = new Blob([buffer], {type: mimeType});
					let file = new File([blob], toName_+"."+toJpgOrPng_, blob);
					//console.log(file);
					resolve(file);
				});
			}
		});
	},
	//****Get file method 2****
	fetchUrlToFile: function(url,name,urlHandler,useMethod1){
		let _this = this;
		if(useMethod1){
			return _this.imageUrlToFile(url,name,urlHandler);
		}else{
			return new Promise(function(resolve,reject){
				if(urlHandler){
					url = urlHandler(url);
				}
				/*
				//https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
				fetch(url,{method: 'GET', 
							mode: 'cors',
							//headers: {'content-type': 'image/*'}, 
							cache: 'no-cache'})
				.then(function(response) {
					//console.log(response);
					return response.blob();
				})
				.then(function(blob) {
					let file = new File([blob], name, blob);
					//console.log(file);
					resolve(file);
				}).catch(function(error) {
					//console.log(error);
					reject(error);
				});
				*/
				//通过background获取图片解决跨域问题
				chrome.extension.sendRequest({
						type: "getArrayBufferByUrl",
						url: url,
						timeout: 20
					}, 
					function(response) {
						if(response.success){
							let xhrData = response.message;
							let data = xhrData.data;
							let contentType = xhrData.contentType;
							let buffer = new Uint8Array(data).buffer;
							let blob = new Blob([buffer], {type: contentType});
							let file = new File([blob], name, blob);//name为文件名
							//console.log(file);
							resolve(file);
						}else{
							let error = new Eerror(response.message);
							//console.log(error);
							reject(error);
						}
				});
			});
		}
	},
	//****upload to file input****
	fetchImageToFile: function(selector,name,urlHandler,useMethod1){
		let _this = this;
		let img = document.querySelector(selector);
		let url = img.src;
		return _this.fetchUrlToFile(url,name,urlHandler,useMethod1);
	},
	// fetchUrlToFileInput: function(url,name,urlHandler,inputSelector,useMethod1){
	fetchUrlToFileInput: function(url,name,urlHandler,inputId,useMethod1){
		let _this = this;
		_this.fetchUrlToFile(url,name,urlHandler,useMethod1)
		.then(file=>{
			// 有改动
			// let fileInput = document.querySelector(inputSelector);
			let fileInput = document.getElementById(inputId);
			console.log(fileInput);
			console.log(file);
			fileInput.customFile(file,_this.key);
		})
		.catch(error=>{
			console.log(error.message);
		});
	},
	fetchUrlsToFileInput: function(urls,names,urlHandler,inputSelector,useMethod1){
		let _this = this;
		urls = urls.map((url,idx)=>{//得到Promise实例数组
		return _this.fetchUrlToFile(url,
						names[idx],
						urlHandler,
						useMethod1);
		});
		Promise.all(urls)
		.then((file)=>{
			return [].concat(...file);//链式操作, 返回的是一个新的 Promise 对象
						//参考：https://www.runoob.com/w3cnote/javascript-promise-object.html
		})
		.then((files)=>{
			//console.log(files);
			let fileInput = document.querySelector(inputSelector);
			fileInput.customFiles(files,_this.key);
		})
		.catch(error=>{
			console.log(error.message);
		});
	},
	fetchImageToFileInput: function(imageSelector,name,urlHandler,inputSelector,useMethod1){
		let _this = this;
		_this.fetchImageToFile(imageSelector,
						name,
						urlHandler,
						useMethod1)
		.then(file=>{
		//console.log(file);
		let fileInput = document.querySelector(inputSelector);
		fileInput.customFile(file,_this.key);
		})
		.catch(error=>{
		console.log(error.message);
		});
	}
}


export {FileUtil}
// module.exports = FileUtil;
