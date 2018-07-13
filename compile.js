/**
 * Created by jyn on 2018/7/12.
 */
class Compile {
	constructor(el, vm){
		this.el = this.isElementNode(el) ? el : document.querySelector(el)
		this.vm = vm
		if(this.el){
			// 如果这个元素能获取到才开始编译
			// 1. 先把这些真实的DOM转入到内存中 fragment
			let fragment = this.node2fragment(this.el)
			// 2. 编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
			// 3. 把编译好的fragment再塞回到页面
		}
	}
	//	专门写一些辅助方法
	isElementNode(node){
		return node.nodeType === 1
	}
	//	核心方法
	node2fragment(el){
		// 需要将el中的内容全部放到内存中
		// 文档碎片
		let fragment = document.createDocumentFragment()
		let firstChild
	}
}