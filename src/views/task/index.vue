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
        <li v-for="(item,k) in tasks" :key='k' @click="getTaskUserList(item.id)">
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
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
import { getTaskList, getTaskUserList } from '@/api/task'
export default {
  data() {
    return {
      filters: {
        uid: ''
      },
      total: 0,
      page: 1,
      tasks: [],
      listLoading: false,
      sels: [] // 列表选中列
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getTasks()
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
    getTaskUserList(para) {
      const rePara = { page: this.page + '', taskId: para }
      this.listLoading = true
      // NProgress.start();
      getTaskUserList(rePara).then((response) => {
        this.total = response.data.data.taskList.total
        this.tasks = response.data.data.taskList.list
        this.listLoading = false
        // NProgress.done();
      })
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
