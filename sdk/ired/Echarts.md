# Install the wechat Mini Program and use E-Charts

A short summary: This folder contains examples and instructions for integrating iREd BLE (Bluetooth Low Energy) devices—such as thermometers, oximeters, blood pressure monitors, scales, jump ropes, and heart rate monitors—into WeChat Mini Programs using the iREd Healthkit BLE module. It includes initialization steps, usage examples, and event callbacks for pairing, connecting, receiving device data, and handling errors.

1. 下载官方封装组件

   执行以下命令，一步完成下载、解压、移动并清理：

   ```bash
   curl -L https://github.com/ecomfe/echarts-for-weixin/archive/refs/heads/master.zip -o echarts-for-weixin.zip
   unzip echarts-for-weixin.zip
   mv echarts-for-weixin-master/ec-canvas ./components/
   rm -rf echarts-for-weixin-master echarts-for-weixin.zip
   ```

   下载完成后的目录结构：

   ```
   components/
    └── ec-canvas/
   ```

5. 使用 ECharts

   1. 在WXML中添加图表组件

      ```html
      <view class="chart-container">
        <ec-canvas id="history-chart" canvas-id="historyChart" ec="{{ ec }}"></ec-canvas>
      </view>
      ```

   2. 在JavaScript文件中引入并初始化
   
      ```javascript
      import * as echarts from '../../components/ec-canvas/echarts';
      
      Page({
        data: {
          ec: {
            onInit: initChart
          }
        }
      });
      
      function initChart(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
        canvas.setChart(chart);
      
        const option = {
          title: { text: '温度多折线示例', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Adult Forehead', 'Child Forehead', 'Ear Canal', 'Object'], top: 30 },
          grid: { containLabel: true, top: 70, bottom: 20 },
          xAxis: { type: 'category', data: ['t1','t2','t3','t4','t5','t6'] },
          yAxis: { type: 'value', name: '℃' },
          series: [
            { name: 'Adult Forehead', type: 'line', data: [36.5,36.6,36.7,36.8,36.6,36.7] },
            { name: 'Child Forehead', type: 'line', data: [36.2,36.3,36.4,36.5,36.3,36.4] },
            { name: 'Ear Canal', type: 'line', data: [37.0,37.1,37.0,37.2,37.1,37.0] },
            { name: 'Object', type: 'line', data: [25,26,24,23,24,25] }
          ]
        };
      
        chart.setOption(option);
        return chart;
      }
      ```
      
      
      
   3. 在json文件
   
      ```json
      {
        "usingComponents": {
          "ec-canvas": "/components/ec-canvas/ec-canvas"
        }
      }
      ```
   
   4. 设置必要的css
   
      ```css
      .chart-container {
        width: 100%;
        height: 500rpx;
      }
      ec-canvas {
        width: 100%;
        height: 100%;
      }
      ```
      
      
