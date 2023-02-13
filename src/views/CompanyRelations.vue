<template>
  <div class="relation-graph">
    <CompanyGraph />
  </div>
</template>

<style lang="less">
#app .wrds-footer {
  display: none;
}
</style>

<script>
import CompanyGraph from '@/components/CompanyGraph.vue'

export default {
  name: 'CompanyRelations',
  component: CompanyGraph,
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  components: { CompanyGraph }
}
</script>

<style lang="less" scoped>
.mb-2 {
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
}

</style>
