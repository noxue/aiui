<template>
    <div class="tab-container">
        <el-button type="primary" @click="saveTemplate()">保存修改</el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in tabMap" :label="item.label" :key="item.key" :name="item.key">
                <keep-alive>
                    <keyword-pane v-if='activeName=="keyword"' @submit-keyword-update="updateKeyword" @submit-voice-delete="voiceDelete" @submit-voice-update="updateVoice"   v-bind:initTemplate='template'  v-bind:initKeywords='template["keyword"]' v-bind:initTypes='template["type"]'></keyword-pane>
                    <flow-pane v-else-if='activeName=="flow"' v-bind:initTemplate='template' @submit-flow-update="updateFlow" @submit-voice-update="updateVoice" ></flow-pane>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import keywordPane from './components/keywordPane'
import flowPane from './components/flowPane'

export default {
  components: { keywordPane, flowPane },
  name: 'templateAdd',
  data() {
    return {
      activeName: 'flow',
      tabMap: [
        { label: '节点', key: 'flow' },
        { label: '全局关键词', key: 'keyword' }
        // { label: '客户分类', key: 'type' }
      ],
      template: {
        main: '', // 入口，第一个流程
        flow: {},
        keyword: {
          quiet1: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          quiet2: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword1: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword2: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          },
          noword3: {
            type: 0,
            voice: [],
            choice: 'random',
            conds: [],
            next: ''
          }
        },
        voice: {},
        type: [
          // 规则，time表示通话时间范围，单位秒。word表示
          {
            name: '未分类',
            rule: 'time:0,10;word:0,5;section:0,10'
          },
          {
            name: '空号',
            rule: ''
          },
          {
            name: 'A类',
            rule: ''
          },
          {
            name: 'B类',
            rule: ''
          },
          {
            name: 'C类',
            rule: ''
          },
          {
            name: 'D类',
            rule: ''
          },
          {
            name: 'E类',
            rule: ''
          },
          {
            name: 'F类',
            rule: ''
          }
        ]
      }
    }
  },
  created() {
    this.template = {
      'main': 'JUU0JUJCJThCJUU3JUJCJThEJUU1JUI5JUI2JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy',
      'flow': {
        'JUU0JUJCJThCJUU3JUJCJThEJUU1JUI5JUI2JUU4JUFGJUEyJUU5JTk3JUFFJUU5JTlDJTgwJUU2JUIxJTgy': {
          'section': {
            'type': 'condition',
            'voice': [
              'f618559afa62c72f65b96d43aa8fad93ac30c835'
            ],
            'choice': 'random',
            'conds': [
              {
                'keyword': [
                  '做什么#25',
                  '干嘛#25',
                  '做啥#25',
                  '什么#10'
                ],
                'to': 'JUU1JTg2JThEJUU2JUFDJUExJUU0JUJCJThCJUU3JUJCJThE'
              },
              {
                'keyword': [
                  '好的#25',
                  '可以#25',
                  '你说#25',
                  '好#25',
                  '需要#25'
                ],
                'to': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
              },
              {
                'keyword': [
                  '不用#25',
                  '不需要#77',
                  '你需要#25'
                ],
                'to': 'JUU2JThDJUJEJUU1JTlCJTlF'
              }
            ]
          },
          'next': 'JUU2JThDJUJEJUU1JTlCJTlF',
          'hook': true,
          'type': 0
        },
        'JUU2JThDJUJEJUU1JTlCJTlF': {
          'section': {
            'type': 'condition',
            'voice': [
              'c2fea2182648516b42446bfa29cbad920315c6b4',
              '622dd290810bb00d60c87355ffe6096fad39594f',
              '7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74'
            ],
            'choice': 'random',
            'conds': [
              {
                'keyword': [
                  'asdfasdf#25'
                ],
                'to': ''
              },
              {
                'keyword': [],
                'to': ''
              },
              {
                'keyword': [],
                'to': ''
              }
            ]
          },
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2',
          'hook': true,
          'type': 4
        },
        'JUU1JTg2JThEJUU2JUFDJUExJUU0JUJCJThCJUU3JUJCJThE': {
          'section': {
            'type': 'condition',
            'voice': [
              '06227df902d4350cadcffe0d17eeb499bd010ca4'
            ],
            'choice': 'random',
            'conds': []
          },
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2',
          'hook': true,
          'type': 4
        },
        'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2': {
          'section': {
            'type': 'condition',
            'voice': [
              'c04cdee1a86ad6e3f66135d7d59ae6688c573a8a',
              'ca71b2e676b836b30b0622a11f18e86587e688e1',
              'd31fdca0d475bdf41d845d1812961b0b707527a1'
            ],
            'choice': 'random',
            'conds': [
              {
                'keyword': [
                  '不用#25',
                  '谢谢#25',
                  '再见#25',
                  '不需要#25',
                  '你需要#25'
                ],
                'to': 'JUU5JTgyJTgwJUU3JUJBJUE2JUU1JUE0JUIxJUU4JUI0JUE1JUVGJUJDJThDJUU1JTg2JThEJUU4JUE3JTgx'
              },
              {
                'keyword': [],
                'to': 'JUU5JTgyJTgwJUU3JUJBJUE2JUU2JTg4JTkwJUU1JThBJTlG'
              }
            ]
          },
          'next': 'JUU5JTgyJTgwJUU3JUJBJUE2JUU2JTg4JTkwJUU1JThBJTlG',
          'hook': true,
          'type': 3
        },
        'JUU0JUJDJTk4JUU1JThBJUJG': {
          'section': {
            'type': 'condition',
            'voice': [
              '26c31553335a1fd07f7776e2f0b36e942d762b1d',
              '520d7b28d0df45cfe302768b58ec1e5ac471ea3f'
            ],
            'choice': 'random',
            'conds': []
          },
          'next': 'JUU1JTg2JThEJUU2JUFDJUExJUU0JUJCJThCJUU3JUJCJThE',
          'hook': true,
          'type': 3
        },
        'JUU5JTgyJTgwJUU3JUJBJUE2JUU1JUE0JUIxJUU4JUI0JUE1JUVGJUJDJThDJUU1JTg2JThEJUU4JUE3JTgx': {
          'section': {
            'type': 'end',
            'voice': [
              '41152b9f5842ffc4bc06145b102274f3a4e71d4a'
            ],
            'choice': '41152b9f5842ffc4bc06145b102274f3a4e71d4a'
          },
          'next': '',
          'hook': true,
          'type': 0
        },
        'JUU5JTgyJTgwJUU3JUJBJUE2JUU2JTg4JTkwJUU1JThBJTlG': {
          'section': {
            'type': 'end',
            'voice': [
              'f617d1661f1738a59d1cc03733c85a0ad6e56e35'
            ],
            'choice': 'random'
          },
          'next': '',
          'hook': true,
          'type': 2
        }
      },
      'keyword': {
        'quiet1': {
          'type': 0,
          'voice': [
            'cf34fe75dffec7282b54292bc8479dc76681b6c3'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'quiet2': {
          'type': 0,
          'voice': [
            'cf34fe75dffec7282b54292bc8479dc76681b6c3'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'noword1': {
          'type': 0,
          'voice': [
            'cf34fe75dffec7282b54292bc8479dc76681b6c3'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'noword2': {
          'type': 0,
          'voice': [
            'cf34fe75dffec7282b54292bc8479dc76681b6c3'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'noword3': {
          'type': 0,
          'voice': [
            'cf34fe75dffec7282b54292bc8479dc76681b6c3'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'JUU1JTg1JUFDJUU1JThGJUI4JUU1JTlDJUIwJUU1JTlEJTgw': {
          'type': 4,
          'keyword': [
            '公司#25',
            '地址#25',
            '哪里#25',
            '那里#25',
            '地方#25'
          ],
          'voice': [
            '7bd0b288eba4e14a69f2526f2e728e2afb72457d',
            'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
        },
        'JUU4JUFGJUEyJUU5JTk3JUFFJUU2JTk4JUFGJUU1JTkwJUE2JUU2JUFEJUEzJUU4JUE3JTg0': {
          'type': 5,
          'keyword': [
            '正规#25'
          ],
          'voice': [
            '51940df26dfdd5d8ab1744fb0280c588d12f0fc0'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'wait'
        },
        'JUU2JTlDJThEJUU1JThBJUExJUU2JTgwJThFJUU0JUI5JTg4JUU2JUEwJUI3': {
          'type': 4,
          'keyword': [
            '服务#25'
          ],
          'voice': [
            'b04888054d18c21f7f27ab88adeae6bf289b4786'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
        },
        'JUU4JUFGJUEyJUU5JTk3JUFFJUU1JTg1JUI2JUU0JUJCJTk2JUU0JUI4JTlBJUU1JThBJUExJUU1JTgxJTlBJUU0JUI4JThEJUU1JTgxJTlB': {
          'type': 5,
          'keyword': [
            '飞机#25',
            '飞船#25',
            '大炮#25',
            '走私#25',
            '枪火#25',
            '宇宙#25',
            '白粉#25',
            '租车#25',
            '注销#25'
          ],
          'voice': [],
          'choice': 'random',
          'conds': [
            {
              'keyword': [
                '好的#25',
                '可以#25',
                '没问题#25'
              ],
              'to': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
            }
          ],
          'next': 'return'
        },
        'JUU2JTk0JUI2JUU4JUI0JUI5': {
          'type': 3,
          'keyword': [
            '价格#25',
            '价钱#25',
            '收费#25',
            '费用#25',
            '多少钱#25',
            '钱#25'
          ],
          'voice': [
            'd55851338caa81a52c63936029b1e5f630c8927a'
          ],
          'choice': 'd55851338caa81a52c63936029b1e5f630c8927a',
          'conds': [],
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
        },
        'JUU1JUFCJThDJUU4JUI0JUI1': {
          'type': 4,
          'keyword': [
            '太贵#25',
            '优惠#25',
            '便宜#25',
            '打折#25',
            '折扣#25'
          ],
          'voice': [
            '31b9367fddd568b68e5cbf81aee8fa94388b0708'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
        },
        'JUU1JUFFJUEyJUU2JTg4JUI3JUU2JTgwJTgwJUU3JTk2JTkxJUU2JTk4JUFGJUU2JTlDJUJBJUU1JTk5JUE4JUU0JUJBJUJB': {
          'type': 4,
          'keyword': [
            '机器#25',
            '电脑#25',
            '软件#25',
            '程序#25',
            '自动#25',
            '录音#25'
          ],
          'voice': [
            '398999628876116b3eee7ebada46f72053195f19'
          ],
          'choice': 'random',
          'conds': [],
          'next': ''
        },
        'JUU1JUFFJUEyJUU2JTg4JUI3JUU4JUFFJUE5JUU2JTlDJUJBJUU1JTk5JUE4JUU0JUJBJUJBJUU3JUFEJTg5JUU0JUI4JTgwJUU0JUI4JThC': {
          'type': 0,
          'keyword': [
            '听我说#25',
            '等下#25',
            '等等#25'
          ],
          'voice': [
            '4986490ca8ad2bb18348219d7c7827d5c0a300a1',
            'c1556f29dc49977e38d8311a30857550ee3d5655'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'wait'
        },
        'JUU1JUFFJUEyJUU2JTg4JUI3JUU4JUFGJUEyJUU5JTk3JUFFJUU2JTgwJThFJUU0JUI5JTg4JUU2JTlDJTg5JUU0JUJCJTk2JUU1JThGJUI3JUU3JUEwJTgx': {
          'type': 0,
          'keyword': [
            '手机号#25',
            '联系方式#25'
          ],
          'voice': [
            '5380f4f7e8ff3bc6f810ecb8766f85618f6b8884'
          ],
          'choice': 'random',
          'conds': [],
          'next': 'wait'
        },
        'JUU4JUIwJTgzJUU2JTg4JThGJUU1JUFFJUEyJUU2JTlDJThE': {
          'type': 0,
          'keyword': [
            '美女#25',
            '几岁#25',
            '约你#25',
            '约会#25',
            '请你#25',
            '吃饭#25',
            '多大#25',
            '多少岁#25',
            '声音好听#25',
            '好听#25'
          ],
          'voice': [
            '09caade6139421700add2d7dd2579a399322cff7',
            '189509ef54a2cf03c756f026a656f3d93ba6fcd0'
          ],
          'choice': 'random',
          'conds': [
            {
              'keyword': [
                '没有#25',
                '不需要#25',
                '不用#25',
                '没#25'
              ],
              'to': 'JUU4JUFGJUI3JUU2JUIxJTgyJUU4JUFFJUE5JUU0JUI4JUJCJUU3JUFFJUExJUU4JTgxJTk0JUU3JUIzJUJCJUU0JUJCJTk2'
            }
          ],
          'next': 'wait'
        }
      },
      'voice': {
        'f618559afa62c72f65b96d43aa8fad93ac30c835': {
          'pcm': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.pcm',
          'path': '2018\\06\\21\\f618559afa62c72f65b96d43aa8fad93ac30c835.wav',
          'filename': '3.1.1',
          'text': '介绍并询问需求'
        },
        '26c31553335a1fd07f7776e2f0b36e942d762b1d': {
          'pcm': '2018\\06\\21\\26c31553335a1fd07f7776e2f0b36e942d762b1d.pcm',
          'path': '2018\\06\\21\\26c31553335a1fd07f7776e2f0b36e942d762b1d.wav',
          'filename': '3.2.0',
          'text': '介绍优势11111'
        },
        '520d7b28d0df45cfe302768b58ec1e5ac471ea3f': {
          'pcm': '2018\\06\\21\\520d7b28d0df45cfe302768b58ec1e5ac471ea3f.pcm',
          'path': '2018\\06\\21\\520d7b28d0df45cfe302768b58ec1e5ac471ea3f.wav',
          'filename': '3.2.1',
          'text': '介绍优势22222'
        },
        '06227df902d4350cadcffe0d17eeb499bd010ca4': {
          'pcm': '2018\\06\\21\\06227df902d4350cadcffe0d17eeb499bd010ca4.pcm',
          'path': '2018\\06\\21\\06227df902d4350cadcffe0d17eeb499bd010ca4.wav',
          'filename': '3.1.1.1',
          'text': '再次介绍，询问需要吗'
        },
        '41152b9f5842ffc4bc06145b102274f3a4e71d4a': {
          'pcm': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.pcm',
          'path': '2018\\06\\21\\41152b9f5842ffc4bc06145b102274f3a4e71d4a.wav',
          'filename': '3.4.2',
          'text': '不好意思打扰了'
        },
        'c04cdee1a86ad6e3f66135d7d59ae6688c573a8a': {
          'pcm': '2018\\06\\21\\c04cdee1a86ad6e3f66135d7d59ae6688c573a8a.pcm',
          'path': '2018\\06\\21\\c04cdee1a86ad6e3f66135d7d59ae6688c573a8a.wav',
          'filename': '3.3.1.ai1',
          'text': '发资料，约时间'
        },
        'ca71b2e676b836b30b0622a11f18e86587e688e1': {
          'pcm': '2018\\06\\21\\ca71b2e676b836b30b0622a11f18e86587e688e1.pcm',
          'path': '2018\\06\\21\\ca71b2e676b836b30b0622a11f18e86587e688e1.wav',
          'filename': '3.3.2.ai1',
          'text': '让会计师去电话'
        },
        'd31fdca0d475bdf41d845d1812961b0b707527a1': {
          'pcm': '2018\\06\\21\\d31fdca0d475bdf41d845d1812961b0b707527a1.pcm',
          'path': '2018\\06\\21\\d31fdca0d475bdf41d845d1812961b0b707527a1.wav',
          'filename': '3.3.2.ai2',
          'text': '让会计师给你介绍'
        },
        'c2fea2182648516b42446bfa29cbad920315c6b4': {
          'pcm': '2018\\06\\21\\c2fea2182648516b42446bfa29cbad920315c6b4.pcm',
          'path': '2018\\06\\21\\c2fea2182648516b42446bfa29cbad920315c6b4.wav',
          'filename': '4.2.1ai2',
          'text': '挽回1'
        },
        '622dd290810bb00d60c87355ffe6096fad39594f': {
          'pcm': '2018\\06\\21\\622dd290810bb00d60c87355ffe6096fad39594f.pcm',
          'path': '2018\\06\\21\\622dd290810bb00d60c87355ffe6096fad39594f.wav',
          'filename': '4.2.1ai1',
          'text': '挽回2'
        },
        '7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74': {
          'pcm': '2018\\06\\21\\7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74.pcm',
          'path': '2018\\06\\21\\7c2347a0d64ad422f1b3ba5c4ea5af693ddcbf74.wav',
          'filename': '4.2.1ai3',
          'text': '挽回3'
        },
        'f617d1661f1738a59d1cc03733c85a0ad6e56e35': {
          'pcm': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.pcm',
          'path': '2018\\06\\21\\f617d1661f1738a59d1cc03733c85a0ad6e56e35.wav',
          'filename': '3.4.1',
          'text': '邀约成功'
        },
        'cf34fe75dffec7282b54292bc8479dc76681b6c3': {
          'pcm': '2018\\06\\21\\cf34fe75dffec7282b54292bc8479dc76681b6c3.pcm',
          'path': '2018\\06\\21\\cf34fe75dffec7282b54292bc8479dc76681b6c3.wav',
          'filename': '6.1.2.ai1',
          'text': '没声音或没信号'
        },
        '7bd0b288eba4e14a69f2526f2e728e2afb72457d': {
          'pcm': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.pcm',
          'path': '2018\\06\\21\\7bd0b288eba4e14a69f2526f2e728e2afb72457d.wav',
          'filename': '5.2.1.ai1',
          'text': '我们在xxx地方11'
        },
        'afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c': {
          'pcm': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.pcm',
          'path': '2018\\06\\21\\afb4b8c7cbabaafc18653dcc9bf1e56b956fbe5c.wav',
          'filename': '5.2.2.ai1',
          'text': '我们在yyy地方22'
        },
        '51940df26dfdd5d8ab1744fb0280c588d12f0fc0': {
          'pcm': '2018\\06\\21\\51940df26dfdd5d8ab1744fb0280c588d12f0fc0.pcm',
          'path': '2018\\06\\21\\51940df26dfdd5d8ab1744fb0280c588d12f0fc0.wav',
          'filename': '5.1.5.ai1',
          'text': '我们是正规的公司'
        },
        'b04888054d18c21f7f27ab88adeae6bf289b4786': {
          'pcm': '2018\\06\\21\\b04888054d18c21f7f27ab88adeae6bf289b4786.pcm',
          'path': '2018\\06\\21\\b04888054d18c21f7f27ab88adeae6bf289b4786.wav',
          'filename': '5.1.8.ai1',
          'text': '服务一对一，绝对专业'
        },
        'd55851338caa81a52c63936029b1e5f630c8927a': {
          'pcm': '2018\\06\\21\\d55851338caa81a52c63936029b1e5f630c8927a.pcm',
          'path': '2018\\06\\21\\d55851338caa81a52c63936029b1e5f630c8927a.wav',
          'filename': '5.3.1ai1',
          'text': '介绍价格，小规模200'
        },
        '31b9367fddd568b68e5cbf81aee8fa94388b0708': {
          'pcm': '2018\\06\\21\\31b9367fddd568b68e5cbf81aee8fa94388b0708.pcm',
          'path': '2018\\06\\21\\31b9367fddd568b68e5cbf81aee8fa94388b0708.wav',
          'filename': '5.3.2.ai1',
          'text': '服务很厉害，可以体验一下'
        },
        '398999628876116b3eee7ebada46f72053195f19': {
          'pcm': '2018\\06\\21\\398999628876116b3eee7ebada46f72053195f19.pcm',
          'path': '2018\\06\\21\\398999628876116b3eee7ebada46f72053195f19.wav',
          'filename': '6.1.3.ai1',
          'text': '我不是机器人，统一话术而已'
        },
        '4986490ca8ad2bb18348219d7c7827d5c0a300a1': {
          'pcm': '2018\\06\\21\\4986490ca8ad2bb18348219d7c7827d5c0a300a1.pcm',
          'path': '2018\\06\\21\\4986490ca8ad2bb18348219d7c7827d5c0a300a1.wav',
          'filename': '6.1.7ai1',
          'text': '好的，你请讲'
        },
        'c1556f29dc49977e38d8311a30857550ee3d5655': {
          'pcm': '2018\\06\\21\\c1556f29dc49977e38d8311a30857550ee3d5655.pcm',
          'path': '2018\\06\\21\\c1556f29dc49977e38d8311a30857550ee3d5655.wav',
          'filename': '6.1.8.ai1',
          'text': '好的你请说'
        },
        '5380f4f7e8ff3bc6f810ecb8766f85618f6b8884': {
          'pcm': '2018\\06\\21\\5380f4f7e8ff3bc6f810ecb8766f85618f6b8884.pcm',
          'path': '2018\\06\\21\\5380f4f7e8ff3bc6f810ecb8766f85618f6b8884.wav',
          'filename': '6.1.10.ai1',
          'text': '公司分配的号码，可能你在网上留过号码'
        },
        '09caade6139421700add2d7dd2579a399322cff7': {
          'pcm': '2018\\06\\21\\09caade6139421700add2d7dd2579a399322cff7.pcm',
          'path': '2018\\06\\21\\09caade6139421700add2d7dd2579a399322cff7.wav',
          'filename': '6.1.11.ai1',
          'text': '不方便回答这个问题11'
        },
        '189509ef54a2cf03c756f026a656f3d93ba6fcd0': {
          'pcm': '2018\\06\\21\\189509ef54a2cf03c756f026a656f3d93ba6fcd0.pcm',
          'path': '2018\\06\\21\\189509ef54a2cf03c756f026a656f3d93ba6fcd0.wav',
          'filename': '6.1.12.ai1',
          'text': '不方便回答这个问题222'
        }
      },
      'type': [
        {
          'name': '未分类',
          'rule': 'time:0,10;word:0,5;section:0,10'
        },
        {
          'name': '空号',
          'rule': ''
        },
        {
          'name': 'A类',
          'rule': ''
        },
        {
          'name': 'B类',
          'rule': ''
        },
        {
          'name': 'C类',
          'rule': ''
        },
        {
          'name': 'D类',
          'rule': ''
        },
        {
          'name': 'E类',
          'rule': ''
        },
        {
          'name': 'F类',
          'rule': ''
        }
      ]
    }
  },
  methods: {
    saveTemplate() {
      console.log(JSON.stringify(this.template))
    },
    updateKeyword(keywords) {
      this.template.keyword = keywords
    },
    updateFlow(flows) {
      this.template.flow = flows
    },
    updateVoice(voiceList) {
      for (var k in voiceList) {
        this.template.voice[k] = voiceList[k]
      }
    },
    voiceDelete(hash) {
      this.$delete(this.template.voice, hash)
    }
  }
}
</script>


<style scoped>
.tab-container {
  margin: 30px;
}
</style>