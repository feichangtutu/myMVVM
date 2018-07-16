/**
 * Created by jyn on 2018/7/15.
 */
class Observer {
	constructor(data){
		this.observe(data)
	}
	observe(data){
		//	要将这个数据原有的属性改成get和 set的形式
		// 非对象不能设置 get set
		if(!data || typeof(data)!== 'object'){
			return
		}
		// 要将数据一一劫持,先获取到data的key  value
		Object.keys(data).forEach(key => {
			// 劫持
			this.defineReactive(data, key, data[key])
			this.observe(data[key]) // 深度递归劫持
		})
	}
	// 定义响应式
	defineReactive(obj, key, value){
		let that = this
		// ???
		// 每个变化的数据，都会对应一个数组，这个数组是存放所有更新的操作
		let dep = new Dep()
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get(){// 取值时调用的方法
				// console.log(Dep.target)
				Dep.target && dep.addSub(Dep.target)
				return value
			},
			set(newValue){
				that.observe(newValue)
				// 当给data属性中设置值的时候，更改获取的属性的值
				if(newValue != value){
					value = newValue
				}
				dep.notify() //通知所有人，数据更新了
			}
		})
	}
}
class Dep{
	constructor(){
	//	订阅的数组
		this.subs = []
	}
	addSub(watcher){
		this.subs.push(watcher)
	}
	notify(){
		this.subs.forEach(watcher=>watcher.update())
	}
}