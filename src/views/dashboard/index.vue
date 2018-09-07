<template>
<div class="app-container index-container">
  <el-row :gutter="10">
    <!--logo-->
    <el-col :span="9"><div class="grid-content bg-purple-first">
      <img class="logo" src="/static/logo.png">
      <img class="wx" src="/static/wx.jpg">
    </div></el-col>
    <!--今日业绩-->
    <el-col :span="9"><div class="grid-content bg-purple-second">
        <el-col :span="24"><div class="title">
           <span>今日呼叫</span>
        </div></el-col>
        <el-col :span="10"><div class="second-details">
            <span class="second-details-content">呼叫量: {{todayCalled[0]}}</span>
        </div></el-col>
        <el-col :span="7"><div class="second-details">
            <span class="second-details-content">接通数: {{todayCalled[1]}}</span>
        </div></el-col>
        <el-col :span="7"><div class="second-details">
            <span class="second-details-content">接通率: {{todayCalled[2]}}</span>
        </div></el-col>
        <el-col :span="10"><div class="second-details-bottom">
            <span class="second-details-content">通话总时长: {{todayCalled[3]}}</span>
        </div></el-col>
        <el-col :span="9"><div class="second-details-bottom">
            <span class="second-details-content">平均通话: {{todayCalled[4]}}</span>
        </div></el-col>

    </div></el-col>
    <!--待处理区域-->
    <el-col :span="6"><div class="grid-content bg-purple-third">
        <el-col :span="24"><div class="title">
          <span>待处理信息</span>
        </div></el-col>
        <el-col :span="24"><div style="margin-top:20px;margin-left:30px;">
          <span class="details-content" style="text-align:center;">待执行任务: {{toDoTask}}</span>
        </div></el-col>
        <el-col :span="24"><div style="margin-top:10px;margin-left:30px;">
          <span class="details-content">待呼叫数量: {{toDoTaskUser}}</span>
        </div></el-col>
    </div></el-col>
    <!--echart-->
    <el-col :span="18"><div class="grid-content-bottom bg-purple">
        <el-col :span="24"><div class="bg-purple-echart-top">
            <el-col :span="6"><div class="title">
              <span>呼叫结果</span>
            </div></el-col>
            <!-- <el-col :span="5"><div class="echart-top">
              <el-select value="请选择卡号">
                <el-option :value="1">1</el-option>
                <el-option :value="2">2</el-option>
                <el-option :value="3">3</el-option>
              </el-select>
            </div></el-col> -->
            <el-col :span="18"><div class="echart-top">
              <el-date-picker
                v-model="timeSlot"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-button  @click.native="toCount">统计</el-button>
            </div></el-col>
        </div></el-col>
        <el-col :span="24"><div class="bg-purple-echart-bottom">
            <el-col :span="16"><div id="homeChart">

            </div></el-col>
            <el-col :span="8"><div id="pieChart">

            </div></el-col>
        </div></el-col>
    </div></el-col>
    <!--右下角信息-->
    <el-col :span="6"><div class="grid-content-bottom bg-purple-light">
      <!--为出现的关键词-->
      <el-col :span="24"><div class="grid bg-purple-light-top">
          <span class="title">异常信息</span>
          <el-col :span="24"><div class="lower-right-corner">
              暂无异常信息
          </div></el-col>
      </div></el-col>  
      <!--错误报告-->
      <!-- <el-col :span="24"><div class="grid bg-purple-light-bottom">
          <span class="title">关键字</span>
          <el-col :span="24"><div class="lower-right-corner">
              暂无不匹配现象
          </div></el-col>
      </div></el-col> -->
    </div></el-col>
  </el-row>
  </div>
</template>

