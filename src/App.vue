<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
window.onbeforeunload = function(e) {
  e = window.event || e
  e.returnValue = '确定离开当前页面吗？'
}
export default{
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  }
}
</script>

<style>
*{
  moz-user-select: -moz-none; 
  -moz-user-select: none; 
  -o-user-select:none; 
  -khtml-user-select:none; 
  -webkit-user-select:none; 
  -ms-user-select:none; 
  user-select:none;
}
</style>
