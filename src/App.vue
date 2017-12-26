<template>
  <div id="app" class="clearfix">
    <ul :class="$style.menu">
      <li v-for="item of comList" :key="item">{{item}}</li>
    </ul>
    <router-view :class="$style['demo-page']"/>
  </div>
</template>

<script>
export default {
  name: 'index',
  data: () => ({
    comList: [],
  }),
  mounted() {
    this.$nextTick(() => {
      this.getComList();
    });
  },
  methods: {
    getComList() {
      const getComList = new XMLHttpRequest();
      getComList.onreadystatechange = () => {
        if (getComList.readyState === 4) {
          if (getComList.status === 200) {
            this.comList = JSON.parse(getComList.responseText).components;
          } else {
            // eslint-disable-next-line
            alert(`请求文件失败，错误代码：${getComList.status}\n请刷新再试！`);
          }
        }
      };
      getComList.open('GET', '/static/comList.json');
      getComList.send();
    },
  },
};
</script>

<style lang="scss">
@import './assets/stylesheets/normailze';
*,
*:before,
*:after {
  box-sizing: border-box;
}
html {
  font-size: 62.5%;
}
html, body {
  height: 100%;
}
body {
  color: #333;
}
h1 {
  font-size: 4rem;
}
p {
  font-size: 2rem;
}
</style>


<style lang="scss" module>
:global(.clearfix:after) {
  content: ' ';
  display: table;
  clear: both;
}
.menu {
  float: left;
  width: 15%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: pink;

  & li {
    padding: .5rem;
    padding-right: 3rem;
    list-style: none;
    color: #fff;
    text-shadow: 0 0 5px rgba(#000, .3);
    font: 2rem/1.2 monospace;
    text-align: right;
    letter-spacing: 4px;
    text-transform: uppercase;
  }
}
.demo-page {
  float: right;
  width: 85%;
  padding: 0 80px;
  // background: deepskyblue;
}
</style>
