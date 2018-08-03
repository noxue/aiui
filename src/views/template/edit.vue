<template>
    <div class="tab-container" 
      v-loading="loading"
      element-loading-text="加载模板中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
        <div>
          <span>话术名称</span>
          <el-input v-model="name" style="width:300px"></el-input>
          <el-button type="primary" @click="saveTemplate()">保存修改</el-button>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMap" :label="item.label" :key="item.key" :name="item.key">
                <keep-alive>
                    <keyword-pane v-if='activeName=="keyword"' @submit-keyword-update="updateKeyword" @submit-voice-delete="voiceDelete" @submit-voice-update="updateVoice"   v-bind:initTemplate='template'></keyword-pane>
                    <flow-pane v-else-if='activeName=="flow"' v-bind:initTemplate='template' @submit-flow-update="updateFlow" @submit-voice-update="updateVoice" ></flow-pane>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import keywordPane from './components/keywordPane'
import flowPane from './components/flowPane'
import { getTemplate, updateTemplate, addTemplate } from '@/api/template'

export default {
  components: { keywordPane, flowPane },
  name: 'templateAdd',
  data() {
    return {
      loading: false,
      activeName: 'flow',
      tabMap: [
        { label: '节点', key: 'flow' },
        { label: '全局关键词', key: 'keyword' }
        // { label: '客户分类', key: 'type' }
      ],
      name: '',
      template: {
        main: '', // 入口，第一个流程
        flow: {},
        keyword: {
          quiet1: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          quiet2: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword1: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword2: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword3: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
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
            name: '未接听',
            rule: ''
          },
          {
            name: '空号',
            rule: ''
          },
          {
            name: '停机',
            rule: ''
          },
          {
            name: '关机',
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
    if (this.$route.params.id > 0) {
      this.loading = true
      getTemplate(this.$route.params.id).then((response) => {
        var data = response.data.data
        this.template = (new Function('return ' + data.template.content))()
        this.name = data.template.name

        this.loading = false
      })
    }
  },
  methods: {
    saveTemplate() {
      if (this.$route.params.id > 0) {
        updateTemplate(this.$route.params.id, { name: this.name, content: JSON.stringify(this.template) }).then((res) => {
          if (res.data.meta.code === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message.error('保存错误：' + res.data.meta.msg)
          }
        }).catch({

        })
      } else {
        addTemplate({ name: this.name, content: JSON.stringify(this.template) }).then((res) => {
          if (res.data.meta.code === 0) {
            this.$router.push({ name: 'templateList' })
          } else {
            this.$message.error('保存错误：' + res.data.meta.msg)
          }
        }).catch({

        })
      }
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