# weiqi-board
# 说明

这是一个由H5 canvas 绘制的围棋棋盘,具备落子显示等基本功能。你可以自由修改，分发本脚本。

# 介绍

> 以下内容会根据项目实际需求不定期更改

## 依赖

``JQuery``

## API说明


本棋盘的所有API均为对象``game``的属性,``x,y``分别为棋盘坐标,``side``为势力(1 -> black/ 2 -> white)

 * setup()

必须调用，用于初始化棋盘。监听鼠标点击。

 * drawBackground()

用于绘制棋盘背景。

 * drawChess(x,y,side)

用于绘制单个棋子。

 * board

以一维数组的形式存储当前的棋盘状态(0 -> empty/ 1 -> black/ 2 -> white)。

 * flush()

利用当前的棋盘状态``board``刷新显示整个棋盘。

 * playAt(x,y,side)

请求在该位置落子,可以用作之后规则判断的一个接口

 * step

存储游戏过程中的每一步骤


