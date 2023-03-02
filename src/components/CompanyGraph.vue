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
// import { getCompanyGraph } from '../api/company-graph'

use([
  CanvasRenderer,
  GraphChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

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
      defaultGraphs: {
        SP500: sp500SampleGraph,
        DOW30: dow30SampleGraph
      },
      edgeColors: [
        { name: 'competition', color: 'red' },
        { name: 'unknown', color: 'black' }
      ],
      edgeColorMap: {
        unknown: 'lightgrey',
        other: 'lightgrey',
        competition: 'black'
      },
      chart: null,
      toEmphasize: [
        'MSFT', 'ZOOM', 'INTC', 'IBM', 'CSCO'
      ]
    }
  },
  async created () {
    // const graph = await getCompanyGraph(0, 1000)
    // const graph = null
    let graphType = this.$route.params.graphType
    graphType = graphType && this.defaultGraphs[graphType.toUpperCase()]
      ? this.$route.params.graphType
      : 'DOW30'
    const useGraph = this.defaultGraphs[graphType.toUpperCase()]

    const nodeLinks = useGraph.links.sort((a, b) => {
      const sourceIdA = parseInt(a.source)
      const sourceIdB = parseInt(b.source)

      if (sourceIdA < sourceIdB) {
        return -1
      } else if (sourceIdA > sourceIdB) {
        return 1
      } else {
        return 0
      }
    })
    const linkCount = {}
    nodeLinks.forEach(link => {
      if (!linkCount[link.source]) {
        linkCount[link.source] = 1
      } else {
        linkCount[link.source] += 1
      }
    })
    const nodes = useGraph.nodes.map(node => {
      let size = 10

      if (linkCount[node.id] > 10) {
        size = linkCount[node.id]
      }
      if (this.toEmphasize.includes(node.name)) {
        return {
          id: node.id,
          name: node.name,
          symbolSize: size,
          emphasized: true,
          itemStyle: {
            borderWidth: 4,
            borderColor: 'red'
          },
          label: {
            fontSize: '18px',
            fontWeight: 'bolder'
          }
        }
      } else {
        return {
          id: node.id,
          name: node.name,
          symbolSize: size
        }
      }
    })
    // const nodes = useGraph.nodes
    const links = useGraph.links.map(link => {
      return {
        id: link.id,
        category: link.category,
        source: link.source,
        target: link.target,
        lineStyle: {
          color: this.edgeColorMap[link.category],
          width: 2
        },
        label: {
          color: this.edgeColorMap[link.category]
        }
      }
    })

    const option = ref({
      backgroundColor: '#fff',
      title: {
        text: 'Company Relations',
        subtext: 'See how companies relate with each other',
        top: 'top',
        left: 'center',
        color: '#000'
      },
      tooltip: {},
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
          roam: true,
          label: {
            color: '#000',
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          edgeLabel: { // 边的设置
            show: true,
            position: 'middle',
            fontSize: 12,
            formatter: (params) => {
              return params.data.category
            }
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
