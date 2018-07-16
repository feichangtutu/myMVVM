/**
 * Created by jyn on 2018/7/16.
 */
/**
 ** 观察者的目的，给需要变化的那个元素增加一个观察者
 ** 当数据变化后，执行对应的方法
***/

class Watcher{
	constructor(vm, expr, cb){
		this.vm = vm
		this.expr = expr
		this.cb = cb
		//	先获取旧值
		this.value = this.get()
	}
	get(){
		Dep.target = this
		let value = this.getVal(this.vm, this.expr)
		Dep.target = null
		return value
	}
	getVal(vm, expr) {
		expr = expr.split('.')
		return expr.reduce((prev, next)=>{
			return prev[next]
		}, vm.$data)
	}
	//	对外暴露的方法
	update(){
		let newValue = this.getVal(this.vm, this.expr)
		let oldValue = this.value
		if(newValue != oldValue){
			this.cb(newValue)
		}
	}
}
// 用新值和旧值进行对比，如果发生变化，就调用更新方法