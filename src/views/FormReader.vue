<template>
  <div class="form-reader">
    <el-row>
      <Reader />
    </el-row>
    <el-backtop target=".reader"></el-backtop>
  </div>
</template>

<style lang="less">
#app .wrds-footer {
  display: none;
}
</style>

<script>
import Reader from '@/components/Reader.vue'

export default {
  name: 'FormReader',
  component: Reader,
  data () {
    return {}
  },
  mounted () {
  },
  methods: {},
  components: { Reader }
}
</script>

<style lang="less" scoped>
.mb-2 {
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  font-size: 1.2vw;
}

</style>
