<template>
  <div class="chart-container">
    <!-- <el-input class="graphSearch" v-model="searchTerm" placeholder="Search for node"></el-input> -->
    <div class="search__container">
      <!-- nollie add this -->
      <input class="search__input" v-model="searchTerm" type="search" placeholder="Search">
    </div>
    <v-chart ref="vchart" class="chart" :option="chart" />
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
import { getCompanyGraph } from '../api/company-graph'

use([
  CanvasRenderer,
  GraphChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default defineComponent({
  name: 'PartialGraph',
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  watch: {
    searchTerm () {
      const matchingNodes = this.useGraph.nodes.filter(
        node => node.name === this.searchTerm
      )
      console.log(matchingNodes)
      const vchart = this.$refs.vchart
      // const nodeData = chart.getOption().series[0].data.find(data => data.id === nodeId);

      if (matchingNodes.length > 0) {
        const nodeIds = matchingNodes.map(node => node.id)
        vchart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          nodeIds
        })
        // vchart.dispatchAction({
        //   type: 'dataZoom',
        //   dataZoomId: 'dataZoomX',
        //   startValue: xValue - 50, // or any other value that centers the node
        //   endValue: xValue + 50
        // })
      } else {
        vchart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0
        })
      }
    }
  },
  methods: {
    handleChartReady (chartInstance) {
      chartInstance.on('click', this.handleNodeClick)
      console.log(1)
    },
    handleNodeClick (params) {
      // Handle the node click event here
      console.log('Node clicked:', params.data)
    }
  },
  data () {
    return {
      dow30SampleGraph,
      sp500SampleGraph,
      searchTerm: '',
      defaultGraphs: {
        SP500: sp500SampleGraph,
        DOW30: dow30SampleGraph
      },
      useGraph: null,
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
    try {
      console.log(this.$route.params)
      const graph = await getCompanyGraph(this.$route.params.id, this.$route.params.layers, this.$route.params.comp, this.$route.params.prod, this.$route.params.other, this.$route.params.unkown)
      if (graph && graph.links && graph.nodes) {
        console.log(graph)
        // graphType = graphType && this.defaultGraphs[graphType.toUpperCase()]
        //   ? this.$route.params.graphType
        //   : 'DOW30'
        const useGraph = graph
        this.useGraph = useGraph

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
          animationDuration: 150,
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
              focusNodeAdjacency: true,
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
        // this.chart.on('click', (params) => {
        //   // Handle the node click event here
        //   console.log('Node clicked:', params)
        // })
      } else {
        console.log('Invalid graph data')
      }
    } catch (error) {
      console.error('Error fetching company graph:', error)
    }
  },
  // const graph = null
  mounted () {
    this.$nextTick(() => {
      const vchart = this.$refs.vchart
      vchart.chart.on('click', this.handleNodeClick)
    })
  }
  // mounted () {
  //   const vchart = this.$refs.vchart
  // }
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

.graphSearch {
  width: 20%;
  padding-bottom: 10px;
}

/* nollie from here */
.search__input::placeholder {
  text-align: left;
  padding-left: 20px;
}

.search__container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  font-size: 80%;
}
.search__input {
  width: 15rem;
  padding: 9.6px 19.2px;
  transition: transform 250ms ease-in-out, box-shadow 250ms ease-in-out;
  font-size: 12px;
  line-height: 15px;
  color: #575756;
  background-color: white;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 18px 18px;
  background-position: 5% center;
  border-radius: 50px;
  border: none;
  border-bottom: 2px solid rgb(217, 192, 175);
  box-shadow: 0 0 5px rgba(228, 181, 181, 0.2);
  transition: all 250ms ease-in-out;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  text-indent: 15px;
}
</style>
