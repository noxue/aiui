<template>
    <el-container>
      <el-aside width="300px">
        <!--工具条-->
        <div class="toolbar" style="margin-top:30px;">
          <el-form :inline="true" :model="filters"  onsubmit="return false">

            <el-form-item>
              <el-input v-model="filters.name" style="width:120px;" @keyup.enter.native="getTasks" placeholder="请输入任务名"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" v-on:click="getTasks">查询</el-button>
            </el-form-item>
          </el-form>
         <!--task部分-->
        <ul class="task-list">
          <li v-for="(item,k) in tasks" :key='k'  v-bind:class="{active:item.id===itemId}"  @click="getTaskUsersList(item)">
            <div>{{item.name}}</div>
            <span>{{filters.desc(item.status)}}</span>
          </li>
        </ul>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
          </el-pagination>
        </el-col>
        </div>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="详细结果" key="first" name="first">
              <el-col :span="24" class="toolbar" style="padding: 0px;">
                <el-form :inline="true" :model="tables" style="text-align:right;">
                  <el-form-item>
                    <el-input v-model="tables.name" style="width:160px;" @keyup.enter.native="getTaskUsersList" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-select v-model="tables.type" style="width:160px;" placeholder="客户类型">
                    <el-option
                      v-for="item in this.tables.taskTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="tables.status" style="width:160px;" placeholder="任务状态">
                    <el-option
                      v-for="item in this.tables.taskStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <!-- <el-select v-model="tables.share" style="width:160px;" placeholder="是否公开">
                    <el-option
                      v-for="item in this.tables.isShare"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> -->
                  <el-form-item>
                    <el-button type="primary" v-on:click="getTaskUsersList">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="exportExcel">导出Excel</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="importExcel">导入Excel</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="startTask" >开始</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-table :data="taskUsers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="mobile" label="客户号码" width="140" sortable>
                </el-table-column>
                <el-table-column prop="status" label="任务状态" width="120" :formatter="formatStatus" sortable>
                </el-table-column>  
                <el-table-column prop="time" label="通话时长" width="120" sortable>
                </el-table-column>
                <el-table-column prop="type" label="客户类型" width="120" :formatter="formatType" sortable>
                </el-table-column>
                <el-table-column prop="share" label="是否公开" width="120" :formatter="formatShare" sortable>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120" sortable>
                </el-table-column>
                <!-- <el-table-column prop="remark" label="备注" width="120"  sortable>
                </el-table-column> -->
                <!-- <el-table-column prop="calledAt" label="呼叫时间" width="120" :formatter="formatDate" sortable>
                </el-table-column> -->
                <el-table-column label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="info" plain @click="handleCalled(scope.$index, scope.row)">通话详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            <!--工具条-->
              <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="prev, pager, next"
                 :current-page=currentPage 
                 @current-change="handleCurrentTaskUserChange" 
                 :page-size="16" 
                 :total="taskUserTotal" 
                 style="float:right;">
                </el-pagination>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="任务信息" name="second">
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">创建人：{{this.task.userId}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">任务名：{{this.task.name}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">任务模板：{{this.task.templateId}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">创建时间：{{formatDate(this.task.createdAt)}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">开始时间：{{formatDate(this.task.startAt)}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">完成时间：{{formatDate(this.task.finishAt)}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">号码总数：{{this.task.total}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">已拨打：{{this.task.called}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">并发数：{{this.task.thread}}</div></el-col>
              </el-row>
            </el-tab-pane>
        </el-tabs>

        <!--导入界面-->
      <el-dialog title="导入用户" :visible.sync="impFormVisible">
        <el-upload
          class="upload-demo"
          drag
          :action="action"
          :on-success="uploadSuccess"
          :multiple="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传Excel文件，且不超过50M</div>
        </el-upload>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑"  :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="80px" ref="editForm" >
          <el-form-item label="号码" prop="mobile" >
            <el-input v-model="editForm.mobile"  :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" style="text-align: left;" >
            <el-select v-model="editType" placeholder="请选择">
              <el-option
                v-for="item in this.option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
        <el-dialog title="通话详情" :fullscreen="true" width=80%  :visible.sync="calledFormVisible">
         <div class="sender"  style="width:100%;word-wrap:break-word; word-break:break-all; text-align:left">
            <div class="portrait ">
              <i class="el-icon-phone-outline" style="padding:6px 4px;font-size:35px"></i>
            </div>
          <div class="app-msg">
            <span> 喂，您好</span>
          </div>
          <div class="app-msg-voice">
            <el-button slot="append" icon="el-icon-caret-right" @click="playSound()">
              播放
            </el-button>
            <audio id="snd" src="D:\3.0.1.wav">
            </audio>
          </div>
        </div>
        <!-- Right -->
        <div class="receiver"  style="width:100%;word-wrap:break-word; word-break:break-all; text-align:left">
            <div class="portrait">
               <i class="el-icon-phone" style="padding:6px 4px;font-size:35px"></i>
            </div>
         <div class="app-msg" style="color:#ffffff">
              <span> hellodlkjaskldajsioxcvlnfwerophellodlkjaskldajshellodlkjaskldajsioxcvlnfweropiwjlkdioxcvlnfweropiwjlkdfjopiaewrjmqnfioudfhslkioxcvlnfweropiwjlkdioxcvlnfweropiwjlkdfjopiaewrjmqnfioudfhslkiwjlkdioxcvlnfweropiwjlkdfjopiaewrjmqnfioudfhslk </span>
         </div>
        </div>  
        </el-dialog>
      </el-main>
    </el-container>
</template>

<script>
import { getTaskList, getTaskUserList, expExcel, editTaskUser, editTaskStatus, getTemplate } from '@/api/task'
export default {
  data() {
    return {
      filters: {
        name: '',
        desc(val) {
          if (val === 0) {
            return '已结束'
          } else if (val === 1) {
            return '未开始'
          } else if (val === 2) {
            return '待开始'
          } else if (val === 3) {
            return '执行中'
          } else if (val === 4) {
            return '暂停中'
          } else if (val === 5) {
            return '卡壳中'
          }
          return '未知'
        }
      },
      tables: {
        name: '',
        type: '',
        share: '',
        status: '',
        taskTypes: [
          { value: '1', label: 'A类' },
          { value: '2', label: 'B类' },
          { value: '3', label: 'C类' },
          { value: '4', label: 'D类' },
          { value: '5', label: 'E类' },
          { value: '6', label: 'F类' }
        ],
        taskStatus: [
          { value: '0', label: '通话完毕' },
          { value: '1', label: '任务未执行' },
          { value: '2', label: '任务被获取' }
        ],
        isShare: [
          { value: '1', label: '是' },
          { value: '0', label: '否' }
        ]
      },
      task: {
        userId: '',
        name: '',
        templateId: '',
        thread: '',
        total: '',
        called: '',
        stratAt: '',
        createAt: '',
        finishAt: '',
        status: ''
      },
      num: 'sd',
      total: 0,
      taskUserTotal: 0,
      page: 1,
      currentPage: 1,
      tasks: [],
      itemId: '',
      action: '',
      taskUsers: [],
      listLoading: false,
      activeName: 'first',
      sels: [], // 列表选中列
      impFormVisible: false,
      // 编辑界面是否显示
      editFormVisible: false,
      editLoading: false,
      // 编辑界面数据
      editForm: {
        mobile: '',
        type: '',
        remark: ''
      },

      // 通话详情界面是否显示
      calledFormVisible: false,
      calledLoading: false,
      // 通话详情界面数据
      calledForm: {},
      option: [
        { value: '1', label: 'A类' },
        { value: '2', label: 'B类' },
        { value: '3', label: 'C类' },
        { value: '4', label: 'D类' },
        { value: '5', label: 'E类' },
        { value: '6', label: 'F类' }
      ],
      editType: ''
    }
  },
  methods: {
    // 显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.mobile = row.mobile
      this.editForm.remark = row.remark
      this.editType = row.type + ''
    },
    handleCalled: function(index, row) {
      this.calledFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    formatDate: function(para) {
      if (para === '' || para === null || para === undefined) {
        return ''
      }
      var d = new Date(para)
      return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + '  ' + d.getHours() + ':' + d.getMinutes()
    },

    formatTemplateName: function(para) {
      if (para === '' || para === null || para === undefined) {
        return ''
      }
      getTemplate(para).then(response => {
        if (response.data.meta.msg === false) {
          return ''
        } else {
          this.task.templateId = response.data.data.template.name
        }
      })
    },

    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            // NProgress.start();
            const para = Object.assign({}, this.editForm)
            const reqData = {
              id: para.id + '',
              mobile: para.mobile + '',
              type: para.type + '',
              remark: para.remark
            }
            editTaskUser(reqData).then(response => {
              this.editLoading = false
              // NProgress.done();
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
              }
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getTaskUsersList(para)
            })
          })
        }
      })
    },
    formatShare: function(row, column) {
      return row.share === false ? '否' : row.sex === true ? '是' : '未知'
    },
    formatStatus: function(row, column) {
      return row.status === 0
        ? '通话完毕'
        : row.status === 1
          ? '任务未执行'
          : row.status === 2 ? '客户端获取任务' : '未知'
    },
    formatType: function(row, column) {
      return row.type === 1 ? 'A类' : row.type === 2 ? 'B类' : row.type === 3
        ? 'C类' : row.type === 4 ? 'D类' : row.type === 5 ? 'E类'
          : row.type === 6 ? 'F类' : '未知'
    },
    handleCurrentChange(val) {
      this.page = val
      this.getTasks()
    },
    handleCurrentTaskUserChange(val) {
      this.currentPage = val
      this.getTaskUsersList(this.itemId)
      this.getTasks()
    },
    // 获取任务列表
    getTasks() {
      const para = {
        page: this.page + '',
        name: this.filters.name
      }
      this.listLoading = true
      // NProgress.start();
      getTaskList(para).then(response => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
        // NProgress.done();
        if (this.tasks.length > 0) {
          if (!this.itemId >= 0) {
            this.itemId = this.tasks[0].id
          }
          this.action = process.env.BASE_API + 'task/imp?id=' + this.itemId
          this.task.userId = this.tasks[0].userId
          this.task.name = this.tasks[0].name
          this.task.tempateId = this.formatTemplateName(this.tasks[0].templateId)
          this.task.thread = this.tasks[0].thread
          this.task.total = this.tasks[0].total
          this.task.called = this.tasks[0].called
          this.task.startAt = this.tasks[0].startAt
          this.task.createdAt = this.tasks[0].createdAt
          this.task.finishAt = this.tasks[0].finishAt
          this.task.status = this.tasks[0].status
          this.getTaskUsersList(this.tasks[0])
        }
        this.listLoading = false
      })
    },
    exportExcel: function(event) {
      const reqData = {
        taskId: this.itemId + ''
      }
      expExcel(reqData).then(response => {
        window.open(
          'data:application/vnd.ms-excel;base64,' + response.data.data.task
        )
      })
    },
    importExcel: function(event) {
      this.impFormVisible = true
    },
    uploadSuccess(response) {
      if (!response.meta.success) {
        this.$message.error('导入错误,' + '错误信息：' + response.meta.msg)
        return
      } else {
        this.impFormVisible = false
        this.$message({
          message: response.meta.msg,
          type: 'success'
        })
        this.getTasks()
      }
    },
    getTaskUsersList(item) {
      if (item.id !== undefined) {
        this.itemId = item.id
      }
      this.action = process.env.BASE_API + 'task/imp?id=' + this.itemId
      const rePara = {
        page: this.currentPage + '',
        taskId: this.itemId + '',
        name: this.tables.name,
        type: this.tables.type + '',
        share: this.tables.share + '',
        status: this.tables.status + ''
      }
      this.task.name = item.name
      this.task.userId = item.userId
      this.task.templateId = this.formatTemplateName(item.templateId)
      this.task.thread = item.thread
      this.task.total = item.total
      this.task.called = item.called
      this.task.startAt = item.startAt
      this.task.createdAt = item.createdAt
      this.task.finishAt = item.finishAt
      this.task.status = item.status

      this.listLoading = true
      // NProgress.start();
      getTaskUserList(rePara).then(response => {
        this.taskUserTotal = response.data.data.taskUserList.total
        this.taskUsers = response.data.data.taskUserList.list
        this.listLoading = false
        // NProgress.done();
      })
    },
    startTask(item) {
      if (item.id !== undefined) {
        this.itemId = item.id
      }
      const rePara = {
        id: this.itemId + '',
        status: 2 + ''
      }
      // this.listLoading = true
      editTaskStatus(rePara).then(response => {
        if (!response.data.meta.success) {
          this.$message.error(
            '准备失败,' + '错误信息：' + response.data.meta.msg
          )
        } else {
          this.$message({
            message: response.data.meta.msg,
            type: 'success'
          })
          this.getTasks()
        }
      })
    },
    handleClick(tab, event) {},
    selsChange(sels) {
      this.sels = sels
    },
    playSound(voice) {
      var audio = document.getElementById('snd')
      audio.pause()
      audio.currentTime = 0
      // if (voice !== '' && typeof voice !== undefined && this.flows[this.activeFlow].section.voice.length > 0) {
      //   if (voice === 'random') {
      //     voice = this.flows[this.activeFlow].section.voice[Math.floor(Math.random() * this.flows[this.activeFlow].section.voice.length)]
      //   }

      //   audio.src = process.env.BASE_API + 'voice/file/wav/' + voice

      // }
      audio.src = 'http://127.0.0.1:9527/static/3.0.1.wav'
      audio.play()
    }
  },
  mounted() {
    this.getTasks()
  }
}
</script>



 <style lang="scss" scoped>
 body{
  height:100%;
  overflow: hidden;
 }

.el-aside {
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
}
.task-list > li > span {
  width: 30%;
  float: right;
  font-size: 14px;
  color: #888;
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

.app-msg{
  max-width:600px;
  padding:5px 10px 10px 10px;
  box-shadow: 2px 2px 5px rgb(111, 128, 148);
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
</style>
