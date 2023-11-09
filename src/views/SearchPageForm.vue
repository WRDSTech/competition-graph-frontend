<template>
  <div class="relation-graph">
    <h3>{{ title.toUpperCase() }}</h3>

    <SearchPage />
  </div>
</template>

<style lang="less">
#app .wrds-footer {
  display: none;
}
</style>

<script>
import SearchPage from '@/components/SearchForm.vue'

export default {
  name: 'SearchPageForm',
  component: SearchPage,
  data () {
    return {
      title: '',
      searchTerm: ''
    }
  },
  mounted () {
    if (this.$route.params.graphType) {
      this.title = `${this.$route.params.graphType} Company SearchPage Graph`
    }
  },
  methods: {},
  components: { SearchPage }
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
