<template>
  <view class="main-index">
    <!-- <image class="top-img" :src="IMG.banner" alt="" /> -->
    <view class="top-title">
      <div></div>
      <div class="top-title-box">
        <image
          v-if="isMyself"
          class="top-title-box-background"
          mode="widthFix"
          :src="IMG.topBanner"
        >
        </image>
        <image
          v-else
          class="top-title-box-background"
          mode="widthFix"
          :src="IMG.topBanner1"
        >
        </image>
        <div class="top-title-flex">
          <div class="top-title-box-title">
            <image
              class="top-title-box-title-logo"
              mode="widthFix"
              :src="IMG.logo"
            ></image>
            <text class="title">盐易码</text>
            <!-- 这里是眼睛的图切换 -->
            <image
              v-show="!isDisplayname"
              class="idcard-eye"
              mode="widthFix"
              :src="IMG.noEye"
              @click="triggerName"
            ></image>
            <image
              v-show="isDisplayname"
              class="idcard-eye"
              mode="widthFix"
              :src="IMG.eye"
              @click="triggerName"
            ></image>
          </div>
          <div class="top-title-box-name">
            <text class="top-title-box-name-title">姓名：</text>
            <text class="top-title-box-name-value">{{ displayname }}</text>
            <text
              v-if="familyAgentList.length > 1 && changeTab === 0"
              class="top-title-box-name-type"
              >{{ isMyself ? "本人" : "非本人" }}</text
            >
            <div
              v-if="familyAgentList.length > 1 && changeTab === 0"
              class="switch-person"
              @click="switchPerson"
            >
              <span>切换申领人</span>
              <image class="change" mode="widthFix" :src="IMG.change"></image>
            </div>
          </div>
          <div class="top-title-box-name">
            <text class="top-title-box-name-title">证件号码：</text>
            <text class="top-title-box-name-value">{{ displayIdCard }}</text>
          </div>
        </div>
      </div>
    </view>

    <template v-if="indexShow">
      <!-- 主动进 我想要 -->
      <IndexContentBoxVue v-if="changeTab === 0" class="iWant" :box="box1" />

      <!-- 主动进 我的信息 -->
      <div v-if="changeTab === 0" class="my-message">
        <div class="my-message-box">
          <div class="my-message-box-title">
            <div class="tit">{{ isMyself ? "我的信息" : "他的信息" }}</div>
            <div class="button" @click="goQRcode">
              <div>{{ isMyself ? "我的二维码" : "他的二维码" }}</div>
              <img class="right" mode="widthFix" :src="IMG.right3" alt="" />
            </div>
          </div>
          <div class="my-message-box-content">
            <div class="block left">
              <img
                class="codes"
                :src="
                  health == '绿码'
                    ? IMG.code1
                    : health == '黄码'
                    ? IMG.code2
                    : health == '红码'
                    ? IMG.code3
                    : IMG.noCode
                "
                alt=""
                :mode="widthFix"
              />
              <div class="data">{{ health }}</div>
              <div class="line">健康码</div>
            </div>
            <div class="block center" @click="openNucleicReport">
              <nucleicReport
                :nucleicResult="nucleicResult"
                :checktime="checktime"
                :nucleicDate="nucleicDate"
                :nucleicState="nucleicState"
              />
            </div>
            <div class="block right" @click="openVaccination">
              <vaccinationCom
                :vaccinationNum="vaccinationNum"
                :vaccinationTime="vaccinationTime"
              />
            </div>
          </div>
          <view class="qrcode-bottom">
            <view
              class="edit-box"
              @click="editShowPop"
              style="border-right: 1px solid #e9e9e9"
            >
              <text class="edit-box-title">重新填写</text>
            </view>
            <view class="edit-box" @click="toFamilyAgent" v-if="isMyself">
              <text class="edit-box-title">家人代办</text>
            </view>
            <view class="edit-box" @click="deleteFamilyAgent" v-else>
              <text class="edit-box-title">删除申领人</text>
            </view>
          </view>
        </div>
      </div>

      <!-- 扫码进 code -->
      <div class="code" v-if="changeTab === 1">
        <img
          v-if="isMyself"
          class="watermarker"
          :src="IMG.watermarker"
          alt=""
          mode="widthFix"
        />
        <div class="code-time" v-cloak>{{ time }}</div>
        <view class="code-gcode-title">{{
          isMyself ? curPlace : "健康码状态"
        }}</view>
        <block v-if="qrcodeColor">
          <TkiQrcode
            :loadMake="true"
            :val="qrcodeText"
            :foreground="qrcodeColor"
            :pdground="qrcodeColor"
            size="350"
          />
        </block>
        <block v-else>
          <img class="qrcode-img" mode="widthFix" :src="qrcodeImg" alt="" />
        </block>
        <view class="qrcode-info">
          <div v-if="vaccinationNum" class="btn" @click="openVaccination">
            <img class="yimiao" :src="IMG.yimiao" alt="" mode="widthFix" />
            <span>已接种：{{ vaccinationNum }}针</span>
            <span style="margin-left: 10rpx">></span>
          </div>
          <text v-else>未查询到结果</text>
        </view>
      </div>

      <!-- 扫码进 trip & report -->
      <div class="trip-report" v-if="changeTab === 1">
        <div class="trip-report-item" @click="openNucleicReport">
          <nucleic
            :checktime="checktime"
            :nucleicDate="nucleicDate"
            :nucleicState="nucleicState"
          />
        </div>
        <div class="trip-report-item">
          <div class="trip-report-item-title">
            <p>疫情重点地区核验</p>
          </div>

          <block v-if="epidemic == 0">
            <div class="report-info">
              <div class="report-info-title">14天内疫情重点地区记录</div>
            </div>
            <div @click="openNucleicPopShow" style="text-align: center">
              <span class="button">立即查看</span>
            </div>
          </block>
          <div class="lineYQ" v-else>
            <img
              class="report-nojourney"
              :src="epidemic == 1 ? IMG.epidemic1 : IMG.epidemic2"
              alt=""
              mode="widthFix"
            />
            <div class="report-info-base">
              {{
                epidemic == 1
                  ? "14天内未到访疫情重点地区"
                  : epidemic == 2
                  ? "14天内到访疫情重点地区 "
                  : "未查询到14天内到访记录 "
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 行程卡 trip -->
      <view class="addtion">
        <view class="addtion-cell" @click="toOffcialTripCode">
          <image
            class="addtion-cell-icon"
            mode="widthFix"
            :src="IMG.tripCard"
          />
          <view class="addtion-cell-title">行程卡</view>
          <div class="addtion-cell-btn">立即查看</div>
        </view>
      </view>

      <!-- 专项应用 -->
      <IndexContentBoxVue v-if="changeTab === 0" :box="box2" />

      <div class="bottom-text">本服务由海盐县人民政府提供</div>
    </template>

    <!-- 家人代办弹窗 -->
    <div class="trip-card-box" v-if="familyAgentPopShow">
      <ul class="family-agent-list">
        <block v-for="item in familyAgentList" :key="item.ids">
          <li
            v-if="item.show"
            class="family-agent-list-item"
            @click="toApplyAgent(item)"
          >
            {{ item.name }}
          </li>
        </block>
        <li class="family-agent-list-close" @click="closePop">取消</li>
      </ul>
    </div>

    <!-- 删除申领人弹窗 -->
    <div class="trip-card-box" v-if="deleteFamilyAgentPopShow">
      <div class="delete-agent-box">
        <text class="delete-agent-box-title">是否删除该申领人？</text>
        <text class="delete-agent-box-desc"
          >删除后，该申领人健康码不再显示</text
        >
        <div class="delete-agent-box-btn">
          <div class="delete-agent-box-btn-item" @click="confirmDelete">
            确认删除
          </div>
          <div class="delete-agent-box-btn-item" @click="cancelDelete">
            取消
          </div>
        </div>
      </div>
    </div>

    <!-- 重新填写确认弹窗 -->
    <div class="trip-card-box" v-if="editPopShow">
      <div class="delete-agent-box">
        <text class="delete-agent-box-desc"
          >你每天有一次重新修改的机会，请谨慎填写，填写不实信息将追究法律责任</text
        >
        <div class="delete-agent-box-btn">
          <div class="delete-agent-box-btn-item" @click="cancelEdit">取消</div>
          <div class="delete-agent-box-btn-item" @click="editInfo">
            重新填写
          </div>
        </div>
      </div>
    </div>

    <!-- 疫情重点地区手机核验弹窗 -->
    <div class="trip-card-box" v-if="nucleicPopShow">
      <div class="epidemic-box">
        <text class="epidemic-box-title">疫情重点地区手机核验</text>
        <div class="epidemic-box-content">
          <input
            class="epidemic-box-content-phone"
            type="number"
            v-model="mphone"
          />
          <div class="yzm">
            <input
              class="epidemic-box-content-yzm"
              type="number"
              v-model="yzm"
              placeholder="请输入验证码"
            />
            <button
              :class="['mini-btn', yzmDisable ? 'yzmDisable' : '']"
              size="mini"
              :disabled="yzmDisable"
              @click="getYZM"
            >
              {{ yzmText }}
            </button>
          </div>
          <checkbox-group :value="result" @change="changeCheckbox">
            <div class="flex">
              <checkbox value="1" id="box1"></checkbox>
              <label class="promiss" for="box1">
                同意并授权运营商查询本人在疫情期间14 天内到访信息
              </label>
            </div>
          </checkbox-group>
          <button
            type="primary"
            :disabled="btnDisable"
            plain="true"
            @click="queryEpidemic"
          >
            查询
          </button>
          <div class="tips">
            <img class="no" :src="IMG.noCode" alt="" mode="widthFix" />
            <div>一天仅需核验一次</div>
          </div>
        </div>
        <img
          class="close"
          :src="IMG.close1"
          alt=""
          mode="widthFix"
          @click="closequeryEpidemic"
        />
      </div>
    </div>

    <!-- 核酸报告弹窗 -->
    <div class="trip-card-box" v-if="nucleicReportShow">
      <div class="nucleic-report">
        <div class="nucleic-report-title">
          <img class="title-icon" :src="IMG.tit1" alt="" mode="widthFix" />
          <text>核酸检测记录</text>
        </div>
        <div class="nucleic-report-content">
          <div class="name">{{ cname }}</div>
          <div
            class="box"
            v-for="(item, index) in nucleicReportList"
            :key="index"
          >
            <div class="box-title">
              <div class="key">报告时间：</div>
              <div class="value">{{ item.report_on_time }}</div>
            </div>
            <div class="content">
              <div class="left">
                <div class="result">
                  <div class="key">检测结果：</div>
                  <div
                    class="value"
                    :style="{
                      color: item.result == '阳性' ? '#EC4B40' : '#4CAA63',
                    }"
                  >
                    {{ item.result }}
                  </div>
                </div>
                <div class="unit">
                  <div class="key">检测机构：</div>
                  <div class="value">{{ item.institutions }}</div>
                </div>
              </div>
              <div
                class="right"
                :style="{
                  backgroundColor:
                    item.result == '阳性' ? '#EC4B40' : '#57ad6c',
                }"
              >
                {{ item.result }}
              </div>
            </div>
          </div>
        </div>
        <img
          class="close"
          :src="IMG.close1"
          alt=""
          mode="widthFix"
          @click="nucleicReportShow = false"
        />
      </div>
    </div>

    <!-- 疫苗接种弹窗 -->
    <div class="trip-card-box" v-if="vaccinationShow">
      <div class="nucleic-report">
        <div class="nucleic-report-title">
          <img class="title-icon" :src="IMG.tit2" alt="" mode="widthFix" />
          <text>疫苗接种记录</text>
        </div>
        <div class="nucleic-report-content">
          <div class="name">{{ cname }}</div>
          <div
            class="box"
            v-for="(item, index) in vaccinationList"
            :key="index"
          >
            <div class="box-title2">
              第{{ vaccinationList.length - index }}针
            </div>
            <div class="content2">
              <div class="line">
                <div class="key">接种疫苗：</div>
                <div class="value">{{ item.vacName }}</div>
              </div>
              <div class="line">
                <div class="key">接种类型：</div>
                <div class="value">{{ item.vaccineProducerName }}</div>
              </div>
              <div class="line">
                <div class="key">接种地点：</div>
                <div class="value">{{ item.vaccinationUnitName }}</div>
              </div>
              <div class="line">
                <div class="key">接种时间：</div>
                <div class="value">
                  {{ item.vaccinationDateTime.substring(0, 10) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          class="close"
          :src="IMG.close1"
          alt=""
          mode="widthFix"
          @click="vaccinationShow = false"
        />
      </div>
    </div>

    <!-- 疫苗提醒弹窗 -->
    <div class="trip-card-box" v-if="vaccineReminder">
      <div class="vaccine-reminder">
        <div class="vaccine-reminder-title">疫苗接种提醒</div>
        <div
          class="vaccine-reminder-content"
          :style="{
            color:
              vaccineReminderTip === 2
                ? '#2076FF'
                : vaccineReminderTip === 3 || vaccineReminderTip === 4
                ? '#51AA68'
                : '#E62922',
          }"
        >
          请及时接种新冠疫苗{{
            vaccineReminderTip === 1
              ? ""
              : vaccineReminderTip === 2
              ? "第二针"
              : vaccineReminderTip === 3
              ? "第三针"
              : vaccineReminderTip === 4
              ? "加强针"
              : ""
          }}
        </div>
        <div class="vaccine-reminder-desc">
          请结合本人实际情况，如已接种请忽略
        </div>
        <div class="vaccine-reminder-btn" @click="vaccineReminder = false">
          我知道了
        </div>
        <img
          class="close"
          :src="IMG.close1"
          alt=""
          mode="widthFix"
          @click="vaccineReminder = false"
        />
      </div>
    </div>

    <!-- 日常健康监测弹窗 -->
    <div class="trip-card-box" v-if="monitoDay">
      <div class="health-monitor">
        <img class="tipImg" :src="IMG.tipImg" mode="widthFix" alt="" />
        <img class="bg" :src="IMG.bg" alt="">
        <div class="health-tip">
          您属于日常健康监测人员，该场所无法进入，还剩余<span>{{
            monitoDay
          }}</span
          >天解除日常健康监测。
        </div>
      </div>
    </div>

    <div class="change-tab" v-if="moIds">
      <img
        v-if="changeTab === 1"
        class="change-tab-img"
        :src="IMG.changeTab1"
        alt=""
        mode="widthFix"
        @click="handleTab(0)"
      />
      <img
        v-if="changeTab === 0"
        class="change-tab-img"
        :src="IMG.changeTab2"
        alt=""
        mode="widthFix"
        @click="handleTab(1)"
      />
    </div>
  </view>
</template>

<script>
import { formatTime, IMG } from "../../utils/index";
// import TripCard from './TripCard.vue'
// import Information from './Information.vue'
import TkiQrcode from "../../components/tki-qrcode.vue";
import IndexContentBoxVue from "./IndexContentBox.vue";
import nucleicReport from "../../components/nucleic-report.vue";
import vaccinationCom from "../../components/vaccination.vue";
import nucleic from "../../components/nucleic.vue";

export default {
  components: {
    // TripCard,
    // Information,
    TkiQrcode,
    IndexContentBoxVue,
    nucleicReport,
    vaccinationCom,
    nucleic,
  },
  data() {
    return {
      IMG: IMG,
      hcode: null, // 健康码code
      tanIndex: null,
      tanText: "请检查",
      curPlace: "", //当前场所
      cname: "未认证", //当前用户
      id_card_type: "IDENTITY_CARD",
      id_card: "未认证", // 身份证号
      phone: "", // 手机号
      displayname: "未认证", // 展示的姓名
      displayIdCard: "未认证", // 展示的身份证
      time: "", //当前时间
      // qyname: "测试场所", //当前场所
      timer: null, //计时器
      vaccine_code: null, // 是否接种 0未查询到（没有纪记录，未接种）1部分接种  2全部接种
      // 用户信息
      msg: {
        name: "",
        cardNo: "",
        health_code_url: "",
        shop_name: "",
      },
      id_card_is_verify: "",
      isDisplayname: false, // 是否显示idcard
      reportInfo: "阴性", //核酸检测结果
      reportTime: "2021-12-18", // 检测时间
      reportDept: "人民医院", // 检测机构
      popFlag: false, //弹窗显示
      health: "未申领",
      // vaccination: "", //疫苗检测结果
      nucleicDate: "", //核酸检测时间
      nucleicAddress: "", //核酸检测地址
      nucleicResult: "未检测", //核酸检测结果
      nucleicState: "", //核酸检测状态
      journeyCode: false, //行程卡状态 ,默认是查不到
      moIds: "", //mo_07myrzxygw213p9 mo_ly903r7wm1v6782
      changeTab: 0, // 主动进为0，扫码为1
      informationVisible: true, //主动打开小程序进入多码合一界面提示“请通过扫码进入系统并展示给管控人员”
      qrcodeText: "", //健康码信息
      qrcodeColor: "", // 健康码颜色

      familyAgentPopShow: false,
      deleteFamilyAgentPopShow: false,
      familyAgentList: [],
      isMyself: true, // 是否是本人，默认true
      editPopShow: false, //点击重新填写弹窗
      role: null, //角色

      box1: {
        title: "我想要",
        children: [
          {
            icon: IMG.icon1,
            title: "返盐申请(安行码)",
            url: "https://wxhd.ph66.com/hydj/",
          },
          {
            icon: IMG.icon2,
            title: "核酸检测地点",
            url: "",
          },
          {
            icon: IMG.icon3,
            title: "疫苗接种",
            url: "",
          },
          {
            icon: IMG.icon4,
            title: "抗疫求助",
            url: "https://changsuoma.haiyan.gov.cn/user/qj2oyprw8rwm076/application/kangyiqiuzhu/index.html",
          },
          {
            icon: IMG.icon5,
            title: "群众举报",
            url: "https://www.hygayyyy.com/weixinLogin",
          },
          {
            icon: IMG.icon6,
            title: "志愿抗疫",
            url: "https://changsuoma.haiyan.gov.cn/user/qj2oyprw8rwm076/application/zhiyuankangyi/index.html",
          },
          {
            icon: IMG.icon7,
            title: "防疫政策",
            url: "https://changsuoma.haiyan.gov.cn/diary/categroy/diary/s/3632/3",
          },
          {
            icon: IMG.icon9,
            title: "微嘉园积分停车",
            url: "",
          },
        ],
      },
      box2: {
        title: "专项应用",
        children: [
          {
            icon: IMG.icon8,
            title: "入户走访",
            url: "https://zoufang.haiyan.gov.cn/ybssmobile/#/login",
          },
          {
            icon: IMG.icon10,
            title: "扫码管控",
            url: "",
          },
          {
            icon: IMG.icon11,
            title: "实名登记",
            url: "https://zoufang.haiyan.gov.cn/dwgl/#/sjlogin",
          },
        ],
      },

      checktime: 0, // 核酸检测时间，0没有数据，1为48小时内，2为48小时外
      vaccinationNum: 0, //疫苗接种针数
      vaccinationTime: "", //疫苗接种时间
      nucleicPopShow: false, // 疫情f重点地区手机核验弹窗
      mphone: "",
      yzm: "", //验证码
      yzmText: "获取验证码",
      result: "", // 同意
      btnDisable: true,
      yzmDisable: false,
      totalTime: 180, // 倒计时总数
      epidemic: 0, // 疫情重点地区数据 设置0为没有查询的状态 1、没有去过中高风险地区  2、去过中高风险地区  3、用户没有行程记录

      indexShow: false,

      nucleicReportShow: false, //核酸报告弹窗
      nucleicReportList: [],
      vaccinationShow: false, //疫苗接种弹窗
      vaccinationList: [],
      clock: null, // 验证码定时器

      vaccineReminder: false, // 疫苗提醒弹窗显示
      vaccinShowOnce: false, // 每天只显示一次， 默认为false
      TimeDays: 1000 * 60 * 60 * 24, //1天的时间戳
      vaccineReminderTip: 0, // 控制疫苗提示语句，该打第几针

      monitoDay: 0, // 剩余监测天数
    };
  },
  computed: {
    // 健康码图片
    qrcodeImg() {
      let qrcodeimg = "";
      const { health, hcode, IMG } = this;
      if (health === "绿码") {
        qrcodeimg = IMG.qrcode[0];
        this.qrcodeColor = "green";
      } else if (health === "黄码") {
        qrcodeimg = IMG.qrcode[1];
        this.qrcodeColor = "#fcc40c";
      } else if (health === "红码") {
        qrcodeimg = IMG.qrcode[2];
        this.qrcodeColor = "#fa2c2d";
      } else if (health === "未申领") {
        qrcodeimg = IMG.noCode;
        this.qrcodeColor = "";
      }
      this.$forceUpdate();
      return qrcodeimg;
    },
    // 健康码文本描述
    qrcodeTitle() {
      let qrcodetitle = "";
      const { vaccine_code, hcode } = this;
      if (vaccine_code !== 0 && hcode) {
        qrcodetitle = "已完成新冠疫苗接种";
      } else if (vaccine_code === 0 && hcode) {
        qrcodetitle = "未查询到接种信息";
      }
      return qrcodetitle;
    },
    tripImg() {
      let tripimg = "";
      if (this.journeyCode == 1) {
        tripimg = IMG.greenTrip;
      } else if (this.journeyCode == 2) {
        tripimg = IMG.greenTrip;
      } else if (
        !this.journeyCode ||
        this.journeyCode == -1 ||
        this.journeyCode == 3
      ) {
        tripimg = IMG.noCode;
      }
      return tripimg;
    },
    tripFlag() {
      let flag = false;
      if (this.phone && this.journeyCode) {
        flag = true;
      }
      return flag;
    },
    // 您于前14天内到达或途径
    tripRouter() {
      let tripText = "详细信息点击下方行程卡";
      // if (this.journeyCode == 1) {
      //   tripText = '详细信息点击下方行程卡'
      // } else if (this.journeyCode == 2) {
      //   tripText = '详细信息点击下方行程卡'
      // } else if (
      //   !this.journeyCode ||
      //   this.journeyCode == -1 ||
      //   this.journeyCode == 3
      // ) {
      //   tripText = '详细信息点击下方行程卡'
      // }
      return tripText;
    },
    // 判断是否年满18
    countAge() {
      if (
        this.id_card.length === 18 &&
        formatTime(new Date(), "YY") - Number(this.id_card.substring(6, 10)) >=
          18
      ) {
        // 年满18
        return true;
      } else {
        return false;
      }
    },
  },
  onShow(options) {
    console.log(options, "index onShow");
    this.timer = setInterval(() => {
      this.time = formatTime(new Date(), "mm月dd日 HH:MM:SS");
    }, 1000);
    // const familyIds = this.$store.state.familyIds;
    // if (familyIds === "0") {
    //   this.isMyself = true;
    //   this.getLoginCode();
    // } else {
    //   console.log("cli show");
    //   this.isMyself = false;
    //   this.familyAgentList = this.$store.state.familyAgentList;
    //   const tempIndex = this.familyAgentList.findIndex(
    //     (ele) => ele.ids === familyIds
    //   );
    //   if (tempIndex !== -1) {
    //     this.cname = this.familyAgentList[tempIndex].name;
    //     this.id_card = this.familyAgentList[tempIndex].id_card;
    //     this.displayname = this.isDisplayname ? this.cname : this.hidename();
    //   }
    //   this.getHcode(this.$store.state.familyIds);
    // }
  },
  onLoad(options) {
    console.log(options, "index onload");
    if (Reflect.has(options, "scene")) {
      // 从扫码而来
      this.moIds = options.scene;
      this.changeTab = 1;
      this.vaccinShowOnce = true;
      this.$store.commit("SET_FAMILY_IDS", "0"); // 若是扫码进入，设置为本人
      this.isMyself = true;
      this.getLoginCode();
    } else if (Reflect.has(options, "name")) {
      // 从新增代领人回来
      this.cname = options.name;
      this.id_card = options.idcard;
      this.displayname = this.isDisplayname ? this.cname : this.hidename();
      this.displayIdCard = this.isDisplayname
        ? this.id_card
        : this.hideIdCard();
      this.isMyself = false;
      this.familyAgentList = this.$store.state.familyAgentList;
      this.familyAgentList[0].show = true;
      this.$store.commit("SET_FAMILY_ANGET_LIST", this.familyAgentList);
      this.getHcode(this.$store.state.familyIds);
    } else {
      this.informationVisible = false;
      this.isMyself = true;
      this.getLoginCode();
    }
  },
  onHide() {
    console.log("index onHide");
  },
  onUnload() {
    console.log("index onUnload");
    clearInterval(this.timer);
  },
  watch: {
    yzm(now, old) {
      if (now != old) {
        this.btnDisable = false;
      } else {
        this.btnDisable = true;
      }
    },
  },
  methods: {
    // 通过wx.login获取code
    getLoginCode() {
      const that = this;
      wx.login({
        success(resp) {
          if (resp.code) {
            //发起网络请求
            console.log(resp, "res");
            that
              .$apiget({
                url: "/manager/user/mini/program/login/v2",
                data: {
                  code: resp.code,
                },
              })
              .then((ress) => {
                if (ress.code === 0) {
                  that.getUserInfo(ress);
                  // 本地进行数据缓存
                  // wx.setStorageSync("userBaseInfoData", JSON.stringify(ress));
                }
              })
              .catch(() => {
                // const userBaseInfoData = wx.getStorageSync("userBaseInfoData");
                // that.getUserInfo(JSON.parse(userBaseInfoData));
              });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    },
    // 处理个人信息
    getUserInfo(ress) {
      const res = ress.memberInfo;
      this.$store.commit("SET_USER_NAME", res.name);
      this.$store.commit("SET_QY_MEMBER_IDS", res.ids);
      this.$store.commit("SET_ID_CARD", res.id_card);
      this.$store.commit("SET_USER_PHONE", res.phone);
      this.$store.commit("SET_USER_ID_CARD_TYPE", res.id_card_type);
      // console.log(res, '获取用户信息')
      this.id_card_is_verify = res.id_card_is_verify;
      // 判断当前是否存在根用户id ？ 存在，// 获取列表、用户信息 ： 不存在，跳转到身份认证，并填报体温
      if (res.id_card_is_verify === "0") {
        console.log("不存在，跳转到身份认证");
        wx.redirectTo({
          url: "/pages/verify/verify",
        });
        wx.hideLoading();
      } else {
        // 是否接种 0未查询到（没有纪记录，未接种） 1部分接种  2全部接种
        this.cname = res.name;
        this.id_card_type = res.id_card_type;
        this.id_card = res.id_card;
        this.ids = res.ids;
        this.phone = res.phone;
        this.displayname = this.isDisplayname ? this.cname : this.hidename();
        this.displayIdCard = this.isDisplayname
          ? this.id_card
          : this.hideIdCard();
        // wx.hideLoading() // todo
        this.familyAgentList = [];
        this.familyAgentList.push({
          name: "我",
          ids: "0",
          show: false,
        });
        const relationList = ress.relationList;
        if (relationList.length) {
          relationList.forEach((e) => {
            this.familyAgentList.push({
              guanxi: e.friend_type,
              id_card: e.Member.id_card,
              ids: e.id_strings,
              mobile: e.Member.mphone,
              name: e.Member.name,
              id_card_type: e.Member.related_members
                ? JSON.parse(e.Member.related_members)[0].id_card_type
                : "IDENTITY_CARD",
              show: true,
            });
          });
        }
        this.$store.commit("SET_FAMILY_ANGET_LIST", this.familyAgentList);
        this.getHcode();
      }
    },

    // 获取健康码信息
    getHcode(memberIds = null) {
      this.health = "未申领";
      const urlArr = [];
      if (this.moIds && this.isMyself) {
        urlArr.push(`ids=${this.moIds}`);
      }
      if (memberIds) {
        urlArr.push(`memberIds=${memberIds}`);
      }
      const url = "/custom/healthcode/gethealthcode?" + urlArr.join("&");
      this.$apiget({
        url: url,
      })
        .then((res) => {
          // console.log(res, '成功之后')
          this.handleHcode(res);
          // 本地进行数据缓存
          // wx.setStorageSync("userHealthInfoData", JSON.stringify(res));
        })
        .catch((e) => {
          console.log(e, "scan");
          // const userHealthInfoData = wx.getStorageSync("userHealthInfoData");
          // that.handleHcode(JSON.parse(userHealthInfoData));
        });
    },
    handleHcode(res) {
      if (this.moIds && this.changeTab === 1) {
        // 弹出剩余监测天数
        this.monitoDay = res.data.health_monitoring;
      }

      if (res.data["member_object_name"]) {
        this.curPlace = res.data.member_object_name;
      } else {
        this.curPlace = "";
      }
      this.indexShow = true;
      //healthcode=>健康码
      //nucleicAcidV2=>核酸检测
      //vaccinationS=>疫苗接种情况
      let { healthcode, nucleicAcidV2, vaccinationS, utrapStatus } = res?.data;
      // console.log(healthcode, 'healthcode')
      // console.log(nucleicAcidV2, "核酸");
      // console.log(vaccinationS, "疫苗");
      if (!utrapStatus) {
        this.popFlag = true;
      } else {
        this.journeyCode = utrapStatus;
      }
      //页面数据赋值
      this.health = Reflect.has(healthcode, "mzt") ? healthcode.mzt : "未申领";

      this.vaccinationNum = vaccinationS.length ? vaccinationS.length : 0; // 疫苗接种针数
      this.vaccinationTime = vaccinationS.length
        ? vaccinationS[0].vaccinationDateTime.substring(0, 10)
        : 0; // 疫苗接种时间
      this.vaccinationList = vaccinationS.length ? vaccinationS : [];

      this.qrcodeText = res.data.qrCode;
      // 核酸信息
      if (nucleicAcidV2.length) {
        this.nucleicDate = nucleicAcidV2[0].report_on_time;
        this.nucleicAddress = nucleicAcidV2[0].institutions;
        this.nucleicResult = nucleicAcidV2[0].result;
        this.nucleicReportList = nucleicAcidV2;
        // 判断核酸检测时间
        const nowTime = new Date().getTime(); //当前时间戳
        const date = new Date(this.nucleicDate.replace(/-/g, "/")).getTime(); //核酸时间的时间戳

        if (date + this.TimeDays >= nowTime) {
          // 核酸检测时间+1天的时间戳>现在的时间，表示核酸检测时间在1天内
          this.checktime = 1; // 一天内
        } else if (date + 2 * this.TimeDays >= nowTime) {
          this.checktime = 2; // 2天内
        } else if (date + 3 * this.TimeDays >= nowTime) {
          this.checktime = 3; // 3天内
        } else if (date + 4 * this.TimeDays >= nowTime) {
          this.checktime = 4; // 4天内
        } else {
          this.checktime = 5; // 4天外
        }
      } else {
        this.nucleicDate = "未检测";
        this.nucleicAddress = "暂无记录";
        this.nucleicResult = "未检测";
        this.nucleicReportList = [];
        this.checktime = 0;
      }

      this.epidemic = res.data.utrapStatus ? res.data.utrapStatus : 0;

      if (this.nucleicResult == "阳性") {
        this.nucleicState = true;
      }

      /**
       * 1、扫场所码进的小程序
       * 2、疫苗接种不等于三针
       * 3、本地存储没有上次显示时间 || 本地存储有上次显示时间，但显示时间不是本天
       * */
      if (this.vaccinationNum != 3 && this.vaccinShowOnce) {
        const vaccineReminderTime = wx.getStorageSync("vaccineReminderTime");
        const nowDate = new Date(formatTime(new Date(), "YY/mm/dd")).getTime(); // 当天的时间戳
        if (
          !vaccineReminderTime ||
          vaccineReminderTime + this.TimeDays < nowDate
        ) {
          this.OpenVaccineReminder();
        }
      }
    },
    OpenVaccineReminder() {
      if (this.vaccinationList.length) {
        const num = this.vaccinationList.length; // 打了几针
        const vacctime = new Date(
          this.vaccinationList[0].vaccinationDateTime.replace(/-/g, "/")
        ).getTime(); // 最后一针得时间戳
        const nowDate = new Date().getTime(); // 当前时间得时间戳
        console.log(num, vacctime, nowDate);
        switch (this.vaccinationList[0].vaccineProducerName) {
          case "康希诺生物":
            // 打针总数2针；未满18不能打第二针；一针与二针时间间隔：6足月。
            if (
              num == 1 &&
              this.countAge &&
              vacctime + this.TimeDays * 30 * 6 < nowDate
            ) {
              console.log("请及时接种新冠疫苗加强针1");
              this.vaccineReminderTip = 4;
            }
            break;
          case "安徽智飞":
            this.computeVaccine(num, vacctime, nowDate);
            break;
          case "北京智飞绿竹":
            this.computeVaccine(num, vacctime, nowDate);
            break;
          default:
            if (num == 1 && vacctime + this.TimeDays * 21 < nowDate) {
              console.log("请及时接种新冠疫苗第二针2");
              this.vaccineReminderTip = 2;
            } else if (
              num == 2 &&
              vacctime + this.TimeDays * 30 * 6 < nowDate &&
              this.countAge
            ) {
              console.log("请及时接种新冠疫苗加强针3");
              this.vaccineReminderTip = 4;
            }
            break;
        }
        this.vaccineReminder = true;
      } else {
        console.log("请及时接种新冠疫苗");
        this.vaccineReminderTip = 1;
        this.vaccineReminder = true;
      }
      this.vaccinShowOnce = false;
      wx.setStorageSync(
        "vaccineReminderTime",
        new Date(formatTime(new Date(), "YY/mm/dd")).getTime()
      );
    },
    computeVaccine(num, vacctime, nowDate) {
      if (num == 1 && vacctime + this.TimeDays * 28 < nowDate) {
        console.log("请及时接种新冠疫苗第二针5");
        this.vaccineReminderTip = 2;
      } else if (num == 2 && vacctime + this.TimeDays * 28 < nowDate) {
        console.log("请及时接种新冠疫苗第三针6");
        this.vaccineReminderTip = 3;
      }
    },
    // 点击动态行程卡
    getTripInfo() {
      if (!this.tripFlag) {
        this.popFlag = true;
      }
    },
    // 修改journeyCode
    changeJourneyCode(data) {
      this.popFlag = false;
      this.journeyCode = data;
    },
    // 关闭弹窗
    closePop() {
      this.popFlag = false;
    },
    // 跳转行程码
    toOffcialTripCode() {
      wx.navigateToMiniProgram({
        appId: "wx8f446acf8c4a85f5",
      });
    },

    // 重新填写弹窗
    editShowPop() {
      this.editPopShow = true;
    },
    // 关闭重新填写弹窗
    cancelEdit() {
      this.editPopShow = false;
    },
    // 跳转修改用户信息
    editInfo() {
      const data = {};
      if (!this.isMyself) {
        const ids = this.$store.state.familyIds;
        Object.assign(data, { ids: ids });
      }
      this.$apiget({
        url: "/custom/dai/update/status",
        data,
      })
        .then((res) => {
          this.editPopShow = false;
          if (res.code == 200) {
            // if (this.isMyself) {
            //   uni.navigateTo({
            //     url:
            //       "/pages/verify/verify?name=" +
            //       this.cname +
            //       "&idcard=" +
            //       this.id_card +
            //       "&phone=" +
            //       this.phone +
            //       "&cardIdType=" +
            //       this.id_card_type,
            //   });
            // } else {
            //   wx.navigateTo({
            //     url: "/pages/apply/relation",
            //   });
            // }
            wx.navigateTo({
              url: "/pages/apply/relation?edit=true",
            });
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
            });
          }
        })
        .catch(() => {});
    },
    // 申请场所码
    toApply() {
      const that = this;
      wx.showLoading({
        title: "加载中",
        icon: "none",
        mask: true,
      });
      if (that.id_card_is_verify === "0") {
        console.log("不存在，跳转到身份认证");
        wx.hideLoading();
        wx.navigateTo({
          url: "/pages/verify/verify",
        });
      } else {
        that.$apiget({ url: "/custom/static/my/location/code" }).then((res) => {
          console.log(res, "申请场所码");
          wx.hideLoading();
          if (res.code == 1) {
            wx.navigateTo({
              url: "/pages/apply/apply",
            });
          } else if (res.code == 0) {
            wx.navigateTo({
              url: "/pages/venueCode/venueCode",
            });
          }
        });
      }
    },
    // 切换显示姓名
    triggerName() {
      this.isDisplayname = !this.isDisplayname;
      this.displayname = this.isDisplayname ? this.cname : this.hidename();
      this.displayIdCard = this.isDisplayname
        ? this.id_card
        : this.hideIdCard();
    },
    // 姓名脱敏
    hidename() {
      let name = this.cname;
      const n1 = name.slice(0, 1);
      const n2 = name.slice(2, name.length);
      return n1 + "*" + n2;
    },
    hideIdCard() {
      return "*****************";
    },
    //关闭主动打开小程序进入多码合一界面提示“请通过扫码进入系统并展示给管控人员”的提示框
    toClose() {
      this.informationVisible = true;
    },
    // 打开家人代办
    toFamilyAgent() {
      console.log("打开家人代办");
      wx.navigateTo({ url: "/pages/apply/relation?" });
    },
    // 删除申领人
    deleteFamilyAgent() {
      console.log("删除申领人");
      this.deleteFamilyAgentPopShow = true;
    },
    // 确认删除
    confirmDelete() {
      console.log("确认删除");
      const ids = this.$store.state.familyIds;
      this.$apipost({
        url: "/custom/acting/del/friend/list",
        data: {
          ids,
        },
      }).then((res) => {
        wx.showToast({
          title: "删除成功",
          icon: "success",
          duration: 1500,
        });
        this.isMyself = true;
        this.deleteFamilyAgentPopShow = false;
        this.$store.commit("SET_FAMILY_IDS", "0");
        this.getLoginCode();
      });
    },
    // 取消删除
    cancelDelete() {
      this.deleteFamilyAgentPopShow = false;
    },
    // 切换申领人
    switchPerson() {
      console.log("切换申领人");
      this.familyAgentPopShow = true;
    },
    // 关闭代办弹窗
    closePop() {
      this.familyAgentPopShow = false;
    },
    // 选中申领人
    toApplyAgent(data) {
      console.log(data, "选中申领人");
      this.$store.commit("SET_FAMILY_IDS", data.ids);
      this.familyAgentPopShow = false;
      if (data.ids === "0") {
        this.isMyself = true;
        const familyAgentList = this.$store.state.familyAgentList;
        familyAgentList.forEach((ele) => {
          ele.show = true;
        });
        familyAgentList[0].show = false;
        this.$store.commit("SET_FAMILY_ANGET_LIST", familyAgentList);
        this.getLoginCode();
      } else {
        this.isMyself = false;
        this.cname = data.name;
        this.id_card = data.id_card;
        this.displayname = this.isDisplayname ? this.cname : this.hidename();
        this.displayIdCard = this.isDisplayname
          ? this.id_card
          : this.hideIdCard();
        const familyAgentList = this.$store.state.familyAgentList;
        familyAgentList.forEach((ele) => {
          ele.show = true;
        });
        const tempIndex = familyAgentList.findIndex(
          (ele) => ele.ids === data.ids
        );
        if (tempIndex !== -1) {
          familyAgentList[tempIndex].show = false;
        }
        this.$store.commit("SET_FAMILY_ANGET_LIST", familyAgentList);
        console.log(
          this.$store.state.familyAgentList,
          "this.$store.state.familyAgentList"
        );
        this.getHcode(data.ids);
      }
    },

    // 打开疫情重点地区手机核验弹窗
    openNucleicPopShow() {
      const familyIds = this.$store.state.familyIds;
      if (familyIds != 0) {
        const familyAgentList = this.$store.state.familyAgentList;
        const tempIndex = familyAgentList.findIndex(
          (ele) => ele.ids === familyIds
        );
        if (tempIndex !== -1) {
          this.mphone = familyAgentList[tempIndex].mobile;
        }
      } else {
        this.mphone = this.$store.state.userPhone;
      }
      console.log(this.mphone);

      this.nucleicPopShow = true;
    },
    changeCheckbox(e) {
      this.result = e.target.value;
    },
    //疫情重点地区手机核验弹窗 获取验证码
    getYZM() {
      if (this.yzmDisable) return; // 禁用时不再请求
      this.yzmText = "正在获取";
      this.$apiget({
        url: "/custom/verfycation/getverfycation",
        data: {
          phone: this.mphone,
        },
      })
        .then((res) => {
          console.log(res, "验证码获取结果");
          if (res.code != 0) {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
            });
            this.yzmDisable = false;
          } else {
            this.yzmDisable = true;
            this.yzmText = this.totalTime + "s";
            this.clock = setInterval(() => {
              this.totalTime--;
              this.yzmText = this.totalTime + "s";
              // 如果倒计时为0的话 ，恢复获取验证码按钮
              if (this.totalTime < 0) {
                clearInterval(this.clock);
                this.yzmText = "重新获取";
                this.totalTime = 180;
                this.yzmDisable = false; //这里重新开启
              }
            }, 1000);
          }
        })
        .catch(() => {
          wx.showToast({
            title: "数据请求出错",
            icon: "error",
            duration: 1500,
          });
          this.yzmText = "重新获取";
          this.yzmDisable = false;
        });
    },
    // 疫情重点地区手机核验弹窗 查询
    queryEpidemic() {
      if (!this.result) {
        wx.showToast({
          title: "请勾选同意选项",
          icon: "none",
          duration: 1500,
        });
      } else {
        this.$apiget({
          url: "/custom/utripstatus/getutripstatus",
          data: {
            verification: this.yzm,
          },
        })
          .then((res) => {
            console.log(res, "cli");
            if (res.code == 0) {
              this.nucleicPopShow = false;
              this.epidemic = res.data;
            } else {
              clearInterval(this.clock);
              wx.showToast({
                title: res.msg,
                icon: "error",
                duration: 1500,
              });
            }
          })
          .catch(() => {
            wx.showToast({
              title: "数据请求出错",
              icon: "error",
              duration: 1500,
            });
          });
      }
    },
    // 关闭疫情弹窗
    closequeryEpidemic() {
      this.nucleicPopShow = false;
      if (this.totalTime !== 180) {
        clearInterval(this.clock);
      }
    },

    // 跳转到个人码
    goQRcode() {
      uni.navigateTo({
        url: "/pages/index/QRcode",
      });
    },

    // 切换主动进和扫码进
    handleTab(i) {
      this.changeTab = i;
      if (i === 1 && !this.isMyself) {
        //切换到扫码页
        this.$store.commit("SET_FAMILY_IDS", "0"); // 扫码进入，设置为本人
        this.isMyself = true;
        this.getLoginCode();
      }
    },
    //打开核酸记录弹窗
    openNucleicReport() {
      if (this.nucleicReportList.length) {
        this.nucleicReportShow = true;
      }
    },
    openVaccination() {
      if (this.vaccinationList.length) {
        this.vaccinationShow = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
[v-cloak] {
  display: none;
}

.main-index {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background: rgb(224, 238, 255);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 58rpx;
  position: relative;

  .top-title {
    width: 100vw;
    height: 169rpx;
    display: flex;
    background-image: linear-gradient(to bottom, #2761d4, #3381f6);
    position: relative;
    box-sizing: border-box;
    &-flex {
      display: flex;
      flex-direction: column;
    }
    &-box {
      position: absolute;
      top: 24rpx;
      left: 30rpx;
      right: 30rpx;
      height: 169rpx;
      width: 691rpx;
      z-index: 1;
      padding: 20rpx;
      box-sizing: border-box;
      &-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 169rpx;
        width: 691rpx;
        z-index: -1;
      }
      &-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // margin-bottom: 10rpx;
        position: relative;
        width: 100%;
        &-logo {
          width: 48rpx;
          height: 48rpx;
          margin-right: 20rpx;
        }
        > .title {
          font-size: 34rpx;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #ffffff;
          line-height: 34rpx;
          margin-right: 30rpx;
        }
        .idcard-eye {
          width: 37rpx;
          height: 40rpx;
        }
      }
      &-name {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // margin-bottom: 10rpx;
        // position: relative;
        width: 100%;
        &-title {
          font-size: 24rpx;
          font-weight: 500;
          color: #ffffff;
        }
        &-value {
          // flex: 1;
          font-size: 34rpx;
          font-weight: bold;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 20rpx;
        }
        &-type {
          height: 39rpx;
          line-height: 39rpx;
          text-align: center;
          background: rgba(1, 35, 73, 0.26);
          border-radius: 19rpx;
          font-size: 22rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #fffffd;
          padding: 0 25rpx;
          box-sizing: border-box;
        }
        > .switch-person {
          position: absolute;
          top: 0;
          right: 0;
          border-bottom-left-radius: 20rpx;
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #fffffd;
          padding: 12rpx 23rpx;
          box-sizing: border-box;
          background-color: #4d7bce;
          display: flex;
          align-items: center;
          .change {
            width: 27rpx;
            height: 25rpx;
            margin-left: 6rpx;
          }
        }
      }
    }
  }

  .iWant {
    margin-top: 36rpx;
  }

  .code {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 65rpx;
    width: 691rpx;
    // height: 628rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    padding: 25rpx 0;
    box-sizing: border-box;
    position: relative;
    .watermarker {
      position: absolute;
      right: -30rpx;
      top: 80rpx;
      width: 200rpx;
      height: 200rpx;
      object-fit: contain;
    }
    &-time {
      font-size: 56rpx;
      font-weight: bold;
      color: #333333;
      margin: 15rpx 0;
    }
    &-gcode-title {
      font-size: 36rpx;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      margin-bottom: 24rpx;
    }
    .qrcode-img {
      width: 280rpx;
      height: 280rpx;
      object-fit: contain;
      margin-bottom: 16rpx;
    }
    .qrcode-info {
      font-size: 32rpx;
      text-align: center;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #72b585;
      margin-top: 30rpx;
      .btn {
        color: #e1af8e;
        display: flex;
        .yimiao {
          width: 40rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  .apply {
    position: absolute;
    top: 655rpx;
    right: 0;
    &-icon {
      width: 150rpx;
      object-fit: contain;
    }
  }
  .trip-report {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 30rpx;
    box-sizing: border-box;
    margin-top: 30rpx;
    .redb {
      background: #ec4343 !important;
    }
    .greenb {
      background: #4caa63 !important;
    }
    .grayb {
      background: #bbbbbb !important;
    }
    .green {
      color: #4caa63;
    }
    .gray {
      color: #bbbbbb;
    }
    .button {
      font-size: 24rpx;
      color: #1f75ff;
      padding: 8rpx 12rpx;
      border: 1px solid #1f75ff;
      border-radius: 8rpx;
      font-weight: bold;
    }
    &-item {
      // display: flex;
      // flex-direction: column;
      // // justify-content: center;
      // align-items: center;
      width: 48%;
      background: #ffffff;
      height: 208rpx;
      border-radius: 20rpx;
      // // padding: 0 25rpx;
      // box-sizing: border-box;

      &-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
        text-align: center;
        padding: 15rpx 0;
      }
      &-icon {
        width: 120rpx;
        height: 140rpx;
        opacity: 1;
        margin-bottom: 40rpx;
      }
    }
    .trip {
      width: 336rpx;
      &-info {
        width: 100%;
        &-title {
          font-size: 24rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #666666;
          margin-bottom: 10rpx;
          width: 100%;
        }
        &-value {
          width: 100%;
          font-size: 26rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #000000;

          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3; /* 这里是超出几行省略 */
          overflow: hidden;
        }
      }
    }
    .lineYQ {
      display: flex;
      padding: 18rpx 36rpx;
      align-items: center;
      justify-content: center;
    }
    .report {
      width: 100%;
      &-icon {
        width: 120rpx;
        height: 120rpx;
        background: #51aa68;
        opacity: 1;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFang-SC-Heavy, PingFang-SC;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 32rpx;
      }

      &-nojourney {
        width: 90rpx;
        object-fit: contain;
      }

      &-info {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin-bottom: 12rpx;
        &-title {
          font-size: 24rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #666666;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          width: 60%;
          text-align: center;
        }
        &-value {
          font-size: 24rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &-base {
          width: 72%;
          font-size: 24rpx;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #666666;
          text-align: center;
          line-height: 38rpx;
        }
      }
      .base {
        font-size: 26rpx;
        width: 100%;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #000000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
  }
  .addtion {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    margin-top: 30rpx;
    &-cell {
      background: #ffffff;
      border-radius: 16rpx;
      width: 100%;
      height: 100rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 28rpx;
      box-sizing: border-box;
      position: relative;
      &-icon {
        width: 46rpx;
        height: 46rpx;
        object-fit: contain;
        margin-right: 30rpx;
      }
      &-title {
        font-size: 34rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 41rpx;
      }
      &-btn {
        position: absolute;
        right: 20rpx;
        top: 26rpx;
        width: 126rpx;
        height: 48rpx;
        background: #1f75ff;
        border-radius: 8rpx;
        text-align: center;
        line-height: 48rpx;
        font-size: 24rpx;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  .footer {
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #666666;
    margin-top: 53rpx;
  }

  .trip-card-box {
    position: fixed;
    top: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.7);
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow-y: scroll;
  }
  .family-agent-list {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    max-height: 70vh;
    overflow-y: scroll;
    background: #ffffff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    box-sizing: border-box;
    &-item {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      box-sizing: border-box;
      text-align: center;
      padding: 0 50rpx;
      border-bottom: 1px solid #e9e9e9;
    }
    &-close {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      box-sizing: border-box;
      text-align: center;
      padding: 0 50rpx;
    }
    // :last-child {
    //   border-bottom: none;
    // }
  }
  .delete-agent-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 54rpx 0 0;
    border-radius: 20rpx;
    background-color: #ffffff;
    overflow: hidden;
    width: 80%;
    position: relative;
    &-title {
      font-size: 36rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #000000;
      margin-bottom: 30rpx;
    }
    &-desc {
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #171717;
      padding: 0 54rpx;
      margin-bottom: 44rpx;
    }
    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      border-top: 1px solid #e9e9e9;
      &-item {
        width: 50%;
        color: #0269cb;
        text-align: center;
        font-size: 36rpx;
        font-family: PingFang SC;
        font-weight: bold;
        border-right: 1px solid #e9e9e9;
        padding: 30rpx;
        box-sizing: border-box;
      }
    }
  }
  .my-message {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    margin-top: 20rpx;
    &-box {
      background: #ffffff;
      border-radius: 16rpx;
      padding: 18rpx 20rpx;
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        .tit {
          font-size: 32rpx;
          font-weight: 500;
        }
        .button {
          font-size: 26rpx;
          display: flex;
          align-items: baseline;
          color: #1d77fe;
          background-color: #e8f1ff;
          border-radius: 30rpx;
          border: 1px solid #1d77fe;
          padding: 6rpx 16rpx;
          .right {
            width: 10rpx;
            margin-left: 10rpx;
          }
        }
      }
      &-content {
        display: flex;
        justify-content: space-between;
        margin: 12rpx 0;
        > .left {
          position: relative;
          width: 28%;
          background-color: #f3f3f3;
          border-radius: 10rpx;
          padding: 12rpx;
          height: 280rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          // justify-content: center;
          .codes {
            width: 140rpx;
            height: 140rpx;
            margin-top: 18%;
            margin-bottom: 16%;
          }
          .data {
            color: #666666;
            font-size: 24rpx;
          }
          .line {
            font-size: 26rpx;
          }
        }
        .center,
        .right {
          width: 31%;
        }
      }
      .qrcode-bottom {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 20rpx;
        height: 60rpx;
        .edit-box {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          &-title {
            text-align: center;
            color: #0c78cf;
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: bold;
          }
        }
      }
    }
  }
  .epidemic-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 54rpx;
    border-radius: 20rpx;
    background-color: #ffffff;
    overflow: hidden;
    width: 86%;
    .close {
      position: absolute;
      width: 60rpx;
      bottom: 13%;
      z-index: 1024;
    }
    &-title {
      color: #333333;
      font-size: 34rpx;
      font-weight: 500;
    }
    &-content {
      width: 100%;
      margin-top: 40rpx;

      &-phone {
        border: 1px solid #eeeeee;
        padding: 15rpx 24rpx;
        vertical-align: middle;
        margin-bottom: 35rpx;
      }
      .yzm {
        display: flex;
        align-items: center;
        border: 1px solid #eeeeee;
        margin-bottom: 35rpx;
      }
      &-yzm {
        width: 52%;
        padding: 15rpx 24rpx;
      }

      .mini-btn {
        background-color: #1f75ff;
        color: #fff;
      }
      .yzmDisable {
        background-color: #5d8dd9;
      }
      .flex {
        color: #999;
        font-size: 26rpx;
        line-height: 50rpx;
        margin-bottom: 35rpx;
      }
      .tips {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30rpx;
        font-size: 24rpx;
        color: #666666;
        .no {
          width: 30rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  .nucleic-report {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: #ffffff;
    width: 90%;
    position: relative;
    .close {
      position: absolute;
      width: 60rpx;
      bottom: -100rpx;
      z-index: 1024;
    }
    &-title {
      display: flex;
      align-items: center;
      position: absolute;
      top: -40rpx;
      background-image: linear-gradient(to bottom, #1d79fb, #7ca8ff);
      color: #fff;
      padding: 20rpx 30rpx;
      border-radius: 50rpx;
      font-size: 34rpx;
      z-index: 100;
      .title-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
      }
    }
    &-content {
      width: 100%;
      font-size: 30rpx;
      .name {
        color: #000;
        background-image: linear-gradient(to bottom, #b8d0ff, #ffffff);
        padding: 54rpx 54rpx 30rpx;
        border-radius: 20rpx;
      }
      .box {
        background-color: #e2f0ff;
        border-radius: 20rpx;
        margin: 0 30rpx 30rpx;
        padding: 10rpx 24rpx;
        &-title {
          display: flex;
          border-bottom: 1px solid #cccccc;
          padding: 20rpx 0;
        }
        // &-title2 {
        //   padding-top: 8rpx;
        // }
        .content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .key {
            color: #000000;
          }
          .value {
            color: #999999;
          }
          .left {
            .result,
            .unit {
              display: flex;
              margin: 20rpx 0;
            }
          }
          .right {
            width: 110rpx;
            height: 110rpx;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            // background-color: #57ad6c;
            color: #fff;
            font-size: 34rpx;
          }
        }
        .content2 {
          width: 100%;
          .line {
            display: flex;
            align-content: center;
            justify-content: space-between;
            margin: 10rpx 0;
          }
          .key {
            color: #999999;
          }
          .value {
            color: #000000;
            width: 70%;
            text-align: right;
          }
        }
      }
    }
  }
  .change-tab {
    position: fixed;
    right: 0;
    top: 40%;
    &-img {
      width: 170rpx;
      height: 170rpx;
    }
  }
  .scan-code {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: #ffffff;
    width: 80%;
    padding: 40rpx;
    position: relative;
    .close {
      position: absolute;
      width: 60rpx;
      bottom: -100rpx;
      z-index: 1024;
    }
    .qrcode-img {
      width: 250rpx;
      height: 250rpx;
      object-fit: contain;
      margin-bottom: 16rpx;
      margin: 30rpx 0;
    }
    .code-time {
      font-size: 50rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 10rpx;
    }
    .name {
      font-size: 40rpx;
      font-weight: 500;
    }
    .healthcode {
      margin: 20rpx 0;
    }
    .healthData {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .left,
      .right {
        width: 45%;
      }
    }
    .scanBtn {
      background-color: #3381f6;
      color: #fff;
      font-size: 30rpx;
      padding: 15rpx;
      width: 40%;
      text-align: center;
      border-radius: 40rpx;
      margin-top: 40rpx;
    }
  }
  .vaccine-reminder {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: #ffffff;
    width: 80%;
    padding: 40rpx;
    position: relative;
    &-content {
      margin: 42rpx 0;
      font-weight: bold;
    }
    &-desc {
      font-size: 24rpx;
      color: #666;
    }
    &-btn {
      margin-top: 32rpx;
      background-color: #1d79fb;
      color: #fff;
      width: 85%;
      text-align: center;
      padding: 18rpx;
      border-radius: 20rpx;
    }
    .close {
      position: absolute;
      width: 50rpx;
      bottom: -90rpx;
      z-index: 1024;
    }
  }
  .bottom-text {
    margin-top: 40rpx;
  }
  .health-monitor {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: #ffffff;
    width: 80%;
    position: relative;
    .tipImg {
      width: 260rpx;
      position: absolute;
      top: -50rpx;
    }
    .bg{
      background: #000;
      width: 100%;
      height: 220rpx;
      border-radius: 20rpx 20rpx 0 0;
      box-sizing: border-box;
    }
    .health-tip {
      line-height: 60rpx;
       padding: 40rpx 60rpx 80rpx;
       margin-top: 40rpx;
      span {
        color: #ec4343;
        font-size: 46rpx;
        padding: 0 10rpx;
      }
    }
  }
}
</style>
