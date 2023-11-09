<template>
  <div class="hello">
    <h3>Company Competition Graph</h3>
    <!-- <h3 style="position: absolute; top: 30%; left: 43%">Form 10-K Itemization</h3> -->
    <p class="intro">
      <i>Yanci Zhang, Yutong Lu, Haitao Mao, Jiawei Huang, Cien Zhang, Xinyi Li, Jinlin Ye, Rui Dai</i>
    </p>
    <el-row>
      <el-col>
        <p><em>Abstract</em></p>
        <p>Financial market participants frequently rely on numerous business relationships to make investment decisions. Investors can learn about potential risks and opportunities associated with other connected entities through these corporate connections. Nonetheless, human annotation of a large corpus to extract such relationships is highly time-consuming, not to mention that it requires a considerable amount of industry expertise and professional training.
           Meanwhile, we have yet to observe means to generate reliable
           knowledge graphs of corporate relationships due to the lack of impartial and granular data sources. This study proposes a system to
            process financial reports and construct the public competitor graph
            to fill the void. Our method can retrieve more than 83% competition
            relationship of the S&P 500 index companies. Based on the output
            from our system, we construct a knowledge graph with more than
            700 nodes and 1200 edges. A demo interactive graph interface is
            available here.</p>
      </el-col>
    </el-row>
    <el-row>
      <em>Please be patient when the graph is loading. It may take a while.</em>
    </el-row>
    <el-row>
      <el-button type="primary" @click="$router.push('company-graph/dow30')"><b>Try DOW30 Company Graph!</b></el-button>
      <el-button type="primary" @click="$router.push('company-graph/sp500')"><b>Try SP500 Company Graph!</b></el-button>
      <el-button type="primary" @click="$router.push('search-company')"><b>Try Search Company</b></el-button>
    </el-row>
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
  margin-top: 3%;
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
