let url =document.URL;
let str = url.match(/[a-z]{1,}(?=.html)/);
str =str[0]
if (process.env.NODE_ENV == 'development') {
    injectCustomJs('',`${str}.js`);
    injectCustomCss('',`${str}.css`);
}else{
    injectCustomJs('',`https://cdn.myqingci.com/extension/js/${str}.js`);
    injectCustomCss('',`https://cdn.myqingci.com/extension/css/${str}.css`);
}

function injectCustomJs(jsPath,url){
    // console.log('injectCustomJs');
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('class','inject')
    if (url) {
        script.src=url;
    }else{
        script.src = chrome.extension.getURL(jsPath);//only content
    }
    document.body.appendChild(script);
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