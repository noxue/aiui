<template>
  <div class="task-container">
    <el-container>
      <el-aside width="300px">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">

            <el-form-item>
              <el-input v-model="filters.uid" placeholder="请输入用户名"></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" v-on:click="getTasks">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
         <!--task部分-->
        <br>
        <ul>
          <li v-for="(item,k) in tasks" :key='k' @click="getTaskUsersList(item)">
            {{item.userId}}
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
                    <el-input v-model="tables.name" style="width:130px;" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-select v-model="tables.type" style="width:110px;" placeholder="客户类型">
                    <el-option
                      v-for="item in this.tables.taskTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="tables.status" style="width:110px;" placeholder="任务状态">
                    <el-option
                      v-for="item in this.tables.taskStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="tables.share" style="width:110px;" placeholder="是否公开">
                    <el-option
                      v-for="item in this.tables.isShare"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item>
                    <el-button type="primary" v-on:click="getTaskUsersList(itemId)">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="exportExcel">导出Excel</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="importExcel">导入Excel</el-button>
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
                <el-table-column prop="type" label="客户类型" width="120" sortable>
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
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getTaskList, getTaskUserList, expExcel } from '@/api/task'
//, impExcel
export default {
  data() {
    return {
      filters: {
        uid: ''
      },
      tables: {
        name: '',
        type: '',
        share: '',
        status: '',
        taskTypes: [{
          value: 'a',
          label: 'a'
        }, {
          value: 'b',
          label: 'b'
        }, {
          value: 'c',
          label: 'c'
        }, {
          value: 'd',
          label: 'd'
        }, {
          value: 'e',
          label: 'e'
        }, {
          value: 'f',
          label: 'f'
        }],
        taskStatus: [{
          value: '0',
          label: '已结束'
        }, {
          value: '1',
          label: '未开始'
        }, {
          value: '2',
          label: '等待开始'
        }, {
          value: '3',
          label: '执行中'
        }, {
          value: '4',
          label: '暂停中'
        }, {
          value: '5',
          label: '卡壳中'
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
      impFormVisible: false
    }
  },
  methods: {
    formatShare: function(row, column) {
      return row.share === false ? '否' : row.sex === true ? '是' : '未知'
    },
    formatStatus: function(row, column) {
      return row.status === 0 ? '通话完成' : row.status === 1 ? '任务未执行' : row.status === 2 ? '客户端获取任务' : '未知'
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
        uid: this.filters.uid
      }
      this.listLoading = true
      // NProgress.start();
      getTaskList(para).then((response) => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
        // NProgress.done();
        if (this.tasks != null && this.tasks !== '') {
          console.log(this.tasks[0])
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
        }
        this.getTaskUsersList(this.itemId)
        this.listLoading = false
      })
    },
    exportExcel: function(event) {
      expExcel(Request).then((response) => {
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
        this.getTaskUsersList
      }
    },
    getTaskUsersList(item) {
      const rePara = {
        page: this.currentPage + '',
        taskId: item.id + '',
        name: this.tables.name,
        type: this.tables.type + '',
        status: this.tables.status + '',
        share: this.tables.share + ''
      }
      this.itemId = rePara.taskId

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
    handleClick(tab, event) {
      console.log(tab, event)
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

  ul {
    list-style:none;margin:30px auto;
  } 
  ul li{
    margin:20px 0px;
    border: 2px bottom #999; 
    z-index: 0;
    position: relative; 
  }
  li:hover {
    cursor: pointer;
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
</style>
