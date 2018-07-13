/**
 * Created by jyn on 2018/7/12.
 */
class MVVM{
	constructor(options){
	//先把可用的东西挂载在实例上
		this.$el = options.el
		this.$data = options.data
		//如果有要编译的模板，先编译
		if(this.$el){
			//用数据和元素进行编译
			new Compile(this.$el, this)
		}
	}
}