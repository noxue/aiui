<template>
  <div class="app-container">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic"  label-position="top">
    <el-form-item label="选择工作日" >
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :label="'时间段' + (index+1)"
      :key="domain.key"
    >
    <el-time-picker
      is-range
      v-model="domain.workTime"
      :picker-options="{
        selectableRange: '00:00:00 - 23:59:59'
      }"
      placeholder="任意时间点">
    </el-time-picker>
    <el-button @click.prevent="removeDomain(domain)">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addDomain">新增时间段</el-button>
      <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
      <!-- <el-button @click="resetForm('dynamicValidateForm')">重置</el-button> -->
    </el-form-item>
  </el-form>
  </div> 
</template>
<script>
import { addUserConfig, getUserConfig } from '@/api/userConfig'
const cityOptions = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          workTime: ''
        }]
      },
      checkAll: false,
      checkedCities: [],
      getWorkDay: [0, 0, 0, 0, 0, 0, 0],
      cities: cityOptions,
      day: '',
      workday: '',
      isIndeterminate: true,
      filters: {
        desc(val) {
          if (val === '周日') {
            return '0'
          } else if (val === '周一') {
            return '1'
          } else if (val === '周二') {
            return '2'
          } else if (val === '周三') {
            return '3'
          } else if (val === '周四') {
            return '4'
          } else if (val === '周五') {
            return '5'
          } else if (val === '周六') {
            return '6'
          }
        }
      }
    }
  },
  methods: {
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    submitForm(formName) {
      this.getWorkDay = [0, 0, 0, 0, 0, 0, 0]
      for (var i = 0; i < this.checkedCities.length; i++) {
        this.day = this.checkedCities[i]
        this.workday = this.filters.desc(this.day)
        this.getWorkDay[this.workday] = 1
      }

      for (var a = 0; a < this.dynamicValidateForm.domains.length; a++) {
        if (this.dynamicValidateForm.domains[a].workTime === '' || this.dynamicValidateForm.domains[a].workTime === null) {
          alert('新增的时间段不可以为空')
          return false
        }
      }
      const data = {
        rep: [this.getWorkDay] + '',
        sech: JSON.stringify(this.dynamicValidateForm.domains) + ''
      }

      addUserConfig(data).then((response) => {
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
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        workTime: ''
        // key: Date.now()
      })
    },
    getConfig() {
      getUserConfig(Request).then((response) => {
        if (response.data.meta.success === false && response.data.meta.code !== 7002) {
          this.$message({
            message: response.data.meta.msg,
            type: 'fail'
          })
        } else {
          var checked = [0, 0, 0, 0, 0, 0, 0]
          var strRepeat = '' + JSON.parse(response.data.data.userConfig.value).repeat
          var ss = strRepeat.split(',')
          for (var i = 0; i < ss.length; i++) {
            if (ss[i] === '1') {
              checked[i] = cityOptions[i]
            }
          }
          this.checkedCities = checked
          var schedule = JSON.parse(response.data.data.userConfig.value).schedule
          if (schedule !== undefined) {
            var dema = new Array(schedule.length)
            for (var j = 0; j < schedule.length; j++) {
              dema[j] = schedule[j]
            }
            this.dynamicValidateForm.domains = dema
          }
        }
      })
    }
  },
  mounted() {
    this.getConfig()
  }
}
</script>