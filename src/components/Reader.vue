<template>
  <div class="reader">
    <el-row class="reader-container" type="flex" justify="center">
      <el-col class="main-container bordered" :span="18">
        <el-row class="button-container" justify="space-between">
          <el-col :span="8"><h4 class="form-title">Form 10-K Reader</h4></el-col>
          <el-col :span="16" class="buttons">
            <el-button type="success" size="small" @click="$router.push('/sample-form')" icon="el-icon-plus">Open New Form</el-button>
            <el-button type="primary" size="small" @click="downloadFile('txt')" icon="el-icon-document">Export as Text</el-button>
            <el-button type="primary" size="small" @click="downloadFile('html')" icon="el-icon-discover">Export as HTML</el-button>
          </el-col>
        </el-row>
        <hr>
        <el-row class="content-container">
          <el-col class="content">
            <div class="html-wrapper" v-html="sampleHTML"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="index-container bordered" :span="4">
        <h3>Sections</h3>
        <el-tree
          class="sections"
          :default-expand-all="true"
          :data="navBarData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-checked-keys="[0]"
        ></el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSample, newItemizedFormByURL } from '../api/form-itemization'
import AAPL from '@/assets/data/sample_data/AAPL.json'
import MSFT from '@/assets/data/sample_data/MSFT.json'
import VZ from '@/assets/data/sample_data/VZ.json'
import UNH from '@/assets/data/sample_data/UNH.json'
import WMT from '@/assets/data/sample_data/WMT.json'
import AXP from '@/assets/data/sample_data/AXP.json'

// import { Loading } from 'element-ui'

