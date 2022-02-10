let str=document.URL;
let detailReg=/dp\/(B0[0-9A-Z]{8})/;
let offerReg = /offer-listing\/(B0[0-9A-Z]{8})/;
let searchReg = /\/s\?k=/;
let bsrPageReg =/\/bestsellers\/|\/Best-Sellers/;
let newReleasesReg=/\/new-releases\/|\/movers-and-shakers\//;  // and:  movers-and-shakers
let wishOrGiftReg = /\/most-wished-for\/|\/most-gifted\//;


import $ from "jquery";

console.log('entry加载成功');

let baseUrl= 'https://cdn.myqingci.com/extension/'
if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://localhost:5001/'
}

setTimeout(() => {
    // 搜索页面和BSR100页面
    if (str.match(searchReg)) {
        injectDivAfterAsinInSearchPage();
        injectCustomJs('',`${baseUrl}inject/inject2.js`);
        injectCustomCss('',`${baseUrl}inject/inject2.css`);
    }else if(str.match(bsrPageReg)){
        injectDivAfterAsinInBsrPage();
        injectCustomJs('',`${baseUrl}inject/inject2.js`);
        injectCustomCss('',`${baseUrl}inject/inject2.css`);
    }else if(str.match(newReleasesReg)||str.match(wishOrGiftReg)){
        injectDivAfterAsinInnewReleases();
        injectCustomJs('',`${baseUrl}inject/inject2.js`);
        injectCustomCss('',`${baseUrl}inject/inject2.css`);
    }else{  //产品详情页
        if (str.match(detailReg)) {
            insertAfterClear('keepamoreClear','#ppd'); 
            insertAfter('app','#keepamoreClear'); 
        }else if (str.match(offerReg)) {
            insertAfterClear('keepamoreClear','#olpProduct');
            insertAfter('app','#keepamoreClear'); 
        }
        injectCustomJs('',`${baseUrl}inject/inject.js`);
        injectCustomCss('',`${baseUrl}inject/inject.css`);
    }
    
}, 0);


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

function insertAfter(id, reference) {
    let div = document.createElement('div');
    div.id=id;
    let referenceNode=document.querySelector(reference);
    referenceNode.parentNode.insertBefore(div, referenceNode.nextSibling);
};
function insertAfterClear(id, reference) {
    let div = document.createElement('div');
    div.id=id;
    div.style="clear:both";
    let referenceNode=document.querySelector(reference);
    referenceNode.parentNode.insertBefore(div, referenceNode.nextSibling);
};



// 在每个产品下面插入数据
// function injectDivAfterAsinInSearchPage (){
//     let divs = document.querySelectorAll('.s-asin');
//     divs.forEach((item,index)=>{
//         let app = document.createElement('div');
//         app.className='app-asin';
//         app.id=`app-asin${index}`;
//         let asin = item.getAttribute('data-asin');
//         app.setAttribute("data-asin",asin);
//         // item.parentNode.insertBefore(app, item.nextSibling);
//         let insertDiv = item.getElementsByClassName("a-section")[0];
//         // item.appendChild(app);
//         insertDiv.appendChild(app);
//     })
// }

// 在每个产品下面插入数据
function injectDivAfterAsinInSearchPage (){
    $("[data-asin^='B0']").each(function(index,element){ //不能用箭头函数
        let asin = $(this).attr('data-asin');
        let mainImage = $(this).find('img').attr('src');
        // console.log(mainImage);
        // let asin = $(this).data('asin'); //两个都可以
        // console.log(asin);
        let app = document.createElement('div');
        app.className='app-asin';
        app.id=`app-asin${index}`;
        app.setAttribute("data-asin",asin);
        app.setAttribute("data-mainImage",mainImage);
        $(this).find('.a-section').first().parent().append(app);
    })
    // let divs = document.querySelectorAll('.s-asin');
    // divs.forEach((item,index)=>{
    //     let app = document.createElement('div');
    //     app.className='app-asin';
    //     app.id=`app-asin${index}`;
    //     let asin = item.getAttribute('data-asin');
    //     app.setAttribute("data-asin",asin);
    //     // item.parentNode.insertBefore(app, item.nextSibling);
    //     let insertDiv = item.getElementsByClassName("a-section")[0];
    //     // item.appendChild(app);
    //     insertDiv.appendChild(app);
    // })
}


