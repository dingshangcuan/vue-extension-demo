<template>
	<div >
        
	</div>
</template>

<script>
import {mapState,mapMutations} from "vuex";
// import moment from 'moment';
// import superagent from 'superagent';
// import cheerio from 'cheerio';


export default {
	name: "App",
	data () {
		return {
            username:''
		}
	},
	created(){
        // 每次启动插件即运行的代码
        chrome.storage.local.get({"username":""}, res=>{
            this.username =  res.username
        });

        // this.openURL('https://baidu.com')
    },

    computed:{
        // ...mapState(['token']),
        
    },
    
	methods:{
        // ...mapMutations(['updateToken']),
        
        openURL(url,target){
            // target= target || '_blank'
            let a = document.createElement('a');// 生成一个a元素
            let event = new MouseEvent('click');// 创建一个单击事件
            a.href = url;// 将生成的URL设置为a.href属性
            a.target=target;
            a.dispatchEvent(event);// 触发a的单击事件
        },
        doSomething(){
            // superagent.get().then()
        }
	}
};
</script>

<style scoped>
.background{
    width: 100px;
}
</style>
