# pynq入门（一）：Overlay和MMIO

近期我在闲鱼上看到一块百度赞助比赛剩余的全新的ultrascale XAZU3EG只要650元，于是果断捡漏，作为我人生第一块zynq/fpga开发板。于是打算系统地学习一下pynq。
感谢复旦朱老师为本开发板做的[pynq镜像](https://zhutmost.com/post/pynq-compile)，我直接借用过来运行。  

在sd卡烧录镜像，在zynq中启动后，我们需要用网线连接板卡和电脑，然后在zynq的linux终端中输入ip_addr查询ip地址,然后在电脑设置的网络与internet中给这个端口写入ipv4，然后就可以在浏览器的jupyter notebook中启动了。

## 下载bit、Pl与Ps互联

### Overlay()

将生成好的例程（zynq与bram互联）的.bit与.hwh文件用jupyter传到板卡中，然后新建一个python3文件。

```python
from pynq impoert Overlay, MMIO
```

导入两个库。  

```python 
ol = OverLay("bit文件地址")
```

可以把bit流烧录到pl端

```python
print(ol.is_loaded())
```

可以判断是否加载成功

```python 
ol.ip_dict
```

可以查到Overlay 里面所有 AXI IP 的信息表（字典），通过

```python
base = ol.ip_dict["axi_bram_ctrl_0"]["phys_addr"]
size = ol.ip_dict["axi_bram_ctrl_0"]["addr_range"]
```

可以查询到Ps与Pl连接总线的起始地址和地址范围。
> 作为字典，通过ip_dict.keys()就可以看到有几个key，从未知道有几个ip核。字典支持 **ip_dict["axi_bram_ctrl_0"]** 这样的访问，[]里必须是字符串。
>
>ip_dict 主要显示的是 PYNQ 能识别、能管理的 IP，尤其是带 AXI 地址映射的 IP。

### MMIO

在知道起始地址与范围之后，可以通过MMIO函数建立对axi的联系。

```python
bram = MMIO(base,size)
```

通过 **bram.write(offset,data) 和bram.read(offset)** 就可以完成读写。

```python
INPUT_BASE = 0x0000
OUTPUT_BASE = 0x0800
WEIGHT_BASE =0x0400
for i in range(16):
    bram.write(INPUT_BASE+i*4,i)
for i in range(16):
    bram.write(WEIGHT_BASE+i*4,100+i)
for i in range(16):
    print(bram.read(INPUT_BASE+i*4))
for i in range(16):
    print(bram.read(WEIGHT_BASE+i*4))
```