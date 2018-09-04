<template>
  <div class="wechat-container">
    <div class="title">
      <span>通话详情</span>
    </div>
    <el-row :gutter="2">
      <el-col :span="24"><div >
        <span class="calledSpan">客户类型：{{userType}}</span>
      </div></el-col>
      <el-col :span="24"><div >
        <span class="calledSpan">客户姓名：{{task.name}}</span>
      </div></el-col>
      <el-col :span="24"><div >
        <span class="calledSpan">客户号码：<a :href="'tel:'+taskUser.mobile+''">{{taskUser.mobile}}</a></span>
      </div></el-col> 
      <el-col :span="24"><div >
        <span class="calledSpan">模板名称：{{templateName}}</span>
      </div></el-col>
      <el-col :span="24"><div >
        <span class="calledSpan">拨打时间：{{formatDate(taskUser.calledAt)}}</span>
      </div></el-col>

      <div class="tip">
        <span>与客户交谈部分</span>
      </div>
     
      <el-col :span="24"><div class="grid-content bg-purple">
        <ul class="phone-list">
          <li v-for="(item,k) in content.nodes" :key='k'>
            <div v-if="item.type === 0" class="sender"  style="width:100%;word-wrap:break-word; word-break:break-all; text-align:left">
                <div class="portrait ">
              <!-- <i class="el-icon-phone-outline" style="padding:6px 4px;font-size:20px"></i> -->
                </div>
                <div class="app-msg">
                  <span>{{item.word}}</span>
              </div>
              <div class="app-msg-voice">
              <el-button slot="append" icon="el-icon-caret-right" @click="playSound(item.voice)">
                播放
              </el-button>
            
              </div>
              </div>
              <div v-else class="receiver"  style="width:100%;word-wrap:break-word; word-break:break-all; text-align:left">
                 <div class="portrait">
          <!--          <i class="el-icon-phone" style="padding:6px 4px;font-size:20px"></i> -->
                 </div>
               <div class="app-msg" style="color:#ffffff">
                 <span>{{item.word}} </span>
               </div>
              </div>
          </li>
        </ul>  
      </div></el-col>
    </el-row>
    <audio id="snd" src=""></audio>
  </div>
</template>

<script>
import { getTemplate, getTaskUser, getTask } from '@/api/task'
export default {
  data() {
    return {
      userTypes: [],
      templates: [],
      templateName: '',
      userType: '',
      taskUser: {},
      phone: '',
      task: {},
      content: []
    }
  },
  methods: {
    formatDate: function(para) {
      if (para === '' || para === null || para === undefined) {
        return ''
      } else {
        var d = new Date(para)
        var minute = d.getMinutes()
        if (minute < 10) {
          minute = '0' + minute // 补齐
        }
        var seconds = d.getSeconds()
        if (seconds < 10) {
          seconds = '0' + seconds // 补齐
        }
        return (d.getMonth() + 1) + '月' + d.getDate() + '日  ' + d.getHours() + ':' + minute + ':' + seconds
      }
    },
    getTemplate: function(id) {
      getTemplate(id).then(response => {
        if (response.data.meta.code !== 0) {
          this.$message.error(response.data.meta.msg)
        } else {
          this.templates[id] = response.data.data.template
          this.templateName = this.templates[id].name
          this.userTypes = JSON.parse(this.templates[id].content).type
          this.userType = this.userTypes[JSON.parse(this.taskUser.content).type].name
        }
      })
    },
    getTask: function(taskId) {
      getTask({ id: taskId + '' }).then(response => {
        if (response.data.meta.code !== 0) {
          this.$message.error(response.data.meta.msg)
        } else {
          this.task = response.data.data.task
          this.getTemplate(this.task.templateId)
        }
      })
    },
    selectTaskUser() {
      const id = this.$route.query.id
      getTaskUser(id).then(response => {
        const data = response.data
        if (data.meta.success === false) {
          this.$message.error(data.meta.msg)
        } else {
          this.taskUser = data.data.taskUser
          this.getTask(this.taskUser.taskId)
          this.content = JSON.parse(this.taskUser.content)
        }
      })
    },
    playSound(voice) {
      var audio = document.getElementById('snd')
      audio.pause()
      audio.currentTime = 0
      audio.src = process.env.BASE_API + 'voice/file/wav/' + voice
      audio.play()
    }
  },
  mounted() {
    this.selectTaskUser()
  }

}

</script>

<style lang="scss" scoped>

.wechat-container{
  //margin: 5px;
  height:100%;
}

.wechat-container .tip{
  color:rgba(128, 128, 128, 0.459);
  text-align:center;
}

.wechat-container .title{
  background-color: #00B2EE;
  height: 50px;
  text-align: center;
}

.wechat-container .title span{
    color: rgb(250, 250, 250);
    font-size: 20px;
    margin-top:15px 
  }

a{color:#000;text-decoration:underline;}

.el-row {
  margin-top:20px; 
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}

.bg-purple {
  text-align: left;
  //background: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.phone-list >li{
  list-style: none;
}

/* bubble style */
.sender {
  clear: both;
  //max-width: 80%;
}
.sender div:nth-of-type(1) {
  float: left;
}
.sender div:nth-of-type(2) {
  background-color: #f5f5f5;
  float: left;
  margin: 0 20px 10px -30px;
  border-radius: 7px;
}

.receiver div:first-child img,
.sender div:first-child img {
  width: 50px;
  height: 50px;
}

.receiver {
  clear: both;
  //max-width: 80%;
}

.receiver div:nth-child(1) {
  float: right;
}

.receiver div:nth-of-type(2) {
  float: right;
  background-color:#00B2EE;
  margin: 0 10px 10px 20px;
  border-radius: 7px;
}

.active{
  background: #DDD;
}

span{
  display:inline-block;
}

.app-msg{
  font-size: 20px;
  max-width:600px;
  padding:5px 10px 10px 10px;
  box-shadow: 2px 2px 5px rgb(111, 128, 148);
}

.calledSpan{
  font-size:20px;
  margin-top:6px;
  margin-left:15px;
  text-align: center;
}
</style>
