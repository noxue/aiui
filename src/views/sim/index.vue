<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" onsubmit="return false">
          <el-form-item>
            <el-input v-model="filters.number" @keyup.enter.native="getSims" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getSims">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFormVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="sims" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="number" label="号码" width="120" sortable>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="180" sortable>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="small" @click="handleAssign(scope.$index, scope.row)">分配</el-button>
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
          <el-form-item label="号码" prop="number">
            <el-input v-model="editForm.number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="userId">
            <el-input v-model="editForm.userId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择网关" prop="gateway">
            <!-- <el-select v-model="editForm.gate" placeholder="请选择"> -->
            <el-select v-model="newGatewayId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
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

      <!--分配号码界面-->
      <el-dialog title="号码分配" :visible.sync="assignFormVisible">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.userId" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click.native="assignSimUser">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-form :model="assignForm" label-width="50px" ref="assignForm">
          <el-table :data="simUsers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="userId" label="用户名" width="350" sortable>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="handleDelSimUser(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column> 
          </el-table>  
        </el-form>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click.native="assignFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="assignSubmit" :loading="addLoading">提交</el-button>
        </div> -->
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="号码" prop="number">
            <el-input v-model="addForm.number" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="用户" prop="userId">
            <el-input v-model="addForm.userId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择网关" prop="gateway">
            <el-select v-model="addForm.gateway" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
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
  import { getSimList, addSim, deleteSim, editSim, getGatewaysListByUid, getSimUserList, addSimUser, deleteSimUser } from '@/api/sim'
export default {
    data() {
      return {
        filters: {
          number: '',
          userId: ''
        },
        options: [],
        assignSimId: '',
        gateway: '',
        newGatewayId: '',
        sims: [],
        simUsers: [],
        total: 0,
        userTotal: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        assignFormVisible: false, // 号码分配界面是否显示
        assignLoading: false,
        assignForm: {
          userId: ''
        },
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          number: [
            { required: true, message: '请输入号码', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请输入用户', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请填写备注', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          userId: '',
          number: '',
          gateway: this.gateway,
          description: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          number: [
            { required: true, message: '请输入号码', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '请输入用户', trigger: 'blur' }
          ],
          gateway: [
            { required: true, message: '请选择网关', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请填写备注', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          userId: '',
          number: '',
          gatewayId: '',
          description: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val
        this.getSims()
      },
      // 获取用户列表
      getSims() {
        const para = { page: this.page + '', number: this.filters.number }
        this.listLoading = true
        // NProgress.start();
        getSimList(para).then((response) => {
          this.total = response.data.data.simList.total
          this.sims = response.data.data.simList.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      // 获取电话分配用户列表
      getSimUsers(simId) {
        const para = { page: this.page + '', simId: simId + '' }
        this.listLoading = true
        // NProgress.start();
        getSimUserList(para).then((response) => {
          console.log(response)
          this.userTotal = response.data.data.simpUserList.total
          this.simUsers = response.data.data.simpUserList.list
          this.listLoading = false
        // NProgress.done();
        })
      },
      getGatewayList() {
        // NProgress.start();
        getGatewaysListByUid(Request).then((response) => {
          this.options = response.data.data.gatewayList.list
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
          deleteSim(para).then((response) => {
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
            this.getSims()
          })
        }).catch(() => {

        })
      },
      // 删除
      handleDelSimUser: function(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          // NProgress.start();
          const para = { id: '' + row.id + '' }
          deleteSimUser(para).then((response) => {
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
            this.getSimUsers(this.assignSimId)
          })
        }).catch(() => {

        })
      },
      // 显示编辑界面
      handleEdit: function(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
        this.userId = row.userId
        this.newGatewayId = row.gatewayId
      },
      handleAssign: function(index, row) {
        this.assignFormVisible = true
        this.assignForm = Object.assign({}, row)
        this.assignSimId = row.id
        this.getSimUsers(this.assignSimId)
      },
      // 显示新增界面
      handleAdd: function() {
        this.addFormVisible = true
        // this.addForm = {
        //   number: '',
        //   userId: '',
        //   gatewayId: '',
        //   description: ''
        // }
      },
      // 编辑
      editSubmit: function() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              // NProgress.start();
              const reqData = {
                id: this.editForm.id + '',
                number: this.editForm.number + '',
                userId: this.editForm.userId,
                gatewayId: this.newGatewayId + '',
                description: this.editForm.description
              }
              editSim(reqData).then((response) => {
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
                this.getSims()
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
              const reqData = {
                number: para.number + '',
                userId: para.userId,
                gatewayId: para.gateway + '',
                description: para.description
              }
              // alert(this.$refs.addForm)
              addSim(reqData).then((response) => {
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
                this.getSims()
              })
            })
          }
        })
      },
      // 分配号码
      assignSimUser: function() {
        const reqData = {
          simId: this.assignSimId + '',
          userId: this.filters.userId
        }
        addSimUser(reqData).then((response) => {
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
          this.getSimUsers(this.assignSimId)
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
          //   this.getSims()
          // })
        }).catch(() => {

        })
      }
    },
    mounted() {
      this.getSims()
      this.getGatewayList()
    }
  }

</script>

<style>

</style>
