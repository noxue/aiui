<template>
    <div>
        <el-tabs tab-position='right' @tab-remove="removeFlow" @tab-click="tabClick"> 
            <el-tab-pane 
            :name="k" 
            v-for="(flow,k) in flows" 
            :key="k"
            :k='k'
            type="card"
            closable
            >
                <span slot="label">
                   <i class="el-icon-caret-right" v-if="flow.section.type=='start'"></i>
                   <i class="el-icon-share" v-else-if="flow.section.type=='condition'"></i>
                   <i class="el-icon-circle-close-outline" v-else-if="flow.section.type=='end'"></i>
                 {{k|desc}}
                </span>
                <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>{{k|desc}}</span>
                    </div>
                    <div class="text item">
                      <el-row>
                        <el-col :span="4"><div style="text-align:right; padding-top: 5px; padding-right:10px;">主流程</div></el-col>
                        <el-col :span="8">
                          <el-select v-model="initTemplate.main" placeholder="请选择主流程">
                            <el-option v-for="(flow1,k1) in flows" :key="k1" :label="k1|desc" :value="k1"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="4" style="text-align:right"><div style="text-align:right; padding-top: 5px; padding-right:10px;">下一步流程</div></el-col>
                        <el-col :span="8">
                          <el-select v-model="flow.next" placeholder="请选择下一步流程">
                            <el-option v-for="(flow1,k1) in flows" :key="k1" :label="k1|desc" :value="k1"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </div>

                    <div class="text item line">
                      <el-row>
                        <el-col :span="4"><div style="text-align:right; padding-top: 5px; padding-right:10px;">关联客户类型</div></el-col>
                        <el-col :span="8">
                          <el-select v-model='flow.type' placeholder="请选择客户类型">
                            <el-option v-for="(t,k1) in types" :key='k1' :label="t.name" :value="k1"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="4" style="text-align:right"><div style="text-align:right; padding-top: 5px; padding-right:10px;">是否匹配全局关键词</div></el-col>
                        <el-col :span="8">
                          <el-radio-group v-model="flow.hook" size="medium">
                            <el-radio-button  :label="true">是</el-radio-button>
                            <el-radio-button  :label="false">否</el-radio-button>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                    </div>

                    <div class="item voice">
                      <el-upload
                        multiple
                        class="upload-sound"
                        name="voice"
                        accept='audio/*'
                        :action="action"
                        :on-success="uploadSuccess"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        ref="upload"
                        id="upload"
                        :dataKey="k"
                        >
                        <el-button size="small" type="primary"><i class="el-icon-bell"></i>添加声音文件</el-button>
                        <div slot="tip" class="el-upload__tip" >只能上传wav,mp3文件</div>
                      </el-upload>  
                      
                      <div style="padding:10px auto;">
                      <span>选择声音文件</span>
                      <el-select v-model="flow.section.choice" placeholder="请选择">
                        <el-option label="随机" value="random" selected="selected"></el-option>
                        
                        <el-option v-for="(voice) in flow.section.voice" v-if="voiceList[voice]"
                          :key="voice"
                          :label="voiceList[voice].filename"
                          :value="voice">
                        </el-option>
                      </el-select>
                      <el-button icon="el-icon-caret-right" @click="playSound(flow.section.choice)" >播放</el-button>
                      </div>
                    <div class="text item">
                        <el-input 
                        style="margin-top:10px;"
                        placeholder="请输入左边声音文件对应的文本信息"
                        v-model="voiceList[v]['text']"
                        v-for="(v,vk) in flows[k].section.voice"
                        :key='vk'
                        >
                          <template slot="prepend">{{voiceList[v].filename}}</template>
                          <el-button slot="append" icon="el-icon-caret-right" @click="playSound(v)" >播放</el-button>
                          <el-button slot="append" type="danger" style="border-left:1px solid #ccc;" icon="el-icon-close" @click="uploadFileRemove(v)" >删除</el-button>
                        </el-input>
                      </div>
                    </div>    

                    <div class="text item">
                      <el-card class="box-card" v-if="flow.section.conds && flow.section.conds.length>0">
                         <div slot="header" class="clearfix">
                            <span>分支列表</span>
                        </div>
                        <el-card class="box-card" shadow="never" v-for="(ks,i) in flow.section.conds" :key="i" style="margin:10px auto;position:relative;"> 
                          <div class="el-icon-circle-close btn-close" @click="delCond(i)"></div>
                          <el-tag
                              class="keyword-tag"
                              closable
                              :disable-transitions="false"
                              :key="tag"
                              v-for="tag in ks.keyword"
                              @close="handleClose(i,tag)">
                              {{tag}}
                          </el-tag>
                          <div class="text item">
                            <el-input 
                            placeholder="支持中文和英文关键词,多个关键词用逗号隔开。例如：你好#25,哪位#66，hello"
                            v-model="inputValue[i]"
                            @keyup.enter.native="addKeyword(i)">
                              <template slot="prepend">输入关键词:</template>
                              <el-button slot="append" icon="el-icon-plus" @click="addKeyword(i)">添加</el-button>
                            </el-input>
                          </div>
                          <div class="text item">
                            <span>下一步流程：</span>
                            <el-select v-model="ks.to" placeholder="请选择下一步流程">
                                <el-option v-for="(flow1,k2) in flows" :key="k2" :label="k2|desc" :value="k2"></el-option>
                            </el-select>
                          </div>
                        </el-card>
                      </el-card>
                      <el-button v-if="flow.section.type=='condition'" @click="addCond()" style="margin-top:10px;">添加分支</el-button>
                    </div>
                </el-card>
            </el-tab-pane>
        </el-tabs>
        <el-button style="margin-top:10px;" icon="el-icon-plus" type="primary" @click="dialogVisible = true">增加流程</el-button>

        <el-dialog
            title="添加流程"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleDialogClose">
            <div  style="margin:20px auto 10px auto;">请输入流程名字：</div>
            <el-input v-model="sectionName" placeholder="输入流程名称">
            </el-input>

            <div style="margin:20px auto 10px auto;">请输入流程类型：</div>
            <el-radio-group v-model="sectionType" size="medium">
                <el-radio  label="start" value="aaa">开始</el-radio>
                <el-radio  label="condition">条件</el-radio>
                <el-radio  label="end">结束</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="add()">确 定</el-button>
            </span>
        </el-dialog>

        <audio id="snd" src=""></audio> 

    </div>
