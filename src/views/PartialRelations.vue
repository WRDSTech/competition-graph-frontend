<template>
<div class="relation-graph">
    <h3>{{ title.toUpperCase()}}</h3>
    <PartialGraph />
</div>
</template>

<style lang="less">
#app .wrds-footer {
display: none;
}
</style>

<script>
import PartialGraph from '@/components/PartialGraph.vue'

export default {
  name: 'PartialRelations',
  component: PartialGraph,
  data () {
    return {
      title: '',
      searchTerm: ''
    }
  },
  mounted () {
    if (this.$route.params.graphType) {
      this.title = `${this.$route.params.graphType} Company Competition Graph`
    }
  },
  methods: {},
  components: { PartialGraph }
}
</script>

<style lang="less" scoped>
.mb-2 {
margin-bottom: 20px;
}

h3 {
margin-top: 0;
}

.el-main {
padding: 0 !important;
}

</style>
