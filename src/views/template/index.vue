<template>
    <div class="tab-container">
        <el-button type="primary" @click="saveTemplate()">保存修改</el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMap" :label="item.label" :key="item.key" :name="item.key">
                <keep-alive>
                    <keyword-pane v-if='activeName=="keyword"' @submit-keyword-update="updateKeyword" @submit-voice-delete="voiceDelete" @submit-voice-update="updateVoice"   v-bind:initTemplate='template'  v-bind:initKeywords='template["keyword"]' v-bind:initTypes='template["type"]'></keyword-pane>
                    <flow-pane v-else-if='activeName=="flow"' v-bind:initTemplate='template' @submit-flow-update="updateFlow" @submit-voice-update="updateVoice" ></flow-pane>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import keywordPane from './components/keywordPane'
import flowPane from './components/flowPane'

export default {
  components: { keywordPane, flowPane },
  name: 'templateAdd',
  data() {
    return {
      activeName: 'flow',
      tabMap: [
        { label: '节点', key: 'flow' },
        { label: '全局关键词', key: 'keyword' },
        { label: '客户分类', key: 'type' }
      ],
      template: { 'main': 'JUU1JUJDJTgwJUU1JTlDJUJBJUU3JTk5JUJE', 'flow': { 'JUU1JUJDJTgwJUU1JTlDJUJBJUU3JTk5JUJE': { 'section': { 'type': 'start', 'voice': ['f618559afa62c72f65b96d43aa8fad93ac30c835'], 'choice': 'f618559afa62c72f65b96d43aa8fad93ac30c835' }, 'next': 'JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy', 'hook': true, 'type': 0 }, 'JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy': { 'section': { 'type': 'condition', 'voice': ['06227df902d4350cadcffe0d17eeb499bd010ca4'], 'choice': '06227df902d4350cadcffe0d17eeb499bd010ca4', 'conds': [{ 'keyword': ['好的#50', '可以#25', '没问题#25', '好#25'], 'to': 'JUU5JTgyJTgwJUU4JUFGJUI3JUU2JTg4JTkwJUU1JThBJTlG' }, { 'keyword': ['不用#25', '不可以#50', '不用了#25', '再见#25', '拜拜#25'], 'to': 'JUU5JTgyJTgwJUU4JUFGJUI3JUU1JUE0JUIxJUU4JUI0JUE1' }] }, 'next': '', 'hook': true, 'type': 0 }, 'JUU5JTgyJTgwJUU4JUFGJUI3JUU2JTg4JTkwJUU1JThBJTlG': { 'section': { 'type': 'end', 'voice': ['f617d1661f1738a59d1cc03733c85a0ad6e56e35'], 'choice': 'f617d1661f1738a59d1cc03733c85a0ad6e56e35' }, 'next': '', 'hook': false, 'type': 2 }, 'JUU5JTgyJTgwJUU4JUFGJUI3JUU1JUE0JUIxJUU4JUI0JUE1': { 'section': { 'type': 'end', 'voice': ['41152b9f5842ffc4bc06145b102274f3a4e71d4a'], 'choice': '41152b9f5842ffc4bc06145b102274f3a4e71d4a' }, 'next': '', 'hook': true, 'type': 0 }}, 'keyword': { 'JUU1JUJGJTk5': { 'type': 5, 'keyword': ['开车#25', '开会#25', '路上#25', '在路上#30', '晚点#25'], 'voice': ['41152b9f5842ffc4bc06145b102274f3a4e71d4a'], 'multi_voice': [], 'choice': '41152b9f5842ffc4bc06145b102274f3a4e71d4a', 'multi_choice': 'random' }, 'JUU0JUJEJThEJUU3JUJEJUFFJUU4JUFGJUEyJUU5JTk3JUFF': { 'type': 3, 'keyword': ['地址#25', '公司#25', '哪里#25', '在哪里#50', '在哪#30', '地方#25', '什么地方#30'], 'voice': ['7bd0b288eba4e14a69f2526f2e728e2afb72457d', 'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c'], 'multi_voice': [], 'choice': 'random', 'multi_choice': 'random' }, 'JUU4JUIwJTgzJUU2JTg4JThGJUU1JUFFJUEyJUU2JTlDJThE': { 'type': 6, 'keyword': ['美女#25', '声音好听#25', '多少岁#25', '几岁#25'], 'voice': ['09caade6139421700add2d7dd2579a399322cff7', '189509ef54a2cf03c756f026a656f3d93ba6fcd0'], 'multi_voice': [], 'choice': 'random', 'multi_choice': 'random' }, 'JUU1JUFFJUEyJUU2JTg4JUI3JUU2JTgwJTgwJUU3JTk2JTkxJUU2JTk4JUFGJUU2JTlDJUJBJUU1JTk5JUE4JUU0JUJBJUJB': { 'type': 5, 'keyword': ['机器人#25', '软件#25'], 'voice': ['398999628876116b3eee7ebada46f72053195f19'], 'multi_voice': [], 'choice': '398999628876116b3eee7ebada46f72053195f19', 'multi_choice': 'random' }}, 'voice': { 'f618559afa62c72f65b96d43aa8fad93ac30c835': { 'pcm': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.pcm', 'path': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.wav', 'filename': '3.1.1', 'text': '你好，我是xxx，需要代账计税吗' }, 'f617d1661f1738a59d1cc03733c85a0ad6e56e35': { 'pcm': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.pcm', 'path': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.wav', 'filename': '3.4.1', 'text': '感谢接听，祝你生活愉快' }, '41152b9f5842ffc4bc06145b102274f3a4e71d4a': { 'pcm': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.pcm', 'path': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.wav', 'filename': '3.4.2', 'text': '不好意思 打扰了' }, '06227df902d4350cadcffe0d17eeb499bd010ca4': { 'pcm': '2018\\06\\21\\06227df902d4350cadcffe0d17eeb499bd010ca4.pcm', 'path': '2018\\06\\21\\06227df902d4350cadcffe0d17eeb499bd010ca4.wav', 'filename': '3.1.1.1', 'text': '我们是专业的代理记账公司，请问你需要吗' }, '7bd0b288eba4e14a69f2526f2e728e2afb72457d': { 'pcm': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.pcm', 'path': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.wav', 'filename': '5.2.1.ai1', 'text': '我们在xxxx4444' }, 'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c': { 'pcm': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.pcm', 'path': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.wav', 'filename': '5.2.2.ai1', 'text': '我们在xxxxx1111' }, '398999628876116b3eee7ebada46f72053195f19': { 'pcm': '2018\\06\\21\\398999628876116b3eee7ebada46f72053195f19.pcm', 'path': '2018\\06\\21\\398999628876116b3eee7ebada46f72053195f19.wav', 'filename': '6.1.3.ai1', 'text': '怎么会呢。。。公司统一话术' }, '09caade6139421700add2d7dd2579a399322cff7': { 'pcm': '2018\\06\\21\\09caade6139421700add2d7dd2579a399322cff7.pcm', 'path': '2018\\06\\21\\09caade6139421700add2d7dd2579a399322cff7.wav', 'filename': '6.1.11.ai1', 'text': '这个问题不方便作答' }, '189509ef54a2cf03c756f026a656f3d93ba6fcd0': { 'pcm': '2018\\06\\21\\189509ef54a2cf03c756f026a656f3d93ba6fcd0.pcm', 'path': '2018\\06\\21\\189509ef54a2cf03c756f026a656f3d93ba6fcd0.wav', 'filename': '6.1.12.ai1', 'text': '关于业务方面的问题还有什么需要了解的吗' }}, 'type': [{ 'name': '未分类', 'rule': 'time:0,10;word:0,5;section:0,10' }, { 'name': '空号', 'rule': '' }, { 'name': 'A类', 'rule': '' }, { 'name': 'B类', 'rule': '' }, { 'name': 'C类', 'rule': '' }, { 'name': 'D类', 'rule': '' }, { 'name': 'E类', 'rule': '' }, { 'name': 'F类', 'rule': '' }] }
    }
  },
  methods: {
    saveTemplate() {
      console.log(JSON.stringify(this.template))
    },
    updateKeyword(keywords) {
      this.template.keyword = keywords
    },
    updateFlow(flows) {
      this.template.flow = flows
    },
    updateVoice(voiceList) {
      for (var k in voiceList) {
        this.template.voice[k] = voiceList[k]
      }
    },
    voiceDelete(hash) {
      this.$delete(this.template.voice, hash)
    }
  }
}
</script>


<style scoped>
.tab-container {
  margin: 30px;
}
</style>