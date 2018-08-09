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
          <li v-for="(item,k) in tasks" :key='k'  v-bind:class="{active:item.id===itemId}">
            <div>{{item.name}}</div>
            <span>{{item.status|taskStatus}}</span>
          </li>
        </ul>
        <!--工具条-->
        <el-col :span="24" class="bottom-toolbar">
          <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
          <el-pagination ref="pagination" layout="prev, pager, next" 
          :current-page.sync = "page"
          :page-size="20" :total="total" 
          style="float:right;">
          </el-pagination>
        </el-col>
        </div>
      </el-aside>
      
    </el-container>
</template>

<script>
// var echarts = require('echarts')
import NProgress from 'nprogress'
// , getTaskUserList, expExcel, editTaskUser, editTaskStatus, getTemplate, toDoRedial, countUserType, deleteTask
import { getTaskList } from '@/api/task'
export default {
  filters: {
    taskStatus(val) {
      if (val === 0) {
        return '已结束'
      } else if (val === 1) {
        return '未开始'
      } else if (val === 2) {
        return '已开始'
      } else if (val === 3) {
        return '执行中'
      } else if (val === 4) {
        return '暂停中'
      } else if (val === 5) {
        return '执行失败'
      }
      return '未知'
    }
  },
  data() {
    return {
      taskFilterName: '',
      page: 1,
      tasks: [],
      total: 0
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
        console.log(data)
        if (data.meta.code !== 0) {
          this.$message.error(data.meta.msg)
        } else {
          this.total = data.data.taskList.total
          this.tasks = data.data.taskList.list
        }
        NProgress.done()
      })
    }
  },
  mounted() {
    this.getTasks()
  },
  watchers: {
    'page': function(newValue, oldValue) {
      console.log(newValue)
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