export default {
  name: 'Reader',

  data () {
    return {
      navBarData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      samples: {
        '2021 VZ': VZ,
        '2021 UNH': UNH,
        '2020 AAPL': AAPL,
        '2020 WMT': WMT,
        '2019 MSFT': MSFT,
        '2019 AXP': AXP,
        MSFT,
        AAPL,
        VZ,
        UNH,
        WMT,
        AXP
      },
      filingNames: {
        '2021 VZ': '0000320193-22-000108', // require change
        '2021 UNH': '0000320193-22-000108', // require change
        '2020 AAPL': '0000320193-22-000108',
        '2020 WMT': '0000320193-22-000108', // require change
        '2019 MSFT': '0000320193-22-000108', // require change
        '2019 AXP': '0000320193-22-000108' // require change
      },
      loading: {},
      html_file_link: '',
      text_file_link: '',
      currentSection: '',
      sections: [],
      sampleForm: [],
      sampleHTML: ''
    }
  },
  async mounted () {
    if (this.$route.params.ticker && this.$route.params.ticker.length) {
      await this.getSampleItemizedForm(this.$route.params.ticker)
      this.updateNavigationData()
      if (this.sections.length) {
        this.updateCurrentSection(this.sections[0])
        this.updateContent()
      }
    } else if (this.$route.query.url && this.$route.query.url.length) {
      const url = this.$route.query.url
      await this.getItemizedFormByURL(url)
      this.updateNavigationData()
      if (this.sections.length) {
        this.updateCurrentSection(this.sections[0])
        this.updateContent()
      }
    }
    // this.loading.close()
  },
  methods: {
    handleItemizedForm (sampleForm) {
      if (sampleForm === null) {
        console.log('Received no data from backend. Used cache instead.')
        this.sampleHTML = "<h3 style='text-align: center'>No data received</h3>"
        return
      }

      try {
        this.sampleForm = sampleForm.items.items
        if (!this.sampleForm) {
          this.sampleForm = sampleForm.items
        }

        this.html_file_link = sampleForm.html_link
        this.text_file_link = sampleForm.text_link
        this.sections = this.sampleForm.map(
          (item, i) => {
            return item.item_name
              ? ({ index: i, label: item.item_name })
              : ({ index: i, label: `item ${i}` })
          })
      } catch (error) {
        console.error(error)
        this.sampleHTML = "<h3 style='text-align: center'>No data received</h3>"
      }
    },
    async fillFormData (sampleFormData) {
      // const proxiedURL = url.replace('https://tenk-filing.s3.amazonaws.com/', 'tenk-filing/files/')
      const response = await fetch(sampleFormData.json_link)
      const data = await response.json()

      const itemizedForm = {
        html_link: sampleFormData.html_link,
        text_link: sampleFormData.text_link,
        items: data
      }

      if (data) {
        return itemizedForm
      } else {
        return null
      }
    },
    async getSampleItemizedForm (ticker) {
      const loading = this.$loading({
        lock: true,
        text: 'Please wait and grab a cup of coffee as the backend takes up to several minutes to process the data.',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const sampleFormData = await getSample(ticker)

        if (sampleFormData === null ||
            (sampleFormData.html_link && sampleFormData.html_link.length === 0) ||
            (sampleFormData.text_link && sampleFormData.text_link.length === 0) ||
            (sampleFormData.json_link && sampleFormData.json_link.length === 0)) {
          throw new Error('Failed to fetch sample data from backend. Used cache instead.')
        }
        const itemizedForm = await this.fillFormData(sampleFormData)
        this.handleItemizedForm(itemizedForm)
        loading.close()
      } catch (error) {
        console.error(error)
        const sampleForm = this.samples[ticker]
        this.handleItemizedForm(sampleForm)
        loading.close()
      }
    },
    downloadFile (fileType) {
      if (fileType === 'txt') {
        window.open(this.text_file_link, '_blank')
      }

      if (fileType === 'html') {
        window.open(this.html_file_link, '_blank')
      }
    },
    updateNavigationData () {
      this.navBarData = this.sections
        .map(k => { return { label: k.label, index: k.index, children: [] } })
    },
    updateCurrentSection (data) {
      this.currentSection = data
    },
    updateContent () {
      this.sampleHTML = this.sampleForm[this.currentSection.index].item_content
    },
    async getItemizedFormByURL (url) {
      const loading = this.$loading({
        lock: true,
        text: 'Please wait and grab a cup of coffee as the backend takes up to several minutes to process the data.',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const formData = await newItemizedFormByURL(url)
        const itemizedForm = await this.fillFormData(formData)
        this.handleItemizedForm(itemizedForm)
        loading.close()
      } catch (e) {
        console.error(e)
        this.sampleHTML = "<h4 style='text-align: center'>No data received due to network issue</h4>"
        loading.close()
      }
    },
    handleNodeClick (data) {
      this.updateCurrentSection(data)
      this.updateContent()
    }
  }
}
</script>

<style lang="less" scoped>

.reader {
  padding: 0 10% 0 10%;
}

.html-wrapper {
  padding-bottom: 400px;
  font-size: 3rem !important;
}

.html-wrapper :deep div span {
  font-size: 1.2vw !important;
  padding: 6px 0 6px 0;
  line-height: 120%;
}

.content-container {
  padding: 0 10px 0px 10px;
}

.content {
  height: auto;
  text-align: justify;
  max-height: 100vh;
  overflow-y: scroll;
  padding: 0 7px 0 7px;
  position: relative;
}

.main-container {
  flex: 1;
  margin: 0 20px 0 0px;
  padding: 20px 20px 20px 20px;
  border: 1px solid var(--color-border-sec);
  width: 100%;
  height: calc(100vh - 200px);
  overflow: auto;
}

.index-container {
  padding: 20px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  width: 15vw;
  // position: fixed;
  padding: 20px 15px;
  box-sizing: border-box;
  height: calc(100vh - 200px);
}

.index-container span {
  font-size: 1.2vw !important;
  margin: 10px 0 10px 0;
}

.index-container h3 {
  text-align: left;
  margin-top: 0;
  font-size: 1.2vw;
}

.bordered {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: .3s;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.form-title {
  text-align: left;
  margin: 0;
  font-size: 1.2vw;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.button-container {
  align-items: center;
  display: flex;
}

.sections {
  overflow: auto;
}

</style>
