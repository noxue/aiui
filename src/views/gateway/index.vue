<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.name" @keyup.enter.native="getGateways" placeholder="网关名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.username" @keyup.enter.native="getGateways" placeholder="用户"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getGateways">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFormVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="gateways" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="名称" sortable>
        </el-table-column>
        <el-table-column prop="ip"   label="ip"  sortable>
        </el-table-column>
        <el-table-column prop="port" label="端口" sortable>
        </el-table-column>
        <el-table-column prop="userId" label="用户" sortable>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="180" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
      <!--编辑界面-->
      <el-dialog title="编辑"  :visible.sync="editFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="网关名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="ip" prop="ip">
            <el-input v-model="editForm.ip" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="editForm.port" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="userId">
            <el-input v-model="editForm.userId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
           <el-input type="textarea" v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="网关名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="ip" prop="ip">
            <el-input v-model="addForm.ip" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="addForm.port" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户端" prop="app_id">
            <el-select v-model="addForm.app_id" placeholder="请选择客户端">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
					</el-form-item>
          <el-form-item label="用户" prop="userId">
            <el-input v-model="addForm.userId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
           <el-input type="textarea" v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
  import { getGatewayList, addGateway, deleteGateway, editGateway, getAllApp } from '@/api/gateway'
export default {
    data() {
      return {
        filters: {
          name: '',
          username: ''
        },
        gateways: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        options: [],
        app_id: '',
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入ip', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请输入端口号', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请输入用户登录名', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          name: '',
          ip: '',
          port: '',
          userId: '',
          description: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入ip', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请输入端口号', trigger: 'blur' }
          ],
          app_id: [
            { required: true, message: '请选择客户端', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请输入用户登录名', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          name: '',
          ip: '',
          port: '',
          app_id: '',
          userId: '',
          description: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getGateways()
      },
      // 获取网关列表
      getGateways() {
        const para = { page: this.page + '', name: this.filters.name, username: this.filters.username }
        this.listLoading = true
        // NProgress.start();
        getGatewayList(para).then((response) => {
          this.total = response.data.data.gatewayList.total
          this.gateways = response.data.data.gatewayList.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      getAllApps() {
        // NProgress.start();
        getAllApp().then((response) => {
          this.options = response.data.data.appList.list
        })
      },
      // 删除
      handleDel: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          const para = { id: '' + row.id + '' }
          deleteGateway(para).then((response) => {
            this.listLoading = false
            // NProgress.done();
            if (response.data.meta.success === false) {
              this.$message({
                message: response.data.meta.msg,
                type: 'fail'
              })
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.getGateways()
          })
        }).catch(() => {

        })
      },
      // 显示编辑界面
      handleEdit: function(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      // 显示新增界面
      handleAdd: function() {
        this.addFormVisible = true
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
                name: para.name,
                ip: para.ip,
                port: para.port + '',
                userId: para.userId,
                description: para.description
              }
              editGateway(reqData).then((response) => {
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
                this.getGateways()
              })
            })
          }
        })
      },
      // 新增
      addSubmit: function() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true
              // NProgress.start();
              const para = Object.assign({}, this.addForm)
              console.log(para)
              const reqData = {
                name: para.name,
                ip: para.ip,
                port: para.port + '',
                app_id: para.app_id + '',
                userId: para.userId,
                description: para.description
              }
              addGateway(reqData).then((response) => {
                this.addLoading = false
                // NProgress.done();
                if (response.data.meta.success === false) {
                  this.$message({
                    message: response.data.meta.msg,
                    type: 'fail'
                  })
                } else {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                }
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getGateways()
              })
            })
          }
        })
      },
      selsChange: function(sels) {
        this.sels = sels
      },
      // 批量删除
      batchRemove: function() {
        // var ids = this.sels.map(item => item.id).toString()
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          // const para = { ids: ids }
          // batchRemoveUser(para).then((res) => {
          //   this.listLoading = false
          //   // NProgress.done();
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   })
          //   this.getGateways()
          // })
        }).catch(() => {

        })
      }
    },
    mounted() {
      this.getGateways()
      this.getAllApps()
    }
  }

</script>

<style>

</style>
