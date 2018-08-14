<template>
    <el-container class="task-container">
      <el-aside class="left-aside">
        <!--工具条-->
        <div class="toolbar" style="margin-top:30px;">
          <el-form :inline="true"  onsubmit="return false">

            <el-form-item>
              <el-input v-model="taskFilterName" style="width:190px;" @keyup.enter.native="getTasks" placeholder="请输入任务名"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" v-on:click="getTasks">查询</el-button>
            </el-form-item>
          </el-form>
         <!--task部分-->
        <ul class="task-list">
          <li v-for="(item,k) in tasks" :key='k'  v-bind:class="{active:item.id===activeTaskId}" @click="changeTask(item.id)">
            <div>{{item.name}}</div>
            <span>{{item.status|taskStatusFilter}}</span>
          </li>
        </ul>
        <!--工具条-->
        <el-col :span="24" class="bottom-toolbar">
          <el-pagination
          background
          layout="total, prev, jumper, next" 
          :current-page.sync = "page"
          @current-change="taskPageChange"
          :page-size="20" :total="total" 
          style="float:right;">
          </el-pagination>
        </el-col>
        </div>
      </el-aside>
      <el-main>
        <el-tabs v-model="task.active">
            <el-tab-pane label="详细结果" key="list" name="list">
              <el-col :span="24" class="toolbar" style="padding: 0px;">
                <el-form :inline="true" style="text-align:left;">
                  <el-input v-model="task.filter.name" style="width:160px;" @keyup.enter.native="getUsersList" placeholder="姓名"></el-input>
                  <el-select v-model="task.filter.type" style="width:160px;" placeholder="客户类型" @change="getUsersList">
                    <el-option value="">所有类型</el-option>
                    <el-option
                      v-for="(item,key) in this.userTypes"
                      :key="key"
                      :label="item.name"
                      :value="key"
                      v-if="key>4"
                      >
                    </el-option>
                  </el-select>
                  <el-select v-model="task.filter.status" style="width:160px;" placeholder="任务状态" @change="getUsersList">
                    <el-option value="">所有状态</el-option>
                    <el-option
                      v-for="(item,i) in task.taskStatus"
                      :key="i"
                      :label="item"
                      :value="i">
                    </el-option>
                  </el-select>
                  
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-search" v-on:click="getUsersList"></el-button>
                    <el-button type="primary" icon="el-icon-caret-right" v-on:click="startTask"></el-button>
                    <el-button type="primary" v-on:click="stopTask" ><svg-icon icon-class="stop" /></el-button>
                    <el-button type="danger" icon="el-icon-delete" v-on:click="delTask"></el-button>
                  </el-button-group>
                
                </el-form>
              </el-col>
              <el-table :data="taskUsers" highlight-current-row>
                <el-table-column prop="id" width="100" label="编号" sortable></el-table-column>
                <el-table-column prop="name" label="姓名" sortable></el-table-column>
                <el-table-column prop="mobile" label="客户号码"  width="120" sortable></el-table-column>
                <el-table-column prop="status" label="任务状态"  :formatter="formatStatus" sortable></el-table-column>
                <el-table-column prop="type" label="客户类型" :formatter="formatType" sortable></el-table-column>
                <el-table-column prop="time" label="通话时长" :formatter="formatTime" sortable></el-table-column>
                <el-table-column label="操作" width="240" fixed="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button size="mini"  type="primary" plain v-if="scope.row.status !== 0"  @click="getUsersList"><svg-icon icon-class="reset" /></el-button>
                      <el-button size="mini"  type="primary" plain icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)"></el-button>
                      <el-button size="mini"  type="primary" plain v-if="scope.row.status !== 1" @click="toRedial(scope.$index, scope.row)"><svg-icon icon-class="recall" /></el-button>
                      <el-button size="mini"  type="primary" v-if="scope.row.content!==''" plain  @click="detail(scope.$index, scope.row)"><svg-icon icon-class="detail" /></el-button>
                   </el-button-group>
                  </template>
                </el-table-column>
                
              </el-table>
              <el-col :span="24" class="bottom-toolbar">
                <el-pagination
                  background
                  layout="total, prev, pager, jumper, next" 
                  :current-page.sync = "task.page"
                  @current-change="taskUserPageChange"
                  :page-size="16" :total="task.total">
                  </el-pagination>
                </el-col>
            <!--工具条-->
              <el-col :span="24" class="bottom-toolbar">
                  <el-button-group>
                    <el-button type="primary" v-on:click="exportExcel" >导出Excel</el-button>
                    <el-button type="primary" v-on:click="importExcel" >导入Excel</el-button>
                  </el-button-group>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="任务信息" name="second">
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">创建人：{{task.info.userId}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">任务名：{{task.info.name}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">任务模板：{{templates[task.info.templateId]!==undefined?templates[task.info.templateId].name:""}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">创建时间：{{formatDate(task.info.createdAt)}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">开始时间：{{formatDate(task.info.startAt)}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">完成时间：{{task.info.finishAt===null?"未完成":formatDate(task.info.finishAt)}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">打断类型：{{task.breakTypes[task.info.interrupt*-1]}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">拨打进度：{{task.info.called}}/{{task.total}}(已拨打/总量)</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24"><div id="basicChart" style="width:800px;height:400px;"></div></el-col>
              </el-row>
            </el-tab-pane>
        </el-tabs>
        <!--编辑界面-->
      <el-dialog title="编辑"  :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="80px" ref="editForm" >
          <el-form-item label="号码" prop="mobile" >
            <el-input v-model="editForm.mobile"  :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="mobile" >
            <el-input v-model="editForm.name"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" style="text-align: left;" >
            <el-select v-model="editForm.type" placeholder="请选择">
              <el-option
                v-for="(item,key) in userTypes"
                :key="key"
                :label="item.name"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--通话详情界面-->
        <el-dialog title="通话详情" :fullscreen="true" width=80%  :visible.sync="task.detailVisiable">
            <el-row :gutter="2">
                <el-col :span="4"><div class="grid-content bg-purple-light">
                  <span class="calledSpan">姓名：{{task.detail.name}}</span>
                </div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light">
                  <span class="calledSpan">号码：{{task.detail.mobile}}</span>
                </div></el-col> 
                <el-col :span="3"><div class="grid-content bg-purple-light">
                  <span class="calledSpan">客户类型：{{userTypes[task.detail.type]!==undefined?userTypes[task.detail.type].name:""}}</span>
                </div></el-col> 
                <el-col :span="6"><div class="grid-content bg-purple-light">
                  <span class="calledSpan">拨打时间：{{formatDate(task.detail.calledAt)}}</span>
                </div></el-col>
                <el-col :span="7"><div class="grid-content bg-purple-light">
                  <span class="calledSpan">模板名称：{{templates[task.info.templateId]!==undefined?templates[task.info.templateId].name:""}}</span>
                </div></el-col>
              <el-col :span="24"><div class="grid-content bg-purple">
                <ul class="phone-list">
                  <li v-for="(item,k) in task.detail.content.nodes" :key='k'>
                    <div v-if="item.type === 0" class="sender"  style="width:100%;word-wrap:break-word; word-break:break-all; text-align:left">
                        <div class="portrait ">
                      <i class="el-icon-phone-outline" style="padding:6px 4px;font-size:35px"></i>
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
                           <i class="el-icon-phone" style="padding:6px 4px;font-size:35px"></i>
                         </div>
                       <div class="app-msg" style="color:#ffffff">
                         <span>{{item.word}} </span>
                       </div>
                      </div>
                  </li>
                </ul>  
              </div></el-col>
            </el-row>
        </el-dialog>
           <!--导入界面-->
      <el-dialog title="导入用户" width="400px" :visible.sync="impFormVisible">
        <el-upload
          class="upload-demo"
          drag
          :action="importUrl"
          :on-success="uploadSuccess"
          :multiple="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传Excel文件，且不超过10M</div>
          <div class="el-upload__down" slot="tip"><a href="/static/导入模板.xls" target="view_window">下载模板</a></div>
        </el-upload>
      </el-dialog>
      <audio id="snd" src=""></audio>
      </el-main>
    </el-container>
</template>

<script>
var echarts = require('echarts')
import NProgress from 'nprogress'
import { getTaskList, getTaskUserList, getTemplate, editTaskUser, editTaskStatus, deleteTask, toDoRedial, expExcel, countUserType } from '@/api/task'
const taskStatus = ['通话完毕', '未开始', '已开始', '正在执行', '暂停中', '执行失败']
const breakTypes = ['不打断', '声音打断', '关键词打断']
export default {
  filters: {
    taskStatusFilter(val) {
      if (val >= 0 && val < 6) {
        return taskStatus[val]
      }
      return '未知'
    }
  },
  data() {
    return {
      taskFilterName: '',
      page: 1,
      tasks: [],
      taskUsers: [],
      total: 0,
      activeTaskId: 0,
      templates: {},
      task: {
        taskStatus: taskStatus,
        breakTypes: breakTypes,
        active: 'list',
        filter: {},
        info: {},
        page: 1,
        total: 0,
        detailVisiable: false,
        detail: {
          content: {
            nodes: []
          }
        }
      },
      editForm: {},
      editLoading: false,
      editFormVisible: false,
      userTypes: [],
      impFormVisible: false,
      importUrl: ''
    }
  },
  methods: {
    getTasks() {
      NProgress.start()
      getTaskList({
        page: this.page + '',
        name: this.taskFilterName
      }).then(response => {
        const data = response.data
        if (data.meta.success === false) {
          this.$message.error(data.meta.msg)
        } else {
          this.total = data.data.taskList.total
          this.tasks = data.data.taskList.list
          this.activeTaskId = this.tasks[0].id
        }
        NProgress.done()
      })
    },
    getUsersList() {
      const prap = {
        page: this.task.page === undefined ? '' : this.task.page + '',
        taskId: this.activeTaskId === undefined ? '' : this.activeTaskId + '',
        name: this.task.filter.name === undefined ? '' : this.task.filter.name + '',
        type: this.task.filter.type === undefined ? '' : this.task.filter.type + '',
        share: this.task.filter.share === undefined ? '' : this.task.filter.share + '',
        status: this.task.filter.status === undefined ? '' : this.task.filter.status + ''
      }
      NProgress.start()
      getTaskUserList(prap).then(response => {
        const data = response.data
        if (data.meta.code !== 0) {
          this.$message.error(data.meta.msg)
        } else {
          this.task.total = data.data.taskUserList.total
          this.taskUsers = data.data.taskUserList.list
        }
        NProgress.done()
      })
    },
    formatDate: function(para) {
      if (para === '' || para === null || para === undefined) {
        return ''
      }
      var d = new Date(para)
      var minute = d.getMinutes()
      if (minute < 10) {
        minute = '0' + minute // 补齐
      }
      var seconds = d.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds // 补齐
      }
      return d.getMonth() + '月' + d.getDay() + '日  ' + d.getHours() + ':' + minute + ':' + seconds
    },
    formatBreak: function(para) {
      if (para === 0) {
        return '不打断'
      } else if (para === -1) {
        return '声音打断'
      } else if (para === -2) {
        return '关键字打断'
      }
    },
    getTemplate: function(id) {
      getTemplate(id).then(response => {
        if (response.data.meta.code !== 0) {
          this.$message.error(response.data.meta.msg)
        } else {
          this.templates[id] = response.data.data.template
          this.userTypes = JSON.parse(this.templates[id].content).type
        }
      })
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = row
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            NProgress.start()
            const para = Object.assign({}, this.editForm)
            const reqData = {
              id: para.id + '',
              mobile: para.mobile + '',
              name: para.name,
              type: this.editForm.type + '',
              remark: para.remark
            }
            editTaskUser(reqData).then(response => {
              NProgress.done()
              if (response.data.meta.success === false) {
                this.$message({
                  message: response.data.meta.msg,
                  type: 'fail'
                })
              } else {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
              }
            })
          })
        }
      })
    },
    startTask(item) {
      if (this.activeTaskId === undefined || this.activeTaskId <= 0) {
        return
      }
      const rePara = {
        id: this.activeTaskId + '',
        status: 2 + ''
      }
      editTaskStatus(rePara).then(response => {
        if (!response.data.meta.success) {
          this.$message.error(
            '开始失败,' + '错误信息：' + response.data.meta.msg
          )
        } else {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getTasks('', 1)
        }
      })
    },
    stopTask(item) {
      if (this.activeTaskId === undefined || this.activeTaskId <= 0) {
        return
      }
      const rePara = {
        id: this.activeTaskId + '',
        status: 4 + ''
      }
      editTaskStatus(rePara).then(response => {
        if (!response.data.meta.success) {
          this.$message.error(
            '暂停失败,' + '错误信息：' + response.data.meta.msg
          )
        } else {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    delTask(item) {
      this.$confirm('确认删除该任务吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        NProgress.start()
        const para = { id: this.activeTaskId + '' }
        deleteTask(para).then((response) => {
          this.listLoading = false
          NProgress.done()
          if (response.data.meta.success === false) {
            this.$message({
              message: '删除失败',
              type: 'fail'
            })
          } else {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTasks()
          }
        })
      }).catch(() => {

      })
    },
    toRedial(index, row) {
      const reqData = {
        taskId: row.taskId + '',
        taskUserId: row.id + ''
      }
      toDoRedial(reqData).then(response => {
        if (response.data.meta.success === false) {
          this.$message({
            message: response.data.meta.msg,
            type: 'fail'
          })
        } else {
          this.$message({
            message: '正在呼叫',
            type: 'success'
          })
          this.getUsersList()
        }
      })
    },
    detail(index, row) {
      this.task.detailVisiable = true
      if (this.task.detail.id === row.id) {
        return
      }
      this.$set(this.task, 'detail', row)
      this.$set(this.task['detail'], 'content', JSON.parse(row.content))
    },
    exportExcel(event) {
      const reqData = {
        taskId: this.activeTaskId + ''
      }
      expExcel(reqData).then(response => {
        window.open(
          'data:application/vnd.ms-excel;base64,' + response.data.data.task
        )
      })
    },
    importExcel(event) {
      this.impFormVisible = true
    },
    // 统计userType
    getUserType() {
      const para = {
        taskId: this.activeTaskId + ''
      }
      countUserType(para).then(response => {
        if (response.data.meta.success === false) {
          this.$message({
            message: response.data.meta.msg,
            type: 'fail'
          })
        } else {
          var userType = [0, 0, 0, 0, 0, 0]
          const typeList = response.data.data.userType
          for (var i = 0; i < typeList.length; i++) {
            userType[typeList[i].type - 5] = typeList[i].num
          }
          const myChart = echarts.init(document.getElementById('basicChart'))
          // this.myChart.showLoading()
          myChart.setOption({
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: ['A类', 'B类', 'C类', 'D类', 'E类', 'F类']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: userType,
              type: 'line'
            }]
          })
          // this.chart.hideLoading()
        }
      })
    },
    uploadSuccess(response) {
      if (!response.meta.success) {
        this.$message.error('导入错误,' + '错误信息：' + response.meta.msg)
        return
      } else {
        this.impFormVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getUsersList()
      }
    },
    playSound(voice) {
      var audio = document.getElementById('snd')
      audio.pause()
      audio.currentTime = 0
      audio.src = process.env.BASE_API + 'voice/file/wav/' + voice
      audio.play()
    },
    changeTask(id) {
      if (this.activeTaskId === id) {
        return
      }
      this.activeTaskId = id
    },
    taskPageChange(val) {
      this.page = val
    },
    taskUserPageChange(val) {
      this.$set(this.task, 'page', val)
      this.getUsersList()
    },
    formatType(row, column) {
      if (this.userTypes[row.type] !== undefined) {
        return this.userTypes[row.type].name
      }
      return ''
    },
    formatStatus(row, column) {
      return taskStatus[row.status]
    },
    formatTime(row, column) {
      var m = Math.floor(row.time / 60)
      var s = row.time - (m * 60)
      return m + '分' + s + '秒'
    }
  },
  mounted() {
    this.getTasks()
  },
  watch: {
    'page'(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== 0) {
        this.getTasks()
      }
    },
    'activeTaskId'(newValue, oldValue) {
      if (newValue === oldValue || this.activeTaskId === 0 || newValue === 0) {
        return
      }

      this.importUrl = process.env.BASE_API + 'task/imp?id=' + newValue

      for (var i in this.tasks) {
        var task = this.tasks[i]
        if (task.id === newValue) {
          this.task.info = task
          break
        }
      }
      this.getTemplate(this.task.info.templateId)
      this.getUsersList()
      this.getUserType()
    }
  }
}
</script>

 <style lang="scss" scoped>

