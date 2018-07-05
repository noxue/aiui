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
      template: {
        main: '', // 入口，第一个流程
        flow: {},
        keyword: {
          quiet: {
            type: 0,
            voice: [],
            choice: 'random'
          },
          noword1: {
            type: 0,
            voice: [],
            choice: 'random'
          },
          noword2: {
            type: 0,
            voice: [],
            choice: 'random'
          },
          noword3: {
            type: 0,
            voice: [],
            choice: 'random'
          }
        },
        voice: {},
        type: [
          // 规则，time表示通话时间范围，单位秒。word表示
          {
            name: '未分类',
            rule: 'time:0,10;word:0,5;section:0,10'
          },
          {
            name: '空号',
            rule: ''
          },
          {
            name: 'A类',
            rule: ''
          },
          {
            name: 'B类',
            rule: ''
          },
          {
            name: 'C类',
            rule: ''
          },
          {
            name: 'D类',
            rule: ''
          },
          {
            name: 'E类',
            rule: ''
          },
          {
            name: 'F类',
            rule: ''
          }
        ]
      }
    }
  },
  created() {
    this.template = { 'main': 'JUU0JUJCJThCJUU3JUJCJThEJUU1JUI5JUI2JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy', 'flow': { 'JUU0JUJCJThCJUU3JUJCJThEJUU1JUI5JUI2JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy': { 'section': { 'type': 'condition', 'voice': ['f618559afa62c72f65b96d43aa8fad93ac30c835'], 'choice': 'f618559afa62c72f65b96d43aa8fad93ac30c835', 'conds': [{ 'keyword': ['好的#25', '可以#25', '没问题#25', '需要#25', '你说#25'], 'to': 'JUU2JThDJUJEJUU1JTlCJTlFJUU2JTg4JTkwJUU1JThBJTlGJUVGJUJDJThDJUU4JUFGJUEyJUU5JTk3JUFFJUU1JThGJTkxJUU0JUJGJUExJUU2JTgxJUFGJUVGJUJDJThDJUU3JUExJUFFJUU1JUFFJTlBJUU5JTlDJTgwJUU2JUIxJTgy' }] }, 'next': 'JUU2JThDJUJEJUU1JTlCJTlF', 'hook': false, 'type': 0 }, 'JUU2JThDJUJEJUU1JTlCJTlF': { 'section': { 'type': 'condition', 'voice': ['c2fea2182648516b42446bfa29cbad920315c6b4', '7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74', '622dd290810bb00d60c87355ffe6096fad39594f'], 'choice': 'random', 'conds': [{ 'keyword': ['好的#25', '没问题#25', '需要#25', '可以#25', '好啊#25', '好#25'], 'to': 'JUU2JThDJUJEJUU1JTlCJTlFJUU2JTg4JTkwJUU1JThBJTlGJUVGJUJDJThDJUU4JUFGJUEyJUU5JTk3JUFFJUU1JThGJTkxJUU0JUJGJUExJUU2JTgxJUFGJUVGJUJDJThDJUU3JUExJUFFJUU1JUFFJTlBJUU5JTlDJTgwJUU2JUIxJTgy' }, { 'keyword': ['不用#25', '不需要#40', '谢谢#25', '再见#25'], 'to': 'JUU2JThDJUJEJUU1JTlCJTlFJUU1JUE0JUIxJUU4JUI0JUE1' }] }, 'next': 'JUU2JThDJUJEJUU1JTlCJTlFJUU1JUE0JUIxJUU4JUI0JUE1', 'hook': true, 'type': 4 }, 'JUU2JThDJUJEJUU1JTlCJTlFJUU1JUE0JUIxJUU4JUI0JUE1': { 'section': { 'type': 'end', 'voice': ['41152b9f5842ffc4bc06145b102274f3a4e71d4a'], 'choice': '41152b9f5842ffc4bc06145b102274f3a4e71d4a' }, 'next': '', 'hook': true, 'type': 5 }, 'JUU2JThDJUJEJUU1JTlCJTlFJUU2JTg4JTkwJUU1JThBJTlGJUVGJUJDJThDJUU4JUFGJUEyJUU5JTk3JUFFJUU1JThGJTkxJUU0JUJGJUExJUU2JTgxJUFGJUVGJUJDJThDJUU3JUExJUFFJUU1JUFFJTlBJUU5JTlDJTgwJUU2JUIxJTgy': { 'section': { 'type': 'condition', 'voice': ['d31fdca0d475bdf41d845d1812961b0b707527a1', 'ca71b2e676b836b30b0622a11f18e86587e688e1'], 'choice': 'random', 'conds': [{ 'keyword': ['好的#25', '没问题#25', '可以#25', '好#25'], 'to': 'JUU2JThDJUJEJUU1JTlCJTlFJUU2JTg4JTkwJUU1JThBJTlGJUU3JUJCJTkzJUU2JTlEJTlG' }] }, 'next': 'JUU2JThDJUJEJUU1JTlCJTlFJUU1JUE0JUIxJUU4JUI0JUE1', 'hook': true, 'type': 3 }, 'JUU2JThDJUJEJUU1JTlCJTlFJUU2JTg4JTkwJUU1JThBJTlGJUU3JUJCJTkzJUU2JTlEJTlG': { 'section': { 'type': 'end', 'voice': ['f617d1661f1738a59d1cc03733c85a0ad6e56e35'], 'choice': 'random' }, 'next': 'JUU0JUJCJThCJUU3JUJCJThEJUU1JUI5JUI2JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy', 'hook': false, 'type': 2 }}, 'keyword': { 'quiet': { 'type': 0, 'voice': ['cf34fe75dffec7282b54292bc8479dc76681b6c3'], 'choice': 'random' }, 'noword1': { 'type': 0, 'voice': ['cf34fe75dffec7282b54292bc8479dc76681b6c3'], 'choice': 'random' }, 'noword2': { 'type': 0, 'voice': ['cf34fe75dffec7282b54292bc8479dc76681b6c3'], 'choice': 'random' }, 'noword3': { 'type': 0, 'voice': ['cf34fe75dffec7282b54292bc8479dc76681b6c3'], 'choice': 'random' }, 'JUU1JTg1JUFDJUU1JThGJUI4JUU1JTlDJUIwJUU1JTlEJTgw': { 'type': 3, 'keyword': ['公司#25', '地址#25', '在哪里#25', '在那里#25', '那里#20', '哪里#20'], 'voice': ['7bd0b288eba4e14a69f2526f2e728e2afb72457d', 'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c'], 'choice': 'random', conds: [] }}, 'voice': { 'f618559afa62c72f65b96d43aa8fad93ac30c835': { 'pcm': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.pcm', 'path': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.wav', 'filename': '3.1.1', 'text': '介绍并询问需求' }, 'c2fea2182648516b42446bfa29cbad920315c6b4': { 'pcm': '2018\\06\\21\\c2fea2182648516b42446bfa29cbad920315c6b4.pcm', 'path': '2018\\06\\21\\c2fea2182648516b42446bfa29cbad920315c6b4.wav', 'filename': '4.2.1ai2', 'text': '挽回1' }, '7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74': { 'pcm': '2018\\06\\21\\7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74.pcm', 'path': '2018\\06\\21\\7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74.wav', 'filename': '4.2.1ai3', 'text': '挽回2' }, '622dd290810bb00d60c87355ffe6096fad39594f': { 'pcm': '2018\\06\\21\\622dd290810bb00d60c87355ffe6096fad39594f.pcm', 'path': '2018\\06\\21\\622dd290810bb00d60c87355ffe6096fad39594f.wav', 'filename': '4.2.1ai1', 'text': '挽回3' }, 'd31fdca0d475bdf41d845d1812961b0b707527a1': { 'pcm': '2018\\06\\21\\d31fdca0d475bdf41d845d1812961b0b707527a1.pcm', 'path': '2018\\06\\21\\d31fdca0d475bdf41d845d1812961b0b707527a1.wav', 'filename': '3.3.2.ai2', 'text': '让会计师给你打电话可以吗111' }, 'ca71b2e676b836b30b0622a11f18e86587e688e1': { 'pcm': '2018\\06\\21\\ca71b2e676b836b30b0622a11f18e86587e688e1.pcm', 'path': '2018\\06\\21\\ca71b2e676b836b30b0622a11f18e86587e688e1.wav', 'filename': '3.3.2.ai1', 'text': '让会计师给你打电话可以吗222' }, 'f617d1661f1738a59d1cc03733c85a0ad6e56e35': { 'pcm': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.pcm', 'path': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.wav', 'filename': '3.4.1', 'text': '邀约成功结束' }, '41152b9f5842ffc4bc06145b102274f3a4e71d4a': { 'pcm': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.pcm', 'path': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.wav', 'filename': '3.4.2', 'text': '邀约失败结束.。。' }, 'cf34fe75dffec7282b54292bc8479dc76681b6c3': { 'pcm': '2018\\06\\21\\cf34fe75dffec7282b54292bc8479dc76681b6c3.pcm', 'path': '2018\\06\\21\\cf34fe75dffec7282b54292bc8479dc76681b6c3.wav', 'filename': '6.1.2.ai1', 'text': '无声音 没匹配到内容等' }, '7bd0b288eba4e14a69f2526f2e728e2afb72457d': { 'pcm': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.pcm', 'path': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.wav', 'filename': '5.2.1.ai1', 'text': '公司地址1' }, 'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c': { 'pcm': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.pcm', 'path': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.wav', 'filename': '5.2.2.ai1', 'text': '公司地址2' }}, 'type': [{ 'name': '未分类', 'rule': 'time:0,10;word:0,5;section:0,10' }, { 'name': '空号', 'rule': '' }, { 'name': 'A类', 'rule': '' }, { 'name': 'B类', 'rule': '' }, { 'name': 'C类', 'rule': '' }, { 'name': 'D类', 'rule': '' }, { 'name': 'E类', 'rule': '' }, { 'name': 'F类', 'rule': '' }] }
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