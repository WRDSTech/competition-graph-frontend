<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chart" />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GraphChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, defineComponent } from 'vue'
import dow30SampleGraph from '@/assets/data/dow30_relation_backend.json'
import sp500SampleGraph from '@/assets/data/sp500_relation_backend.json'

use([
  CanvasRenderer,
  GraphChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

// const sampleData = await fetch('/data/sample.json').catch()

export default defineComponent({
  name: 'CompanyGraph',
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  data () {
    return {
      dow30SampleGraph,
      sp500SampleGraph,
      nodes: [{
        name: 'Node 1'
      }, {
        name: 'Node 2',
        x: 200,
        y: 200
      }, {
        name: 'Node 3',
        x: 300,
        y: 300
      }],
      edges: [{
        source: 0,
        target: 1
      }, {
        source: 1,
        target: 2
      }],
      chart: null
    }
  },
  created () {
    console.log(this.sp500SampleGraph.nodes)
    const nodes = this.sp500SampleGraph.nodes
    const links = this.sp500SampleGraph.links

    const option = ref({
      backgroundColor: 'rgb(40, 44, 52)',
      title: {
        text: 'Company Relations',
        subtext: 'See how companies relate with each other',
        top: 'top',
        left: 'center'
      },
      tooltip: {},
      // legend: [{
      //   // selectedMode: 'single',
      //   data: sampleData.categories.map(function (a) {
      //     return a.name
      //   })
      // }],
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: 'sample',
          type: 'graph',
          layout: 'force',
          force: { // 力引导布局相关的配置项
            repulsion: 80, // 节点之间的斥力因子
            gravity: 0.02, // 节点受到的向中心的引力因子 越大越往中心靠拢
            edgeLength: 240, // 边的两个节点之间的距离
            layoutAnimation: false // 显示布局的迭代动画
          },
          edgeSymbol: ['none', 'none'],
          data: nodes,
          links,
          // categories: sampleData.categories,
          roam: true,
          label: {
            position: 'right',
            formatter: '{b}'
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10
            }
          }
        }
      ]
    })

    this.chart = option
  }
})
</script>

<style scoped>
.chart-container {
  flex: 1;
  margin-bottom: 5px;
}

.chart {
  height: 75vh;
}
</style>
