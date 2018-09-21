<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.name" @keyup.enter.native="getSipList" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getSipList">查询</el-button>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="sipLogs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="handler" label="处理人" v-if="isAdmin"  sortable>
        </el-table-column>
        <el-table-column prop="accepter" label="接收人"  sortable>
        </el-table-column>
        <el-table-column prop="num" label="分配数量"  sortable>
        </el-table-column>
        <el-table-column prop="result" label="结算"  sortable>
        </el-table-column>
        <el-table-column prop="createat" label="操作时间" :formatter="formatDate" sortable>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
  import { getSipLogs } from '@/api/sip'

export default {
    data() {
      return {
        filters: {
          name: ''
        },
        sipLogs: [],
        total: 0,
        page: 1,
        isAdmin: false,
        listLoading: false,
        sels: [] // 列表选中列
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getSipList()
      },
      // 获取用户列表
      getSipList() {
        const para = { page: this.page + '', name: this.filters.name }
        this.listLoading = true
        // NProgress.start();
        getSipLogs(para).then((response) => {
          this.total = response.data.data.sipLogList.total
          this.sipLogs = response.data.data.sipLogList.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      formatDate: function(row, column) {
        if (row.createat === '' || row.createat === null || row.createat === undefined) {
          return ''
        } else {
          var d = new Date(row.createat)
          var minute = d.getMinutes()
          if (minute < 10) {
            minute = '0' + minute // 补齐
          }
          var seconds = d.getSeconds()
          if (seconds < 10) {
            seconds = '0' + seconds // 补齐
          }
          return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
        }
      },
      selsChange: function(sels) {
        this.sels = sels
      },
      validateUser: function() {
        const role = localStorage.getItem('role')
        if (role.indexOf('role_admin') >= 0) {
          this.isAdmin = true
        }
      }
    },
    mounted() {
      this.getSipList()
      this.validateUser()
    }
  }

</script>

<style>

</style>
