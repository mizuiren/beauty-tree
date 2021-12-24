# beauty-tree
文档树、目录树、折叠树，一维树实现方案及父子节点样式

特点：
* 一维dom结构，易于做虚拟滚动和动态渲染
* 原生js实现，无其他任何依赖
* 样式美观

使用：

页面引入qtree.js和qtree.css之后使用renderQtreeData渲染数据

    renderQtreeData(data, document.getElementById('tree-ul'));

容器元素必须是ul。