</template>

<script>
import voiceUpload from './voiceUpload'

export default {
  componects: [voiceUpload],
  props: {
    initTemplate: {
      type: Object,
      required: true,
      default: {}
    }
  },
  created() {
    this.$emit('submit-flow-update', this.flows)
    this.$emit('submit-voice-update', this.voiceList)
  },
  data() {
    return {
      flows: this.initTemplate['flow'],
      types: this.initTemplate['type'],
      voiceList: this.initTemplate['voice'],
      action: process.env.BASE_API + 'voice/upload',
      main: '', // 指定第一个流程
      whitchKey: '', // 记录在操作哪个录音
      whitchFlow: '', // 记录在编辑哪个流程
      // 记录添加流程的时候的名字
      sectionName: '',
      sectionType: '',
      dialogVisible: false,
      inputValue: []
    }
  },
  filters: {
    desc(val) {
      return window.decodeURI(window.atob(val))
    }
  },
  methods: {
    tabClick(key) {
      this.whitchFlow = key.$attrs.k
    },
    add() {
      if (this.sectionName === '') {
        this.$message.error('请先输入流程名称')
        return
      }
      if (this.sectionType === '') {
        this.$message.error('请先选择流程类型')
        return
      }

      // 是否已经存在
      if (this.flows[btoa(encodeURI(this.sectionName))]) {
        this.$message.error('该流程名称已存在，请换一个名字')
        return
      }
      this.dialogVisible = false

      var section = null

      if (this.sectionType === 'start') {
        section = {
          section: {
          // section类型，一共有：start/end/pass/condition/operation
            type: 'start',
            voice: [],
            // 选择语音的规则，如果只有一条语音，就忽略这个设置
            // random:随机选择。其他字符串表示回复指定的下标对应的语音。
            choice: 'random'
          },
          next: '',
          hook: false,
          type: 0
        }
      } else if (this.sectionType === 'end') {
        section = {
          section: {
          // section类型，一共有：start/end/pass/condition/operation
            type: 'end',
            voice: [],
            // 选择语音的规则，如果只有一条语音，就忽略这个设置
            // random:随机选择。其他字符串表示回复指定的下标对应的语音。
            choice: 'random'
          },
          next: '',
          hook: false,
          type: 0
        }
      } else if (this.sectionType === 'condition') {
        section = {
          section: {
            type: 'condition',
            voice: [],
            choice: 'random',
            conds: []
          },
          next: '',
          hook: true,
          type: 0
        }
      }

      this.$set(this.flows, btoa(encodeURI(this.sectionName)), section)
      this.sectionName = ''
      this.sectionType = ''
    },
    removeFlow(name) {
      this.$confirm('确认删除流程:[ ' + window.decodeURI(window.atob(name)) + ' ]？')
        .then(_ => {
          for (var v in this.flows[name].section.voice) {
            this.$delete(this.voiceList, this.flows[name].section.voice[v])
          }
          if (this.initTemplate.main === name) {
            this.initTemplate.main = ''
          }
          this.$delete(this.flows, name)
        })
        .catch(_ => {})
    },
    handleDialogClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          this.sectionName = ''
        })
        .catch(_ => {})
    },
    beforeUpload(file, fileList) {
    },
    uploadSuccess(response, file, fileList) {
      if (!response.meta.success) {
        this.$message.error('上传错误，错误码：' + response.meta.code + '。错误信息：' + response.meta.msg)
        return
      }

      var key = this.whitchFlow

      if (this.flows[key].section.voice.indexOf(response.data.voice.hash) !== -1) {
        this.$message.error('文件已存在')
        return
      }

      var voice = response.data.voice
      voice['text'] = ''
      this.$set(this.voiceList, response.data.voice.hash, voice)
      this.flows[key].section.voice.push(response.data.voice.hash)
    },
    uploadFileRemove(hash) {
      this.$confirm('确认删除？')
        .then(_ => {
          if (hash === this.flows[this.whitchFlow].section.choice) {
            this.flows[this.whitchFlow].section.choice = 'random'
          }
          this.flows[this.whitchFlow].section.voice.splice(this.flows[this.whitchFlow].section.voice.indexOf(hash), 1)
          this.$delete(this.voiceList, hash)
        })
        .catch(_ => {})
    },
    playSound(voice) {
      var audio = document.getElementById('snd')
      audio.pause()
      audio.currentTime = 0
      if (voice !== '' && typeof voice !== undefined && this.flows[this.whitchFlow].section.voice.length > 0) {
        if (voice === 'random') {
          voice = this.flows[this.whitchFlow].section.voice[Math.floor(Math.random() * this.flows[this.whitchFlow].section.voice.length)]
        }
        audio.src = process.env.BASE_API + 'voice/file/wav/' + voice
        audio.play()
      }
    },
    addCond() {
      this.flows[this.whitchFlow].section.conds.push({
        keyword: [],
        to: ''
      })
    },
    delCond(index) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.flows[this.whitchFlow].section.conds.splice(index, 1)
        })
        .catch(_ => {})
    },
    addKeyword(index) {
      if (!this.inputValue[index]) {
        this.$message.error('请输入关键词')
        return
      }
      // 获取内容，并去除空格
      const text = this.inputValue[index].replace(/([\s\n\t\r]+)/g, '')
      if (text === '') {
        this.inputValue[index] = '' // 考虑到如果输入了空格，点击一直没反应，所以空格的情况下清空
        return
      }

      // 分割成多个关键字，支持中英文逗号
      var arrs = text.split(/[,，]/)

      // 把检测和添加放到两个循环，这样可以保证全都成功或失败
      for (var k in arrs) {
        var v = arrs[k]
        if (v === '') {
          this.$message.error('请检查您输入的关键词是否有两个连续的逗号，或者用了逗号结尾')
          return
        }
        // 不满足关键字规则就返回
        if (!/^[\u4e00-\u9fa5a-zA-Z]+?(#\d+){0,1}$/.test(v)) {
          this.$message.error('关键词格式错误：[' + v + ']')
          return
        }
      }

      for (k in arrs) {
        v = arrs[k]
        // 如果没有带优先级，就增加默认的优先级
        if (v.indexOf('#') === -1) {
          v = v + '#25'
        }
        if (this.flows[this.whitchFlow].section.conds[index].keyword.indexOf(v) === -1) {
          this.flows[this.whitchFlow].section.conds[index].keyword.push(v)
        }
      }
      this.inputValue[index] = ''
    },
    handleClose(index, tag) {
      this.flows[this.whitchFlow].section.conds[index].keyword.splice(this.flows[this.whitchFlow].section.conds[index].keyword.indexOf(tag), 1)
    }
  }
}
</script>

<style scoped>
.flow-title{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.item{
    margin-bottom:10px;
    
}

.item.line{
  border-bottom:1px solid #eee; padding-bottom:10px;
}

.keyword-tag{
  margin:0 5px 5px 0;
}

.btn-close{
  position: absolute;
  right:0; 
  top:0;
  z-index: 1000;
  font-size:20px;
  cursor: pointer;
}
</style>
