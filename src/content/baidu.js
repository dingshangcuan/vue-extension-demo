// conten script for baidu

console.log('Content Script when match baidu.com');

let baseUrl= 'https://example.com/'
if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://localhost:3000/'
}


injectJs()

// 注：这里只插入了js和css，还需要插入一个 <div id="app"></div>  到页面中
function injectJs (){ 

    injectCustomJs('',`${baseUrl}inject/baidu/index.js`);
    injectCustomCss('',`${baseUrl}inject/baidu/index.css`);

    function injectCustomJs(jsPath,url){
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('class','inject')
        if (url) {
            script.src=url;
        }else{
            script.src = chrome.extension.getURL(jsPath);//only content
        }
        document.head.appendChild(script);
    };

    function injectCustomCss(cssPath,url){
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        // link.setAttribute('class','inject')
        if (url) {
            link.href=url;
        }else{
            link.href = chrome.extension.getURL(cssPath);//only content
        }
        document.head.appendChild(link);
    };
}