.task-container{
  height:100%;
  overflow: hidden;
}

.left-aside {
  //background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 100%;
  background-color: #F7F7F7;
  padding:5px;
}

.el-main {
  //background-color: #E9EEF3;
  color: #333;
  // text-align: center;
  // line-height: 100%;
}

body > .el-container {
  margin-bottom: 0px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 100%;
}

.el-container:nth-child(7) .el-aside {
  line-height: 700px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  text-align: left;
  //background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
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
.task-aside{
  height: 50%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.task-list > li:hover {
  background: #eef;
}

.task-list > li {
  height: 50px;
  line-height: 50px;
  text-align: left;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  padding: 0 5px 0 5px;
  transition: hover 1s, background 1s;
}
.task-list > li > div {
  float: left;
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}
.task-list > li > span {
  width: 30%;
  float: right;
  font-size: 14px;
  color: #888;
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
  margin: 0 20px 10px 15px;
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

// .left_triangle {
//   height: 0px;
//   width: 0px;
//   border-width: 8px;
//   border-style: solid;
//   border-color: transparent aquamarine transparent transparent;
//   position: relative;
//   left: -16px;
//   top: 3px;
// }

// .right_triangle {
//   height: 0px;
//   width: 0px;
//   border-width: 8px;
//   border-style: solid;
//   border-color: transparent transparent transparent gold;
//   position: relative;
//   right: -16px;
//   top: 3px;
// }
span{
  display:inline-block;
}
.el-upload__down{
  color: rgb(81,166,255);
}

.app-msg{
  max-width:600px;
  padding:5px 10px 10px 10px;
  box-shadow: 2px 2px 5px rgb(111, 128, 148);
}
.bottom-toolbar{
  padding-top:5px;
}
// .portrait{
//   text-align: center;
//   width:90px;
//   height:90px;
//   border-radius:50%;
//   background-color:#000000
// }
// .portrait>i{
//   color:#fff;
// }
.calledSpan{
  font-size:14px;
  margin-top:6px;
  margin-left:15px;
  text-align: center;
}
</style>
