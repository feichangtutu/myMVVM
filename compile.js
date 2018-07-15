/**
 * Created by jyn on 2018/7/12.
 */
class Compile {
	constructor(el, vm){
		this.el = this.isElementNode(el) ? el : document.querySelector(el)
		this.vm = vm
		if(this.el){
			// 如果这个元素能获取到才开始编译
			// 1. 先把这些真实的DOM转入到内存中 应用fragment
			let fragment = this.node2fragment(this.el)
			// 2. 编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
			this.compile(fragment)
			// 3. 把编译好的fragment再塞回到页面
			this.el.appendChild(fragment)
		}
	}
	//	专门写一些辅助方法
	isElementNode(node){
		return node.nodeType === 1
	}
	// 是不是指令
	isDirective(name){
		return  name.includes('v-')
	}
	
	//	核心方法
	compileElement(node){
	//	带 v-model v-text v-*等
	//	取出当前节点的属性
		let attrs = node.attributes
		console.log(attrs) // 0: type 1:v-model
		Array.from(attrs).forEach( attr => {
			console.log(attr.name,1)
			//判断属性名字是不是包含v-
			let attrName = attr.name
			console.log(this.isDirective(attrName))
			if(this.isDirective(attrName)){
				// 取到对应的值放到节点的值中
				let expr = attr.value
				console.log('属性名 :'+expr)
				//	node vm.$data expr
				let [,type] = attrName.split('-')
				CompileUtil[type](node, this.vm, expr)
			}
		})
	}
	
	compileText(node){
	//	带{{}}
		let expr = node.textContent //取文本中的内容
		let reg = /\{\{([^}]+)\}\}/g
		if(reg.test(expr)){
		//	node this.vm.$data expr
			CompileUtil["text"](node, this.vm, expr)
		}
	}
	
	compile(fragment){
		let childNodes = fragment.childNodes
		// 此时childNodes只是最外层的，   需要递归获取所有
		Array.from(childNodes).forEach( node => {
			if(this.isElementNode(node)){
			//	是元素节点，还需要继续深入的检查
				console.log('element', node)
				// 这里需要编译元素
				this.compileElement(node)
				this.compile(node)
			}else{
			//  是文本节点
			// 这里需要编译文本
				this.compileText(node)
				console.log('text', node)
			}
		})
	}
	
	node2fragment(el){
		// 需要将el中的内容全部放到内存中
		// 文档碎片 内存中的 dom节点
		let fragment = document.createDocumentFragment()
		let firstChild
		while(firstChild = el.firstChild){
			fragment.appendChild(firstChild)
		}
		return fragment //是内存中的节点
	//	此时，el中的元素全被转移到fragment中，在dom中是个空的div
	// 	<div id="app">
	// 		<input type="text" v-model="message"/>
	// 		{{message}}
	// </div>
	//	最后变成 <div id="app"> </div>
	}
}
CompileUtil = {
	getVal(vm, expr) {  //获取实例上对应的数据
		// expr 属性名 v-model = 'message'中的message
		// 解决对象深层调用，eg message.a.b这类情景吓得值获取
		expr = expr.split('.')
		// 根据指定的分隔符将一个字符串分割成一个字符串数组
		// 如果expr为 message.a.b
		//  expr.split('.')返回为【'message'，'a','b'】
		// reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。
		console.log(expr,22)
		return expr.reduce((prev, next)=>{
			return prev[next]
		}, vm.$data)
		// vm.$data默认为prev
	},
	getTextVal(vm, expr){// 获取编译文本后的结果
		return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments)=>{
			return this.getVal(vm,arguments[1])
		})
	},
	text(node, vm, expr){ //文本处理
		let updateFn = this.updater['textUpdater']
		console.log(expr)
		let value = this.getTextVal(vm, expr)
		updateFn && updateFn(node, value)
	},
	model(node, vm, expr) {// 输入框处理
		let updateFn = this.updater['modelUpdater']
		updateFn && updateFn(node, this.getVal(vm, expr))
	},
	updater: {
		// 文本更新
		textUpdater(node, value){
			node.textContent = value
		},
		// 输入框更新
		modelUpdater(node, value) {
			node.value = value
		}
	}
	
}