<script>
var echarts = require('echarts')
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import store from '@/store'
import { getCountList, getTaskToDo, todayCount } from '@/api/task'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      timeSlot: [],
      countList: [],
      userType: ['未分类', '未接听', '空号', '停机', '关机', 'A类', 'B类', 'C类', 'D类', 'E类', 'F类'],
      timeList: ['', '', '', '', '', '', ''],
      NECL: [0, 0, 0, 0, 0, 0, 0],
      NASL: [0, 0, 0, 0, 0, 0, 0],
      SPACEL: [0, 0, 0, 0, 0, 0, 0],
      DIEL: [0, 0, 0, 0, 0, 0, 0],
      CLOSEL: [0, 0, 0, 0, 0, 0, 0],
      AL: [0, 0, 0, 0, 0, 0, 0],
      BL: [0, 0, 0, 0, 0, 0, 0],
      CL: [0, 0, 0, 0, 0, 0, 0],
      DL: [0, 0, 0, 0, 0, 0, 0],
      EL: [0, 0, 0, 0, 0, 0, 0],
      FL: [0, 0, 0, 0, 0, 0, 0],
      countData: [],
      countData1: [],
      numList: [],
      index: '',
      toDoTask: '',
      toDoTaskUser: '',
      todayCalled: []
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    routes() {
      return store.getter.routes
    }
  },
  methods: {
    getToDoData: function() {
      getTaskToDo(Request).then(response => {
        if (response.data.meta.success === false) {
          this.$message.error({
            message: response.data.meta.msg,
            type: 'fail'
          })
        } else {
          if (response.data.data.countTask.length > 0) {
            this.toDoTask = response.data.data.countTask[0]
            this.toDoTaskUser = response.data.data.countTask[1]
          }
        }
      })
    },
    todayCallCount: function() {
      todayCount().then(response => {
        this.todayCalled = response.data.data.today
      })
    },
    toCount: function() {
      if (this.timeSlot[0] !== undefined) {
        var data1 = Date.parse(this.timeSlot[0].replace(/-/g, '/'))
        var data2 = Date.parse(this.timeSlot[1].replace(/-/g, '/'))
        var datadiff = data2 - data1
        var time = 7 * 24 * 60 * 60 * 1000
        if (this.timeSlot[0].length > 0 && this.timeSlot[0].length > 0) {
          if (datadiff < 0 || datadiff > time) {
            alert('开始时间应小于结束时间并且间隔小于或等于7天，请检查!')
            return false
          }
        }
      }
      const para = {
        staTime: this.timeSlot[0],
        endTime: this.timeSlot[1]
      }
      getCountList(para).then(response => {
        if (response.data.meta.success === false) {
          this.$message({
            message: response.data.meta.msg,
            type: 'fail'
          })
        } else {
          this.countList = []
          this.countData1 = []
          this.countData = []
          this.NECL = [0, 0, 0, 0, 0, 0, 0]
          this.NASL = [0, 0, 0, 0, 0, 0, 0]
          this.SPACEL = [0, 0, 0, 0, 0, 0, 0]
          this.DIEL = [0, 0, 0, 0, 0, 0, 0]
          this.CLOSEL = [0, 0, 0, 0, 0, 0, 0]
          this.AL = [0, 0, 0, 0, 0, 0, 0]
          this.BL = [0, 0, 0, 0, 0, 0, 0]
          this.CL = [0, 0, 0, 0, 0, 0, 0]
          this.DL = [0, 0, 0, 0, 0, 0, 0]
          this.EL = [0, 0, 0, 0, 0, 0, 0]
          this.FL = [0, 0, 0, 0, 0, 0, 0]
          this.countList = response.data.data.countType
          for (var i = 0; i < this.countList.length; i++) {
            this.countData1.push((this.countList[i].date).substring(0, 10))
          }
          this.countData = this.unique(this.countData1)
          for (var j = 0; j < this.countList.length; j++) {
            if (this.countData.indexOf((this.countList[j].date).substring(0, 10)) > -1) {
              this.index = this.countData.indexOf((this.countList[j].date).substring(0, 10))
            }
            if (this.countList[j].type === 0) {
              this.NECL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 1) {
              this.NASL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 2) {
              this.SPACEL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 3) {
              this.DIEL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 4) {
              this.CLOSEL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 5) {
              this.AL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 6) {
              this.BL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 7) {
              this.CL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 8) {
              this.DL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 9) {
              this.EL[this.index] = this.countList[j].num
            }
            if (this.countList[j].type === 10) {
              this.FL[this.index] = this.countList[j].num
            }
          }
        }
        this.lineCount()
        this.pieCount()
      })
    },
    lineCount: function() {
      const myChart = echarts.init(document.getElementById('homeChart'))
      myChart.setOption({
        legend: {
          data: this.userType,
          left: 'center'
        },
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          data: this.countData
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: this.userType[0],
            type: 'line',
            data: this.NECL
          }, {
            name: this.userType[1],
            type: 'line',
            data: this.NASL
          }, {
            name: this.userType[2],
            type: 'line',
            data: this.SPACEL
          }, {
            name: this.userType[3],
            type: 'line',
            data: this.DIEL
          }, {
            name: this.userType[4],
            type: 'line',
            data: this.CLOSEL
          },
          {
            name: this.userType[5],
            type: 'line',
            data: this.AL
          },
          {
            name: this.userType[6],
            type: 'line',
            data: this.BL
          },
          {
            name: this.userType[7],
            type: 'line',
            data: this.CL
          },
          {
            name: this.userType[8],
            type: 'line',
            data: this.DL
          },
          {
            name: this.userType[9],
            type: 'line',
            data: this.EL
          },
          {
            name: this.userType[10],
            type: 'line',
            data: this.FL
          }]
      })
    },
    pieCount: function() {
      const myChart = echarts.init(document.getElementById('pieChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          x: 'center',
          data: this.userType
        },
        series: [
          {
            name: '客户类型',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.sum(this.NECL), name: this.userType[0] },
              { value: this.sum(this.NASL), name: this.userType[1] },
              { value: this.sum(this.SPACEL), name: this.userType[2] },
              { value: this.sum(this.DIEL), name: this.userType[3] },
              { value: this.sum(this.CLOSEL), name: this.userType[4] },
              { value: this.sum(this.AL), name: this.userType[5] },
              { value: this.sum(this.BL), name: this.userType[6] },
              { value: this.sum(this.CL), name: this.userType[7] },
              { value: this.sum(this.DL), name: this.userType[8] },
              { value: this.sum(this.EL), name: this.userType[9] },
              { value: this.sum(this.FL), name: this.userType[10] }
            ]
          }
        ]
      })
    },
    unique: function(item) {
      var len = item.length
      var result = []
      for (var i = 0; i < len; i++) {
        var flag = true
        for (var j = i; j < item.length - 1; j++) {
          if (item[i] === item[j + 1]) {
            flag = false
            break
          }
        }
        if (flag) {
          result.push(item[i])
        }
      }
      return result
    },
    sum: function(item) {
      var totle = 0
      for (var i = 0; i < item.length; i++) {
        totle += item[i]
      }
      return totle
    }
  },
  mounted() {
    this.toCount()
    this.todayCallCount()
    this.getToDoData()
  }

}
</script>

