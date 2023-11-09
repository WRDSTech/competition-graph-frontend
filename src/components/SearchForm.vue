<template>
  <div class="container">
    <div class = "container-form">
    <el-form class="search-form" :model="form" label-position="top">
      <h3 class="title">Search a Company</h3>
      <el-form-item label="Company Name" class="form-item">
        <el-autocomplete
          class="inline-input"
          v-model="form.companyName"
          placeholder="(hardcoded autocomplete)Please enter a company name or ticker, e.g. MSFT"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="How many layers of relationship to expand"  class="form-item">
        <el-input
          class="graphSearch"
          v-model="form.lays"
          placeholder="1"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="Relationship shown"  class="form-item">
        <el-checkbox v-model="form.checkCompete" >Competetion</el-checkbox>
        <el-checkbox v-model="form.checkProd" >Product</el-checkbox>
        <el-checkbox v-model="form.other" >Other</el-checkbox>
        <el-checkbox v-model="form.unkown" >Unkown</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"><b>Go!</b></el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>
<script>
import { use } from 'echarts/core'
import axios from 'axios'
import { CanvasRenderer } from 'echarts/renderers'
import { GraphChart } from 'echarts/charts'
import { Autocomplete, Checkbox } from 'element-ui'
import { THEME_KEY } from 'vue-echarts'
import { defineComponent, h } from 'vue'
import companyNames from '@/assets/data/company_name.json'
// import { getCompanyGraph } from '../api/company-graph'

use([
  CanvasRenderer,
  GraphChart
])

export default defineComponent({
  name: 'SearchPage',
  components: {
    h,
    Autocomplete,
    Checkbox
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  data () {
    return {
      companyNameSuggest: [],
      form: {
        companyName: '',
        lays: '',
        checkCompete: true,
        checkProd: true,
        unkown: true,
        other: true
      }
    }
  },
  methods: {
    querySearch (queryString, cb) {
      var restaurants = this.companyNameSuggest
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchId (name) {
      const data = companyNames
      let id = 0
      data.forEach(element => {
        if (element.value === name) {
          id = element.id
        }
      })
      return id
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      return companyNames
    },
    handleSelect (item) {
      console.log(item)
    },
    async onSubmit () {
      const id = this.searchId(this.form.companyName)
      let lays = this.form.lays
      if (lays === '') {
        lays = 1
      }
      const comp = this.form.checkCompete
      const prod = this.form.checkProd
      const other = this.form.other
      const unkown = this.form.unkown
      this.$router.push('partial-graph/' + id + '/' + lays + '/' + comp + '/' + prod + '/' + other + '/' + unkown)
    },
    fetchCompetitors (companyName) {
      axios.get(`/competitors/${companyName}`)
        .then(response => {
        // Handle the response from the API
        // You can update the component's data or perform any other actions based on the response
          console.log(response.data)
        })
        .catch(error => {
        // Handle the error if the API request fails
          console.error(error)
        })
    }
  },
  async created () {
    // const graph = await getCompanyGraph(0, 1000)
    // const graph = null
  },
  mounted () {
    this.companyNameSuggest = this.loadAll()
    console.log(this.companyNameSuggest)
  }
})
</script>

<style scoped>
@import 'element-ui/lib/theme-chalk/index.css';
.container {
  flex: 1;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-form{
  flex: 1;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-form {
  background-image: url('https://i.ibb.co/kBvCPSF/1543.jpg');
  width: 33%;
  border-radius: 2ch;
  padding: 20px;
  box-sizing: border-box;
}

.row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.item1 {
  text-align: left;
  width: 90%;
}
.item3 {
  text-align: left;
  width: 90%;
  margin-bottom: 0px;
  height: 50px;
}

.title {
  text-align: left;
  color: black;
}

.item2 {
  margin-top: 0px;
  width: 90%;
}
.el-input .el-input__inner::placeholder {
  font-style: italic; /* Set the placeholder text to italic */
}
.item4 {
  margin-top: 40px;
  margin-bottom: 50px;
}
.form-item {
  margin-bottom: 10px;
}

.form-label {
  display: block;
  color: black;
  margin-bottom: 5px;
}
.form-item{
  text-align: left;
}
.el-autocomplete {
  width: 100%;
}
</style>
