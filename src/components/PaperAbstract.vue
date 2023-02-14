<template>
  <div class="hello">
    <h3>Company Relation Graph</h3>
    <!-- <h3 style="position: absolute; top: 30%; left: 43%">Form 10-K Itemization</h3> -->
    <p class="intro">
      <!-- <i>Yanci Zhang, Mengjia Xia, Mingyang Li, Haitao Mao, Yutong Lu, Yupeng Lan, Jinlin Ye, Rui Dai∗</i> -->
      View company relations in a graph
    </p>
    <!-- <el-row>
      <el-col>
        <p>Form 10-K report is a financial report disclosing the annual financial state of a public company. It is an important
        evidence to conduct financial analysis, i.e., asset pricing, corporate finance.
        Practitioners and researchers are constantly designing algorithms to better conduct analysis on information in the Form
        10-K report. The vast majority of previous works focus on quantitative data. With recent advancement on natural language
        processing (NLP), textual data in financial filing attracts more attention. However, to incorporate textual data for
        analyzing, Form 10-K Itemization is a necessary pre-process step. It aims to segment the whole document into several
        Item sections, where each Item section focuses on a specific financial aspect of the company. With the segmented Item
        sections, NLP techniques can directly apply on those Item sections related to downstream tasks. In this paper, we
        develop a Form 10-K Itemization system which can automatically segment all the Item sections in 10-K documents. The
        system is both effective and efficient. It reaches a retrieval rate of 93%.</p>
      </el-col>
    </el-row> -->
    <el-button type="primary" @click="$router.push('company-graph')"><b>Try it out!</b></el-button>
  </div>
</template>

<script>
export default {
  name: 'PaperAbstract'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h3 {
  margin-top: 10%;
  text-align: center;
  font-size: 1.4vw;
}

p {
  text-align: left;
  font-size: 1.1vw;
}

.intro {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  text-align: left;
  display: block;
}

button {
  position: relative;
  margin-top: 5%;
}

button span b {
  font-size: 1.1vw;
}

.mt-2 {
  margin-top: 20%;
}

.paper-link {
  font-size: 1.4rem;
  font-weight: bold;
}

</style>
