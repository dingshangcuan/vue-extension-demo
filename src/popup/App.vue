<template>
	<div>
		
	</div>
</template>

<script>
export default {
	data () {
		return {}
	},
	created(){
		window.open("https://myqingci.com/home");
		this.removeSelf();
	},
	methods: {
		removeSelf(){
            let inject = document.querySelectorAll('.inject');
            console.log(inject);
            setTimeout(() => {
                inject.forEach((item,index)=>{
                    console.log(item);
                    item.remove()
                })
            }, 15);
        }
	},

}
</script>