function injectDivAfterAsinInBsrPage (){
    $(".zg-item-immersion").each(function(index,element){ //不能用箭头函数
        let app = document.createElement('div');
        app.className='app-asin';
        app.id=`app-asin${index}`;
        let asinStr = $(this).find('.a-link-normal').first().attr('href');
        // let a = item.getElementsByClassName("a-link-normal")[0];
        // let asinStr = a.getAttribute('href');
        let asin = asinStr.match(/B0[A-Z0-9]{8}/);
        let mainImage = $(this).find('img').attr('src');
        let d = $(this).find('img').html()
        console.log(d);
        console.log(mainImage);
        app.setAttribute("data-asin",asin);
        app.setAttribute("data-mainImage",mainImage);
        $(this).find('.zg-item').first().append(app);
        // let insertDiv = item.getElementsByClassName("zg-item")[0];
        
        // item.appendChild(app);
        // insertDiv.appendChild(app);
    })

    // let divs = document.querySelectorAll('.zg-item-immersion');
    // divs.forEach((item,index)=>{
    //     let app = document.createElement('div');
    //     app.className='app-asin';
    //     app.id=`app-asin${index}`;
    //     let a = item.getElementsByClassName("a-link-normal")[0];
    //     let asinStr = a.getAttribute('href');
    //     let asin = asinStr.match(/B0[A-Z0-9]{8}/);
    //     let mainImage = $(this).find('img').attr('src');
    //     let d = $(this).find('img').html()
    //     console.log(d);
    //     console.log(mainImage);
    //     // console.log("item['data-asin']----");
    //     app.setAttribute("data-asin",asin);
    //     app.setAttribute("data-mainImage",mainImage);
    //     let insertDiv = item.getElementsByClassName("zg-item")[0];
        
    //     // item.appendChild(app);
    //     insertDiv.appendChild(app);
    // })
    $('li.zg-item-immersion').css('height','auto');
}

// 有的产品，会no longer available,导致没有a标签
function injectDivAfterAsinInnewReleases (){
    $(".zg-item-immersion").each(function(index,element){ //不能用箭头函数
        
        let asinStr = $(this).find('.a-link-normal').first().attr('href');
        if (asinStr) {
            let app = document.createElement('div');
            app.className='app-asin';
            app.id=`app-asin${index}`;
            let asin = asinStr.match(/B0[A-Z0-9]{8}/);
            let mainImage = $(this).find('img').attr('src');
            let d = $(this).find('img').html()
            console.log(d);
            console.log(mainImage);
            app.setAttribute("data-asin",asin);
            app.setAttribute("data-mainImage",mainImage);
            $(this).find('.zg-item').first().append(app);
        }else{
            let app = document.createElement('div');
            app.setAttribute("data-asin",'');
            app.className='app-asin';
            app.id=`app-asin${index}`;
            $(this).find('.a-list-item').first().append(app);
            // let insertDiv = item.getElementsByClassName("a-list-item")[0];
            // insertDiv.appendChild(app);
        }
        
        
    })

    $('li.zg-item-immersion').css('height','auto');
}

// 有的产品，会no longer available,导致没有a标签
function injectDivAfterAsinInnewReleases2 (){
    let divs = document.querySelectorAll('.zg-item-immersion');
    divs.forEach((item,index)=>{
        
        let a = item.getElementsByClassName("a-link-normal")[0];
        if (a) {
            let asinStr = a.getAttribute('href');
            let asin = asinStr.match(/B0[A-Z0-9]{8}/);
            let mainImage = $(this).find('img').attr('src');
            console.log(mainImage);
            let app = document.createElement('div');
            app.setAttribute("data-asin",asin);
            app.setAttribute("data-mainImage",mainImage);
            app.className='app-asin';
            app.id=`app-asin${index}`;
            let insertDiv = item.getElementsByClassName("zg-item")[0];
            insertDiv.appendChild(app);
        }else{
            // let guale = document.createElement('div');
            // guale.innerHTML='这位同学，你的listing挂了~o_o~';
            // let insertDiv = item.getElementsByClassName("a-list-item")[0];
            // insertDiv.appendChild(guale);

            let app = document.createElement('div');
            app.setAttribute("data-asin",'');
            app.className='app-asin';
            app.id=`app-asin${index}`;
            let insertDiv = item.getElementsByClassName("a-list-item")[0];
            insertDiv.appendChild(app);
        }
    })
    $('li.zg-item-immersion').css('height','auto'); //自适应高度
}




