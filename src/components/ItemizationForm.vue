<template>
    <div class="itemization-form">
      <el-form :model="form" label-position="top" label-width="120px">
        <el-form-item class="form-label" label="Please select one of our samples" :label-width="formLabelWidth">
          <br/>
          <el-select
            class="sample-form-selector"
            v-model="form.sample"
            :disabled="form.externalURL.length > 0"
            clearable
            placeholder="Please select a company"
            :loading="selectLoading"
            @visible-change="getSamples">
            <el-option v-for="option in sampleOptions" :label="option.label" :value="option.value" :key="option.label"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item class="form-label" label="Paste a link from SEC website. Only HTML files are supported in this demo." :label-width="formLabelWidth">
          <div class="hint">
            <span>
              <a href="https://www.sec.gov/Archives/edgar/data/789019/000156459022026876/0001564590-22-026876.txt"
                  target="_blank"
                  style="color: #51ADEB; font-size: 1.4vw !important;">
                  <i class="el-icon-s-data"></i>  Sample Link
              </a>
            </span>
            <span>
              &nbsp; &nbsp;
              <a href="https://www.sec.gov/edgar/searchedgar/companysearch" target="_blank"
                  style="color: #51ADEB; font-size: 1.4vw !important;">
                  <i class="el-icon-search"></i>  Search a company
              </a>
            </span>
          </div>
          <el-input v-model="form.externalURL" :disabled="form.sample.length > 0" clearable autocomplete="off"></el-input>
          <span class="input-hint" v-show="showHint">Only raw files ending in .txt are supported. See the sample link above.</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Submit</el-button>
          <el-button type="secondary" @click="$router.push('/')">Back</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import { getSampleList } from '../api/form-itemization'
import companyList from '@/assets/data/companies.json'

export default {
  props: {
    showForm: Boolean
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.showForm
      },
      set (val) {
        console.log(val)
        return this.showForm
      }
    }
  },
  data () {
    return {
      dialogTableVisible: false,
      fullscreenLoading: false,
      sampleOptions: [],
      selectLoading: false,
      form: {
        externalURL: '',
        sample: ''
      },
      showHint: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    async getSamples () {
      this.selectLoading = true
      let samples = null

      try {
        samples = await getSampleList()
        samples = samples === null ? companyList : samples
        if (!samples || !samples.ticker_map) {
          throw new Error('Failed to receive sample list from remote. Fall back to local cache.')
        }
        this.sampleOptions = Object.keys(samples.ticker_map).map((ticker) => {
          const splitted = samples.ticker_map[ticker].split('/')
          const fileName = splitted[splitted.length - 1]
          const filingName = fileName.split('.')[0]
          return { label: ticker, value: filingName }
        })
        this.selectLoading = false
      } catch (error) {
        console.error(error)
        this.sampleOptions = companyList.map((sample) => { return { label: sample, value: sample } })
        this.selectLoading = false
      }
    },
    onSubmit () {
      const selectedSample = this.form.sample
      const externalSourceUrl = this.form.externalURL
      const secURLPattern = /^https:\/\/(www\.)?sec\.(gov|report)?\/(Archives|Document)\/edgar\/data\/(\d+(\/?(-?))){1,}(.txt)$/gm

      if (selectedSample.length) {
        this.$router.push({
          name: 'FormReader',
          params: { ticker: selectedSample }
        })
      } else if (secURLPattern.test(externalSourceUrl)) {
        this.showHint = false
        this.$router.push({
          name: 'FormReaderByURL',
          query: { url: externalSourceUrl }
        })
      } else {
        if (!this.showHint) {
          this.showHint = true
        }

        return false
      }
    }
  }
}
</script>

<style lang="less">
.el-form-item {
  text-align: left;
}

h3 {
  font-size: 2vw !important;
}

.el-form--label-top .el-form-item__label {
  padding: 0;
  color: white;
  font-size: 1.2vw;
}

.sample-form-selector {
  width: 50%;
}

.hint {
  margin: 30px 0 30px 0;
}

.input-hint {
  color: red;
  font-weight: bold;
  font-size: 0.7vw;
  margin: 10px 0 10px 0;
}

.el-input__inner {
  font-size: 1.1vw !important;
  padding: 30px 0 30px 10px;
}
.el-select-dropdown__item span {
  font-size: 1.1vw !important;
  margin: 30px 0 30px 0 !important;
}

.el-select-dropdown__item {
  margin: 5px 0 5px 0 !important;
}

.form-label {
  color: white !important;
}

button span{
  font-size: 1.3vw !important;
}

.el-select .el-input .el-select__caret {
  font-size: 24px;
  color: rgb(93, 93, 93);
  font-weight: bold;
}
</style>
