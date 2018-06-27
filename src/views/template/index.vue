<template>
    <div class="tab-container">
        <el-button type="primary" @click="saveTemplate()">保存修改</el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMap" :label="item.label" :key="item.key" :name="item.key">
                <keep-alive>
                    <keyword-pane v-if='activeName=="keyword"' @submit-keyword-update="updateKeyword" @submit-voice-delete="voiceDelete" @submit-voice-update="updateVoice"  v-bind:keywords='template["keyword"]' v-bind:types='template["type"]'></keyword-pane>
                    <flow-pane v-else-if='activeName=="flow"'></flow-pane>
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
        main_flow: 'flow1',
        flow: {},
        keyword: {},
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
          }
        ]
      }
    }
  },
  methods: {
    saveTemplate() {
      console.log(JSON.stringify(this.template))
    },
    updateKeyword(keywords) {
      this.template.keyword = keywords
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