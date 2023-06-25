<template>
  <div class="container page-wrapper-container">
    <el-row>
      <el-col :offset="4">
        <h3>Form 10-K Itemization Demo</h3>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :offset="4"><ItemizationForm class="item-form" /></el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import ItemizationForm from '@/components/ItemizationForm.vue'

export default {
  name: 'PaperAbstract',
  components: {
    ItemizationForm
  }
}
</script>

<style lang="less" scoped>
.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: 15%;
    margin-left: 15%;
}
h3 {
  margin: 40px 0 0;
  text-align: left;
  font-size: 24px;
}
p {
  text-align: left;
}

.item-form {
  width: 70%;
}
</style>
