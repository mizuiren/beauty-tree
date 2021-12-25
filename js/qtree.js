(function () {
	//配置
	const liHeight = 22, //行高
		gap = 10;//折叠或展开按钮之间的距离
	/**
	 * [主函数，递归渲染数组成有层次结构的dom树]
	 * @param  {[Array]} _data                [需要渲染的数据]
	 * @param {[HTMLUListElement]} container  [树的容器，dom对象]
	 * @return {[String]}                     [一维li列表的html dom字符串]
	 * {[数据格式]}
	 [
	 {
		title: 'xxxxx3333333',
		id: 3,
		children: [
			{
				title: 'xxxxx3333333.1',
				id: 4
			},
			{
				title: 'xxxxx3333333.4',
				id: 7,
				children: [
					{
						title: 'xxxxx3333333.4.1',
						id: 8
					},
					{
						title: 'xxxxx3333333.4.2',
						id: 9
					},
					{
						title: 'xxxxx3333333.4.3',
						id: 10
					},
				]
			},
		]
	},
	 {
		title: 'xxxxx4444444',
		id: 12
	}
	 ];
	 */
	window.renderQtreeData = function(_data, container) {
		if(container.tagName !== 'UL') {
			throw new Error('容器必须是ul元素')
		}
		container.className = (container.className || '') + ' qtree';
		let html = render(_data);
		/**
		 * @param  {[Array]} _data        [需要渲染的数据]
		 * @param  {Number} space         [缩进单位，一个单位表示两个文字]
		 * @param  {[String]} _parent     [所属父级的id,没有父级则为空]
		 * @param  {String} childrenStatu [子节点是否展开可见，open展开（显示），close折叠（隐藏）]
		 */
		function render(_data, space = 0, _parent = '', childrenStatu = 'open') {
			let html = '';
			for(let i = 0; i < _data.length; i++) {
				const obj = _data[i];
				const display = childrenStatu === 'open' ? 'block' : 'none';
				const status = obj.children && obj.childrenStatu === 'close' ? 'close' : 'open';

				let guildlineHeight = gap;
				if(obj.children) {
					const showLiCount = countShowChildLi(obj.children);
					guildlineHeight = obj.childrenStatu === 'close' ? gap : showLiCount * liHeight + gap;
				}
				if(i === _data.length - 1) {
					guildlineHeight = 0;
				}
				html += `<li data-id="${obj.id}" parent="${_parent}" has_child="${obj.children && obj.children.length ? 1 : 0}" class="space${space}" style="padding-left:${space * 2}em;display:${display};">
			<div class="con">
				<i class="bg-icon ${status}" onclick="toggleChildren(this);"><i></i><span class="guildline" style="height:${guildlineHeight}px;"></span></i>
				<span class="title">${obj.title}</span>
			</div>
		</li>`;
				if(obj.children) {
					html += render(obj.children, space + 1, obj.id, obj.childrenStatu);
				}
			}
			return html;
		}
		container.innerHTML = html;
		return html;
	}

	//从数据层面递归计算显示子节点个数
	function countShowChildLi(arr) {
		let count = 0;
		for(let child of arr) {
			count++;
			if(child.children && child.childrenStatu !== 'close') {
				count += countShowChildLi(child.children);
			}
		}
		return count;
	}

	//点击展开折叠按钮事件动作，寻找子节点，把子节点隐藏或显示
	windows.toggleChildren = function(ele) {
		const $li = ele.parentNode.parentNode;
		const liId = $li.getAttribute('data-id');
		const type = ele.className.match(/\bopen\b/) ? 'open' : 'close';
		_toggle(liId);
		//按钮和竖线样式更换
		if(type === 'open') {
			ele.className = ele.className.replace(/\bopen\b/, 'close');
		} else {
			ele.className = ele.className.replace(/\bclose\b/, 'open');
		}
		resetGuidline($li);
		//调节竖线的高度
		function resetGuidline(li) {
			const _parent = li.getAttribute('parent');
			resetChid(li);
			if(_parent) {
				resetGuidline(document.querySelector('[data-id="'+_parent+'"]'));
			}
			function resetChid(li) {
				const hasChild = li.getAttribute('has_child');
				const guildLine = li.querySelector('.guildline');
				if(hasChild === '1') {
					const childLength = countShowLi(li.getAttribute('data-id'));
					guildLine.style.height = childLength ? (childLength * liHeight + gap) + 'px' : '10px';
				} else {
					guildLine.style.height = '10px';
				}
			}
		}
		function _toggle(id, recursive) {
			for(let child of document.querySelectorAll('[parent="'+id+'"]')) {
				if(recursive) {
					//下下级..
					const hideByCodeClass = 'hide-by-code';
					const oldDisplay = child.style.display;
					if(type === 'open' && oldDisplay !== 'none') {
						child.style.display = 'none';
						child.setAttribute(hideByCodeClass, 1);//也要隐藏，并打上标记：程序隐藏而非用户隐藏
					} else if(type === 'close' && oldDisplay === 'none') {
						const isHideByCode = child.getAttribute(hideByCodeClass);
						if(isHideByCode) {
							child.style.display = 'block';//如果是程序隐藏的此时要显示，如果是用户隐藏的不要显示
							child.removeAttribute(hideByCodeClass);
						}
					}
				} else {
					child.style.display = type === 'open' ? 'none' : 'block';
				}
				if(child.getAttribute('has_child') === '1') {
					_toggle(child.getAttribute('data-id'), true);
				}
			}
		}
		//从dom层面递归计算显示子节点个数
		function countShowLi(id) {
			const lis = document.querySelectorAll('[parent="'+id+'"]');
			let count = 0;
			for(let child of lis) {
				if(child.style.display === 'block') {
					count++;
				}
				if(child.getAttribute('has_child') === '1') {
					count += countShowLi(child.getAttribute('data-id'));
				}
			}
			return count;
		}
	}
})();