<template>
  <div class="app-container">
    <el-container>
      <el-aside width="300px">
        <!--工具条-->
        <div class="toolbar" style="margin-top:30px;">
          <el-form :inline="true" :model="filters">

            <el-form-item>
              <el-input v-model="filters.name" placeholder="请输入任务名"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" v-on:click="getTasks">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
         <!--task部分-->
        <ul class="task-list">
          <li v-for="(item,k) in tasks" :key='k' @click="getTaskUsersList(item)">
            <div>{{item.name}}</div>
            <span>{{item.status}}</span>
          </li>
        </ul>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
          </el-pagination>
        </el-col> 
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="详细结果" key="first" name="first">
              <el-col :span="24" class="toolbar" style="padding: 0px;">
                <el-form :inline="true" :model="tables">
                  <el-form-item>
                    <el-input v-model="tables.name" style="width:160px;" placeholder="姓名"></el-input>
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
                  <el-select v-model="tables.share" style="width:160px;" placeholder="是否公开">
                    <el-option
                      v-for="item in this.tables.isShare"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
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
                <el-table-column prop="remark" label="备注" width="120"  sortable>
                </el-table-column>
                <el-table-column prop="calledAt" label="呼叫时间" width="120" sortable>
                </el-table-column>
                <el-table-column label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            <!--工具条-->
              <el-col :span="24" class="toolbar">
                <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
                <el-pagination layout="prev, pager, next"
                 :current-page=currentPage 
                 @current-change="handleCurrentTaskUserChange" 
                 :page-size="15" 
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
                <el-col :span="8"><div class="grid-content bg-purple">创建时间：{{this.task.createdAt}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">开始时间：{{this.task.startAt}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">完成时间：{{this.task.finishAt}}</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">号码总数：{{this.task.total}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">已拨打：{{this.task.called}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">并发数：{{this.task.thread}}</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple">任务状态：{{this.formatTaskStatus(this.task.status)}}</div></el-col>
              </el-row>
            </el-tab-pane>
        </el-tabs>

        <!--导入界面-->
      <el-dialog title="导入用户" :visible.sync="impFormVisible">
        <el-upload
          class="upload-demo"
          drag
          :action="tables.action"
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getTaskList, getTaskUserList, expExcel, editTaskUser, editTaskStatus } from '@/api/task'
//, impExcel
export default {
  data() {
    return {
      filters: {
        name: ''
      },
      tables: {
        name: '',
        type: '',
        share: '',
        status: '',
        taskTypes: [{
          value: '0',
          label: 'A类'
        }, {
          value: '1',
          label: 'B类'
        }, {
          value: '2',
          label: 'C类'
        }, {
          value: '3',
          label: 'D类'
        }, {
          value: '4',
          label: 'E类'
        }, {
          value: '5',
          label: 'F类'
        }],
        taskStatus: [{
          value: '0',
          label: '通话完毕'
        }, {
          value: '1',
          label: '任务未执行'
        }, {
          value: '2',
          label: '任务被获取'
        }],
        isShare: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        action: process.env.BASE_API + 'task/imp'
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
      option: [{
        value: '0',
        label: 'A类'
      }, {
        value: '1',
        label: 'B类'
      }, {
        value: '2',
        label: 'C类'
      }, {
        value: '3',
        label: 'D类'
      }, {
        value: '4',
        label: 'E类'
      }, {
        value: '5',
        label: 'F类'
      }],
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
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
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
            editTaskUser(reqData).then((response) => {
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
      return row.status === 0 ? '通话完毕' : row.status === 1 ? '任务未执行' : row.status === 2 ? '客户端获取任务' : '未知'
    },
    formatType: function(row, column) {
      return row.type === 0 ? 'A类' : row.type === 1 ? 'B类' : row.type === 2 ? 'C类' : row.type === 3 ? 'D类' : row.type === 4 ? 'E类' : row.type === 5 ? 'F类' : '未知'
    },
    formatTaskStatus: function(status) {
      return status === 0 ? '一结束' : status === 1 ? '未开始' : status === 2
        ? '待开始' : status === 3 ? '执行中' : status === 4 ? '暂停中' : status === 5
          ? '卡壳中' : '未知'
    },
    handleCurrentChange(val) {
      this.page = val
      this.getTasks()
    },
    handleCurrentTaskUserChange(val) {
      this.currentPage = val
      this.getTaskUsersList(this.itemId)
    },
    // 获取任务列表
    getTasks() {
      const para = {
        page: this.page + '',
        name: this.filters.name
      }
      this.listLoading = true
      // NProgress.start();
      getTaskList(para).then((response) => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
        // NProgress.done();
        if (this.tasks.length > 0) {
          this.itemId = this.tasks[0].id
          this.task.userId = this.tasks[0].userId
          this.task.name = this.tasks[0].name
          this.task.tempateId = this.tasks[0].templateId
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
        taskId: this.itemId
      }
      expExcel(reqData).then((response) => {
        window.open('data:application/vnd.ms-excel;base64,' + response.data.data.task)
      })
    },
    importExcel: function(event) {
      this.impFormVisible = true
    },
    uploadSuccess(response) {
      console.log(response)
      if (!response.meta.success) {
        this.$message.error('导入错误,' + '错误信息：' + response.meta.msg)
        return
      } else {
        this.$message({
          message: response.meta.msg,
          type: 'success'
        })
        this.getTaskUsersList()
      }
    },
    getTaskUsersList(item) {
      if (item.id !== undefined) {
        this.itemId = item.id
      }
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
      this.task.templateId = item.templateId
      this.task.thread = item.thread
      this.task.total = item.total
      this.task.called = item.called
      this.task.startAt = item.startAt
      this.task.createdAt = item.createdAt
      this.task.finishAt = item.finishAt
      this.task.status = item.status

      this.listLoading = true
      // NProgress.start();
      getTaskUserList(rePara).then((response) => {
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
      this.listLoading = true
      editTaskStatus(rePara).then((response) => {
        if (!response.data.meta.success) {
          this.$message.error('准备失败,' + '错误信息：' + response.data.meta.msg)
          return this.getTasks()
        } else {
          this.$message({
            message: response.data.meta.msg,
            type: 'success'
          })
        }
        this.getTasks()
      })
    },
    handleClick(tab, event) {
    },
    selsChange(sels) {
      this.sels = sels
    }
  },
  mounted() {
    this.getTasks()
  }

}
</script>

 <style lang="scss" scoped>
  
  .el-aside {
    //background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 100%
  }
  
  .el-main {
    //background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100%
  }
  
  body > .el-container {
    margin-bottom: 0px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 100%
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 700px
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

  .task-list{
    list-style:none;
    padding:0;
    margin:0;
  }

  .task-list>li:hover{
    background: #eef;
   
    
  }

  .task-list>li{
    height:50px;
    line-height: 50px;
    text-align: left;
    border-bottom:1px solid #eee;
    cursor: pointer;
    padding:0 5px 0 5px;
     transition:hover 1s, background 1s;
  }
  .task-list>li>div{
    float:left;
    width:70%;
  }
  .task-list>li>span{
    width:30%;
    float:right;
    font-size:14px;
    color:#888;
  }
</style>
