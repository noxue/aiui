<template>
<div class="app-container index-container">
  <el-row :gutter="10">
    <!--logo-->
    <el-col :span="9"><div class="grid-content bg-purple-first">
        <img src="/static/logo.png">
    </div></el-col>
    <!--今日业绩-->
    <el-col :span="9"><div class="grid-content bg-purple-second">
        <el-col :span="24"><div class="title">
           <span>今日呼叫</span>
        </div></el-col>
        <el-col :span="8"><div class="second-details">
            <span class="second-details-content">呼叫量: 55</span>
        </div></el-col>
        <el-col :span="8"><div class="second-details">
            <span class="second-details-content">接通数: 55</span>
        </div></el-col>
        <el-col :span="8"><div class="second-details">
            <span class="second-details-content">接通率: 100%</span>
        </div></el-col>
        <el-col :span="12"><div class="second-details-bottom">
            <span class="second-details-content">通话时长: 55s</span>
        </div></el-col>
        <el-col :span="12"><div class="second-details-bottom">
            <span class="second-details-content">平均通话: 55s</span>
        </div></el-col>

    </div></el-col>
    <!--待处理区域-->
    <el-col :span="6"><div class="grid-content bg-purple-third">
        <el-col :span="24"><div class="title">
          <span>待处理信息</span>
        </div></el-col>
        <el-col :span="24"><div style="margin-top:20px;margin-left:30px;">
          <span class="details-content" style="text-align:center;">待执行任务: 5</span>
        </div></el-col>
        <el-col :span="24"><div style="margin-top:10px;margin-left:30px;">
          <span class="details-content">待呼叫数量: 55</span>
        </div></el-col>
    </div></el-col>
    <!--echart-->
    <el-col :span="18"><div class="grid-content-bottom bg-purple">
        <el-col :span="24"><div class="bg-purple-echart-top">
            <el-col :span="6"><div class="title">
              <span>呼叫结果</span>
            </div></el-col>
            <el-col :span="5"><div class="echart-top">
              <el-select value="请选择卡号">
                <el-option :value="1">1</el-option>
                <el-option :value="2">2</el-option>
                <el-option :value="3">3</el-option>
              </el-select>
            </div></el-col>
            <el-col :span="13"><div class="echart-top">
              <el-date-picker
                v-model="timeSlot"
                type="daterange"
                value-format="yyyy-MM-dd"
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
      <el-col :span="24"><div class="grid bg-purple-light-bottom">
          <span class="title">关键字</span>
          <el-col :span="24"><div class="lower-right-corner">
              暂无不匹配现象
          </div></el-col>
      </div></el-col>
    </div></el-col>
  </el-row>
  </div>
</template>

<script>
var echarts = require('echarts')
// import vSidebar from './Sidebar.vue'
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import store from '@/store'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      timeSlot: []
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
  // created() {
  //   if (!this.roles.includes('role_admin')) {
  //     this.currentRole = 'editorDashboard'
  //   }
  // },
  methods: {
    dateFammte: function() {
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
    },
    toCount: function() {
      if (this.timeSlot[0] !== undefined) {
        this.dateFammte()
      }
      this.lineCount()
      this.pieCount()
    },
    lineCount: function() {
      const myChart = echarts.init(document.getElementById('homeChart'))
      myChart.setOption({
        legend: {
          data: ['A类', 'B类', 'C类', 'D类', 'E类', 'F类'],
          left: 'center'
        },
        title: { text: '统计结果' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [{
          name: 'A类',
          type: 'line',
          data: [73, 4, 53, 8, 176, 15, 6]
        },
        {
          name: 'B类',
          type: 'line',
          data: [9, 3, 5, 234, 1, 1, 19]
        },
        {
          name: 'C类',
          type: 'line',
          data: [93, 20, 35, 245, 59, 85, 114]
        },
        {
          name: 'D类',
          type: 'line',
          data: [343, 121, 76, 234, 167, 113, 245]
        },
        {
          name: 'E类',
          type: 'line',
          data: [6, 1, 290, 2, 290, 9, 14]
        },
        {
          name: 'F类',
          type: 'line',
          data: [323, 215, 50, 234, 165, 130, 234]
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
          // x: 'left',
          data: ['A意向强烈', 'B有意向', 'C待筛选', 'D拒绝', 'E在忙', 'F未接通']
        },
        series: [
          {
            name: '客户类型',
            type: 'pie',
            radius: ['50%', '70%'],
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
              { value: 335, name: 'A意向强烈' },
              { value: 272, name: 'B有意向' },
              { value: 651, name: 'C待筛选' },
              { value: 1299, name: 'D拒绝' },
              { value: 322, name: 'E在忙' },
              { value: 1351, name: 'F未接通' }
            ]
          }
        ]
      })
    }

  },
  mounted() {
    this.toCount()
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
img{
  height: 45%;
  max-width: 45%;
}
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
  margin-top:30px;
}
</style>