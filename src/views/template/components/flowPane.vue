<template>
    <div>
        <el-tabs tab-position='right' @tab-remove="removeFlow">
            <el-tab-pane 
            :name="k" 
            v-for="(flow,k) in flows" 
            :key="k"
            type="card" 
            closable 
            >
               <span slot="label">
                   <i class="el-icon-caret-right" v-if="flow.section.type=='start'"></i>
                   <i class="el-icon-share" v-else-if="flow.section.type=='condition'"></i>
                   <i class="el-icon-circle-close-outline" v-else-if="flow.section.type=='end'"></i>
                 {{k|desc}}
                </span>

                {{flow}}
                <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>{{k|desc}}</span>
                        
                    </div>
                    <div class="text item">
                        <span>下一步流程：</span>
                        <el-select v-model="flow.section.next" placeholder="请选择下一步流程">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                        
                        <span style="margin-left:20px;">关联客户类型：</span>
                        <el-select v-model="flow.type" placeholder="请选择下一步流程">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
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
    flows: {
      type: Object,
      required: true,
      default: {}
    },
    types: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      main: '', // 指定第一个流程
      whitchKey: '', // 记录在操作哪个节点
      // 记录添加流程的时候的名字
      sectionName: '',
      sectionType: '',
      dialogVisible: false
    }
  },
  filters: {
    desc(val) {
      return window.decodeURI(window.atob(val))
    }
  },
  created() {
    console.log('created')
  },
  methods: {
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
          type: 3
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
          type: 3
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
          type: 3
        }
      }

      this.$set(this.flows, btoa(encodeURI(this.sectionName)), section)
      this.sectionName = ''
      this.sectionType = ''
    },
    removeFlow(name) {
      this.$confirm('确认删除流程:[ ' + window.decodeURI(window.atob(name)) + ' ]？')
        .then(_ => {
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
</style>
