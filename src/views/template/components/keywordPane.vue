<template>
  <div v-loading="uploadCount"
    element-loading-text="文件上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)">
    <div  v-for='(keyword, key) in keywords' :key='key'  @mouseover="changeUploadKey(key)">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>{{key|desc}}</span>
          <span style="padding-left:20px;">
            关联客户类型
            <el-dropdown>
              <el-button type="warning" size="mini">
                {{types[keyword.type].name}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeType(index)" v-for="(t,index) in types" :key='index'>{{t.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="deleteKeyword">删除</el-button>
        </div>
        <div class="text item">
          <el-tag
            class="keyword-tag"
            :key="tag"
            v-for="tag in keyword.keyword"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
        </div>
        <div class="text item">
            <el-input 
            placeholder="支持中文和英文关键词,多个关键词用逗号隔开。例如：你好#25,哪位#66，hello"
            v-model="inputValue[key]"
            @keyup.enter.native="addKeyword()"
            >
              <template slot="prepend">输入关键词:</template>
              <el-button slot="append" icon="el-icon-plus" @click="addKeyword()">添加</el-button>
            </el-input>
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
            >
            <el-button size="small" type="primary"><i class="el-icon-bell"></i>添加声音文件</el-button>
            <div slot="tip" class="el-upload__tip" >只能上传wav,mp3文件</div>
          </el-upload>  
          
          <div style="padding:10px auto;">
          <span>选择声音文件</span>
          <el-select v-model="keyword.choice" placeholder="请选择">
            <el-option label="随机" value="random" selected="selected"></el-option>
            
            <el-option v-for="(voice) in keyword.voice" v-if="voiceList[voice]"
              :key="voice"
              :label="voiceList[voice].filename"
              :value="voice">
            </el-option>
          </el-select>
          <el-button icon="el-icon-caret-right" @click="playSound(keyword.choice)" >播放</el-button>
          </div>
        <div class="text item">
            <el-input 
            style="margin-top:10px;"
            placeholder="请输入左边声音文件对应的文本信息"
            v-model="voiceList[vk]['text']"
            v-for="(v,vk) in voiceList"
            :key='vk'
            >
              <template slot="prepend">{{v.filename}}</template>
              <el-button slot="append" icon="el-icon-caret-right" @click="playSound(vk)" >播放</el-button>
              <el-button slot="append" type="danger" style="border-left:1px solid #ccc;" icon="el-icon-close" @click="uploadFileRemove(vk)" >删除</el-button>
            </el-input>
          </div>
        </div>     
      </el-card>
    </div>
    
    <el-button icon="el-icon-plus" type="primary" @click="dialogVisible = true">增加全局关键词</el-button>
    
      <el-dialog
        title="添加关键词列表"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleDialogClose">
        <span>请输入关键词描述信息：</span>
        <el-input v-model="keywordDesc" placeholder="请输入关键词列表描述信息">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add()">确 定</el-button>
        </span>
      </el-dialog>

      <audio id="snd" src=""></audio> 
  </div>
</template>

<script>

export default {
  props: {
    initTemplate: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      keywords: this.initTemplate['keyword'],
      types: this.initTemplate['type'],
      action: process.env.BASE_API + 'voice/upload',
      dialogVisible: false,
      keywordDesc: '', // 创建关键字列表的时候，记录名称用
      inputValue: {},
      whitchKey: '', // 记录目前在操作那一组关键词，保存关键词的key
      voiceList: this.initTemplate['voice'],
      // 正在上传的文件个数，如果大于0，就用加载窗口挡住界面，防止鼠标移动到其他的关键词上面，改变whitchKey,会导致错误
      uploadCount: 0
    }
  },
  filters: {
    desc(val) {
      return window.decodeURI(window.atob(val))
    }
  },
  created() {
    this.$emit('submit-keyword-update', this.keywords)
    this.$emit('submit-voice-update', this.voiceList)
  },
  methods: {
    handleClose(tag) {
      this.keywords[this.whitchKey].keyword.splice(this.keywords[this.whitchKey].keyword.indexOf(tag), 1)
    },
    addKeyword() {
      // 获取内容，并去除空格
      const text = this.inputValue[this.whitchKey].replace(/([\s\n\t\r]+)/g, '')
      if (text === '') {
        this.inputValue[this.whitchKey] = '' // 考虑到如果输入了空格，点击一直没反应，所以空格的情况下清空
        return
      }

      // 分割成多个关键字，支持中英文逗号
      var arrs = text.split(/[,，]/)

      // 把检测和添加放到两个循环，这样可以保证全都成功或失败
      for (var k in arrs) {
        var v = arrs[k]
        if (v === '') {
          this.$message.error('请检查您输入的关键词是否有两个连续的逗号')
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
        if (this.keywords[this.whitchKey].keyword.indexOf(v) === -1) {
          this.keywords[this.whitchKey].keyword.push(v)
          // this.$emit('submit-keyword-update', this.keywords)
        }
      }
      this.inputValue[this.whitchKey] = ''
    },
    add() {
      if (this.keywordDesc === '') {
        this.$message.error('请先输入关键词列表描述信息')
        return
      }

      // 是否已经存在
      if (this.keywords[btoa(encodeURI(this.keywordDesc))]) {
        this.$message.error('该关键词列表已存在，请换一个名字')
        return
      }

      this.dialogVisible = false
      this.$set(this.keywords, btoa(encodeURI(this.keywordDesc)), {
        type: 0,
        keyword: [],
        voice: [],
        multi_voice: [],
        choice: 'random',
        multi_choice: 'random'
      })
      this.keywordDesc = ''
    },
    deleteKeyword() {
      this.$confirm('确认删除？')
        .then(_ => {
          this.$delete(this.keywords, this.whitchKey)
        })
        .catch(_ => {})
    },
    handleDialogClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          this.keywordDesc = ''
        })
        .catch(_ => {})
    },
    changeType(index) {
      this.keywords[this.whitchKey].type = index
    },
    beforeUpload(file, fileList) {
      this.uploadCount++
    },
    uploadSuccess(response, file, fileList) {
      const key = this.whitchKey
      this.uploadCount--

      if (!response.meta.success) {
        this.$message.error('上传错误，错误码：' + response.meta.code + '。错误信息：' + response.meta.msg)
        return
      }

      if (this.keywords[key].voice.indexOf(response.data.voice.hash) !== -1) {
        this.$message.error('文件已存在')
        return
      }
      var voice = response.data.voice
      voice['text'] = ''
      this.$set(this.voiceList, response.data.voice.hash, voice)
      this.keywords[key].voice.push(response.data.voice.hash)

      // this.$emit('submit-voice-update', this.voiceList)
    },
    uploadFileRemove(hash) {
      this.$confirm('确认删除？')
        .then(_ => {
          if (hash === this.keywords[this.whitchKey].choice) {
            this.keywords[this.whitchKey].choice = 'random'
          }
          this.keywords[this.whitchKey].voice.splice(this.keywords[this.whitchKey].voice.indexOf(hash), 1)
          this.$delete(this.voiceList, hash)
          // this.$emit('submit-voice-delete', hash)
        })
        .catch(_ => {})
    },
    changeUploadKey(key) {
      this.whitchKey = key
    },
    playSound(voice) {
      var audio = document.getElementById('snd')
      audio.pause()
      audio.currentTime = 0
      if (voice !== '' && typeof voice !== undefined && this.keywords[this.whitchKey].voice.length > 0) {
        if (voice === 'random') {
          voice = this.keywords[this.whitchKey].voice[Math.floor(Math.random() * this.keywords[this.whitchKey].voice.length)]
        }
        audio.src = process.env.BASE_API + 'voice/file/wav/' + voice
        audio.play()
      }
    }
  }
}
</script>

<style scoped>
  .box-card{
    margin:10px auto;
  }
 .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  
  .voice{
    margin:10px auto;
    padding:10px 0 10px 0;
    border-top:1px solid #eee;
  }

  .upload-sound{
    margin-top:10px;
  }
</style>
