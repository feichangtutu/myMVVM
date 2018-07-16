# myMVVM
try to write a simple vue mvvm

##
重点：
*ES6*： 
- class 

[es6 class link](http://es6.ruanyifeng.com/#docs/class#new-target-%E5%B1%9E%E6%80%A7)
>new.target 属性 
>> new是从构造函数生成实例对象的命令。ES6 为new命令引入了一个new.target属性，
该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。
如果构造函数不是通过new命令调用的，new.target会返回undefined，
因此这个属性可以用来确定构造函数是怎么调用的。

eg:

    get(){
    		Dep.target = this
    		let value = this.getVal(this.vm, this.expr)
    		Dep.target = null
    		return value
    	}
    get(){// 取值时调用的方法
    				// console.log(Dep.target)
    				Dep.target && dep.addSub(Dep.target)
    				return value
    			},

*ES5*
- Object.defineProperty 
[MDN参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

``Object.defineProperty(obj, prop, descriptor)
``
>该方法允许精确添加或修改对象的属性。
通过赋值来添加的普通属性会创建在属性枚举期间显示的属性（for...in 或 Object.keys 方法）， 
这些值可以被改变，也可以被删除。这种方法允许这些额外的细节从默认值改变。默认情况下，使用Object.defineProperty()添加的属性值是不可变的。

>>对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的。存取描述符是由getter-setter函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。
数据描述符和存取描述符均具有以下可选键值：

+ configurable
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
enumerable
当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
数据描述符同时具有以下可选键值：

+ value
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
writable
当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
存取描述符同时具有以下可选键值：

+ get
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。
默认为 undefined。
+ set
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
默认为 undefined。

eg:

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

*数组方法* 
+ reduce

   ``arr.reduce(callback[, initialValue])``
   
   参数:
   - callback
       + accumulator
         累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（如下所示）。
       + currentValue
         数组中正在处理的元素。
       + currentIndex可选
         数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1。
       + array可选
         调用reduce的数组
     
   - initialValue可选
     用作第一个调用 callback的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。
  
 eg:
 
    getVal(vm, expr) {
    		expr = expr.split('.')
    		return expr.reduce((prev, next)=>{
    			return prev[next]
    		}, vm.$data)
    	}
    
    
*fragment操作*

    let fragment = document.createDocumentFragment();

>DocumentFragments 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。
 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流(reflow)(对元素位置和几何上的计算)。因此，使用文档片段document fragments 通常会起到优化性能的作用(better performance)。
>[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)

eg:

    if(this.el){
    			// 如果这个元素能获取到才开始编译
    			// 1. 先把这些真实的DOM转入到内存中 应用fragment
    			let fragment = this.node2fragment(this.el)
    			// 2. 编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
    			this.compile(fragment)
    			// 3. 把编译好的fragment再塞回到页面
    			this.el.appendChild(fragment)
    		}
    
*node*
+ nodeType
> 
常量 | 值 |描述
-----|----|----
Node.ELEMENT_NODE	|1	| 一个 元素 节点，例如 <p> 和 <div>
Node.TEXT_NODE	|3	| Element 或者 Attr 中实际的  文字
+ [nodeValue](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue)
> value是一个包含当前节点的值的字符串（如果有的话）。<br/>
  对于文档节点来说, nodeValue返回null. 对于text, comment, 
  和 CDATA 节点来说, nodeValue返回该节点的文本内容. 
  对于 attribute 节点来说, 返回该属性的属性值.

+ [attributes](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes)
>Element.attributes 属性返回该元素所有属性节点的一个实时集合。<br/>
该集合是一个 NamedNodeMap 对象，不是一个数组，所以它没有 数组 的方法，
其包含的 属性 节点的索引顺序随浏览器不同而不同。更确切地说，
attributes 是字符串形式的名/值对，每一对名/值对对应一个属性节点。

var attr = element.attributes;
eg:

    //	核心方法
    	compileElement(node){
    	//	带 v-model v-text v-*等
    	//	取出当前节点的属性
    		let attrs = node.attributes
    		// console.log(attrs) // 0: type 1:v-model
    		Array.from(attrs).forEach( attr => {
    			// console.log(attr.name,1)
    			//判断属性名字是不是包含v-
    			let attrName = attr.name
    			// console.log(this.isDirective(attrName))
    			if(this.isDirective(attrName)){
    				// 取到对应的值放到节点的值中
    				let expr = attr.value
    				// console.log('属性名 :'+expr)
    				//	node vm.$data expr
    				let [,type] = attrName.split('-')
    				CompileUtil[type](node, this.vm, expr)
    			}
    		})
    	}
    	