<style scoped>

.index-container{
  background: #eee;
}

.index-container  .grid-content,.index-container .grid-content-bottom {
  background:#fff;
  box-shadow: #ddd 2px 2px 8px;
}

.bg-purple-first {
  color: #444;
}

.logo{
  max-width: 60%;
  text-align: center;
  line-height: 100%;
  float: left;
  margin-top:20px; 
  margin-left:10px; 
}
.wx{
  height: 95%;
  max-width: 35%;
  text-align: right;
  float: right;
  margin-right:10px; 
} 

/* img{
  height: 45%;
  max-width: 45%;
} */
.title{
  font-size:15px;
  color: black;
  font-weight:bold;

}
.bg-purple-second {
  color: #444;
}
.second-details{
  margin-top:20px;
  font-size:14px;
}

.second-details-bottom{
  font-size:14px;
  margin-top:10px;
}
.details-content{
  font-size:14px;
}
.bg-purple-third {
  color: #444;
}
.bg-purple {
  color: #444
}
.bg-purple-light {
  color: #444
}
.grid-content {
  border-radius: 4px;
  height: 160px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left:10px;
}
.grid-content-bottom {
  border-radius: 4px;
  height: 380px;
  padding-top: 10px;
  padding-left:10px;
}

.bg-purple-light-top {
  height: 80px;
}

.bg-purple-light-bottom {
  padding-top: 10px;
  height: 290px;
  
}
.bg-purple-echart-top {
  height: 36px;
}
.bg-purple-echart-bottom {
  height: 344px;
}
.lower-right-corner{
  font-size:14px;
  margin-top:10px;
  margin-left:30px;
}
.echart-top{
  text-align: right;
}
#homeChart{
  height:344px;
  margin-top:10px;
}
#pieChart{
  height:344px;
  margin-top:20px;
}
</style>