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
          <li v-for="(item,k) in tasks" :key='k' @click="getTaskUsersList(item.id)">
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
            <el-tab-pane label="详细结果" name="first">
              <el-col :span="24" class="toolbar" style="padding: 0px;">
                <el-form :inline="true" :model="tables">
                  <el-form-item>
                    <el-input v-model="filters.name" style="width:130px;" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-select v-model="value" style="width:110px;" placeholder="客户类型">
                    <el-option
                      v-for="item in this.tables.types"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="value" style="width:110px;" placeholder="任务状态">
                    <el-option
                      v-for="item in this.tables.taskStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="value" style="width:110px;" placeholder="是否公开">
                    <el-option
                      v-for="item in this.tables.share"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-form-item>
                    <el-button type="primary" v-on:click="getTasks">查询</el-button>
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
                <el-table-column type="index" width="20">
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
                :current-page="currentPage" 
                @current-change="handleCurrentTaskUserChange" 
                :page-size="15" :total="taskUserTotal" style="float:right;">
                </el-pagination>
              </el-col> 
            </el-tab-pane>
            <el-tab-pane label="任务信息" name="second">
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
              <el-input v-model="num"></el-input>
            </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getTaskList, getTaskUserList, expExcel, impExcel } from '@/api/task'
export default {
  data() {
    return {
      filters: {
        uid: ''
      },
      tables: {
        name: '',
        types: [{
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
        share: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }]
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
      activeName: '',
      sels: [] // 列表选中列
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
      const para = { page: this.page + '', uid: this.filters.uid }
      this.listLoading = true
      // NProgress.start();
      getTaskList(para).then((response) => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
        this.listLoading = false
        // NProgress.done();
      })
    },
    exportExcel() {
      expExcel(Request).then((response) => {

      })
    },
    impportExcel() {
      impExcel(Request).then((response) => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
      })
    },

    getTaskUsersList(item) {
      const rePara = { page: this.currentPage + '', taskId: item + '' }
      this.itemId = rePara.taskId
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
    }
  },
  mounted() {
    this.getTasks()
  }

}
</script>

 <style lang="scss" scoped>
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 100%
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 100%
  }
</style>
