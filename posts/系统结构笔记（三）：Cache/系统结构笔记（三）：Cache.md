# Cache

## Cache一般设计

cache出现背景是存储器技术发展速度追不上处理器速度增长。
现代超标量处理器都是哈佛结构，有两个cache：I-Cache,D-Cache。
> L1 cache主要由sram实现，追求目标是“快”，是每个核私有的。L1 D-Cache可能需要多端口
>
> L2 cache追求目标是“全”，L2有可能是多核间共享的（现代处理器一般共享L3）。L2不需要多端口设计，延迟也不是特别重要。

Cache主要由两个部分组成，Tag和Data。

1. Data：用来保存一片连续地址空间的数据。  
2. Tag：用来存储这片连续数据的公共地址。
3. Cache Line：一个tag和它对应的所有数据组成的一行
4. Cache Block(data block): Cache中的数据部分
5. Cache set：能被同一个地址找到的多个Cache line被称为Cache set 

![cache示意图](posts\系统结构笔记（三）：Cache\组相连Cache结构png.png)

影响Cache miss的3C定理：

1. Compulsory ：第一次被访问的数据/指令肯定不在Cache中。
2. Capcity    ：容量越大，缓存的内容越多。
3. Conflict   : 多个数据映射到了同一个位置。一个2-way的组相联Cache，使用的三个数据属于一个Cache set ，那么就会经常发生缺失。可以使用victim Cache。

## Cache的组织方式

### 直接映射

![直接映射](posts\系统结构笔记（三）：Cache\直接映射png.png)
&emsp;&emsp;使用index来从Cache中找到一个对应的Cache line，但是所用index相同的地址都会寻址到这个Cache line，就会产生冲突。（直接映射一大缺点，如果两个index相同的存储器地址交互访问Cache就会一直导致Cache miss）  
&emsp;&emsp;只有当地址中的tag和Cache中的tag相同时，才表明Cache line中是想要的。  
&emsp;&emsp;在Cache line中还有一个有效位，用来标记Cache line是否有效，只有之前被访问，有效位才会置1。  
&emsp;&emsp;不需要替换算法，执行效率最低。

### 组相联

![组相联](posts\系统结构笔记（三）：Cache\组相连Cache结构png.png)
&emsp;&emsp;依然通过index对Cache进行寻址，但是可以得到多个Cache line（一个Cache set）。需要比较tag来确定是不是需要。
&emsp;&emsp;需要从多个Cache line中选择一个匹配结果，所以比直接映射的延迟更大，必要时可以进行流水线。

1. 并行访问结构：
![并行访问](posts\系统结构笔记（三）：Cache\并行访问.png)
Cache访问一般都是处理器中的关键路径，如果一个周期完成访问，会占据很大延迟。所以使用流水线。对于I-Cache，流水线不会有太大影响，，依旧可以实现每周期读取指令。而对于D-Cache来说，会大大增加load指令延迟。

![并行访问流水线](posts\系统结构笔记（三）：Cache\并行流水线.png)

2. 串行访问结构：
![串行流水线](posts\系统结构笔记（三）：Cache\串行流水线.png)
读取速度更快，但是增加了一个访问周期。

比较：串行流水线相比于并行流水线，少了多路选择器，降低了访问tag/data ram延迟。

- 并行：时钟频率低、功耗大，但是访问缩短一个周期。顺序处理器没有指令调度，所以访问Cache增加一个周期，会引起性能降低，所以适合用并行访问。
- 串行：时钟频率高，超标量处理器中可以将访问Cache时间填充其他指令，所以多一个周期性能影响不大。

### 全相连

&emsp;&emsp;数据可以放在任意一个Cache line中，地址也不再有index部分，而是直接在整个Cache中进行tag比较，找到匹配结果。
&emsp;&emsp;使用这种内容寻址的存储器（CAM）来存储tag,数据存储在普通ram中。
&emsp;&emsp;全相连有最大自由度，所以缺失率最低，但是有大量内容比较因此延迟也是最大的。TLB中使用。

## Cache的写入

- 写通（write through）：数据写到D-Cache时，也写到下级存储器。
- 写回（write back）：数据写到D-Cache后，将被写入的Cache line做一个dirty标记，不写到下级存储器，只有这个dirty Cache要被替换时，才写到下级存储器。
- non-write allocate：写缺失时，将数据直接写到下级存储器。
- write allocate：写缺失时，先从下级存储其把这个发生缺失的地址对应的数据块取出来，将要写入D-Cache中的数据合并到数据块中，然后被修改的数据块写到D-Cache中。

写通与non-write allocate一起使用：
![写通](posts\系统结构笔记（三）：Cache\写通与non-write_allocate.png)

写回与write allocate一起使用：
![写回](posts\系统结构笔记（三）：Cache\写回与write_allocate.png)

## Cache的替换策略

1. 近期最少使用法（LRU）
2. 随即替换法

## 提高Cache性能

### 写缓存

### 流水线

### 多级结构

### Victim Cache

### 预取