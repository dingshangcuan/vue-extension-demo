<template>
	<div>
		<el-button @click="openURL('https://baidu.com')">访问官网</el-button>
	</div>
</template>

<script>
export default {
	name: "App",
	created() {
		this.removeSelf();
	},
	methods:{
		openURL(url,target){
            target= target || '_blank'
            let a = document.createElement('a');// 生成一个a元素
            let event = new MouseEvent('click');// 创建一个单击事件
            a.href = url;// 将生成的URL设置为a.href属性
            a.target=target;
            a.dispatchEvent(event);// 触发a的单击事件
        },
		
	}
};
</script>

<style scoped>

</style>
